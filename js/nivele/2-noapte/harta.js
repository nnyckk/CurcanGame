'use strict';
// ===== NIVELUL 2 — NOAPTEA LA FERMĂ: harta =====
// Nivelul 2 — ferma noaptea
LEVELS.push({id:'noapte',theme:3,song:'night',tip:'NOAPTEA, FERMIERII VĂD DOAR CE LE LUMINEAZĂ FELINARUL.',build(){const m=newMap(248);m.g(0,219);
  m.c(6,10,3);m.r(11,8,'BMBHB');m.c(12,5,3);
  m.pana(0,8,'hidden');   // pana 1: invizibilă, în capătul din stânga al nivelului
  m.e('boy',24);
  m.st(30,3,1);m.pit(33,36);m.c(33,8,4);m.st(37,3,-1);
  // Peștera de sub pământ: cazi în gaură, ieși sărind din cealaltă, chiar înainte de punctul de salvare
  const a=222;m.under(44,93,a,26,{fall:[8,18],pool:[5,7],gems:[12,20,['L',9],['R',9]]});m.e('man',51);
  // 15 bănuți: 4 în puț (îi iei când cazi), 3 în arc peste baltă, 2 sub stalactitele care cad, 2 lângă bloc, 4 pe movilă
  const C=(i,y)=>m.c(a+i,y);[[2,3],[3,4],[2,5],[3,6],[5,10],[6,9],[7,10],[8,11],[10,10],[12,10],[18,11]].forEach(([i,y])=>C(i,y));
  m.r(a+11,8,'H');m.f(a+13,7,3,1,'D');m.f(a+14,11,4,1,'D');m.c(a+14,10,4);m.e('bomb',a+19);   // un singur bloc, cu putere
  m.pit(64,67);m.r(64,8,'====');m.c(64,7,4);
  m.e('bomb',72);m.e('boy',78);
  m.r(82,8,'BBMBBB');m.c(83,7,4);m.e('man',85,7);
  m.r(83,4,'B B');m.pana(84,4,'brick');   // pana 2: în cărămidă
  m.cp(96);
  m.r(100,8,'BHB');
  // Terasă de pământ în aer: fermierul de pe ea, tu pe sub ea
  m.f(105,8,7,2,'D');m.e('man',108,7);m.c(106,11,5);m.e('boy',116);
  // Trepte de pământ peste apă
  m.hill(119,[1,2,3,4]);m.pit(123,126);m.c(123,6,4);m.hill(127,[4,3,2,1]);
  m.e('bomb',134);m.sp(138,2);m.e('boy',143);
  // Dâmb în față, deal mare în spate: de pe el ajungi la pană
  m.f(147,9,6,3,'D');m.e('man',150,8);m.back(150,[6,6,6,6,6]);
  m.pana(154,5);   // pana 3: la marginea dealului din spate
  m.pit(155,168);m.r(157,9,'===');m.r(162,7,'====');m.c(157,8,3);m.c(162,6,4);
  m.e('man',174);m.e('bomb',180);
  // Un deal mic înainte de final, cu ucenicul sus
  m.hill(186,[2,3,3,3,3,2]);m.e('boy',189,8);
  m.c(193,10,6);
  m.goal('sign',204);
  return m.done();}});
