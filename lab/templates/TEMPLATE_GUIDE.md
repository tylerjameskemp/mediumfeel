# Blog Post Template Guide

## Quick Start

Use this template to create new blog posts. Replace all `{{VARIABLES}}` with your content.

## Required Variables

### Meta Information
- `{{POST_SLUG}}` - URL-friendly version of title (e.g., "building-your-own-thinking-tools")
- `{{TITLE}}` - Full post title
- `{{TITLE_ENCODED}}` - URL-encoded version for sharing (spaces as %20)
- `{{EXCERPT}}` - 1-2 sentence summary (shown in header and meta tags)
- `{{STATUS}}` - One of: Exploring, Building, Thinking, Shipping
- `{{DATE_ISO}}` - ISO format date (e.g., "2026-02-05")
- `{{DATE_FORMATTED}}` - Readable date (e.g., "February 5, 2026")
- `{{READ_TIME}}` - Estimated minutes to read
- `{{HERO_ALT}}` - Alt text for hero image

### Content
- `{{CONTENT_SECTIONS}}` - All your post sections (see structure below)

## Content Section Structure

### Opening Section (No Label)
```html
<!-- SECTION: Opening -->
<section class="post-section">
    <div class="section-content">
        <p>Your opening paragraphs...</p>
    </div>
</section>
```

### Labeled Sections
```html
<!-- SECTION: Section Name -->
<section class="post-section">
    <div class="section-label">Section Name</div>
    <div class="section-content">
        <p>Section content...</p>
    </div>
</section>
```

### Images Between Sections
```html
<!-- FIGURE -->
<figure class="post-figure">
    <img src="../../assets/blog/{{POST_SLUG}}/image-name.png"
         alt="Description of image">
</figure>
```

### Last Section (What's Next)
The last section automatically gets smaller font size. No special markup needed.

## Content Formatting

### Highlighted Text
```html
<mark>This text gets the spring green highlighter effect</mark>
```

### Italics
```html
<em>Emphasized text</em>
```

### Bold (Regular - Dark Gray)
```html
<strong>Important text</strong>
```

### Bold (In Lists - Same as Above)
Bold text in lists (like "Timeboxing.") stays dark gray for readability.

### Subsection Headers
When you need subsections within a section (like "Keep", "Drop", "Try"):
```html
<p><strong>Subsection Name</strong></p>
```
These will automatically style as uppercase green monospace headers.

### Links
```html
<a href="shipping-the-lab.html">Link text</a>
```

## Example Usage

When you want to create a new post, provide:

1. **Post metadata:**
   - Title: "My New Post"
   - Slug: "my-new-post"
   - Status: "Exploring" (or "Building", "Thinking", "Shipped")
   - Date: "February 10, 2026"
   - Read time: "5"
   - Excerpt: "A short summary of what this post is about."

2. **Hero image:**
   - Provide the image file
   - I'll save it to: `assets/blog/my-new-post/hero-my-new-post.png`
   - Alt text: "Description"

3. **Content with markup indicators:**

   Provide your content with these markup indicators:
   - `**text**` for bold (dark gray)
   - `*text*` for italics
   - `==text==` for highlighted text (spring green)
   - `### Subsection Name` for subsections (will become green uppercase headers)

   Example:
   ```
   Opening paragraph with ==highlighted important point== and *emphasis*.

   ## Section One

   Content here with **bold text** for emphasis.

   ### Subsection A
   - Point one
   - **Key term.** Explanation here

   ### Subsection B
   - Another point
   ```

4. **Images:**
   - Provide image files with descriptive names
   - Indicate where they should go in the content
   - I'll handle placement and paths

## File Naming

- Post file: `lab/posts/{{POST_SLUG}}.html`
- Hero image: `assets/blog/{{POST_SLUG}}/hero-{{POST_SLUG}}.png`
- Other images: `assets/blog/{{POST_SLUG}}/descriptive-name.png`

## Image Specifications

- Hero image: 320px wide (will scale responsively)
- Content images: Max 540px wide (will scale responsively)
- Format: PNG or JPG
- Optimize for web

## Quick Post Creation Workflow

To create a new post, just give me:

1. A markdown-style document with your content using:
   - `## Section Name` for main sections
   - `### Subsection` for subsections
   - `==text==` for highlights
   - `**text**` for bold, `*text*` for italic

2. The hero image file

3. Any inline images with placement notes

I'll handle:
- Converting to the template structure
- Saving images to the right locations
- Applying all the styling correctly
- Creating proper section-label divs
- Converting markup to HTML

## Notes

- The template includes the animated gradient header with fixed grid overlay
- Navbar fades in/out on scroll automatically
- Share buttons are inline in the meta row
- All CSS is included in the template
- Mobile responsive breakpoints at 768px and 480px
- Balloons in hero float with subtle animation (if applicable)
