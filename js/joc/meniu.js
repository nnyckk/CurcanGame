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
  ...(goldOK()?[{label:'CURCAN DE AUR',val:()=>!!G.goldSkin,act:()=>{G.goldSkin=!G.goldSkin;saveSettings();}}]:[]),
  {label:'CONTROALE',sub:true,act:()=>openMenu('controls')},
  {label:'ÎNAPOI',act:()=>menuBack()}];}
function openMenu(m,sel=0){if(m==='settings')MENU.settings=settingsItems();G.menu=m;G.sel=sel;G.hover=-1;}
// Paginile meniului: principal → SETĂRI → CONTROALE
const MENU={
  main:[
    {label:'JOACĂ',act:()=>newGame()},
    {label:'SETĂRI',sub:true,act:()=>openMenu('settings')},
    {label:'MOD TEST',act:()=>{location.href='test.html';}},
    {label:'PENE',badge:'pene',act:()=>openMenu('pene')},
    {label:'ACHIEVEMENTS',badge:'ach',act:()=>{G.achPage=0;openMenu('ach');}}],
  settings:[],   // vezi settingsItems
  controls:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
  pene:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
  // Pagina ACHIEVEMENTS: cartonașele, ÎNAPOI, săgețile paginilor
  ach:ACH.map(a=>({label:a.name,ach:a.id,info:true,act:()=>{}})).concat([{label:'ÎNAPOI',act:()=>menuBack()},
    {label:'<',pg:-1,act:()=>{}},{label:'>',pg:1,act:()=>{}}]),
};
// Înapoi: o pagină mai sus
function menuBack(){
  if(G.menu==='controls')openMenu('settings',MENU.settings.findIndex(it=>it.label==='CONTROALE'));
  else if(G.menu==='settings')openMenu('main',1);
  else if(G.menu==='pene'||G.menu==='ach')openMenu('main',0);
}
// Unde stă fiecare buton, în pixeli de joc
const goldBadgeRect=()=>{const s=goldFound()+'/'+goldTotal();return {x:106,y:H-19,w:50+[...s].length*6,h:15,s};};
function menuRects(){
  const m=G.menu,items=MENU[m],h=15;
  if(m==='ach')return achRects(items);
  const L=m==='main'?{w:96,gap:5,y0:102}:m==='settings'?{w:168,gap:4,y0:54}:m==='pene'?{w:96,gap:0,y0:152}:{w:96,gap:0,y0:142};
  return items.map((it,i)=>it.badge?Object.assign({it},it.badge==='ach'?achBadgeRect():goldBadgeRect())
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
  // Săgețile trec doar prin butoanele obișnuite
  const idx=MENU[G.menu].map((it,i)=>it.badge?-1:i).filter(i=>i>=0),n=idx.length;
  if(code==='ArrowUp'||code==='ArrowDown'){const k=Math.max(0,idx.indexOf(G.sel));G.sel=idx[(k+(code==='ArrowUp'?-1:1)+n)%n];sfx.blip();}
  else if(code==='Enter'||code==='Space')menuPick(G.sel);
  else if((code==='ArrowLeft'||code==='ArrowRight')&&MENU[G.menu][G.sel].val)menuPick(G.sel);
  else if(code==='Escape'||code==='Backspace')menuBack();
}
