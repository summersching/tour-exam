/* 科目單一來源(SSoT)· 全站共用
   ------------------------------------------------------------------
   首頁 / 儀表板 / 資料備份 都從這裡取科目清單,避免各自維護造成漏科
  (例:資料備份頁曾漏掉「日語」錯題本統計)。
   未來要新增/調整科目,只改這一個檔 + sw.js 版本即可。

   欄位:
     k    科目代碼(對應題庫 subj / 錯題本命名空間)
     name 短名(分頁、統計、錯題本晶片顯示用)
     wb   錯題本 localStorage key
     page 該科錯題本頁面檔名
     icon 首頁錯題本晶片圖示
   變更履歷:
     v1 (2026-09-29) 初版,含 5 科(en/jp/gh/pr/pr2)
*/
window.SUBJECTS = [
  { k:'en',  name:'英語',     wb:'wrongbook_en',  page:'錯題本.html',         icon:'📌' },
  { k:'jp',  name:'日語',     wb:'wrongbook_jp',  page:'日文錯題本.html',     icon:'🎌' },
  { k:'gh',  name:'觀光',     wb:'wrongbook_gh',  page:'觀光錯題本.html',     icon:'🛡' },
  { k:'pr',  name:'執業實務', wb:'wrongbook_pr',  page:'執業實務錯題本.html', icon:'📋' },
  { k:'pr2', name:'執業法規', wb:'wrongbook_pr2', page:'執業法規錯題本.html', icon:'⚖️' }
];
