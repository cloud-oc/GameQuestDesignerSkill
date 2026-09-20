#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ownPath = fileURLToPath(import.meta.url);

function text(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function issue(list, level, code, message) {
  list.push({ level, code, message });
}

function stringArray(value, at, issues, { required = true, nonEmpty = false } = {}) {
  if (value === undefined && !required) return [];
  if (!Array.isArray(value)) {
    issue(issues, 'error', 'FIELD_TYPE', `${at} must be an array`);
    return [];
  }
  const result = [];
  for (let index = 0; index < value.length; index += 1) {
    if (!text(value[index])) issue(issues, 'error', 'FIELD_TYPE', `${at}[${index}] must be a non-empty string`);
    else result.push(value[index]);
  }
  if (nonEmpty && result.length === 0) issue(issues, 'error', 'FIELD_EMPTY', `${at} must contain at least one ID`);
  if (new Set(result).size !== result.length) issue(issues, 'error', 'DUPLICATE_REFERENCE', `${at} contains duplicate IDs`);
  return result;
}

function objects(value, at, issues) {
  if (!Array.isArray(value)) {
    issue(issues, 'error', 'FIELD_TYPE', `${at} must be an array`);
    return [];
  }
  return value.filter((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      issue(issues, 'error', 'FIELD_TYPE', `${at}[${index}] must be an object`);
      return false;
    }
    return true;
  });
}

function indexEntities(groups, issues) {
  const global = new Map();
  const indexes = {};
  for (const [kind, values] of Object.entries(groups)) {
    const index = new Map();
    values.forEach((value, position) => {
      if (!text(value.id)) {
        issue(issues, 'error', 'MISSING_ID', `${kind}[${position}].id must be a non-empty string`);
        return;
      }
      if (global.has(value.id)) {
        issue(issues, 'error', 'DUPLICATE_ID', `${value.id} is used by both ${global.get(value.id)} and ${kind}`);
        return;
      }
      global.set(value.id, kind);
      index.set(value.id, value);
    });
    indexes[kind] = index;
  }
  return indexes;
}

function requireRef(ids, index, at, kind, issues) {
  for (const id of ids) if (!index.has(id)) issue(issues, 'error', 'MISSING_REFERENCE', `${at} references unknown ${kind} ${id}`);
}

