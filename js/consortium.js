/* Tri Brothers | consortium pool illustration and random draw demo (illustrative only) */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var reduced = window.TB && TB.reduced;
  // Hero pool dots
  var g = document.getElementById("poolDots");
  if (g) {
    var dots = [];
    for (var r = 0; r < 4; r++) {
      var ring = [0, 26, 50, 74][r], n = [1, 8, 14, 20][r];
      for (var i = 0; i < n; i++) {
        var a = i / n * Math.PI * 2 + r * 0.3, c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", (280 + Math.cos(a) * ring).toFixed(1)); c.setAttribute("cy", (240 + Math.sin(a) * ring).toFixed(1));
        c.setAttribute("r", 6); c.setAttribute("fill", "#3a5072"); g.appendChild(c); dots.push(c);
      }
    }
    if (!reduced) setInterval(function () {
      dots.forEach(function (d) { d.setAttribute("fill", "#3a5072"); d.setAttribute("r", 6); });
      for (var k = 0; k < 3; k++) { var d = dots[Math.floor(Math.random() * dots.length)]; d.setAttribute("fill", "#5fd252"); d.setAttribute("r", 7.5); }
    }, 1600);
  }

  // Random draw demo
  var card = document.querySelector("[data-draw]"); if (!card) return;
  var grid = card.querySelector(".draw-grid"), status = card.querySelector(".draw-status");
  var run = card.querySelector("[data-draw-run]"), reset = card.querySelector("[data-draw-reset]");
  var PERSON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6z"/></svg>';
  var cells = [];
  for (var i = 0; i < 48; i++) { var s = document.createElement("span"); s.className = "draw-cell"; s.innerHTML = PERSON; s.style.animationDelay = (i * 0.012) + "s"; grid.appendChild(s); cells.push(s); }
  var busy = false;
  function clear() { cells.forEach(function (c) { c.classList.remove("is-pick", "is-scan"); }); }
  run.addEventListener("click", function () {
    if (busy) return; busy = true; run.disabled = true; clear();
    status.textContent = "Selecting at random from the pool...";
    var pick = 3 + Math.floor(Math.random() * 3), chosen = [];
    while (chosen.length < pick) { var k = Math.floor(Math.random() * 48); if (chosen.indexOf(k) < 0) chosen.push(k); }
    var t0 = performance.now(), dur = reduced ? 0 : 1600, last = -1;
    (function scan(ts) {
      var p = (ts - t0) / dur;
      if (p < 1) {
        var step = Math.floor(p * 22);
        if (step !== last) { last = step; cells.forEach(function (c) { c.classList.remove("is-scan"); }); for (var j = 0; j < 4; j++) cells[Math.floor(Math.random() * 48)].classList.add("is-scan"); }
        requestAnimationFrame(scan); return;
      }
      cells.forEach(function (c) { c.classList.remove("is-scan"); });
      chosen.forEach(function (k, j) { setTimeout(function () { cells[k].classList.add("is-pick"); }, reduced ? 0 : j * 140); });
      setTimeout(function () { status.textContent = pick + " drivers selected for testing. Everyone else stays in the pool for the next draw."; busy = false; run.disabled = false; }, reduced ? 0 : pick * 140 + 200);
    })(t0);
  });
  reset.addEventListener("click", function () { if (busy) return; clear(); status.textContent = "48 drivers in the pool. Select Run a draw to see a random selection."; });
})();
