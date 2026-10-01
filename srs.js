/* 間隔複習(SSoT)· C9 v126
   ------------------------------------------------------------------
   錯題本每一題記錄複習進度(直接存在錯題本該題的資料裡):
     box  目前在第幾關(0–3 → 第 1–4 關)
     due  下次複習日(本地午夜的毫秒);沒有 due 的錯題 → 收錄(ts)隔天到期
   規則(1、3、7、14 天):
     答錯           → 回到第 1 關,明天再複習
     到期且答對     → 往下一關:3 天後 → 7 天後 → 14 天後;第 4 關再答對 = 已掌握,移出錯題本
     還沒到期就答對 → 排程不變(今天不算進度,避免一天內把間隔刷完)
   用於:五個錯題本頁(?due=1 只看今日到期 + 直接自測)、英語詳解自測、首頁「今日複習」
*/
(function () {
  'use strict';
  var DAY = 86400000, NEXT = [1, 3, 7, 14];
  function day0(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function dueAt(e) { if (!e) return 0; if (e.due) return +e.due; return e.ts ? day0(+e.ts) + DAY : 0; }
  function isDue(e, now) { return dueAt(e) <= (now || Date.now()); }
  function days(e, now) { now = now || Date.now(); return Math.max(0, Math.round((dueAt(e) - day0(now)) / DAY)); }
  function stage(e) { return Math.min(3, Math.max(0, +(e && e.box) || 0)); }
  /* 作答:回傳 {act:'reset'|'early'|'advance'|'mastered', box, days};會直接改 e(呼叫端負責存檔 / 移除) */
  function answer(e, ok, now) {
    now = now || Date.now();
    if (!ok) { e.box = 0; e.due = day0(now) + DAY; e.wrong = (+e.wrong || 1) + 1; return { act: 'reset', box: 0, days: 1 }; }
    if (!isDue(e, now)) return { act: 'early', box: stage(e), days: days(e, now) };
    var b = stage(e);
    if (b >= 3) return { act: 'mastered', box: 4, days: 0 };
    e.box = b + 1; e.due = day0(now) + NEXT[e.box] * DAY;
    return { act: 'advance', box: e.box, days: NEXT[e.box] };
  }
  function when(e, now) { var d = days(e, now); return d <= 0 ? '今天' : d === 1 ? '明天' : d + ' 天後'; }
  function badge(e, now) {
    var due = isDue(e, now), st = stage(e) + 1;
    return '<span class="srs' + (due ? ' due' : '') + '" title="間隔複習:第 ' + st + '/4 關,' + (due ? '今天該複習' : when(e, now) + '再複習') + '">' +
      (due ? '📅 今天複習' : '⏳ ' + when(e, now)) + ' · ' + st + '/4</span>';
  }
  function msg(r, ansLabel) {
    if (r.act === 'reset') return '✗ 又錯了,正解是 ' + ansLabel + ' — 回到第 1 關,明天再複習';
    if (r.act === 'mastered') return '🎓 已掌握!4 關都答對,移出錯題本';
    if (r.act === 'early') return '✅ 答對!這題排在' + (r.days <= 1 ? '明天' : ' ' + r.days + ' 天後') + '複習,今天先不算進度';
    return '✅ 答對!過了第 ' + r.box + '/4 關,' + r.days + ' 天後再複習';
  }
  function countDue(o, now) { var n = 0; for (var k in o) if (isDue(o[k], now)) n++; return n; }
  window.SRS = { DAY: DAY, NEXT: NEXT, day0: day0, dueAt: dueAt, isDue: isDue, days: days, stage: stage, answer: answer, when: when, badge: badge, msg: msg, countDue: countDue };
  try {
    var css = document.createElement('style');
    var D = function (p) { return p + '.srs{background:#26303d;color:#b8c4d6}' + p + '.srs.due{background:#4a3a10;color:#fcd34d}'; };
    css.textContent = '.srs{display:inline-block;font-size:.72rem;font-weight:700;border-radius:10px;padding:1px 8px;white-space:nowrap;background:#eef1f6;color:#5a6b82}' +
      '.srs.due{background:#fef3c7;color:#92400e}' +
      '@media (prefers-color-scheme:dark){' + D(':root:not([data-theme="light"]) ') + '}' + D(':root[data-theme="dark"] ');
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
})();
