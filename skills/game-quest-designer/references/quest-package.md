# 中立任务包清单

`quest-package.json` 是可选的设计交付索引，用于检查任务、节拍、需求和测试之间的引用与流程闭合。它不描述项目节点类型、事件 API 或资源格式，也不代表内容可以导入引擎。

仅在用户需要机器校验、跨文档追溯或批量交付时创建；普通任务设计继续使用 Markdown。可从 [示例清单](../assets/quest-package.example.json) 复制后替换内容。

## 版本 1.0

- `schemaVersion`：固定为 `"1.0"`。
- `projectId`：项目稳定 ID。
- `sourceVersion`：清单对应的资料、设计或配置版本。
- `quests`：`id`、`entryStateId`、`terminalStateIds`、`beatIds`、`requirementIds`、`testIds`。
- `beats`：`id`、`fromStateId`、`toStateIds`、`requirementIds`、`testIds`。
- `requirements`：`id`、`sourceBeatIds`。
- `tests`：`id`、`questIds`、`beatIds`、`requirementIds`；至少覆盖一种对象。

所有对象 ID 在整个清单内唯一。状态 ID 是项目内不透明标识，校验器只用于构建流程图，不解释其业务语义。

## 校验

```bash
# From this repository
node bin/validate-quest-package.mjs path/to/quest-package.json

# Or without a global installation
npx --yes --package=game-quest-designer-skills@latest -- quest-package-validate path/to/quest-package.json

# When the package binary is already on PATH
quest-package-validate path/to/quest-package.json
```

校验器检查：必填字段与数组、ID 唯一性、引用可解析、入口与终态可达、无意的非终态死路、需求来源和测试覆盖引用。它不检查引擎 schema、事件是否存在、奖励事务或实际运行行为。

错误使进程返回非零；警告表示追溯可能不完整，但不会把仍在草案阶段的内容冒充为确定错误。
