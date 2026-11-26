/* en_clue.js — 英語詳解:歷屆閱讀的「看線索」與句子按鈕 · v348(2026-11-26)
   ------------------------------------------------------------------
   EN_CLUE['證照-年-題號'] = [題型, '段-句 段-句…', 要標的字詞?, '段-句|指代的內容'?]
     題型:main 主旨、det 細節、not NOT/EXCEPT、wd 字義/句意、ref 指代、inf 推論、pur 目的
     段-句 = 答案在哪一句(第一句最主要);20 份卷 200 題閱讀逐題人工確認(開發工具 en_clue_dec.py)
   ENCLUE.split(段落) → 句子陣列:句號、問號、驚嘆號後面接大寫或數字才切;Mr. Dr. U.S. e.g. a.m. 等縮寫不切
   ENCLUE.where(卷, 題號) → { psg 文章, start 文章第一題, clue 線索 }
   ENCLUE.psg(卷, 文章) → 文章 HTML:第 N 段、句子小編號、🖍 看線索(每題的出題句依題型上色、標題號;字義、指代題只標那個字詞)
   ENCLUE.line(卷, 題目, pid) → 解析上面的「線索」那一行:📍 句子按鈕,點了在那一行下面展開那一句(動作在 strat.js)
   樣式沿用 ui.css 的 .spsg(攻略卡範例短文)、.sref、.spop;文章外框與底色沿用 .passage(ui.css 的 .passage.spsg)
   變更履歷:v348 (2026-11-26) 初版 */
