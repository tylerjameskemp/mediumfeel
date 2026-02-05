# Blog Post Creation System

## Overview
This document defines the complete system for creating consistently formatted blog posts without manual tweaking.

## Content Structure Rules

### 1. Opening Section (No Label)
- First section after header has NO section-label
- Just dive right into content
```html
<section class="post-section">
    <div class="section-content">
        <p>Opening paragraphs...</p>
    </div>
</section>
```

### 2. Main Sections (Green Uppercase Headers)
- Use section-label for major sections
```html
<section class="post-section">
    <div class="section-label">Section Name</div>
    <div class="section-content">
        <p>Content...</p>
    </div>
</section>
```

### 3. Subsections (Green Uppercase in Content)
- Use bold-only paragraphs for subsections within a section
- These automatically get styled as green uppercase headers
```html
<section class="post-section">
    <div class="section-label">Main Section</div>
    <div class="section-content">
        <p><strong>Subsection A</strong></p>
        <ul>
            <li>Point one</li>
        </ul>

        <p><strong>Subsection B</strong></p>
        <ul>
            <li>Point one</li>
        </ul>
    </div>
</section>
```

### 4. Images Between Sections
```html
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description">
</figure>
```

### 5. Last Section (What's Next)
- Automatically gets smaller font size
- No special markup needed

## Typography Rules

### Bold Text
- **In paragraphs**: Dark gray (`var(--gray-900)`)
- **In lists**: Dark gray (e.g., "**Timeboxing.** Explanation")
- **As only child of paragraph**: Green uppercase header (subsection)

### Highlights
- Use `<mark>` tags for spring green highlighter effect
- Only for key insights/takeaways

### Italics
- Use `<em>` for emphasis

### Links
- Green color with underline
- Use relative paths for internal links

## Markdown → HTML Conversion

When processing user markdown, convert:

| Markdown | HTML |
|----------|------|
| `## Section Name` | `<div class="section-label">Section Name</div>` |
| `### Subsection` | `<p><strong>Subsection</strong></p>` |
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
   - Reference existing images: `../../assets/blog/image-name.png`

## Special Features

### Collapsible Backstory
```html
<details class="backstory">
    <summary>Backstory</summary>
    <p>Content...</p>
</details>
```

### Hero Animation
- Balloons automatically bob with float animation
- No special markup needed

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

2. I convert to proper HTML structure:
   - Parse section headers
   - Create section-label divs
   - Convert subsections to bold paragraphs
   - Place images
   - Apply all styling

3. Save images to correct locations

4. Generate complete HTML file

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
- `{{CONTENT_SECTIONS}}` - All converted sections

## Checklist Before Publishing

- [ ] All section-labels are uppercase green monospace
- [ ] Subsections use bold-only paragraphs (auto-styled)
- [ ] Bold text in content is dark gray
- [ ] Highlights use `<mark>` tags
- [ ] Images saved to correct paths
- [ ] Hero image has float animation
- [ ] Nav font is serif
- [ ] Last section (What's Next) is smaller
- [ ] Share buttons inline in meta
- [ ] All URLs are correct
