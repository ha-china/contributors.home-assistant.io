# 描述品牌、产品或服务

> 青铜规则 docs-high-level-description：文档描述该集成所连接的对象。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-high-level-description/

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `docs-high-level-description`。

[home-assistant.io](https://www.home-assistant.io/) 上的用户文档以对该集成（integration）所连接的品牌、产品或服务的高层级描述开头。在可能的情况下，它会链接到该品牌、产品或服务的网站。

## 为什么重要

并非每一位访问集成页面的用户都知道它是关于什么的。用几句话介绍产品或服务是什么，能帮助用户在花时间进行设置之前，判断该集成是否适合自己。链接则为他们提供了一个可以了解更多信息的地方。

## 示例

描述是集成页面的开头介绍部分，紧跟在 front matter 之后，且不设标题：

```markdown
The **My integration** {% term integration %} connects Home Assistant
to the smart plugs and switches of [MyCompany](https://www.example.com).
MyCompany makes energy monitoring devices for the home, and is best
known for its MyPlug range.
```

介绍部分还应说明你可以使用该集成做什么。请参阅[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)中集成页面的各个章节，以及[为集成编写文档](https://www.hasscn.top/contributors/writing/guides/integration/)来编写页面。

## 如何检查

在审查阶段检查，即在随集成一同提交的文档拉取请求（pull request）中。

## 例外情况

不连接到设备（device）或服务的集成（例如内部集成）没有任何可描述的内容，因此可以豁免。
