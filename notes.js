/* 個人筆記(SSoT)· C9(版本 v122)
   ------------------------------------------------------------------
   每一題都能寫自己的筆記(記憶口訣、易錯提醒、補充資料…),只存在這台裝置,
   「資料備份」頁匯出 / 還原時會一併帶走(localStorage 全部鍵值)。
   儲存:localStorage['qnotes'] = { "<subj>|<c>-<y>-<no>": {subj,c,y,no,t:筆記文字,s:題幹摘要,ts} }
     · id 與收藏(fav.js)同格式,同一題在詳解 / 錯題本 / 模擬測驗檢討看到的是同一則筆記
     · s(題幹摘要)讓收藏頁「📝 筆記」在題庫找不到原題時仍能顯示
   用法:
     詳解 / 複習 / 錯題本 / 模擬測驗檢討的揭曉區放 NOTE.box(subj,q);容器呼叫一次 NOTE.onClick(listEl)
     收藏頁「📝 筆記」用 NOTE.load() 列出
   編輯中的內容存在記憶體草稿(DRAFT):頁面重繪(切換設定、作答別題)時編輯框與文字會保留,
   按「儲存」才寫入,按「取消」放棄。
*/
(function () {
  'use strict';
  var KEY = 'qnotes', MAX = 2000;
  var DRAFT = {};
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function stemOf(q) { return String((q && q.stem) || '').replace(/__BLANK__/g, '（　）').replace(/\s+/g, ' ').trim().slice(0, 120); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function editor(text, canDel) {
    return '<textarea class="qn-in" maxlength="' + MAX + '" placeholder="寫下口訣、易錯點或補充資料…(只存在這台裝置,可到「資料備份」匯出)">' + esc(text) + '</textarea>' +
      '<div class="qn-act"><button class="qn-save" type="button">💾 儲存</button><button class="qn-cancel" type="button">取消</button>' +
      (canDel ? '<button class="qn-del" type="button">🗑 刪除筆記</button>' : '') + '</div>';
  }
  var NOTE = {
    load: function () { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } },
    save: function (o) { try { localStorage.setItem(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } },
    id: function (subj, q) { return subj + '|' + q.c + '-' + q.y + '-' + q.no; },
    get: function (subj, q) { var e = this.load()[this.id(subj, q)]; return e ? e.t : ''; },
    count: function () { return Object.keys(this.load()).length; },
    set: function (subj, q, text, stem) {
      var o = this.load(), k = this.id(subj, q), old = o[k];
      text = String(text || '').replace(/\s+$/, '').slice(0, MAX);
      if (!text.trim()) delete o[k];
      else o[k] = { subj: subj, c: q.c, y: String(q.y), no: +q.no, t: text, s: stem || (old && old.s) || stemOf(q), ts: Date.now() };
      return this.save(o);
    },
    inner: function (subj, q) {
      var k = this.id(subj, q), t = this.get(subj, q);
      if (has(DRAFT, k)) return editor(DRAFT[k], !!t);
      if (!t) return '<button class="qn-add" type="button">📝 寫筆記</button>';
      return '<div class="qn-view"><div class="qn-h">📝 我的筆記<button class="qn-edit" type="button">編輯</button></div><div class="qn-t">' + esc(t) + '</div></div>';
    },
    box: function (subj, q) {
      return '<div class="qnote" data-note="' + esc(this.id(subj, q)) + '" data-stem="' + esc(stemOf(q)) + '">' + this.inner(subj, q) + '</div>';
    },
    onClick: function (container) {
      if (!container || container._noteBound) return; container._noteBound = true;
      var self = this;
      function parse(box) { var p = box.dataset.note.split('|'), cy = p[1].split('-'); return { subj: p[0], q: { c: cy[0], y: cy[1], no: +cy[2] } }; }
      container.addEventListener('input', function (e) {
        if (!e.target.classList || !e.target.classList.contains('qn-in')) return;
        var box = e.target.closest('.qnote'); if (box) DRAFT[box.dataset.note] = e.target.value;
      });
      container.addEventListener('click', function (e) {
        var box = e.target.closest('.qnote'); if (!box) return;
        e.stopPropagation();          // 筆記區的點擊不要觸發作答、收合等頁面動作
        var act = e.target.closest('.qn-add,.qn-edit,.qn-save,.qn-cancel,.qn-del');
        if (!act) return;
        e.preventDefault();
        var r = parse(box), k = box.dataset.note;
        if (act.classList.contains('qn-add') || act.classList.contains('qn-edit')) {
          var cur = self.get(r.subj, r.q);
          DRAFT[k] = cur;
          box.innerHTML = editor(cur, !!cur);
          var ta = box.querySelector('textarea'); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
          return;
        }
        if (act.classList.contains('qn-save')) {
          var ok = self.set(r.subj, r.q, box.querySelector('textarea').value, box.dataset.stem);
          if (ok) delete DRAFT[k];
          box.innerHTML = self.inner(r.subj, r.q) + (ok ? '' : '<div class="qn-err">儲存失敗(瀏覽器儲存空間已滿或被停用),內容仍保留在編輯框</div>');
          return;
        }
        if (act.classList.contains('qn-del')) {
          if (!window.confirm('確定刪除這則筆記?刪除後無法復原。')) return;
          self.set(r.subj, r.q, '');
        }
        delete DRAFT[k];              // 取消 / 刪除:放棄草稿
        box.innerHTML = self.inner(r.subj, r.q);
      });
    }
  };
  window.NOTE = NOTE;
  try {
    var css = document.createElement('style');
    css.textContent = '.qnote{margin:10px 0 2px}' +
      '.qn-add{border:1.5px dashed var(--line,#d5dbe5);background:transparent;color:var(--sub,#5a6b82);border-radius:10px;padding:6px 12px;font-size:.84rem;font-weight:700;cursor:pointer;font-family:inherit}' +
      '.qn-view{background:var(--card,#fff);border:1.5px solid #e8a72b;border-left-width:4px;border-radius:10px;padding:8px 12px}' +
      '.qn-h{display:flex;align-items:center;gap:8px;font-size:.8rem;font-weight:800;color:#b7791f}.qn-edit{margin-left:auto;border:none;background:transparent;color:var(--sub,#5a6b82);cursor:pointer;font-size:.8rem;font-family:inherit;text-decoration:underline}' +
      '.qn-t{white-space:pre-wrap;font-size:.92rem;margin-top:3px;line-height:1.65;overflow-wrap:anywhere}' +
      '.qn-in{width:100%;min-height:90px;box-sizing:border-box;border:1.5px solid #e8a72b;border-radius:10px;padding:8px 10px;font-size:.92rem;font-family:inherit;background:var(--card,#fff);color:var(--ink,#1c2330);resize:vertical}' +
      '.qn-in:focus{outline:none;box-shadow:0 0 0 3px rgba(232,167,43,.28)}' +
      '.qn-act{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap}.qn-act button{border:1.5px solid var(--line,#d5dbe5);background:var(--card,#fff);color:var(--ink,#1c2330);border-radius:16px;padding:4px 13px;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit}' +
      '.qn-act .qn-save{background:#e8a72b;border-color:#e8a72b;color:#fff}.qn-act .qn-del{color:#c62a2a;margin-left:auto}.qn-err{color:#c62a2a;font-size:.8rem;margin-top:4px}' +
      '@media print{.qn-add,.qn-edit,.qn-act{display:none}}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
})();
