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
