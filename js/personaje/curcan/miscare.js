'use strict';
// ===== CURCANUL: mișcarea =====
function updatePlayer(){
  const p=player,L=inLeft(),R=inRight(),run=inRun(),jh=inJump();
  // Mers cu viteză constantă
  const WALK=2,RUN=3.4;
  if(p.inv>0)p.inv--;
  const dir=(R&&!L)?1:(L&&!R)?-1:0;
  if(dir)p.face=dir;
  if((p.fire||p.ice)&&firePressed()&&feathers.length<FEATHER_MAX)throwFeather();
  // Curcanul de gheață sclipește rece
  if(p.ice&&G.t%12===0)parts.push({x:p.x+Math.random()*p.w,y:p.y+4+Math.random()*(p.h-6),vx:0,vy:-0.2,g:0,life:16,max:16,col:'#ffffff',s:1});
  if(p.onGround){
    const target=dir*(run?RUN:WALK);
    // Pe gheață aluneci: pornești ceva mai greu
    let acc=0.6;
    if(p.onIce)acc=(target!==0&&target*p.vx>=0&&Math.abs(target)>Math.abs(p.vx))?ICE_ACC:ICE_FRICTION;
    if(dir&&p.vx*dir<0&&G.t%4===0)dust(p.x+p.w/2,p.y+p.h,1);
    if(p.onIce&&Math.abs(p.vx)>0.8&&(!dir||dir*p.vx<0)&&G.t%3===0)
      parts.push({x:p.x+p.w/2+(Math.random()-0.5)*6,y:p.y+p.h-1,vx:p.vx*0.3,vy:-0.4-Math.random()*0.4,g:0.04,life:14,max:14,col:Math.random()<0.5?'#ffffff':'#cdeeff',s:1});
    if(p.vx<target)p.vx=Math.min(target,p.vx+acc);else if(p.vx>target)p.vx=Math.max(target,p.vx-acc);
    p.airMax=Math.max(WALK,Math.abs(p.vx));
  }else{
    const max=p.airMax||WALK;
    if(dir)p.vx+=dir*0.15;
    p.vx=clamp(p.vx,-max,max);
  }
  if(jumpPressed())p.jbuf=8;else if(p.jbuf>0)p.jbuf--;
  if(p.onGround){p.coyote=6;p.combo=0;}else if(p.coyote>0)p.coyote--;
  if(p.jbuf>0&&p.coyote>0){p.vy=-6.2-Math.abs(p.vx)*0.12;p.jbuf=0;p.coyote=0;p.onGround=false;sfx.jump();}
  p.vy=Math.min(p.vy+((jh&&p.vy<0)?0.27:0.42),7);
  if(!jh&&p.vy<-3.5)p.vy=-3.5;
  const wasAir=!p.onGround,vyB=p.vy;
  moveX(p);moveY(p);
  if(p.headHit)hitBlock(p.headHit[0],p.headHit[1]);
  if(p.onGround&&wasAir&&vyB>3)dust(p.x+p.w/2,p.y+p.h,4);
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
  if(p.y+p.h>WATER_Y&&overPit(p))drown();
  else if(p.y>H+8)die('pit');
}
