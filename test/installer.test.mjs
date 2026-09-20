import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const cli = fileURLToPath(new URL('../bin/quest-skills.mjs', import.meta.url));
const source = fileURLToPath(new URL('../skills/quest-design/SKILL.md', import.meta.url));

async function workspace(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'quest-install-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const dest = path.join(root, 'skills');
  const run = (...args) => spawnSync(process.execPath, [cli, ...args, '--dest', dest], { encoding: 'utf8' });
  return { root, dest, run };
}

test('all packages install with references and repeated install preserves edits', async t => {
  const { dest, run } = await workspace(t);
  assert.equal(run('install').status, 0);
  assert.equal((await fs.readdir(dest)).length, 10);
  await fs.access(path.join(dest, 'quest-spec/references/runtime-contracts.md'));
  const custom = path.join(dest, 'quest-design/SKILL.md');
  await fs.writeFile(custom, 'local customization');
  assert.equal(run('install').status, 0);
  assert.equal(await fs.readFile(custom, 'utf8'), 'local customization');
});

test('update preserves complete old directory, removes stale files, and is idempotent', async t => {
  const { dest, run } = await workspace(t);
  assert.equal(run('install', 'quest-design').status, 0);
  await fs.writeFile(path.join(dest, 'quest-design/SKILL.md'), 'my design');
  await fs.writeFile(path.join(dest, 'quest-design/custom.txt'), 'my extra file');
  const update = run('update');
  assert.equal(update.status, 0, update.stderr);
  const backup = update.stdout.match(/^backup: (.+)$/m)[1];
  assert.equal(await fs.readFile(path.join(backup, 'SKILL.md'), 'utf8'), 'my design');
  assert.equal(await fs.readFile(path.join(backup, 'custom.txt'), 'utf8'), 'my extra file');
  assert.equal(await fs.readFile(path.join(dest, 'quest-design/SKILL.md'), 'utf8'), await fs.readFile(source, 'utf8'));
  await assert.rejects(fs.access(path.join(dest, 'quest-design/custom.txt')));
  assert.equal((await fs.readdir(dest)).length, 1);
  const again = run('update');
  assert.equal(again.status, 0);
  assert.match(again.stdout, /unchanged: quest-design/);
  assert.doesNotMatch(again.stdout, /backup:/);
});

test('dry-run does not create destination and invalid selections fail before writes', async t => {
  const { dest, run } = await workspace(t);
  assert.equal(run('install', '--dry-run').status, 0);
  await assert.rejects(fs.access(dest));
  assert.equal(run('install', '../outside').status, 1);
  assert.equal(run('update', 'quest-design').status, 1);
  await assert.rejects(fs.access(dest));
});

test('symlink target is not followed or replaced', async t => {
  const { root, dest, run } = await workspace(t);
  const outside = path.join(root, 'outside');
  await fs.mkdir(outside);
  await fs.writeFile(path.join(outside, 'mine'), 'keep');
  await fs.mkdir(dest);
  await fs.symlink(outside, path.join(dest, 'quest-design'), 'junction');
  assert.equal(run('update', 'quest-design').status, 1);
  assert.equal(await fs.readFile(path.join(outside, 'mine'), 'utf8'), 'keep');
});

test('existing lock blocks writes and remains owned by its creator', async t => {
  const { dest, run } = await workspace(t);
  await fs.mkdir(dest);
  await fs.writeFile(path.join(dest, '.quest-skills.lock'), 'other process');
  assert.equal(run('install', 'quest-design').status, 1);
  assert.deepEqual(await fs.readdir(dest), ['.quest-skills.lock']);
});
