/**
 * Post Registry - Single Source of Truth for Post Metadata
 *
 * Define all post metadata here. This registry is used to sync
 * metadata across post pages, lab index, and homepage.
 */

window.POST_REGISTRY = {
  'the-chopping-block': {
    title: 'What I Didn\'t Build Told Me More Than What I Did',
    excerpt: 'Everything I parked pointed at the same problem.',
    status: 'building',
    statusLabel: 'Building',
    dateISO: '2026-02-23',
    dateFormatted: 'February 23, 2026',
    readTime: 3
  },
  'the-best-thing-claude-code-taught-me': {
    title: 'The Best Thing Claude Code Taught Me Was Something I Already Knew',
    excerpt: 'The most valuable thing I built wasn\'t code. It was a list of everything I didn\'t build.',
    status: 'building',
    statusLabel: 'Building',
    dateISO: '2026-02-16',
    dateFormatted: 'February 16, 2026',
    readTime: 4
  },
  'building-your-own-thinking-tools': {
    title: 'I\'ve Spent My Career on Other People\'s Projects. Here\'s What Happened When I Started Building My Own.',
    excerpt: 'The entry point wasn\'t technical. It was the work I already do.',
    status: 'exploring',
    statusLabel: 'Exploring',
    dateISO: '2026-02-10',
    dateFormatted: 'February 10, 2026',
    readTime: 6  // fallback; auto-calculated on post pages
  },
  'shipping-the-lab': {
    title: 'Shipping the Lab: A Build Log',
    excerpt: 'How I built and shipped the Medium Feel website in a half-day using Claude Code, with no coding experience. This is the first documented experiment.',
    status: 'shipped',
    statusLabel: 'Shipped',
    dateISO: '2026-01-31',
    dateFormatted: 'January 31, 2026',
    readTime: 5
  }
};
