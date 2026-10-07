/* ana.js — 詳解排版(單一來源)· v135
   ------------------------------------------------------------------
   中文三科解析 a 欄的「詳細版」結構:
     答 <b class='ac'>X 選項</b>
     <div class='xa'>
       <div class='xh'>📖 詳解</div><p>…</p>
       <div class='xh'>🔍 選項分析</div><ul class='xo'><li>…</li><li class='ok'>…</li></ul>
       <div class='xh'>🔍 逐項判斷</div><ul class='xo xst'><li class='ok'><b>①</b> ✔ …</li><li><b>②</b> ✘ …</li></ul>
       <div class='xh'>📌 延伸整理</div><div class='xtw'><table class='xt'>…</table></div>
       <ol class='xs'>步驟</ol>
       <div class='xh'>⚖️ 法規依據</div><div class='xl'>條文</div>
       <figure class='xm' data-twmap='…'>(臺灣位置圖)  <figure class='xm' data-tline='…'>(時間軸)
       <div class='xh'>📚 歷屆同考點</div><ul class='xo xrl'><li><a href='…'>導遊 110 第 3 題</a>:…</li></ul>
     </div>
   這支負責樣式(各頁共用,含深色模式)、快問收合、解析內地圖與時間軸;內容寫在 gh_ana.js / pr_ana.js / pr2_ana.js。
   ANAUI.compact(html)  快問、小測驗彈窗用:詳細內容收進「📖 看完整解析」,作答節奏不被長文打斷
   (名稱用 ANAUI:執業實務 / 法規複習頁自己有一個叫 ANA 的解析資料變數,避免同名)
   解析內地圖:<figure class='xm' data-twmap='地名|地名=標籤|地名=標籤@l' data-ranges='1'>,自動載入 twmap.js 畫出
     標籤結尾 @r / @l / @u / @d = 優先放在右 / 左 / 上 / 下(避免壓到山脈線)
   時間軸:<figure class='xm' data-tline='1624=荷蘭人占領大員|1652=*郭懷一事件' data-era='tw'>
     年份可寫 1683、1895-1945(期間)、前221(西元前);事件前加 * = 本題重點(綠色);data-era='none' 不分時期
   ANAUI.tline(items, {era}) / ANAUI.eraBar() → HTML(觀光圖鑑「臺灣史年表」也用)
   變更履歷:
     v135 (2026-10-07) 時間軸、臺灣歷史分期圖、逐項判斷與歷屆同考點樣式
     v134 (2026-10-06) 初版
*/
(function () {
  'use strict';
  try {
    var css = document.createElement('style');
    css.textContent =
      '.xa{margin-top:8px;line-height:1.75}' +
      '.xa .xh{font-weight:800;font-size:.86rem;margin:12px 0 4px;color:var(--accent,#2563eb)}' +
      '.xa .xh:first-child{margin-top:4px}' +
      '.xa p{margin:4px 0}' +
      '.xa ul.xo,.xa ol.xs{margin:4px 0;padding-left:1.25em}' +
      '.xa ul.xo li,.xa ol.xs li{margin:3px 0}' +
      '.xa ul.xo li.ok{color:var(--ok,#15803d)}.xa ul.xo li.ok b{color:var(--ok,#15803d)}' +
      '.xa ul.xst{list-style:none;padding-left:.2em}' +
      '.xa ul.xrl{list-style:none;padding-left:.2em}.xa ul.xrl li{margin:4px 0}' +
      '.xa ul.xrl a{display:inline-block;border:1px solid var(--line,#d8dee9);border-radius:999px;padding:0 9px;margin-right:4px;font-size:.78rem;font-weight:700;text-decoration:none;color:var(--accent,#2563eb);white-space:nowrap}' +
      '.xa .xtw{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:6px 0}' +
      '.xa table.xt{border-collapse:collapse;width:100%;font-size:.84rem;line-height:1.55}' +
      '.xa table.xt th,.xa table.xt td{border:1px solid var(--line,#d8dee9);padding:5px 7px;text-align:left;vertical-align:top}' +
      '.xa table.xt th{background:rgba(127,127,127,.12);font-weight:800;white-space:nowrap}' +
      '.xa table.xt tr.ok td{background:rgba(34,197,94,.12);font-weight:700}' +
      '.xa .xl{border-left:3px solid var(--accent,#2563eb);background:rgba(127,127,127,.08);padding:7px 10px;border-radius:0 8px 8px 0;font-size:.86rem;margin:6px 0}' +
      '.xa figure.xm{margin:8px 0;text-align:center}.xa figure.xm img,.xa figure.xm svg{max-width:100%;height:auto}' +
      '.xa figure.xm figcaption{font-size:.78rem;color:var(--sub,#5a6b82);margin-top:2px}' +
      /* 時間軸 */
      '.tl{max-width:460px;margin:4px auto 2px;text-align:left;font-size:.84rem;line-height:1.5}' +
      '.tl-e{margin:8px 0 2px;padding:1px 8px;border-left:4px solid var(--c);color:var(--c);font-weight:800;font-size:.78rem}' +
      '.tl-e:first-child{margin-top:2px}.tl-e small{font-weight:700;opacity:.85;margin-left:4px}' +
      '.tl-r{display:flex;gap:6px;align-items:flex-start}' +
      '.tl-y{flex:0 0 var(--yw,4.9em);text-align:right;font-weight:800;color:var(--sub,#5a6b82);font-variant-numeric:tabular-nums;white-space:nowrap}' +
      '.tl-d{flex:0 0 12px;align-self:stretch;position:relative}' +
      '.tl-d:before{content:"";position:absolute;left:5px;top:0;bottom:0;width:2px;background:var(--line,#d8dee9)}' +
      '.tl-d:after{content:"";position:absolute;left:1px;top:.42em;width:10px;height:10px;border-radius:50%;background:var(--c,#64748b);box-shadow:0 0 0 2px var(--card,#fff)}' +
      '.tl-t{flex:1;padding:0 0 4px}' +
      '.tl-r.hi .tl-t{font-weight:800;color:var(--ok,#15803d)}.tl-r.hi .tl-d:after{background:var(--ok,#16a34a);box-shadow:0 0 0 3px rgba(34,197,94,.3)}' +
      /* 歷史分期長條圖 */
      '.era{max-width:460px;margin:4px auto;font-size:.8rem}' +
      '.era-r{display:flex;align-items:center;gap:6px;margin:3px 0}' +
      '.era-n{flex:0 0 4.4em;font-weight:800;color:var(--c)}.era-y{flex:0 0 6.6em;color:var(--sub,#5a6b82);font-variant-numeric:tabular-nums}' +
      '.era-b{flex:1;position:relative;height:14px}' +
      '.era-b i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--c)}' +
      '.era-b span{position:absolute;top:-1px;font-weight:800;font-size:.74rem;color:var(--ink,#1c2330);white-space:nowrap}' +
      'details.xad{margin-top:6px}details.xad>summary{cursor:pointer;font-weight:800;font-size:.86rem;color:var(--accent,#2563eb);list-style:none}' +
      'details.xad>summary::-webkit-details-marker{display:none}details.xad[open]>summary{margin-bottom:2px}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  function compact(html) {
    var s = String(html == null ? '' : html), i = s.indexOf("<div class='xa'>");
    if (i < 0) return s;
    return s.slice(0, i) + "<details class='xad'><summary>📖 看完整解析</summary>" + s.slice(i) + '</details>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---- 時間軸 ---- */
  /* 臺灣史分期(年份 → 時期):荷蘭 1624 進入大員;1662 鄭成功逐荷;1683 清領;1895 日治;1945 戰後 */
  var ERA_TW = [
    { s: -1e9, e: 1624, n: '史前時代', y: '~1624', c: '#64748b' },
    { s: 1624, e: 1662, n: '荷西時期', y: '1624–1662', c: '#0284c7' },
    { s: 1662, e: 1683, n: '明鄭時期', y: '1662–1683', c: '#16a34a' },
    { s: 1683, e: 1895, n: '清領時期', y: '1683–1895', c: '#d97706' },
    { s: 1895, e: 1945, n: '日治時期', y: '1895–1945', c: '#dc2626' },
    { s: 1945, e: 1e9, n: '戰後', y: '1945–', c: '#7c3aed' }
  ];
  /* 年份字串 → 排序用數字:1683 / 1895-1945 / 前221 / 17世紀(=1650) */
  function yNum(y) {
    y = String(y).trim();
    var m = y.match(/^前\s*(\d+)/); if (m) return -(+m[1]);
    m = y.match(/^(\d+)\s*世紀/); if (m) return (+m[1] - 1) * 100 + 50;
    m = y.match(/^(\d{1,4})/); return m ? +m[1] : 0;
  }
  function yLabel(y) { return esc(String(y).trim().replace(/^(\d+)\s*-\s*(\d+)$/, '$1–$2')); }
  function eraOf(n) { for (var i = 0; i < ERA_TW.length; i++) if (n >= ERA_TW[i].s && n < ERA_TW[i].e) return ERA_TW[i]; return ERA_TW[0]; }
  /* items:[{y:'1652', t:'郭懷一事件', hi:true}];opt.era:'tw'(預設,依年份分時期)/ 'none' */
  function tline(items, opt) {
    opt = opt || {};
    var useEra = opt.era !== 'none', last = null, yw = 3;
    (items || []).forEach(function (x) { var n = String(x.y).trim().replace(/-/, '–').length; if (n > yw) yw = n; });
    var o = '<div class="tl" style="--yw:' + Math.max(3.4, yw * 0.6 + 0.8).toFixed(1) + 'em">';
    (items || []).map(function (x, i) { return { x: x, n: yNum(x.y), i: i }; })
      .sort(function (a, b) { return a.n - b.n || a.i - b.i; })
      .forEach(function (r) {
        var era = useEra ? eraOf(r.n) : null, c = era ? era.c : '#64748b';
        if (era && era !== last) { o += '<div class="tl-e" style="--c:' + era.c + '">' + era.n + '<small>' + era.y + '</small></div>'; last = era; }
        o += '<div class="tl-r' + (r.x.hi ? ' hi' : '') + '" style="--c:' + c + '"><span class="tl-y">' + yLabel(r.x.y) + '</span><span class="tl-d"></span><span class="tl-t">' + r.x.t + '</span></div>';
      });
    return o + '</div>';
  }
  /* 臺灣歷史分期長條圖(長度＝統治年數;戰後算到今年) */
  function eraBar() {
    var now = new Date().getFullYear(), rows = ERA_TW.slice(1), max = 0;
    rows.forEach(function (r) { r.len = Math.min(r.e, now) - r.s; if (r.len > max) max = r.len; });
    return '<div class="era">' + rows.map(function (r) {
      var w = Math.max(2, Math.round(r.len / max * 74)), lab = r.len + ' 年';   // 最長一條佔 74%,留位置給年數
      return '<div class="era-r" style="--c:' + r.c + '"><span class="era-n">' + r.n + '</span><span class="era-y">' + r.y + '</span><span class="era-b"><i style="width:' + w + '%"></i><span style="left:calc(' + w + '% + 4px)">' + lab + '</span></span></div>';
    }).join('') + '</div>';
  }
  function parseTline(s) {
    return String(s || '').split('|').filter(Boolean).map(function (x) {
      var k = x.indexOf('='), y = k > 0 ? x.slice(0, k) : '', t = k > 0 ? x.slice(k + 1) : x, hi = t.charAt(0) === '*';
      return { y: y, t: hi ? t.slice(1) : t, hi: hi };
    });
  }

  /* ---- 解析裡的地圖 ---- */
  var waiting = [], loading = false;
  function needMap(cb) {
    if (window.TWMAP) return cb();
    waiting.push(cb);
    if (loading) return;
    loading = true;
    var sc = document.createElement('script');
    sc.src = 'twmap.js';
    sc.onload = function () { var q = waiting; waiting = []; q.forEach(function (f) { try { f(); } catch (e) {} }); };
    sc.onerror = function () { loading = false; waiting = []; };
    document.head.appendChild(sc);
  }
  function hydrate() {
    var tls = document.querySelectorAll('figure.xm[data-tline]:not([data-done])');
    Array.prototype.forEach.call(tls, function (f) {
      f.setAttribute('data-done', '1');
      f.insertAdjacentHTML('afterbegin', tline(parseTline(f.getAttribute('data-tline')), { era: f.getAttribute('data-era') || 'tw' }));
    });
    var figs = document.querySelectorAll('figure.xm[data-twmap]:not([data-done])');
    if (!figs.length) return;
    needMap(function () {
      Array.prototype.forEach.call(figs, function (f) {
        if (f.getAttribute('data-done')) return;
        f.setAttribute('data-done', '1');
        var marks = f.getAttribute('data-twmap').split('|').filter(Boolean).map(function (x) { var kv = x.split('='), lb = kv[1] || '', at = lb.lastIndexOf('@'), side = ''; if (at > 0 && /^[rlud]$/.test(lb.slice(at + 1))) { side = lb.slice(at + 1); lb = lb.slice(0, at); } return { k: kv[0], label: lb || undefined, side: side }; });
        var ranges = f.getAttribute('data-ranges') === '1';
        f.insertAdjacentHTML('afterbegin', window.TWMAP.svg({ marks: marks, labels: true, ranges: ranges }) + (ranges ? window.TWMAP.rangeLegend : '') + window.TWMAP.note);
      });
    });
  }
  var pend = false;
  function schedule() { if (pend) return; pend = true; (window.requestAnimationFrame || setTimeout)(function () { pend = false; hydrate(); }); }
  try { if ('MutationObserver' in window) new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  if (document.readyState !== 'loading') schedule(); else document.addEventListener('DOMContentLoaded', schedule);
  window.ANAUI = { compact: compact, maps: hydrate, tline: tline, eraBar: eraBar, era: ERA_TW, parseTline: parseTline };
})();
