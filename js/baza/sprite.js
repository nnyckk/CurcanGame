'use strict';
// ================= SPRITE-URI: cum se fac din text, culori =================
function mkSprite(rows,pal,flip){
  const h=rows.length,w=Math.max(...rows.map(r=>r.length));
  const [c,g]=mkCanvas(w,h);
  rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const col=pal[r[x]];if(!col)continue;g.fillStyle=col;g.fillRect(flip?w-1-x:x,y,1,1);}});
  return c;
}
const spr=(rows,pal)=>({r:mkSprite(rows,pal,false),l:mkSprite(rows,pal,true)});
// --- Dușmani înghețați (loviți de o pană de gheață) ---
// Sprite-urile lor de stat, cu culorile amestecate pe jumătate cu albastrul gheții (peste ele se pune blocul de gheață).
function mixHex(a,b,t){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(a),B=p(b);
  return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function icePal(pal){const o={};for(const k in pal)o[k]=mixHex(pal[k],'#a8e0ff',0.55);return o;}
