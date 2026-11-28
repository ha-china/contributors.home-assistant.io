# 为动作编写文档

> 铜牌规则 docs-actions：文档描述集成的动作。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-actions/

这是一条铜牌（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `docs-actions`。

[home-assistant.io](https://www.home-assistant.io/) 上的用户文档描述了该集成添加的每一个[动作](https://www.hasscn.top/contributors/glossary/action/)（action）：它的作用是什么，以及它的每个字段分别代表什么含义。

## 为什么重要

动作可以完成标准实体（entity）无法完成的事情，例如获取日程安排，或发送带有选项的命令。这使得动作十分强大，但也比打开一盏灯更难使用。如果没有文档，用户只能靠猜测：有哪些字段、哪些是必填的，以及响应是什么样子。

## 示例

每个动作在 home-assistant.io 仓库中都有自己的文件，位于 [`source/_actions/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_actions) 目录中，以完整的动作名称命名，例如 `my_integration.get_schedule.markdown`。该文件会成为一个独立的页面：

```markdown
---
title: "Get schedule"
action: my_integration.get_schedule
domain: my_integration
description: "Gets the heating schedule of a thermostat."
---

The **Get schedule** action returns the heating schedule that is stored
on your thermostat.

{% include actions/ui_header.md %}
```

集成页面随后通过一个 include 列出其所有动作，该 include 会从这些文件构建列表：

```markdown
{% include integrations/actions.md %}
```

动作页面的完整布局（包括 UI 和 YAML 部分，以及 options 块）见[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/#triggers-conditions-and-actions)。关于如何编写页面本身，请参见[为集成编写文档](https://www.hasscn.top/contributors/writing/guides/integration/)。

## 如何检查

在审查时进行检查，即在随集成一起提交的文档 pull request 上进行。

## 例外情况

如果集成没有添加任何自己的动作，则此规则不适用。

## 相关规则

- [docs-triggers](https://www.hasscn.top/contributors/core/quality-scale/docs-triggers/)：记录触发器（trigger）。
- [docs-conditions](https://www.hasscn.top/contributors/core/quality-scale/docs-conditions/)：记录条件（condition）。
