'use strict';
// ===== FONTUL PIXEL =====
const FONT={
A:"EHHVHHH",B:"UHHUHHU",C:"EHGGGHE",D:"UHHHHHU",E:"VGGUGGV",F:"VGGUGGG",G:"EHGNHHF",H:"HHHVHHH",I:"E44444E",J:"72222IC",
K:"HIKOKIH",L:"GGGGGGV",M:"HRLLHHH",N:"HHPLJHH",O:"EHHHHHE",P:"UHHUGGG",Q:"EHHHLID",R:"UHHUKIH",S:"FGGE11U",T:"V444444",
U:"HHHHHHE",V:"HHHHHA4",W:"HHHLLLA",X:"HHA4AHH",Y:"HHA4444",Z:"V12488V",
"0":"EHJLPHE","1":"4C4444E","2":"EH1248V","3":"V2421HE","4":"26AIV22","5":"VGU11HE","6":"68GUHHE","7":"V124888","8":"EHHEHHE","9":"EHHF12C",
" ":"0000000","!":"4444404",".":"00000CC",",":"0000C48",":":"0CC0CC0","-":"000V000","?":"EH12404","/":"122488G",
">":"8421248","<":"248G842","'":"4480000","+":"044V440","(":"2488842",")":"8422248","→":"042V240","←":"048V840","↑":"4EL4444","↓":"4444LE4"
};
const DIA={'Ă':['A',1],'Â':['A',2],'Î':['I',2],'Ș':['S',3],'Ş':['S',3],'Ț':['T',3],'Ţ':['T',3],'É':['E',4]};   // É: din MesoCafé
function txtRaw(g,s,x,y,col,sc){
  g.fillStyle=col;
  for(const chr of s){
    let ch=chr,m=0;if(DIA[ch]){m=DIA[ch][1];ch=DIA[ch][0];}
    const gl=FONT[ch]||FONT[' '];
    for(let r=0;r<7;r++){const v=parseInt(gl[r],32);for(let b=0;b<5;b++)if(v&(16>>b))g.fillRect(x+b*sc,y+r*sc,sc,sc);}
    if(m===1){g.fillRect(x+sc,y-3*sc,sc,sc);g.fillRect(x+3*sc,y-3*sc,sc,sc);g.fillRect(x+2*sc,y-2*sc,sc,sc);}
    else if(m===2){g.fillRect(x+sc,y-2*sc,sc,sc);g.fillRect(x+3*sc,y-2*sc,sc,sc);g.fillRect(x+2*sc,y-3*sc,sc,sc);}
    else if(m===3){g.fillRect(x+2*sc,y+8*sc,sc,sc);g.fillRect(x+sc,y+9*sc,sc,sc);}
    else if(m===4){g.fillRect(x+3*sc,y-3*sc,sc,sc);g.fillRect(x+2*sc,y-2*sc,sc,sc);}
    x+=6*sc;
  }
}
function txt(s,x,y,col='#fff',sc=1,al='l',sh='#000',g=ctx){
  s=String(s).toUpperCase();const w=[...s].length*6*sc-sc;
  if(al==='c')x-=Math.floor(w/2);else if(al==='r')x-=w;
  x=Math.round(x);y=Math.round(y);
  if(sh)txtRaw(g,s,x+sc,y+sc,sh,sc);
  txtRaw(g,s,x,y,col,sc);
}
// Titlu "drăguț": litere care se leagănă, contur alb
const cuteCache={};
function cuteLetter(ch,sc,fill,shadow){
  const k=ch+'|'+sc+fill+shadow;if(cuteCache[k])return cuteCache[k];
  const b=Math.floor(sc/2),ox=2,oy=3*sc+2;
  // Destul de înalt și pentru virgula de sub Ș și Ț
  const [c,g]=mkCanvas(5*sc+b+7,13*sc+b+8);
  const bold=(col,dx,dy)=>{for(let i=0;i<=b;i++)for(let j=0;j<=b;j++)txtRaw(g,ch,ox+dx+i,oy+dy+j,col,sc);};
  bold(shadow,2,3);
  for(const [rx,ry] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]])bold('#ffffff',rx,ry);
  bold(fill,0,0);
  return cuteCache[k]={c,ox,oy,b};
}
function txtCute(s,cx,y,sc,fill,shadow){
  const chars=[...String(s).toUpperCase()],b=Math.floor(sc/2),adv=6*sc+2+b,w=chars.length*adv-sc-2,x0=Math.round(cx-w/2);
  chars.forEach((ch,i)=>{
    if(ch===' ')return;
    const L=cuteLetter(ch,sc,fill,shadow);
    const lx=x0+i*adv,by=y+Math.round(Math.sin(G.t*0.08+i*0.7)*1.5);
    ctx.drawImage(L.c,lx-L.ox,by-L.oy);
  });
}
