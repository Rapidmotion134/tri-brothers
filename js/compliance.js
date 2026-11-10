/* Tri Brothers | compliance document explorer */
(function () {
  "use strict";
  var side = document.getElementById("docCats"); if (!side) return;
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var ICONS = {
    company: '<path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    driver: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.2"/><path d="M5 16c.6-1.3 1.7-2 3-2s2.4.7 3 2"/><path d="M14 10h4M14 14h4"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    permit: '<path d="M14.1 4.4a2 2 0 0 0-1.8 0L8.7 6.2a2 2 0 0 1-1.8 0L3.4 4.4A1 1 0 0 0 2 5.3v12.8a1 1 0 0 0 .6.9l4.3 2.2a2 2 0 0 0 1.8 0l3.6-1.8a2 2 0 0 1 1.8 0l4.3 2.2a1 1 0 0 0 1.4-.9V7.9a1 1 0 0 0-.6-.9z"/><path d="M15 5v16M9 3v16"/>'
  };
  var CATS = [
    { id: "company", name: "Company documentation", short: "Company", slug: "company-formation",
      desc: "Company records organized for operational and regulatory needs, and kept up to date for when you need them.",
      items: ["Company Policies and Procedures", "Driver Application", "Lease Agreement", "Insurance", "UCR Registration", "IFTA Quarterly Filing", "EIN Letter", "MCS-150", "LLC Incorporation", "BOC-3", "DOT Compliant Drug and Alcohol Program", "IFTA Certificate"] },
    { id: "driver", name: "Driver compliance documentation", short: "Driver", slug: "safety-fmcsa",
      desc: "Driver files that support qualification, eligibility and operational readiness, properly maintained for smooth fleet operations.",
      items: ["DOT Medical Certificate", "Driver Application for Employment", "Clearinghouse Record", "Pre-Employment Drug Test", "Annual Limited Clearinghouse Query", "Road Test Certificate", "Form 1099", "DOT Medical Examination Report", "Lease Agreement", "Driver Policies and Procedures"] },
    { id: "truck", name: "Truck compliance documentation", short: "Truck", slug: "vehicle-cab-card",
      desc: "Vehicle records for every truck and trailer in your fleet, properly tracked, stored and aligned with operational standards.",
      items: ["Trailer Registration", "Vehicle Maintenance Records", "Truck Annual DOT Inspection", "Trailer Annual Inspection", "IFTA License and Decals", "Form 2290", "Vehicle Registration", "Trailer Annual DOT Inspection"] },
    { id: "permit", name: "Permit compliance", short: "Permit", slug: "tax-ifta-irp",
      desc: "Required permits and related documentation managed to reduce delays and keep your operations active and compliant.",
      items: ["New Mexico Weight Distance Permit", "Kentucky Permit", "New York HUT Permit", "Connecticut Highway Use Permit", "Oregon Weight-Mile Tax Permit"] }
  ];
  var KEY = "tb_fn_checklist";
  var fnOK = function () { return window.TB && TB.consent && TB.consent.functional(); };
  var sel = (fnOK() && TB.store.get(KEY)) || {};
  var cur = 0, q = "";
  var items = document.getElementById("docItems"), nameEl = document.getElementById("docName"), descEl = document.getElementById("docDesc");
  var search = document.getElementById("docSearch"), empty = document.getElementById("docEmpty"), selEl = document.getElementById("docSel"), bar = document.getElementById("docBar");
  var reqBtn = document.getElementById("docRequest"), note = document.getElementById("docSaveNote");

  var catBtns = CATS.map(function (c, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "docx-cat"; b.setAttribute("role", "tab"); b.id = "doccat-" + c.id;
    b.innerHTML = '<span class="dc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[c.id] + '</svg></span><span><strong>' + c.short + '</strong><small>' + c.items.length + ' documents</small></span><span class="dc-count" data-c="' + c.id + '">0</span>';
    b.addEventListener("click", function () { select(i); });
    b.addEventListener("keydown", function (e) {
      var n = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (n) { e.preventDefault(); var j = (i + n + CATS.length) % CATS.length; select(j); catBtns[j].focus(); }
    });
    side.appendChild(b); return b;
  });
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hl(s) {
    if (!q) return esc(s);
    var i = s.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? esc(s) : esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length));
  }
  function count(cid) { return Object.keys(sel).filter(function (k) { return sel[k] && k.indexOf(cid + "|") === 0; }).length; }
  function updateMeta() {
    var c = CATS[cur], n = count(c.id);
    selEl.textContent = n;
    bar.style.width = (n / c.items.length * 100) + "%";
    CATS.forEach(function (x) { var el = side.querySelector('[data-c="' + x.id + '"]'); el.textContent = count(x.id); });
    var all = Object.keys(sel).filter(function (k) { return sel[k]; }).map(function (k) { return k.split("|")[1]; });
    reqBtn.href = "order.html?s=" + c.slug + (all.length ? "&docs=" + encodeURIComponent(all.join("; ")) : "");
    if (fnOK()) TB.store.set(KEY, sel);
    note.textContent = fnOK() ? "Your selection is saved on this device." : "Your selection is kept while you browse this page.";
  }
  function render(animate) {
    var c = CATS[cur];
    nameEl.textContent = c.name; descEl.textContent = c.desc;
    var list = c.items.filter(function (it) { return !q || it.toLowerCase().indexOf(q.toLowerCase()) > -1; });
    items.innerHTML = "";
    list.forEach(function (it, i) {
      var k = c.id + "|" + it, on = !!sel[k];
      var b = document.createElement("button");
      b.type = "button"; b.className = "doc-item" + (on ? " is-checked" : ""); b.setAttribute("aria-pressed", on ? "true" : "false");
      if (animate) b.style.animationDelay = (i * 0.03) + "s"; else b.style.animation = "none";
      b.innerHTML = '<span class="cb2">' + CHECK + '</span><span>' + hl(it) + '</span>';
      b.addEventListener("click", function () {
        sel[k] = !sel[k]; if (!sel[k]) delete sel[k];
        b.classList.toggle("is-checked", !!sel[k]); b.setAttribute("aria-pressed", sel[k] ? "true" : "false");
        updateMeta();
      });
      items.appendChild(b);
    });
    empty.classList.toggle("is-on", list.length === 0);
    updateMeta();
  }
  function select(i) {
    cur = i;
    catBtns.forEach(function (b, k) { b.classList.toggle("is-active", k === i); b.setAttribute("aria-selected", k === i ? "true" : "false"); b.tabIndex = k === i ? 0 : -1; });
    document.getElementById("docPanel").setAttribute("aria-labelledby", catBtns[i].id);
    render(true);
    if (side.scrollWidth > side.clientWidth) side.scrollTo({ left: catBtns[i].offsetLeft - 16, behavior: TB.reduced ? "auto" : "smooth" });
  }
  search.addEventListener("input", function () {
    q = search.value.trim();
    // jump to the first category with a match if the current one has none
    if (q && !CATS[cur].items.some(function (it) { return it.toLowerCase().indexOf(q.toLowerCase()) > -1; })) {
      for (var i = 0; i < CATS.length; i++) if (CATS[i].items.some(function (it) { return it.toLowerCase().indexOf(q.toLowerCase()) > -1; })) { select(i); return; }
    }
    render(false);
  });
  document.getElementById("docClear").addEventListener("click", function () { sel = {}; render(false); });
  document.addEventListener("tb:consent", function () { updateMeta(); });
  select(0);
})();
