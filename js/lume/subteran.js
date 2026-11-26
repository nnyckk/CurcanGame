'use strict';
// ===== CAMERA DE SUB PĂMÂNT =====
// Intri printr-o gaură în sol; ecranul se întunecă și ajungi în peșteră
let SUB_CEIL=7;const SUB_SHAFT=2,WALK_AIR=2,EXIT_VX=1.3;   // EXIT_VX: aterizezi la ~1,5 blocuri de groapă   // tavanul: setat de fiecare peșteră
let under=null;
const inUnder=()=>!!under&&!!G.inUnder;
// Cafeneaua sau peștera: nu mai ești pe drumul nivelului
const inRoom=()=>inCafe()||inUnder();
// Peștera: x, x2 = găurile din sol; a = prima coloană a camerei; w = lățimea
function makeUnder(d){SUB_CEIL=(d.opt&&d.opt.ceil)||7;const o=d.opt||{};
  const u={x:d.x,x2:d.x2,a:d.a,w:d.w,opt:d.opt,ex:d.a+(Number.isInteger(o.out)?o.out:d.w-4),en:d.a+(Number.isInteger(o.in)?o.in:2),exH:o.outH||6,enH:o.inH||0};   // exH/enH: înălțimea puțurilor   // ex = puțul de ieșire, en = unde cazi
  if(G.underOpen===G.level)openHoles(u);return u;}