const EN_CLUE = {
  "leader-115-71": ["main", "1-2 2-2 2-6"],
  "leader-115-72": ["not", "2-1"],
  "leader-115-73": ["inf", "1-3"],
  "leader-115-74": ["det", "2-4"],
  "leader-115-75": ["pur", "2-6"],
  "leader-115-76": ["main", "1-6 2-1"],
  "leader-115-77": ["det", "1-4"],
  "leader-115-78": ["wd", "2-2", "fragmented"],
  "leader-115-79": ["not", "2-2 1-9"],
  "leader-115-80": ["det", "3-3"],
  "leader-114-71": ["main", "1-1 1-2"],
  "leader-114-72": ["det", "3-2"],
  "leader-114-73": ["det", "4-4 4-3"],
  "leader-114-74": ["inf", "5-2"],
  "leader-114-75": ["wd", "2-6"],
  "leader-114-76": ["det", "2-2"],
  "leader-114-77": ["det", "2-1 2-11"],
  "leader-114-78": ["det", "2-8"],
  "leader-114-79": ["wd", "2-13", "perpetual"],
  "leader-114-80": ["wd", "2-13", "viable"],
  "leader-113-71": ["det", "2-4"],
  "leader-113-72": ["det", "3-3"],
  "leader-113-73": ["det", "4-5"],
  "leader-113-74": ["det", "4-4"],
  "leader-113-75": ["not", "2-4"],
  "leader-113-76": ["main", "1-1"],
  "leader-113-77": ["det", "1-3"],
  "leader-113-78": ["wd", "3-2", "nuances"],
  "leader-113-79": ["ref", "3-5 3-3", "them", "3-3|laws"],
  "leader-113-80": ["det", "3-4", "feeding pigeons is prohibited in Venice"],
  "leader-112-71": ["det", "2-3 2-2"],
  "leader-112-72": ["not", "1-6"],
  "leader-112-73": ["det", "1-3"],
  "leader-112-74": ["det", "1-7", "ecological products"],
  "leader-112-75": ["det", "1-1", "Global warming"],
  "leader-112-76": ["main", "3-1 1-2"],
  "leader-112-77": ["det", "2-2 2-1"],
  "leader-112-78": ["not", "3-1"],
  "leader-112-79": ["det", "3-3"],
  "leader-112-80": ["det", "3-7 3-6"],
  "leader-111-71": ["main", "1-5 2-1"],
  "leader-111-72": ["wd", "1-4 1-5", "drone"],
  "leader-111-73": ["wd", "1-5", "hovering"],
  "leader-111-74": ["det", "2-3"],
  "leader-111-75": ["not", "3-3 3-1 3-2"],
  "leader-111-76": ["main", "1-1 2-1 3-1"],
  "leader-111-77": ["wd", "1-1", "paramount"],
  "leader-111-78": ["wd", "2-5", "quarantine"],
  "leader-111-79": ["wd", "3-1", "give you an edge over rivals who have not yet adopted it"],
  "leader-111-80": ["inf", "1-1 2-1 3-1"],
  "leader-110-71": ["wd", "2-1", "devastating"],
  "leader-110-72": ["wd", "2-4", "most of the money from tourism may undergo leakage"],
  "leader-110-73": ["not", "1-4"],
  "leader-110-74": ["inf", "2-5 2-3"],
  "leader-110-75": ["det", "3-2", "keep tourist groups to a manageable size and manage their movements and behavior"],
  "leader-110-76": ["main", "1-1"],
  "leader-110-77": ["wd", "2-1", "repository"],
  "leader-110-78": ["not", "2-1"],
  "leader-110-79": ["det", "2-3"],
  "leader-110-80": ["det", "3-1 3-2"],
  "leader-109-71": ["inf", "2-1"],
  "leader-109-72": ["inf", "2-10"],
  "leader-109-73": ["det", "2-4 2-6"],
  "leader-109-74": ["det", "2-10 1-8"],
  "leader-109-75": ["inf", "2-1 2-11"],
  "leader-109-76": ["not", "2-3 2-5"],
  "leader-109-77": ["wd", "1-1", "pressing"],
  "leader-109-78": ["not", "2-4"],
  "leader-109-79": ["det", "3-11", "a litter interceptor"],
  "leader-109-80": ["wd", "3-9", "aquatic species"],
  "leader-108-71": ["main", "1-4 3-1"],
  "leader-108-72": ["wd", "1-2", "replenishes"],
  "leader-108-73": ["det", "2-2", "use solar ovens to cook food"],
  "leader-108-74": ["pur", "3-1"],
  "leader-108-75": ["det", "3-5", "must receive special training to avoid causing soil erosion"],
  "leader-108-76": ["main", "1-3"],
  "leader-108-77": ["wd", "1-11", "adamant"],
  "leader-108-78": ["det", "1-7"],
  "leader-108-79": ["not", "2-3 2-2"],
  "leader-108-80": ["wd", "2-6"],
  "leader-107-71": ["main", "1-4 1-3"],
  "leader-107-72": ["det", "3-3", "unused basement room"],
  "leader-107-73": ["det", "4-1", "covered by CBC and other news outlets"],
  "leader-107-74": ["det", "2-1", "optical company"],
  "leader-107-75": ["inf", "3-1 1-4"],
  "leader-107-76": ["wd", "1-1 1-2", "bubbles of personal space"],
  "leader-107-77": ["det", "2-4"],
  "leader-107-78": ["det", "3-1 3-2"],
  "leader-107-79": ["wd", "3-7 3-6", "Pressing flesh"],
  "leader-107-80": ["not", "3-4 3-8"],
  "leader-106-71": ["main", "1-4"],
  "leader-106-72": ["det", "1-7 1-4"],
  "leader-106-73": ["det", "1-5 1-7"],
  "leader-106-74": ["det", "1-9"],
  "leader-106-75": ["wd", "1-9", "recognized"],
  "leader-106-76": ["main", "1-1 2-5"],
  "leader-106-77": ["det", "2-1", "like a partnership between travelers and locals"],
  "leader-106-78": ["not", "1-4"],
  "leader-106-79": ["wd", "1-6", "via"],
  "leader-106-80": ["inf", "2-5 2-4"],
  "guide-115-71": ["det", "2-4"],
  "guide-115-72": ["wd", "2-2", "subdued"],
  "guide-115-73": ["wd", "2-3", "plumage"],
  "guide-115-74": ["main", "1-1 1-2"],
  "guide-115-75": ["not", "3-4"],
  "guide-115-76": ["wd", "2-1", "undercut"],
  "guide-115-77": ["det", "1-2", "Waymo, Cruise, Argo and Zoox"],
  "guide-115-78": ["det", "7-2", "crashed as ride hailing permeated the marketplace"],
  "guide-115-79": ["inf", "7-4 2-2"],
  "guide-115-80": ["main", "1-1"],
  "guide-114-71": ["main", "1-3 3-2"],
  "guide-114-72": ["not", "2-4 2-5 2-6 2-7"],
  "guide-114-73": ["det", "3-1", "tourism slips down national policy agendas"],
  "guide-114-74": ["inf", "3-2"],
  "guide-114-75": ["det", "3-4"],
  "guide-114-76": ["det", "4-2 4-1"],
  "guide-114-77": ["not", "1-4 3-2 3-3"],
  "guide-114-78": ["wd", "3-3", "leveraging"],
  "guide-114-79": ["inf", "3-6"],
  "guide-114-80": ["not", "4-3"],
  "guide-113-71": ["wd", "1-3", "restored"],
  "guide-113-72": ["wd", "2-3"],
  "guide-113-73": ["not", "1-3 1-1"],
  "guide-113-74": ["det", "2-8"],
  "guide-113-75": ["not", "1-1 2-1 3-1"],
  "guide-113-76": ["pur", "4-1 4-8"],
  "guide-113-77": ["det", "4-2"],
  "guide-113-78": ["ref", "4-5 4-2", "the real roots of their visiting places", "4-2|local food"],
  "guide-113-79": ["wd", "1-5", "gastronomic"],
  "guide-113-80": ["inf", "3-7"],
  "guide-112-71": ["main", "1-6 4-3"],
  "guide-112-72": ["det", "1-7", "the most common way is to use batteries"],
  "guide-112-73": ["det", "2-2"],
  "guide-112-74": ["det", "3-4"],
  "guide-112-75": ["det", "4-1", "the first step towards greener air travel"],
  "guide-112-76": ["not", "2-1 5-1"],
  "guide-112-77": ["wd", "1-1", "jolted"],
  "guide-112-78": ["det", "3-2", "a group of wild canine animals"],
  "guide-112-79": ["det", "4-1", "insight into their habits and routines"],
  "guide-112-80": ["not", "4-2"],
  "guide-111-71": ["not", "1-3 1-2"],
  "guide-111-72": ["wd", "2-1", "vitalize"],
  "guide-111-73": ["wd", "2-2", "infrastructures"],
  "guide-111-74": ["not", "2-8 2-6"],
  "guide-111-75": ["not", "3-1"],
  "guide-111-76": ["det", "2-2", "vineyards"],
  "guide-111-77": ["det", "4-4 4-3"],
  "guide-111-78": ["inf", "5-4", "Your ride will be bumpy"],
  "guide-111-79": ["inf", "3-4 3-3"],
  "guide-111-80": ["inf", "1-3"],
  "guide-110-71": ["main", "1-2 2-2 3-2"],
  "guide-110-72": ["wd", "1-5", "Taiwan is home to many breathtaking mountains, hills, and valleys"],
  "guide-110-73": ["wd", "2-2", "you are bound to"],
  "guide-110-74": ["not", "2-2 2-3"],
  "guide-110-75": ["not", "3-2 1-2"],
  "guide-110-76": ["det", "2-1 2-3"],
  "guide-110-77": ["wd", "2-3", "impede"],
  "guide-110-78": ["main", "3-1 3-4"],
  "guide-110-79": ["not", "2-2 2-1"],
  "guide-110-80": ["wd", "2-4", "trying times"],
  "guide-109-71": ["det", "1-3 1-2"],
  "guide-109-72": ["wd", "4-1", "Love looks not with the eyes, but with the mind"],
  "guide-109-73": ["det", "3-3 3-1"],
  "guide-109-74": ["det", "2-1", "love and chocolate go hand in hand"],
  "guide-109-75": ["wd", "1-1", "love is in the air"],
  "guide-109-76": ["det", "2-2 1-1"],
  "guide-109-77": ["det", "3-1 2-2"],
  "guide-109-78": ["wd", "2-3", "bunches of selfie sticks"],
  "guide-109-79": ["main", "3-2 2-3"],
  "guide-109-80": ["main", "3-4", "spinning the globe and booking a flight to a country you know little about"],
  "guide-108-71": ["not", "1-7 1-4 1-5 1-6"],
  "guide-108-72": ["det", "1-8", "progressive technological conditions in medicine, tourism, and information services"],
  "guide-108-73": ["not", "2-2 2-1"],
  "guide-108-74": ["det", "2-7 2-6"],
  "guide-108-75": ["det", "2-6", "a place for health promotion and disease rehabilitation"],
  "guide-108-76": ["det", "3-4", "such as translation or answering questions"],
  "guide-108-77": ["det", "1-5"],
  "guide-108-78": ["det", "1-5 1-3"],
  "guide-108-79": ["det", "2-4 2-1"],
  "guide-108-80": ["det", "1-5"],
  "guide-107-71": ["main", "1-1"],
  "guide-107-72": ["wd", "1-4", "how the lacquer is applied in several layers"],
  "guide-107-73": ["det", "1-1", "Five Swedish designers have worked with artisans in Taiwan"],
  "guide-107-74": ["det", "2-1"],
  "guide-107-75": ["inf", "1-1 4-1"],
  "guide-107-76": ["main", "3-4 2-1"],
  "guide-107-77": ["det", "1-1", "it is probably speed"],
  "guide-107-78": ["det", "3-2"],
  "guide-107-79": ["wd", "2-4", "nostalgia"],
  "guide-107-80": ["det", "3-2"],
  "guide-106-71": ["main", "1-1 2-1"],
  "guide-106-72": ["wd", "1-3", "coveted"],
  "guide-106-73": ["wd", "2-1", "white glove service"],
  "guide-106-74": ["main", "1-2 2-6"],
  "guide-106-75": ["wd", "1-4", "a high end, 100% custom road and mountain bike (and hike) tour operator"],
  "guide-106-76": ["pur", "2-4 3-5"],
  "guide-106-77": ["inf", "3-5 4-1"],
  "guide-106-78": ["wd", "2-3", "Paradoxically"],
  "guide-106-79": ["det", "5-2"],
  "guide-106-80": ["inf", "4-3"]
};
const ENCLUE = (function () {
  'use strict';
  var ABBR = /(?:^|[\s(])(?:Mr|Mrs|Ms|Dr|St|Mt|No|vs|U\.S|U\.K|e\.g|i\.e|a\.m|p\.m|Jr|Sr|Prof|approx|Inc|Ltd|Co)\.$/i;
  var LAB = { main: '主旨', det: '細節', not: 'NOT 題', wd: '字義', ref: '指代', inf: '推論', pur: '目的' };
  var LEAD = { main: '主旨題 · 看這幾句', det: '細節題 · 答案在', not: 'NOT 題 · 逐項對照', wd: '字義題', ref: '指代題', inf: '推論題 · 根據', pur: '目的題 · 看' };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function split(par) {
    var out = [], start = 0, re = /[.!?]+["'”’)]*\s+(?=["'“‘(]?[A-Z0-9])/g, m;
    while ((m = re.exec(par))) {
      var end = m.index + m[0].replace(/\s+$/, '').length, cand = par.slice(start, end);
      if (ABBR.test(cand)) continue;
      out.push(cand.trim()); start = m.index + m[0].length;
    }
    var last = par.slice(start).trim(); if (last) out.push(last);
    return out;
  }
  function data(k) { return (typeof EN_REVIEW !== 'undefined' && EN_REVIEW[k]) || []; }
  function where(k, no) {
    var D = data(k), psg = null, start = 0;
    for (var i = 0; i < D.length; i++) {
      var it = D[i];
      if (it.kind === 'passage') { psg = it; start = 0; continue; }
      if (it.kind === 'q' && psg) { if (!start) start = it.no; if (it.no === no) return { psg: psg, start: start, clue: EN_CLUE[k + '-' + no] || null }; }
    }
    return null;
  }
  function qsOf(k, psg) {
    var D = data(k), i = D.indexOf(psg), out = [];
    if (i < 0) return out;
    for (var j = i + 1; j < D.length && D[j].kind !== 'passage'; j++) if (D[j].kind === 'q') out.push(D[j]);
    return out;
  }
  function sentOf(P, id) { var a = id.split('-'); return (P[+a[0] - 1] || [])[+a[1] - 1] || ''; }
  function mark(s, parts) {
    var spans = [], out = '', at = 0;
    parts.forEach(function (p) { var i = s.indexOf(p.ph); if (i >= 0) spans.push([i, i + p.ph.length, p]); });
    spans.sort(function (a, b) { return a[0] - b[0]; });
    spans.forEach(function (sp) {
      if (sp[0] < at) return;
      var p = sp[2], inner = esc(s.slice(sp[0], sp[1]));
      out += esc(s.slice(at, sp[0])) + (p.u ? '<span class="cu">' + inner + '</span>' : '<span class="ck" data-ty="' + p.t + '" data-l="' + p.lab + '">' + inner + '</span>');
      at = sp[1];
    });
    return out + esc(s.slice(at));
  }
  function psg(k, item) {
    var P = item.text.map(split), whole = {}, part = {};
    qsOf(k, item).forEach(function (q) {
      var c = EN_CLUE[k + '-' + q.no]; if (!c) return;
      var t = c[0], ids = c[1].split(' '), w = c[2], u = c[3], lab = q.no + ' ' + LAB[t];
      ids.forEach(function (id, i) {
        if (i === 0 && w) (part[id] = part[id] || []).push({ ph: w, t: t, lab: lab });
        else if (t !== 'wd' && t !== 'ref') (whole[id] = whole[id] || []).push({ t: t, lab: lab });
      });
      if (u) { var p = u.split('|'); (part[p[0]] = part[p[0]] || []).push({ ph: p[1], u: 1 }); }
    });
    return '<div class="stb"><button type="button" data-tg="clue" aria-pressed="false">🖍 看線索</button></div>' + P.map(function (ss, pi) {
      return '<p class="sp"><span class="sn">第 ' + (pi + 1) + ' 段</span>' + ss.map(function (s, si) {
        var id = (pi + 1) + '-' + (si + 1), h = mark(s, part[id] || []), W = whole[id];
        if (W) h = '<span class="ck" data-ty="' + W[0].t + '" data-l="' + W.map(function (x) { return x.lab; }).join(' · ') + '">' + h + '</span>';
        return '<span class="ss" data-s="' + id + '"><sup class="sno">' + (si + 1) + '</sup>' + h + '</span>';
      }).join(' ') + '</p>';
    }).join('');
  }
  function line(k, q, pid) {
    var w = where(k, q.no); if (!w || !w.clue) return '';
    var c = w.clue, t = c[0], P = w.psg.text.map(split), word = (t === 'wd' || t === 'ref') && c[2];
    var lead = word ? LEAD[t] + (c[2].length <= 40 ? ' · 「' + esc(c[2]) + '」在' : ' · 在') : LEAD[t];
    return '<div class="egline clue-ln"><span class="egb">線索</span>' + lead + ' ' + c[1].split(' ').map(function (id) {
      var a = id.split('-');
      return '<button type="button" class="sref" data-p="' + pid + '" data-s="' + id + '" data-t="' + esc(sentOf(P, id)) + '">📍第 ' + a[0] + ' 段第 ' + a[1] + ' 句</button>';
    }).join(' ') + '</div>';
  }
  return { split: split, where: where, psg: psg, line: line };
})();
