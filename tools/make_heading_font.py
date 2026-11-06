#!/usr/bin/env python3
"""重新生成标题字体子集 assets/fonts/heading-sc.woff2。
扫描仓库内所有 HTML 的文字（不只是标题），保证标题里出现的任何字都在子集中，
避免个别字回退到系统字体造成粗细不一。用法：python3 tools/make_heading_font.py <NotoSansSC-Bold.otf>
"""
import sys,re,glob,html,subprocess,os
src=sys.argv[1]
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
chars=set()
for f in glob.glob(os.path.join(root,'*.html')):
    t=open(f,encoding='utf-8').read()
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S)
    t=html.unescape(re.sub(r'<[^>]+>','',t))
    chars.update(c for c in t if not c.isspace())
# 常用标点、数字、字母、符号兜底
chars.update('0123456789%+×·—–：，。、；！？（）「」《》/·&')
chars.update(chr(c) for c in range(0x20,0x7f))
txt=''.join(sorted(chars))
open('/tmp/_subset_chars.txt','w',encoding='utf-8').write(txt)
out=os.path.join(root,'assets/fonts/heading-sc.woff2')
subprocess.run(['pyftsubset',src,'--text-file=/tmp/_subset_chars.txt','--flavor=woff2','--layout-features=kern,liga','--no-hinting','--desubroutinize',f'--output-file={out}'],check=True)
print(len(chars),'chars ->',out,os.path.getsize(out)//1024,'KB')
