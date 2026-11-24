'use strict';
// ===== SETUP: ecranul, constantele de bază, utilitare =====
// ?toate: pene, curcani și achievements, toate deblocate (fără să salveze)
const ALL_OPEN=/[?&]toate\b/.test(location.search);
const GAME_VERSION='1.2';
// Editorul de niveluri: jocul din editor.html (merge ca modul de test)
const EDIT=/[?&]edit\b/.test(location.search);
// Modul de test: arenă de test, comenzi din test.html
const TEST=EDIT||/[?&]test\b/.test(location.search);
const W=400,H=224,TS=16,ROWS=14,TAU=Math.PI*2;
const cv=document.getElementById('game');
// „let”: noaptea
let ctx=cv.getContext('2d');
const [shadeCv,shadeCtx]=mkCanvas(W,H);
cv.width=W;cv.height=H;ctx.imageSmoothingEnabled=false;
// Versiunea jocului stă jos
const INFO_VW=[...('V'+GAME_VERSION)].length*6,INFO_VH=8;
const INFO={V:document.getElementById('infoV'),out:false,shown:false};
INFO.V.width=INFO_VW;INFO.V.height=INFO_VH;
function resize(){
  const s=Math.min(innerWidth/W,innerHeight/H);const k=EDIT||s<2?s:Math.floor(s);   // în editor: cât chenarul
  const cw=Math.floor(W*k);cv.style.width=cw+'px';cv.style.height=Math.floor(H*k)+'px';
  const side=(innerWidth-cw)/2;
  const sc=Math.min(Math.floor(k),Math.floor(side/(INFO_VW+8)));
  INFO.out=sc>=2;
  if(!INFO.out)return;
  const st=INFO.V.style;
  st.left=Math.round(innerWidth-(INFO_VW+4)*sc)+'px';st.top=Math.round(innerHeight-(INFO_VH+4)*sc)+'px';
  st.width=INFO_VW*sc+'px';st.height=INFO_VH*sc+'px';
}
addEventListener('resize',resize);resize();
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return [c,g];}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function pcirc(g,cx,cy,r,col){g.fillStyle=col;for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(r*r-y*y));g.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1);}}
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const pad=(n,l)=>String(n).padStart(l,'0');
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const rnd=(a,b)=>a+Math.random()*(b-a);
