#!/usr/bin/env python3
"""Check or refresh publication metadata, using only Python's standard library.

Reader prose inside .post-content is the source of truth. Count section headings
and body text, but exclude scripts, styles, navigation, figures/captions, code
blocks, hidden content, interactive experiments, and duplicate pull quotes.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys


WORDS_PER_MINUTE = 200
VOID_TAGS = set("area base br col embed hr img input link meta param source track wbr".split())
BLOCK_TAGS = set("article aside blockquote br dd div dl dt h1 h2 h3 h4 h5 h6 hr li ol p section summary table td th tr ul".split())
EXCLUDED_TAGS = {"script", "style", "template", "noscript", "nav", "figure", "pre"}
EXCLUDED_CLASSES = {"pull-quote", "experiment", "experiment-label"}
WORD_PATTERN = re.compile(r"[^\W_]+(?:['’\-][^\W_]+)*", re.UNICODE)


@dataclass
class Frame:
    tag: str
    in_content: bool
    excluded: bool
    slug: str | None
    field_start: int | None = None
    json_start: int | None = None


class PostHTML(HTMLParser):
    """Read prose and exact metadata ranges without reserializing the page."""

    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.line_offsets = [0]
        for line in source.splitlines(keepends=True):
            self.line_offsets.append(self.line_offsets[-1] + len(line))
        self.stack = []
        self.prose = []
        self.content_count = 0
        self.fields = []
        self.json_blocks = []
        self.feed(source)
        self.close()

    def source_offset(self):
        line, column = self.getpos()
        return self.line_offsets[line - 1] + column

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        classes = set(attrs.get("class", "").split())
        parent = self.stack[-1] if self.stack else None
        is_content = "post-content" in classes
        self.content_count += int(is_content)
        in_content = is_content or bool(parent and parent.in_content)
        excluded = bool(parent and parent.excluded) or (
            tag in EXCLUDED_TAGS
            or bool(classes & EXCLUDED_CLASSES)
            or "hidden" in attrs
            or attrs.get("aria-hidden", "").lower() == "true"
            or "data-reading-time-exclude" in attrs
        )
        if in_content and tag in BLOCK_TAGS:
            self.prose.append(" ")
        start = self.source_offset() + len(self.get_starttag_text())
        frame = Frame(
            tag, in_content, excluded,
            attrs.get("data-post-slug", parent.slug if parent else None),
            start if attrs.get("data-post-field") == "readTime" else None,
            start if tag == "script" and attrs.get("type") == "application/ld+json" else None,
        )
        if tag not in VOID_TAGS:
            self.stack.append(frame)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index].tag == tag:
                frame = self.stack[index]
                del self.stack[index:]
                if frame.field_start is not None:
                    self.fields.append((frame.field_start, self.source_offset(), frame.slug))
                if frame.json_start is not None:
                    self.json_blocks.append((frame.json_start, self.source_offset()))
                if frame.in_content and tag in BLOCK_TAGS:
                    self.prose.append(" ")
                break

    def handle_data(self, data):
        if self.stack and self.stack[-1].in_content and not self.stack[-1].excluded:
            self.prose.append(data)

    def handle_entityref(self, name):
        self.handle_data(unescape("&" + name + ";"))

    def handle_charref(self, name):
        self.handle_data(unescape("&#" + name + ";"))

    def word_count(self):
        if self.content_count != 1:
            raise ValueError("Each published post must contain exactly one .post-content element")
        count = len(WORD_PATTERN.findall("".join(self.prose)))
        if not count:
            raise ValueError("Published post has no reader prose")
        return count


def replacements(source, changes):
    for start, end, value in sorted(changes, reverse=True):
        source = source[:start] + value + source[end:]
    return source


def blog_postings(value):
    if isinstance(value, dict):
        types = value.get("@type", [])
        if "BlogPosting" in ([types] if isinstance(types, str) else types):
            yield value
        for child in value.values():
            yield from blog_postings(child)
    elif isinstance(value, list):
        for child in value:
            yield from blog_postings(child)


def update_schema(source, words, minutes):
    changes = []
    posting_count = 0
    for start, end in PostHTML(source).json_blocks:
        block = source[start:end]
        postings = list(blog_postings(json.loads(block)))
        if not postings:
            continue
        posting_count += len(postings)
        if len(postings) != 1:
            raise ValueError("Expected one BlogPosting per JSON-LD block")
        for key, value in (("wordCount", str(words)), ("timeRequired", json.dumps(f"PT{minutes}M"))):
            pattern = re.compile(r'("' + key + r'"\s*:\s*)(?:"[^"\\]*"|\d+)')
            block, count = pattern.subn(lambda match: match[1] + value, block)
            if count != 1:
                raise ValueError(f"Expected one {key} property in the BlogPosting JSON-LD")
        changes.append((start, end, block))
    if posting_count != 1:
        raise ValueError("Published post must have exactly one BlogPosting JSON-LD object")
    return replacements(source, changes)


def expected_files(root):
    """Plan all changes before allowing any file writes."""
    posts = sorted((root / "lab/posts").glob("*.html"))
    posts = [path for path in posts if not path.name.startswith("_")]
    if not posts:
        raise ValueError("No published posts found")
    pages = [root / "index.html", root / "about.html", root / "lab/index.html", *posts]
    originals = {path: path.read_text(encoding="utf-8") for path in pages}
    expected = dict(originals)
    counts = {}
    for path in posts:
        words = PostHTML(originals[path]).word_count()
        minutes = max(1, (words + WORDS_PER_MINUTE - 1) // WORDS_PER_MINUTE)
        counts[path.stem] = (words, minutes)
        expected[path] = update_schema(originals[path], words, minutes)

    registry_path = root / "assets/js/post-registry.js"
    registry = registry_path.read_text(encoding="utf-8")
    originals[registry_path] = registry
    entries = list(re.finditer(r"^  '([^']+)': \{(.*?)^  \}", registry, re.MULTILINE | re.DOTALL))
    if {entry[1] for entry in entries} != set(counts) or len(entries) != len(counts):
        raise ValueError("Registry slugs must match published post filenames exactly")
    changes = []
    for entry in entries:
        value = re.search(r"\breadTime:\s*(\d+)", entry[2])
        if not value:
            raise ValueError(f"Missing registry readTime: {entry[1]}")
        start = entry.start(2) + value.start(1)
        changes.append((start, start + len(value[1]), str(counts[entry[1]][1])))
    expected[registry_path] = replacements(registry, changes)

    for path in pages:
        source = expected[path]
        fields = PostHTML(source).fields
        if path in posts and not any(slug == path.stem for _, _, slug in fields):
            raise ValueError(f"Missing article readTime field: {path.name}")
        changes = []
        for start, end, slug in fields:
            if slug not in counts:
                raise ValueError(f"Unknown or missing readTime field slug in {path.name}: {slug}")
            changes.append((start, end, f"{counts[slug][1]} min read"))
        expected[path] = replacements(source, changes)
    return originals, expected, counts


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="Check metadata without writing (default)")
    mode.add_argument("--write", action="store_true", help="Refresh registry, visible read times, and JSON-LD")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent, help=argparse.SUPPRESS)
    args = parser.parse_args(argv)
    try:
        originals, expected, counts = expected_files(args.root)
    except (OSError, ValueError) as error:
        print(f"Post metadata error: {error}", file=sys.stderr)
        return 1
    stale = [path for path in expected if expected[path] != originals[path]]
    if stale and not args.write:
        for path in stale:
            print(f"Stale post metadata: {path.relative_to(args.root)}", file=sys.stderr)
        print("Run python3 tools/sync-post-metadata.py --write before publishing.", file=sys.stderr)
        return 1
    if args.write:
        for path in stale:
            path.write_text(expected[path], encoding="utf-8")
    for slug, (words, minutes) in counts.items():
        print(f"{slug}: {words} words, {minutes} min read")
    print(f"Post metadata {'refreshed' if args.write else 'checks passed'} ({len(stale)} files changed).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
