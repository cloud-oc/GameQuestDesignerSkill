# GameQuestDesignerSkill

面向日常 RPG 任务策划的自适应 Skill。它从用户提供的任务系统、编辑器说明、剧本和世界观中学习项目规则，形成专属工作流，再完成剧本拆解、原创任务、隐含制作需求提取和评审。

不绑定开放世界、引擎或固定节点系统。没有项目资料时也能做概念草案，但会明确未确认的系统能力。项目私有资料保存在用户项目内，不放进通用 Skill。

## 安装与使用

将仓库中的 `game-quest-designer/` 整个目录复制到你的 Skill 目录（Codex 通常为 `~/.codex/skills/`）。显示名称为 **GameQuestDesignerSkill**，调用标识遵循 Skill 命名规范，使用 `$game-quest-designer`。

```text
使用 $game-quest-designer，读取我提供的任务系统说明和已有案例，
建立这个项目自己的任务策划工作流。缺失信息先标出来，不要假定系统支持。
```

也可以直接请求：

- “根据这段剧本，输出剧情流、玩家体验流和任务逻辑流，并标出系统缺口。”
- “根据这个区域和可用玩法设计一个独立任务，控制新增制作需求。”
- “合并这三个任务里的 NPC、动作和演出需求，保留来源和复用待核对项。”
- “评审这个任务的动机、跑腿感和逻辑死锁，并给出修订稿。”

Skill 会按需要读取参考文件。你提供的项目模板优先；没有模板时使用最小可读结构。只有掌握真实配置格式且用户要求时才输出机器配置，设计走查不等于引擎测试。

## 维护与验证

入口为 [SKILL.md](game-quest-designer/SKILL.md)，专项方法在其链接的 `references/` 中。行为回归场景见 [evals/scenarios.md](evals/scenarios.md)。可使用 skill-creator 自带的 `quick_validate.py` 校验 `game-quest-designer/` 的结构；行为与领域质量另行通过场景走查验证。

许可证沿用仓库的 [Apache-2.0](LICENSE)。
