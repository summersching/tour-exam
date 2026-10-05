/* optimg.js — 原卷圖片(版本 v129)
 * 選項圖:題目若有 img 陣列(與 opts 一一對應),選項顯示原卷圖片,opts 文字當圖說與替代文字。
 *   觀光資源概要 4 題(導遊 106-52、107-27,領隊 106-49、107-50;img/gh/)、執業法規 1 題(導遊 106-13;img/pr2/)。
 * 題幹圖:題目若有 fig 陣列,題幹下方顯示原卷附圖(照片、地圖、氣候圖等),點圖可放大。
 *   觀光資源概要 24 題(img/gh/<證照>-<年>-<題號>-q.jpg,v129 由原卷 PDF 裁出)。
 * OPTIMG.html(q, i) → 第 i 個選項的 <img>(無圖回傳空字串)
 * OPTIMG.fig(q)     → 題幹附圖區塊(無圖回傳空字串)
 * 變更履歷:v129 新增題幹圖與點圖放大;v121 初版(選項圖)
 */
(function () {
  function attr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function html(q, i) {
    if (!q || !q.img || !q.img[i]) return '';
    return '<img class="oimg" src="' + attr(q.img[i]) + '" alt="' + attr((q.opts || [])[i] || '') + '" loading="lazy" decoding="async">';
  }
  function fig(q) {
    if (!q || !q.fig || !q.fig.length) return '';
    return '<div class="qfig">' + q.fig.map(function (src) {
      return '<img src="' + attr(src) + '" alt="題目附圖(原卷)" title="點圖放大" loading="lazy" decoding="async">';
    }).join('') + '</div>';
  }
  /* 點題幹圖放大(地圖、氣候圖字小);再點一下或按 Esc 關閉 */
  function zoom(src) {
    var ov = document.createElement('div');
    ov.className = 'qfig-ov';
    ov.innerHTML = '<img src="' + attr(src) + '" alt="題目附圖(放大)">';
    ov.onclick = function () { ov.remove(); };
    document.body.appendChild(ov);
  }
  document.addEventListener('click', function (e) {
    var im = e.target.closest && e.target.closest('.qfig img');
    if (im) { e.preventDefault(); zoom(im.getAttribute('src')); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { var ov = document.querySelector('.qfig-ov'); if (ov) { ov.remove(); e.stopPropagation(); } }
  }, true);
  try {
    var s = document.createElement('style');
    s.textContent = '.oimg{display:block;max-width:100%;max-height:210px;width:auto;height:auto;object-fit:contain;border-radius:8px;margin:2px 0 6px;background:#fff}' +
      '.qfig{margin:4px 0 10px;text-align:center}.qfig img{display:inline-block;max-width:100%;max-height:300px;width:auto;height:auto;object-fit:contain;border-radius:10px;background:#fff;border:1px solid rgba(120,135,160,.25);cursor:zoom-in}' +
      '.qfig-ov{position:fixed;inset:0;z-index:300;background:rgba(8,12,20,.88);display:flex;align-items:center;justify-content:center;padding:12px;cursor:zoom-out}' +
      '.qfig-ov img{max-width:100%;max-height:100%;object-fit:contain;background:#fff;border-radius:8px}' +
      '@media print{.qfig img{max-height:220px;border:0}}';
    document.head.appendChild(s);
  } catch (e) {}
  window.OPTIMG = { html: html, fig: fig };
})();
