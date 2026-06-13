#!/usr/bin/env python3
"""
SCSF WordPress XML → Sanity NDJSON exporter
--------------------------------------------
Reads the WP XML export and writes Sanity-importable NDJSON to stdout.

Usage:
  python3 scripts/extract-wp-posts.py /path/to/export.xml > wp-posts.ndjson
  bunx sanity@latest dataset import wp-posts.ndjson production --replace

This gets ALL 113 posts including the 107 "archived" ones the REST API
couldn't reach.
"""

import sys, json, re
import xml.etree.ElementTree as ET

XML_FILE = sys.argv[1] if len(sys.argv) > 1 else 'theskatingclubofsanfrancisco.WordPress.2026-06-13.xml'

NS = {
    'wp':      'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    'dc':      'http://purl.org/dc/elements/1.1/',
}

def strip_html(html):
    if not html: return ''
    html = re.sub(r'</p>', '\n\n', html, flags=re.I)
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.I)
    html = re.sub(r'<[^>]+>', '', html)
    html = html.replace('&nbsp;', ' ').replace('&amp;', '&') \
               .replace('&lt;', '<').replace('&gt;', '>') \
               .replace('&quot;', '"').replace('&#8220;', '"') \
               .replace('&#8221;', '"').replace('&#8216;', "'") \
               .replace('&#8217;', "'").replace('&#038;', '&')
    return re.sub(r'\n{3,}', '\n\n', html).strip()

def html_to_portable_text(html):
    if not html: return []
    text = strip_html(html)
    blocks = []
    import hashlib
    for i, para in enumerate(re.split(r'\n{2,}', text)):
        para = para.strip()
        if not para: continue
        key = hashlib.md5(f"{i}{para[:20]}".encode()).hexdigest()[:8]
        ckey = hashlib.md5(f"c{i}".encode()).hexdigest()[:8]
        blocks.append({
            '_type': 'block',
            '_key': key,
            'style': 'normal',
            'markDefs': [],
            'children': [{'_type': 'span', '_key': ckey, 'text': para, 'marks': []}]
        })
    return blocks

def slugify(s):
    s = s.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    return s[:96]

def clean_title(t):
    return t.replace('&amp;', '&').replace('&#8220;', '"').replace('&#8221;', '"') \
            .replace('&#8216;', "'").replace('&#8217;', "'").replace('&#038;', '&')

def parse_date(d):
    """'2017-04-17 14:30:00' → ISO 8601"""
    try:
        return d.strip().replace(' ', 'T') + 'Z' if 'T' not in d else d
    except:
        return '2017-01-01T00:00:00Z'

tree = ET.parse(XML_FILE)
root = tree.getroot()
items = root.findall('.//item')

posts = [i for i in items
         if (i.find('wp:post_type', NS) is not None and
             i.find('wp:post_type', NS).text == 'post')]

stats = {}
docs = []

for post in posts:
    post_id  = (post.find('wp:post_id', NS) or ET.Element('')).text or '0'
    title_el = post.find('title')
    title    = clean_title(title_el.text or 'Untitled') if title_el is not None else 'Untitled'
    slug_el  = post.find('wp:post_name', NS)
    slug     = slug_el.text if slug_el is not None and slug_el.text else slugify(title) or f'post-{post_id}'
    date_el  = post.find('wp:post_date', NS)
    date_str = date_el.text if date_el is not None else '2017-01-01 00:00:00'
    status   = (post.find('wp:status', NS) or ET.Element('')).text or 'archive'
    content_el = post.find('content:encoded', NS)
    content    = content_el.text or '' if content_el is not None else ''
    excerpt_el = post.find('excerpt:encoded', NS)
    excerpt    = excerpt_el.text or '' if excerpt_el is not None else ''

    stats[status] = stats.get(status, 0) + 1

    excerpt_text = strip_html(excerpt)[:200] or strip_html(content)[:200]
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
    pt = html_to_portable_text(content)
    if pt:
        doc['content'] = pt

    docs.append(doc)

# Write NDJSON to stdout
for doc in docs:
    print(json.dumps(doc))

# Summary to stderr so it doesn't corrupt the NDJSON
print(f'\n✅ {len(docs)} posts exported. Status breakdown: {stats}', file=sys.stderr)
print(f'   Now run: bunx sanity@latest dataset import wp-posts.ndjson production --replace', file=sys.stderr)
