'use strict';
// ===== MENIUL =====
// Meniul principal și pagina de setări
const FS_OK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
const isFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function toggleFS(){try{
  const d=document,el=d.documentElement;
  const p=isFS()?(d.exitFullscreen||d.webkitExitFullscreen).call(d):(el.requestFullscreen||el.webkitRequestFullscreen).call(el);
  if(p&&p.catch)p.catch(()=>{});
}catch(e){}}
// Setările
function settingsItems(){return [
  {label:'MUZICĂ',val:()=>G.music,act:toggleMusic},
  {label:'EFECTE SONORE',val:()=>G.sfx,act:()=>{G.sfx=!G.sfx;saveSettings();applyAudio();}},
  ...(FS_OK?[{label:'ECRAN COMPLET',val:isFS,act:toggleFS}]:[]),
  ...(goldOK()?[{label:'CURCAN DE AUR',gold:true,val:()=>!!G.goldSkin,act:()=>{G.goldSkin=!G.goldSkin;saveSettings();}}]:[]),
  {label:'CONTROALE',sub:true,act:()=>openMenu('controls')},
  {label:'ÎNAPOI',act:()=>menuBack()}];}
// Meniul e deschis: pe ecranul de titlu sau pe pauză, în timpul jocului
const menuOn=()=>G.state==='title'||(G.state==='play'&&G.paused&&!TEST);
function pauseOpen(){G.paused=true;sfx.pause();applyAudio();openMenu('pause');}
function pauseClose(){G.paused=false;sfx.pause();applyAudio();}
function toMainMenu(){if(G.custRun){custBack();return;}G.paused=false;applyAudio();G.state='title';stopSong();playSong('title');openMenu('main');}
function openMenu(m,sel=0){if(m==='settings')MENU.settings=settingsItems();G.menu=m;G.sel=sel;G.hover=-1;}
// MOD TEST: ascuns; ?dev îl pornește (ținut minte), ?dev=0 îl oprește
const DEV=(()=>{const m=location.search.match(/[?&]dev(=(\w+))?\b/);
  try{if(m){if(m[2]==='0')localStorage.removeItem('curcan_dev');else localStorage.setItem('curcan_dev','1');}
    return localStorage.getItem('curcan_dev')==='1';}catch(e){return !!m&&m[2]!=='0';}})();
// Paginile meniului: principal → SETĂRI → CONTROALE
const MENU={
  main:[
    {label:'JOACĂ',act:()=>newGame()},
    {label:'NIVELURILE MELE',act:()=>openMine()},
    {label:'EDITOR',act:()=>{location.href='editor.html';}},
    {label:'SETĂRI',sub:true,act:()=>openMenu('settings')},
    ...(DEV?[{label:'MOD TEST',act:()=>{location.href='test.html';}}]:[]),
    {label:'PENE',badge:'pene',act:()=>openMenu('pene')},
    {label:'CURCANI',badge:'custi',act:()=>openMenu('custi')},
    {label:'ACHIEVEMENTS',badge:'ach',act:()=>{G.achPage=0;openMenu('ach');}},
    {label:'NOUTĂȚI',badge:'news',act:()=>openMenu('news')}],
  news:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
  settings:[],   // vezi settingsItems
  // Pauza din joc (ESC)
  pause:[
    {label:'CONTINUĂ',act:()=>pauseClose()},
    {label:'REIA NIVELUL',act:()=>{G.cp=null;startLevel();}},
    {label:'SETĂRI',sub:true,act:()=>openMenu('settings')},
    {label:'IEȘI LA MENIU',act:()=>toMainMenu()}],
  controls:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
  pene:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
  custi:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
  mine:[],   // vezi openMine
  // Pagina ACHIEVEMENTS: cartonașele, ÎNAPOI, săgețile paginilor
  ach:ACH.map(a=>({label:a.name,ach:a.id,info:true,act:()=>{}})).concat([{label:'ÎNAPOI',act:()=>menuBack()},
    {label:'<',pg:-1,act:()=>{}},{label:'>',pg:1,act:()=>{}}]),
};
const mainIx=l=>Math.max(0,MENU.main.findIndex(it=>it.label===l));
// NOUTĂȚI: ce aduce versiunea de acum, pe grupe (rânduri scurte, încap în cartonaș)
const NEWS=[
  {t:'NIVELURILE TALE',items:['EDITOR DE NIVELURI','NIVELURILE MELE, ÎN MENIU','POVEȘTI DE PÂNĂ LA 10','COD DE PARTAJARE']},
  {t:'CAFENEAUA',items:['GHICEȘTE CEȘCUȚA','BLOCURILE LUI MOȘ','JOCUL, ALES LA ÎNTÂMPLARE','GEAMUL ARATĂ CE E AFARĂ']},
  {t:'ÎN JOC',items:['BLOCURI DE FOC ȘI DE GHEAȚĂ','DEȘERTUL, ACUM ȘI ZIUA','CĂRĂMIZILE LASĂ FUNDALUL']}];
