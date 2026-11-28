# 文本实体

> 构建一个文本实体，让人们能够在设备上设置简短的文本值，例如显示屏上的消息或网络名称。

Source: https://www.hasscn.top/contributors/core/entities/text/

文本实体（text entity）让人们能够在设备或服务上设置文本值，例如显示屏上的消息、网络名称或 PIN 码。请继承 `homeassistant.components.text` 中的 `TextEntity`。

文本实体具有一个会一直保持的值。如果您想发送一条送达后即消失的消息（例如推送通知），请改用[通知（notify）](https://www.hasscn.top/contributors/core/entities/notify/)实体。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `native_value` | `str \| None` | 必填 | 当前的文本。 |
| `native_min` | `int` | `0` | 最小字符数（含）。 |
| `native_max` | `int` | `255` | 最大字符数（含）。大于 255 的值将被限制为 255，即 Home Assistant 能够存储的最长状态。 |
| `pattern` | `str \| None` | `None` | 值必须匹配的正则表达式。它通过 `re.match` 进行检查，因此只锚定在开头：若要匹配整个值，请在结尾加上 `$`。 |
| `mode` | `TextMode` | `TextMode.TEXT` | 前端显示该字段的方式：`TextMode.TEXT` 表示普通文本，`TextMode.PASSWORD` 表示隐藏输入内容。 |

每个实体都具有的通用属性，例如 `name`、`available` 和 `unique_id`，请参见[实体类（entity class）](https://www.hasscn.top/contributors/core/entities/entity-class/)。

> [!NOTE]
> `TextMode.PASSWORD` 只是在前端隐藏输入内容。该值仍然是实体的状态，任何能看到该实体的人都可以读取它，并且它会被存储在历史记录中。不要使用文本实体存储真正的机密信息。

## 支持的功能

此实体不支持任何功能。

## 方法

### 设置值

当有人在 UI 中更改文本，或者自动化（automation）或脚本调用 `text.set_value` 动作（action）时被调用。请实现两者之一。

```python
class MyText(TextEntity):
    # Implement one of these methods.

    def set_value(self, value: str) -> None:
        """Set the text value."""

    async def async_set_value(self, value: str) -> None:
        """Set the text value."""
```

该动作会在调用您的方法之前，根据 `native_min`、`native_max` 和 `pattern` 对该值进行检查。不符合要求的值会引发 `ServiceValidationError`，并且您的方法不会被调用。

## 状态

状态为 `native_value`。当 `native_value` 为 `None` 时，状态为 `unknown`。

当状态被写入时，同样的检查也会对您自己的值运行：过短、过长或不匹配 `pattern` 的 `native_value` 会引发 `ValueError`。请确保设备上报的内容符合您设置的限制。

模式、最小值、最大值和正则表达式（pattern）是能力属性（capability attribute）：它们会被写入[实体注册表（entity registry）](https://www.hasscn.top/contributors/core/entities/registry/)，并且不会包含在记录器（recorder）历史中。

## 恢复值

如果文本存储在 Home Assistant 中而不是设备上，请继承 `RestoreText`。在 `async_added_to_hass` 中调用 `await self.async_get_last_text_data()`，以便在重启后恢复上一次的 `native_value`、`native_min` 和 `native_max`。当没有可恢复的内容时，它返回 `None`。

## 示例

```python
from homeassistant.components.text import TextEntity
from homeassistant.const import EntityCategory


class ExampleDisplayMessage(TextEntity):
    """The message on the display of the device."""

    _attr_has_entity_name = True
    _attr_translation_key = "display_message"
    _attr_entity_category = EntityCategory.CONFIG
    _attr_native_max = 32

    def __init__(self, device: ExampleDevice) -> None:
        """Initialize the text entity."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_display_message"
        self._attr_native_value = device.message

    async def async_set_value(self, value: str) -> None:
        """Set the message on the display."""
        await self._device.set_message(value)
        self._attr_native_value = value
        self.async_write_ha_state()
```
