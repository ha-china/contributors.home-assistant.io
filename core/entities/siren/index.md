# 警报器实体

> 构建一个警报器实体，适用于以音调、音量和持续时间发声的警报器和门铃。

Source: https://www.hasscn.top/contributors/core/entities/siren/

警报器（siren）实体控制能发出响亮声音以引起注意的设备：报警警笛、频闪警报器或门铃。它可以打开和关闭，并且可以接受音调、音量和持续时间。继承 `homeassistant.components.siren` 中的 `SirenEntity`。它基于开关实体（toggle entity）构建，因此具有 `is_on`、`turn_on` 和 `turn_off`。

警报器所属的安全系统是[报警控制面板（alarm control panel）](https://www.hasscn.top/contributors/core/entities/alarm-control-panel/)。播放任意音频的扬声器是[媒体播放器（media player）](https://www.hasscn.top/contributors/core/entities/media-player/)。

## 属性

警报器实体在[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)的基础上还具有以下属性。每个属性都可以通过其 `_attr_` 属性设置，例如 `_attr_available_tones`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `is_on` | `bool \| None` | `None` | 警报器是否正在发声。 |
| `available_tones` | `list[int \| str] \| dict[int, str] \| None` | `None` | 警报器可以播放的音调。使用 `TONES` 时必填。也可以在实体描述（entity description）中设置。 |

`available_tones` 是音调名称或数字的列表，或者是从音调数字到音调名称的字典。使用字典时，动作（action）可以通过名称选择音调，Home Assistant 会将对应的数字传递给你。

## 支持的功能

将 `SirenEntityFeature` 标志用 `|` 组合起来，并将其设置为 `supported_features`。参见[支持的功能](https://www.hasscn.top/contributors/glossary/supported-features/)。

| 值 | 描述 |
| ----- | ----------- |
| `TURN_ON` | 警报器可以被打开。需实现 `turn_on`。 |
| `TURN_OFF` | 警报器可以被关闭。需实现 `turn_off`。 |
| `TONES` | 警报器可以播放不同的音调。需设置 `available_tones`。 |
| `VOLUME_SET` | 警报器打开时可以设置音量。 |
| `DURATION` | 警报器打开时可以设置持续时间。 |

## 方法

实现每个方法的同步或异步变体，不要两者都实现。

| 方法 | 异步变体 | 功能 |
| ------ | ------------- | ------- |
| `turn_on(**kwargs: Any)` | `async_turn_on` | `TURN_ON` |
| `turn_off(**kwargs: Any)` | `async_turn_off` | `TURN_OFF` |

`turn_on` 可以接收以下关键字参数，仅适用于你所设置的功能：

- `ATTR_TONE`：要播放的音调，会先根据 `available_tones` 进行检查
- `ATTR_VOLUME_LEVEL`：音量，取值范围为 0 到 1
- `ATTR_DURATION`：发声时长，以秒为单位

## 状态

状态为 `on` 或 `off`，由 `is_on` 决定。当 `is_on` 为 `None` 时，状态为 `unknown`。

`available_tones` 是一个能力属性。只有当警报器支持 `TONES` 时它才会存在，并且它不会包含在 recorder 的历史记录中。

## 示例

```python
from typing import Any

from homeassistant.components.siren import (
    ATTR_TONE,
    SirenEntity,
    SirenEntityFeature,
)


class MySiren(SirenEntity):
    """A siren with a few tones."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_available_tones = {1: "fire", 2: "intruder", 3: "doorbell"}
    _attr_supported_features = (
        SirenEntityFeature.TURN_ON
        | SirenEntityFeature.TURN_OFF
        | SirenEntityFeature.TONES
    )

    def __init__(self, device: MyDevice) -> None:
        """Set up the siren."""
        self._device = device
        self._attr_unique_id = device.serial

    @property
    def is_on(self) -> bool:
        """Return if the siren sounds."""
        return self._device.sounding

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Sound the siren."""
        await self._device.sound(tone=kwargs.get(ATTR_TONE, 1))

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Silence the siren."""
        await self._device.silence()
```
