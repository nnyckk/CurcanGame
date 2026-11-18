'use strict';
// ===== SEMNUL DE FINAL ȘI PUNCTELE DE SALVARE =====
function drawSign(cx){
  const x=goal.x*TS-cx;
  ctx.fillStyle='#5a3510';ctx.fillRect(x+33,150,6,42);ctx.fillStyle='#8a5a2a';ctx.fillRect(x+34,150,2,42);
  ctx.fillStyle='#4a2a10';ctx.fillRect(x-2,128,76,30);ctx.fillStyle='#c89050';ctx.fillRect(x,130,72,26);ctx.fillStyle='#e0b070';ctx.fillRect(x,130,72,2);
  txt('MESOPOTAMIA',x+36,134,'#5a1a0a',1,'c',null);txt(['→ 4 KM','→ 3 KM','→ 2 KM','→ 1 KM','→ 500 M'][G.level]||'→ 500 M',x+36,145,'#a02a0a',1,'c',null);
}
function drawCP(cp,cx){
  const x=cp.x-cx+7;if(x<-20||x>W+20)return;
  ctx.fillStyle='#cfd3dc';ctx.fillRect(x,146,2,46);ctx.fillStyle='#ffd23f';ctx.fillRect(x-1,143,4,4);
  const fy=Math.round(178-cp.raise*30);
  for(let i=0;i<13;i++){const off=cp.on?Math.round(Math.sin(G.t*0.2-i*0.6)):0;ctx.fillStyle=cp.on?(i<1?'#c08010':'#ffcf40'):'#8a8a9a';ctx.fillRect(x+2+i,fy+off,1,9-Math.floor(i/5));}
  if(cp.on){ctx.fillStyle='#6a2a0a';const o=Math.round(Math.sin(G.t*0.2-4*0.6));ctx.fillRect(x+5,fy+2+o,1,4);ctx.fillRect(x+9,fy+2+o,1,4);ctx.fillRect(x+6,fy+3+o,1,1);ctx.fillRect(x+8,fy+3+o,1,1);ctx.fillRect(x+7,fy+4+o,1,1);}
}
