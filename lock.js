/* lock.js — 進入密碼(單一來源)· v132
   ------------------------------------------------------------------
   每一頁最前面載入(lock_config.js → lock.js),在畫面出現前先擋住:
     · LOCKCFG 是 null → 不上鎖,一切照舊
     · 有設定 → 畫面先藏起來,只顯示「請輸入密碼 / 輸入框 / 進入」,密碼對了才顯示
     · 這台裝置輸入一次就記住(不會到期);換裝置、清除網站資料、按首頁「🔒 立即上鎖」或更換密碼後才要再輸入
     · 密碼本身不存在任何檔案裡:只存「加鹽 + PBKDF2-SHA256 15 萬次」後的雜湊,在瀏覽器裡用同樣方法比對
     · 連續輸錯 5 次要等 30 秒
     · lock_config.js 沒載到(LOCKCFG 未定義)→ 維持上鎖並請使用者重新整理,不會因設定檔沒載到就直接放行
   APPLOCK.enabled()  是否有設定密碼
   APPLOCK.lock()     立即上鎖(清除這台裝置的記住狀態並重新整理)
   注意:這是網站入口的門鎖,擋住不知道密碼的人使用;題庫檔案本身仍放在公開的 GitHub 專案上。
   變更履歷:
     v132 (2026-10-06) 畫面簡化為「請輸入密碼 / 輸入框 / 進入」;一律記住這台裝置(不再勾選、不再 30 天到期);
                       設定檔沒載到時維持上鎖;localStorage 不能寫時退而記在這次開啟
     v131 (2026-10-06) 初版
*/
(function () {
  'use strict';
  var MISSING = typeof window.LOCKCFG === 'undefined';
  var CFG = window.LOCKCFG || null;
  var KEY = 'app_unlock', SKEY = 'app_unlock_s', FKEY = 'app_lock_fail';
  var MAXFAIL = 5, WAIT = 30;
  function enabled() { return !!(CFG && CFG.hash && CFG.salt && CFG.iter); }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function unlocked() {
    if (MISSING) return false;
    if (!enabled()) return true;
    var o = lsGet(KEY);
    if (o && o.h === CFG.hash) return true;
    try { return sessionStorage.getItem(SKEY) === CFG.hash; } catch (e) { return false; }
  }
  /* 記住這台裝置(不到期);極少數瀏覽器不能寫 localStorage 時,退而記在這次開啟(關掉 App 後要再輸入) */
  function remember() {
    if (lsSet(KEY, { h: CFG.hash })) return;
    try { sessionStorage.setItem(SKEY, CFG.hash); } catch (e) {}
  }
  function lock() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { sessionStorage.removeItem(SKEY); } catch (e) {}
    location.reload();
  }
  window.APPLOCK = { enabled: enabled, lock: lock };
  if (unlocked()) return;

  /* ---- 上鎖:先把頁面藏起來(在 <head> 同步執行,畫面不會先閃出內容)---- */
  var root = document.documentElement;
  root.classList.add('app-locked');
  var css = document.createElement('style');
  css.textContent =
    'html.app-locked body{visibility:hidden!important;overflow:hidden!important}' +
    'html.app-locked #appLock{visibility:visible!important}' +
    '#appLock{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;' +
    'background:linear-gradient(160deg,#1e3a8a,#0f766e);font-family:"Segoe UI","Microsoft JhengHei","PingFang TC",system-ui,sans-serif}' +
    '#appLock .lk{width:100%;max-width:340px;background:#fff;color:#1c2330;border-radius:20px;padding:26px 22px 22px;box-shadow:0 18px 50px rgba(0,0,0,.35);text-align:center}' +
    '#appLock .ic{font-size:2.4rem;line-height:1}#appLock h1{font-size:1.2rem;margin:10px 0 16px}' +
    '#appLock input[type=password]{width:100%;box-sizing:border-box;border:1.5px solid #cbd5e1;border-radius:12px;padding:12px 14px;font-size:16px;font-family:inherit;color:#1c2330;background:#fff}' +
    '#appLock input[type=password]:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18)}' +
    '#appLock button.go{width:100%;border:0;border-radius:12px;padding:12px;font-size:1rem;font-weight:800;color:#fff;background:#2563eb;cursor:pointer;margin-top:12px;font-family:inherit}' +
    '#appLock button.go:disabled{opacity:.6;cursor:default}' +
    '#appLock .err{color:#c62a2a;font-size:.85rem;font-weight:700;margin-top:10px}#appLock .err:empty{margin-top:0}' +
    '#appLock .shake{animation:lkShake .35s}@keyframes lkShake{25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}' +
    '@media (prefers-color-scheme:dark){#appLock .lk{background:#1b2029;color:#e8edf5}' +
    '#appLock input[type=password]{background:#12161c;color:#e8edf5;border-color:#334155}#appLock .err{color:#ff8080}}';
  (document.head || root).appendChild(css);

  function b64(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); }
  function derive(pw) {
    var salt = Uint8Array.from(atob(CFG.salt), function (c) { return c.charCodeAt(0); });
    return crypto.subtle.importKey('raw', new TextEncoder().encode(String(pw).normalize('NFC')), 'PBKDF2', false, ['deriveBits'])
      .then(function (k) { return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: CFG.iter }, k, 256); })
      .then(b64);
  }
  function build() {
    if (document.getElementById('appLock')) return;
    var box = document.createElement('div');
    box.id = 'appLock';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'lkTitle');
    box.innerHTML = '<form class="lk" autocomplete="on">' +
      '<div class="ic" aria-hidden="true">🔒</div><h1 id="lkTitle">請輸入密碼</h1>' +
      '<input type="text" name="username" value="考照App" autocomplete="username" hidden>' +
      '<input type="password" id="lkPw" autocomplete="current-password" enterkeyhint="go" aria-label="密碼" required>' +
      '<button class="go" type="submit" id="lkGo">進入</button>' +
      '<div class="err" id="lkErr" aria-live="polite"></div></form>';
    document.body.appendChild(box);
    var form = box.querySelector('form'), pw = box.querySelector('#lkPw'), err = box.querySelector('#lkErr'), go = box.querySelector('#lkGo');
    if (MISSING || !enabled()) {
      err.textContent = '無法載入密碼設定,請確認網路後重新整理';
      go.disabled = true;
      form.onsubmit = function (e) { e.preventDefault(); };
      return;
    }
    if (!(window.crypto && crypto.subtle && window.TextEncoder)) {
      err.textContent = '這個瀏覽器版本太舊,無法驗證密碼,請更新瀏覽器';
      go.disabled = true;
      form.onsubmit = function (e) { e.preventDefault(); };
      return;
    }
    function waitLeft() { var f = lsGet(FKEY); return f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 1000) : 0; }
    form.onsubmit = function (e) {
      e.preventDefault();
      var w = waitLeft();
      if (w) { err.textContent = '輸錯太多次,請 ' + w + ' 秒後再試'; return; }
      if (!pw.value) { pw.focus(); return; }
      go.disabled = true; err.textContent = '';
      derive(pw.value).then(function (h) {
        go.disabled = false;
        if (h === CFG.hash) {
          lsSet(FKEY, null);
          remember();
          root.classList.remove('app-locked');
          box.remove();
          try { window.dispatchEvent(new Event('app:unlocked')); } catch (e3) {}
          return;
        }
        var f = lsGet(FKEY) || { n: 0, until: 0 };
        f.n = (f.n || 0) + 1;
        if (f.n >= MAXFAIL) { f.n = 0; f.until = Date.now() + WAIT * 1000; err.textContent = '輸錯 ' + MAXFAIL + ' 次,請 ' + WAIT + ' 秒後再試'; }
        else err.textContent = '密碼不對,還可以再試 ' + (MAXFAIL - f.n) + ' 次';
        lsSet(FKEY, f);
        form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
        pw.select();
      }).catch(function () { go.disabled = false; err.textContent = '驗證失敗,請重新整理再試'; });
    };
    setTimeout(function () { pw.focus(); }, 50);
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
