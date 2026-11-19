/* icons.js — 線條圖示 · v302(2026-11-19)
   ------------------------------------------------------------------
   本站自己畫的簡單線條圖示(24×24、線寬 1.8、顏色跟著文字 currentColor),用來取代 emoji 圖示:
   emoji 在每支手機長得不一樣,線條圖示到哪裡看起來都一樣。
   用法:ICONS.svg('book') 回傳一段 <svg> 字串,直接放進 innerHTML;不認得的名字回傳空字串。
   要加新圖示:在下面 P 加一筆 名稱: '<path …/>'(座標用 0~24)。
   變更履歷:v302 加考照中心工具卡、考試提醒用的 28 個圖示(題庫、搜尋、語言、鳥居、火焰、麥克風、天平、地圖、鈴鐺…)
             v300 初版(工作站首頁使用) */
(function () {
  'use strict';
  var P = {
    school: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5Z"/><path d="M6.5 11.2v4.4c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.4"/><path d="M21.5 9v5.5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    book: '<path d="M12 6.6C10 5.1 7 4.6 3.5 5v13.2c3.5-.4 6.5.1 8.5 1.6 2-1.5 5-2 8.5-1.6V5C17 4.6 14 5.1 12 6.6Z"/><path d="M12 6.6v13.2"/>',
    clipboard: '<rect x="5" y="4.5" width="14" height="16" rx="2.5"/><path d="M9 4.5v-1h6v1"/><path d="m9 12.6 2.2 2.2 4-4.2"/>',
    bookmark: '<path d="M7 3.5h10a1 1 0 0 1 1 1v16l-6-3.8-6 3.8v-16a1 1 0 0 1 1-1Z"/>',
    chevron: '<path d="m9.5 6 6 6-6 6"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.6a3.5 3.5 0 0 1 7 0v2.9"/>',
    files: '<path d="M9 3.5h6.5l4 4V16a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 16V5A1.5 1.5 0 0 1 9 3.5Z"/><path d="M15.5 3.5v4h4"/><path d="M4.5 7.5V19A1.5 1.5 0 0 0 6 20.5h9"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    lang: '<path d="M4 5h16v10.5h-8l-4.5 3.5v-3.5H4Z"/><path d="m9.2 12.8 2.8-6 2.8 6M10.2 10.8h3.6"/>',
    torii: '<path d="M4 5.5c5.4 1.2 10.6 1.2 16 0"/><path d="M5.5 9.5h13"/><path d="M8 7v13.5M16 7v13.5"/><path d="M12 6.8v2.7"/>',
    flame: '<path d="M12 21c-3.7 0-6.3-2.5-6.3-5.9 0-2.7 1.7-4.6 3.1-6 .4 1.6 1.3 2.7 2.4 3-.4-3.3.9-6.3 3.3-8.6.4 2.7 1.6 4.4 2.8 6 1.1 1.5 1.9 3.1 1.9 5.3 0 3.6-3 6.2-7.2 6.2Z"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3M9 20.5h6"/>',
    scale: '<path d="M12 4v16.5M8 20.5h8M5 7.5h14"/><path d="M5 7.5 2.6 13.5a2.6 2.6 0 0 0 4.8 0Z"/><path d="M19 7.5l-2.4 6a2.6 2.6 0 0 0 4.8 0Z"/>',
    filesearch: '<path d="M13 20.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5h7l4 4V11"/><path d="M14 3.5v4h4"/><circle cx="16.5" cy="16.3" r="2.8"/><path d="m18.6 18.4 2 2"/>',
    sparkle: '<path d="M11 3.5 12.9 8.6 18 10.5l-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9Z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/>',
    cards: '<rect x="3.5" y="7.5" width="12" height="13" rx="2"/><path d="M8.5 4.5h10a2 2 0 0 1 2 2V17"/><path d="M7 12.5h5M7 16h3.5"/>',
    ox: '<circle cx="8" cy="12" r="4.3"/><path d="m14.5 8 6 8M20.5 8l-6 8"/>',
    hash: '<path d="M9.5 4 7.5 20M16.5 4l-2 16M4.5 9h15.5M3.5 15h15.5"/>',
    toolbox: '<rect x="3.5" y="8" width="17" height="11.5" rx="2"/><path d="M9 8V6.2A1.7 1.7 0 0 1 10.7 4.5h2.6A1.7 1.7 0 0 1 15 6.2V8"/><path d="M3.5 13h17M10.5 13v2h3v-2"/>',
    map: '<path d="M3.5 6.5 9 4l6 2.5 5.5-2.5v13.5L15 20l-6-2.5-5.5 2.5Z"/><path d="M9 4v13.5M15 6.5V20"/>',
    trend: '<path d="m3.5 17.5 5.5-5.5 4 4 7.5-7.5"/><path d="M15.5 8.5h5v5"/>',
    passport: '<rect x="5.5" y="3.5" width="13" height="17" rx="2"/><circle cx="12" cy="11" r="3.2"/><path d="M9.5 16.5h5"/>',
    chart: '<path d="M4 20.5h16"/><rect x="6" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6.5" width="3" height="11.5" rx="1"/><rect x="15" y="13.5" width="3" height="4.5" rx="1"/>',
    star: '<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.6l-5 2.6.9-5.6-4-3.9 5.6-.8Z"/>',
    download: '<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5"/><path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.3"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    check: '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.6-4.8"/>',
    dot: '<circle cx="12" cy="12" r="2.6"/>',
    calplus: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 12.5v5M9.5 15h5"/>',
    list: '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="m3.8 6.5 1.3 1.3 2.4-2.4M3.8 12l1.3 1.3 2.4-2.4M3.8 17.5l1.3 1.3 2.4-2.4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16"/>'
  };
  function svg(name, cls) {
    var p = P[name];
    if (!p) return '';
    return '<svg class="' + (cls || 'li') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>';
  }
  window.ICONS = { svg: svg, names: Object.keys(P) };
})();
