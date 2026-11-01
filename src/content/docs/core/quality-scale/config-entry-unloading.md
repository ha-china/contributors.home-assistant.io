---
title: 支持卸载配置项（config entry）
description: "银级规则 config-entry-unloading：集成（integration）可以在不重启的情况下被卸载并重新加载。"
sidebarLabel: config-entry-unloading
sidebarGroup: Silver
order: 2
---

这是一条银级（Silver）规则。在 `quality_scale.yaml` 中，它被称为 `config-entry-unloading`。

集成必须在其 `__init__.py` 中实现 `async_unload_entry`。当[配置项（config entry）](/glossary/config-entry/)被卸载时，集成会卸载其平台，并清理它所设置的所有内容：监听器、订阅、后台任务以及打开的连接。

## 为什么重要

卸载功能使得在 Home Assistant 继续运行的同时，重新加载、禁用或移除集成成为可能。如果没有它，用户必须重启 Home Assistant 才能应用更改或移除集成。而且，任何未被清理的内容都会继续在后台运行，白白占用内存和连接。

## 示例

卸载各平台，并在卸载成功时进行清理：

```python
async def async_unload_entry(
    hass: HomeAssistant, entry: MyConfigEntry
) -> None:
    """Unload a config entry."""
    await hass.config_entries.async_unload_platforms_or_raise(
        entry, PLATFORMS
    )
    await entry.runtime_data.client.disconnect()
```

当某个平台卸载失败时，`async_unload_platforms_or_raise` 会抛出 `ConfigEntryError`，因此其后的清理代码只在卸载成功时才会运行。

通常，你不需要自己跟踪清理工作。在设置期间使用 `entry.async_on_unload` 注册它，Home Assistant 会为你调用它：

```python
async def async_setup_entry(
    hass: HomeAssistant, entry: MyConfigEntry
) -> None:
    """Set up My integration from a config entry."""
    client = MyClient(entry.data[CONF_HOST])
    entry.async_on_unload(client.subscribe(_handle_event))
    ...
```

通过 `entry.async_on_unload` 注册的回调会在 `async_unload_entry` 成功时运行，也会在 `async_setup_entry` 失败时运行：例如当它抛出 `ConfigEntryNotReady`、`ConfigEntryAuthFailed` 或 `ConfigEntryError` 时。你仍然需要 `async_unload_entry` 本身：没有它，配置项根本无法被卸载。

## 如何检查

- Pylint，当该规则为 `done` 时：`__init__.py` 必须定义 `async_unload_entry`（`home-assistant-missing-config-entry-unloading`）。
- 测试从未运行到的代码会显示在[测试覆盖率](/core/quality-scale/test-coverage/)中，因此无论如何通常都需要一个能卸载配置项的测试。
- 是否清理了所有内容，将在审查（review）中进行检查。

## 例外

此规则没有任何例外。

## 相关规则

- [entity-event-setup](/core/quality-scale/entity-event-setup/)：在实体（entity）生命周期中订阅事件。
