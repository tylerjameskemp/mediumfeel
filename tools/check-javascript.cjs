const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'about.html', 'lab/index.html', 'lab/posts/_template.html', 'lab/templates/blog-post-template.html'];
pages.push(...fs.readdirSync(path.join(root, 'lab/posts')).filter(name => name.endsWith('.html') && !name.startsWith('_')).map(name => `lab/posts/${name}`));
let count = 0;
for (const file of pages) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=|application\/ld\+json/i.test(match[1])) continue;
    new vm.Script(match[2], { filename: `${file}:inline-script` });
    count++;
  }
}
for (const file of fs.readdirSync(path.join(root, 'assets/js')).filter(name => name.endsWith('.js'))) {
  new vm.Script(fs.readFileSync(path.join(root, 'assets/js', file), 'utf8'), { filename: file });
  count++;
}
console.log(`JavaScript syntax passed: ${count} scripts.`);
