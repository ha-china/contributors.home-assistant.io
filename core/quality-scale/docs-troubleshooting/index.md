# 故障排查文档

> 金牌规则 docs-troubleshooting：文档帮助用户自行解决常见问题。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-troubleshooting/

这是一条金牌（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `docs-troubleshooting`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成（integration）页面有一个故障排查部分，用于介绍用户会遇到的、且能够自行修复的问题。每个条目都描述了用户看到的症状、产生的原因以及解决步骤。

## 为什么这很重要

能够自行解决问题的用户只需几分钟即可恢复正常运行，而不必在 issue 或论坛帖子中等待数天。你记录下的每一个常见问题，都是一个无需再次被提出、也无需再次被解答的支持问题。

从症状开始写起，使用用户在屏幕上看到的措辞。那正是他们会搜索的内容。

## 示例

将每个问题放在各自独立的折叠块中，包含症状、描述和解决方法。对于简短的条目，如果某部分没有额外价值，可以将其省略。

```markdown
## Troubleshooting

{% details "Can't set up the device" %}

### Symptom

When you set up the integration, the form shows "Failed to connect".

#### Description

The device only accepts local connections when local access is turned
on in its settings.

#### Resolution

1. Make sure the device is powered on, and the LED is green.
2. In the app of the manufacturer, go to **Settings** > **Local access**.
3. Turn on **Allow local connections**, and try again.

{% enddetails %}
```

关于该部分应放在何处，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 如何检查

在审查（review）时检查，通常是在文档的 pull request 上进行。

## 例外情况

如果该集成没有已知的、用户可以自行解决的问题，则此规则不适用。
