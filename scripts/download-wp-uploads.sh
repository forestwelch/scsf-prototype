#!/usr/bin/env bash
# Downloads all scsf.org/wp-content/uploads/* files referenced in the WP XML export.
# Places them in public/uploads/ preserving path structure.
# Rewrite scsf.org/wp-content/uploads/ → /uploads/ after running.
#
# Usage (run from project root):
#   bash scripts/download-wp-uploads.sh [/path/to/export.xml]

set -euo pipefail

XML="${1:-$HOME/Downloads/theskatingclubofsanfrancisco.WordPress.2026-06-13.xml}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/uploads"

echo "=== Extracting upload URLs from $XML ==="

# Write the extractor to a temp file to avoid heredoc quoting issues
PYFILE=$(mktemp /tmp/extract_urls_XXXXXX.py)
cat > "$PYFILE" << 'ENDPY'
import sys, re
import xml.etree.ElementTree as ET

xml_file = sys.argv[1]
tree = ET.parse(xml_file)
root = tree.getroot()
text = ET.tostring(root, encoding='unicode')

urls = sorted(set(re.findall(
    r'https?://scsf\.org/wp-content/uploads/[^\s\'"<>\]\\]+', text
)))

seen = set()
for u in urls:
    u = u.rstrip('\\').split('?')[0]
    u = u.replace('http://scsf.org', 'https://scsf.org')
    if re.search(r'-\d+x\d+\.(jpg|jpeg|png|gif)$', u, re.I):
        continue
    if u not in seen:
        seen.add(u)
        print(u)
ENDPY

URLS=$(python3 "$PYFILE" "$XML")
rm -f "$PYFILE"

TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "Found $TOTAL unique files to download"
echo ""

mkdir -p "$OUT_DIR"

COUNT=0
SKIP=0
FAIL=0

while IFS= read -r url; do
    rel="${url#https://scsf.org/wp-content/uploads/}"
    dest="$OUT_DIR/$rel"
    dir="$(dirname "$dest")"

    if [ -f "$dest" ]; then
        SKIP=$((SKIP + 1))
        continue
    fi

    mkdir -p "$dir"
    if curl -fsSL --max-time 30 --retry 2 -o "$dest" "$url"; then
        COUNT=$((COUNT + 1))
        echo "✓ $rel"
    else
        FAIL=$((FAIL + 1))
        echo "✗ FAILED: $url"
        rm -f "$dest"
    fi
done <<< "$URLS"

echo ""
echo "=== Done: $COUNT downloaded, $SKIP already existed, $FAIL failed ==="
echo "Files saved to: $OUT_DIR"
