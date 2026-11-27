'use strict';
// ===== DESEN: fundalul cu paralaxă și tile-urile =====
function par(img,f,y=0,extra=0){const w=img.width;let ox=-((cam.x*f+extra)%w);if(ox>0)ox-=w;ox=Math.floor(ox);ctx.drawImage(img,ox,y);ctx.drawImage(img,ox+w,y);}
// cy: camera sus/jos; dealurile coboară mai încet (paralaxă), cerul stă
const BG_CAM_Y=0.35;
function drawBG(cy=0){ctx.drawImage(bg.sky,0,0);const by=Math.round(-cy*BG_CAM_Y);ctx.save();ctx.translate(0,by);if(bg.clouds)par(bg.clouds,0.1,0,G.t*0.08);
  if(bg.dyn&&!bg.night)drawBirds();par(bg.far,0.2);if(bg.dyn)drawFarmLife();par(bg.mid,0.45);if(bg.near)par(bg.near,0.7);ctx.restore();}
const BUMPY=[2,4,5,5,4,3,2,1];
// Vecinii lângă care pământul nu are margine
const EARTH_N='GDIXF',EARTH_BLK='BPMHARES';
const EDGE_CACHE=new Map();
// Pământ cu margini: contur închis și umbră unde se termină
// bare = pământ gol deasupra (în peșteră): margine de sus deschisă la culoare și colțuri rotunjite ca la iarbă
function earthEdge(img,l,r,b,grass,bare){
  if(!l&&!r&&!b&&!bare)return img;
  let m=EDGE_CACHE.get(img);if(!m)EDGE_CACHE.set(img,m={});
  const k=(l?1:0)|(r?2:0)|(b?4:0)|(bare?8:0);if(m[k])return m[k];
  const [c,g]=mkCanvas(16,16);g.drawImage(img,0,0);
  const d=mixHex(theme.dirtD,'#000000',0.45),P=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);},round=grass||bare,top=round?2:0,s0=grass?6:bare?2:0;
  if(bare){P(0,0,16,1,theme.dirtL);P(0,1,16,1,mixHex(theme.dirtL,theme.dirt,0.5));if(l)P(1,1,1,1,theme.dirtL);if(r)P(14,1,1,1,theme.dirtL);}
  // Umbra de pe laturi e continuă de la un tile la altul
  if(l){P(0,top,1,16-top,d);P(1,s0,1,16-s0,'rgba(0,0,0,0.15)');if(round)g.clearRect(0,0,2,1),g.clearRect(0,1,1,1);}
  if(r){P(15,top,1,16-top,d);P(14,s0,1,16-s0,'rgba(0,0,0,0.25)');P(13,s0,1,16-s0,'rgba(0,0,0,0.12)');if(round)g.clearRect(14,0,2,1),g.clearRect(15,1,1,1);}   // latura din dreapta, în umbră
  if(b){P(0,15,16,1,d);P(0,13,16,2,'rgba(0,0,0,0.22)');if(l)g.clearRect(0,15,1,1);if(r)g.clearRect(15,15,1,1);}
  return m[k]=c;
}
// Tile-ul de bază al pământului, fără margini
const earthBase=(c,tx,ty)=>c==='G'?(tiles.Gv?pickVar(tiles.Gv,tx,ty):tiles.G):(tiles.Dv?pickVar(tiles.Dv,tx,ty):tiles.D);
// Pământul din spate: iarbă sus, tot mai închis în jos
// Dealurile din spate: aceeași culoare pe toată înălțimea; umbra vine din harta de umbră, ca la prim-plan
function wImg(tx,ty){let d=0;while(d<4&&tileAt(tx,ty-1-d)==='W')d++;if(!d&&tileAt(tx,ty-1)!=='Z')return tiles.WG;const a=tiles.Wd[0];return a.length>1?pickVar(a,tx,ty):a[0];}
function zImg(tx,ty){let d=0;while(d<4&&tileAt(tx,ty-1-d)==='Z')d++;if(!d)return tiles.ZG;const a=tiles.Zd[0];return a.length>1?pickVar(a,tx,ty):a[0];}
// Ce se vede prin colțurile rotunjite: pasajul sau pământul din spate
function behindEarth(tx,ty){
  const ns=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[tx+a,ty+b,tileAt(tx+a,ty+b)]);
  if(ns.some(n=>n[2]==='Y'))return tiles.Yv[vhash(tx,ty)%3];
  const z=ns.find(n=>n[2]==='Z');if(z)return zImg(z[0],z[1]);const w=ns.find(n=>n[2]==='W');return w?wImg(w[0],w[1]):null;
}
// Pământul e mai închis spre mijloc, mai deschis lângă margini (hartă de umbră, câte 4 px)
const SHADE={grid:null,cv:null},SHADE_STEP=[12,26],SHADE_A=[0,0.14,0.26];
function earthShade(){
  if(SHADE.grid===grid&&SHADE.top===topRow&&SHADE.bot===botRow)return SHADE.cv;
  const T=-topRow,w=cols*4,h=(botRow+T)*4,D=new Float32Array(w*h),L=new Uint8Array(w*h),INF=1e9;
  // Fiecare strat are umbra lui: 1 = pământul din față, 2 = dealul din spate, 3 = cel și mai din spate
  const layer=c=>c==='G'||c==='D'?1:c==='Z'?2:c==='W'?3:0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const l=layer(grid[(y>>2)-T][x>>2]);L[y*w+x]=l;D[y*w+x]=l?INF:0;}
  // Distanța până la marginea propriului strat (două treceri); alt strat contează ca loc gol
  const at=(x,y,l)=>x<0||x>=w||y>=h||y<0?INF:L[y*w+x]===l?D[y*w+x]:0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,l=L[i];if(!l)continue;
    D[i]=Math.min(D[i],at(x-1,y,l)+3,at(x,y-1,l)+3,at(x-1,y-1,l)+4,at(x+1,y-1,l)+4);}
  for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const i=y*w+x,l=L[i];if(!l)continue;
    D[i]=Math.min(D[i],at(x+1,y,l)+3,at(x,y+1,l)+3,at(x+1,y+1,l)+4,at(x-1,y+1,l)+4);}
  // Pe pixeli: 3 trepte de umbră, cu margini puțin colțuroase
  const PW=cols*TS,PH=(botRow+T)*TS,[c,g]=mkCanvas(PW,PH),img=g.createImageData(PW,PH),A=SHADE_A.map(a=>a*255);
  const cd=(x,y,l)=>{x=Math.max(0,Math.min(w-1,x));y=Math.max(0,Math.min(h-1,y));const i=y*w+x;return L[i]===l?D[i]/3*4:0;};
  for(let Y=0;Y<PH;Y++){const fy=Y/4-0.5,y0=Math.floor(fy),ty=fy-y0;
    for(let X=0;X<PW;X++){const l=layer(grid[(Y>>4)-T][X>>4]);if(!l)continue;
      const fx=X/4-0.5,x0=Math.floor(fx),tx=fx-x0;
      const dd=(cd(x0,y0,l)*(1-tx)+cd(x0+1,y0,l)*tx)*(1-ty)+(cd(x0,y0+1,l)*(1-tx)+cd(x0+1,y0+1,l)*tx)*ty+(vhash(X>>2,Y>>2)%7)-3;
      const lv=dd<SHADE_STEP[0]?0:dd<SHADE_STEP[1]?1:2,i=(Y*PW+X)*4;
      img.data[i]=18;img.data[i+1]=8;img.data[i+2]=16;img.data[i+3]=A[lv];}}
  g.putImageData(img,0,0);SHADE.grid=grid;SHADE.top=topRow;SHADE.bot=botRow;return SHADE.cv=c;
}
function drawEarthShade(cx){const s=earthShade();ctx.drawImage(s,cx,0,W,s.height,0,topRow*TS,W,s.height);}
// Lățimea gurii pasajului, rând cu rând
const MOUTH=[7,5,4,3,2,2,1,1];
// Zăpadă sau iarbă întunecată sus în gaura peșterii: doar grosimea stratului, cu marginea de jos neregulată
function drawDarkSnow(hx,cx){darkFringe(hx*TS-2,SUB_SHAFT*TS+4,12*TS,cx);}
// Marginea întunecată de sus a unei gropi: zăpadă sau iarbă în umbră (px = x în lume)
function darkFringe(px,w,y,cx){const x=Math.round(px-cx);if(x<-40||x>W)return;
  const dk=c=>mixHex(c,'#000000',0.5),[c0,c1,c2]=theme.snow?['#5a6a7e','#46546a','#7a8aa0']:[dk(theme.grass),dk(theme.grassD),dk(theme.grassL)];   // zăpadă sau iarbă, întunecate
  for(let i=0;i<w;i++){const wx=px+i,d=4+Math.round(Math.sin(wx*0.5)*1.2+Math.sin(wx*0.23)*1);
    ctx.fillStyle=c0;ctx.fillRect(x+i,y,1,d);ctx.fillStyle=c1;ctx.fillRect(x+i,y+d,1,1);
    if(vhash(wx,y)%5===0){ctx.fillStyle=c2;ctx.fillRect(x+i,y+1,1,1);}}
}
// Pasajul prin deal: umbră sub tavan; la gură peretele coboară și se rotunjește
function drawTunnel(tx,ty,cx){
  const x=tx*TS-cx,y=ty*TS,rc=tileAt(tx,ty-1),open=t=>t!=='Y'&&!EARTH_N.includes(t);
  ctx.drawImage(tiles.Yv[vhash(tx,ty)%3],x,y);
  if(rc==='.'){darkFringe(tx*TS,TS,y,cx);return;}   // deschis spre cer: ca groapa peșterii
  if(EARTH_BLK.includes(rc)){ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(x,y,16,3);ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(x,y+3,16,3);return;}   // sub cărămizi: doar umbra tavanului
  if(!EARTH_N.includes(rc))return;
  ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(x,y,16,3);ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(x,y+3,16,3);
  const d=mixHex(theme.dirtD,'#000000',0.45),top=earthBase(rc,tx,ty-1),tex=earthBase('D',tx,ty);
  for(const s of [-1,1]){if(!open(tileAt(tx+s,ty)))continue;
    const P=(i,yy,col)=>{ctx.fillStyle=col;ctx.fillRect(x+(s<0?i:15-i),yy,1,1);};
    const row=(src,sy,n,yy)=>{if(n>0){const sx=s<0?1:15-n;ctx.drawImage(src,sx,sy,n,1,x+sx,yy,n,1);}};
    const sh=s<0?[[1,'rgba(0,0,0,0.15)']]:[[1,'rgba(0,0,0,0.25)'],[2,'rgba(0,0,0,0.12)']];
    // Sub gură, tavanul nu mai are linia de jos
    for(let j=-3;j<0;j++){row(top,16+j,MOUTH[0]-1,y+j);sh.forEach(([i,c])=>P(i,y+j,c));}
    P(0,y-1,d);
    MOUTH.forEach((w,j)=>{const k=Math.min(w-1,MOUTH[j+1]||0)-1;
      row(tex,j,k,y+j);sh.forEach(([i,c])=>{if(i<=k)P(i,y+j,c);});
      P(0,y+j,d);for(let i=Math.max(k+1,1);i<w;i++)P(i,y+j,d);});}
}
function drawTiles(cx){
  const x0=Math.max(0,Math.floor(cx/TS)),x1=Math.min(cols-1,Math.floor((cx+W)/TS));
  const fi=[0,1,2,1][(G.t>>3)%4],mf=tiles.M[fi];
  const cy=inRoom()?0:Math.round(cam.y),y0=Math.max(topRow,Math.floor(cy/TS)-1),y1=Math.min(botRow-1,Math.floor((cy+H+(G.lift||0))/TS)+1);   // doar rândurile din ecran
  const at=(x,y)=>y>=ROWS&&y<botRow?(x<0||x>=cols?'X':grid[y][x]):tileAt(x,y);   // și rândurile de dedesubt (doar desen)
  for(let ty=y0;ty<=y1;ty++){const row=grid[ty];for(let tx=x0;tx<=x1;tx++){const c=row[tx];if(c==='.')continue;
    // Placa de gheață se desenează în drawWater
    if(c==='I'){
      if(isCopca(tx-1))drawStake(tx*TS+3-cx);
      if(isCopca(tx+1))drawStake(tx*TS+11-cx);
      continue;}
    // Blocul-slot se desenează o singură dată
    if(c==='S'||c==='E'){if(at(tx-1,ty)!==c&&at(tx,ty-1)!==c)drawSlotBlock(tx*TS-cx,ty*TS,c==='E');continue;}
    let img=(c==='M'||c==='H')?mf:c==='A'?tiles.A[fi]:c==='R'?tiles.R[fi]:c==='P'?tiles.B:c==='F'&&at(tx,ty-1)==='F'?tiles.F2:tiles[c];   // V nu are desen
    if(c==='G'||c==='D')img=earthBase(c,tx,ty);else if(c==='Z')img=zImg(tx,ty);else if(c==='W')img=wImg(tx,ty);
    if(c==='Y'){drawTunnel(tx,ty,cx);continue;}
    if(c==='G'||c==='D'){const u=behindEarth(tx,ty);if(u)ctx.drawImage(u,tx*TS-cx,ty*TS);}
    // Dealul din spate peste cel și mai din spate: colțurile arată dealul de dedesubt
    if(c==='Z'){const w=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[tx+a,ty+b]).find(([x,y])=>at(x,y)==='W');if(w)ctx.drawImage(wImg(w[0],w[1]),tx*TS-cx,ty*TS);}
    // Pământul: margini rotunjite unde se termină
    // Pământul din spate continuă și în spatele celui din față
    if(c==='G'||c==='D'||c==='Z'||c==='W'){const n=c==='W'?(x,y)=>{const t=at(x,y);return t==='W'||t==='Z'||EARTH_N.includes(t);}:c==='Z'?(x,y)=>{const t=at(x,y);return t==='Z'||EARTH_N.includes(t);}:(x,y)=>EARTH_N.includes(at(x,y));
      const up=at(tx,ty-1),bare=c==='D'&&ty>topRow&&up!=='Z'&&up!=='W'&&up!=='Y'&&!EARTH_N.includes(up);
      const sn=c==='G'||c==='D'?(x,y)=>n(x,y)||EARTH_BLK.includes(at(x,y)):n;   // lângă cărămizi și blocuri: lipit, fără margine
      img=earthEdge(img,!sn(tx-1,ty),!sn(tx+1,ty),ty<botRow-1&&!n(tx,ty+1),c==='G'||img===tiles.ZG||img===tiles.WG,bare);}
    if(!img)continue;let oy=0;for(const b of bumps)if(b.tx===tx&&b.ty===ty)oy=b.dn?BUMPY[b.t]>>1:-BUMPY[b.t];   // lovit de sus: se lasă puțin în jos
    ctx.drawImage(img,tx*TS-cx,ty*TS+oy);
    // Iarna: puțină zăpadă pe blocuri, platforme și trepte
    if(theme.snow&&!inUnder()&&SNOW_CAPPED.includes(c)){const up=at(tx,ty-1);if(!solid(up)&&up!=='=')ctx.drawImage(tiles.cap,tx*TS-cx,ty*TS+oy);}}}
  drawEarthShade(cx);
}
