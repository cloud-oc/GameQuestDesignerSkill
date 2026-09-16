# GameQuestDesignerSkill

面向 RPG 任务设计全流程的自适应 Skill。它从用户提供的任务系统、编辑器说明、剧本和世界观中学习项目规则，形成专属工作流，再完成任务理解、任务定义、流程架构、实现规格、逻辑原型、质量审查、原创任务、制作需求与跨团队交付。

Skill 能识别“章节—幕—任务组—任务—目标”、Quest/Target 和声明式任务分工，但只在项目资料确认采用这些规则时启用；不会把某个团队的内部流程当成所有 RPG 的通用事实。没有项目资料时也能做概念草案，但会明确未确认的系统能力。项目私有资料保存在用户项目内，不放进通用 Skill。

## 安装与使用

将仓库中的 `game-quest-designer/` 整个目录复制到你的 Skill 目录（Codex 通常为 `~/.codex/skills/`）。显示名称为 **GameQuestDesignerSkill**，调用标识遵循 Skill 命名规范，使用 `$game-quest-designer`。

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

自然语言与 `+task-definition`、`+flow-architecture`、`+implementation-spec`、`+logic-prototype`、`+lint`、`+perf-req` 等快捷命令同等有效。Skill 会按需要读取参考文件。你提供的项目模板优先；没有模板时使用最小可读结构。只有掌握真实配置格式且用户要求时才输出机器配置，设计走查不等于引擎测试。

开发文档中设想的云文档适配器、同步脚本和解析器不被伪装成已实现能力；当前 Skill 会优先使用运行环境中真实可用的文档工具，并对覆盖、批量同步等操作保留明确授权边界。

## 维护与验证

入口为 [SKILL.md](game-quest-designer/SKILL.md)，专项方法在其链接的 `references/` 中。行为回归场景见 [evals/scenarios.md](evals/scenarios.md)。可使用 skill-creator 自带的 `quick_validate.py` 校验 `game-quest-designer/` 的结构；行为与领域质量另行通过场景走查验证。

许可证沿用仓库的 [Apache-2.0](LICENSE)。
