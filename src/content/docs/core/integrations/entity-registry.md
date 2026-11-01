---
title: 实体注册表
description: 在实体注册表中查找集成的实体，并在其唯一 ID 发生变化时对它们进行迁移。
sidebarGroup: Devices and registries
order: 2
---

本页介绍如何在集成的代码中使用实体注册表（entity registry）：查找条目以及迁移它们。关于实体如何进入注册表，以及决定实体初始是否启用、可见或分类的因素，请参阅实体与平台部分的[实体注册表](/core/entities/registry/)。

实体注册表会记录每个具有[唯一 ID（unique ID）](/glossary/unique-id/)的实体：其实体 ID、用户为其指定的名称和图标、所属区域（area）、是否被禁用，以及它所属的配置条目（config entry）和设备（device）。只要实体具有唯一 ID，它们就会自动进入注册表。

## 获取注册表

```python
from homeassistant.helpers import entity_registry as er

entity_registry = er.async_get(hass)
```

## 查找实体

```python
# The entity ID for a unique ID of your integration, or None
entity_id = entity_registry.async_get_entity_id(
    "sensor", DOMAIN, f"{serial_number}_temperature"
)

# The registry entry for an entity ID
entry = entity_registry.async_get(entity_id)

# All entities of a config entry
entries = er.async_entries_for_config_entry(
    entity_registry, config_entry.entry_id
)

# All entities of a device
entries = er.async_entries_for_device(entity_registry, device_id)
```

`async_get_entity_id` 接受实体域（如 `sensor`）、平台（即你的集成域）和唯一 ID。请使用它返回的实体 ID：切勿自行构造实体 ID，因为用户可以更改它们。

## 迁移唯一 ID

唯一 ID 不应更改。如果不得不更改，例如因为旧的 ID 唯一性不够，请迁移注册表条目，以便用户保留其实体 ID、名称和自动化（automation）。请在 `async_migrate_entry` 中进行迁移，同时提升[配置条目版本（config entry version）](/core/integrations/config-entries/#migrate-a-config-entry)：

```python
from typing import Any

from homeassistant.core import callback
from homeassistant.helpers import entity_registry as er


async def async_migrate_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Migrate an old config entry."""
    if entry.version == 1:

        @callback
        def _migrate_unique_id(
            entity_entry: er.RegistryEntry,
        ) -> dict[str, Any] | None:
            """Prefix unique IDs with the serial number."""
            if entity_entry.unique_id.startswith(entry.unique_id):
                return None

            return {
                "new_unique_id": f"{entry.unique_id}_{entity_entry.unique_id}"
            }

        await er.async_migrate_entries(
            hass, entry.entry_id, _migrate_unique_id
        )

        hass.config_entries.async_update_entry(
            entry, version=2, minor_version=1
        )
```

这是一次主版本升级，因此请在你的配置流程（config flow）中设置 `VERSION = 2`。不了解新唯一 ID 的旧代码在降级后将找不到其实体，并会重新创建它们。此示例基于配置条目的唯一 ID，因此它假设每个条目都有一个唯一 ID。

`async_migrate_entries` 会为配置条目的每个注册表条目调用你的函数。返回一个供 `async_update_entity` 使用的更改字典，或返回 `None` 以保持该条目不变。

## 更新或移除条目

`entity_registry.async_update_entity(entity_id, ...)` 用于更改注册表条目，`entity_registry.async_remove(entity_id)` 用于移除条目。集成很少需要使用它们。可将它们用于清理工作，例如移除集成不再提供的功能所对应的实体。属于用户的设置，例如名称、区域以及实体是否被禁用或隐藏，不属于你可以更改的范围。
