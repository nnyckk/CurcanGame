'use strict';
// ================= FERMIERUL-ȘEF: desenele și constantele =================
// Un fermier uriaș, clasic: pălărie de paie, barbă castanie, cămașă în carouri roșu cu alb, salopetă de blugi (cu
// bretele, nasturi și buzunar) și cizme; ține o furcă. Fața își schimbă expresia: încruntat, răcnind (când atacă),
// obosit, amețit, lovit. Poiana e luminată de două felinare de fermă (cu petrol, atârnate de stâlpi de lemn), la capete, care se fac roșii (și pulsează) cât
// boss-ul se pregătește să sară peste tine sau să dea buzna.
// Te așteaptă în poiana din fața restaurantului. Când intri, în spatele tău cade o stivă de baloți de fân, camera se oprește pe poiană și
// pornește muzica de boss; stiva de fân din dreapta se prăbușește abia când îl învingi. Are 3 inimi.
// Atacuri (după fiecare face o pauză; cu cât îl rănești, cu atât e mai rapid și pauzele mai scurte):
// - trei furci aruncate spre tine, una după alta (de fiecare dată trage întâi furca înapoi și tremură); după a treia e
//   OBOSIT 3 secunde (gâfâie, transpiră, se clatină);
// - două bombe aprinse aruncate la întâmplare pe jos (stau în fund, cu fitilul obișnuit);
// - săritura: pe sol apare un semn roșu care clipește acolo unde va ateriza (lângă tine); sare, aterizează și te
//   împunge imediat cu furca;
// - la ULTIMA inimă, în plus: când ești pe sol și departe de el, bate din picior („!”) și fuge spre tine cu furca
//   în față, ca un taur; dacă te ratează, se izbește de margine și rămâne AMEȚIT 3 secunde (steluțe).
// - de la 2 inimi, după fiecare lovitură primită cheamă 2-3 mobi (fermieri sau ucenici, la întâmplare).
// Fuge de bombe: dacă vede o bombă aprinsă lângă picioarele lui (după o clipă), sare pe o scândură apropiată și așteaptă
// acolo să explodeze, fuge în partea cealaltă sau, încolțit, sare peste ea. Nu poate fugi când e obosit, amețit, cub de
// gheață sau în mijlocul unui atac (furcile, săritura cu împunsătura, fuga ca un taur) — atunci prinde-l cu bombe.
// Cum îl învingi: bombele (cele obișnuite) îl rănesc dacă explodează lângă el; îi sari în cap
// când e obosit sau amețit, sau îl lovești de 10 ori cu pene de gheață: se face un cub de gheață (5 secunde), în care
// îi poți sări în cap (e prea greu ca să-l împingi). Altfel, pălăria te aruncă înapoi când îi sari în cap.
// Nu stă niciodată deasupra apei, iar săriturile lui nu sparg gheața (bombele, da): nu calcă în găuri, iar dacă se
// deschide una sub el, sare pe un loc sigur.
// BOSS_TIRED = cât e obosit după furci și amețit după ce se izbește (3 s); BOSS_VULN = cât stă în cubul de gheață (5 s).
const BOSS_HP=3,BOSS_H=31,BOSS_Y=12*TS-BOSS_H,BOSS_TIRED=180,BOSS_VULN=300,BOSS_ICE_HITS=10;
const BOSS_PAL={k:'#1a1020',Y:'#e2b84a',y:'#b88a2a',L:'#f4d878',b:'#6a3a1a',s:'#f0b088',S:'#cc8a62',c:'#e8907a',n:'#e8957a',
  H:'#7a4a24',h:'#5a3418',R:'#c8302a',w:'#ece6d8',D:'#3a5aa8',d:'#28407a',B:'#ffd23f',O:'#5a3418'};
// 28 × 31, privind spre dreapta. Ochii, sprâncenele și gura se desenează peste (bossFace), după expresie; brațul din
// față și furca, după ce face (drawBoss). Brațul din spate (mâneca în carouri și mâna) e în desen, lângă corp.
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
// Expresia feței (peste desen): încruntat, răcnind, obosit, amețit, lovit. ice = culorile înghețate (cubul de gheață).
const FACE_COL={k:'#1a1020',M:'#3a2214',e:'#ffffff',s:'#f0b088',S:'#cc8a62',o:'#3a1010'};
// Ochii stau pe rândurile 8-9 (stângul pe coloanele 10-11, dreptul pe 15-16), sprâncenele pe rândul 7, gura pe rândul
// 12, în barbă (deschisă, coboară și pe rândul 13).
function bossFace(R,ex,ice){
  const P=(x,y,w,h,k)=>R(x,y,w,h,ice?mixHex(FACE_COL[k],'#a8e0ff',0.55):FACE_COL[k]);
  P(11,7,6,1,'s');P(10,8,8,2,'s');
  if(ex==='dazed'){for(const ox of [10,14]){P(ox,7,1,1,'k');P(ox+2,7,1,1,'k');P(ox+1,8,1,1,'k');P(ox,9,1,1,'k');P(ox+2,9,1,1,'k');}
    P(12,12,3,1,'o');P(14,13,2,1,'o');return;}                                          // ochi în X, gura strâmbă
  if(ex==='hurt'){P(10,7,2,1,'M');P(16,7,2,1,'M');P(10,9,2,1,'k');P(15,9,2,1,'k');P(11,8,1,1,'k');P(15,8,1,1,'k');
    P(12,12,4,2,'o');P(12,12,4,1,'e');return;}                                          // ochii strânși, gura deschisă
  if(ex==='tired'){P(10,7,3,1,'M');P(15,7,3,1,'M');P(10,8,2,1,'S');P(15,8,2,1,'S');P(10,9,2,1,'e');P(15,9,2,1,'e');
    P(11,9,1,1,'k');P(16,9,1,1,'k');P(12,12,3,2,'o');return;}                          // pleoape grele, gâfâie
  // Încruntat: sprâncene groase, cu capetele dinspre nas coborâte; ochi albi, cu pupila spre tine. Răcnind: gura
  // deschisă, cu dinții de sus.
  P(10,7,3,1,'M');P(15,7,3,1,'M');P(12,8,1,1,'M');P(14,8,1,1,'M');
  P(10,8,2,2,'e');P(15,8,2,2,'e');P(11,9,1,1,'k');P(16,9,1,1,'k');
  if(ex==='roar'){P(12,12,4,2,'o');P(12,12,4,1,'e');}else{P(12,12,4,1,'e');}
}
// O mânecă în carouri (roșu cu alb, pixel cu pixel, ca brațul din spate din desen), cu contur închis; R = cum desenează
// drawBoss (sau bustul din caseta de dialog), în coordonatele desenului.
function bossSleeve(R,dx,dy,w,h,red,white){
  R(dx-1,dy-1,w+2,h+2,'#1a1020');
  for(let j=0;j<h;j++)for(let i=0;i<w;i++)R(dx+i,dy+j,1,1,(dx+i+dy+j)%2?red:white);
}
