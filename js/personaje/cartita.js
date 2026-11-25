'use strict';
// ===== CÂRTIȚA MINER: doar în peșteră (din editor) =====
// Din profil, grasă, cu burtă, fără haine: blană închisă cu firicele, burta mai deschisă, bot și lăbuțe roz; casca galbenă cu lanternă
const MOLE_PAL={k:'#1a0e10',D:'#3e2a26',F:'#5a3e36',f:'#74524a',T:'#463028',W:'#8a6a5a',w:'#a4826e',N:'#e89a90',n:'#b86a64',E:'#120808',
  Y:'#e8c040',y:'#b08a28',h:'#fff0a0',L:'#fff8d0',P:'#e89a90',p:'#b86a64'};
const MOLE_TOP=[
"......kkkkk.....",
".....kYhYYyLk...",
"....kYhYYYyLLk..",
"....kyyyyyyykk..",
"....kDfFFFFFk...",
"...kDFFFFFEFNNk.",
"...kDFFTFFFFNNnk",
"..kDFFFFFFFnnkk.",
"..kDFFFFFWWWk...",
".kDFFTFFWWwwWk..",
".kDFFFFWWwwwWk..",
"kDFFFFWWwwwwWk..",
"kDFTFFWwwwwwWk..",
"kDFFFFWWwwwwWk..",
"kDDFFFWWWwwWk...",
".kDFFFFWWWWFk...",
".kDDFTFFFFFDk...",
"..kkDDDDDDDkk...",
];
const MOLE_LEG_A=["...kDDk.kPPpk...","...kkkk.kkkkk..."];
const MOLE_LEG_B=["..kDDk...kPPpk..","..kkkk...kkkkk.."];
const MOLE={A:spr(MOLE_TOP.concat(MOLE_LEG_A),MOLE_PAL),B:spr(MOLE_TOP.concat(MOLE_LEG_B),MOLE_PAL)};
MOLE.FLIP=mkSprite(MOLE_TOP.concat(MOLE_LEG_A).reverse(),MOLE_PAL,false);
MOLE.ICE=spr(MOLE_TOP.concat(MOLE_LEG_A),icePal(MOLE_PAL));
// Ritmul: 3 lovituri de târnăcop, apoi se scufundă; sub pământ; praful; iese. Lovitura cu târnăcopul
const MOLE_SPEED=0.4,MOLE_STRIKES=30,MOLE_DIG=58,MOLE_RISE=28,MOLE_DUST=60,MOLE_WIND=20,MOLE_HIT=12,MOLE_REACH=16,MOLE_LAMP=80;   // lanterna: 5 pătrate (felinarul: ~7)
const MOLE_DIRT=['#6a4a30','#8a6040','#4a3220'];
// Afară (se vede, poate fi lovită) / sub pământ (nu se vede, nu rănește)
const moleOut=e=>e.ph==='walk'||e.ph==='atk';
const moleHidden=e=>e.ph==='under'||e.ph==='dust';
const moleSafe=e=>!!e.mole&&!moleOut(e);   // nu o atinge nimic: nici pene, nici bombe, nici săritura
function makeMole(tx,ty){return {type:'man',mole:true,x:tx*TS+3,y:(ty+1)*TS-18,w:10,h:18,vx:0,vy:0,dir:-1,active:false,dead:0,deadT:0,anim:0,
  ph:'walk',t:0,next:180+Math.random()*180|0,alert:0,cd:60,hunt:false,onGround:false,chasing:false,atk:0,holes:[]};}
