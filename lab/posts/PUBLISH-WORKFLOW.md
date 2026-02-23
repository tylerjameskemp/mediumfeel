# Publishing Workflow with Claude Code

## Quick Start

Just tell Claude Code:
> "I want to publish a new lab post"

Then follow the conversation. Claude Code will:
1. Ask for your content (paste or file path)
2. Calculate word count and read time automatically
3. Ask a few questions (title, slug, description, tags, status)
4. Generate the complete HTML file with all meta tags and schema
5. Update sitemap.xml
6. Update lab/index.html
7. Commit and push to GitHub

**You write. Claude Code handles the rest.**

---

## Detailed Workflow

### Step 1: Initiate Publishing
Say to Claude Code:
- "I want to publish a new lab post"
- "Help me publish a new post"
- "Let's create a new blog post"

### Step 2: Provide Content
Claude Code will ask for your content. You can:
- **Paste directly** - Copy/paste your written content
- **Point to a file** - "It's in `/path/to/my-draft.txt`"
- **Point to a Google Doc** - Paste the text content

### Step 3: Answer Questions
Claude Code will ask:

**Required:**
- **Title** - "What's the post title?"
  - Claude suggests a slug based on your title
- **Slug** - "Use this slug: `suggested-slug` or provide your own?"
- **Description** - "Brief 1-2 sentence description?" (for SEO/social)
- **Tags** - "What tags?" (Claude suggests based on content)
- **Status** - "Exploring, Building, or Shipped?"

**Optional:**
- **Social card** - "Want to create a custom social card or use logo-playdo?"
- **Custom date** - Defaults to today, can specify different publish date

### Step 4: Review & Confirm
Claude Code will show you:
- Filename: `your-slug.html`
- Word count: `XXX words`
- Read time: `X min read`
- Meta tags preview
- Where it will be added in archive

You confirm: "Looks good!" or request changes

### Step 5: Auto-Publishing
Claude Code will:
1. ✅ Create `/lab/posts/your-slug.html` with:
   - All meta tags (Open Graph, Twitter, Article metadata)
   - Complete Schema.org JSON-LD
   - Your formatted content
   - Navigation and footer
   - Correct read time
2. ✅ Update `/sitemap.xml` with new post URL
3. ✅ Update `/lab/index.html` - add to archive grid (newest first)
4. ✅ Update `/index.html` - if this is newest, update featured post
5. ✅ Git commit with descriptive message
6. ✅ Push to GitHub

**Done. Your post is live.**

---

## What Claude Code Handles Automatically

### ✅ Word Count & Read Time
- Counts actual content words (excludes HTML, navigation)
- Calculates read time: `words ÷ 200 = minutes` (rounded up)
- Fills in both display ("5 min read") and schema ("PT5M")

### ✅ All Meta Tags
- Primary meta (title, description, author)
- Open Graph (og:title, og:image, og:url, etc.)
- Twitter Cards (twitter:title, twitter:image, etc.)
- Article metadata (published_time, author, section, tags)

### ✅ Schema.org Structured Data
- Complete BlogPosting JSON-LD
- All fields filled correctly:
  - headline, description, image
  - author, publisher
  - datePublished, dateModified
  - keywords, articleSection
  - wordCount, timeRequired

### ✅ Slug Generation
- Converts title to URL-friendly format
- Removes special characters
- All lowercase, hyphen-separated
- Example: "My New Post!" → "my-new-post"

### ✅ Date Formatting
- HTML datetime: `2026-01-28`
- Display format: `January 28, 2026`
- Schema ISO format: `2026-01-28T00:00:00Z`

### ✅ Archive Updates
- Adds post card to `/lab/index.html`
- Maintains newest-first order
- Copies status badge, date, title, excerpt
- Adds proper link

### ✅ Featured Post Updates
- If newest post, updates homepage featured section
- Updates status, date, title, excerpt
- Maintains "Latest" badge

### ✅ Sitemap Updates
- Adds new URL to sitemap.xml
- Sets correct priority (0.7 for blog posts)
- Sets changefreq: monthly
- Updates lastmod date

### ✅ Git Workflow
- Stages all changes
- Creates descriptive commit message
- Pushes to main branch
- Includes Co-Authored-By: Claude Sonnet 4.5

---

## Content Formatting

### Paste Raw Content
You can paste plain text and Claude Code will format it with proper HTML:

**You paste:**
```
This is my intro paragraph.

Section Heading
This is body text.

- List item one
- List item two
```

**Claude Code generates:**
```html
<p>This is my intro paragraph.</p>

<h2>Section Heading</h2>
<p>This is body text.</p>

<ul>
    <li>List item one</li>
    <li>List item two</li>
</ul>
```

