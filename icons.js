/* icons.js — 線條圖示 · v300(2026-11-18)
   ------------------------------------------------------------------
   本站自己畫的簡單線條圖示(24×24、線寬 1.8、顏色跟著文字 currentColor),用來取代 emoji 圖示:
   emoji 在每支手機長得不一樣,線條圖示到哪裡看起來都一樣。
   用法:ICONS.svg('book') 回傳一段 <svg> 字串,直接放進 innerHTML;不認得的名字回傳空字串。
   要加新圖示:在下面 P 加一筆 名稱: '<path …/>'(座標用 0~24)。
   變更履歷:v300 初版(工作站首頁使用) */
(function () {
  'use strict';
  var P = {
    school: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5Z"/><path d="M6.5 11.2v4.4c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.4"/><path d="M21.5 9v5.5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    book: '<path d="M12 6.6C10 5.1 7 4.6 3.5 5v13.2c3.5-.4 6.5.1 8.5 1.6 2-1.5 5-2 8.5-1.6V5C17 4.6 14 5.1 12 6.6Z"/><path d="M12 6.6v13.2"/>',
    clipboard: '<rect x="5" y="4.5" width="14" height="16" rx="2.5"/><path d="M9 4.5v-1h6v1"/><path d="m9 12.6 2.2 2.2 4-4.2"/>',
    bookmark: '<path d="M7 3.5h10a1 1 0 0 1 1 1v16l-6-3.8-6 3.8v-16a1 1 0 0 1 1-1Z"/>',
    chevron: '<path d="m9.5 6 6 6-6 6"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.6a3.5 3.5 0 0 1 7 0v2.9"/>'
  };
  function svg(name, cls) {
    var p = P[name];
    if (!p) return '';
    return '<svg class="' + (cls || 'li') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>';
  }
  window.ICONS = { svg: svg, names: Object.keys(P) };
})();
