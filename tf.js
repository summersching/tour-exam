/* tf.js — 是非快問題目產生器(單一來源)· v127
   ------------------------------------------------------------------
   把歷屆「下列何者正確 / 何者錯誤」單選題拆成一句一句的是非題,答案直接沿用官方公告答案:
     題幹問「何者正確 / 適當」→ 正解那一項 = ⭕ 對,其他三項 = ❌ 錯
     題幹問「何者錯誤 / 有誤 / 不正確 / 為非 / 不適當 / 不宜」→ 正解那一項 = ❌ 錯,其他三項 = ⭕ 對
   為了不出錯,下列題目一律不拆:
     · 送分題、官方公告「答 X 或 Y 均給分」的題目(答案不唯一)
     · 有時效提醒的題目(stale.js:法規已修正或屬時空背景題)
     · 比較級題目(「最 / 較 適當、正確」— 其他選項不一定是錯的)
     · 組合選項(①②③、甲乙丙、以上皆是…)、圖片題、太短的選項(< 6 字,脫離題幹看不懂)
   TF.build(subj, bank, ana) → [{id, subj, c, y, no, i, ctx, text, truth, t}]
     id    'subj|c-y-no|i'(錯題紀錄用)
     ctx   題幹去掉「下列何者錯誤?」後剩下的前提(如「有關太平山國家森林遊樂區之敘述」),可能是空字串
     text  選項原文(已去掉 PDF 轉檔殘留的 ˉ 等符號)
     truth true = ⭕ 對、false = ❌ 錯
     t     解析大類(ANA.t,沒有解析時為「其他」)
   變更履歷:
     v127 (2026-10-05) 初版
*/
(function () {
  'use strict';
  var JUDGE = '(正確|錯誤|有誤|不正確|不對|為真|為非|適當|不適當|恰當|不恰當|不宜)';
  var ASK = '(何者|何項|那一項|哪一項|那一個|哪一個|那一說法|哪一說法)';
  /* 題幹結尾:「…[下列][敘述]何者[敘述][為]錯誤?」 */
  var END = new RegExp('^(.*?)' + ASK + '(敘述|說法|描述|說明|選項)?(是|為)?' + JUDGE + '(的)?[？?。]?$');
  var NEGW = /^(錯誤|有誤|不正確|不對|為非|不適當|不恰當|不宜)$/;
  var COMBO = /[①②③④⑤⑥甲乙丙丁戊]|以上|皆是|皆非|皆正確|皆錯誤|均正確|均錯誤|均是|均非|都對|都錯|\([A-D]\)|（[A-D]）/;

  function clean(s) { return String(s == null ? '' : s).replace(/[ˉ‾¯]+/g, '').replace(/\s+/g, ' ').trim(); }
  /* 題幹前提:去掉結尾標點與「下列 / 以下 / 請問」等指涉選項的字,保留「有關…之敘述」 */
  function ctxOf(before, noun) {
    var s = clean(before).replace(/\s/g, '').replace(/[，,、：:；;]+$/, '');
    s = s.replace(/(請問)?(下列|以下)(敘述|說法|描述|選項|說明)?$/, '');
    s = s.replace(/請問|下列/g, '').replace(/^以下/, '').replace(/以下(?=有關|關於|各|敘述)/g, '');
    s = s.replace(/[，,、：:；;\s]+$/, '');
    if (noun && /[之的]$/.test(s)) s += noun;      // 「…之敘述何者錯誤」:敘述被結尾規則吃掉時補回
    return s;
  }
  /* 一題能不能拆:回傳 {neg, ctx} 或 null */
  function parse(subj, q) {
    if (!q || !Array.isArray(q.opts) || q.opts.length !== 4) return null;
    if (q.sungei || (Array.isArray(q.alt) && q.alt.length > 1)) return null;
    if (typeof q.ans !== 'number' || q.ans < 0 || q.ans > 3) return null;
    if (q.img || q.fig) return null;
    if (window.STALE && STALE.note(subj, q)) return null;
    var stem = clean(q.stem).replace(/\s/g, '');
    if (/[①②③④⑤⑥]/.test(stem)) return null;
    if (/下圖|如圖|圖為|圖中|附圖|下表|表中|如表|照片/.test(stem)) return null;   // 要看圖表才答得出來
    var m = stem.match(END);
    if (!m) return null;
    var before = m[1];
    if (/[較最]$/.test(before) || /(較|最|較為|最為)$/.test(before)) return null;   // 比較級
    var opts = q.opts.map(clean);
    for (var i = 0; i < 4; i++) {
      if (opts[i].length < 6 || COMBO.test(opts[i])) return null;
    }
    if (new Set(opts).size < 4) return null;
    return { neg: NEGW.test(m[5]), ctx: ctxOf(before, m[3]) };
  }
  function build(subj, bank, ana) {
    var out = [];
    (bank || []).forEach(function (q) {
      var p = parse(subj, q); if (!p) return;
      var k = q.c + '-' + q.y + '-' + q.no, d = (ana && ana[k]) || {};
      q.opts.forEach(function (o, i) {
        var isAns = i === q.ans;
        out.push({ id: subj + '|' + k + '|' + i, subj: subj, c: q.c, y: +q.y, no: q.no, i: i,
          ctx: p.ctx, text: clean(o), truth: p.neg ? !isAns : isAns, t: d.t || '其他' });
      });
    });
    return out;
  }
  window.TF = { build: build, parse: parse, clean: clean, ctxOf: ctxOf };
})();
