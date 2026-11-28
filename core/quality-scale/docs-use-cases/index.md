# 记录用例

> 金牌规则 docs-use-cases：文档展示了你可以用集成（integration）做什么。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-use-cases/

这是一条金牌（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `docs-use-cases`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成页面描述了几个用例：当设备（device）或服务（service）进入 Home Assistant 之后，你可以用它做什么，以及为什么你会希望把它添加进来。

## 为什么重要

对于某些集成来说，价值显而易见：智能灯就是用来开灯的。而对于另一些集成，用户看到集成后会疑惑为什么要费这个功夫。几个具体的用例就能回答这个问题，并且常常能带给人们他们自己想不到的灵感。

用例关注的是“为什么”。[docs-examples](https://www.hasscn.top/contributors/core/quality-scale/docs-examples/) 关注的是“怎么做”，其中提供了可供复制的自动化（automation）。

## 示例

```markdown
## Use cases

The water meter of My Company reports your water usage every minute.
In Home Assistant, you can:

- Track your water usage in the energy dashboard, next to electricity
  and gas.
- Get a notification when water keeps running for an hour, which often
  means a leak or a running toilet.
- Compare your usage per day, to see what the garden sprinklers cost.
```

请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)，以了解这一章节应放置的位置。

## 如何检查

在审查（review）时进行检查，通常是在文档的拉取请求（pull request）上进行。

## 例外情况

此规则没有例外。
