/* 外語英檢 考照中心 — Service Worker(離線快取)
   更新內容後把 CACHE 版本號 +1(例 v1 -> v2),重新整理即自動汰換舊快取 */
const CACHE = 'ylenpass-v16';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'pwa.js',
  '學習中心.html', '錯題本.html',
  'glossary.js', 'dict.json',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
  '106_領隊英語_詳解.html', '107_領隊英語_詳解.html', '108_領隊英語_詳解.html',
  '109_領隊英語_詳解.html', '110_領隊英語_詳解.html', '111_領隊英語_詳解.html',
  '112_領隊英語_詳解.html', '113_領隊英語_詳解.html', '114_領隊英語_詳解.html',
  '115_領隊英語_詳解.html',
  '115_導遊英語_詳解.html', '114_導遊英語_詳解.html', '113_導遊英語_詳解.html',
  '112_導遊英語_詳解.html', '111_導遊英語_詳解.html', '110_導遊英語_詳解.html',
  '109_導遊英語_詳解.html', '108_導遊英語_詳解.html', '107_導遊英語_詳解.html'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  // 逐一 add,單一檔失敗不影響其他(檔名含中文時特別保險)
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(u => c.add(u)))));
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
  // cache-first:先快取,沒有再連網,連網成功順手存快取;離線且未快取則回首頁
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
