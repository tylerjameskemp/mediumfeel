# Quick Commands for Claude Code

Use these phrases to trigger common workflows:

## Publishing
- **"I want to publish a new lab post"**
  - Full workflow: content → questions → generation → deploy
  - See: `/lab/posts/PUBLISH-WORKFLOW.md`

- **"Help me publish a new post"**
  - Same as above

- **"Create a draft post"**
  - Creates post but doesn't push to GitHub

## Updates
- **"Update [post-slug] to add [something]"**
  - Makes changes to existing post

- **"Change the featured post on homepage to [post-slug]"**
  - Updates index.html featured section

- **"Add new post to archive"**
  - Manually add to lab/index.html

## Social & SEO
- **"Test social sharing for [post-slug]"**
  - Shows validator links

- **"Create a social card for [post-slug]"**
  - Guides through social card creation

- **"Update sitemap"**
  - Manually regenerates sitemap.xml

## Site Config
- **"Show me site config"**
  - Displays /site-config.json with defaults

- **"Update author info"**
  - Changes name, location, etc. in config

## Analytics & Optimization
- **"Calculate read time for [post-slug]"**
  - Recalculates and updates

- **"Optimize images in [folder]"**
  - Runs pngquant on images

- **"Audit the site"**
  - Checks for broken links, missing meta tags, etc.

## Development
- **"Add [feature] to the site"**
  - Discusses and implements new features

- **"Fix [issue]"**
  - Troubleshoots and resolves problems

---

## Default Values (from site-config.json)

These are auto-filled when publishing posts:
- **Author:** Tyler Kemp
- **Site:** Medium Feel
- **Location:** Portland, Maine
- **Default Image:** logo-playdo.png
- **Article Section:** Brand & Marketing
- **Reading Speed:** 200 words/min

You can change these in `/site-config.json`
