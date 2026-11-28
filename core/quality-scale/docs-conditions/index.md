# 记录条件

> 青铜规则 docs-conditions：文档描述集成的条件。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-conditions/

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `docs-conditions`。

[home-assistant.io](https://www.home-assistant.io/) 上的用户文档描述了集成（integration）提供的每一个条件（condition）。每个条件都有自己独立的页面，并从集成页面链接过去。该页面会解释这个条件检查什么内容，列出它的选项，并展示如何在界面（UI）和 YAML 中使用它。

## 为什么这很重要

集成的条件比标准条件更加具体，这使得它们在没有帮助的情况下更难使用。为每个条件设置独立的页面可以保持集成页面的可读性，同时仍为每个条件留出足够的空间来展示其选项、其在多个目标下的行为以及实际的示例。

## 示例

每个条件在 home-assistant.io 仓库中都有自己独立的文件，位于 [`source/_conditions/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_conditions) 目录下，以完整的条件名称命名，例如 `my_integration.is_door_open.markdown`：

```markdown
---
title: "Door is open"
condition: my_integration.is_door_open
domain: my_integration
description: "Tests if one or more doors are open."
---

The **Door is open** condition passes when one or more of your doors
are open. Use it to make sure an automation only runs while a door is
actually open, like turning off the heating.

{% include conditions/ui_header.md %}
```

在介绍部分之后，页面会依次介绍如何在界面中使用该条件、它在界面中的选项、如何在 YAML 中使用它，以及它在 YAML 中的选项。页面以"Good to know"（温馨提示）部分和真实的自动化（automation）示例结尾。集成页面通过一个 include 列出所有条件：

```markdown
{% include integrations/conditions.md %}
```

包含所有 include 和选项块的完整页面布局见[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/#triggers-conditions-and-actions)。关于如何撰写页面本身，请参见[记录集成](https://www.hasscn.top/contributors/writing/guides/integration/)。

## 如何检查

在审查（review）阶段进行检查，检查对象是与该集成一同提交的文档拉取请求（pull request）。

## 例外情况

如果集成不提供任何条件，则此规则不适用。

## 相关规则

- [docs-actions](https://www.hasscn.top/contributors/core/quality-scale/docs-actions/)：记录动作（action）。
- [docs-triggers](https://www.hasscn.top/contributors/core/quality-scale/docs-triggers/)：记录触发器（trigger）。
