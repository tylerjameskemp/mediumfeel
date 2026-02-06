# Blog Post Creation System

## Overview
This document defines the complete system for creating consistently formatted blog posts. All typography and element styles come from `lab/blog-design-system.css`. Posts only contain post-specific styles inline (gradient colors, hero animation).

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
```html
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
</figure>
```

With caption:
```html
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
    <figcaption>Caption text</figcaption>
</figure>
```

## Typography Hierarchy

Three voices, clear cascade:

1. **Section labels** — JetBrains Mono 600, uppercase, green (`section-label`)
2. **Subsection labels** — Instrument Serif italic, 1.25rem, dark (`subsection-label`)
3. **Bold text** — Inter 600, inline emphasis (`<strong>`)

Body text is Inter 400 at 17px (1.0625rem), line-height 1.7.

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

1. **Hero Image**
   - Save to: `assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png`
   - Reference: `../../assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png`
   - Max width: 420px desktop, 320px tablet, 280px mobile

2. **Content Images**
   - Save to: `assets/blog/{{POST_SLUG}}/descriptive-name.png`
   - Reference: `../../assets/blog/{{POST_SLUG}}/descriptive-name.png`
   - Max width: 540px desktop, 440px tablet

3. **Shared Images**
   - Reference existing: `../../assets/blog/image-name.png`

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

## Post-Specific Inline Styles

The ONLY things that go in a post's `<style>` block:
- Header gradient colors (`.post-header { background: radial-gradient(...) }`)
- Hero animation keyframes (if needed)
- Hero/figure size overrides (if needed)

Everything else comes from `blog-design-system.css`.

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
- `{{POST_SLUG}}` - URL-friendly slug
- `{{TITLE}}` - Full title
- `{{TITLE_ENCODED}}` - URL-encoded for sharing
- `{{EXCERPT}}` - 1-2 sentence summary
- `{{STATUS}}` - Exploring, Building, Thinking, or Shipped
- `{{DATE_ISO}}` - ISO date (YYYY-MM-DD)
- `{{DATE_FORMATTED}}` - Readable date
- `{{READ_TIME}}` - Minutes
- `{{HERO_ALT}}` - Hero image alt text
- `{{PREV_SLUG}}` / `{{NEXT_SLUG}}` - For post navigation

## Checklist Before Publishing

- [ ] Links to `../blog-design-system.css` (after `../../styles.css`)
- [ ] No inline typography styles (only gradient/animation)
- [ ] Section labels use `<div class="section-label">`
- [ ] Subsections use `<div class="subsection-label">` (NOT `<p><strong>`)
- [ ] Highlights use `<mark>` tags
- [ ] Images saved to correct paths with alt text
- [ ] Post navigation added (prev/next)
- [ ] Share buttons in meta row with encoded URLs
- [ ] Footer has current year
- [ ] Tested at 768px and 480px breakpoints
