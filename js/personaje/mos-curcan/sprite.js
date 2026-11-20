'use strict';
// ===== MOȘ CURCAN: desenul =====
// Bătrânelul din cafenea: un curcan gras
const OLD_PAL={k:'#14121c',h:'#6a4428',H:'#3a2010',j:'#8e6440',w:'#e2e2ea',g:'#b8bcc8',e:'#ffffff',G:'#3a2a1a',
  y:'#ffc21a',o:'#e8870e',r:'#e0222c',R:'#a01018',P:'#b8682c',p:'#6a3414',T:'#e6dcc8',q:'#b8484a',u:'#c8bca6',
  D:'#3a2a26',v:'#2f6a46',b:'#ffd23f',n:'#8a4a22',N:'#5a2c12',m:'#b8723a',c:'#f2e4c8',C:'#dccaa4',l:'#e8682c',s:'#8a5a2a',
  F:'#3a2010',L:'#9ad8f0',S:'#e0a060',Z:'#ffb040',V:'#24543a',A:'#3e7e58',Q:'#1a3a26'};   // ochelarii: ramă maro, sticlă albastră; pipa; vesta: umbră, lumină
const OLD_ROWS=[
  ".............kkkkkk.........",
  "............khhjhhhk........",
  "............khjhhhhk........",
  "............kHHHHHHk........",
  "..........kkhhhhhhhhkk......",
  ".........khhhhhhhhhhhhk.....",
  "...T.q.....kwwweeeewk.......",
  "..qTuqT....kwFFFFFFFk..kkkk.",
  "..TuqTuq...kwwwwFLLFyy.kZZk.",
  ".qTuqTuqT..kwwwwFLLFyyokPPk.",
  "TuqTuqTuqT.kwwwwFFFFrkSPPpk.",
  ".uqTuqTuqkkgwwwwwwryok.kppk.",
  ".TuqTuqTukwwwwwwwrr.....kk..",
  "..TuqTuqkkwkeeeeekrR........",
  "TuqTuqkDDDDvkeeveekkR.......",
  "uqTuqkDDDDvvvkevekvvk.......",
  "qTuqkDDmmmmvvvvvvvvvvk......",
  ".TuqkDmmmmmmvvvvvbvvvvk.....",
  "..ukDmNmmNmmvvvvvvvvvvk.....",
  "...kDnnNnnNnnvvvvbvvvvvk....",
  "...kDnNnnNnnNvvvvvvvvvvk....",
  "...kDNnnNnnNnvvvvbvvvvvk....",
  "...kDnnNnnNnvvvvvvvvvvvk....",
  "....kDnNnNnvQQQQvvvvvvvk....",
  "....knDnDDvvQvvQvvvvVVk.....",
  ".....kDDDDvvQQQQvvvVVk......",
  "......kDDDDvvvvvvvVVk.......",
  "........kkkkkkkkkkk.........",
  "...........l...l............",
  "...........l...l............",
  "..........lll.lll..........."];
// Vesta: umbră discretă în dreapta și jos, lumină la guler
const OLD_VEST=OLD_ROWS.map((r,y)=>{
  if(y<14||y>27)return r;
  const a=[...r],v=[];a.forEach((c,x)=>{if(c==='v')v.push(x);});
  if(!v.length)return r;
  a[v[v.length-1]]='V';if(y>=19&&v.length>2)a[v[v.length-2]]='V';
  if(y<=15)a[v[0]]='A';
  return a.join('');
});
const OLD=spr(OLD_VEST,OLD_PAL);
// Doar în portretul din dialog: fum din pipă
const OLD_BUST=mkSprite(OLD_VEST.map((r,y)=>({4:25,5:26,6:25}[y]?r.slice(0,{4:25,5:26,6:25}[y])+'g'+r.slice({4:25,5:26,6:25}[y]+1):r)),OLD_PAL,false);
const OLD_W=28,OLD_H=31;
