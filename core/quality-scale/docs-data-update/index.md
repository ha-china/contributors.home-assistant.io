# 记录数据更新方式

> Gold 规则 docs-data-update：文档说明数据如何更新以及更新的频率。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-data-update/

这是一条 Gold 规则。在 `quality_scale.yaml` 中，它被称为 `docs-data-update`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成（integration）页面会说明该集成如何获取数据：是由集成轮询（polling）设备或服务（service）以及轮询频率如何，还是由设备推送更新。如果存在限制，例如某个 API 每天只允许一定数量的请求，或者某个设备难以应对频繁的请求，页面上也会予以说明。

## 为什么这很重要

数据如何更新决定了用户能用集成做什么。一个每 5 分钟才被轮询一次的移动传感器，无法在人走进房间时用来开灯；而一个主动推送状态（state）的传感器则非常适合这种场景。用户在购买设备或基于设备构建自动化（automation）之前，需要了解这些信息。

用户可以自行设置轮询间隔，因此他们也需要了解默认值，以及不宜设置得更低的原因。

## 示例

在集成页面中添加一个"Data updates"（数据更新）章节：

```markdown
## Data updates

The integration {% term polling "polls" %} the device every 5 minutes.
Devices with firmware 2.0 or newer can push their data instead. The
integration turns that on when it starts, and only falls back to polling
when it fails.

The cloud API allows 1,000 requests per day. Polling more often than every
2 minutes can get your account blocked for the rest of the day.
```

关于该章节应放置的位置，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 如何检查

在审查过程中进行检查，通常是在文档的 pull request 中进行。

## 例外

如果集成不从设备或服务获取数据，即它既不进行轮询也不接收更新，则此规则不适用。
