// 弹窗关闭：0.2 秒淡出后再真正关闭，和打开对称
function closeDlg(d){if(d.classList.contains('closing'))return;d.classList.add('closing');setTimeout(function(){d.classList.remove('closing');if(d.close)d.close();else d.removeAttribute('open')},matchMedia('(prefers-reduced-motion: reduce)').matches?0:200)}
(function(){
  var EN=/^en/i.test(document.documentElement.lang);
  var JA=/^ja/i.test(document.documentElement.lang);
  var T=JA?{copied:'コピーしました',need:'会社名、ご担当者名、電話番号をご入力ください。',tel:'電話番号の形式をご確認ください。',mail:'メールアドレスの形式をご確認ください。',preview:'プレビュー環境のため送信されません。公開後は担当者に直接届きます。',sending:'送信中…',ok:'送信が完了しました。1 営業日以内に担当コンサルタントからご連絡します。',sent:'送信済み',submit:'送信する',fail:'送信できませんでした。時間をおいて再度お試しいただくか、+86 21 5235 9911 までお電話ください。'}:EN?{copied:'Copied',need:'Please enter your company, name and phone number.',tel:'Please check the phone number format.',mail:'Please check the email address.',preview:'Preview only — nothing was sent. Once live, your request goes straight to our team.',sending:'Sending…',ok:'Thank you. A solutions consultant will contact you within one business day.',sent:'Sent',submit:'Submit request',fail:'Something went wrong. Please try again or call +86 21 5235 9911.'}:{copied:'已复制',need:'请填写公司名称、联系人和手机号码。',tel:'手机号码格式不正确，请检查后重新填写。',mail:'邮箱格式不正确，请检查后重新填写。',preview:'预览环境不会真实发送。正式上线后，申请将直接送达业务负责人邮箱。',sending:'提交中…',ok:'提交成功。方案顾问将在一个工作日内与您联系。',sent:'已提交',submit:'提交咨询申请',fail:'提交未成功，请稍后重试，或直接致电 021-52359911。'};
  // mobile menu
  var b=document.querySelector('.burger'),m=document.getElementById('mnav');
  var RM=matchMedia('(prefers-reduced-motion: reduce)');
  var sc=null,mt=0;function setMenu(open){b.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);clearTimeout(mt);
    if(open){m.classList.remove('closing');m.hidden=false;if(sc)sc.classList.remove('closing');else{sc=document.createElement('div');sc.className='mnav-scrim';sc.addEventListener('click',function(){setMenu(false)});document.body.appendChild(sc)}}
    else if(!m.hidden){m.classList.add('closing');if(sc)sc.classList.add('closing');   // 收起也有 0.2 秒淡出，和打开对称；收起途中再打开会接着用同一层遮罩
      mt=setTimeout(function(){m.hidden=true;m.classList.remove('closing');if(sc){sc.remove();sc=null}},RM.matches?0:200)}}
  if(b&&m){b.addEventListener('click',function(){setMenu(b.getAttribute('aria-expanded')!=='true')});m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&b.getAttribute('aria-expanded')==='true')setMenu(false)})}
  // dropdown: click toggles for touch
  document.querySelectorAll('.nav .dd>button').forEach(function(btn){btn.addEventListener('click',function(e){var d=btn.parentNode;var o=d.classList.toggle('open');btn.setAttribute('aria-expanded',String(o));e.stopPropagation()})});
  document.addEventListener('click',function(){document.querySelectorAll('.nav .dd.open').forEach(function(d){d.classList.remove('open');d.querySelector('button').setAttribute('aria-expanded','false')})});
  // lightbox
  var lb=document.querySelector('dialog.lb');
  if(lb){var li=lb.querySelector('img');
    document.querySelectorAll('.cert .shot, .rz-shots .shot').forEach(function(s){s.addEventListener('click',function(){var im=s.querySelector('img');li.src=im.getAttribute('data-full')||im.src;li.alt=im.alt;try{lb.showModal()}catch(e){lb.setAttribute('open','')}})});
    lb.addEventListener('click',function(){closeDlg(lb)})}
  // copy
  document.querySelectorAll('.copy').forEach(function(c){var c0=c.textContent,ct=0;c.addEventListener('click',function(){var t=c.getAttribute('data-c');clearTimeout(ct);function back(){ct=setTimeout(function(){c.textContent=c0},2000)}try{navigator.clipboard.writeText(t).then(function(){c.textContent=T.copied;back()},function(){c.textContent=t})}catch(e){c.textContent=t}})});
  // case filters
  var fb=document.querySelectorAll('.filters button');
  fb.forEach(function(btn){btn.addEventListener('click',function(){var f=btn.getAttribute('data-f');fb.forEach(function(x){x.setAttribute('aria-pressed',String(x===btn))});
    document.querySelectorAll('.case').forEach(function(c){var show=f==='all'||(c.getAttribute('data-tags')||'').indexOf(f)>-1;c.hidden=!show;if(show){c.classList.remove('fi');void c.offsetWidth;c.classList.add('fi')}})})});
  var qf=new URLSearchParams(location.search).get('f');if(qf){var qb=document.querySelector('.filters button[data-f="'+qf+'"]');if(qb)setTimeout(function(){qb.click()},0)}
  // header button on the contact page: jump to the form and focus the first empty field
  document.querySelectorAll('a[href="#consult"]').forEach(function(a){a.addEventListener('click',function(e){var fm=document.getElementById('consult');if(!fm)return;e.preventDefault();fm.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});var el=fm.querySelector('input[name=company]');if(el)setTimeout(function(){el.focus({preventScroll:true})},400)})});
  // trial form
  var f=document.querySelector('form.trial');
  if(f){
    var q=new URLSearchParams(location.search).get('biz');if(q){var r=f.querySelector('input[name=biz][value="'+q+'"]');if(r)r.checked=true}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var err=f.querySelector('.err'),ok=f.querySelector('.ok');err.hidden=true;
      var need=['company','name','tel'].filter(function(n){return !f.elements[n].value.trim()});
      if(need.length){err.textContent=T.need;err.hidden=false;f.elements[need[0]].focus();return}
      if(!/^[0-9+\-\s()]{7,20}$/.test(f.elements.tel.value.trim())){err.textContent=T.tel;err.hidden=false;f.elements.tel.focus();return}
      var em=f.elements.email;if(em&&em.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())){err.textContent=T.mail;err.hidden=false;em.focus();return}
      if(document.body.hasAttribute('data-preview')||/github\.io$|claude|localhost|^127\./.test(location.hostname)){ok.textContent=T.preview;ok.hidden=false;return}
      var btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.textContent=T.sending;
      fetch(f.getAttribute('action'),{method:'POST',body:new FormData(f)}).then(function(r){return r.json()}).then(function(j){
        if(j&&j.ok){f.reset();ok.textContent=T.ok;ok.hidden=false;btn.textContent=T.sent}
        else throw 0}).catch(function(){btn.disabled=false;btn.textContent=T.submit;err.textContent=T.fail;err.hidden=false})
    })}
})();
(function(){var d=document.querySelector('dialog.wecom');if(!d)return;
document.querySelectorAll('[data-wecom]').forEach(function(b){b.addEventListener('click',function(){try{d.showModal()}catch(e){d.setAttribute('open','')}})});
d.addEventListener('click',function(e){if(e.target===d||e.target.tagName==='BUTTON')closeDlg(d)})})();
(function(){
  var d=document.documentElement;d.classList.add('js');
  var hdr=document.querySelector('.site-header');
  function sc(){if(hdr)hdr.classList.toggle('scrolled',scrollY>8)}addEventListener('scroll',sc,{passive:true});sc();
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 滚动渐入：板块标题、简介、卡片组逐个出现
  var sel=['main section:not(.hero)>.wrap>.eyebrow','main section:not(.hero)>.wrap>h2','main section:not(.hero)>.wrap>.lede','.grid3>*','.feats>*','.quotes>*','.certs>*','.stats .stat','.band .wrap','.badges>figure','.net-head','.partners .pt-title','.rz-cat','.offices>*','.tl>*','.specs>*'];
  var els=[];sel.forEach(function(s){document.querySelectorAll(s).forEach(function(e){if(els.indexOf(e)<0)els.push(e)})});
  els.forEach(function(e){var p=e.parentNode,i=Array.prototype.indexOf.call(p.children,e);e.classList.add('rv');if(/grid3|feats|quotes|certs|stats|badges|offices|rz-cats/.test(p.className))e.classList.add('rv-d'+Math.min(i%6,5))});
  // 板块里其余的内容块（服务列表、常见问题、示意图、地图、案例、表单等）整块渐入，不让标题动、正文不动
  document.querySelectorAll('main section:not(.hero):not(.page-hero)>.wrap>*').forEach(function(e){if(e.classList.contains('rv')||e.querySelector('.rv')||e.closest('.rv'))return;e.classList.add('rv');els.push(e)});
  // 标题下的金色短线：随标题出现，从 0 展开到 36，所有页面一致
  var lns=[];document.querySelectorAll('main h1,main h2,main h3').forEach(function(h){var c=getComputedStyle(h,'::after');if(c.content!=='none'&&c.display!=='none'&&parseFloat(c.height)===3){h.classList.add('lnr');lns.push(h)}});
  // 文字链接与按钮末尾的箭头：包一层，悬停时右移 3px
  document.querySelectorAll('.link.go,.menu-more,.btn').forEach(function(a){var t=a.lastChild;if(t&&t.nodeType===3&&/\s?→\s*$/.test(t.nodeValue)){t.nodeValue=t.nodeValue.replace(/\s?→\s*$/,' ');var i=document.createElement('span');i.className='arr';i.setAttribute('aria-hidden','true');i.textContent='→';a.appendChild(i)}});
  // 数字滚动
  function count(b){var t=b.firstChild;if(!t||t.nodeType!==3)return;var raw=t.nodeValue,m=raw.match(/[\d,.]+/);if(!m)return;var s=m[0],dec=(s.split('.')[1]||'').length,end=parseFloat(s.replace(/,/g,'')),start=end>=1900&&end<=2100?end-30:0,t0=null,dur=1000;
    function f(ts){if(!t0)t0=ts;var k=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-k,3),v=start+(end-start)*e;var out=dec?v.toFixed(dec):Math.round(v).toString();if(/,/.test(s))out=out.replace(/\B(?=(\d{3})+(?!\d))/g,',');t.nodeValue=raw.replace(s,out);if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
  if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});lns.forEach(function(h){h.classList.add('lni')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var e=en.target;e.classList.add('in');if(e.classList.contains('stat')){var b=e.querySelector('b');if(b&&!b.dataset.c){b.dataset.c=1;count(b)}}io.unobserve(e)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});   // threshold 0：很高的内容块（案例列表、隐私政策）也能触发
  els.forEach(function(e){io.observe(e)});
  var lo=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var h=en.target;lo.unobserve(h);requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('lni')})})}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
  lns.forEach(function(h){lo.observe(h)});
})();
