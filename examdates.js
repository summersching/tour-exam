/* examdates.js — 116 年導遊、領隊評量的重要日期與考試提醒(單一來源)· v302(2026-11-19)
   ------------------------------------------------------------------
   資料來源:交通部觀光署〈116年導遊人員及領隊人員評量測驗報名簡章〉(115 年 11 月公告)。
   用在:我的基地首頁(考照卡的一行狀態)、考照中心最上面的「考試提醒」卡。
   EXAMDATES.phase(now, cert)  現在在哪個階段 → { k, title, sub, days, urgent }
   EXAMDATES.steps(now, cert)  報名 / 筆試 / 放榜 三格(各自的日期與「N 天後 / 進行中 / 已結束」)
   EXAMDATES.line(now, cert)   首頁用的一行字(例:「還有 12 天開始報名」)
   EXAMDATES.card(now, cert)   考照中心的提醒卡 HTML(含「報名資料」「考試當天」兩個可展開區塊和「加到行事曆」)
   EXAMDATES.ics(cert)         行事曆檔(.ics)內容,加到手機行事曆後由手機提醒(本站離線,不能自己推播)
   EXAMDATES.bind(el)          綁定提醒卡的按鈕(展開 / 收起、下載行事曆檔)
   cert:'leader'(領隊)、'guide'(導遊)或 'all';沒給就讀 localStorage 的 pref_cert(各頁證照篩選共用的設定)。
   換年度時:改 D 的日期、DOCS / DAY 的文字與 YEAR 即可。
   變更履歷:v302 初版 */
