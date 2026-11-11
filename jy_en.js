/* jy_en.js — 講義:外語英語 · v251
   ------------------------------------------------------------------
   結構同 jy_gh.js(章節 → 區塊);英語題庫(bank.js)沒有中文三科那種細類,match 一律用 add 列出題號:
   依題型(字彙、文法、對話)與情境主題分章,題號由分章腳本產生,e2e 檢查每題只屬一章。
   字彙說明、搭配、例句與解題技巧皆自行撰寫;歷屆題目引自考選部公開試題。
   變更履歷:
     v251 (2026-11-11) 初版:第 1 章 字彙(一):機場、航空與出入境
*/
const JY_EN = {
  subj: 'en', name: '外語英語',
  chapters: [{
    id: 'en-01', no: 1, t: '字彙(一):機場、航空與出入境',
    sub: 'passport 與 visa · valid 與 expire · immigration 與 customs · declare 與 Green Channel · allowance 與 confiscate · quarantine · embassy 與 consulate · boarding pass · departure 與 arrival · carry-on 與 checked baggage · carousel 與 baggage claim · security check · 機上廣播 · turbulence · complimentary · budget airline 與 mileage · delay 與 compensation',
    ver: '2026-11-11',
    match: { add: ['guide-106-1', 'guide-106-50', 'leader-106-2', 'leader-106-4', 'leader-106-14', 'leader-106-54', 'guide-107-26', 'leader-107-7', 'leader-107-9', 'leader-107-19', 'leader-107-20', 'leader-107-34', 'leader-107-46', 'leader-107-63', 'guide-108-1', 'guide-108-2', 'guide-108-27', 'guide-108-46', 'guide-108-54', 'leader-108-2', 'leader-108-13', 'leader-108-20', 'leader-108-29', 'leader-108-40', 'leader-108-42', 'leader-108-65', 'guide-109-46', 'guide-109-59', 'guide-109-66', 'leader-109-15', 'leader-109-16', 'leader-109-17', 'leader-109-23', 'leader-109-27', 'leader-109-41', 'leader-109-46', 'leader-109-50', 'leader-109-53', 'leader-109-59', 'leader-109-63', 'leader-109-64', 'leader-109-70', 'guide-110-2', 'guide-110-4', 'guide-110-6', 'guide-110-43', 'guide-110-59', 'guide-110-61', 'leader-110-4', 'leader-110-5', 'leader-110-46', 'leader-110-67', 'guide-111-10', 'guide-111-32', 'guide-111-39', 'guide-111-57', 'leader-111-2', 'leader-111-6', 'leader-111-9', 'leader-111-23', 'leader-111-25', 'leader-111-28', 'leader-111-31', 'leader-111-40', 'leader-111-47', 'leader-111-58', 'guide-112-4', 'guide-112-40', 'guide-112-44', 'leader-112-2', 'leader-112-8', 'leader-112-15', 'leader-112-17', 'leader-112-18', 'leader-112-36', 'leader-112-43', 'leader-112-44', 'leader-112-46', 'leader-112-48', 'guide-113-7', 'guide-113-18', 'guide-113-20', 'guide-113-31', 'guide-113-36', 'guide-113-39', 'leader-113-10', 'leader-113-21', 'leader-113-25', 'leader-113-29', 'leader-113-59', 'leader-113-61', 'leader-113-66', 'leader-113-70', 'guide-114-40', 'guide-114-41', 'guide-114-52', 'guide-114-58', 'guide-114-70', 'leader-114-12', 'leader-114-33', 'leader-114-34', 'leader-114-39', 'leader-114-46', 'leader-114-52', 'leader-114-53', 'leader-114-57', 'guide-115-12', 'guide-115-36', 'guide-115-47', 'leader-115-3', 'leader-115-27', 'leader-115-32', 'leader-115-34', 'leader-115-40', 'leader-115-51', 'leader-115-62', 'leader-115-64'] },
    blocks: [
      { t: 'h', text: '一、出入境與證件' },
      { t: 'p', html: '出國第一關是證件:<b>passport</b>(護照)必須 <b>valid</b>(有效),許多國家要求入境時護照還有<b>六個月以上</b>的 <b>validity</b>(效期),快要 <b>expire</b>(到期)就先 renew(換發)。<b>visa</b>(簽證)由目的地國核發,免簽入境叫 visa-free;美國的免簽計畫(Visa Waiver Program)要先申請電子旅行授權,被 <b>approved</b>(核准)才能出發。抵達後先過 <b>immigration</b> / <b>passport control</b>(證照查驗):官員檢查護照與簽證,可能要你按 <b>fingerprints</b>(指紋)、看鏡頭做 <b>facial recognition</b>(臉部辨識),准許入境叫 granted <b>admission</b>;外國旅客要 <b>fill in</b> an arrival card(填入境卡),有時還要出示 <b>financial</b> proof(財力證明)。逾期停留叫 <b>overstay</b>,可能被 <b>deported</b>(遣返)。' },
      { t: 'ex', key: 'guide-111-39', steps: ['關鍵字是 passport 與 for another six months:題目在說護照還要「有效」六個月以上。', 'be 動詞後面要填形容詞,只有 valid(有效的)合語意 → 選 D;related、plain、insulting 都和證件無關。'] },
      { t: 'p', html: '接著過 <b>customs</b>(海關,固定用複數,前面常加 the):有應稅或管制物品要 <b>declare</b>(申報),填 customs <b>declaration</b> form(申報單);沒有東西要申報(nothing to declare)就走 <b>Green Channel</b>(綠色通道),要申報走 Red Channel。菸酒超過 duty-free <b>allowance</b>(免稅額度)要繳 customs duties(關稅),否則可能被 <b>confiscated</b> / <b>seized</b>(沒收、查扣);<b>prohibited</b>(禁止的)與 <b>restricted</b>(限制的)物品要先申報或丟棄。攜帶動植物要辦 <b>quarantine</b>(檢疫),疫情期間這個字也指隔離;入境有時要填 health declaration(健康申報)。在國外護照遺失,要找本國的 <b>embassy</b>(大使館)或 <b>consulate</b>(領事館)協助,急著回臺可以申請「<b>Entry Certificate</b>」(入國證明書)。' },
      { t: 'cmp', h: 'Immigration vs Customs', head: ['', 'Immigration / Passport control', 'Customs'],
        rows: [['中文', '證照查驗、移民關', '海關'],
          ['檢查什麼', '**人**:護照、簽證、入境資格', '**物**:攜帶的物品、申報、課稅'],
          ['常考字', 'visa、admission、overstay、deport', 'declare、allowance、confiscate、quarantine'],
          ['易錯', 'immigration 是不可數名詞', '**customs** 要用複數(單數 custom 是「習俗」)']] },
      { t: 'p', html: '證件類還常考:<b>insurance</b>(保險,出國前買旅遊保險,否則要自付緊急醫療費用)、<b>certificate</b>(證明書,如 marriage certificate、<b>death certificate</b>)、driver’s <b>license</b>(駕照)與 vehicle <b>registration</b>(行照)、網路上 <b>register</b> an account(註冊帳號)、申請表可以從官網 <b>downloaded</b>(下載)、依兩國 <b>bilateral</b> agreements(雙邊協定)申請打工度假、國家是否 <b>eligible</b>(符合資格)免簽、護照申請要 <b>process</b>(辦理)約五個工作天、生物辨識護照讓人難以 <b>counterfeit</b>(偽造)。離境前在機場 <b>claim</b> the tax refund(申請退稅)。' },
      { t: 'table', h: '重點表:出入境與證件字彙', stack: true, head: ['英文', '中文與常考搭配'],
        rows: [['**valid** / validity', '有效的 / 效期:passport must be valid for six months'],
          ['**expire** / expired', '到期、失效:Your passport will expire soon.'],
          ['**declare** / declaration', '申報 / 申報書:customs declaration form'],
          ['**allowance**', '額度:duty-free allowance、baggage allowance'],
          ['**confiscate** / seize', '沒收 / 查扣(違禁或超量物品)'],
          ['**quarantine**', '檢疫;隔離'],
          ['**embassy** / consulate', '大使館 / 領事館(護照遺失求助)'],
          ['**eligible** / approved', '符合資格的 / 獲得核准的(免簽、旅行授權)']] },
      { t: 'ex', key: 'leader-115-27', steps: ['看到 Green Channel 與 customs agent,情境是海關。', '沒有東西要「申報」才能走綠色通道 → 選 B declare;pay、hide、regret 都不是海關用語。'] },
      { t: 'mn', h: '字尾變化', text: '「valid → validity;declare → declaration;expire → expiry;confiscate = seize」', ex: '空格前是 the、a、of 時多半要名詞(validity、declaration);空格前是 be 動詞時多半要形容詞(valid、eligible)。' },
      { t: 'key', items: [
        '護照入境多要求 **valid for six months**;快到期 = **expire**;效期(名詞)= **validity**。',
        '證照查驗 = **immigration / passport control**(查人);海關 = **customs**(查物,要用複數)。',
        '沒有東西申報 → **nothing to declare** → 走 **Green Channel**;超過 **allowance** 會被 **confiscate**。',
        '動植物入境要 **quarantine**(檢疫);護照遺失找 **embassy / consulate**,急著回臺申請 **Entry Certificate**。',
        '逾期停留 = **overstay**,可能被 **deported**(遣返);准許入境 = granted **admission**。'] },
      { t: 'h', text: '二、報到、安檢與行李' },
      { t: 'p', html: '到機場先找航廈(<b>terminal</b>,裡面有各種 <b>facilities</b> 設施)報到(check in),拿到 <b>boarding pass</b>(登機證)。<b>departure</b> 是「出發、離站」,航班的 departure time 指離開登機門的時間,不是起飛時間;相對的是 <b>arrival</b>(抵達)。行李分兩種:<b>checked baggage</b>(託運行李)與 <b>carry-on</b> bag(隨身行李,也叫 hand luggage)。超過免費的 baggage <b>allowance</b> 或 weight <b>limit</b>,要付 <b>excess baggage</b> fee(超重費);<b>exceed</b> 是動詞「超過」;隨身行李還有 <b>dimensions</b>(尺寸)限制,習慣輕裝出門叫 pack <b>light</b>;易碎物品要申報為 <b>fragile</b>。抵達後到 <b>baggage claim</b> 的 <b>carousel</b>(行李轉盤)領行李,找不到就到航空公司櫃台 <b>file</b> a claim(提出申報);撿到的東西會送到 <b>lost and found</b>(失物招領處)。' },
      { t: 'fig', h: '圖解 1:抵達後的入境流程', svg: '<svg viewBox="0 0 360 208" role="img" aria-label="抵達後的入境流程:第一步 Passport control 或 Immigration,證照查驗,檢查護照與簽證,外國人要繳入境卡;第二步 Baggage claim,行李提領,到 carousel 行李轉盤領託運行李;第三步 Customs,海關,沒有東西申報走 Green Channel,要申報走 Red Channel;第四步 Arrivals hall,入境大廳,接機、換匯與搭車"><rect class="b1" x="6" y="6" width="348" height="46" rx="8"/><text class="tb" x="16" y="25">① Passport control / Immigration</text><text class="ts" x="16" y="43">證照查驗:護照、簽證,外國人繳 arrival card</text><rect class="b2" x="6" y="56" width="348" height="46" rx="8"/><text class="tb" x="16" y="75">② Baggage claim</text><text class="ts" x="16" y="93">行李提領:到 carousel(行李轉盤)領託運行李</text><rect class="b3" x="6" y="106" width="348" height="46" rx="8"/><text class="tb" x="16" y="125">③ Customs</text><text class="ts" x="16" y="143">海關:nothing to declare 走 Green Channel</text><rect class="bx" x="6" y="156" width="348" height="46" rx="8"/><text class="tb" x="16" y="175">④ Arrivals hall</text><text class="ts" x="16" y="193">入境大廳:接機、換匯、搭車</text></svg>' },
      { t: 'ex', key: 'leader-108-13', steps: ['句子說行李超過免費的件數與重量就要付超重費,空格要填「重量的什麼」。', 'weight allowance 是固定搭配(行李重量額度)→ 選 A;count、size、volume 都不是航空公司的用語。'] },
      { t: 'p', html: '安全檢查(security check)時,把隨身行李放上 <b>conveyor</b> belt(輸送帶)過 X 光;水瓶要先 <b>empty</b>(倒空),帶上機的 <b>liquids</b>(液體)每瓶不超過 100 毫升(約 3.4 盎司),裝進透明夾鏈袋。刀具、尖銳物、金屬指甲銼等 <b>prohibited</b> items(違禁品)會被安檢人員 <b>confiscate</b>;打包前可先查航空公司的 <b>Restricted</b> Articles(限制物品)規定。在機場行李不可 <b>unattended</b>(無人看管)。' },
      { t: 'fig', h: '圖解 2:安全檢查(security check)', svg: '<svg viewBox="0 0 360 208" role="img" aria-label="安全檢查:液體每瓶不超過 100 毫升,約 3.4 盎司,裝進透明夾鏈袋,水瓶要倒空;隨身行李放上 conveyor 輸送帶通過 X 光;刀具、尖銳物等 prohibited items 違禁品會被 confiscate 沒收;行李不可 unattended 無人看管,易碎品要標 fragile"><rect class="b1" x="6" y="6" width="348" height="46" rx="8"/><text class="tb" x="16" y="25">Liquids:每瓶 100 ml 以下</text><text class="ts" x="16" y="43">約 3.4 oz,裝透明夾鏈袋;水瓶要 empty</text><rect class="b2" x="6" y="56" width="348" height="46" rx="8"/><text class="tb" x="16" y="75">Conveyor belt</text><text class="ts" x="16" y="93">carry-on 隨身行李放上輸送帶過 X 光</text><rect class="b3" x="6" y="106" width="348" height="46" rx="8"/><text class="tb" x="16" y="125">Prohibited items</text><text class="ts" x="16" y="143">刀具、尖銳物 → confiscate(沒收)</text><rect class="bx" x="6" y="156" width="348" height="46" rx="8"/><text class="tb" x="16" y="175">Unattended luggage</text><text class="ts" x="16" y="193">行李不可無人看管;易碎品標 fragile</text></svg>' },
      { t: 'table', h: '重點表:報到、安檢與行李字彙', stack: true, head: ['英文', '中文與常考搭配'],
        rows: [['**boarding pass**', '登機證(過安檢、登機要出示)'],
          ['**departure** / arrival', '出發、離站 / 抵達'],
          ['**carry-on** / checked baggage', '隨身行李 / 託運行李'],
          ['**exceed** / excess', '超過(動詞)/ 超過的量(excess baggage fee)'],
          ['**carousel**', '行李轉盤(baggage claim 區)'],
          ['**conveyor**', '輸送帶(安檢 X 光)'],
          ['**unattended**', '無人看管的(行李不可離身)'],
          ['**fragile**', '易碎的(貼易碎標籤)']] },
      { t: 'ex', key: 'leader-108-29', steps: ['關鍵字是 airport、moving surface、collect their luggage:在機場領行李的移動平台。', '這就是 baggage claim 區的行李轉盤 → 選 D carousel;journey、profile、racket 都不合。'] },
      { t: 'h', text: '三、機上與航空公司' },
      { t: 'p', html: '登機(<b>board</b>)後,隨身行李要 <b>stow</b>(收放)進 overhead <b>compartment</b> / bin(頭頂置物櫃);想方便起身就選 <b>aisle seat</b>(走道座),靠窗是 window seat。機上廣播常聽到:<b>fasten</b> your seat belt(繫好安全帶)、seats in the <b>upright</b> position(椅背豎直)、手機 <b>switched</b> to flight mode(切換飛航模式);遇到 <b>turbulence</b>(亂流)要回座;客艙失壓時 <b>oxygen</b> masks 會落下;飛機平飛叫 <b>cruising</b>(巡航)。全程禁菸:smoking is <b>prohibited</b>。<b>complimentary</b> 是「免費招待的」(complimentary drinks),和 complementary(互補的)不同;機上還有 inflight <b>entertainment</b>(娛樂系統)。' },
      { t: 'fig', h: '圖解 3:機上廣播常聽到的句子', svg: '<svg viewBox="0 0 360 208" role="img" aria-label="機上廣播常聽到的句子:Fasten your seat belt,繫好安全帶,遇到 turbulence 亂流更要繫好;Seat in the upright position,起降前椅背豎直;Stow your carry-on,隨身行李收進頭頂置物櫃 overhead compartment;Switch to flight mode,手機切換飛航模式,客艙失壓時 oxygen masks 氧氣面罩會落下"><rect class="b1" x="6" y="6" width="348" height="46" rx="8"/><text class="tb" x="16" y="25">Fasten your seat belt</text><text class="ts" x="16" y="43">繫好安全帶;遇到 turbulence(亂流)更要繫</text><rect class="b2" x="6" y="56" width="348" height="46" rx="8"/><text class="tb" x="16" y="75">Seat in the upright position</text><text class="ts" x="16" y="93">起飛、降落前椅背豎直</text><rect class="b3" x="6" y="106" width="348" height="46" rx="8"/><text class="tb" x="16" y="125">Stow your carry-on</text><text class="ts" x="16" y="143">收進 overhead compartment(頭頂置物櫃)</text><rect class="bx" x="6" y="156" width="348" height="46" rx="8"/><text class="tb" x="16" y="175">Switch to flight mode</text><text class="ts" x="16" y="193">手機切飛航模式;失壓時 oxygen masks 落下</text></svg>' },
      { t: 'ex', key: 'leader-109-64', steps: ['句子要乘客坐著時都繫好安全帶,以防遇到「突如其來的」某種狀況(unexpected)。', '會讓飛機搖晃、需要繫安全帶的是亂流 → 選 A turbulence;occurrence、monument、installment 都不合。'] },
      { t: 'p', html: '航空公司相關的字:<b>charter</b> flight(包機)、<b>budget</b> airline(廉價航空,票價低但餐飲另外付費)、<b>frequent flyer</b> miles 與 <b>mileage</b> program(哩程計畫)。航空公司常超賣機位,因為有些旅客訂了位卻沒有 <b>turn up</b>(出現);班機延誤或取消時,領隊要安撫旅客,向航空公司爭取 <b>compensation</b>(補償)。其他常考:航空公司用廣播發布 <b>announcement</b>(宣布事項)、罷工造成的 <b>disruption</b>(中斷、混亂)、航空公司增加 <b>capacity</b>(運能)、機票 <b>hike</b> / <b>rising</b>(調漲)、折扣票的 ticket <b>restrictions</b>(限制條件)、緊急降落時機組員遵守 safety <b>protocol</b>(標準程序)。' },
      { t: 'ex', key: 'leader-109-46', steps: ['後一句 You do not have to pay for them 是提示:飲料不用付錢。', '「免費招待的」是 complimentary → 選 D;compositional、constitutional、contaminating 只是字首相似的陷阱。'] },
      { t: 'key', items: [
        '登機證 = **boarding pass**;departure time 是**離開登機門**的時間。',
        '行李額度 = **baggage allowance**;超過 = **exceed**,要付 **excess baggage** fee。',
        '領行李在 **baggage claim** 的 **carousel**;安檢把行李放上 **conveyor**;行李不可 **unattended**。',
        '機上:**fasten** seat belt、**upright** position、**turbulence** 亂流、**complimentary** 免費招待。',
        '廉價航空 = **budget** airline;哩程 = **mileage**;班機延誤爭取 **compensation**。'] },
      { t: 'h', text: '四、解題技巧' },
      { t: 'p', html: '英語字彙題的四個選項常是同詞性的字,解題順序:①先找<b>情境關鍵字</b>(customs、cabin、baggage)鎖定場景;②看空格位置判斷<b>詞性</b>(冠詞後填名詞、be 動詞後填形容詞);③用<b>固定搭配</b>刪選項(baggage allowance、boarding pass、file a claim);④把剩下的選項<b>代回原句</b>唸一遍。機場與航空題的情境很固定,本章的搭配詞背熟,多數題目一看就有答案;遇到字首相似的選項(complimentary、compositional、constitutional),要看句子的提示字。' },
      { t: 'tip', items: [
        '先找情境關鍵字:看到 Green Channel、duty-free → 申報(declare);看到 seat belt、cabin → 機上廣播。',
        '看空格前後的詞性:the、of 後面多半填名詞(validity、declaration、allowance),be 動詞後面多半填形容詞(valid、fragile、complimentary)。',
        '背搭配不背單字:baggage allowance、boarding pass、overhead compartment、frequent flyer miles、file a claim。',
        '不確定時把選項一個個代回句子唸,只有一個通順。'] },
      { t: 'trap', items: [
        '**customs**(海關)要用複數;custom 單數是「習俗」。',
        '**complimentary**(免費招待)不是 complementary(互補的)。',
        '**departure time** 是離開登機門的時間,不是起飛時間。',
        '**embassy** 是大使館、**consulate** 是領事館;護照遺失兩者都能協助。',
        '**aisle seat** 是走道座,window seat 才是靠窗。',
        '**fragile** 是易碎的,不是 flexible(有彈性的)。'] },
      { t: 'stale', text: '本章依歷屆考題整理;各國入境規定(護照效期、液體限制、電子旅行授權等)會調整,出國前以航空公司與目的地國官方公告為準。' },
      { t: 'self', items: [
        ['護照「效期」的英文名詞?', 'validity'],
        ['沒有東西要申報,要走哪條通道?', 'Green Channel'],
        ['海關的英文(注意單複數)?', 'customs'],
        ['機場的行李轉盤?', 'carousel'],
        ['行李額度?', 'baggage allowance'],
        ['安檢時放行李的輸送帶?', 'conveyor (belt)'],
        ['飛機遇到的亂流?', 'turbulence'],
        ['機上「免費招待的」飲料?', 'complimentary drinks'],
        ['頭頂置物櫃?', 'overhead compartment / bin'],
        ['在國外護照遺失要找哪裡?', 'embassy 或 consulate']] }
    ]
  }]
};
