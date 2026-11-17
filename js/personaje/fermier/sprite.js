'use strict';
// ================= FERMIERUL CU FURCĂ: desenele =================
// --- Bad man (farmer with pitchfork) ---
// h = păr castaniu (sub pălărie, la ceafă, perciuni), b = barbă scurtă tunsă (falcă, bărbie, deasupra buzei).
const MAN_PAL={k:'#1a1020',H:'#d8b050',R:'#c0282f',s:'#f0b088',K:'#3a1a0a',w:'#ececec',P:'#2c4c8c',g:'#b8bcc8',f:'#7a5230',h:'#5a3418',b:'#b07a5a'};
const MAN_TOP=[
".....kkkkk......",
"....kHHHHHk.....",
"....kRRRRRk.....",
"..kHHHHHHHHHk...",
"....khhssskg.g.g",
"....khsKsKkggggg",
"....khskskk..f..",
"....kbssbbk..f..",
"....kbbbKbk..f..",
".....kbbk....f..",
"...kkRRRRRkk.f..",
"..kRRRwwwRRRkf..",
".ksRRRwwwRRRsf..",
".ksRRRwwwRRRsf..",
"..kkkPPPPPkkkf..",
"....kPPPPPk..f..",
];
const MLEG_A=["....kPPkPPk.....","....kPPkPPk.....","....kPk.kPk.....","...kkkk.kkkk...."];
const MLEG_B=["....kPPkPPk.....","...kPPk..kPPk...","...kPk....kPk...","..kkkk....kkkk.."];
const MAN={A:spr(MAN_TOP.concat(MLEG_A),MAN_PAL),B:spr(MAN_TOP.concat(MLEG_B),MAN_PAL)};
MAN.FLIP=mkSprite(MAN_TOP.concat(MLEG_A).reverse(),MAN_PAL,false);
// Atacul cu furca: capul fără furca verticală + două poziții (trage furca înapoi, apoi împunge).
const MAN_HEAD=MAN_TOP.slice(0,10).map(r=>r.replace(/[gf]/g,'.'));
// Furca are 3 dinți: capul e o bară verticală de 5 px, cu dinții pe rândurile 1, 3 și 5.
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
