/* mask.js — 遮住重點自測(單一來源)· v127
   ------------------------------------------------------------------
   MASK.prepare(el)   把 el 內文字裡的數字(含單位,如「10 萬元」「1~7 年」「30 日」)包成 <span class="mkn">;
                      連結(出處題號)、.nomask 內不處理;重複呼叫不會重包
   MASK.set(el, on)   開 / 關遮罩:on 時 el 內的 <b>(除 .nomask)與數字變成灰塊,點一下單獨顯示
   MASK.reset(el)     重新全部遮住(清掉已點開的)
   用於:兩岸與入出境、考點速記
   變更履歷:
     v127 (2026-10-05) 初版
*/
(function () {
  'use strict';
  var NUM = /(\d[\d,，.．]*(?:\s*(?:~|～|-|－|–|至|到)\s*\d[\d,，.．]*)?\s*(?:萬|千|百|億)?\s*(?:工作天|個工作日|個月|萬元|美元|公升|公分|公尺|公里|公斤|毫升|小時|分鐘|職等|元|年|月|日|天|歲|人|名|分|秒|%|％|週|次|倍|節|支|磅|瓶|隻|家|團|條|項|號)?)/g;
  var SKIP = 'A,SCRIPT,STYLE,TEXTAREA,INPUT,BUTTON';
  function skip(node) {
    for (var p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP.indexOf(p.tagName) >= 0) return true;
      if (p.classList && (p.classList.contains('nomask') || p.classList.contains('mkn'))) return true;
      if (p.tagName === 'B') return true;               // <b> 本身整段遮,不必再拆數字
      if (p.hasAttribute && p.hasAttribute('data-mask-root')) break;
    }
    return false;
  }
  function prepare(el) {
    if (!el) return;
    el.setAttribute('data-mask-root', '1');
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), list = [], n;
    while ((n = w.nextNode())) { NUM.lastIndex = 0; if (NUM.test(n.nodeValue) && !skip(n)) list.push(n); }
    list.forEach(function (t) {
      var s = t.nodeValue, frag = document.createDocumentFragment(), last = 0, m;
      NUM.lastIndex = 0;
      while ((m = NUM.exec(s))) {
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var sp = document.createElement('span'); sp.className = 'mkn'; sp.textContent = m[0].replace(/\s+$/, '');
        frag.appendChild(sp);
        var tail = m[0].length - sp.textContent.length;
        last = m.index + m[0].length - tail;
      }
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      t.parentNode.replaceChild(frag, t);
    });
  }
  function set(el, on) { if (el) el.classList.toggle('mk-on', !!on); }
  function reset(el) { if (el) el.querySelectorAll('.mk-show').forEach(function (x) { x.classList.remove('mk-show'); }); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.mk-on b, .mk-on .mkn');
    if (!t || t.classList.contains('nomask') || t.closest('a')) return;
    if (!t.classList.contains('mk-show')) { t.classList.add('mk-show'); e.preventDefault(); e.stopPropagation(); }
  }, true);
  try {
    var css = document.createElement('style');
    css.textContent = '.mk-on b:not(.nomask):not(.mk-show),.mk-on .mkn:not(.mk-show){color:transparent!important;-webkit-text-fill-color:transparent;' +
      'background:rgba(120,135,160,.3);border-radius:4px;cursor:pointer;-webkit-box-decoration-break:clone;box-decoration-break:clone}' +
      '.mk-on b:not(.nomask):not(.mk-show) *,.mk-on .mkn:not(.mk-show) *{color:transparent!important}' +
      '@media print{.mk-on b,.mk-on .mkn{color:inherit!important;-webkit-text-fill-color:currentColor;background:none!important}}';
    document.head.appendChild(css);
  } catch (e) {}
  window.MASK = { prepare: prepare, set: set, reset: reset };
})();
