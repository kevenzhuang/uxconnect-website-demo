# 生成跨境网络页「典型组网方式」两张示意图（电脑横版 + 手机竖版），中英文各一套，写入页面。
# 用法：python3 tools/make_diagrams.py   之后运行 python3 tools/build_ja.py 生成日文页
# 线条语言见 DESIGN.md「示意图」：虚线亮蓝框 = 友讯网络（PoP、CPE），亮蓝实线 = 经友讯网络，灰虚线 = 不经友讯。
import re, os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'

L = {
 'zh': dict(
  h='典型组网方式', lede='每个方案都按站点分布和业务需求定制，下面是两种常见结构。',
  key_core='友讯 PoP 与设备', key_g='国际流量：友讯跨境通道', key_d='国内流量：本地直接上网',
  d1_title='多地汇聚', d1_cap='<span class="nw">多地站点经国际专线汇聚至香港，</span><span class="nw">再统一连接海外站点</span>',
  sh='上海站点', bj='北京站点', se='首尔站点', hk='香港 PoP', hk_s='汇聚与交换', sg='新加坡站点', line='IPLC · IEPL',
  d2_title='智能分流', d2_cap='<span class="nw">国内流量就近走本地出口，</span><span class="nw">国际流量经友讯网络直达海外</span>',
  site='企业站点', cpe='SD-WAN CPE', local='本地互联网出口', local_s='友讯宽带或现有线路', dom='国内互联网', pop='国内 PoP', hkp='香港 PoP', ovs='海外互联网', ovs_s='SaaS · 云服务',
  dl='国内流量', il='国际流量',
 ),
 'en': dict(
  h='How it connects', lede='Every solution is designed around your sites and applications. Two common designs:',
  key_core='uXconnect PoPs and devices', key_g='International: uXconnect cross-border path', key_d='Domestic: local internet breakout',
  d1_title='Multi-site aggregation', d1_cap='Sites in several cities aggregate in Hong Kong over international private lines, then reach overseas sites',
  sh='Shanghai site', bj='Beijing site', se='Seoul site', hk='Hong Kong PoP', hk_s='Aggregation hub', sg='Singapore site', line='IPLC · IEPL',
  d2_title='Split routing', d2_cap='Domestic traffic breaks out locally; international traffic rides our network straight overseas',
  site='Your site', cpe='SD-WAN CPE', local='Local breakout', local_s='Ours or existing line', dom='China internet', pop='China PoP', hkp='Hong Kong PoP', ovs='Internet', ovs_s='Global SaaS',
  dl='Domestic', il='International',
 ),
}

def plain(x):
    return re.sub(r'<[^>]+>', '', x)

def box(x, y, w, h, t, s=None, cls='box'):
    """普通方框，文字居中。"""
    o = '<rect class="%s" x="%d" y="%d" width="%d" height="%d" rx="8"/>' % (cls, x, y, w, h)
    cx = x + w / 2
    if s:
        o += '<text x="%g" y="%g" text-anchor="middle">%s</text><text class="s" x="%g" y="%g" text-anchor="middle">%s</text>' % (cx, y + h / 2 - 4, t, cx, y + h / 2 + 15, s)
    else:
        o += '<text x="%g" y="%g" text-anchor="middle">%s</text>' % (cx, y + h / 2 + 5, t)
    return o

def core(x, y, w, h, t, s=None):
    """友讯网络（PoP、CPE）：亮蓝虚线框，名称中蓝加粗。"""
    o = '<rect class="core" x="%d" y="%d" width="%d" height="%d" rx="10"/>' % (x, y, w, h)
    cx = x + w / 2
    if s:
        o += '<text class="t" x="%g" y="%g" text-anchor="middle">%s</text><text class="s" x="%g" y="%g" text-anchor="middle">%s</text>' % (cx, y + h / 2 - 3, t, cx, y + h / 2 + 16, s)
    else:
        o += '<text class="t" x="%g" y="%g" text-anchor="middle">%s</text>' % (cx, y + h / 2 + 5, t)
    return o

def dot(x, y, r=4):
    return '<circle class="pp" cx="%d" cy="%d" r="%d"/>' % (x, y, r)

def lab(x, y, t, anchor='middle'):
    return '<text class="s" x="%d" y="%d" text-anchor="%s">%s</text>' % (x, y, anchor, t)

# 电脑 / 平板版：画布 720 宽，按 1:1 显示（方框文字 14，标注 12）
def d1(t):
    o = '<svg class="dv-d" viewBox="0 0 720 208" role="img" aria-label="%s">' % plain(t['d1_cap'])
    for y, k in zip((0, 82, 164), ('sh', 'bj', 'se')):
        o += box(0, y, 140, 44, t[k])
        o += '<path class="ln g" d="M140 %d C200 %d 196 104 250 104"/>' % (y + 22, y + 22)
    o += core(250, 66, 180, 76, t['hk'], t['hk_s']) + dot(250, 104) + dot(430, 104)
    o += lab(195, 76, t['line'], 'end')
    o += '<path class="ln g" d="M430 104 L560 104"/>' + lab(495, 94, t['line'])
    o += box(560, 82, 160, 44, t['sg'])
    return o + '</svg>'

