'use strict';
// ================= UCENICUL (fermierul fără furcă): desenele =================
// --- Ucenicul (fermierul simplu, fără furcă) ---
// Tânăr, fără mustață, pălărie de paie, cămașă verde cu salopetă albastră și o găleată în mâna din față.
// Nu te urmărește și nu atacă: doar se plimbă încet. Dă jumătate din punctele fermierului cu furcă.
const BOY_PAL={k:'#1a1020',H:'#ecd070',N:'#2e6a2a',s:'#f0b088',h:'#8a5a2a',K:'#3a1a0a',G:'#4a9a3a',P:'#3a5aa8',l:'#e4e8ee',b:'#a0aab8',B:'#6a7684'};
const BOY_TOP=[
".....kkkkk......",
"....kHHHHHk.....",
"....kNNNNNk.....",
"..kHHHHHHHHHk...",
"....khssssk.....",
"....kssKsKk.....",
"....ksssssk.....",
"....ksssKsk.....",
".....kssssk.....",
".....kssk.......",
"...kkGGGGGkk....",
"..kGGPGGGPGGk...",
".ksGGPGGGPGGskk.",
".ksGGPPPPPGGs..k",
"..kkkPPPPPkkkllk",
"....kPPPPPk.kbbk",
];
const BLEG_A=["....kPPkPPk.kbBk","....kPPkPPk..kk.","....kPk.kPk.....","...kkkk.kkkk...."];
const BLEG_B=["....kPPkPPk.kbBk","...kPPk..kPPkkk.","...kPk....kPk...","..kkkk....kkkk.."];
const BOY={A:spr(BOY_TOP.concat(BLEG_A),BOY_PAL),B:spr(BOY_TOP.concat(BLEG_B),BOY_PAL)};
BOY.FLIP=mkSprite(BOY_TOP.concat(BLEG_A).reverse(),BOY_PAL,false);
const BOY_SPEED=0.4;
