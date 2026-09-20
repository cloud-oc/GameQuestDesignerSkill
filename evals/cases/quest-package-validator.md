# 案例：中立任务包校验器

## 加载

不需要模型行为；运行 `quest-package-validate`。

## 输入与验收

1. 随包示例：返回成功且无错误。
2. 任务引用不存在的需求：报告 `MISSING_REFERENCE` 并返回非零。
3. 一个节拍的来源状态不可从入口到达：报告 `UNREACHABLE_BEAT`。
4. 终态不可到达：报告 `UNREACHABLE_TERMINAL`。
5. 可达非终态没有后继：报告 `DEAD_END`。
6. 需求声明来源节拍但节拍未反向引用：报告 `TRACEABILITY`。

## 边界

- 不检查引擎字段、事件合法性、奖励事务或实际体验。
- 没有 `quest-package.json` 时不影响任何 Skill 的 Markdown 工作流。
