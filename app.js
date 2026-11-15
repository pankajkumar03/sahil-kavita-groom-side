const $=s=>document.querySelector(s);
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease='cubic-bezier(.22,1,.36,1)';
const nextFrame=()=>new Promise(requestAnimationFrame);
const animate=async(el,frames,options={})=>{if(reducedMotion())return;const animation=el.animate(frames,{duration:700,easing:ease,...options});try{await animation.finished}catch{}finally{animation.cancel()}};
const imageCache=new Map();function prepareImage(src){if(!imageCache.has(src)){const img=new Image();img.src=src;imageCache.set(src,img.decode().catch(()=>{}))}return imageCache.get(src)}
const scrollSize=new ResizeObserver(entries=>entries.forEach(e=>{e.target.style.setProperty('--scroll-height',e.contentRect.height+'px');e.target.style.setProperty('--scroll-rise',e.contentRect.height*.78+'px')}));scrollSize.observe($('.scroll-card'));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('visible');observer.unobserve(e.target);if(e.boundingClientRect.top<-e.boundingClientRect.height*.35)return;
 if(e.target.matches('.person')){animate(e.target,[{transform:'translate3d(0,40px,0)'},{transform:'translate3d(0,0,0)'}],{duration:900});const portrait=e.target.querySelector('.portrait');const photo=portrait.querySelector('img');const revealPhoto=()=>animate(photo,[{opacity:.35},{opacity:1}],{duration:1000});if(photo){if(photo.complete&&photo.naturalWidth)revealPhoto();else photo.decode().then(revealPhoto).catch(()=>{});}e.target.querySelectorAll(':scope>.eyebrow,:scope>h3,:scope>.profile-rule,:scope>p').forEach((child,i)=>animate(child,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:750,delay:300+i*90}));}
 else animate(e.target,[{opacity:0,transform:'translate3d(0,40px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:900});
}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
document.querySelectorAll('.reveal:not(.scroll-unfurl)').forEach(el=>observer.observe(el));
const scrollObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;scrollObserver.unobserve(e.target);e.target.classList.add('visible');if(e.boundingClientRect.top < -e.boundingClientRect.height*.3)return;const height=e.target.getBoundingClientRect().height;animate(e.target,[{clipPath:'inset(0 0 78% 0)'},{clipPath:'inset(0 0 0% 0)'}],{duration:1850});$('.scroll-copy').querySelectorAll(':scope>*').forEach((child,i)=>animate(child,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:350+i*75}));}),{threshold:0,rootMargin:'0px 0px 120px 0px'});
scrollObserver.observe($('.scroll-unfurl'));
const sceneryObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-active',e.isIntersecting)),{rootMargin:'100px'});document.querySelectorAll('.hero,.couple,.memories').forEach(el=>sceneryObserver.observe(el));
function pauseBackgroundMotion(){document.body.classList.toggle('motion-paused',document.hidden)}document.addEventListener('visibilitychange',pauseBackgroundMotion);pauseBackgroundMotion();
const main=$('main');main.inert=true;let openingBusy=false;
$('#open').onclick=async()=>{if(openingBusy)return;openingBusy=true;startBackgroundMusic();$('#open').disabled=true;const opening=$('#opening');const hero=$('.hero-art');if(hero&&!hero.complete){try{await hero.decode()}catch{}}document.body.classList.add('invitation-open');window.scrollTo({top:0,behavior:'instant'});opening.classList.add('unsealing');if(!reducedMotion()){for(let i=0;i<24;i++){const spark=document.createElement('i');spark.className='spark';const angle=Math.random()*Math.PI*2,distance=80+Math.random()*240;spark.style.setProperty('--x',Math.cos(angle)*distance+'px');spark.style.setProperty('--y',Math.sin(angle)*distance+'px');$('.opening-scene').append(spark)}}await animate($('.opening-scene'),[{transform:'scale(1)',opacity:1},{transform:'scale(1.035)',opacity:1,offset:.45},{transform:'scale(1.08)',opacity:0}],{duration:1750});document.body.classList.remove('sealed');main.inert=false;opening.hidden=true;opening.querySelectorAll('.spark').forEach(e=>e.remove());await nextFrame();window.scrollTo({top:0,behavior:'instant'});$('#home').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})};
$('.scroll-down').onclick=()=>$('#invitation').scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});
let revealDate=false,dragY=0,dragActive=false,dragDidMove=false;
async function openDate(){if(revealDate)return;revealDate=true;const cover=$('#date-open');cover.disabled=true;$('#date-content').inert=false;$('#date-content').classList.add('shown');const from=getComputedStyle(cover).transform;
 if(!reducedMotion()){for(let i=0;i<16;i++){const confetti=document.createElement('i');confetti.className='spark date-spark';const angle=Math.random()*Math.PI*2,distance=70+Math.random()*110;confetti.style.setProperty('--x',Math.cos(angle)*distance+'px');confetti.style.setProperty('--y',Math.sin(angle)*distance+'px');confetti.style.background=['#e5c16b','#f3b9bf','#fff1bd'][i%3];$('.date-surprise').append(confetti);setTimeout(()=>confetti.remove(),1800)}}
 await animate(cover,[{transform:from==='none'?'translateY(0)':from,opacity:1},{transform:'translateY(104%)',opacity:0}],{duration:1200});cover.hidden=true;$('#date-content').focus({preventScroll:true})}
