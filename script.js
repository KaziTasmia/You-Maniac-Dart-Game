var c=document.getElementById('c'),x=c.getContext('2d'),CX=200,CY=200;
var zones=[
 {n:'BULLSEYE',p:50,r:20,col:'#f4ff1a',bg:'#e11fb4',em:'🦋'},
 {n:'INNER',p:30,r:60,col:'#e11fb4',bg:'#f4ff1a',em:'🍺'},
 {n:'MIDDLE',p:20,r:110,col:'#5b2a9e',bg:'#e11fb4',em:'🦋'},
 {n:'OUTER',p:10,r:170,col:'#24103f',bg:'#f4ff1a',em:'🍺'},
 {n:'MISS',p:0,r:9999,col:'#333',bg:'#5b2a9e',em:'💥'}
];
// default picture: simple colour blocks + points + emoji
zones.forEach(function(z){
  var t=document.createElement('canvas');t.width=t.height=300;var g=t.getContext('2d');
  g.fillStyle=z.bg;g.fillRect(0,0,300,300);
  g.fillStyle='#24103f';g.fillRect(40,40,220,220);
  g.fillStyle=z.col==='#24103f'?'#5b2a9e':z.col;g.fillRect(60,60,180,180);
  g.fillStyle='#24103f';g.textAlign='center';g.font='bold 60px Trebuchet MS';g.fillText(z.p,150,160);
  g.font='48px sans-serif';g.fillText(z.em,150,215);
  g.font='bold 20px Trebuchet MS';g.fillStyle=z.bg==='#5b2a9e'?'#fff':'#24103f';g.fillText(z.n,150,284);
  z.img=t.toDataURL();
});
// Your own photos for each zone (put them in the images folder)
var photos={
  50:'images/50.jpg.webp',
  30:'images/30.jpg.webp',
  20:'images/20.jpg.webp',
  10:'images/10.jpg.webp',
  0:'images/miss.jpg.webp'
};
zones.forEach(function(z){
  var im=new Image();
  im.onload=function(){z.img=im.src};
  im.src=photos[z.p];
});
var pic=document.getElementById('pic'),cap=document.getElementById('cap'),info=document.getElementById('info');
var darts,left,score,best,pos={x:CX,y:CY};
function reset(){darts=[];left=3;score=0;best=null;ui();pic.src=zones[4].img;cap.textContent='Throw a dart! 🦋'}
function ui(){info.textContent='Darts left: '+left+' · Score: '+score}
function zoneAt(px,py){var d=Math.hypot(px-CX,py-CY);for(var i=0;i<zones.length;i++)if(d<=zones[i].r)return i}
function draw(){
  x.clearRect(0,0,400,400);
  var fills=['#f4ff1a','#e11fb4','#5b2a9e','#24103f'];
  for(var i=3;i>=0;i--){x.beginPath();x.arc(CX,CY,zones[i].r,0,7);x.fillStyle=fills[i];x.fill();x.lineWidth=3;x.strokeStyle='#f4ff1a';x.stroke()}
  x.font='20px sans-serif';x.textAlign='center';x.fillText('🦋',CX,CY+7);
  darts.forEach(function(d){x.fillStyle='#f4ff1a';x.fillRect(d.x-6,d.y-6,12,12);x.strokeStyle='#000';x.lineWidth=2;x.strokeRect(d.x-6,d.y-6,12,12)});
  if(left>0){var t=Date.now()/1000;pos.x=CX+Math.sin(t*2.1)*150;pos.y=CY+Math.cos(t*1.7)*150;
    x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(pos.x-10,pos.y-10,20,20);
    x.beginPath();x.moveTo(pos.x-16,pos.y);x.lineTo(pos.x+16,pos.y);x.moveTo(pos.x,pos.y-16);x.lineTo(pos.x,pos.y+16);x.stroke()}
  requestAnimationFrame(draw)
}
c.addEventListener('click',function(){
  if(left<=0)return;
  var px=pos.x+(Math.random()-.5)*30,py=pos.y+(Math.random()-.5)*30;
  var zi=zoneAt(px,py);darts.push({x:px,y:py});left--;score+=zones[zi].p;
  if(best===null||zones[zi].p>zones[best].p)best=zi;
  pic.src=zones[zi].img;cap.textContent='Dart hit: '+zones[zi].n+' (+'+zones[zi].p+') '+zones[zi].em;
  ui();
  if(left===0){setTimeout(function(){pic.src=zones[best].img;cap.textContent='🦋 Best hit: '+zones[best].n+' ('+zones[best].p+' pts) · Total '+score+' 🍺'},900)}
});
document.getElementById('again').onclick=reset;
var zdiv=document.getElementById('zones');
zones.forEach(function(z){
  var l=document.createElement('label');l.textContent=z.p+' pts';
  var f=document.createElement('input');f.type='file';f.accept='image/*';
  f.onchange=function(){var r=new FileReader();r.onload=function(){z.img=r.result;pic.src=z.img};if(f.files[0])r.readAsDataURL(f.files[0])};
  l.appendChild(f);zdiv.appendChild(l)
});
reset();draw();