export function validatePackage(data) {
  const issues = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return [{ level: 'error', code: 'ROOT_TYPE', message: 'Root value must be an object' }];
  }
  if (data.schemaVersion !== '1.0') issue(issues, 'error', 'SCHEMA_VERSION', 'schemaVersion must be "1.0"');
  if (!text(data.projectId)) issue(issues, 'error', 'FIELD_TYPE', 'projectId must be a non-empty string');
  if (!text(data.sourceVersion)) issue(issues, 'error', 'FIELD_TYPE', 'sourceVersion must be a non-empty string');

  const groups = {
    quests: objects(data.quests, 'quests', issues),
    beats: objects(data.beats, 'beats', issues),
    requirements: objects(data.requirements, 'requirements', issues),
    tests: objects(data.tests, 'tests', issues),
  };
  const indexes = indexEntities(groups, issues);

  for (const quest of groups.quests) {
    const at = `quest ${quest.id || '<missing>'}`;
    if (!text(quest.entryStateId)) issue(issues, 'error', 'FIELD_TYPE', `${at}.entryStateId must be a non-empty string`);
    const terminalIds = stringArray(quest.terminalStateIds, `${at}.terminalStateIds`, issues, { nonEmpty: true });
    const beatIds = stringArray(quest.beatIds, `${at}.beatIds`, issues, { nonEmpty: true });
    const requirementIds = stringArray(quest.requirementIds, `${at}.requirementIds`, issues, { required: false });
    const testIds = stringArray(quest.testIds, `${at}.testIds`, issues, { required: false });
    requireRef(beatIds, indexes.beats, at, 'beat', issues);
    requireRef(requirementIds, indexes.requirements, at, 'requirement', issues);
    requireRef(testIds, indexes.tests, at, 'test', issues);
    if (!text(quest.entryStateId) || beatIds.some(id => !indexes.beats.has(id))) continue;

    const scopedBeats = beatIds.map(id => indexes.beats.get(id));
    const outgoing = new Map();
    for (const beat of scopedBeats) {
      if (!text(beat.fromStateId)) continue;
      if (!outgoing.has(beat.fromStateId)) outgoing.set(beat.fromStateId, []);
      outgoing.get(beat.fromStateId).push(beat);
    }
    const states = new Set([quest.entryStateId]);
    const reachedBeats = new Set();
    const queue = [quest.entryStateId];
    while (queue.length) {
      const state = queue.shift();
      for (const beat of outgoing.get(state) || []) {
        if (reachedBeats.has(beat.id)) continue;
        reachedBeats.add(beat.id);
        for (const next of Array.isArray(beat.toStateIds) ? beat.toStateIds : []) {
          if (!states.has(next)) { states.add(next); queue.push(next); }
        }
      }
    }
    for (const id of beatIds) if (!reachedBeats.has(id)) issue(issues, 'error', 'UNREACHABLE_BEAT', `${at} cannot reach beat ${id} from ${quest.entryStateId}`);
    for (const state of terminalIds) if (!states.has(state)) issue(issues, 'error', 'UNREACHABLE_TERMINAL', `${at} cannot reach terminal state ${state}`);
    for (const state of states) {
      if (!terminalIds.includes(state) && !(outgoing.get(state) || []).length) {
        issue(issues, 'error', 'DEAD_END', `${at} reaches non-terminal state ${state} with no outgoing beat`);
      }
    }
    if (testIds.length === 0) issue(issues, 'warning', 'NO_QUEST_TEST', `${at} has no testIds`);
  }

  for (const beat of groups.beats) {
    const at = `beat ${beat.id || '<missing>'}`;
    if (!text(beat.fromStateId)) issue(issues, 'error', 'FIELD_TYPE', `${at}.fromStateId must be a non-empty string`);
    stringArray(beat.toStateIds, `${at}.toStateIds`, issues, { nonEmpty: true });
    const requirementIds = stringArray(beat.requirementIds, `${at}.requirementIds`, issues, { required: false });
    const testIds = stringArray(beat.testIds, `${at}.testIds`, issues, { required: false });
    requireRef(requirementIds, indexes.requirements, at, 'requirement', issues);
    requireRef(testIds, indexes.tests, at, 'test', issues);
  }

  for (const requirement of groups.requirements) {
    const at = `requirement ${requirement.id || '<missing>'}`;
    const sources = stringArray(requirement.sourceBeatIds, `${at}.sourceBeatIds`, issues, { nonEmpty: true });
    requireRef(sources, indexes.beats, at, 'beat', issues);
    for (const beatId of sources) {
      const beat = indexes.beats.get(beatId);
      if (beat && !(beat.requirementIds || []).includes(requirement.id)) {
        issue(issues, 'error', 'TRACEABILITY', `${at} names ${beatId}, but that beat does not reference ${requirement.id}`);
      }
    }
  }

  for (const test of groups.tests) {
    const at = `test ${test.id || '<missing>'}`;
    const questIds = stringArray(test.questIds, `${at}.questIds`, issues, { required: false });
    const beatIds = stringArray(test.beatIds, `${at}.beatIds`, issues, { required: false });
    const requirementIds = stringArray(test.requirementIds, `${at}.requirementIds`, issues, { required: false });
    if (questIds.length + beatIds.length + requirementIds.length === 0) issue(issues, 'error', 'NO_COVERAGE', `${at} must cover at least one quest, beat, or requirement`);
    requireRef(questIds, indexes.quests, at, 'quest', issues);
    requireRef(beatIds, indexes.beats, at, 'beat', issues);
    requireRef(requirementIds, indexes.requirements, at, 'requirement', issues);
  }
  return issues;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1 || args[0] === '--help' || args[0] === '-h') {
    console.log('Usage: quest-package-validate <quest-package.json>');
    if (args.length !== 1) process.exitCode = args.length ? 1 : 0;
    return;
  }
  const target = path.resolve(args[0]);
  let data;
  try { data = JSON.parse(await fs.readFile(target, 'utf8')); }
  catch (error) { throw new Error(`Cannot read valid JSON from ${target}: ${error.message}`); }
  const issues = validatePackage(data);
  for (const item of issues) console.log(`${item.level.toUpperCase()} ${item.code}: ${item.message}`);
  const errors = issues.filter(item => item.level === 'error');
  if (errors.length) {
    console.error(`Invalid quest package: ${errors.length} error(s), ${issues.length - errors.length} warning(s)`);
    process.exitCode = 1;
  } else console.log(`Valid quest package${issues.length ? ` with ${issues.length} warning(s)` : ''}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === ownPath) {
  main().catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
}