const newsBadgeRect=()=>({x:106+(BADGE_W+4)*3,y:H-19,w:74,h:15});
// Înapoi: o pagină mai sus
function menuBack(){
  if(G.menu==='controls')openMenu('settings',MENU.settings.findIndex(it=>it.label==='CONTROALE'));
  else if(G.menu==='settings')openMenu(G.state==='play'?'pause':'main',G.state==='play'?2:mainIx('SETĂRI'));
  else if(G.menu==='mine')openMenu('main',mainIx('NIVELURILE MELE'));
  else if(G.menu==='pause')pauseClose();
  else if(G.menu==='pene'||G.menu==='custi'||G.menu==='ach'||G.menu==='news')openMenu('main',0);
}
// Unde stă fiecare buton, în pixeli de joc
// Insignele de jos, în dreapta recordului: PENE, ACHIEVEMENTS
const BADGE_W=50;   // PENE și ACHIEVEMENTS: doar iconița și numărul
const goldBadgeRect=()=>({x:106,y:H-19,w:BADGE_W,h:15,s:goldFound()+'/'+goldTotal()});
const cageBadgeRect=()=>({x:106+BADGE_W+4,y:H-19,w:BADGE_W,h:15,s:cageFound()+'/'+cageTotal()});
function menuRects(){
  const m=G.menu,items=MENU[m],h=15;
  if(m==='ach')return achRects(items);
  if(m==='mine')return mineRects(items);
  const L=m==='main'?{w:112,gap:3,y0:98}:m==='settings'?{w:168,gap:4,y0:76}:m==='pause'?{w:120,gap:5,y0:78}:m==='pene'?{w:96,gap:0,y0:168}:m==='custi'?{w:96,gap:0,y0:186}:m==='news'?{w:96,gap:0,y0:204}:{w:96,gap:0,y0:156};
  return items.map((it,i)=>it.badge?Object.assign({it},it.badge==='ach'?achBadgeRect():it.badge==='news'?newsBadgeRect():it.badge==='custi'?cageBadgeRect():goldBadgeRect())
    :{it,x:W/2-L.w/2,y:L.y0+i*(h+L.gap)+(m==='settings'&&i===items.length-1?6:0),w:L.w,h});
}
function menuHit(e){
  const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  return menuRects().findIndex(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);
}
function menuPick(i){const it=MENU[G.menu][i];if(it.pg){achFlip(it.pg,0,false);return;}if(!it.badge)G.sel=i;if(it.info){sfx.blip();return;}it.act();sfx.coin();}
// Mouse-ul peste un buton
function menuHover(i){G.hover=i;const it=MENU[G.menu][i];if(it&&!it.badge&&!it.pg)G.sel=i;}
function menuKey(code){
  if(G.menu==='ach'&&code.startsWith('Arrow')){achMenuKey(code);return;}
  if(code==='KeyP'&&G.state==='play'){pauseClose();return;}   // P: înapoi în joc, din orice pagină
  // Săgețile trec doar prin butoanele obișnuite
  const idx=MENU[G.menu].map((it,i)=>it.badge?-1:i).filter(i=>i>=0),n=idx.length;
  if(code==='ArrowUp'||code==='ArrowDown'){const k=Math.max(0,idx.indexOf(G.sel));G.sel=idx[(k+(code==='ArrowUp'?-1:1)+n)%n];sfx.blip();}
  else if(code==='Enter'||code==='Space')menuPick(G.sel);
  else if((code==='ArrowLeft'||code==='ArrowRight')&&MENU[G.menu][G.sel].val)menuPick(G.sel);
  else if(code==='Escape'||code==='Backspace')menuBack();
}

