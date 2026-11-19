'use strict';
// ===== NIVELUL BONUS: cafeneaua =====
// La mijlocul nivelului bonus e o căsuță maro-cafea
const CAFE_W=25,CAFE_L=64,CAFE_R=320,CAFE_DOOR=82,CAFE_FLOOR=10,CAFE_DY=(12-CAFE_FLOOR)*TS,CAFE_SLOT=10,CAFE_SLOT_Y=CAFE_FLOOR-4,DOOR_T=24;
// Grinda din tavan
const CAFE_TOP=88;
// Tavanul solid (rândurile 0-3)
const CAFE_CEIL=4;
// Ca cafeneaua să stea la mijlocul ecranului
const CAFE_CAMX=-8,CAFE_VY=-12;
const SLOT_FIRE=0,SLOT_ICE=1,SLOT_2UP=2,SLOT_NONE=3;
// Sigla „MesoCafé”: „Meso” albă, „Café” galbenă
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
// Câte un pumn de praf din fiecare loc din tavan
function cafeDust(c){
  for(const d of c.dust){if(--d.t>0)continue;
    for(let i=0,k=2+Math.floor(Math.random()*4);i<k;i++){const life=14+Math.floor(Math.random()*13);
      parts.push({x:d.x+(Math.random()-0.5)*6,y:CAFE_CEIL*TS+1-Math.random()*2,vx:(Math.random()-0.5)*0.3,vy:0.1+Math.random()*0.3,g:0.04,
        life,max:life,col:['#8a7a64','#c8b89a','#a89880'][Math.floor(Math.random()*3)],s:Math.random()<0.15?2:1});}}
  c.dust=c.dust.filter(d=>d.t>0);
}
function setSlotTiles(c,ch){for(let j=0;j<2;j++)for(let i=0;i<2;i++)grid[c.sy+j][c.sx+i]=ch;}
const inCafe=()=>!!cafe&&!!G.inCafe;
// Cea mai din dreapta poziție a camerei afară
const camMax=()=>cafe?(cafe.a-3)*TS-W:under?(under.a-3)*TS-W:cols*TS-W;
// Ușa în fața căreia stă curcanul: 'in' = ușa căsuței
function cafeDoor(){
  const p=player;if(!cafe||!p||p.dead||!p.onGround||G.doorT>0)return null;
  const pc=p.x+p.w/2;
  if(inCafe())return Math.abs(pc-(cafe.a*TS+CAFE_DOOR))<10?'out':null;
  return Math.abs(pc-(cafe.x*TS+48))<12&&p.y+p.h>=12*TS-1?'in':null;
}
// La jumătatea întunecării: curcanul trece dincolo de ușă
function cafeTeleport(){
  const p=player,c=cafe;
  // Înăuntru cântă piesa cafenelei
  if(G.doorTo==="in"&&!G.cafeSeen){G.cafeSeen=true;MOS.cafe++;mosSave();if(MOS.cafe>=10)achUnlock('nepot');}   // Moș Curcan ține minte că ai fost la el
  if(G.doorTo==="in"){G.inCafe=true;p.x=c.a*TS+CAFE_DOOR-p.w/2;cam.x=c.a*TS+CAFE_CAMX;playSong('cafe');}
  else{G.inCafe=false;p.x=c.x*TS+48-p.w/2;cam.x=clamp(p.x+p.w/2-W*0.42,0,camMax());playSong(LEVELS[G.level].song||'main');}
  p.y=(G.inCafe?CAFE_FLOOR:12)*TS-p.h;p.vx=0;p.vy=0;p.face=1;feathers=[];
}
// Blocul-slot e un mini-joc de îndemânare, nu noroc
const SLOT_STEP=10,SLOT_GRACE=4,SLOT_LOCK=40;
function slotHit(){
  const c=cafe;if(!c||c.done||c.lock>0)return;
  c.res=G.t-c.iT<SLOT_GRACE?c.lastI:c.i;c.i=c.res;c.lock=SLOT_LOCK;c.bump=0;sfx.bump();sfx.tick();
}
function slotPrize(){
  const c=cafe,r=c.res,x=(c.sx+1)*TS,y=c.sy*TS;
  c.done=true;c.bump=0;c.react=r;c.reactT=55;setSlotTiles(c,'E');G.slotUsed={level:G.level,res:r};MOS.slot=r;mosSave();   // comentariul vine puțin
  // Boaba de foc / afina: ți se pune direct
  if(r===SLOT_FIRE||r===SLOT_ICE){const p=player,px=p.x+p.w/2;sparkle(px,p.y+p.h/2);if(r===SLOT_FIRE)powerFire(px,p.y);else powerIce(px,p.y);}
  else if(r===SLOT_2UP){G.lives+=2;sfx.oneup();popup('+2 VIEȚI!',x,y-16,'#7fff7f');sparkle(x,y-6);}
  else{sfx.nope();popup('NIMIC...',x,y-16,'#c8c4d8');dust(x,y,6);}
}
// Bătrânelul se uită spre curcan
const oldFace=()=>player.x+player.w/2<cafe.npcX+OLD_W/2?-1:1;
function updateCafe(){
  const c=cafe,p=player;
  if(c.bump>=0&&++c.bump>=BUMPY.length)c.bump=-1;
  if(!c.done&&c.lock===0){const ni=Math.floor(G.t/SLOT_STEP)%4;if(ni!==c.i){c.lastI=c.i;c.i=ni;c.iT=G.t;}}
  if(c.lock>0){if(c.lock%8===0)sfx.tick();if(--c.lock===0)slotPrize();}
  if(!inCafe()){c.dust.length=0;return;}
  cafeDust(c);
  p.x=clamp(p.x,c.a*TS+CAFE_L+2,c.a*TS+CAFE_R-2-p.w);
  // Prima dată când intri, bătrânelul te salută
  if(!G.talk&&G.doorT===0){
    if(!c.met){c.met=true;openTalk(c.done?['BINE AI REVENIT, FIULE!',CAFE_BYE]:cafeHello());}
    else if(c.reactT>0&&--c.reactT===0)openTalk([CAFE_REACT[c.react],CAFE_BYE]);
  }
  // Fumul din pipă
  if(G.t%34===0){const f=oldFace();parts.push({x:c.npcX+(f>0?24:4),y:CAFE_FLOOR*TS-OLD_H+7,vx:f*0.12,vy:-0.35,g:-0.003,life:70,max:70,col:'#dcdce4',s:2});}
}
// Ce poți face acum cu ↑: 'in' / 'out' = ușile
function cafeAction(){
  const d=cafeDoor();if(d)return d;
  const p=player;if(!inCafe()||!p||p.dead||!p.onGround||G.talk||G.doorT>0)return null;
  return Math.abs(p.x+p.w/2-(cafe.npcX+OLD_W/2))<22?'talk':null;
}
