(function(){
  // mobile menu
  var b=document.querySelector('.burger'),m=document.getElementById('mnav');
  if(b&&m)b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));m.hidden=o});
  // dropdown: click toggles for touch
  document.querySelectorAll('.nav .dd>button').forEach(function(btn){btn.addEventListener('click',function(e){var d=btn.parentNode;var o=d.classList.toggle('open');btn.setAttribute('aria-expanded',String(o));e.stopPropagation()})});
  document.addEventListener('click',function(){document.querySelectorAll('.nav .dd.open').forEach(function(d){d.classList.remove('open');d.querySelector('button').setAttribute('aria-expanded','false')})});
  // lightbox
  var lb=document.querySelector('dialog.lb');
  if(lb){var li=lb.querySelector('img');
    document.querySelectorAll('.cert .shot').forEach(function(s){s.addEventListener('click',function(){var im=s.querySelector('img');li.src=im.getAttribute('data-full')||im.src;li.alt=im.alt;try{lb.showModal()}catch(e){lb.setAttribute('open','')}})});
    lb.addEventListener('click',function(){if(lb.close)lb.close();else lb.removeAttribute('open')})}
  // copy
  document.querySelectorAll('.copy').forEach(function(c){c.addEventListener('click',function(){var t=c.getAttribute('data-c');try{navigator.clipboard.writeText(t).then(function(){c.textContent='已复制'},function(){c.textContent=t})}catch(e){c.textContent=t}})});
  // case filters
  var fb=document.querySelectorAll('.filters button');
  fb.forEach(function(btn){btn.addEventListener('click',function(){var f=btn.getAttribute('data-f');fb.forEach(function(x){x.setAttribute('aria-pressed',String(x===btn))});
    document.querySelectorAll('.case').forEach(function(c){c.hidden=!(f==='all'||(c.getAttribute('data-tags')||'').indexOf(f)>-1)})})});
  // trial form
  var f=document.querySelector('form.trial');
  if(f){
    var q=new URLSearchParams(location.search).get('biz');if(q){var r=f.querySelector('input[name=biz][value="'+q+'"]');if(r)r.checked=true}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var err=f.querySelector('.err'),ok=f.querySelector('.ok');err.hidden=true;
      var need=['company','name','tel'].filter(function(n){return !f.elements[n].value.trim()});
      if(need.length){err.textContent='请填写公司名称、联系人和手机号码。';err.hidden=false;f.elements[need[0]].focus();return}
      if(!/^[0-9+\-\s]{7,20}$/.test(f.elements.tel.value.trim())){err.textContent='手机号码格式不正确，请检查后重新填写。';err.hidden=false;f.elements.tel.focus();return}
      if(document.body.hasAttribute('data-preview')){ok.textContent='预览环境不会真实发送。正式上线后，申请将直接送达业务负责人邮箱。';ok.hidden=false;return}
      var btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='提交中…';
      fetch(f.getAttribute('action'),{method:'POST',body:new FormData(f)}).then(function(r){return r.json()}).then(function(j){
        if(j&&j.ok){f.reset();ok.textContent='提交成功。方案顾问将在一个工作日内与您联系。';ok.hidden=false;btn.textContent='已提交'}
        else throw 0}).catch(function(){btn.disabled=false;btn.textContent='提交试用申请';err.textContent='提交未成功，请稍后重试，或直接致电 021-52359911。';err.hidden=false})
    })}
})();
