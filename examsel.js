/* examsel.js — 詳解頁「證照 / 年份」選擇(含「全部」)+ 長列表分批顯示(單一來源)· v131
   ------------------------------------------------------------------
   用於:觀光複習、執業實務複習、執業法規複習、日文詳解、英語詳解
     EXAMSEL.cert(param, def)        網址 ?cert= → 全站記憶 pref_cert → 預設;值為 all / leader / guide
     EXAMSEL.years(list, cert)       該證照有的年份(由新到舊);cert = all 取聯集。list 為 [{c, y}]
     EXAMSEL.year(param, years)      網址 ?year=(all 或某一年)→ 不合法就用最新一年
     EXAMSEL.match(q, cert, year)    題目是否在目前範圍內
     EXAMSEL.sort(arr)               依年份新 → 舊、領隊 → 導遊、題號小 → 大
     EXAMSEL.single(cert, year)      只看單一份考卷(證照、年份都指定)
     EXAMSEL.cid(q, single)          題目卡片 id:單一份卷 = q37;多份卷 = qg108-37(避免題號重複)
     EXAMSEL.certChips / yearChips   篩選晶片(第一個是「全部」)
     EXAMSEL.scope(cert, year)       「導遊 + 領隊 · 全部年份」這類範圍說明
     EXAMSEL.syncUrl(cert, year)     篩選改變時寫回網址(不留 #)
     EXAMSEL.hash()                  解析 #q37 / #qg108-37 → { no, c?, y? }
     EXAMSEL.mount(box, units, render, opt)  分批顯示:先畫 opt.first 筆,捲到底自動再畫 opt.chunk 筆
       回傳 { all(), until(pred), shown() };opt.isQ(u) 判斷是不是題目(算「還有幾題」用)
   變更履歷:
     v131 (2026-10-06) 初版:年份與證照可選「全部」(使用者回饋:年度不能選全部、導遊領隊不能一起選)
*/
(function () {
  'use strict';
  var CN = { leader: '領隊', guide: '導遊' };
  var ORDER = { leader: 0, guide: 1 };

  function cert(param, def) {
    var ok = function (v) { return v === 'all' || v === 'leader' || v === 'guide'; };
    if (ok(param)) return param;
    var p = null;
    try { p = localStorage.getItem('pref_cert'); } catch (e) {}
    return ok(p) ? p : def;
  }
  function years(list, c) {
    var s = {};
    list.forEach(function (q) { if (c === 'all' || q.c === c) s[String(q.y)] = 1; });
    return Object.keys(s).sort(function (a, b) { return b - a; });
  }
  function year(param, ys) {
    if (param === 'all') return 'all';
    return ys.indexOf(String(param)) >= 0 ? String(param) : ys[0];
  }
  function match(q, c, y) { return (c === 'all' || q.c === c) && (y === 'all' || String(q.y) === String(y)); }
  function sort(arr) {
    return arr.sort(function (a, b) { return (b.y - a.y) || (ORDER[a.c] - ORDER[b.c]) || (a.no - b.no); });
  }
  function single(c, y) { return c !== 'all' && y !== 'all'; }
  function cid(q, one) { return one ? 'q' + q.no : 'q' + q.c.charAt(0) + q.y + '-' + q.no; }
  function certChips(cur, chip) {
    return [['all', '全部'], ['leader', '領隊'], ['guide', '導遊']].map(function (x) { return chip(x[0], x[1], x[0] === cur); }).join('');
  }
  function yearChips(ys, cur, chip) {
    return [chip('all', '全部', cur === 'all')].concat(ys.map(function (y) { return chip(y, y + '年', String(y) === String(cur)); })).join('');
  }
  function scope(c, y) {
    return (c === 'all' ? '導遊 + 領隊' : CN[c]) + ' · ' + (y === 'all' ? '全部年份' : y + ' 年');
  }
  /* 篩選改變時把範圍寫回網址(重新整理、從別頁按上一頁回來都會停在同一個範圍) */
  function syncUrl(c, y) {
    try {
      var u = new URL(location.href);
      u.searchParams.set('cert', c); u.searchParams.set('year', y);
      history.replaceState(null, '', u.pathname + u.search);
    } catch (e) {}
  }
  function hash() {
    var h = location.hash || '', m;
    if ((m = h.match(/^#q(\d+)$/))) return { no: +m[1] };
    if ((m = h.match(/^#q([gl])(\d{3})-(\d+)$/))) return { c: m[1] === 'g' ? 'guide' : 'leader', y: m[2], no: +m[3] };
    return null;
  }
  function mount(box, units, render, opt) {
    opt = opt || {};
    var chunk = opt.chunk || 40, first = opt.first || chunk, i = 0, sent = null, io = null;
    var isQ = opt.isQ || function () { return true; };
    var total = units.filter(isQ).length;
    if (box._lv && box._lv.io) box._lv.io.disconnect();
    box.innerHTML = '';
    function more(n) {
      var end = Math.min(units.length, i + (n || chunk)), html = '';
      for (; i < end; i++) html += render(units[i], i);
      if (sent) { sent.remove(); sent = null; }
      box.insertAdjacentHTML('beforeend', html);
      if (i < units.length) {
        var left = units.slice(i).filter(isQ).length;
        sent = document.createElement('div');
        sent.className = 'lv-more';
        sent.innerHTML = '<button type="button">顯示更多(已顯示 ' + (total - left) + ' / ' + total + ' 題)</button>';
        sent.querySelector('button').onclick = function () { more(); };
        box.appendChild(sent);
        if (io) io.observe(sent);
      }
      if (opt.after) opt.after();
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) more(); }); }, { rootMargin: '800px 0px' });
    }
    var ctl = {
      io: io,
      all: function () { if (i < units.length) more(units.length - i); },
      until: function (pred) {
        for (var k = 0; k < units.length; k++) if (pred(units[k])) { if (k >= i) more(k - i + 1); return true; }
        return false;
      },
      shown: function () { return i; }
    };
    box._lv = ctl;
    more(first);
    return ctl;
  }
  try {
    var css = document.createElement('style');
    css.textContent = '.lv-more{text-align:center;margin:14px 0 24px}.lv-more button{border:1.5px solid var(--line,#e2e8f2);background:var(--card,#fff);color:var(--ink,#1c2330);' +
      'border-radius:12px;padding:10px 18px;font-weight:700;font-family:inherit;cursor:pointer;font-size:.88rem}' +
      '.exh{margin:22px 0 8px;padding:8px 12px;border-radius:12px;background:var(--selbg,var(--soft,#eef2f7));font-weight:800;font-size:.92rem;color:var(--ink,#1c2330)}' +
      '.exh small{font-weight:600;color:var(--sub,#5a6b82);margin-left:6px}@media print{.lv-more{display:none}}';
    document.head.appendChild(css);
  } catch (e) {}
  window.EXAMSEL = { cert: cert, years: years, year: year, match: match, sort: sort, single: single, cid: cid,
    certChips: certChips, yearChips: yearChips, scope: scope, hash: hash, mount: mount, syncUrl: syncUrl, CN: CN };
})();
