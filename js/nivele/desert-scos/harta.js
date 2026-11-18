'use strict';
// ===== DEȘERTUL: harta =====
// Deșertul: scos din joc deocamdată
const DESERT_LEVEL=
 {theme:2,tip:'MESOPOTAMIA E APROAPE. DAR NU EȘTI SINGUR PE DRUM, FIULE...',build(){const m=newMap(250);m.g(0,249);
  m.c(6,10,4);m.r(12,8,'MBHBM');
  m.e('man',20);m.e('man',24);
  m.sp(29,3);
  m.pit(35,38);m.c(35,9,4);
  m.e('bomb',43);m.e('bomb',47);
  m.st(52,4,1);m.pit(56,58);m.st(59,4,-1);m.c(56,6,3);
  m.e('man',68);m.e('man',72);m.e('man',76);m.r(70,8,'BMB');
  m.sp(81,2);m.sp(85,2);m.r(81,8,'======');m.c(81,7,6);
  m.pit(92,96);m.r(93,9,'===');
  m.cp(102);
  m.e('bomb',108);m.e('man',112);m.e('bomb',116);m.r(110,8,'BBHBB');
  m.f(122,9,10,3,'D');m.sp(125,2,8);m.e('man',129,8);
  m.pit(132,138);m.r(134,8,'===');m.c(133,6,6);
  m.e('man',144);m.e('bomb',150);m.e('man',156);
  m.sp(160,4);m.r(159,8,'======');m.c(160,7,4);
  m.st(170,3,1);m.pit(173,176);m.st(177,3,-1);
  m.e('bomb',184);m.e('man',190);m.e('man',196);m.e('bomb',200);m.r(192,8,'BMBMB');
  m.c(205,10,8);
  m.e('man',214);
  m.goal('restaurant',230);
  return m.done();}};