### Already Have HTML?
Just paste that too. Claude Code will insert it directly.

---

## Example Session

**You:**
> I want to publish a new lab post

**Claude Code:**
> Great! Please paste your content or tell me the file path.

**You:**
> [Pastes 800 words about AI brand voice]

**Claude Code:**
> Got it! I count 800 words, so ~4 min read.
>
> What's the post title?

**You:**
> What Brand Voice Means When AI Writes the First Draft

**Claude Code:**
> Perfect. Suggested slug: `ai-brand-voice-first-draft`
>
> Use that or provide your own?

**You:**
> Use that

**Claude Code:**
> Great! Brief 1-2 sentence description for SEO and social cards?

**You:**
> Exploring how brand voice evolves when AI tools handle the initial writing. What does authenticity mean in an AI-assisted creative process?

**Claude Code:**
> Excellent. Based on your content, I suggest these tags:
> - AI
> - Brand Voice
> - Content Strategy
>
> Use these or different tags?

**You:**
> Those work

**Claude Code:**
> Post status - Exploring, Building, or Shipped?

**You:**
> Exploring

**Claude Code:**
> Perfect! Here's what I'll create:
>
> - **File:** `ai-brand-voice-first-draft.html`
> - **Word count:** 800 words
> - **Read time:** 4 min read
> - **Status:** Exploring
> - **Published:** January 25, 2026
> - **Tags:** AI, Brand Voice, Content Strategy
>
> I'll also:
> - Add complete meta tags and schema
> - Update sitemap.xml
> - Add to lab archive (top of list)
> - Update homepage featured post
>
> Ready to publish?

**You:**
> Yes

**Claude Code:**
> [Creates file, updates all pages, commits, pushes]
>
> ✅ Published! Your post is live at:
> https://mediumfeel.com/lab/posts/ai-brand-voice-first-draft.html
>
> Want to test the social preview?
> - LinkedIn: https://www.linkedin.com/post-inspector/
> - Twitter: https://cards-dev.twitter.com/validator

---

## Tips for Smooth Publishing

### Write Content First
- Write in whatever tool is comfortable (Google Docs, Notes, etc.)
- Don't worry about HTML - just write
- Claude Code will format it properly

### Let Claude Code Suggest
- Slug generation is automatic
- Tag suggestions based on content analysis
- You can always override suggestions

### Review Before Confirming
- Claude Code shows you a preview before creating files
- You can ask to change anything
- No changes are made until you confirm

### One Command Publishes Everything
- No manual sitemap updates
- No manual archive updates
- No manual meta tag writing
- Just approve and it's done

---

## Post-Publishing

After Claude Code pushes to GitHub:

1. **Wait 1-2 minutes** for GitHub Pages to deploy
2. **Visit your post** at the URL Claude provided
3. **Test social sharing:**
   - LinkedIn Post Inspector
   - Twitter Card Validator
4. **Optional:** Create custom social card later (see `/assets/social/README.md`)

---

## Troubleshooting

**"Claude Code didn't update the archive"**
- Say: "Please update lab/index.html with the new post"

**"I want to change something after publishing"**
- Say: "Please update [post-slug].html and change [specific thing]"

**"I forgot to add a tag"**
- Say: "Please add [tag] to the schema and meta tags in [post-slug].html"

**"The read time seems off"**
- Claude Code calculates from actual content words
- You can manually override: "Set read time to X minutes"

---

## What You DON'T Need to Remember

❌ Meta tag syntax
❌ Schema.org format
❌ Word count calculation
❌ Slug formatting rules
❌ Sitemap XML structure
❌ Archive card HTML
❌ Date formatting
❌ Git commands

✅ Just write your content
✅ Answer a few questions
✅ Confirm and publish

---

## Advanced Options

### Backdate a Post
**You:** "I want to publish this with date January 15, 2026"
Claude Code will use that date instead of today.

### Custom Social Card
**You:** "I have a custom social card at `/assets/social/my-card.png`"
Claude Code will use that instead of logo-playdo.png

### Skip Featured Post Update
**You:** "Don't update the homepage featured post"
Claude Code will only update the archive.

### Draft Mode
**You:** "Create the post but don't push to GitHub yet"
Claude Code creates files, you can review, then say "Push it" when ready.

---

## Future Enhancements

Things we could add to this workflow:

- **Image upload handling** - Upload images, Claude optimizes and places them
- **Automatic social card generation** - AI-generated cards from post content
- **Newsletter integration** - Auto-send to email list
- **LinkedIn auto-post** - Share when published
- **Analytics tracking** - UTM parameters for social shares

Let Claude Code know if you want any of these!
