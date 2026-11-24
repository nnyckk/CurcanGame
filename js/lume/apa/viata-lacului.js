'use strict';
// ===== APA: viața lacului =====
// Doar decor, fără efect asupra jocului
const DUCK_PAL={k:'#4a4a5a',W:'#ffffff',g:'#cfd6e2',e:'#14121c',o:'#ff9a1a'};
const DUCK=spr(["........kkk...",".......kWWWk..",".......kWWeWoo",".......kWWWWoo","........kWWk..",
  "kk.....kWWWk..","kWkkkkkWWWWWk.","kWWWWWWWWWgWk.",".kWWWWWWWgggk.","..kkkkkkkkkk.."],DUCK_PAL);
const DUCK_DIVE=spr(["kk..........","kWk.........","kWWk........",".kWWkkk.....","..kWWWWkk...","...kWWWWWk..",
  "....kWWgWWk.",".....kkkkkk."],DUCK_PAL);
const DUCK_WING=spr(["..kk..",".kWWk.","kWWWWk"],DUCK_PAL);   // aripa ridicată, când fuge
const DUCKLING=spr(["....kk..","...kYYk.","...kYeYo","k..kYYk.","kYkYYYYk",".kYYYYk.","..kkkk.."],
  {k:'#7a6420',Y:'#ffe14a',e:'#14121c',o:'#ff9a1a'});
const FISH=spr(["...kkk..","k.kOOOek","kkOOOOOk","k..kkkk."],{k:'#7a2a0a',O:'#ff8a2a',e:'#14121c'});
const FROG=mkSprite([".kk...kk.","kwek.kwek","kGGGGGGGk","kGLLLLLGk","kGGkkkGGk","kk.....kk"],
  {k:'#1e4a1a',G:'#5ab83a',L:'#b8e070',w:'#ffffff',e:'#14121c'},false);