$('#date-open').onclick=()=>{if(dragDidMove){dragDidMove=false;return}openDate()};
$('#date-open').addEventListener('pointerdown',e=>{if(revealDate)return;dragY=e.clientY;dragActive=true;dragDidMove=false;$('#date-open').setPointerCapture(e.pointerId)});
$('#date-open').addEventListener('pointermove',e=>{if(!dragActive||revealDate)return;const delta=Math.max(0,e.clientY-dragY);if(delta>3){dragDidMove=true;$('#date-open').style.transform=`translateY(${Math.min(80,delta*.65)}px)`}});
$('#date-open').addEventListener('pointerup',async e=>{if(!dragActive)return;dragActive=false;const cover=$('#date-open'),delta=e.clientY-dragY;if(delta>32){openDate();return}if(dragDidMove){const from=getComputedStyle(cover).transform;cover.style.transform='';await animate(cover,[{transform:from},{transform:'translateY(0)'}],{duration:400})}});
$('#date-open').addEventListener('pointercancel',()=>{dragActive=false;if(!revealDate)$('#date-open').style.transform=''});
const wedding=new Date('2026-11-21T19:15:00+05:30');function countdown(){let diff=Math.max(0,wedding-Date.now());for(const [id,unit]of [['days',86400000],['hours',3600000],['minutes',60000],['seconds',1000]]){const n=Math.floor(diff/unit);$('#'+id).textContent=String(n).padStart(2,'0');diff%=unit}}countdown();setInterval(countdown,1000);
const events=[{"name": "Baan", "day": "TUESDAY, 17 NOVEMBER 2026", "short": "17 Nov 2026", "time": "12:00 PM", "date": "2026-11-17", "start": "2026-11-17T12:00:00+05:30", "place": "", "dress": "", "art": 0, "desc": "An afternoon of traditional rituals, blessings and joy with the Khatiwal family.", "group": "Family Functions"}, {"name": "Mehndi", "day": "THURSDAY, 19 NOVEMBER 2026", "short": "19 Nov 2026", "time": "9:15 PM", "date": "2026-11-19", "start": "2026-11-19T21:15:00+05:30", "place": "", "dress": "", "art": 1, "desc": "Join our family for an evening of henna, music and celebration.", "group": "Family Functions"}, {"name": "Bhaat", "day": "SATURDAY, 21 NOVEMBER 2026", "short": "21 Nov 2026", "time": "7:15 AM", "date": "2026-11-21", "start": "2026-11-21T07:15:00+05:30", "place": "", "dress": "", "art": 2, "desc": "A morning of family traditions and blessings with the Khatiwal family.", "group": "Family Functions"}, {"name": "Reception of Baraat", "day": "SATURDAY, 21 NOVEMBER 2026", "short": "21 Nov 2026", "time": "7:15 PM", "date": "2026-11-21", "start": "2026-11-21T19:15:00+05:30", "place": "Maan Palace, Near Bus Stop, Dangar Khera, Punjab", "dress": "", "art": 3, "desc": "With warm hearts, we welcome Gaurav and the baraat for Divya’s wedding.", "group": "Divya & Gaurav"}, {"name": "Dinner", "day": "SATURDAY, 21 NOVEMBER 2026", "short": "21 Nov 2026", "time": "8:15 PM", "date": "2026-11-21", "start": "2026-11-21T20:15:00+05:30", "place": "Maan Palace, Near Bus Stop, Dangar Khera, Punjab", "dress": "", "art": 4, "desc": "Celebrate Divya and Gaurav over dinner with family and friends.", "group": "Divya & Gaurav"}, {"name": "Doli", "day": "SUNDAY, 22 NOVEMBER 2026", "short": "22 Nov 2026", "time": "5:15 AM", "date": "2026-11-22", "start": "2026-11-22T05:15:00+05:30", "place": "Maan Palace, Near Bus Stop, Dangar Khera, Punjab", "dress": "", "art": 5, "desc": "With love and blessings, we bid Divya farewell as she begins a new chapter.", "group": "Divya & Gaurav"}, {"name": "Departure of Baraat", "day": "SUNDAY, 22 NOVEMBER 2026", "short": "22 Nov 2026", "time": "7:15 PM", "date": "2026-11-22", "start": "2026-11-22T19:15:00+05:30", "place": "", "dress": "", "art": 6, "desc": "You are requested to accompany Sahil and the baraat to Maan Palace, Near Bus Stand, Dangar Khera, Punjab.", "group": "Sahil & Kavita"}];let page=-1;
const book=$('#wedding-book');
let bookBusy=false;
function lockBook(locked){bookBusy=locked;$('#previous').disabled=locked||page<0;$('#next').disabled=locked||page===events.length-1;$('#book-open').disabled=locked;document.querySelectorAll('#book-spread button').forEach(el=>el.disabled=locked)}

