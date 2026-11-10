/* Tri Brothers | illustrated team avatars (monogram badges, no photographs, one consistent style) */
(function () {
  "use strict";
  var GROUPS = [
    { id: "leadership", name: "Leadership Team", desc: "Guides the overall direction of Tri Brothers LLC, ensuring strong decision-making, operational structure and continuous improvement across all service areas.",
      people: [["Amanuel Alamrew", "Managing Director"], ["Matthew Moulton", "Managing Director"], ["Eyob Hailu", "Managing Director"]] },
    { id: "compliance", name: "Compliance Team", desc: "Manages documentation, regulatory requirements and operational records to help trucking businesses stay aligned with industry standards and avoid disruptions.",
      people: [["Muller", "Compliance Officer"], ["Joseph", "Compliance Officer"], ["Ibrahim", "Compliance Officer"], ["Max", "Compliance Officer"], ["Jessica", "Compliance Officer"]] },
    { id: "dispatch", name: "Dispatch Team", desc: "Coordinates load booking, broker communication and trip management to keep trucks moving efficiently and reduce downtime.",
      people: [["Martha", "Dispatch Officer"], ["Grace", "Dispatch Officer"], ["Lucky", "Dispatch Officer"], ["Andy", "Dispatch Officer"], ["George", "Dispatch Officer"], ["John", "Dispatch Officer"], ["Diana", "Dispatch Officer"], ["Betty", "Dispatch Officer"], ["Emmy", "Dispatch Officer"]] },
    { id: "accounting", name: "Accounting Team", desc: "Handles financial tracking, payment monitoring and reporting support to help trucking businesses maintain clear visibility and control over their finances.",
      people: [["Tina", "Accounting Officer"], ["Jerry", "Accounting Officer"], ["Betty", "Accounting Officer"], ["Aida", "Accounting Officer"]] }
  ];
  var THEME = {
    leadership: { bgs: [["#24364f", "#0f1a2b"], ["#2b405e", "#152133"], ["#1d2c44", "#0c1422"]], line: "rgba(255,255,255,.10)", disc: "#ffffff", ink: "#152133", ring: "#f3b23c", badge: "#f3b23c", tag: "Leadership",
      icon: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="6" width="20" height="14" rx="2"/>' },
    compliance: { bgs: [["#e8f6e5", "#c3e6bc"], ["#dff2db", "#b7e0af"], ["#eef8ec", "#cdebc7"]], line: "rgba(21,33,51,.08)", disc: "#152133", ink: "#ffffff", ring: "#47bb3a", badge: "#47bb3a", tag: "Compliance",
      icon: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>' },
    dispatch: { bgs: [["#e6ecf4", "#c4d2e5"], ["#dde6f1", "#b9cbe2"], ["#edf1f7", "#ccd8e8"]], line: "rgba(21,33,51,.08)", disc: "#152133", ink: "#ffffff", ring: "#2b405e", badge: "#5fd252", tag: "Dispatch",
      icon: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>' },
    accounting: { bgs: [["#f8efdf", "#ecd6ac"], ["#f6ead3", "#e8cf9f"], ["#fbf3e6", "#efdcb8"]], line: "rgba(21,33,51,.08)", disc: "#152133", ink: "#ffffff", ring: "#e09e2a", badge: "#f3b23c", tag: "Accounting",
      icon: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>' }
  };
  function initials(n) { var p = n.split(" "); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase(); }
  function seed(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; }
  var uid = 0;
  function avatar(name, dept, idx) {
    var t = THEME[dept], ini = initials(name), id = "av" + (uid++), sd = seed(name + idx);
    var bg = t.bgs[sd % t.bgs.length], rot = (sd % 12) * 30, orb = (sd % 8) * 45, bend = 30 + (sd % 5) * 14;
    var cx = 150, cy = 128, R = 70;
    var a = orb * Math.PI / 180, ox = (cx + Math.cos(a) * (R + 16)).toFixed(1), oy = (cy + Math.sin(a) * (R + 16)).toFixed(1);
    var bx = (cx + Math.cos(Math.PI / 4) * R).toFixed(1), by = (cy + Math.sin(Math.PI / 4) * R).toFixed(1);
    var lines = '<g transform="rotate(' + rot + ' 150 138)" fill="none" stroke="' + t.line + '" stroke-width="2">' +
      '<path d="M-40 ' + (60 + bend) + ' C 60 ' + (10 + bend) + ' 120 ' + (160 - bend) + ' 340 ' + (90 + bend / 2) + '"/>' +
      '<path d="M-40 ' + (190 - bend / 2) + ' C 80 ' + (250 - bend) + ' 200 ' + (120 + bend) + ' 340 ' + (200 - bend / 3) + '" stroke-dasharray="6 9"/>' +
      '<circle cx="150" cy="138" r="118"/></g>';
    return '<svg viewBox="0 0 300 276" role="img" aria-label="Illustrated badge for ' + name + ', initials ' + ini + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + bg[0] + '"/><stop offset="1" stop-color="' + bg[1] + '"/></linearGradient>' +
      '<filter id="' + id + 's" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0c1422" flood-opacity=".28"/></filter></defs>' +
      '<rect width="300" height="276" fill="url(#' + id + ')"/>' + lines +
      '<path d="M0 248 H300" stroke="' + t.line + '" stroke-width="10"/><path d="M0 248 H300" stroke="' + t.ring + '" stroke-width="2" stroke-dasharray="14 12" opacity=".55"/>' +
      '<g class="av-orbit" style="transform-origin:150px 128px"><circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 16) + '" fill="none" stroke="' + t.ring + '" stroke-width="1.6" stroke-dasharray="2 7" opacity=".7"/>' +
      '<circle cx="' + ox + '" cy="' + oy + '" r="5" fill="' + t.ring + '"/></g>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + t.disc + '" filter="url(#' + id + 's)"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 8) + '" fill="none" stroke="' + t.ring + '" stroke-width="1.5" opacity=".45"/>' +
      '<text x="' + cx + '" y="' + (cy + (ini.length > 1 ? 21 : 24)) + '" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="' + (ini.length > 1 ? 58 : 66) + '" letter-spacing="-1" fill="' + t.ink + '">' + ini + '</text>' +
      '<g transform="translate(' + bx + ' ' + by + ')"><circle r="21" fill="' + t.badge + '" stroke="' + (dept === "leadership" ? "#0f1a2b" : "#fff") + '" stroke-width="4"/>' +
      '<g transform="translate(-10 -10) scale(.84)" fill="none" stroke="#0c1422" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">' + t.icon + '</g></g>' +
      '</svg>';
  }
  function card(p, dept, idx) {
    var el = document.createElement("article");
    el.className = "member reveal"; el.setAttribute("data-dept", dept);
    el.innerHTML = '<div class="av"><span class="dept-tag">' + THEME[dept].tag + '</span>' + avatar(p[0], dept, idx) + '</div><div class="meta"><div><h4>' + p[0] + '</h4><span>' + p[1] + '</span></div></div>';
    return el;
  }
  function reveal(els) {
    if (!("IntersectionObserver" in window) || (window.TB && TB.reduced)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } }); }, { threshold: .1 });
    els.forEach(function (e, i) { e.style.setProperty("--d", (i % 4 * 0.07).toFixed(2) + "s"); io.observe(e); });
  }
  // Leadership only (about page)
  Array.prototype.forEach.call(document.querySelectorAll('[data-team="leadership"]'), function (box) {
    var els = GROUPS[0].people.map(function (p, i) { var c = card(p, "leadership", i); box.appendChild(c); return c; });
    reveal(els);
  });
  // Full team, grouped, with filters
  var all = document.querySelector('[data-team="all"]');
  if (all) {
    var els = [], groups = [], k = 0;
    GROUPS.forEach(function (g) {
      var sec = document.createElement("section"); sec.className = "team-group"; sec.setAttribute("data-dept", g.id); sec.setAttribute("aria-label", g.name);
      sec.innerHTML = '<div class="team-group-head"><h3>' + g.name + ' <span class="tg-count">' + g.people.length + '</span></h3><p>' + g.desc + '</p></div><div class="team-row"></div>';
      var row = sec.querySelector(".team-row");
      g.people.forEach(function (p) { var c = card(p, g.id, k++); row.appendChild(c); els.push(c); });
      all.appendChild(sec); groups.push(sec);
    });
    reveal(els);
    var tabs = document.getElementById("teamTabs"), live = document.getElementById("teamCount");
    function filter(d) {
      var n = 0;
      groups.forEach(function (g) {
        var on = d === "all" || g.getAttribute("data-dept") === d;
        g.classList.toggle("is-out", !on);
        if (on) Array.prototype.forEach.call(g.querySelectorAll(".member"), function (e) { n++; e.classList.remove("is-in"); void e.offsetWidth; e.classList.add("is-in"); });
      });
      if (live) live.textContent = n + (n === 1 ? " person" : " people");
    }
    if (tabs) TB.inkTabs(tabs, filter);
    filter("all");
  }
})();
