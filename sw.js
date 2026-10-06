/* 外語英檢 考照中心 — Service Worker(離線快取)
   更新內容後把 CACHE 版本號 +1(例 v1 -> v2),重新整理即自動汰換舊快取 */
const CACHE = 'ylenpass-v132';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'pwa.js', 'lock_config.js', 'lock.js', 'examsel.js', '搜尋.html', '收藏.html', '歷屆試題.html', '英語詳解.html', '日文詳解.html',
  '學習中心.html', '日語學習中心.html', '考前衝刺.html', '法規速查.html', '考點速記.html', '口試練習.html', '模擬測驗.html', '儀表板.html', '資料備份.html', '錯題本.html', '日文錯題本.html', '觀光複習.html', '觀光錯題本.html', '執業實務複習.html', '執業實務錯題本.html', '執業法規複習.html', '執業法規錯題本.html', '是非快問.html', '數字速記.html', '兩岸入出境.html', '實務工具箱.html', '觀光圖鑑.html', '出題趨勢.html',
  'subjects.js', 'prefs.js', 'fav.js', 'notes.js', 'srs.js', 'backlink.js', 'practice.js', 'miniquiz.js', 'mask.js', 'tf.js', 'cs_data.js', 'toolbox_data.js', 'atlas_data.js', 'must100.js', 'learn_en.js', 'learn_jp.js', 'scoring.js', 'stale.js', 'enread.js', 'optimg.js',
  'glossary.js', 'dict.json', 'bank.js', 'sprint.js', 'sprint_cn.js', 'oral.js', 'oral_jp.js', 'oral_mock.js', 'gh.js', 'gh_ana.js', 'en_review.js', 'pr.js', 'pr_ana.js', 'pr2.js', 'pr2_ana.js', 'jp.js', 'jp_ana.js', 'jp_psg.js', 'jplook.js',
  'kuromoji/kuromoji.js',
  'dict/base.dat.gz', 'dict/cc.dat.gz', 'dict/check.dat.gz', 'dict/tid.dat.gz', 'dict/tid_map.dat.gz', 'dict/tid_pos.dat.gz',
  'dict/unk.dat.gz', 'dict/unk_char.dat.gz', 'dict/unk_compat.dat.gz', 'dict/unk_invoke.dat.gz', 'dict/unk_map.dat.gz', 'dict/unk_pos.dat.gz',
  'img/gh/guide-106-52-a.jpg', 'img/gh/guide-106-52-b.jpg', 'img/gh/guide-106-52-c.jpg', 'img/gh/guide-106-52-d.jpg', 'img/gh/guide-107-27-a.jpg', 'img/gh/guide-107-27-b.jpg', 'img/gh/guide-107-27-c.jpg', 'img/gh/guide-107-27-d.jpg', 'img/gh/leader-106-49-a.jpg', 'img/gh/leader-106-49-b.jpg', 'img/gh/leader-106-49-c.jpg', 'img/gh/leader-106-49-d.jpg', 'img/gh/leader-107-50-a.jpg', 'img/gh/leader-107-50-b.jpg', 'img/gh/leader-107-50-c.jpg', 'img/gh/leader-107-50-d.jpg',
  'img/pr2/guide-106-13-a.jpg', 'img/pr2/guide-106-13-b.jpg', 'img/pr2/guide-106-13-c.jpg', 'img/pr2/guide-106-13-d.jpg',
  'img/gh/guide-109-39-q.jpg', 'img/gh/leader-106-55-q.jpg', 'img/gh/leader-113-41-q.jpg', 'img/pr/leader-106-71-q.jpg', 'img/pr/leader-114-50-q.jpg',
  'img/gh/guide-106-33-q.jpg', 'img/gh/guide-108-22-q.jpg', 'img/gh/guide-108-31-q.jpg', 'img/gh/guide-108-34-q.jpg', 'img/gh/guide-108-37-q.jpg', 'img/gh/guide-108-40-q.jpg',
  'img/gh/guide-109-25-q.jpg', 'img/gh/guide-109-32-q.jpg', 'img/gh/guide-109-34-q.jpg', 'img/gh/guide-110-39-q.jpg', 'img/gh/leader-106-58-q.jpg', 'img/gh/leader-107-15-q.jpg',
  'img/gh/leader-108-34-q.jpg', 'img/gh/leader-109-33-q.jpg', 'img/gh/leader-109-44-q.jpg', 'img/gh/leader-110-26-q.jpg', 'img/gh/leader-110-28-q.jpg', 'img/gh/leader-110-33-q.jpg',
  'img/gh/leader-111-33-q.jpg', 'img/gh/leader-111-44-q.jpg', 'img/gh/leader-112-27-q.jpg', 'img/gh/leader-112-30-q.jpg', 'img/gh/leader-112-43-q.jpg', 'img/gh/leader-112-44-q.jpg',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  // 逐一 add,單一檔失敗不影響其他(檔名含中文時特別保險)
  // cache:'no-cache' 每個檔都先跟伺服器確認是不是最新(沒變就沿用不重下載),避免新版快取存到瀏覽器裡上一版的 JS
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(u => c.add(new Request(u, { cache: 'no-cache' }))))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isHTML) {
    // HTML 網路優先:有網一律拿最新頁面(避免改版後「慢一版」);離線再回快取;都沒有回首頁
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
    );
    return;
  }
  // 進入密碼設定:網路優先,且每次都跟伺服器確認最新版(cache:'no-cache'),更換或移除密碼後有網路就立刻生效;離線用快取
  if (/\/lock_config\.js$/.test(new URL(req.url).pathname)) {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache' }).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  // 其他(JS/CSS/資料/字典)快取優先:先快取,沒有再連網並存快取,離線且未快取回首頁
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
