#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

run_grep_check() {
  local pattern="$1"
  local message="$2"
  shift 2

  local output
  output="$(grep -nH -E "$pattern" "$@" || true)"

  if [[ -n "$output" ]]; then
    echo "$output" >&2
    fail "$message"
  fi
}

site_pages=(
  "index.html"
  "about.html"
  "lab/index.html"
)

while IFS= read -r file; do
  site_pages+=("$file")
done < <(find lab/posts -maxdepth 1 -type f -name '*.html' ! -name '_template.html' | sort)

template_pages=(
  "lab/posts/_template.html"
  "lab/templates/blog-post-template.html"
)

all_html=(
  "${site_pages[@]}"
  "${template_pages[@]}"
)

text_files=(
  "CNAME"
  "feed.xml"
  "robots.txt"
  "site-config.json"
  "sitemap.xml"
  "tools/generate-og-card.py"
)

[[ "$(tr -d '\r\n' < CNAME)" == "mediumfeel.com" ]] || fail "CNAME must be exactly mediumfeel.com"

run_grep_check 'www\.mediumfeel\.com' "Production files must not reference www.mediumfeel.com" "${all_html[@]}" "${text_files[@]}"
run_grep_check 'href="[^"]*index\.html"' "Internal links must use clean paths instead of index.html" "${all_html[@]}"

for file in "${site_pages[@]}" "${template_pages[@]}"; do
  grep -q '<link rel="canonical" href="https://mediumfeel.com' "$file" || fail "$file is missing an apex-domain canonical tag"
done

grep -q 'Sitemap: https://mediumfeel.com/sitemap.xml' robots.txt || fail "robots.txt must reference the apex sitemap URL"

echo "Static site checks passed."
