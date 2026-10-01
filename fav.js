/* 收藏題(SSoT)· C4
   ------------------------------------------------------------------
   跨科主動收藏「重要 / 想再看」的題目(獨立於「答錯自動收錄」的錯題本)。
   儲存:localStorage['favorites'] = { "<subj>|<c>-<y>-<no>": {subj,c,y,no,ts} }
   用法:
     詳解/複習頁卡片內放 FAV.btn(subj,q);容器呼叫一次 FAV.onClick(listEl)
     收藏頁(收藏.html)用 FAV.load() 取出、由各題庫補齊內容渲染
   變更履歷:v2 (2026-10-01) 英語詳解收藏改帶考別年份;load() 自動清除舊版寫入的無效鍵(en|undefined-…)
            v1 (2026-09-29) 初版
*/
(function(){
  'use strict';
  var KEY='favorites';
  var FAV={
    load:function(){try{var o=JSON.parse(localStorage.getItem(KEY)||'{}'),bad=false;
      for(var k in o){if(k.indexOf('undefined')>=0){delete o[k];bad=true;}}   // 舊版英語詳解寫入的無效鍵,無法還原題目,直接清除
      if(bad)this.save(o);return o;}catch(e){return{};}},
    save:function(o){try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}},
    id:function(subj,q){return subj+'|'+q.c+'-'+q.y+'-'+q.no;},
    has:function(subj,q){return !!this.load()[this.id(subj,q)];},
    count:function(){return Object.keys(this.load()).length;},
    toggle:function(subj,q){var o=this.load(),k=this.id(subj,q);
      if(o[k])delete o[k]; else o[k]={subj:subj,c:q.c,y:q.y,no:q.no,ts:Date.now()};
      this.save(o); return !!this.load()[k];},
    btn:function(subj,q){var on=this.has(subj,q);
      return '<button class="favbtn'+(on?' on':'')+'" data-fav="'+subj+'|'+q.c+'-'+q.y+'-'+q.no+'" '+
             'title="'+(on?'已收藏,點擊取消':'收藏此題')+'" aria-label="收藏">'+(on?'★':'☆')+'</button>';},
    onClick:function(container){ if(!container||container._favBound)return; container._favBound=true;
      var self=this;
      container.addEventListener('click',function(e){
        var b=e.target.closest('.favbtn'); if(!b)return;
        e.preventDefault(); e.stopPropagation();
        var parts=b.dataset.fav.split('|'), cy=parts[1].split('-');
        var on=self.toggle(parts[0],{c:cy[0],y:cy[1],no:+cy[2]});
        b.classList.toggle('on',on); b.textContent=on?'★':'☆';
        b.title=on?'已收藏,點擊取消':'收藏此題';
      });}
  };
  window.FAV=FAV;
  /* 自帶樣式(免改各頁 CSS) */
  try{var css=document.createElement('style');
    css.textContent='.favbtn{border:none;background:transparent;cursor:pointer;font-size:1.15rem;line-height:1;'+
      'padding:0 3px;margin-left:4px;font-family:inherit;color:var(--sub,#8a94a6);transition:transform .1s}'+
      '.favbtn.on{color:#e8a72b}.favbtn:active{transform:scale(1.25)}';
    (document.head||document.documentElement).appendChild(css);}catch(e){}
})();
