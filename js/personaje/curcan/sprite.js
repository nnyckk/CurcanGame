'use strict';
// ===== CURCANUL: desenele =====
// --- Turkey --- Mascota "Meso": cap alb, creastă roșie
const TK_PAL={k:'#14121c',W:'#ffffff',g:'#d0d4de',r:'#e0222c',R:'#a01018',y:'#ffc21a',o:'#e8870e',b:'#3a86e8',
  p:'#ffa8b8',B:'#1e1e28',h:'#3a3a48',n:'#8a4a22',N:'#5a2c12',m:'#b8723a',l:'#e8282c'};
const TK_TOP=[
"............rr......",
"...........rRrr.....",
"..........krrrRk....",
"W.r......kWWWWWWk...",
"WrW.r...kWWWWWWWWk..",
"rWgrW...kWWWWWWWWk..",
"WWrWgr..kWWWWWkWyyy.",
"rWWrWg..kWWWWWkWyyyo",
"WrWWrWg.kWWWWpWWrrk.",
"WWrWWrWkgWWWWWWryok.",
"rWWrWWkWkWkWkWrr....",
".WrWWkkWkWkWkWkrR...",
"..WrWkBBBBBBBBBkR...",
"...WknNnnnBBBBhBk...",
"....knnNnnBWBWWrk...",
"....kmnnNnBBBBBBk...",
"....kNmnnnBBBBBBk...",
".....kNnnBBBBBBk....",
"......kBBBBBBBBk....",
".......kkBBBBkk.....",
];
const LEG_A=["..........l..l......","..........l..l......","..........lll.lll..."];
const LEG_B=[".........l....l.....","........l......l....",".......lll.....lll.."];
const LEG_C=["..........l.l.......","..........l.l.......","..........lllll....."];
const LEG_J=[".........l....l.....","........ll...ll.....","...................."];
const TK={A:spr(TK_TOP.concat(LEG_A),TK_PAL),B:spr(TK_TOP.concat(LEG_B),TK_PAL),C:spr(TK_TOP.concat(LEG_C),TK_PAL),J:spr(TK_TOP.concat(LEG_J),TK_PAL)};
TK.DEAD=mkSprite(TK_TOP.concat(LEG_A).reverse(),TK_PAL,false);
// Pentru ecranul JOC TERMINAT: curcanul în picioare
TK.OVER=mkSprite(TK_TOP.map((r,y)=>{const a=[...r];
  if(y===5||y===7){a[13]='k';a[14]=y===7?'W':a[14];a[15]='k';}
  return a.join('');}).concat(LEG_A),TK_PAL,false);
// Curcanul de FOC: tot mare
const TKF_TOP=TK_TOP.slice(0,12).concat([
"..WrWkEEEEBBBBDkR...",
"...WknNnnnEBBBBDk...",
"....knnNnnBWBWWDk...",
"....kmnnNnBBBBBDk...",
"....kNmnnnBBBBDDk...",
".....kNnnBBBBDDk....",
"......kDBBBDDDDk....",
".......kkDDDDkk.....",
]);
const TKF_PAL=Object.assign({},TK_PAL,{B:'#a81e1e',D:'#5c0c12',E:'#cc3a2c'});const TKF={A:spr(TKF_TOP.concat(LEG_A),TKF_PAL),B:spr(TKF_TOP.concat(LEG_B),TKF_PAL),C:spr(TKF_TOP.concat(LEG_C),TKF_PAL),J:spr(TKF_TOP.concat(LEG_J),TKF_PAL)};
TKF.DEAD=mkSprite(TKF_TOP.concat(LEG_A).reverse(),TKF_PAL,false);
// Curcanul de GHEAȚĂ: costum umbrit albastru deschis
const TKI_TOP=TK_TOP.slice(0,10).concat([
"rWWrWWkSSssSSsrr....",
".WrWWksSSssSSskrR...",
"..WrWkEEEEBBBBDkR...",
"...WknNnnnEBBBBDk...",
"....knnNnnBWBWWDk...",
"....kmnnNnBBBBBDk...",
"....kNmnnnBBBBDDk...",
".....kFnFBBBBDDk....",
"......kIIIIIIIIk....",
".......kIkIIkIk.....",
]);
const TKI_PAL=Object.assign({},TK_PAL,{B:'#7cc4ea',D:'#3a86b8',E:'#c8eeff',S:'#3a7ad8',s:'#ffffff',I:'#dff6ff',F:'#e8f8ff'});
const TKI={A:spr(TKI_TOP.concat(LEG_A),TKI_PAL),B:spr(TKI_TOP.concat(LEG_B),TKI_PAL),C:spr(TKI_TOP.concat(LEG_C),TKI_PAL),J:spr(TKI_TOP.concat(LEG_J),TKI_PAL)};
TKI.DEAD=mkSprite(TKI_TOP.concat(LEG_A).reverse(),TKI_PAL,false);
// Pixelii costumului
const TKI_SHEEN=[];TKI_TOP.forEach((r,y)=>{for(let x=0;x<r.length;x++)if('BEDI'.includes(r[x]))TKI_SHEEN.push([x,y]);});
// Curcanul MIC — starea de start
const TKS_TOP=[
"..........rr....",
".........rrRr...",
"W.r.....kWWWWk..",
"WrW.r..kWWWWWWk.",
"rWgrW..kWWWWkWyy",
"WWrWgr.kWWWWkWyo",
"rWWrWg.kWWWpWrr.",
".WrWWrkWkWkWkr..",
"..WrWkkWkWkWkR..",
"...WknNnBBBBBk..",
"....knnNBWWrBk..",
"....kNnnBBBBBk..",
".....kNBBBBBk...",
"......kkBBBkk...",
];
const SLEG_A=["........l..l....","........ll.ll..."];
const SLEG_B=[".......l....l...","......ll....ll.."];
const SLEG_C=["........l.l.....","........llll...."];
const SLEG_J=[".......l...l....","......ll..ll...."];
const TKS={A:spr(TKS_TOP.concat(SLEG_A),TK_PAL),B:spr(TKS_TOP.concat(SLEG_B),TK_PAL),C:spr(TKS_TOP.concat(SLEG_C),TK_PAL),J:spr(TKS_TOP.concat(SLEG_J),TK_PAL)};
TKS.DEAD=mkSprite(TKS_TOP.concat(SLEG_A).reverse(),TK_PAL,false);
const TK_RUN=['A','C','B','C'];
// Respirația, când stă pe loc
TK.I=spr(TK_TOP.concat(LEG_A.slice(1)),TK_PAL);
TKF.I=spr(TKF_TOP.concat(LEG_A.slice(1)),TKF_PAL);
TKI.I=spr(TKI_TOP.concat(LEG_A.slice(1)),TKI_PAL);
TKS.I=spr(TKS_TOP.concat(SLEG_A.slice(1)),TK_PAL);
const IDLE_WAIT=40,BREATH_T=100,BREATH_OUT=45;
// CURCANUL DE AUR: același curcan, mare sau mic
const TKG_PAL={k:'#3a2206',W:'#ffe68a',g:'#e8bc48',r:'#d08a12',R:'#9a5e06',y:'#fff4c0',o:'#e0901a',b:'#5a3606',
  p:'#ffd070',B:'#e6a828',h:'#b07810',n:'#d29a24',N:'#8a5a0c',m:'#f6cc5a',l:'#d89a1c'};
