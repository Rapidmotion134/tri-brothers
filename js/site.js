/* Tri Brothers LLC | core site behaviour (no dependencies, works from file://) */
(function () {
  "use strict";
  var TB = (window.TB = window.TB || {});
  var doc = document, root = doc.documentElement, body = doc.body;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  TB.reduced = reduced;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  TB.$ = $; TB.$$ = $$;

  /* ---------- Safe storage ---------- */
  var store = {
    get: function (k) { try { return JSON.parse(window.localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) {} }
  };
  TB.store = store;

  /* ---------- Toast ---------- */
  var toastTimer;
  TB.toast = function (msg) {
    var t = $("#toast"); if (!t) return;
    t.querySelector("span").textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2600);
  };

  /* ---------- Header: scrolled / hide on scroll / progress ---------- */
  var header = $("#siteHeader"), progress = $("#progress");
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 24);
      var openDD = $(".nav-item.is-open");
      if (y > 480 && y > lastY + 4 && !openDD && !body.classList.contains("menu-open")) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y < 480) header.classList.remove("is-hidden");
    }
    if (progress) {
      var h = root.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    }
    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Desktop dropdowns ---------- */
  $$("[data-dd]").forEach(function (item) {
    var btn = item.querySelector(".nav-link"), timer;
    function open() { clearTimeout(timer); $$("[data-dd].is-open").forEach(function (o) { if (o !== item) close(o); }); item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
    function close(it) { it = it || item; it.classList.remove("is-open"); it.querySelector(".nav-link").setAttribute("aria-expanded", "false"); }
    item.addEventListener("mouseenter", function () { if (window.matchMedia("(hover:hover)").matches) open(); });
    item.addEventListener("mouseleave", function () { timer = setTimeout(close, 160); });
    btn.addEventListener("click", function (e) { e.preventDefault(); item.classList.contains("is-open") ? close() : open(); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); btn.focus(); }
      if (e.key === "ArrowDown" && !item.classList.contains("is-open")) { e.preventDefault(); open(); var f = item.querySelector(".dropdown a"); f && f.focus(); }
    });
    item.addEventListener("focusout", function (e) { if (!item.contains(e.relatedTarget)) close(); });
  });
  doc.addEventListener("click", function (e) { $$("[data-dd].is-open").forEach(function (o) { if (!o.contains(e.target)) { o.classList.remove("is-open"); o.querySelector(".nav-link").setAttribute("aria-expanded", "false"); } }); });

  /* ---------- Mobile drawer ---------- */
  var burger = $("#burger"), drawer = $("#drawer");
  function setMenu(on) {
    body.classList.toggle("menu-open", on);
    burger.setAttribute("aria-expanded", on ? "true" : "false");
    burger.setAttribute("aria-label", on ? "Close menu" : "Open menu");
    drawer.setAttribute("aria-hidden", on ? "false" : "true");
    if (on) { header.classList.remove("is-hidden"); }
  }
  if (burger && drawer) {
    burger.addEventListener("click", function () { setMenu(!body.classList.contains("menu-open")); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && body.classList.contains("menu-open")) { setMenu(false); burger.focus(); } });
    $$(".drawer-toggle", drawer).forEach(function (b) { b.addEventListener("click", function () { b.setAttribute("aria-expanded", b.getAttribute("aria-expanded") === "true" ? "false" : "true"); }); });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1024 && body.classList.contains("menu-open")) setMenu(false); });
  }

  /* ---------- Split words for headline reveals ---------- */
  function splitWords(el) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = doc.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(" ")); return; }
            var w = doc.createElement("span"); w.className = "w";
            var inner = doc.createElement("span"); inner.textContent = p; inner.style.setProperty("--i", i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") { walk(n); }
      });
    }
    walk(el);
  }
  $$(".split-words").forEach(splitWords);

  /* ---------- Stagger helper ---------- */
  $$("[data-stagger]").forEach(function (p) {
    var step = parseFloat(p.getAttribute("data-stagger")) || 0.08;
    $$(".reveal, .reveal-scale, .reveal-fade", p).forEach(function (c, i) { if (!c.style.getPropertyValue("--d")) c.style.setProperty("--d", (i * step).toFixed(2) + "s"); });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealSel = ".reveal, .reveal-fade, .reveal-scale, .split-words, .clip-reveal, [data-inview]";
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); en.target.dispatchEvent(new CustomEvent("inview")); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    $$(revealSel).forEach(function (el) { io.observe(el); });
  } else {
    $$(revealSel).forEach(function (el) { el.classList.add("is-in"); setTimeout(function () { el.dispatchEvent(new CustomEvent("inview")); }, 0); });
  }

  /* ---------- Counters ---------- */
  function formatNum(n, dec) {
    var s = n.toFixed(dec);
    var parts = s.split("."); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  $$("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count")), dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var numEl = el.querySelector(".n") || el;
    function run() {
      if (reduced) { numEl.textContent = formatNum(target, dec); return; }
      var start = null, dur = 1800;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 4);
        numEl.textContent = formatNum(target * e, dec);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    numEl.textContent = formatNum(0, dec);
    if (!el.hasAttribute("data-inview")) el.setAttribute("data-inview", "");
    el.addEventListener("inview", run, { once: true });
    if ("IntersectionObserver" in window && !reduced) { io && io.observe(el); } else { run(); }
  });

  /* ---------- Parallax ---------- */
  var plx = $$("[data-parallax]");
  if (plx.length && !reduced) {
    var pt = false;
    function parallax() {
      var vh = window.innerHeight;
      plx.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        var c = (r.top + r.height / 2 - vh / 2);
        el.style.transform = "translate3d(0," + (-c * f).toFixed(1) + "px,0)";
      });
      pt = false;
    }
    window.addEventListener("scroll", function () { if (!pt) { pt = true; requestAnimationFrame(parallax); } }, { passive: true });
    window.addEventListener("resize", parallax);
    parallax();
  }

  /* ---------- Card pointer glow ---------- */
  $$(".card-glow").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Generic tabs (ink indicator) ---------- */
  TB.inkTabs = function (wrap, onChange) {
    var tabs = $$(".tab", wrap), ink = doc.createElement("span");
    ink.className = "tab-ink"; wrap.insertBefore(ink, wrap.firstChild);
    function place(t, instant) {
      if (!t) return;
      if (instant) ink.style.transition = "none";
      ink.style.left = t.offsetLeft + "px"; ink.style.width = t.offsetWidth + "px"; ink.style.top = t.offsetTop + "px";
      if (instant) { ink.offsetWidth; ink.style.transition = ""; }
    }
    function select(t, focus) {
      tabs.forEach(function (x) { var on = x === t; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1; });
      place(t); if (focus) t.focus();
      if (t.scrollIntoView && wrap.scrollWidth > wrap.clientWidth) { wrap.scrollTo({ left: t.offsetLeft - 20, behavior: reduced ? "auto" : "smooth" }); }
      onChange && onChange(t.getAttribute("data-tab"), t);
    }
    tabs.forEach(function (t, i) {
      t.setAttribute("role", "tab");
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === "Home") n = tabs[0];
        if (k === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    function fade() { wrap.classList.toggle("fade-r", wrap.scrollWidth - wrap.clientWidth - wrap.scrollLeft > 4); }
    wrap.addEventListener("scroll", fade, { passive: true }); window.addEventListener("resize", fade); setTimeout(fade, 300);
    wrap.setAttribute("role", "tablist");
    var active = wrap.querySelector(".tab.is-active") || tabs[0];
    tabs.forEach(function (x) { x.tabIndex = x === active ? 0 : -1; x.setAttribute("aria-selected", x === active ? "true" : "false"); });
    requestAnimationFrame(function () { place(active, true); });
    window.addEventListener("resize", function () { place(wrap.querySelector(".tab.is-active"), true); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { place(wrap.querySelector(".tab.is-active"), true); });
    return { select: select };
  };

  /* ---------- FAQ accordion + search ---------- */
  $$(".faq-item").forEach(function (item, idx) {
    var q = item.querySelector(".faq-q"), a = item.querySelector(".faq-a");
    var id = "faq-a-" + idx; a.id = id; q.setAttribute("aria-controls", id);
    q.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
    q.addEventListener("click", function () {
      var open = !item.classList.contains("is-open");
      var group = item.closest("[data-accordion-single]");
      if (open && group) $$(".faq-item.is-open", group).forEach(function (o) { if (o !== item) { o.classList.remove("is-open"); o.querySelector(".faq-q").setAttribute("aria-expanded", "false"); } });
      item.classList.toggle("is-open", open); q.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- Copy buttons ---------- */
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var val = b.getAttribute("data-copy");
      function done() { b.classList.add("is-done"); TB.toast("Copied: " + val); setTimeout(function () { b.classList.remove("is-done"); }, 1600); }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(val).then(done, fallback); else fallback();
      function fallback() { var t = doc.createElement("textarea"); t.value = val; t.style.position = "fixed"; t.style.opacity = "0"; body.appendChild(t); t.select(); try { doc.execCommand("copy"); } catch (e) {} body.removeChild(t); done(); }
    });
  });

  /* ---------- Cookie consent ---------- */
  var CKEY = "tb_consent_v1";
  var gpc = navigator.globalPrivacyControl === true;
  if (gpc) body.classList.add("gpc-on");
  var banner = $("#cookieBanner"), modal = $("#cookieModal"), fnToggle = $("#prefFunctional");
  var consent = store.get(CKEY);
  TB.consent = {
    functional: function () { return !!(consent && consent.functional); },
    get: function () { return consent; }
  };
  function saveConsent(functional, method) {
    if (gpc && method === "accept") functional = functional; // explicit opt-in still allowed after GPC
    consent = { v: 1, necessary: true, functional: !!functional, method: method, gpc: gpc, ts: new Date().toISOString() };
    store.set(CKEY, consent);
    if (!consent.functional) { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf("tb_fn_") === 0) localStorage.removeItem(k); }); } catch (e) {} }
    hideBanner(); closeModal();
    doc.dispatchEvent(new CustomEvent("tb:consent", { detail: consent }));
    TB.toast(consent.functional ? "Preferences saved. Functional storage is on." : "Preferences saved. Only necessary storage is used.");
  }
  function showBanner() { if (banner) { banner.hidden = false; requestAnimationFrame(function () { banner.classList.add("is-on"); }); } }
  function hideBanner() { if (banner) banner.classList.remove("is-on"); }
  var lastFocus = null;
  function openModal() {
    if (!modal) return;
    lastFocus = doc.activeElement;
    fnToggle.checked = consent ? !!consent.functional : false;
    modal.classList.add("is-on"); modal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
    setTimeout(function () { var c = modal.querySelector(".modal-close"); c && c.focus(); }, 60);
  }
  function closeModal() {
    if (!modal || !modal.classList.contains("is-on")) return;
    modal.classList.remove("is-on"); modal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  TB.openCookieSettings = openModal;
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () {
      var a = b.getAttribute("data-consent");
      if (a === "accept") saveConsent(true, "accept");
      else if (a === "reject") saveConsent(false, "reject");
      else if (a === "save") saveConsent(fnToggle.checked, "custom");
      else if (a === "manage") openModal();
    });
  });
  $$("[data-cookie-settings]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openModal(); }); });
  if (modal) {
    $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", function () { closeModal(); if (!consent) showBanner(); }); });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeModal(); if (!consent) showBanner(); }
      if (e.key === "Tab") {
        var f = $$("button, a[href], input", modal).filter(function (x) { return x.offsetParent !== null && !x.disabled; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  if (!consent) { setTimeout(showBanner, 900); }

  /* ---------- Forms: validation + submission ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function digits(s) { return (s || "").replace(/\D/g, ""); }
  TB.validateField = function (input) {
    var f = input.closest(".field"); if (!f) return true;
    var v = (input.type === "checkbox") ? input.checked : (input.value || "").trim();
    var msg = "";
    if (input.hasAttribute("required") && (input.type === "checkbox" ? !v : !v)) msg = input.getAttribute("data-msg-required") || "This field is required.";
    else if (v && input.type === "email" && !EMAIL.test(v)) msg = "Enter a valid email address, like name@company.com.";
    else if (v && input.getAttribute("data-type") === "phone" && (digits(v).length < 10 || digits(v).length > 15)) msg = "Enter a phone number with area code.";
    else if (v && input.getAttribute("minlength") && v.length < +input.getAttribute("minlength")) msg = "Please add a little more detail (at least " + input.getAttribute("minlength") + " characters).";
    var err = f.querySelector(".field-error span");
    if (err) err.textContent = msg;
    f.classList.toggle("has-error", !!msg);
    f.classList.toggle("is-valid", !msg && !!v && input.type !== "checkbox");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  };
  TB.validateAll = function (scope) {
    var ok = true, first = null;
    $$("input[required], textarea[required], select[required], input[type=email], input[data-type=phone]", scope).forEach(function (i) {
      if (i.closest(".hp-field")) return;
      if (!TB.validateField(i)) { ok = false; first = first || i; }
    });
    if (first) { first.focus({ preventScroll: true }); first.closest(".field").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }); }
    return ok;
  };
  // Phone formatting (US style while typing)
  $$("input[data-type=phone]").forEach(function (i) {
    i.addEventListener("input", function () {
      var d = digits(i.value);
      if (d.length === 11 && d[0] === "1") d = d.slice(1);
      if (d.length <= 10 && !/^\+/.test(i.value)) {
        var o = d;
        if (d.length > 6) o = "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
        else if (d.length > 3) o = "(" + d.slice(0, 3) + ") " + d.slice(3);
        else if (d.length > 0) o = "(" + d;
        i.value = o;
      }
    });
  });
  // Live validation once touched
  $$("form[data-validate]").forEach(function (form) {
    form._t0 = Date.now();
    $$("input, textarea, select", form).forEach(function (i) {
      if (i.closest(".hp-field")) return;
      if (!i.closest(".field")) return;
      i.addEventListener("blur", function () { if (i.value || i.closest(".field").classList.contains("has-error")) TB.validateField(i); });
      i.addEventListener("input", function () { if (i.closest(".field") && i.closest(".field").classList.contains("has-error")) TB.validateField(i); });
      i.addEventListener("change", function () { if (i.type === "checkbox") TB.validateField(i); });
    });
    $$("textarea[maxlength]", form).forEach(function (t) {
      var c = t.parentElement.querySelector(".char-count");
      if (c) { var upd = function () { c.textContent = t.value.length + " / " + t.getAttribute("maxlength"); }; t.addEventListener("input", upd); upd(); }
    });
    if (form.hasAttribute("data-custom")) return; // handled by page script
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var alertEl = form.querySelector(".form-alert");
      if (!TB.validateAll(form)) { if (alertEl) { alertEl.querySelector("span").textContent = "Please check the highlighted fields and try again."; alertEl.classList.add("is-on"); } return; }
      if (alertEl) alertEl.classList.remove("is-on");
      var data = {};
      $$("input, textarea, select", form).forEach(function (i) { if (!i.name || i.closest(".hp-field")) return; if (i.type === "checkbox" || i.type === "radio") { if (i.checked) data[i.name] = data[i.name] ? data[i.name] + ", " + i.value : i.value; } else data[i.name] = i.value.trim(); });
      TB.submit(form, data, form.getAttribute("data-subject") || "Website enquiry");
    });
  });

  TB.submit = function (form, data, subject, onDone) {
    var btn = form.querySelector("[type=submit]");
    var hp = form.querySelector(".hp-field input");
    var tooFast = Date.now() - (form._t0 || 0) < 2500;
    var isBot = (hp && hp.value) || tooFast && !form.hasAttribute("data-allow-fast");
    btn && btn.classList.add("is-loading");
    var ref = "TB-" + Date.now().toString(36).toUpperCase().slice(-6);
    function success() {
      btn && btn.classList.remove("is-loading");
      var wrap = form.closest("[data-form-wrap]") || form.parentElement;
      var ok = wrap.querySelector(".form-success");
      var refEl = ok && ok.querySelector("[data-ref]"); if (refEl) refEl.textContent = ref;
      if (ok) {
        form.style.display = "none"; ok.classList.add("is-on");
        var h = ok.querySelector("h3"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
        var top = wrap.getBoundingClientRect().top + window.scrollY - 120;
        if (wrap.getBoundingClientRect().top < 80) window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
      }
      onDone && onDone(ref);
    }
    function fail() {
      btn && btn.classList.remove("is-loading");
      var a = form.querySelector(".form-alert");
      if (a) { a.querySelector("span").textContent = "We could not send your message just now. Please try again, or email info@tribrothersusa.com directly."; a.classList.add("is-on"); }
    }
    var cfg = window.TB_CONFIG || {};
    if (isBot) { setTimeout(success, 900); return; } // silently drop likely spam
    if (!cfg.formEndpoint) { setTimeout(success, 1100); return; } // demo mode
    var payload = Object.assign({ _subject: subject + " | " + ref, _template: "table", _captcha: "false", _honey: "", reference: ref }, data);
    if (data.email && cfg.autoResponse) payload._autoresponse = cfg.autoResponse;
    fetch(cfg.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
      .then(function (j) { (j && (j.success === "true" || j.success === true)) ? success() : fail(); })
      .catch(fail);
  };

  // Reset buttons in success panels
  $$("[data-form-reset]").forEach(function (b) {
    b.addEventListener("click", function () {
      var wrap = b.closest("[data-form-wrap]"), form = wrap.querySelector("form"), ok = wrap.querySelector(".form-success");
      form.reset(); form._t0 = Date.now();
      $$(".field", form).forEach(function (f) { f.classList.remove("has-error", "is-valid"); });
      $$("textarea[maxlength]", form).forEach(function (t) { t.dispatchEvent(new Event("input")); });
      ok.classList.remove("is-on"); form.style.display = "";
      doc.dispatchEvent(new CustomEvent("tb:formreset", { detail: form }));
    });
  });


  /* ---------- Timeline (click through stages) ---------- */
  $$("[data-timeline]").forEach(function (tl) {
    var nodes = $$(".tl-node", tl), panels = $$(".tl-panel", tl), fillEl = $(".tl-fill", tl);
    function set(i) {
      nodes.forEach(function (n, k) { n.classList.toggle("is-active", k === i); n.classList.toggle("is-done", k < i); n.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      panels.forEach(function (p, k) { p.classList.toggle("is-active", k === i); p.setAttribute("aria-hidden", k === i ? "false" : "true"); });
      if (fillEl) fillEl.style.width = (i / (nodes.length - 1) * 75) + "%";
    }
    nodes.forEach(function (n, k) { n.addEventListener("click", function () { set(k); }); });
    set(0);
  });

  /* ---------- Demo note on forms (hidden once delivery is live) ---------- */
  if (window.TB_CONFIG && TB_CONFIG.formEndpoint) $$("[data-demo-note]").forEach(function (n) { n.parentNode.removeChild(n); });

  /* ---------- Show all (collapsed card grids on phones) ---------- */
  $$("[data-showall]").forEach(function (b) { b.addEventListener("click", function () { var g = b.previousElementSibling; g.classList.add("is-expanded"); var f = g.querySelector(".mini-card:nth-child(5)"); if (f) f.focus(); }); });

  /* ---------- Home: service switcher ---------- */
  var sw = $("[data-svc-switch]");
  if (sw) {
    var tabs = $$(".svc-tab", sw), panels = $$(".svc-panel", sw), cur = 0, timerStart = 0, paused = false, DUR = 7000, raf;
    function show(i, user) {
      cur = i;
      tabs.forEach(function (t, k) { t.classList.toggle("is-active", k === i); t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; var bar = t.querySelector(".svc-timer i"); if (bar) bar.style.transform = "scaleX(0)"; });
      panels.forEach(function (p, k) { p.classList.toggle("is-active", k === i); p.setAttribute("aria-hidden", k === i ? "false" : "true"); $$("a, button", p).forEach(function (a) { a.tabIndex = k === i ? 0 : -1; }); });
      timerStart = performance.now();
      if (user) paused = true;
    }
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () { show(k, true); });
      t.addEventListener("keydown", function (e) { var n = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (n) { e.preventDefault(); var j = (k + n + tabs.length) % tabs.length; show(j, true); tabs[j].focus(); } });
    });
    var visible = false;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) timerStart = performance.now() - (timerStart ? 0 : 0); }, { threshold: 0.3 }).observe(sw);
    sw.addEventListener("mouseenter", function () { sw._hover = true; });
    sw.addEventListener("mouseleave", function () { sw._hover = false; timerStart = performance.now() - (sw._elapsed || 0); });
    function loop(ts) {
      if (!paused && visible && !reduced) {
        if (sw._hover) { sw._elapsed = ts - timerStart; }
        else {
          var p = (ts - timerStart) / DUR;
          var bar = tabs[cur].querySelector(".svc-timer i"); if (bar) bar.style.transform = "scaleX(" + Math.min(1, p) + ")";
          if (p >= 1) show((cur + 1) % tabs.length);
        }
      }
      raf = requestAnimationFrame(loop);
    }
    show(0); raf = requestAnimationFrame(loop);
  }

  /* ---------- Steps line (mini dispatch) ---------- */
  $$(".steps-line").forEach(function (s) { s.setAttribute("data-inview", ""); if (io) io.observe(s); else s.classList.add("is-in"); });

  /* ---------- Legal TOC scrollspy ---------- */
  var toc = $(".legal-toc");
  if (toc && "IntersectionObserver" in window) {
    var links = $$("a", toc), map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove("is-active"); }); var l = map[e.target.id]; l && l.classList.add("is-active"); } });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var el = doc.getElementById(id); el && spy.observe(el); });
  }

  /* ---------- Hub diagram (services) ---------- */
  var hub = $("[data-hub]");
  if (hub) {
    var nodes = $$(".hub-node", hub), flows = $$(".hub-flow", hub), detail = $("[data-hub-detail]"), hi = 0, htimer;
    function act(i) {
      hi = i;
      nodes.forEach(function (n, k) { n.classList.toggle("is-active", k === i); });
      flows.forEach(function (f, k) { f.classList.toggle("is-active", k === i); });
      if (detail) { detail.style.opacity = 0; setTimeout(function () { detail.innerHTML = nodes[i].getAttribute("data-detail"); detail.style.opacity = 1; }, 180); }
    }
    nodes.forEach(function (n, k) {
      n.setAttribute("tabindex", "0"); n.setAttribute("role", "button");
      n.addEventListener("mouseenter", function () { clearInterval(htimer); act(k); });
      n.addEventListener("focus", function () { clearInterval(htimer); act(k); });
      n.addEventListener("click", function () { clearInterval(htimer); act(k); });
      n.addEventListener("keydown", function (e) { if (e.key === "Enter") { var h = n.getAttribute("data-href"); if (h) location.href = h; } });
      n.addEventListener("dblclick", function () { var h = n.getAttribute("data-href"); if (h) location.href = h; });
    });
    act(0);
    if (!reduced) htimer = setInterval(function () { act((hi + 1) % nodes.length); }, 3600);
  }
})();
