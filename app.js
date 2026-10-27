(function(){
  const book=document.getElementById('book');
  const sheets=[...book.querySelectorAll('.sheet')];
  const total=sheets.length;
  const ind=document.getElementById('ind');
  const prev=document.getElementById('prev'),next=document.getElementById('next');
  let cur=0; // hojas ya pasadas

  function size(){
    const h=Math.min(innerHeight-150,(innerWidth-40)/2/0.74);
    const ph=Math.max(300,h);
    document.documentElement.style.setProperty('--ph',ph+'px');
    document.documentElement.style.setProperty('--pw',(ph*0.74)+'px');
  }
  function render(){
    sheets.forEach((s,i)=>{
      const f=i<cur;
      s.classList.toggle('flipped',f);
      setTimeout(()=>{s.style.zIndex=f?i+1:total-i;},f?450:450);
    });
    book.classList.toggle('start',cur===0);
    book.classList.toggle('end',cur===total);
    prev.disabled=cur===0;next.disabled=cur===total;
    ind.textContent=cur===0?'Portada':cur===total?'Contraportada':'Páginas '+(2*cur)+' y '+(2*cur+1);
  }
  function go(n){cur=Math.max(0,Math.min(total,n));render();}
  sheets.forEach((s,i)=>{
    s.style.zIndex=total-i;
    s.querySelector('.front').addEventListener('click',()=>go(i+1));
    s.querySelector('.back').addEventListener('click',()=>go(i));
  });
  prev.onclick=()=>go(cur-1);next.onclick=()=>go(cur+1);
  document.getElementById('home').onclick=()=>go(0);
  document.getElementById('full').onclick=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();};
  document.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',e=>{
    e.stopPropagation();go(Math.floor(+a.dataset.page/2));
  }));
  addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='PageDown')go(cur+1);
    else if(e.key==='ArrowLeft'||e.key==='PageUp')go(cur-1);
    else if(e.key==='Home')go(0);else if(e.key==='End')go(total);
    else if(e.key==='f'||e.key==='F')document.getElementById('full').click();
  });
  let x0=null;
  addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
  addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)go(cur+(d<0?1:-1));x0=null;});
  function fit(){document.querySelectorAll('.txt').forEach(t=>{let lo=.62,hi=1.3;for(let i=0;i<10;i++){const m=(lo+hi)/2;t.style.fontSize=m+'em';if(t.scrollHeight>t.clientHeight+1)hi=m;else lo=m;}t.style.fontSize=lo+'em';});}
  addEventListener('resize',()=>{size();fit();});
  size();render();fit();if(document.fonts)document.fonts.ready.then(fit);
})();
