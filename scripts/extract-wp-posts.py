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

def strip_divi(content):
    """Extract readable text from Divi/WPBakery shortcode soup."""
    if not content: return content
    has_divi = '[et_pb_' in content or '[/et_pb_' in content
    has_vc   = '[vc_'   in content or '[/vc_'   in content
    if not has_divi and not has_vc:
        return content
    # Extract text from et_pb_text blocks
    text_blocks = re.findall(r'\[et_pb_text[^\]]*\](.*?)\[/et_pb_text\]',
                             content, re.DOTALL | re.I)
    if text_blocks:
        content = '\n\n'.join(text_blocks)
    # Strip remaining paired shortcode blocks
    content = re.sub(r'\[et_pb_\w+[^\]]*\].*?\[/et_pb_\w+\]', '', content,
                     flags=re.DOTALL | re.I)
    content = re.sub(r'\[vc_\w+[^\]]*\].*?\[/vc_\w+\]', '', content,
                     flags=re.DOTALL | re.I)
    # Strip ALL remaining shortcode tags — both opening [tag] and closing [/tag]
    content = re.sub(r'\[/?[^\]\[]+\]', '', content)
    return content.strip()

def strip_html(html):
    if not html: return ''
    html = strip_divi(html)
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

# Deduplicate by slug — keep published > private > draft, then highest post_id
STATUS_RANK = {'publish': 0, 'private': 1, 'inherit': 2, 'draft': 3, 'pending': 4}
seen_slugs = {}
for post in posts:
    slug = get(post, 'wp:post_name') or ''
    status = get(post, 'wp:status') or 'unknown'
    post_id = int(get(post, 'wp:post_id') or 0)
    if slug not in seen_slugs:
        seen_slugs[slug] = (post, STATUS_RANK.get(status, 9), post_id)
    else:
        _, prev_rank, prev_id = seen_slugs[slug]
        rank = STATUS_RANK.get(status, 9)
        if rank < prev_rank or (rank == prev_rank and post_id > prev_id):
            seen_slugs[slug] = (post, rank, post_id)

posts = [v[0] for v in seen_slugs.values()]
print(f'After dedup: {len(posts)} unique posts', file=sys.stderr)

# Skip junk posts (test posts with no real content)
SKIP_SLUGS = {'test'}

for post in posts:
    slug   = get(post, 'wp:post_name') or ''
    status = get(post, 'wp:status') or ''
    title_el = post.find('title')
    title_raw = (title_el.text or '').strip() if title_el is not None else ''

    # Skip junk slugs
    if slug in SKIP_SLUGS:
        continue
    # Skip drafts with no slug and no title (blank placeholder posts)
    if status == 'draft' and not slug and not title_raw:
        continue
    post_id     = get(post, 'wp:post_id') or '0'
    title_el    = post.find('title')
    title       = clean(title_el.text if title_el is not None else 'Untitled')
    slug        = get(post, 'wp:post_name') or slugify(title) or f'post-{post_id}'
    status      = get(post, 'wp:status') or 'publish'
    date_str    = get(post, 'wp:post_date') or '2017-01-01 00:00:00'
    content_raw = get(post, 'content:encoded') or ''
    excerpt_raw = get(post, 'excerpt:encoded') or ''

    excerpt_text = strip_html(excerpt_raw)[:200] or strip_html(content_raw)[:200]
    published_at = parse_date(date_str)

    # WP 'archive' + 'draft' status → archived:true in Sanity (hidden from public view)
    archived = status in ('archive', 'draft')

    doc = {
        '_id':         f'wp-post-{post_id}',
        '_type':       'announcement',
        'title':       title,
        'slug':        {'_type': 'slug', 'current': slug},
        'publishedAt': published_at,
        'author':      'SCSF',
        'archived':    archived,
    }
    if excerpt_text:
        doc['excerpt'] = excerpt_text
    pt = html_to_portable_text(content_raw)
    if pt:
        doc['content'] = pt

    print(json.dumps(doc, ensure_ascii=False))

print(f'\nDone. Run:', file=sys.stderr)
print(f'  bunx sanity@latest dataset import wp-posts.ndjson production --replace', file=sys.stderr)