// Găurile sunt ascunse până le folosești prima dată; apoi rămân deschise în nivelul ăsta
const holesOpen=()=>!!under&&grid[12][under.x]==='Y';
function openHoles(u=under){for(const x of [u.x,u.x2])for(let j=12;j<14;j++)for(let i=0;i<SUB_SHAFT;i++)grid[j][x+i]='Y';SHADE.grid=null;}
// Pământul se surpă / sare în aer: bulgări de pământ
function holeBurst(x,up){for(let i=0;i<16;i++)parts.push({x:x*TS+Math.random()*SUB_SHAFT*TS,y:12*TS-2+Math.random()*4,vx:(Math.random()-0.5)*2.2,vy:up?-2-Math.random()*2.5:-0.5-Math.random(),g:0.2,life:26,max:26,col:i%3?theme.dirt:theme.dirtD,s:i%3?1:2});G.shake=5;sfx.brk();}
// Pe pământul crăpat: doar lovitura în pământ (săritură + ↓) îl surpă. Întoarce true dacă s-a deschis.
function poundHole(){
  const p=player;if(!under||G.inUnder||holesOpen()||holeUnder(p)!=='in')return false;
  openHoles();G.underOpen=G.level;holeBurst(under.x,false);p.x=under.x*TS+(SUB_SHAFT*TS-p.w)/2;return true;
}
// Camera în peșteră: nu iese din pereți
const underCam=()=>clamp(camX(),under.a*TS,(under.a+under.w)*TS-W);
// Ce gaură e sub curcan
function holeUnder(p){
  const c=Math.floor((p.x+p.w/2)/TS),u=under;
  return c>=u.x&&c<u.x+SUB_SHAFT?'in':c>=u.x2&&c<u.x2+SUB_SHAFT?'out':null;
}
// Pornește trecerea: ecranul se întunecă, ca la ușa cafenelei
function subGo(dir,at){const p=player;G.subT=DOOR_T;G.subDir=dir;G.subAt=at;p.vx=0;p.vy=0;feathers=[];sfx.shrink();}
// La jumătatea întunecării: curcanul ajunge dincolo
function subTeleport(){
  const p=player,u=under;
  if(G.subDir==='down'){
    G.inUnder=true;achCave();const c=G.subAt==='in'?u.en:u.ex;p.x=c*TS+(SUB_SHAFT*TS-p.w)/2;p.y=-p.h;p.vy=1;playSong('cave');
    cam.x=underCam();
  }else{
    // Pornit din peșteră: găurile se deschid acum, ca după intrare
    G.inUnder=false;const hx=G.subAt==='in'?u.x:u.x2;if(!holesOpen()){openHoles();G.underOpen=G.level;holeBurst(hx,true);}   // praf doar prima dată
    p.x=hx*TS+(SUB_SHAFT*TS-p.w)/2;p.y=12*TS-p.h;const sd=G.subAt==='in'?-1:1;p.vy=-6.5;p.vx=EXIT_VX*sd;p.face=sd;p.pop=20;p.noDrag=true;p.walkOff=false;p.airMax=EXIT_VX;playSong(LEVELS[G.level].song||'main');   // pe intrare: spre stânga
    cam.x=clamp(camX(),0,camMax());
  }
}
// Căderea într-o gaură / săritura în puțul de ieșire
function updateUnder(){
  const p=player;if(!under||p.dead||G.subT>0)return;
  if(!G.inUnder){
    crackCrumbs();   // pământul crăpat se mișcă puțin
    // (pământul crăpat se surpă doar sub lovitura în pământ, vezi poundHole)
    const h=holeUnder(p);if(h&&holesOpen()&&p.y>12*TS)subGo('down',h);return;}
  const c=Math.floor((p.x+p.w/2)/TS);
  if(c>=under.ex&&c<under.ex+SUB_SHAFT&&p.y<under.exH*TS&&p.vy<0)subGo('up','out');
  else if(c>=under.en&&c<under.en+SUB_SHAFT&&p.y<(under.enH||SUB_CEIL)*TS&&p.vy<0)subGo('up','in');   // și pe unde ai intrat   // doar când sari în sus, nu când cazi prin puț
  updateCaveLife();
}
// ---- Viața din peșteră ----
// Unde se termină tavanul / unde începe podeaua, pe coloana tx
const ceilY=tx=>{let y=SUB_CEIL;while(y<12&&grid[y][tx]==='D')y++;return y*TS;};
const floorY=tx=>{let y=ceilY(tx)/TS;while(y<12&&!'DX'.includes(grid[y][tx]))y++;return y*TS;};
function caveDeco(){
  const u=under;if(u.deco)return u.deco;
  const o=u.opt||{},col=i=>u.a+i,fl=(o.fall||[]).map(f=>typeof f==='number'?[col(f),null]:[col(f[0]),f[1]]),falls=fl.filter(f=>f[1]===null||f[1]*TS===ceilY(f[0])).map(f=>f[0]),pools=(o.pools||(o.pool?[o.pool]:[])).map(p=>[col(p[0]),col(p[1]),p[2]]);
  const d={pit:[],tites:[],mites:[],webs:[],shrooms:[],bats:[],drips:[],roots:[],gems:[],falls:[],pools:[],rings:[]};
  d.pools=pools.map(p=>({x0:p[0]*TS+2,x1:(p[1]+1)*TS-2,y:p[2]!=null?p[2]*TS:floorY(p[0])}));   // y = podeaua aleasă
  const shaft=tx=>(tx>=u.en&&tx<u.en+SUB_SHAFT)||(tx>=u.ex&&tx<u.ex+SUB_SHAFT);
  for(let tx=u.a+1;tx<u.a+u.w-1;tx++){if(shaft(tx))continue;const h=vhash(tx,77);
    // Cât loc e sub tavan până la primul bloc
    const cy=ceilY(tx);let free=cy/TS;while(free<12&&grid[free][tx]==='.')free++;
    const pi=d.pools.findIndex((pl,i)=>tx>=pools[i][0]&&tx<=pools[i][1]&&pl.y===floorY(tx)),room=free*TS-cy-2,overPool=pi>=0;
    // Deasupra blocurilor nu atârnă nimic: trebuie să te poți urca pe ele
    const nearBlock=[tx-1,tx,tx+1].some(c=>[8,9,10].some(r=>'MHUARBP'.includes(grid[r][c])));
    if(nearBlock&&!falls.includes(tx))continue;
    if(falls.includes(tx)){}   // țurțurele care cade: mai jos
    else if(h%3===0||overPool)d.tites.push({x:tx*TS+1+(h>>>3)%8,y:cy,len:Math.min(10+(h>>>7)%13,room),w:4+(h>>>11)%5,pool:overPool?d.pools[pi]:null});
    if(grid[12][tx]!=='D'){if(grid[12][tx]==='.'&&grid[13][tx]==='.')d.pit.push(tx);continue;}   // groapa cu țepi de piatră: doar unde e gaură în podea
    if(h%3===1&&grid[11][tx]==='.'&&!overPool)d.mites.push({x:tx*TS+1+(h>>>13)%8,y:floorY(tx),len:8+(h>>>15)%9,w:4+(h>>>17)%4});
    if(h%9===4&&!overPool)d.shrooms.push({x:tx*TS+4+(h>>>19)%7,y:floorY(tx)});
    if(h%9===2&&!falls.includes(tx))d.roots.push({x:tx*TS+3+(h>>>21)%10,y:cy,len:14+(h>>>23)%18,ph:h%17});
  }
  // Țurțurii care cad: atârnă de tavanul ales (oricare, nu doar cel de sus)
  for(const [tx,ry] of fl){const cy=ry===null?ceilY(tx):ry*TS;let fr=cy/TS,fy=cy/TS;while(fr<12&&grid[fr][tx]==='.')fr++;while(fy<13&&!'DX'.includes(grid[fy][tx]))fy++;
    d.falls.push({x:tx*TS+3,y:cy,len:Math.max(8,Math.min(26,fr*TS-cy-2)),w:10,big:true,st:'wait',t:0,vy:0,floor:fy*TS});}
  d.webs.push({x:(u.a+1)*TS,y:ceilY(u.a+1),dir:1},{x:(u.a+u.w-1)*TS,y:ceilY(u.a+u.w-2),dir:-1});
  for(const i of o.bats||[6,16]){const bx=typeof i==='number'?i:i[0],hx=col(bx)*TS+8,hy=typeof i==='number'?ceilY(col(bx)):i[1]*TS;d.bats.push({hx,hy,x:hx,y:hy+1,vx:0,vy:0,st:'hang',t:0,ph:bx});}
  // Pietre în pereți, tavan și podea: pe tile-urile de pământ ale camerei
  d.stones=[];for(let tx=u.a;tx<u.a+u.w;tx++)for(let ty=0;ty<ROWS;ty++){if(grid[ty][tx]!=='D')continue;const h=vhash(tx,ty*13+5);
    if(h%6===0)d.stones.push({x:tx*TS+2+(h>>>3)%10,y:ty*TS+2+(h>>>7)%10,n:2+(h>>>11)%3,s:h>>>13});}
  // În fundal: pietre și schelete de curcan
  d.bgStones=[];for(let tx=u.a+1;tx<u.a+u.w-1;tx++){const h=vhash(tx,311);if(h%3===0)d.bgStones.push({x:tx*TS+(h>>>4)%12,y:SUB_CEIL*TS+8+(h>>>9)%60,n:2+(h>>>13)%3,s:h>>>15});}
  // În peretele din spate: câte un craniu și un os, stinse
  // k: 0 craniu, 1 os culcat, 2 os în picioare, 3 os oblic
  d.bones=[];for(let tx=u.a+1;tx<u.a+u.w-1;tx++){const h=vhash(tx,523);if(h%5!==0)continue;
    d.bones.push({x:tx*TS+(h>>>4)%10,y:SUB_CEIL*TS+10+(h>>>9)%50,k:(h>>>15)%8,f:(h>>>19)%2});}
  // Câteva oase îngropate în pământul de sus (tavan)
  d.earthBones=[];for(let tx=u.a+1;tx<u.a+u.w-1;tx++){const h=vhash(tx,719);if(h%6!==0)continue;
    const b={x:tx*TS+(h>>>4)%10,y:8+(h>>>9)%(SUB_CEIL*TS-28),k:2+(h>>>15)%6,f:(h>>>19)%2},ty=Math.floor(b.y/TS);
    if(grid[ty][tx]==='D'&&grid[ty][tx+1]==='D'&&grid[ty+1][tx]==='D')d.earthBones.push(b);}   // doar în pământ, nu peste puțuri
  // Picături: din vârfurile de deasupra bălții și din câteva altele
  d.drips=d.tites.filter((s,i)=>s.pool||i%4===1).map((s,i)=>({x:s.x+(s.w>>1),y:s.y+s.len,t:40+i*37,pool:s.pool}));
  // Cristale: pe jos (i) sau în perete (['L'|'R', rând])
  // Pe jos: întâi foarte mare, apoi mic, apoi mare; în pereți: stânga mic, dreapta mare
  let nf=0,k=0;for(const g of o.gems||[]){   // k: culoarea, pe rând
    if(typeof g==='number')d.gems.push({x:col(g)*TS+3,y:floorY(col(g)),dir:-1,c:(u.a+k++)%3,sz:[2,0,1][nf++%3]});
    else if(g[0]==='F'){const a=k++;d.gems.push({x:col(g[1])*TS+3,y:g[2]*TS,dir:-1,c:g[4]??(u.a+a)%3,sz:g[3]??[2,0,1][nf++%3]});}   // pe podeaua aleasă
    else if(g[0]==='C'){const a=k++;d.gems.push({x:col(g[1])*TS+3,y:g[2]!=null?g[2]*TS:ceilY(col(g[1])),dir:3,c:g[4]??(u.a+a)%3,sz:g[3]??(k%2)});}   // din tavan
    else{const wl=g[0]==='L',a=k++;d.gems.push({x:wl?(u.a+1)*TS:(u.a+u.w-1)*TS,y:g[1]*TS+8,dir:wl?1:2,c:g[3]??(u.a+a)%3,sz:g[2]??(wl?0:1)});}}
  d.webs=d.webs.filter(wb=>!d.gems.some(g=>Math.abs(g.x-wb.x)<24&&Math.abs(g.y-wb.y)<28));   // fără pânză peste cristale
  return u.deco=d;
}
// Liliecii, picăturile, cercurile din baltă, stalactitele care cad
function updateCaveLife(){
  const d=caveDeco(),p=player,px=p.x+p.w/2;
  for(const b of d.bats)updateBat(b,px,p);
  for(const r of d.drips)if(--r.t<=0){r.t=(r.pool?50:90)+(vhash(r.x,G.t)%90);
    parts.push({x:r.x,y:r.y,vx:0,vy:0.2,g:0.14,life:34,max:34,col:'#8ac8f0',s:1});
    const fall=Math.round(Math.sqrt(2*((r.pool?r.pool.y:floorY(Math.floor(r.x/TS)))-r.y)/0.14));
    if(r.pool)d.rings.push({x:r.x,t:-fall});}
  for(const g of d.rings)g.t++;d.rings=d.rings.filter(g=>g.t<18);
  // Prin baltă: stropi mici când mergi
  if(p.onGround&&inPool(px,p.y+p.h)&&Math.abs(p.vx)>0.5&&G.t%6===0)poolSplash(px,3);
  for(const s of d.falls){
    if(s.st==='wait'&&Math.abs(px-(s.x+s.w/2))<22&&p.y>s.y&&p.y<s.floor){s.st='shake';s.t=0;sfx.bump();}
    else if(s.st==='shake'&&++s.t>=28)s.st='fall';
    else if(s.st==='fall'){s.vy=Math.min(s.vy+0.35,7);s.y+=s.vy;
      if(!p.dead&&overlap(p,{x:s.x+1,y:s.y+s.len*0.3,w:s.w-2,h:s.len*0.7}))hurt(0);
      if(s.y+s.len>=s.floor){s.st='gone';sfx.brk();G.shake=4;
        for(let i=0;i<10;i++)parts.push({x:s.x+Math.random()*s.w,y:s.floor-2,vx:(Math.random()-0.5)*2.4,vy:-1.5-Math.random()*2,g:0.2,life:24,max:24,col:i%2?theme.dirt:mixHex(theme.dirtD,'#000000',0.3),s:i%3?1:2});}}}
}
// Ești în balta din peșteră?
function inPool(x,y){const d=under&&G.inUnder&&under.deco;return !!d&&d.pools.some(pl=>x>pl.x0&&x<pl.x1&&Math.abs(y-pl.y)<6);}
// Stropi de apă din baltă
function poolSplash(x,n){const ps=under.deco.pools,pl=ps.find(p=>x>p.x0-8&&x<p.x1+8)||ps[0],y=pl.y;
  for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-0.5)*8,y:y,vx:(Math.random()-0.5)*1.6,vy:-1-Math.random()*1.4,g:0.18,life:18,max:18,col:i%3?'#9ad4f4':'#e0f4ff',s:i%4?1:2});}
