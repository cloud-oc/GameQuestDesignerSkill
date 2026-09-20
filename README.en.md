<h1>
  <img src="assets/quest-icon-v2.svg" alt="Quest design mark: a Q surrounding a symmetrical tree with right-angle connections and circular nodes" width="48" height="48" align="absmiddle">
  GameQuestDesignerSkill
</h1>

[![npm](https://img.shields.io/npm/v/game-quest-designer-skills?style=flat-square&color=D74632)](https://www.npmjs.com/package/game-quest-designer-skills) [![中文](https://img.shields.io/badge/语言-中文-20231F?style=flat-square)](README.md) [![English](https://img.shields.io/badge/Language-English-D74632?style=flat-square)](README.en.md) [![日本語](https://img.shields.io/badge/言語-日本語-20231F?style=flat-square)](README.ja.md)

An adaptive skill collection for the full RPG quest design workflow. It learns project rules from your quest system documentation, editor guides, scripts, and worldbuilding materials, then supports quest analysis, definition, flow architecture, implementation specifications, logic prototypes, quality reviews, original quest creation, production requirements, and cross-team handoffs.

The skills recognize structures such as chapter–act–quest group–quest–objective, Quest/Target models, and declarative quest systems, but apply them only when your project materials confirm their use. One team's internal workflow is not treated as a universal RPG standard. Concept drafts are possible without project documentation, with unconfirmed capabilities clearly identified. Private project materials stay in your project, outside the reusable skill package.

## Download and installation

### Install and update with npm

Requires Node.js 20 or later and npm. Install the published [npm package](https://www.npmjs.com/package/game-quest-designer-skills) first:

~~~bash
npm install --global game-quest-designer-skills@latest

# Install all skills (skip existing skills)
quest-skills install

# Update installed skills in this collection (do not install missing skills)
quest-skills update

# Install or update selected skills only
quest-skills install quest-design quest-review
quest-skills update quest-design quest-review
~~~

Run `npm install --global game-quest-designer-skills@latest` again to upgrade the CLI. To pin a release, replace `@latest` with an exact version such as `@0.1.0`. To try unpublished changes from the GitHub `main` branch, use `npx --yes --package=github:cloud-oc/GameQuestDesignerSkill#main quest-skills install`.

If you have already downloaded the repository, run `node bin/quest-skills.mjs install` or `node bin/quest-skills.mjs update` directly; no npm publication is required.

- `list`: Show installation status for this collection.
- `--dry-run`: Preview actions without writing files.
- `--dest PATH`: Set the installation directory. Defaults to `$CODEX_HOME/skills`, or `~/.codex/skills` when unset.

Updates replace directories rather than merge personal changes. When content changes, the complete old directory is backed up to `.quest-skill-backups/<unique-id>/<skill-name>/` alongside the installation directory; the terminal prints the exact path. Identical content is skipped. To restore a backup, move the current skill directory aside and copy the backup back to its original location. Updates are performed per skill: if an operation fails partway through, previously completed updates are not rolled back. Resolve the issue and retry.

### Download the repository

Without Git: open the [GitHub repository](https://github.com/cloud-oc/GameQuestDesignerSkill), select **Code → Download ZIP**, extract it, and open the repository directory. You can also [download the main branch ZIP directly](https://github.com/cloud-oc/GameQuestDesignerSkill/archive/refs/heads/main.zip).

With Git:

```bash
git clone https://github.com/cloud-oc/GameQuestDesignerSkill.git
cd GameQuestDesignerSkill
```

### Manual full installation

Run the following from the extracted or cloned repository root (macOS / Linux, Bash / Zsh). It installs the main entry point and nine specialized skills, skipping existing directories with a message.

```bash
quest_skill_dir="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$quest_skill_dir"
for quest_skill in game-quest-designer quest-understand quest-design quest-flow quest-spec quest-prototype quest-review quest-requirements quest-collab quest-docs; do
  if [ -e "$quest_skill_dir/$quest_skill" ]; then
    printf 'Already exists, skipping: %s\n' "$quest_skill"
  else
    cp -R "$quest_skill" "$quest_skill_dir/$quest_skill"
  fi
done
```

On Windows, or if you prefer not to use a terminal, copy these ten directories into `.codex/skills/` under your user directory. If `CODEX_HOME` is set, use its `skills/` subdirectory instead.

### Install selected skills

Copy only the directories you need, such as `quest-design/` and `quest-review/`. Keep each directory's `SKILL.md` and `agents/` contents; do not download just a single Markdown file.

In a Codex environment that supports `$skill-installer`, you can also send:

```text
Use $skill-installer to install the skills in the quest-design and quest-review
directories from the main branch of cloud-oc/GameQuestDesignerSkill.
```

For a full installation, replace that directory list with the ten names in the full installation command above.

### Verify installation and update

After installation, invoke `$quest-design` or `$quest-review` in your next turn. If a skill does not appear, check that the path is `skills/quest-design/SKILL.md`, without an extra repository directory in between.

Use the npx command above to update. If managing a local checkout, download the ZIP again or run `git pull --ff-only`, then run `node bin/quest-skills.mjs update` to update installed copies. When copying manually, back up before replacing directories; the shell copy command above skips existing directories.

## Usage

Install `game-quest-designer/` and the `quest-*/` directories you need side by side in your skill directory (typically `~/.codex/skills/` for Codex). Each has its own `SKILL.md` and UI metadata. Keeping them in this repository alone does not install them. Do not nest specialized skills inside the main skill directory. Use `$game-quest-designer` for the main entry point; specialized skills can be installed and invoked independently.

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

Cloud-document adapters, synchronization scripts, and parsers proposed in the development document are not presented as implemented features. The skills use document tools actually available in the environment and maintain explicit authorization boundaries for replacement and bulk synchronization.

## Maintenance and validation

The installer uses the Node.js standard library with no third-party runtime dependencies. Run `npm test` to check installation, updates, backups, repeated execution, previews, and destination protection. Run `npm pack --dry-run` to inspect package contents. npx retrieves the specified installer version; the installer operates only on bundled skills and does not run Git pulls.

The design methods cover practical RPG production concerns: player motivation and information reveals, choice consequences and branching costs, shared NPCs and world state, objective counting and reward settlement, save/re-entry recovery, configuration acceptance, and playtest observation. Details are loaded as needed by the design, flow, specification, and validation skills.

Judgments must be grounded in project materials or explicit design assumptions. Adding methods and acceptance scenarios does not mean game runtime testing or independent model validation has been completed.

The main entry point is [SKILL.md](game-quest-designer/SKILL.md). Specialized methods live in each skill's own `SKILL.md`. The main skill's `references/` directory provides baseline methods when only that skill is installed. See [evals/scenarios.md](evals/scenarios.md) for behavioral regression scenarios. Use skill-creator's `quick_validate.py` to check each of the ten skill directories individually; structural checks do not establish model behavior or game runtime correctness.

Licensed under [Apache-2.0](LICENSE).
