const {chromium}=require('playwright');
const pages=['index','access','sdwan','global','cloud','more','cases','about','contact','privacy'];
(async()=>{const b=await chromium.launch();const W=+process.argv[2]||1440;const agg={};
const add=(k,v,w)=>{(agg[k]=agg[k]||{});(agg[k][v]=agg[k][v]||new Set()).add(w)};
for(const pre of ['','en/','ja/'])for(const pg of pages){const p=await b.newPage({viewport:{width:W,height:900}});await p.goto('http://localhost:8792/'+pre+pg+'.html',{waitUntil:'networkidle'});
await p.addStyleTag({content:'*{transition:none!important;animation:none!important}.rv,[class*=rv]{opacity:1!important;transform:none!important}'});
const r=await p.evaluate(()=>{const o=[];
document.querySelectorAll('main > section, body > section').forEach(s=>{const cs=getComputedStyle(s);const c=s.className.split(' ')[0]||'plain';o.push(['sec-pad '+c,cs.paddingTop+'/'+cs.paddingBottom]);
 const h2=s.querySelector(':scope > .wrap > h2, :scope > .wrap > div > h2');if(h2){const n=h2.nextElementSibling;if(n){const d=Math.round(n.getBoundingClientRect().top-h2.getBoundingClientRect().bottom);o.push(['h2->'+(n.className||n.tagName).split(' ')[0],d])}
  const l=s.querySelector(':scope > .wrap > .lede');if(l&&l.nextElementSibling){const n2=l.nextElementSibling;o.push(['lede->'+(n2.className||n2.tagName).split(' ')[0],Math.round(n2.getBoundingClientRect().top-l.getBoundingClientRect().bottom)])}}
});
document.querySelectorAll('main .card').forEach(c=>{const cs=getComputedStyle(c);o.push(['card-pad',cs.paddingTop+' '+cs.paddingLeft])});
document.querySelectorAll('main [class*=grid]').forEach(g=>{const cs=getComputedStyle(g);if(cs.display=='grid')o.push(['grid-gap '+g.className.split(' ')[0],cs.rowGap+'/'+cs.columnGap])});
return o});
for(const [k,v] of r)add(k,v,pre+pg);await p.close()}
for(const [k,o] of Object.entries(agg).sort())console.log(k.padEnd(28),Object.entries(o).map(([v,s])=>v+' ['+[...s].slice(0,4).join(',')+(s.size>4?'…'+s.size:'')+']').join('  |  '));
await b.close()})();
