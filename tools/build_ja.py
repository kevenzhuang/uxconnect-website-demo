# 用法：python3 tools/build_ja.py   从 en/*.html 生成 ja/*.html；英文改了就重跑，脚本会列出还没翻译的文字
# Build ja/*.html from en/*.html using ja_dict (T: text nodes, U: mixed elements, A: attributes)
import re, os, sys, glob
from bs4 import BeautifulSoup, NavigableString, Comment, Doctype
sys.path.insert(0, os.path.dirname(__file__))
from ja_dict import T, U, A, SV

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'
os.makedirs(ROOT + 'ja', exist_ok=True)
SKIP = {'script', 'style', 'svg'}
leftover = {}

for src in sorted(glob.glob(ROOT + 'en/*.html')):
    name = os.path.basename(src)
    raw = open(src, encoding='utf-8').read()
    raw = raw.replace('<html lang="en">', '<html lang="ja">', 1)
    # language switch
    raw = re.sub(r'<div class="lang" aria-label="Language">.*?</div>',
                 '<div class="lang" aria-label="言語"><a href="../%s" hreflang="zh-CN" lang="zh-CN">中</a><a href="../en/%s" hreflang="en" lang="en">EN</a><span aria-current="true">日</span></div>' % (name, name),
                 raw, count=1, flags=re.S)
    raw = re.sub(r'<link rel="alternate" hreflang="ja"[^>]*>\n?', '', raw)
    # alternates
    raw = raw.replace('<link rel="alternate" hreflang="en" href="%s">' % name,
                      '<link rel="alternate" hreflang="en" href="../en/%s">\n<link rel="alternate" hreflang="ja" href="%s">' % (name, name), 1)
    # Japanese pages do not use the Chinese heading subset
    raw = re.sub(r'<link rel="preload" href="../assets/fonts/heading-sc\.woff2[^>]*>\n?', '', raw)
    soup = BeautifulSoup(raw, 'html.parser')

    # U: mixed-content elements (outermost first)
    for el in soup.find_all(True):
        if el.name in SKIP or el.find_parent(SKIP):
            continue
        try:
            k = el.decode_contents().strip()
        except Exception:
            continue
        if k in U:
            el.clear()
            frag = BeautifulSoup(U[k], 'html.parser')
            for c in list(frag.contents):
                el.append(c)
    # T: text nodes
    for s in list(soup.find_all(string=True)):
        if isinstance(s, (Comment, Doctype)):
            continue
        if s.parent and (s.parent.name in SKIP or s.parent.find_parent(SKIP)):
            continue
        if s.parent and s.parent.name=='div' and 'eyebrow' in (s.parent.get('class') or []):
            continue
        txt = str(s)
        key = ' '.join(txt.split())
        if key in T:
            lead = txt[:len(txt) - len(txt.lstrip())]
            trail = txt[len(txt.rstrip()):]
            s.replace_with(NavigableString(lead + T[key] + trail))
        elif key and re.search('[A-Za-z]{3,}', key):
            leftover.setdefault(key, set()).add(name)
    for tx in soup.find_all('text'):
        k = tx.get_text().strip()
        if k in SV and tx.string is not None:
            tx.string.replace_with(SV[k])
    # A: attributes
    for el in soup.find_all(True):
        for a in ('alt', 'title', 'aria-label', 'placeholder', 'content', 'data-label'):
            v = el.get(a)
            if v and v in A:
                el[a] = A[v]
            elif v and v in T:
                el[a] = T[v]
    out = str(soup)
    # 和文の改行調整：本文中の SD-WAN・アジア太平洋は分割しない、長い業務名には改行位置を入れる（タグ内・head は対象外）
    head, sep, body = out.partition('<body')
    def fix(m):
        t = m.group(0)
        t = t.replace('SD-WAN', '<span class="nob">SD-WAN</span>')
        t = t.replace('アジア太平洋', '<span class="nob">アジア太平洋</span>')
        t = t.replace('法人インターネット接続', '法人インターネット<wbr>接続')
        return t
    body = re.sub(r'(?<=>)[^<>]+(?=<)', fix, body)
    body = body.replace('<span class="nob"><span class="nob">', '<span class="nob">').replace('</span></span><!--nob-->', '</span>')
    out = head + sep + body
    open(ROOT + 'ja/' + name, 'w', encoding='utf-8').write(out)

ALLOW = re.compile(r'^(uXconnect|SD-WAN|MPLS-VPN|ISO.*|IPLC.*|BGP|CPE-\d+|AS\d+|A2\.B1.*|GR\d+|GB/T.*|LEVEL \d|Services|Use Cases|Operations|Advantages|Architecture|Edge Devices|Global Footprint|Compliance|Case Studies|Trusted by|Our Story|About Us|Licenses & Certifications|Service Assurance|Offices|Solutions|Why Choose Us|Results|Proof of Concept|Headquarters|Branch|Japan|Pre-wired|Bandwidth on demand|On-site in 2 hours|Encrypted tunnels|Construction|Scroll|FAQ|Internet|Retail|Real Estate|Manufacturing|Education|Global|YouXun Industry \(HongKong\) Co\., Limited|.*@youxun\.com|Mega-i|Application-aware routing|Forward error correction|Zero-touch provisioning|Network visibility|Multi-WAN resilience|ENTERPRISE CONNECTIVITY EXPERTS|· SINCE 1996|WeCom.*)$')
miss = {k: v for k, v in leftover.items() if not ALLOW.match(k) and not re.search(r'[\u3040-\u30ff\u4e00-\u9fff]', k) and not re.match(r'^[\d.+ ]+(Mbps|Gbps)\+?$', k)}
for k, v in sorted(miss.items()):
    print(sorted(v), '|', k)
print('leftover', len(miss))
