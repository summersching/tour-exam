/* practice.js — 中文三科練習共用(單一來源)· v127
   ------------------------------------------------------------------
   是非快問、數字速記、兩岸與入出境、小測驗彈窗(miniquiz.js)共用:
     PRACTICE.SUBJ              三科資料(題庫檔 / 解析檔 / 複習頁 / 錯題本 key)
     PRACTICE.load(s)           延遲載入該科題庫 + 解析 → Promise<{bank, ana, map}>(map: 'c-y-no' → 題目)
     PRACTICE.key(q)            'c-y-no'
     PRACTICE.href(s, q)        該科複習頁的這一題(?cert=&year=#q)
     PRACTICE.label(s, q)       「執業法規 · 領隊 110 年第 35 題」
     PRACTICE.short(q)          「領110-35」
     PRACTICE.wbAdd(s, q, p)    答錯收進該科錯題本;已在錯題本 → 依間隔複習規則回到第 1 關(srs.js)
     PRACTICE.addDaily(n)       首頁「今日已練」計數(localStorage practice_daily = {YYYY-MM-DD: 題數})
   題庫檔是 top-level const(不在 window 上),以間接 eval 在全域範圍取值。
   變更履歷:
     v127 (2026-10-05) 初版
*/
(function () {
  'use strict';
  var SUBJ = {
    gh:  { k: 'gh',  name: '觀光資源概要', short: '觀光',     bank: 'gh.js',  ana: 'gh_ana.js',  B: 'GHBANK',  A: 'GHANA',  page: '觀光複習.html',     wb: 'wrongbook_gh' },
    pr:  { k: 'pr',  name: '執業實務',     short: '執業實務', bank: 'pr.js',  ana: 'pr_ana.js',  B: 'PRBANK',  A: 'PRANA',  page: '執業實務複習.html', wb: 'wrongbook_pr' },
    pr2: { k: 'pr2', name: '執業法規',     short: '執業法規', bank: 'pr2.js', ana: 'pr2_ana.js', B: 'PR2BANK', A: 'PR2ANA', page: '執業法規複習.html', wb: 'wrongbook_pr2' }
  };
  var CNAME = { guide: '導遊', leader: '領隊' };
  var DATA = {}, LOADING = {};

  function gv(name) { try { return (0, eval)(name); } catch (e) { return undefined; } }
  function loadJs(src) {
    return new Promise(function (ok, no) {
      var t = document.createElement('script'); t.src = src; t.onload = ok; t.onerror = no; document.head.appendChild(t);
    });
  }
  function load(s) {
    if (DATA[s]) return Promise.resolve(DATA[s]);
    if (LOADING[s]) return LOADING[s];
    var S = SUBJ[s];
    var pre = gv(S.B) ? Promise.resolve() : loadJs(S.bank);
    LOADING[s] = pre.then(function () { return gv(S.A) ? null : loadJs(S.ana); }).then(function () {
      var bank = gv(S.B) || [], ana = gv(S.A) || {}, map = {};
      bank.forEach(function (q) { map[key(q)] = q; });
      DATA[s] = { bank: bank, ana: ana, map: map };
      return DATA[s];
    });
    return LOADING[s];
  }
  function key(q) { return q.c + '-' + q.y + '-' + q.no; }
  function href(s, q) { return SUBJ[s].page + '?cert=' + q.c + '&year=' + q.y + '#q' + q.no; }
  function label(s, q) { return SUBJ[s].short + ' · ' + CNAME[q.c] + ' ' + q.y + ' 年第 ' + q.no + ' 題'; }
  function short(q) { return (q.c === 'guide' ? '導' : '領') + q.y + '-' + q.no; }
  function LSget(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function LSset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function dkey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function wbAdd(s, q, picked) {
    var S = SUBJ[s], o = LSget(S.wb, {}), id = key(q), now = Date.now();
    if (o[id]) {
      if (window.SRS) SRS.answer(o[id], false, now); else o[id].wrong = (+o[id].wrong || 1) + 1;
      if (picked != null) o[id].picked = picked;
    } else {
      o[id] = { c: q.c, y: String(q.y), no: q.no, picked: picked == null ? null : picked, wrong: 1, ts: now };
    }
    LSset(S.wb, o);
  }
  function addDaily(n) {
    var pd = LSget('practice_daily', {}), k = dkey(new Date());
    pd[k] = (pd[k] || 0) + (n || 1);
    LSset('practice_daily', pd);
  }
  window.PRACTICE = { SUBJ: SUBJ, CNAME: CNAME, load: load, key: key, href: href, label: label, short: short,
    wbAdd: wbAdd, addDaily: addDaily, LSget: LSget, LSset: LSset, dkey: dkey, gv: gv, loadJs: loadJs };
})();
