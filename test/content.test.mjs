import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsRoot = path.join(root, 'skills');
const skillNames = [
  'game-quest-designer', 'quest-understand', 'quest-design', 'quest-flow',
  'quest-spec', 'quest-prototype', 'quest-review', 'quest-requirements',
  'quest-collab', 'quest-docs',
];

async function filesBelow(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await filesBelow(target));
    else result.push(target);
  }
  return result;
}

test('repository keeps distributable skills under one canonical directory', async () => {
  const entries = (await fs.readdir(skillsRoot, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
  assert.deepEqual(entries, [...skillNames].sort());
  for (const name of skillNames) {
    await assert.rejects(fs.access(path.join(root, name)), `${name} must not be duplicated at repository root`);
  }
});

test('all skill entrypoints keep matching frontmatter and local markdown links resolve', async () => {
  for (const name of skillNames) {
    const dir = path.join(skillsRoot, name);
    const skill = await fs.readFile(path.join(dir, 'SKILL.md'), 'utf8');
    assert.match(skill, new RegExp(`^---\\r?\\nname: ${name}\\r?$`, 'm'), `${name} frontmatter name`);
    for (const file of (await filesBelow(dir)).filter(value => value.endsWith('.md'))) {
      const source = await fs.readFile(file, 'utf8');
      for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
        let target = match[1].trim().replace(/^<|>$/g, '').split('#')[0];
        if (!target || /^(?:https?:|mailto:)/i.test(target)) continue;
        target = decodeURIComponent(target);
        await assert.doesNotReject(fs.access(path.resolve(path.dirname(file), target)), `${path.relative(root, file)} -> ${target}`);
      }
    }
  }
});

test('professionalization assets and references are shipped by the package', async () => {
  const required = [
    'quest-understand/assets/quest-project-contract-template.md',
    'quest-understand/references/project-contract-example.md',
    'quest-design/references/quest-patterns.md',
    'quest-design/assets/quest-brief-template.md',
    'quest-flow/assets/quest-flow-template.md',
    'quest-spec/assets/quest-implementation-spec-template.md',
    'quest-review/references/quality-rubric.md',
    'quest-review/references/anti-patterns.md',
    'quest-review/assets/quest-review-template.md',
    'quest-requirements/assets/quest-production-requirements-template.md',
    'game-quest-designer/assets/quest-package.example.json',
  ];
  for (const relative of required) await fs.access(path.join(skillsRoot, relative));
  const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  assert.equal(pkg.bin['quest-package-validate'], 'bin/validate-quest-package.mjs');
  assert.ok(pkg.files.includes('skills/'), 'skills directory is distributed');
});