// ---- NIVELURILE MELE: nivelurile salvate în editor (curcan_niveluri) ----
function custSaves(){try{const a=JSON.parse(localStorage.getItem('curcan_niveluri')||'[]');return Array.isArray(a)?a.filter(s=>s&&s.id&&s.L):[];}catch(e){return [];}}
function openMine(sel=0){
  const stories=custStories().map(s=>({label:String(s.name||'POVESTEA MEA').toUpperCase().slice(0,24),story:s,act:()=>playStory(s)}));
  MENU.mine=stories.concat(custSaves().map(s=>({label:String(s.name||'FĂRĂ NUME').toUpperCase().slice(0,24),lvl:s,act:()=>playCustom(s)}))
    .concat([{label:'^',scroll:-1,badge:'arrow',act:()=>mineScroll(-1)},{label:'v',scroll:1,badge:'arrow',act:()=>mineScroll(1)},
      {label:'EDITOR',act:()=>{location.href='editor.html';}},{label:'ÎNAPOI',act:()=>menuBack()}]));
  G.mineTop=0;openMenu('mine',sel<MENU.mine.length&&!MENU.mine[sel].badge?sel:MENU.mine.findIndex(it=>it.label==='EDITOR'));
}
// Rândurile nivelurilor (câte 8), săgețile din dreapta, EDITOR și ÎNAPOI jos
const MINE_VIS=8;
function mineRects(items){
  const nl=items.filter(mineRow).length,off={hidden:true,x:-999,y:-999,w:0,h:0};
  if(G.sel<nl){if(G.sel<G.mineTop)G.mineTop=G.sel;if(G.sel>=G.mineTop+MINE_VIS)G.mineTop=G.sel-MINE_VIS+1;}
  G.mineTop=clamp(G.mineTop||0,0,Math.max(0,nl-MINE_VIS));
  return items.map((it,i)=>{
    if(mineRow(it)){const k=i-G.mineTop;return k>=0&&k<MINE_VIS?{it,x:W/2-120,y:42+k*18,w:240,h:15}:Object.assign({it},off);}
    if(it.scroll)return nl>MINE_VIS?{it,x:W/2+124,y:it.scroll<0?42:42+(MINE_VIS-1)*18,w:15,h:15}:Object.assign({it},off);
    return {it,x:it.label==='EDITOR'?W/2-102:W/2+4,y:H-24,w:98,h:15};
  });
}
function mineScroll(d){
  const nl=MENU.mine.filter(mineRow).length;if(nl<=MINE_VIS)return;
  G.mineTop=clamp((G.mineTop||0)+d*4,0,nl-MINE_VIS);if(G.sel<nl)G.sel=clamp(G.sel,G.mineTop,G.mineTop+MINE_VIS-1);
}
cv.addEventListener('wheel',e=>{if(menuOn()&&G.menu==='mine'){e.preventDefault();mineScroll(Math.sign(e.deltaY));}},{passive:false});
// Joci un nivel salvat: 3 vieți, 300 de secunde, scor; nimic nu intră în progresul jocului
function playCustom(s){
  let L=null;try{L=edNorm(s.L);}catch(e){}if(!L)return;
  G.story=null;CUSTOM.bonus=false;
  G.carryBig=false;G.carryFire=false;G.carryIce=false;G.lives=3;G.score=0;G.coins=0;G.cp=null;G.slotUsed=null;G.bossMet=false;G.goldLv=-1;G.cageLv=-1;G.cafeSeen=false;G.tip=null;G.underOpen=-1;
  G.fullRun=false;G.runDeaths=0;G.god=false;G.cageRun=false;
  edUse(L);G.level=CUSTOM_IX;G.custRun=true;G.custId=s.id;stopSong();toIntro(true);
}
// Gata (terminat sau fără vieți): înapoi în listă, pe nivelul jucat
function custBack(){
  G.paused=false;applyAudio();G.custRun=false;G.story=null;CUSTOM.bonus=false;G.state='title';stopSong();playSong('title');
  const id=G.custId;openMine();const i=MENU.mine.findIndex(it=>(it.lvl||it.story)&&(it.lvl||it.story).id===id);if(i>=0)G.sel=i;
}
const custName=()=>(CUSTOM.L&&CUSTOM.L.name)||'NIVELUL TĂU';
// Rândurile listei: niveluri și povești
const mineRow=it=>!!(it.lvl||it.story);
function custStories(){try{const a=JSON.parse(localStorage.getItem('curcan_povesti')||'[]');return Array.isArray(a)?a.filter(s=>s&&s.id&&Array.isArray(s.items)&&s.items.length):[];}catch(e){return [];}}
// O poveste: nivelurile pe rând, cu aceleași vieți; puterile trec mai departe, ca în jocul principal
function playStory(s){
  const items=[];for(const it of s.items.slice(0,10)){let L=null;try{L=edNorm(it.L);}catch(e){}if(L)items.push({L,bonus:!!it.bonus});}
  if(!items.length)return;
  G.story={id:s.id,name:String(s.name||'POVESTEA MEA').toUpperCase(),items};G.custId=s.id;G.custRun=true;
  storyRestart();
}
// De la primul nivel: 3 vieți, scor zero (și după ce pierzi toate viețile)
function storyRestart(){
  G.carryBig=false;G.carryFire=false;G.carryIce=false;G.lives=3;G.score=0;G.coins=0;G.tip=null;G.fullRun=false;G.runDeaths=0;G.god=false;G.cageRun=false;
  stopSong();storyLevel(0);
}
function storyLevel(i){
  const it=G.story.items[i];G.storyIdx=i;
  G.cp=null;G.slotUsed=null;G.bossMet=false;G.goldLv=-1;G.cageLv=-1;G.cafeSeen=false;G.underOpen=-1;   // totul de la zero, ca la un nivel nou
  edUse(it.L);CUSTOM.bonus=it.bonus;G.level=CUSTOM_IX;toIntro(true);
}
// „NIVEL 2” sau „BONUS”: bonusurile nu se numără
const storyNum=()=>G.story.items.slice(0,G.storyIdx+1).filter(x=>!x.bonus).length;
const storyTag=()=>G.story.items[G.storyIdx].bonus?'BONUS':'NIVEL '+storyNum();
