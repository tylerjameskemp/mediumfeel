# Medium Feel: Design System Process Document

A chronological record of how the Medium Feel website and blog design system evolved — from initial launch to the current design system extraction. Written as a reference for future development and potential blog content.

---

## Phase 1: Launch (January 21, 2026)

**Commit:** `87a9673` — Launch new Medium Feel site with lab/blog structure

The site shipped in a single half-day sprint. One HTML file, no frameworks, free hosting on GitHub Pages. Claude Code with Opus 4.5, running in Terminal.

The initial architecture was intentionally minimal:
- Single `index.html` with all sections inline
- `styles.css` for the entire site
- Lab section as a kanban-style card layout (Building / Shipped columns)
- First blog post ("Shipping the Lab") embedded as the first experiment

**Key decision:** Ship a "transitional site" — not a portfolio, a lab. The language mattered. Calling it transitional gave permission to iterate without perfection anxiety.

**Design choices made in this sprint:**
- Green color palette (`#5B8F4A` base)
- Three typefaces: Instrument Serif (display), Inter (body), JetBrains Mono (labels/code)
- Gradient header on blog posts (radial gradient, green spectrum)
- AI-generated placeholder assets (OpenAI, Gemini)

---

## Phase 2: Visual Identity & Polish (January 22–24, 2026)

A rapid series of visual experiments, many of which were tried and reverted. This phase was about finding the visual voice.

### What stuck:
- **Typewriter animation** in the navbar (`1a59702`, `4af9e6b`) — "Medium Feel" types out letter by letter, became a signature element, extended to all pages
- **Spinning peppermint candy** divider (`b7975ab`) — replaced a vinyl record that didn't land
- **Distressed sticker logo** (`e60e899`) — replaced a polaroid-style treatment
- **Grid background** for the lab section (`3e47595`) — subtle visual texture
- **Diagonal gradient** on About section (`c52d7a3`, `47e9abb`)

### What didn't stick:
- Vinyl record divider → replaced by peppermint candy
- Polaroid image treatment → replaced by distressed sticker
- Wiggling sticker divider → added then removed (`f7b697b` → `d0cb5df`)
- CTA and footer restyling → reverted (`854b177` → `b6d5702`)
- Hero crayon image → replaced by Play-Doh (`c918da3`)
- Oval badge for featured post → reverted (`16ad7f6`)

### Pattern observed:
The reverts reveal a "try fast, revert faster" rhythm. Several changes were made and backed out within hours. This is the iteration model working as intended — the willingness to revert is as important as the willingness to ship.

**Lesson:** Visual experiments are cheap when you have version control. The cost of trying something is nearly zero. The cost of deliberating is measured in days not shipped.

---

## Phase 3: Infrastructure & SEO (January 25, 2026)

A single focused day shifting from visual polish to publishing infrastructure.

**Commits:** `a080ba3` through `a5ccbd8`

### What was built:
- `sitemap.xml` and `robots.txt` (`a080ba3`)
- Google Analytics 4 tracking on all pages (`2066fb1`)
- Schema.org structured data on blog posts (`db760bd`)
- Social sharing meta tags (Open Graph, Twitter Cards) (`1bb4ad6`, `d854cbe`)
- RSS feed (`a751e2a`)
- Social share buttons on posts (`a751e2a`)
- "Frictionless publishing workflow" with Claude Code (`a5ccbd8`)

### Key insight:
This was entirely about discoverability and distribution — making the content findable and shareable. None of this is visible to a casual reader, but it's the connective tissue that lets the lab function as a public experiment rather than a local file.

**Lesson:** Infrastructure days aren't glamorous but they compound. Every post published after this day automatically gets structured data, social cards, and RSS distribution.

---

## Phase 4: Content & Second Post (February 3–5, 2026)

**Commits:** `d55e1b3`, `8ed55ee`

- Updated works in progress on the kanban board
- Published second blog post: "What If You Could Build Your Own Thinking Tools?"

The second post was longer, more personal, and structurally richer (more sections, figures, pull quotes). This exposed limitations in the ad-hoc CSS approach — each post was essentially re-implementing its own styles.

---

## Phase 5: Design System Extraction (February 5–6, 2026 — In Progress)

This is where the real architectural work began. The trigger: writing a second blog post revealed that the "styles are inline per post" approach wouldn't scale.

### 5a. Initial extraction

Created `lab/blog-design-system.css` — a shared stylesheet for all blog posts defining:

**Three-voice typography system:**
- **JetBrains Mono 600** — Section labels, meta text, status badges. The "system voice." Uppercase, letterspaced, small.
- **Inter 400/600** — Body text at 17px, lists, callouts. The "clear voice." Readable, neutral, gets out of the way.
- **Instrument Serif 400** — Titles, excerpts, subsection labels (italic), pull quotes. The "expressive voice." Warm, editorial.

**Spacing system:** 8px grid (8, 16, 24, 32, 48, 64, 96px increments)

**Content elements documented:**
- Section labels and subsection labels
- Figures with optional captions
- Blockquotes and pull quotes
- Callouts with labels
- Highlighted text (`<mark>`)
- Collapsible backstory sections
- Post navigation
- Code blocks

