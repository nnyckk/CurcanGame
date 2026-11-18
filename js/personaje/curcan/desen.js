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
  // Lovitura în pământ: ghemuit în aer, apoi o rotire completă înainte (în direcția în care se uită)
  let rot=0;
  if(p.pound>0){f='I';const t=POUND_HANG-p.pound-POUND_CROUCH,n=POUND_HANG-1-POUND_CROUCH;
    if(t>0&&t<n){const k=t/n;rot=p.face*TAU*(1-(1-k)*(1-k));}}   // pornește repede și încetinește spre final
  const img=S[f][p.face>0?'r':'l'];
  if(p.alpha<1)ctx.globalAlpha=p.alpha;
  if(rot){const ox=dx+sw/2,oy=dy+sh-img.height/2;ctx.save();ctx.translate(ox,oy);ctx.rotate(rot);ctx.translate(-ox,-oy);}
  ctx.drawImage(img,dx,dy+sh-img.height);   // cadrul de respirație e mai scund
  // Lovitura în pământ: dâre de viteză deasupra, cât cade
  if(p.pound<0){ctx.fillStyle='rgba(255,255,255,0.55)';
    for(const [ox,l] of [[2,10],[sw/2-1,14],[sw-4,9]])ctx.fillRect(dx+Math.round(ox),dy+sh-img.height-l-1,1,l);}
  // Costumul de gheață
  if(showBig&&suit==='ice'){const oy=dy+sh-img.height;drawIceSheen(dx,oy,p.face);drawScarf(dx+(p.face>0?6:13),oy+11,p);}
  // Curcanul de aur: o sclipire care trece peste el
  if(goldSkinOn()){const px=!showBig?TKGS_SHEEN:suit==='fire'?TKGF_SHEEN:suit==='ice'?TKGI_SHEEN:TKG_SHEEN;
    drawGoldSheen(dx,dy+sh-img.height,p.face,px,showBig);}
  if(rot)ctx.restore();
  ctx.globalAlpha=1;
}
