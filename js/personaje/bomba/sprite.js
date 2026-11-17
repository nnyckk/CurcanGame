'use strict';
// ================= BOMBA: desenele și constantele =================
// --- Bomb ---
// Bombă rotundă cu capac de alamă pentru fitil și ochi complet albi (fără pupile).
// Expresia o dau doar forma ochilor și sprâncenele: liniștită → încruntată (te vede) → furioasă (aprinsă).
// Ochii rămân albi și când clipește roșu.
const BOMB_PAL={k:'#0b0b14',b:'#2c2c40',w:'#9a9ac8',W:'#ffffff',f:'#c8a070',o:'#f08a24',c:'#c8902a',C:'#ffd070'};
const BOMB_LIT=Object.assign({},BOMB_PAL,{b:'#c0283a',w:'#ff9a9a'});
const BOMB_HEAD=[
"................",
"................",
"..........ff....",
".........f......",
"......kccf......",
"....kkcCckk.....",
];
// Liniștită: doi ochi albi întregi.
const BOMB_EYES_CALM=[
"...kbwwbbbbk....",
"..kbwbWWbWWbk...",
"..kbbbWWbWWbk...",
"..kbbbWWbWWbk...",
];
// Încruntată (te vede): sprâncene și colțul interior al ochilor tăiat pe diagonală.
const BOMB_EYES_ANGRY=[
"...kbwkbbbkk....",
"..kbwbWkbkWbk...",
"..kbbbWWbWWbk...",
"..kbbbWWbWWbk...",
];
// Furioasă (aprinsă): sprâncene groase coborâte, ochii mijiți în două triunghiuri albe.
const BOMB_EYES_FURIOUS=[
"...kbkkbbbkk....",
"..kbwbbkbkbbk...",
"..kbbbWkbkWbk...",
"..kbbbWWbWWbk...",
];
const BOMB_BOTTOM=[
"..kbbbbbbbbbk...",
"..kbbbbbbbbbk...",
"...kbbbbbbbk....",
"....kkkkkkk.....",
];
const bombTop=mood=>BOMB_HEAD.concat([BOMB_EYES_CALM,BOMB_EYES_ANGRY,BOMB_EYES_FURIOUS][mood],BOMB_BOTTOM);
const BF_A=["....oo...oo.....","...ooo...ooo...."];
const BF_B=[".....oo.oo......","....ooo.ooo....."];
// A/B = liniștită, AA/AB = încruntată, FA/FB = furioasă (aprinsă), LA = furioasă în clipirea roșie.
const BOMB={A:spr(bombTop(0).concat(BF_A),BOMB_PAL),B:spr(bombTop(0).concat(BF_B),BOMB_PAL),
  AA:spr(bombTop(1).concat(BF_A),BOMB_PAL),AB:spr(bombTop(1).concat(BF_B),BOMB_PAL),
  FA:spr(bombTop(2).concat(BF_A),BOMB_PAL),FB:spr(bombTop(2).concat(BF_B),BOMB_PAL),
  LA:spr(bombTop(2).concat(BF_A),BOMB_LIT)};
// Bomba „în fund”: corpul coborât până la sol, cu piciorul întins în față (mereu aprinsă, deci furioasă).
const BOMB_SIT=["................","................"].concat(bombTop(2).slice(0,12),[
"...kbbbbbbbk.oo.",
"....kkkkkkkooo..",
]);
BOMB.S=spr(BOMB_SIT,BOMB_PAL);BOMB.SL=spr(BOMB_SIT,BOMB_LIT);
BOMB.FLIP=mkSprite(bombTop(0).concat(BF_A).reverse(),BOMB_PAL,false);   // întoarsă, când e aruncată de pe ecran
// Fitilul după ce stă în fund (~3,3 s) și alunecarea după ce e împinsă.
const BOMB_SIT_FUSE=200,BOMB_KICK=4.5,BOMB_SLIDE_T=84;
// Viteza de alunecare: ușor de împins — pornește direct cu viteză maximă (mai repede decât fuga)
// și doar încetinește lin până se oprește (ease-out). ~1,4 secunde, cam 15 tile-uri.
function bombSlideSpeed(t){return BOMB_KICK*Math.cos(Math.PI/2*Math.min(1,t/BOMB_SLIDE_T));}
// Cât de lată e zona „solidă” a bombei față de hitbox. La 0, curcanul se oprește exact lipit de ea
// (marginea din față a sprite-ului curcanului coincide cu hitbox-ul lui).
const BOMB_PUSH_PAD=0;
