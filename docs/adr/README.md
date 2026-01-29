# ADR - 架构决策记录 (Architecture Decision Records)

本目录记录项目中的重要技术决策及其原因。

## ADR 索引

| 编号 | 标题 | 状态 | 日期 |
|------|------|------|------|
| [002](./002-form-state-management.md) | EzForm 表单状态管理方案 | 已接受 | 2026-01-29 |

## 什么是 ADR？

ADR（Architecture Decision Record）是一种记录重要架构决策的文档格式，包含：

- **上下文**：为什么需要做这个决策
- **问题**：面临什么问题
- **方案**：考虑了哪些方案
- **决策**：最终选择了哪个方案及原因
- **影响**：这个决策带来的影响

## 为什么使用 ADR？

1. **知识传承**：新成员可以快速了解项目的技术决策历史
2. **决策透明**：让团队了解为什么选择某个方案
3. **回溯依据**：当需要重新评估决策时有据可查
4. **避免重复讨论**：相同问题不需要再次讨论

## ADR 模板

```markdown
# ADR XXX: [决策标题]

## 状态
[提议中 / 已接受 / 已废弃 / 已替代]

## 上下文
[描述背景和上下文]

## 问题
[描述要解决的问题]

## 决策
[描述最终决策]

## 理由
[说明选择该方案的原因]

## 影响
[描述该决策的影响]

## 参考
[相关链接]
```

## 参考资料

- [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR in Rust project](https://github.com/rust-lang/rfcs/blob/master/text/0000-template.md)
