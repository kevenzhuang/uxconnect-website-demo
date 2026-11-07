// 用法：先在仓库根目录 python3 -m http.server 8792，再 node tools/audit_diagrams.js。输出示意图在各宽度下的实际字号，以及文字出画布、出方框、互相重叠、被线穿过的情况
// diagram check: rendered font sizes, text outside canvas, text overflowing its rect, text overlapping text or lines' boxes
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const w of [1440,1101,1024,800,761,390])for(const u of ['global.html','en/global.html','ja/global.html']){const p=await b.newPage({viewport:{width:w,height:900}});await p.goto('http://localhost:8792/'+u,{waitUntil:'networkidle'});
const r=await p.evaluate(()=>{const o=[];const sizes=new Set();document.querySelectorAll('.diag svg').forEach(sv=>{const R=sv.getBoundingClientRect();if(!R.width)return;const vb=sv.viewBox.baseVal;const sc=R.width/vb.width;const ts=[...sv.querySelectorAll('text')];
ts.forEach(t=>{sizes.add((parseFloat(getComputedStyle(t).fontSize)*sc).toFixed(1));const bb=t.getBBox();if(bb.x<-0.5||bb.x+bb.width>vb.width+0.5||bb.y<-0.5||bb.y+bb.height>vb.height+0.5)o.push('OUT:'+t.textContent);
sv.querySelectorAll('rect').forEach(rc=>{const q=rc.getBBox();const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;const inside=cx>q.x&&cx<q.x+q.width&&cy>q.y&&cy<q.y+q.height;if(inside&&(bb.x<q.x+6||bb.x+bb.width>q.x+q.width-6))o.push('TIGHT:'+t.textContent+' pad '+Math.round(Math.min(bb.x-q.x,q.x+q.width-bb.x-bb.width)));if(!inside){const ix=Math.min(bb.x+bb.width,q.x+q.width)-Math.max(bb.x,q.x),iy=Math.min(bb.y+bb.height,q.y+q.height)-Math.max(bb.y,q.y);if(ix>0&&iy>0)o.push('HIT-RECT:'+t.textContent)}});
ts.forEach(t2=>{if(t2===t)return;const c=t2.getBBox();const ix=Math.min(bb.x+bb.width,c.x+c.width)-Math.max(bb.x,c.x),iy=Math.min(bb.y+bb.height,c.y+c.height)-Math.max(bb.y,c.y);if(ix>0&&iy>0&&t.textContent<t2.textContent)o.push('TXT-OVERLAP:'+t.textContent+'/'+t2.textContent)});
// path crossing text: sample points along paths
sv.querySelectorAll('path').forEach(pa=>{const L=pa.getTotalLength();for(let k=0;k<=40;k++){const pt=pa.getPointAtLength(L*k/40);if(pt.x>bb.x+1&&pt.x<bb.x+bb.width-1&&pt.y>bb.y+1&&pt.y<bb.y+bb.height-1){o.push('LINE-THRU:'+t.textContent);break}}})})});return {o:[...new Set(o)],sizes:[...sizes].sort()}});
const sx=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
console.log(w,u,'sizes',r.sizes.join(','),sx?'SCROLLX':'',r.o.join(' | '));await p.close()}
await b.close()})();
