/* uXconnect network showcase (static).
   Fine dot-matrix land sampled from a 10 KB land mask (Natural Earth, no borders), uniform node markers,
   routes from the Shanghai and Hong Kong hubs, constant-size labels with collision avoidance.
   Wide screens show the world (Pacific-centred); narrow screens show Asia-Pacific with edge labels. */
(function(){
  var NS='http://www.w3.org/2000/svg';
  function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
  var M_LON0=-20,M_LAT0=72,M_S=4,M_W=1440,M_H=528; // land-mask geometry

  var DOM=[['上海',121.47,31.23,32],['广州',113.26,23.13,22],['北京',116.4,39.9,21],['深圳',114.06,22.54,16],['香港',114.17,22.32,6],['杭州',120.15,30.27,5],['南昌',115.86,28.68,4],['苏州',120.58,31.3,3],['无锡',120.3,31.57,3],['石家庄',114.9,38.6,3],['南京',118.8,32.06,3],['绍兴',120.58,30,3],['东莞',113.75,23.02,3],['佛山',113.12,23.02,3],['武汉',114.3,30.59,3],['成都',104.07,30.67,3],['昆山',120.98,31.38,2],['南通',120.86,32,2],['合肥',117.23,31.82,2],['中山',113.39,22.52,2],['长沙',112.94,28.23,2],['重庆',106.55,29.56,2],['昆明',102.71,25.04,2],['贵阳',106.63,26.65,2],['兰州',103.83,36.06,2],['西安',108.94,34.34,2],['哈尔滨',126.63,45.75,2],['呼和浩特',111.75,40.84,2],['太仓',121.1,31.45,1],['扬州',119.41,32.39,1],['常州',119.97,31.81,1],['天津',117.2,39.13,1],['嘉兴',120.76,30.75,1],['金华',119.65,29.08,1],['湖州',120.09,30.89,1],['义乌',120.07,29.31,1],['珠海',113.58,22.27,1],['福州',119.3,26.08,1],['南宁',108.37,22.82,1],['柳州',109.41,24.33,1],['长春',125.32,43.88,1],['大连',121.61,38.91,1],['中卫',105.19,37.5,1],['台北',121.56,25.04,1]];
  var OVS=[['东京','Tokyo',139.69,35.69],['首尔','Seoul',126.98,37.57],['新加坡','Singapore',103.82,1.35],['马尼拉','Manila',120.98,14.6],['胡志明市','Ho Chi Minh',106.63,10.82],['雅加达','Jakarta',106.85,-6.21],['孟买','Mumbai',72.88,19.08],['法兰克福','Frankfurt',8.68,50.11],['南非','South Africa',28.05,-26.2],['洛杉矶','Los Angeles',-118.24,34.05],['芝加哥','Chicago',-87.63,41.88],['里约热内卢','Rio de Janeiro',-43.17,-22.91]];
  var SH=[121.47,31.23],HK=[114.17,22.32];
  var DOM_LABELS=['北京','成都','武汉','广州','西安','哈尔滨'];
  var REGION={'孟买':'印度','法兰克福':'欧洲','南非':'非洲','洛杉矶':'美洲','芝加哥':'美洲','里约热内卢':'美洲','东京':'日本','首尔':'韩国','新加坡':'东南亚','马尼拉':'东南亚','胡志明市':'东南亚','雅加达':'东南亚'};
  var WIN={wide:{lon:[-20,330],lat:[63,-44]},narrow:{lon:[72,152],lat:[55,-10]}};

  var maskData=null,waiting=[];
  function loadMask(src,cb){
    if(maskData)return cb();waiting.push(cb);if(waiting.length>1)return;
    var img=new Image();img.onload=function(){var c=document.createElement('canvas');c.width=M_W;c.height=M_H;var x=c.getContext('2d');x.drawImage(img,0,0);
      try{maskData=x.getImageData(0,0,M_W,M_H).data}catch(e){maskData=new Uint8ClampedArray(M_W*M_H*4)}
      waiting.forEach(function(f){f()});waiting=[]};
    img.src=src;
  }
  function isLand(lon,lat){var L=lon<M_LON0?lon+360:lon;var x=Math.round((L-M_LON0)*M_S),y=Math.round((M_LAT0-lat)*M_S);if(x<0||y<0||x>=M_W||y>=M_H)return false;return maskData[(y*M_W+x)*4]>127}

  function Show(box){
    this.box=box;box.classList.add('sm');
    this.canvas=document.createElement('canvas');box.appendChild(this.canvas);
    this.svg=el('svg',{'class':'sm-svg',role:'img','aria-label':box.getAttribute('data-label')||'友讯网络节点分布示意'},box);
    this.motion=!window.matchMedia||!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var self=this,src=box.getAttribute('data-mask')||'assets/land-mask.png',last='';
    function go(){var w=box.clientWidth;if(!w)return;var k=self.pick(w)+w;if(k===last)return;last=k;self.render()}
    loadMask(src,go);var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(function(){if(maskData)go()},150)});
  }
  Show.prototype.pick=function(w){if(w<700)return 'narrow';if(this.box.closest&&this.box.closest('.hero-split')&&window.matchMedia&&window.matchMedia('(min-width:1200px)').matches)return 'narrow';return 'wide'};
  Show.prototype.render=function(){
    var w=this.box.clientWidth,mode=this.pick(w),win=WIN[mode];
    var lonSpan=win.lon[1]-win.lon[0],latSpan=win.lat[0]-win.lat[1];
    var p=w/lonSpan,H=Math.round(latSpan*p*1.12); // gentle vertical stretch reads closer to familiar projections
    this.w=w;this.h=H;this.mode=mode;
    var py=H/latSpan,lon0=win.lon[0],lat0=win.lat[0];
    this.P=function(lon,lat){var L=lon<lon0?lon+360:lon;return [(L-lon0)*p,(lat0-lat)*py]};
    this.box.style.height=H+'px';
    this.drawLand(p,py,lon0,lat0);this.overlay();
  };
  Show.prototype.drawLand=function(p,py,lon0,lat0){
    var c=this.canvas,w=this.w,H=this.h,dpr=Math.min(window.devicePixelRatio||1,2);
    c.width=Math.round(w*dpr);c.height=Math.round(H*dpr);c.style.width=w+'px';c.style.height=H+'px';
    var x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,w,H);
    // soft glow under mainland China, drawn first so land dots stay crisp above it
    var cg=this.P(112,31),g=x.createRadialGradient(cg[0],cg[1],0,cg[0],cg[1],Math.max(60,22*p));
    g.addColorStop(0,'rgba(1,144,238,.16)');g.addColorStop(.6,'rgba(1,144,238,.05)');g.addColorStop(1,'rgba(1,144,238,0)');x.fillStyle=g;x.fillRect(0,0,w,H);
    var s=this.mode==='narrow'?4.2:Math.max(3.6,Math.min(4.6,w/300)),r=s*.26;
    x.fillStyle='#C9D6E3';x.beginPath();
    for(var yy=s/2,row=0;yy<H;yy+=s*.866,row++){
      for(var xx=(row%2?s:s/2);xx<w;xx+=s){
        var lon=lon0+xx/p,lat=lat0-yy/py;if(lon>=180+160)lon-=360;
        if(isLand(lon,lat)){x.moveTo(xx+r,yy);x.arc(xx,yy,r,0,6.2832)}
      }
    }
    x.fill();
  };
  Show.prototype.overlay=function(){
    var svg=this.svg,self=this,w=this.w,H=this.h,narrow=this.mode==='narrow';
    while(svg.firstChild)svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox','0 0 '+w+' '+H);svg.setAttribute('width',w);svg.setAttribute('height',H);
    var routes=el('g',{},svg),nodes=el('g',{},svg),labels=el('g',{},svg),n=0,cands=[];
    var sh=this.P(SH[0],SH[1]),hk=this.P(HK[0],HK[1]);
    function inside(q){return q[0]>=6&&q[0]<=w-6&&q[1]>=6&&q[1]<=H-6}
    function arc(a,b,k,cls,pkt){
      var dx=b[0]-a[0],dy=b[1]-a[1],len=Math.sqrt(dx*dx+dy*dy),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2-len*k,id='sm'+(n++)+Math.random().toString(36).slice(2,6);
      el('path',{d:'M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1),'class':cls,id:id},routes);
      if(pkt&&self.motion){var c=el('circle',{r:2.4,'class':'pkt'},routes);var am=el('animateMotion',{dur:(3.2+Math.random()*2.6).toFixed(1)+'s',repeatCount:'indefinite',begin:(Math.random()*3).toFixed(1)+'s'},c);el('mpath',{href:'#'+id},am)}
    }
    // overseas
    var west=[],east=[],edgeBoxes=[];
    OVS.forEach(function(o){var q=self.P(o[2],o[3]),from=(o[3]>25||o[2]<0||o[2]<60)?sh:hk;
      if(inside(q)){arc(from,q,.2,'rt',true);el('circle',{cx:q[0],cy:q[1],r:5.2,'class':'halo'},nodes);el('circle',{cx:q[0],cy:q[1],r:3.4,'class':'ov'},nodes);cands.push({x:q[0],y:q[1],r:5,t:o[0],pri:5})}
      else (o[2]>=0&&o[2]<100?west:east).push(o)});
    [[west,10,'start','← '],[east,w-10,'end','']].forEach(function(gp,i){if(!gp[0].length)return;
      var y=22,a=i?sh:hk;arc(a,[gp[1],y+10],.22,'rt',true);
      var regs=[];gp[0].forEach(function(o){var rg=REGION[o[0]];if(regs.indexOf(rg)<0)regs.push(rg)});
      var txt=gp[3]+regs.join(' · ')+(i?' →':''),tw=txt.length*12;
      edgeBoxes.push(i?[gp[1]-tw,y-13,gp[1],y+4]:[gp[1],y-13,gp[1]+tw,y+4]);
      var t=el('text',{x:gp[1],y:y,'class':'lb edge','text-anchor':gp[2]},labels);t.textContent=txt});
    arc(sh,hk,.28,'rt',true);
    // domestic nodes: uniform markers, merged when closer than the marker spacing
    var minD=narrow?8:9,kept=[];
    DOM.slice().sort(function(a,b){return b[3]-a[3]}).forEach(function(d){if(d[0]==='上海'||d[0]==='香港')return;var q=self.P(d[1],d[2]);
      for(var i=0;i<kept.length;i++){var k=kept[i];if(Math.hypot(k[0]-q[0],k[1]-q[1])<minD)return}
      if(Math.hypot(sh[0]-q[0],sh[1]-q[1])<minD+3||Math.hypot(hk[0]-q[0],hk[1]-q[1])<minD+3)return;
      kept.push(q);el('circle',{cx:q[0],cy:q[1],r:4.6,'class':'halo'},nodes);el('circle',{cx:q[0],cy:q[1],r:2.9,'class':'nd'},nodes);
      if(DOM_LABELS.indexOf(d[0])>-1)cands.push({x:q[0],y:q[1],r:4,t:d[0],pri:d[0]==='北京'?2:20+DOM_LABELS.indexOf(d[0])})});
    // mesh: minimum spanning tree + each node to its 2 nearest neighbours, so every PoP is connected
    var pts=kept.concat([sh,hk]),E={},mesh=el('g',{'class':'mesh'},routes);routes.insertBefore(mesh,routes.firstChild);
    function key(i,j){return i<j?i+'-'+j:j+'-'+i}
    function D(i,j){return Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1])}
    var inT=[0],rest=[];for(var i=1;i<pts.length;i++)rest.push(i);
    while(rest.length){var best=null;inT.forEach(function(a){rest.forEach(function(b){var d=D(a,b);if(!best||d<best[2])best=[a,b,d]})});E[key(best[0],best[1])]=1;inT.push(best[1]);rest.splice(rest.indexOf(best[1]),1)}
    pts.forEach(function(a,i){var nb=pts.map(function(b,j){return [j,D(i,j)]}).filter(function(v){return v[0]!==i}).sort(function(u,v){return u[1]-v[1]}).slice(0,2);nb.forEach(function(v){if(v[1]<(narrow?110:70))E[key(i,v[0])]=1})});
    Object.keys(E).forEach(function(k){var ij=k.split('-');var a=pts[+ij[0]],b=pts[+ij[1]];el('line',{x1:a[0].toFixed(1),y1:a[1].toFixed(1),x2:b[0].toFixed(1),y2:b[1].toFixed(1)},mesh)});
    // backbone from the hubs to key cities
    ['北京','成都','武汉','西安','哈尔滨','昆明'].forEach(function(nm){var d=DOM.filter(function(x){return x[0]===nm})[0];arc(sh,self.P(d[1],d[2]),.12,'rt-d',true)});
    // hubs
    [[sh,'上海'],[hk,'香港']].forEach(function(hb){
      if(self.motion){el('circle',{cx:hb[0][0],cy:hb[0][1],r:6,'class':'ring'},nodes);el('circle',{cx:hb[0][0],cy:hb[0][1],r:6,'class':'ring d2'},nodes)}
      el('circle',{cx:hb[0][0],cy:hb[0][1],r:9,'class':'halo'},nodes);el('circle',{cx:hb[0][0],cy:hb[0][1],r:6,'class':'hub'},nodes);
      cands.push({x:hb[0][0],y:hb[0][1],r:8,t:hb[1],pri:0,hub:1})});
    // labels with collision avoidance (hubs first, then overseas, then key domestic cities)
    var placed=[];function hit(b){if(b[0]<4||b[1]<4||b[2]>w-4||b[3]>H-4)return true;for(var i=0;i<placed.length;i++){var q=placed[i];if(b[0]<q[2]&&b[2]>q[0]&&b[1]<q[3]&&b[3]>q[1])return true}return false}
    kept.forEach(function(q){placed.push([q[0]-2.5,q[1]-2.5,q[0]+2.5,q[1]+2.5])});[sh,hk].forEach(function(q){placed.push([q[0]-7,q[1]-7,q[0]+7,q[1]+7])});edgeBoxes.forEach(function(b){placed.push(b)});
    cands.sort(function(a,b){return a.pri-b.pri}).forEach(function(c){
      var fs=c.hub?15:12.5,W=c.t.length*fs+2,Hh=fs+3,g=c.r+3;
      var opts=c.hub&&c.t==='上海'?[[c.x+g,c.y-Hh/2],[c.x-W/2,c.y-g-Hh]]:[[c.x+g,c.y-Hh/2],[c.x-g-W,c.y-Hh/2],[c.x-W/2,c.y-g-Hh],[c.x-W/2,c.y+g],[c.x+g-2,c.y-g-Hh+2],[c.x-g-W+2,c.y-g-Hh+2],[c.x+g-2,c.y+g-2],[c.x-g-W+2,c.y+g-2]];
      for(var i=0;i<opts.length;i++){var o=opts[i],b=[o[0],o[1],o[0]+W,o[1]+Hh];if(hit(b))continue;placed.push(b);
        var t=el('text',{x:o[0],y:o[1]+fs-1,'class':'lb'+(c.hub?' hubl':'')},labels);t.textContent=c.t;return}
    });
  };
  function init(){document.querySelectorAll('[data-showmap]').forEach(function(b){if(!b._s)b._s=new Show(b)})}
  if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
