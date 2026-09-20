<h1>
  <img src="assets/quest-icon-v2.svg" alt="任务设计徽记：Q 形轮廓内的对称树状分支，采用直角连线与圆形节点" width="48" height="48" align="absmiddle">
  GameQuestDesignerSkill
</h1>

[![npm](https://img.shields.io/npm/v/game-quest-designer-skills?style=flat-square&color=D74632)](https://www.npmjs.com/package/game-quest-designer-skills) [![中文](https://img.shields.io/badge/语言-中文-D74632?style=flat-square)](README.md) [![English](https://img.shields.io/badge/Language-English-20231F?style=flat-square)](README.en.md) [![日本語](https://img.shields.io/badge/言語-日本語-20231F?style=flat-square)](README.ja.md)

面向 RPG 任务设计全流程的自适应 Skill。它从用户提供的任务系统、编辑器说明、剧本和世界观中学习项目规则，形成专属工作流，再完成任务理解、任务定义、流程架构、实现规格、逻辑原型、质量审查、原创任务、制作需求与跨团队交付。

Skill 能识别“章节—幕—任务组—任务—目标”、Quest/Target 和声明式任务分工，但只在项目资料确认采用这些规则时启用；不会把某个团队的内部流程当成所有 RPG 的通用事实。没有项目资料时也能做概念草案，但会明确未确认的系统能力。项目私有资料保存在用户项目内，不放进通用 Skill。

## 安装

### 使用 npx

需要 Node.js 20 或更高版本及 npm，无需全局安装：

```bash
# 安装全部 Skill；已有目录会跳过
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills install

# 更新已安装的本套 Skill
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills update
```

安装指定 Skill 时，在命令末尾添加名称，例如：

```bash
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills install quest-design quest-review
```

更新会替换对应 Skill 目录，不合并个人修改；旧目录会备份到安装目录同级的 `.quest-skill-backups/`。可添加 `--dry-run` 预览操作，或使用 `--dest PATH` 指定安装目录。

### 让 Agent 安装

把下面这句话直接发给 Codex 或其他支持安装 Skill 的 Agent：

```text
请安装这个仓库中的全部 Skill：https://github.com/cloud-oc/GameQuestDesignerSkill
```
## 使用方式

将 `game-quest-designer/` 和下表中需要的 `quest-*/` 目录并列安装到你的 Skill 目录（Codex 通常为 `~/.codex/skills/`）。每个目录都有自己的 `SKILL.md` 和 UI 元数据；仅放在本仓库中不代表已安装。不要把专项目录嵌套在总入口目录内。总入口使用 `$game-quest-designer`，各专项能力可以单独安装、独立调用。

| 调用 | 适用工作 |
|---|---|
| `$game-quest-designer` | 自动选择并组合任务设计能力 |
| `$quest-understand` | 任务系统理解、能力画像与状态模型 |
| `$quest-design` | 原创任务、核心体验与任务定义 |
| `$quest-flow` | 剧情到玩法的映射、分支与流程设计 |
| `$quest-spec` | 条件、目标、状态、动作与实现规格 |
| `$quest-prototype` | 逻辑原型、异常路径与恢复验证 |
| `$quest-review` | 叙事体验评审或配置审查 |
| `$quest-requirements` | 制作需求、演出需求与跨任务复用 |
| `$quest-collab` | 程序、关卡、演出、界面团队交接 |
| `$quest-docs` | 任务文档读取、整理与同步 |

```text
使用 $game-quest-designer，读取我提供的任务系统说明和已有案例，
建立这个项目自己的任务策划工作流。缺失信息先标出来，不要假定系统支持。
```

也可以直接请求：

- “根据这个剧本大纲完成任务定义、流程架构和逻辑原型。”
- “把任务流程转成 Quest/Target、领取条件和动作的实现规格，并标出缺少的 schema。”
- “按声明式规范检查这份配置，找出不可靠条件和应移到 Sandbox 的表现。”
- “根据这段剧本，输出剧情流、玩家体验流和任务逻辑流，并标出系统缺口。”
- “根据这个区域和可用玩法设计一个独立任务，控制新增制作需求。”
- “合并这三个任务里的 NPC、动作和演出需求，保留来源和复用待核对项。”
- “评审这个任务的动机、跑腿感和逻辑死锁，并给出修订稿。”

例如：`$quest-design 设计一条以调查为主的村落支线，复用已有 NPC 和场景`；`$quest-review 检查这个任务是否会因提前取得道具而无法推进`。历史 `+命令` 可作为总入口的意图别名理解，但它们不是独立注册的 Skill。

Skill 会按需要读取参考文件。你提供的项目模板优先；没有模板时使用最小可读结构。只有掌握真实配置格式且用户要求时才输出机器配置，设计走查不等于引擎测试。

开发文档中设想的云文档适配器、同步脚本和解析器不被伪装成已实现能力；当前 Skill 会优先使用运行环境中真实可用的文档工具，并对覆盖、批量同步等操作保留明确授权边界。

## 维护与验证

安装器使用 Node.js 标准库，无第三方运行依赖。运行 `npm test` 验证安装、更新、备份、重复执行、预览和目标保护；运行 `npm pack --dry-run` 检查分发文件。npx 负责取得指定版本的安装器，安装器本身只操作随包分发的 Skill，不执行 Git 拉取。

业务方法覆盖 RPG 制作中的具体问题：玩家动机与信息揭示、选择后果与分支成本、共享 NPC 和世界状态、目标计数与奖励结算、存档/重入恢复，以及配置验收与试玩观察。相关细节按需加载到任务设计、流程、规格和验证能力中。

所有判断应对应项目资料或明确的设计假设；新增方法和验收场景不等于已经完成实际游戏或独立模型验证。

总入口为 [SKILL.md](game-quest-designer/SKILL.md)，独立能力的方法维护在各自的 `SKILL.md` 中。总入口内的 `references/` 保留为仅安装总入口时的基础方法。行为回归场景见 [evals/scenarios.md](evals/scenarios.md)。可使用 skill-creator 自带的 `quick_validate.py` 分别校验十个 Skill 目录；结构检查不等于模型行为和游戏运行验证。

许可证沿用仓库的 [Apache-2.0](LICENSE)。
