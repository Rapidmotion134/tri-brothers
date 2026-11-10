/* Tri Brothers | portal feature tabs with auto-advance */
(function () {
  "use strict";
  var wrap = document.querySelector("[data-ptabs]"); if (!wrap) return;
  var tabs = Array.prototype.slice.call(wrap.querySelectorAll(".ptab")), screens = Array.prototype.slice.call(wrap.querySelectorAll(".pscreen"));
  var reduced = window.TB && TB.reduced, cur = 0, start = performance.now(), DUR = 6500, auto = !reduced, visible = false, hover = false, elapsed = 0;
  tabs.forEach(function (t, i) { t.id = "ptab-" + i; screens[i].id = "pscreen-" + i; t.setAttribute("aria-controls", screens[i].id); screens[i].setAttribute("aria-labelledby", t.id); });
  function show(i) {
    cur = i; start = performance.now(); elapsed = 0;
    tabs.forEach(function (t, k) { t.classList.toggle("is-active", k === i); t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; t.querySelector(".pt-prog").style.transform = "scaleX(0)"; });
    screens.forEach(function (s, k) { s.classList.toggle("is-active", k === i); s.setAttribute("aria-hidden", k === i ? "false" : "true"); });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { auto = false; show(i); });
    t.addEventListener("keydown", function (e) { var n = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (n) { e.preventDefault(); auto = false; var j = (i + n + tabs.length) % tabs.length; show(j); tabs[j].focus(); } });
  });
  wrap.addEventListener("mouseenter", function () { hover = true; elapsed = performance.now() - start; });
  wrap.addEventListener("mouseleave", function () { hover = false; start = performance.now() - elapsed; });
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start = performance.now() - elapsed; }, { threshold: .3 }).observe(wrap);
  (function loop(ts) {
    if (auto && visible && !hover) {
      var p = (ts - start) / DUR; elapsed = ts - start;
      tabs[cur].querySelector(".pt-prog").style.transform = "scaleX(" + Math.min(1, p) + ")";
      if (p >= 1) show((cur + 1) % tabs.length);
    }
    requestAnimationFrame(loop);
  })(performance.now());
  show(0);
})();
