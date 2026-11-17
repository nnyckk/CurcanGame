'use strict';
// ================= NIVELUL BONUS: cafeneaua (intrarea, camera, blocul-slot) =================
// La mijlocul nivelului bonus e o căsuță maro-cafea cu accente galbene și firma „MesoCafé” (ca la chioșc: bandă neagră cu sigla,
// galben și lemn deschis), ferestre luminate, o ușă de stejar și un horn din care iese fum. În fața ușii apeși ↑ și
// intri (ecranul se întunecă o clipă). Camera e o cafenea de un ecran, pusă în dreapta hărții, după țintă; cât ești
// înăuntru (G.inCafe), camera stă pe ea și timpul nu curge. Ieși tot cu ↑, la ușa din stânga, și ajungi în fața căsuței.
// Înăuntru: un curcan bătrânel și gras (pălărie, ochelari, pipă, baston, vestă) care îți vorbește într-o casetă de dialog (vezi DIALOGUL), și
// blocul-slot din mijloc. Blocul arată pe rând boaba roșie, afina înghețată, „2UP” și un X. Îl lovești cu capul o
// singură dată: se mai învârte puțin, tot mai încet, și se oprește la întâmplare pe unul dintre ele. Premiul ți se dă
// pe loc (nu trebuie să-l iei): boaba de foc sau afina te îmbracă direct, 2UP îți dă două vieți, X nu-ți dă nimic.
// Apoi rămâne gol (și după ce pierzi o viață, în același nivel).
// Camera ocupă pe hartă un ecran întreg (CAFE_W tile-uri), dar cafeneaua propriu-zisă e mai mică: între CAFE_L și
// CAFE_R pe ecran (în rest e întuneric). Ușa de ieșire are centrul la CAFE_DOOR. Blocul-slot stă pe coloanele a+10,
// a+11 (x 160-192 pe ecran, la mijloc între cele două perechi de mese) și cu 4 rânduri deasupra podelei: sub el treci
// (și mare), deasupra lui ajungi dintr-o săritură.
// Podeaua cafenelei e pe rândul CAFE_FLOOR (cu 2 tile-uri mai sus decât solul de afară), ca sub ea să încapă caseta de
// dialog fără să acopere camera; tot desenul camerei e urcat cu CAFE_DY.
const CAFE_W=25,CAFE_L=64,CAFE_R=320,CAFE_DOOR=82,CAFE_FLOOR=10,CAFE_DY=(12-CAFE_FLOOR)*TS,CAFE_SLOT=10,CAFE_SLOT_Y=CAFE_FLOOR-4,DOOR_T=24;
// Grinda din tavan (sus de tot în cafenea), în coordonatele camerei de dinainte de urcare (podeaua la y = 192):
// camera e joasă și caldă, cu tavanul puțin deasupra firmei și a blocului-slot; deasupra e întuneric.
const CAFE_TOP=88;
// Rândurile 0 .. CAFE_CEIL-1 din camera cafenelei sunt tavanul solid (K, nedesenat), cu marginea de jos exact sub
// grindă (CAFE_TOP+8-CAFE_DY = CAFE_CEIL*TS): deasupra blocului-slot rămân 2 tile-uri, cât să stea și curcanul mare.
const CAFE_CEIL=4;
// Ca cafeneaua să stea la mijlocul ecranului: camera de vedere e cu CAFE_CAMX față de marginea camerei de pe hartă,
// iar desenul lumii e urcat cu CAFE_VY (doar desenul; tile-urile rămân pe loc).
const CAFE_CAMX=-8,CAFE_VY=-12;
const SLOT_FIRE=0,SLOT_ICE=1,SLOT_2UP=2,SLOT_NONE=3;
// Sigla „MesoCafé” (cu litere mici și accent pe é, ca pe firmă): „Meso” albă, „Café” galbenă. 43 × 7.
const MESO_LOGO=(()=>{
  const L={M:["#.....#","##...##","#.#.#.#","#..#..#","#.....#","#.....#","#.....#"],
    e:["....","....",".##.","#..#","####","#...",".###"],é:["..#.",".#..",".##.","#..#","####","#...",".###"],
    s:["....","....",".###","#...",".##.","...#","###."],
    o:["....","....",".##.","#..#","#..#","#..#",".##."],C:[".###.","#...#","#....","#....","#....","#...#",".###."],
    a:["....","....",".##.","...#",".###","#..#",".###"],f:["..##",".#..",".#..","####",".#..",".#..",".#.."]};
  const word=[['M',0],['e',0],['s',0],['o',0],['C',1],['a',1],['f',1],['é',1]];
  const w=word.reduce((s,[ch])=>s+L[ch][0].length+1,0)-1,[c,g]=mkCanvas(w,7);let x=0;
  for(const [ch,y] of word){g.fillStyle=y?'#ffd23f':'#ffffff';
    L[ch].forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]==='#')g.fillRect(x+i,j,1,1);});x+=L[ch][0].length+1;}
  return c;})();
