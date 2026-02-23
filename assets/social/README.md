# Social Media Cards

This directory contains social media preview images (Open Graph/Twitter Cards) for sharing posts on LinkedIn, Twitter, Facebook, etc.

## Image Requirements

- **Size:** 1200 x 630 pixels
- **Aspect Ratio:** 1.91:1
- **Format:** PNG or JPG
- **File Size:** < 300KB (optimize with pngquant)
- **Naming:** Use post slug (e.g., `shipping-the-lab.png`)

## Creating New Social Cards

### Option 1: Use ChatGPT/DALL-E
```
Create a 1200x630px social media card for LinkedIn/Twitter with:
- Green gradient background (#5B8F4A to #97CA78)
- Main text in large white serif font: "[Your Post Title]"
- Subtitle in smaller white text: "[Brief description]"
- Include the Medium Feel Play-Doh style logo in the bottom right corner
- Clean, minimal design
```

### Option 2: Use Canva
1. Select "Custom Size" → 1200 x 630 px
2. Use brand colors (green: #5B8F4A, light green: #97CA78)
3. Add post title in large text
4. Add Medium Feel branding
5. Export as PNG

### Option 3: Use Figma
Use the template at: [Add Figma link when created]

## Testing Your Social Cards

Before publishing, test your social cards:
- **LinkedIn:** https://www.linkedin.com/post-inspector/
- **Twitter:** https://cards-dev.twitter.com/validator
- **Facebook:** https://developers.facebook.com/tools/debug/

## Updating HTML

When you create a new social card, update the post's meta tags:

```html
<meta property="og:image" content="https://mediumfeel.com/assets/social/your-post-slug.png">
<meta name="twitter:image" content="https://mediumfeel.com/assets/social/your-post-slug.png">
```
