/* Tri Brothers | dispatch process animation
   Desktop: scroll-driven while the scene is pinned. Tablet, phone and reduced motion: timed playback with controls. */
(function () {
  "use strict";
  var sec = document.querySelector(".process"); if (!sec) return;
  var pin = sec.querySelector(".process-pin");
  var steps = Array.prototype.slice.call(sec.querySelectorAll(".pstep"));
  var $ = function (id) { return document.getElementById(id); };
  var line1 = $("line1"), line2 = $("line2"), d1 = $("line1Dot"), d2 = $("line2Dot");
  var road = $("roadPath"), truck = $("truck"), card = $("officeCard"), waves = $("phoneWaves"), check = $("destCheck");
  var status = $("sceneStatus"), fill = $("pcFill"), label = $("pcLabel"), playBtn = $("pcPlay");
  var boxes = Array.prototype.slice.call(document.querySelectorAll("#boxes .bx"));
  var L1 = line1.getTotalLength(), L2 = line2.getTotalLength(), LR = road.getTotalLength();
  line1.style.strokeDasharray = L1; line2.style.strokeDasharray = L2;
  var reduced = window.TB && TB.reduced;
  var mq = window.matchMedia("(min-width: 1025px)");
  var mode = "auto", p = 0, playing = true, lastTs = 0, STEP_MS = 3200;
  var STATUS = ["Request received at head office", "Load booked and rate confirmed", "Driver assigned, load picked up", "Delivered to the customer"];
  var boxBase = boxes.map(function (b) { return { x: +b.getAttribute("x"), y: +b.getAttribute("y") }; });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function render() {
    var step = Math.min(3, Math.floor(p)), local = p - step;
    steps.forEach(function (s, i) {
      s.classList.toggle("is-active", i === step); s.classList.toggle("is-done", i < step);
      s.setAttribute("aria-current", i === step ? "step" : "false");
      var bar = s.querySelector(".pbar i"); if (bar) bar.style.height = (i < step ? 100 : i === step ? local * 100 : 0) + "%";
    });
    var a = ease(clamp(p / 0.9, 0, 1));
    line1.style.strokeDashoffset = L1 * (1 - a);
    var pt1 = line1.getPointAtLength(L1 * a); d1.setAttribute("cx", pt1.x); d1.setAttribute("cy", pt1.y); d1.setAttribute("opacity", a > 0.02 && a < 0.99 ? 1 : 0);
    waves.style.opacity = step === 0 ? 1 : 0.35;
    card.setAttribute("opacity", Math.min(clamp((p - 1) * 3, 0, 1), clamp((2.25 - p) * 4, 0, 1)));
    card.setAttribute("transform", "translate(0 " + (1 - clamp((p - 1) * 3, 0, 1)) * 10 + ")");
    var b = ease(clamp((p - 1.2) / 0.75, 0, 1));
    line2.style.strokeDashoffset = L2 * (1 - b);
    var pt2 = line2.getPointAtLength(L2 * b); d2.setAttribute("cx", pt2.x); d2.setAttribute("cy", pt2.y); d2.setAttribute("opacity", b > 0.02 && b < 0.99 ? 1 : 0);
    // boxes load into the trailer during step 3
    var c = clamp((p - 2.05) / 0.8, 0, 1);
    boxes.forEach(function (bx, i) {
      var t = ease(clamp(c * 1.6 - i * 0.3, 0, 1));
      var tx = 30 + i * 6, ty = -10;
      bx.setAttribute("transform", "translate(" + (t * tx) + " " + (t * ty - Math.sin(t * Math.PI) * 26) + ")");
      bx.setAttribute("opacity", t > 0.96 ? 0 : 1);
    });
    // truck drives during step 4
    var d = ease(clamp((p - 3) / 0.92, 0, 1));
    var tp = road.getPointAtLength(LR * d), tq = road.getPointAtLength(Math.min(LR, LR * d + 2));
    var ang = Math.atan2(tq.y - tp.y, tq.x - tp.x) * 180 / Math.PI;
    if (d >= 0.999) ang = 0;
    truck.setAttribute("transform", "translate(" + tp.x.toFixed(1) + " " + tp.y.toFixed(1) + ") rotate(" + ang.toFixed(1) + ")");
    line1.style.opacity = p > 2 ? 0.35 : 1;
    line2.style.opacity = p > 3.05 ? 0.35 : 1;
    var done = p >= 3.85;
    check.setAttribute("opacity", done ? 1 : 0);
    check.style.transform = done ? "scale(1)" : "scale(.4)";
    check.style.transition = "transform .5s cubic-bezier(.22,1,.36,1), opacity .3s";
    var st = step === 0 ? (local < 0.55 ? "Customer calls the head office" : "Request received at head office")
      : step === 1 ? (local < 0.25 ? "Dispatcher searching for a load" : "Load booked, driver assigned")
      : step === 2 ? (c < 1 ? "Driver at pickup, loading freight" : "Load picked up")
      : (d < 0.97 ? "On the road to the customer" : "Delivered to the customer");
    if (status.textContent !== st) status.textContent = st;
    fill.style.width = (p / 4 * 100) + "%";
    label.textContent = "Step " + (step + 1) + " of 4";
  }

  function scrollProgress() {
    var r = pin.getBoundingClientRect(), total = r.height - window.innerHeight;
    return clamp(-r.top / total, 0, 1) * 3.999;
  }
  function onScroll() { if (mode === "scroll") { p = scrollProgress(); render(); } }

  function setMode() {
    var next = (mq.matches && !reduced) ? "scroll" : "auto";
    mode = next;
    sec.classList.toggle("is-static", mode === "auto");
    document.getElementById("scene").setAttribute("viewBox", mq.matches ? "0 0 800 600" : "0 0 800 545");
    playBtn.style.display = mode === "auto" ? "" : "none";
    if (mode === "scroll") { p = scrollProgress(); }
    if (reduced && mode === "auto") { playing = false; p = 3.999; setPlayIcon(); }
    render();
  }

  var PAUSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 4 13 8-13 8z"/></svg>';
  var REPLAY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';
  function setPlayIcon() {
    var end = p >= 3.999;
    playBtn.innerHTML = playing ? PAUSE : end ? REPLAY : PLAY;
    playBtn.setAttribute("aria-label", playing ? "Pause animation" : end ? "Replay animation" : "Play animation");
  }
  playBtn.addEventListener("click", function () {
    if (p >= 3.999) p = 0;
    playing = !playing; hold = 0; setPlayIcon(); lastTs = 0;
  });

  var visible = false, hold = 0;
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; lastTs = 0; }, { threshold: 0.25 }).observe(sec.querySelector(".process-scene"));
  function loop(ts) {
    if (mode === "auto" && playing && visible) {
      var dt = lastTs ? ts - lastTs : 0;
      if (hold) { if (ts > hold) { hold = 0; p = 0; render(); } }
      else {
        p += dt / STEP_MS;
        if (p >= 3.999) { p = 3.999; hold = ts + 2400; }
        render();
      }
    }
    lastTs = ts;
    requestAnimationFrame(loop);
  }

  steps.forEach(function (s, i) {
    s.addEventListener("click", function () {
      if (mode === "scroll") {
        var r = pin.getBoundingClientRect(), total = r.height - window.innerHeight;
        var y = window.scrollY + r.top + total * ((i + 0.35) / 4);
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        p = i + 0.01; hold = 0; playing = true; setPlayIcon(); render();
        var sc = sec.querySelector(".process-scene"), r = sc.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) window.scrollTo({ top: window.scrollY + r.top - 90, behavior: TB.reduced ? "auto" : "smooth" });
      }
    });
  });

  window.addEventListener("scroll", function () { requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener("resize", setMode);
  if (mq.addEventListener) mq.addEventListener("change", setMode);
  setMode(); setPlayIcon();
  requestAnimationFrame(loop);
})();