function makeCafe(d){
  const used=!!G.slotUsed&&G.slotUsed.level===G.level;
  const c={x:d.x,a:d.a,sx:d.a+CAFE_SLOT,sy:CAFE_SLOT_Y,i:used?G.slotUsed.res:0,lastI:0,iT:0,lock:0,res:used?G.slotUsed.res:-1,
    done:used,bump:-1,met:false,react:-1,reactT:0,bonks:0,dust:[],npcX:d.a*TS+276-OLD_W/2};   // bătrânelul: în fața tejghelei
  if(used)setSlotTiles(c,'E');
  return c;
}
// Câte un pumn de praf (2–5 fire, de mărimi și durate diferite) din fiecare loc din tavan, când îi vine rândul. Firele
// cad încet și se sting repede, la 10–25 px sub tavan (nu ajung jos).
function cafeDust(c){
  for(const d of c.dust){if(--d.t>0)continue;
    for(let i=0,k=2+Math.floor(Math.random()*4);i<k;i++){const life=14+Math.floor(Math.random()*13);
      parts.push({x:d.x+(Math.random()-0.5)*6,y:CAFE_CEIL*TS+1-Math.random()*2,vx:(Math.random()-0.5)*0.3,vy:0.1+Math.random()*0.3,g:0.04,
        life,max:life,col:['#8a7a64','#c8b89a','#a89880'][Math.floor(Math.random()*3)],s:Math.random()<0.15?2:1});}}
  c.dust=c.dust.filter(d=>d.t>0);
}
function setSlotTiles(c,ch){for(let j=0;j<2;j++)for(let i=0;i<2;i++)grid[c.sy+j][c.sx+i]=ch;}
const inCafe=()=>!!cafe&&!!G.inCafe;
// Cea mai din dreapta poziție a camerei afară (înainte de golul dintre nivel și camera cafenelei).
const camMax=()=>cafe?(cafe.a-3)*TS-W:cols*TS-W;
// Ușa în fața căreia stă curcanul (pe sol): 'in' = ușa căsuței (intri), 'out' = ușa din cafenea (ieși), altfel null.
function cafeDoor(){
  const p=player;if(!cafe||!p||p.dead||!p.onGround||G.doorT>0)return null;
  const pc=p.x+p.w/2;
  if(inCafe())return Math.abs(pc-(cafe.a*TS+CAFE_DOOR))<10?'out':null;
  return Math.abs(pc-(cafe.x*TS+48))<12&&p.y+p.h>=12*TS-1?'in':null;
}
// La jumătatea întunecării: curcanul trece dincolo de ușă, iar camera sare direct acolo.
function cafeTeleport(){
  const p=player,c=cafe;
  // Înăuntru cântă piesa cafenelei (jazz), afară iar cea a nivelului.
  if(G.doorTo==="in"&&!G.cafeSeen){G.cafeSeen=true;MOS.cafe++;mosSave();}   // Moș Curcan ține minte că ai fost la el
  if(G.doorTo==="in"){G.inCafe=true;p.x=c.a*TS+CAFE_DOOR-p.w/2;cam.x=c.a*TS+CAFE_CAMX;playSong('cafe');}
  else{G.inCafe=false;p.x=c.x*TS+48-p.w/2;cam.x=clamp(p.x+p.w/2-W*0.42,0,camMax());playSong(LEVELS[G.level].song||'main');}
  p.y=(G.inCafe?CAFE_FLOOR:12)*TS-p.h;p.vx=0;p.vy=0;p.face=1;feathers=[];
}
// Blocul-slot e un mini-joc de îndemânare, nu noroc: arată pe rând boaba de foc, afina, 2UP și X (câte SLOT_STEP
// cadre fiecare), iar ce arată când dai cu capul în el, aia primești. SLOT_GRACE = dacă tocmai s-a schimbat (în
// ultimele câteva cadre, cât urcă curcanul din săritură), primești ce era înainte, adică ce ai văzut când ai sărit.
// După lovitură, simbolul ales clipește SLOT_LOCK cadre, apoi primești premiul.
const SLOT_STEP=10,SLOT_GRACE=4,SLOT_LOCK=40;
function slotHit(){
  const c=cafe;if(!c||c.done||c.lock>0)return;
  c.res=G.t-c.iT<SLOT_GRACE?c.lastI:c.i;c.i=c.res;c.lock=SLOT_LOCK;c.bump=0;sfx.bump();sfx.tick();
}
function slotPrize(){
  const c=cafe,r=c.res,x=(c.sx+1)*TS,y=c.sy*TS;
  c.done=true;c.bump=0;c.react=r;c.reactT=55;setSlotTiles(c,'E');G.slotUsed={level:G.level,res:r};MOS.slot=r;mosSave();   // comentariul vine puțin după
  // Boaba de foc / afina: ți se pune direct (cu transformarea obișnuită), nu mai iese din bloc.
  if(r===SLOT_FIRE||r===SLOT_ICE){const p=player,px=p.x+p.w/2;sparkle(px,p.y+p.h/2);if(r===SLOT_FIRE)powerFire(px,p.y);else powerIce(px,p.y);}
  else if(r===SLOT_2UP){G.lives+=2;sfx.oneup();popup('+2 VIEȚI!',x,y-16,'#7fff7f');sparkle(x,y-6);}
  else{sfx.nope();popup('NIMIC...',x,y-16,'#c8c4d8');dust(x,y,6);}
}
// Bătrânelul se uită spre curcan.
const oldFace=()=>player.x+player.w/2<cafe.npcX+OLD_W/2?-1:1;
function updateCafe(){
  const c=cafe,p=player;
  if(c.bump>=0&&++c.bump>=BUMPY.length)c.bump=-1;
  if(!c.done&&c.lock===0){const ni=Math.floor(G.t/SLOT_STEP)%4;if(ni!==c.i){c.lastI=c.i;c.i=ni;c.iT=G.t;}}
  if(c.lock>0){if(c.lock%8===0)sfx.tick();if(--c.lock===0)slotPrize();}
  if(!inCafe()){c.dust.length=0;return;}
  cafeDust(c);
  p.x=clamp(p.x,c.a*TS+CAFE_L+2,c.a*TS+CAFE_R-2-p.w);
  // Prima dată când intri, bătrânelul te salută; după slot, îți spune ce ți-a ieșit (vezi DIALOGUL).
  if(!G.talk&&G.doorT===0){
    if(!c.met){c.met=true;openTalk(c.done?['BINE AI REVENIT, FIULE!',CAFE_BYE]:cafeHello());}
    else if(c.reactT>0&&--c.reactT===0)openTalk([CAFE_REACT[c.react],CAFE_BYE]);
  }
  // Fumul din pipă (aburul cafelelor de pe măsuțe e desenat în cameră, vezi drawCafeRoom).
  if(G.t%34===0){const f=oldFace();parts.push({x:c.npcX+(f>0?24:4),y:CAFE_FLOOR*TS-OLD_H+7,vx:f*0.12,vy:-0.35,g:-0.003,life:70,max:70,col:'#dcdce4',s:2});}
}
// Ce poți face acum cu ↑: 'in' / 'out' = ușile (vezi cafeDoor), 'talk' = vorbești cu bătrânelul (stai lângă el).
function cafeAction(){
  const d=cafeDoor();if(d)return d;
  const p=player;if(!inCafe()||!p||p.dead||!p.onGround||G.talk||G.doorT>0)return null;
  return Math.abs(p.x+p.w/2-(cafe.npcX+OLD_W/2))<22?'talk':null;
}
