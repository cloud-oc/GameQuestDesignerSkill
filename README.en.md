<h1>
  <img src="assets/quest-icon-v2.svg" alt="Quest design mark: a Q surrounding a symmetrical tree with right-angle connections and circular nodes" width="48" height="48" align="absmiddle">
  GameQuestDesignerSkill
</h1>

[![npm](https://img.shields.io/npm/v/game-quest-designer-skills?style=flat-square&color=D74632)](https://www.npmjs.com/package/game-quest-designer-skills) [![中文](https://img.shields.io/badge/语言-中文-20231F?style=flat-square)](README.md) [![English](https://img.shields.io/badge/Language-English-D74632?style=flat-square)](README.en.md) [![日本語](https://img.shields.io/badge/言語-日本語-20231F?style=flat-square)](README.ja.md)

An adaptive skill collection for the full RPG quest design workflow. It learns project rules from your quest system documentation, editor guides, scripts, and worldbuilding materials, then supports quest analysis, definition, flow architecture, implementation specifications, logic prototypes, quality reviews, original quest creation, production requirements, and cross-team handoffs.

The skills recognize structures such as chapter–act–quest group–quest–objective, Quest/Target models, and declarative quest systems, but apply them only when your project materials confirm their use. One team's internal workflow is not treated as a universal RPG standard. Concept drafts are possible without project documentation, with unconfirmed capabilities clearly identified. Private project materials stay in your project, outside the reusable skill package.

## 0.2.0 professionalization

- `$quest-understand` includes a copyable quest project contract for player verbs, lifecycle, knowledge state, consequences, shared-world rules, recovery, and production boundaries.
- `$quest-design` includes ten RPG quest patterns and a derivation method from conflict and player promise to a lower-cost version. Patterns are references, not reskin formulas.
- `$quest-review` includes an eight-dimension observable quality rubric and ten anti-patterns. It does not compute a universal score or reject linear, slow, or non-combat quests by default.
- Quest brief, flow, implementation spec, production requirements, and review report each have an optional Markdown template. Skills use only the requested artifacts.
- For machine-checkable cross-document traceability, an optional neutral `quest-package.json` can be validated with `quest-package-validate <path>`. It checks IDs, references, reachability, and traceability; it is not engine configuration.

This release does not add a large interactive HTML renderer or automatic knowledge capture. Project material is written only to the user's project with authorization.

## Installation

### Use npx

Requires Node.js 20 or later and npm. No global installation is needed:

```bash
# Install all skills; existing directories are skipped
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills install

# Update installed skills from this collection
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills update
```

To install selected skills, append their names:

```bash
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills install quest-design quest-review
```

Updates replace the corresponding skill directories rather than merge personal changes. Previous directories are backed up under `.quest-skill-backups/` beside the installation directory. Add `--dry-run` to preview an operation or `--dest PATH` to choose the installation directory.

### Ask an agent to install

Send this directly to Codex or another agent that supports skill installation:

```text
Install all skills from this repository: https://github.com/cloud-oc/GameQuestDesignerSkill
```
## Usage

Repository sources live under `skills/`. For a manual installation, copy `game-quest-designer/` and the `quest-*/` directories you need from there, side by side, into your skill directory (typically `~/.codex/skills/` for Codex). Each has its own `SKILL.md` and UI metadata. Keeping them in this repository alone does not install them. Do not nest specialized skills inside the main skill directory. Use `$game-quest-designer` for the main entry point; specialized skills can be installed and invoked independently.

| Invocation | Use case |
|---|---|
| `$game-quest-designer` | Select and combine quest design capabilities |
| `$quest-understand` | Analyze quest systems, capabilities, and state models |
| `$quest-design` | Create original quests, define core experiences and quest briefs |
| `$quest-flow` | Translate narrative into gameplay, branches, and quest flows |
| `$quest-spec` | Specify conditions, objectives, states, actions, and implementation |
| `$quest-prototype` | Build logic prototypes and validate exceptional paths and recovery |
| `$quest-review` | Review narrative, player experience, or configuration |
| `$quest-requirements` | Extract production and cinematic requirements and analyze reuse |
| `$quest-collab` | Prepare engineering, level design, cinematic, and UI handoffs |
| `$quest-docs` | Read, organize, and synchronize quest documentation |

```text
Use $game-quest-designer to read my quest system documentation and existing examples,
then establish a quest design workflow for this project.
Identify missing information rather than assuming system support.
```

You can also ask directly:

- “Create a quest definition, flow architecture, and logic prototype from this script outline.”
- “Turn this quest flow into Quest/Target specifications, acceptance conditions, and actions, and identify missing schema information.”
- “Review this configuration against the project's declarative design rules, identifying unreliable conditions and presentation logic that belongs in Sandbox.”
- “Map this script to narrative, player experience, and quest logic flows, and identify system gaps.”
- “Design a standalone quest using this region and the available gameplay, keeping new production requirements under control.”
- “Merge the NPC, animation, and cinematic requirements from these three quests, retaining sources and reuse checks.”
- “Review this quest's motivation, repetitive errands, and logical deadlocks, and provide a revision.”

Examples: `$quest-design Design an investigation-focused village side quest that reuses existing NPCs and locations`; `$quest-review Check whether obtaining an item early could block progress in this quest`. Legacy `+commands` are recognized as intent aliases by the main entry point, but are not independently registered skills.

The skills load references as needed. Your project templates take priority; otherwise, they use a minimal readable structure. Machine configuration is produced only when requested and when the real format is known. A design walkthrough is not an engine test.

For a complete handoff, the relevant specialist skill can copy its `assets/*-template.md`. Quest, beat, requirement, and test IDs remain stable across artifacts. Irrelevant fields should be removed rather than expanding scope to fill a template.

Cloud-document adapters, synchronization scripts, and parsers proposed in the development document are not presented as implemented features. The skills use document tools actually available in the environment and maintain explicit authorization boundaries for replacement and bulk synchronization.

## Maintenance and validation

The installer and quest-package validator use only the Node.js standard library and have no third-party runtime dependencies. Run `npm test` to validate install/update safety, content links, template distribution, and quest-package checks. Run `npm pack --dry-run` to inspect package contents. npx retrieves the specified installer version; the installer operates only on bundled skills and does not run Git pulls.

### Automated builds and publishing

- Every push and pull request validates on Node.js 20 and 24, then builds an npm `.tgz` artifact retained by GitHub Actions for 14 days.
- `npm run build` runs the complete test suite through `prepack` before creating a tarball. The same gate applies to `npm publish`.
- Pushing a `v*` tag that matches `package.json` publishes through npm Trusted Publishing. For example, run `npm version patch`, then `git push origin main --follow-tags`.

Before the first automated release, add a GitHub Actions Trusted Publisher in the npm settings for `game-quest-designer-skills`: owner `cloud-oc`, repository `GameQuestDesignerSkill`, workflow filename `publish.yml`, with direct `npm publish` allowed. This is a one-time account setting. Builds still work without it, but tagged publishing will fail authentication. The workflow uses OIDC and does not require a long-lived `NPM_TOKEN` secret.

The design methods cover practical RPG production concerns: player motivation and information reveals, choice consequences and branching costs, shared NPCs and world state, objective counting and reward settlement, save/re-entry recovery, configuration acceptance, and playtest observation. Details are loaded as needed by the design, flow, specification, and validation skills.

Judgments must be grounded in project materials or explicit design assumptions. Adding methods and acceptance scenarios does not mean game runtime testing or independent model validation has been completed.

### Repository layout

```text
skills/   Ten independently installable skills
bin/      npm installer and neutral validator
test/     Node.js structure, installer, and validator tests
evals/    Independently runnable behavioral evaluation cases
site/     GitHub Pages usage website
assets/   Repository-level brand assets
```

The main entry point is [SKILL.md](skills/game-quest-designer/SKILL.md). Specialized methods live in `skills/*/SKILL.md`. The main skill's `references/` directory provides baseline methods when only that skill is installed. See [evals/scenarios.md](evals/scenarios.md) for behavioral regression scenarios. Use skill-creator's `quick_validate.py` to check each of the ten directories under `skills/`; structural checks do not establish model behavior or game runtime correctness.

Licensed under [Apache-2.0](LICENSE).
