/* ana.js — 詳解排版(單一來源)· v134
   ------------------------------------------------------------------
   中文三科解析 a 欄的「詳細版」結構:
     答 <b class='ac'>X 選項</b>
     <div class='xa'>
       <div class='xh'>📖 詳解</div><p>…</p>
       <div class='xh'>🔍 選項分析</div><ul class='xo'><li>…</li><li class='ok'>…</li></ul>
       <div class='xh'>📌 延伸整理</div><div class='xtw'><table class='xt'>…</table></div>
       <ol class='xs'>步驟</ol>
       <div class='xh'>⚖️ 法規依據</div><div class='xl'>條文</div>
       <figure class='xm'><img …><figcaption>…</figcaption></figure>
     </div>
   這支負責樣式(各頁共用,含深色模式)、快問收合、解析內地圖;內容寫在 gh_ana.js / pr_ana.js / pr2_ana.js。
   ANAUI.compact(html)  快問、小測驗彈窗用:詳細內容收進「📖 看完整解析」,作答節奏不被長文打斷
   (名稱用 ANAUI:執業實務 / 法規複習頁自己有一個叫 ANA 的解析資料變數,避免同名)
   解析內地圖:<figure class='xm' data-twmap='地名|地名=標籤' data-ranges='1'>,自動載入 twmap.js 畫出(見 twmap.js)
   變更履歷:
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
      '.xa .xtw{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:6px 0}' +
      '.xa table.xt{border-collapse:collapse;width:100%;font-size:.84rem;line-height:1.55}' +
      '.xa table.xt th,.xa table.xt td{border:1px solid var(--line,#d8dee9);padding:5px 7px;text-align:left;vertical-align:top}' +
      '.xa table.xt th{background:rgba(127,127,127,.12);font-weight:800;white-space:nowrap}' +
      '.xa table.xt tr.ok td{background:rgba(34,197,94,.12);font-weight:700}' +
      '.xa .xl{border-left:3px solid var(--accent,#2563eb);background:rgba(127,127,127,.08);padding:7px 10px;border-radius:0 8px 8px 0;font-size:.86rem;margin:6px 0}' +
      '.xa figure.xm{margin:8px 0;text-align:center}.xa figure.xm img,.xa figure.xm svg{max-width:100%;height:auto}' +
      '.xa figure.xm figcaption{font-size:.78rem;color:var(--sub,#5a6b82);margin-top:2px}' +
      'details.xad{margin-top:6px}details.xad>summary{cursor:pointer;font-weight:800;font-size:.86rem;color:var(--accent,#2563eb);list-style:none}' +
      'details.xad>summary::-webkit-details-marker{display:none}details.xad[open]>summary{margin-bottom:2px}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  function compact(html) {
    var s = String(html == null ? '' : html), i = s.indexOf("<div class='xa'>");
    if (i < 0) return s;
    return s.slice(0, i) + "<details class='xad'><summary>📖 看完整解析</summary>" + s.slice(i) + '</details>';
  }
  /* 解析裡的地圖:<figure class='xm' data-twmap='地名|地名=自訂標籤|地名=標籤@l' data-ranges='1'><figcaption>…</figcaption></figure>
     標籤結尾 @r / @l / @u / @d = 優先放在右 / 左 / 上 / 下(避免壓到山脈線)
     頁面放進這段 HTML 後自動載入 twmap.js 畫出臺灣位置圖(data-ranges='1' 會加畫五大山脈) */
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
  window.ANAUI = { compact: compact, maps: hydrate };
})();