const turkeySet=(top,legs,pal)=>{const s={A:spr(top.concat(legs[0]),pal),B:spr(top.concat(legs[1]),pal),C:spr(top.concat(legs[2]),pal),
  J:spr(top.concat(legs[3]),pal),I:spr(top.concat(legs[0].slice(1)),pal)};s.DEAD=mkSprite(top.concat(legs[0]).reverse(),pal,false);return s;};
const TKG=turkeySet(TK_TOP,[LEG_A,LEG_B,LEG_C,LEG_J],TKG_PAL),TKGS=turkeySet(TKS_TOP,[SLEG_A,SLEG_B,SLEG_C,SLEG_J],TKG_PAL);
TKG.OVER=mkSprite(TK_TOP.map((r,y)=>{const a=[...r];if(y===5||y===7){a[13]='k';a[14]=y===7?'W':a[14];a[15]='k';}return a.join('');}).concat(LEG_A),TKG_PAL,false);
// Cu costum de foc sau de gheață
const TKGF=turkeySet(TKF_TOP,[LEG_A,LEG_B,LEG_C,LEG_J],Object.assign({},TKG_PAL,{B:'#a81e1e',D:'#5c0c12',E:'#cc3a2c'}));
const TKGI=turkeySet(TKI_TOP,[LEG_A,LEG_B,LEG_C,LEG_J],Object.assign({},TKG_PAL,{B:'#7cc4ea',D:'#3a86b8',E:'#c8eeff',S:'#3a7ad8',s:'#ffffff',I:'#dff6ff',F:'#e8f8ff'}));
// Sclipirea trece peste tot curcanul de aur
const sheenPx=(top,skip)=>{const o=[];top.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(!skip.includes(r[x]))o.push([x,y]);});return o;};
const TKG_SHEEN=sheenPx(TK_TOP,'.kl'),TKGS_SHEEN=sheenPx(TKS_TOP,'.kl');
const TKGF_SHEEN=sheenPx(TKF_TOP,'.klBDE'),TKGI_SHEEN=sheenPx(TKI_TOP,'.klBDESsIF');
// Seturile de desene ale curcanului: cele de aur
const goldSkinOn=()=>TEST?!!G.testGold:!!G.goldSkin&&goldOK();   // în test: doar din panou
const tkBig=()=>goldSkinOn()?TKG:TK,tkSmall=()=>goldSkinOn()?TKGS:TKS;
const tkFire=()=>goldSkinOn()?TKGF:TKF,tkIce=()=>goldSkinOn()?TKGI:TKI;
const HEAD_ROWS=["...rr...","..krrk..",".kWWWWk.","kWWWWkWy","kWWWWkyo","kWWpWrr.",".kWkWkr.","..kkkkR."];
const HEAD=mkSprite(HEAD_ROWS,TK_PAL,false),HEADG=mkSprite(HEAD_ROWS,TKG_PAL,false);
// Capul din HUD
const headImg=()=>goldSkinOn()?HEADG:HEAD;
