/* plan.js — 學習計畫引擎(單一來源)· v207
   ------------------------------------------------------------------
   學習計畫頁(學習計畫.html)與首頁「今日路線」共用:
     PLAN.get()            讀設定(localStorage study_plan);考試日期與首頁共用 exam_date
     PLAN.save(c, exam)    存設定(起算日 = 今天,等於依剩下的天數重新排一次;已完成的紀錄保留)
     PLAN.reset()          清除計畫與勾選紀錄(考試日期保留)
     PLAN.build(now)       → 整份計畫(每次即時計算 → 落後 / 超前會自動重排)
     PLAN.mark(id, on)     手動勾選完成 / 取消
     PLAN.more(id)         今天的做完了,把下一項加進今天
   任務:講義章節、考點速記 / 數字速記 / 條文反查 / 兩岸入出境 / 法規速查 / 實務工具箱 / 觀光圖鑑、
         英語文法 8 章 · 高頻單字 701 · 片語 985、日語單字 1,712、各科歷屆整卷、考前衝刺必背、新制與法規異動
   完成判定:歷屆整卷 → 模擬測驗紀錄(quiz_history)有該科該年該證照、交卷 40 題以上;講義 → jy_prog 已讀;
             其他 → 手動打勾(plan_done)。歷屆整卷也可以手動勾(在別處做過)
   排程:基礎(學習)→ 刷題(歷屆,由新到舊)→ 衝刺(最近 3 年整卷計時 + 必背)→ 考前 3 天(只複習);
         各科依自評與模擬測驗正確率加權輪排;排不下時先省略「加碼」任務(較舊年度、另一證照的卷)
   今天的清單在當天第一次打開時決定(plan_today),之後勾掉不會一直冒出新任務;沒做完的隔天自動排回最前面
   變更履歷:
     v262 (2026-11-13) 英語講義新增第 8 章(文法總整理)
     v261 (2026-11-13) 英語講義新增第 7 章(生活、職場與溝通)
     v260 (2026-11-13) 英語講義新增第 6 章(安全、健康與緊急狀況)
     v259 (2026-11-13) 英語講義新增第 5 章(導遊帶團、行程與生態旅遊)
     v258 (2026-11-13) 英語講義新增第 4 章(景點、文化與藝術)
     v257 (2026-11-13) 英語講義新增第 3 章(餐飲、購物與金錢)
     v256 (2026-11-13) 英語講義第 2 章改成新格式並改名「交通與住宿」
     v255 (2026-11-12) 英語講義改成情境主題分章的新格式:第 1 章改名「機場、航空與出入境」(含情境會話、單字音標、文法)
     v254 (2026-11-12) 連到首頁的任務改連 考照中心.html(index.html 改成工作站首頁)
     v253 (2026-11-11) 版號同步(講義頁閱讀體驗改版;學習計畫內容不變)
     v252 (2026-11-11) 講義新增外語英語第 2 章(字彙(二):交通與住宿)
     v251 (2026-11-11) 講義新增外語英語第 1 章(字彙(一):機場、航空與出入境);外語講義只排給選考該語言的考生
     v250 (2026-11-11) 講義新增觀光資源第 25 章(觀光資源維護(四):世界遺產與各國文化),只排給領隊;觀光資源題全部歸章
     v249 (2026-11-11) 講義新增觀光資源第 24 章(觀光資源維護(三):遊憩管理、臺灣景點與帶團實務),只排給領隊
     v248 (2026-11-11) 講義新增觀光資源第 23 章(世界地理(五):美洲、大洋洲與極地),只排給領隊
     v247 (2026-11-11) 講義新增觀光資源第 22 章(世界地理(四):歐洲),只排給領隊
     v246 (2026-11-11) 講義新增觀光資源第 21 章(世界地理(三):南亞、西亞與非洲),只排給領隊
     v245 (2026-11-11) 講義新增觀光資源第 20 章(世界地理(二):日本、朝鮮半島與東南亞),只排給領隊
     v244 (2026-11-11) 講義新增觀光資源第 19 章(世界地理(一):臺灣與中國),只排給領隊
     v243 (2026-11-11) 講義新增觀光資源第 18 章(世界史(六):藝術、文學與思想),只排給領隊;領隊的歷史題全部歸章
     v242 (2026-11-11) 講義新增觀光資源第 17 章(世界史(五):近代東亞、東南亞與臺灣),只排給領隊
     v241 (2026-11-11) 講義新增觀光資源第 16 章(世界史(四):兩次大戰與冷戰),只排給領隊
     v240 (2026-11-11) 講義新增觀光資源第 15 章(世界史(三):中古歐洲到美國獨立),只排給領隊
     v239 (2026-11-11) 講義新增觀光資源第 14 章(世界史(二):大航海、殖民與獨立運動),只排給領隊
     v238 (2026-11-11) 講義新增觀光資源第 13 章(世界史(一):古文明與宗教),只排給領隊
     v236 (2026-11-09) 講義新增觀光資源第 12 章(觀光資源維護(二):國家風景區與古道鐵道),只排給導遊;導遊的觀光資源 12 章完成
     v235 (2026-11-09) 講義新增觀光資源第 10、11 章(臺灣地理(三):地名、產業與離島;觀光資源維護(一):遊憩管理與生態旅遊),只排給導遊
     v234 (2026-11-09) 講義新增觀光資源第 8、9 章(臺灣地理(一):地形與地質;臺灣地理(二):氣候、水文與生態),只排給導遊
     v233 (2026-11-09) 講義新增觀光資源第 6、7 章(宗教信仰、古蹟與史前文化;藝文、運動與民俗節慶),只排給導遊
     v232 (2026-11-09) 講義新增觀光資源第 4、5 章(臺灣史(二):日治時期;臺灣史(三):戰後臺灣),只排給導遊
     v231 (2026-11-05) 講義新增觀光資源第 2、3 章(原住民族與族群、臺灣史(一));JY 章節第三欄標 'guide' / 'leader' 時只排給該證照
     v230 (2026-11-05) 講義新增執業實務第 18、19 章(臺灣觀光資源;執業實務 19 章完成)
     v229 (2026-11-05) 講義新增執業實務第 16、17 章(導覽解說)
     v228 (2026-11-05) 講義新增執業實務第 14、15 章(觀光心理)
     v227 (2026-11-05) 講義新增執業實務第 12、13 章(國際禮儀)
     v226 (2026-11-05) 講義新增執業實務第 10、11 章
     v225 (2026-11-05) 講義新增執業實務第 8、9 章
     v224 (2026-11-04) 講義新增執業實務第 7 章
     v223 (2026-11-04) 講義新增執業法規第 17 章(執業法規講義 17 章完成)
     v222 (2026-11-04) 講義新增執業實務第 5、6 章
     v221 (2026-11-04) 講義新增執業實務第 3、4 章
     v219 (2026-11-04) 講義新增執業實務第 1、2 章(新科目)
     v218 (2026-11-04) 講義新增執業法規第 16 章
     v217 (2026-11-04) 講義新增執業法規第 14、15 章
     v216 (2026-11-03) 講義新增執業法規第 12、13 章
     v215 (2026-11-03) 講義新增執業法規第 10、11 章
     v214 (2026-11-03) 講義新增執業法規第 8、9 章
     v213 (2026-11-03) 講義新增執業法規第 6、7 章
     v212 (2026-11-03) 講義新增執業法規第 4、5 章
     v211 (2026-11-03) 講義新增執業法規第 2、3 章
     v208 (2026-11-02) 衝刺期加碼:依出題趨勢 50 題(模擬測驗 ?pick=trend)
     v207 (2026-11-02) 初版
*/
(function () {
  'use strict';
  const LSget = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const LSset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const rawGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const pad = n => String(n).padStart(2, '0');
  const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parse = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  const day0 = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const addD = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  const SUB = {
    pr2: { n: '執業法規', ic: '⚖️' }, pr: { n: '執業實務', ic: '🚩' }, gh: { n: '觀光資源', ic: '🗺️' },
    en: { n: '外語英語', ic: '🔤' }, jp: { n: '外語日語', ic: '🎌' }
  };
  const CN = { guide: '導遊', leader: '領隊' };
  const PH = { base: '基礎', drill: '刷題', sprint: '衝刺', final: '考前' };
  const DRILL_Y = ['112', '111', '110', '109', '108', '107', '106'];   // 刷題期由新到舊(108 以前的 107、106 為加碼)
  const SPRINT_Y = ['113', '114', '115'];                             // 最近 3 年留到衝刺期計時整卷
  const BONUS_Y = ['115', '114', '113', '112', '111', '110'];          // 加碼:另一證照的卷
  /* 講義章節 [id, 標題, 只排給哪個證照(可省略)](講義新增章節時同步加;e2e 會比對 jy_*.js) */
  const JY = { pr2: [['pr2-01', '旅行業的設立、資本與保證'], ['pr2-02', '旅行業的經營管理'], ['pr2-03', '導遊人員與領隊人員'], ['pr2-04', '觀光旅館業、旅館業、民宿與觀光遊樂業'], ['pr2-05', '風景特定區、觀光地區與水域遊憩'], ['pr2-06', '發展觀光條例總則與觀光行政'], ['pr2-07', '旅行業條款、從業人員與獎勵'], ['pr2-08', '發展觀光條例的罰則'], ['pr2-09', '民法債編:旅遊'], ['pr2-10', '護照與簽證'], ['pr2-11', '入出國、移民與役男'], ['pr2-12', '海關、檢疫與航空安全'], ['pr2-13', '外匯'], ['pr2-14', '臺灣地區與大陸地區人民關係條例'], ['pr2-15', '陸客來臺與兩岸往來實務'], ['pr2-16', '兩岸協議、交流發展與港澳'], ['pr2-17', '國外旅遊定型化契約']], gh: [['gh-01', '國家公園'], ['gh-02', '臺灣的原住民族與族群', 'guide'], ['gh-03', '臺灣史(一):荷西、明鄭與清領', 'guide'], ['gh-04', '臺灣史(二):日治時期', 'guide'], ['gh-05', '臺灣史(三):戰後臺灣', 'guide'], ['gh-06', '宗教信仰、古蹟與史前文化', 'guide'], ['gh-07', '藝文、運動與民俗節慶', 'guide'], ['gh-08', '臺灣地理(一):地形與地質', 'guide'], ['gh-09', '臺灣地理(二):氣候、水文與生態', 'guide'], ['gh-10', '臺灣地理(三):地名、產業與離島', 'guide'], ['gh-11', '觀光資源維護(一):遊憩管理與生態旅遊', 'guide'], ['gh-12', '觀光資源維護(二):國家風景區與古道鐵道', 'guide'], ['gh-13', '世界史(一):古文明與宗教', 'leader'], ['gh-14', '世界史(二):大航海、殖民與獨立運動', 'leader'], ['gh-15', '世界史(三):中古歐洲到美國獨立', 'leader'], ['gh-16', '世界史(四):兩次大戰與冷戰', 'leader'], ['gh-17', '世界史(五):近代東亞、東南亞與臺灣', 'leader'], ['gh-18', '世界史(六):藝術、文學與思想', 'leader'], ['gh-19', '世界地理(一):臺灣與中國', 'leader'], ['gh-20', '世界地理(二):日本、朝鮮半島與東南亞', 'leader'], ['gh-21', '世界地理(三):南亞、西亞與非洲', 'leader'], ['gh-22', '世界地理(四):歐洲', 'leader'], ['gh-23', '世界地理(五):美洲、大洋洲與極地', 'leader'], ['gh-24', '觀光資源維護(三):遊憩管理、臺灣景點與帶團實務', 'leader'], ['gh-25', '觀光資源維護(四):世界遺產與各國文化', 'leader']], pr: [['pr-01', '導遊領隊的職責與帶團作業'], ['pr-02', '證件、財物與行李遺失'], ['pr-03', '帶團危機處理'], ['pr-04', '傷病、死亡與緊急事故處理'], ['pr-05', '旅行業保險、急難救助與旅遊警示'], ['pr-06', '民航法規、海關與出入境'], ['pr-07', '旅遊契約、責任歸屬與旅遊糾紛'], ['pr-08', '航空票務:代碼、機票、票價與訂位'], ['pr-09', '搭機實務:航空公司、行李、時差與住宿'], ['pr-10', '急救:CPR、AED 與常見傷病'], ['pr-11', '旅遊安全、防疫與健康'], ['pr-12', '國際禮儀(一):宴會、餐飲與服裝'], ['pr-13', '國際禮儀(二):行、住、社交與文化禁忌'], ['pr-14', '觀光心理(一):旅遊動機、需求與消費行為'], ['pr-15', '觀光心理(二):行銷、服務品質與銷售'], ['pr-16', '導覽解說(一):解說理論、原則與媒體'], ['pr-17', '導覽解說(二):解說技巧、對象與帶隊'], ['pr-18', '臺灣觀光資源(一):國家公園、風景區與生態'], ['pr-19', '臺灣觀光資源(二):原住民、文物、民俗與世界']], en: [['en-01', '機場、航空與出入境'], ['en-02', '交通與住宿'], ['en-03', '餐飲、購物與金錢'], ['en-04', '景點、文化與藝術'], ['en-05', '導遊帶團、行程與生態旅遊'], ['en-06', '安全、健康與緊急狀況'], ['en-07', '生活、職場與溝通'], ['en-08', '文法總整理']] };
  /* 英語文法 8 章 [id, 標題, 文法點數](與 gram_en.js 一致;e2e 會比對) */
  const GRAM = [['en-g1', '連接詞:讓步、對比、時間、目的', 11], ['en-g2', '時態與語氣:未來、完成、假設、建議', 9], ['en-g3', '被動語態與分詞', 7],
    ['en-g4', '動詞句型:使役、受詞補語、動名詞', 8], ['en-g5', '子句與問句:間接問句、關係子句、附加問句', 5], ['en-g6', '詞性與句子結構:副詞、形容詞、並列、比較、倒裝', 5],
    ['en-g7', '代名詞、限定詞與主詞動詞一致', 4], ['en-g8', '介系詞與固定用法', 7]];
  const chunks = (n, size) => { const out = []; for (let i = 1; i <= n; i += size) out.push([i, Math.min(n, i + size - 1)]); return out; };

  function get() {
    const c = LSget('study_plan', null);
    if (!c || !c.cert || !c.lang) return null;
    return Object.assign({ mins: 60, days: [1, 1, 1, 1, 1, 1, 1], lv: {} }, c);
  }
  function save(c, exam) {
    const o = { v: 1, cert: c.cert === 'leader' ? 'leader' : 'guide', lang: c.lang === 'jp' ? 'jp' : 'en',
      mins: Math.max(20, Math.min(600, +c.mins || 60)), days: (c.days || []).length === 7 ? c.days.map(x => x ? 1 : 0) : [1, 1, 1, 1, 1, 1, 1],
      lv: c.lv || {}, start: dkey(day0(new Date())), saved: Date.now() };
    if (!o.days.some(Boolean)) o.days = [1, 1, 1, 1, 1, 1, 1];
    LSset('study_plan', o);
    if (exam) try { localStorage.setItem('exam_date', exam); } catch (e) {}
    try { localStorage.removeItem('plan_today'); } catch (e) {}
    return o;
  }
  function reset() { ['study_plan', 'plan_done', 'plan_today'].forEach(k => { try { localStorage.removeItem(k); } catch (e) {} }); }

  /* ---------- 任務清單 ---------- */
  function paperMin(s, y, sprint) { return (s === 'en' || s === 'jp') ? 110 : y === '106' ? 100 : sprint ? 75 : 70; }
  function tasks(cfg, crash) {
    const c = cfg.cert, oc = c === 'guide' ? 'leader' : 'guide', L = cfg.lang, T = [];
    const add = o => T.push(Object.assign({ k: 'do' }, o));
    const paper = (s, cc, y, ph, opt) => add({ id: 'p:' + s + ':' + cc + ':' + y, s, ph, k: 'paper', c: cc, y, opt: !!opt, min: paperMin(s, y, ph === 'sprint'),
      t: (ph === 'sprint' ? '計時整卷:' : opt && cc !== c ? '加碼:' : '') + CN[cc] + ' ' + y + ' 年' + SUB[s].n,
      sub: ph === 'sprint' ? '照考試時間作答,交卷後看詳解、錯題收進錯題本' : '整卷作答 → 交卷後看詳解,錯的自動進錯題本',
      href: '模擬測驗.html?subj=' + s + '&cert=' + cc + '&mode=whole&year=' + y + (ph === 'sprint' ? '&time=-1' : '') });
    /* 基礎期:學習 */
    ['pr2', 'gh', 'pr'].forEach(s => JY[s].forEach(([id, t, only]) => { if (only && only !== c) return; add({ id: 'jy:' + id, s, ph: 'base', k: 'jy', ch: id, min: 45, t: '講義:' + t, sub: '讀完按「標記已讀」或做章末測驗', href: '講義.html?ch=' + id }); }));
    (JY[L] || []).forEach(([id, t]) => add({ id: 'jy:' + id, s: L, ph: 'base', k: 'jy', ch: id, min: 45, t: '講義:' + t, sub: '讀完按「標記已讀」或做章末測驗', href: '講義.html?ch=' + id }));   // 外語講義:只排選考的語言
    add({ id: 'kd:pr2', s: 'pr2', ph: 'base', hy: 1, min: 40, t: '考點速記:執業法規一輪', sub: '遮住答案自測,不會的標起來', href: '考點速記.html?subj=pr2' });
    add({ id: 'num:pr2', s: 'pr2', ph: 'base', hy: 1, min: 25, t: '數字速記:金額、期限、人數', href: '數字速記.html?subj=pr2' });
    add({ id: 'law:quick', s: 'pr2', ph: 'base', hy: 1, min: 20, t: '法規速查:違約金公式、級距、罰鍰', href: '法規速查.html' });
    add({ id: 'law:idx', s: 'pr2', ph: 'base', min: 25, t: '條文反查:熱門條文考過哪些題', sub: '旅行業管理規則、發展觀光條例前 5 條', href: '條文反查.html?subj=pr2' });
    add({ id: 'cs', s: 'pr2', ph: 'base', min: 30, t: '兩岸與入出境重點', href: '兩岸入出境.html' });
    add({ id: 'kd:pr', s: 'pr', ph: 'base', hy: 1, min: 40, t: '考點速記:執業實務一輪', sub: '遮住答案自測,不會的標起來', href: '考點速記.html?subj=pr' });
    add({ id: 'tb', s: 'pr', ph: 'base', min: 40, t: '實務工具箱:急救 SOP、時差、航空代碼、禮儀', href: '實務工具箱.html' });
    add({ id: 'num:pr', s: 'pr', ph: 'base', min: 20, t: '數字速記:執業實務', href: '數字速記.html?subj=pr' });
    add({ id: 'kd:gh', s: 'gh', ph: 'base', hy: 1, min: 40, t: '考點速記:觀光資源一輪', sub: '遮住答案自測,不會的標起來', href: '考點速記.html?subj=gh' });
    add({ id: 'atlas', s: 'gh', ph: 'base', min: 40, t: '觀光圖鑑:地圖與年表', href: '觀光圖鑑.html' });
    add({ id: 'num:gh', s: 'gh', ph: 'base', min: 20, t: '數字速記:觀光資源', href: '數字速記.html?subj=gh' });
    if (L === 'en') {
      GRAM.forEach(([id, t, n], i) => add({ id: 'gram:' + id, s: 'en', ph: 'base', min: 10 + n * 3, t: '英語文法第 ' + (i + 1) + ' 章:' + t, sub: n + ' 個文法點:看說明、例句,再做小測驗', href: '學習中心.html?tab=gram#gch-' + (i + 1) }));
      chunks(701, 100).forEach(([a, b]) => add({ id: 'w:en:' + a, s: 'en', ph: 'base', min: 40, t: '高頻單字第 ' + a + '–' + b + ' 個', sub: '單字頁按「💡 有用法」,看搭配與考題原句', href: '學習中心.html' }));
      chunks(985, 200).forEach(([a, b], i) => add({ id: 'ph:en:' + a, s: 'en', ph: 'base', min: 35, opt: i >= 3, t: (i >= 3 ? '加碼:' : '') + '片語第 ' + a + '–' + b + ' 個', href: '學習中心.html?tab=phr' }));
      add({ id: 'sk:en', s: 'en', ph: 'base', min: 30, t: '英語解題技巧與常見陷阱', href: '學習中心.html?tab=skill' });
    } else {
      chunks(1712, 250).forEach(([a, b]) => add({ id: 'w:jp:' + a, s: 'jp', ph: 'base', min: 40, t: '日語單字第 ' + a + '–' + b + ' 個', sub: '單字卡 + 讀音測驗', href: '日語學習中心.html' }));
    }
    /* 刷題期:歷屆整卷 112→108 是核心;加碼依價值排:另一證照最近 3 年 → 本證照 107、106 → 另一證照 112–110 */
    ['pr2', 'pr', 'gh', L].forEach(s => {
      DRILL_Y.filter(y => y >= '108').forEach(y => paper(s, c, y, 'drill'));
      BONUS_Y.slice(0, 3).forEach(y => paper(s, oc, y, 'drill', true));
      ['107', '106'].forEach(y => paper(s, c, y, 'drill', true));
      BONUS_Y.slice(3).forEach(y => paper(s, oc, y, 'drill', true));
    });
    ['pr2', 'pr', 'gh'].forEach(s => add({ id: 'tf:' + s, s, ph: 'drill', min: 20, opt: true, t: '加碼:是非快問 40 句(' + SUB[s].n + ')', href: '是非快問.html?subj=' + s }));
    /* 衝刺期:最近 3 年計時整卷 + 必背 */
    ['pr2', 'pr', 'gh', L].forEach(s => SPRINT_Y.forEach(y => paper(s, c, y, 'sprint')));
    ['pr2', 'pr', 'gh', L].forEach(s => add({ id: 'sp:' + s, s, ph: 'sprint', min: 40, t: '考前衝刺:' + SUB[s].n + (s === L ? '高頻必背' : '必背 100 條'), href: '考前衝刺.html?subj=' + s }));
    add({ id: 'newlaw', s: 'pr2', ph: 'sprint', min: 30, t: '新制與法規異動:修法後答案改變的題', href: '法規異動.html' });
    ['pr2', 'pr', 'gh'].forEach(s => add({ id: 'tr:' + s, s, ph: 'sprint', min: 60, opt: true, t: '加碼:依出題趨勢 50 題(' + SUB[s].n + ')', sub: '近 3 年考得多的主題題數多,模擬考卷的主題分布', href: '模擬測驗.html?subj=' + s + '&cert=' + c + '&pick=trend&num=50' }));
    /* 不到兩週的衝刺模式:核心只留計時整卷、必背、考點速記、數字與法規速查;其他學習與刷題都改成加碼 */
    if (crash) T.forEach(t => { if (t.ph !== 'sprint' && !t.hy) t.opt = true; });
    return T;
  }

  /* ---------- 完成判定 ---------- */
  function doneFn() {
    const hist = LSget('quiz_history', []), jy = LSget('jy_prog', {}), man = LSget('plan_done', {});
    return t => {
      if (man[t.id]) return true;
      if (t.k === 'paper') return hist.some(h => h.subj === t.s && h.cert === t.c && String(h.year) === t.y && (h.mode === 'whole' || +h.total >= 40));
      if (t.k === 'jy') return !!(jy[t.ch] && (jy[t.ch].read || jy[t.ch].best != null));
      return false;
    };
  }

  /* ---------- 各科權重:自評 × 模擬測驗正確率(最近 5 次,10 題以上) ---------- */
  function weights(cfg) {
    const hist = LSget('quiz_history', []), out = {};
    ['pr2', 'pr', 'gh', cfg.lang].forEach(s => {
      const h = hist.filter(x => x.subj === s && +x.total >= 10).slice(-5);
      const n = h.reduce((a, x) => a + (+x.total || 0), 0), ok = h.reduce((a, x) => a + (+x.correct || 0), 0);
      const acc = n ? ok / n : null, lv = +(cfg.lv || {})[s === cfg.lang ? 'lang' : s] || 1;
      const f = acc == null ? 1 : Math.max(0.8, Math.min(1.4, 1 + (0.7 - acc) * 1.2));
      out[s] = { w: lv * f * (s === cfg.lang ? 1.15 : 1), acc, n };
    });
    return out;
  }
  /* 各階段內:先排核心再排加碼;同一層依權重輪流(權重高的科目出現得多) */
  function order(T, W) {
    const out = [];
    ['base', 'drill', 'sprint'].forEach(ph => [false, true].forEach(opt => {
      const g = {}, used = {};
      T.filter(t => t.ph === ph && !!t.opt === opt).forEach(t => { (g[t.s] = g[t.s] || []).push(t); used[t.s] = 0; });
      for (;;) {
        let best = null;
        Object.keys(g).forEach(s => { if (g[s].length && (best == null || used[s] / W[s].w < used[best] / W[best].w)) best = s; });
        if (best == null) break;
        const t = g[best].shift(); used[best] += t.min; out.push(t);
      }
    }));
    return out;
  }
  /* 階段切分(依起算日到考前一天的讀書日) */
  function phases(n) {
    const F = Math.min(3, n), rest = n - F;
    let B, D, S;
    if (n >= 30) { S = Math.round(rest * 0.25); B = Math.round(rest * 0.4); D = rest - S - B; }
    else if (n >= 14) { S = Math.round(rest * 0.4); B = Math.round(rest * 0.2); D = rest - S - B; }
    else { S = rest; B = 0; D = 0; }
    const out = []; for (let i = 0; i < n; i++) out.push(i < B ? 'base' : i < B + D ? 'drill' : i < B + D + S ? 'sprint' : 'final');
    return out;
  }
  /* 每天扣掉固定時段後可排任務的分鐘:錯題複習 5–10 分;基礎 / 刷題期外語單字卡 10–15 分(每天不到 45 分就不另排) */
  const reviewMin = cfg => cfg.mins >= 60 ? 10 : 5;
  const habitMin = cfg => cfg.mins >= 90 ? 15 : cfg.mins >= 45 ? 10 : 0;
  function budget(cfg, ph) { return Math.max(15, cfg.mins - reviewMin(cfg) - (ph === 'base' || ph === 'drill' ? habitMin(cfg) : 0)); }
  /* 依序把任務排進每一天;任務比當天剩下的時間長 → 先做一部分、隔天接著做(續);只超出 10 分以內就當天做完,不留零頭 */
  const TOL = 10;
  function simulate(queue, days) {
    const q = queue.slice(), sched = [];
    let cont = null;
    /* 挑下一項:本階段核心與落後的前一階段核心都有 → 輪流(補進度但不卡住本階段);
       基礎期核心做完 → 提早開始刷題;加碼只在沒有可做的核心時才排 */
    let alt = false;
    const R = { base: 0, drill: 1, sprint: 2 };
    const pick = ph => {
      const r = R[ph], f = fn => q.findIndex(fn);
      const cur = f(t => t.ph === ph && !t.opt), old = r ? f(t => R[t.ph] < r && !t.opt) : -1;
      if (cur >= 0 && old >= 0) { alt = !alt; return alt ? cur : old; }
      if (cur >= 0) return cur;
      if (old >= 0) return old;
      if (ph === 'base') { const i = f(t => t.ph === 'drill' && !t.opt); if (i >= 0) return i; }
      const co = f(t => t.ph === ph && t.opt); if (co >= 0) return co;
      return r ? f(t => R[t.ph] < r && t.opt) : f(t => t.ph === 'drill' && t.opt);
    };
    days.forEach(day => {
      const items = []; let left = day.b;
      if (day.ph === 'final') { sched.push({ d: day.d, ph: day.ph, b: day.b, items }); return; }
      if (cont) { const m = cont.min - left <= TOL ? cont.min : Math.min(cont.min, left); items.push({ t: cont.t, min: m, cont: true, part: cont.min > m }); left -= m; cont = cont.min > m ? { t: cont.t, min: cont.min - m } : null; }
      while (!cont && left >= 15) {
        const i = pick(day.ph); if (i < 0) break;
        const t = q[i];
        if (t.min > left && items.length && (t.opt || left < 25)) break;   // 當天已有任務:加碼不拆兩天、剩不到 25 分不開新任務
        q.splice(i, 1);
        const m = t.min - left <= TOL ? t.min : Math.min(t.min, left);
        items.push({ t, min: m, part: t.min > m });
        left -= m;
        if (t.min > m) cont = { t, min: t.min - m };
      }
      sched.push({ d: day.d, ph: day.ph, b: day.b, items });
    });
    if (cont) q.unshift(cont.t);
    return { sched, rest: q };
  }
  /* 排完後:沒排進去的加碼 = 省略(dropped);沒排進去的核心 = 時間缺口(over,分鐘) */
  function fit(queue, days) {
    const a = simulate(queue, days);
    return Object.assign(a, { dropped: a.rest.filter(t => t.opt).length, over: a.rest.filter(t => !t.opt).reduce((n, t) => n + t.min, 0) });
  }

  /* ---------- 錯題本到期(今日路線第一項) ---------- */
  function review(cfg) {
    const subs = (window.SUBJECTS || []).filter(s => ['pr2', 'pr', 'gh', cfg.lang].indexOf(s.k) >= 0);
    let due = 0, total = 0, top = null;
    subs.forEach(s => {
      const o = LSget(s.wb, {}), ids = Object.keys(o), d = window.SRS ? SRS.countDue(o) : 0;
      due += d; total += ids.length; if (d && (!top || d > top.d)) top = { s, d };
    });
    return { due, total, href: top ? top.s.page + '?due=1' : null, name: top ? top.s.name : '' };
  }

  function build(nowIn) {
    const cfg = get(); if (!cfg) return { ok: false, why: 'noplan' };
    const exam = parse(rawGet('exam_date'));
    if (!exam) return { ok: false, why: 'noexam', cfg };
    const now = day0(nowIn || new Date()), today = dkey(now);
    if (exam <= now) return { ok: false, why: 'past', cfg, exam: dkey(exam) };
    let start = parse(cfg.start) || now; if (start > now) start = now;
    const isStudyDay = d => !!cfg.days[d.getDay()];
    const allDays = []; for (let d = new Date(start); d < exam; d = addD(d, 1)) if (isStudyDay(d)) allDays.push(dkey(d));
    const phs = phases(allDays.length), phOf = {}; allDays.forEach((k, i) => { phOf[k] = phs[i]; });
    const dayObj = k => ({ d: k, ph: phOf[k], b: budget(cfg, phOf[k]) });
    const N = allDays.length, mode = N < 14 ? 'crash' : N < 30 ? 'short' : 'normal';
    const W = weights(cfg), T = order(tasks(cfg, mode === 'crash'), W), isDone = doneFn(), man = LSget('plan_done', {});
    T.forEach(t => { t.done = isDone(t); });
    const byId = {}; T.forEach(t => { byId[t.id] = t; });
    /* 進度對照:從起算日照原計畫排,今天以前排到卻還沒完成 = 落後;排在之後卻已完成 = 超前 */
    const orig = fit(T, allDays.map(dayObj));
    const lateT = [], aheadT = [];
    orig.sched.forEach(x => x.items.forEach(it => { if (it.cont) return; if (x.d < today && !it.t.done) lateT.push(it.t); if (x.d >= today && it.t.done) aheadT.push(it.t); }));
    /* 今天的清單(當天第一次決定後固定) */
    const restDays = allDays.filter(k => k >= today), isStudy = restDays[0] === today;
    const remain = T.filter(t => !t.done);
    let cache = LSget('plan_today', null);
    if (!cache || cache.d !== today || cache.sig !== cfg.saved) {
      const s0 = isStudy ? fit(remain, [dayObj(today)]) : null;
      cache = { d: today, sig: cfg.saved, ids: s0 && s0.sched[0] ? s0.sched[0].items.map(it => it.t.id) : [] };
      LSset('plan_today', cache);
    }
    const todayIds = cache.ids.filter(id => byId[id]);
    /* 明天起:剩下的任務重新排(今天清單上的先當作今天會做完;沒做完明天會自動回到最前面) */
    const future = restDays.filter(k => k > today).map(dayObj);
    const sim = fit(remain.filter(t => todayIds.indexOf(t.id) < 0), future);
    const ph = phOf[today] || (restDays[0] && phOf[restDays[0]]) || 'final';
    /* 今日路線 */
    const route = [], rv = review(cfg);
    if (rv.total || rv.due) route.push({ id: 'rev', kind: 'rev', ic: '🧠', t: rv.due ? '錯題複習:今天到期 ' + rv.due + ' 題' : '錯題複習:今天到期的都複習完了', sub: rv.due ? rv.name + '最多,先從這科開始;答對會往後排' : '錯題本共 ' + rv.total + ' 題,依間隔排在之後', min: rv.due ? Math.min(30, Math.ceil(rv.due * 1.2)) : 0, href: rv.href || '考照中心.html', done: !rv.due, auto: true });
    if (isStudy && (ph === 'base' || ph === 'drill') && habitMin(cfg)) {
      const id = 'voc:' + today;
      route.push({ id, kind: 'habit', ic: cfg.lang === 'jp' ? '🎌' : '🔤', t: (cfg.lang === 'jp' ? '日語' : '英語') + '單字卡 ' + habitMin(cfg) + ' 分鐘', sub: '複習學過的字,每天一點不會忘', min: habitMin(cfg), href: cfg.lang === 'jp' ? '日語學習中心.html' : '學習中心.html', done: !!man[id] });
    }
    let used = 0;
    todayIds.forEach(id => {
      const t = byId[id], b = budget(cfg, phOf[today]), left = Math.max(0, b - used), m = t.min - left <= TOL ? t.min : Math.min(t.min, left || t.min);
      used += t.min;
      route.push({ id, kind: 'task', ic: SUB[t.s].ic, s: t.s, t: t.t, sub: (t.min > m && m > 0 ? '今天先做約 ' + m + ' 分,明天接著做' + (t.k === 'paper' ? '(作答會自動存檔)' : '') + '。' : '') + (t.sub || ''), min: t.min, href: t.href, done: t.done, paper: t.k === 'paper', opt: t.opt, extra: (cache.more || []).indexOf(id) >= 0 });
    });
    if (isStudy && ph === 'final') {
      const left = restDays.length, last = left === 1;
      [['fin:rev', '🧠', '錯題本全部再看一次(各科)', '考照中心.html', 30], ['fin:must', '🔥', '考前衝刺必背:快速瀏覽', '考前衝刺.html', 30], ['fin:new', '🆕', '新制與法規異動:必背卡', '法規異動.html?tab=cards', 20]]
        .concat(last ? [['fin:prep', '🎒', '準備入場證件(准考證、身分證)、早點睡', '', 0]] : [])
        .forEach(([k, ic, t, href, min]) => { const id = k + ':' + today; route.push({ id, kind: 'final', ic, t, min, href, done: !!man[id] }); });
    }
    const todo = route.filter(r => !r.done && r.kind !== 'rev');
    /* 今天的都做完(或今天是休息日)→ 提示下一項,可以「加到今天」 */
    const nextUp = !todo.length && sim.sched.length ? (sim.sched.find(x => x.items.length) || { items: [] }).items.map(it => it.t).find(t => !t.done) || null : null;
    /* 各科進度 */
    const subj = {};
    ['pr2', 'pr', 'gh', cfg.lang].forEach(s => {
      const mine = T.filter(t => t.s === s && !t.opt), pap = mine.filter(t => t.k === 'paper'), lrn = mine.filter(t => t.k !== 'paper');
      subj[s] = { n: SUB[s].n, ic: SUB[s].ic, papers: [pap.filter(t => t.done).length, pap.length], learn: [lrn.filter(t => t.done).length, lrn.length],
        bonus: T.filter(t => t.s === s && t.opt && t.done).length, acc: W[s].acc, w: W[s].w };
    });
    /* 階段區間 */
    const ranges = [];
    allDays.forEach(k => { const p = phOf[k], r = ranges[ranges.length - 1]; if (r && r.ph === p) { r.to = k; r.n++; } else ranges.push({ ph: p, from: k, to: k, n: 1 }); });
    const sum = a => a.reduce((n, t) => n + t.min, 0);
    const coreLeft = remain.filter(t => !t.opt), dleft = Math.round((exam - now) / 86400000), nf = restDays.filter(k => phOf[k] !== 'final').length;
    const nextStudy = isStudy ? today : restDays[0] || null;
    return {
      ok: true, cfg, exam: dkey(exam), today, ph, phName: PH[ph], isStudy, daysLeft: dleft, studyLeft: restDays.length,
      mode, nextStudy, N, elapsed: allDays.filter(k => k < today).length, ranges, route, nextUp, sched: sim.sched, rest: sim.rest, dropped: sim.dropped, over: nf ? sim.over : 0,
      late: { n: lateT.length, min: sum(lateT) }, ahead: { n: aheadT.length, min: sum(aheadT) },
      need: nf ? Math.ceil(sum(coreLeft) / nf + reviewMin(cfg) + (ph === 'base' || ph === 'drill' ? habitMin(cfg) : 0)) : 0, budget: budget(cfg, ph), reviewMin: reviewMin(cfg), habitMin: habitMin(cfg),
      total: { core: T.filter(t => !t.opt).length, coreDone: T.filter(t => !t.opt && t.done).length, all: T.length, done: T.filter(t => t.done).length },
      subj, tasks: T, PH, SUB
    };
  }
  function mark(id, on) {
    const m = LSget('plan_done', {});
    if (on) m[id] = dkey(new Date()); else delete m[id];
    LSset('plan_done', m);
  }
  function more(id) {
    const c = LSget('plan_today', null); if (!c || c.d !== dkey(day0(new Date()))) return;
    if (c.ids.indexOf(id) < 0) { c.ids.push(id); (c.more = c.more || []).push(id); LSset('plan_today', c); }
  }
  window.PLAN = { get, save, reset, build, mark, more, dkey, parse, PH, SUB, CN, JY, GRAM };
})();
