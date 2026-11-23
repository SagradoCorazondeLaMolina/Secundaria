(()=>{'use strict';
const STUDENTS = PHOTOS.map((p,i)=>({index:i,name:p.name || ('Estudiante '+String(i+1).padStart(2,'0')),photo:p.file,title:p.title||''}));

const stage=document.getElementById('stage');
if(stage){
  stage.innerHTML='';
  let current=0;
  const entries=PHOTOS.map((p,i)=>{
    const fig=document.createElement('figure');
    fig.className=i===0?'active':'';
    const img=document.createElement('img');
    img.src=p.file;
    img.alt=p.name ? ('Retrato de '+p.name) : ('Fotografía de graduación '+(i+1));
    img.loading=i<2?'eager':'lazy';
    fig.appendChild(img);
    stage.appendChild(fig);
    return fig;
  });
  const counter=document.getElementById('counter');
  const setCounter=()=>{ if(counter) counter.textContent=String(current+1).padStart(2,'0')+' / '+entries.length; };
  setCounter();
  const next=()=>{ entries[current].classList.remove('active'); current=(current+1)%entries.length; entries[current].classList.add('active'); setCounter(); };
  let timer=setInterval(next,3600);
  document.addEventListener('visibilitychange',()=>{ clearInterval(timer); if(!document.hidden) timer=setInterval(next,3600); });
}

const audio=document.getElementById('audio');
const musicButtons=[document.getElementById('music'),document.getElementById('floatingMusic')].filter(Boolean);
if(audio && musicButtons.length){
  const sync=()=>musicButtons.forEach(btn=>{ 
    btn.setAttribute('aria-pressed',String(!audio.paused)); 
    if(btn.id==='music') { btn.textContent=audio.paused?'♫':'Ⅱ'; btn.setAttribute('aria-label',audio.paused?'Reproducir música':'Pausar música'); }
    else btn.textContent=(audio.paused?'♫ Música':'Ⅱ Música');
  });
  musicButtons.forEach(btn=>btn.addEventListener('click',async()=>{ try{ if(audio.paused) await audio.play(); else audio.pause(); }catch(e){ alert('No se pudo reproducir la música.'); } }));
  audio.addEventListener('play',sync); audio.addEventListener('pause',sync); sync();
}

const grid=document.getElementById('grid');
const box=document.getElementById('lightbox');
let selected=0;
if(grid){
  PHOTOS.forEach((p,i)=>{
    const article=document.createElement('article'); article.className='tile reveal';
    const img=document.createElement('img'); img.src=p.file; img.alt='Retrato de '+(p.name||('estudiante '+(i+1))); img.loading='lazy'; img.addEventListener('click',()=>open(i));
    const cap=document.createElement('div'); cap.className='name'; cap.textContent=p.name || ('Recuerdo '+String(i+1).padStart(2,'0'));
    const down=document.createElement('a'); down.href=p.file; down.download='SCM_Graduacion_6to_'+(p.name||String(i+1).padStart(2,'0'))+'.webp'; down.className='download'; down.textContent='↓ Descargar';
    article.append(img,cap,down); grid.append(article);
  });
}
const lightImg=document.getElementById('lightImg'); const lightDownload=document.getElementById('lightDownload');
function open(i){ if(!box) return; selected=(i+PHOTOS.length)%PHOTOS.length; lightImg.src=PHOTOS[selected].file; lightImg.alt='Retrato de '+(PHOTOS[selected].name||('estudiante '+(selected+1))); lightDownload.href=PHOTOS[selected].file; lightDownload.download='SCM_Graduacion_6to_'+(PHOTOS[selected].name||String(selected+1).padStart(2,'0'))+'.webp'; box.classList.add('open'); document.body.style.overflow='hidden'; document.getElementById('lightCount').textContent=(selected+1)+' / '+PHOTOS.length; }
function close(){ if(box){ box.classList.remove('open'); document.body.style.overflow=''; }}
if(box){ document.getElementById('lbclose').onclick=close; document.getElementById('prev').onclick=()=>open(selected-1); document.getElementById('next').onclick=()=>open(selected+1); box.onclick=e=>{if(e.target===box) close()}; document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); if(box.classList.contains('open')&&e.key==='ArrowLeft') open(selected-1); if(box.classList.contains('open')&&e.key==='ArrowRight') open(selected+1);}); let x=0; box.addEventListener('touchstart',e=>{x=e.changedTouches[0].screenX},{passive:true}); box.addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-x; if(Math.abs(d)>60) open(selected+(d<0?1:-1));},{passive:true}); }

if('IntersectionObserver' in window){ const io=new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('shown'); io.unobserve(entry.target); }}),{threshold:.1}); document.querySelectorAll('.reveal').forEach(node=>io.observe(node)); } else document.querySelectorAll('.reveal').forEach(node=>node.classList.add('shown'));

const graduates=document.getElementById('graduates-list');
if(graduates){
  const list=document.createElement('div');
  list.className='graduate-text-list';
  [...STUDENTS].sort((a,b)=>a.name.localeCompare(b.name,'es')).forEach((student,idx)=>{
    const item=document.createElement('div');
    item.className='graduate-list-item';
    const num=document.createElement('span');
    num.className='graduate-num';
    num.textContent=String(idx+1).padStart(2,'0');
    const name=document.createElement('strong');
    name.textContent=student.name;
    item.append(num,name);
    list.appendChild(item);
  });
  graduates.appendChild(list);
}


if(document.getElementById('days')){
  const eventDate=new Date('2026-12-05T17:00:00-05:00');
  const note=document.getElementById('countdown-note');
  const ids=['days','hours','minutes','seconds'];
  const tick=()=>{
    const diff=Math.max(0,eventDate.getTime()-Date.now());
    const values=[Math.floor(diff/86400000), Math.floor((diff%86400000)/3600000), Math.floor((diff%3600000)/60000), Math.floor((diff%60000)/1000)];
    values.forEach((v,i)=>{ const el=document.getElementById(ids[i]); if(el) el.textContent=String(v).padStart(2,'0'); });
    if(diff===0 && note) note.textContent='¡Llegó el gran día! Hoy celebramos juntos esta graduación inolvidable.';
  };
  tick(); setInterval(tick,1000);
}

const cal=document.getElementById('calendar');
if(cal) cal.onclick=()=>{ const data=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SCM//Graduacion 6to//ES','BEGIN:VEVENT','UID:scm-6to-2026@graduacion','DTSTART:20261205T220000Z','DTEND:20261206T000000Z','SUMMARY:Graduación 6.º Primaria - SCM','LOCATION:Jirón El Bucaré 351\, La Molina\, Lima\, Perú','DESCRIPTION:Graduación de sexto grado de primaria del Colegio Sagrado Corazón de La Molina','END:VEVENT','END:VCALENDAR'].join('\r\n'); const link=document.createElement('a'); const url=URL.createObjectURL(new Blob([data],{type:'text/calendar'})); link.href=url; link.download='Graduacion_6to_Primaria_SCM_2026.ics'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),2000); };

const share=document.getElementById('share');
if(share) share.onclick=async()=>{ if(navigator.share){ try{ await navigator.share({title:document.title,url:location.href,text:'¡Celebremos la graduación de 6.º grado de Primaria SCM 2026!'});}catch(e){} } else { try{ await navigator.clipboard.writeText(location.href); alert('Enlace copiado'); }catch(e){ alert(location.href); } } };
})();