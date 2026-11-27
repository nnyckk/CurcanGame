'use strict';
// ===== RATONUL: desenele =====
// Desenul tău, pătrățel cu pătrățel (23 × 19): fața spre noi, coada în dreapta (desenat cu fața spre stânga)
const RACC_PAL={k:'#14191f',d:'#353c42',g:'#63696d',l:'#85898e',w:'#a7a7a7',c:'#e2dcd3',e:'#f3f1ee'};
const RACC_BASE=[
"..kk........kk.........",
"..kgk......kgk.........",
"..kdgkkkkkkgdk.........",
"..kdggggggggdk.........",
"..kggggggggggk.........",
".kggccwgwcclggk........",
".kgckkkdkkkclgk.....kk.",
"kddkkekdkekkllk....kkkk",
"kdkkkkgggkkkklk....kddk",
".kkkkckkcdkkkk....kgggk",
"...kgcccclgkggk...kkkgd",
"....kdddddgggggk..kkkkk",
"....kgggggggggggk.kggkk",
"....kggggggggdggk.kkgdk",
"....kgdgggggdgggdkgkkd.",
"....kgdkggkgdgggdkddk..",
"....kdkkggkddgggdkdk...",
"....kdk.kdkkkkdddkk....",
"...kkkkkkk.kddddk......",
];
// Pune pătrățele peste desen: [rând, coloană, culoare]
const raccPut=(rows,pts)=>{const r=rows.map(s=>s.split(''));for(const [y,x,c] of pts)r[y][x]=c;return r.map(s=>s.join(''));};
// Mersul: o labă ridicată (rândul de jos urcă un pătrățel)
function raccStep(rows,a,b){const r=rows.map(s=>s.split(''));for(let x=a;x<=b;x++){if(r[18][x]!=='.'&&r[17][x]==='.')r[17][x]=r[18][x];r[18][x]='.';}return r.map(s=>s.join(''));}
const RACC_W1=raccStep(RACC_BASE,3,9),RACC_W3=raccStep(RACC_BASE,11,16);
// Aruncă: laba din față ridicată, lângă cap
const RACC_ARM=[[12,3,'k'],[11,3,'d'],[11,2,'k'],[10,2,'d'],[10,1,'k'],[10,3,'k'],[9,0,'k'],[9,1,'d'],[8,0,'k']];
// Speriat: ochii mari, coada zbârlită
const RACC_SCARE=[[6,5,'e'],[6,9,'e'],[5,19,'k'],[5,22,'k'],[8,23-1,'k'],[11,22,'k'],[13,23-1,'k']];
const RACC={A:spr(RACC_BASE,RACC_PAL),W1:spr(RACC_W1,RACC_PAL),W3:spr(RACC_W3,RACC_PAL),
  THROW:spr(raccPut(RACC_BASE,RACC_ARM),RACC_PAL),SC1:spr(raccPut(RACC_W1,RACC_SCARE),RACC_PAL),SC3:spr(raccPut(RACC_W3,RACC_SCARE),RACC_PAL)};
RACC.ICE=spr(RACC_BASE,icePal(RACC_PAL));
RACC.FLIP=mkSprite(RACC_BASE.slice().reverse(),RACC_PAL,false);
