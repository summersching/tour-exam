/* lock_config.js — 進入密碼設定:只放「加鹽 + PBKDF2-SHA256 15 萬次」後的雜湊,看不出密碼本身
   null = 不上鎖。更換 / 取消密碼:重新產生這個檔案,並把 sw.js 的快取版本 +1。 */
window.LOCKCFG = {"v":1,"salt":"y5gn+7y6vhVa9LHuTwChrQ==","iter":150000,"hash":"pgQLMowGC6x8OeL3AbNcub/g4ZBzsdTjTZ7MUEvbZX8="};
