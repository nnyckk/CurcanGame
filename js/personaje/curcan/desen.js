'use strict';
// ===== CURCANUL: desenare =====
// Fuga ca Naruto: corpul aplecat, coada culcată orizontal în spate, aripa trasă înapoi
const RUN_PAD=4,RUN_LEAN=1,RUN_CACHE=new WeakMap();
// Ce pixeli sunt coadă (în fața primului contur din rând) și aripă (penele maro)
function runMask(rows){return rows.map(r=>{const k=r.indexOf('k');return [...r].map((c,x)=>c==='.'?0:(k>0&&x<k)?1:'nNm'.includes(c)?2:0);});}
const RUN_MASK={big:runMask(TK_TOP),small:runMask(TKS_TOP)};
function runImg(img,big,face){
  let m=RUN_CACHE.get(img);if(m)return m;
  const w=img.width,h=img.height,src=img.getContext('2d').getImageData(0,0,w,h).data,[c,g]=mkCanvas(w+RUN_PAD*2,h);
  const M=big?RUN_MASK.big:RUN_MASK.small,ay=big?13:9,cut=Math.round(h*0.62),off=RUN_PAD;
  const put=(sx,sy,x,y)=>{const i=(sy*w+sx)*4;if(!src[i+3])return;g.fillStyle='rgba('+src[i]+','+src[i+1]+','+src[i+2]+','+src[i+3]/255+')';g.fillRect(x+off,y,1,1);};
  const kind=(x,y)=>{const row=M[y];if(!row)return 0;return row[face>0?x:w-1-x]||0;};
  const head=big?12:9,lean=y=>y<head?RUN_LEAN:0;   // doar capul, întreg, înainte
  // 1. coada: rotită spre orizontală, în spate, lipită de corpul aplecat
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(kind(x,y)===1){const d=Math.max(0,ay-y);const ny=y+Math.round(d*0.35);put(x,y,x-face*Math.round(d*0.2)+face*lean(ny),ny);}
  // 2. corpul: aplecat în față, capul cel mai mult (RUN_LEAN px), spre șold tot mai puțin
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=kind(x,y);if(k===1||k===2)continue;put(x,y,x+face*lean(y),y);}
  // Unde era aripa rămâne costumul: culoarea corpului din fața ei
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(kind(x,y)===2){let fx=x;while(fx>=0&&fx<w&&kind(fx,y)===2)fx+=face;
    if(fx>=0&&fx<w)put(fx,y,x+face*lean(y),y);}
  // 3. aripa: ținută în spate și întinsă, cu vârful ascuțit
  const rows=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(kind(x,y)===2){put(x,y,x-face*1,y);
    const r=rows[y]||(rows[y]={x,y});if(face>0?x<r.x:x>r.x)r.x=x;}
  const wr=rows.filter(Boolean),mid=wr.length>>1;
  wr.forEach((r,i)=>{const ext=i===mid?1:0;for(let e=1;e<=ext;e++)put(r.x,r.y,r.x-face*(1+e),r.y);});
  RUN_CACHE.set(img,c);return c;
}
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
  // Lovitura în pământ: cade și aterizează în fund, picioarele strânse sub el
  const butt=p.pound<0||(p.butt>0&&p.onGround&&Math.abs(p.vx)<0.3);if(butt)f='A';
  const img=S[f][p.face>0?'r':'l'];
  if(p.alpha<1)ctx.globalAlpha=p.alpha;
  if(rot){const ox=dx+sw/2,oy=dy+sh-img.height/2;ctx.save();ctx.translate(ox,oy);ctx.rotate(rot);ctx.translate(-ox,-oy);}
  // Fuge: se apleacă în față; capul și corpul împreună, picioarele pe loc
  const lt=p.onGround&&!rot&&p.vx*p.face>0?clamp((Math.abs(p.vx)-WALK)/(RUN-WALK),0,1):0;p.lean=(p.lean||0)+(lt-(p.lean||0))*0.2;
  const L=Math.round(p.lean)*p.face;
  if(butt&&!rot){const lh=showBig?3:2,y0=dy+sh-img.height;ctx.drawImage(img,0,0,img.width,img.height-lh,dx,y0+lh,img.width,img.height-lh);
    // Picioarele întinse în față, pe pământ
    const gy=dy+sh-1,w=img.width,x0=showBig?13:10,len=showBig?5:4;ctx.fillStyle=TK_PAL.l;
    const px=(c,y)=>ctx.fillRect(dx+(p.face>0?c:w-1-c),y,1,1);
    for(const [ox,oy] of [[0,0],[1,-1]])for(let i=0;i<len;i++)px(x0+ox+i,gy+oy);   // amândouă întinse în față
  }
  else if(L){const r=runImg(img,showBig,p.face);ctx.drawImage(r,dx-RUN_PAD,dy+sh-img.height);}
  else ctx.drawImage(img,dx,dy+sh-img.height);   // cadrul de respirație e mai scund
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
