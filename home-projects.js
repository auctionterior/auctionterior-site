(()=>{
  'use strict';
  const grid=document.getElementById('home-project-grid');
  const status=document.getElementById('home-project-status');
  if(!grid)return;
  const showStatus=(message)=>{status.textContent=message;status.hidden=false;};
  const safeImage=(path)=>{
    if(typeof path!=='string'||!path.trim())return null;
    const raw=path.trim();
    // Project photos are relative upload paths or HTTPS URLs.
    if(/^https:\/\//i.test(raw))return raw;
    if(raw.startsWith('//')||/^[a-z][a-z0-9+.-]*:/i.test(raw))return null;
    return raw;
  };
  (async()=>{
    try{
      const response=await fetch('data/projects.json',{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      if(!Array.isArray(data))throw new Error('Invalid projects format');
      // Preserve the registration order in projects.json; never reverse it.
      const projects=data.filter(p=>p&&typeof p==='object'&&p.published!==false);
      if(!projects.length){showStatus('아직 등록된 포트폴리오가 없습니다. 관리자 페이지에서 프로젝트를 등록하면 이곳에 자동으로 표시됩니다.');return;}
      const fragment=document.createDocumentFragment();
      for(const project of projects){
        const photos=Array.isArray(project.photos)?project.photos:[];
        const index=Number.isInteger(project.coverIndex)&&project.coverIndex>=0&&project.coverIndex<photos.length?project.coverIndex:0;
        const cover=safeImage(photos[index])||photos.map(safeImage).find(Boolean);
        const card=document.createElement('article');card.className='tile';
        const link=document.createElement('a');link.href='portfolio.html';link.setAttribute('aria-label',`${String(project.title||'시공 프로젝트')} 포트폴리오 보기`);
        const crop=document.createElement('div');crop.className='crop';
        if(cover){const img=document.createElement('img');img.src=cover;img.alt=`${String(project.title||'시공 프로젝트')} 대표사진`;img.loading='lazy';crop.appendChild(img);}
        else {crop.style.cssText='aspect-ratio:4/3;display:grid;place-items:center;background:#302b25;color:#bca07b';crop.textContent='AUCTIONTERIOR';}
        const title=document.createElement('h3');title.textContent=String(project.title||'시공 프로젝트');
        const detail=document.createElement('p');detail.textContent=[project.category==='residential'?'주거공간':project.category==='commercial'?'상업공간':'시공 프로젝트',project.area,project.description].filter(Boolean).map(String).join(' · ');
        link.append(crop,title);card.append(link,detail);fragment.append(card);
      }
      grid.replaceChildren(fragment);
    }catch(error){console.warn('메인 포트폴리오 로딩 실패:',error);showStatus('포트폴리오를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.');}
  })();
})();
