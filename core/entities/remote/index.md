# 遥控器实体

> 向其他设备发送命令，就像万能遥控器上的按钮一样，还可以在多个活动之间切换。

Source: https://www.hasscn.top/contributors/core/entities/remote/

遥控器（remote）实体（entity）会向设备发送命令，其工作方式就像遥控器上的按钮。它可以是一个物理遥控器或集线器（hub），例如发射红外代码的万能遥控器，也可以是一个虚拟遥控器，通过网络与电视或机顶盒通信。除了单个命令之外，遥控器还可以支持活动（activity）：例如一个“观看电视”的宏，它会打开电视和接收器，并选择正确的输入源。

继承自 `RemoteEntity`，从 `homeassistant.components.remote` 导入。它构建于 `ToggleEntity` 之上，因此像[开关（switch）](https://www.hasscn.top/contributors/core/entities/switch/)一样具有开和关两种状态。当您的用户需要发送任意命名的命令时，请使用遥控器实体。如果您只是传输原始信号供其他集成（integration）使用，请改为查看[红外（infrared）](https://www.hasscn.top/contributors/core/entities/infrared/)和[射频（radio frequency）](https://www.hasscn.top/contributors/core/entities/radio-frequency/)实体。

## 属性

这些属性是遥控器实体特有的。每个实体都具有的通用属性见[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `is_on` | `bool \| None` | `None` | 遥控器或其控制的设备是否处于开启状态。`None` 表示未知。 |
| `current_activity` | `str \| None` | `None` | 当前正在运行的活动。 |
| `activity_list` | `list[str] \| None` | `None` | 用户可以从中选择的活动。 |
| `supported_features` | `RemoteEntityFeature` | `RemoteEntityFeature(0)` | 此遥控器支持的功能。见下文。 |

只有当实体支持 `RemoteEntityFeature.ACTIVITY` 时，`current_activity` 和 `activity_list` 才会出现在状态属性中。

## 支持的功能

使用按位或（`|`）运算符组合 `RemoteEntityFeature` 的各个标志位。

| 标志位 | 描述 |
| --- | --- |
| `LEARN_COMMAND` | 遥控器可以从另一个遥控器学习新命令。实现 `learn_command`。 |
| `DELETE_COMMAND` | 遥控器可以删除它学到的命令。实现 `delete_command`。 |
| `ACTIVITY` | 遥控器具有活动。实现 `current_activity` 和 `activity_list`，并在开启时处理 `activity` 参数。 |

## 活动

活动是遥控器上预定义的宏，例如“观看电视”或“聆听音乐”。启动一个活动即可同时让多台设备进入已知状态。

`remote.turn_on`、`remote.turn_off` 和 `remote.toggle` 这些动作（action）接受一个可选的 `activity`。它会以 `kwargs.get("activity")` 的形式出现在您方法的 `kwargs` 中（对应常量是 `homeassistant.components.remote` 中的 `ATTR_ACTIVITY`）。请通过 `current_activity` 报告当前正在运行的活动，以便用户可以查看该活动并基于它创建自动化。

## 方法

每个方法都有一个同步（sync）变体和一个异步（async）变体。实现其中之一即可。

### 开启、关闭和切换

```python
class MyRemote(RemoteEntity):
    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the remote on, optionally starting an activity."""

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the remote off."""
```

同步变体是 `turn_on` 和 `turn_off`。切换功能由 `ToggleEntity` 自动提供：它会根据 `is_on` 调用开启或关闭。只有当您的设备具有真正的切换命令时，才需要实现 `async_toggle`。

### 发送命令

由 `remote.send_command` 动作调用。`command` 是一个命令名称列表。`kwargs` 包含 `num_repeats`（默认为 `1`）和 `hold_secs`（默认为 `0`）；如果用户提供了，还会包含 `device` 和 `delay_secs`。当用户未提供 `delay_secs` 时，请使用您自己的默认值（常量 `DEFAULT_DELAY_SECS` 为 `0.4`）。

```python
class MyRemote(RemoteEntity):
    async def async_send_command(
        self, command: Iterable[str], **kwargs: Any
    ) -> None:
        """Send commands to a device."""
```

同步变体是 `send_command`。

### 学习命令

仅适用于带有 `RemoteEntityFeature.LEARN_COMMAND` 的遥控器。由 `remote.learn_command` 动作调用，它可以在 `kwargs` 中传递 `device`、`command`、`command_type`、`alternative` 和 `timeout`。

```python
class MyRemote(RemoteEntity):
    async def async_learn_command(self, **kwargs: Any) -> None:
        """Learn a command from a device."""
```

同步变体是 `learn_command`。

### 删除命令

仅适用于带有 `RemoteEntityFeature.DELETE_COMMAND` 的遥控器。由 `remote.delete_command` 动作调用，`kwargs` 中包含 `command` 和一个可选的 `device`。

```python
class MyRemote(RemoteEntity):
    async def async_delete_command(self, **kwargs: Any) -> None:
        """Delete a learned command."""
```

同步变体是 `delete_command`。

## 状态

状态来自 `is_on`。

| 状态 | 条件 |
| --- | --- |
| `on` | `is_on` 为 `True`。 |
| `off` | `is_on` 为 `False`。 |
| `unknown` | `is_on` 为 `None`。 |

## 示例

一个支持活动功能的媒体集线器网络遥控器。

```python
from collections.abc import Iterable
from typing import Any

from homeassistant.components.remote import (
    ATTR_ACTIVITY,
    RemoteEntity,
    RemoteEntityFeature,
)


class MyHubRemote(RemoteEntity):
    """Remote for a media hub."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_supported_features = RemoteEntityFeature.ACTIVITY

    def __init__(self, hub: MyHub) -> None:
        """Initialize the remote."""
        self._hub = hub
        self._attr_unique_id = hub.serial
        self._attr_activity_list = hub.activities

    @property
    def is_on(self) -> bool:
        """Return if an activity is running."""
        return self._hub.current_activity is not None

    @property
    def current_activity(self) -> str | None:
        """Return the running activity."""
        return self._hub.current_activity

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Start an activity, or the default one."""
        activity = kwargs.get(ATTR_ACTIVITY) or self._hub.default_activity
        await self._hub.start_activity(activity)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Stop the running activity."""
        await self._hub.power_off()

    async def async_send_command(
        self, command: Iterable[str], **kwargs: Any
    ) -> None:
        """Send one or more commands."""
        for _ in range(kwargs.get("num_repeats", 1)):
            for single_command in command:
                await self._hub.press(single_command)
```
