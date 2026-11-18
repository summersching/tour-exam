/* ana.js — 詳解排版(單一來源)· v296
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
         點題號不換頁:原地跳出那一題(題目、選項、詳解),視窗裡可再換題、回上一題,底部才連到題庫(v296;講義的詳解視窗自己處理)
     </div>
   這支負責樣式(各頁共用,含深色模式)、快問收合、解析內地圖與時間軸;內容寫在 gh_ana.js / pr_ana.js / pr2_ana.js。
   ANAUI.compact(html)  快問、小測驗彈窗用:詳細內容收進「📖 看完整解析」,作答節奏不被長文打斷
   (名稱用 ANAUI:執業實務 / 法規複習頁自己有一個叫 ANA 的解析資料變數,避免同名)
   解析內地圖:<figure class='xm' data-twmap='地名|地名=標籤|地名=標籤@l' data-ranges='1'>,自動載入 twmap.js(地名庫)
     與 twgeo.js(縣市底圖)畫出;縣市底圖載入失敗時退回 twmap.js 的臺灣輪廓圖
     標籤結尾 @r / @l / @u / @d = 優先放在右 / 左 / 上 / 下(避免壓到山脈線)
   世界地圖:<figure class='xm' data-wmap='北角=挪威北角|羅瓦涅米' data-rivers='萊茵河' data-seas='北海' data-flows='北大西洋暖流' data-view='world'>,自動載入 worldmap.js
     data-view 省略 = 依標記自動放大;'world' = 全世界;也可給「西經,南緯,東經,北緯」;data-flows = 洋流、季風箭頭(名稱見 WMAP.flows)
     圖上自動標出國家名稱(全世界圖標洲名),放大的圖在角落加世界位置小圖
   時間軸:<figure class='xm' data-tline='1624=荷蘭人占領大員|1652=*郭懷一事件' data-era='tw'>
     年份可寫 1683、1895-1945(期間)、前221(西元前)、史前(排最前面);事件前加 * = 本題重點(綠色);data-era='none' 不分時期
   ANAUI.tline(items, {era}) / ANAUI.eraBar() → HTML(觀光圖鑑「臺灣史年表」也用)
   變更履歷:
     v296 (2026-11-18) 歷屆同考點點了不換頁:原地跳出那一題的小視窗(複習頁、錯題本、模擬測驗等;講義詳解視窗另外處理)
     v166 (2026-11-17) 地圖程式網址改 worldmap.js?v=166(地名庫加桂林、張家界、黃山、富士山)、twgeo.js?v=163(靜態圖可指定圖層)
     v165 (2026-10-20) 世界地圖程式網址改 worldmap.js?v=165(地名庫加入領隊 106 觀光資源解析用的地名與長江)
     v164 (2026-10-20) 世界地圖程式網址改 worldmap.js?v=164(地名庫加入領隊 107 觀光資源解析用的地名與黃河、恆河、布拉馬普特拉河)
     v163 (2026-10-20) 世界地圖程式網址改 worldmap.js?v=163(地名庫加入領隊 108 觀光資源解析用的地名與三江並流)
     v162 (2026-10-19) 臺灣位置圖改用圖鑑那張縣市底圖(看得出在哪個縣市);世界地圖加國家名稱與世界位置小圖
     v161 (2026-10-19) 解析內世界地圖支援洋流、季風箭頭(data-flows)
     v140 (2026-10-08) 時間軸年份「史前」一律排在最前面(原本當成 0,會排到西元前之後)
     v136 (2026-10-07) 解析內世界地圖(worldmap.js,用到才載入)
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
      '.xa figure.xm .tgm{max-width:420px}.xm-nt{font-size:.74rem;color:var(--sub,#64748b);text-align:center;margin-top:2px;line-height:1.45}' +
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
    if (/^史前/.test(y)) return -1e6;   /* 史前:排在所有西元前年份之前 */
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

  /* ---- 解析裡的地圖:用到才載入 twmap.js(臺灣)/ worldmap.js(世界) ---- */
  var LIBS = {};
  function need(file, ready, cb, bad) {
    if (ready()) return cb();
    var L = LIBS[file] || (LIBS[file] = { wait: [], loading: false });
    L.wait.push([cb, bad]);
    if (L.loading) return;
    L.loading = true;
    var sc = document.createElement('script');
    sc.src = file;
    function done(ok) { var q = L.wait; L.wait = []; L.loading = false; q.forEach(function (w) { var f = ok && ready() ? w[0] : w[1]; if (f) try { f(); } catch (e) {} }); }
    sc.onload = function () { done(true); };
    sc.onerror = function () { done(false); };
    document.head.appendChild(sc);
  }
  function needMap(cb) { need('twmap.js', function () { return !!window.TWMAP; }, cb); }
  function needWorld(cb) { need('worldmap.js?v=166', function () { return !!(window.WMAP && window.WMAP.noteAna); }, cb); }
  /* 縣市底圖(twgeo_data.js → twgeo.js);cb(true) = 可用,cb(false) = 載入失敗,改畫輪廓圖 */
  function needGeo(cb) {
    need('twgeo_data.js?v=152', function () { return !!window.TWGEO_DATA; }, function () {
      need('twgeo.js?v=163', function () { return !!(window.TWGEO && window.TWGEO.svg); }, function () { cb(true); }, function () { cb(false); });
    }, function () { cb(false); });
  }
  var TWCOL = { np: '#16a34a', nsa: '#ea580c', pt: '#dc2626' };
  function geoSvg(marks, ranges) {
    try {
      var mk = [];
      marks.forEach(function (m) {
        var p = window.TWMAP.get(m.k); if (!p) return;
        mk.push({ n: p.k, p: [p.lon, p.lat], lab: m.label || p.k.replace(/(國家風景區|國家公園|國家自然公園)$/, ''), c: TWCOL[m.c || p.c] || TWCOL.pt, side: m.side || '' });
      });
      return mk.length ? window.TWGEO.svg({ marks: mk, mt: ranges ? 1 : 0 }) : '';
    } catch (e) { return ''; }
  }
  function geoNote(sv) {
    var m = String(sv).match(/aria-label="臺灣位置示意圖 · ([^"]+)"/), v = m ? m[1] : '全臺', a = ['示意圖'];
    if (v === '全臺') a.push('金門、馬祖在左上小框' + (sv.indexOf('東沙環礁') >= 0 ? ',東沙在下方小框' : ''));
    else a.push('放大到' + v);
    a.push('縣市界線:內政部國土測繪中心開放資料(政府資料開放授權條款第 1 版)');
    return '<div class="xm-nt">' + a.join(' · ') + '</div>';
  }
  function parseMarks(s) {
    return String(s || '').split('|').filter(Boolean).map(function (x) { var kv = x.split('='), lb = kv[1] || '', at = lb.lastIndexOf('@'), side = ''; if (at > 0 && /^[rlud]$/.test(lb.slice(at + 1))) { side = lb.slice(at + 1); lb = lb.slice(0, at); } return { k: kv[0], label: lb || undefined, side: side }; });
  }
  function hydrate() {
    var tls = document.querySelectorAll('figure.xm[data-tline]:not([data-done])');
    Array.prototype.forEach.call(tls, function (f) {
      f.setAttribute('data-done', '1');
      f.insertAdjacentHTML('afterbegin', tline(parseTline(f.getAttribute('data-tline')), { era: f.getAttribute('data-era') || 'tw' }));
    });
    var wfs = document.querySelectorAll('figure.xm[data-wmap]:not([data-done])');
    if (wfs.length) needWorld(function () {
      Array.prototype.forEach.call(wfs, function (f) {
        if (f.getAttribute('data-done')) return;
        f.setAttribute('data-done', '1');
        var vw = f.getAttribute('data-view') || 'auto', rv = f.getAttribute('data-rivers');
        if (/^-?[\d.]+(,-?[\d.]+){3}$/.test(vw)) vw = vw.split(',').map(Number);
        var se = f.getAttribute('data-seas'), fl = f.getAttribute('data-flows');
        var ws = window.WMAP.svg({ marks: parseMarks(f.getAttribute('data-wmap')), rivers: rv ? rv.split('|') : [], seas: se ? se.split('|') : [], flows: fl ? fl.split('|') : [], view: vw, countries: true, locator: true });
        f.insertAdjacentHTML('afterbegin', ws + window.WMAP.noteAna(ws));
      });
    });
    var figs = document.querySelectorAll('figure.xm[data-twmap]:not([data-done])');
    if (!figs.length) return;
    needMap(function () {
      needGeo(function (geo) {
        Array.prototype.forEach.call(figs, function (f) {
          if (f.getAttribute('data-done')) return;
          f.setAttribute('data-done', '1');
          var marks = parseMarks(f.getAttribute('data-twmap'));
          var ranges = f.getAttribute('data-ranges') === '1';
          var gs = geo ? geoSvg(marks, ranges) : '';
          if (gs) f.insertAdjacentHTML('afterbegin', gs + (ranges ? window.TWMAP.rangeLegend : '') + geoNote(gs));
          else f.insertAdjacentHTML('afterbegin', window.TWMAP.svg({ marks: marks, labels: true, ranges: ranges }) + (ranges ? window.TWMAP.rangeLegend : '') + window.TWMAP.note);
        });
      });
    });
  }
  var pend = false;
  function schedule() { if (pend) return; pend = true; (window.requestAnimationFrame || setTimeout)(function () { pend = false; hydrate(); }); }
  try { if ('MutationObserver' in window) new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  if (document.readyState !== 'loading') schedule(); else document.addEventListener('DOMContentLoaded', schedule);
  /* v296 歷屆同考點:點題號不換頁,在原地跳出那一題(題目、選項、詳解);視窗裡再點同考點會換題,上方「← 回到上一題」一路退回;
     視窗底部「到題庫看這一年」才真的換頁。講義的詳解視窗自己處理(這裡看到 defaultPrevented 或在 #xsheet 裡就不管);
     按住 Ctrl / ⌘ / Shift / Alt 或用中鍵點,照一般連結開新分頁 */
  var QPAGES = { '觀光複習.html': 'gh', '執業實務複習.html': 'pr', '執業法規複習.html': 'pr2' };
  var QP = { el: null, open: false, hist: [], cur: null, from: null };
  function qpEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function qpRef(href) {
    try {
      var u = new URL(href, location.href), f = u.pathname.split('/').pop();
      try { f = decodeURIComponent(f); } catch (e) {}
      var s = QPAGES[f], c = u.searchParams.get('cert'), y = u.searchParams.get('year'), m = /^#q(\d+)$/.exec(u.hash || '');
      return s && c && y && m ? { s: s, key: c + '-' + y + '-' + m[1], href: href } : null;
    } catch (e) { return null; }
  }
  function qpNeed() {
    if (window.PRACTICE) return Promise.resolve();
    return new Promise(function (ok, no) { var t = document.createElement('script'); t.src = 'practice.js'; t.onload = ok; t.onerror = no; document.head.appendChild(t); });
  }
  try {
    var qcss = document.createElement('style');
    qcss.textContent =
      '#qpk{position:fixed;inset:0;z-index:10050;display:flex;flex-direction:column;justify-content:flex-end;background:rgba(15,20,30,.45)}' +
      '#qpk[hidden]{display:none}' +
      '#qpk .qp-box{background:var(--bg,#f4f6f9);color:var(--ink,#1c2330);width:100%;max-width:760px;margin:0 auto;max-height:88vh;display:flex;flex-direction:column;border-radius:16px 16px 0 0;box-shadow:0 -6px 24px rgba(0,0,0,.22)}' +
      '#qpk .qp-hd{display:flex;align-items:center;gap:8px;padding:10px 12px 10px 16px;border-bottom:1px solid var(--line,#e2e8f2)}' +
      '#qpk .qp-t{flex:1;font-size:.88rem;color:var(--accent,#2563eb)}' +
      '#qpk .qp-x{flex:none;border:0;background:var(--line,#e2e8f2);color:var(--ink,#1c2330);border-radius:50%;width:36px;height:36px;font-size:1rem;cursor:pointer;font-family:inherit}' +
      '#qpk .qp-bd{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:12px 16px calc(18px + env(safe-area-inset-bottom));line-height:1.75}' +
      '#qpk .qp-back{display:inline-block;margin:0 0 10px;border:1.5px solid var(--accent,#2563eb);background:var(--card,#fff);color:var(--accent,#2563eb);border-radius:999px;padding:5px 13px;font-weight:700;font-size:.84rem;font-family:inherit;cursor:pointer}' +
      '#qpk .qp-stem{font-weight:700;margin:2px 0 6px}' +
      '#qpk .qp-op{font-size:.92rem;padding:3px 0}#qpk .qp-op.ok{color:var(--ok,#15803d);font-weight:800}' +
      '#qpk .qp-ana{font-size:.92rem;margin-top:8px}' +
      '#qpk .qp-bx{border:1px solid var(--line,#e2e8f2);background:var(--card,#fff);border-radius:10px;padding:8px 11px;margin:10px 0;font-size:.9rem}' +
      '#qpk .qp-na{color:var(--sub,#5a6b82);padding:12px 0}' +
      '#qpk .qp-go{display:block;margin-top:14px;font-size:.86rem;font-weight:700;color:var(--accent,#2563eb)}' +
      'html.qp-lock,html.qp-lock body{overflow:hidden}' +
      '@media print{#qpk{display:none!important}}';
    (document.head || document.documentElement).appendChild(qcss);
  } catch (e) {}
  function qpMount() {
    if (QP.el) return QP.el;
    var el = document.createElement('div'); el.id = 'qpk'; el.hidden = true;
    el.innerHTML = '<div class="qp-box" role="dialog" aria-modal="true" aria-labelledby="qpT"><div class="qp-hd"><b class="qp-t" id="qpT"></b><button class="qp-x" type="button" aria-label="關閉,回到原本的位置">✕</button></div><div class="qp-bd"></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.closest('.qp-x')) { qpClose(); return; }
      if (e.target.closest('[data-qpback]')) { var p = QP.hist.pop(); if (p) qpShow(p); }
    });
    QP.el = el;
    return el;
  }
  function qpSet(title, html) {
    var el = qpMount();
    el.querySelector('.qp-t').textContent = title;
    var bd = el.querySelector('.qp-bd'); bd.innerHTML = html; bd.scrollTop = 0;
    if (!QP.open) {
      QP.open = true; el.hidden = false; document.documentElement.classList.add('qp-lock');
      try { history.pushState({ qp: 1 }, ''); } catch (e) {}
      try { el.querySelector('.qp-x').focus({ preventScroll: true }); } catch (e) {}
    }
    hydrate();
  }
  function qpHide() {
    if (!QP.el || !QP.open) return;
    QP.open = false; QP.el.hidden = true; document.documentElement.classList.remove('qp-lock'); QP.hist = []; QP.cur = null;
    try { if (QP.from && QP.from.isConnected) QP.from.focus({ preventScroll: true }); } catch (e) {}
    QP.from = null;
  }
  function qpClose() { if (QP.open && history.state && history.state.qp) history.back(); else qpHide(); }
  function qpBack() { var p = QP.hist[QP.hist.length - 1]; return p ? '<button type="button" class="qp-back" data-qpback>← 回到上一題' + (p.label ? '(' + qpEsc(p.label) + ')' : '') + '</button>' : ''; }
  function qpGo(href) { return '<a class="qp-go" href="' + qpEsc(href) + '">到題庫看這一年的其他題 →</a>'; }
  function qpHtml(s, q, d) {
    var P = window.PRACTICE, k = P.key(q), a = (d.ana && d.ana[k]) || {}, L = 'ABCD', O = window.OPTIMG;
    var acc = window.SCORE && window.SCORE.acc ? window.SCORE.acc(q) : (q.ans >= 0 ? [q.ans] : []);
    var h = '<div class="qp-stem">' + qpEsc(q.stem) + '</div>';
    if (O && O.fig) h += O.fig(q) || '';
    if (window.SCORE && window.SCORE.banner) h += window.SCORE.banner(q) || '';
    if (window.STALE && window.STALE.box) h += window.STALE.box(s, q) || '';
    h += '<div class="qp-opts">' + q.opts.map(function (o, i) { var ok = acc.indexOf(i) >= 0; return '<div class="qp-op' + (ok ? ' ok' : '') + '">' + L.charAt(i) + '. ' + (O && O.html ? O.html(q, i) || '' : '') + qpEsc(o) + (ok ? ' ✔' : '') + '</div>'; }).join('') + '</div>';
    h += a.a ? '<div class="qp-ana">' + a.a + '</div>' : '<div class="qp-na">這一題的詳解還在整理中。</div>';
    if (a.s) h += '<div class="qp-bx"><b>💡 解題技巧</b> ' + a.s + '</div>';
    if (a.n) h += '<div class="qp-bx"><b>⚠️ 注意 / 易錯</b> ' + a.n + '</div>';
    return h;
  }
  function qpShow(r) {
    var me = QP.cur = { s: r.s, key: r.key, href: r.href, label: '' };
    qpSet('詳解', qpBack() + '<div class="qp-na">載入中…</div>');
    qpNeed().then(function () { return window.PRACTICE.load(r.s); }).then(function (d) {
      if (!QP.open || QP.cur !== me) return;
      var q = d.map[r.key];
      if (!q) { qpSet('詳解', qpBack() + '<div class="qp-na">找不到這一題。</div>' + qpGo(r.href)); return; }
      me.label = window.PRACTICE.label(r.s, q);
      qpSet(me.label, qpBack() + qpHtml(r.s, q, d) + qpGo(r.href));
    }).catch(function () { if (QP.open && QP.cur === me) qpSet('詳解', qpBack() + '<div class="qp-na">詳解載入失敗,請稍後再試。</div>' + qpGo(r.href)); });
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('.xrl a[href]') : null;
    if (!a || a.closest('#xsheet')) return;
    var r = qpRef(a.getAttribute('href'));
    if (!r) return;
    e.preventDefault();
    if (QP.open && QP.cur) QP.hist.push(QP.cur); else { QP.hist = []; QP.from = a; }
    qpShow(r);
  });
  window.addEventListener('popstate', function () { if (QP.open) qpHide(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && QP.open) qpClose(); });
  window.ANAUI = { compact: compact, maps: hydrate, tline: tline, eraBar: eraBar, era: ERA_TW, parseTline: parseTline, parseMarks: parseMarks, peek: function (href) { var r = qpRef(href); if (r) { QP.hist = []; QP.from = document.activeElement; qpShow(r); } return !!r; } };
})();
