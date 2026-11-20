'use strict';
// ===== NIVELUL 5 — NOAPTE DE IARNĂ: harta =====
// Nivelul 5 — NOAPTE DE IARNĂ: pădurea de brazi noaptea
LEVELS.push({id:'iarna',theme:5,song:'winter',tip:'MESOPOTAMIA E APROAPE. DAR NU EȘTI SINGUR PE DRUM, FIULE...',build(){const m=newMap(319);m.g(0,265);
  m.r(11,8,'BMBHB');
  m.e('boy',21);
  // Lacul 1: o copcă
  m.lake(26,35);m.pit(30,31);
  // Deal în trepte, de pe el sari pe scândura lacului
  m.e('man',41);m.hill(47,[1,2,3]);
  // Lacul 2: două copci și o scândură între ele
  m.lake(52,69);m.pit(57,59);m.pit(64,65);m.r(60,8,'====');m.c(60,7,3);
  // Adâncitură mică, cu bănuți în ea
  m.e('man',71);m.dip(77,79);m.c(77,12,3);m.e('bomb',81);
  // Deal dublu: fermierul pe cel din spate
  m.hill(84,[2,2,2,2,2]);m.back(87,[4,4,4,4,4,4]);m.e('man',90,7);
  m.pana(50,9,'hidden');   // pana 1: invizibilă, lipită de ultima treaptă, la nivelul ei
  m.sp(95,2);
  m.cp(104);   // punctul de salvare
  // ——— A doua jumătate
  m.r(108,8,'BHB');
  m.r(108,4,'B B');m.pana(109,4,'brick');   // pana 2: în cărămidă
  // Peștera mare: intri la 117, ieși la 180
  const a=269;m.under(117,180,a,50,{ceil:4,pit:[23,30],fall:[5,20,37],pool:[33,36],bats:[3,18,32,40],gems:[21,44,['L',8],['R',6]]});
  m.e('bomb',a+7);m.f(a+10,9,4,3,'D');   // movilă
  m.colivie(a+12,9);   // colivia: pe movilă
  m.r(a+16,8,'MHM');   // bănuți și putere
  m.r(a+25,9,'===');m.c(a+25,8,3);   // scândura peste groapa cu țepi
  m.e('man',a+35);m.e('bomb',a+38);m.st(a+40,3,1);m.f(a+43,9,6,3,'D');   // trepte de piatră spre o terasă înaltă, cu ieșirea
  m.e('boy',122);m.e('boy',127);
  // Lacul 3: copci late, scânduri sus
  m.lake(131,150);m.pit(136,138);m.pit(145,146);m.r(133,8,'====');m.r(140,6,'BMMB');m.e('boy',141,5);
  // Trei dealuri: mic în față, mijlociu în spate, mare în stânga (ajungi pe el doar de pe cel mijlociu)
  m.hill(154,[2,2,2,2,2]);m.back(157,[4,4,4,4,4,4]);m.far(151,[6,6,6,6,6,6]);m.c(152,5,3);m.e('man',159,7);m.e('bomb',163);
  // Un iaz înghețat între două trepte de piatră
  m.st(165,2,1);m.lake(167,174);m.pit(170,171);m.st(175,2,-1);
  m.e('man',185);m.dip(188,190);m.e('man',192);   // adâncitură între fermieri
  // Lacul 4: o copcă la mijloc, blocuri deasupra
  m.lake(196,209);m.pit(201,203);m.r(199,8,'BMB');
  m.cp(211);   // punctul de salvare de dinaintea boss-ului
  // Chiar înainte de boss
  m.r(213,8,'BAB');m.c(212,5,5);
  // Poiana boss-ului
  m.lake(224,234);m.r(225,8,'===');m.r(231,8,'===');
  m.boss(237,218,241);
  m.pana(241,9,'boss');   // pana 3: în stiva de fân din dreapta
  m.goal('restaurant',245);
  return m.done();}});
