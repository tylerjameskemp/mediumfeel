# Publishing a New Lab Post

> **💡 Easy Way:** Just tell Claude Code "I want to publish a new lab post" and follow the conversation. Everything below is handled automatically.
>
> See: [PUBLISH-WORKFLOW.md](PUBLISH-WORKFLOW.md) for the automated publishing process.

---

## Manual Process (if not using Claude Code)

### Quick Start

1. **Copy the template**
   ```bash
   cp _template.html your-post-slug.html
   ```

2. **Calculate read time**
   - Copy post content to word counter
   - Formula: `word count ÷ 200 = minutes` (round up)
   - Or use browser console on the post page:
   ```javascript
   const text = document.querySelector('.post-content').innerText;
   const words = text.split(/\s+/).length;
   console.log(`${Math.ceil(words / 200)} min read`);
   ```

3. **Update all placeholders in HTML**

   **Meta tags (in `<head>`):**
   - `[Post Title]` → Your post title
   - `[Brief description]` → 1-2 sentence summary (150-160 chars for SEO)
   - `[post-slug]` → URL-friendly slug (e.g., "my-new-post")
   - `[YYYY-MM-DD]` → Publication date (format: 2026-01-28)
   - `[Tag 1]`, `[Tag 2]`, `[Tag 3]` → Article tags
   - `[word count]` → Total words in post content (use calculator from step 2)
   - `[X]` → Minutes for read time (in timeRequired: "PT[X]M")

   **Content (in `<body>`):**
   - `Month DD, YYYY` → Formatted date display (e.g., "January 28, 2026")
   - `[X] min read` → Calculated read time (e.g., "7 min read")
   - `POST_TITLE` → Title in header
   - `POST_EXCERPT` → Excerpt/subtitle
   - Status: Choose `status-exploring`, `status-building`, or `status-shipped`

4. **Write your content**
   - Replace placeholder content between `<!-- WRITE YOUR CONTENT HERE -->` and `<!-- END CONTENT -->`

5. **Optional: Create social card**
   - See `/assets/social/README.md` for instructions
   - Size: 1200x630px
   - Or use: `https://mediumfeel.com/assets/logo-playdo.png`

6. **Add to site**
   - Update `/lab/index.html` - add post card to archive grid (newest first)
   - Update `/index.html` - update featured post if this is latest
   - Update `/sitemap.xml` - add new URL entry

7. **Test before publishing**
   - [ ] View post locally
   - [ ] Check on mobile (portrait and landscape)
   - [ ] Verify all links work
   - [ ] Images load properly
   - [ ] Read time displays correctly
   - [ ] Social meta tags filled in

8. **Deploy**
   ```bash
   git add .
   git commit -m "Add new post: [Post Title]"
   git push origin main
   ```

9. **Test social sharing**
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)

---

## Post Status Options

Choose the appropriate status badge for your post:

- `status-exploring` → Green - Early ideas, questions, research
- `status-building` → Yellow - Active development, work in progress
- `status-shipped` → Blue - Completed, launched, published

---

## Optional Features Available

### Table of Contents (for posts >1000 words)
```html
<nav class="table-of-contents">
    <h4>In this post:</h4>
    <ul>
        <li><a href="#section-1">Section Title</a></li>
        <li><a href="#section-2">Section Title</a></li>
    </ul>
</nav>
```

### Callout Boxes
```html
<aside class="callout callout-tip">
    <p><strong>Tip:</strong> Your helpful tip here.</p>
</aside>

<!-- Available types: callout-info, callout-warning, callout-tip -->
```

### Side-by-Side Images
```html
<div class="side-by-side">
    <img src="image1.jpg" alt="Description">
    <img src="image2.jpg" alt="Description">
</div>
```

### Full-Width Images
```html
<img src="image.jpg" alt="Description" class="full-width">
```

### Experiment/Widget Container
```html
<div class="experiment">
    <span class="experiment-label">Try it</span>
    <!-- Your interactive content -->
</div>
```

---

## File Naming Convention

Post slugs should be:
- All lowercase
- Hyphen-separated
- Descriptive but concise
- No special characters

Examples:
- `shipping-the-lab.html` ✅
- `ai-brand-voice.html` ✅
- `Shipping_The_Lab.html` ❌
- `post1.html` ❌

---

## Tips

- **Write first, format later** - Focus on content, then apply HTML structure
- **Keep it simple** - Don't over-engineer. The template handles most styling.
- **Test on real devices** - Simulators don't catch everything
- **Link generously** - Internal and external links add value
- **Use real images** - Placeholder images hurt reading experience
- **Break up text** - Use headings, lists, blockquotes to add visual rhythm
- **Frontload value** - First 2-3 paragraphs should hook the reader

---

## Common Issues

**Social card not showing on LinkedIn**
- Clear LinkedIn cache using Post Inspector
- Verify og:image URL is absolute, not relative
- Image must be 1200x630px
- File size under 300KB

**Read time seems off**
- Double-check word count calculation
- Don't include code blocks or captions in count
- Average is 200 words/min for body text

**Mobile layout broken**
- Check for unclosed HTML tags
- Verify image file paths are correct
- Test in multiple browsers

**Typewriter animation not working**
- Verify typewriter.js is loaded: `<script src="../../assets/js/typewriter.js"></script>`
- Check browser console for errors
- Ensure nav structure matches template
