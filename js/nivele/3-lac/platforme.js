'use strict';
// ================= NIVELUL 3 — LACUL: scândurile, platformele care se mișcă și cele care cad =================
// Scândura veche a platformelor care cad (nivelul LACUL): aceeași formă ca scândura '=' (luciu sus, lemn, dungă
// închisă jos, două cuie), dar spălăcită, cu crăpături (k, cu o margine luminată l), cuie ruginite și colțuri ciobite.
const WORN_PAL={t:'#cdb08a',b:'#9a7650',d:'#4a3018',k:'#2e1806',n:'#3a2410',l:'#e0c8a0'};
const PLANK_WORN=[
  mkSprite([".ttttttttt.ttttt","bbbbbbkbbbbbbbbb","bbnbbbbkbbbbbnbb","bbbbbbbklbbbkbbb","bbbbbbbbkbbbbkbb","dddddddddddddd.."],WORN_PAL,false),
  mkSprite(["tttt.tttttttttt.","bbbbbbbbbbkbbbbb","bbnbbbbbbbbkbnbb","bbbkbbbbbbbkbbbb","bbbbkbbbbbbbkbbb",".ddddddddddddddd"],WORN_PAL,false)];
// Sunt obiecte, nu tile-uri: se stă pe ele ca pe scândurile '=' (prin ele se trece de jos și din lateral), iar cine
// stă pe una (curcanul, mobii, power-up-urile; e.plat) e dus odată cu ea.
// Cea care se mișcă merge lin înainte și înapoi (încetinește la capete), pe orizontală sau pe verticală.
// Cea care cade: când se urcă curcanul pe ea, scârțâie și tremură PLAT_SHAKE cadre (~0,75 s), apoi cade în lac;
// după PLAT_BACK cadre (~3 s) reapare la locul ei (dacă nu stă curcanul chiar acolo), ca drumul să nu se închidă.
const PLAT_H=6,PLAT_SHAKE=45,PLAT_BACK=180;
function makePlat(d){
  const p={kind:d.kind,x:d.x*TS,y:d.y*TS,w:d.w*TS,h:PLAT_H,x0:d.x*TS,y0:d.y*TS,ax:d.ax,range:(d.range||0)*TS,
    period:d.period||240,phase:d.phase||0,dx:0,dy:0,solid:true,st:0,t:0,vy:0,alpha:1,wet:false};
  platMove(p);return p;
}
// Poziția platformei care se mișcă la cadrul de acum (G.frame pornește de la 0 la fiecare pornire de nivel).
function platMove(p){
  if(p.kind!=='move')return;
  const k=0.5-0.5*Math.cos(TAU*(G.frame/p.period+p.phase));
  if(p.ax==='y')p.y=p.y0+k*p.range;else p.x=p.x0+k*p.range;
}
function updatePlats(){
  // Platforma care cade pornește când curcanul stă pe ea.
  for(const p of plats)if(p.kind==='fall'&&p.st===0&&player.plat===p&&player.onGround){p.st=1;p.t=0;sfx.creak();}
  for(const p of plats){
    const ox=p.x,oy=p.y;
    if(p.kind==='move')platMove(p);
    else if(p.st===1){p.t++;
      if(p.t%6===0)parts.push({x:p.x+2+Math.random()*(p.w-4),y:p.y+p.h,vx:(Math.random()-0.5)*0.4,vy:0.3,g:0.15,life:22,max:22,col:Math.random()<0.5?'#8f6438':'#c9a27a',s:1});
      if(p.t>=PLAT_SHAKE){p.st=2;p.solid=false;p.vy=0;}}
    else if(p.st===2){p.vy=Math.min(p.vy+0.3,6);p.y+=p.vy;
      if(!p.wet&&p.y+p.h>WATER_Y){p.wet=true;if(tileAt(Math.floor((p.x+p.w/2)/TS),12)==='.')splash(p.x+p.w/2);}
      if(p.y>H+4){p.st=3;p.t=0;}}
    else if(p.st===3){
      if(++p.t>=PLAT_BACK&&!overlap(player,{x:p.x0,y:p.y0-4,w:p.w,h:p.h+8})){p.st=4;p.t=0;p.x=p.x0;p.y=p.y0;p.solid=true;p.wet=false;p.alpha=0;}}
    else if(p.st===4){p.alpha=Math.min(1,++p.t/20);if(p.alpha>=1)p.st=0;}
    p.dx=p.x-ox;p.dy=p.y-oy;
  }
  // Cine stătea pe o platformă e dus odată cu ea (pe orizontală, cu oprire la pereți).
  const ride=e=>{const p=e.plat;if(!p||!p.solid||(!p.dx&&!p.dy))return;
    if(p.dx){const v=e.vx;e.vx=p.dx;moveX(e);e.vx=v;}
    e.y+=p.dy;};
  if(!player.dead)ride(player);
  for(const e of enemies)if(!e.dead&&!e.sink)ride(e);
  for(const it of items)ride(it);
}
// Platforma care se mișcă arată exact ca scândurile fixe (tile-ul '='); cea care cade e aceeași scândură, dar veche
// și crăpată (PLANK_WORN), cu cele două variante alternate pe lungime.
function drawPlank(x,y,w,kind){
  for(let i=0;i<w;i+=16)ctx.drawImage(kind==='fall'?PLANK_WORN[(i>>4)%2]:tiles['='],x+i,y);
}
function drawPlats(cx){
  for(const p of plats){
    // Drumul platformei care se mișcă: puncte discrete, ca să se vadă de departe pe unde merge.
    if(p.kind==='move'){
      ctx.fillStyle='rgba(40,30,60,0.28)';
      if(p.ax==='y'){const x=Math.round(p.x+p.w/2-cx);if(x>-4&&x<W+4)for(let y=p.y0+2;y<=p.y0+p.range+PLAT_H;y+=4)ctx.fillRect(x,y,1,1);}
      else{const y=p.y0+3;for(let x=p.x0+2;x<p.x0+p.range+p.w-2;x+=4){const sx=x-cx;if(sx>-2&&sx<W+2)ctx.fillRect(sx,y,1,1);}}
    }
    if(p.st===3)continue;
    let x=Math.round(p.x-cx),y=Math.round(p.y);
    if(x>W+4||x+p.w<-4)continue;
    if(p.st===1){x+=(p.t>>1)%2?1:-1;y+=(p.t>>2)%2;}   // tremură
    if(p.alpha<1)ctx.globalAlpha=p.alpha;
    drawPlank(x,y,p.w,p.kind);
    ctx.globalAlpha=1;
  }
}
