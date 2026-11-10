/* Tri Brothers | animated USA network map (hero) and permit mini map */
(function () {
  "use strict";
  var M = window.TB_MAP; if (!M) return;
  var NS = "http://www.w3.org/2000/svg";
  var reduced = window.TB && TB.reduced;
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }

  // Permits listed on the Tri Brothers compliance page
  var PERMITS = {
    NM: { name: "New Mexico", permit: "New Mexico Weight Distance Permit" },
    KY: { name: "Kentucky", permit: "Kentucky Permit" },
    NY: { name: "New York", permit: "New York HUT Permit" },
    CT: { name: "Connecticut", permit: "Connecticut Highway Use Permit" },
    OR: { name: "Oregon", permit: "Oregon Weight-Mile Tax Permit" }
  };
  window.TB_PERMITS = PERMITS;

  function drawStates(svg, cls) {
    var g = el("g", { "class": "states" }, svg), byAbbr = {};
    M.states.forEach(function (s) {
      var p = el("path", { d: s.d, "class": "state" + (PERMITS[s.a] ? " is-permit" : "") + (s.a === "NV" ? " is-hq" : ""), "data-abbr": s.a, "data-name": s.n }, g);
      byAbbr[s.a] = { path: p, data: s };
    });
    return byAbbr;
  }

  /* ================= HERO MAP ================= */
  function heroMap(stage) {
    var svg = el("svg", { viewBox: "0 0 975 610", "class": "usmap", role: "img", "aria-label": "Map of the United States showing Tri Brothers trucks moving between states, the Las Vegas head office, and the states where we manage permits" });
    stage.insertBefore(svg, stage.firstChild);
    var defs = el("defs", {}, svg);
    var lg = el("linearGradient", { id: "routeGrad", x1: "0", x2: "1", y1: "0", y2: "0" }, defs);
    el("stop", { offset: "0", "stop-color": "#47bb3a", "stop-opacity": "0" }, lg);
    el("stop", { offset: "1", "stop-color": "#5fd252", "stop-opacity": "1" }, lg);
    var glow = el("filter", { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    el("feGaussianBlur", { stdDeviation: "3", result: "b" }, glow);
    var fm = el("feMerge", {}, glow); el("feMergeNode", { "in": "b" }, fm); el("feMergeNode", { "in": "SourceGraphic" }, fm);

    var states = drawStates(svg);
    el("path", { d: M.nation, "class": "nation" }, svg);

    // labels for permit states and HQ
    var lab = el("g", {}, svg);
    Object.keys(PERMITS).concat(["NV"]).forEach(function (a) {
      var s = states[a].data, c = s.c.slice();
      if (a === "CT") { c = [c[0] + 4, c[1] + 16]; }
      if (a === "NV") { c = [c[0] - 6, c[1] - 26]; }
      var t = el("text", { x: c[0], y: c[1] + 5, "class": "state-label" + (PERMITS[a] ? " is-permit" : "") }, lab); t.textContent = a;
    });

    function heroLabels() { var w = svg.getBoundingClientRect().width || 975, k = 975 / w; Array.prototype.forEach.call(lab.querySelectorAll("text"), function (t) { t.style.fontSize = (11 * k).toFixed(1) + "px"; }); }
    heroLabels(); window.addEventListener("resize", heroLabels);
    // routes (illustrative network)
    var C = M.cities;
    var pairs = [["LV","LA"],["LV","SLC"],["LV","PHX"],["LV","DEN"],["LV","DAL"],["LV","SF"],["LV","CHI"],["LV","ATL"],["LV","SEA"],["LV","NYC"],
      ["LA","PHX"],["LA","SF"],["SF","PDX"],["PDX","SEA"],["SEA","BOI"],["BOI","SLC"],["SLC","DEN"],["DEN","KC"],["PHX","ABQ"],["ABQ","DAL"],["DAL","HOU"],["DAL","OKC"],["OKC","KC"],
      ["KC","STL"],["STL","CHI"],["CHI","DET"],["CHI","COL"],["COL","NYC"],["NYC","BOS"],["DAL","MEM"],["MEM","ATL"],["HOU","JAX"],["ATL","CLT"],["CLT","NYC"],["ATL","JAX"],["JAX","MIA"],["MSP","CHI"],["DEN","MSP"],["MEM","STL"],["DET","NYC"]];
    var routeG = el("g", {}, svg), routes = [];
    pairs.forEach(function (p, i) {
      var a = C[p[0]], b = C[p[1]];
      var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.sqrt(dx * dx + dy * dy);
      var bend = Math.min(60, len * 0.14) * (i % 2 ? 1 : -1);
      var mx = (a[0] + b[0]) / 2 - dy / len * bend, my = (a[1] + b[1]) / 2 + dx / len * bend;
      var d = "M" + a[0] + "," + a[1] + " Q" + mx.toFixed(1) + "," + my.toFixed(1) + " " + b[0] + "," + b[1];
      var path = el("path", { d: d, "class": "route" }, routeG);
      routes.push({ a: p[0], b: p[1], path: path, len: path.getTotalLength() });
    });
    // cities
    var cityG = el("g", {}, svg);
    Object.keys(C).forEach(function (k) {
      if (k === "LV") return;
      el("circle", { cx: C[k][0], cy: C[k][1], r: 6, "class": "city-ring" }, cityG);
      el("circle", { cx: C[k][0], cy: C[k][1], r: 2.4, "class": "city" }, cityG);
    });
    // HQ
    var hq = el("g", {}, svg), L = C.LV;
    el("circle", { cx: L[0], cy: L[1], r: 7, "class": "hq-pulse" }, hq);
    el("circle", { cx: L[0], cy: L[1], r: 7, "class": "hq-pulse p2" }, hq);
    el("circle", { cx: L[0], cy: L[1], r: 6, "class": "hq-dot", filter: "url(#glow)" }, hq);
    el("circle", { cx: L[0], cy: L[1], r: 2.2, fill: "#0c1422" }, hq);

    // trucks
    var liveG = el("g", {}, svg), truckG = el("g", {}, svg), pingG = el("g", {}, svg);
    function makeTruck() {
      var g = el("g", { "class": "truck" }, truckG);
      var inner = el("g", { transform: "scale(1.35) translate(-11,-4)" }, g);
      el("rect", { x: 0, y: 0, width: 15, height: 8, rx: 1.6, fill: "#e9eef5" }, inner);
      el("rect", { x: 1.5, y: 2.5, width: 12, height: 3, rx: .8, fill: "#c6cfdb" }, inner);
      el("rect", { x: 16, y: .6, width: 6.4, height: 6.8, rx: 2, fill: "#47bb3a" }, inner);
      el("rect", { x: 19.6, y: 1.6, width: 2, height: 4.8, rx: .8, fill: "#0c1422", opacity: .55 }, inner);
      el("circle", { cx: 23.6, cy: 1.6, r: .9, fill: "#f3b23c" }, inner);
      el("circle", { cx: 23.6, cy: 6.4, r: .9, fill: "#f3b23c" }, inner);
      var trail = el("path", { "class": "route-live", d: "" }, liveG);
      return { g: g, trail: trail };
    }
    function ping(x, y) {
      if (reduced) return;
      var c = el("circle", { cx: x, cy: y, r: 4, fill: "none", stroke: "#5fd252", "stroke-width": 1.5 }, pingG);
      var t0 = performance.now();
      (function anim(ts) { var p = (ts - t0) / 1100; if (p >= 1) { c.remove(); return; } c.setAttribute("r", 4 + p * 16); c.setAttribute("opacity", 1 - p); requestAnimationFrame(anim); })(t0);
    }
    var fleet = [];
    function assign(t, fromCity) {
      var opts = routes.filter(function (r) { return !fromCity || r.a === fromCity || r.b === fromCity; });
      if (!opts.length) opts = routes;
      // prefer lanes touching Las Vegas a little more often
      var r = opts[Math.floor(Math.random() * opts.length)];
      if (!fromCity && Math.random() < 0.4) { var lv = routes.filter(function (x) { return x.a === "LV"; }); r = lv[Math.floor(Math.random() * lv.length)]; }
      t.route = r; t.dir = fromCity ? (r.a === fromCity ? 1 : -1) : (Math.random() < .5 ? 1 : -1);
      t.speed = 38 + Math.random() * 26; // svg units per second
      t.trail.setAttribute("d", r.path.getAttribute("d"));
    }
    var N = window.innerWidth < 760 ? 7 : 11;
    for (var i = 0; i < N; i++) {
      var t = makeTruck(); assign(t); t.pos = Math.random() * t.route.len; fleet.push(t);
    }
    function place(t) {
      var r = t.route, s = t.dir > 0 ? t.pos : r.len - t.pos;
      var p = r.path.getPointAtLength(Math.max(0, Math.min(r.len, s)));
      var q = r.path.getPointAtLength(Math.max(0, Math.min(r.len, s + t.dir * 1.5)));
      var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      t.g.setAttribute("transform", "translate(" + p.x.toFixed(1) + "," + p.y.toFixed(1) + ") rotate(" + ang.toFixed(1) + ")");
      var trailLen = Math.min(70, t.pos);
      // trail: dash visible behind the truck
      if (t.dir > 0) { t.trail.style.strokeDasharray = trailLen + " " + (r.len + 100); t.trail.style.strokeDashoffset = -(t.pos - trailLen); }
      else { t.trail.style.strokeDasharray = "0 " + (r.len - t.pos) + " " + trailLen + " " + (r.len + 100); t.trail.style.strokeDashoffset = 0; }
      t.trail.style.stroke = "rgba(95,210,82," + (t.dir > 0 ? ".55" : ".55") + ")";
    }
    fleet.forEach(place);
    var running = true, last = 0, rafId;
    function frame(ts) {
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
      if (running) {
        fleet.forEach(function (t) {
          t.pos += t.speed * dt;
          if (t.pos >= t.route.len) {
            var end = t.dir > 0 ? t.route.b : t.route.a, pt = M.cities[end];
            ping(pt[0], pt[1]);
            assign(t, end); t.pos = 0;
          }
          place(t);
        });
      }
      rafId = requestAnimationFrame(frame);
    }
    if (!reduced) {
      rafId = requestAnimationFrame(frame);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { running = en[0].isIntersecting; last = 0; }, { threshold: 0 }).observe(stage);
      document.addEventListener("visibilitychange", function () { running = !document.hidden; last = 0; });
    }

    // tooltip
    var tip = document.createElement("div"); tip.className = "map-tip"; tip.setAttribute("aria-hidden", "true"); stage.appendChild(tip);
    function showTip(e, a) {
      var s = states[a].data, html = "<strong>" + s.n + "</strong>";
      if (PERMITS[a]) html += "<span class='tip-tag'>" + PERMITS[a].permit + "</span>";
      else if (a === "NV") html += "<span class='tip-tag' style='background:#fdf1dc;color:#8f600a'>Head office, Las Vegas</span>";
      tip.innerHTML = html;
      var r = stage.getBoundingClientRect();
      tip.style.left = Math.max(90, Math.min(r.width - 90, e.clientX - r.left)) + "px";
      tip.style.top = (e.clientY - r.top) + "px";
      var cardEl = stage.querySelector("[data-map-card]"), below = false;
      if (cardEl && getComputedStyle(cardEl).position === "absolute") {
        var cr = cardEl.getBoundingClientRect(), tx = e.clientX, ty = e.clientY;
        below = tx > cr.left - 110 && tx < cr.right + 110 && ty - 110 < cr.bottom && ty > cr.top - 20;
      }
      tip.classList.toggle("is-below", below);
      tip.classList.add("is-on");
    }
    svg.addEventListener("pointermove", function (e) { var a = e.target.getAttribute && e.target.getAttribute("data-abbr"); if (a) showTip(e, a); else tip.classList.remove("is-on"); });
    svg.addEventListener("pointerleave", function () { tip.classList.remove("is-on"); });

    // permit card that cycles through the permit states
    var card = stage.querySelector("[data-map-card]");
    if (card) {
      var keys = ["NV"].concat(Object.keys(PERMITS)), ci = 0, ctimer;
      var dots = card.querySelector(".mc-dots");
      keys.forEach(function (k, i) { var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", k === "NV" ? "Show head office" : "Show " + PERMITS[k].name + " permit"); b.addEventListener("click", function () { setCard(i, true); }); dots.appendChild(b); });
      var dotBtns = Array.prototype.slice.call(dots.children);
      function setCard(i, user) {
        ci = i; var k = keys[i];
        card.classList.add("swap");
        setTimeout(function () {
          card.querySelector(".mc-label span").textContent = k === "NV" ? "Head office" : "Permit compliance";
          card.querySelector(".mc-title").textContent = k === "NV" ? "Las Vegas, Nevada" : PERMITS[k].permit;
          card.querySelector(".mc-body").textContent = k === "NV" ? "5125 W Oquendo Rd, Ste 8, Las Vegas, NV 89118. The home of Tri Brothers LLC." : "One of the state permits our compliance team manages for carriers running through " + PERMITS[k].name + ".";
          card.classList.remove("swap");
        }, reduced ? 0 : 260);
        Object.keys(states).forEach(function (a) { states[a].path.classList.toggle("is-active", a === k && !!PERMITS[a]); });
        dotBtns.forEach(function (d, j) { d.classList.toggle("is-on", j === i); });
        if (user) { clearInterval(ctimer); ctimer = setInterval(next, 6000); }
      }
      function next() { setCard((ci + 1) % keys.length); }
      Object.keys(PERMITS).concat(["NV"]).forEach(function (a) {
        states[a].path.addEventListener("click", function () { setCard(keys.indexOf(a), true); });
      });
      setCard(0);
      if (!reduced) ctimer = setInterval(next, 6000);
    }
  }

  /* ================= MINI PERMIT MAP (compliance page) ================= */
  function miniMap(wrap) {
    var svg = el("svg", { viewBox: "0 0 975 610", "class": "mini-map", role: "img", "aria-label": "Map highlighting the five states where Tri Brothers manages permits" });
    wrap.appendChild(svg);
    var states = drawStates(svg);
    var labels = el("g", {}, svg);
    Object.keys(PERMITS).forEach(function (a) {
      var c = states[a].data.c.slice(); if (a === "CT") c = [c[0] + 34, c[1] + 30];
      var t = el("text", { x: c[0], y: c[1] + 4, "class": "pin-label" }, labels); t.textContent = a;
      if (a === "CT") el("path", { d: "M" + (c[0] - 24) + "," + (c[1] - 20) + " L" + (c[0] - 12) + "," + (c[1] - 10), stroke: "#152133", "stroke-width": 1.6 }, labels);
    });
    function labelSize() { var w = svg.getBoundingClientRect().width || 975; var k = Math.max(1, 600 / w); Array.prototype.forEach.call(labels.querySelectorAll("text"), function (t) { t.style.fontSize = (22 * k).toFixed(1) + "px"; t.style.strokeWidth = (5 * k).toFixed(1) + "px"; }); }
    labelSize(); window.addEventListener("resize", labelSize);
    var btns = Array.prototype.slice.call(document.querySelectorAll("[data-permit]"));
    function act(a) {
      Object.keys(states).forEach(function (k) { states[k].path.classList.toggle("is-active", k === a); });
      btns.forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-permit") === a); b.setAttribute("aria-pressed", b.getAttribute("data-permit") === a ? "true" : "false"); });
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { act(b.getAttribute("data-permit")); }); b.addEventListener("mouseenter", function () { act(b.getAttribute("data-permit")); }); });
    Object.keys(PERMITS).forEach(function (a) { states[a].path.addEventListener("click", function () { act(a); }); states[a].path.addEventListener("mouseenter", function () { act(a); }); });
    act("NM");
  }

  var s = document.querySelector("[data-hero-map]"); if (s) heroMap(s);
  var m = document.querySelector("[data-mini-map]"); if (m) miniMap(m);
})();
