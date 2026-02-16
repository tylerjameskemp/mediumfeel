/**
 * Post Registry - Single Source of Truth for Post Metadata
 *
 * Define all post metadata here. This registry is used to sync
 * metadata across post pages, lab index, and homepage.
 */

window.POST_REGISTRY = {
  'building-your-own-thinking-tools': {
    title: 'What If You Could Build Your Own Thinking Tools?',
    excerpt: 'After 18 months of AI hype, the dust is starting to settle. The future isn\'t "AI does everything"—it\'s tools that think with you, not for you. What if you could build your own?',
    status: 'exploring',
    statusLabel: 'Exploring',
    dateISO: '2026-02-10',
    dateFormatted: 'February 10, 2026',
    readTime: 6  // fallback; auto-calculated on post pages
  },
  'shipping-the-lab': {
    title: 'Shipping the Lab',
    excerpt: 'The first post is always the hardest. Here\'s why I\'m starting with a lab, what I hope to explore, and how this whole thing came together.',
    status: 'shipped',
    statusLabel: 'Shipped',
    dateISO: '2026-01-31',
    dateFormatted: 'January 31, 2026',
    readTime: 5
  }
};
