'use strict';
// ===== FERMIERUL-ȘEF: desenele și constantele =====
// Un fermier uriaș, clasic: pălărie de paie
const BOSS_HP=3,BOSS_H=31,BOSS_Y=12*TS-BOSS_H,BOSS_TIRED=180,BOSS_VULN=300,BOSS_ICE_HITS=10;
const BOSS_PAL={k:'#1a1020',Y:'#e2b84a',y:'#b88a2a',L:'#f4d878',b:'#6a3a1a',s:'#f0b088',S:'#cc8a62',c:'#e8907a',n:'#e8957a',
  H:'#7a4a24',h:'#5a3418',R:'#c8302a',w:'#ece6d8',D:'#3a5aa8',d:'#28407a',B:'#ffd23f',O:'#5a3418'};
// 28 × 31, privind spre dreapta
const BOSS_TOP=[
"...........kkkkkk...........","..........kYLYYLYk..........","..........kYYyYYyk..........","..........kbbbbbbk..........",
".....kYYyYYyYYyYYyYYyYk.....",".....kyYYYYYYYYYYYYYYyk.....",".....kkkkkkkkkkkkkkkkkk.....",
"........kHHssssssHHk........","........kHssssssssHk........","........kHssssssssHk........","........kHcsssssnnHk........",
"........kHHhsssshHHk........","........kHHHssssHHHk........",".........kHHHHHHHHk.........","..........khHHHHhk..........",
".....kRwkRwDDwRDDwRk........",".....kwRkwRDDRwDDRwk........",".....kRwkRwDBwRBDwRk........",".....kwRkwRDDDDDDRwk........",
".....kRwkRwDDddDDwRk........",".....kwRkwRDDddDDRwk........",".....ksskDDDDDDDDDDk........",".....ksskDDDDDDDDDDk........"];
const BOSS_LEG_A=["......kk.kDDDDkDDDDk........",".........kDDdDkDdDDk........",".........kDDdDkDdDDk........",".........kDDdDkDdDDk........",
".........kDDDDkDDDDk........","........kOOOOOkOOOOOk.......","........kOOOOOkOOOOOOk......","........kkkkkkkkkkkkkk......"];
const BOSS_LEG_B=["......kk.kDDDDkDDDDk........","........kDDdDk.kDdDDk.......",".......kDDdDk...kDdDDk......",".......kDDdDk...kDdDDk......",
"......kDDDDk.....kDDDDk.....",".....kOOOOOk.....kOOOOOk....",".....kOOOOOk.....kOOOOOOk...",".....kkkkkkk.....kkkkkkkk..."];
const BOSS={A:spr(BOSS_TOP.concat(BOSS_LEG_A),BOSS_PAL),B:spr(BOSS_TOP.concat(BOSS_LEG_B),BOSS_PAL),ICE:spr(BOSS_TOP.concat(BOSS_LEG_A),icePal(BOSS_PAL))};
BOSS.FLIP=mkSprite(BOSS_TOP.concat(BOSS_LEG_A).reverse(),BOSS_PAL,false);
// Expresia feței: încruntat, răcnind, obosit, amețit
const FACE_COL={k:'#1a1020',M:'#3a2214',e:'#ffffff',s:'#f0b088',S:'#cc8a62',o:'#3a1010'};
// Ochii stau pe rândurile 8-9, sprâncenele pe rândul 7
function bossFace(R,ex,ice){
  const P=(x,y,w,h,k)=>R(x,y,w,h,ice?mixHex(FACE_COL[k],'#a8e0ff',0.55):FACE_COL[k]);
  P(11,7,6,1,'s');P(10,8,8,2,'s');
  if(ex==='dazed'){for(const ox of [10,14]){P(ox,7,1,1,'k');P(ox+2,7,1,1,'k');P(ox+1,8,1,1,'k');P(ox,9,1,1,'k');P(ox+2,9,1,1,'k');}
    P(12,12,3,1,'o');P(14,13,2,1,'o');return;}   // ochi în X, gura strâmbă
  if(ex==='hurt'){P(10,7,2,1,'M');P(16,7,2,1,'M');P(10,9,2,1,'k');P(15,9,2,1,'k');P(11,8,1,1,'k');P(15,8,1,1,'k');
    P(12,12,4,2,'o');P(12,12,4,1,'e');return;}   // ochii strânși, gura deschisă
  if(ex==='tired'){P(10,7,3,1,'M');P(15,7,3,1,'M');P(10,8,2,1,'S');P(15,8,2,1,'S');P(10,9,2,1,'e');P(15,9,2,1,'e');
    P(11,9,1,1,'k');P(16,9,1,1,'k');P(12,12,3,2,'o');return;}   // pleoape grele, gâfâie
  // Încruntat: sprâncene groase
  P(10,7,3,1,'M');P(15,7,3,1,'M');P(12,8,1,1,'M');P(14,8,1,1,'M');
  P(10,8,2,2,'e');P(15,8,2,2,'e');P(11,9,1,1,'k');P(16,9,1,1,'k');
  if(ex==='roar'){P(12,12,4,2,'o');P(12,12,4,1,'e');}else{P(12,12,4,1,'e');}
}
// O mânecă în carouri, cu contur închis
function bossSleeve(R,dx,dy,w,h,red,white){
  R(dx-1,dy-1,w+2,h+2,'#1a1020');
  for(let j=0;j<h;j++)for(let i=0;i<w;i++)R(dx+i,dy+j,1,1,(dx+i+dy+j)%2?red:white);
}
