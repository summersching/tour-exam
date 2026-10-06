/* lock.js — 進入密碼(單一來源)· v131
   ------------------------------------------------------------------
   每一頁最前面載入(lock_config.js → lock.js),在畫面出現前先擋住:
     · lock_config.js 的 LOCKCFG 沒設定(null)→ 不上鎖,一切照舊
     · 有設定 → 畫面先藏起來,輸入正確密碼才顯示;可勾「記住這台裝置 30 天」(不勾 = 關掉 App 後要再輸入)
     · 密碼本身不存在任何檔案裡:只存「加鹽 + PBKDF2-SHA256 15 萬次」後的雜湊,在瀏覽器裡用同樣方法比對
     · 連續輸錯 5 次要等 30 秒
   APPLOCK.enabled()  是否有設定密碼
   APPLOCK.lock()     立即上鎖(清除這台裝置的記住狀態並重新整理)
   設定 / 更換 / 移除密碼:在電腦執行「旅遊證照\設定App密碼.py」(密碼只在自己電腦輸入,不經過任何人)
   注意:這是網站入口的門鎖,擋住不知道密碼的人使用;題庫檔案本身仍放在公開的 GitHub 專案上。
   變更履歷:
     v131 (2026-10-06) 初版
*/
(function () {
  'use strict';
  var CFG = window.LOCKCFG || null;
  var KEY = 'app_unlock', SKEY = 'app_unlock_s', FKEY = 'app_lock_fail';
  var DAYS = 30, MAXFAIL = 5, WAIT = 30;
  function enabled() { return !!(CFG && CFG.hash && CFG.salt && CFG.iter); }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function unlocked() {
    if (!enabled()) return true;
    try { if (sessionStorage.getItem(SKEY) === CFG.hash) return true; } catch (e) {}
    var o = lsGet(KEY);
    return !!(o && o.h === CFG.hash && o.exp > Date.now());
  }
  function lock() {
    try { localStorage.removeItem(KEY); sessionStorage.removeItem(SKEY); } catch (e) {}
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
    '#appLock .lk{width:100%;max-width:360px;background:#fff;color:#1c2330;border-radius:20px;padding:26px 22px 20px;box-shadow:0 18px 50px rgba(0,0,0,.35);text-align:center}' +
    '#appLock .ic{font-size:2.4rem;line-height:1}#appLock h1{font-size:1.2rem;margin:8px 0 4px}#appLock p{margin:0 0 14px;font-size:.84rem;color:#5a6b82}' +
    '#appLock .row{position:relative}#appLock input[type=password],#appLock input[type=text]{width:100%;box-sizing:border-box;border:1.5px solid #cbd5e1;border-radius:12px;padding:12px 44px 12px 14px;font-size:1rem;font-family:inherit;color:#1c2330;background:#fff}' +
    '#appLock input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18)}' +
    '#appLock .eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none;font-size:1.1rem;cursor:pointer;padding:6px}' +
    '#appLock label{display:flex;align-items:center;gap:8px;justify-content:center;font-size:.84rem;color:#334155;margin:12px 0 4px;cursor:pointer}' +
    '#appLock button.go{width:100%;border:0;border-radius:12px;padding:12px;font-size:1rem;font-weight:800;color:#fff;background:#2563eb;cursor:pointer;margin-top:8px;font-family:inherit}' +
    '#appLock button.go:disabled{opacity:.6;cursor:wait}#appLock .err{min-height:1.3em;color:#c62a2a;font-size:.85rem;font-weight:700;margin-top:10px}' +
    '#appLock .ft{font-size:.72rem;color:#94a3b8;margin-top:8px}' +
    '#appLock .shake{animation:lkShake .35s}@keyframes lkShake{25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}' +
    '@media (prefers-color-scheme:dark){#appLock .lk{background:#1b2029;color:#e8edf5}#appLock p{color:#9aa8bd}#appLock label{color:#cbd5e1}' +
    '#appLock input[type=password],#appLock input[type=text]{background:#12161c;color:#e8edf5;border-color:#334155}#appLock .err{color:#ff8080}}';
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
    box.innerHTML = '<form class="lk" autocomplete="on">' +
      '<div class="ic">🔒</div><h1>請輸入密碼</h1><p>這個 App 已設定進入密碼</p>' +
      '<input type="text" name="username" value="考照App" autocomplete="username" hidden>' +
      '<div class="row"><input type="password" id="lkPw" autocomplete="current-password" placeholder="密碼" aria-label="密碼" required>' +
      '<button type="button" class="eye" id="lkEye" aria-label="顯示密碼">👁</button></div>' +
      '<label><input type="checkbox" id="lkRem" checked> 記住這台裝置 ' + DAYS + ' 天</label>' +
      '<button class="go" type="submit" id="lkGo">進入</button><div class="err" id="lkErr" aria-live="polite"></div>' +
      '<div class="ft">忘記密碼:在電腦重新設定即可(設定App密碼.py)</div></form>';
    document.body.appendChild(box);
    var form = box.querySelector('form'), pw = box.querySelector('#lkPw'), err = box.querySelector('#lkErr'), go = box.querySelector('#lkGo');
    box.querySelector('#lkEye').onclick = function () { pw.type = pw.type === 'password' ? 'text' : 'password'; pw.focus(); };
    if (!(window.crypto && crypto.subtle && window.TextEncoder)) {
      err.textContent = '這個瀏覽器版本太舊,無法驗證密碼,請更新瀏覽器';
      go.disabled = true;
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
          if (box.querySelector('#lkRem').checked) lsSet(KEY, { h: CFG.hash, exp: Date.now() + DAYS * 864e5 });
          else { try { sessionStorage.setItem(SKEY, CFG.hash); } catch (e2) {} }
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
