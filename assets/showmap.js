/* uXconnect network showcase (static).
   Fine dot-matrix land sampled from a 10 KB land mask (Natural Earth, no borders), uniform node markers,
   routes from the Shanghai and Hong Kong hubs, constant-size labels with collision avoidance.
   Wide screens show the world (Pacific-centred); narrow screens show Asia-Pacific with edge labels. */
(function(){
  var NS='http://www.w3.org/2000/svg';
  function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
  var M_LON0=-20,M_LAT0=72,M_S=4,M_W=1440,M_H=528; // land-mask geometry

  var DOM=[['上海',121.47,31.23,32],['广州',113.26,23.13,22],['北京',116.4,39.9,21],['深圳',114.06,22.54,16],['香港',114.17,22.32,6],['杭州',120.15,30.27,5],['南昌',115.86,28.68,4],['苏州',120.58,31.3,3],['无锡',120.3,31.57,3],['石家庄',114.9,38.6,3],['南京',118.8,32.06,3],['绍兴',120.58,30,3],['东莞',113.75,23.02,3],['佛山',113.12,23.02,3],['武汉',114.3,30.59,3],['成都',104.07,30.67,3],['昆山',120.98,31.38,2],['南通',120.86,32,2],['合肥',117.23,31.82,2],['中山',113.39,22.52,2],['长沙',112.94,28.23,2],['重庆',106.55,29.56,2],['昆明',102.71,25.04,2],['贵阳',106.63,26.65,2],['兰州',103.83,36.06,2],['西安',108.94,34.34,2],['哈尔滨',126.63,45.75,2],['呼和浩特',111.75,40.84,2],['太仓',121.1,31.45,1],['扬州',119.41,32.39,1],['常州',119.97,31.81,1],['天津',117.2,39.13,1],['嘉兴',120.76,30.75,1],['金华',119.65,29.08,1],['湖州',120.09,30.89,1],['义乌',120.07,29.31,1],['珠海',113.58,22.27,1],['福州',119.3,26.08,1],['南宁',108.37,22.82,1],['柳州',109.41,24.33,1],['长春',125.32,43.88,1],['大连',121.61,38.91,1],['中卫',105.19,37.5,1],['台北',121.56,25.04,1]];
  var OVS=[['东京','Tokyo',139.69,35.69],['首尔','Seoul',126.98,37.57],['新加坡','Singapore',103.82,1.35],['马尼拉','Manila',120.98,14.6],['胡志明市','Ho Chi Minh',106.63,10.82],['雅加达','Jakarta',106.85,-6.21],['孟买','Mumbai',72.88,19.08],['法兰克福','Frankfurt',8.68,50.11],['南非','South Africa',28.05,-26.2],['洛杉矶','Los Angeles',-118.24,34.05],['芝加哥','Chicago',-87.63,41.88],['里约热内卢','Rio de Janeiro',-43.17,-22.91],['悉尼','Sydney',151.21,-33.87],['墨尔本','Melbourne',144.96,-37.81],['金奈','Chennai',80.27,13.08],['伦敦','London',-0.13,51.51],['巴黎','Paris',2.35,48.86],['奥斯陆','Oslo',10.75,59.91],['阿姆斯特丹','Amsterdam',4.9,52.37],['米兰','Milan',9.19,45.46],['西雅图','Seattle',-122.33,47.61],['圣何塞','San Jose',-121.89,37.34],['圣保罗','St. Paul',-93.09,44.95],['达拉斯','Dallas',-96.8,32.78],['休斯敦','Houston',-95.37,29.76],['华盛顿','Washington',-77.04,38.91],['多伦多','Toronto',-79.38,43.65],['蒙特利尔','Montreal',-73.57,45.5],['克雷塔罗','Querétaro',-100.39,20.59]];
  var RTE=[]; // deliverable routes that are not our nodes (dashed line, hollow dot)
  var SH=[121.47,31.23],HK=[114.17,22.32];
  // 想标名字的国内城市（按重要程度）。国内名字只放在点旁边、不引起歧义、不压线的位置；放不好就不标，以美观为先，不拉引线
  var DOM_LABELS={wide:['北京','成都','西安','哈尔滨','武汉','广州'],narrow:['北京','成都','武汉','西安','哈尔滨','广州']};
  var REGION={'孟买':'印度','法兰克福':'欧洲','南非':'非洲','洛杉矶':'美洲','芝加哥':'美洲','里约热内卢':'美洲','东京':'日本','首尔':'韩国','新加坡':'东南亚','马尼拉':'东南亚','胡志明市':'东南亚','雅加达':'东南亚','悉尼':'澳洲','墨尔本':'澳洲','金奈':'印度','伦敦':'欧洲','巴黎':'欧洲','阿姆斯特丹':'欧洲','米兰':'欧洲','奥斯陆':'欧洲','西雅图':'美洲','圣何塞':'美洲','圣保罗':'美洲','达拉斯':'美洲','休斯敦':'美洲','华盛顿':'美洲','多伦多':'美洲','蒙特利尔':'美洲','克雷塔罗':'美洲'};
  var EN=/^en/i.test(document.documentElement.lang);
  var TR={'墨尔本':'Melbourne','金奈':'Chennai','伦敦':'London','巴黎':'Paris','阿姆斯特丹':'Amsterdam','米兰':'Milan','奥斯陆':'Oslo','西雅图':'Seattle','圣何塞':'San Jose','圣保罗':'St. Paul','达拉斯':'Dallas','休斯敦':'Houston','华盛顿':'Washington','多伦多':'Toronto','蒙特利尔':'Montreal','克雷塔罗':'Querétaro','上海':'Shanghai','香港':'Hong Kong','北京':'Beijing','成都':'Chengdu','武汉':'Wuhan','广州':'Guangzhou','西安':'Xi\'an','哈尔滨':'Harbin',
    '东京':'Tokyo','首尔':'Seoul','新加坡':'Singapore','马尼拉':'Manila','胡志明市':'Ho Chi Minh','雅加达':'Jakarta','孟买':'Mumbai','法兰克福':'Frankfurt','南非':'South Africa','洛杉矶':'Los Angeles','芝加哥':'Chicago','里约热内卢':'Rio de Janeiro',
    '印度':'India','欧洲':'Europe','非洲':'Africa','美洲':'Americas','日本':'Japan','韩国':'Korea','东南亚':'SE Asia','悉尼':'Sydney','澳洲':'Australia'};
  var JA=/^ja/i.test(document.documentElement.lang);
  var TRJ={'广州':'広州','武汉':'武漢','哈尔滨':'ハルビン','东京':'東京','首尔':'ソウル','新加坡':'シンガポール','马尼拉':'マニラ','胡志明市':'ホーチミン','雅加达':'ジャカルタ','孟买':'ムンバイ','法兰克福':'フランクフルト','南非':'南アフリカ','洛杉矶':'ロサンゼルス','芝加哥':'シカゴ','里约热内卢':'リオデジャネイロ','印度':'インド','欧洲':'欧州','非洲':'アフリカ','美洲':'米州','韩国':'韓国','东南亚':'東南アジア','悉尼':'シドニー','澳洲':'オーストラリア','墨尔本':'メルボルン','金奈':'チェンナイ','伦敦':'ロンドン','巴黎':'パリ','阿姆斯特丹':'アムステルダム','米兰':'ミラノ','奥斯陆':'オスロ','西雅图':'シアトル','圣何塞':'サンノゼ','圣保罗':'セントポール','达拉斯':'ダラス','休斯敦':'ヒューストン','华盛顿':'ワシントン','多伦多':'トロント','蒙特利尔':'モントリオール','克雷塔罗':'ケレタロ'};
  function L(s){return EN&&TR[s]||JA&&TRJ[s]||s}
  function TW(s,fs){return EN?s.length*fs*.56:s.length*fs}
  var WIN={wide:{lon:[-20,330],lat:[66,-44]},narrow:{lon:[72,152],lat:[55,-10]}};

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
    this.svg=el('svg',{'class':'sm-svg',role:'img','aria-label':box.getAttribute('data-label')||(EN?'uXconnect network map':JA?'uXconnect ネットワークマップ':'友讯网络节点分布示意')},box);
    this.motion=!window.matchMedia||!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var self=this,src=box.getAttribute('data-mask')||'assets/land-mask.png',last='';
    function go(){var w=box.clientWidth;if(!w)return;var k=self.pick(w)+w;if(k===last)return;last=k;self.render()}
    loadMask(src,go);var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(function(){if(maskData)go()},150)});
  }
  Show.prototype.pick=function(w){if(w<800)return 'narrow';return 'wide'};   // 地图容器 800 以上用世界图（含 844 以上的手机横屏）；更窄（手机竖屏、小屏横屏、平板竖屏）用亚太局部图，否则海外城市名字放不下
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
    var svg=this.svg,self=this,w=this.w,H=this.h,narrow=this.mode==='narrow',DL=DOM_LABELS[this.mode];
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
    var west=[],east=[],edgeBoxes=[],ovDots=[];
    // 干线 + 支线：每个区域只有一条从枢纽出发的干线，区域内其他城市从区域门户城市接出（细线、无流动光点），避免几十条长线叠在一起
    var GW={'西雅图':'洛杉矶','圣何塞':'洛杉矶','达拉斯':'洛杉矶','休斯敦':'达拉斯','克雷塔罗':'达拉斯','里约热内卢':'休斯敦','芝加哥':'洛杉矶','圣保罗':'芝加哥','多伦多':'芝加哥','蒙特利尔':'多伦多','华盛顿':'芝加哥',
            '伦敦':'法兰克福','巴黎':'法兰克福','阿姆斯特丹':'法兰克福','米兰':'法兰克福','奥斯陆':'阿姆斯特丹',
            '胡志明市':'新加坡','雅加达':'新加坡','金奈':'新加坡','墨尔本':'悉尼','南非':'孟买'};
    var OVP={};OVS.forEach(function(o){OVP[o[0]]=self.P(o[2],o[3])});
    OVS.forEach(function(o){var q=self.P(o[2],o[3]),from=(o[3]>25||o[2]<0||o[2]<60)?sh:hk,gw=GW[o[0]],g=gw&&OVP[gw];
      if(inside(q)){var trunk=!(g&&inside(g));if(trunk){arc(from,q,.2,'rt',true);arc(from,q,.2,'rt rt-glow',false);if(self.motion)arc(from,q,.2,'rt rt-ghost',true);el('circle',{cx:q[0],cy:q[1],r:9,'class':'gw-ring'},nodes)}else arc(g,q,.12,'rt rt-s',true);el('circle',{cx:q[0],cy:q[1],r:trunk?6:5.2,'class':'halo'},nodes);el('circle',{cx:q[0],cy:q[1],r:trunk?4.2:3.2,'class':'ov'},nodes);ovDots.push([q[0],q[1],trunk?9:6]);cands.push({x:q[0],y:q[1],r:trunk?9:6,t:o[0],pri:5,ov:1})}
      else (o[2]>=-30&&o[2]<100?west:east).push(o)});
    // 冗余干线：香港另有一条线路到洛杉矶、法兰克福（双枢纽、双路由）
    ['洛杉矶','法兰克福'].forEach(function(c){var q=OVP[c];if(q&&inside(q)){arc(hk,q,.26,'rt rt-alt',true)}});
    RTE.forEach(function(o){var q=self.P(o[2],o[3]);
      if(inside(q)){arc(hk,q,.2,'rt rtx',false);el('circle',{cx:q[0],cy:q[1],r:5.2,'class':'halo'},nodes);el('circle',{cx:q[0],cy:q[1],r:3.4,'class':'rq'},nodes);cands.push({x:q[0],y:q[1],r:5,t:o[0],pri:6})}
      else east.push(o)});
    [[west,10,'start','← '],[east,w-10,'end','']].forEach(function(gp,i){if(!gp[0].length)return;
      var y=22,a=i?sh:hk;arc(a,[gp[1],y+10],.22,'rt',true);
      var regs=[];gp[0].forEach(function(o){var rg=REGION[o[0]];if(regs.indexOf(L(rg))<0)regs.push(L(rg))});
      var txt=gp[3]+regs.join(' · ')+(i?' →':''),tw=TW(txt,12);
      edgeBoxes.push(i?[gp[1]-tw,y-13,gp[1],y+4]:[gp[1],y-13,gp[1]+tw,y+4]);
      var t=el('text',{x:gp[1],y:y,'class':'lb edge','text-anchor':gp[2]},labels);t.textContent=txt});
    arc(sh,hk,.28,'rt',true);
    // domestic nodes: uniform markers, merged when closer than the marker spacing
    var minD=narrow?8:9,kept=[];
    DOM.slice().sort(function(a,b){var la=DL.indexOf(a[0])>-1,lb=DL.indexOf(b[0])>-1;return (lb-la)||b[3]-a[3]})   // 要标名字的城市先占位，不会被邻近节点合并掉，各宽度、各语言一致
      .forEach(function(d){if(d[0]==='上海'||d[0]==='香港')return;var q=self.P(d[1],d[2]);
      for(var i=0;i<kept.length;i++){var k=kept[i];if(Math.hypot(k[0]-q[0],k[1]-q[1])<minD)return}
      if(Math.hypot(sh[0]-q[0],sh[1]-q[1])<minD+3||Math.hypot(hk[0]-q[0],hk[1]-q[1])<minD+3)return;
      kept.push(q);el('circle',{cx:q[0],cy:q[1],r:4.6,'class':'halo'},nodes);el('circle',{cx:q[0],cy:q[1],r:2.9,'class':'nd'},nodes);
      if(DL.indexOf(d[0])>-1)cands.push({x:q[0],y:q[1],r:4,t:d[0],pri:d[0]==='北京'?2:20+DL.indexOf(d[0]),dom:1})});
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
      cands.push({x:hb[0][0],y:hb[0][1],r:8,t:hb[1],pri:hb[1]==='上海'?-1:0,hub:1})});
    // labels: widths measured from the rendered font; a label never covers a dot, a hub ring or another label,
    // avoids crossing route lines, and in crowded areas moves outward with a thin leader line instead of disappearing.
    var placed=[],dropped=[],omitted=[];
    function ovl(b,q){return b[0]<q[2]&&b[2]>q[0]&&b[1]<q[3]&&b[3]>q[1]}
    // hub names may sit over the tiny domestic PoP dots (white halo keeps them legible); nothing else may
    var domBoxes=kept.map(function(q){return [q[0]-3,q[1]-3,q[0]+3,q[1]+3]});
    var lbls=[];   // 已放的文字框：两个名字之间至少留 4px，挨着枢纽名字留 10px，否则会连读成一个（如「香港 武汉」）
    function hit(b,hub){if(b[0]<4||b[1]<4||b[2]>w-4||b[3]>H-4)return true;for(var i=0;i<placed.length;i++)if(ovl(b,placed[i]))return true;for(i=0;i<lbls.length;i++){var g=lbls[i].hub||hub?10:4;if(ovl([b[0]-g,b[1]-2,b[2]+g,b[3]+2],lbls[i]))return true}if(!hub)for(i=0;i<domBoxes.length;i++)if(ovl(b,domBoxes[i]))return true;return false}
    [sh,hk].forEach(function(q){placed.push([q[0]-10,q[1]-10,q[0]+10,q[1]+10])});
    ovDots.forEach(function(q){placed.push([q[0]-q[2],q[1]-q[2],q[0]+q[2],q[1]+q[2]])});
    edgeBoxes.forEach(function(b){placed.push(b)});
    var G={},CS=16;
    function addPt(x,y){var k=Math.floor(x/CS)+','+Math.floor(y/CS);(G[k]=G[k]||[]).push([x,y])}
    [].forEach.call(routes.querySelectorAll('path:not(.rt-glow):not(.rt-ghost)'),function(pa){var len=pa.getTotalLength();for(var d=0;d<=len;d+=4){var pt=pa.getPointAtLength(d);addPt(pt.x,pt.y)}});
    [].forEach.call(routes.querySelectorAll('.mesh line'),function(l){var x1=+l.getAttribute('x1'),y1=+l.getAttribute('y1'),x2=+l.getAttribute('x2'),y2=+l.getAttribute('y2'),len=Math.hypot(x2-x1,y2-y1);for(var d=0;d<=len;d+=6)addPt(x1+(x2-x1)*d/len,y1+(y2-y1)*d/len)});
    function cross(b){var n=0;for(var gx=Math.floor(b[0]/CS);gx<=Math.floor(b[2]/CS);gx++)for(var gy=Math.floor(b[1]/CS);gy<=Math.floor(b[3]/CS);gy++){var a=G[gx+','+gy];if(a)for(var i=0;i<a.length;i++){var p0=a[i];if(p0[0]>b[0]-1&&p0[0]<b[2]+1&&p0[1]>b[1]-1&&p0[1]<b[3]+1)n++}}return n}
    var leaders=el('g',{'class':'ldrs'},svg);svg.insertBefore(leaders,labels);
    var probe=el('text',{'class':'lb',x:0,y:0},labels);
    function measure(t,hub){probe.setAttribute('class','lb'+(hub?' hubl':''));probe.textContent=t;var bb=probe.getBBox();return [bb.width,bb.height,-bb.y]}
    cands.forEach(function(c){c.dn=0;cands.forEach(function(d){if(d!==c&&Math.abs(d.x-c.x)<80&&Math.abs(d.y-c.y)<50)c.dn++})});
    cands.sort(function(a,b){return a.pri-b.pri||b.dn-a.dn});
    var ANG=[0,180,-90,90,-30,30,-150,150,-60,60,-120,120];
    var allDots=ovDots.map(function(q){return [q[0],q[1]]}).concat([sh,hk]).concat(kept.map(function(q){return [q[0],q[1]]}));
    function ambig(b,c,tol){var dOwn=boxDist(b,c.x,c.y);return allDots.some(function(q){return (q[0]!==c.x||q[1]!==c.y)&&boxDist(b,q[0],q[1])<dOwn-(tol||.5)})}
    function boxDist(b,x,y){var dx=Math.max(b[0]-x,0,x-b[2]),dy=Math.max(b[1]-y,0,y-b[3]);return Math.hypot(dx,dy)}
    cands.forEach(function(c){
      var lt=L(c.t),m=measure(lt,c.hub),W=m[0]+2,Hh=m[1],best=null;
      var radii=c.ov?[c.r+2,c.r+14,c.r+26,c.r+40]:c.dom&&c.t!=='北京'?[c.r+2,c.r+6]:[c.r+2,c.r+7,c.r+13];
      radii.forEach(function(r,ri){ANG.forEach(function(a,ai){
        var ca=Math.cos(a*Math.PI/180),sa=Math.sin(a*Math.PI/180),ax=c.x+r*ca,ay=c.y+r*sa;
        var x0=ca>.3?ax:ca<-.3?ax-W:ax-W/2,y0=sa>.3?ay:sa<-.3?ay-Hh:ay-Hh/2,b=[x0,y0,x0+W,y0+Hh];
        if(hit(b,c.hub))return;
        if(c.dom&&c.t!=='北京'&&(ambig(b,c,4)||cross(b)>6))return;   // 北京一定标   // 国内名字：会认错（别的点明显更近）或明显压线就不放这里
        var sc=(c.hub?ri*40+ai*2+cross(b)*3+domBoxes.filter(function(q){return ovl(b,q)}).length*40:ri*12+ai*1.5+cross(b)*5)+(ambig(b,c)?(c.hub?60:15):0)+(c.dom?ri*8:0);   // 离别的点比离自己的点还近 = 看不出标的是谁：枢纽重罚；城市会加引线，轻罚，同时不让它跑太远
        if(!best||sc<best.sc)best={b:b,sc:sc,ri:ri}})});
      if(!best){(c.dom?omitted:dropped).push(lt);return}
      var b=best.b;placed.push(b);b.hub=c.hub;lbls.push(b);
      // leader line when the label sits away from its dot, or when another city's dot is nearer to the label than its own
      var amb=ambig(best.b,c);
      if(c.ov&&(best.ri>0||amb)){var px=Math.max(b[0],Math.min(c.x,b[2])),py=Math.max(b[1],Math.min(c.y,b[3])),dx=px-c.x,dy=py-c.y,dd=Math.hypot(dx,dy)||1;
        el('line',{x1:(c.x+dx/dd*(c.r-2)).toFixed(1),y1:(c.y+dy/dd*(c.r-2)).toFixed(1),x2:px.toFixed(1),y2:py.toFixed(1),'class':'ldr'},leaders);
        for(var k=0;k<=dd;k+=4)addPt(c.x+dx*k/dd,c.y+dy*k/dd)}
      var t=el('text',{x:(b[0]+1).toFixed(1),y:(b[1]+m[2]).toFixed(1),'class':'lb'+(c.hub?' hubl':'')},labels);t.textContent=lt});
    labels.removeChild(probe);
    svg.setAttribute('data-dropped',dropped.join(','));svg.setAttribute('data-omitted',omitted.join(','));   // dropped = 海外城市或枢纽没放下（不允许）；omitted = 国内城市为美观省略（允许）
  };
  function init(){document.querySelectorAll('[data-showmap]').forEach(function(b){if(!b._s)b._s=new Show(b)})}
  if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
