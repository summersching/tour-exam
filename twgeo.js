/* twgeo.js — 臺灣地理總圖(離線 SVG:縣市、河川、山脈、地名、四極、海岸類型)· v149
   ------------------------------------------------------------------
   資料:twgeo_data.js(縣市界線依內政部國土測繪中心開放資料;河川、山脈為示意走向,出處見該檔檔頭)
   TWGEO.widget(id, cfg) → HTML(放進頁面即可;切換分區、圖層、點選說明都由本檔處理)
     cfg.layers : { cty, rv, mt, pt, pole, coast, mk } 1 = 預設開、0 = 可開關但預設關;沒列 = 不提供
     cfg.marks  : [{ n 名稱, p:[經度,緯度], c 顏色, s 'dot'|'star'|'tri'|'sq', lab 標籤, alt 放不下時的短標籤, pr / prAll 標籤擺放順序(數字小先擺;prAll 只用在全臺圖), d 說明, z 0 全臺圖就顯示 / 1 分區圖才顯示 }]
     cfg.legend : 圖例 HTML(可省略)
     cfg.view   : 預設分區(all / n / c / s / k …,可省略)
     cfg.pkAll  : true = 全臺圖也標出所有高峰;cfg.mkName:「標示」圖層按鈕名稱;cfg.hint:點選前的提示
     cfg.rgPr   : 山脈名稱的擺放順序(預設 5;山脈區設小一點,先於縣市名稱擺放)
     cfg.arrows : [{ k: 'w' 冬 / 's' 夏, p: [[經,緯], …], t: 名稱, at: 名稱位置 0~1 }] 季風等粗箭頭(只畫在全臺圖)
     cfg.texts  : [{ t: 文字, p: [經,緯] }] 區域說明文字(例:副熱帶季風氣候);cfg.tropic:不開四極圖層也畫北回歸線
   TWGEO.focus(id, 鍵) 讓地圖顯示某個項目(鍵:'rv:zhuoshui' 'cty:南投縣' 'pk:玉山' 'pt:野柳' 'mk:名稱')
   頁面上任何 <button data-tgf="鍵" data-tgt="id"> 點了也會捲到地圖並標示該項目。
   變更履歷:
     v149 (2026-10-14) 圖說:釣魚臺列嶼、南海諸島改指向圖鑑「四極與臺灣之最」的位置圖
     v148 (2026-10-14) 阿里山加進山脈圖層(地理總圖也標出);東沙小框放大、礁盤環留兩個水道缺口、東沙島放大繪示;
                       新增 cfg.arrows / cfg.texts / cfg.tropic(氣候區畫東北季風、西南季風與副熱帶 / 熱帶季風氣候)
     v147 (2026-10-14) 東沙改畫成環礁(礁盤環、潟湖、東沙島);小島在全臺圖不再被抽稀到看不見;
                       縣市圖層開著時標出龜山島、綠島、蘭嶼、小琉球;五大山脈旁標出山脈名稱;
                       標籤避讓修正:點的正上方 / 正下方原本會壓到自己的點而永遠放不下,改留間距並加斜角位置;
                       完整標籤放不下時改用短名;離島名稱只在圖上真的已寫出時才省略;東沙島名稱也參與避讓;
                       延遲繪圖的預載距離 200 → 600px(圖鑑導覽多一排後,單區頁面的地圖也能一打開就畫好)
     v143 (2026-10-12) 各區標示點改畫在縣市政府白點之後(位置重疊時不再被蓋住);供「宗教信仰與廟宇」區使用
     v142 (2026-10-12) 初版
*/
(function (root) {
  'use strict';
  var D = root.TWGEO_DATA;
  if (!D) return;
  function dec(s) {
    var i = 0, x = 0, y = 0, out = [];
    while (i < s.length) {
      var v = [0, 0];
      for (var k = 0; k < 2; k++) {
        var r = 0, sh = 0, b;
        do { b = s.charCodeAt(i++) - 63; r |= (b & 31) << sh; sh += 5; } while (b >= 32);
        v[k] = (r & 1) ? ~(r >> 1) : (r >> 1);
      }
      x += v[0]; y += v[1];
      out.push([x / 1e4, y / 1e4]);
    }
    return out;
  }
  var ARCS = D.A.map(dec);
  D.RV.forEach(function (r) { r.pts = dec(r.p); });
  D.RG.forEach(function (g) { g.segs = g.p.map(dec); });
  D.CT.forEach(function (t) { t.pts = dec(t.p); });
  var CBY = {};
  D.C.forEach(function (c) { CBY[c.n] = c; });
  var PTN = {};
  D.PT.forEach(function (p) { PTN[p.n] = p; });
  var ISL = ['龜山島', '綠島', '蘭嶼', '小琉球'];   /* 縣市圖層開著時也標名稱的常考離島 */
  /* 名山景點:不是高峰、但常考的山區(山脈圖層開著時標出,綠色圓點) */
  var MA = [
    { n: '阿里山', p: [120.805, 23.51], z: 0, d: '嘉義縣阿里山鄉,屬<b>阿里山山脈</b>(五大山脈最西邊一條);森林遊樂區:神木、日出、雲海、櫻花;阿里山林業鐵路 1912 年由嘉義通車到二萬坪;鄒族的居住地' }
  ];

  /* ---- 分區(經緯範圍);全臺圖附金門、馬祖、東沙小框 ---- */
  var VIEWS = [
    ['all', '全臺', [119.25, 21.85, 122.10, 25.35]],
    ['n', '北部', [120.78, 24.28, 122.06, 25.36]],
    ['c', '中部', [120.12, 23.45, 121.52, 24.70]],
    ['s', '雲嘉南', [119.95, 22.85, 120.98, 23.92]],
    ['g', '高屏', [120.10, 21.86, 121.00, 23.12]],
    ['h', '花蓮', [120.85, 23.05, 121.90, 24.42]],
    ['t', '臺東', [120.60, 21.88, 121.75, 23.45]],
    ['p', '澎湖', [119.28, 23.16, 119.75, 23.82]],
    ['k', '金門', [118.13, 24.37, 118.50, 24.55]],
    ['z', '馬祖', [119.88, 25.93, 120.54, 26.40]]
  ];
  var VB = {}; VIEWS.forEach(function (v) { VB[v[0]] = v; });
  var INSETS = [
    { g: 'z', t: '馬祖(連江縣)', box: [6, 6, 112, 84], b: [119.88, 25.93, 120.54, 26.40] },
    { g: 'k', t: '金門縣', box: [6, 96, 112, 66], b: [118.13, 24.37, 118.50, 24.55] },
    { g: 'd', t: '東沙環礁(高雄市)', box: [6, 384, 90, 82], b: [116.665, 20.575, 116.995, 20.845] }
  ];
  var W = 360, PAD = 8;
  function proj(b, box) {
    var cos = Math.cos((b[1] + b[3]) / 2 * Math.PI / 180), k, ox, oy, w, h;
    if (box) {
      k = Math.min((box[2] - 8) / ((b[2] - b[0]) * cos), (box[3] - 18) / (b[3] - b[1]));
      w = (b[2] - b[0]) * cos * k; h = (b[3] - b[1]) * k;
      ox = box[0] + (box[2] - w) / 2; oy = box[1] + 14 + (box[3] - 14 - h) / 2;
    } else {
      k = (W - 2 * PAD) / ((b[2] - b[0]) * cos); ox = PAD; oy = PAD; h = (b[3] - b[1]) * k;
    }
    var f = function (p) { return [ox + (p[0] - b[0]) * cos * k, oy + (b[3] - p[1]) * k]; };
    f.k = k; f.H = Math.round(h + 2 * PAD); f.b = b;
    f.inb = function (p, m) { m = m || 0; return p[0] >= b[0] - m && p[0] <= b[2] + m && p[1] >= b[1] - m && p[1] <= b[3] + m; };
    return f;
  }
  function n1(v) { return Math.round(v * 10) / 10; }
  function pts2(q) { return q.map(function (p) { return n1(p[0]) + ',' + n1(p[1]); }).join(' '); }
  /* 弧段投影 + 抽稀(端點保留,共用界線兩側一致) */
  function arcsFor(f, minD) {
    return ARCS.map(function (a) {
      var out = [], last = null;
      for (var i = 0; i < a.length; i++) {
        var q = f(a[i]);
        if (i === 0 || i === a.length - 1 || Math.abs(q[0] - last[0]) + Math.abs(q[1] - last[1]) >= minD) { out.push(q); last = q; }
      }
      /* 小島(整段很短)抽稀後少於 4 點會縮成一條線而看不見:改取均勻分布的 6 點 */
      if (out.length < 4 && a.length >= 4) { out = []; for (var j = 0; j <= 5; j++) out.push(f(a[Math.round(j * (a.length - 1) / 5)])); }
      return out;
    });
  }
  /* 縮短路徑字串:第一點絕對座標,其後相對位移(0.1 單位) */
  function fm(v) { v = Math.round(v * 10) / 10; return (v < 0 ? '-' : '') + String(Math.abs(v)).replace(/^0\./, '.'); }
  function ringPath(r, PA) {
    var d = '', px = 0, py = 0, first = true;
    r.forEach(function (a) {
      var s = a >= 0 ? PA[a] : PA[~a].slice().reverse();
      for (var i = first ? 0 : 1; i < s.length; i++) {
        var x = n1(s[i][0]), y = n1(s[i][1]);
        if (first) { d += 'M' + x + ',' + y + 'l'; first = false; }
        else { var dx = fm(x - px), dy = fm(y - py); d += (d.slice(-1) === 'l' || dx[0] === '-' ? '' : ' ') + dx + (dy[0] === '-' ? '' : ',') + dy; }
        px = x; py = y;
      }
    });
    return d + 'z';
  }
  function thin(pts, f, minD) {
    var out = [], last = null;
    pts.forEach(function (p, i) { var q = f(p); if (!last || i === pts.length - 1 || Math.abs(q[0] - last[0]) + Math.abs(q[1] - last[1]) >= minD) { out.push(q); last = q; } });
    return out;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tw(s, fs) { var w = 2; for (var i = 0; i < s.length; i++) w += /[\u0000-ÿ]/.test(s[i]) ? fs * 0.58 : fs; return w; }

  var RGC = { '北': 'r1', '中': 'r2', '南': 'r3', '東': 'r4', '離': 'r5' };
  var CTC = { cape: '#7c3aed', sand: '#d97706', lsand: '#d97706', fault: '#dc2626', coral: '#db2777' };
  var PTC = { town: '#475569', lake: '#0284c7', coast: '#d97706', land: '#a16207', pole: '#dc2626', tropic: '#16a34a' };
  var TROPIC = 23.45;
  var LAYER_T = { cty: '縣市', rv: '河川', mt: '山脈', pt: '地名', pole: '四極', coast: '海岸類型', mk: '標示' };

  /* 項目鍵 → 說明 */
  function rangeInfo(g) { return '<b>' + esc(g.n) + '</b> ' + esc(g.d) + '<br><span class="tg-k">由西到東</span>阿里山 → 玉山 → 雪山 → 中央 → 海岸山脈'; }
  function infoOf(key, cfg) {
    var t = key.split(':'), k = t[0], n = t.slice(1).join(':');
    if (k === 'cty') {
      var c = CBY[n]; if (!c) return '';
      var nb = c.nb.map(function (i) { return D.C[i].n; }), rv = D.RV.filter(function (r) { return r.cty.indexOf(n) >= 0; }).map(function (r) { return r.n; });
      return '<b>' + esc(n) + '</b>(' + { '北': '北部', '中': '中部', '南': '南部', '東': '東部', '離': '離島' }[c.rg] + ')' + esc(c.d) +
        '<br><span class="tg-k">縣市政府</span>' + esc(c.seat[0]) + (nb.length ? ' <span class="tg-k">相鄰</span>' + esc(nb.join('、')) : '') +
        (rv.length ? '<br><span class="tg-k">河川</span>' + esc(rv.join('、')) : '');
    }
    if (k === 'rv') { var r = D.RV.filter(function (x) { return x.id === n; })[0]; return r ? '<b>' + esc(r.n) + '</b> <span class="tg-k">流經</span>' + esc(r.cty) + '<br>' + esc(r.d) : ''; }
    if (k === 'pk') { var p = D.PK.filter(function (x) { return x.n === n; })[0]; return p ? '<b>▲ ' + esc(p.n) + '</b> ' + p.h.toLocaleString('en-US') + ' 公尺 · ' + esc(p.d) : ''; }
    if (k === 'ma') { var ma = MA.filter(function (x) { return x.n === n; })[0]; return ma ? '<b>' + esc(ma.n) + '</b> ' + ma.d : ''; }
    if (k === 'rg') { var g = D.RG.filter(function (x) { return x.n === n; })[0]; return g ? rangeInfo(g) : ''; }
    if (k === 'ld') { var l = D.LD.filter(function (x) { return x.n === n; })[0]; return l ? '<b>' + esc(l.n) + '</b> ' + esc(l.d) : ''; }
    if (k === 'pt') { var q = D.PT.filter(function (x) { return x.n === n; })[0]; return q ? '<b>' + esc(q.n) + '</b> ' + esc(q.d) : ''; }
    if (k === 'mk') { var m = (cfg.marks || []).filter(function (x) { return x.n === n; })[0]; return m ? '<b>' + esc(m.n) + '</b> ' + (m.d || '') : ''; }
    if (k === 'tr') return '<b>北回歸線</b> 北緯約 23.5 度,太陽在北半球能直射的最北界;臺灣設有標誌的地方:嘉義水上、花蓮瑞穗(舞鶴台地)、花蓮豐濱(靜浦)';
    return '';
  }

  /* ---- 畫一張圖 ---- */
  function render(id) {
    var st = ST[id], cfg = st.cfg, L = st.on, v = VB[st.v] || VB.all, f = proj(v[2]), H = f.H;
    var zmax = st.v === 'all' ? 0 : (v[0] === 'p' || v[0] === 'k' || v[0] === 'z') ? 2 : 1;
    var minD = st.v === 'all' ? 1.1 : 0.6;
    var PA = arcsFor(f, minD);
    var o = '<svg class="tgm" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="臺灣地理總圖 · ' + v[1] + '">';
    o += '<rect class="sea" x="0" y="0" width="' + W + '" height="' + H + '" rx="10"/>';
    var taken = [], labels = [];
    function landGroup(f2, PA2, g) {
      var s = '';
      D.C.forEach(function (c) {
        var d = '';
        c.R.forEach(function (r, i) { if (c.G[i] === g) d += ringPath(r, PA2); });
        if (!d) return;
        var cls = L.cty ? 'cty ' + RGC[c.rg] : 'land';
        s += '<path class="' + cls + (st.hl === 'cty:' + c.n ? ' hi' : '') + '" d="' + d + '" data-f="cty:' + c.n + '"/>';
      });
      return s;
    }
    var gmain = st.v === 'k' ? 'k' : st.v === 'z' ? 'z' : 'm';
    o += landGroup(f, PA, gmain);
    /* 全臺圖:離島小框 */
    if (st.v === 'all') {
      INSETS.forEach(function (ins) {
        var b = ins.box, fi = proj(ins.b, b);
        o += '<rect class="ib" x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" rx="6" data-tgv="' + (ins.g === 'd' ? '' : ins.g) + '"/>';
        o += '<text class="cap" x="' + (b[0] + 5) + '" y="' + (b[1] + 11) + '">' + ins.t + '</text>';
        var PAi = arcsFor(fi, 0.3);
        if (ins.g === 'd') {
          /* 東沙環礁:直徑約 25 公里的圓形礁盤環,中間是潟湖;西側有南、北兩個水道,東沙島在兩水道之間 */
          var rc = fi([116.83, 20.71]), rr = 0.115 * fi.k, gap = 26 * Math.PI / 180;
          var ap = function (t) { return n1(rc[0] + rr * Math.cos(t)) + ',' + n1(rc[1] + rr * Math.sin(t)); };
          o += '<circle class="lagoon" cx="' + n1(rc[0]) + '" cy="' + n1(rc[1]) + '" r="' + n1(rr) + '"/>' +
            '<path class="reef" d="M' + ap(Math.PI + gap) + 'A' + n1(rr) + ',' + n1(rr) + ' 0 1 1 ' + ap(Math.PI - gap) + '"/>';
          /* 東沙島實際約 2.6 × 1.3 公里,小框裡放大 3 倍才看得到形狀 */
          var ic = fi([116.7225, 20.7035]), used = {};
          D.C.forEach(function (c) { c.R.forEach(function (r, i) { if (c.G[i] === 'd') r.forEach(function (a) { used[a >= 0 ? a : ~a] = 1; }); }); });
          PAi = PAi.map(function (a, i) { return used[i] ? a.map(function (q) { return [ic[0] + (q[0] - ic[0]) * 3, ic[1] + (q[1] - ic[1]) * 3]; }) : a; });
        }
        o += landGroup(fi, PAi, ins.g);
        if (ins.g === 'd') labels.push({ pr: 6, t: '東沙島', fs: 8, cls: 'tgl isl', at: fi([116.722, 20.703]), ins: true, key: '' });
        taken.push([b[0], b[1], b[0] + b[2], b[1] + b[3], 'ins']);
        ins.f = fi;
      });
    }
    /* 海岸類型 */
    if (L.coast && gmain === 'm') {
      D.CT.forEach(function (t) { o += '<polyline class="ct" stroke="' + CTC[t.k] + '" points="' + pts2(thin(t.pts, f, minD)) + '"/>'; });
    }
    /* 粗箭頭(季風等):只畫在全臺圖;名稱參與標籤避讓 */
    if (cfg.arrows && st.v === 'all') cfg.arrows.forEach(function (ar) {
      var q = ar.p.map(f), n = q.length, e = q[n - 1], b0 = q[n - 2], ang = Math.atan2(e[1] - b0[1], e[0] - b0[0]), hl = 15, hw = 10;
      var bx = e[0] - Math.cos(ang) * hl, by = e[1] - Math.sin(ang) * hl;
      o += '<g class="tga tga-' + ar.k + '"><polyline class="tgab" points="' + pts2(q.slice(0, n - 1).concat([[bx, by]])) + '"/>' +
        '<path class="tgah" d="M' + n1(e[0]) + ',' + n1(e[1]) + 'L' + n1(bx + Math.sin(ang) * hw) + ',' + n1(by - Math.cos(ang) * hw) + 'L' + n1(bx - Math.sin(ang) * hw) + ',' + n1(by + Math.cos(ang) * hw) + 'Z"/></g>';
      if (ar.t) labels.push({ pr: 2, t: ar.t, fs: 9.5, cls: 'tgl tgal tgal-' + ar.k, at: q[Math.round((ar.at || 0) * (n - 1))], key: '' });
    });
    if (cfg.texts && st.v === 'all') cfg.texts.forEach(function (tx) {
      labels.push({ pr: 3, t: tx.t, fs: 9, cls: 'tgl tgz', at: f(tx.p), center: true, cand: [[0, 0], [0, -10], [0, 10], [-12, 0], [-12, -10], [-12, 10]], key: '' });
    });
    /* 北回歸線 */
    if ((L.pole || cfg.tropic) && gmain === 'm' && TROPIC > v[2][1] && TROPIC < v[2][3]) {
      var a = f([v[2][0], TROPIC]), bb = f([v[2][2], TROPIC]);
      o += '<g data-f="tr:"><line class="trp" x1="' + n1(a[0]) + '" y1="' + n1(a[1]) + '" x2="' + n1(bb[0]) + '" y2="' + n1(bb[1]) + '"/><line class="tgh" x1="' + n1(a[0]) + '" y1="' + n1(a[1]) + '" x2="' + n1(bb[0]) + '" y2="' + n1(bb[1]) + '"/></g>';
      labels.push({ pr: 3, t: '北回歸線', fs: 8.5, cls: 'tgl trl', at: [W - 4, a[1]], cand: [[-1, -11], [-1, 3]], anchorRight: true, key: 'tr:' });
    }
    /* 河川 */
    if (L.rv && gmain === 'm') {
      D.RV.forEach(function (r) {
        var on = st.hl === 'rv:' + r.id, q = thin(r.pts, f, minD), P = pts2(q);
        o += '<g data-f="rv:' + r.id + '"><polyline class="tgr c' + r.c + (on ? ' hi' : '') + '" points="' + P + '"/><polyline class="tgh" points="' + P + '"/></g>';
        if (on || ((zmax > 0 || r.c === 1) && f.inb(r.lp, -0.02))) labels.push({ pr: on ? 0 : 4, t: r.n, fs: 9.5, cls: 'tgl rvl', at: f(r.lp), key: 'rv:' + r.id });
      });
    }
    /* 山脈 + 高峰 */
    if (L.mt && gmain === 'm') {
      D.RG.forEach(function (g) {
        g.segs.forEach(function (s, i) {
          var P = pts2(thin(s, f, minD));
          o += '<g data-f="rg:' + g.n + '"><polyline class="rg' + (i ? ' rgs' : '') + (st.hl === 'rg:' + g.n ? ' hi' : '') + '" points="' + P + '"/><polyline class="tgh" points="' + P + '"/></g>';
        });
        var mid = g.segs[0][Math.floor(g.segs[0].length * ({ 1: 0.4, 2: 0.25, 3: 0.15, 4: 0.85 }[g.no] || 0.5))];   /* 玉山山脈編號放北段、阿里山山脈編號放南段,避開玉山、阿里山一帶 */
        if (f.inb(mid, -0.03)) {
          var q = f(mid);
          o += '<g data-f="rg:' + g.n + '"><circle class="rgb" cx="' + n1(q[0]) + '" cy="' + n1(q[1]) + '" r="6"/><text class="num" x="' + n1(q[0]) + '" y="' + n1(q[1] + 3) + '" text-anchor="middle">' + g.no + '</text></g>';
          taken.push([q[0] - 7, q[1] - 7, q[0] + 7, q[1] + 7]);
          var rw = tw(g.n, 8.5) / 2 + 9;   /* 山脈名稱放在編號旁(左右上下找空位) */
          labels.push({ pr: st.hl === 'rg:' + g.n ? 0 : (cfg.rgPr != null ? cfg.rgPr : 5), t: g.n, fs: 8.5, cls: 'tgl rgl', at: q, center: true, cand: [[rw, 0], [-rw, 0], [0, -13], [0, 13], [rw, -10], [-rw, -10], [rw, 10], [-rw, 10]], key: 'rg:' + g.n });
        }
      });
      D.PK.forEach(function (p) {
        if (p.z > zmax && st.hl !== 'pk:' + p.n && !cfg.pkAll) return;
        if (!f.inb(p.p)) return;
        var q = f(p.p);
        o += '<g data-f="pk:' + p.n + '"><path class="pk' + (st.hl === 'pk:' + p.n ? ' hi' : '') + '" d="M' + n1(q[0]) + ',' + n1(q[1] - 5) + 'l4.5,8h-9z"/></g>';
        taken.push([q[0] - 5, q[1] - 6, q[0] + 5, q[1] + 4]);
        labels.push({ pr: st.hl === 'pk:' + p.n ? 0 : p.z ? 2 : 1, t: p.n + (zmax ? ' ' + p.h.toLocaleString('en-US') : ''), fs: 9.5, cls: 'tgl pkl', at: q, key: 'pk:' + p.n });
      });
      MA.forEach(function (m) {
        if ((m.z > zmax && st.hl !== 'ma:' + m.n) || !f.inb(m.p)) return;
        var q = f(m.p);
        o += '<g data-f="ma:' + m.n + '"' + (st.hl === 'ma:' + m.n ? ' class="hi"' : '') + '><circle class="ma" cx="' + n1(q[0]) + '" cy="' + n1(q[1]) + '" r="3.8"/></g>';
        taken.push([q[0] - 5, q[1] - 5, q[0] + 5, q[1] + 5]);
        labels.push({ pr: st.hl === 'ma:' + m.n ? 0 : 1, t: m.n, fs: 9.5, cls: 'tgl mal', at: q, key: 'ma:' + m.n });
      });
    }
    /* 地形區、地名 */
    if (L.pt) {
      D.LD.forEach(function (l) {
        if ((l.z > zmax && st.hl !== 'ld:' + l.n) || !f.inb(l.p) || gmain !== 'm') return;
        labels.push({ pr: 6, t: l.n, fs: 9.5, cls: 'tgl ldl', at: f(l.p), cand: [[0, 0]], center: true, key: 'ld:' + l.n });
      });
    }
    function ptDraw(p, f2, key, col, sym, lab, pr, fs, alt) {
      var q = f2(p), s = '';
      if (sym === 'star') s = '<path class="tgk" fill="' + col + '" d="' + star(q[0], q[1], 6.2) + '"/>';
      else if (sym === 'tri') s = '<path class="tgk" fill="' + col + '" d="M' + n1(q[0]) + ',' + n1(q[1] - 5) + 'l4.5,8h-9z"/>';
      else if (sym === 'sq') s = '<rect class="tgk" fill="' + col + '" x="' + n1(q[0] - 3.6) + '" y="' + n1(q[1] - 3.6) + '" width="7.2" height="7.2" rx="1.5"/>';
      else if (sym === 'dia') s = '<path class="tgk" fill="' + col + '" d="M' + n1(q[0]) + ',' + n1(q[1] - 4.6) + 'l4.6,4.6l-4.6,4.6l-4.6,-4.6z"/>';
      else s = '<circle class="tgk" fill="' + col + '" cx="' + n1(q[0]) + '" cy="' + n1(q[1]) + '" r="3.6"/>';
      var g = '<g data-f="' + key + '"' + (st.hl === key ? ' class="hi"' : '') + '>' + s + '</g>', box = [q[0] - 5, q[1] - 5, q[0] + 5, q[1] + 5];
      if (alt === lab) alt = null;
      if (lab && pr >= 5 && st.hl !== key) { labels.push({ pr: pr, t: lab, alt: alt, fs: fs || 8.5, cls: 'tgl ptl', at: q, key: key, ins: f2 !== f, dot: g, dbox: box }); return; }
      o += g; taken.push(box);
      if (lab) labels.push({ pr: st.hl === key ? 0 : pr, t: lab, alt: alt, fs: fs || 8.5, cls: 'tgl ptl', at: q, key: key, ins: f2 !== f });
    }
    function where(p) {
      if (gmain !== 'm') return f.inb(p) ? f : null;
      if (f.inb(p)) return f;
      if (st.v === 'all') for (var i = 0; i < INSETS.length; i++) if (INSETS[i].f && INSETS[i].f.inb(p)) return INSETS[i].f;
      return null;
    }
    D.PT.forEach(function (p) {
      var isPole = p.t === 'pole' || p.t === 'tropic';
      if (isPole ? !L.pole : !L.pt) return;
      if (p.z > zmax && st.hl !== 'pt:' + p.n) return;
      if (p.t === 'tropic' && zmax === 0 && st.hl !== 'pt:' + p.n) return;
      var f2 = where(p.p); if (!f2) return;
      ptDraw(p.p, f2, 'pt:' + p.n, PTC[p.t] || PTC.town, p.t === 'pole' ? 'star' : p.t === 'tropic' ? 'dia' : p.t === 'lake' ? 'sq' : 'dot',
        p.t === 'pole' ? ({ '富貴角': '極北 富貴角', '三貂角': '極東 三貂角', '鵝鑾鼻': '極南 鵝鑾鼻', '國聖港燈塔': '極西 國聖港燈塔', '東引': '國土最北 東引' }[p.n] || p.n) : p.n,
        p.t === 'pole' ? 1 : 5, p.t === 'pole' ? 9.5 : 9, p.n);
    });
    /* 縣市名稱、縣市政府 */
    if (L.cty) {
      D.C.forEach(function (c) {
        var ins = null, f2 = f;
        if (gmain === 'm' && (c.n === '金門縣' || c.n === '連江縣')) {
          if (st.v !== 'all') return;
          ins = INSETS[c.n === '金門縣' ? 1 : 0]; f2 = ins.f;
        } else if (gmain === 'k' && c.n !== '金門縣') return;
        else if (gmain === 'z' && c.n !== '連江縣') return;
        if (ins) return;   /* 小框標題已寫縣名 */
        var lp = f2.inb(c.lp, 0.005) ? c.lp : f2.inb(c.seat.slice(1)) ? c.seat.slice(1) : null;
        if (!lp) return;
        var at = f2(lp), small = c.n === '臺北市' || c.n === '基隆市' || c.n === '新竹市' || c.n === '嘉義市';
        labels.push({ pr: st.hl === 'cty:' + c.n ? 0 : 1, t: c.n, fs: zmax === 0 ? (small ? 8.5 : 10.5) : 11.5, cls: 'tgl ctl', at: at, cand: [[0, 0], [0, -11], [0, 11], [16, 0], [-16, 0], [0, -20], [0, 20], [24, 8], [-24, 8], [24, -8], [-24, -8]], center: true, key: 'cty:' + c.n });
        if (zmax > 0 && f2.inb(c.seat.slice(1))) {
          var q = f2(c.seat.slice(1));
          o += '<g data-f="cty:' + c.n + '"><circle class="seat" cx="' + n1(q[0]) + '" cy="' + n1(q[1]) + '" r="2.6"/></g>';
          taken.push([q[0] - 3, q[1] - 3, q[0] + 3, q[1] + 3]);
          if (c.seat[0] !== c.n.slice(0, -1)) labels.push({ pr: 7, t: c.seat[0], fs: 8.5, cls: 'tgl stl', at: q, key: 'cty:' + c.n });
        }
      });
    }
    /* 常考離島:縣市圖層開著、地名圖層關著時也標島名(本區標示已寫到的就不重複) */
    if (L.cty && !L.pt && gmain === 'm') {
      ISL.forEach(function (n) {
        var p = PTN[n]; if (!p || !f.inb(p.p)) return;
        labels.push({ pr: st.hl === 'pt:' + n ? 0 : 6, t: n, fs: 8.5, cls: 'tgl isl', at: f(p.p), key: 'pt:' + n, isl: n });
      });
    }
    /* 自訂標示(圖鑑各區):畫在縣市政府之後,避免被白點蓋住 */
    if (L.mk) (cfg.marks || []).forEach(function (m) {
      if ((m.z || 0) > zmax && st.hl !== 'mk:' + m.n) return;
      var f2 = where(m.p); if (!f2) return;
      var lab0 = m.lab === '' ? '' : (m.lab || m.n);
      var pr0 = zmax === 0 && m.prAll != null ? m.prAll : m.pr != null ? m.pr : 2;   /* prAll:只在全臺圖用的擺放順序 */
      ptDraw(m.p, f2, 'mk:' + m.n, m.c || '#dc2626', m.s || 'dot', lab0, pr0, 9.5, m.alt || (lab0 && String(m.n).length < lab0.length ? m.n : null));
    });
    /* 標籤避讓 */
    labels.sort(function (a, b) { return a.pr - b.pr; });
    var drawnT = [];   /* 已畫出的標籤文字(離島名稱判斷要不要省略) */
    labels.forEach(function (l) {
      if (l.isl && drawnT.some(function (t) { return t.indexOf(l.isl) >= 0; })) return;
      function hit(bb) { return taken.some(function (t) { return !(l.ins && t[4] === 'ins') && !(bb[2] < t[0] || t[2] < bb[0] || bb[3] < t[1] || t[3] < bb[1]); }); }
      if (l.dbox && hit(l.dbox)) return;
      /* 候選位置:右、左、上、下(上下與點框、山峰三角形留間距,不會壓到自己),再試四個斜角 */
      function candsOf(t) {
        var w = tw(t, l.fs), h = l.fs + 3, q = l.at, c;
        if (l.center) c = (l.cand || [[0, 0]]).map(function (d) { return [q[0] - w / 2 + d[0], q[1] - h / 2 + d[1]]; });
        else if (l.anchorRight) c = l.cand.map(function (d) { return [q[0] - w, q[1] + d[1]]; });
        else c = [[q[0] + 6, q[1] - h / 2], [q[0] - 6 - w, q[1] - h / 2], [q[0] - w / 2, q[1] - h - 7], [q[0] - w / 2, q[1] + 6],
          [q[0] + 6, q[1] - h], [q[0] + 6, q[1]], [q[0] - 6 - w, q[1] - h], [q[0] - 6 - w, q[1]],
          [q[0] - w + 2, q[1] + 6], [q[0] - w + 2, q[1] - h - 7], [q[0] - 2, q[1] + 6], [q[0] - 2, q[1] - h - 7]];
        return { w: w, h: h, c: c };
      }
      function place(t) {
        var k = candsOf(t);
        for (var i = 0; i < k.c.length; i++) {
          var bb = [k.c[i][0], k.c[i][1], k.c[i][0] + k.w, k.c[i][1] + k.h];
          if (bb[0] < 2 || bb[1] < 2 || bb[2] > W - 2 || bb[3] > H - 2) continue;
          if (hit(bb)) continue;
          return bb;
        }
        return null;
      }
      var txt = l.t, pick = place(txt);
      if (!pick && l.alt) { txt = l.alt; pick = place(txt); }   /* 完整標籤放不下 → 改用短名 */
      if (!pick) {
        if (l.pr > 0) return;
        txt = l.t; var k0 = candsOf(txt); pick = [k0.c[0][0], k0.c[0][1], k0.c[0][0] + k0.w, k0.c[0][1] + k0.h];
      }
      if (l.dot) { o += l.dot; taken.push(l.dbox); }
      taken.push(pick); drawnT.push(txt);
      o += '<text class="' + l.cls + (l.key && st.hl === l.key ? ' hi' : '') + '" x="' + n1(pick[0] + 1) + '" y="' + n1(pick[1] + l.fs) + '" font-size="' + l.fs + '"' + (l.key ? ' data-f="' + l.key + '"' : '') + '>' + esc(txt) + '</text>';
    });
    o += '</svg>';
    return o;
  }
  function star(x, y, r) {
    var s = '';
    for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; s += (i ? 'L' : 'M') + n1(x + rr * Math.cos(a)) + ',' + n1(y + rr * Math.sin(a)); }
    return s + 'Z';
  }

  /* ---- 元件狀態與事件 ---- */
  var ST = {};
  function names(cfg) {
    var a = [];
    D.C.forEach(function (c) { a.push(c.n); }); D.C.forEach(function (c) { if (a.indexOf(c.seat[0]) < 0 && c.seat[0] !== c.n.slice(0, -1)) a.push(c.seat[0]); });
    D.RV.forEach(function (r) { a.push(r.n); }); D.PK.forEach(function (p) { a.push(p.n); }); MA.forEach(function (m) { a.push(m.n); });
    D.RG.forEach(function (g) { a.push(g.n); }); D.LD.forEach(function (l) { a.push(l.n); }); D.PT.forEach(function (p) { a.push(p.n); });
    (cfg.marks || []).forEach(function (m) { if (a.indexOf(m.n) < 0) a.push(m.n); });
    return a;
  }
  function keyOf(name, cfg) {
    name = String(name || '').trim(); if (!name) return null;
    var hit = function (arr, k, fn) { for (var i = 0; i < arr.length; i++) if (fn(arr[i])) return k + ':' + (k === 'rv' ? arr[i].id : arr[i].n); return null; };
    var eq = function (x) { var m = x.n.match(/^(.*)\((.*)\)$/); return x.n === name || (m && (m[1] === name || m[2] === name)); }, pre = function (x) { return x.n.indexOf(name) === 0; };
    var sets = [[D.C, 'cty'], [D.RV, 'rv'], [D.PK, 'pk'], [MA, 'ma'], [D.RG, 'rg'], [D.PT, 'pt'], [D.LD, 'ld'], [cfg.marks || [], 'mk']];
    for (var i = 0; i < sets.length; i++) { var k = hit(sets[i][0], sets[i][1], eq); if (k) return k; }
    for (var c = 0; c < D.C.length; c++) if (D.C[c].seat[0] === name) return 'cty:' + D.C[c].n;   /* 縣市政府所在地(竹北、太保、斗六…) */
    if (name.length >= 2) for (var j = 0; j < sets.length; j++) { var k2 = hit(sets[j][0], sets[j][1], pre); if (k2) return k2; }
    return null;
  }
  function pointOf(key, cfg) {
    var t = key.split(':'), k = t[0], n = t.slice(1).join(':');
    if (k === 'cty') { var c = CBY[n]; return c ? c.lp : null; }
    if (k === 'rv') { var r = D.RV.filter(function (x) { return x.id === n; })[0]; return r ? r.lp : null; }
    var arr = { pk: D.PK, ma: MA, pt: D.PT, ld: D.LD, mk: cfg.marks || [] }[k];
    if (arr) { var x = arr.filter(function (y) { return y.n === n; })[0]; return x ? x.p : null; }
    if (k === 'rg') { var g = D.RG.filter(function (y) { return y.n === n; })[0]; return g ? g.segs[0][Math.floor(g.segs[0].length / 2)] : null; }
    return null;
  }
  /* 讓項目看得見:必要時開圖層、換分區 */
  function reveal(st, key) {
    var k = key.split(':')[0], n = key.split(':').slice(1).join(':');
    var layer = { cty: 'cty', rv: 'rv', pk: 'mt', ma: 'mt', rg: 'mt', ld: 'pt', mk: 'mk', tr: 'pole' }[k];
    if (k === 'pt') { var p = D.PT.filter(function (x) { return x.n === n; })[0]; layer = p && (p.t === 'pole' || p.t === 'tropic') ? 'pole' : 'pt'; }
    if (layer && st.on[layer] === 0) st.on[layer] = 1;
    if (layer && !(layer in st.on)) st.on[layer] = 1;
    var p0 = pointOf(key, st.cfg); if (!p0) return;
    var cur = VB[st.v] || VB.all, b = cur[2];
    var inCur = p0[0] >= b[0] && p0[0] <= b[2] && p0[1] >= b[1] && p0[1] <= b[3];
    if (k === 'cty' && (n === '金門縣' || n === '連江縣')) { if (st.v !== 'all') st.v = n === '金門縣' ? 'k' : 'z'; return; }
    if (inCur && (st.v !== 'all' || p0[0] > 119.25)) return;
    var order = ['all', 'n', 'c', 's', 'g', 'h', 't', 'p', 'k', 'z'];
    for (var i = 0; i < order.length; i++) { var bb = VB[order[i]][2]; if (p0[0] >= bb[0] && p0[0] <= bb[2] && p0[1] >= bb[1] && p0[1] <= bb[3]) { st.v = order[i]; return; } }
  }
  function draw(id) {
    var st = ST[id]; if (!st) return;
    document.querySelectorAll('.tg[data-tg="' + id + '"]').forEach(function (fig) {
      var mp = fig.querySelector('.tg-map');
      mp.innerHTML = render(id); mp.removeAttribute('data-lazy');
      fig.querySelectorAll('[data-tgv]').forEach(function (b) { if (b.tagName === 'BUTTON') b.classList.toggle('on', b.getAttribute('data-tgv') === st.v); });
      fig.querySelectorAll('[data-tgl]').forEach(function (b) { b.classList.toggle('on', !!st.on[b.getAttribute('data-tgl')]); });
      var inf = fig.querySelector('.tg-info');
      var html = st.hl ? infoOf(st.hl, st.cfg) : '';
      inf.innerHTML = html || st.cfg.hint || '👆 點地圖上的縣市、河川、山或地名看說明;也可以在右上搜尋';
      inf.classList.toggle('on', !!html);
    });
  }
  function widget(id, cfg) {
    cfg = cfg || {};
    if (!ST[id]) {
      var on = {}; Object.keys(cfg.layers || { cty: 1, rv: 1, mt: 1, pt: 0, pole: 1 }).forEach(function (k) { on[k] = (cfg.layers || {})[k] ? 1 : 0; });
      if (!cfg.layers) on = { cty: 1, rv: 1, mt: 1, pt: 0, pole: 1 };
      ST[id] = { cfg: cfg, v: cfg.view || 'all', on: on, hl: null };
    } else ST[id].cfg = cfg;
    var st = ST[id];
    var html = '<figure class="tg nomask" data-tg="' + id + '"><div class="tg-top"><div class="tg-vs">' +
      VIEWS.map(function (v) { return '<button type="button" data-tgv="' + v[0] + '"' + (st.v === v[0] ? ' class="on"' : '') + '>' + v[1] + '</button>'; }).join('') +
      '</div></div><div class="tg-ls">' + Object.keys(st.on).map(function (k) { return '<button type="button" data-tgl="' + k + '"' + (st.on[k] ? ' class="on"' : '') + '>' + (k === 'mk' && cfg.mkName ? cfg.mkName : LAYER_T[k]) + '</button>'; }).join('') +
      '<input class="tg-q" type="search" list="tgdl-' + id + '" placeholder="🔎 找:玉山、濁水溪、太保…" aria-label="在地圖上找地名"><datalist id="tgdl-' + id + '">' + names(cfg).map(function (n) { return '<option value="' + esc(n) + '">'; }).join('') + '</datalist></div>' +
      '<div class="tg-map" data-lazy="1"><div class="tg-ph"></div></div><div class="tg-info">' + (cfg.hint || '👆 點地圖上的縣市、河川、山或地名看說明;也可以在右上搜尋') + '</div>' +
      (cfg.legend || '') + '<figcaption class="tg-cap">縣市界線:內政部國土測繪中心開放資料(政府資料開放授權條款第 1 版);河川長度與流域:經濟部水利署;河川、山脈為示意走向。釣魚臺列嶼、南海諸島(西沙、中沙、南沙太平島)見圖鑑「四極與臺灣之最」的位置圖;彭佳嶼等外海小島因版面未繪。</figcaption></figure>';
    return html;
  }
  function focus(id, key) {
    var st = ST[id]; if (!st || !key) return;
    st.hl = key; reveal(st, key); draw(id);
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (e) {
      var t = e.target, ext = t.closest && t.closest('[data-tgf]');
      if (ext) {
        var id0 = ext.getAttribute('data-tgt'), fig0 = document.querySelector('.tg[data-tg="' + id0 + '"]');
        if (fig0) { focus(id0, ext.getAttribute('data-tgf')); var det = fig0.closest('details'); if (det) det.open = true; fig0.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        return;
      }
      var fig = t.closest && t.closest('.tg'); if (!fig) return;
      var id = fig.getAttribute('data-tg'), st = ST[id]; if (!st) return;
      var b;
      if ((b = t.closest('[data-tgv]'))) { var v = b.getAttribute('data-tgv'); if (v) { st.v = v; draw(id); } return; }
      if ((b = t.closest('[data-tgl]'))) { var k = b.getAttribute('data-tgl'); st.on[k] = st.on[k] ? 0 : 1; draw(id); return; }
      if ((b = t.closest('svg [data-f]'))) { var key = b.getAttribute('data-f'); st.hl = st.hl === key ? null : key; draw(id); return; }
      if (t.closest('svg')) { if (st.hl) { st.hl = null; draw(id); } }
    });
    /* 延遲繪圖:地圖接近畫面(例如展開那一區,往下約一個半畫面內)才畫 */
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var fig = en.target.closest('.tg'); if (fig && en.target.getAttribute('data-lazy')) draw(fig.getAttribute('data-tg'));
      });
    }, { rootMargin: '600px 0px' }) : null;
    function scan(node) {
      if (!node.querySelectorAll) return;
      var list = [].slice.call(node.querySelectorAll('.tg-map[data-lazy]'));
      if (node.matches && node.matches('.tg-map[data-lazy]')) list.push(node);
      list.forEach(function (el) { if (io) io.observe(el); else { var fig = el.closest('.tg'); if (fig) draw(fig.getAttribute('data-tg')); } });
    }
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(scan); }); }).observe(document.documentElement, { childList: true, subtree: true });
    }
    document.addEventListener('DOMContentLoaded', function () { scan(document); });
    var tmr;
    document.addEventListener('input', function (e) {
      var q = e.target.closest && e.target.closest('.tg-q'); if (!q) return;
      var fig = q.closest('.tg'), id = fig.getAttribute('data-tg'), st = ST[id];
      clearTimeout(tmr);
      tmr = setTimeout(function () { var key = keyOf(q.value, st.cfg); if (key) focus(id, key); }, 250);
    });
    try {
      var css = document.createElement('style');
      css.textContent =
        '.tg{margin:10px 0 14px}.tg-top{display:flex;gap:6px;align-items:center}' +
        '.tg-vs,.tg-ls{display:flex;gap:5px;overflow-x:auto;scrollbar-width:none;padding:2px 0}.tg-vs::-webkit-scrollbar,.tg-ls::-webkit-scrollbar{display:none}' +
        '.tg-vs button,.tg-ls button{flex:0 0 auto;border:1.5px solid var(--line,#d8dee9);background:var(--card,#fff);color:var(--ink,#1c2330);border-radius:999px;padding:3px 10px;font-size:.78rem;font-weight:700;font-family:inherit;cursor:pointer}' +
        '.tg-vs button.on{background:var(--sel,#15803d);border-color:var(--sel,#15803d);color:var(--onsel,#fff)}' +
        '.tg-ls{margin-top:5px;flex-wrap:wrap}.tg-ls button{font-size:.74rem;padding:2px 9px;color:var(--sub,#64748b)}.tg-ls button.on{border-color:var(--sel,#15803d);color:var(--sel,#15803d);background:var(--soft,#e9f6ee)}' +
        '.tg-q{flex:1 1 140px;min-width:120px;border:1.5px solid var(--line,#d8dee9);background:var(--card,#fff);color:var(--ink,#1c2330);border-radius:999px;padding:3px 10px;font-size:.78rem;font-family:inherit}' +
        '.tg-map{margin-top:6px}.tg-ph{aspect-ratio:360/477;max-width:520px;margin:0 auto;border-radius:10px;background:var(--soft,#e6f2fb)}.tgm{width:100%;max-width:520px;height:auto;display:block;margin:0 auto;-webkit-user-select:none;user-select:none}' +
        '.tgm .sea{fill:#e6f2fb}.tgm .land{fill:#f4f1e4;stroke:#94a3b8;stroke-width:.7}.tgm .cty{stroke:#94a3b8;stroke-width:.7;cursor:pointer}' +
        '.tgm .r1{fill:#fef3c7}.tgm .r2{fill:#dcfce7}.tgm .r3{fill:#ffe4e6}.tgm .r4{fill:#ede9fe}.tgm .r5{fill:#ffedd5}' +
        '.tgm .lagoon{fill:#d4ecfb}.tgm .reef{fill:none;stroke:#f9a8a8;stroke-width:4.2;stroke-linecap:round;opacity:.95}.tgm .isl{fill:#475569;font-weight:600;font-style:italic}.tgm .rgl{fill:#92400e}' +
        '.tgm .cty.hi,.tgm .land.hi{fill:#fde047;stroke:#a16207;stroke-width:1.4}' +
        '.tgm .ib{fill:#eef6fc;stroke:#9aa8b8;stroke-dasharray:3 2;cursor:pointer}.tgm .cap{font-size:8.5px;fill:#64748b;pointer-events:none}' +
        '.tgm .ct{fill:none;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round;opacity:.9;pointer-events:none}' +
        '.tgm .tgr{fill:none;stroke:#2563eb;stroke-linejoin:round;stroke-linecap:round}.tgm .tgr.c1{stroke-width:1.7}.tgm .tgr.c2{stroke-width:1.2}.tgm .tgr.c3{stroke-width:.9;opacity:.85}' +
        '.tgm .tgr.hi{stroke:#e11d48;stroke-width:3.2}' +
        '.tgm .tgh{fill:none;stroke:transparent;stroke-width:9;cursor:pointer}' +
        '.tgm .rg{fill:none;stroke:#a16207;stroke-width:2.2;stroke-dasharray:5 3;stroke-linecap:round;opacity:.8}.tgm .rgs{stroke-width:1.5}.tgm .rg.hi{stroke:#e11d48;opacity:1;stroke-width:3}' +
        '.tgm .rgb{fill:#a16207;stroke:#fff;stroke-width:1.2;cursor:pointer}.tgm .num{font-size:8.5px;font-weight:800;fill:#fff;pointer-events:none}' +
        '.tgm .pk{fill:#7c2d12;stroke:#fff;stroke-width:1;cursor:pointer}.tgm .pk.hi{fill:#e11d48}' +
        '.tgm .ma{fill:#15803d;stroke:#fff;stroke-width:1.2;cursor:pointer}.tgm .hi .ma{fill:#e11d48}.tgm .mal{fill:#166534}' +
        '.tgm .tga{pointer-events:none}.tgm .tgab{fill:none;stroke-width:9;stroke-linecap:round;stroke-linejoin:round;opacity:.42}.tgm .tgah{opacity:.8}' +
        '.tgm .tga-w .tgab{stroke:#2563eb}.tgm .tga-w .tgah{fill:#2563eb}.tgm .tga-s .tgab{stroke:#ea580c}.tgm .tga-s .tgah{fill:#ea580c}' +
        '.tgm .tgal{cursor:default}.tgm .tgal-w{fill:#1d4ed8}.tgm .tgal-s{fill:#c2410c}.tgm .tgz{fill:#15803d;font-style:italic;cursor:default}' +
        '.tgm .tgk{stroke:#fff;stroke-width:1.2;cursor:pointer}.tgm .hi .tgk{stroke:#e11d48;stroke-width:2.2}' +
        '.tgm .seat{fill:#fff;stroke:#334155;stroke-width:1.3;cursor:pointer}' +
        '.tgm .trp{stroke:#16a34a;stroke-width:1.2;stroke-dasharray:6 3}' +
        '.tgm .tgl{font-weight:700;fill:#1e293b;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round;cursor:pointer}' +
        '.tgm .ctl{fill:#334155;font-weight:800}.tgm .rvl{fill:#1d4ed8;font-style:italic}.tgm .pkl{fill:#7c2d12}.tgm .ldl{fill:#64748b;font-style:italic;font-weight:600}' +
        '.tgm .stl{fill:#475569;font-weight:600}.tgm .trl{fill:#15803d}.tgm .tgl.hi{fill:#e11d48}' +
        '.tg-info{font-size:.82rem;line-height:1.7;background:var(--soft,#f1f5f9);border-radius:10px;padding:7px 11px;margin-top:6px;color:var(--sub,#64748b)}' +
        '.tg-info.on{color:var(--ink,#1c2330);border-left:4px solid #e11d48}.tg-info b{color:var(--ink,#1c2330)}' +
        '.tg-k{display:inline-block;font-size:.68rem;font-weight:800;color:var(--sel,#15803d);background:var(--card,#fff);border-radius:6px;padding:0 5px;margin:0 4px 0 2px}' +
        '.tg-lg{display:flex;flex-wrap:wrap;gap:4px 10px;justify-content:center;font-size:.74rem;color:var(--sub,#64748b);margin-top:6px}.tg-lg i{display:inline-block;width:14px;height:4px;border-radius:2px;vertical-align:middle;margin-right:4px}' +
        '.tg-lg b{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:-1px;margin-right:4px}' +
        '.tg-cap{font-size:.68rem;color:var(--sub,#64748b);text-align:center;margin-top:5px;line-height:1.5}' +
        '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tgm .sea{fill:#0f2233}:root:not([data-theme="light"]) .tgm .land{fill:#2b3326;stroke:#5b6b7c}' +
        ':root:not([data-theme="light"]) .tgm .cty{stroke:#5b6b7c}:root:not([data-theme="light"]) .tgm .r1{fill:#3b3315}:root:not([data-theme="light"]) .tgm .r2{fill:#16301f}' +
        ':root:not([data-theme="light"]) .tgm .r3{fill:#3a1f24}:root:not([data-theme="light"]) .tgm .r4{fill:#2a2340}:root:not([data-theme="light"]) .tgm .r5{fill:#3b2a17}' +
        ':root:not([data-theme="light"]) .tgm .ib{fill:#132a3d;stroke:#5b6b7c}:root:not([data-theme="light"]) .tgm .tgl{fill:#e2e8f0;stroke:#0f172a}' +
        ':root:not([data-theme="light"]) .tgm .tgr{stroke:#60a5fa}:root:not([data-theme="light"]) .tgm .rvl{fill:#93c5fd}:root:not([data-theme="light"]) .tgm .ctl{fill:#e2e8f0}' +
        ':root:not([data-theme="light"]) .tgm .pkl{fill:#fdba74}:root:not([data-theme="light"]) .tgm .ldl{fill:#94a3b8}:root:not([data-theme="light"]) .tgm .stl{fill:#cbd5e1}' +
        ':root:not([data-theme="light"]) .tgm .seat{fill:#0f172a;stroke:#cbd5e1}:root:not([data-theme="light"]) .tgm .cty.hi{fill:#854d0e}' +
        ':root:not([data-theme="light"]) .tgm .lagoon{fill:#163a55}:root:not([data-theme="light"]) .tgm .reef{stroke:#be4b5c}:root:not([data-theme="light"]) .tgm .isl{fill:#cbd5e1}:root:not([data-theme="light"]) .tgm .rgl{fill:#fbbf24}' +
        ':root:not([data-theme="light"]) .tgm .mal{fill:#86efac}:root:not([data-theme="light"]) .tgm .tgal-w{fill:#93c5fd}:root:not([data-theme="light"]) .tgm .tgal-s{fill:#fdba74}:root:not([data-theme="light"]) .tgm .tgz{fill:#86efac}:root:not([data-theme="light"]) .tgm .tga-w .tgab{stroke:#60a5fa}:root:not([data-theme="light"]) .tgm .tga-w .tgah{fill:#60a5fa}:root:not([data-theme="light"]) .tgm .tga-s .tgab{stroke:#fb923c}:root:not([data-theme="light"]) .tgm .tga-s .tgah{fill:#fb923c}}' +
        ':root[data-theme="dark"] .tgm .sea{fill:#0f2233}:root[data-theme="dark"] .tgm .land{fill:#2b3326;stroke:#5b6b7c}' +
        ':root[data-theme="dark"] .tgm .cty{stroke:#5b6b7c}:root[data-theme="dark"] .tgm .r1{fill:#3b3315}:root[data-theme="dark"] .tgm .r2{fill:#16301f}' +
        ':root[data-theme="dark"] .tgm .r3{fill:#3a1f24}:root[data-theme="dark"] .tgm .r4{fill:#2a2340}:root[data-theme="dark"] .tgm .r5{fill:#3b2a17}' +
        ':root[data-theme="dark"] .tgm .ib{fill:#132a3d;stroke:#5b6b7c}:root[data-theme="dark"] .tgm .tgl{fill:#e2e8f0;stroke:#0f172a}' +
        ':root[data-theme="dark"] .tgm .tgr{stroke:#60a5fa}:root[data-theme="dark"] .tgm .rvl{fill:#93c5fd}:root[data-theme="dark"] .tgm .ctl{fill:#e2e8f0}' +
        ':root[data-theme="dark"] .tgm .pkl{fill:#fdba74}:root[data-theme="dark"] .tgm .ldl{fill:#94a3b8}:root[data-theme="dark"] .tgm .stl{fill:#cbd5e1}' +
        ':root[data-theme="dark"] .tgm .mal{fill:#86efac}:root[data-theme="dark"] .tgm .tgal-w{fill:#93c5fd}:root[data-theme="dark"] .tgm .tgal-s{fill:#fdba74}:root[data-theme="dark"] .tgm .tgz{fill:#86efac}:root[data-theme="dark"] .tgm .tga-w .tgab{stroke:#60a5fa}:root[data-theme="dark"] .tgm .tga-w .tgah{fill:#60a5fa}:root[data-theme="dark"] .tgm .tga-s .tgab{stroke:#fb923c}:root[data-theme="dark"] .tgm .tga-s .tgah{fill:#fb923c}' +
        ':root[data-theme="dark"] .tgm .seat{fill:#0f172a;stroke:#cbd5e1}:root[data-theme="dark"] .tgm .cty.hi{fill:#854d0e}' +
        ':root[data-theme="dark"] .tgm .lagoon{fill:#163a55}:root[data-theme="dark"] .tgm .reef{stroke:#be4b5c}:root[data-theme="dark"] .tgm .isl{fill:#cbd5e1}:root[data-theme="dark"] .tgm .rgl{fill:#fbbf24}';
      (document.head || document.documentElement).appendChild(css);
    } catch (e) {}
  }
  root.TWGEO = { widget: widget, focus: focus, draw: draw, _render: render, keyOf: function (n, cfg) { return keyOf(n, cfg || {}); }, info: function (k, cfg) { return infoOf(k, cfg || {}); }, VIEWS: VIEWS, data: D };
})(typeof window !== 'undefined' ? window : this);