**Supporting files created:**
- `lab/templates/blog-post-template.html` — Boilerplate for new posts
- `lab/templates/TEMPLATE_GUIDE.md` — Quick reference
- `lab/templates/POST_CREATION_SYSTEM.md` — Full documentation
- `lab/templates/design-system-sampler.html` — Visual preview of all elements
- `lab/templates/hierarchy-sampler.html` — Typography scale comparison

### 5b. The specificity crisis

**Problem:** After extracting styles into `blog-design-system.css`, the blog posts looked broken. The navbar was invisible (green text on green gradient), the title was too small, fonts were inconsistent, spacing was wrong.

**Root causes diagnosed:**

1. **Broken navbar selector.** The CSS used `.post .navbar:not(.scrolled)` to make nav text white over the gradient. But the DOM structure is:
   ```
   <body>
     <nav class="navbar">      ← sibling of .post
     <article class="post">    ← sibling of .navbar
   ```
   `.post .navbar` means "a .navbar INSIDE .post" — which never matches because they're siblings, not parent-child.

2. **Specificity ties.** `styles.css` and `blog-design-system.css` both defined rules at the same specificity level (e.g., `.post-header h1`). When specificity is equal, the last-loaded stylesheet wins — but only property by property. This created a frankenstein result where some properties came from one file and some from the other.

3. **CSS variable conflicts.** Both files defined `--space-sm`, `--space-md`, etc. with different values (8px vs 16px). Whichever loaded last would silently override the other.

**Solution:** Added `class="blog-post"` to `<body>` on all post pages. Prefixed every rule in the design system with `body.blog-post`, giving them higher specificity than `styles.css` rules without needing `!important`. Switched from shared CSS variable names to direct values to avoid token conflicts.

**Lesson:** CSS specificity is the silent enemy of component extraction. When moving from monolithic to modular CSS, you need a clear specificity strategy from the start — not after things break.

### 5c. The header design crisis

With specificity fixed, the design system was technically working — but the header still felt wrong:

- Title too small and broke awkwardly across lines
- Meta line (status, date, read time, share buttons) looked jangled — different fonts, sizes, spacing
- Excerpt was small and hard to read over the gradient
- Share buttons rendered as ovals instead of circles
- Transition from gradient header to white body was abrupt — "makes the body text feel really big and really plain"

**First attempts (rejected):**
- Header fade: Added a white gradient `::after` at the bottom of the header → "feels kind of weird"
- Larger first paragraph: Bumped the opening paragraph size to bridge the energy drop → didn't address the real issue

**Key feedback that changed direction:** "I'm not pleased with some of the stuff that you're trying. You're just reacting with solutions. We're trying to figure out the system here."

This was the inflection point. Instead of patching individual symptoms, the approach shifted to rethinking the header layout structurally.

### 5d. Transition sampler and Option D

Built `lab/templates/transition-sampler.html` with four different approaches to the header-to-body transition:

**Option A: Excerpt as bridge**
Move the excerpt below the gradient into a gray-background zone. Creates a visual stepping stone.
→ Rejected. "Introduces weird new formatting details. The gray bars aren't working."

**Option B: Overlapping card**
Excerpt in a white card with drop shadow that overlaps the gradient boundary.
→ Interesting but "the white box over white is strange, the drop shadow isn't enough."

**Option C: Share bar divider**
Excerpt plus share buttons as a structural divider strip between header and body.
→ "Maybe closest to working."

**Option D: Image-only gradient, text below** ← Current direction
The gradient zone becomes purely visual — just the hero image floating over color. ALL text (status label, title, excerpt, date, share) moves below onto white.

The title uses animated gradient text (`background-clip: text` with the same gradient as the header, slowly shifting via CSS animation). This carries the gradient's energy into the typography without requiring text legibility over a colored background.

**Why Option D works as a system:**
- Any gradient color works — no text legibility concerns over colored backgrounds
- Hero image is the only variable in the gradient zone
- Title carries the gradient energy via `background-clip: text`
- Pull quotes use the same animated gradient treatment → design signature
- Every post gets a hero image over the gradient → "goes with the article/lab/repository theme"
- Could swap gradient for a static image if desired → maximum flexibility

### 5e. Animated gradient text as design signature

The sampler also compared animated vs. static pull quotes. The animated gradient text (`background-clip: text` + `animation: gradShift 12s ease-in-out infinite`) was immediately compelling.

This creates a "living typography" effect where the gradient slowly breathes through the text. Used for:
- Post titles (in the Option D layout)
- Pull quotes within articles

