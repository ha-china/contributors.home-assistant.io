# 操作失败时抛出异常

> Silver 级规则 action-exceptions：操作失败时抛出 ServiceValidationError 或 HomeAssistantError。

Source: https://www.hasscn.top/contributors/core/quality-scale/action-exceptions/

这是一条 Silver 级规则。在 `quality_scale.yaml` 中，它被称为 `action-exceptions`。

当[操作（action）](https://www.hasscn.top/contributors/glossary/action/)失败时，集成（integration）必须抛出异常，而不是静默失败或仅写入日志。当用户做错了什么，例如传入无效输入或指向不存在的内容时，应抛出 `ServiceValidationError`。当操作本身失败时，例如网络错误或设备报告的错误，应抛出 `HomeAssistantError`。

这不仅针对你的集成注册的操作。实体（entity）操作同样适用：当开启 `light` 或按下 `button` 失败时，实体会抛出异常。

## 为什么它很重要

异常是用户得知出了问题的唯一途径。Home Assistant 会在 UI 中显示异常消息，运行该操作的自动化（automation）或脚本会带着错误停止，而不是像一切正常那样继续执行。

这两种异常类型能够说明是谁导致了问题。`ServiceValidationError` 表示用户可以通过修改输入来解决问题。`HomeAssistantError` 表示操作在集成或设备一侧失败。UI 会将它们报告为不同的错误，因此用户知道该从哪里入手排查。

## 示例

这个操作用于设置日程计划。结束日期早于开始日期是用户错误，而连接错误则是操作本身的失败：

```python
from homeassistant.exceptions import (
    HomeAssistantError,
    ServiceValidationError,
)


async def async_set_schedule(call: ServiceCall) -> None:
    """Set the schedule for a day."""
    start_date = call.data[ATTR_START_DATE]
    end_date = call.data[ATTR_END_DATE]
    if end_date < start_date:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="end_before_start",
        )

    entry = service.async_get_config_entry(
        call.hass, DOMAIN, call.data[ATTR_CONFIG_ENTRY_ID]
    )
    try:
        await entry.runtime_data.set_schedule(start_date, end_date)
    except MyConnectionError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="cannot_connect",
        ) from err
```

实体操作也是一样：

```python
async def async_turn_on(self, **kwargs: Any) -> None:
    """Turn the switch on."""
    try:
        await self.client.turn_on()
    except MyConnectionError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="cannot_connect",
        ) from err
```

像 `HomeAssistantError("Cannot connect")` 这样简单直白的消息，对于这条规则来说已经足够。而像示例中那样经过翻译的消息，则是 Gold 级规则 [exception-translations](https://www.hasscn.top/contributors/core/quality-scale/exception-translations/) 的要求。

不要在抛出错误之前先记录日志。Home Assistant 本身已经会报告该异常，如果再记录日志，就会导致它被报告两次。

## 如何检查

- Pylint 会标记捕获异常后未重新抛出的操作处理程序，例如空的 `except` 块、仅记录日志的块，或 `contextlib.suppress`（`home-assistant-action-swallowed-exception`）。
- 当在抛出错误的同一代码块中更早的位置以 warning 或更高日志级别记录了错误时，Pylint 会发出警告（`home-assistant-log-and-raise`）。
- 是否抛出了正确的异常类型会在代码审查（review）时检查。

## 例外情况

如果集成没有注册自己的操作，且只包含只读平台，例如 `sensor` 和 `binary_sensor`，则此规则不适用。

## 相关规则

- [exception-translations](https://www.hasscn.top/contributors/core/quality-scale/exception-translations/)：翻译异常消息。
- [action-setup](https://www.hasscn.top/contributors/core/quality-scale/action-setup/)：在 async_setup 中注册操作。