def d2(t):
    o = '<svg class="dv-d" viewBox="0 0 720 242" role="img" aria-label="%s">' % plain(t['d2_cap'])
    o += '<rect class="box" x="0" y="68" width="150" height="112" rx="8"/><text x="75" y="96" text-anchor="middle">%s</text>' % t['site']
    o += core(12, 116, 126, 48, t['cpe'])
    # 国内：灰虚线，本地直接上网（可以是友讯宽带，也可以是客户现有线路）
    o += '<path class="ln d" d="M75 68 V44 Q75 26 93 26 H220"/>' + lab(148, 18, t['dl'])
    o += box(220, 0, 160, 52, t['local'], t['local_s']) + '<path class="ln d" d="M380 26 L560 26"/>' + box(560, 4, 160, 44, t['dom'])
    # 国际：亮蓝实线，经友讯国内 PoP、香港 PoP 出海
    o += '<path class="ln g" d="M75 180 V196 Q75 214 93 214 H220"/>' + lab(148, 206, t['il'])
    o += core(220, 192, 130, 44, t['pop']) + '<path class="ln g" d="M350 214 L380 214"/>'
    o += core(380, 192, 150, 44, t['hkp']) + '<path class="ln g" d="M530 214 L560 214"/>'
    o += box(560, 187, 160, 54, t['ovs'], t['ovs_s'])
    o += dot(220, 214) + dot(380, 214) + dot(560, 214)
    return o + '</svg>'

# 手机版：画布 320 宽，竖向
def d1m(t):
    o = '<svg class="dv-m" viewBox="0 0 320 300" role="img" aria-label="%s">' % plain(t['d1_cap'])
    for y, k in zip((0, 64, 128), ('sh', 'bj', 'se')):
        o += box(0, y, 124, 44, t[k])
        o += '<path class="ln g" d="M124 %d C152 %d 142 86 166 86"/>' % (y + 22, y + 22)
    o += core(166, 48, 154, 76, t['hk'], t['hk_s']) + dot(166, 86) + dot(243, 124)
    o += '<path class="ln g" d="M243 124 L243 236"/>' + lab(234, 184, t['line'], 'end')
    o += box(166, 236, 154, 44, t['sg'])
    return o + '</svg>'

def d2m(t):
    o = '<svg class="dv-m" viewBox="0 0 320 356" role="img" aria-label="%s">' % plain(t['d2_cap'])
    o += '<rect class="box" x="70" y="0" width="180" height="96" rx="8"/><text x="160" y="26" text-anchor="middle">%s</text>' % t['site']
    o += core(88, 40, 144, 44, t['cpe'])
    o += '<path class="ln d" d="M120 96 C120 120 75 116 75 144"/><path class="ln g" d="M200 96 C200 120 245 116 245 144"/>'
    o += lab(86, 122, t['dl'], 'end') + lab(234, 122, t['il'], 'start')
    o += box(0, 144, 150, 52, t['local'], t['local_s']) + '<path class="ln d" d="M75 196 L75 216"/>' + box(0, 216, 150, 44, t['dom'])
    o += core(170, 144, 150, 44, t['pop']) + '<path class="ln g" d="M245 188 L245 216"/>'
    o += core(170, 216, 150, 44, t['hkp']) + '<path class="ln g" d="M245 260 L245 288"/>'
    o += box(170, 288, 150, 56, t['ovs'], t['ovs_s'])
    o += dot(245, 144) + dot(245, 216) + dot(245, 288)
    return o + '</svg>'

def key(t):
    return ('<div class="diag-key"><span><i class="k-core"></i>%s</span><span><i class="k-g"></i>%s</span>'
            '<span><i class="k-d"></i>%s</span></div>') % (t['key_core'], t['key_g'], t['key_d'])

def apply(f, lang):
    t = L[lang]
    s = open(ROOT + f, encoding='utf-8').read()
    s = re.sub(r'\s*<!--diag:[a-z0-9]+-->.*?<!--/diag-->', '', s, flags=re.S)
    block = ('\n    <!--diag:global--><h3 class="sub-h diag-h">%s</h3><p class="lede diag-lede">%s</p><div class="diag-grid">'
             '<figure class="diag"><figcaption><b>%s</b><span>%s</span></figcaption>%s</figure>'
             '<figure class="diag"><figcaption><b>%s</b><span>%s</span></figcaption>%s</figure></div>%s<!--/diag-->') % (
        t['h'], t['lede'], t['d1_title'], t['d1_cap'], d1(t) + d1m(t), t['d2_title'], t['d2_cap'], d2(t) + d2m(t), key(t))
    i = s.find('<div class="grid3 svc6 svc3">')
    k = s.find('\n  </div>\n</section>', i)   # 服务区 .wrap 结束前
    s = s[:k] + block + s[k:]
    open(ROOT + f, 'w', encoding='utf-8').write(s)

for f, lang in (('global.html', 'zh'), ('en/global.html', 'en')):
    apply(f, lang)

print('ok')