// Bulgări: în sus (up) sau aruncați în lateral, de ambele părți
function moleDirt(x,y,n,up){for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-0.5)*10,y,vx:(Math.random()-0.5)*1.6,vy:-(up?1.5:0.6)-Math.random()*(up?2:1),g:0.18,life:20+Math.random()*12|0,max:30,col:MOLE_DIRT[i%3],s:i%3?1:2});}
function moleSpray(x,y){for(let i=0;i<3;i++){const d=i%2?1:-1;parts.push({x:x+d*4,y:y-1,vx:d*(1+Math.random()*1.4),vy:-1.6-Math.random()*1.6,g:0.2,life:22,max:22,col:MOLE_DIRT[(Math.random()*3)|0],s:Math.random()<0.3?2:1});}}
// Gaura rămasă în podea: se astupă încet
const moleHole=(e,x,y)=>e.holes.push({x,y,t:150});
// Sub picioare e pământ? Doar prin pământ sapă
const moleOnEarth=e=>{const ty=Math.floor((e.y+e.h+1)/TS),a=Math.floor((e.x+1)/TS),b=Math.floor((e.x+e.w-1)/TS);return 'DG'.includes(tileAt(a,ty))&&'DG'.includes(tileAt(b,ty));};   // pământ sau iarbă
// Unde poate ieși: o coloană cu pământ dedesubt și două pătrate libere deasupra
function moleSpots(x0,x1){
  const out=[];for(let tx=x0;tx<=x1;tx++)for(let r=2;r<ROWS;r++)if('DG'.includes(tileAt(tx,r))&&!solid(tileAt(tx,r-1))&&!solid(tileAt(tx,r-2))&&tileAt(tx,r-1)!=='^')out.push({tx,ty:r});
  return out;
}
// Ținta: aproape de curcan (3-7 pătrate, nu sub el) sau, liniștită, pe lângă locul ei
function molePick(e){
  const inCave=under&&e.x>=under.a*TS,room=Math.min(cafe?cafe.a:cols,under?under.a:cols),a=inCave?under.a+1:0,b=inCave?under.a+under.w-2:room-2;   // afară: doar pe drum
  const pc=Math.floor((player.x+player.w/2)/TS),pr=Math.floor((player.y+player.h)/TS),mc=Math.floor((e.x+5)/TS),mr=Math.floor((e.y+e.h)/TS);
  // Când te vânează: iese în spatele tău (1-2 pătrate) sau chiar sub tine, pe etajul tău
  if(e.hunt){
    const back=-(player.face||1),pick=cs=>{const sp=moleSpots(Math.max(a,Math.min(...cs)),Math.min(b,Math.max(...cs))).filter(s=>cs.includes(s.tx)&&Math.abs(s.ty-pr)<=1);return sp.length?sp[Math.random()*sp.length|0]:null;};
    const s=pick([pc+back,pc+back*2])||pick([pc])||pick([pc-back,pc+back*3]);if(s)return s;
  }
  const c0=e.hunt?pc:mc,r0=e.hunt?pr:mr,lo=e.hunt?1:3,hi=e.hunt?7:6;
  let sp=moleSpots(Math.max(a,c0-hi),Math.min(b,c0+hi)).filter(s=>{const d=Math.abs(s.tx-c0);return d>=lo&&d<=hi;});
  if(!sp.length)return {tx:mc,ty:mr};
  const best=Math.min(...sp.map(s=>Math.abs(s.ty-r0)));sp=sp.filter(s=>Math.abs(s.ty-r0)<=best+1);   // cât mai aproape de etajul curcanului
  if(e.hunt){const near=Math.min(...sp.map(s=>Math.abs(s.tx-c0)));sp=sp.filter(s=>Math.abs(s.tx-c0)<=near+1);}   // cât mai aproape de tine
  return sp[Math.random()*sp.length|0];
}
function moleDig(e,hunt){e.ph='dig';e.t=0;e.vx=0;e.hunt=hunt;e.atk=0;if(!hunt)e.chasing=false;}
function updateMole(e){
  e.t++;if(e.cd>0)e.cd--;
  for(const h of e.holes)h.t--;e.holes=e.holes.filter(h=>h.t>0);
  const gx=e.x+5,gy=e.y+e.h;
  if(e.ph==='dig'){
    // Trei lovituri cu târnăcopul în podea, apoi se scufundă aruncând pământ în lături
    if(e.t<MOLE_STRIKES){if(e.t%10===6){moleDirt(gx+e.dir*9,gy,5,true);mobSfx(e,'bump');if(sfxNear(gx)>0.9)G.shake=Math.max(G.shake,1);}}
    else{if(e.t===MOLE_STRIKES){mobSfx(e,'brk');moleHole(e,gx,gy);}if(e.t%3===0)moleSpray(gx,gy);}
    if(e.t>=MOLE_DIG){e.ph='under';e.t=0;e.dur=60+Math.random()*50|0;}
    return;}
  if(e.ph==='under'){if(e.t>=e.dur){const s=molePick(e);e.x=s.tx*TS+3;e.y=s.ty*TS-e.h;e.vy=0;e.ph='dust';e.t=0;}return;}
  if(e.ph==='dust'){if(e.t%5===0)moleDirt(gx,gy,2,false);if(e.t>=MOLE_DUST){e.ph='rise';e.t=0;mobSfx(e,'brk');moleDirt(gx,gy,10,true);moleHole(e,gx,gy);
      e.dir=Math.sign(player.x+player.w/2-gx)||e.dir;}return;}
  if(e.ph==='rise'){if(e.t%3===0&&e.t<MOLE_RISE-6)moleSpray(gx,gy);if(e.t>=MOLE_RISE){e.ph='walk';e.t=0;e.next=150+Math.random()*180|0;e.cd=e.hunt?90:30;if(e.hunt){e.chasing=true;e.lost=0;}e.hunt=false;}return;}   // după o vânătoare: o pauză până sapă iar
  const dx=(player.x+player.w/2)-gx,dy=(player.y+player.h)-gy;
  if(e.ph==='atk'){
    // Ridică târnăcopul (se întoarce după tine cât îl ridică), apoi lovește
    e.vx=0;
    if(e.t<MOLE_WIND-6&&Math.abs(dx)>6)e.dir=Math.sign(dx);
    if(e.t===MOLE_WIND)mobSfx(e,'stab');
    if(e.t>MOLE_WIND&&e.t<=MOLE_WIND+6&&!player.dead&&overlap(player,{x:e.dir>0?e.x+e.w-2:e.x-MOLE_REACH+2,y:e.y+2,w:MOLE_REACH,h:14}))hurt(e.dir);
    if(e.t>=MOLE_WIND+MOLE_HIT){e.ph='walk';e.t=0;e.cd=40;}
  }else{
    const sees=!player.dead&&lanternSees(e),near=!player.dead&&Math.abs(dx)<16&&Math.abs(dy)<14;   // lovește doar când ești chiar lângă ea
    // Ca fermierul cu felinar: te vede în lumină (se face roșie), te urmărește; dacă te pierde, rămâne nedumerită
    if(e.chasing){if(sees){e.lost=0;e.lastX=player.x+player.w/2;}else if(++e.lost>LOST_T){e.chasing=false;e.puzzled=70;}}
    if(e.puzzled>0){e.puzzled--;e.vx=0;if(e.puzzled===35)e.dir*=-1;if(sees){e.puzzled=0;e.alert=24;}}
    else if(e.alert>0){e.alert--;e.vx=0;if(Math.abs(dx)>2)e.dir=Math.sign(dx);if(e.alert===0){if(Math.abs(dx)>48&&moleOnEarth(e))moleDig(e,true);else{e.chasing=true;e.lost=0;e.cd=10;}}}   // la cel mult 3 pătrate: vine direct, fără să sape
    // Ești lângă ea (în față sau în spate): se întoarce și lovește
    else if(near&&(e.chasing||sees)&&!e.cd&&e.onGround){if(Math.abs(dx)>3)e.dir=Math.sign(dx);e.ph='atk';e.t=0;e.vx=0;mobSfx(e,'windup');}   // doar dacă te-a văzut, ca fermierul
    else if(sees&&!e.chasing&&!e.cd&&e.onGround){e.alert=24;e.vx=0;if(G.t-G.lastAlert>30){mobSfx(e,'alert');G.lastAlert=G.t;}}
    else if(e.chasing){
      // Te urmărește (lumina roșie): dacă ești la mai mult de 3 pătrate, dar cel mult 12, vine pe sub pământ
      const tdx=(sees?player.x+player.w/2:e.lastX||gx)-gx;
      if(!e.cd&&Math.abs(dx)>48&&Math.abs(dx)<=12*TS&&e.onGround&&moleOnEarth(e))moleDig(e,true);
      else{if(Math.abs(tdx)>4)e.dir=Math.sign(tdx);e.vx=Math.abs(tdx)>4?e.dir*0.75:0;if(e.onGround&&(!groundAhead(e,e.dir)||spikeAhead(e,e.dir)))e.vx=0;}}
    else if(e.t>=e.next&&e.onGround&&moleOnEarth(e))moleDig(e,false);   // din când în când se mută
    else{
      e.vx=e.dir*MOLE_SPEED;if(e.onGround&&(!groundAhead(e,e.dir)||spikeAhead(e,e.dir))){e.dir*=-1;e.vx=e.dir*MOLE_SPEED;}}
  }
  e.vy=Math.min(e.vy+0.4,7);
  const moving=e.vx!==0;moveX(e);if(e.hitWall&&e.ph==='walk')e.dir*=-1;moveY(e);
  if(e.onGround&&standsOnSpikes(e)){killMan(e,2,400);mobSfx(e,'stomp');return;}
  if(moving)e.anim+=1;
  if(e.y>H+20){if(e.key)keyDrop(e,true);e.remove=true;}
}
// Târnăcopul, desenat o dată (vertical, cu capul sus): coadă de lemn, cap de oțel curbat, contur
// Târnăcopul, același peste tot: cap de oțel curbat (vârfurile în jos), coadă de lemn; desenat vertical, apoi rotit
const PICK_MAP=[
"..kkkkk..",
".kWSSSsk.",
"kSskHksSk",
"ks.kHk.sk",
"k..kHk..k",
"...kHk...",
"...khk...",
"...kHk...",
"...kHk...",
"...kkk..."];
const PICK=mkSprite(PICK_MAP,{k:'#1a1020',W:'#f4f6ff',S:'#c8ccd8',s:'#7a7e8c',H:'#a8743e',h:'#6a4424'},false);
// Locul mâinii (pe desenul cu fața la dreapta) și unghiul: la mers pieziș peste burtă, ridicat, lovind, săpând
const PICK_POSE={hold:[10,12,Math.PI/4],wind:[10,4,-Math.PI/2],hit:[15,11,Math.PI/2],dig:[17,11,Math.PI]};
function drawPick(bx,by,dir,pose){
  const [hx,hy,ang]=PICK_POSE[pose],Q=(x,y,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(dir>0?bx+x:bx+16-x-w,by+y,w,h);};
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(dir>0?bx+hx:bx+16-hx,by+hy);ctx.scale(dir,1);ctx.rotate(ang);ctx.drawImage(PICK,-4,-7);ctx.restore();
  Q(hx-1,hy-1,2,2,'#e89a90');Q(hx-1,hy,2,1,'#b86a64');Q(hx-2,hy-1,1,2,'#1a0e10');   // lăbuța pe coadă
}
// Cât e de băgată în pământ (în pixeli): la fiecare lovitură intră puțin, apoi se scufundă de tot
function moleSink(e){
  if(e.ph==='dig')return e.t<MOLE_STRIKES?Math.floor(e.t/10)*2:Math.round(4+16*(e.t-MOLE_STRIKES)/(MOLE_DIG-MOLE_STRIKES));
  if(e.ph==='rise')return Math.round(20*(1-Math.min(1,e.t/(MOLE_RISE-6))));
  return 0;
}
// Înaintea terenului: pământul acoperă partea băgată, tremură cât se scufundă/iese
function drawMoleSink(e,cx){
  if(!e.mole||e.dead||(e.ph!=='dig'&&e.ph!=='rise'))return;
  const off=moleSink(e);if(off>=20)return;
  const sx=Math.round(e.x-cx);if(sx<-24||sx>W+24)return;
  const moving=e.ph==='rise'?off>0:e.t>=MOLE_STRIKES,sh=moving?(e.t>>1)%2:0;
  // Tăiată la nivelul solului: se vede și în fața dealurilor din spate
  const gy=Math.round(e.y+e.h);ctx.save();ctx.beginPath();ctx.rect(sx-8,gy-40,32,40);ctx.clip();
  ctx.drawImage(MOLE.A[e.dir>0?'r':'l'],sx-3+sh,Math.round(e.y-2)+off);ctx.restore();
}
// Gaura din podea și crăpăturile de dinainte de ieșire
function drawMoleGround(e,cx){
  for(const h of e.holes){const x=Math.round(h.x-cx),y=Math.round(h.y),a=Math.min(1,h.t/40);ctx.globalAlpha=a;
    ctx.fillStyle='#140a08';ctx.fillRect(x-5,y-1,10,1);ctx.fillRect(x-3,y-2,6,1);
    ctx.fillStyle='#6a4a30';ctx.fillRect(x-8,y-2,3,2);ctx.fillRect(x+5,y-2,3,2);ctx.fillStyle='#8a6040';ctx.fillRect(x-7,y-3,2,1);ctx.fillRect(x+5,y-3,2,1);ctx.globalAlpha=1;}
  if(e.ph==='dust'){const x=Math.round(e.x+5-cx),y=Math.round(e.y+e.h),n=Math.min(5,1+(e.t>>3)),sh=(e.t>>1)%2;
    ctx.fillStyle='#1a0e0a';for(let i=0;i<n;i++){ctx.fillRect(x-1-i+sh,y-1-(i&1),1,1);ctx.fillRect(x+1+i-sh,y-1-((i+1)&1),1,1);}}
}
function drawMole(e,sx){
  const cx=e.x-sx,by=Math.round(e.y-2),bx=sx-3,side=e.dir>0?'r':'l';
  if(e.holes&&e.holes.length||e.ph==='dust')drawMoleGround(e,cx);
  if(e.dead===1){ctx.drawImage(MOLE.A[side],bx,Math.round(e.y+e.h-8),16,8);return;}
  if(e.dead===2){ctx.drawImage(MOLE.FLIP,bx,by);return;}
  if(moleHidden(e))return;
  const gy=Math.round(e.y+e.h);
  // Corpul care intră/iese din pământ e desenat înaintea terenului (drawMoleSink): aici doar târnăcopul
  if(e.ph==='dig'){if(e.t<MOLE_STRIKES){const dn=e.t%10>=5;drawPick(bx,by+moleSink(e),e.dir,dn?'dig':'wind');}return;}
  if(e.ph==='rise'){if(moleSink(e)===0)drawPick(bx,by,e.dir,'hold');return;}
  if(e.ph==='atk'){const wind=e.t<=MOLE_WIND,sh=wind&&e.t>8?((e.t>>1)%2?1:-1):0;
    ctx.drawImage(MOLE.A[side],bx+sh,by);drawPick(bx+sh,by,e.dir,wind?'wind':'hit');return;}
  const f=(e.vx!==0&&(Math.floor(e.anim/8)%2))?'B':'A';
  ctx.drawImage(MOLE[f][side],bx,by);drawPick(bx,by,e.dir,'hold');
  if(e.alert>0)txt('!',sx+3,Math.round(e.y-12),'#ff4040',1,'l','#000');
  else if(e.puzzled>0)txt('?',sx+3,Math.round(e.y-12),'#ffd23f',1,'l','#000');
}