// Liliacul zboară cu viteză, iar fiecare pas e verificat: cutia lui (cu tot cu aripi) nu intră niciodată în pământ sau blocuri
const BAT_HW=8,BAT_H=9;
function batFree(x,y){
  if(y<SUB_CEIL*TS)return false;   // nu urcă în puțuri
  for(let ty=Math.floor(y/TS);ty<=Math.floor((y+BAT_H)/TS);ty++)for(let tx=Math.floor((x-BAT_HW)/TS);tx<=Math.floor((x+BAT_HW)/TS);tx++)if(solid(tileAt(tx,ty)))return false;
  return true;
}
// Un punct liber prin peșteră, spre care zboară
function batTarget(b){
  const u=under;for(let k=0;k<12;k++){const x=(u.a+2)*TS+Math.random()*(u.w-4)*TS,y=SUB_CEIL*TS+4+Math.random()*44;if(batFree(x,y)){b.tx=x;b.ty=y;return;}}
  b.tx=b.hx;b.ty=b.hy+1;
}
function updateBat(b,px,p){
  b.t++;
  if(b.st==='hang'){if(b.t>60&&Math.abs(px-b.hx)<48&&p.y<b.hy+96&&p.y>b.hy-8){b.st='fly';b.t=0;b.x=b.hx;b.y=b.hy+1;b.vx=px<b.hx?1.5:-1.5;b.vy=1;batTarget(b);batSound(b);}return;}
  if(b.st==='fly'&&b.t>260){b.st='back';b.t=0;batRoost(b);}
  if(b.st==='fly'&&(b.t%70===0||Math.hypot(b.tx-b.x,b.ty-b.y)<10))batTarget(b);
  // Se îndreaptă spre țintă, cu o fluturare
  const sp=b.st==='back'?1.6:2.2;
  b.vx=clamp(b.vx+(b.tx-b.x)*0.01,-sp,sp);b.vy=clamp(b.vy+(b.ty-b.y)*0.012+Math.sin(G.t*0.3+b.ph)*0.12,-sp,sp);
  if(batFree(b.x+b.vx,b.y))b.x+=b.vx;else{b.vx=-b.vx*0.5;if(b.st==='fly')batTarget(b);}
  if(batFree(b.x,b.y+b.vy))b.y+=b.vy;else{b.vy=-b.vy*0.5;if(b.st==='fly')batTarget(b);}
  if(b.st==='back'&&Math.hypot(b.hx-b.x,b.hy+1-b.y)<4){b.st='hang';b.t=0;b.x=b.hx;b.y=b.hy+1;}
  else if(b.st==='back'&&b.t>120){b.t=0;batRoost(b);}   // n-a ajuns: alt loc, deasupra lui
  if(b.st==='fly'&&G.t%90===b.ph%90)batSound(b);
}
// Își caută un loc pe tavan chiar deasupra lui: acolo urcă drept în sus, fără colțuri
function batRoost(b){
  const u=under;let x=clamp(b.x,(u.a+1)*TS+BAT_HW,(u.a+u.w-1)*TS-BAT_HW);
  const sh=c=>(c>=u.en&&c<u.en+SUB_SHAFT)||(c>=u.ex&&c<u.ex+SUB_SHAFT);
  for(let k=0;k<6&&(sh(Math.floor((x-BAT_HW)/TS))||sh(Math.floor((x+BAT_HW)/TS)));k++)x+=x<(u.a+u.w/2)*TS?TS:-TS;   // nu sub puțuri
  // Tavanul de deasupra lui (nu neapărat cel de sus)
  const up=tx=>{let r=Math.max(0,Math.min(13,Math.floor(b.y/TS)));while(r<13&&solid(grid[r][tx]))r++;while(r>0&&!solid(grid[r-1][tx]))r--;return r*TS;};
  const hy=Math.max(up(Math.floor((x-BAT_HW)/TS)),up(Math.floor((x+BAT_HW)/TS)));
  b.hx=x;b.hy=hy;b.tx=x;b.ty=hy+1;
}
// Chițăie doar dacă se vede
function batSound(b){if(b.x>cam.x-10&&b.x<cam.x+W+10)sfx.bat();}
const batPos=b=>b.st==='hang'?[b.hx,b.hy+1]:[b.x,b.y];
// Liliacul: aripi sus, aripi jos, atârnat; e = unde sunt ochii
const BAT_UP={p:["#.............#","##...........##","###..#...#..###","####.#####.####",".#############.","...#########...","......###......",".......#......."],e:[[6,3],[8,3]]};
const BAT_DN={p:["......#.#......",".....#####.....","...#########...",".#############.","####.#####.####","###.........###","##...........##","#.............#"],e:[[6,1],[8,1]]};
const BAT_HANG={p:["#.....#",".#...#.",".#####.","#######","#######",".#####.","..#.#.."],e:[[2,4],[4,4]]};
function drawBat(b,cx){
  const [x,y]=batPos(b),S=b.st!=='hang'?((G.t>>2)%2?BAT_UP:BAT_DN):BAT_HANG,w=S.p[0].length,x0=Math.round(x-cx-w/2),y0=Math.round(y);
  ctx.fillStyle='#2a1c30';S.p.forEach((r,j)=>{for(let i=0;i<w;i++)if(r[i]==='#')ctx.fillRect(x0+i,y0+j,1,1);});
  ctx.fillStyle='#3e2c46';S.p.forEach((r,j)=>{const i=r.indexOf('#');if(i>=0&&j<3)ctx.fillRect(x0+i,y0+j,1,1);});   // marginea aripii, puțin mai deschisă
  ctx.fillStyle='#ff6a5a';for(const [ex,ey] of S.e)ctx.fillRect(x0+ex,y0+ey,1,1);
}
// Un țurțure de piatră: dir 1 = atârnă, -1 = crește din podea
function drawSpike(s,cx,dir,sx=0){
  const x=Math.round(s.x-cx)+sx;if(x<-10||x>W+10)return;
  const md=s.big?theme.dirt:mixHex(theme.dirtD,'#000000',0.15),dk=s.big?theme.dirtD:mixHex(theme.dirtD,'#000000',0.45),lt=s.big?mixHex(theme.dirtL,'#ffffff',0.15):theme.dirt;   // cea care cade e mai deschisă
  // Lumină pe stânga, umbră pe dreapta
  for(let j=0;j<s.len;j++){const ww=Math.max(1,Math.round(s.w*(1-j/s.len))),y=Math.round(dir>0?s.y+j:s.y-1-j),ox=x+((s.w-ww)>>1);
    ctx.fillStyle=md;ctx.fillRect(ox,y,ww,1);
    if(ww>1){ctx.fillStyle=lt;ctx.fillRect(ox,y,1,1);ctx.fillStyle=dk;ctx.fillRect(ox+ww-1,y,1,1);}
    if(ww>3){ctx.fillStyle=lt;ctx.fillRect(ox+1,y,1,1);}}
}
function drawWeb(wb,cx){
  const x=Math.round(wb.x-cx),y=wb.y,d=wb.dir;if(x<-20||x>W+20)return;
  ctx.fillStyle='rgba(220,220,235,0.45)';
  for(let i=0;i<12;i++){ctx.fillRect(x+d*i,y+i,1,1);ctx.fillRect(x+d*i,y,1,1);ctx.fillRect(x,y+i,1,1);if(i<9)ctx.fillRect(x+d*Math.round(i*0.5),y+i,1,1);if(i<9)ctx.fillRect(x+d*i,y+Math.round(i*0.5),1,1);}
  for(const r of [4,8])for(let k=0;k<=r;k++){ctx.fillRect(x+d*k,y+r-Math.round(k*0.6),1,1);}
}
function drawShroom(s,cx){
  const x=Math.round(s.x-cx),y=s.y;if(x<-10||x>W+10)return;
  glow(x+2,y-3,9+Math.sin(G.t*0.05+s.x)*1.5,'110,230,200',0.35);
  ctx.fillStyle='#d8e8e0';ctx.fillRect(x+1,y-3,1,3);ctx.fillRect(x+4,y-2,1,2);
  ctx.fillStyle='#5ae8c0';ctx.fillRect(x,y-5,3,2);ctx.fillRect(x+3,y-4,3,2);ctx.fillStyle='#b8fff0';ctx.fillRect(x+1,y-5,1,1);ctx.fillRect(x+4,y-4,1,1);
}
// Rădăcină care atârnă și se leagănă puțin
function drawRoot(r,cx){
  const x=Math.round(r.x-cx);if(x<-10||x>W+10)return;
  for(let j=0;j<r.len;j++){const sw=Math.round(Math.sin(j*0.35+r.ph)*1.2+Math.sin(G.t*0.03+r.ph)*(j/r.len)*1.5);
    ctx.fillStyle=j<3?'#4a3020':'#7a5636';ctx.fillRect(x+sw,r.y+j,1,1);
    if(j%7===4){ctx.fillStyle='#6a4a2c';ctx.fillRect(x+sw+(j%2?1:-1),r.y+j+1,1,2);}}
}
// Cristal: un mănunchi de prisme cu vârf ascuțit, fețe deschise / închise, și pietricele la bază
const GEM_COL=[['#c890ff','#8a50e0','#f0d8ff','190,130,255','#4a2080'],['#80d8ff','#3a90d0','#e0f8ff','120,200,255','#1a4a80'],['#80f0a8','#30a860','#e0ffe8','120,240,160','#0e5030']];   // mov, albastru, verde
// Trei mărimi: mic, mare, foarte mare (doar pe jos); prismele sunt alese la întâmplare: [deplasare, lățime, înălțime, înclinare]
function gemPrisms(sz,seed){
  const H=[12,21,33][sz],half=[5,9,14][sz],ns=[[2,4],[2,4,5],[5,6,7,8]][sz],R=k=>vhash(seed,k);
  const n=ns[R(1)%ns.length],main=[5,7,9][sz],out=[[((R(2)%3)-1),main,H,0]];
  for(let i=1;i<n;i++){const side=i%2?-1:1,o=side*(2+R(10+i)%(half-1)),w=R(20+i)%3===0&&sz?5:3+((R(30+i)%2)*2);
    out.push([o,Math.min(w,main-2),Math.max(4,Math.round(H*(0.25+(R(40+i)%55)/100))),side*(R(50+i)%3===0?2:1)]);}
  return out.sort((p,q)=>q[2]-p[2]);   // cele înalte în spate
}
const GEM_TOP=[12,21,33],GEM_HALF=[6,10,15];
function drawGems(g,cx){
  const x=Math.round(g.x-cx);if(x<-30||x>W+30)return;const [m,dk,lt,rgb,ol]=GEM_COL[g.c];
  // u = de-a latul, v = în lungul cristalului
  // floor = în sus din podea sau în jos din tavan (dir 3); altfel din perete
  const ceil=g.dir===3,floor=g.dir<0||ceil,bx=floor?x+5:x,by=g.y,s=g.dir===1?1:-1,sv=ceil?1:-1;
  const P=(u,v,c)=>{ctx.fillStyle=c;if(floor)ctx.fillRect(bx+u,ceil?by+v:by-1-v,1,1);else ctx.fillRect(bx+s*v,by+u,1,1);};
  const sz=g.sz||0,top=GEM_TOP[sz],hw=GEM_HALF[sz];
  glow(floor?bx:bx+s*top/2,floor?by+sv*top/2:by,top+6+Math.sin(G.t*0.05+g.x)*2,rgb,0.35);
  for(const [o,w,h,ln] of g.pr||(g.pr=gemPrisms(sz,g.x*7+g.y))){const t=(w+1)>>1;
    for(let v=0;v<h;v++){const ww=Math.min(w,1+2*(h-1-v)),u0=o+Math.round(ln*v/5)-(ww>>1),tip=v>=h-t;
      for(let k=0;k<ww;k++){const edge=k===0||k===ww-1;
        P(u0+k,v,edge&&ww>2?ol:tip?(k<ww/2?lt:m):k<w/3?lt:k>=w-w/3-0.5?dk:m);}}
    P(o+Math.round(ln*(h-2)/5),h-1,'#ffffff');}   // vârful sclipește
  // Pietricele de cristal la bază
  for(const [u,c] of [[-hw,dk],[1-hw,m],[hw-1,m],[hw,dk],[-1,dk]])P(u,0,c);
  if((G.t+g.x)%90<6){const [sx,sy]=floor?[bx,by+sv*(top+2)]:[bx+s*(top+2),by];ctx.fillStyle='#ffffff';ctx.fillRect(sx-1,sy,3,1);ctx.fillRect(sx,sy-1,1,3);}
}
// Balta: scobită în pământ, cu maluri și apă în ea
function drawPool(pl,rings,cx){
  const x0=Math.round(pl.x0-cx),x1=Math.round(pl.x1-cx);if(x1<0||x0>W)return;const y=pl.y,w=x1-x0;
  const wet=mixHex(theme.dirtD,'#000000',0.25),mud=mixHex(theme.dirtD,'#000000',0.45);
  // Băltoace mici, puțin adânci, cu petice de pământ ud printre ele
  const lvl=i=>Math.sin((pl.x0+i)*0.45)+Math.sin((pl.x0+i)*0.17+1.3)*0.8-Math.max(0,3-Math.min(i,w-1-i))*0.5;
  for(let i=0;i<w;i++){const v=lvl(i);
    if(v<-0.3){if(vhash(pl.x0+i,3)%3===0){ctx.fillStyle=wet;ctx.fillRect(x0+i,y,1,1);}continue;}   // pământ, din loc în loc ud
    const dep=v>0.6?2:1;ctx.fillStyle=wet;ctx.fillRect(x0+i,y,1,dep+1);ctx.fillStyle=mud;ctx.fillRect(x0+i,y+dep,1,1);
    const c=vhash(pl.x0+i,7)%4;ctx.fillStyle=c===0?'#2e6a9e':c===1?'#5a9ccc':'#3a7ab4';ctx.fillRect(x0+i,y,1,dep);
    const sh=((pl.x0+i)*3+(G.t>>2))%23;if(sh<2){ctx.fillStyle=sh?'#bfe6ff':'#ffffff';ctx.fillRect(x0+i,y,1,1);}}
  for(const g of rings){if(g.t<0)continue;const r=1+g.t*0.5,gx=Math.round(g.x-cx);ctx.fillStyle='rgba(220,245,255,'+(1-g.t/18)+')';
    ctx.fillRect(Math.round(gx-r),y,1,1);ctx.fillRect(Math.round(gx+r),y,1,1);if(g.t<6)ctx.fillRect(gx,y-1-((6-g.t)>>1),1,1);}
}
// Un pâlc de pietre rotunjite; dim = mai stinse (în fundal)
function drawStones(st,cx,dim){
  const x=Math.round(st.x-cx);if(x<-20||x>W+20)return;
  const C=dim?['#3a3640','#4a4652','#2a2730']:['#5e5a66','#7c7884','#3c3944'];
  for(let k=0;k<st.n;k++){const s=st.s>>>(k*4),w=3+(s%3),h=2+((s>>>2)%2),rx=x+((k*5+(s%3))%11)-2,ry=st.y+((k*3+(s>>>1))%5)-2;
    ctx.fillStyle=C[2];ctx.fillRect(rx,ry+1,w,h);ctx.fillRect(rx+1,ry+h+1,w-2,1);
    ctx.fillStyle=C[0];ctx.fillRect(rx,ry+1,w-1,h-1);ctx.fillRect(rx+1,ry,w-2,1);
    ctx.fillStyle=C[1];ctx.fillRect(rx+1,ry,Math.max(1,w-3),1);}
}
// Craniu și os, în peretele din spate
// Oase de mai multe forme și mărimi; o = orbită (închisă la culoare)
const BONES=[
  [".####.","######","#oo#oo","######",".#.#.#"],                                  // craniu mic
  ["..#####..",".#######.","#########","#oo##oo##","#########",".#.#.#.#.","..#.#.#.."],   // craniu mare
  ["##...##",".#####.","##...##"],                                                   // os scurt
  ["##.......##",".#########.","##.......##"],                                       // os lung
  ["#.#",".#.",".#.",".#.",".#.","#.#"],                                             // os în picioare
  ["##....","##....","..#...","...#..","....##","....##"],                           // os oblic
  ["..###.",".#....","#.....","#.....",".#....","..###."],                           // coastă curbată
  ["#.#.#.#",".#####.","#.#.#.#"]];                                                  // bucată de șira spinării
