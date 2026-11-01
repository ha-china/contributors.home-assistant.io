---
title: Modbus 设备
description: 如何使用 modbus-connection 为 Modbus 设备编写库，以及您的集成如何与其他集成共享同一个 Modbus 连接。
sidebarGroup: APIs
order: 34
---

Modbus 是一种轮询协议，可通过串行线路和 TCP 运行。它起源于工业领域，如今在家庭中常见于太阳能逆变器、电能表、热泵和电池等设备。其中许多设备只支持 Modbus，不支持其他协议。

与所有集成一样，Modbus 集成通过[库](/core/integrations/api-library/)与其设备通信。本页介绍 Modbus 的特殊之处：可基于其构建的共享库，以及共享一个连接。

## 基于 modbus-connection 构建您的库

Home Assistant 项目维护着 [`modbus-connection`](https://github.com/home-assistant-libs/modbus-connection)，这是一个用于构建 Modbus 设备库的 Python 包。它为您提供：

- 在两个流行的 Modbus 库 [pymodbus](https://github.com/pymodbus-dev/pymodbus) 和 [tmodbus](https://github.com/wlcrs/tmodbus) 之上提供统一接口。您的库可以与其中任何一个配合使用，后端可以更换而无需更改您的代码。
- 一个用于对设备建模的框架：将设备的寄存器和线圈映射为带类型的 Python 属性，并以尽可能少的请求读取整个设备。
- 一个 `pytest` 插件，无需硬件即可测试您的库。

完整示例请参见 [sofar-modbus](https://github.com/darkrain-nl/sofar-modbus)，这是一个基于 `modbus-connection` 构建的设备库，以及使用它的 [`sofar` 集成](https://github.com/home-assistant/core/tree/dev/homeassistant/components/sofar)。

您的库从 `modbus-connection` 获取一个 `ModbusUnit`，即 Modbus 链路上通往一个单元（unit）的连接，并通过它完成所有操作。它从不自行打开连接。这正是下一部分得以实现的基础。

## 共享一个连接

一条 Modbus 链路可以寻址多个单元，而设备一次只能响应一个请求。如果两个集成各自打开自己的套接字连接到同一设备，它们会互相争抢，并且都会收到错误。

因此，不要在您的集成中打开连接，而是向 `modbus` 集成请求一个单元。它会通过在所有请求相同链路的集成之间共享的连接来分发单元：

```python
from modbus_connection import ModbusTcpParams

from homeassistant.components.modbus import async_get_unit


async def async_setup_entry(
    hass: HomeAssistant, entry: MyConfigEntry
) -> None:
    """Set up my device from a config entry."""
    unit = async_get_unit(
        hass,
        entry,
        ModbusTcpParams(
            host=entry.data[CONF_HOST], port=entry.data[CONF_PORT]
        ),
        entry.data[CONF_UNIT_ID],
    )
    entry.runtime_data = MyDevice(unit)
    ...
```

像其他集成一样，在您自己的配置流程（config flow）中收集连接详细信息。以相同详细信息发起请求的两个集成会在同一个连接上获得单元，它们的请求会依次排队执行。对于其他类型的链路，请使用 `ModbusUdpParams`、`ModbusTlsParams` 或 `ModbusSerialParams`。

该连接不会存储在任何地方。只要仍有某个配置条目（config entry）在其上持有单元，它就存在；当最后一个配置条目卸载时，它就会关闭。您的条目数据仍归您自己所有。

请求单元不会执行任何 I/O 操作，因此处于关闭状态的设备不会阻止您的集成完成设置。第一个请求会打开链路，断开的链路会在下一次请求时重新打开。当连接断开时，请不要重新加载您的配置条目。

如果同一设备已在使用中，但链路设置不同（例如波特率不同），`async_get_unit` 将引发 `HomeAssistantError`。一个连接无法同时满足两种设置。

## 在配置流程期间与设备通信

在配置流程中，还没有可用于绑定单元的配置条目。可以使用 `async_get_temporary_unit` 暂时持有一个单元：

```python
from modbus_connection import ModbusTcpParams

from homeassistant.components.modbus import async_get_temporary_unit


async def async_validate_input(
    hass: HomeAssistant, params: ModbusTcpParams, unit_id: int
) -> None:
    """Check that the device can be reached."""
    async with async_get_temporary_unit(hass, params, unit_id) as unit:
        await MyDevice(unit).async_validate()
```

如果某个配置条目已经持有该连接，则临时单元会共享该连接。否则，当 `async with` 代码块结束时，连接将被关闭。
