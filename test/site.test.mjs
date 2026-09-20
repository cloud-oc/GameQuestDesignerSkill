import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');

test('GitHub Pages site contains its published assets', async () => {
  const required = ['index.html', 'styles.css', 'sections.css', 'responsive.css', 'order.css', 'app.js', '.nojekyll', 'assets/quest-icon.svg'];
  await Promise.all(required.map((file) => access(path.join(site, file))));
});

test('site local links resolve and content matches public interfaces', async () => {
  const html = await readFile(path.join(site, 'index.html'), 'utf8');
  const localRefs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((value) => !/^(?:https?:|mailto:)/.test(value));

  await Promise.all(localRefs.map((file) => access(path.join(site, file))));
  assert.match(html, /https:\/\/cloud-oc\.github\.io\/GameQuestDesignerSkill\//);
  assert.match(html, /game-quest-designer-skills@latest/);
  assert.match(html, /quest-package-validate/);
  assert.doesNotMatch(html, /\$quest-(?:structure|logic|write|implement|test|deliver)\b/);
  assert.equal((html.match(/<section\b/g) ?? []).length, (html.match(/<\/section>/g) ?? []).length);
  assert.ok(html.indexOf('</main>') > html.lastIndexOf('<section'), 'all sections should be inside main');
  assert.ok(html.indexOf('</body>') < html.indexOf('</html>'), 'body should close before html');
});

// Check deployed HTML, not just dictionary keys: this catches forgotten rebuilds,
// broken locale links, lost anchors, and incomplete static translations.
test('all locale pages are complete, linked, and match their sources', async () => {
  const { locales, render } = await import('../site/build.mjs');
  const shape = value => Array.isArray(value) ? value.map(shape) : typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)])) : typeof value;
  for (const locale of locales) {
    assert.deepEqual(shape(locale), shape(locales[0]), `${locale.lang}: translation structure`);
    const html = await readFile(path.join(site, locale.file), 'utf8');
    assert.equal(html, render(locale), `${locale.lang}: run npm run build:site after editing translations`);
    assert.ok(html.includes(`<html lang="${locale.lang}">`));
    assert.ok(html.includes(locale.hero[0]));
    assert.ok(!html.includes('undefined'));
    for (const target of locales) {
      assert.ok(html.includes(`href="${target.file}" lang="${target.lang}"`));
      assert.ok(html.includes(`rel="alternate" hreflang="${target.lang}"`));
    }
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'unique IDs');
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `missing anchor: ${match[1]}`);
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (!/^https?:/.test(match[1])) await access(path.join(site, match[1]));
    }
    assert.equal((html.match(/class="skill-card/g) ?? []).length, 10);
    assert.equal((html.match(/<details>/g) ?? []).length, 4);
  }
});
