'use strict';
// ===== INPUT: tastatură, mouse, butoanele de pe telefon =====
const keys={},pressed={},touch={left:0,right:0,jump:0,run:0};
// Browserele nu pornesc sunetul până la prima apăsare
addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();
  initAudio();
  if(!keys[e.code]){pressed[e.code]=true;if(G.state==='title')menuKey(e.code);}
  keys[e.code]=true;
});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;for(const k in touch)touch[k]=0;});
// Controale: ← → merge, SPACE sare, X fuge
const inLeft=()=>keys.ArrowLeft||touch.left;
const inRight=()=>keys.ArrowRight||touch.right;
const inJump=()=>keys.Space||touch.jump;
const inRun=()=>keys.KeyX||touch.run;
const jumpPressed=()=>pressed.Space||pressed.TouchJump;
// ↑: intri / ieși din cafeneaua din nivelul bonus
const upPressed=()=>pressed.ArrowUp||pressed.KeyW||pressed.TouchUp;
// ↓ în aer: lovitura în pământ
const downPressed=()=>pressed.ArrowDown||pressed.KeyS||pressed.TouchDown;
// O apăsare scurtă pe X aruncă o pană de foc
const firePressed=()=>pressed.KeyX||pressed.TouchRun;
const startPressed=()=>pressed.Enter||pressed.Space||pressed.TouchJump||pressed.Tap;
// Butoanele de atingere: doar pe telefon / tabletă, nu pe desktop cu ecran tactil
const TOUCH_DEV=matchMedia('(pointer: coarse)').matches&&matchMedia('(hover: none)').matches;
if(TOUCH_DEV){document.getElementById('touch').classList.add('on');document.getElementById('pauseBtn').classList.add('on');}
const TOUCH_UI=document.getElementById('touch').classList.contains('on')?document.getElementById('touch'):null;
document.querySelectorAll('[data-k]').forEach(b=>{
  const k=b.dataset.k;
  const down=e=>{e.preventDefault();initAudio();if(k==='pause'){pressed.KeyP=true;return;}touch[k]=1;if(k==='jump')pressed.TouchJump=true;if(k==='run')pressed.TouchRun=true;if(k==='up')pressed.TouchUp=true;if(k==='down')pressed.TouchDown=true;};
  const up=e=>{e.preventDefault();if(k!=='pause')touch[k]=0;};
  b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up);
  b.addEventListener('contextmenu',e=>e.preventDefault());
});
// În meniu, butoanele se apasă la „click”
let downOnTitle=false;
cv.addEventListener('pointerdown',()=>{initAudio();downOnTitle=G.state==='title';if(!downOnTitle)pressed.Tap=true;});
cv.addEventListener('click',e=>{initAudio();if(G.state!=='title'||!downOnTitle)return;const i=menuHit(e);if(i>=0)menuPick(i);});
cv.addEventListener('pointermove',e=>{const i=G.state==='title'?menuHit(e):-1;menuHover(i);cv.style.cursor=i>=0?'pointer':'';});
cv.addEventListener('pointerleave',()=>{G.hover=-1;});
