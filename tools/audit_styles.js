const {chromium}=require('playwright');
const pages=['index','access','sdwan','global','cloud','more','cases','about','contact','privacy'];
(async()=>{const b=await chromium.launch();const W=+process.argv[2]||1440;
const font={},color={},bg={},border={},radius={},misc=[];
for(const pre of ['','en/'])for(const pg of pages){const p=await b.newPage({viewport:{width:W,height:900}});await p.goto('http://localhost:8792/'+pre+pg+'.html',{waitUntil:'networkidle'});
const r=await p.evaluate(()=>{const out={t:[],c:[],bg:[],bd:[],rad:[],misc:[]};
const name=e=>{let s=e.tagName.toLowerCase();if(e.className&&typeof e.className=='string')s+='.'+e.className.trim().split(/\s+/).slice(0,2).join('.');const sec=e.closest('section,header,footer,nav');return (sec?(sec.tagName.toLowerCase()+(sec.className?'.'+String(sec.className).split(' ')[0]:'')+'>'):'')+s};
for(const e of document.querySelectorAll('body *')){const cs=getComputedStyle(e);if(cs.display=='none'||cs.visibility=='hidden')continue;const rc=e.getBoundingClientRect();if(rc.width==0||rc.height==0)continue;if(e.closest('svg'))continue;
 const own=[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim());
 if(own){const fam=/heading|Noto Sans SC Heading|HeadingSC/i.test(cs.fontFamily)?'H':'B';out.t.push([cs.fontSize+'/'+cs.fontWeight+'/'+fam,name(e),e.textContent.trim().slice(0,20)]);out.c.push([cs.color,name(e)]);}
 if(cs.backgroundColor!='rgba(0, 0, 0, 0)')out.bg.push([cs.backgroundColor,name(e)]);
 for(const s of ['Top','Right','Bottom','Left'])if(parseFloat(cs['border'+s+'Width'])>0&&cs['border'+s+'Style']!='none')out.bd.push([cs['border'+s+'Color'],name(e)]);
 if(cs.borderTopLeftRadius!='0px')out.rad.push([cs.borderTopLeftRadius,name(e)]);
}
return out});
const tag=pre+pg;
for(const [k,n,t] of r.t){(font[k]=font[k]||new Map()).set(n,(tag+' '+t))}
for(const [k,n] of r.c){(color[k]=color[k]||new Map()).set(n,tag)}
for(const [k,n] of r.bg){(bg[k]=bg[k]||new Map()).set(n,tag)}
for(const [k,n] of r.bd){(border[k]=border[k]||new Map()).set(n,tag)}
for(const [k,n] of r.rad){(radius[k]=radius[k]||new Map()).set(n,tag)}
await p.close()}
const dump=(t,o,n)=>{console.log('\n#### '+t);for(const [k,m] of Object.entries(o).sort())console.log(k.padEnd(26),m.size,[...m.entries()].slice(0,n).map(([a,b])=>a+' @'+b).join(' ; '))};
dump('FONT size/weight/family',font,3);dump('TEXT COLOR',color,3);dump('BG',bg,3);dump('BORDER',border,3);dump('RADIUS',radius,3);
await b.close()})();
