# 架构决策

> 关于 Home Assistant 如何构建的决策，在 home-assistant/architecture 仓库中讨论并记录。

Source: https://www.hasscn.top/contributors/glossary/architecture-decision/

- In code: `home-assistant/architecture`
- Also: ADR, architecture decision record, architecture discussion

重大变更，例如一种新的实体（entity）类型或针对集成（integration）的新规则，都会先在那里作为讨论开始。一旦做出决定，该决定就会以架构决策记录（architecture decision record，ADR）的形式写入仓库的 `adr` 文件夹中，以便每个人都能查到决定了什么以及为什么这样决定。

## Related terms

- [向后不兼容的变更](https://www.hasscn.top/contributors/glossary/backward-incompatible-change/): 一种需要用户或开发者在他们那一侧做出更改的变更，例如修改他们的配置或自定义集成。
- [机会（Opportunity）](https://www.hasscn.top/contributors/glossary/opportunity/): 路线图仓库中的一种议题，描述一个值得解决的问题、其重要性，以及为其设想的解决方案。
- [史诗（Epic）](https://www.hasscn.top/contributors/glossary/epic/): home-assistant/epics 仓库中的一项较大规模工作，由可能跨越多个仓库的任务组成。
