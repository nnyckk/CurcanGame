'use strict';
// ===== CURCANUL: animații =====
function drawGoldSheen(x0,y0,face,px,big){
  const t=G.t%120;if(t>=24)return;
  const w=big?20:16,pos=t*1.3-6,a=ctx.globalAlpha;ctx.globalAlpha=a*0.75;ctx.fillStyle='#fff6c8';
  for(const [x,y] of px)if(Math.abs((x-4)+(y-(big?12:9))*0.7-pos)<1)ctx.fillRect(x0+(face>0?x:w-1-x),y0+y,1,1);
  ctx.globalAlpha=a;
}
// O dungă de lumină care trece pe diagonală peste costumul de gheață
function drawIceSheen(x0,y0,face){
  const t=G.t%150;if(t>=24)return;
  const pos=t*1.3-6,a=ctx.globalAlpha;ctx.globalAlpha=a*0.6;ctx.fillStyle='#ffffff';
  for(const [x,y] of TKI_SHEEN)if(Math.abs((x-4)+(y-12)*0.7-pos)<1)ctx.fillRect(x0+(face>0?x:19-x),y0+y,1,1);
  ctx.globalAlpha=a;
}
// Capetele fularului
function drawScarf(ax,ay,p){
  const face=p.face,run=Math.min(1,Math.abs(p.vx)/3),air=!p.onGround;
  for(const [len,oy,ph] of [[7,0,0],[5,1,1.3]])for(let i=0;i<len;i++){
    const k=i+1;
    const sx=-face*(0.3+run*0.9+(air?0.3:0))*k,sy=(1-run)*k*0.9+run*k*0.15+(air?-p.vy*0.08*k:0);
    const wave=Math.sin(G.t*(0.25+run*0.2)-i*0.8+ph)*(0.3+run*1.2)*(i/len);
    ctx.fillStyle=i===len-1?'#2a5aa8':((i>>1)%2)?'#ffffff':'#3a7ad8';
    ctx.fillRect(Math.round(ax+sx),Math.round(ay+oy+sy+wave),2,2);
  }
}
// Jar care se ridică din coada și de pe costumul
const EMBER_COLS=['#ffe040','#ff9a1a','#ff5a1a'];
function ember(){
  const p=player,f=p.face,tail=Math.random()<0.5;
  const cx=tail?1+Math.random()*5:6+Math.random()*9,cy=tail?3+Math.random()*9:12+Math.random()*7;   // în sprite
  parts.push({x:p.x+p.w/2-10+(f>0?cx:19-cx),y:p.y+p.h-23+cy,vx:(Math.random()-0.5)*0.4-f*0.2,vy:-0.5-Math.random()*0.6,g:-0.01,
    life:18+(Math.random()*12|0),max:30,col:EMBER_COLS[Math.random()*3|0],s:1});
}
// Scântei care sar din picioare când curcanul de foc aterizează
function landSparks(){
  const p=player;
  for(let i=0;i<6;i++){const d=i%2?1:-1;parts.push({x:p.x+p.w/2,y:p.y+p.h-1,vx:d*(0.6+Math.random()*1.2),vy:-1-Math.random()*1.2,g:0.15,life:16,max:16,col:EMBER_COLS[i%3],s:1});}
}
// Vârful ciocului, în lume: x, y
function beakTip(){
  const p=player,f=p.face,down=p.idle>IDLE_WAIT&&(p.idle-IDLE_WAIT)%BREATH_T<BREATH_OUT?1:0;
  return [p.x+p.w/2-10+(f>0?19:0),p.y+p.h-23+7+down];
}
// Curcanul de foc, la expirație când stă pe loc
function fireBreath(){
  const f=player.face,[bx,by]=beakTip();
  for(let i=0;i<4;i++)parts.push({x:bx+f*i*0.8,y:by-0.5+Math.random(),vx:f*(0.5+Math.random()*0.4),vy:-0.15-Math.random()*0.2,g:-0.01,
    life:8+(Math.random()*6|0),max:14,col:EMBER_COLS[i%3],s:1});
  for(let i=0;i<3;i++)parts.push({x:bx+f*(2+i),y:by-1,vx:f*(0.25+Math.random()*0.2),vy:-0.3-Math.random()*0.25,g:-0.008,
    life:30+(Math.random()*12|0),max:42,col:i%2?'#8a8494':'#6a6474',s:i===1?2:1});
}
// Abur rece din cioc: un nor mic, alb
function frostBreath(n){
  const p=player,f=p.face,[bx,by]=beakTip();
  for(let i=0;i<n;i++)parts.push({x:bx+f*Math.random()*2,y:by-1+Math.random()*2,vx:f*(0.3+Math.random()*0.4),vy:-0.1-Math.random()*0.2,g:-0.005,
    life:26+(Math.random()*10|0),max:36,col:i%3?'#ffffff':'#dff4ff',s:i%2?2:1});
}
