'use strict';
// ===== CURCANII PRINȘI: desenele =====
// Curcanul mare, cu 4 rânduri libere sus pentru pălării
const CAPT_PAD=4;
function captBase(look){
  const head=look.head==='brown',wing=look.wing==='white';
  // Haina în trei nuanțe, ca la costumul de foc
  return Array(CAPT_PAD).fill('......................').concat(TK_TOP.slice(0,12).concat(TKF_TOP.slice(12)).map((r,y)=>[...r].map((c,x)=>{
    if(x<=7&&y>=3&&y<=12&&!(y>=10&&x>=6))return {W:'X',r:'Y',g:'Z'}[c]||c;   // coada
    if(look.collar&&(y===10||y===11)&&x>=7&&x<=13&&c==='k')c='W';   // gât simplu, pentru guler
    if(look.scarf&&(y===10||y===11)&&x>=7&&x<=13)return c==='k'?look.scarf:c;   // fularul: alb și culoarea lui
    if(head&&y>=3&&y<=11&&x>=6&&(c==='W'||c==='g'))return c==='W'?'H':'N';   // capul și gâtul maro
    if(wing&&y>=13&&'nNm'.includes(c))return {n:'W',N:'g',m:'W'}[c];   // aripa albă
    if(y>=12&&x>=10&&'hWr'.includes(c))return 'B';   // haina simplă
    return c;}).join('')+'..'));   // 2 coloane libere în față
}
// Peste curcan: [rând, coloană, pixeli]; '.' = lasă, '_' = șterge
function captDraw(base,ov){
  const g=base.map(r=>[...r]);
  for(const [y,x,s] of ov)for(let i=0;i<s.length;i++){const c=s[i];if(c!=='.')g[y][x+i]=c==='_'?'.':c;}
  return g.map(r=>r.join(''));
}
// Fiecare: capul, aripa, haina și un singur semn al lui
const CAPT_LOOK=[
  // Doamna Glu-Glu: pălărioară cu floare
  {fem:true,scarf:'D',head:'white',wing:'white',pal:{B:'#d8a0b0',X:'#ffffff',Y:'#e0e0ea',Z:'#c8c8d4',A:'#f4ecdc',V:'#c8506a',F:'#ff6a8a',c:'#ffd23f',G:'#4aa04a'},
   ov:[[3,11,'kkkk'],[4,10,'kAAAAk'],[5,10,'kVVVVk'],[6,8,'kAAAAAAAAk'],[3,9,'F'],[4,8,'FcF'],[5,9,'F'],[5,8,'G']]},
  // Conu' Gușălan: joben și monoclu
  {head:'white',wing:'brown',pal:{B:'#2a2a3a',X:'#e8e8f0',Y:'#3a3a4a',Z:'#9a9aa8',J:'#1e1e28',j:'#4a4a5e',b:'#c8203a',M:'#ffd23f'},
   ov:[[1,10,'kkkkkk'],[2,10,'kJjJJk'],[3,10,'kJjJJk'],[4,10,'kJjJJk'],[5,10,'kbbbbk'],[6,8,'kJJJJJJJJk'],
     [9,13,'MMM'],[10,13,'M'],[10,15,'M'],[11,13,'M'],[11,15,'M'],[12,13,'MMM'],[13,13,'M'],[14,12,'M']]},
  // Nenea Penel: pălărie de paie
  {head:'brown',wing:'brown',pal:{B:'#3a7a4a',X:'#f4ead0',Y:'#8a6a3a',Z:'#c8b890',H:'#8a5a34',S:'#f0d070',s:'#c8a040',d:'#2a3a7a'},
   ov:[[3,10,'kkkkkk'],[4,10,'kSSsSk'],[5,10,'kddddk'],[6,7,'kSSSSSSSSSSk'],[12,19,'s'],[11,20,'S'],[10,21,'S'],
     [14,7,'EBBDHHD'],[15,7,'EBBBDHD']]},   // pai în cioc; haina până la gât, cu decolteu în V
  // Nenea Țepoșel: mustață deasă, neagră; guler de cămașă
  {collar:true,head:'white',wing:'brown',pal:{B:'#3a4a8a',X:'#e8d8c0',Y:'#7a4a28',Z:'#b89878',U:'#1a1414',u:'#3a3434'},
   ov:[[12,14,'UUuUUU'],[13,13,'UU'],[13,19,'UU'],[15,8,'kWWWWWk'],[16,9,'kWWBWWk'],[17,10,'kWBWk']]},
  // Tanti Pufoaica: fular gros de lână, cu un capăt atârnând
  {fem:true,head:'white',wing:'white',pal:{B:'#a82a2a',X:'#f0f0f8',Y:'#6a7a9a',Z:'#b8c0d0'},
   ov:[[14,6,'kWDWDWDWDk'],[15,5,'kWDWDWDWDWk'],[16,6,'kDDDDDDDDk'],
     [17,12,'kWDk'],[18,12,'kDWk'],[19,12,'kWDk'],[20,13,'WD']]},
];
// Seturile: S = trist, L = se uită, J = sare
const CAPT_COAT=[[CAPT_PAD+13,12,'O'],[CAPT_PAD+15,12,'O'],[CAPT_PAD+17,12,'O']];   // nasturii
const CAPT_LASH=[[CAPT_PAD+5,13,'k'],[CAPT_PAD+5,15,'k']];   // genele doamnelor
const CAPT=CAPT_LOOK.map(d=>{
  const top=captDraw(captBase(d),CAPT_COAT.concat(d.fem?CAPT_LASH:[],d.ov));
  const pal=Object.assign({},TK_PAL,{E:mixHex(d.pal.B,'#ffffff',0.3),D:mixHex(d.pal.B,'#000000',0.4),O:'#ffd23f'},d.pal);
  // Trist: ochiul în jos
  const ey=CAPT_PAD+6,sad=top.map((r,y)=>y===ey?r.slice(0,14)+r[13]+r.slice(15):r);
  // SI, LI: respiră (corpul coboară un pixel), ca tine
  return {S:spr(sad.concat(LEG_A),pal),L:spr(top.concat(LEG_A),pal),J:spr(top.concat(LEG_J),pal),
    SI:spr(sad.concat(LEG_A.slice(1)),pal),LI:spr(top.concat(LEG_A.slice(1)),pal)};
});
const CAPT_W=20,CAPT_H=CAPT_PAD+23;
