# 报警控制面板实体

> 构建一个可布防、撤防并触发安防系统的报警控制面板实体。

Source: https://www.hasscn.top/contributors/core/entities/alarm-control-panel/

报警控制面板实体控制一个安防系统：它可以以一种或多种模式布防系统、撤防系统，并可以触发报警。它可以要求输入密码。继承自 `homeassistant.components.alarm_control_panel` 中的 `AlarmControlPanelEntity`。

系统的传感器，如门磁和移动探测器，是[二进制传感器（binary sensor）](https://www.hasscn.top/contributors/core/entities/binary-sensor/)。属于系统一部分的警报器（siren）则是一个[警报器（siren）](https://www.hasscn.top/contributors/core/entities/siren/)。

有关前端如何显示报警控制面板，请参见[报警控制面板的更多信息视图（more-info view）](https://www.hasscn.top/contributors/design/more-info/alarm-control-panel/)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. 一个报警控制面板，可在在家、离家、夜间模式下布防，显示在磁贴卡片和报警面板卡片中。这些卡片是实时的：您可以在任一卡片中布防或撤防。

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
        "entity_id": "alarm_control_panel.home_alarm",
        "state": "disarmed",
        "attributes": {
          "friendly_name": "Home alarm",
          "code_arm_required": false,
          "supported_features": 15
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "alarm_control_panel.home_alarm",
        "features": [
          {
            "type": "alarm-modes"
          }
        ]
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "alarm-panel",
        "entity": "alarm_control_panel.home_alarm"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 属性

报警控制面板实体在[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)的基础上还具有以下属性。每个属性都可以通过其对应的 `_attr_` 特性进行设置，例如 `_attr_alarm_state`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `alarm_state` | `AlarmControlPanelState \| None` | 必填 | 报警的状态。参见[状态](https://www.hasscn.top/contributors/core/entities/alarm-control-panel/#states)。 |
| `code_format` | `CodeFormat \| None` | `None` | 面板要求输入的密码类型：`CodeFormat.NUMBER` 或 `CodeFormat.TEXT`。`None` 表示无需密码。 |
| `code_arm_required` | `bool` | `True` | 布防时是否需要密码。撤防时，只要有密码就总是会将密码传递过去。 |
| `changed_by` | `str \| None` | `None` | 最后更改报警的人或事物。 |

`code_format` 告诉前端应显示哪种键盘：`NUMBER` 显示数字键盘，`TEXT` 显示文本输入框。

## 密码

您的方法通过 `code` 参数接收密码，如果没有密码则为 `None`。用户可以在实体设置中存储默认密码。当撤防或布防操作未提供密码时，Home Assistant 会使用该默认密码。触发操作则不会：`alarm_trigger` 只会获取操作中附带的密码。它会为您从[实体注册表选项](https://www.hasscn.top/contributors/core/entities/registry/)中读取该设置。

当 `code_arm_required` 为 `True`、布防操作没有密码且也没有默认密码时，Home Assistant 会在调用您的方法之前抛出验证错误。当面板可以在无密码情况下布防时，请将 `code_arm_required` 设置为 `False`。

## 支持的功能

将 `AlarmControlPanelEntityFeature` 标志用 `|` 组合起来，并将其设置为 `supported_features`。参见[支持的功能（supported features）](https://www.hasscn.top/contributors/glossary/supported-features/)。撤防始终可用。

| 值 | 描述 |
| ----- | ----------- |
| `ARM_HOME` | 报警可以在在家（home）模式下布防。请实现 `alarm_arm_home`。 |
| `ARM_AWAY` | 报警可以在离家（away）模式下布防。请实现 `alarm_arm_away`。 |
| `ARM_NIGHT` | 报警可以在夜间（night）模式下布防。请实现 `alarm_arm_night`。 |
| `ARM_VACATION` | 报警可以在度假（vacation）模式下布防。请实现 `alarm_arm_vacation`。 |
| `ARM_CUSTOM_BYPASS` | 报警可以在旁路（bypass）部分防区的情况下布防。请实现 `alarm_arm_custom_bypass`。 |
| `TRIGGER` | 报警可以从 Home Assistant 触发。请实现 `alarm_trigger`。 |

## 方法

请实现每个方法的同步（sync）或异步（async）变体，不要两者都实现。每个方法都接受 `code: str | None = None` 参数。

| 方法 | 异步变体 | 功能 |
| ------ | ------------- | ------- |
| `alarm_disarm` | `async_alarm_disarm` | 始终 |
| `alarm_arm_home` | `async_alarm_arm_home` | `ARM_HOME` |
| `alarm_arm_away` | `async_alarm_arm_away` | `ARM_AWAY` |
| `alarm_arm_night` | `async_alarm_arm_night` | `ARM_NIGHT` |
| `alarm_arm_vacation` | `async_alarm_arm_vacation` | `ARM_VACATION` |
| `alarm_arm_custom_bypass` | `async_alarm_arm_custom_bypass` | `ARM_CUSTOM_BYPASS` |
| `alarm_trigger` | `async_alarm_trigger` | `TRIGGER` |

## 状态

状态是 `alarm_state` 的值，来自 `AlarmControlPanelState` 枚举。当 `alarm_state` 为 `None` 时，状态为 `unknown`。

| 值 | 描述 |
| ----- | ----------- |
| `DISARMED` | 报警已撤防。 |
| `ARMED_HOME` | 报警已在在家模式下布防。 |
| `ARMED_AWAY` | 报警已在离家模式下布防。 |
| `ARMED_NIGHT` | 报警已在夜间模式下布防。 |
| `ARMED_VACATION` | 报警已在度假模式下布防。 |
| `ARMED_CUSTOM_BYPASS` | 报警在一个或多个防区（zone）或传感器被旁路的情况下布防，且其组合与在家、离家或夜间模式均不匹配。不要用它来表示传感器已断开、损坏或电量不足。这些情况应通过传感器自身的传感器实体来报告。 |
| `PENDING` | 报警即将触发，为您留出撤防的时间。 |
| `ARMING` | 报警正在布防，通常处于退出延时（exit delay）期间。 |
| `DISARMING` | 报警正在撤防。 |
| `TRIGGERED` | 报警已触发。 |

## 示例

```python
from homeassistant.components.alarm_control_panel import (
    AlarmControlPanelEntity,
    AlarmControlPanelEntityFeature,
    AlarmControlPanelState,
    CodeFormat,
)


class MyAlarm(AlarmControlPanelEntity):
    """An alarm panel that arms home and away."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_code_format = CodeFormat.NUMBER
    _attr_supported_features = (
        AlarmControlPanelEntityFeature.ARM_HOME
        | AlarmControlPanelEntityFeature.ARM_AWAY
    )

    def __init__(self, panel: MyPanel) -> None:
        """Set up the alarm panel."""
        self._panel = panel
        self._attr_unique_id = panel.serial

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        """Return the state of the alarm."""
        return AlarmControlPanelState(self._panel.state)

    async def async_alarm_disarm(self, code: str | None = None) -> None:
        """Disarm the alarm."""
        await self._panel.disarm(code)

    async def async_alarm_arm_home(self, code: str | None = None) -> None:
        """Arm the alarm in home mode."""
        await self._panel.arm("home", code)

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        """Arm the alarm in away mode."""
        await self._panel.arm("away", code)
```