$('#event-index').innerHTML=events.map(e=>`<span class="cover-event"><b>${e.name}</b><i></i><small>${e.short.replace(' 2026','')}</small></span>`).join('');
const clockIcon="<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 7v5l3 2\"/></svg>",pinIcon="<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"2\"/></svg>";
function alignBook(){const r=book.getBoundingClientRect();if(r.top<16||r.top>100||r.bottom+75>innerHeight)book.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'})}function showEvent(){const isOpen=page>=0;book.classList.toggle('is-open',isOpen);$('#book-open').hidden=isOpen;$('#book-spread').hidden=!isOpen;$('#book-open').setAttribute('aria-expanded',String(isOpen));$('#previous').disabled=bookBusy||!isOpen;$('#next').disabled=bookBusy||page===events.length-1;$('#page-count').textContent=isOpen?`0${page+1} / 0${events.length}`:'COVER';if(!isOpen)return;const e=events[page];$('#event-number').textContent=e.group;$('#event-art').style.backgroundPosition=`${(e.art%3)*50}% ${Math.floor(e.art/3)*50}%`;$('#event-art').setAttribute('aria-label',e.name+' celebration illustration');$('#event-caption').textContent=e.desc;$('#event-page').innerHTML=`<span class="event-detail-ornament">✦</span><h3 class="${e.name.length>12?'long-event-title':''}">${e.name}</h3><p class="eyebrow">${e.day}</p><div class="fine-line"></div><p class="event-time"><span class="inline-icon">${clockIcon}</span><span>${e.time}${e.start?' onwards':''}</span></p>${e.place?`<p class="event-location"><span class="inline-icon">${pinIcon}</span><span>${e.place}</span></p>`:''}<p class="event-dress">${e.dress}</p><div class="event-actions">${e.place?`<a class="event-directions" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.place)}" target="_blank" rel="noopener">Get Directions ›</a>`:''}<button class="event-calendar" id="event-calendar">Add to Calendar ›</button></div><button class="page-button event-close" id="book-close">‹ Close</button><button class="page-button event-next" id="event-next">${page===events.length-1?'Back to cover':'Next ›'}</button>`;$('#event-page').querySelectorAll('button').forEach(el=>el.disabled=bookBusy);$('#book-close').onclick=()=>changeEvent(-1);$('#event-next').onclick=()=>changeEvent(page===events.length-1?-1:page+1);$('#event-calendar').onclick=()=>downloadEventCalendar(page)}


function downloadEventCalendar(index){
 const e=events[index];
 const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const text=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Khatiwal Family Weddings//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${index}-kavita-sahil@kavita-sahil.invitation`,`DTSTAMP:${stamp(new Date())}`,e.start?`DTSTART:${stamp(new Date(e.start))}`:`DTSTART;VALUE=DATE:${e.date.replace(/-/g,'')}`,`SUMMARY:${text(e.name+' - '+e.group)}`,`DESCRIPTION:${text(e.time+'\n'+e.desc)}`,...(e.place?[`LOCATION:${text(e.place)}`]:[]),'END:VEVENT','END:VCALENDAR',''].join('\r\n');
 const url=URL.createObjectURL(new Blob([content],{type:'text/calendar'})),a=document.createElement('a');a.href=url;a.download=e.name+'.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}

function copyForTurn(node){const copy=node.cloneNode(true);copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));copy.inert=true;copy.setAttribute('aria-hidden','true');return copy}
async function changeEvent(target){
 if(bookBusy)return;if(target<0){await transitionBook(false);return}const restoreFocus=$('#event-page').contains(document.activeElement);lockBook(true);
 {const spread=$('#book-spread'),forward=target>page,mobile=matchMedia('(max-width:600px)').matches,leaf=document.createElement('div');leaf.className='turn-leaf '+(forward?'turn-forward':'turn-back');leaf.setAttribute('aria-hidden','true');
 const surface=copyForTurn(mobile?spread:(forward?$('#event-page'):$('.event-illustration-page')));if(mobile)surface.className='turn-surface';leaf.append(surface);spread.append(leaf);page=target;showEvent();alignBook();
 await animate(leaf,[{transform:'perspective(1600px) rotateY(0deg)',opacity:1},{transform:`perspective(1600px) rotateY(${forward?-165:165}deg)`,opacity:.05}],{duration:1050,easing:'cubic-bezier(.45,.05,.2,1)'});leaf.remove();
 }
 lockBook(false);if(target<0)$('#book-open').focus({preventScroll:true});else if(restoreFocus)$('#event-next').focus({preventScroll:true})
}
async function transitionBook(opening){
 if(bookBusy)return;lockBook(true);let ghost,outgoing;const cover=$('#book-open'),spread=$('#book-spread');
 try{await prepareImage('assets/lantern-event-atlas.png');const before=book.getBoundingClientRect();
 if(reducedMotion()){page=opening?0:-1;showEvent();return}
 ghost=copyForTurn(cover);ghost.hidden=false;ghost.classList.add('book-cover-motion');ghost.style.width=before.width+'px';
 if(!opening){outgoing=copyForTurn(spread);outgoing.classList.add('book-pages-motion');outgoing.style.width=before.width+'px';outgoing.style.height=before.height+'px';}
 page=opening?0:-1;showEvent();const after=book.getBoundingClientRect();cover.style.visibility=opening?'':'hidden';
 if(outgoing)book.append(outgoing);book.append(ghost);
 const wide=opening?after.width:before.width;const coverOpenWidth=matchMedia('(max-width:600px)').matches?wide:wide/2;
 const duration=1100;const easing='cubic-bezier(.4,0,.2,1)';
 await Promise.all([
 animate(book,[{width:before.width+'px',height:before.height+'px'},{width:after.width+'px',height:after.height+'px'}],{duration,easing}),
 animate(ghost,opening?[{width:before.width+'px',transform:'rotateY(0deg)',opacity:1},{width:coverOpenWidth+'px',transform:'rotateY(-148deg)',opacity:1}]:[{width:coverOpenWidth+'px',transform:'rotateY(-148deg)',opacity:1},{width:after.width+'px',transform:'rotateY(0deg)',opacity:1}],{duration,easing}),
 animate(opening?spread:outgoing,opening?[{opacity:1,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}]:[{opacity:1},{opacity:1,offset:.65},{opacity:0}],{duration,easing})
 ]);
 }finally{ghost?.remove();outgoing?.remove();cover.style.visibility='';lockBook(false);if(opening)$('#event-next').focus({preventScroll:true});else cover.focus({preventScroll:true})}
}
async function openBook(){await transitionBook(true)}
$('#book-open').onclick=openBook;$('#previous').onclick=()=>changeEvent(Math.max(-1,page-1));$('#next').onclick=()=>{if(page<0)openBook();else changeEvent(Math.min(events.length-1,page+1))};showEvent();
const photoAlts=["Kavita and Sahil smiling at each other", "Kavita and Sahil dancing together", "Kavita and Sahil in the garden", "Kavita and Sahil holding hands", "Kavita and Sahil, forehead to forehead", "Kavita resting beside Sahil", "Kavita and Sahil smiling together"];
const photoFiles=["assets/updated-photo-1.png", "assets/updated-photo-2.png", "assets/updated-photo-3.png", "assets/updated-photo-4.png", "assets/updated-photo-5.png", "assets/updated-photo-7.png", "assets/updated-photo-8.png"];
let selectedMemoryCouple='divya';
const divyaPhotoFiles=Array.from({length:7},(_,i)=>`assets/divya-gaurav-${i+1}.png`);
const memoryPhotoCount=()=>photoFiles.length;
const memoryTrack=$('.memory-track'),memoryViewer=$('.memory-viewer'),memoryStack=$('.photo-stack');
let memoryNavTarget=null;
let memoryProgress=null,memoryLastTime=0,paintedPhotoIndex=-1;
let photoIndex=0,memoryStep=400,memoryStart=0,memoryActive=false,memoryFrame=0,swipeX=0,swipeY=0,photoDragged=false;
const memoryCards=divyaPhotoFiles.map((src,i)=>{const card=document.createElement('button');card.className='memory-card';card.type='button';card.setAttribute('aria-label','Open photo '+(i+1));const img=document.createElement('img');img.src=src;img.alt=`Divya and Gaurav — memory ${i+1}`;img.loading='eager';img.decoding='async';img.decode().then(()=>queueMemories()).catch(()=>{});card.append(img);card.style.zIndex=String(photoFiles.length-i);memoryStack.append(card);card.addEventListener('click',()=>{if(photoDragged){photoDragged=false;return}if(i!==photoIndex)return;$('#lightbox img').src=img.src;$('#lightbox img').alt=img.alt;$('#lightbox').showModal();animate($('#lightbox'),[{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:350})});return card});
function renderMemories(now=performance.now(),immediate=false){
 memoryFrame=0;const target=Math.max(0,Math.min(memoryPhotoCount()-1,(scrollY-memoryStart)/memoryStep));
 const dt=Math.min(64,Math.max(1,now-memoryLastTime||16));memoryLastTime=now;
 if(memoryProgress===null||immediate||reducedMotion())memoryProgress=reducedMotion()?Math.round(target):target;
 else{memoryProgress+=(target-memoryProgress)*(1-Math.exp(-dt/70));if(Math.abs(target-memoryProgress)<.0005)memoryProgress=target}
 const progress=memoryProgress;if(memoryNavTarget!==null&&Math.abs(target-memoryNavTarget)<.015)memoryNavTarget=null;
 const nextIndex=Math.min(memoryPhotoCount()-1,Math.floor(progress+.5));photoIndex=nextIndex;const width=memoryStack.clientWidth;
 memoryCards.forEach((card,i)=>{const exit=Math.max(0,Math.min(1,progress-i)),depth=Math.max(0,Math.min(3,i-progress)),tilt=i%2===0?2:-3;card.style.transform=`translate3d(${-exit*width*1.38}px,${depth*5-exit*36}px,0) rotate(${tilt-exit*22}deg) scale(${1-depth*.025})`;card.style.opacity=String(exit>.9?(1-exit)*10:1);card.style.visibility=exit>=1?'hidden':'visible'});
 if(nextIndex!==paintedPhotoIndex){paintedPhotoIndex=nextIndex;memoryCards.forEach((card,i)=>{card.inert=i!==nextIndex;card.style.pointerEvents=i===nextIndex?'auto':'none';card.setAttribute('aria-hidden',String(i!==nextIndex))});$('#photo-count').textContent=`0${nextIndex+1} / 0${memoryPhotoCount()}`;$('#photo-prev').disabled=nextIndex===0;$('#photo-next').disabled=nextIndex===memoryPhotoCount()-1;}
 if(memoryActive&&Math.abs(target-progress)>.0005&&!memoryFrame)memoryFrame=requestAnimationFrame(renderMemories);
}
function queueMemories(){if(memoryActive&&!memoryFrame)memoryFrame=requestAnimationFrame(renderMemories)}
function measureMemories(){
 if(memoryFrame){cancelAnimationFrame(memoryFrame);memoryFrame=0}
 const viewportWidth=document.documentElement.clientWidth;memoryViewer.style.setProperty('--gallery-width',viewportWidth+'px');
 const overhead=memoryViewer.offsetHeight-memoryStack.offsetHeight,photoHeight=Math.max(96,innerHeight-32-overhead);
 const baseWidth=Math.min(innerWidth<=600?300:340,viewportWidth*(innerWidth<=600?.73:.72),memoryStack.parentElement.clientWidth);
 const photoWidth=Math.floor(Math.min(baseWidth,photoHeight/1.3));if(Math.abs(memoryStack.clientWidth-photoWidth)>1)memoryViewer.style.setProperty('--memory-photo-width',photoWidth+'px');
 memoryStep=Math.max(240,innerHeight*.62);const stickyTop=Math.max(16,(innerHeight-memoryViewer.offsetHeight)/2);memoryViewer.style.top=stickyTop+'px';
 memoryTrack.style.height=(memoryViewer.offsetHeight+(memoryPhotoCount()-1+.55)*memoryStep)+'px';
 memoryStart=memoryTrack.getBoundingClientRect().top+scrollY-stickyTop;renderMemories(performance.now(),true);
}
const memoryObserver=new IntersectionObserver(entries=>{memoryActive=entries[0].isIntersecting;if(memoryActive)queueMemories()},{rootMargin:'200px'});memoryObserver.observe(memoryTrack);
window.addEventListener('scroll',queueMemories,{passive:true});window.addEventListener('wheel',()=>{memoryNavTarget=null},{passive:true});window.addEventListener('touchstart',()=>{memoryNavTarget=null},{passive:true});window.addEventListener('resize',measureMemories,{passive:true});new ResizeObserver(measureMemories).observe(memoryViewer);document.fonts.ready.then(measureMemories);measureMemories();
function advancePhoto(direction){const target=Math.max(0,Math.min(photoFiles.length-1,(memoryNavTarget??photoIndex)+direction));memoryNavTarget=target;window.scrollTo({top:memoryStart+target*memoryStep,behavior:reducedMotion()?'instant':'smooth'})}
$('#photo-prev').onclick=()=>advancePhoto(-1);$('#photo-next').onclick=()=>advancePhoto(1);
memoryStack.addEventListener('pointerdown',e=>{swipeX=e.clientX;swipeY=e.clientY;photoDragged=false});memoryStack.addEventListener('pointerup',e=>{const dx=e.clientX-swipeX,dy=e.clientY-swipeY;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){photoDragged=true;advancePhoto(dx<0?1:-1)}});memoryStack.addEventListener('pointercancel',()=>{photoDragged=false});memoryStack.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();advancePhoto(e.key==='ArrowRight'?1:-1)}});
$('.close').onclick=()=>$('#lightbox').close();$('#lightbox').onclick=e=>{if(e.target===$('#lightbox'))$('#lightbox').close()};
document.querySelectorAll('.light-string').forEach(line=>{for(let i=0;i<6;i++){let b=document.createElement('i');b.className='bulb';b.style.left=(7+i*17)+'%';b.style.animationDelay=Math.random()*3+'s';line.append(b)}});
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){for(let i=0;i<(matchMedia('(max-width:600px)').matches?10:18);i++){const p=document.createElement('i');p.className='petal';p.style.left=Math.random()*100+'%';p.style.animationDuration=12+Math.random()*15+'s';p.style.animationDelay=-Math.random()*28+'s';$('#petals').append(p)}}
const backgroundMusic=$('#background-music'),musicButton=$('#music'),musicStatus=$('#music-status');
backgroundMusic.volume=.45;
function updateMusicButton(playing){musicButton.setAttribute('aria-pressed',String(playing));musicButton.setAttribute('aria-label',playing?'Pause background music':'Play background music');musicButton.innerHTML=playing?'<span>Ⅱ</span>':'<span>♫</span>';musicStatus.textContent=playing?'Background music playing':'Background music paused'}
function startBackgroundMusic(){const playing=backgroundMusic.play();if(playing)playing.catch(()=>{updateMusicButton(false);musicButton.title='Tap to play background music';musicStatus.textContent='Tap the music button to start background music'})}

