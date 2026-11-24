'use strict';
// ===== MINI-JOCUL DIN CAFENEA: GHICEȘTE CEȘCUȚA =====
// Trei cești pe o masă joasă; premiul e sub cea din mijloc, apoi se amestecă
const CUPS_X=[156,176,196],CUPS_TOP=146,CUPS_SWAPS=6,CUPS_LIFT=14,CUPS_DUR=[24,21,18,16,14,12];   // cât ține fiecare schimb (tot mai repede)   // centrele ceștilor (față de cameră), blatul mesei
function cupsStart(c){
  c.mg={ph:'talk',t:0,pos:[0,1,2],prize:[SLOT_FIRE,SLOT_ICE,SLOT_2UP][Math.random()*3|0],swaps:[],k:0,lift:[0,0,0],pick:-1};
  openTalk(['URMĂREȘTE BOABA DE AUR, FIULE! O PUN SUB O CEAȘCĂ ȘI LE AMESTEC.']);
}
// Ceașca 1 ascunde premiul; pos[i] = locul ceștii i (0, 1, 2)
const cupAt=(m,p)=>m.pos.indexOf(p);
function cupX(c,i){
  const m=c.mg,base=c.a*TS;if(!m)return base+CUPS_X[i];
  if(m.ph==='shuffle'&&m.k<m.swaps.length){const [a,b]=m.swaps[m.k],dur=CUPS_DUR[m.k],p=Math.min(1,m.t/dur),e=p<0.5?2*p*p:1-2*(1-p)*(1-p);
    if(m.pos[i]===a)return base+CUPS_X[a]+(CUPS_X[b]-CUPS_X[a])*e;
    if(m.pos[i]===b)return base+CUPS_X[b]+(CUPS_X[a]-CUPS_X[b])*e;}
  return base+CUPS_X[m.pos[i]];
}
// Cât e ridicată (în sus); la amestec, una trece pe sus, cealaltă mai pe jos
function cupY(c,i){
  const m=c.mg;if(!m)return 0;
  if(m.ph==='shuffle'&&m.k<m.swaps.length){const [a,b]=m.swaps[m.k],p=Math.min(1,m.t/CUPS_DUR[m.k]),s=Math.sin(Math.PI*p);
    if(m.pos[i]===a)return s*10;if(m.pos[i]===b)return s*3;}
  return m.lift[i];
}
const liftTo=(m,i,to)=>{m.lift[i]+=Math.sign(to-m.lift[i])*Math.min(2,Math.abs(to-m.lift[i]));};
function updateCups(c){
  const m=c.mg;if(!m)return;m.t++;
  if(m.ph==='talk'){if(!G.talk){m.ph='show';m.t=0;}return;}
  if(m.ph==='show'){liftTo(m,1,m.t<56?CUPS_LIFT:0);
    if(m.t===8)sfx.pop();
    if(m.t>=80){for(let k=0;k<CUPS_SWAPS;k++){const a=Math.random()*3|0;let b=Math.random()*2|0;if(b>=a)b++;m.swaps.push([a,b]);}m.ph='shuffle';m.t=0;}
    return;}
  if(m.ph==='shuffle'){
    if(m.t>=CUPS_DUR[m.k]){const [a,b]=m.swaps[m.k],ia=cupAt(m,a),ib=cupAt(m,b);m.pos[ia]=b;m.pos[ib]=a;m.k++;m.t=0;sfx.tick();
      if(m.k>=CUPS_SWAPS){m.ph='pick';popup('ALEGE!',c.npcX+OLD_W/2,CAFE_FLOOR*TS-OLD_H-12,'#ffd23f');sfx.blip();}}
    return;}
  if(m.ph==='pick'){const i=cupNear(c);if(i>=0&&upPressed()){m.pick=i;m.ph='reveal';m.t=0;sfx.bump();}return;}
  if(m.ph==='reveal'){liftTo(m,m.pick,CUPS_LIFT);
    const win=m.pick===1;
    if(win&&m.t===36){c.res=m.prize;slotPrize();m.ph='done';}
    if(!win){if(m.t>=40)liftTo(m,1,CUPS_LIFT);if(m.t===84){c.res=SLOT_NONE;slotPrize();m.ph='done';}}
    return;}
  if(m.ph==='done'){liftTo(m,m.pick,CUPS_LIFT);if(m.pick!==1)liftTo(m,1,CUPS_LIFT);}
}
// Ceașca în fața căreia stai (când poți alege)
function cupNear(c){
  const m=c.mg,p=player;if(!m||m.ph!=='pick'||!p||p.dead||!p.onGround||G.talk)return -1;
  const px=p.x+p.w/2;for(let i=0;i<3;i++)if(Math.abs(px-cupX(c,i))<9)return i;return -1;
}
// Ce spune Moș când vorbești cu el
function cupsTalk(c){
  if(c.done){openTalk([CAFE_BYE]);return;}
  if(!c.mg){cupsStart(c);return;}
  if(c.mg.ph==='pick')openTalk(['ALEGE O CEAȘCĂ, FIULE: STAI ÎN FAȚA EI ȘI APASĂ ↑.']);
}
// Masa joasă, ceștile, premiul de sub ceașcă, săgeata
function drawCups(cx){
  const c=cafe,x0=Math.round(c.a*TS-cx);if(x0>W||x0+CAFE_W*TS<0)return;
  const P=(px,py,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(px,py,w,h);};
  // Masa: blat cu față de masă roșie, două picioare
  const tl=x0+138,tw=76,ty=CUPS_TOP;
  P(tl+4,ty+3,2,160-ty-3,'#3a2414');P(tl+tw-6,ty+3,2,160-ty-3,'#3a2414');
  P(tl,ty,tw,3,'#6a4428');P(tl,ty,tw,1,'#8a5c3a');P(tl+2,ty+3,tw-4,4,'#a82a2a');P(tl+2,ty+3,tw-4,1,'#d04848');P(tl+2,ty+6,tw-4,1,'#7a1a1a');
  const m=c.mg;
  // Bila de aur, sub ceașca 1: se vede doar când e ridicată (nu și la amestec)
  if(m&&m.ph!=='shuffle'&&cupY(c,1)>=2){const bx=Math.round(cupX(c,1)-cx),by=ty-4;
    glow(bx,by,10,'255,210,90',0.45);pcirc(ctx,bx,by,4,'#a8740a');pcirc(ctx,bx,by,3,'#ffd23f');P(bx-2,by-2,2,1,'#fff3b0');P(bx-2,by-1,1,1,'#fff3b0');
    if((G.t>>3)%6===0){P(bx+3,by-5,1,3,'#ffffff');P(bx+2,by-4,3,1,'#ffffff');}}
  // Ceștile, cu gura în jos: albe, umbră în dreapta, toarta în dreapta
  for(let i=0;i<3;i++){const px=Math.round(cupX(c,i)-cx)-6,py=Math.round(ty-10-cupY(c,i));
    P(px+1,py,10,1,'#e8e2d8');P(px,py+1,12,8,'#f4efe6');P(px+9,py+1,3,8,'#d0c8bc');P(px,py+9,12,1,'#bfb6a8');
    P(px+12,py+3,2,1,'#e8e2d8');P(px+13,py+4,1,3,'#e8e2d8');P(px+12,py+7,2,1,'#e8e2d8');P(px+2,py+3,1,4,'#ffffff');}
  // Săgeata în sus, deasupra ceștii la care ești
  const n=cupNear(c);if(n>=0){const x=Math.round(cupX(c,n)-cx)-4,y=ty-30;
    ctx.fillStyle='rgba(20,14,30,0.7)';ctx.fillRect(x,y,9,11);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x,y,9,1);txt('↑',x+2,y+2,'#e0d8c8',1,'l',null);}
}
