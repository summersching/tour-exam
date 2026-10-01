/* 返回鈕(SSoT)· v124
   ------------------------------------------------------------------
   從工具頁(英語 / 日語學習中心、錯題本、考前衝刺、口試練習、模擬測驗、收藏與筆記、搜尋、法規速查、考點速記、儀表板)
   點出處跳到詳解 / 複習頁的某一題時,左下角顯示「← 回 X」,按了回到原本的位置。
   安裝成 App(iPhone 主畫面)沒有瀏覽器的上一頁鍵,靠這顆回去。
   用於:英語詳解、日文詳解、觀光複習、執業實務複習、執業法規複習(<script src="backlink.js" defer>)
   注意:document.referrer 的中文檔名是 %E5… 編碼,必須先 decodeURIComponent 才比對得到。
*/
(function () {
  'use strict';
  var MAP = [
    [/日語學習中心/, '日語學習中心'], [/學習中心/, '學習中心'], [/錯題本/, '錯題本'], [/考前衝刺/, '考前衝刺'], [/口試練習/, '口試練習'],
    [/模擬測驗/, '模擬測驗'], [/收藏/, '收藏與筆記'], [/搜尋/, '搜尋結果'], [/法規速查/, '法規速查'],
    [/考點速記/, '考點速記'], [/儀表板/, '儀表板']
  ];
  function from() {
    var raw = document.referrer || '';
    if (!raw) return null;
    try { if (new URL(raw).origin !== location.origin) return null; } catch (e) { return null; }
    var file = raw.split('#')[0].split('?')[0].split('/').pop();
    try { file = decodeURIComponent(file); } catch (e) {}
    var self = location.pathname.split('/').pop();
    try { self = decodeURIComponent(self); } catch (e) {}
    if (!file || file === self) return null;
    for (var i = 0; i < MAP.length; i++) if (MAP[i][0].test(file)) return MAP[i][1];
    return null;
  }
  function init() {
    var name = from();
    if (!name || document.querySelector('.backlink')) return;
    var b = document.createElement('a');
    b.className = 'backlink'; b.href = document.referrer; b.textContent = '← 回' + name;
    b.addEventListener('click', function (e) { if (history.length > 1) { e.preventDefault(); history.back(); } });
    document.body.appendChild(b);
  }
  try {
    var css = document.createElement('style');
    css.textContent = '.backlink{position:fixed;left:12px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:99;background:var(--accent,#2563eb);' +
      'color:#fff;padding:9px 16px;border-radius:22px;font-size:.86rem;font-weight:700;text-decoration:none;box-shadow:0 3px 12px rgba(0,0,0,.25)}' +
      '@media print{.backlink{display:none}}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.BACKLINK = { from: from };
})();
