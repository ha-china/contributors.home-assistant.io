# 记录支持的设备

> Gold（金牌）规则 docs-supported-devices：文档中列出已知支持和不支持的设备。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-supported-devices/

这是一条 Gold（金牌）规则。在 `quality_scale.yaml` 中，它被称为 `docs-supported-devices`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成（integration）页面列出了已知可以正常工作的设备（device），以及已知无法工作的设备。当逐个列出型号并不现实时，可以描述设备类别，例如“运行 2.0 或更新固件的每台设备”。

## 为什么重要

许多人购买设备是因为 Home Assistant 支持这些设备。如果文档没有说明哪些型号可以工作，他们只会在购买之后、设置失败时才发现。一份清晰的列表可以避免这种情况，还能让你免于收到那些使用了从未受支持设备的用户提交的 issue。

## 示例

```markdown
## Supported devices

These devices are known to work with the integration:

- My Thermostat 2 and 3
- My Hub, with firmware 4.1 or newer
- Every device that runs MyOS

## Unsupported devices

These devices do not work with the integration:

- My Thermostat 1: it has no local API
- Devices made before 2015
```

有关此部分应放置的位置，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 如何检查

在评审（review）中检查，通常是在文档的拉取请求（pull request）上进行。

## 例外情况

如果集成不连接设备或服务（service），或者不集成物理设备，则此规则不适用。
