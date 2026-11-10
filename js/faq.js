/* Tri Brothers | FAQ search and topic filter */
(function () {
  "use strict";
  var input = document.getElementById("faqSearch"); if (!input) return;
  var items = Array.prototype.slice.call(document.querySelectorAll("#faqList .faq-item"));
  var cats = Array.prototype.slice.call(document.querySelectorAll(".faq-cat"));
  var empty = document.getElementById("faqEmpty"), cat = "all";
  items.forEach(function (it) {
    var q = it.querySelector(".faq-q"), a = it.querySelector(".faq-a p");
    it._q = q.firstChild.textContent; it._a = a.innerHTML;
  });
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function mark(html, term) {
    if (!term) return html;
    // only mark inside text, not inside tags
    return html.replace(/(^|>)([^<]+)(?=<|$)/g, function (m, a, txt) { return a + txt.replace(new RegExp("(" + esc(term) + ")", "gi"), "<mark>$1</mark>"); });
  }
  function apply() {
    var term = input.value.trim(), shown = 0;
    items.forEach(function (it) {
      var txt = (it._q + " " + it._a.replace(/<[^>]+>/g, "")).toLowerCase();
      var on = (cat === "all" || it.getAttribute("data-cat") === cat) && (!term || txt.indexOf(term.toLowerCase()) > -1);
      it.hidden = !on;
      it.querySelector(".faq-q").firstChild.textContent = it._q;
      var qEl = it.querySelector(".faq-q");
      if (term && on) { var span = qEl.querySelector(".qtxt"); }
      it.querySelector(".faq-a p").innerHTML = mark(it._a, term);
      if (on) shown++;
      if (term && on && !it.classList.contains("is-open")) { it.classList.add("is-open"); qEl.setAttribute("aria-expanded", "true"); }
    });
    empty.classList.toggle("is-on", shown === 0);
    cats.forEach(function (c) {
      var k = c.getAttribute("data-cat"), n = items.filter(function (it) {
        var txt = (it._q + " " + it._a.replace(/<[^>]+>/g, "")).toLowerCase();
        return (k === "all" || it.getAttribute("data-cat") === k) && (!term || txt.indexOf(term.toLowerCase()) > -1);
      }).length;
      c.querySelector("span").textContent = n; c.classList.toggle("is-dim", n === 0);
    });
  }
  input.addEventListener("input", apply);
  cats.forEach(function (c) {
    c.addEventListener("click", function () {
      cat = c.getAttribute("data-cat");
      cats.forEach(function (x) { x.classList.toggle("is-active", x === c); x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      apply();
    });
  });
  document.getElementById("faqReset").addEventListener("click", function () { input.value = ""; cat = "all"; cats.forEach(function (x, i) { x.classList.toggle("is-active", i === 0); x.setAttribute("aria-pressed", i === 0 ? "true" : "false"); }); apply(); input.focus(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
  if (items[0]) { items[0].classList.add("is-open"); items[0].querySelector(".faq-q").setAttribute("aria-expanded", "true"); }
})();