let lakeLife=null;
const lakeTop=wx=>WATER_Y+Math.round(Math.sin(wx*0.3+G.t*0.07)*1.2);   // suprafața apei, cu valuri
const lakeSeen=x=>x>cam.x-16&&x<cam.x+W+16;
// În celelalte niveluri
const POND_MIN=7;
function initLakeLife(){
  // Nivelul din editor, la fermă: apa lată de 8+ pătrate e lac, cu rațe și pești (noaptea: broaște și pești)
  const own=!!LEVELS[G.level]&&!!LEVELS[G.level].custom&&!!theme.farm;
  const full=!!theme.lake||(own&&!theme.night),wet=c=>c==='.'||c==='I';
  const L={full,spans:[],ducks:[],shadows:[],flies:[],fish:[],ripples:[],frogs:[],fishT:60,quackT:600,rippleT:40};
  for(let x=0;x<cols;x++){if(!waterCol(x))continue;let e=x;while(e+1<cols&&waterCol(e+1))e++;
    if(own?e-x+1>=8:full||e-x+1>=POND_MIN)L.spans.push({a:x*TS,b:(e+1)*TS,n:e-x+1});x=e;}
  if(!L.spans.length)return null;
  const frogOn=(s,wx,px)=>L.frogs.push({s,wx,px,st:0,t:0,croak:0,croakT:rnd(60,300),x:0,y:0,vx:0,vy:0});
  for(const s of L.spans){
    for(let i=0;i<(full?Math.floor(s.n/8):Math.max(1,Math.floor(s.n/6)));i++)
      L.shadows.push({s,x:rnd(s.a+8,s.b-8),y:rnd(WATER_Y+9,H-6),dir:Math.random()<0.5?1:-1,sp:rnd(0.15,0.35)});
    if(full)for(let i=0;i<Math.floor(s.n/14);i++){const hx=rnd(s.a+16,s.b-16);L.flies.push({s,hx,hy:rnd(145,182),x:hx,y:170,ph:Math.random()*TAU,t:rnd(60,200),dir:1});}
    else if(theme.farm){
      if(theme.night){   // broasca, pe nufărul cel mai apropiat de mijloc
        let best=null;const mid=(s.a+s.b)/2;
        for(let wx=s.a+10;wx<s.b-12;wx+=19){const h=vhash(wx,7);if(h%3&&(!best||Math.abs(wx-mid)<Math.abs(best-mid)))best=wx;}
        if(best!==null)frogOn(s,best,best+(vhash(best,7)>>>4)%6);
      }else{const h=vhash(s.a,41);L.ducks.push({s,x:(s.a+s.b)/2,dir:h%2?1:-1,kid:[],dive:0,diveT:200+h%400,flee:0});}
    }
  }
  if(!full)return L;
  // 3 familii de rațe, câte una pe cele mai lungi trei ape
  for(const s of [...L.spans].sort((a,b)=>b.n-a.n).slice(0,3)){
    const h=vhash(s.a,41),x=(s.a+s.b)/2,dir=h%2?1:-1,kid=[];
    for(let j=0;j<2+h%2;j++)kid.push({x:x-dir*(j+1)*11,dir});
    L.ducks.push({s,x,dir,kid,dive:0,diveT:200+h%400,flee:0});
  }
  // 4 broaște, pe nuferi aleși la distanțe cam egale de-a lungul lacului
  const pads=[];
  for(const s of L.spans)for(let wx=s.a+10;wx<s.b-12;wx+=19){const h=vhash(wx,7);if(h%3)pads.push({s,wx,px:wx+(h>>>4)%6});}
  for(let i=0;i<4&&pads.length;i++){const pd=pads[Math.floor((i+0.5)/4*pads.length)];frogOn(pd.s,pd.wx,pd.px);}
  return L;
}
function lakeRipple(x){lakeLife.ripples.push({x,t:0});if(lakeLife.ripples.length>24)lakeLife.ripples.shift();}
function lakeDrops(x,n){for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-0.5)*4,y:WATER_Y-1,vx:(Math.random()-0.5)*1.2,vy:-0.8-Math.random()*1.2,g:0.15,life:18,max:18,col:theme.water.foam,s:1});}
// Ceva a pleoscăit în x sau trece curcanul
function scareDucks(x){
  if(!lakeLife)return;let q=false;
  for(const d of lakeLife.ducks)if(Math.abs(d.x-x)<64&&d.flee<=0){d.flee=90;d.dive=0;d.dir=Math.sign(d.x-x)||1;if(lakeSeen(d.x))q=true;}
  if(q)sfx.quack();
}
function updateLakeLife(){
  const L=lakeLife,p=player,px=p?p.x+p.w/2:-9999,near=p&&!p.dead&&p.y+p.h>WATER_Y-40;
  for(const d of L.ducks){const s=d.s;
    if(near&&Math.abs(px-d.x)<30)scareDucks(px);
    if(d.dive>0)d.dive--;
    else{
      if(d.flee>0){d.flee--;if(G.t%3===0)parts.push({x:d.x-d.dir*7,y:WATER_Y-1,vx:-d.dir*0.4,vy:-0.6-Math.random()*0.6,g:0.12,life:14,max:14,col:theme.water.foam,s:1});}
      else if(--d.diveT<=0){d.dive=70;d.diveT=rnd(400,900);lakeRipple(d.x);}
      d.x+=d.dir*(d.flee>0?1.1:0.18);
      if(d.x<s.a+14){d.x=s.a+14;d.dir=1;}else if(d.x>s.b-14){d.x=s.b-14;d.dir=-1;}
    }
    // Bobocii: fiecare se ține la ~10 px de cel din fața
    let lead=d;
    for(const k of d.kid){const dx=lead.x-k.x;
      if(Math.abs(dx)>10){k.x+=Math.sign(dx)*Math.min(d.flee>0?1.2:0.3,Math.abs(dx)-10);k.dir=Math.sign(dx);}
      k.x=clamp(k.x,s.a+8,s.b-8);lead=k;}
  }
  if(--L.quackT<=0){L.quackT=rnd(600,1300);if(L.ducks.some(d=>lakeSeen(d.x)))sfx.quack();}
  for(const s of L.shadows){s.x+=s.dir*s.sp;if(s.x<s.s.a+8||s.x>s.s.b-8||Math.random()<0.002)s.dir*=-1;}
  for(const f of L.flies){
    if(--f.t<=0){f.hx=clamp(f.hx+rnd(-70,70),f.s.a+16,f.s.b-16);f.hy=rnd(145,182);f.t=rnd(80,240);}
    const tx=f.hx+Math.sin(G.t*0.03+f.ph)*10,ty=f.hy+Math.sin(G.t*0.07+f.ph)*4,nx=f.x+(tx-f.x)*0.06;
    if(Math.abs(nx-f.x)>0.05)f.dir=Math.sign(nx-f.x);f.x=nx;f.y+=(ty-f.y)*0.06;
  }
  // Un pește sare din când în când, doar pe apa de pe ecran
  if(L.full&&--L.fishT<=0){L.fishT=rnd(70,180);
    const vis=L.spans.filter(s=>s.n>=8&&s.b-56>cam.x&&s.a+56<cam.x+W);
    if(vis.length){const s=vis[Math.random()*vis.length|0],a=Math.max(s.a+56,cam.x+10),b=Math.min(s.b-56,cam.x+W-10);
      if(b>a){const x=rnd(a,b),dir=Math.random()<0.5?1:-1;L.fish.push({x,y:WATER_Y,vx:dir*rnd(0.5,0.9),vy:-rnd(2.8,3.6),dir});lakeRipple(x);lakeDrops(x,3);}}}
  for(const f of L.fish){f.vy+=0.14;f.x+=f.vx;f.y+=f.vy;
    if(f.vy>0&&f.y>WATER_Y){f.gone=true;lakeRipple(f.x);lakeDrops(f.x,4);if(lakeSeen(f.x))sfx.plip();}}
  L.fish=L.fish.filter(f=>!f.gone);
  if(L.full&&--L.rippleT<=0){L.rippleT=rnd(50,120);
    const vis=L.spans.filter(s=>s.b-12>cam.x&&s.a+12<cam.x+W);
    if(vis.length){const s=vis[Math.random()*vis.length|0];lakeRipple(rnd(Math.max(s.a+12,cam.x),Math.min(s.b-12,cam.x+W)));}}
  for(const r of L.ripples)r.t++;
  L.ripples=L.ripples.filter(r=>r.t<40);
  for(const f of L.frogs){const fx=f.px+4;
    if(f.st===0){   // stă pe nufăr și orăcăie
      if(f.croak>0)f.croak--;
      else if(--f.croakT<=0){f.croak=36;f.croakT=rnd(180,420);if(lakeSeen(fx)&&Math.random()<0.4)sfx.croak();}
      if(p&&!p.dead&&Math.abs(px-fx)<44&&p.y+p.h>WATER_Y-90){   // te-ai apropiat: sare în apă
        let dir=px<fx?1:-1;if(fx-f.s.a<48)dir=1;else if(f.s.b-fx<48)dir=-1;
        f.st=1;f.x=f.px-1;f.y=lakeTop(f.wx)-7;f.vx=dir*rnd(0.8,1.2);f.vy=-2.4;}
    }else if(f.st===1){f.vy+=0.18;f.x+=f.vx;f.y+=f.vy;
      if(f.vy>0&&f.y+3>WATER_Y){f.st=2;f.t=rnd(360,600);lakeRipple(f.x+4);lakeDrops(f.x+4,5);if(lakeSeen(f.x))sfx.plip();}}
    else if(--f.t<=0&&Math.abs(px-fx)>90){f.st=0;lakeRipple(fx);}   // revine pe nufăr după câteva secunde
  }
}
// Se desenează după apă: ce e pe suprafață stă „în” apă
function drawLakeLife(cx){
  const L=lakeLife,w=theme.water,on=x=>x>cx-24&&x<cx+W+24;
  ctx.fillStyle='rgba(14,34,84,0.3)';   // umbrele peștilor, sub apă
  for(const s of L.shadows)if(on(s.x)){const x=Math.round(s.x-cx),y=Math.round(s.y);ctx.fillRect(x-3,y,7,2);ctx.fillRect(s.dir>0?x-5:x+4,y,2,1);}
  for(const r of L.ripples)if(on(r.x)){   // cercurile de pe apă
    const k=r.t/40,rad=Math.round(2+k*9),x=Math.round(r.x-cx),y=WATER_Y+1;
    ctx.globalAlpha=1-k;ctx.fillStyle=w.foam;ctx.fillRect(x-rad-2,y,3,1);ctx.fillRect(x+rad,y,3,1);if(r.t<10)ctx.fillRect(x-1,y-1,2,1);ctx.globalAlpha=1;}
  for(const f of L.frogs){
    if(f.st===0&&on(f.px)){const x=Math.round(f.px-cx)-1,y=lakeTop(f.wx)-7;ctx.drawImage(FROG,x,y);
      if(f.croak>0&&(f.croak>>3)%2===0)pcirc(ctx,x+4,y+4,2,'#e8f8c0');}   // gușa umflată, când orăcăie
    else if(f.st===1&&on(f.x))ctx.drawImage(FROG,Math.round(f.x-cx),Math.round(f.y));
  }
  // Rațele și bobocii: rândurile de jos sunt în apă
  const swim=(img,x,crop)=>{const top=lakeTop(x+cx),ih=img.height-crop;
    ctx.drawImage(img,0,0,img.width,ih,x,top-ih,img.width,ih);
    ctx.fillStyle=w.top;ctx.fillRect(x+1,top,img.width-2,1);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x+2,top+1,img.width-4,1);};
  for(const d of L.ducks){
    for(const k of d.kid)if(on(k.x))swim(DUCKLING[k.dir>0?'r':'l'],Math.round(k.x-cx)-4,1);
    if(!on(d.x))continue;
    if(d.dive>0){swim(DUCK_DIVE[d.dir>0?'r':'l'],Math.round(d.x-cx)-6,1);continue;}
    const x=Math.round(d.x-cx)-7;swim(DUCK[d.dir>0?'r':'l'],x,2);
    if(d.flee>0&&(G.t>>2)%2)ctx.drawImage(DUCK_WING[d.dir>0?'r':'l'],d.dir>0?x+1:x+7,lakeTop(x+cx)-5);   // bate din aripi
  }
  for(const f of L.fish)if(on(f.x))ctx.drawImage(FISH[f.dir>0?'r':'l'],Math.round(f.x-cx)-4,Math.round(f.y)-2);
  for(const f of L.flies){if(!on(f.x))continue;   // libelula: corp albastru
    const x=Math.round(f.x-cx),y=Math.round(f.y);
    ctx.fillStyle='#3a9ae8';ctx.fillRect(x-3,y,7,1);
    ctx.fillStyle='#1a3a8a';ctx.fillRect(f.dir>0?x+2:x-3,y-1,2,2);
    ctx.globalAlpha=0.75;ctx.fillStyle='#eaf6ff';const wy=(G.t>>1)%2?y-2:y-1;ctx.fillRect(x-3,wy,3,1);ctx.fillRect(x,wy,3,1);ctx.globalAlpha=1;
  }
}
