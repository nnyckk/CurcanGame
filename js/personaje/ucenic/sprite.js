'use strict';
// ===== UCENICUL: desenele =====
// --- Ucenicul --- Tânăr, fără mustață, pălărie de paie
const BOY_PAL={k:'#1a1020',H:'#ecd070',N:'#2e6a2a',s:'#f0b088',h:'#8a5a2a',K:'#3a1a0a',G:'#4a9a3a',P:'#3a5aa8',l:'#e4e8ee',b:'#a0aab8',B:'#6a7684',p:'#283f7a',y:'#b89a48'};   // p y: umbre pentru textură
// Din trei sferturi, ca fermierul
const BOY_TOP=[".....kkkkk......","....kHyHyHk.....","....kNNNNNk.....","..kHHyHHyHHHk...","....khssssk.....","....kssKsKk.....","....ksssssk.....","....ksssKsk.....",".....kssssk.....",".....kssk.......","...kkGGGGGkk....","..kNGGPGNGPGk...",".ksNGGPGGGPGskk.",".ksNNGPPpPPGs..k","..kkkPpPPPkkkllk","....kPPpPPk.kbbk"];
const BLEG_A=["....kpPkPpk.kbBk","....kpPkPpk..kk.","....kpk.kPk.....","...kkkk.kkkk...."];
const BOY={A:spr(BOY_TOP.concat(BLEG_A),BOY_PAL)};
// Mersul: pas cu un picior, apoi cu celălalt
const BOY_W1L=["....kpPkPpk.kbBk","...kpPk..kPpkkk.","..kpk.....kPk...",".kkk......kkkk.."],BOY_W2L=["....kpPkPpk.kbBk","...kPPk..kppkkk.","..kPk.....kpk...",".kkkk.....kkk..."];
BOY.W1=spr(BOY_TOP.concat(BOY_W1L),BOY_PAL);BOY.W2=spr(BOY_TOP.concat(BOY_W2L),BOY_PAL);BOY.B=BOY.W1;
// Speriat: ochi mari, gura deschisă, mâinile sus; fuge fără găleată
const BOY_SCARED=[".....kkkkk......","....kHyHyHk.....","....kNNNNNk.....","..kHHyHHyHHHk...","....khsKsKk.....",".ks.kssKsKk.sk..",".kG.ksssssk.Gk..",".kG.kssKKsk.Gk..","..kG.kssssk.Gk..","...kGkssk..Gk...","...kkGGGGGkk....","...kNGPGNGPk....","...kNGPGGGPk....","...kNGPPpPPk....","...kkPpPPPkk....","....kPPpPPk....."];
BOY.SCP=spr(BOY_SCARED.concat(["....kpPkPpk.....","....kpPkPpk.....","....kpk.kPk.....","...kkk...kkk...."]),BOY_PAL);   // picioarele împreună
BOY.SC1=spr(BOY_SCARED.concat(["....kpPkPpk.....","...kpPk..kPpk...","..kpk.....kPk...",".kkk......kkkk.."]),BOY_PAL);BOY.SC2=spr(BOY_SCARED.concat(["....kpPkPpk.....","...kPPk..kppk...","..kPk.....kpk...",".kkkk.....kkk..."]),BOY_PAL);
// Fără găleată (după ce a scăpat-o)
const noBucket=rows=>rows.map((r,i)=>i<12||i>=18?r:r.slice(0,i===15||i===16?12:13).padEnd(16,'.'));
BOY.NA=spr(noBucket(BOY_TOP.concat(BLEG_A)),BOY_PAL);BOY.NW1=spr(noBucket(BOY_TOP.concat(BOY_W1L)),BOY_PAL);BOY.NW2=spr(noBucket(BOY_TOP.concat(BOY_W2L)),BOY_PAL);
// Mers din profil: pas, ridică, aduce în față (P aproape, p departe)
const BOY_WALK=[
 ["....kppPPPk.kbBk","...kppkkPPk..kk.","..kppk..kPPk....","..kkk...kkkkk..."],
 ["....kppPPPk.kbBk","....kppkPPk..kk.","...kppk.kPPk....","...kk...kkkk...."],
 ["....kppPPPk.kbBk","....kppkPPk..kk.","...kkk.kPPk.....",".......kkkk....."],
 ["....kPPpppk.kbBk","....kPPkkppk.kk.","...kPPk..kkk....","...kkkk........."],
 ["....kPPPppk.kbBk","...kPPkkppk..kk.","..kPPk..kppk....","..kkk...kkkkk..."],
 ["....kPPPppk.kbBk","....kPPkppk..kk.","...kPPk.kppk....","...kk...kkkk...."],
 ["....kPPPppk.kbBk","....kPPkppk..kk.","...kkk.kppk.....",".......kkkk....."],
 ["....kppPPPk.kbBk","....kppkkPPk.kk.","...kppk..kkk....","...kkkk........."]];
BOY_PAL.d='#1a2850';   // piciorul din spate
BOY_WALK.forEach((f,i)=>BOY_WALK[i]=f.map(r=>r.replace(/p/g,'d')));
MAN_PAL.d='#18264e';   // fermierul: același mers, cu furca
MAN.WK=BOY_WALK.map(f=>spr(MAN_TOP.concat(f.map((r,i)=>i<3?r.slice(0,12)+'.f..':r)),MAN_PAL));
BOY.WK=BOY_WALK.map(l=>spr(BOY_TOP.concat(l),BOY_PAL));
BOY.NWK=BOY_WALK.map(l=>spr(noBucket(BOY_TOP.concat(l)),BOY_PAL));
BOY.SCK=BOY_WALK.map(l=>spr(noBucket(BOY_SCARED.concat(l)),BOY_PAL));
BOY.FLIP=mkSprite(BOY_TOP.concat(BLEG_A).reverse(),BOY_PAL,false);
// Din față: doar pentru ucenicul înghețat
const BOY_FRONT=[
".....kkkkk......",
"....kHyHyHk.....",
"....kNNNNNk.....",
"..kHHyHHyHHHk...",
"....khssssk.....",
"....kssKsKk.....",
"....ksssssk.....",
"....ksssKsk.....",
".....kssssk.....",
".....kssk.......",
"...kkGGGGGkk....",
"..kGGPGNGPNGk...",
".ksGNPGGGPGNskk.",
".ksNGPPpPPGNs..k",
"..kkkPpPPPkkkllk",
"....kPPpPPk.kbbk",
];
const BLEG_FRONT=["....kPpkPpk.kbBk","....kPpkPpk..kk.","....kPk.kPk.....","...kkkk.kkkk...."];

const BOY_SPEED=0.4;