(function () {
  'use strict';
  var YEAR = 116;
  var SRC = '交通部觀光署〈116年導遊人員及領隊人員評量測驗報名簡章〉';
  var REG_URL = 'https://register-exam.tad.gov.tw';
  /* 月份從 1 開始;時間都是台灣時間(手機本地時間) */
  function T(y, mo, d, h, mi) { return new Date(y, mo - 1, d, h || 0, mi || 0); }
  var D = {
    regFrom: T(2026, 12, 1, 10), regTo: T(2026, 12, 10, 17),
    noticeFrom: T(2027, 2, 19, 10), noticeTo: T(2027, 3, 7, 15),
    leader: T(2027, 3, 6), guide: T(2027, 3, 7),
    doubtFrom: T(2027, 3, 8, 10), doubtTo: T(2027, 3, 10, 17),
    result: T(2027, 4, 27),
    oralRegFrom: T(2027, 4, 27, 10), oralRegTo: T(2027, 5, 4, 17),
    oralFrom: T(2027, 5, 22), oralTo: T(2027, 5, 23), oralResult: T(2027, 6, 10)
  };
  var WK = '日一二三四五六';
  function md(d) { return (d.getMonth() + 1) + '/' + d.getDate() + '(' + WK[d.getDay()] + ')'; }
  function hm(d) { return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function day0(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function days(now, d) { return Math.round((day0(d) - day0(now)) / 86400000); }
  function certOf(c) {
    if (c === 'leader' || c === 'guide' || c === 'all') return c;
    try { var v = localStorage.getItem('pref_cert'); if (v === 'leader' || v === 'guide') return v; } catch (e) {}
    return 'all';
  }
  function examDay(c) { return c === 'guide' ? D.guide : D.leader; }   // 全部 → 先到的領隊日(3/6)
  function examText(c) {
    if (c === 'leader') return md(D.leader) + ' 領隊';
    if (c === 'guide') return md(D.guide) + ' 導遊';
    return md(D.leader) + ' 領隊、' + md(D.guide) + ' 導遊';
  }
  function rel(n) { return n > 0 ? n + ' 天後' : n === 0 ? '今天' : '已結束'; }

  function phase(now, cert) {
    now = now || new Date(); var c = certOf(cert), ex = examDay(c);
    if (now < D.regFrom) { var n = days(now, D.regFrom);
      return { k: 'before', days: n, urgent: n <= 3, title: n > 1 ? '還有 ' + n + ' 天開始報名' : (n ? '明天 ' : '今天 ') + hm(D.regFrom) + ' 開始報名',
        sub: '報名期間 ' + md(D.regFrom) + hm(D.regFrom) + ' – ' + md(D.regTo) + hm(D.regTo) + ',網路報名' }; }
    if (now <= D.regTo) { var r = days(now, D.regTo);
      return { k: 'reg', days: r, urgent: r <= 3, title: r > 1 ? '報名中,還剩 ' + r + ' 天' : (r ? '明天 ' : '今天 ') + hm(D.regTo) + ' 截止報名',
        sub: md(D.regTo) + hm(D.regTo) + ' 截止,報名費也要在這之前繳完' }; }
    var e = days(now, ex);
    if (e > 0) { var inNotice = now >= D.noticeFrom && now <= D.noticeTo;
      return { k: 'wait', days: e, urgent: e <= 3, title: '距筆試 ' + e + ' 天',
        sub: '筆試 ' + examText(c) + (inNotice ? ';入場通知書已可下載(' + md(D.noticeTo) + hm(D.noticeTo) + ' 前)' : ';入場通知書 ' + md(D.noticeFrom) + ' 起下載') }; }
    if (now < day0(T(2027, 3, 8))) return { k: 'exam', days: 0, urgent: true, title: '筆試週末加油', sub: '筆試 ' + examText(c) + ',8:40 前入座' };
    var rs = days(now, D.result);
    if (rs > 0) return { k: 'afterExam', days: rs, urgent: false, title: '放榜還有 ' + rs + ' 天', sub: '筆試成績 ' + md(D.result) + ' 公布(預定)' };
    if (now <= D.oralRegTo) return { k: 'oralReg', days: days(now, D.oralRegTo), urgent: days(now, D.oralRegTo) <= 3, title: '外語導遊口試報名中',
      sub: '筆試及格的外語導遊:' + md(D.oralRegTo) + hm(D.oralRegTo) + ' 前報名口試(口試 ' + md(D.oralFrom) + '、' + md(D.oralTo) + ')' };
    if (now < day0(T(2027, 5, 24))) return { k: 'oral', days: days(now, D.oralFrom), urgent: false, title: '外語導遊口試 ' + md(D.oralFrom) + '、' + md(D.oralTo), sub: '口試在臺北考區舉行' };
    return { k: 'done', days: 0, urgent: false, title: YEAR + ' 年評量已結束', sub: '口試成績 ' + md(D.oralResult) + ' 公布(預定);下一年度簡章公布後會更新' };
  }
  function steps(now, cert) {
    now = now || new Date(); var c = certOf(cert), ex = examDay(c);
    var reg = now < D.regFrom ? rel(days(now, D.regFrom)) : now <= D.regTo ? '報名中' : '已結束';
    var exn = days(now, ex), rsn = days(now, D.result);
    return [
      { k: 'reg', name: '報名', date: (D.regFrom.getMonth() + 1) + '/' + D.regFrom.getDate() + '–' + (D.regTo.getMonth() + 1) + '/' + D.regTo.getDate(), rel: reg, on: now <= D.regTo },
      { k: 'exam', name: '筆試', date: c === 'all' ? '3/6、3/7' : (ex.getMonth() + 1) + '/' + ex.getDate(), rel: exn > 0 ? exn + ' 天後' : exn === 0 ? '今天' : '已結束', on: now > D.regTo && exn >= 0 },
      { k: 'result', name: '放榜', date: (D.result.getMonth() + 1) + '/' + D.result.getDate(), rel: rel(rsn), on: exn < 0 && rsn >= 0 }
    ];
  }
  function line(now, cert) { return phase(now, cert).title; }

  /* 要準備的資料、考試當天(文字依簡章整理成白話;細節以官方簡章為準) */
  var DOCS = [
    ['報名期間', md(D.regFrom) + ' ' + hm(D.regFrom) + ' 到 ' + md(D.regTo) + ' ' + hm(D.regTo) + ',網路報名,逾時不能報名'],
    ['報名費', '筆試 1,300 元,要在 ' + md(D.regTo) + ' ' + hm(D.regTo) + ' 前繳完,沒繳完報名不算完成;可用超商代碼、信用卡、超商條碼、WebATM 或 ATM 繳費(外語導遊口試 1,100 元,筆試及格後才繳)'],
    ['考區', '臺北、臺中、高雄、花蓮,報名時選一個,報名後不能改'],
    ['證件照', '最近一年內的 1 吋正面脫帽照片:寬 2.8 × 高 3.5 公分、300×420 到 450×600 像素、JPG 或 PNG,不能用生活照'],
    ['身分證明', '身分證正反面(外國人、港澳居民用護照或在臺居留證)'],
    ['學歷證明', '高中(職)以上的畢業證書;大專在學或肄業可用在學證明或修業證明;五專要 4 年級以上,另附歷年成績單'],
    ['申請免測的人', '專業科目免測:執業證(效期到 116/4/27 以後)或 113~115 年評量及格的職前訓練通知書;外國語免測:113/1/1~115/12/10 取得的外語能力證明,英文姓名要和護照相同,另附護照']
  ];
  var DAY = [
    ['8:40', '進試場入座(8:40~9:00 講解注意事項)'],
    ['09:00–10:00', '第 1 節 執業實務'],
    ['10:40–11:40', '第 2 節 執業法規'],
    ['13:30–14:30', '第 3 節 觀光資源概要'],
    ['15:10–16:30', '第 4 節 外國語(外語類才考)']
  ];
  var BRING = '身分證件正本(身分證、護照、有照片的健保卡或駕照都可以);入場通知書 ' + md(D.noticeFrom) + ' ' + hm(D.noticeFrom) + ' 到 ' + md(D.noticeTo) + ' ' + hm(D.noticeTo) +
    ' 上網下載,用空白 A4 紙印,要到考證明的人一定要帶。開考 15 分鐘後不能進場、45 分鐘內不能離場;智慧手錶等穿戴裝置不能帶在身上或放座位旁,被發現該科扣 5 分';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ic(n) { return window.ICONS ? window.ICONS.svg(n) : ''; }
  function card(now, cert) {
    now = now || new Date(); var c = certOf(cert), p = phase(now, c), st = steps(now, c);
    return '<div class="xd' + (p.urgent ? ' urgent' : '') + '" data-phase="' + p.k + '">' +
      '<div class="xd-h"><span class="xd-ic">' + ic('bell') + '</span><div><b class="xd-t">' + esc(p.title) + '</b><span class="xd-s">' + esc(p.sub) + '</span></div></div>' +
      '<div class="xd-st">' + st.map(function (s) { return '<div class="xd-c' + (s.on ? ' on' : '') + '"><b>' + s.name + '</b><span>' + s.date + '</span><small>' + s.rel + '</small></div>'; }).join('') + '</div>' +
      '<div class="xd-a"><button type="button" data-xd="docs">' + ic('list') + '<span>報名資料</span></button>' +
      '<button type="button" data-xd="day">' + ic('clock') + '<span>考試當天</span></button>' +
      '<button type="button" data-xd="ics">' + ic('calplus') + '<span>加到行事曆</span></button></div>' +
      '<div class="xd-p" data-p="docs" hidden><dl>' + DOCS.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' +
      '<p class="xd-n">報名網站:<a href="' + REG_URL + '" target="_blank" rel="noopener">register-exam.tad.gov.tw</a>(' + md(D.regFrom) + ' ' + hm(D.regFrom) + ' 開放);照片、證件、學歷都是上傳檔案,不用郵寄</p></div>' +
      '<div class="xd-p" data-p="day" hidden><p class="xd-n">筆試 ' + examText(c) + '</p><dl class="xd-tt">' + DAY.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>' +
      '<p class="xd-n">要帶:' + esc(BRING) + '</p></div>' +
      '<p class="xd-src">依 ' + YEAR + ' 年官方簡章整理;細節以' + esc(SRC) + '為準</p></div>';
  }

  /* 行事曆檔:時間一律寫成 UTC(由手機本地時間換算),行長超過 75 位元組依規格折行 */
  function z(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
  function ymd(d) { return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); }
  function fold(s) {
    var out = [], cur = '', n = 0, enc = new TextEncoder();
    for (var i = 0; i < s.length; i++) { var ch = s[i], b = enc.encode(ch).length;
      if (n + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; n = 0; }
      cur += ch; n += b; }
    out.push(cur); return out.join('\r\n ');
  }
  function txt(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function ics(cert) {
    var c = certOf(cert), now = z(new Date()), L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ylenpass//exam' + YEAR + '//ZH', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    function ev(id, a, b, title, desc, alarms, allDay) {
      L.push('BEGIN:VEVENT', 'UID:' + id + '-' + YEAR + '@ylenpass', 'DTSTAMP:' + now);
      if (allDay) L.push('DTSTART;VALUE=DATE:' + ymd(a), 'DTEND;VALUE=DATE:' + ymd(new Date(a.getTime() + 86400000)));
      else L.push('DTSTART:' + z(a), 'DTEND:' + z(b));
      L.push('SUMMARY:' + txt(title), 'DESCRIPTION:' + txt(desc));
      (alarms || []).forEach(function (t) { L.push('BEGIN:VALARM', 'TRIGGER:' + t, 'ACTION:DISPLAY', 'DESCRIPTION:' + txt(title), 'END:VALARM'); });
      L.push('END:VEVENT');
    }
    ev('reg-open', D.regFrom, new Date(D.regFrom.getTime() + 3600000), '導遊領隊評量:開始報名', '網路報名 ' + REG_URL + ';報名費 1,300 元要在 12/10 17:00 前繳完', ['-P1D']);
    ev('reg-close', new Date(D.regTo.getTime() - 3600000), D.regTo, '導遊領隊評量:報名與繳費截止 17:00', '報名費也要在截止前繳完,沒繳完報名不算完成', ['-P3D', '-PT5H']);
    ev('notice', D.noticeFrom, new Date(D.noticeFrom.getTime() + 3600000), '導遊領隊評量:入場通知書可以下載', '用空白 A4 紙列印;' + md(D.noticeTo) + ' ' + hm(D.noticeTo) + ' 前下載', ['-PT1H']);
    var dayDesc = '8:40 前入座;9:00 執業實務、10:40 執業法規、13:30 觀光資源概要、15:10 外國語;帶身分證件正本與入場通知書';
    if (c !== 'guide') ev('exam-leader', T(2027, 3, 6, 8, 40), T(2027, 3, 6, 16, 30), '領隊人員評量筆試', dayDesc, ['-P1D', '-PT2H']);
    if (c !== 'leader') ev('exam-guide', T(2027, 3, 7, 8, 40), T(2027, 3, 7, 16, 30), '導遊人員評量筆試', dayDesc, ['-P1D', '-PT2H']);
    ev('result', D.result, null, '導遊領隊評量:筆試成績公布(預定)', '外語導遊筆試及格:4/27 10:00 – 5/4 17:00 報名口試', ['PT9H'], true);
    L.push('END:VCALENDAR');
    return L.map(fold).join('\r\n') + '\r\n';
  }

  function bind(el) {
    if (!el || el.__xd) return; el.__xd = true;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-xd]'); if (!b) return;
      var k = b.dataset.xd;
      if (k === 'ics') {
        try {
          var blob = new Blob([ics()], { type: 'text/calendar;charset=utf-8' }), a = document.createElement('a');
          a.href = URL.createObjectURL(blob); a.download = YEAR + '導遊領隊評量.ics'; document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
        } catch (err) {}
        return;
      }
      var p = el.querySelector('.xd-p[data-p="' + k + '"]'); if (!p) return;
      var open = p.hidden;
      el.querySelectorAll('.xd-p').forEach(function (x) { x.hidden = true; });
      el.querySelectorAll('[data-xd]').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-expanded', 'false'); });
      if (open) { p.hidden = false; b.classList.add('on'); b.setAttribute('aria-expanded', 'true'); }
    });
  }

  try {
    var css = document.createElement('style');
    css.textContent =
      '.xd{background:var(--k-amber-bg,#faeeda);border-radius:16px;padding:14px 14px 10px;color:var(--ink,#2b2a27)}' +
      '.xd-h{display:flex;gap:11px;align-items:flex-start}' +
      '.xd-ic{flex:none;width:36px;height:36px;border-radius:10px;background:var(--k-amber,#854f0b);color:var(--k-amber-bg,#faeeda);display:flex;align-items:center;justify-content:center}' +
      '.xd-ic svg{width:21px;height:21px}' +
      '.xd-t{display:block;font-size:1.08rem;font-weight:800;line-height:1.35;color:var(--k-amber,#854f0b)}' +
      '.xd-s{display:block;font-size:.82rem;color:var(--ink,#2b2a27);margin-top:2px;line-height:1.55}' +
      '.xd.urgent .xd-t{color:var(--no,#c62a2a)}' +
      '.xd-st{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:12px 0 10px}' +
      '.xd-c{background:var(--card,#fff);border-radius:10px;padding:7px 9px;line-height:1.35;min-width:0}' +
      '.xd-c b{display:block;font-size:.8rem}.xd-c span{display:block;font-size:.84rem;font-weight:700;font-variant-numeric:tabular-nums}' +
      '.xd-c small{display:block;font-size:.72rem;color:var(--sub,#68645b)}' +
      '.xd-c.on{background:var(--k-amber,#854f0b);color:var(--k-amber-bg,#faeeda)}.xd-c.on small{color:inherit;opacity:.9}' +
      '.xd-a{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}' +
      '.xd-a button{display:inline-flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:999px;background:var(--card,#fff);color:var(--k-amber,#854f0b);' +
      'font:inherit;font-size:.8rem;font-weight:700;padding:7px 4px;cursor:pointer;white-space:nowrap;min-width:0}' +
      '.xd-a button svg{width:16px;height:16px}.xd-a button.on{background:var(--k-amber,#854f0b);color:var(--k-amber-bg,#faeeda)}' +
      '.xd-p{background:var(--card,#fff);border-radius:12px;padding:10px 12px;margin-top:9px;font-size:.84rem;line-height:1.65}' +
      '.xd-p dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 10px}.xd-p dt{font-weight:800;white-space:nowrap}.xd-p dd{margin:0}' +
      '.xd-p .xd-tt dt{font-variant-numeric:tabular-nums}' +
      '.xd-n{margin:8px 0 0;color:var(--sub,#68645b)}.xd-n:first-child{margin-top:0;color:var(--ink,#2b2a27);font-weight:700}' +
      '.xd-n a{color:var(--ui-acc,#0f6e56);font-weight:700}' +
      '.xd-src{margin:8px 2px 0;font-size:.72rem;color:var(--sub,#68645b)}' +
      '@media print{.xd-a{display:none}}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}

  window.EXAMDATES = { D: D, phase: phase, steps: steps, line: line, card: card, ics: ics, bind: bind, certOf: certOf, examText: examText, md: md };
})();
