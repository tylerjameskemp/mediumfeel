const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tools/browser-tests',
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.SITE_TEST_URL || 'http://127.0.0.1:4173',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: process.env.SITE_TEST_URL ? undefined : {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    stdout: 'ignore',
    stderr: 'ignore',
    reuseExistingServer: !process.env.CI
  }
});
