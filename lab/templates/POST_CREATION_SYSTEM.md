# Blog Post Creation System

## Overview
This document defines the complete system for creating consistently formatted blog posts. All typography and element styles come from `lab/blog-design-system.css`. Posts only contain post-specific styles inline (gradient colors, hero animation).

## Post Metadata Registry

**Single source of truth for post metadata.** All post dates, read times, and status labels are defined in `assets/js/post-registry.js` and synced automatically to:
- Post pages (`lab/posts/*.html`)
- Lab page cards (`lab/index.html`)
- Homepage featured cards (`index.html`)

### How It Works

1. **Define metadata once** in `assets/js/post-registry.js`:
```javascript
window.POST_REGISTRY = {
  'post-slug': {
    title: 'Post Title',
    excerpt: 'Post excerpt...',
    status: 'exploring',      // exploring, building, shipped
    statusLabel: 'Exploring',
    dateISO: '2026-02-10',
    dateFormatted: 'February 10, 2026',
    readTime: 6  // fallback; auto-calculated on post pages
  }
};
```

2. **Add data attributes** to HTML elements that should sync:
```html
<div class="post-meta-line" data-post-slug="post-slug">
    <span class="status-pill status-exploring" data-post-field="status">Exploring</span>
    <span class="separator">&middot;</span>
    <time datetime="2026-02-10" data-post-field="date">February 10, 2026</time>
    <span class="separator">&middot;</span>
    <span class="read-time" data-post-field="readTime" data-post-auto="true">6 min read</span>
</div>
```

3. **Include scripts** before closing `</body>`:
```html
<script src="../../assets/js/post-registry.js"></script>
<script src="../../assets/js/post-sync.js"></script>
```

### Field Types

- `data-post-field="status"` — Updates status pill class and text
- `data-post-field="date"` — Updates `datetime` attribute and text content
- `data-post-field="readTime"` — Updates read time text
  - Add `data-post-auto="true"` on post pages to auto-calculate from word count

### What Still Needs Manual Updates

