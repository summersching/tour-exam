/* must100.js — 中文三科「必背 100 條」挑選(單一來源)· v129
   ------------------------------------------------------------------
   從 sprint_cn.js(考點速記)挑出每科最該背的 100 條:
     1. 同一細類內字面相近的重點合併(字元二元組 Jaccard ≥ 0.45),出處題號累加 → 考越多次的越前面
     2. 排除答題技巧類(「題幹…」「問『…』→ 刪…」「敘述 X 錯」「均給分」等)與太長的敘述
     3. 排除出處全是「法規已修正、官方答案已不適用」的題(stale.js k='old')
     4. 名額依各細類的出題數比例分配(最大餘數法);某細類可背的條目不夠,名額讓給其他細類
     5. 細類內排序:被考次數 → 有「=、→」對照 → 最近考過 → 較短
   MUST100.build(SPRINTCN, subj, cert, n?) → [{ g, icon, tt, p, refs, id }](依大類 → 細類排序)
     cert:'all' | 'guide' | 'leader'(只看該證照的出處,名額依該證照出題比例重算)
   MUST100.pid(p)  條目的穩定 id(背過標記用)
   變更履歷:
     v129 (2026-10-05) 初版
*/
(function (root) {
  'use strict';
  var TECH = /^(題幹|題目|題意|時序題|年代刪去法|刪去|問「|問『|看到|看地名|先|關鍵字|選項|四選項|注意|小心|陷阱|直接|抓|用|找|排除|比較|逐項|逐一|組合題|節慶題|核對)|→\s*錯|刪掉|先刪|鎖定|逐一|逐項|組合題|選項|題幹|題目|給分|有誤/;
  var WRONGTAG = /敘述\s*[A-D]\s*(錯|有誤|正確)/;
  var FACT = /[=＝→]/;
  var SIM = 0.45, MAXLEN = 90;

  function clean(p) {
    return String(p)
      .replace(/[;；,，]\s*(凡)?含[①-⑳][^。]*?(者)?(全)?刪。?$/, '。')
      .replace(/[,，;；]\s*(這是)?固定(考點|配對記憶)(,|，)?(直接記)?。?$/, '。')
      .replace(/^純記憶題。\s*/, '')
      .replace(/^記(文化數字)?口訣:/, '口訣:');
  }
  function norm(s) { return s.replace(/[\s,，.。、:：;；!?！？「」『』()（）\[\]【】=＝→\-—~～·・/／"'“”‘’<>]/g, ''); }
  function bigr(s) { var t = norm(s), o = {}, n = 0; for (var i = 0; i < t.length - 1; i++) { var k = t.slice(i, i + 2); if (!o[k]) { o[k] = 1; n++; } } return { set: o, n: n }; }
  function jac(a, b) { var n = 0; for (var k in a.set) if (b.set[k]) n++; return n / ((a.n + b.n - n) || 1); }
  function yr(r) { var m = String(r).match(/^[gl](\d+)-/); return m ? +m[1] : 0; }
  function pid(p) { var h = 5381, s = String(p); for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function staleOld(subj, ref) {
    var S = root.STALE; if (!S) return false;
    var m = String(ref).match(/^([gl])(\d+)-(\d+)$/); if (!m) return false;
    var n = S.note(subj, { c: m[1] === 'g' ? 'guide' : 'leader', y: m[2], no: +m[3] });
    return !!(n && n.k === 'old');
  }

  function build(SC, subj, cert, N) {
    var data = SC && SC[subj]; if (!data) return [];
    N = N || 100; cert = cert || 'all';
    var topics = [];
    data.groups.forEach(function (g) {
      g.items.forEach(function (it) {
        var cl = [];
        it.pts.forEach(function (p0, i) {
          var p = clean(p0);
          var refs = ((it.src || [])[i] || []).slice();
          if (cert !== 'all') refs = refs.filter(function (r) { return r.charAt(0) === cert.charAt(0); });
          if (!refs.length) return;
          var bg = bigr(p), hit = null;
          for (var k = 0; k < cl.length; k++) { if (jac(cl[k].bg, bg) >= SIM) { hit = cl[k]; break; } }
          if (hit) {
            refs.forEach(function (r) { if (hit.refs.indexOf(r) < 0) hit.refs.push(r); });
            var pf = FACT.test(p), hf = FACT.test(hit.p);
            if ((pf && !hf) || (pf === hf && p.length < hit.p.length)) hit.p = p;
          } else cl.push({ g: g.t, icon: g.icon, tt: it.tt, p: p, bg: bg, refs: refs });
        });
        if (!cl.length) return;
        var n = 0;
        cl.forEach(function (x) {
          n += x.refs.length;
          x.ok = !TECH.test(x.p) && !WRONGTAG.test(x.p) && x.p.length <= MAXLEN &&
                 !x.refs.every(function (r) { return staleOld(subj, r); });
          x.fact = FACT.test(x.p);
          x.last = Math.max.apply(null, x.refs.map(yr));
        });
        var ok = cl.filter(function (x) { return x.ok; });
        ok.sort(function (a, b) { return (b.refs.length - a.refs.length) || (b.fact - a.fact) || (b.last - a.last) || (a.p.length - b.p.length); });
        topics.push({ g: g.t, icon: g.icon, tt: it.tt, n: n, ok: ok, q: 0 });
      });
    });
    var left = Math.min(N, topics.reduce(function (a, t) { return a + t.ok.length; }, 0));
    while (left > 0) {
      var open = topics.filter(function (t) { return t.q < t.ok.length; });
      var tot = open.reduce(function (a, t) { return a + t.n; }, 0);
      var want = open.map(function (t) { return { t: t, raw: left * t.n / tot }; }), give = 0;
      want.forEach(function (w) { var k = Math.min(Math.floor(w.raw), w.t.ok.length - w.t.q); w.t.q += k; give += k; w.rem = w.raw - Math.floor(w.raw); });
      left -= give;
      if (left > 0) {
        want.filter(function (w) { return w.t.q < w.t.ok.length; })
          .sort(function (a, b) { return (b.rem - a.rem) || (b.t.n - a.t.n); })
          .forEach(function (w) { if (left > 0) { w.t.q++; left--; } });
      }
    }
    var out = [];
    topics.forEach(function (t) {
      t.ok.slice(0, t.q).forEach(function (x) { out.push({ g: x.g, icon: x.icon, tt: x.tt, p: x.p, refs: x.refs, id: pid(x.p) }); });
    });
    return out;
  }
  root.MUST100 = { build: build, pid: pid, clean: clean };
})(typeof window !== 'undefined' ? window : this);
