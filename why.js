/* why.js — 中文三科錯因標記(單一來源)· v209
   ------------------------------------------------------------------
   答錯後標「為什麼錯」,錯題本 / 模擬測驗結果 / 儀表板共用:
     WHY.C                       錯因清單 [代碼, 圖示, 名稱, 說明]
     WHY.get(s, q)               這題的錯因(s = pr2 / pr / gh;q 需有 c, y, no)
     WHY.set(s, q, code|null)    設定 / 清除
     WHY.chips(s, q)             「為什麼錯?」按鈕列 HTML
     WHY.bind(el, onChange)      在容器上委派點擊:點一下標記、再點一次取消;onChange(id, code)
     WHY.stats(s, ids)           { 代碼: 題數 }(s = 'all' 合計三科;ids = 只算這些題,例如目前錯題本裡的)
     WHY.top(st)                 題數最多的錯因 [代碼, 題數] 或 null
     WHY.tip(s, code)            對這個錯因的建議 { t 說明, href 連結, l 按鈕文字 }
     WHY.tipHtml(s, st)          最常見錯因的建議卡 HTML(沒有標記時回傳空字串)
   存放:localStorage wrong_why = { 'pr2:guide-112-3': 'num', … };題目移出錯題本後仍保留,長期的弱點型態看得到
   變更履歷:
     v209 (2026-11-02) 初版
*/
(function () {
  'use strict';
  var C = [
    ['num', '🔢', '數字記錯', '金額、期限、人數、年份記錯'],
    ['mix', '🔀', '搞混', '相似的規定、名稱、地點、人物搞混'],
    ['read', '👀', '看錯題目', '否定題(何者錯誤 / 非)、漏看條件'],
    ['none', '❓', '沒讀過', '完全沒印象的範圍'],
    ['guess', '🎲', '猶豫猜錯', '兩個選項之間選錯']
  ];
  var KEY = 'wrong_why';
  var NAME = {}; C.forEach(function (c) { NAME[c[0]] = c; });
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function key(s, q) { return s + ':' + q.c + '-' + q.y + '-' + q.no; }
  function get(s, q) { return load()[key(s, q)] || null; }
  function set(s, q, code) { var o = load(), id = key(s, q); if (code && NAME[code]) o[id] = code; else delete o[id]; save(o); return o[id] || null; }
  function css() {
    if (document.getElementById('why-css')) return;
    var st = document.createElement('style'); st.id = 'why-css';
    st.textContent = '.why{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:10px 0 2px;padding-top:8px;border-top:1px dashed var(--line,#e2e8f2)}'
      + '.why .wl{font-size:.78rem;font-weight:800;color:var(--sub,#5a6b82);margin-right:2px}'
      + '.why .wy{border:1.5px solid var(--line,#e2e8f2);background:var(--card,#fff);color:var(--ink,#1c2330);border-radius:999px;padding:3px 10px;font-size:.78rem;font-weight:700;cursor:pointer;font-family:inherit}'
      + '.why .wy:hover{border-color:var(--sub,#5a6b82)}'
      + '.why .wy.on{background:var(--sel,#4f46e5);border-color:var(--sel,#4f46e5);color:#fff}'
      + '.whytip{background:var(--card,#fff);border:1px solid var(--line,#e2e8f2);border-left:4px solid var(--sel,#4f46e5);border-radius:12px;padding:10px 12px;margin:12px 0;font-size:.84rem;line-height:1.65}'
      + '.whytip b{color:var(--ink,#1c2330)} .whytip .wd{display:flex;flex-wrap:wrap;gap:4px 10px;margin:4px 0;color:var(--sub,#5a6b82);font-size:.78rem}'
      + '.whytip a{display:inline-block;margin-top:6px;font-weight:800;text-decoration:none;color:var(--sel,#4f46e5);border:1.5px solid var(--sel,#4f46e5);border-radius:10px;padding:3px 10px}'
      + '@media print{.why{display:none}}';
    (document.head || document.documentElement).appendChild(st);
  }
  function chips(s, q) {
    css();
    var cur = get(s, q);
    return '<div class="why" data-why-id="' + key(s, q) + '"><span class="wl">為什麼錯?</span>' + C.map(function (c) {
      return '<button type="button" class="wy' + (cur === c[0] ? ' on' : '') + '" data-why="' + c[0] + '" title="' + c[3] + '">' + c[1] + ' ' + c[2] + '</button>';
    }).join('') + '</div>';
  }
  function bind(el, onChange) {
    if (!el) return;
    el.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-why]'); if (!b) return;
      var box = b.closest('[data-why-id]'); if (!box) return;
      var o = load(), id = box.getAttribute('data-why-id'), code = b.getAttribute('data-why');
      if (o[id] === code) delete o[id]; else o[id] = code;
      save(o);
      Array.prototype.forEach.call(box.querySelectorAll('[data-why]'), function (x) { x.classList.toggle('on', o[id] === x.getAttribute('data-why')); });
      if (onChange) onChange(id, o[id] || null);
    });
  }
  function stats(s, ids) {
    var o = load(), out = {}, only = ids ? {} : null;
    if (ids) ids.forEach(function (i) { only[i] = 1; });
    C.forEach(function (c) { out[c[0]] = 0; });
    Object.keys(o).forEach(function (id) {
      if ((s === 'all' || id.indexOf(s + ':') === 0) && (!only || only[id]) && out[o[id]] != null) out[o[id]]++;
    });
    return out;
  }
  function top(st) { var best = null; C.forEach(function (c) { if (st[c[0]] && (!best || st[c[0]] > best[1])) best = [c[0], st[c[0]]]; }); return best; }
  function tip(s, code) {
    switch (code) {
      case 'num': return { t: '把金額、期限、人數集中背,遮住答案自測' + (s === 'pr2' ? ';違約金公式、罰鍰級距看「法規速查」' : ''), href: '數字速記.html?subj=' + s, l: '🔢 數字速記' };
      case 'mix': return s === 'pr2' ? { t: '同一條法規考過的題放在一起看,相似規定一次分清楚', href: '條文反查.html?subj=pr2', l: '📜 條文反查' }
        : s === 'gh' ? { t: '地點、人物、年代用地圖與年表定位,比硬背好記', href: '觀光圖鑑.html', l: '🗺️ 觀光圖鑑' }
        : { t: '易混考點整理在「考點速記」,遮住答案自測', href: '考點速記.html?subj=' + s, l: '🗂️ 考點速記' };
      case 'read': return { t: '作答前先圈「錯誤、不得、非、以上皆是」等字;每個選項先標 ✓ ✗ 再選。用「是非快問」練判斷每一句', href: '是非快問.html?subj=' + s, l: '⭕ 是非快問' };
      case 'none': return { t: '沒讀過的範圍先補基礎再刷題:考點速記遮住自測一輪', href: '考點速記.html?subj=' + s, l: '🗂️ 考點速記' };
      case 'guess': return { t: '把兩個猶豫選項的差別寫進題目下的「📝 筆記」;再用是非快問練到不用猜', href: '是非快問.html?subj=' + s, l: '⭕ 是非快問' };
    }
    return null;
  }
  function tipHtml(s, st) {
    css();
    var b = top(st); if (!b) return '';
    var x = tip(s, b[0]), n = NAME[b[0]];
    var dist = C.filter(function (c) { return st[c[0]]; }).map(function (c) { return '<span>' + c[1] + ' ' + c[2] + ' ' + st[c[0]] + '</span>'; }).join('');
    return '<div class="whytip">🧩 你最常<b>「' + n[2] + '」</b>(' + b[1] + ' 題):' + x.t + '<div class="wd">' + dist + '</div><a href="' + x.href + '">' + x.l + ' →</a></div>';
  }
  window.WHY = { C: C, get: get, set: set, chips: chips, bind: bind, stats: stats, top: top, tip: tip, tipHtml: tipHtml, key: key };
})();
