import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validatePackage } from '../bin/validate-quest-package.mjs';

const example = fileURLToPath(new URL('../skills/game-quest-designer/assets/quest-package.example.json', import.meta.url));

test('example quest package is valid', async () => {
  const data = JSON.parse(await fs.readFile(example, 'utf8'));
  assert.deepEqual(validatePackage(data), []);
});

test('validator catches dangling references, unreachable beats, and missing terminal reachability', () => {
  const data = {
    schemaVersion: '1.0', projectId: 'p', sourceVersion: 'v',
    quests: [{
      id: 'Q-1', entryStateId: 'S-START', terminalStateIds: ['S-DONE'],
      beatIds: ['B-1', 'B-2'], requirementIds: ['REQ-MISSING'], testIds: [],
    }],
    beats: [
      { id: 'B-1', fromStateId: 'S-START', toStateIds: ['S-DEAD'], requirementIds: [], testIds: [] },
      { id: 'B-2', fromStateId: 'S-ISLAND', toStateIds: ['S-DONE'], requirementIds: [], testIds: [] },
    ],
    requirements: [], tests: [],
  };
  const codes = validatePackage(data).map(item => item.code);
  assert.ok(codes.includes('MISSING_REFERENCE'));
  assert.ok(codes.includes('UNREACHABLE_BEAT'));
  assert.ok(codes.includes('UNREACHABLE_TERMINAL'));
  assert.ok(codes.includes('DEAD_END'));
});

test('validator checks reciprocal requirement traceability and test coverage', () => {
  const data = {
    schemaVersion: '1.0', projectId: 'p', sourceVersion: 'v',
    quests: [{
      id: 'Q-1', entryStateId: 'S-START', terminalStateIds: ['S-DONE'],
      beatIds: ['B-1'], requirementIds: ['REQ-1'], testIds: ['T-1'],
    }],
    beats: [{ id: 'B-1', fromStateId: 'S-START', toStateIds: ['S-DONE'], requirementIds: [], testIds: ['T-1'] }],
    requirements: [{ id: 'REQ-1', sourceBeatIds: ['B-1'] }],
    tests: [{ id: 'T-1', questIds: [], beatIds: [], requirementIds: [] }],
  };
  const codes = validatePackage(data).map(item => item.code);
  assert.ok(codes.includes('TRACEABILITY'));
  assert.ok(codes.includes('NO_COVERAGE'));
});
