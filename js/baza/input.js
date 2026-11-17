'use strict';
// ================= INPUT: tastatură, mouse, butoanele de pe telefon =================
const keys={},pressed={},touch={left:0,right:0,jump:0,run:0};
// Browserele nu pornesc sunetul până la prima apăsare, așa că orice tastă/atingere îl pornește (și muzica de meniu).
// În meniu, tastele se tratează chiar aici, în eveniment (vezi menuKey), nu în bucla jocului.
addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();
  initAudio();
  if(!keys[e.code]){pressed[e.code]=true;if(G.state==='title')menuKey(e.code);}
  keys[e.code]=true;
});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;for(const k in touch)touch[k]=0;});
// Controale: ← → merge, SPACE sare, X (ținut apăsat) fuge.
const inLeft=()=>keys.ArrowLeft||touch.left;
const inRight=()=>keys.ArrowRight||touch.right;
const inJump=()=>keys.Space||touch.jump;
const inRun=()=>keys.KeyX||touch.run;
const jumpPressed=()=>pressed.Space||pressed.TouchJump;
// ↑ (sau butonul ▲ de pe ecran, care apare doar în fața unei uși): intri / ieși din cafeneaua din nivelul bonus.
const upPressed=()=>pressed.ArrowUp||pressed.KeyW||pressed.TouchUp;
// O apăsare scurtă pe X (sau pe FUGI) aruncă o pană de foc; ținut apăsat, X rămâne fugă.
const firePressed=()=>pressed.KeyX||pressed.TouchRun;
const startPressed=()=>pressed.Enter||pressed.Space||pressed.TouchJump||pressed.Tap;
if('ontouchstart' in window||navigator.maxTouchPoints>0){document.getElementById('touch').classList.add('on');document.getElementById('pauseBtn').classList.add('on');}
const TOUCH_UI=document.getElementById('touch').classList.contains('on')?document.getElementById('touch'):null;
document.querySelectorAll('[data-k]').forEach(b=>{
  const k=b.dataset.k;
  const down=e=>{e.preventDefault();initAudio();if(k==='pause'){pressed.KeyP=true;return;}touch[k]=1;if(k==='jump')pressed.TouchJump=true;if(k==='run')pressed.TouchRun=true;if(k==='up')pressed.TouchUp=true;};
  const up=e=>{e.preventDefault();if(k!=='pause')touch[k]=0;};
  b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up);
  b.addEventListener('contextmenu',e=>e.preventDefault());
});
// În meniu, butoanele se apasă la „click” (abia acolo browserul dă voie la ecran complet și pe telefon), și doar
// dacă apăsarea a început tot în meniu — altfel atingerea care închide ecranul de final ar apăsa și un buton din meniu.
let downOnTitle=false;
cv.addEventListener('pointerdown',()=>{initAudio();downOnTitle=G.state==='title';if(!downOnTitle)pressed.Tap=true;});
cv.addEventListener('click',e=>{initAudio();if(G.state!=='title'||!downOnTitle)return;const i=menuHit(e);if(i>=0)menuPick(i);});
cv.addEventListener('pointermove',e=>{const i=G.state==='title'?menuHit(e):-1;if(i>=0)G.sel=i;cv.style.cursor=i>=0?'pointer':'';});
