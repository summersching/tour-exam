/* jplook.js — 日文「點字查詞」(版本 v121)
 * 開啟後,點題幹 / 讀解文章 / 解析裡的日文字詞 → 彈出小卡:讀音(平假名,可加羅馬拼音)、原形、詞性、
 * 中文意思(題庫內建詞庫)與 🔊。完全離線:斷詞用 kuromoji,詞庫由 jp_ana.js 的語彙(v)與選項中譯(oz)組成。
 * 用法:JPLOOK.attach(容器, {tokenizer:()=>TOK, speak:fn, romaji:()=>bool, toRomaji:fn, allow:'選擇器'})
 *       JPLOOK.setOn(true/false);JPLOOK.dictSize()
 */
(function () {
  var ON = false, DICT = null, POP = null, OPT = null;
  var POS = { '名詞': '名詞', '動詞': '動詞', '形容詞': 'い形容詞', '副詞': '副詞', '助詞': '助詞', '助動詞': '助動詞', '連体詞': '連體詞', '接続詞': '接續詞', '感動詞': '感嘆詞', '接頭詞': '接頭詞', 'フィラー': '語氣詞' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function k2h(s) { return String(s || '').replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); }); }
  var KANA = /[ぁ-んァ-ヶー]/, CJK = /[㐀-鿿]/;

  function buildDict() {
    var d = {};
    function add(w, r, m) {
      w = String(w || '').trim(); m = String(m || '').trim();
      if (!w || !m || w.length > 12 || d[w]) return;
      d[w] = { r: r || '', m: m };
    }
    if (typeof JPANA === 'undefined') return d;
    var Q = {};
    if (typeof JPBANK !== 'undefined') JPBANK.forEach(function (q) { Q[q.c + '-' + q.y + '-' + q.no] = q; });
    Object.keys(JPANA).forEach(function (id) {
      var a = JPANA[id];
      (a.v || []).forEach(function (v) { add(v[0], v[1], v[2]); });
    });
    // 選項中譯:「討論會(討論会)」→ 討論会 = 討論會(只收短詞,略過標「誤」的)
    Object.keys(JPANA).forEach(function (id) {
      var a = JPANA[id], q = Q[id];
      if (!q || !a.oz) return;
      q.opts.forEach(function (o, i) {
        var z = a.oz[i];
        if (!z || /誤/.test(z) || !o || o.length > 8 || /\s/.test(o)) return;
        var m = z.replace(/\s*[(（][^)）]*[)）]\s*$/, '').trim();
        if (!m || m.length > 16 || KANA.test(m) || !CJK.test(m)) return;
        add(o, '', m);
      });
    });
    return d;
  }
  function dict() { if (!DICT) DICT = buildDict(); return DICT; }

  function caret(x, y) {
    if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); return r ? { node: r.startContainer, off: r.startOffset } : null; }
    if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); return p ? { node: p.offsetNode, off: p.offset } : null; }
    return null;
  }
  // 把容器內文字(排除振假名 rt 與 🔊)串起來,並算出點擊位置在整段文字中的位置
  function flatten(box, node, off) {
    var text = '', pos = -1;
    var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return (n.parentNode && n.parentNode.closest && n.parentNode.closest('rt,.say,rp')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n;
    while ((n = w.nextNode())) {
      if (n === node) pos = text.length + off;
      text += n.nodeValue;
    }
    return { text: text, pos: pos };
  }
  function posLabel(t) {
    if (t.pos === '名詞' && t.pos_detail_1 === '形容動詞語幹') return 'な形容詞(語幹)';
    if (t.pos === '名詞' && t.pos_detail_1 === '固有名詞') return '專有名詞';
    if (t.pos === '名詞' && t.pos_detail_1 === 'サ変接続') return '名詞(可加する)';
    return POS[t.pos] || t.pos || '';
  }
  function find(tokens, pos) {
    var at = 0;
    for (var i = 0; i < tokens.length; i++) {
      var len = tokens[i].surface_form.length;
      if (pos >= at && pos < at + len) return i;
      at += len;
    }
    return -1;
  }
  function lookupWord(tokens, i) {
    var D = dict(), t = tokens[i];
    // 由點到的字往後最多併 3 個詞,取詞庫裡最長的命中(例如 ため息、お預かり)
    var best = null, s = '';
    for (var j = i; j < Math.min(tokens.length, i + 4); j++) {
      s += tokens[j].surface_form;
      if (D[s]) best = { w: s, e: D[s], n: j - i + 1 };
    }
    if (!best && t.basic_form && t.basic_form !== '*' && D[t.basic_form]) best = { w: t.basic_form, e: D[t.basic_form], n: 1 };
    return best;
  }
  function hide() { if (POP) { POP.remove(); POP = null; } }
  function show(x, y, html) {
    hide();
    POP = document.createElement('div');
    POP.className = 'jlk';
    POP.innerHTML = html;
    document.body.appendChild(POP);
    var w = POP.offsetWidth, h = POP.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
    var left = Math.max(8, Math.min(x - w / 2, vw - w - 8));
    var top = y + 18; if (top + h > vh - 8) top = Math.max(8, y - h - 14);
    POP.style.left = left + 'px'; POP.style.top = top + 'px';
  }
  function onClick(e) {
    if (!ON || !OPT) return;
    if (POP && POP.contains(e.target)) return;
    var box = e.target.closest && e.target.closest(OPT.allow);
    if (!box || e.target.closest('.say,button.opt.clk,summary,a')) return;
    var tok = OPT.tokenizer && OPT.tokenizer();
    if (!tok) return;
    var c = caret(e.clientX, e.clientY);
    if (!c || !box.contains(c.node) || c.node.nodeType !== 3) return;
    var f = flatten(box, c.node, c.off);
    if (f.pos < 0 || !f.text) return;
    var tokens; try { tokens = tok.tokenize(f.text); } catch (err) { return; }
    var i = find(tokens, f.pos);
    if (i < 0) return;
    var t = tokens[i];
    if (t.pos === '記号' || !/[ぁ-んァ-ヶー㐀-鿿々]/.test(t.surface_form)) return;
    var hit = lookupWord(tokens, i);
    var surf = hit && hit.n > 1 ? hit.w : t.surface_form;
    var reading = hit && hit.n > 1 ? (hit.e.r || '') : (t.reading && t.reading !== '*' ? k2h(t.reading) : '');
    if (!reading && hit && hit.e.r) reading = hit.e.r;
    var showR = reading && reading !== surf;
    var rom = (OPT.romaji && OPT.romaji() && OPT.toRomaji && reading) ? OPT.toRomaji(reading) : '';
    var base = (!hit || hit.n === 1) && t.basic_form && t.basic_form !== '*' && t.basic_form !== t.surface_form ? t.basic_form : '';
    var html = '<div class="jlk-h"><b>' + esc(surf) + '</b>' + (showR ? '<span class="jlk-r">' + esc(reading) + '</span>' : '') +
      (rom ? '<span class="jlk-ro">' + esc(rom) + '</span>' : '') +
      '<span class="say jlk-say" data-say="' + esc(reading || surf) + '" title="朗讀">🔊</span><span class="jlk-x" title="關閉">✕</span></div>' +
      '<div class="jlk-l">' + (base ? '原形:' + esc(base) + ' · ' : '') + esc(hit && hit.n > 1 ? '詞組' : posLabel(t)) + '</div>' +
      (hit ? '<div class="jlk-m">' + esc(hit.e.m) + '</div>' : '<div class="jlk-n">題庫詞庫沒有這個字的中文;讀音與原形可參考上方。</div>');
    e.preventDefault(); e.stopPropagation();
    show(e.clientX, e.clientY, html);
  }
  function onPopClick(e) {
    if (!POP || !POP.contains(e.target)) return;
    if (e.target.closest('.jlk-x')) { hide(); return; }
    var s = e.target.closest('.jlk-say');
    if (s && OPT && OPT.speak) OPT.speak(s.dataset.say);
  }
  function onDocDown(e) { if (POP && !POP.contains(e.target)) hide(); }
  try {
    var css = '.jlk{position:fixed;z-index:60;max-width:min(320px,calc(100vw - 16px));background:var(--card,#fff);color:var(--ink,#1c2330);border:1px solid var(--line,#e2e8f2);border-radius:12px;padding:10px 13px;box-shadow:0 8px 28px rgba(0,0,0,.18);font-size:.9rem;line-height:1.55}' +
      '.jlk-h{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.jlk-h b{font-size:1.15rem}.jlk-r{color:var(--sel,#4f46e5);font-weight:700}.jlk-ro{color:var(--sub,#5a6b82);font-size:.8rem;font-style:italic}' +
      '.jlk-say{cursor:pointer;margin-left:auto}.jlk-x{cursor:pointer;color:var(--sub,#5a6b82);padding:0 2px}' +
      '.jlk-l{font-size:.78rem;color:var(--sub,#5a6b82);margin-top:2px}.jlk-m{margin-top:5px;font-weight:600}.jlk-n{margin-top:5px;font-size:.8rem;color:var(--sub,#5a6b82)}' +
      'body.jlk-on .stem,body.jlk-on .psgt,body.jlk-on .ana,body.jlk-on div.opt{cursor:help}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  } catch (err) {}
  window.JPLOOK = {
    attach: function (box, opt) {
      OPT = opt; OPT.allow = OPT.allow || '.stem,.psgt,.ana';
      box.addEventListener('click', onClick, true);
      document.addEventListener('click', onPopClick, true);
      document.addEventListener('pointerdown', onDocDown, true);
      window.addEventListener('scroll', hide, { passive: true });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
    },
    setOn: function (v) { ON = !!v; document.body.classList.toggle('jlk-on', ON); if (!ON) hide(); },
    isOn: function () { return ON; },
    dictSize: function () { return Object.keys(dict()).length; },
    lookup: function (w) { return dict()[w] || null; }
  };
})();
