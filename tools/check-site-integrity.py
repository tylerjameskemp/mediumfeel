#!/usr/bin/env python3
"""Validate published links, assets, headings and machine-readable metadata."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / name for name in ("index.html", "about.html", "lab/index.html")]
PAGES += sorted(path for path in (ROOT / "lab/posts").glob("*.html") if not path.name.startswith("_"))


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.references = []
        self.h1_count = self.main_count = 0
        self.json_blocks = []
        self.json_buffer = None
        self.feed(text)

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        identifier = attrs.get("id")
        if identifier:
            if identifier in self.ids:
                raise ValueError(f"Duplicate id: {identifier}")
            self.ids.add(identifier)
        self.h1_count += tag == "h1"
        self.main_count += tag == "main"
        for key in ("src", "href"):
            if attrs.get(key):
                self.references.append(attrs[key])
        if attrs.get("srcset"):
            self.references.extend(item.strip().split()[0] for item in attrs["srcset"].split(","))
        if tag == "meta" and (attrs.get("property") == "og:image" or attrs.get("name") == "twitter:image"):
            self.references.append(attrs["content"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.json_buffer = ""

    def handle_data(self, data):
        if self.json_buffer is not None:
            self.json_buffer += data

    def handle_endtag(self, tag):
        if tag == "script" and self.json_buffer is not None:
            self.json_blocks.append(json.loads(self.json_buffer))
            self.json_buffer = None


def destination(page, value):
    parsed = urlsplit(value)
    if parsed.scheme and not (parsed.scheme in ("https", "http") and parsed.hostname == "mediumfeel.com"):
        return None, None
    if parsed.netloc and parsed.hostname != "mediumfeel.com":
        return None, None
    path = unquote(parsed.path)
    target = ROOT / path.lstrip("/") if path.startswith("/") else page.parent / path if path else page
    target = target.resolve()
    if target.is_dir():
        target /= "index.html"
    return target, unquote(parsed.fragment)


def main():
    parsed_pages = {}
    references = blocks = 0
    for path in PAGES:
        parsed = Page(path.read_text())
        if (parsed.h1_count, parsed.main_count) != (1, 1):
            raise ValueError(f"{path.relative_to(ROOT)} must have one H1 and one main landmark")
        parsed_pages[path] = parsed
        blocks += len(parsed.json_blocks)
    for path, parsed in parsed_pages.items():
        for value in parsed.references:
            target, fragment = destination(path, value)
            if target is None:
                continue
            references += 1
            if not target.is_file():
                raise ValueError(f"{path.relative_to(ROOT)} has missing target: {value}")
            if fragment and target.suffix == ".html":
                target_page = parsed_pages.get(target) or Page(target.read_text())
                if fragment not in target_page.ids:
                    raise ValueError(f"{path.relative_to(ROOT)} has missing fragment: {value}")
    sitemap = ET.parse(ROOT / "sitemap.xml")
    sitemap_targets = set()
    for loc in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        target, _ = destination(ROOT / "index.html", loc.text)
        if target is None or not target.is_file():
            raise ValueError(f"Invalid sitemap target: {loc.text}")
        sitemap_targets.add(target)
    if sitemap_targets != set(PAGES):
        raise ValueError("Sitemap must contain exactly the published pages")
    feed = ET.parse(ROOT / "feed.xml")
    feed_targets = set()
    for link in feed.findall("./channel/item/link"):
        target, _ = destination(ROOT / "index.html", link.text)
        if target is None or not target.is_file():
            raise ValueError(f"Invalid feed article: {link.text}")
        feed_targets.add(target)
    if feed_targets != {path for path in PAGES if path.parent == ROOT / "lab/posts"}:
        raise ValueError("RSS must contain exactly the published posts")
    print(f"Integrity passed: {len(PAGES)} pages, {references} internal references, {blocks} JSON-LD blocks, sitemap and RSS.")


if __name__ == "__main__":
    main()
