# 翻译异常消息

> 黄金级规则 exception-translations：向用户显示的错误来自 strings.json，因此可以被翻译。

Source: https://www.hasscn.top/contributors/core/quality-scale/exception-translations/

这是一条黄金级（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `exception-translations`。

到达用户的异常应该是可翻译的。抛出 `HomeAssistantError` 或其子类（如 `ServiceValidationError`）时，应附带 `translation_domain` 和 `translation_key`，而不是硬编码的英文消息，并将该消息放入 `strings.json` 的 `exceptions` 部分。

## 为什么重要

当操作（action）失败时，用户会在界面中看到错误消息。对于以自己的母语运行 Home Assistant 的用户来说，在已翻译的界面中夹杂一条英文错误会更难以理解，而恰恰在此时，他们最需要明白到底哪里出了问题。

继承自 `HomeAssistantError` 的异常开箱即支持翻译，因此只需一个键和一个字符串即可。

## 示例

```python
async def async_set_schedule(call: ServiceCall) -> None:
    """Set the schedule for a day."""
    start = call.data[ATTR_START_DATE]
    end = call.data[ATTR_END_DATE]
    if end < start:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="end_before_start",
        )

    try:
        await client.set_schedule(start, end)
    except MyConnectionError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="cannot_connect",
            translation_placeholders={"error": str(err)},
        ) from err
```

`strings.json`:

```json
{
  "exceptions": {
    "end_before_start": {
      "message": "The end date can't be before the start date."
    },
    "cannot_connect": {
      "message": "Could not connect to the device: {error}"
    }
  }
}
```

不要同时传入消息：使用翻译键时，消息来自 `strings.json`。

## 检查方式

- Pylint，当规则状态为 `done` 时：抛出带有硬编码消息的 `HomeAssistantError` 或其子类会被标记（`home-assistant-exception-not-translated`）。
- Pylint，针对每个集成：翻译键必须存在于 `strings.json` 的 `exceptions` 部分中（`home-assistant-exception-translation-key-missing`），`translation_domain` 和 `translation_key` 必须一起设置（`home-assistant-exception-translation-key-domain-mismatch`），占位符必须与消息匹配（`home-assistant-exception-placeholder-mismatch`），并且翻译键旁不能再有消息（`home-assistant-exception-message-with-translation`）。
- 当操作抛出的异常缺少翻译时，测试将失败。

## 例外情况

如果集成不会自行抛出任何异常，则此规则不适用。

## 相关规则

- [entity-translations](https://www.hasscn.top/contributors/core/quality-scale/entity-translations/)：翻译实体名称。
- [action-exceptions](https://www.hasscn.top/contributors/core/quality-scale/action-exceptions/)：在操作失败时抛出异常。
