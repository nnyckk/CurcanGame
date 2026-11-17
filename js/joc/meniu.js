'use strict';
// ================= MENIUL (ecranul de titlu și setările) =================
// Meniul principal (JOACĂ, SETĂRI, MOD TEST) și pagina de setări: butoane pixel desenate în joc. Se aleg cu ↑ ↓
// și ENTER/SPACE, cu mouse-ul sau cu degetul. Se apasă direct din evenimentul de tastă/click (nu din bucla jocului),
// pentru că browserul dă voie la ecran complet doar în timpul unei apăsări.
const FS_OK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
const isFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function toggleFS(){try{
  const d=document,el=d.documentElement;
  const p=isFS()?(d.exitFullscreen||d.webkitExitFullscreen).call(d):(el.requestFullscreen||el.webkitRequestFullscreen).call(el);
  if(p&&p.catch)p.catch(()=>{});
}catch(e){}}
// Setările; CURCAN DE AUR apare doar după ce ai găsit toate penele de aur.
function settingsItems(){return [
  {label:'MUZICĂ',val:()=>G.music,act:toggleMusic},
  {label:'EFECTE SONORE',val:()=>G.sfx,act:()=>{G.sfx=!G.sfx;saveSettings();applyAudio();}},
  ...(FS_OK?[{label:'ECRAN COMPLET',val:isFS,act:toggleFS}]:[]),
  ...(goldOK()?[{label:'CURCAN DE AUR',val:()=>!!G.goldSkin,act:()=>{G.goldSkin=!G.goldSkin;saveSettings();}}]:[]),
  {label:'CONTROALE',sub:true,act:()=>openMenu('controls')},
  {label:'ÎNAPOI',act:()=>menuBack()}];}
function openMenu(m,sel=0){if(m==='settings')MENU.settings=settingsItems();G.menu=m;G.sel=sel;}
// Paginile meniului: principal → SETĂRI → CONTROALE, plus pagina PENE DE AUR (se deschide din insigna „PENE n/15”
// de jos, care e și ea un buton: se alege cu ↓ după MOD TEST, cu mouse-ul sau cu degetul). „sub” = butonul deschide
// o altă pagină (are „>” în dreapta).
const MENU={
  main:[
    {label:'JOACĂ',act:()=>newGame()},
    {label:'SETĂRI',sub:true,act:()=>openMenu('settings')},
    {label:'MOD TEST',act:()=>{location.href='test.html';}},
    {label:'PENE',badge:true,act:()=>openMenu('pene')}],
  settings:[],   // vezi settingsItems (se refac când deschizi pagina)
  controls:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
  pene:[
    {label:'ÎNAPOI',act:()=>menuBack()}],
};
// Înapoi (butonul ÎNAPOI, ESC): o pagină mai sus, cu butonul de unde ai venit ales.
function menuBack(){
  if(G.menu==='controls')openMenu('settings',MENU.settings.findIndex(it=>it.label==='CONTROALE'));
  else if(G.menu==='settings')openMenu('main',1);
  else if(G.menu==='pene')openMenu('main',MENU.main.findIndex(it=>it.badge));
}
// Unde stă fiecare buton, în pixeli de joc: meniul principal sub titlu (insigna penelor jos, lângă record); setările
// (mai late) sub „SETĂRI”, cu ÎNAPOI puțin mai jos, despărțit de restul; la controale, ÎNAPOI e sub lista de taste;
// la pene, sub explicație.
const goldBadgeRect=()=>{const s=goldFound()+'/'+goldTotal();return {x:106,y:H-19,w:50+[...s].length*6,h:15,s};};
function menuRects(){
  const m=G.menu,items=MENU[m],h=15;
  const L=m==='main'?{w:96,gap:5,y0:102}:m==='settings'?{w:168,gap:4,y0:54}:m==='pene'?{w:96,gap:0,y0:186}:{w:96,gap:0,y0:142};
  return items.map((it,i)=>it.badge?Object.assign({it},goldBadgeRect())
    :{it,x:W/2-L.w/2,y:L.y0+i*(h+L.gap)+(m==='settings'&&i===items.length-1?6:0),w:L.w,h});
}
function menuHit(e){
  const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  return menuRects().findIndex(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);
}
function menuPick(i){G.sel=i;MENU[G.menu][i].act();sfx.coin();}
function menuKey(code){
  const n=MENU[G.menu].length;
  if(code==='ArrowUp'||code==='ArrowDown'){G.sel=(G.sel+(code==='ArrowUp'?-1:1)+n)%n;sfx.blip();}
  else if(code==='Enter'||code==='Space')menuPick(G.sel);
  else if((code==='ArrowLeft'||code==='ArrowRight')&&MENU[G.menu][G.sel].val)menuPick(G.sel);
  else if(code==='Escape'||code==='Backspace')menuBack();
}
