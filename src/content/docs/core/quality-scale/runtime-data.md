---
title: 在 runtime_data 中存储运行时数据
description: "Bronze 规则 runtime-data：运行时数据存储在 ConfigEntry.runtime_data 中，并使用带类型的配置条目。"
sidebarLabel: runtime-data
sidebarGroup: Bronze
order: 17
---

这是一条 Bronze 规则。在 `quality_scale.yaml` 中，它被称为 `runtime-data`。

集成在[配置条目（config entry）](/glossary/config-entry/)加载期间所需的数据，例如 API 客户端或[协调器（coordinator）](/glossary/coordinator/)，必须存储在 `entry.runtime_data` 中，而不是 `hass.data` 中。为配置条目指定一个类型，以说明 `runtime_data` 中包含什么。当集成同时遵循 [strict-typing](/core/quality-scale/strict-typing/) 规则时，该带类型的配置条目是必需的，并且在处理条目的所有地方都要使用它。

## 为什么这很重要

`runtime_data` 属于单个配置条目，当该条目被卸载时它就会消失。无需维护需要保持干净的共享字典，也不会出现与其他集成冲突的键。由于配置条目是带类型的，你的编辑器和 mypy 能准确知道 `entry.runtime_data` 是什么，并在你的用户之前发现错误。而且每个集成都以相同的方式存储数据，这让后来的人更容易阅读代码。

## 示例

定义带类型的配置条目，并在 `async_setup_entry` 中赋值 `runtime_data`：

```python
type MyConfigEntry = ConfigEntry[MyClient]


async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> None:
    """Set up My integration from a config entry."""
    client = MyClient(entry.data[CONF_HOST])
    entry.runtime_data = client

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
```

平台在读取它时类型完整：

```python
async def async_setup_entry(
    hass: HomeAssistant,
    entry: MyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the sensors."""
    client = entry.runtime_data
```

获取配置条目的协调器也应使用带类型的条目：

```python
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """Fetch data from the device."""

    config_entry: MyConfigEntry
```

当需要多个对象同时存放在 `runtime_data` 中时，将它们放入一个 dataclass，并将其用作类型。

## 如何检查

- Hassfest，当该规则为 `done` 时：`__init__.py` 中的 `async_setup_entry` 必须赋值 `entry.runtime_data`。
- Hassfest，当 [strict-typing](/core/quality-scale/strict-typing/) 也为 `done` 时：配置条目必须是带类型的，并使用名称以 `ConfigEntry` 结尾的类型别名。这一检查适用于 `__init__.py` 中的 `async_setup_entry`、`async_unload_entry`、`async_migrate_entry`、`async_remove_entry` 和 `async_remove_config_entry_device`，适用于每个平台的 `async_setup_entry`，适用于诊断函数，以及 `async_get_options_flow`。
- Pylint，适用于每个带有配置流程的集成：当集成将数据存储在 `hass.data[DOMAIN]` 中时，`home-assistant-use-runtime-data` 会发出警告。
- Pylint：当协调器未使用其集成的带类型配置条目时，`home-assistant-coordinator-untyped-config-entry` 会发出警告。

## 例外

如果集成没有任何需要存储的运行时数据，则此规则不适用。

## 相关规则

- [strict-typing](/core/quality-scale/strict-typing/)：使用严格类型。
- [test-before-setup](/core/quality-scale/test-before-setup/)：在设置期间检查连接。
