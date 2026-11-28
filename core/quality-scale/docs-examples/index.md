# 记录自动化示例

> Gold 规则 docs-examples：文档提供自动化示例或蓝图。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-examples/

这是一条 Gold 级规则。在 `quality_scale.yaml` 中，它被称为 `docs-examples`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成（integration）页面展示了使用该集成进行自动化的几种常见或实用的方式。请以 YAML [自动化（automation）](https://www.hasscn.top/contributors/glossary/automation/)示例的形式提供，或链接到一个[蓝图（blueprint）](https://www.hasscn.top/contributors/glossary/blueprint/)。蓝图可以放在 [home-assistant.io 仓库](https://github.com/home-assistant/home-assistant.io/tree/current/source/blueprints/integrations)的 `source/blueprints/integrations` 文件夹中，也可以放在论坛的[蓝图交流区（blueprint exchange）](https://community.home-assistant.io/c/blueprints-exchange)上。

数量宜精不宜多。集成页面并不是收录所有人写过的每一个自动化的合集。

## 为什么重要

示例能让用户从“已完成设置”走向“实现有用的功能”。一个好的示例还能展示集成的实体（entity）和动作（action）是如何协同工作的，这比单纯列出实体更有教学意义。

## 示例

````markdown
## Examples

### Turn off the status LEDs at night

The status LEDs of the device are bright. This automation turns them off
at sunset.

{% details "Example YAML configuration" %}

```yaml
automation:
  - alias: "Turn off the status LEDs at sunset"
    triggers:
      - trigger: sun
        event: sunset
    actions:
      - action: switch.turn_off
        target:
          entity_id: switch.my_device_status_led
```

{% enddetails %}
````

关于此部分应放置的位置，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 如何检查

在审查时进行检查，通常是在文档的拉取请求（pull request）上进行。

## 例外情况

不创建实体或不提供动作的集成，或者仅扩展核心（core）某项功能（例如备份位置）的集成，可豁免此规则。
