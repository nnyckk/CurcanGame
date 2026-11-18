'use strict';
// ===== CAMERA DE SUB PĂMÂNT =====
// Intri printr-o gaură în sol; ecranul se întunecă și ajungi în peșteră
const SUB_CEIL=7,SUB_SHAFT=2,WALK_AIR=2;
let under=null;
const inUnder=()=>!!under&&!!G.inUnder;
// Cafeneaua sau peștera: nu mai ești pe drumul nivelului
const inRoom=()=>inCafe()||inUnder();
// Peștera: x, x2 = găurile din sol; a = prima coloană a camerei; w = lățimea
function makeUnder(d){const u={x:d.x,x2:d.x2,a:d.a,w:d.w,opt:d.opt,ex:d.a+d.w-4};   // ex = puțul de ieșire
  if(G.underOpen===G.level)openHoles(u);return u;}
// Găurile sunt ascunse până le folosești prima dată; apoi rămân deschise în nivelul ăsta
const holesOpen=()=>!!under&&grid[12][under.x]==='Y';
function openHoles(u=under){for(const x of [u.x,u.x2])for(let j=12;j<14;j++)for(let i=0;i<SUB_SHAFT;i++)grid[j][x+i]='Y';SHADE.grid=null;}
// Pământul se surpă / sare în aer: bulgări de pământ
function holeBurst(x,up){for(let i=0;i<16;i++)parts.push({x:x*TS+Math.random()*SUB_SHAFT*TS,y:12*TS-2+Math.random()*4,vx:(Math.random()-0.5)*2.2,vy:up?-2-Math.random()*2.5:-0.5-Math.random(),g:0.2,life:26,max:26,col:i%3?theme.dirt:theme.dirtD,s:i%3?1:2});G.shake=5;sfx.brk();}
// ↓ sau S: te apleci
const inDown=()=>keys.ArrowDown||keys.KeyS;
// Camera în peșteră: nu iese din pereți
const underCam=()=>clamp(player.x+player.w/2-W*0.42,under.a*TS,(under.a+under.w)*TS-W);
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
    G.inUnder=true;const c=G.subAt==='in'?u.a+2:u.ex;p.x=c*TS+(SUB_SHAFT*TS-p.w)/2;p.y=-p.h;p.vy=1;
    cam.x=underCam();
  }else{
    G.inUnder=false;holeBurst(u.x2,true);p.x=u.x2*TS+(SUB_SHAFT*TS-p.w)/2;p.y=12*TS-p.h;p.vy=-6.5;p.vx=1.6;p.face=1;p.pop=20;p.walkOff=false;p.airMax=WALK_AIR;
    cam.x=clamp(p.x+p.w/2-W*0.42,0,camMax());
  }
}
// Căderea într-o gaură / săritura în puțul de ieșire
function updateUnder(){
  const p=player;if(!under||p.dead||G.subT>0)return;
  if(!G.inUnder){
    // Pe pământul crăpat: dacă te apleci, se surpă
    if(!holesOpen()&&p.onGround&&inDown()&&holeUnder(p)==='in'){openHoles();G.underOpen=G.level;holeBurst(under.x,false);p.x=under.x*TS+(SUB_SHAFT*TS-p.w)/2;p.vx=0;p.onGround=false;p.vy=1;}
    const h=holeUnder(p);if(h&&holesOpen()&&p.y>12*TS)subGo('down',h);return;}
  const c=Math.floor((p.x+p.w/2)/TS);
  if(c>=under.ex&&c<under.ex+SUB_SHAFT&&p.y<6*TS&&p.vy<0)subGo('up');   // doar când sari în sus, nu când cazi prin puț
  updateCaveLife();
}
// ---- Viața din peșteră ----
// Unde se termină tavanul / unde începe podeaua, pe coloana tx
const ceilY=tx=>{let y=SUB_CEIL;while(y<12&&grid[y][tx]==='D')y++;return y*TS;};
const floorY=tx=>{let y=SUB_CEIL;while(y<12&&grid[y][tx]!=='D')y++;return y*TS;};
function caveDeco(){
  const u=under;if(u.deco)return u.deco;
  const o=u.opt||{},col=i=>u.a+i,falls=(o.fall||[]).map(col),pool=o.pool?[col(o.pool[0]),col(o.pool[1])]:null;
  const d={tites:[],mites:[],webs:[],shrooms:[],bats:[],drips:[],roots:[],gems:[],falls:[],pool:null,rings:[]};
  const shaft=tx=>(tx>=u.a+2&&tx<u.a+4)||(tx>=u.ex&&tx<u.ex+SUB_SHAFT);
  for(let tx=u.a+1;tx<u.a+u.w-1;tx++){if(shaft(tx))continue;const h=vhash(tx,77);
    // Cât loc e sub tavan până la primul bloc
    const cy=ceilY(tx);let free=cy/TS;while(free<12&&grid[free][tx]==='.')free++;
    const room=free*TS-cy-2,overPool=!!pool&&tx>=pool[0]&&tx<=pool[1];
    if(falls.includes(tx))d.falls.push({x:tx*TS+3,y:cy,len:Math.min(26,room),w:10,big:true,st:'wait',t:0,vy:0,floor:floorY(tx)});
    else if(h%3===0||overPool)d.tites.push({x:tx*TS+1+(h>>>3)%8,y:cy,len:Math.min(10+(h>>>7)%13,room),w:4+(h>>>11)%5,pool:overPool});
    if(h%3===1&&grid[11][tx]==='.'&&!overPool)d.mites.push({x:tx*TS+1+(h>>>13)%8,y:floorY(tx),len:8+(h>>>15)%9,w:4+(h>>>17)%4});
    if(h%9===4&&!overPool)d.shrooms.push({x:tx*TS+4+(h>>>19)%7,y:floorY(tx)});
    if(h%9===2&&!falls.includes(tx))d.roots.push({x:tx*TS+3+(h>>>21)%10,y:cy,len:14+(h>>>23)%18,ph:h%17});
  }
  d.webs.push({x:(u.a+1)*TS,y:ceilY(u.a+1),dir:1},{x:(u.a+u.w-1)*TS,y:ceilY(u.a+u.w-2),dir:-1});
  for(const i of [6,16])d.bats.push({hx:col(i)*TS+8,hy:ceilY(col(i)),st:'hang',t:0,ph:i});
  // Picături: din vârfurile de deasupra bălții și din câteva altele
  d.drips=d.tites.filter((s,i)=>s.pool||i%4===1).map((s,i)=>({x:s.x+(s.w>>1),y:s.y+s.len,t:40+i*37,pool:s.pool}));
  if(pool)d.pool={x0:pool[0]*TS+2,x1:(pool[1]+1)*TS-2,y:floorY(pool[0])};
  // Cristale: pe jos (i) sau în perete (['L'|'R', rând])
  for(const g of o.gems||[]){
    if(typeof g==='number')d.gems.push({x:col(g)*TS+3,y:floorY(col(g)),dir:-1,c:g%2});
    else{const wl=g[0]==='L';d.gems.push({x:wl?(u.a+1)*TS:(u.a+u.w-1)*TS,y:g[1]*TS+8,dir:wl?1:2,c:wl?0:1});}}
  return u.deco=d;
}
// Liliecii, picăturile, cercurile din baltă, stalactitele care cad
function updateCaveLife(){
  const d=caveDeco(),p=player,px=p.x+p.w/2;
  for(const b of d.bats){b.t++;
    if(b.st==='hang'&&b.t>60&&Math.abs(px-b.hx)<44&&p.y<b.hy+90){b.st='fly';b.t=0;b.dir=px<b.hx?1:-1;}
    else if(b.st==='fly'&&b.t>220){b.st='back';b.t=0;}
    else if(b.st==='back'&&b.t>40){b.st='hang';b.t=0;}}
  for(const r of d.drips)if(--r.t<=0){r.t=(r.pool?50:90)+(vhash(r.x,G.t)%90);
    parts.push({x:r.x,y:r.y,vx:0,vy:0.2,g:0.14,life:34,max:34,col:'#8ac8f0',s:1});
    if(r.pool&&d.pool)d.rings.push({x:r.x,t:-Math.round(Math.sqrt(2*(d.pool.y-r.y)/0.14))});}
  for(const g of d.rings)g.t++;d.rings=d.rings.filter(g=>g.t<18);
  // Prin baltă: stropi mici când mergi
  if(p.onGround&&inPool(px,p.y+p.h)&&Math.abs(p.vx)>0.5&&G.t%6===0)poolSplash(px,3);
  for(const s of d.falls){
    if(s.st==='wait'&&Math.abs(px-(s.x+s.w/2))<22&&p.y>s.y){s.st='shake';s.t=0;sfx.bump();}
    else if(s.st==='shake'&&++s.t>=28)s.st='fall';
    else if(s.st==='fall'){s.vy=Math.min(s.vy+0.35,7);s.y+=s.vy;
      if(!p.dead&&overlap(p,{x:s.x+1,y:s.y+s.len*0.3,w:s.w-2,h:s.len*0.7}))hurt(0);
      if(s.y+s.len>=s.floor){s.st='gone';sfx.brk();G.shake=4;
        for(let i=0;i<10;i++)parts.push({x:s.x+Math.random()*s.w,y:s.floor-2,vx:(Math.random()-0.5)*2.4,vy:-1.5-Math.random()*2,g:0.2,life:24,max:24,col:i%2?theme.dirt:mixHex(theme.dirtD,'#000000',0.3),s:i%3?1:2});}}}
}
// Ești în balta din peșteră?
function inPool(x,y){const d=under&&G.inUnder&&under.deco,pl=d&&d.pool;return !!pl&&x>pl.x0&&x<pl.x1&&Math.abs(y-pl.y)<6;}
// Stropi de apă din baltă
function poolSplash(x,n){const y=under.deco.pool.y;
  for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-0.5)*8,y:y,vx:(Math.random()-0.5)*1.6,vy:-1-Math.random()*1.4,g:0.18,life:18,max:18,col:i%3?'#9ad4f4':'#e0f4ff',s:i%4?1:2});}