backgroundMusic.addEventListener('playing',()=>{musicButton.title='Pause background music';updateMusicButton(true)});
backgroundMusic.addEventListener('pause',()=>updateMusicButton(false));
backgroundMusic.addEventListener('error',()=>{updateMusicButton(false);musicStatus.textContent='Music could not load. Tap the music button to retry.'});
musicButton.onclick=()=>{if(!backgroundMusic.paused&&!backgroundMusic.ended){backgroundMusic.pause()}else startBackgroundMusic()};

document.querySelectorAll('.profile-photo').forEach(button=>button.addEventListener('click',()=>{const img=button.querySelector('img');$('#lightbox img').src=img.src;$('#lightbox img').alt=img.alt;$('#lightbox').showModal()}));

// Keep the same animated book; shortcuts open the first page of each family group.
document.querySelectorAll('[data-event-group]').forEach(button=>button.addEventListener('click',async()=>{if(bookBusy)return;const target=Number(button.dataset.eventGroup);if(page<0)await openBook();if(page!==target&&!bookBusy)await changeEvent(target);alignBook()}));

// Swap the original photo sources while preserving the same scroll animation.
document.querySelectorAll('[data-memory-couple]').forEach(button=>button.addEventListener('click',()=>{
 selectedMemoryCouple=button.dataset.memoryCouple;
 document.querySelectorAll('[data-memory-couple]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const sources=selectedMemoryCouple==='divya'?divyaPhotoFiles:photoFiles;
 memoryCards.forEach((card,i)=>{const img=card.querySelector('img');img.src=sources[i];img.alt=selectedMemoryCouple==='divya'?`Divya and Gaurav — memory ${i+1}`:photoAlts[i]});
 memoryViewer.classList.remove('awaiting-photos');$('.memory-awaiting').hidden=true;
 memoryNavTarget=null;memoryProgress=null;paintedPhotoIndex=-1;measureMemories();
 window.scrollTo({top:memoryStart,behavior:'instant'});renderMemories(performance.now(),true);queueMemories();
}));
