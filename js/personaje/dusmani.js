'use strict';
// ===== DUȘMANII: cum se creează și cum se desenează =====
// Un mob nou care stă pe tile-ul — ty e rândul în care stă
function makeEnemy(type,tx,ty){if(type==='mole')return makeMole(tx,ty);   // cârtița miner
  return type==='man'||type==='boy'
  ?{type:'man',boy:type==='boy',x:tx*TS+3,y:(ty+1)*TS-18,w:10,h:18,vx:0,vy:0,dir:-1,active:false,dead:0,deadT:0,anim:0,chasing:false,alert:0,atk:0,cd:0,onGround:false}
  :{type:'bomb',x:tx*TS+2,y:(ty+1)*TS-12,w:12,h:12,vx:0,vy:0,dir:-1,active:false,lit:0,sit:false,slideDir:0,slideT:0,kickT:0,anim:0,onGround:false};}
function drawEnemy(e,cx){
  const sx=Math.round(e.x-cx);if(sx<-24||sx>W+24)return;
  if(e.frozen&&!e.dead){drawFrozen(e,sx);return;}
  if(e.mole){drawMole(e,sx);return;}
  if(e.type==='man'){e.bob=0;
    const S=e.boy?BOY:MAN;
    if(e.dead===1){ctx.drawImage(S.A[e.dir>0?'r':'l'],sx-3,Math.round(e.y+e.h-8),16,8);return;}
    if(e.dead===2){ctx.drawImage(S.FLIP,sx-3,Math.round(e.y-2));return;}
    if(e.sleep||e.wake){drawSleep(e,sx);return;}
    if(e.atk){
      // Sprite-urile de atac sunt mai late
      const wind=e.atk<=MAN_WIND_T,img=(wind?MAN.WIND:MAN.STAB)[e.dir>0?'r':'l'];
      const shake=wind&&e.atk>6?((e.atk>>1)%2?1:-1):0;
      ctx.drawImage(img,sx-3-(e.dir>0?0:img.width-16)+shake,Math.round(e.y-2));keyShine(e,img,sx-3-(e.dir>0?0:img.width-16)+shake,Math.round(e.y-2));
      return;
    }
    // 8 faze de mers (WK)
    const ph=e.vx!==0?Math.floor(e.anim/6)%8:-1,img=e.boy&&e.scared>0?(ph<0?BOY.SCP:BOY.SCK[ph]):e.noBucket?(ph<0?BOY.NA:BOY.NWK[ph]):ph>=0?S.WK[ph]:(e.alert>0&&!e.boy)?MAN.SURP:S.A;   // ucenicul speriat: mâinile sus
    ctx.drawImage(img[e.dir>0?'r':'l'],sx-3,Math.round(e.y-2)+e.bob);keyShine(e,img[e.dir>0?'r':'l'],sx-3,Math.round(e.y-2)+e.bob);
    if(e.alert>0||e.scared>SCARE_T-45)txt('!',sx+3,Math.round(e.y-12),'#ff4040',1,'l','#000');
    else if(e.puzzled>0)txt('?',sx+3,Math.round(e.y-12),'#ffd23f',1,'l','#000');
  }else{
    if(e.dead){ctx.drawImage(BOMB.FLIP,sx-2,Math.round(e.y-4));return;}   // aruncată de pe ecran
    const lit=e.lit>0,flash=lit&&((e.lit<36)?(e.lit>>1)%2:(e.lit>>3)%2);
    const step=Math.floor(e.anim/8)%2;
    const set=e.sit?(flash?BOMB.SL:BOMB.S):flash?BOMB.LA:lit?(step?BOMB.FB:BOMB.FA):e.angry?(step?BOMB.AB:BOMB.AA):(step?BOMB.B:BOMB.A);
    const shake=lit&&e.lit<36?(G.t%2?1:-1):0;
    const bx=sx-2+shake,by=Math.round(e.y-4);
    ctx.drawImage(set[e.dir>0?'r':'l'],bx,by);
    if(e.sink)return;   // stinsă în apă: fără scânteie
    // Scânteia de pe fitil
    const fx=bx+(e.dir>0?11:4),fy=by+(e.sit?3:1);
    if(lit&&theme.night)glow(fx,fy,6,'255,220,120',0.8);   // noaptea, scânteia de pe fitil luminează
    const sc=['#fff','#ffd23f','#ff7a1a'][(G.t>>1)%3];ctx.fillStyle=sc;ctx.fillRect(fx,fy,1,1);
    if(lit||G.t%8<4){ctx.fillRect(fx-1,fy,3,1);ctx.fillRect(fx,fy-1,1,3);}
    if(lit&&G.t%4<2){ctx.fillStyle='#fff';ctx.fillRect(fx-2,fy-2,1,1);ctx.fillRect(fx+2,fy-2,1,1);}
  }
}
