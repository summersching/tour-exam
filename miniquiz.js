/* miniquiz.js — 小測驗彈窗(單一來源)· v127
   ------------------------------------------------------------------
   數字速記、兩岸與入出境(及之後的整理頁)共用:把一組歷屆單選題變成「逐題作答 + 立即詳解」的小測驗。
     MINIQUIZ.start({ title, list: [{s, q}], n })
       s     科目代碼 gh / pr / pr2;q 題目(題庫原物件)
       n     題數(0 = 全部),從 list 隨機抽
   作答:點選項或按 1–4 / A–D;判分、標正解一律用 scoring.js(送分 / 一題多解照官方公告)
   答完顯示解析(題庫解析檔)、時效提醒(stale.js)、原題連結與收藏;答錯收進該科錯題本、每題計入首頁「今日已練」(practice.js)
   需要:scoring.js、practice.js;選用:stale.js、fav.js;optimg.js(圖片題用)沒載入時開測驗前自動載入
   變更履歷:
     v129 (2026-10-05) 題幹附圖(OPTIMG.fig);沒載入 optimg.js 的頁面自動補載
     v127 (2026-10-05) 初版
*/
(function () {
  'use strict';
  var L = 'ABCD', ST = null;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clean(s) { return String(s == null ? '' : s).replace(/[ˉ‾¯]+/g, ''); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(list, n) { var a = shuffle(list.slice()); return n ? a.slice(0, n) : a; }

  var css = '.mq-ov{position:fixed;inset:0;z-index:200;background:rgba(10,14,22,.55);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:calc(10px + env(safe-area-inset-top)) 10px 30px}' +
    '.mq-box{background:var(--card,#fff);color:var(--ink,#1c2330);width:100%;max-width:680px;border-radius:18px;box-shadow:0 10px 40px rgba(0,0,0,.3);overflow:hidden}' +
    '.mq-hd{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line,#e2e8f2);position:sticky;top:0;background:var(--card,#fff);z-index:1}' +
    '.mq-hd b{font-size:.98rem}.mq-prog{margin-left:auto;font-size:.8rem;color:var(--sub,#5a6b82);font-weight:700}' +
    '.mq-x{border:0;background:var(--line,#e2e8f2);color:var(--ink,#1c2330);border-radius:50%;width:32px;height:32px;font-size:1rem;cursor:pointer}' +
    '.mq-bd{padding:14px 16px 18px}.mq-src{font-size:.74rem;color:var(--sub,#5a6b82);margin-bottom:4px}' +
    '.mq-stem{font-weight:700;font-size:1rem;line-height:1.7;margin:2px 0 10px}' +
    '.mq-opt{display:flex;gap:9px;align-items:flex-start;width:100%;text-align:left;border:1.5px solid var(--line,#e2e8f2);background:var(--card,#fff);color:inherit;border-radius:12px;padding:10px 12px;margin:7px 0;font-size:.94rem;font-family:inherit;line-height:1.6;cursor:pointer}' +
    '.mq-opt:hover:not(:disabled){border-color:var(--sub,#5a6b82)}.mq-opt:disabled{cursor:default}.mq-opt .lt{font-weight:800;color:var(--sub,#5a6b82);min-width:1.1em}' +
    '.mq-opt.ok{border-color:var(--ok,#15904a);background:var(--okbg,#e5f6ec)}.mq-opt.no{border-color:var(--no,#c62a2a);background:var(--nobg,#fdecec)}.mq-opt .mk{margin-left:auto;font-weight:800}' +
    '.mq-opt.ok .mk{color:var(--ok,#15904a)}.mq-opt.no .mk{color:var(--no,#c62a2a)}' +
    '.mq-verd{font-weight:800;border-radius:12px;padding:9px 12px;margin:10px 0 6px}.mq-verd.ok{background:var(--okbg,#e5f6ec);color:var(--ok,#15904a)}.mq-verd.no{background:var(--nobg,#fdecec);color:var(--no,#c62a2a)}' +
    '.mq-ana{font-size:.9rem;line-height:1.75}.mq-ana b.ac{color:var(--ok,#15904a)}.mq-ana b.wr{color:var(--no,#c62a2a)}.mq-ana .s{display:block;color:var(--sub,#5a6b82);font-size:.84rem;margin-top:5px}' +
    '.mq-links{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px}.mq-links a{color:var(--accent,var(--sel,#2563eb));font-weight:700;font-size:.86rem;text-decoration:none}' +
    '.mq-wbn{font-size:.76rem;color:var(--sub,#5a6b82)}' +
    '.mq-btn{display:block;width:100%;border:0;background:var(--accent,var(--sel,#2563eb));color:#fff;font-weight:800;font-size:1rem;border-radius:12px;padding:12px;margin-top:12px;cursor:pointer;font-family:inherit}' +
    '.mq-btn2{border:1.5px solid var(--accent,var(--sel,#2563eb));background:transparent;color:var(--accent,var(--sel,#2563eb))}.mq-btn:disabled{opacity:.45;cursor:not-allowed}' +
    '.mq-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.mq-res{text-align:center}.mq-pct{font-size:2.4rem;font-weight:900;color:var(--accent,var(--sel,#2563eb));line-height:1.25}.mq-sub{color:var(--sub,#5a6b82);font-size:.86rem}' +
    '.mq-wl{list-style:none;padding:0;margin:10px 0 0;text-align:left}.mq-wl li{border-top:1px solid var(--line,#e2e8f2);padding:8px 0;font-size:.86rem}.mq-wl a{color:var(--accent,var(--sel,#2563eb));font-weight:700;text-decoration:none;font-size:.78rem;margin-left:6px;white-space:nowrap}' +
    '.mq-ck{display:flex;gap:7px;align-items:center;font-size:.8rem;color:var(--sub,#5a6b82);margin-top:10px}' +
    'body.mq-lock{overflow:hidden}';
  try { var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); } catch (e) {}

  function wbOn() { try { return localStorage.getItem('pref_mq_wb') !== '0'; } catch (e) { return true; } }

  function start(opt) {
    var list = (opt.list || []).filter(function (x) { return x && x.q && SCORE.acc(x.q).length; });
    if (!list.length) return;
    var subs = {}; list.forEach(function (x) { subs[x.s] = 1; });
    var img = window.OPTIMG ? Promise.resolve() : PRACTICE.loadJs('optimg.js').catch(function () {});   // 圖片題(選項圖、題幹附圖)要用
    Promise.all(Object.keys(subs).map(function (s) { return PRACTICE.load(s).then(function (d) { return [s, d.ana]; }); }).concat([img])).then(function (rs) {
      rs = rs.slice(0, Object.keys(subs).length);
      var ana = {}; rs.forEach(function (r) { ana[r[0]] = r[1]; });
      ST = { title: opt.title || '小測驗', pool: list, n: opt.n || 0, ana: ana };
      run(pick(list, ST.n));
    });
  }
  function run(items) {
    ST.items = items; ST.i = 0; ST.ok = 0; ST.wrong = []; ST.done = false;
    var ov = document.querySelector('.mq-ov');
    if (!ov) {
      ov = document.createElement('div'); ov.className = 'mq-ov';
      ov.innerHTML = '<div class="mq-box" role="dialog" aria-modal="true"><div class="mq-hd"><b class="mq-t"></b><span class="mq-prog"></span><button class="mq-x" type="button" aria-label="關閉">✕</button></div><div class="mq-bd"></div></div>';
      document.body.appendChild(ov);
      ov.querySelector('.mq-x').onclick = close;
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      if (window.FAV) FAV.onClick(ov);
    }
    document.body.classList.add('mq-lock');
    ov.querySelector('.mq-t').textContent = ST.title;
    show();
  }
  function bd() { return document.querySelector('.mq-ov .mq-bd'); }
  function show() {
    var it = ST.items[ST.i], q = it.q, s = it.s;
    ST.answered = false;
    document.querySelector('.mq-ov .mq-prog').textContent = (ST.i + 1) + ' / ' + ST.items.length + ' · ✓ ' + ST.ok;
    var stale = window.STALE ? STALE.box(s, q) : '';
    var opts = q.opts.map(function (o, i) {
      var img = window.OPTIMG ? OPTIMG.html(q, i) : '';
      return '<button class="mq-opt" type="button" data-i="' + i + '"><span class="lt">' + L[i] + '</span><span>' + img + esc(clean(o)) + '</span><span class="mk"></span></button>';
    }).join('');
    bd().innerHTML = '<div class="mq-src">' + esc(PRACTICE.label(s, q)) + '</div><div class="mq-stem">' + esc(clean(q.stem)) + '</div>' + (window.OPTIMG && OPTIMG.fig ? OPTIMG.fig(q) : '') + stale +
      '<div class="mq-opts">' + opts + '</div><div class="mq-fb"></div>';
    bd().querySelector('.mq-opts').onclick = function (e) { var b = e.target.closest('.mq-opt'); if (b) answer(+b.dataset.i); };
    document.querySelector('.mq-ov').scrollTop = 0;
  }
  function answer(p) {
    if (ST.answered) return;
    ST.answered = true;
    var it = ST.items[ST.i], q = it.q, s = it.s, ok = SCORE.ok(q, p);
    if (ok) ST.ok++; else ST.wrong.push(it);
    PRACTICE.addDaily(1);
    if (!ok && wbOn()) PRACTICE.wbAdd(s, q, p);
    var btns = bd().querySelectorAll('.mq-opt');
    btns.forEach(function (b, i) { var m = SCORE.mark(q, i, p); if (m[0]) b.classList.add(m[0]); b.querySelector('.mk').textContent = m[1]; b.disabled = true; });
    var d = ST.ana[s] && ST.ana[s][PRACTICE.key(q)] || {};
    var rule = SCORE.rule(q);
    var last = ST.i + 1 >= ST.items.length;
    bd().querySelector('.mq-fb').innerHTML =
      '<div class="mq-verd ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✅ 答對!' : '✗ 答錯,正解是 ' + SCORE.ansLabel(q)) + (rule ? ' · ' + esc(rule) : '') + '</div>' +
      (d.a ? '<div class="mq-ana">' + d.a + (d.s ? '<span class="s">💡 ' + d.s + '</span>' : '') + '</div>' : '') +
      '<div class="mq-links"><a href="' + PRACTICE.href(s, q) + '">📖 看原題詳解 →</a>' + (window.FAV ? FAV.btn(s, q) : '') +
      (!ok && wbOn() ? '<span class="mq-wbn">📌 已收進「' + PRACTICE.SUBJ[s].short + '」錯題本</span>' : '') + '</div>' +
      '<button class="mq-btn mq-next" type="button">' + (last ? '看結果' : '下一題 →') + '</button>';
    bd().querySelector('.mq-next').onclick = next;
    document.querySelector('.mq-ov .mq-prog').textContent = (ST.i + 1) + ' / ' + ST.items.length + ' · ✓ ' + ST.ok;
  }
  function next() {
    if (!ST) return;
    ST.i++;
    if (ST.i >= ST.items.length) return result();
    show();
  }
  function result() {
    ST.done = true;
    var n = ST.items.length, pct = Math.round(ST.ok / n * 100);
    var wl = ST.wrong.map(function (it) {
      var st = clean(it.q.stem);
      return '<li>' + esc(st.length > 80 ? st.slice(0, 80) + '…' : st) + ' <b>→ ' + esc(SCORE.letters(it.q).map(function (l) { return l + ' ' + clean(it.q.opts[L.indexOf(l)]); }).join(' / ')) + '</b><a href="' + PRACTICE.href(it.s, it.q) + '">原題 →</a></li>';
    }).join('');
    bd().innerHTML = '<div class="mq-res"><div class="mq-sub">共 ' + n + ' 題</div><div class="mq-pct">' + pct + '%</div>' +
      '<div class="mq-sub">答對 ' + ST.ok + ' · 答錯 ' + (n - ST.ok) + '</div></div>' +
      (wl ? '<ul class="mq-wl">' + wl + '</ul>' : '') +
      '<div class="mq-row"><button class="mq-btn mq-btn2 mq-again" type="button">🔁 再抽一輪</button><button class="mq-btn mq-btn2 mq-redo" type="button"' + (ST.wrong.length ? '' : ' disabled') + '>📌 只練錯的(' + ST.wrong.length + ')</button></div>' +
      '<label class="mq-ck"><input type="checkbox" class="mq-wbck"' + (wbOn() ? ' checked' : '') + '> 答錯時把題目收進該科錯題本</label>' +
      '<button class="mq-btn mq-close" type="button">完成</button>';
    document.querySelector('.mq-ov .mq-prog').textContent = '結果';
    var wrongs = ST.wrong.slice();
    bd().querySelector('.mq-again').onclick = function () { run(pick(ST.pool, ST.n)); };
    bd().querySelector('.mq-redo').onclick = function () { run(shuffle(wrongs)); };
    bd().querySelector('.mq-close').onclick = close;
    bd().querySelector('.mq-wbck').onchange = function (e) { try { localStorage.setItem('pref_mq_wb', e.target.checked ? '1' : '0'); } catch (err) {} };
  }
  function close() {
    var ov = document.querySelector('.mq-ov');
    if (!ov) return;
    /* 中途關閉:已作答的題目先結算,再按一次才真正關掉 */
    if (ST && !ST.done && (ST.i > 0 || ST.answered)) { ST.items = ST.items.slice(0, ST.answered ? ST.i + 1 : ST.i); if (ST.items.length) return result(); }
    ov.remove(); document.body.classList.remove('mq-lock');
    if (ST && typeof ST.onClose === 'function') ST.onClose();
    ST = null;
  }
  document.addEventListener('keydown', function (e) {
    if (!ST || !document.querySelector('.mq-ov')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (ST.done || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest && e.target.closest('input,textarea')) return;
    var k = e.key.toUpperCase(), i = '1234'.indexOf(k); if (i < 0) i = L.indexOf(k);
    if (!ST.answered && i >= 0 && i < 4) { e.preventDefault(); answer(i); }
    else if (ST.answered && (e.key === 'Enter' || e.key === ' ') && !(e.target.closest && e.target.closest('button,a'))) { e.preventDefault(); next(); }
  });
  window.MINIQUIZ = { start: start, close: close };
})();
