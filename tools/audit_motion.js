// 动效核对：每页每个元素的过渡与动画，按 DESIGN.md 第 9 节检查
// 用法：先在仓库根目录 python3 -m http.server 8792，再 node tools/audit_motion.js
const { chromium } = require('playwright');
const B = 'http://localhost:8792/';
const pages = ['index','access','sdwan','global','cloud','more','cases','about','contact','privacy'];
const files = [].concat(...pages.map(p => [p + '.html', 'en/' + p + '.html', 'ja/' + p + '.html']));
const AMBIENT = ['mq', 'hd', 'ping'];        // 允许的氛围动效（循环）
(async () => {
  const br = await chromium.launch(); let bad = 0;
  for (const [w, touch] of [[1440, false], [390, true]]) {
    const ctx = await br.newContext({ viewport: { width: w, height: 900 }, hasTouch: touch, isMobile: touch });
    for (const f of files) {
      const pg = await ctx.newPage(); await pg.goto(B + f, { waitUntil: 'load' });
      const r = await pg.evaluate((AMB) => {
        const sec = v => v.split(',').map(x => parseFloat(x) * (x.trim().endsWith('ms') ? .001 : 1));
        const out = new Set();
        const check = (el, pseudo) => {
          const cs = getComputedStyle(el, pseudo); const tag = (el.className && el.className.baseVal === undefined ? el.className : el.tagName) + (pseudo || '');
          const td = sec(cs.transitionDuration), tp = cs.transitionProperty, tf = cs.transitionTimingFunction;
          td.forEach(d => { if (d > 0.6001) out.add('transition ' + d + 's ' + tag); });
          if (td.some(d => d > 0) && tp === 'all') out.add('transition:all ' + tag);
          if (td.some(d => d > 0 && d <= .2) && /(^|, )ease(,|$)|linear/.test(tf)) out.add('feedback easing ' + tf + ' ' + tag);
          const names = cs.animationName.split(',').map(x => x.trim());
          sec(cs.animationDuration).forEach((d, i) => { const n = names[i] || names[0]; if (n !== 'none' && !AMB.includes(n) && d > 0.6001) out.add('animation ' + n + ' ' + d + 's ' + tag); });
        };
        document.querySelectorAll('*').forEach(el => { check(el); check(el, '::before'); check(el, '::after'); });
        return [...out];
      }, AMBIENT);
      // 减少动效：所有动画与过渡必须为 0（氛围循环也停）
      await pg.emulateMedia({ reducedMotion: 'reduce' });
      const rm = await pg.evaluate(() => { let n = 0; document.querySelectorAll('*').forEach(el => { const c = getComputedStyle(el); if (c.animationName !== 'none' && parseFloat(c.animationDuration) > 0.011) n++; }); return n; });
      if (r.length || rm) { bad++; console.log(w, f, r.slice(0, 8), rm ? 'reduced-motion still animating: ' + rm : ''); }
      await pg.close();
    }
    await ctx.close();
  }
  console.log(bad ? bad + ' page(s) with issues' : 'all clean'); await br.close();
})();
