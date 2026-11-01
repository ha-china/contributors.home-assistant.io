---
title: "ScannerEntity 现在像其他实体一样处理设备"
description: 自 Home Assistant Core 2026.11 起，集成决定 ScannerEntity 包含在哪个设备中，与其他任何实体一样，并且 ScannerEntity 默认处于禁用状态。
date: 2026-10-28
authors:
  - Erik Montnémery
areas:
  - core
---

自 Home Assistant Core 2026.11 起，`ScannerEntity`（用于路由器或其他网络扫描器所看到的客户端设备跟踪器的基类）的特殊规则更少了。它现在像任何其他实体一样处理设备，并且默认处于禁用状态。

## 设备的工作方式与其他任何实体相同

到目前为止，`ScannerEntity` 的 `device_info` 是最终的，并且始终为 `None`。基类为跟踪器自身的 MAC 地址添加了一个设备，但仅当另一个集成已注册了具有相同 MAC 地址的设备时才这样做。在此之前创建的跟踪器获得了一个不带设备名称的实体 ID，并一直保留该 ID。用户启用的跟踪器只有在另一个集成知道其 MAC 地址后才获得设备。

现在，`device_info` 不再是最终的。设置 `_attr_device_info` 以将跟踪器包含在设备中，就像任何其他实体一样。要将其包含在跟踪客户端的设备中，请使用客户端的 MAC 地址作为连接。

直到 Home Assistant Core 2028.11，基类仍会为具有 MAC 地址但没有设备信息的跟踪器设置设备信息：一个以 MAC 地址作为连接、以主机名命名的设备，或者当设备是新的时以 MAC 地址命名。从 2028.11 开始，没有设备信息的跟踪器不会包含在设备中。

如果您的跟踪器不应包含在设备中，请在弃用期间设置 `_attr_device_info = DeviceInfo()`。空的设备信息表示没有设备，默认值仅在设备信息为 `None` 时适用，因此基类不会干扰您的跟踪器。

## 作为设备主要功能的跟踪器没有名称

当跟踪器是其设备的主要功能时，例如路由器客户端跟踪器位于该客户端的设备中，它自己的名称会导致名称重复，如 `device_tracker.printer_printer`。这也适用于从基类获得默认设备信息的跟踪器，因为该设备以客户端命名。给这样的跟踪器不设名称，并将客户端名称放在设备上：

```python
class ExampleClientTracker(ScannerEntity):
    """A client connected to an example router."""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, client: ExampleClient) -> None:
        """Initialize the tracker."""
        self._attr_mac_address = client.mac
        self._attr_hostname = client.hostname
        self._attr_device_info = DeviceInfo(
            connections={(CONNECTION_NETWORK_MAC, client.mac)}, name=client.name
        )
```

当客户端名称在 Home Assistant 运行期间发生变化时，使用 `async_update_device` 重命名设备。跟踪器中的代码仅在其启用时运行；禁用的跟踪器会在下次集成设置时在其设备上获得当前名称。

## 跟踪器默认处于禁用状态

`ScannerEntity` 现在始终默认处于禁用状态。以前，当其 MAC 地址属于另一个集成的设备时，它会启用，并且当此类设备稍后出现时，禁用的跟踪器会被启用。这两个规则都已移除。用户最想跟踪的设备（如手机）通常通过 Home Assistant Companion 应用进行跟踪，该应用不报告 MAC 地址，因此这些规则很少起作用。已存在的跟踪器保持其状态。

当跟踪器不仅仅是网络上看到的另一个客户端时，请覆盖 `_attr_entity_registry_enabled_default`。例如，当跟踪是设备的目的时，如 ZHA 建模为设备跟踪器的 Zigbee 存在标签，或者当用户自行设置了被跟踪的设备时。

## 您的集成需要更改的内容

- 为您希望跟踪器所在的设备设置 `_attr_device_info`。对于被跟踪客户端的设备，请使用客户端的 MAC 地址作为连接，并使用客户端名称作为 `name`。不要依赖基类的默认设备信息，它将在 2028.11 中移除。要将跟踪器排除在设备之外，请设置 `_attr_device_info = DeviceInfo()`。
- 当跟踪器是其设备的主要功能时，移除跟踪器的名称：`_attr_name` 或 `name` 属性。
- 当客户端名称在运行时发生变化时，重命名设备。
- 当您的集成从跟踪器的实体注册表条目中读取 `original_name`（例如在启动时恢复离线的客户端）时，请改为读取设备名称：对于没有名称的跟踪器，`original_name` 为 `None`。
- 当您的跟踪器的基类为另一个设备（如路由器）设置 `_attr_device_info` 时，请检查您是否希望跟踪器包含在该设备中。以前它会被忽略，现在它会将跟踪器包含在该设备中。

阅读更多关于 [`ScannerEntity`](/core/entities/device-tracker/#scannerentity) 的内容，或查看核心集成在 [core PR #188883](https://github.com/home-assistant/core/pull/188883) 中的迁移方式。
