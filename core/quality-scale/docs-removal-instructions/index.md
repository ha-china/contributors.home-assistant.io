# 记录如何移除集成

> 铜牌（Bronze）规则 docs-removal-instructions：文档需说明如何移除集成。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-removal-instructions/

这是一条铜牌（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `docs-removal-instructions`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成页面必须说明如何移除集成。如果只需从 Home Assistant 中移除即可，请直接说明。如果还有其他需要清理的内容，比如厂商应用中的令牌（token）或设备上的某项设置，也请描述这些步骤。

## 为什么重要

移除集成并不总是像在 Home Assistant 中删除它那么简单。云服务可能会将 Home Assistant 保留在已连接的应用列表中，或者设备可能会继续向一个不再监听的地址推送数据。想要重新开始或停止使用某个设备的用户，需要知道会留下哪些残留内容。

## 示例

对于 Home Assistant 中的步骤，请使用标准的 include，并添加任何与你的集成相关的特定内容：

```markdown
## Removing the integration

This integration follows standard integration removal.

{% include integrations/remove_device_service.md %}

After you remove the integration, open the **MyProduct** app and remove
Home Assistant from the list of connected apps.
```

有关这部分内容在页面中的位置，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 检查方式

在文档拉取请求（pull request）的审查过程中进行检查。

## 例外情况

此规则没有例外。

## 相关规则

- [docs-installation-instructions](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-instructions/)：记录安装过程。
