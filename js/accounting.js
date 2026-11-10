/* Tri Brothers | accounting service explorer (illustrative visuals, no client data) */
(function () {
  "use strict";
  var tabs = document.getElementById("ledgerTabs"); if (!tabs) return;
  var T = document.getElementById("ledgerT"), P = document.getElementById("ledgerP"), L = document.getElementById("ledgerL"), V = document.getElementById("ledgerV"), N = document.getElementById("ledgerN");
  var TICK = '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>';
  var DATA = [
    { t: "Financial record management", p: "We organize and maintain accurate records of income, expenses and operational transactions for clear financial visibility.",
      l: [["Income and expenses recorded", "Every transaction captured and kept in order."], ["Operational transactions tracked", "Clear visibility across your operation."]],
      v: function () {
        var rows = [["Load settlement", "Income", "g"], ["Fuel", "Expense", "a"], ["Maintenance", "Expense", "a"], ["Broker payment", "Income", "g"], ["Insurance", "Expense", "a"], ["Tolls", "Expense", "a"]];
        return '<div class="lv-card"><div class="lv-head"><b>Transactions</b><span class="lv-tag">Illustration</span></div>' + rows.map(function (r, i) {
          return '<div class="lv-row" style="animation-delay:' + (i * .07) + 's"><span class="lv-dot ' + r[2] + '"></span><span>' + r[0] + '</span><span class="pill ' + r[2] + '">' + r[1] + '</span><span class="ui-skel" style="width:' + (40 + (i * 17) % 40) + 'px"></span></div>';
        }).join("") + '</div>';
      } },
    { t: "Expense tracking and categorization", p: "We monitor and classify business expenses to improve cost control and financial planning.",
      l: [["Expenses classified", "Costs grouped so patterns are easy to spot."], ["Better planning", "Clear categories support cost control."]],
      v: function () {
        var cats = [["Fuel", "#47bb3a", 34], ["Maintenance", "#152133", 22], ["Insurance", "#949fa1", 18], ["Tolls and permits", "#f3b23c", 14], ["Other", "#c6cfdb", 12]];
        var off = 0, C = 2 * Math.PI * 70, arcs = cats.map(function (c, i) {
          var len = C * c[2] / 100, s = '<circle cx="100" cy="100" r="70" fill="none" stroke="' + c[1] + '" stroke-width="26" stroke-dasharray="' + (len - 3) + ' ' + C + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 100 100)" class="lv-arc" style="animation-delay:' + (i * .12) + 's"/>';
          off += len; return s;
        }).join("");
        return '<div class="lv-card lv-donut"><div class="lv-head"><b>Expenses by category</b><span class="lv-tag">Illustration</span></div><div class="lv-donut-body"><svg viewBox="0 0 200 200">' + arcs + '<text x="100" y="96" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#5b6676">CATEGORIES</text><text x="100" y="118" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="22" fill="#152133">5</text></svg><ul>' +
          cats.map(function (c) { return '<li><i style="background:' + c[1] + '"></i>' + c[0] + '</li>'; }).join("") + '</ul></div></div>';
      } },
    { t: "Invoice and payment tracking", p: "We track incoming and outgoing payments to ensure timely settlements and reduce missed or delayed transactions.",
      l: [["Payments followed up", "Settlements tracked until they clear."], ["Nothing slips through", "Missed or delayed transactions reduced."]],
      v: function () {
        var inv = [["Invoice", "Paid", "g", 100], ["Invoice", "Paid", "g", 100], ["Invoice", "Pending", "b", 60], ["Invoice", "Follow-up", "a", 35]];
        return '<div class="lv-card"><div class="lv-head"><b>Invoices</b><span class="lv-tag">Illustration</span></div>' + inv.map(function (r, i) {
          return '<div class="lv-inv" style="animation-delay:' + (i * .08) + 's"><span class="lv-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg></span><span class="lv-inv-main"><b>' + r[0] + ' ' + String.fromCharCode(65 + i) + '</b><span class="lv-prog"><i style="width:' + r[3] + '%" class="' + r[2] + '"></i></span></span><span class="pill ' + r[2] + '">' + r[1] + '</span></div>';
        }).join("") + '</div>';
      } },
    { t: "Basic financial reporting", p: "We provide structured reports that help you understand performance, cash flow and your overall business position.",
      l: [["Performance at a glance", "See how the business is doing over time."], ["Cash flow understood", "Know your position before you decide."]],
      v: function () {
        var h = [42, 58, 50, 66, 74, 62, 86, 80];
        return '<div class="lv-card"><div class="lv-head"><b>Cash flow report</b><span class="lv-tag">Illustration</span></div><div class="lv-chart">' + h.map(function (x, i) {
          return '<span style="height:' + x + '%;animation-delay:' + (i * .06) + 's"' + (i === 6 ? ' class="hi"' : '') + '></span>';
        }).join("") + '</div><div class="lv-report"><span class="lv-ic g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span><span><b>Report ready</b><small>Performance, cash flow and position</small></span></div></div>';
      } }
  ];
  function show(i) {
    var d = DATA[i];
    [T, P, L, N].forEach(function (e) { e.classList.remove("lv-in"); });
    V.classList.remove("lv-in");
    N.textContent = "0" + (i + 1) + " / 04";
    T.textContent = d.t; P.textContent = d.p;
    L.innerHTML = d.l.map(function (x) { return "<li>" + TICK + "<span><strong>" + x[0] + "</strong><span>" + x[1] + "</span></span></li>"; }).join("");
    V.innerHTML = d.v();
    requestAnimationFrame(function () { [T, P, L, N, V].forEach(function (e) { void e.offsetWidth; e.classList.add("lv-in"); }); });
  }
  TB.inkTabs(tabs, function (k) { show(+k); });
  show(0);
})();
