const { test, expect } = require('@playwright/test');
const axePath = require.resolve('axe-core/axe.min.js');

const pages = [
  '/', '/about.html', '/lab/', '/lab/posts/the-chopping-block.html',
  '/lab/posts/the-best-thing-claude-code-taught-me.html',
  '/lab/posts/building-your-own-thinking-tools.html',
  '/lab/posts/shipping-the-lab.html'
];

test.beforeEach(async ({ page }) => {
  // Keep test visits out of production analytics.
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ body: '' }));
});

for (const width of [320, 390, 1280]) {
  test(`all published pages reflow at ${width}px without script errors`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const url of pages) {
      const response = await page.goto(url);
      expect(response.status(), url).toBe(200);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).not.toHaveText(/^\s*\|?\s*$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), url).toBeLessThanOrEqual(width);
      await page.locator('footer').scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${url} after scrolling`).toBeLessThanOrEqual(width);
    }
    expect(errors).toEqual([]);
  });
}

test('mobile menu exposes state and keeps focus visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const url of pages) {
    await page.goto(url);
    const button = page.locator('#navToggle');
    const menu = page.locator('#navLinks');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
    await button.focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('#navLinks')), url).toBe(false);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await page.addScriptTag({ path: axePath });
    const openMenuViolations = await page.evaluate(async () => {
      const result = await window.axe.run('#navLinks', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
      return result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.failureSummary) }));
    });
    expect(openMenuViolations, `${url} open mobile menu`).toEqual([]);
    for (let step = 0; step < 7; step++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => {
        const active = document.activeElement;
        const rect = active.getBoundingClientRect();
        return (active.id === 'navToggle' || !!active.closest('#navLinks')) && rect.left >= 0 && rect.right <= innerWidth;
      }), url).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
    await button.click();
    await page.setViewportSize({ width: 1280, height: 844 });
    await expect(menu).toBeVisible();
    await expect(menu).not.toHaveAttribute('inert', '');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(menu).toBeHidden();
  }
});

test('essential text, navigation and contact work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  for (const url of pages) {
    await page.goto(url);
    await expect(page.getByRole('link', { name: 'Medium Feel home' })).toBeVisible();
    await expect(page.locator('.nav-links a').first()).toBeVisible();
    await expect(page.locator('h1')).not.toHaveText(/^\s*\|?\s*$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), url).toBeLessThanOrEqual(320);
    await page.locator('footer').scrollIntoViewIfNeeded();
    const navContrast = await page.evaluate(() => {
      function luminance(color) {
        const channels = color.match(/[\d.]+/g).slice(0, 3).map(value => Number(value) / 255);
        return channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
          .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      }
      const fg = luminance(getComputedStyle(document.querySelector('.nav-links a')).color);
      const bg = luminance(getComputedStyle(document.querySelector('.navbar')).backgroundColor);
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    });
    expect(navContrast, `${url} no-script navigation after scrolling`).toBeGreaterThanOrEqual(4.5);
  }
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('A lab for brand, marketing');
  await expect(page.locator('[data-contact="email"]')).toHaveAttribute('href', 'mailto:tyler@mediumfeel.com');
  await page.locator('.nav-links a[href="/lab/"]').click();
  await expect(page).toHaveURL(/\/lab\/$/);
  await context.close();
});

test('reading time stays consistent from list to article', async ({ page }) => {
  await page.goto('/lab/');
  const listings = await page.locator('[data-post-slug]').evaluateAll(elements => elements.map(element => ({
    slug: element.dataset.postSlug,
    readTime: element.querySelector('[data-post-field="readTime"]').textContent.trim()
  })));
  expect(listings).toHaveLength(4);
  for (const listing of listings) {
    await page.goto(`/lab/posts/${listing.slug}.html`);
    await expect(page.locator('[data-post-field="readTime"]')).toHaveText(listing.readTime);
    const data = await page.locator('script[type="application/ld+json"]').evaluateAll(elements => elements.map(element => JSON.parse(element.textContent)));
    const article = data.find(item => item['@type'] === 'BlogPosting');
    expect(article.timeRequired).toBe(`PT${parseInt(listing.readTime, 10)}M`);
  }
});

test('published pages have no automated WCAG A or AA violations', async ({ page }) => {
  for (const url of pages) {
    await page.goto(url);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
      return result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
    });
    expect(violations, url).toEqual([]);
  }
});

test('normal-motion bridge stays contained before and during scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/lab/posts/building-your-own-thinking-tools.html');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.locator('#bridge-figure').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#bridge-left')).toHaveCSS('transform', 'none');
  await expect(page.locator('#bridge-right')).toHaveCSS('transform', 'none');
});

test('typewriter keeps a stable accessible message and restores static text on reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const message = 'A lab for brand, marketing, and the questions that sit between them.';
  await expect(page.getByRole('heading', { level: 1, name: message, exact: true })).toBeVisible();
  await expect(page.locator('h1')).toHaveClass(/typewriter-enhanced/);
  await expect(page.locator('#hero-typewriter')).toBeVisible();
  await page.locator('.about-contact-gradient').scrollIntoViewIfNeeded();
  await expect(page.locator('.about-title')).toHaveClass(/typewriter-enhanced/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('h1')).not.toHaveClass(/typewriter-enhanced/);
  await expect(page.locator('.about-title')).not.toHaveClass(/typewriter-enhanced/);
  await expect(page.locator('h1 > .typewriter-static')).toBeVisible();
  await expect(page.locator('.about-title > .typewriter-static')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Medium Feel home' })).toHaveAccessibleName('Medium Feel home');
});
