/* optimg.js — 圖片選項(版本 v121)
 * 題目若有 img 陣列(與 opts 一一對應),選項顯示原卷圖片,opts 文字當圖說與替代文字。
 * 目前用於觀光資源概要 4 題圖片題(導遊 106-52、107-27,領隊 106-49、107-50);圖片在 img/gh/。
 * OPTIMG.html(q, i) → 第 i 個選項的 <img>(無圖回傳空字串)
 */
(function () {
  function attr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function html(q, i) {
    if (!q || !q.img || !q.img[i]) return '';
    return '<img class="oimg" src="' + attr(q.img[i]) + '" alt="' + attr((q.opts || [])[i] || '') + '" loading="lazy" decoding="async">';
  }
  try {
    var s = document.createElement('style');
    s.textContent = '.oimg{display:block;max-width:100%;max-height:210px;width:auto;height:auto;object-fit:contain;border-radius:8px;margin:2px 0 6px;background:#fff}';
    document.head.appendChild(s);
  } catch (e) {}
  window.OPTIMG = { html: html };
})();
