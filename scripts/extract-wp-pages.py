#!/usr/bin/env python3
"""
SCSF WordPress XML → Sanity NDJSON page exporter
-------------------------------------------------
Extracts ALL WP pages (page post type) from the XML export and writes
Sanity-importable NDJSON to stdout.

Usage:
  python3 scripts/extract-wp-pages.py path/to/export.xml > wp-pages.ndjson
  bun --env-file=.env.local scripts/import-wp-pages.mjs

Skips: drafts with no content, __trashed, test/temp pages.
"""

import sys, json, re, hashlib
import xml.etree.ElementTree as ET

XML_FILE = sys.argv[1] if len(sys.argv) > 1 else 'theskatingclubofsanfrancisco.WordPress.2026-06-13.xml'

NS = {
    'wp':      'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
}

# Slugs to skip — junk, test pages, or duplicates already handled by custom routes
SKIP_SLUGS = {
    '__trashed', 'test-donation-form', 'donate-button', 'a-misc-2',
    'scsf-home-page-draft', 'front-page',
    # Tests-passed are handled by /tests-passed custom page
    'tests-passed', 'test-passed-2023', 'tests-passed-2024', 'tests-passed-2025', 'tests-passed-2026', 'test-passed',
    # Handled by custom pages in the app
    'announcements', 'contact-us', 'contact-us-2', 'membership',
}

def get(el, tag):
    found = el.find(tag, NS)
    return found.text if found is not None else None

def strip_html(html):
    if not html: return ''
    html = re.sub(r'</p>', '\n\n', html, flags=re.I)
    html = re.sub(r'</h[1-6]>', '\n\n', html, flags=re.I)
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.I)
    html = re.sub(r'<li[^>]*>', '• ', html, flags=re.I)
    html = re.sub(r'</li>', '\n', html, flags=re.I)
    html = re.sub(r'<[^>]+>', '', html)
    for ent, rep in [('&nbsp;',' '),('&amp;','&'),('&lt;','<'),('&gt;','>'),
                     ('&quot;','"'),('&#8220;','"'),('&#8221;','"'),
                     ('&#8216;',"'"),('&#8217;',"'"),('&#038;','&'),
                     ('&#8230;','…'),('&#8211;','–'),('&#8212;','—')]:
        html = html.replace(ent, rep)
    return re.sub(r'\n{3,}', '\n\n', html).strip()

def heading_level(html_tag):
    m = re.match(r'h([1-6])', html_tag, re.I)
    return int(m.group(1)) if m else None

def html_to_portable_text(html):
    if not html: return []
    blocks = []
    # Split on block-level tags first
    parts = re.split(r'(<h[1-6][^>]*>.*?</h[1-6]>|<p[^>]*>.*?</p>|<ul[^>]*>.*?</ul>|<ol[^>]*>.*?</ol>)',
                     html, flags=re.I|re.DOTALL)

    para_index = 0
    for part in parts:
        part = part.strip()
        if not part:
            continue

        # Heading
        hm = re.match(r'<(h[1-6])[^>]*>(.*?)</h[1-6]>', part, re.I|re.DOTALL)
        if hm:
            level = heading_level(hm.group(1))
            text = strip_html(hm.group(2)).strip()
            if not text: continue
            style = f'h{level}' if level and level <= 4 else 'h4'
            key = hashlib.md5(f"h{para_index}{text[:20]}".encode()).hexdigest()[:8]
            ckey = hashlib.md5(f"c{para_index}{text[:10]}".encode()).hexdigest()[:8]
            blocks.append({'_type':'block','_key':key,'style':style,'markDefs':[],
                           'children':[{'_type':'span','_key':ckey,'text':text,'marks':[]}]})
            para_index += 1
            continue

        # List
        lm = re.match(r'<(ul|ol)[^>]*>(.*?)</(ul|ol)>', part, re.I|re.DOTALL)
        if lm:
            list_type = 'bullet' if lm.group(1).lower() == 'ul' else 'number'
            items = re.findall(r'<li[^>]*>(.*?)</li>', lm.group(2), re.I|re.DOTALL)
            for item in items:
                text = strip_html(item).strip()
                if not text: continue
                key = hashlib.md5(f"li{para_index}{text[:20]}".encode()).hexdigest()[:8]
                ckey = hashlib.md5(f"c{para_index}{text[:10]}".encode()).hexdigest()[:8]
                blocks.append({'_type':'block','_key':key,'style':'normal',
                               'listItem':list_type,'level':1,'markDefs':[],
                               'children':[{'_type':'span','_key':ckey,'text':text,'marks':[]}]})
                para_index += 1
            continue

        # Plain text / paragraph - strip HTML and split on double newlines
        text_content = strip_html(part)
        for para in re.split(r'\n{2,}', text_content):
            para = para.strip()
            if not para or len(para) < 2: continue
            key = hashlib.md5(f"p{para_index}{para[:20]}".encode()).hexdigest()[:8]
            ckey = hashlib.md5(f"c{para_index}{para[:10]}".encode()).hexdigest()[:8]
            blocks.append({'_type':'block','_key':key,'style':'normal','markDefs':[],
                           'children':[{'_type':'span','_key':ckey,'text':para,'marks':[]}]})
            para_index += 1

    return blocks

def clean(t):
    return (t or '').replace('&amp;','&').replace('&#8220;','"').replace('&#8221;','"') \
                    .replace('&#8216;',"'").replace('&#8217;',"'").replace('&#038;','&') \
                    .replace('&#8211;','–').replace('&#8212;','—')

tree = ET.parse(XML_FILE)
root = tree.getroot()
items = root.findall('.//item')
pages = [i for i in items if get(i, 'wp:post_type') == 'page']

exported = 0
skipped = 0
for page in pages:
    slug = get(page, 'wp:post_name') or ''
    status = get(page, 'wp:status') or ''
    post_id = get(page, 'wp:post_id') or '0'
    content_raw = get(page, 'content:encoded') or ''
    title_el = page.find('title')
    title = clean(title_el.text if title_el is not None else 'Untitled')

    # Skip junk
    if slug in SKIP_SLUGS:
        skipped += 1
        continue
    # Skip drafts with no content
    if status == 'draft' and not slug:
        skipped += 1
        continue
    # Skip pages with no real content and no title
    if not content_raw.strip() and not title:
        skipped += 1
        continue

    portable = html_to_portable_text(content_raw)

    doc = {
        '_id':   f'wp-page-{post_id}',
        '_type': 'page',
        'title': title or slug.replace('-', ' ').title(),
        'slug':  {'_type': 'slug', 'current': slug or f'page-{post_id}'},
        'showInNav': False,
    }
    if portable:
        doc['content'] = portable

    print(json.dumps(doc, ensure_ascii=False))
    exported += 1

print(f'\n{exported} pages exported, {skipped} skipped', file=sys.stderr)
print('Run:', file=sys.stderr)
print('  bun --env-file=.env.local scripts/import-wp-pages.mjs', file=sys.stderr)