**Technical implementation:**
```css
.gradient-title {
    background: radial-gradient(/* same stops as header */);
    background-size: 200% 200%;
    animation: gradShift 12s ease-in-out infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

---

## Design Decisions Log

| Decision | Chosen | Rejected | Why |
|----------|--------|----------|-----|
| Typography system | Three voices (Mono/Sans/Serif) | Single typeface | Each voice serves a clear role; hierarchy through contrast |
| Specificity strategy | `body.blog-post` prefix | `!important`, restructure DOM | Clean, predictable, no DOM changes needed |
| Header layout | Image-only gradient + text below (Option D) | Text over gradient (original) | System flexibility — any gradient works, no legibility issues |
| Header transition | Animated gradient title carries energy | Fade overlay, larger first paragraph | Structural solution > band-aid; creates design signature |
| Share buttons | Bare glyphs (no circles) | Circular icons | Circles kept rendering as ovals; glyphs are simpler and scale better |
| Pull quotes | Animated gradient text | Static dark green | "Feels really compelling" — creates visual continuity with header |
| Subsection labels | `<div class="subsection-label">` | `<p><strong>` | Proper semantic markup, styled by design system |
| Spacing grid | 8px base | Arbitrary values | Consistent rhythm, easy mental math |

---

## System Constraints Identified

These are limitations and considerations surfaced during the design process:

1. **Gradient parameterization.** The green gradient is currently hardcoded. Different posts with different gradient colors would need the animated gradient text colors to match. The `background-clip: text` treatment pulls its gradient from an explicit `background` property, so each post would need its gradient defined once and referenced in both the header and the text treatment.

2. **Mobile gradient text.** At very small sizes, animated gradient text can look muddy or lose contrast. May need a solid-color fallback below a certain breakpoint.

3. **`styles.css` coexistence.** The base `styles.css` still defines `.post-*` selectors with its own opinions. The `body.blog-post` prefix wins, but any new properties added to `styles.css` could still leak through if not explicitly overridden.

4. **Hero image requirement.** Option D assumes every post has a hero image. This was confirmed as intentional ("Every post will have a hero image"), but it's worth noting as a constraint.

5. **Browser support.** `-webkit-background-clip: text` is widely supported but technically non-standard. The standard `background-clip: text` should always accompany it.

6. **Animation performance.** The gradient animation (`background-size: 200% 200%` + `animation`) is lightweight but runs continuously. On pages with multiple animated elements (title + pull quotes), this should be tested on lower-end devices.

---

## Process Observations & Opportunities

### What worked well:

- **Sampler pages.** Building standalone HTML pages to compare options side-by-side was more productive than describing options in words. The transition sampler (Options A–D) led directly to a design decision that words alone couldn't resolve.

- **Try-and-revert rhythm.** Especially in Phase 2, the willingness to try visual experiments and revert them quickly kept momentum high. Version control makes experimentation free.

- **Extracting the system after the second post.** Waiting until there were two real posts before extracting shared styles meant the system was grounded in actual content, not hypothetical needs.

- **Pushing back on band-aids.** The "step back and get perspective" moment was crucial. Patching symptoms (larger text, fade overlays) wasn't addressing the structural issue. Stepping back to rethink the layout produced a fundamentally better solution.

### What could improve:

- **Design system from the start.** The specificity crisis could have been avoided by establishing the `body.blog-post` prefix strategy before writing any blog CSS. Retrofitting specificity is harder than designing it upfront.

- **Naming the voices earlier.** The three-voice typography system (system/clear/expressive) became clearer once it was documented, but the early commits show a lot of font-size thrashing that might have been avoided with explicit voice definitions from day one.

- **Screenshot-driven iteration.** The most productive debugging happened when screenshots were shared and discussed. Making "share a screenshot" a default step in every design review would catch issues faster.

- **Document decisions as they happen.** Much of this document was reconstructed from commit messages and conversation memory. A running decisions log (even just a bullet list) would be easier to maintain in real-time and more reliable than reconstruction.

- **Separate "exploring" from "implementing."** The most productive pattern was: explore options in a sampler → decide → implement. The least productive pattern was: implement a fix → get feedback → implement another fix → get more feedback. The sampler approach front-loads the decision-making.

### For future blog posts about this process:

- The CSS specificity crisis is a concrete, relatable story about what happens when you extract components from a monolith
- The "three voices" typography system could be its own short post about intentional type hierarchy
- The transition from "reacting with solutions" to "thinking about the system" is a product-thinking lesson that applies beyond web design
- The try-and-revert rhythm of Phase 2 illustrates how version control changes the economics of experimentation
- Option D's evolution (from text-over-gradient to image-only-gradient) shows how constraints (legibility, gradient flexibility) drive better architecture

---

## Current State (February 6, 2026)

### Implemented:
- Shared `blog-design-system.css` with `body.blog-post` prefix strategy
- Three-voice typography system
- All content elements (sections, figures, quotes, callouts, etc.)
- Template and documentation files
- Sampler pages for design comparison

### In progress:
- Option D layout (image-only gradient, text below with animated gradient title) — prototyped in sampler, not yet applied to actual posts
- Animated gradient pull quote — confirmed as design direction, not yet in production CSS
- Removing rejected band-aids from CSS (header fade, first-paragraph bump)
- Share button simplification (circles → bare glyphs)

### Next steps:
1. Implement Option D layout in `blog-design-system.css` and update both posts
2. Add animated gradient text treatment to the design system (titles + pull quotes)
3. Remove header fade `::after` and first-paragraph size bump from CSS
4. Simplify share buttons to bare glyphs
5. Update template and documentation to reflect new layout
6. Test on mobile for gradient text legibility
