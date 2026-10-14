/* lfig.js — 地形與海岸圖解(離線 SVG,原創示意圖)· v148
   ------------------------------------------------------------------
   LFIG.svg(key, opt)  回傳一張示意圖的 SVG 字串;opt.hl = 'bar' | 'lag' | 'all'(沙岸圖要強調的部分)
   LFIG.fig(key, opt)  回傳 <figure class="lfd">(SVG + 圖說);圖鑑「海岸類型與海岸地形」「地形景觀」每列用
   LFIG.keys           所有圖的鍵
   圖全部由本專案自行繪製(示意,不作測量用途);「遮住重點」時圖上文字一起蓋起來,點圖再顯示。
   變更履歷:
     v148 (2026-10-14) 初版:岬灣、宜蘭、斷層、珊瑚礁、沙岸(沙洲 / 潟湖)、沙丘、沙頸岬、海蝕、火山、珊瑚礁三型、惡地、峽谷與壺穴、
                       泥火山與堰塞湖、喀斯特 · 冰河 · 板塊 共 14 張
*/
(function () {
  'use strict';
  function r1(v) { return Math.round(v * 10) / 10; }
  /* 文字:cls k = 重點(粗)、s = 小字、rd = 紅字(不用 r,避免和圖鑑頁每列的 .r 撞名);a = 對齊 m 置中 / e 靠右 */
  function T(x, y, t, cls, a) { return '<text x="' + x + '" y="' + y + '"' + (cls ? ' class="' + cls + '"' : '') + (a ? ' text-anchor="' + (a === 'm' ? 'middle' : 'end') + '"' : '') + '>' + t + '</text>'; }
  /* 直線箭頭:c = '' 灰 / 'w' 風(紫)/ 'b' 水(藍)/ 'r' 地殼(紅) */
  function A(x1, y1, x2, y2, c) {
    var g = Math.atan2(y2 - y1, x2 - x1), hl = 7, hw = 4, bx = x2 - Math.cos(g) * hl, by = y2 - Math.sin(g) * hl;
    return '<line class="ar' + (c ? ' a-' + c : '') + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + r1(bx) + '" y2="' + r1(by) + '"/>' +
      '<path class="ah' + (c ? ' h-' + c : '') + '" d="M' + x2 + ',' + y2 + 'L' + r1(bx + Math.sin(g) * hw) + ',' + r1(by - Math.cos(g) * hw) + 'L' + r1(bx - Math.sin(g) * hw) + ',' + r1(by + Math.cos(g) * hw) + 'Z"/>';
  }
  /* 彎曲箭頭(二次曲線) */
  function C(x1, y1, cx, cy, x2, y2, c) {
    var g = Math.atan2(y2 - cy, x2 - cx), hl = 7, hw = 4, bx = x2 - Math.cos(g) * hl, by = y2 - Math.sin(g) * hl;
    return '<path class="ar' + (c ? ' a-' + c : '') + '" d="M' + x1 + ',' + y1 + 'Q' + cx + ',' + cy + ' ' + r1(bx) + ',' + r1(by) + '"/>' +
      '<path class="ah' + (c ? ' h-' + c : '') + '" d="M' + x2 + ',' + y2 + 'L' + r1(bx + Math.sin(g) * hw) + ',' + r1(by - Math.cos(g) * hw) + 'L' + r1(bx - Math.sin(g) * hw) + ',' + r1(by + Math.cos(g) * hw) + 'Z"/>';
  }
  function P(d, cls) { return '<path class="' + cls + '" d="' + d + '"/>'; }
  /* 小浪紋 */
  function wave(x, y, n) { var d = 'M' + x + ',' + y; for (var i = 0; i < (n || 3); i++) d += 'q5,-4 10,0'; return P(d, 'wv'); }
  function svg(w, h, body, label) { return '<svg class="lf" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '"><rect class="bg" width="' + w + '" height="' + h + '" rx="10"/>' + body + '</svg>'; }

  var F = {};
  /* ① 岬灣海岸(俯視) */
  F.cape = function () {
    var b = '<rect class="sea" x="0" y="0" width="320" height="150" rx="10"/>';
    b += P('M0,150L0,114L14,106L22,90L30,84L36,66L46,62L50,52L60,50L66,58L74,62L80,78L88,90L94,100C106,118 130,120 142,100L148,88L156,78L160,62L168,56L172,44L184,40L192,46L200,52L204,66L210,78L216,96C228,120 254,122 266,104L272,92L280,86L284,72L294,66L298,58L308,58L314,66L320,70L320,150Z', 'land');
    b += P('M92,98C104,120 130,122 142,100C130,113 104,113 92,98Z', 'sand') + P('M216,96C228,121 254,124 266,104C253,117 229,116 216,96Z', 'sand');
    b += '<circle class="rock" cx="188" cy="28" r="5"/><circle class="rock" cx="199" cy="21" r="3.5"/>';
    b += wave(14, 26) + wave(98, 28) + wave(232, 30) + wave(262, 14);
    b += A(56, 14, 55, 40, 'b') + A(176, 6, 177, 30, 'b') + A(300, 26, 300, 50, 'b') + A(120, 50, 118, 80, 'b');
    b += T(208, 18, '海蝕柱', 's') + T(54, 78, '岬角', 'k', 'm') + T(54, 91, '受侵蝕', 's', 'm') + T(178, 72, '岬角', 'k', 'm') + T(178, 85, '海蝕崖、平台', 's', 'm');
    b += T(117, 136, '海灣', 'k', 'm') + T(117, 148, '堆積成沙灘', 's', 'm') + T(241, 138, '海灣', 'k', 'm') + T(241, 149, '沙灘', 's', 'm');
    b += T(316, 12, '海浪(東北季風)', 's', 'e') + T(8, 46, '海', 's') + T(30, 140, '陸地', 's', 'm') + T(8, 12, '(俯視)', 's');
    return svg(320, 150, b, '岬灣海岸示意圖');
  };
  /* ② 宜蘭海岸(俯視,北在上) */
  F.yilan = function () {
    var b = '<rect class="sea" x="0" y="0" width="320" height="150" rx="10"/>';
    b += P('M0,0L198,0L206,8L196,14L203,22L191,28L195,36L183,42L171,48L153,54C188,76 198,102 184,124L196,129L205,127L208,135L194,138L180,140L172,150L0,150Z', 'land');
    b += P('M153,54C188,76 198,102 184,124', 'sandl');
    b += '<path class="sand" d="M174,68q5,-6 10,0z"/><path class="sand" d="M183,86q5,-6 10,0z"/><path class="sand" d="M184,104q5,-6 10,0z"/>';
    b += P('M28,96C70,84 110,104 150,90C166,86 178,92 190,92', 'riv');
    b += P('M252,70L262,56L272,68L278,72L250,74Z', 'rock');
    b += T(212, 12, '三貂角', 's') + T(122, 26, '岩岸', 'k', 'm') + T(122, 38, '北關:豆腐岩、單面山', 's', 'm') + T(146, 64, '頭城', 's', 'e');
    b += T(96, 74, '蘭陽平原:沙岸', 'k', 'm') + T(96, 86, '海邊有沙丘', 's', 'm') + T(60, 108, '蘭陽溪', 's', 'm');
    b += T(150, 134, '蘇澳', 's', 'e') + T(214, 146, '南方澳(沙頸岬)', 's') + T(264, 88, '龜山島', 'k', 'm') + T(264, 100, '(火山島)', 's', 'm');
    return svg(320, 150, b, '宜蘭海岸示意圖');
  };
  /* ③ 斷層海岸(剖面) */
  F.fault = function () {
    var b = '<rect class="sea" x="204" y="90" width="116" height="60"/><rect class="deep" x="206" y="122" width="114" height="28"/>';
    b += P('M0,150L0,70L40,52L80,36L120,24L150,30L170,40L176,46L188,46L190,52L198,52L203,56L208,150Z', 'rock2');
    b += P('M200,50L211,150', 'dash');
    b += P('M204,90L320,90', 'wv');
    b += A(150, 92, 150, 64, 'r') + A(250, 112, 250, 136, 'r');
    b += T(182, 38, '海階', 'k', 'm') + T(66, 98, '地盤上升', 's', 'm') + T(216, 62, '斷層崖', 'k') + T(216, 74, '山地直落入海', 's');
    b += T(264, 106, '海水深、岸線平直', 's', 'm') + T(222, 146, '斷層', 'rd');
    return svg(320, 150, b, '斷層海岸示意圖');
  };
  /* ④ 珊瑚礁海岸(剖面):裙礁 + 隆起珊瑚礁 */
  F.coralcoast = function () {
    var b = '<rect class="sea" x="150" y="86" width="170" height="64"/>';
    b += P('M0,150L0,52L50,44L92,56L150,58L154,86L156,150Z', 'rock2');
    b += P('M96,57L150,58L152,70L98,68Z', 'coral');
    b += P('M154,88L234,86L240,96L252,138L156,138Z', 'coral');
    b += P('M156,138L252,138L262,150L156,150Z', 'rock2');
    b += '<circle class="coral" cx="170" cy="86" r="3"/><circle class="coral" cx="192" cy="85" r="3.5"/><circle class="coral" cx="214" cy="85" r="3"/>';
    b += P('M150,86L320,86', 'wv');
    b += T(124, 48, '隆起珊瑚礁', 'k', 'm') + T(64, 82, '地盤上升,', 's', 'm') + T(64, 94, '珊瑚礁露出海面', 's', 'm');
    b += T(196, 112, '裙礁', 'k', 'm') + T(196, 124, '貼著海岸生長', 's', 'm') + T(296, 104, '海水', 's', 'm') + T(296, 116, '溫暖清澈', 's', 'm');
    return svg(320, 150, b, '珊瑚礁海岸示意圖');
  };
  /* ⑤ 沙岸(俯視,海在左):沙灘、沙洲、潟湖、沙丘、河口;hl 強調沙洲 / 潟湖 / 全部 */
  F.sandcoast = function (o) {
    var hl = (o && o.hl) || '', H = function (k) { return hl === k || hl === 'all' ? ' hl' : ''; };
    var b = '<rect class="sea" x="0" y="0" width="320" height="160" rx="10"/>';
    b += P('M126,76L178,74L180,150L126,150Z', 'lag' + H('lag'));
    b += P('M190,0L320,0L320,160L190,160C186,120 194,80 190,0Z', 'land');
    b += '<rect class="sand" x="178" y="0" width="13" height="160"/>';
    b += P('M114,72C120,68 126,70 127,80L127,150C124,156 116,156 113,150Z', 'sand' + H('bar'));
    b += P('M320,36C290,40 280,56 254,50C230,46 214,56 192,54', 'riv') + '<path class="sand" d="M178,48q-10,6 0,14z"/>';
    b += '<path class="sand' + H('dune') + '" d="M200,96q6,-8 12,0z"/><path class="sand' + H('dune') + '" d="M206,112q6,-8 12,0z"/>';
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) b += '<rect class="lag" x="' + (244 + i * 22) + '" y="' + (104 + j * 16) + '" width="18" height="12" rx="1"/>';
    b += A(24, 112, 102, 112, 'b') + A(234, 44, 200, 52, 'b');
    b += T(34, 30, '海水淺', 's') + T(64, 104, '海浪堆積', 's', 'm') + T(106, 64, '沙洲', 'k' + H('bar'), 'm') + T(154, 112, '潟湖', 'k' + H('lag'), 'm');
    b += T(150, 64, '潮口', 's') + T(214, 90, '沙丘', 'k' + H('dune')) + T(250, 26, '河川帶來泥沙', 's') + T(276, 96, '魚塭、鹽田', 's', 'm');
    b += T(184, 156, '沙灘', 's', 'e');
    return svg(320, 160, b, '沙岸地形示意圖');
  };
  /* ⑥ 沙丘(剖面) */
  F.dune = function () {
    var b = '<rect class="sea" x="0" y="100" width="80" height="40"/>';
    b += P('M60,104L120,92Q140,62 162,86Q186,50 214,82Q240,58 262,86Q284,74 300,88L320,90L320,140L60,140Z', 'sand');
    b += P('M0,100L80,100', 'wv');
    b += P('M92,98Q120,90 138,76', 'dot') + P('M170,82Q186,66 198,62', 'dot');
    b += A(14, 36, 96, 52, 'w') + A(24, 58, 108, 72, 'w');
    b += T(20, 28, '風(東北季風、落山風)', 's') + T(92, 120, '沙灘', 's', 'm') + T(214, 112, '沙丘', 'k', 'm') + T(214, 124, '地名「崙」', 's', 'm');
    b += T(300, 30, '風把沙吹上岸', 's', 'e') + T(300, 42, '堆成小丘', 's', 'e');
    return svg(320, 140, b, '沙丘示意圖');
  };
  /* ⑦ 沙頸岬(俯視) */
  F.tombolo = function () {
    var b = '<rect class="sea" x="0" y="0" width="320" height="150" rx="10"/>';
    b += P('M0,150L0,112C40,106 80,114 120,110C150,106 180,114 220,108C260,104 300,112 320,108L320,150Z', 'land');
    b += P('M140,64Q152,88 132,112L190,112Q170,88 182,64Z', 'sand');
    b += P('M108,48L114,36L128,30L138,22L154,24L166,18L182,24L196,28L206,38L212,50L204,58L196,66L180,68L164,72L148,70L132,68L118,62Z', 'rock');
    b += C(22, 30, 80, 56, 130, 84, 'b') + C(298, 30, 240, 56, 192, 84, 'b');
    b += T(160, 50, '陸連島', 'k', 'm') + T(200, 96, '連島沙洲', 'k') + T(40, 134, '陸地', 's', 'm') + T(40, 84, '海', 's', 'm') + T(282, 84, '海', 's', 'm');
    b += T(306, 136, '陸連島 + 連島沙洲 = 沙頸岬', 'k', 'e') + T(160, 12, '海浪從兩側繞過小島,把沙堆在島後(俯視)', 's', 'm');
    return svg(320, 150, b, '沙頸岬示意圖');
  };
  /* ⑧ 海蝕地形(剖面) */
  F.seaerosion = function () {
    var b = '<rect class="sea" x="80" y="104" width="240" height="46"/>';
    b += P('M0,150L0,30L72,30L80,70L86,92L70,96L68,112L90,114L90,150Z', 'rock');
    b += P('M86,104L320,104L320,114L86,114Z', 'rock2');
    b += P('M110,104L112,66Q130,52 148,66L150,104L140,104L138,82Q130,74 122,82L120,104Z', 'rock');
    b += P('M176,104L178,58L190,56L192,104Z', 'rock');
    b += P('M226,104L227,82L233,82L234,104Z', 'rock2') + '<ellipse class="rock" cx="230" cy="76" rx="14" ry="8"/>';
    for (var i = 0; i < 4; i++) b += '<rect class="rock" x="' + (256 + i * 14) + '" y="96" width="12" height="8" rx="1"/>';
    b += wave(98, 124, 2) + wave(196, 132, 3);
    b += T(36, 50, '海蝕崖', 'k', 'm') + T(48, 136, '海蝕洞', 's', 'm') + T(130, 46, '海蝕拱門', 'k', 'm') + T(184, 48, '海蝕柱', 'k', 'm');
    b += T(230, 62, '蕈狀岩', 'k', 'm') + T(282, 88, '豆腐岩', 'k', 'm') + T(282, 128, '海蝕平台', 's', 'm');
    return svg(320, 150, b, '海蝕地形示意圖');
  };
  /* ⑨ 火山(剖面)+ 柱狀玄武岩 */
  F.volcano = function () {
    var b = '<rect class="rock2" x="0" y="112" width="200" height="38"/>';
    b += P('M30,112L96,40L104,46L116,46L124,40L190,112Z', 'rock');
    b += '<ellipse class="magma" cx="110" cy="138" rx="36" ry="9"/>' + P('M106,132L106,46L114,46L114,132Z', 'magma');
    b += P('M122,46Q140,66 166,96', 'lava');
    b += '<circle class="smk" cx="104" cy="30" r="5"/><circle class="smk" cx="114" cy="22" r="6"/><circle class="smk" cx="126" cy="14" r="7"/>';
    for (var i = 0; i < 6; i++) b += '<rect class="bas" x="' + (214 + i * 16) + '" y="' + [56, 50, 58, 52, 60, 54][i] + '" width="14" height="' + (112 - [56, 50, 58, 52, 60, 54][i]) + '"/>';
    b += '<rect class="rock2" x="206" y="112" width="114" height="38"/>';
    b += T(140, 26, '火山口', 'k') + T(156, 148, '岩漿庫', 's') + T(172, 92, '熔岩流', 's') + T(62, 104, '火山錐', 'k', 'm');
    b += T(266, 34, '柱狀玄武岩', 'k', 'm') + T(266, 46, '熔岩冷卻收縮裂成柱', 's', 'm');
    return svg(320, 150, b, '火山與柱狀玄武岩示意圖');
  };
  /* ⑩ 珊瑚礁三型:裙礁 → 堡礁 → 環礁 */
  F.reef3 = function () {
    var b = '<rect class="sea" x="0" y="0" width="320" height="150" rx="10"/>';
    b += '<circle class="coral" cx="55" cy="62" r="36"/><circle class="land" cx="55" cy="62" r="27"/>';
    b += '<circle class="coral" cx="160" cy="62" r="37"/><circle class="lag" cx="160" cy="62" r="29"/><circle class="land" cx="160" cy="62" r="15"/>';
    b += '<circle class="coral" cx="265" cy="62" r="37"/><circle class="lag" cx="265" cy="62" r="29"/>';
    b += A(96, 62, 116, 62) + A(201, 62, 221, 62);
    b += T(55, 117, '裙礁', 'k', 'm') + T(55, 130, '(恆春半島)', 's', 'm') + T(160, 117, '堡礁', 'k', 'm') + T(160, 130, '(澳洲大堡礁)', 's', 'm');
    b += T(265, 117, '環礁', 'k', 'm') + T(265, 130, '(東沙)', 's', 'm') + T(160, 147, '島慢慢下沉、珊瑚往上長', 's', 'm');
    b += T(160, 66, '島', 's', 'm') + T(55, 66, '島', 's', 'm') + T(265, 66, '潟湖', 's', 'm');
    return svg(320, 150, b, '珊瑚礁三型示意圖');
  };
  /* ⑪ 惡地:泥岩 / 礫岩 */
  F.badland = function () {
    var b = P('M0,130L10,96L16,110L24,74L32,104L40,60L48,98L56,70L64,104L72,56L80,96L88,66L96,104L104,80L112,108L122,88L130,112L140,96L150,118L156,130Z', 'mud');
    b += '<rect class="land" x="0" y="128" width="158" height="22"/>';
    for (var i = 0; i < 7; i++) b += '<line class="rain" x1="' + (14 + i * 20) + '" y1="' + (10 + (i % 2) * 8) + '" x2="' + (10 + i * 20) + '" y2="' + (24 + (i % 2) * 8) + '"/>';
    b += P('M168,130L176,60L196,48L220,52L240,46L262,58L282,50L300,62L312,130Z', 'cong');
    var dots = [[190, 70], [206, 64], [226, 74], [246, 66], [266, 76], [284, 70], [198, 90], [218, 96], [238, 88], [258, 98], [278, 92], [296, 100], [208, 112], [230, 116], [252, 110], [274, 118]];
    dots.forEach(function (d) { b += '<circle class="peb" cx="' + d[0] + '" cy="' + d[1] + '" r="2.4"/>'; });
    b += '<rect class="land" x="162" y="128" width="158" height="22"/>' + '<line class="sep" x1="160" y1="6" x2="160" y2="144"/>';
    b += T(78, 44, '泥岩', 'k', 'm') + T(78, 144, '雨溝密布、寸草不生', 's', 'm') + T(240, 34, '礫岩', 'k', 'm') + T(240, 144, '陡峭、礫石崩落', 's', 'm');
    return svg(320, 150, b, '惡地示意圖');
  };
  /* ⑫ 峽谷(剖面)+ 壺穴 */
  F.gorge = function () {
    var b = P('M0,150L0,24L40,22L92,26L102,120L104,132L104,150Z', 'marble') + P('M214,150L214,22L176,22L124,28L114,120L112,132L112,150Z', 'marble');
    b += P('M104,124L112,124L112,136L104,136Z', 'water') + P('M98,120Q108,132 118,120', 'riv');
    b += P('M12,44L60,46M8,70L64,72M18,96L82,98M150,46L200,44M138,72L206,70M128,98L198,96', 'vein');
    b += A(22, 126, 22, 92, 'r') + A(192, 126, 192, 92, 'r') + A(108, 40, 108, 108, 'b');
    b += T(108, 16, '峽谷(V 形谷)', 'k', 'm') + T(42, 140, '地殼抬升', 's', 'm') + T(172, 140, '地殼抬升', 's', 'm') + T(116, 60, '溪水下切', 's');
    b += T(52, 112, '大理岩', 's', 'm');
    b += '<rect class="bg2" x="224" y="20" width="90" height="118" rx="8"/>';
    b += P('M228,96L310,96L310,134L228,134Z', 'rock2') + '<ellipse class="water" cx="268" cy="104" rx="18" ry="10"/>' + '<circle class="peb" cx="266" cy="106" r="4"/>';
    b += P('M228,86Q268,72 310,86L310,96L228,96Z', 'water') + C(248, 88, 262, 74, 280, 92, 'b');
    b += T(269, 38, '壺穴', 'k', 'm') + T(269, 52, '渦流帶石頭', 's', 'm') + T(269, 64, '磨出圓洞', 's', 'm');
    return svg(320, 150, b, '峽谷與壺穴示意圖');
  };
  /* ⑬ 泥火山 · 堰塞湖 */
  F.misc = function () {
    var b = '<rect class="land" x="0" y="106" width="156" height="44"/>';
    b += P('M44,108Q66,74 78,74Q90,74 112,108Z', 'mud') + '<circle class="bub" cx="74" cy="72" r="3"/><circle class="bub" cx="82" cy="68" r="2.4"/><circle class="bub" cx="78" cy="62" r="1.8"/>';
    b += P('M58,150L84,108', 'dash') + A(30, 140, 30, 116, 'r');
    b += T(78, 30, '泥火山', 'k', 'm') + T(78, 44, '天然氣帶泥漿冒出', 's', 'm') + T(102, 142, '斷層', 'rd') + T(30, 104, '天然氣', 's', 'm');
    b += '<line class="sep" x1="160" y1="6" x2="160" y2="144"/>';
    b += P('M164,150L164,40L196,58L232,104L240,150Z', 'land') + P('M320,150L320,30L292,46L262,96L256,150Z', 'land');
    b += P('M226,92L268,90L262,118L232,120Z', 'rock2') + P('M170,96L230,98L232,118L170,118Z', 'water');
    b += A(300, 52, 270, 86, 'r') + P('M258,124Q280,134 318,132', 'riv');
    b += T(240, 26, '堰塞湖', 'k', 'm') + T(240, 40, '山崩擋住河道積水', 's', 'm') + T(198, 112, '湖', 's', 'm') + T(300, 70, '山崩', 's');
    return svg(320, 150, b, '泥火山與堰塞湖示意圖');
  };
  /* ⑭ 國外:喀斯特、冰河、板塊張裂 */
  F.abroad = function () {
    var b = '<rect class="water" x="0" y="104" width="104" height="46"/>';
    [[10, 60, 20], [34, 44, 22], [62, 54, 18], [82, 70, 16]].forEach(function (k) { b += P('M' + k[0] + ',108L' + k[0] + ',' + (k[1] + 10) + 'Q' + (k[0] + k[2] / 2) + ',' + (k[1] - 10) + ' ' + (k[0] + k[2]) + ',' + (k[1] + 10) + 'L' + (k[0] + k[2]) + ',108Z', 'lime'); });
    b += T(52, 22, '喀斯特峰林', 'k', 'm') + T(52, 36, '石灰岩溶蝕', 's', 'm') + '<line class="sep" x1="106" y1="6" x2="106" y2="144"/>';
    b += P('M110,40L132,40Q136,110 160,112Q184,110 188,40L210,40L210,150L110,150Z', 'rock');
    b += P('M136,96Q160,118 184,96L184,104Q160,124 136,104Z', 'water');
    b += T(160, 22, '冰河 U 形谷', 'k', 'm') + T(160, 36, '海水灌入成峽灣', 's', 'm') + '<line class="sep" x1="214" y1="6" x2="214" y2="144"/>';
    b += P('M218,70L252,70L256,150L218,150Z', 'rock') + P('M320,70L286,70L282,150L320,150Z', 'rock') + P('M254,96L284,96L282,150L256,150Z', 'rock2');
    b += '<rect class="water" x="255" y="90" width="29" height="8"/>';
    b += A(246, 60, 222, 60, 'r') + A(292, 60, 316, 60, 'r');
    b += T(269, 22, '板塊張裂', 'k', 'm') + T(269, 36, '陷落成裂谷', 's', 'm') + T(269, 86, '湖', 's', 'm');
    return svg(320, 150, b, '喀斯特、冰河、板塊示意圖');
  };

  var CAP = {
    cape: '岬角突出,受東北季風帶來的海浪侵蝕(海蝕崖、海蝕柱、蕈狀岩);海灣內堆積成沙灘',
    yilan: '三貂角到頭城多岩岸;頭城到蘇澳是蘭陽平原的沙岸,有沙丘;蘇澳南方澳是沙頸岬;外海龜山島是火山島',
    fault: '山地直接落入深海,岸線平直陡峭、少良港;地盤上升留下海階(清水斷崖)',
    coralcoast: '珊瑚礁緊貼海岸生長 = 裙礁;地盤上升、珊瑚礁露出海面 = 隆起珊瑚礁(恆春半島)',
    sandcoast: '河川帶來泥沙,海浪堆成沙灘、沙洲,沙洲內側圍出潟湖,風再把沙吹成沙丘;海淺、岸直、少良港(西部海岸)',
    'sandcoast:bar': '海浪把泥沙堆成和海岸平行的狹長沙地 = 濱外沙洲(臺南地名「鯤鯓」、外傘頂洲)',
    'sandcoast:lag': '沙洲內側圍出的淺水海灣 = 潟湖,適合養殖(七股潟湖、大鵬灣)',
    'sandcoast:all': '海岸堆積地形:沙灘、沙洲、潟湖、沙丘、河口',
    dune: '風把海灘的沙吹上岸堆成小丘 = 沙丘(地名「崙」;恆春風吹砂)',
    tombolo: '沙洲把小島和陸地連起來:陸連島 + 連島沙洲 = 沙頸岬(宜蘭南方澳)',
    seaerosion: '海浪侵蝕岩岸留下的地形(野柳女王頭 = 蕈狀岩、金山燭台雙嶼 = 海蝕柱、和平島 = 豆腐岩)',
    volcano: '岩漿從地下噴出堆成火山;熔岩冷卻收縮裂成柱狀玄武岩(大屯火山群、龜山島、澎湖)',
    reef3: '島嶼慢慢下沉、珊瑚往上長:裙礁 → 堡礁 → 環礁',
    badland: '泥岩遇水軟化、乾了龜裂,雨水沖出密密麻麻的雨溝;礫岩陡峭、礫石崩落(月世界、火炎山)',
    gorge: '地殼抬升快、溪水往下切 → 深而陡的峽谷(太魯閣);河床石頭隨渦流磨出壺穴(侯硐)',
    misc: '泥火山:地下天然氣沿斷層裂隙帶泥漿冒出(燕巢烏山頂);堰塞湖:山崩擋住河道積水(水漾森林)',
    abroad: '石灰岩溶蝕成峰林(越南下龍灣);冰河刨出 U 形谷、海水灌入成峽灣(紐西蘭);板塊張裂陷落成裂谷(東非大裂谷)'
  };
  function get(key, opt) { var f = F[key]; return f ? f(opt) : ''; }
  function fig(key, opt) {
    var s = get(key, opt); if (!s) return '';
    var ck = key + (opt && opt.hl ? ':' + opt.hl : '');
    return '<figure class="lfd nomask" data-lf="' + ck + '">' + s + '<figcaption>🖼 ' + (CAP[ck] || CAP[key] || '') + '</figcaption></figure>';
  }

  try {
    var D1 = ':root:not([data-theme="light"])', D2 = ':root[data-theme="dark"]';
    var dark = function (sel) {
      var r = '.lf .bg{fill:#14202b}.lf .bg2{fill:#1b2a38;stroke:#3b4b5c}.lf .sea{fill:#173a57}.lf .deep{fill:#0f2a42}.lf .lag,.lf .water{fill:#1f5578}' +
        '.lf .land{fill:#2f3f2a;stroke:#56684c}.lf .rock{fill:#5b4d3d;stroke:#8a7660}.lf .rock2{fill:#4a3f33;stroke:#7a6852}.lf .sand{fill:#7a6530;stroke:#a68c45}.lf .sandl{stroke:#a68c45}' +
        '.lf .coral{fill:#8f4255;stroke:#c06a80}.lf .mud{fill:#5c5853;stroke:#8b8378}.lf .cong{fill:#6b4a35;stroke:#9a7356}.lf .marble{fill:#4c5560;stroke:#77818c}.lf .lime{fill:#566056;stroke:#7d877c}' +
        '.lf .bas{fill:#3f4650;stroke:#8a939e}.lf .peb{fill:#a8957c}.lf .smk{fill:#64748b}.lf text{fill:#e2e8f0;stroke:#0f172a}.lf .s{fill:#cbd5e1}.lf .k{fill:#fcd34d}.lf .rd{fill:#fca5a5}' +
        '.lf .ar{stroke:#cbd5e1}.lf .ah{fill:#cbd5e1}.lf .a-w{stroke:#c4b5fd}.lf .h-w{fill:#c4b5fd}.lf .a-b{stroke:#93c5fd}.lf .h-b{fill:#93c5fd}.lf .a-r{stroke:#fca5a5}.lf .h-r{fill:#fca5a5}.lf .wv,.lf .rain{stroke:#93c5fd}.lf text.hl{stroke:#0f172a!important}';
      return r.replace(/\.lf /g, sel + ' .lf ');
    };
    var css = document.createElement('style');
    css.textContent =
      '.lfd{margin:8px 0 2px;padding:0}.lfd svg{width:100%;max-width:440px;height:auto;display:block;margin:0 auto}' +
      '.lfd figcaption{font-size:.74rem;color:var(--sub,#64748b);text-align:center;margin-top:3px;line-height:1.5}' +
      '.mk-on .lfd:not(.show) text,.mk-on .lfd:not(.show) figcaption{opacity:0}.mk-on .lfd:not(.show){cursor:pointer}' +
      '.lf .bg{fill:#f5f8fb}.lf .bg2{fill:#f8fafc;stroke:#cbd5e1}.lf .sea{fill:#cfe7fa}.lf .deep{fill:#a8d2f2}.lf .lag{fill:#e2f4fd;stroke:#93c5fd;stroke-width:.8}.lf .water{fill:#9cc9f0}' +
      '.lf .land{fill:#dcebc9;stroke:#97a882;stroke-width:1}.lf .rock{fill:#d8c8ac;stroke:#8f7c5f;stroke-width:1}.lf .rock2{fill:#c4b293;stroke:#8f7c5f;stroke-width:1}' +
      '.lf .sand{fill:#f6e2a2;stroke:#cfae55;stroke-width:.8}.lf .sandl{fill:none;stroke:#e9c766;stroke-width:6;stroke-linecap:round}.lf .coral{fill:#f8b3c1;stroke:#d9667e;stroke-width:.9}' +
      '.lf .mud{fill:#cbc5bc;stroke:#8b8378;stroke-width:1}.lf .cong{fill:#c9a98c;stroke:#8f6b4e;stroke-width:1}.lf .marble{fill:#d5d9df;stroke:#8b939e;stroke-width:1}.lf .lime{fill:#cfd6c8;stroke:#8a9584;stroke-width:1}' +
      '.lf .magma{fill:#f97316}.lf .lava{fill:none;stroke:#dc2626;stroke-width:5;stroke-linecap:round}.lf .smk{fill:#94a3b8;opacity:.7}.lf .bas{fill:#6b7280;stroke:#d1d5db;stroke-width:.8}' +
      '.lf .peb{fill:#8b7355}.lf .bub{fill:none;stroke:#78716c;stroke-width:1}.lf .vein{fill:none;stroke:#aab2bd;stroke-width:1;stroke-dasharray:6 4}' +
      '.lf .riv{fill:none;stroke:#3b82f6;stroke-width:2.4;stroke-linecap:round}.lf .wv{fill:none;stroke:#3b82f6;stroke-width:1.2;stroke-linecap:round;opacity:.8}' +
      '.lf .rain{stroke:#60a5fa;stroke-width:1.3;stroke-linecap:round}.lf .dot{fill:none;stroke:#b45309;stroke-width:1.3;stroke-dasharray:2 3}.lf .none{fill:none}' +
      '.lf .dash{fill:none;stroke:#dc2626;stroke-width:1.5;stroke-dasharray:5 3}.lf .sep{stroke:#cbd5e1;stroke-width:1;stroke-dasharray:3 3}' +
      '.lf .ar{fill:none;stroke:#475569;stroke-width:1.8;stroke-linecap:round}.lf .ah{fill:#475569}.lf .a-w{stroke:#7c3aed}.lf .h-w{fill:#7c3aed}.lf .a-b{stroke:#2563eb}.lf .h-b{fill:#2563eb}.lf .a-r{stroke:#dc2626}.lf .h-r{fill:#dc2626}' +
      '.lf .hl{stroke:#e11d48!important;stroke-width:2.2!important}' +
      '.lf text{font-size:11.2px;font-weight:700;fill:#1f2937;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}' +
      '.lf .k{fill:#9a3412;font-weight:900}.lf .s{font-size:10px;font-weight:600;fill:#475569}.lf .rd{fill:#b91c1c;font-size:10px}.lf text.hl{fill:#e11d48;stroke:#fff!important;stroke-width:3px!important}' +
      '@media (prefers-color-scheme:dark){' + dark(D1) + '}' + dark(D2);
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  /* 遮住重點時:點圖顯示圖上文字 */
  if (typeof document !== 'undefined') document.addEventListener('click', function (e) {
    var f = e.target.closest && e.target.closest('.mk-on .lfd');
    if (f) f.classList.toggle('show');
  });
  window.LFIG = { svg: get, fig: fig, keys: Object.keys(F) };
})();
