/* enread.js — 英語閱讀題(第 71–80 題)單一來源
 * 版本:v121
 * 由 en_review.js(EN_REVIEW)即時組出與 bank.js 同格式的題目物件,另帶 psg(所屬文章)。
 * 不另存一份資料:閱讀題的解析/答案修正只要改 en_review.js,模擬測驗與錯題本自動同步。
 * ENREAD.list()            → 全部閱讀題(200 題)
 * ENREAD.get(c, y, no)     → 單題(找不到回 null)
 * ENREAD.html(q, opt)      → 文章區塊 HTML;opt.open 預設展開、opt.full 顯示完整標題(含主題)、
 *                            opt.same 與上一題同一篇(收合並標示「文章同上」)、opt.say 附朗讀鈕
 * 作答中請用 full:false —— 文章標題的「主題」常等於標題題(主旨題)的答案,會洩題。
 */
(function () {
  var cache = null;
  function build() {
    if (cache) return cache;
    cache = { list: [], byKey: {} };
    if (typeof EN_REVIEW === 'undefined') return cache;
    Object.keys(EN_REVIEW).forEach(function (k) {
      var parts = k.split('-'), c = parts[0], y = parts[1], cur = null;
      (EN_REVIEW[k] || []).forEach(function (x) {
        if (x.kind === 'passage') { cur = { label: x.label, text: x.text || [], key: k }; return; }
        if (x.kind !== 'q' || x.no <= 70 || !cur) return;
        var q = {
          c: c, y: y, no: x.no, type: '閱讀', topic: x.topic, star: x.star, stem: x.stem, zh: x.zh,
          opts: x.opts, ans: x.ans, ana: x.ana, skill: x.skill || '', note: x.note || '', gram: x.gram || '',
          real: x.real || '', vocab: x.vocab || [], psg: cur
        };
        if (x.alt) q.alt = x.alt;
        if (x.sungei) q.sungei = x.sungei;
        cache.list.push(q);
        cache.byKey[c + '-' + y + '-' + x.no] = q;
      });
    });
    return cache;
  }
  function shortLabel(label) { return String(label).split('·')[0].trim(); }
  function attr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function html(q, opt) {
    if (!q || !q.psg) return '';
    opt = opt || {};
    var p = q.psg, open = opt.open !== false;
    var title = opt.same ? '文章同上(點開再看)' : (opt.full ? p.label : shortLabel(p.label));
    var say = opt.say ? ' <span class="say" data-lang="en" data-say="' + attr(p.text.join(' ').replace(/<[^>]+>/g, '')) + '" title="點我朗讀">🔊</span>' : '';
    return '<details class="psg"' + (open && !opt.same ? ' open' : '') + '><summary>📖 ' + title + say + '</summary>' +
      '<div class="psgt">' + p.text.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '</div></details>';
  }
  try {
    var css = '.psg{background:var(--chipt);border:1px solid var(--line);border-radius:12px;margin:10px 0;font-size:.93rem}' +
      '.psg>summary{cursor:pointer;padding:10px 14px;font-weight:700;color:var(--chiptk);list-style:none}' +
      '.psg>summary::-webkit-details-marker{display:none}.psg>summary::before{content:"▸ ";}.psg[open]>summary::before{content:"▾ ";}' +
      '.psg .psgt{padding:0 16px 12px}.psg .psgt p{margin:6px 0;line-height:1.75}';
    var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  } catch (e) {}
  window.ENREAD = {
    list: function () { return build().list; },
    get: function (c, y, no) { return build().byKey[c + '-' + y + '-' + no] || null; },
    html: html
  };
})();
