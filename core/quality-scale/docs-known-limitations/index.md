# 记录已知限制

> 黄金规则 docs-known-limitations：文档中列出已知限制。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-known-limitations/

这是一条黄金规则。在 `quality_scale.yaml` 中，它被称为 `docs-known-limitations`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成页面列出了集成无法做到或无法做好的事项，无论是设计使然，还是由于设备或服务的原因。限制不是缺陷（bug）：缺陷应提交到 GitHub 上的问题跟踪器（issue tracker）中，而不是写在文档里。

## 为什么这很重要

用户迟早会发现某项限制。在购买设备或花一晚上折腾自动化之前，就从文档中了解到限制，远比在尝试失败、问题被以“符合预期”（works as intended）为由关闭后才发现要好得多。

坦诚说明限制还能为你省去支持方面的提问。

## 示例

```markdown
## Known limitations

- The integration cannot reboot the device. Use the app of the
  manufacturer for that.
- The cloud API updates the energy usage once per hour, so the energy
  sensors lag up to an hour behind.
```

有关此章节应放置的位置，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 如何检查

在审查时检查，通常是在文档的拉取请求（pull request）上进行。

## 例外情况

如果集成没有已知限制，则此规则不适用。
