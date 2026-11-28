# 吸尘器实体

> 为能够清扫、回充并清扫家中特定区域的扫地机器人构建吸尘器实体。

Source: https://www.hasscn.top/contributors/core/entities/vacuum/

吸尘器实体（entity）控制扫地机器人：开始和暂停清扫、将其送回充电座，并且在机器人支持的情况下，设置吸力、寻找它或清扫特定房间。继承自 `homeassistant.components.vacuum` 中的 `StateVacuumEntity`。扫地拖地机器人和扫拖一体机器人使用相同的实体。

关于前端如何展示吸尘器，请参阅[吸尘器更多信息视图](https://www.hasscn.top/contributors/design/more-info/vacuum/)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. A robot vacuum that starts, pauses, stops, returns to its dock, and has fan speeds, in a tile card. The card is live: start cleaning, or change the fan speed.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <script type="application/json">
    [
      {
        "entity_id": "vacuum.downstairs",
        "state": "docked",
        "attributes": {
          "friendly_name": "Downstairs vacuum",
          "fan_speed_list": [
            "quiet",
            "standard",
            "max"
          ],
          "fan_speed": "standard",
          "supported_features": 12348
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "vacuum.downstairs",
        "features": [
          {
            "type": "vacuum-commands"
          },
          {
            "type": "vacuum-fan-speed"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 属性

吸尘器实体在[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)的基础上还具有以下属性。每个属性都可以通过其 `_attr_` 属性来设置，例如 `_attr_activity`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `activity` | `VacuumActivity \| None` | `None` | 吸尘器当前正在做什么。参见[状态](https://www.hasscn.top/contributors/core/entities/vacuum/#states)。 |
| `fan_speed` | `str \| None` | `None` | 当前的风速。需要 `VacuumEntityFeature.FAN_SPEED`。 |
| `fan_speed_list` | `list[str]` | 使用 `FAN_SPEED` 时必填 | 吸尘器支持的各个风速。 |

旧版吸尘器实体会报告电池电量和一段状态文本。这些属性已被移除：请将电池作为带有 `battery` 设备类别的[传感器](https://www.hasscn.top/contributors/core/entities/sensor/)暴露，并将错误或详细状态作为单独的传感器或[事件](https://www.hasscn.top/contributors/core/entities/event/)暴露。

## 支持的功能

使用按位或（`|`）运算符组合 `VacuumEntityFeature` 的各个值。Home Assistant 只会提供你所设置功能对应的操作。

| 值 | 描述 |
| ----- | ----------- |
| `STATE` | 吸尘器报告其活动。请在每个吸尘器实体上设置它。 |
| `START` | 吸尘器可以开始或恢复清扫。请实现 `start`。 |
| `PAUSE` | 吸尘器可以暂停清扫。请实现 `pause`。 |
| `STOP` | 吸尘器可以在原地停止。请实现 `stop`。 |
| `RETURN_HOME` | 吸尘器可以返回充电座。请实现 `return_to_base`。 |
| `FAN_SPEED` | 吸尘器具有风速功能。请实现 `set_fan_speed`，并提供 `fan_speed` 和 `fan_speed_list`。 |
| `LOCATE` | 吸尘器可以让用户找到它，通常通过发出声音。请实现 `locate`。 |
| `CLEAN_SPOT` | 吸尘器可以清扫其所在的位置。请实现 `clean_spot`。 |
| `CLEAN_AREA` | 吸尘器可以清扫特定区域。请实现 `async_get_segments` 和 `clean_segments`。参见[清扫区域](https://www.hasscn.top/contributors/core/entities/vacuum/#cleaning-areas)。 |
| `SEND_COMMAND` | 吸尘器接受原始命令。请实现 `send_command`。 |
| `MAP` | 吸尘器具有地图。Home Assistant 没有对应的方法，因此此标志仅用于提供信息。 |

`TURN_ON`、`TURN_OFF` 和 `STATUS` 已被弃用，对于 `StateVacuumEntity` 它们不起任何作用。

相比 `SEND_COMMAND`，请优先使用你的集成提供的专用操作（action）。`vacuum.send_command` 操作接受自由格式的输入，难以使用，也无法很好地编写文档。

## 清扫区域

使用 `CLEAN_AREA`，用户可以让吸尘器清扫 Home Assistant 的[区域](https://www.hasscn.top/contributors/glossary/area/)（例如厨房），而不是制造商应用中的房间。机器人了解自己的房间，在这里称为分区（segment）。用户只需在实体设置中将区域映射到分区一次，Home Assistant 就会将该映射存储在此实体的实体注册表选项中。

你需要实现的部分：

- `async_get_segments()` 以 `Segment(id, name, group)` 列表的形式返回机器人已知的分区。`id` 在实体内必须唯一。`group` 仅用于在映射对话框中对分区进行分组，例如按楼层或按地图分组。Home Assistant 会在用户打开映射时调用它，因此请返回最新的数据。
- `clean_segments(segment_ids)` 或 `async_clean_segments(segment_ids)` 清扫给定的分区。Home Assistant 在将区域转换为分区之后，会从 `vacuum.clean_area` 操作中调用它。

机器人会更改其地图：出现新房间，或者两个房间被合并。为了捕获这种变化，请将机器人当前报告的内容与 `last_seen_segments`（用户上次保存映射时存在的分区）进行比较。当两者不同时，调用 `async_create_segments_issue()`。这会创建一个[修复项（repair）](https://www.hasscn.top/contributors/glossary/repair/)，要求用户更新映射。在保存映射之前，`last_seen_segments` 为 `None`；此时不要触发该修复项。

## 方法

每个方法都有一个同步变体和一个 `async_` 变体。根据你的库是阻塞式还是异步式，实现其中之一即可。

| 方法 | 异步变体 | 功能 |
| ------ | ------------- | ------- |
| `start()` | `async_start()` | `START` |
| `pause()` | `async_pause()` | `PAUSE` |
| `stop(**kwargs)` | `async_stop(**kwargs)` | `STOP` |
| `return_to_base(**kwargs)` | `async_return_to_base(**kwargs)` | `RETURN_HOME` |
| `set_fan_speed(fan_speed, **kwargs)` | `async_set_fan_speed(fan_speed, **kwargs)` | `FAN_SPEED` |
| `locate(**kwargs)` | `async_locate(**kwargs)` | `LOCATE` |
| `clean_spot(**kwargs)` | `async_clean_spot(**kwargs)` | `CLEAN_SPOT` |
| `clean_segments(segment_ids, **kwargs)` | `async_clean_segments(segment_ids, **kwargs)` | `CLEAN_AREA` |
| | `async_get_segments()` | `CLEAN_AREA` |
| `send_command(command, params, **kwargs)` | `async_send_command(command, params, **kwargs)` | `SEND_COMMAND` |

## 状态

状态（state）就是吸尘器的 `activity`，即 `VacuumActivity` 的一个值。`state` 属性是最终确定的：请改为设置 `activity`。

| 值 | 描述 |
| ----- | ----------- |
| `CLEANING` | 吸尘器正在清扫。 |
| `DOCKED` | 吸尘器在充电座中。停在充电座通常也意味着正在充电。 |
| `IDLE` | 吸尘器没有在清扫、没有暂停、不在充电座中，也没有错误。 |
| `PAUSED` | 吸尘器之前正在清扫并被暂停，且没有返回充电座。 |
| `RETURNING` | 吸尘器正在返回充电座的途中。 |
| `ERROR` | 吸尘器遇到了问题，需要帮助。 |

## 示例

```python
from typing import Any

from homeassistant.components.vacuum import (
    StateVacuumEntity,
    VacuumActivity,
    VacuumEntityFeature,
)

ACTIVITIES = {
    "cleaning": VacuumActivity.CLEANING,
    "charging": VacuumActivity.DOCKED,
    "paused": VacuumActivity.PAUSED,
    "returning": VacuumActivity.RETURNING,
}


class MyVacuum(MyEntity, StateVacuumEntity):
    """A robot vacuum."""

    _attr_name = None
    _attr_fan_speed_list = ["quiet", "standard", "max"]
    _attr_supported_features = (
        VacuumEntityFeature.STATE
        | VacuumEntityFeature.START
        | VacuumEntityFeature.PAUSE
        | VacuumEntityFeature.RETURN_HOME
        | VacuumEntityFeature.FAN_SPEED
    )

    def __init__(self, coordinator: MyCoordinator) -> None:
        """Set up the entity."""
        super().__init__(coordinator)
        self._attr_unique_id = coordinator.robot.serial

    @property
    def activity(self) -> VacuumActivity:
        """Return what the robot is doing."""
        return ACTIVITIES.get(
            self.coordinator.data.status, VacuumActivity.IDLE
        )

    @property
    def fan_speed(self) -> str:
        """Return the current fan speed."""
        return self.coordinator.data.fan_speed

    async def async_start(self) -> None:
        """Start or resume cleaning."""
        await self.coordinator.robot.start()
        await self.coordinator.async_request_refresh()

    async def async_pause(self) -> None:
        """Pause cleaning."""
        await self.coordinator.robot.pause()
        await self.coordinator.async_request_refresh()

    async def async_return_to_base(self, **kwargs: Any) -> None:
        """Send the robot back to its dock."""
        await self.coordinator.robot.dock()
        await self.coordinator.async_request_refresh()

    async def async_set_fan_speed(
        self, fan_speed: str, **kwargs: Any
    ) -> None:
        """Set the fan speed."""
        await self.coordinator.robot.set_fan_speed(fan_speed)
        await self.coordinator.async_request_refresh()
```

`MyEntity` 是该集成共享的基础实体，它是一个设置了 `_attr_has_entity_name = True` 和设备信息的 `CoordinatorEntity`。
