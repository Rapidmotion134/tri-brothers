/* Tri Brothers | multi-step service order form */
(function () {
  "use strict";
  var form = document.getElementById("orderForm"); if (!form) return;
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var I = {
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    idcard: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.2"/><path d="M5 16c.6-1.3 1.7-2 3-2s2.4.7 3 2M14 10h4M14 14h4"/>',
    badge: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
    car: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6M7 16h4"/><circle cx="16.5" cy="15.5" r="2"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-2 1 2 2 0 0 1-2-2z"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    flask: '<path d="M9 2v6.5L4.2 17.4A3 3 0 0 0 6.8 22h10.4a3 3 0 0 0 2.6-4.6L15 8.5V2"/><path d="M8 2h8M6.5 15h11"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5V12l-5.5 5M12 12l5.5 5"/>'
  };
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var GROUPS = [
    { name: "Compliance", items: [
      ["compliance-management", "Ongoing compliance management", "Monitoring, documents and records", "shield"],
      ["tax-ifta-irp", "Tax, Permits and IFTA / IRP", "Filings, decals, state permits", "receipt"],
      ["motus-authority", "Motus and Operating Authority", "Authority setup and upkeep", "route"],
      ["company-formation", "Company Formation and Administration", "LLC, EIN, BOC-3, policies", "building"],
      ["insurance", "Insurance Services", "Insurance documentation", "shield"],
      ["citations", "Citations and Violations", "Handled and documented", "alert"],
      ["dot-mc", "DOT, MC and Registration Setup", "USDOT, MC, MCS-150, UCR", "idcard"],
      ["safety-fmcsa", "Safety and FMCSA Issues", "Driver files, Clearinghouse", "badge"],
      ["vehicle-cab-card", "Vehicle and Cab Card Services", "Registration, inspections", "car"],
      ["platform-accounts", "Amazon and Platform Accounts", "Platform account setup", "store"] ] },
    { name: "Dispatch", items: [["dispatch", "Dispatch service", "Load booking to payment follow-up", "truck"]] },
    { name: "Accounting", items: [["accounting", "Accounting service", "Records, expenses, invoices, reports", "calc"]] },
    { name: "Drug testing", items: [
      ["drug-testing", "Drug testing support", "Program setup and records", "flask"],
      ["consortium", "Consortium enrollment", "Approved consortium programs", "network"] ] }
  ];
  var NAME = {}; GROUPS.forEach(function (g) { g.items.forEach(function (it) { NAME[it[0]] = it[1]; }); });
  var box = document.getElementById("svcGroups");
  GROUPS.forEach(function (g, gi) {
    var wrap = document.createElement("div"); wrap.className = "svc-group";
    wrap.innerHTML = '<div class="svc-group-title"><span>' + g.name + '</span>' + (g.items.length > 2 ? '<button type="button" data-all="' + gi + '">Select all</button>' : '') + '</div><div class="svc-options"></div>';
    var opts = wrap.querySelector(".svc-options");
    g.items.forEach(function (it) {
      var l = document.createElement("label"); l.className = "svc-opt"; l.setAttribute("data-name", (it[1] + " " + it[2] + " " + g.name).toLowerCase());
      l.innerHTML = '<input type="checkbox" name="services" value="' + it[0] + '"><span class="box"><span class="si">' + ic(I[it[3]]) + '</span><span><strong>' + it[1] + '</strong><small>' + it[2] + '</small></span><span class="check">' + CHECK + '</span></span>';
      opts.appendChild(l);
    });
    box.appendChild(wrap);
  });
  var boxes = Array.prototype.slice.call(form.querySelectorAll('input[name="services"]'));
  var sumList = document.getElementById("sumList"), sumEmpty = document.getElementById("sumEmpty"), sumCount = document.getElementById("sumCount"), countText = document.getElementById("svcCountText");
  var KEY = "tb_fn_order", fnOK = function () { return window.TB && TB.consent && TB.consent.functional(); };

  function selected() { return boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }); }
  function sync(bump) {
    var s = selected();
    sumList.innerHTML = "";
    s.forEach(function (v) {
      var li = document.createElement("li");
      li.innerHTML = "<span>" + NAME[v] + '</span><button type="button" aria-label="Remove ' + NAME[v] + '">' + X + "</button>";
      li.querySelector("button").addEventListener("click", function () { var b = boxes.filter(function (x) { return x.value === v; })[0]; b.checked = false; sync(true); });
      sumList.appendChild(li);
    });
    sumEmpty.style.display = s.length ? "none" : "";
    sumCount.textContent = s.length;
    if (bump) { sumCount.classList.remove("bump"); void sumCount.offsetWidth; sumCount.classList.add("bump"); setTimeout(function () { sumCount.classList.remove("bump"); }, 300); }
    countText.textContent = s.length ? s.length + (s.length === 1 ? " service selected" : " services selected") : "No services selected yet";
    if (s.length) document.getElementById("svcAlert").classList.remove("is-on");
    Array.prototype.forEach.call(form.querySelectorAll("[data-all]"), function (b) {
      var gi = +b.getAttribute("data-all"), ids = GROUPS[gi].items.map(function (x) { return x[0]; });
      b.textContent = ids.every(function (id) { return s.indexOf(id) > -1; }) ? "Clear all" : "Select all";
    });
    if (fnOK()) TB.store.set(KEY, s);
  }
  boxes.forEach(function (b) { b.addEventListener("change", function () { sync(true); }); });
  Array.prototype.forEach.call(form.querySelectorAll("[data-all]"), function (b) {
    b.addEventListener("click", function () {
      var gi = +b.getAttribute("data-all"), ids = GROUPS[gi].items.map(function (x) { return x[0]; });
      var all = ids.every(function (id) { return selected().indexOf(id) > -1; });
      boxes.forEach(function (x) { if (ids.indexOf(x.value) > -1) x.checked = !all; });
      sync(true);
    });
  });

  // preselect from URL or saved selection
  var params = {};
  location.search.replace(/^\?/, "").split("&").forEach(function (kv) { if (!kv) return; var p = kv.split("="); params[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); });
  var pre = params.s ? params.s.split(",") : (fnOK() && TB.store.get(KEY)) || [];
  boxes.forEach(function (b) { if (pre.indexOf(b.value) > -1) b.checked = true; });
  if (params.docs) { var n = document.getElementById("oNotes"); n.value = ("Documents I need help with: " + params.docs).slice(0, 1000); n.dispatchEvent(new Event("input")); }
  sync(false);

  // search
  var search = document.getElementById("svcSearch"), empty = document.getElementById("svcEmpty");
  function doSearch() {
    var q = search.value.trim().toLowerCase(), any = false;
    Array.prototype.forEach.call(form.querySelectorAll(".svc-group"), function (g) {
      var vis = 0;
      Array.prototype.forEach.call(g.querySelectorAll(".svc-opt"), function (o) { var on = !q || o.getAttribute("data-name").indexOf(q) > -1; o.classList.toggle("is-hidden", !on); if (on) vis++; });
      g.style.display = vis ? "" : "none"; if (vis) any = true;
    });
    empty.classList.toggle("is-on", !any);
  }
  search.addEventListener("input", doSearch);
  search.addEventListener("keydown", function (e) { if (e.key === "Enter") e.preventDefault(); });
  document.getElementById("svcClearSearch").addEventListener("click", function () { search.value = ""; doSearch(); search.focus(); });

  // steps
  var steps = Array.prototype.slice.call(form.querySelectorAll(".order-step")), si = Array.prototype.slice.call(form.querySelectorAll(".stepper-item")), cur = 0;
  function go(i) {
    var back = i < cur; cur = i;
    steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); s.classList.toggle("back", back && k === i); });
    si.forEach(function (s, k) { s.classList.toggle("is-current", k === i); s.classList.toggle("is-done", k < i); if (k === i) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current"); });
    if (i === 2) review();
    var top = form.closest(".form-card").getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 110, behavior: TB.reduced ? "auto" : "smooth" });
    var h = steps[i].querySelector("h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  function validStep(i) {
    if (i === 0) {
      if (!selected().length) { var a = document.getElementById("svcAlert"); a.classList.remove("is-on"); void a.offsetWidth; a.classList.add("is-on"); return false; }
      return true;
    }
    if (i === 1) {
      var ok = TB.validateAll(steps[1]), al = steps[1].querySelector(".form-alert");
      if (!ok) { al.querySelector("span").textContent = "Please check the highlighted fields and try again."; al.classList.add("is-on"); } else al.classList.remove("is-on");
      return ok;
    }
    return true;
  }
  Array.prototype.forEach.call(form.querySelectorAll("[data-next]"), function (b) { b.addEventListener("click", function () { if (validStep(cur)) go(cur + 1); }); });
  Array.prototype.forEach.call(form.querySelectorAll("[data-prev]"), function (b) { b.addEventListener("click", function () { go(cur - 1); }); });
  Array.prototype.forEach.call(form.querySelectorAll("[data-goto]"), function (b) { b.addEventListener("click", function () { go(+b.getAttribute("data-goto")); }); });

  function val(n) { var e = form.querySelector('[name="' + n + '"]:checked') || form.querySelector('[name="' + n + '"]'); return e ? e.value.trim() : ""; }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function review() {
    document.getElementById("revServices").innerHTML = selected().map(function (v) { return "<span>" + NAME[v] + "</span>"; }).join("");
    var rows = [["Name", val("first_name") + " " + val("last_name")], ["Email", val("email")], ["Phone", val("phone")], ["Company", val("company") || "Not provided"], ["USDOT number", val("usdot") || "Not provided"], ["Fleet size", val("fleet_size")], ["Preferred contact", val("preferred_contact")]];
    if (val("notes")) rows.push(["Notes", val("notes")]);
    document.getElementById("revDetails").innerHTML = rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (cur !== 2) { if (validStep(cur)) go(cur + 1); return; }
    var c = form.querySelector('[name="consent"]');
    if (!TB.validateField(c)) { c.focus(); return; }
    var data = { services: selected().map(function (v) { return NAME[v]; }).join(", ") };
    ["first_name", "last_name", "email", "phone", "company", "usdot", "fleet_size", "preferred_contact", "notes"].forEach(function (n) { data[n] = val(n); });
    TB.submit(form, data, "Website service order", function () {
      if (fnOK()) TB.store.del(KEY);
      var aside = document.querySelector(".order-summary"); aside.classList.add("is-sent");
      aside.querySelector("h4").firstChild.textContent = "Request sent ";
      aside.querySelector("[data-sum-time]").textContent = "Our team will be in touch shortly";
    });
  });
  document.addEventListener("tb:formreset", function (e) {
    if (e.detail !== form) return;
    boxes.forEach(function (b) { b.checked = false; }); sync(false); search.value = ""; doSearch(); go(0);
    var aside = document.querySelector(".order-summary"); aside.classList.toggle("is-sent", false); aside.querySelector("h4").firstChild.textContent = "Your selection "; aside.querySelector("[data-sum-time]").textContent = "Takes about two minutes";
  });
})();
