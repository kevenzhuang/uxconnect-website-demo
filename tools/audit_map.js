// 用法：先在仓库根目录 python3 -m http.server 8792，再 node tools/audit_map.js。输出每个宽度 / 语言下被省略的城市名、标签互相重叠、标签压在点上；LINE-UNDER 只是提示（标签有白色描边，可接受）
// map check: dropped labels, label/label overlap, label over dot, label crossing route lines
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const w of [1440,1280,1101,1024,820,390])for(const u of ['index.html','global.html','about.html','en/index.html','en/global.html','ja/global.html','ja/index.html']){const p=await b.newPage({viewport:{width:w,height:900}});const e=[];p.on('pageerror',x=>e.push(x.message));await p.goto('http://localhost:8792/'+u,{waitUntil:'networkidle'});await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const out=[];document.querySelectorAll('.sm-svg').forEach(sv=>{const dr=sv.getAttribute('data-dropped');if(dr)out.push('DROPPED:'+dr);
const ts=[...sv.querySelectorAll('text.lb:not(.edge)')].map(t=>{const b=t.getBBox();return {t:t.textContent,b:[b.x,b.y,b.x+b.width,b.y+b.height]}});
const ov=(a,q)=>a[0]<q[2]-.5&&a[2]>q[0]+.5&&a[1]<q[3]-.5&&a[3]>q[1]+.5;
ts.forEach((a,i)=>ts.forEach((c,j)=>{if(i<j&&ov(a.b,c.b))out.push('LBL-OVERLAP:'+a.t+'/'+c.t)}));
sv.querySelectorAll('circle.ov,circle.hub,circle.nd').forEach(c=>{const x=+c.getAttribute('cx'),y=+c.getAttribute('cy'),r=+c.getAttribute('r');ts.forEach(a=>{if(ov(a.b,[x-r,y-r,x+r,y+r]))out.push('LBL-ON-DOT:'+a.t)})});
let n=0;const lines=[];sv.querySelectorAll('path.rt:not(.rt-glow):not(.rt-ghost),path.rt-d').forEach(pa=>{const L=pa.getTotalLength();for(let d=0;d<=L;d+=3){const pt=pa.getPointAtLength(d);ts.forEach(a=>{if(pt.x>a.b[0]+1&&pt.x<a.b[2]-1&&pt.y>a.b[1]+1&&pt.y<a.b[3]-1)lines.push(a.t)})}});
const cnt={};lines.forEach(t=>cnt[t]=(cnt[t]||0)+1);Object.keys(cnt).forEach(k=>out.push('LINE-UNDER:'+k));
out.push('labels='+ts.length)});return out});
console.log(w,u,e,r.join(' | '));await p.close()}
await b.close()})();
