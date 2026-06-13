#!/usr/bin/env python3
"""
SCSF WordPress XML → Sanity NDJSON exporter
--------------------------------------------
Reads the WP XML export and writes Sanity-importable NDJSON to stdout.

Usage:
  python3 scripts/extract-wp-posts.py /path/to/export.xml > wp-posts.ndjson
  bunx sanity@latest dataset import wp-posts.ndjson production --replace

Gets ALL 113 posts including the 107 "archived" ones the REST API couldn't reach.
"""

import sys, json, re, hashlib
import xml.etree.ElementTree as ET

XML_FILE = sys.argv[1] if len(sys.argv) > 1 else 'theskatingclubofsanfrancisco.WordPress.2026-06-13.xml'

NS = {
    'wp':      'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    'dc':      'http://purl.org/dc/elements/1.1/',
}

def get(el, tag):
    """Safe element text getter — avoids the Python ET falsy element trap."""
    found = el.find(tag, NS)
    return found.text if found is not None else None

def strip_html(html):
    if not html: return ''
    html = re.sub(r'</p>', '\n\n', html, flags=re.I)
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.I)
    html = re.sub(r'<[^>]+>', '', html)
    for ent, rep in [('&nbsp;',' '),('&amp;','&'),('&lt;','<'),('&gt;','>'),
                     ('&quot;','"'),('&#8220;','"'),('&#8221;','"'),
                     ('&#8216;',"'"),('&#8217;',"'"),('&#038;','&')]:
        html = html.replace(ent, rep)
    return re.sub(r'\n{3,}', '\n\n', html).strip()

def html_to_portable_text(html):
    if not html: return []
    text = strip_html(html)
    blocks = []
    for i, para in enumerate(re.split(r'\n{2,}', text)):
        para = para.strip()
        if not para: continue
        key  = hashlib.md5(f"{i}{para[:20]}".encode()).hexdigest()[:8]
        ckey = hashlib.md5(f"c{i}{para[:10]}".encode()).hexdigest()[:8]
        blocks.append({'_type':'block','_key':key,'style':'normal','markDefs':[],
                       'children':[{'_type':'span','_key':ckey,'text':para,'marks':[]}]})
    return blocks

def slugify(s):
    s = s.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return re.sub(r'^-+|-+$', '', s)[:96]

def clean(t):
    return (t or '').replace('&amp;','&').replace('&#8220;','"').replace('&#8221;','"') \
                    .replace('&#8216;',"'").replace('&#8217;',"'").replace('&#038;','&')

def parse_date(d):
    if not d: return '2017-01-01T00:00:00Z'
    d = d.strip()
    return (d.replace(' ','T') + 'Z') if 'T' not in d else d

tree = ET.parse(XML_FILE)
root = tree.getroot()
items = root.findall('.//item')

posts = [i for i in items if get(i, 'wp:post_type') == 'post']
print(f'Found {len(posts)} posts', file=sys.stderr)

stats = {}
for post in posts:
    s = get(post, 'wp:status') or 'unknown'
    stats[s] = stats.get(s, 0) + 1
print(f'Status breakdown: {stats}', file=sys.stderr)

for post in posts:
    post_id     = get(post, 'wp:post_id') or '0'
    title_el    = post.find('title')
    title       = clean(title_el.text if title_el is not None else 'Untitled')
    slug        = get(post, 'wp:post_name') or slugify(title) or f'post-{post_id}'
    date_str    = get(post, 'wp:post_date') or '2017-01-01 00:00:00'
    content_raw = get(post, 'content:encoded') or ''
    excerpt_raw = get(post, 'excerpt:encoded') or ''

    excerpt_text = strip_html(excerpt_raw)[:200] or strip_html(content_raw)[:200]
    published_at = parse_date(date_str)

    doc = {
        '_id':         f'wp-post-{post_id}',
        '_type':       'announcement',
        'title':       title,
        'slug':        {'_type': 'slug', 'current': slug},
        'publishedAt': published_at,
        'author':      'SCSF',
    }
    if excerpt_text:
        doc['excerpt'] = excerpt_text
    pt = html_to_portable_text(content_raw)
    if pt:
        doc['content'] = pt

    print(json.dumps(doc, ensure_ascii=False))

print(f'\nDone. Run:', file=sys.stderr)
print(f'  bunx sanity@latest dataset import wp-posts.ndjson production --replace', file=sys.stderr)
