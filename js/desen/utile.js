'use strict';
// ================= DESEN: utilitare (lumină, panouri, iconițe, împărțit textul pe rânduri) =================
// Lumină „aditivă” (se adună peste ce e dedesubt) care se stinge spre margini — ca strălucirea să pară
// lumină, nu o pată gri (un galben transparent peste albastru-închis iese gri).
function glow(x,y,r,rgb,a){
  const gr=ctx.createRadialGradient(x,y,0,x,y,r);
  gr.addColorStop(0,`rgba(${rgb},${a})`);gr.addColorStop(0.45,`rgba(${rgb},${a*0.35})`);gr.addColorStop(1,`rgba(${rgb},0)`);
  ctx.globalCompositeOperation='lighter';ctx.fillStyle=gr;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.globalCompositeOperation='source-over';
}
function panel(x,y,w,h){ctx.fillStyle='rgba(16,8,32,0.85)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#ffcf40';ctx.fillRect(x,y,w,2);ctx.fillRect(x,y+h-2,w,2);ctx.fillRect(x,y,2,h);ctx.fillRect(x+w-2,y,2,h);}
// Casetă în stilul meniului: colțuri rotunjite (lipsește pixelul din colț), contur, relief de 1 px (luciu sus,
// umbră jos) și o umbră mică dedesubt. Implicit mov închis, cu contur alb discret.
function uiBox(x,y,w,h,fill='#1c1730',edge='rgba(255,255,255,0.45)',hi='#2c2645',lo='#120e20'){
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(x+1,y+2,w,h);
  ctx.fillStyle=edge;ctx.fillRect(x+1,y,w-2,1);ctx.fillRect(x+1,y+h-1,w-2,1);ctx.fillRect(x,y+1,1,h-2);ctx.fillRect(x+w-1,y+1,1,h-2);
  ctx.fillStyle=fill;ctx.fillRect(x+1,y+1,w-2,h-2);
  ctx.fillStyle=hi;ctx.fillRect(x+1,y+1,w-2,1);
  ctx.fillStyle=lo;ctx.fillRect(x+1,y+h-2,w-2,1);
}
// Iconiță mică desenată din text („#” = un pixel).
function icon(rows,x,y,col){ctx.fillStyle=col;rows.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]==='#')ctx.fillRect(x+i,y+j,1,1);});}
function wrapWords(s,max){const out=[];let line='';
  for(const w of String(s).split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w;}else line=line?line+' '+w:w;}
  if(line)out.push(line);return out;}
