(()=>{
 const box=document.getElementById('published-projects');if(!box)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const modal=document.createElement('div');modal.className='portfolio-lightbox';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','시공 사진 갤러리');modal.hidden=true;
 modal.innerHTML='<button class="lightbox-close" type="button" aria-label="닫기">×</button><div class="lightbox-stage"><button class="lightbox-arrow lightbox-prev" type="button" aria-label="이전 사진">‹</button><img class="lightbox-photo" alt=""><button class="lightbox-arrow lightbox-next" type="button" aria-label="다음 사진">›</button></div><div class="lightbox-footer"><span class="lightbox-title"></span><span class="lightbox-count"></span></div>';
 document.body.append(modal);
 let active=[],current=0,projectTitle='',lastFocus=null,touchX=null;
 const photo=modal.querySelector('.lightbox-photo');
 function show(i){if(!active.length)return;current=(i+active.length)%active.length;photo.src=active[current];photo.alt=`${projectTitle} 시공 사진 ${current+1}`;modal.querySelector('.lightbox-count').textContent=`${current+1} / ${active.length}`;modal.querySelector('.lightbox-title').textContent=projectTitle;modal.querySelectorAll('.lightbox-arrow').forEach(b=>b.hidden=active.length<2)}
 function openGallery(photos,title){if(!photos.length)return;lastFocus=document.activeElement;active=photos;projectTitle=title;modal.hidden=false;document.body.classList.add('lightbox-open');show(0);modal.querySelector('.lightbox-close').focus()}
 function closeGallery(){modal.hidden=true;document.body.classList.remove('lightbox-open');photo.removeAttribute('src');if(lastFocus&&lastFocus.focus)lastFocus.focus()}
 modal.querySelector('.lightbox-close').onclick=closeGallery;
 modal.querySelector('.lightbox-prev').onclick=()=>show(current-1);
 modal.querySelector('.lightbox-next').onclick=()=>show(current+1);
 modal.addEventListener('click',e=>{if(e.target===modal)closeGallery()});
 document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')closeGallery();else if(e.key==='ArrowLeft')show(current-1);else if(e.key==='ArrowRight')show(current+1)});
 photo.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX},{passive:true});
 photo.addEventListener('touchend',e=>{if(touchX===null)return;const delta=e.changedTouches[0].screenX-touchX;if(Math.abs(delta)>45)show(current+(delta<0?1:-1));touchX=null},{passive:true});
 (async()=>{try{
 const res=await fetch('data/projects.json?v='+Date.now(),{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
 const all=await res.json(),kind=box.dataset.category,items=all.filter(p=>p.published!==false&&(kind==='all'||p.category===kind));if(!items.length)return;
 const root=document.getElementById('project-list');items.slice().reverse().forEach(p=>{
 const card=document.createElement('article');card.className='project-card';const photos=(p.photos||[]).filter(x=>typeof x==='string'&&x.trim()).map(x=>encodeURI(x));
 const coverIndex=Number.isInteger(p.coverIndex)&&p.coverIndex>=0&&p.coverIndex<photos.length?p.coverIndex:0;const ordered=photos.length?[photos[coverIndex],...photos.filter((_,i)=>i!==coverIndex)]:[];const cover=ordered[0];card.innerHTML=`<div class="project-cover-wrap"></div><div class="details"><div class="eyebrow">${p.category==='residential'?'RESIDENTIAL':'COMMERCIAL'} ${esc(p.area||'')}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${photos.length?`<span class="project-photo-count">사진 ${photos.length}장 · 클릭하여 보기 ↗</span>`:''}</div>`;
 if(cover){const button=document.createElement('button');button.type='button';button.className='project-cover-button';button.setAttribute('aria-label',`${p.title} 사진 ${photos.length}장 보기`);const img=document.createElement('img');img.className='cover';img.src=cover;img.alt=`${p.title} 대표사진`;img.loading='lazy';button.append(img);const hint=document.createElement('span');hint.className='project-cover-hint';hint.textContent='VIEW PROJECT  ↗';button.append(hint);button.onclick=()=>openGallery(ordered,String(p.title||''));card.querySelector('.project-cover-wrap').append(button)}
 root.append(card)});box.hidden=false;
 }catch(e){console.warn('포트폴리오 불러오기 실패:',e)}})();
})();
