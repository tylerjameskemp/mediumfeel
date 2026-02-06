# Blog Post Template Guide

## Quick Start

1. Copy `blog-post-template.html` to `lab/posts/your-post-slug.html`
2. Replace all `{{VARIABLES}}` with your content
3. Customize the header gradient colors in the inline `<style>` block
4. Add your content sections

The template links to `../blog-design-system.css` for all typography and element styles. Only post-specific styles (gradient, hero animation) go inline.

## Required Variables

### Meta Information
- `{{POST_SLUG}}` - URL-friendly version of title (e.g., "building-your-own-thinking-tools")
- `{{TITLE}}` - Full post title
- `{{TITLE_ENCODED}}` - URL-encoded version for sharing (spaces as %20)
- `{{EXCERPT}}` - 1-2 sentence summary (shown in header and meta tags)
- `{{STATUS}}` - One of: Exploring, Building, Thinking, Shipped
- `{{DATE_ISO}}` - ISO format date (e.g., "2026-02-05")
- `{{DATE_FORMATTED}}` - Readable date (e.g., "February 5, 2026")
- `{{READ_TIME}}` - Estimated minutes to read
- `{{HERO_ALT}}` - Alt text for hero image
- `{{PREV_SLUG}}` / `{{NEXT_SLUG}}` - Slugs for post navigation (leave empty spans if none)

### Content
- `{{CONTENT_SECTIONS}}` - All your post sections (see structure below)

## Typography System

Three-voice typography from `blog-design-system.css`:

| Voice | Font | Role | Example |
|-------|------|------|---------|
| **Label** | JetBrains Mono 600 | Section labels, metadata | `THE RETRO` |
| **Body** | Inter 400/600 | Paragraphs, lists, captions | Regular reading text |
| **Display** | Instrument Serif 400 | Post title, pull quotes, subsection labels (italic) | *Keep* |

## Content Section Structure

### Opening Section (No Label)
```html
<section class="post-section">
    <div class="section-content">
        <p>Your opening paragraphs...</p>
    </div>
</section>
```

### Labeled Sections
```html
<section class="post-section">
    <div class="section-label">Section Name</div>
    <div class="section-content">
        <p>Section content...</p>
    </div>
</section>
```

### Subsections Within a Section
Use `subsection-label` for sub-headings like "Keep", "Drop", "Try":
```html
<section class="post-section">
    <div class="section-label">The Retro</div>
    <div class="section-content">
        <div class="subsection-label">Keep</div>
        <ul>
            <li><strong>Timeboxing.</strong> Explanation here.</li>
        </ul>

        <div class="subsection-label">Drop</div>
        <ul>
            <li>Point here.</li>
        </ul>
    </div>
</section>
```
Subsection labels render as Instrument Serif italic — warm and editorial, clearly subordinate to the green mono section labels.

### Images Between Sections
```html
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description of image">
</figure>
```

With caption:
```html
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description of image">
    <figcaption>Caption text here</figcaption>
</figure>
```

## Content Elements

### Highlighted Text
```html
<mark>This text gets the spring green highlighter effect</mark>
```
Use for key insights or takeaways within paragraphs.

### Pull Quotes
```html
<blockquote class="pull-quote">
    <p>A sentence worth stopping for.</p>
</blockquote>
```
Large Instrument Serif text, centered, with green top/bottom borders. Use sparingly for visual anchors.

### Blockquotes
```html
<blockquote>
    <p>A regular quote or attribution.</p>
</blockquote>
```
Green left border, italic body text, muted color.

### Callouts
```html
<aside class="callout">
    <div class="callout-label">Note</div>
    <p>Callout content here.</p>
</aside>
```

### Inline Code
```html
<code>inline code</code>
```

### Code Blocks
```html
<pre><code>
function example() {
    return true;
}
</code></pre>
```

### Horizontal Rules (Narrative Pause)
```html
<hr>
```
Short centered rule (100px) — acts as a narrative pause, not a UI divider.

### Collapsible Content
```html
<details class="backstory">
    <summary>Backstory</summary>
    <p>Content revealed on click...</p>
</details>
```

### Tables
```html
<table>
    <thead>
        <tr><th>Column A</th><th>Column B</th></tr>
    </thead>
    <tbody>
        <tr><td>Data</td><td>Data</td></tr>
    </tbody>
</table>
```

### Footnotes
```html
<sup class="footnote-ref"><a href="#fn1" id="fnref1">1</a></sup>

<section class="footnotes">
    <ol>
        <li id="fn1"><p>Footnote text. <a href="#fnref1">↩</a></p></li>
    </ol>
</section>
```

### Definition Lists
```html
<dl>
    <dt>Term</dt>
    <dd>Definition of the term.</dd>
</dl>
```

## Post Navigation

At the bottom of every post, add prev/next links:
```html
<nav class="post-nav">
    <a href="previous-post.html" class="post-nav-link prev">
        <span class="post-nav-direction">&larr; Previous</span>
        <span class="post-nav-title">Previous Post Title</span>
    </a>
    <a href="next-post.html" class="post-nav-link next">
        <span class="post-nav-direction">Next &rarr;</span>
        <span class="post-nav-title">Next Post Title</span>
    </a>
</nav>
```
Use empty `<span></span>` as placeholder if there's no prev or next.

## Markdown → HTML Conversion

When processing user markdown:

| Markdown | HTML |
|----------|------|
| `## Section Name` | `<div class="section-label">Section Name</div>` |
| `### Subsection` | `<div class="subsection-label">Subsection</div>` |
| `==text==` | `<mark>text</mark>` |
| `**text**` | `<strong>text</strong>` |
| `*text*` | `<em>text</em>` |
| `[link](url)` | `<a href="url">link</a>` |
| `> quote` | `<blockquote><p>quote</p></blockquote>` |
| `>>> pull quote` | `<blockquote class="pull-quote"><p>text</p></blockquote>` |

## File Naming

- Post file: `lab/posts/{{POST_SLUG}}.html`
- Hero image: `assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png`
- Other images: `assets/blog/{{POST_SLUG}}/descriptive-name.png`

## Image Specifications

- Hero image: 420px wide desktop, 320px tablet, 280px mobile (will scale responsively)
- Content images: Max 540px wide (will scale responsively)
- Format: PNG or JPG
- Optimize for web

## Post-Specific Inline Styles

The only things that go in the post's inline `<style>` block:
- **Header gradient**: The `radial-gradient` colors for `.post-header`
- **Hero animation**: Float/bounce keyframes if needed
- **Hero size overrides**: If the hero image needs a different max-width
- **Figure image overrides**: If content images need a different max-width

Everything else comes from `blog-design-system.css`.

## Notes

- The shared CSS loads after `styles.css` and handles all typography
- Navbar automatically switches to white text over gradient headers
- Share buttons are inline in the meta row
- Mobile responsive breakpoints at 768px and 480px
- 8px spacing grid used throughout (8, 16, 24, 32, 48, 64, 96px)
