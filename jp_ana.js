/* 外語日語 · AI 輔助解析(以官方標準答案為準)
   鍵值:證照-年-題號(如 guide-108-1)。值:
   {t:大類, tt:細類, zh:整句中譯,
    a:解析(可含 <b class='ac'>綠正解</b> / <b class='wr'>紅陷阱</b>),
    v:難字[[詞, 假名讀音, 中文, 重音(東京式核位置 0=平板,可省)], ...],
    s:解題技巧, n:注意}
   逐年逐批補寫。 */
const JPANA={};
if(typeof window!=='undefined')window.JPANA=JPANA;
