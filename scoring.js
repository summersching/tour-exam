/* scoring.js — 判分單一來源(對齊官方公告)
   題目欄位:
     ans    主答案索引 0-3(送分題可為 -1)
     sungei 1 = 一律給分;2 = 有作答者給分(未作答不給分)
     alt    [i,j,..] 官方公告「答 X 或 Y 均給分」的全部可接受答案(含 ans)
   全站「判對錯 / 標正解 / 顯示正解 / 官方公告說明」一律呼叫這裡,各頁不再自行比對 q.ans。 */
(function () {
  var L = 'ABCD';
  function free(q) { return !!(q && q.sungei); }
  function acc(q) {                                   // 可接受答案(送分題回 [],沒有唯一正解可標)
    if (!q || free(q)) return [];
    if (Array.isArray(q.alt) && q.alt.length) return q.alt.slice().sort(function (a, b) { return a - b; });
    return (typeof q.ans === 'number' && q.ans >= 0) ? [q.ans] : [];
  }
  function letters(q) { return acc(q).map(function (i) { return L[i]; }); }
  function rule(q) {
    if (!q) return '';
    if (q.sungei === 2) return '官方公告:本題有作答者均給分(未作答不給分)。';
    if (q.sungei) return '官方公告:本題一律給分。';
    if (acc(q).length > 1) return '官方公告:本題答 ' + letters(q).join(' 或 ') + ' 均給分。';
    return '';
  }
  window.SCORE = {
    free: free,
    acc: acc,
    letters: letters,
    multi: function (q) { return acc(q).length > 1; },
    isAcc: function (q, i) { return acc(q).indexOf(i) >= 0; },
    /* 判對錯:p = 考生所選索引,null/undefined = 未作答 */
    ok: function (q, p) {
      if (!q) return false;
      if (free(q)) return q.sungei === 2 ? (p != null) : true;
      if (p == null) return false;
      return acc(q).indexOf(p) >= 0;
    },
    /* 選項標記 → [class, 符號];p = 考生所選(複習模式傳 null) */
    mark: function (q, i, p) {
      if (free(q)) return p === i ? ['ok', '✓'] : ['', ''];
      if (acc(q).indexOf(i) >= 0) return ['ok', '✓'];
      if (p === i) return ['no', '✗'];
      return ['', ''];
    },
    /* 正解短字:「B」「A 或 C」「送分」 */
    ansLabel: function (q) {
      if (free(q)) return '送分';
      var l = letters(q);
      return l.length ? l.join(' 或 ') : '?';
    },
    rule: rule,
    /* 檢討區上方的官方公告橫條;一般題回 '' */
    banner: function (q) {
      var r = rule(q);
      if (!r) return '';
      return '<div class="lbl" style="color:var(--ok)">' + (free(q) ? '✓ 送分題' : '✓ 多答案均給分') +
        '</div><div class="zh">' + r + '</div>';
    },
    /* 錯題本清理:最後一次作答依官方公告其實給分者移除,回傳移除題數
       key = localStorage 鍵;getQ(id, entry) 回傳目前題目資料 */
    pruneWB: function (key, getQ) {
      var o, n = 0;
      try { o = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return 0; }
      Object.keys(o).forEach(function (id) {
        var e = o[id], q = getQ(id, e);
        if (q && e && e.picked != null && (q.alt || q.sungei) && window.SCORE.ok(q, e.picked)) { delete o[id]; n++; }
      });
      if (n) { try { localStorage.setItem(key, JSON.stringify(o)); } catch (e) {} }
      return n;
    },
    /* 在 el 前插入一次性提示 */
    notice: function (el, n) {
      if (!n || !el || !el.parentNode) return;
      var d = document.createElement('div');
      d.style.cssText = 'margin:0 auto 12px;max-width:760px;padding:10px 14px;border-radius:12px;' +
        'background:rgba(21,144,74,.1);color:var(--ok);font-size:.9rem;line-height:1.5';
      d.textContent = '✓ 依官方公告,已從錯題本移除 ' + n + ' 題(你選的答案官方也給分)';
      el.parentNode.insertBefore(d, el);
    }
  };
})();
