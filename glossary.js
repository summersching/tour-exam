/* 點讀即查 — 點英文字看中文小框(離線,字典 dict.json)
   開啟「點讀」後,點任一英文字跳出:單字 + 音標 + 中文 + 🔊;會攔截點擊,測驗中不會誤選答案。 */
(function () {
  var DICT = null, on = false, loading = false, pop = null;

  // ---- 樣式 ----
  var css = document.createElement('style');
  css.textContent =
    '#glossBtn{position:fixed;right:14px;bottom:16px;z-index:9999;border:0;border-radius:22px;' +
    'padding:10px 15px;font-size:.9rem;font-weight:700;font-family:inherit;cursor:pointer;' +
    'background:#5a6b82;color:#fff;box-shadow:0 3px 12px rgba(0,0,0,.28)}' +
    '#glossBtn.on{background:#2563eb}' +
    'body.gloss-on{cursor:help}' +
    '#glossPop{position:fixed;z-index:10000;max-width:280px;background:#fff;color:#1c2330;' +
    'border:1px solid #d5deea;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.22);' +
    'padding:11px 13px;font-size:.92rem;line-height:1.55;font-family:inherit}' +
    '#glossPop .gw{font-weight:800;color:#2563eb;font-size:1.05rem}' +
    '#glossPop .gp{color:#0e7c86;font-style:italic;font-size:.85rem;margin-left:6px}' +
    '#glossPop .gz{margin-top:4px;color:#1c2330}' +
    '#glossPop .gsay{cursor:pointer;border:1px solid #d5deea;border-radius:6px;padding:0 6px;margin-left:6px;user-select:none;font-size:.85rem}' +
    '#glossPop .gx{float:right;color:#93a0b4;cursor:pointer;margin:-2px -3px 0 8px;font-size:1rem}' +
    '#glossPop .gna{color:#93a0b4}' +
    '@media (prefers-color-scheme:dark){' +
    '#glossPop{background:#1b2029;color:#e8edf5;border-color:#333d4d}' +
    '#glossPop .gw{color:#5b8cff}#glossPop .gz{color:#e8edf5}#glossPop .gp{color:#57cdd8}' +
    '#glossPop .gsay{border-color:#333d4d}#glossBtn{background:#3a4658}#glossBtn.on{background:#2563eb}}' +
    '@media print{#glossBtn,#glossPop{display:none!important}}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.id = 'glossBtn'; btn.type = 'button'; btn.textContent = '📖 點讀';
  document.body.appendChild(btn);
  btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });

  function toggle() {
    on = !on;
    btn.classList.toggle('on', on);
    document.body.classList.toggle('gloss-on', on);
    btn.textContent = on ? '📖 點讀:開' : '📖 點讀';
    hidePop();
    if (on && !DICT && !loading) {
      loading = true; btn.textContent = '📖 載入字典…';
      fetch('dict.json').then(function (r) { return r.json(); })
        .then(function (d) { DICT = d; loading = false; btn.textContent = '📖 點讀:開'; })
        .catch(function () { loading = false; btn.textContent = '📖 點讀:開'; });
    }
  }

  function norm(w) { return w.toLowerCase().replace(/^[^a-z']+|[^a-z']+$/g, ''); }
  function lookup(w) {
    if (!DICT) return null;
    w = norm(w); if (!w) return null;
    if (DICT[w]) return { w: w, d: DICT[w] };
    var b = w.split("'")[0];
    if (b && b !== w && DICT[b]) return { w: b, d: DICT[b] };
    var t = [w.replace(/s$/, ''), w.replace(/es$/, ''), w.replace(/ed$/, ''), w.replace(/ing$/, ''), w.replace(/ies$/, 'y'), w.replace(/ally$/, ''), w.replace(/ly$/, '')];
    for (var i = 0; i < t.length; i++) if (t[i] && DICT[t[i]]) return { w: t[i], d: DICT[t[i]] };
    return null;
  }

  function wordAt(x, y) {
    var node, off;
    if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); if (!r) return null; node = r.startContainer; off = r.startOffset; }
    else if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); if (!p) return null; node = p.offsetNode; off = p.offset; }
    else return null;
    if (!node || node.nodeType !== 3) return null;
    var t = node.textContent, s = off, e = off;
    while (s > 0 && /[A-Za-z']/.test(t[s - 1])) s--;
    while (e < t.length && /[A-Za-z']/.test(t[e])) e++;
    return e > s ? t.slice(s, e) : null;
  }

  function speak(t) { try { var u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }

  function showPop(x, y, word, d) {
    hidePop();
    pop = document.createElement('div'); pop.id = 'glossPop';
    var clean = word.replace(/'+$/, '');
    var html = '<span class="gx" data-x>✕</span><span class="gw">' + clean + '</span>';
    if (d && d.p) html += '<span class="gp">/' + d.p + '/</span>';
    html += '<span class="gsay" data-say>🔊</span>';
    html += d ? '<div class="gz">' + d.z + '</div>' : '<div class="gz gna">(此字典查無,多為人名/地名)</div>';
    pop.innerHTML = html;
    document.body.appendChild(pop);
    var pw = pop.offsetWidth, ph = pop.offsetHeight, vw = innerWidth, vh = innerHeight;
    var left = Math.min(Math.max(8, x - pw / 2), vw - pw - 8);
    var top = y + 18; if (top + ph > vh - 8) top = y - ph - 14; if (top < 8) top = 8;
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
    pop.querySelector('[data-say]').addEventListener('click', function (ev) { ev.stopPropagation(); speak(clean); });
    pop.querySelector('[data-x]').addEventListener('click', function (ev) { ev.stopPropagation(); hidePop(); });
  }
  function hidePop() { if (pop) { pop.remove(); pop = null; } }

  document.addEventListener('click', function (e) {
    if (!on) return;
    if (e.target === btn) return;
    if (pop && pop.contains(e.target)) return;
    var w = wordAt(e.clientX, e.clientY);
    if (!w) { hidePop(); return; }
    // 點讀模式:攔截點擊(測驗中不會誤選答案)
    e.preventDefault(); e.stopPropagation();
    showPop(e.clientX, e.clientY, w, lookup(w) ? lookup(w).d : null);
  }, true);
  window.addEventListener('scroll', hidePop, true);
  window.addEventListener('resize', hidePop);
})();
