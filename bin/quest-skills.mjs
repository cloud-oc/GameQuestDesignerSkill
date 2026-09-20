#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const skillsRoot = path.join(packageRoot, 'skills');
const names = [
  'game-quest-designer', 'quest-understand', 'quest-design', 'quest-flow',
  'quest-spec', 'quest-prototype', 'quest-review', 'quest-requirements',
  'quest-collab', 'quest-docs',
];
const help = `quest-skills <install|update|list> [skill ...] [--dest PATH] [--dry-run]

install   Install all skills, or only named skills. Existing directories are skipped.
update    Update installed skills only, or named installed skills. Back up changes.
list      List bundled skills and installation status.
--dest    Default: $CODEX_HOME/skills or ~/.codex/skills
--dry-run Show planned actions without writing files.

Updates replace each skill directory and preserve the old copy in a backup.
Updates are per skill, not a transaction across the full collection.
Local changes are backed up, not merged. No network access is performed here.
`;

async function stat(p) {
  try { return await fs.lstat(p); }
  catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}

async function digest(dir) {
  const hash = createHash('sha256');
  async function walk(p, rel = '') {
    const entries = await fs.readdir(p, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const key = path.join(rel, entry.name);
      hash.update(JSON.stringify([key, entry.isDirectory() ? 'dir' : 'file']));
      if (entry.isSymbolicLink()) throw new Error(`Refusing symlink: ${path.join(p, entry.name)}`);
      if (entry.isDirectory()) await walk(path.join(p, entry.name), key);
      else if (entry.isFile()) hash.update(await fs.readFile(path.join(p, entry.name)));
      else throw new Error(`Unsupported file: ${key}`);
    }
  }
  await walk(dir);
  return hash.digest('hex');
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log(help); return;
  }
  const command = args.shift();
  if (!['install', 'update', 'list'].includes(command)) throw new Error(`Unknown command: ${command}`);
  let dest = path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills');
  let dry = false;
  const selected = [];
  while (args.length) {
    const arg = args.shift();
    if (arg === '--dry-run') dry = true;
    else if (arg === '--dest') {
      const value = args.shift();
      if (!value || value.startsWith('--')) throw new Error('--dest requires a path');
      dest = value;
    } else if (names.includes(arg)) selected.push(arg);
    else throw new Error(`Unknown skill or option: ${arg}`);
  }
  dest = path.resolve(dest);
  // Never permit installing into the package itself.
  const resolvedDest = await fs.realpath(dest).catch(e => {
    if (e.code === 'ENOENT') return dest;
    throw e;
  });
  if (resolvedDest === packageRoot.slice(0, -1) || resolvedDest.startsWith(packageRoot)) {
    throw new Error('Choose a destination outside the source package');
  }
  const plan = [];
  for (const name of [...new Set(selected.length ? selected : names)]) {
    const target = path.join(dest, name);
    const existing = await stat(target);
    if (existing && (!existing.isDirectory() || existing.isSymbolicLink())) {
      throw new Error(`Target must be a real directory: ${target}`);
    }
    let action;
    if (command === 'list') action = existing ? 'installed' : 'not installed';
    else if (command === 'install') action = existing ? 'skip existing' : 'install';
    else if (!existing) {
      if (selected.length) throw new Error(`${name} is not installed; use install first`);
      action = 'skip not installed';
    } else {
      const sourceHash = await digest(path.join(skillsRoot, name));
      action = sourceHash === await digest(target) ? 'unchanged' : 'update';
    }
    if (action === 'install' || action === 'update') {
      await fs.access(path.join(skillsRoot, name, 'SKILL.md'));
      await digest(path.join(skillsRoot, name));
    }
    plan.push({ name, target, action });
  }
  for (const item of plan) console.log(`${dry ? '[dry-run] ' : ''}${item.action}: ${item.name}`);
  const writes = plan.filter(p => ['install', 'update'].includes(p.action));
  if (dry || !writes.length) return;
  await fs.mkdir(dest, { recursive: true });
  const lock = path.join(dest, '.quest-skills.lock');
  const handle = await fs.open(lock, 'wx').catch(e => {
    if (e.code === 'EEXIST') throw new Error(`Installer lock exists: ${lock}. Check for another running installer before removing a stale lock.`);
    throw e;
  });
  try {
    for (const item of writes) {
      const stage = await fs.mkdtemp(path.join(dest, '.quest-stage-'));
      const stagedSkill = path.join(stage, item.name);
      let backup;
      try {
        await fs.cp(path.join(skillsRoot, item.name), stagedSkill, { recursive: true, errorOnExist: true, force: false });
        const current = await stat(item.target);
        if (item.action === 'install' && current) throw new Error(`Target appeared during install: ${item.target}`);
        if (item.action === 'update') {
          if (!current || current.isSymbolicLink() || !current.isDirectory()) {
            throw new Error(`Target changed during update: ${item.target}`);
          }
          const backupDir = path.join(path.dirname(dest), '.quest-skill-backups', randomUUID());
          await fs.mkdir(backupDir, { recursive: true });
          backup = path.join(backupDir, item.name);
          await fs.rename(item.target, backup);
          console.log(`backup: ${backup}`);
        }
        try { await fs.rename(stagedSkill, item.target); }
        catch (error) {
          if (backup) await fs.rename(backup, item.target);
          throw error;
        }
        console.log(`done: ${item.target}`);
      } finally { await fs.rm(stage, { recursive: true, force: true }); }
    }
  } finally {
    await handle.close();
    await fs.unlink(lock);
  }
}

main().catch(e => { console.error(`Error: ${e.message}`); process.exitCode = 1; });
