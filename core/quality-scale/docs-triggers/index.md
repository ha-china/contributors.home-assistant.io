# 记录触发器

> 青铜规则 docs-triggers：文档描述集成的触发器。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-triggers/

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `docs-triggers`。

当集成（integration）提供了自己的[触发器（trigger）](https://www.hasscn.top/contributors/glossary/trigger/)时，每个触发器都必须有相应的文档。每个触发器在 [home-assistant.io](https://www.home-assistant.io/) 上都有一个独立的页面，集成页面会链接到这些页面。触发器页面会说明该触发器的用途，列出其选项，并展示如何在 UI 中以及在 YAML 中使用它。

## 为什么这很重要

集成触发器不像状态改变这类标准触发器那样为人所熟悉。如果没有文档，用户就不知道这些触发器的存在、选项的含义，也不知道触发器何时触发。每个触发器拥有独立页面可以让集成页面保持可读，并为每个触发器提供展示示例的空间。

## 示例

每个触发器都是 home-assistant.io 的 [`source/_triggers/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_triggers) 目录中的一个文件，以该触发器命名，例如 `my_integration.co2_changed.markdown`。以下是一个精简的示例：

```markdown
---
title: "Carbon dioxide level changed"
trigger: my_integration.co2_changed
domain: my_integration
description: "Triggers after the carbon dioxide level changes."
---

The **Carbon dioxide level changed** trigger fires after the CO2 reading
of one or more sensors changes by a meaningful amount. Use it to turn on
ventilation when a room gets stuffy.

{% include triggers/ui_header.md %}

1. Go to **Settings** > **Automations & scenes**.
2. Open an automation, and in the **When** section, select **Add trigger**.
3. Pick the area or sensor, then select **Carbon dioxide level changed**.

{% include triggers/yaml_header.md %}

{% example %}
trigger: |
  trigger: my_integration.co2_changed
  target:
    entity_id: sensor.bedroom_co2
  options:
    threshold: 50
{% endexample %}
```

在集成页面上，`{% include integrations/triggers.md %}` 会列出该集成的触发器。[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/#triggers-conditions-and-actions)一文描述了触发器页面的完整布局，以及其所使用的所有 include。另请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)。

## 如何检查

在审查中进行检查。Hassfest 会校验集成 `triggers.yaml` 中的触发器描述，但不会校验文档。

## 例外情况

如果集成不提供任何触发器，则此规则不适用。

## 相关规则

- [docs-actions](https://www.hasscn.top/contributors/core/quality-scale/docs-actions/)：记录动作（action）。
- [docs-conditions](https://www.hasscn.top/contributors/core/quality-scale/docs-conditions/)：记录条件（condition）。