// Poziția liliacului: bucle largi, dar doar prin aerul peșterii
function batPos(b){
  if(b.st==='hang')return [b.hx,b.hy+3];
  const fx=t=>b.hx+b.dir*Math.sin(t*0.035)*70+Math.sin(t*0.11+b.ph)*10,fy=t=>b.hy+18+Math.sin(t*0.09+b.ph)*12+Math.sin(t*0.031)*14;
  let x,y;if(b.st==='fly'){x=fx(b.t);y=fy(b.t);}else{const k=b.t/40,x1=fx(220),y1=fy(220);x=x1+(b.hx-x1)*k;y=y1+(b.hy+3-y1)*k;}
  return batClamp(x,y);
}
// Nu intră în pereți, tavan, podea sau blocuri
// Ține cont de toată lățimea liliacului (aripile), nu doar de mijloc
function batClamp(x,y){
  const u=under;x=clamp(x,(u.a+1)*TS+8,(u.a+u.w-1)*TS-8);const cs=[Math.floor((x-6)/TS),Math.floor((x+6)/TS)];
  y=clamp(y,Math.max(...cs.map(ceilY))+2,Math.min(...cs.map(floorY))-10);
  for(const c of cs){const lo=Math.floor((y+7)/TS),hi=Math.floor(y/TS);
    if(solid(tileAt(c,lo)))y=lo*TS-8;else if(solid(tileAt(c,hi)))y=(hi+1)*TS+1;}
  return [x,y];
}
// Liliacul: aripi sus, aripi jos, atârnat; e = unde sunt ochii
const BAT_UP={p:["#.........#","##..#.#..##","###.###.###",".#########.","....###....",".....#....."],e:[[4,2],[6,2]]};
const BAT_DN={p:["....#.#....","...#####...",".#########.","###.###.###","##.......##","#.........#"],e:[[4,1],[6,1]]};
const BAT_HANG={p:["#...#",".###.","#####","#####",".###.","..#.."],e:[[1,4],[3,4]]};
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
// Cristal: trei așchii colțuroase care strălucesc
const GEM_COL=[['#c890ff','#8a50e0','#f0d8ff','190,130,255'],['#80d8ff','#3a90d0','#e0f8ff','120,200,255']];
function drawGems(g,cx){
  const x=Math.round(g.x-cx);if(x<-20||x>W+20)return;const [m,dk,lt,rgb]=GEM_COL[g.c];
  const P=(px,py,c)=>{ctx.fillStyle=c;ctx.fillRect(px,py,1,1);};
  // Așchie de lungime h, înclinată; vertical (pe jos) sau orizontal (din perete)
  const shard=(bx,by,h,tilt,side)=>{for(let j=0;j<h;j++){const ww=j<2?1:3,o=Math.round(tilt*j/4)-(ww>>1);
    for(let k=0;k<ww;k++){const c=k===0?lt:k===ww-1?dk:m;
      if(side)P(bx+side*j,by+o+k,c);else P(bx+o+k,by-j,c);}}};
  if(g.dir<0){glow(x+5,g.y-5,14+Math.sin(G.t*0.05+g.x)*2,rgb,0.4);shard(x+2,g.y-1,7,-3,0);shard(x+5,g.y-1,11,0,0);shard(x+8,g.y-1,6,3,0);}
  else{const s=g.dir===1?1:-1;glow(x+s*5,g.y,14+Math.sin(G.t*0.05+g.x)*2,rgb,0.4);shard(x,g.y-3,6,-3,s);shard(x,g.y,9,0,s);shard(x,g.y+3,5,3,s);}
  if((G.t+g.x)%90<6){const sx=g.dir<0?x+5:x+(g.dir===1?7:-7),sy=g.dir<0?g.y-11:g.y;ctx.fillStyle='#ffffff';ctx.fillRect(sx-1,sy,3,1);ctx.fillRect(sx,sy-1,1,3);}
}
// Balta: scobită în pământ, cu maluri și apă în ea
function drawPool(pl,rings,cx){
  const x0=Math.round(pl.x0-cx),x1=Math.round(pl.x1-cx);if(x1<0||x0>W)return;const y=pl.y,w=x1-x0;
  const bank=mixHex(theme.dirtD,'#000000',0.35),mud=mixHex(theme.dirtD,'#000000',0.15);
  // Groapa: malurile coboară în trepte, fundul e noroi
  ctx.fillStyle=bank;ctx.fillRect(x0,y,w,1);ctx.fillRect(x0+1,y+1,w-2,1);ctx.fillRect(x0+2,y+2,w-4,4);
  ctx.fillStyle=mud;ctx.fillRect(x0+3,y+5,w-6,1);
  // Apa, puțin sub marginea solului
  ctx.fillStyle='rgba(50,110,170,0.9)';ctx.fillRect(x0+2,y+1,w-4,4);
  ctx.fillStyle='#7ac0ea';ctx.fillRect(x0+2,y+1,w-4,1);
  ctx.fillStyle='rgba(210,240,255,0.7)';for(let i=0;i<3;i++){const sx=x0+6+((G.t>>3)+i*11)%Math.max(1,w-12);ctx.fillRect(sx,y+1,2,1);}
  ctx.fillStyle=theme.dirt;ctx.fillRect(x0,y-1,2,1);ctx.fillRect(x1-2,y-1,2,1);   // marginea malului
  for(const g of rings){if(g.t<0)continue;const r=1+g.t*0.6,gx=Math.round(g.x-cx);ctx.fillStyle='rgba(220,245,255,'+(1-g.t/18)+')';
    ctx.fillRect(Math.round(gx-r),y+1,1,1);ctx.fillRect(Math.round(gx+r),y+1,1,1);if(g.t<6)ctx.fillRect(gx,y-((6-g.t)>>1),1,1);}
}
// Decorul peșterii, peste tile-uri
function drawCaveLife(cx){
  const d=caveDeco();
  for(const r of d.roots)drawRoot(r,cx);
  for(const s of d.tites)drawSpike(s,cx,1);
  for(const s of d.falls)if(s.st!=='gone')drawSpike(s,cx,1,s.st==='shake'?((s.t>>1)%2?1:-1):0);
  for(const s of d.mites)drawSpike(s,cx,-1);
  for(const w of d.webs)drawWeb(w,cx);
  for(const s of d.shrooms)drawShroom(s,cx);
  for(const g of d.gems)drawGems(g,cx);
  if(d.pool)drawPool(d.pool,d.rings,cx);
  for(const b of d.bats)drawBat(b,cx);
}
// Semnul intrării ascunse: crăpături mici în pământ, sub iarbă și mai jos
function drawHoleCracks(cx){
  if(!under||inUnder()||holesOpen())return;const x=Math.round(under.x*TS-cx),y=12*TS;if(x<-40||x>W+8)return;
  ctx.fillStyle=mixHex(theme.dirtD,'#000000',0.45);
  for(const [dx,dy] of [[9,7],[10,8],[11,8],[12,9],[13,10],[14,10],[15,9],[16,9],[17,10],[18,11],[19,11],[20,10],[21,10],[22,11],[14,11],[14,12],[19,12]])ctx.fillRect(x+dx,y+dy,1,1);
  // Crăpături mici și câteva mai mari, până jos
  for(const [dx,dy] of [[4,13],[5,14],[6,14],[7,15],[25,14],[26,15],[27,15],[28,16],
    [10,17],[11,17],[12,18],[13,18],[14,19],[15,20],[16,20],[13,19],[13,20],
    [22,19],[23,20],[24,20],[7,22],[8,22],[9,23],[10,24],[11,24],[9,25],
    [18,24],[19,25],[20,25],[21,26],[22,27],[23,27],[21,27],[21,28],
    [3,27],[4,28],[5,28],[6,29],[27,29],[28,30],[29,30],[14,29],[15,30],[16,30],[17,31]])ctx.fillRect(x+dx,y+dy,1,1);
  ctx.fillStyle=theme.dirtL;for(const [dx,dy] of [[10,7],[16,8],[21,9],[5,13],[11,16],[23,19],[8,21],[19,23],[4,27]])ctx.fillRect(x+dx,y+dy,1,1);
}
// Fundalul peșterii: același pământ întunecat ca în puțuri și pasaje, cu diamante care sclipesc
const DIAMOND_COL=['150,230,255','255,150,230','190,255,200','255,240,170'];
function drawUnderBG(cx){
  const x0=Math.floor(cx/TS),x1=Math.floor((cx+W)/TS);
  for(let tx=x0;tx<=x1;tx++)for(let ty=0;ty<ROWS;ty++)ctx.drawImage(tiles.Yv[vhash(tx,ty)%3],tx*TS-cx,ty*TS);
  // Noaptea, aceeași umbră ca peste puțuri
  if(theme.night){ctx.fillStyle='rgba(12,18,56,0.4)';ctx.fillRect(0,0,W,H);}
  // Diamantele, prinse în perete
  for(let i=Math.floor(cx/38)-1;i<(cx+W)/38+1;i++){const h=vhash(i,123);if(h%3===0)continue;
    const x=Math.round(i*38+(h>>>4)%30-cx),y=SUB_CEIL*TS+6+(h>>>9)%72,c=DIAMOND_COL[(h>>>14)%4],a=0.5+0.5*Math.sin(G.t*0.04+(h%50));
    glow(x,y,6+a*3,c,0.35*a+0.15);
    ctx.fillStyle='rgb('+c+')';ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3);
    ctx.fillStyle='#ffffff';ctx.globalAlpha=a;ctx.fillRect(x,y,1,1);ctx.globalAlpha=1;
    if((h>>>18)%4===0){ctx.fillStyle='rgb('+c+')';ctx.fillRect(x-2,y,1,1);ctx.fillRect(x+2,y,1,1);ctx.fillRect(x,y-2,1,1);ctx.fillRect(x,y+2,1,1);}}
}