The registry **does not** update:
- `feed.xml` — RSS feed entries (can't be JS-driven)
- `<head>` meta tags — OG/Twitter/Schema.org dates in post HTML
- Post titles and excerpts in HTML (only in registry for reference)

When creating a new post:
1. Add entry to `post-registry.js`
2. Add `data-post-slug` and `data-post-field` attributes to all metadata elements
3. Include the registry scripts
4. Manually update `feed.xml` with the post entry
5. Ensure `<head>` meta tags have correct dates

## Architecture

```
styles.css                  ← Base site styles
lab/blog-design-system.css  ← All blog typography, elements, responsive rules
lab/posts/*.html            ← Posts link to both; inline styles = gradient only
```

## Content Structure Rules

### 1. Opening Section (No Label)
First section after header has NO section-label.
```html
<section class="post-section">
    <div class="section-content">
        <p>Opening paragraphs...</p>
    </div>
</section>
```

### 2. Main Sections (Green Mono Labels)
JetBrains Mono, uppercase, green — the primary structural marker.
```html
<section class="post-section">
    <div class="section-label">Section Name</div>
    <div class="section-content">
        <p>Content...</p>
    </div>
</section>
```

### 3. Subsections (Instrument Serif Italic)
Use `subsection-label` for sub-headings within a section. Renders as Instrument Serif italic — warm, editorial, clearly subordinate to section labels.
```html
<div class="subsection-label">Keep</div>
<ul>
    <li><strong>Timeboxing.</strong> Explanation.</li>
</ul>

<div class="subsection-label">Drop</div>
<ul>
    <li>Point here.</li>
</ul>
```

### 4. Images Between Sections

Choose the right figure class based on the image's role:

**Default — primary/landscape images:**
```html
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
</figure>
```

**Medium — mid-weight visual breaks (object images, illustrations):**
```html
<figure class="post-figure figure-medium">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
</figure>
```

**Accent — small secondary/supporting/portrait images:**
```html
<figure class="post-figure figure-accent">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
</figure>
```

**Wide — panoramic/screenshot images:**
```html
<figure class="post-figure figure-wide">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
</figure>
```

With caption (works with any tier):
```html
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
    <figcaption>Caption text</figcaption>
</figure>
```

**How to choose:**
- Is this the key visual for the section? → default `post-figure` (540px)
- Is this an object/illustration that shouldn't fill the column? → `figure-medium` (420px)
- Is this a small supporting accent or visual break? → `figure-accent` (320px)
- Is the source image portrait (taller than wide)? → almost always `figure-accent` or `figure-medium`
- Is this a wide screenshot or panoramic? → `figure-wide`

## Typography Hierarchy

Three voices, clear cascade:

1. **Section labels** — JetBrains Mono 600, uppercase, green (`section-label`)
2. **Subsection labels** — Instrument Serif italic, 1.25rem, dark (`subsection-label`)
3. **Bold text** — Inter 600, inline emphasis (`<strong>`)

Body text is Inter 400 at 17px (1.0625rem), line-height 1.8, color #374151.

## Metadata Line Alignment

All metadata rows (status pill, date, read time) use **`align-items: baseline`**. This keeps the date and read time text bottoms on the same line, even though they use different fonts and sizes (Inter 0.85rem vs JetBrains Mono 0.75rem). The status pill uses `position: relative; top: -1px` to visually center its box against the text baseline.

This applies everywhere a metadata line appears:
- `.latest-report-details` (homepage card)
- `.lab-post-card-details` (lab page cards)
- `body.blog-post .post-meta-line` (blog post pages)

When adding new metadata containers, always use `align-items: baseline` and add `position: relative; top: -1px` to the `.status-pill` within that container.

## All Content Elements

### Highlights
```html
<mark>Key insight highlighted in green</mark>
```
Inline emphasis within paragraphs — "this phrase matters."

### Pull Quotes
```html
<blockquote class="pull-quote">
    <p>A sentence worth stopping for.</p>
</blockquote>
```
Large Instrument Serif, centered, green borders. Visual anchor — "stop scrolling, read this."

### Blockquotes
```html
<blockquote>
    <p>A regular quote.</p>
</blockquote>
```
Green left border, italic, muted color.

### Callouts
```html
<aside class="callout">
    <div class="callout-label">Note</div>
    <p>Callout content.</p>
</aside>
```

### Code
```html
<code>inline code</code>

<pre><code>code block</code></pre>
```

### Horizontal Rule (Narrative Pause)
```html
<hr>
```

### Collapsible Content
```html
<details class="backstory">
    <summary>Backstory</summary>
    <p>Hidden content...</p>
</details>
```

### Tables
```html
<table>
    <thead><tr><th>Col A</th><th>Col B</th></tr></thead>
    <tbody><tr><td>Data</td><td>Data</td></tr></tbody>
</table>
```

### Footnotes
```html
<sup class="footnote-ref"><a href="#fn1" id="fnref1">1</a></sup>

<section class="footnotes">
    <ol>
        <li id="fn1"><p>Note. <a href="#fnref1">↩</a></p></li>
    </ol>
</section>
```

### Definition Lists
```html
<dl>
    <dt>Term</dt>
    <dd>Definition.</dd>
</dl>
```

## Markdown → HTML Conversion

| Markdown | HTML |
|----------|------|
| `## Section Name` | `<div class="section-label">Section Name</div>` |
| `### Subsection` | `<div class="subsection-label">Subsection</div>` |
| `==text==` | `<mark>text</mark>` |
| `**text**` | `<strong>text</strong>` |
| `*text*` | `<em>text</em>` |
| `[link](url)` | `<a href="url">link</a>` |

## Image Handling

Each post has **two** image representations that appear across the site:

### Hero Image
The primary image for the post. Appears in:
- Post header (floating over gradient)
- Lab page post card (`lab/index.html`)
- Homepage featured post card (`index.html`, if featured)
- Open Graph / Twitter Card meta tags

Save to: `assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png`
Reference from post: `../../assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png`

**Hero container dimensions** (set in `blog-design-system.css`, DO NOT CHANGE):
- Desktop: `max-width: 360px; height: 340px; max-height: 340px` (on img)
- Tablet (768px): `max-width: 270px; height: 260px; max-height: 260px` (on img)
- Mobile (480px): `max-width: 220px; height: 210px; max-height: 210px` (on img)

The container uses a wider width + taller height with explicit `max-height` on the img (not percentages, which don't resolve in flex containers). This equalizes visual weight across aspect ratios:
- **Portrait** (e.g. keys, 840x913): fills height, slightly narrower than container width
- **Square** (e.g. letterbox, 1024x1024): fills both dimensions nearly equally
- **Landscape** (e.g. correction fluid): fills width, shorter than container height

No post-specific hero size overrides should be needed. If one is, something is wrong with the image itself.

NEVER change the design system values — that affects every post.

### Floater Object
A small (150x150) object image representing the post in grid/floater contexts. Appears in:
- Lab page curiosity grid (`lab/index.html`)
- Homepage hero floaters (`index.html`, if linked)

Save to: `assets/floaters/{{OBJECT_NAME}}-mid.webp`
Size: 150x150px, webp format, transparent background

### Content Images
Save to: `assets/blog/{{POST_SLUG}}/descriptive-name.png`
Reference: `../../assets/blog/{{POST_SLUG}}/descriptive-name.png`

**Content figure tiers** (set in `blog-design-system.css`):
- **Default** (`post-figure`): max-width 540px — for primary/landscape images
- **Medium** (`post-figure figure-medium`): max-width 420px — for mid-weight objects/illustrations
- **Accent** (`post-figure figure-accent`): max-width 320px — for small secondary/portrait images
- **Wide** (`post-figure figure-wide`): for panoramic/screenshots

### OG / Social Image (1200x630)
Every post needs a branded OG image at `assets/social/og-{{POST_SLUG}}-v2.png`.

**Generate with ImageMagick (3 steps):**

Step 1 — Base gradient (offset bright spot at ~30% from left):
```bash
magick -size 1200x630 xc:none \
  \( -size 1200x630 radial-gradient:"#a5f92e-#2d5a3d" \
     -distort SRT "600,315 1 0 360,315" \) \
  -composite /tmp/og-base.png
```

Step 2 — Add 32px grid overlay (subtle bright lines, 5% brighter):
```bash
magick -size 1200x630 xc:black \
  -fill white \
  -draw "$(for x in $(seq 0 32 1200); do echo "line $x,0 $x,630 "; done)" \
  -draw "$(for y in $(seq 0 32 630); do echo "line 0,$y 1200,$y "; done)" \
  -alpha off /tmp/og-grid.png

magick /tmp/og-base.png \
  \( +clone -evaluate Add 5% \) \
  /tmp/og-grid.png -composite \
  /tmp/og-bg.png
```

Step 3 — Composite hero with drop shadow and optimize:
```bash
magick /tmp/og-bg.png \
  \( assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png \
     -resize x420 \
     \( +clone -background black -shadow 25x8+0+4 \) \
     +swap -background none -layers merge +repage \
  \) \
  -gravity center -composite \
  -background none -flatten \
  -type TrueColor -depth 8 -strip \
  -define png:compression-level=9 \
  -define png:compression-filter=5 \
  -define png:compression-strategy=1 \
  assets/social/og-{{POST_SLUG}}-v2.png
```

**Target: 300-500KB PNG.** The `-flatten` removes alpha (critical for file size), and the compression flags match existing OG images. All OG images must be 8-bit TrueColor PNG, 1200x630, in this size range. LinkedIn will blur images over ~500KB.

### Shared Images
Reference existing: `../../assets/blog/image-name.png`

### Image Locations Checklist
When adding a new post, update images in ALL of these locations:
1. `lab/posts/{{POST_SLUG}}.html` — hero image in post header
2. `lab/index.html` — hero image in post card
3. `lab/index.html` — floater object in curiosity grid
4. `index.html` — hero image in featured post card (if featured)
5. `index.html` — floater object in homepage hero (if linked)
6. Post meta tags — og:image, twitter:image, schema.org image

## Status Labels

One treatment everywhere: colored pill, inline with date and read time.

### Usage (same in blog posts, lab cards, and homepage cards)
```html
<span class="status-pill status-exploring">Exploring</span>
```

### Modifier classes
Always pair `status-pill` with a status modifier:
- `status-exploring` — blue (researching, early stage)
- `status-building` — amber (actively building)
- `status-shipped` — green (complete, published)

## Post Navigation

Every post needs prev/next links at the bottom:
```html
<nav class="post-nav">
    <a href="prev-post.html" class="post-nav-link prev">
        <span class="post-nav-direction">&larr; Previous</span>
        <span class="post-nav-title">Previous Post Title</span>
    </a>
    <a href="next-post.html" class="post-nav-link next">
        <span class="post-nav-direction">Next &rarr;</span>
        <span class="post-nav-title">Next Post Title</span>
    </a>
</nav>
```
Use empty `<span></span>` if there's no prev or next.

## Link Language & Labels

Consistent language across the site. These are the standard conventions:

### Section headers
- **Homepage featured post:** `UPDATE FROM THE LAB` (singular, no colon)
- **Lab page curiosity grid:** No header (objects speak for themselves)

### Post card links
- **Homepage card:** `Read the post →` (primary) + `More from the lab →` (secondary, muted)
- **Lab page cards:** `Read the post →` (primary only — no lab link, you're already there)

### Post navigation (within posts)
- Previous: `← Previous` with post title below
- Next: `Next →` with post title below

### Section backgrounds
- **Homepage featured post section:** White (`#ffffff`), no graph paper or grid pattern
- **Lab page:** White body, no section backgrounds on post cards

### Footer
- Line 1: Lab · About · Contact (nav links, site green)
- Line 2: © 2026 Medium Feel · Portland, Maine (legal, site green)
- Desktop: single line with middot divider
- Mobile (≤600px): stacked, divider hidden

## Post-Specific Inline Styles

The ONLY things that go in a post's `<style>` block:
- Header gradient colors (`.post-header { background: radial-gradient(...) }`)
- Hero animation keyframes (if needed)
- Hero animation overrides (e.g. `animation: none` for static heroes)

Everything else comes from `blog-design-system.css`.

## Global vs Post-Specific Changes (CRITICAL)

**`blog-design-system.css` is the shared foundation.** Every change to an existing rule affects ALL published posts. Before editing this file, verify the change won't break any live post.

**Safe changes to the design system:**
- Adding NEW classes (e.g. `figure-accent`) — no existing element uses them yet
- Bug fixes that are genuinely broken across all posts

**NEVER do this:**
- Change an existing rule (hero size, font size, spacing) to fix one post's layout
- Tweak a shared value because one image looks wrong

**Instead, use post-specific overrides** in the post's own `<style>` block. Overrides must match design system specificity — always use the `body.blog-post` prefix:
```css
/* No float animation for this post */
body.blog-post .post-hero img { animation: none; }
```

This keeps every published post stable while giving each post full control over its own appearance.

## User Workflow

1. User provides markdown-style content:
```
Opening paragraph with ==key insight== here.

## The Challenge

Content about the challenge. Some **bold text** for emphasis.

### Approach A
- Point one
- **Term.** Definition

### Approach B
- Point one

[Insert image: bridge.png]

## What's Next

Closing thoughts.
```

2. Convert to proper HTML structure:
   - Parse `##` as section-label divs
   - Parse `###` as subsection-label divs
   - Convert inline markdown to HTML
   - Place images as post-figure elements
   - Wrap in post-section containers

3. Save images to correct locations

4. Generate complete HTML file from template

## Template Variables

Required for all posts:
- `{{POST_SLUG}}` - URL-friendly slug (e.g. `building-your-own-thinking-tools`)
- `{{TITLE}}` - Full title
- `{{TITLE_ENCODED}}` - URL-encoded for sharing links
- `{{EXCERPT}}` - 1-2 sentence summary
- `{{STATUS}}` - Exploring, Building, or Shipped
- `{{STATUS_CLASS}}` - Lowercase for CSS class: `exploring`, `building`, or `shipped`
- `{{DATE_ISO}}` - ISO date (YYYY-MM-DD)
- `{{DATE_FORMATTED}}` - Readable date (e.g. `February 20, 2026`)
- `{{READ_TIME}}` - Minutes (integer)
- `{{WORD_COUNT}}` - Total word count of post body
- `{{KEYWORDS}}` - Comma-separated tags for schema.org
- `{{ARTICLE_TAGS}}` - One `<meta property="article:tag" content="Tag">` per tag
- `{{HERO_ALT}}` - Hero image alt text
- `{{PREV_SLUG}}` / `{{NEXT_SLUG}}` - For post navigation
- `{{PREV_TITLE}}` / `{{NEXT_TITLE}}` - Display titles for post navigation

## Full Publishing Checklist

### 1. Post HTML file (`lab/posts/{{POST_SLUG}}.html`)
- [ ] Generated from `lab/templates/blog-post-template.html`
- [ ] All `{{VARIABLES}}` replaced — no leftover placeholders
- [ ] Google Analytics (gtag.js) present
- [ ] `<link rel="canonical">` present and correct
- [ ] OG meta tags: `og:type`, `og:url`, `og:site_name`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`
- [ ] Article meta tags: `article:published_time`, `article:author`, `article:section`, `article:tag`
- [ ] Twitter meta tags use `name=` (NOT `property=`)
- [ ] Schema.org JSON-LD block with correct `wordCount` and `timeRequired`
- [ ] RSS feed `<link>` present
- [ ] Links `../../styles.css` then `../blog-design-system.css` (in that order)
- [ ] No inline typography styles (only gradient/animation in `<style>`)
- [ ] `<picture>` with webp `<source>` for hero image
- [ ] Hero in header gradient, title/excerpt/meta in `.post-intro` on white
- [ ] `data-post-slug` and `data-post-field` attributes on metadata elements
- [ ] `data-post-auto="true"` on read time span
- [ ] Share buttons with encoded URLs (Twitter, LinkedIn, Email)
- [ ] Post navigation (prev/next) — use `<span></span>` for missing direction
- [ ] Footer matches site footer (Lab / About / Contact + copyright)
- [ ] `post-registry.js` and `post-sync.js` scripts before `</body>`
- [ ] Section labels use `<div class="section-label">`
- [ ] Subsections use `<div class="subsection-label">`
- [ ] Highlights use `<mark>` tags

### 2. Post Registry (`assets/js/post-registry.js`)
- [ ] New entry added with slug, title, excerpt, status, dates, readTime

### 3. Lab page (`lab/index.html`)
- [ ] New post card added (newest first)
- [ ] Hero image with `<picture>` + webp source
- [ ] `data-post-slug` and `data-post-field` attributes on metadata
- [ ] Floater object added to curiosity grid (if available)

### 4. Homepage (`index.html`)
- [ ] Featured post card updated (if this is the newest post)
- [ ] Hero image with `<picture>` + webp source
- [ ] `data-post-slug` and `data-post-field` attributes on metadata
- [ ] Floater object added to homepage hero (if available)

### 5. Previous post (`lab/posts/{{PREV_SLUG}}.html`)
- [ ] "Next" navigation link updated to point to new post

### 6. Sitemap (`sitemap.xml`)
- [ ] New post URL added
- [ ] `lastmod` dates updated for homepage and lab page

### 7. RSS Feed (`feed.xml`)
- [ ] New `<item>` added (newest first)
- [ ] `lastBuildDate` updated in `<channel>`

### 8. Images
- [ ] Hero image saved to `assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png` + `.webp`
- [ ] OG image saved to `assets/social/og-{{POST_SLUG}}-v2.png` (1200x630)
- [ ] Content images saved to `assets/blog/{{POST_SLUG}}/`
- [ ] Floater object (150x150 webp) saved to `assets/floaters/`

### 9. Final checks
- [ ] Tested at 768px and 480px breakpoints
- [ ] No console errors
- [ ] All internal links work (prev/next, lab cards, homepage cards)
