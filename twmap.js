/* twmap.js — 臺灣位置示意地圖(離線 SVG,單一來源)· v139
   ------------------------------------------------------------------
   TWMAP.svg(opt) → SVG 字串
     opt.marks : [{ k:'地名或鍵', n?:編號, row?:'r-np-0'(點了跳到圖鑑那一列), c?:'np'|'nsa'|'pt', label?:'自訂標籤', side?:'r'|'l'|'u'|'d' }]
     opt.labels: true = 標記旁直接寫地名(解析用,點數少);false = 只顯示編號(圖鑑全圖,另附圖例)
     opt.title : 圖下方小字
   TWMAP.get(k)  查地名 → { k, lat, lon, c, inset? }(可用全名、簡稱:墾丁 / 墾丁國家公園)
   TWMAP.legend(marks) → 圖例 HTML(編號 + 名稱,可點)
   座標為公開地理位置的近似值;海岸線為簡化示意,不作測量用途。
   金門、馬祖、東沙在左側小框內(不按真實距離)。
   變更履歷:
     v139 (2026-10-08) 地名庫加入二水、烏山頭水庫、箔子寮、苑裡、通霄、壽豐、成功,領隊 112 觀光資源解析用
     v138 (2026-10-07) 地名庫加入七美、吉貝(澎湖石滬)、天祥、富世(太魯閣),領隊 113 觀光資源解析用
     v136 (2026-10-07) 地名庫加入明鄭屯田地名(前鎮、柳營、下營、後勁),領隊 115 觀光資源解析用
     v135 (2026-10-07) 地名庫加入導遊 115 觀光資源解析用的 60 處地點
     v134 (2026-10-06) 初版:本島與離島輪廓、國家公園、國家風景區、常考地名、五大山脈;標籤自動避讓
                       山脈改成可多段(雪山山脈加西南餘脈到獅頭山),中央山脈北段貼近梨山、合歡山
*/
(function () {
  'use strict';
  /* ---- 本島海岸線(順時針,緯度, 經度)---- */
  var COAST = [
    [25.298, 121.535], [25.29, 121.57], [25.23, 121.64], [25.21, 121.69], [25.15, 121.75], [25.14, 121.80], [25.13, 121.92],
    [25.007, 122.003], [24.95, 121.92], [24.86, 121.83], [24.75, 121.84], [24.59, 121.87], [24.52, 121.84], [24.46, 121.80],
    [24.30, 121.76], [24.21, 121.68], [24.13, 121.65], [23.98, 121.62], [23.88, 121.58], [23.60, 121.52], [23.49, 121.51],
    [23.32, 121.45], [23.10, 121.38], [22.97, 121.29], [22.87, 121.23], [22.75, 121.15], [22.69, 121.06], [22.61, 121.01],
    [22.53, 120.97], [22.34, 120.90], [22.27, 120.88], [22.20, 120.88], [22.07, 120.88], [21.99, 120.85], [21.902, 120.853],
    [21.93, 120.80], [21.95, 120.76], [21.917, 120.736], [21.99, 120.70], [22.08, 120.71], [22.19, 120.68], [22.26, 120.65],
    [22.37, 120.59], [22.41, 120.53], [22.46, 120.45], [22.50, 120.39], [22.55, 120.32], [22.61, 120.27], [22.70, 120.25],
    [22.76, 120.24], [22.82, 120.21], [22.90, 120.18], [23.00, 120.15], [23.06, 120.10], [23.13, 120.05], [23.20, 120.09],
    [23.27, 120.11], [23.38, 120.14], [23.46, 120.15], [23.58, 120.15], [23.70, 120.19], [23.79, 120.20], [23.86, 120.27],
    [23.93, 120.32], [23.97, 120.33], [24.06, 120.42], [24.13, 120.44], [24.17, 120.47], [24.29, 120.51], [24.38, 120.58],
    [24.44, 120.63], [24.49, 120.67], [24.56, 120.71], [24.62, 120.76], [24.70, 120.84], [24.77, 120.91], [24.85, 120.92],
    [24.91, 120.97], [24.98, 121.02], [25.04, 121.08], [25.09, 121.20], [25.12, 121.32], [25.15, 121.40], [25.18, 121.41],
    [25.26, 121.50]
  ];
  /* 本島周邊小島:[緯度, 經度, 半徑(度)] */
  var ISLETS = [[24.843, 121.951, .025], [22.66, 121.49, .035], [22.05, 121.55, .045], [22.34, 120.37, .03]];
  /* 澎湖群島(示意多邊形) */
  var PENGHU = [[23.72, 119.55], [23.70, 119.62], [23.62, 119.66], [23.55, 119.68], [23.53, 119.62], [23.56, 119.55], [23.60, 119.50], [23.66, 119.48]];
  var PENGHU_S = [[23.35, 119.50, .03], [23.26, 119.67, .02], [23.25, 119.61, .015], [23.21, 119.43, .02]];
  /* 離島小框:金門、馬祖、東沙(各自的經緯範圍 → 框內座標) */
  var INSETS = {
    matsu: { t: '馬祖', box: [6, 6, 84, 60], lat: [25.92, 26.42], lon: [119.86, 120.54],
      isl: [[26.155, 119.93, .035], [26.22, 120.00, .03], [26.37, 120.49, .025], [25.97, 119.94, .025]] },
    kinmen: { t: '金門', box: [6, 72, 84, 60], lat: [24.36, 24.54], lon: [118.20, 118.50],
      poly: [[24.47, 118.27], [24.50, 118.31], [24.49, 118.40], [24.52, 118.44], [24.47, 118.48], [24.42, 118.45], [24.40, 118.38], [24.43, 118.32], [24.41, 118.29]],
      isl: [[24.43, 118.235, .02]] },
    dongsha: { t: '東沙', box: [6, 296, 70, 58], lat: [20.58, 20.82], lon: [116.66, 116.96], ring: [20.70, 116.81, .085], isl: [[20.70, 116.72, .012]] }
  };
  var LON0 = 119.25, LAT0 = 25.35, K = 100, COS = Math.cos(23.6 * Math.PI / 180), PX = 8, PY = 8;
  var W = Math.round((122.1 - LON0) * COS * K + PX * 2), H = Math.round((LAT0 - 21.85) * K + PY * 2);
  function xy(lat, lon) { return [(lon - LON0) * COS * K + PX, (LAT0 - lat) * K + PY]; }
  function ixy(ins, lat, lon) {
    var b = ins.box, sx = (b[2] - 8) / ((ins.lon[1] - ins.lon[0]) * COS), sy = (b[3] - 16) / (ins.lat[1] - ins.lat[0]), s = Math.min(sx, sy);
    return [b[0] + 4 + (lon - ins.lon[0]) * COS * s, b[1] + 12 + (ins.lat[1] - lat) * s];
  }
  function iscale(ins) { var b = ins.box; return Math.min((b[2] - 8) / ((ins.lon[1] - ins.lon[0]) * COS), (b[3] - 16) / (ins.lat[1] - ins.lat[0])); }
  function path(pts, f) { return 'M' + pts.map(function (p) { var q = f(p[0], p[1]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join('L') + 'Z'; }

  /* ---- 地名庫 c: np 國家公園 / nsa 國家風景區 / pt 一般地點;inset 表示畫在小框 ---- */
  var P = {};
  function add(c, k, lat, lon, alias, inset) { P[k] = { k: k, lat: lat, lon: lon, c: c, inset: inset || '' }; (alias || []).forEach(function (a) { P[a] = P[k]; }); }
  add('np', '墾丁國家公園', 21.96, 120.80, ['墾丁']);
  add('np', '玉山國家公園', 23.47, 120.96, []);
  add('np', '陽明山國家公園', 25.17, 121.56, ['陽明山']);
  add('np', '太魯閣國家公園', 24.17, 121.49, []);
  add('np', '雪霸國家公園', 24.41, 121.22, ['雪霸']);
  add('np', '金門國家公園', 24.45, 118.37, [], 'kinmen');
  add('np', '東沙環礁國家公園', 20.70, 116.81, ['東沙環礁'], 'dongsha');
  add('np', '台江國家公園', 23.06, 120.08, ['台江', '臺江國家公園', '臺江']);
  add('np', '澎湖南方四島國家公園', 23.25, 119.59, ['澎湖南方四島', '南方四島']);
  add('np', '壽山國家自然公園', 22.65, 120.27, ['壽山']);
  add('nsa', '東北角暨宜蘭海岸國家風景區', 24.96, 121.90, ['東北角暨宜蘭海岸', '東北角及宜蘭海岸', '東北角']);
  add('nsa', '北海岸及觀音山國家風景區', 25.24, 121.60, ['北海岸及觀音山', '北海岸']);
  add('pt', '觀音山', 25.12, 121.42, []);
  add('nsa', '參山國家風景區', 24.25, 121.25, ['參山']);
  add('pt', '獅頭山', 24.64, 120.99, ['獅頭山風景區']);
  add('pt', '梨山', 24.25, 121.25, ['梨山風景區']);
  add('pt', '八卦山', 24.07, 120.56, ['八卦山風景區']);
  add('nsa', '日月潭國家風景區', 23.86, 120.91, ['日月潭']);
  add('nsa', '阿里山國家風景區', 23.51, 120.80, ['阿里山']);
  add('nsa', '雲嘉南濱海國家風景區', 23.30, 120.10, ['雲嘉南濱海', '雲嘉南']);
  add('nsa', '西拉雅國家風景區', 23.25, 120.45, ['西拉雅']);
  add('nsa', '茂林國家風景區', 22.90, 120.66, ['茂林']);
  add('nsa', '大鵬灣國家風景區', 22.44, 120.47, ['大鵬灣']);
  add('nsa', '東部海岸國家風景區', 23.35, 121.47, ['東部海岸']);
  add('nsa', '花東縱谷國家風景區', 23.40, 121.30, ['花東縱谷']);
  add('nsa', '澎湖國家風景區', 23.57, 119.58, ['澎湖']);
  add('nsa', '馬祖國家風景區', 26.16, 119.95, ['馬祖'], 'matsu');
  [['三貂角', 25.007, 122.003], ['富貴角', 25.298, 121.535], ['鵝鑾鼻', 21.902, 120.853], ['國聖港燈塔', 23.10, 120.03], ['貓鼻頭', 21.917, 120.736], ['龜山島', 24.843, 121.951],
   ['綠島', 22.66, 121.49], ['蘭嶼', 22.05, 121.55], ['小琉球', 22.34, 120.37], ['臺北', 25.04, 121.56], ['基隆', 25.13, 121.74], ['新竹', 24.80, 120.97],
   ['臺中', 24.15, 120.67], ['嘉義', 23.48, 120.45], ['臺南', 22.99, 120.21], ['高雄', 22.63, 120.30], ['屏東', 22.67, 120.49], ['恆春', 22.00, 120.74],
   ['宜蘭', 24.75, 121.75], ['花蓮', 23.99, 121.60], ['臺東', 22.76, 121.14], ['淡水', 25.17, 121.44], ['鹿港', 24.06, 120.43], ['玉山', 23.47, 120.957],
   ['雪山', 24.383, 121.232], ['合歡山', 24.14, 121.27], ['太魯閣峽谷', 24.16, 121.62], ['清水斷崖', 24.21, 121.68], ['野柳', 25.21, 121.69],
   ['九份', 25.11, 121.84], ['平溪', 25.02, 121.74], ['草嶺古道', 24.99, 121.91], ['三仙台', 23.12, 121.42], ['七股', 23.15, 120.07],
   ['安平', 23.00, 120.16], ['鹽水', 23.32, 120.27], ['北港', 23.57, 120.30], ['大甲', 24.35, 120.62], ['東港', 22.46, 120.45], ['霧社', 24.03, 121.13]
  ].forEach(function (a) { add('pt', a[0], a[1], a[2], []); });
  add('pt', '金門', 24.45, 118.37, [], 'kinmen');
  /* v135 解析用地名(導遊 115 觀光資源) */
  [['谷關', 24.204, 121.008], ['德基', 24.256, 121.167], ['基隆嶼', 25.191, 121.784], ['望安', 23.37, 119.50], ['小野柳', 22.79, 121.195],
   ['苗栗', 24.56, 120.82], ['七家灣溪', 24.36, 121.30], ['古坑', 23.64, 120.56], ['東勢', 24.26, 120.83], ['旗山', 22.89, 120.48],
   ['火炎山', 24.38, 120.72], ['月世界', 22.86, 120.38], ['利吉', 22.81, 121.15], ['九份二山', 23.95, 120.84], ['九九峰', 24.02, 120.75],
   ['關子嶺', 23.34, 120.50], ['和平島', 25.16, 121.765], ['瑞穗', 23.50, 121.37], ['金山', 25.22, 121.64], ['蘇澳', 24.59, 121.86],
   ['梧棲', 24.25, 120.53], ['卑南遺址', 22.79, 121.12], ['十三行遺址', 25.157, 121.394], ['芝山岩遺址', 25.10, 121.53], ['牛罵頭遺址', 24.27, 120.58],
   ['林鳳營', 23.24, 120.32], ['新營', 23.31, 120.32], ['左營', 22.68, 120.29], ['五結', 24.68, 121.79], ['六張犁', 25.02, 121.55],
   ['民雄', 23.55, 120.43], ['彰化', 24.08, 120.54], ['卑南', 22.78, 121.08], ['麻豆', 23.18, 120.25], ['觀音', 25.03, 121.08],
   ['虎尾', 23.71, 120.43], ['善化', 23.13, 120.30], ['橋仔頭', 22.76, 120.31], ['光復', 23.67, 121.42], ['萬金', 22.61, 120.60],
   ['北投', 25.14, 121.50], ['四重溪', 22.09, 120.75], ['泰安溫泉', 24.46, 120.98], ['鳳林', 23.74, 121.45], ['南庄', 24.60, 120.99],
   ['大林', 23.60, 120.47], ['竹田', 22.58, 120.54], ['三義', 24.41, 120.77], ['潮州', 22.55, 120.54], ['三星', 24.67, 121.65],
   ['鹿野', 22.91, 121.13], ['艋舺', 25.036, 121.50], ['鳳山', 22.63, 120.36], ['牡丹', 22.13, 120.78], ['車城', 22.07, 120.71],
   ['新市', 23.08, 120.29], ['億載金城', 22.98, 120.16]
  ].forEach(function (a) { add('pt', a[0], a[1], a[2], []); });
  [['前鎮', 22.59, 120.31], ['柳營', 23.28, 120.31], ['下營', 23.23, 120.26], ['後勁', 22.72, 120.31]
  ].forEach(function (a) { add('pt', a[0], a[1], a[2], []); });
  /* v138 領隊 113 觀光資源用:澎湖石滬、太魯閣 */
  [['七美', 23.21, 119.43], ['吉貝', 23.73, 119.61], ['天祥', 24.18, 121.49], ['富世', 24.15, 121.62]
  ].forEach(function (a) { add('pt', a[0], a[1], a[2], []); });
  /* v139 領隊 112 觀光資源用:水圳、苗栗沿海、東部糖廠、漁港 */
  [['二水', 23.81, 120.62], ['烏山頭水庫', 23.2, 120.4], ['箔子寮', 23.64, 120.15], ['苑裡', 24.44, 120.65], ['通霄', 24.49, 120.68],
    ['壽豐', 23.87, 121.51], ['成功', 23.1, 121.38]
  ].forEach(function (a) { add('pt', a[0], a[1], a[2], []); });
  [['秀姑巒山', 23.497, 121.057], ['南湖大山', 24.361, 121.439], ['北大武山', 22.627, 120.761], ['大霸尖山', 24.460, 121.260]
  ].forEach(function (a) { add('pt', a[0], a[1], a[2], []); });
  add('pt', '東引', 26.37, 120.49, [], 'matsu');
  add('pt', '南竿', 26.155, 119.93, [], 'matsu');
  P['滬尾'] = P['淡水']; P['打狗'] = P['高雄']; P['舞鶴台地'] = P['瑞穗']; P['大稻埕'] = P['臺北'];
  P['三貂角燈塔'] = P['三貂角']; P['富貴角燈塔'] = P['富貴角']; P['鵝鑾鼻燈塔'] = P['鵝鑾鼻']; P['國聖燈塔'] = P['國聖港燈塔'];
  /* 五大山脈(示意走向) */
  /* 山脈編號徽章位置(避開彼此):[緯度, 經度, 編號] */
  var RLAB = { '中央山脈': [22.90, 120.85, '1'], '雪山山脈': [24.80, 121.60, '2'], '玉山山脈': [23.30, 120.89, '3'], '阿里山山脈': [23.50, 120.72, '4'], '海岸山脈': [23.30, 121.35, '5'] };
  /* 每條山脈可有多段:[主脈, 支脈…](示意走向,不作測量用途) */
  var RANGES = {
    '中央山脈': [[[24.58, 121.82], [24.36, 121.44], [24.24, 121.29], [24.10, 121.28], [23.85, 121.20], [23.50, 121.06], [23.20, 120.95], [22.90, 120.85], [22.60, 120.80], [22.30, 120.78], [22.02, 120.82]]],
    '雪山山脈': [[[25.00, 121.92], [24.85, 121.70], [24.66, 121.45], [24.46, 121.26], [24.38, 121.23], [24.20, 121.08], [23.98, 120.97]],
      /* 往西南延伸的餘脈(加里山一帶 → 獅頭山) */
      [[24.50, 121.25], [24.56, 121.12], [24.61, 121.02], [24.65, 120.98]]],
    '玉山山脈': [[[23.75, 121.00], [23.47, 120.96], [23.20, 120.85], [23.00, 120.75]]],
    '阿里山山脈': [[[23.80, 120.70], [23.50, 120.72], [23.25, 120.62], [23.00, 120.52]]],
    '海岸山脈': [[[23.95, 121.55], [23.60, 121.42], [23.30, 121.35], [23.00, 121.25], [22.80, 121.18]]]
  };

  function tw(s) { var w = 2; for (var i = 0; i < s.length; i++) w += /[\u0000-\u00ff]/.test(s[i]) ? 6.5 : 11; return w; }
  function get(k) { k = String(k || '').trim(); return P[k] || P[k.replace(/(國家風景區|國家公園|國家自然公園)$/, '')] || null; }
  var COL = { np: '#16a34a', nsa: '#ea580c', pt: '#dc2626' };

  function svg(opt) {
    opt = opt || {};
    var marks = (opt.marks || []).map(function (m) { var p = get(m.k); return p ? { p: p, m: m } : null; }).filter(Boolean);
    var o = '<svg class="twm" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (opt.title || '臺灣位置示意圖') + '">';
    o += '<rect class="sea" x="0" y="0" width="' + W + '" height="' + H + '" rx="10"/>';
    o += '<path class="land" d="' + path(COAST, xy) + '"/>';
    o += '<path class="land" d="' + path(PENGHU, xy) + '"/>';
    ISLETS.concat(PENGHU_S).forEach(function (s) { var q = xy(s[0], s[1]); o += '<circle class="land" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + Math.max(1.6, s[2] * K).toFixed(1) + '"/>'; });
    Object.keys(INSETS).forEach(function (id) {
      var ins = INSETS[id], b = ins.box, s = iscale(ins), f = function (la, lo) { return ixy(ins, la, lo); };
      o += '<rect class="ib" x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" rx="6"/>';
      o += '<text class="cap" x="' + (b[0] + 5) + '" y="' + (b[1] + 10) + '">' + ins.t + '</text>';
      if (ins.poly) o += '<path class="land" d="' + path(ins.poly, f) + '"/>';
      if (ins.ring) { var c = f(ins.ring[0], ins.ring[1]); o += '<circle class="reef" cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + (ins.ring[2] * s).toFixed(1) + '"/>'; }
      (ins.isl || []).forEach(function (t) { var q = f(t[0], t[1]); o += '<circle class="land" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + Math.max(1.8, t[2] * s).toFixed(1) + '"/>'; });
    });
    /* 山脈(opt.ranges: true = 全部,或名稱陣列) */
    var taken = Object.keys(INSETS).map(function (id) { var b = INSETS[id].box; return [b[0], b[1], b[0] + b[2], b[1] + b[3]]; });
    if (opt.ranges) {
      var rn = opt.ranges === true ? Object.keys(RANGES) : opt.ranges;
      rn.forEach(function (name) {
        (RANGES[name] || []).forEach(function (seg, si) {
          o += '<polyline class="rg' + (si ? ' rgs' : '') + '" points="' + seg.map(function (a) { var q = xy(a[0], a[1]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ') + '"/>';
        });
      });
      rn.forEach(function (name) {
        var r = RLAB[name]; if (!r) return;
        var q = xy(r[0], r[1]);
        o += '<circle class="rgb" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="6"/><text class="num" x="' + q[0].toFixed(1) + '" y="' + (q[1] + 3).toFixed(1) + '" text-anchor="middle">' + r[2] + '</text>';
        taken.push([q[0] - 7, q[1] - 7, q[0] + 7, q[1] + 7]);
      });
    }
    var pos = marks.map(function (x) { var p = x.p; return p.inset ? ixy(INSETS[p.inset], p.lat, p.lon) : xy(p.lat, p.lon); });
    pos.forEach(function (q) { taken.push([q[0] - 7, q[1] - 7, q[0] + 7, q[1] + 7]); });
    marks.forEach(function (x, i) {
      var p = x.p, m = x.m, q = pos[i], col = COL[m.c || p.c] || COL.pt;
      var n = m.n != null ? String(m.n) : '', lbl = m.label || (opt.labels ? p.k.replace(/(國家風景區|國家公園|國家自然公園)$/, '') : '');
      o += '<g class="mk"' + (m.row ? ' data-row="' + m.row + '" style="cursor:pointer"' : '') + '>';
      o += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (n ? 6.5 : 4) + '" fill="' + col + '" stroke="#fff" stroke-width="1.4"/>';
      if (n) o += '<text class="num" x="' + q[0].toFixed(1) + '" y="' + (q[1] + 3).toFixed(1) + '" text-anchor="middle">' + n + '</text>';
      if (lbl) {
        var w = tw(lbl), h = 12, cand = [[q[0] + 9, q[1] - 6], [q[0] - 9 - w, q[1] - 6], [q[0] - w / 2, q[1] - 20], [q[0] - w / 2, q[1] + 8],
          [q[0] + 9, q[1] - 17], [q[0] + 9, q[1] + 5], [q[0] - 9 - w, q[1] - 17], [q[0] - 9 - w, q[1] + 5], [q[0] - w / 2, q[1] - 32], [q[0] - w / 2, q[1] + 20]];
        /* 指定優先方向(解析作者用 side:'r' 右 / 'l' 左 / 'u' 上 / 'd' 下),其餘照預設順序 */
        var SIDE = { r: [0, 4, 5], l: [1, 6, 7], u: [2, 8], d: [3, 9] };
        if (m.side && SIDE[m.side]) cand = SIDE[m.side].map(function (j) { return cand[j]; }).concat(cand.filter(function (c, j) { return SIDE[m.side].indexOf(j) < 0; }));
        var pick = null;
        for (var ci = 0; ci < cand.length && !pick; ci++) {
          var bb = [cand[ci][0], cand[ci][1], cand[ci][0] + w, cand[ci][1] + h];
          if (bb[0] < 2 || bb[1] < 2 || bb[2] > W - 2 || bb[3] > H - 2) continue;
          if (taken.some(function (t) { return !(bb[2] < t[0] || t[2] < bb[0] || bb[3] < t[1] || t[3] < bb[1]); })) continue;
          pick = bb;
        }
        if (!pick) pick = [Math.min(Math.max(2, q[0] + 9), W - 2 - w), q[1] - 6, 0, 0];
        taken.push([pick[0], pick[1], pick[0] + w, pick[1] + h]);
        o += '<text class="lbl" x="' + pick[0].toFixed(1) + '" y="' + (pick[1] + 9.5).toFixed(1) + '">' + lbl + '</text>';
      }
      o += '</g>';
    });
    o += '</svg>';
    return o;
  }
  function legend(marks) {
    return '<div class="twm-lg">' + (marks || []).map(function (m) {
      var p = get(m.k); if (!p) return '';
      return '<button type="button" class="twm-li"' + (m.row ? ' data-row="' + m.row + '"' : '') + '><span class="d" style="background:' + (COL[m.c || p.c] || COL.pt) + '">' + (m.n != null ? m.n : '') + '</span>' + (m.label || p.k.replace(/(國家風景區|國家公園|國家自然公園)$/, '')) + '</button>';
    }).join('') + '</div>';
  }
  try {
    var css = document.createElement('style');
    css.textContent =
      '.twm{width:100%;max-width:420px;height:auto;display:block;margin:0 auto}' +
      '.twm .sea{fill:#e6f2fb}.twm .land{fill:#f4f1e4;stroke:#9aa8b8;stroke-width:.8}.twm .reef{fill:none;stroke:#7fb3d5;stroke-width:2}' +
      '.twm .ib{fill:#eef6fc;stroke:#9aa8b8;stroke-dasharray:3 2}' +
      '.twm .lbl{font-size:10px;font-weight:700;fill:#1e293b;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}' +
      '.twm .num{font-size:8.5px;font-weight:800;fill:#fff;pointer-events:none}.twm .cap{font-size:8.5px;fill:#64748b}' +
      '.twm .rg{fill:none;stroke:#a16207;stroke-width:2.2;stroke-dasharray:5 3;stroke-linecap:round;opacity:.85}.twm .rgb{fill:#a16207;stroke:#fff;stroke-width:1.2}' +
      '.twm .rgs{stroke-width:1.6}' +
      '.twm-nt{font-size:.74rem;color:var(--sub,#64748b);text-align:center;margin-top:2px}' +
      '.twm-lg{display:flex;flex-wrap:wrap;gap:4px 6px;justify-content:center;margin:6px 0 2px}' +
      '.twm-li{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--line,#d8dee9);background:var(--card,#fff);color:var(--ink,#1c2330);border-radius:999px;padding:2px 9px 2px 3px;font-size:.78rem;font-weight:700;font-family:inherit;cursor:pointer}' +
      '.twm-li .d{display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;border-radius:50%;color:#fff;font-size:.68rem}' +
      '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .twm .sea{fill:#0f2233}:root:not([data-theme="light"]) .twm .land{fill:#2b3326;stroke:#5b6b7c}' +
      ':root:not([data-theme="light"]) .twm .ib{fill:#132a3d;stroke:#5b6b7c}:root:not([data-theme="light"]) .twm .lbl{fill:#e2e8f0;stroke:#0f172a}}' +
      ':root[data-theme="dark"] .twm .sea{fill:#0f2233}:root[data-theme="dark"] .twm .land{fill:#2b3326;stroke:#5b6b7c}' +
      ':root[data-theme="dark"] .twm .ib{fill:#132a3d;stroke:#5b6b7c}:root[data-theme="dark"] .twm .lbl{fill:#e2e8f0;stroke:#0f172a}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  var RLEG = '<div class="twm-lg">' + ['中央山脈', '雪山山脈', '玉山山脈', '阿里山山脈', '海岸山脈'].map(function (n, i) { return '<span class="twm-li"><span class="d" style="background:#a16207">' + (i + 1) + '</span>' + n + '</span>'; }).join('') + '</div><div class="twm-nt">咖啡色虛線＝山脈大致走向</div>';
  var NOTE = '<div class="twm-nt">示意圖 · 金門、馬祖、東沙放在左側小框,不按實際距離</div>';
  window.TWMAP = { svg: svg, get: get, legend: legend, note: NOTE, rangeLegend: RLEG, W: W, H: H };
})();
