/* atlaslink.js — 觀光資源細類 → 觀光圖鑑(地圖、年表)對照(單一來源)· v143
   ------------------------------------------------------------------
   考點速記、考前衝刺(必背 100 條)的「觀光資源概要」:每個細類旁邊列出相關的圖鑑區塊,
   點一下直接看那一區的地圖、年表與一表整理(觀光圖鑑.html#區代號)。
   ATLASLINK.SECS        圖鑑各區 [代號, 圖示, 名稱](順序、圖示、名稱同 atlas_data.js;自動測試會核對)
   ATLASLINK.forTT(tt)   細類 → 區代號陣列(沒有對應時回傳 [];最多 4 區)
   ATLASLINK.chips(tt)   細類 → 「🗺️ 看圖整理」連結列 HTML(沒有對應時回傳 '')
   ATLASLINK.strip()     全部區塊的捷徑列 HTML(放在觀光科頁首)
   樣式由各頁自訂:.alk(細類旁的連結列)、.atl(頁首捷徑列)
   變更履歷:
     v143 (2026-10-12) 加入「宗教信仰與廟宇」;宗教信仰、節慶活動、文教古蹟細類連到新區
     v142 (2026-10-12) 加入臺灣地理總圖、主要河川、四極與臺灣之最、海岸、岩石 5 區;地形、水文、離島、人文地名等細類改連到新區
     v141 (2026-10-12) 初版
*/
(function (root) {
  'use strict';
  var SECS = [
    ['geo', '🧭', '臺灣地理總圖'], ['river', '🌊', '主要河川'], ['poles', '📍', '四極與臺灣之最'],
    ['np', '🏞️', '國家公園'], ['nsa', '🌄', '國家風景區'], ['ind', '🪶', '原住民族 16 族'], ['fest', '🎉', '節慶'], ['rel', '🏮', '宗教信仰與廟宇'],
    ['land', '🪨', '地形景觀'], ['coast', '🏖️', '海岸類型與海岸地形'], ['rock', '🧱', '岩石與地質'], ['mt', '⛰️', '山脈與高山'],
    ['wh', '🌏', '世界遺產'], ['hist', '🕰️', '臺灣史年表'], ['heri', '🏯', '臺灣古蹟'], ['whist', '🌍', '世界史年表'],
    ['wgeo', '🗺️', '世界地理之最'], ['clim', '🌦️', '氣候與季風']
  ];
  /* 觀光資源概要的解析細類(sprint_cn.js 的 tt)→ 最相關的圖鑑區(前面的優先);
     同一細類同時有臺灣題與世界題的,臺灣、世界各給一區 */
  var TT = {
    '重大事件': ['hist', 'whist'], '文教古蹟': ['heri', 'hist', 'rel'], '族群原民': ['ind'], '帝國殖民': ['whist', 'hist'],
    '經濟產業': ['hist'], '古文明': ['whist', 'wh'], '政權分期': ['hist'], '藝術文學': ['whist'], '宗教文化': ['whist'],
    '宗教信仰': ['rel', 'fest', 'hist'], '人物探險': ['whist'],
    '地形': ['land', 'rock', 'coast', 'mt'], '國家位置': ['wgeo', 'wh'], '人文地名': ['geo', 'hist'], '氣候': ['clim', 'wgeo'], '生態': ['wgeo', 'np'],
    '氣候水文': ['clim', 'river'], '水文': ['river', 'wgeo'], '生態保育': ['np'], '離島': ['coast', 'rock', 'land'],
    '風景區歸屬': ['nsa', 'np', 'poles'], '節慶活動': ['fest', 'rel'], '古蹟設施': ['heri', 'poles'], '世界遺產': ['wh'], '景點地標': ['wh', 'wgeo'], '節慶飲食': ['fest']
  };
  function sec(id) { for (var i = 0; i < SECS.length; i++) if (SECS[i][0] === id) return SECS[i]; return null; }
  function link(id) { var s = sec(id); return s ? '<a href="觀光圖鑑.html#' + id + '">' + s[1] + ' ' + s[2] + '</a>' : ''; }
  function forTT(tt) { return (TT[tt] || []).slice(); }
  function chips(tt) {
    var ids = forTT(tt);
    return ids.length ? '<div class="alk nomask"><span>🗺️ 看圖整理</span>' + ids.map(link).join('') + '</div>' : '';
  }
  function strip() {
    return '<div class="atl nomask"><div class="atlh">🗺️ 觀光資源圖鑑:地圖、年表一表整理</div><div class="atlr">' + SECS.map(function (s) { return link(s[0]); }).join('') + '</div></div>';
  }
  root.ATLASLINK = { SECS: SECS, forTT: forTT, chips: chips, strip: strip };
})(typeof window !== 'undefined' ? window : this);