function drawBones(b,cx){
  const x=Math.round(b.x-cx);if(x<-20||x>W+20)return;const S=BONES[b.k];
  S.forEach((r,j)=>{for(let i=0;i<r.length;i++){const c=r[i];if(c==='.')continue;
    ctx.fillStyle=c==='o'?'#2a1c1c':j===S.length-1?'#a89c84':'#d8d0bc';ctx.fillRect(b.f?x+r.length-1-i:x+i,b.y+j,1,1);}});
}
// Decorul peșterii, peste tile-uri
function drawCaveLife(cx){
  const d=caveDeco();
  for(const s of d.stones)drawStones(s,cx,false);
  ctx.globalAlpha=0.75;for(const b of d.earthBones)drawBones(b,cx);ctx.globalAlpha=1;   // oasele din pământ
  for(const r of d.roots)drawRoot(r,cx);
  for(const s of d.tites)drawSpike(s,cx,1);
  for(const s of d.falls)if(s.st!=='gone')drawSpike(s,cx,1,s.st==='shake'?((s.t>>1)%2?1:-1):0);
  for(const s of d.mites)drawSpike(s,cx,-1);
  drawPitSpikes(d.pit,cx);
  for(const w of d.webs)drawWeb(w,cx);
  for(const s of d.shrooms)drawShroom(s,cx);
  for(const g of d.gems)drawGems(g,cx);
  for(const pl of d.pools)drawPool(pl,d.rings.filter(g=>g.x>=pl.x0&&g.x<=pl.x1),cx);
  for(const b of d.bats)drawBat(b,cx);
}
// Semnul intrării ascunse: crăpături mici în pământ, sub iarbă și mai jos
// Fisura mare: [dx, dy, lățime]
const CRACK_MAIN=[[15,7,2],[15,8,2],[16,9,2],[16,10,2],[15,11,2],[14,12,2],[15,13,2],[16,14,2],[17,15,2],[17,16,2],[16,17,2],[15,18,2],[14,19,2],[15,20,2],[15,21,2],[16,22,2],[17,23,2],[17,24,2],[16,25,2],[16,26,1],[15,27,1],
  [13,13,1],[12,14,1],[11,15,1],[10,15,1],[19,16,1],[20,17,1],[21,17,1],[22,18,1],[13,20,1],[12,21,1],[11,21,1],[10,22,1],[19,24,1],[20,25,1],[21,26,1]];
