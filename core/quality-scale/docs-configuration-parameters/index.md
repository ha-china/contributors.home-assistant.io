# 记录选项

> 白银级规则 docs-configuration-parameters：文档描述了选项流（options flow）的每一个选项。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-configuration-parameters/

这是一条白银级（Silver）规则。在 `quality_scale.yaml` 中，它被称为 `docs-configuration-parameters`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成（integration）页面必须描述用户在完成设置后可以在该集成的[选项流（options flow）](https://www.hasscn.top/contributors/glossary/options-flow/)中更改的每一个选项。对于每个选项，请解释它的作用，以及哪些取值是合理的。

## 为什么这很重要

一个没有解释的选项只能靠猜。用户打开选项，看到一个类似“Timeframe”的字段，却不知道该选 5 还是 120，也不知道选了之后会有什么变化。集成页面上的一段简短描述能帮他们省去反复试错，也能帮你省去支持咨询。

## 示例

添加标准的选项文本，随后添加一个 `configuration_basic` 块，其中每个选项对应一个条目。标签（label）请与 UI 中显示的完全一致：

```markdown
{% include integrations/option_flow.md %}

{% configuration_basic %}
Country code:
  description: "The country (NL or BE) to show on the radar camera."
Timeframe:
  description: "How many minutes ahead the precipitation forecast
    looks. From 5 to 120 minutes."
{% endconfiguration_basic %}
```

有关该块的详情，请参见[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/#the-configuration_basic-block)；有关如何提交文档拉取请求（pull request），请参见[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)。

## 检查方式

此规则在审查（review）代码和文档拉取请求时进行检查。

## 例外情况

如果集成没有选项流，则此规则不适用。

## 相关规则

- [docs-installation-parameters](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-parameters/)：记录安装（setup）参数。
