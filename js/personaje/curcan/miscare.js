'use strict';
// ===== CURCANUL: mișcarea =====
// Lovitura în pământ (↓ în aer): player.pound > 0 = stă în aer (cadre rămase), -1 = cade drept în jos, 0 = nimic.
// În aer: întâi se ghemuiește (POUND_CROUCH cadre), apoi face o rotire completă înainte, apoi pleacă în jos.
const POUND_HANG=18,POUND_CROUCH=4,POUND_VY=9;
// Senzația mișcării: pornire/oprire, cădere, vârful săriturii
const WALK=2,RUN=2.85,RUN_ACC=0.18,TURN_ACC=0.4,STOP_K=0.85,AIR_STOP_K=0.9;
const FALL_G=0.5,MAX_FALL=7.5,APEX_VY=1,APEX_T=6,APEX_G=0.21;
function updatePlayer(){
  const p=player,L=inLeft(),R=inRight(),run=inRun(),jh=inJump();
  if(p.inv>0)p.inv--;
  const dir=(R&&!L)?1:(L&&!R)?-1:0;
  if(dir)p.face=dir;
  if((p.fire||p.ice)&&firePressed()&&feathers.length<FEATHER_MAX)throwFeather();
  // Curcanul de gheață sclipește rece
  if(p.ice&&G.t%12===0)parts.push({x:p.x+Math.random()*p.w,y:p.y+4+Math.random()*(p.h-6),vx:0,vy:-0.2,g:0,life:16,max:16,col:'#ffffff',s:1});
  // ↓ în aer: lovitura în pământ — o clipă stă pe loc, apoi cade drept în jos
  if(!p.onGround&&!p.pound&&downPressed()){p.pound=POUND_HANG;p.vx=0;p.vy=0;p.walkOff=false;p.jbuf=0;sfx.poundUp();}
  if(p.pound)p.vx=0;   // în timpul loviturii nu se mișcă în lateral
  else if(p.onGround){
    const target=dir*(run?RUN:WALK);
    if(dir&&p.vx*dir<0&&G.t%4===0)dust(p.x+p.w/2,p.y+p.h,1);
    if(p.onIce&&Math.abs(p.vx)>0.8&&(!dir||dir*p.vx<0)&&G.t%3===0)
      parts.push({x:p.x+p.w/2+(Math.random()-0.5)*6,y:p.y+p.h-1,vx:p.vx*0.3,vy:-0.4-Math.random()*0.4,g:0.04,life:14,max:14,col:Math.random()<0.5?'#ffffff':'#cdeeff',s:1});
    const step=acc=>{if(p.vx<target)p.vx=Math.min(target,p.vx+acc);else if(p.vx>target)p.vx=Math.max(target,p.vx-acc);};
    // Pe gheață aluneci: pornești ceva mai greu
    if(p.onIce)step((target!==0&&target*p.vx>=0&&Math.abs(target)>Math.abs(p.vx))?ICE_ACC:ICE_FRICTION);
    else if(dir&&p.vx*dir<0)step(TURN_ACC);   // întoarcere: frânează mai tare
    else if(Math.abs(p.vx)>Math.abs(target)){p.vx=target+(p.vx-target)*STOP_K;if(Math.abs(p.vx-target)<0.05)p.vx=target;}   // oprire lină
    else step(RUN_ACC);   // pornire treptată
    p.airMax=Math.max(WALK,Math.abs(p.vx));
  }else{
    // În aer păstrezi elanul de pe sol
    const max=p.airMax||WALK;
    if(dir)p.vx+=dir*0.15;else if(!p.noDrag){p.vx*=AIR_STOP_K;if(Math.abs(p.vx)<0.05)p.vx=0;}   // lași tasta: cazi mai drept
    p.vx=clamp(p.vx,-max,max);
  }
  if(jumpPressed())p.jbuf=8;else if(p.jbuf>0)p.jbuf--;
  if(p.onGround){p.coyote=6;p.combo=0;p.apex=0;p.noDrag=false;}else if(p.coyote>0)p.coyote--;
  if(!p.pound&&p.jbuf>0&&p.coyote>0){p.vy=-6.2-Math.abs(p.vx)*0.12;p.jbuf=0;p.coyote=0;p.apex=0;p.onGround=false;sfx.jump();}
  if(p.pound>0){p.vy=0;if(--p.pound===0){p.pound=-1;p.vy=POUND_VY;}}
  else if(p.pound<0){if(p.vy<0)p.pound=0;else p.vy=POUND_VY;}   // a sărit de pe un dușman: lovitura s-a terminat
  if(!p.pound){
    const hold=jh&&!p.noDrag;   // ieșirea din peșteră: aceeași săritură mereu
    let g=p.vy<0?(hold?0.27:0.42):FALL_G;
    if(hold&&!p.onGround&&Math.abs(p.vy)<APEX_VY&&(p.apex||0)<APEX_T){g=APEX_G;p.apex=(p.apex||0)+1;}   // pauză în vârf
    p.vy=Math.min(p.vy+g,MAX_FALL);
    if(p.pop>0)p.pop--;else if(!jh&&p.vy<-3.5)p.vy=-3.5;   // pop: sare singur din gaura peșterii
  }
  const wasAir=!p.onGround,vyB=p.vy;
  moveX(p);moveY(p);
  if(p.pound<0&&p.onGround)poundLand();

  if(p.headHit)hitBlock(p.headHit[0],p.headHit[1]);
  if(p.onGround&&wasAir&&vyB>3)dust(p.x+p.w/2,p.y+p.h,4);
  if(p.onGround&&wasAir&&vyB>5)noiseAt(p.x+p.w/2,p.y+p.h,40);   // aterizarea face zgomot
  // Curcanul de foc: jar din coadă și de pe costum
  if(p.fire&&p.big){const sp=Math.abs(p.vx),rate=sp>2.5?4:sp>0.5?8:14;if(G.t%rate===0)ember();if(p.onGround&&wasAir&&vyB>2)landSparks();}
  if(p.onGround&&Math.abs(p.vx)>0.1)p.anim+=Math.abs(p.vx)*0.22;
  // Cât timp a stat pe loc
  p.idle=p.onGround&&Math.abs(p.vx)<=0.1?(p.idle||0)+1:0;
  // Curcanul de gheață scoate abur din cioc
  if(p.ice&&p.big&&((p.idle>IDLE_WAIT&&(p.idle-IDLE_WAIT)%BREATH_T===0)||(!p.idle&&G.t%90===0)))frostBreath(3);
  // Curcanul de foc, când stă pe loc
  if(p.fire&&p.big&&p.idle>IDLE_WAIT&&(p.idle-IDLE_WAIT)%BREATH_T===0)fireBreath();
  // Pe gheață: aluneci
  p.onIce=onIce(p);
  if(p.onGround){const under=iceUnder(p);if(under.length)stepOnIce(under);}
  // Țepii rănesc doar când calci pe ei de sus
  if(p.onGround&&standsOnSpikes(p))hurt(-p.face);
  if(inUnder()){if(p.y+p.h>H-12&&overPit(p))die('pit');}   // în peșteră: țepii din groapă
  else if(p.y+p.h>WATER_Y&&overPit(p))drown();
  else if(p.y>H+8)die('pit');
}
// Lovitura a atins ceva: praf, zguduire, bufnitură. Dedesubt: blocurile M / power-up se deschid, cărămizile se sparg
// (doar curcanul mare), gheața lacului se sparge pe loc. Dacă n-a mai rămas nimic solid sub el, continuă în jos.
function poundLand(){
  const p=player;p.pound=0;p.vx=0;
  G.shake=Math.max(G.shake,6);sfx.pound();noiseAt(p.x+p.w/2,p.y+p.h,5*TS);
  for(const s of [-1,1])for(let i=0;i<4;i++)parts.push({x:p.x+p.w/2+s*(3+i*2),y:p.y+p.h-1,vx:s*(0.8+Math.random()*1.4),vy:-0.5-Math.random()*0.9,g:0.05,life:20,max:20,col:'#efe6d6',s:2});
  // Pământul crăpat de deasupra peșterii se surpă: curcanul continuă în jos, prin gaură
  if(poundHole()){p.pound=-1;p.vy=POUND_VY;p.onGround=false;return;}
  const ty=Math.floor((p.y+p.h+1)/TS),x0=Math.floor(p.x/TS),x1=Math.floor((p.x+p.w-1)/TS);
  let broke=false;
  for(let tx=x0;tx<=x1;tx++)if('MHABP'.includes(tileAt(tx,ty))){hitBlock(tx,ty,true);if(tileAt(tx,ty)==='.')broke=true;}
  const ice=iceUnder(p);ice.forEach(tx=>breakIce(tx));
  let free=!p.plat;for(let tx=x0;tx<=x1;tx++){const c=tileAt(tx,ty);if(solid(c)||c==='=')free=false;}
  if((broke||ice.length)&&free){p.pound=-1;p.vy=POUND_VY;p.onGround=false;}
}
