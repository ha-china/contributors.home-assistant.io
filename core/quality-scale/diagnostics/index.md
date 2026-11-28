# 实现诊断

> Gold 规则 diagnostics：用户可以下载诊断信息，其中敏感数据已被脱敏。

Source: https://www.hasscn.top/contributors/core/quality-scale/diagnostics/

这是一条 Gold 规则。在 `quality_scale.yaml` 中，它被称为 `diagnostics`。

该集成实现了[诊断（diagnostics）](https://www.hasscn.top/contributors/glossary/diagnostics/)：一个包含 `async_get_config_entry_diagnostics`、`async_get_device_diagnostics` 或两者兼备的 `diagnostics.py`。诊断信息中包含有助于调试问题的数据，例如配置以及集成接收到的数据。它们绝不能包含敏感信息，例如密码、令牌（token）或坐标。

## 为什么重要

当出现问题时，诊断功能让用户只需一次选择即可下载集成的快照（snapshot），并将其附加到问题（issue）中。没有它，你最终需要经过多轮沟通才能拿到日志、版本和有效负载（payload）。有了它，第一份报告通常就包含了你需要的一切。

用户会在公开的 issue 中分享这些文件，因此脱敏是规则的一部分，而不是额外的要求。

## 示例

在返回数据之前，使用 `async_redact_data` 对敏感键进行脱敏：

```python
TO_REDACT = {CONF_API_KEY, CONF_LATITUDE, CONF_LONGITUDE}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: MyConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    coordinator = entry.runtime_data

    return {
        "entry_data": async_redact_data(entry.data, TO_REDACT),
        "data": async_redact_data(coordinator.data.to_dict(), TO_REDACT),
    }
```

`async_redact_data` 来自 `homeassistant.components.diagnostics`。它会替换匹配键的值，包括嵌套字典和列表中的值。

## 如何检查

- Pylint，当规则为 `done` 时：`diagnostics.py` 必须实现 `async_get_config_entry_diagnostics` 或 `async_get_device_diagnostics`（`home-assistant-missing-diagnostics`）。
- Codecov 要求每个集成的 `diagnostics.py` 中已变更的行达到 100% 的测试覆盖率。大多数集成使用快照来测试其诊断功能。
- 是否包含正确的数据、以及是否排除了敏感数据，将在代码审查中检查。

## 例外情况

如果集成没有任何有助于调试的数据，例如因为它没有运行时数据，且其配置中仅包含敏感信息，则此规则不适用。
