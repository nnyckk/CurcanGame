'use strict';
// ===== CURCANUL: desenare =====
function drawPlayer(cx){
  const p=player;
  // În timpul transformării alternează între mic și mare
  let showBig=p.big,suit=p.fire?'fire':p.ice?'ice':'';
  if(G.growT>0&&(G.growT>>2)%2){if(G.morph==='fire'||G.morph==='ice')suit=suit?'':G.morph;else showBig=!showBig;}
  const S=showBig?(suit==='fire'?tkFire():suit==='ice'?tkIce():tkBig()):tkSmall(),sw=showBig?20:16,sh=showBig?23:16;
  const dx=Math.round(p.x+p.w/2-sw/2-cx),dy=Math.round(p.y+p.h-sh);
  if(p.dead){ctx.drawImage(p.drown?S.J[p.face>0?'r':'l']:S.DEAD,dx,dy);return;}
  if(p.inv>0&&G.growT<=0&&(p.inv>>2)%2)return;
  let f='A';if(!p.onGround&&G.state!=='clear')f='J';else if(Math.abs(p.vx)>0.1||(G.state==='clear'))f=TK_RUN[Math.floor(p.anim)%4];
  else if(p.idle>IDLE_WAIT&&(p.idle-IDLE_WAIT)%BREATH_T<BREATH_OUT)f='I';
  const img=S[f][p.face>0?'r':'l'];
  if(p.alpha<1)ctx.globalAlpha=p.alpha;
  ctx.drawImage(img,dx,dy+sh-img.height);   // cadrul de respirație e mai scund
  // Costumul de gheață
  if(showBig&&suit==='ice'){const oy=dy+sh-img.height;drawIceSheen(dx,oy,p.face);drawScarf(dx+(p.face>0?6:13),oy+11,p);}
  // Curcanul de aur: o sclipire care trece peste el
  if(goldSkinOn()){const px=!showBig?TKGS_SHEEN:suit==='fire'?TKGF_SHEEN:suit==='ice'?TKGI_SHEEN:TKG_SHEEN;
    drawGoldSheen(dx,dy+sh-img.height,p.face,px,showBig);}
  ctx.globalAlpha=1;
}