// Din când în când, câteva firișoare de pământ sar din fisură
function crackCrumbs(){
  if(holesOpen()||G.t%180!==0)return;const x=under.x*TS;if(x+32<cam.x||x>cam.x+W)return;
  for(let i=0;i<3;i++)parts.push({x:x+14+Math.random()*6,y:12*TS+1,vx:(Math.random()-0.5)*0.6,vy:-0.5-Math.random()*0.5,g:0.08,life:16,max:16,col:mixHex(theme.dirtD,'#000000',0.3),s:1});
}
function drawHoleCracks(cx){
  if(!under||inUnder())return;
  if(holesOpen()){for(const hx of [under.x,under.x2])drawDarkSnow(hx,cx);return;}   // zăpadă sau iarbă întunecată sus în găuri, peste colțuri
  const x=Math.round(under.x*TS-cx),y=12*TS;if(x<-40||x>W+8)return;
  ctx.fillStyle=mixHex(theme.dirtD,'#000000',0.6);
  for(const [dx,dy] of [[9,7],[10,8],[11,8],[12,9],[13,10],[14,10],[15,9],[16,9],[17,10],[18,11],[19,11],[20,10],[21,10],[22,11],[14,11],[14,12],[19,12]])ctx.fillRect(x+dx,y+dy,1,1);
  // Fisura mare, de 2 px, în zigzag, cu ramuri
  for(const [dx,dy,w] of CRACK_MAIN)ctx.fillRect(x+dx,y+dy,w,1);
  ctx.fillStyle=theme.dirtL;for(const [dx,dy] of [[18,8],[17,13],[19,15],[16,19],[19,23]])ctx.fillRect(x+dx,y+dy,1,1);   // relief
  ctx.fillStyle=mixHex(theme.dirtD,'#000000',0.6);
  // Crăpături mici și câteva mai mari, până jos
  for(const [dx,dy] of [[4,13],[5,14],[6,14],[7,15],[25,14],[26,15],[27,15],[28,16],
    [10,17],[11,17],[12,18],[13,18],[14,19],[15,20],[16,20],[13,19],[13,20],
    [22,19],[23,20],[24,20],[7,22],[8,22],[9,23],[10,24],[11,24],[9,25],
    [18,24],[19,25],[20,25],[21,26],[22,27],[23,27],[21,27],[21,28],
    [3,27],[4,28],[5,28],[6,29],[27,29],[28,30],[29,30],[14,29],[15,30],[16,30],[17,31]])ctx.fillRect(x+dx,y+dy,1,1);
  ctx.fillStyle=theme.dirtL;for(const [dx,dy] of [[10,7],[16,8],[21,9],[5,13],[11,16],[23,19],[8,21],[19,23],[4,27]])ctx.fillRect(x+dx,y+dy,1,1);
  // Câteva pietre ca în peșteră, printre crăpături
  for(const st of [{x:under.x*TS+1,y:y+16,n:2,s:0x9a3c51},{x:under.x*TS+20,y:y+22,n:3,s:0x3f81e7},{x:under.x*TS+9,y:y+27,n:1,s:0x7c2d13}])drawStones(st,cx,false);
}
// Fundalul peșterii: același pământ întunecat ca în puțuri și pasaje, cu diamante care sclipesc
const DIAMOND_COL=['150,230,255','255,150,230','190,255,200','255,240,170'];
function drawUnderBG(cx){
  const x0=Math.floor(cx/TS),x1=Math.floor((cx+W)/TS);
  for(let tx=x0;tx<=x1;tx++)for(let ty=0;ty<ROWS;ty++)ctx.drawImage(tiles.Yv[vhash(tx,ty)%3],tx*TS-cx,ty*TS);
  // Mereu umbra de noapte, ca peste puțuri
  ctx.fillStyle='rgba(12,18,56,0.4)';ctx.fillRect(0,0,W,H);
  // Pietre, oase și cranii în peretele din spate
  if(under&&under.deco){for(const s of under.deco.bgStones)drawStones(s,cx,true);ctx.globalAlpha=0.4;for(const b of under.deco.bones)drawBones(b,cx);ctx.globalAlpha=1;}
  // Diamantele, prinse în perete: mici, mijlocii și mari
  for(let i=Math.floor(cx/38)-1;i<(cx+W)/38+1;i++){const h=vhash(i,123);if(h%3===0)continue;
    const x=Math.round(i*38+(h>>>4)%30-cx),y=SUB_CEIL*TS+6+(h>>>9)%72,c=DIAMOND_COL[(h>>>14)%4],a=0.5+0.5*Math.sin(G.t*0.04+(h%50)),sz=(h>>>18)%5;
    if(nearRock(x+cx,y))continue;   // lumina nu intră în pereți sau puțuri
    drawDiamond(x,y,sz<2?0:sz<4?1:2,c,a);}
}
// Diamant: 0 = sclipire mică, 1 = romb mijlociu, 2 = piatră mare cu fețe
function drawDiamond(x,y,k,c,a){
  glow(x,y,[5,8,12][k]+a*3,c,0.3*a+0.15);
  const P=(px,py,col)=>{ctx.fillStyle=col;ctx.fillRect(x+px,y+py,1,1);},m='rgb('+c+')',lt='#ffffff',dk='rgba(0,0,0,0.35)';
  if(k===0){ctx.fillStyle=m;ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3);}
  else{const rows=k===1?[1,3,5,3,1]:[3,5,7,7,5,3,1],r0=-(rows.length>>1);
    rows.forEach((w,j)=>{ctx.fillStyle=m;ctx.fillRect(x-(w>>1),y+r0+j,w,1);});
    // Fețele: lumină sus-stânga, umbră jos-dreapta
    rows.forEach((w,j)=>{P(-(w>>1),r0+j,lt);if(w>1)P(w>>1,r0+j,dk);});
    if(k===2){ctx.fillStyle='rgba(255,255,255,0.45)';ctx.fillRect(x-2,y+r0+1,2,1);ctx.fillRect(x-3,y+r0+2,1,1);}}
  ctx.globalAlpha=a;P(0,0,lt);ctx.globalAlpha=1;
}
// Groapa cu țepi: pietre ascuțite, înalte și scunde, cu vârfuri deschise
function drawPitSpikes(cols,cx){
  if(!cols.length)return;const by=ROWS*TS+24,dk=mixHex(theme.dirtD,'#000000',0.55),md=mixHex(theme.dirtD,'#5e5a66',0.5),lt='#9a96a2',tip='#d8d4dc';
  for(const tx of cols){const x0=Math.round(tx*TS-cx);if(x0<-TS||x0>W)continue;
    // Doi țepi mari și unul mic între ei, pe fiecare pătrat
    for(const [o,w,h] of [[0,9,46+vhash(tx,1)%5],[5,7,37+vhash(tx,2)%4],[9,9,43+vhash(tx,3)%6]]){
      for(let j=0;j<h;j++){const ww=Math.max(1,Math.round(w*(1-j/h))),x=x0+o+((w-ww)>>1),y=by-1-j;
        ctx.fillStyle=md;ctx.fillRect(x,y,ww,1);
        if(ww>1){ctx.fillStyle=lt;ctx.fillRect(x,y,1,1);ctx.fillStyle=dk;ctx.fillRect(x+ww-1,y,1,1);}
        if(j>h-4){ctx.fillStyle=tip;ctx.fillRect(x,y,ww,1);}}}}
}
// E pământ sau puț la mai puțin de 16px de punctul ăsta?
function nearRock(wx,y){for(const dx of [-16,0,16])for(const dy of [-16,0,16]){const t=tileAt(Math.floor((wx+dx)/TS),Math.floor((y+dy)/TS));if(t!=='.')return true;}return false;}
