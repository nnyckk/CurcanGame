'use strict';
// ===== FERMIERUL CU FURCĂ: desenele =====
// --- Bad man --- h = păr castaniu
const MAN_PAL={k:'#1a1020',H:'#d8b050',R:'#c0282f',s:'#f0b088',K:'#3a1a0a',w:'#ececec',P:'#2c4c8c',g:'#b8bcc8',f:'#7a5230',h:'#5a3418',b:'#b07a5a',r:'#8e1c24',p:'#1f3768',y:'#a88a38',v:'#b8b8c8'};   // r p y v: umbre pentru textură
// Din față: doar pentru fermierul înghețat
const MAN_FRONT=[
".....kkkkk......",
"....kHyHyHk.....",
"....kRRRRRk.....",
"..kHHyHHyHHHk...",
"....khhssskg.g.g",
"....khsKsKkggggg",
"....khskskk..f..",
"....kbssbbk..f..",
"....kbbbKbk..f..",
".....kbbk....f..",
"...kkRRRRRkk.f..",
"..kRRrwvwrRRkf..",
".ksRrRwwwRrRsf..",
".ksrRRwvwRRrsf..",
"..kkkPpPPPkkkf..",
"....kPpPpPk..f..",
];
// Din trei sferturi: fața și pasul spre direcția de mers
const MAN_TOP=[
".....kkkkk......",
"....kHyHyHk.....",
"....kRRRRRk.....",
"..kHHyHHyHHHk...",
"....khhssskg.g.g",
"....khsKsKkggggg",
"....khssssk..f..",
"....kbssbbk..f..",
"....kbbbKbk..f..",
".....kbbk....f..",
"...kkRRRRRkk.f..",
"..krRRRwvwRRkf..",
".krrRRRwwwRRsf..",
".ksrRRRwvwRRsf..",
"..kkkPpPPPkkkf..",
"....kpPPpPk..f..",
];
const MLEG_FRONT=["....kPpkPpk..f..","....kPpkPpk..f..","....kPk.kPk..f..","...kkkk.kkkk...."];
const MLEG_A=["....kpPkPpk..f..","....kpPkPpk..f..","....kpk..kPk.f..","...kkk...kkkk..."];   // furca: aproape de pământ
const MLEG_B=["....kpPkPpk..f..","...kpPk..kPpkf..","...kpk....kPkf..","..kkk.....kkkk.."];
const MAN={A:spr(MAN_TOP.concat(MLEG_A),MAN_PAL),B:spr(MAN_TOP.concat(MLEG_B),MAN_PAL)};
// Mersul: pas cu un picior, apoi cu celălalt
MAN.W1=spr(MAN_TOP.concat(["....kpPkPpk..f..","...kpPk..kPpkf..","..kpk.....kPkf..",".kkk......kkkk.."]),MAN_PAL);MAN.W2=spr(MAN_TOP.concat(["....kpPkPpk..f..","...kPPk..kppkf..","..kPk.....kpkf..",".kkkk.....kkk..."]),MAN_PAL);
// Mirat când te vede: ochi mari, gura deschisă
MAN.SURP=spr(MAN_TOP.map((r,i)=>i===4?'....khsKsKkg.g.g':i===8?'....kbbKKbk..f..':r).concat(MLEG_A),MAN_PAL);
MAN.FLIP=mkSprite(MAN_TOP.concat(MLEG_A).reverse(),MAN_PAL,false);
// Atacul cu furca
const MAN_HEAD=MAN_TOP.slice(0,10).map(r=>r.replace(/[gf]/g,'.'));
// Furca are 3 dinți: capul e o bară verticală de 5 px
const MAN_WIND_BODY=[
"...kkRRRRRkk..ggg",
"..kRRRwwwRRRk.g..",
"ffkRRRwwwRRssfggg",
"..kRRRwwwRRRk.g..",
"..kkkPPPPPkkk.ggg",
"....kPPPPPk......",
];
const MAN_STAB_BODY=[
"...kkRRRRRkk............ggg",
"..kRRRwwwRRRk...........g..",
"..kRRRwwwRRRssffffffffffggg",
"..kRRRwwwRRRk...........g..",
"..kkkPPPPPkkk...........ggg",
"....kPPPPPk................",
];
MAN.WIND=spr(MAN_HEAD.concat(MAN_WIND_BODY,MLEG_A),MAN_PAL);
MAN.STAB=spr(MAN_HEAD.concat(MAN_STAB_BODY,MLEG_B),MAN_PAL);
const MAN_WIND_T=18,MAN_STAB_T=14,MAN_REACH=14;
