# 集成中的分析

> 面向开发者，介绍你的集成如何出现在分析中，以及如何将设备或实体排除在设备数据库之外。

Source: https://www.hasscn.top/contributors/data/guides/integration-analytics/

大多数集成无需为分析做任何事情。Home Assistant 会报告哪些集成正在被使用，并且会为设备数据库从设备与实体注册表中收集设备信息。本页面适用于你希望对此进行控制的场景。

## 关于你的集成会报告什么

- **使用分析**会在你的集成被使用时报告其域名（domain）。自定义集成会报告其域名以及清单（manifest）中的版本。
- **设备数据库**仅包含清单中 `integration_type` 为 `device` 或 `hub` 的内置集成。入口类型为 `service` 的设备始终会被排除。

对于每个设备，快照包含制造商、型号、型号 ID、硬件和软件版本、是否存在配置 URL，以及它通过哪个设备连接。对于每个实体（entity），它包含域名、原始设备类别、实体类别、计量单位、是否有实体名称，以及其状态（state）是否为假定状态。参见[分析的工作原理](https://www.hasscn.top/contributors/data/how-it-works/#the-device-database)。

## 将设备或实体排除在外

有时，某个集成的设备信息并不能反映真实硬件，或者会在设备数据库中造成误导。此时，集成可以添加一个 `analytics.py` 平台，其中包含一个 `async_modify_analytics` 函数。Home Assistant 会以该集成的设备 ID 和实体 ID 调用此函数，并使用其返回结果来过滤快照。

将整个集成排除在外：

```python
"""Analytics platform."""

from homeassistant.components.analytics import (
    AnalyticsInput,
    AnalyticsModifications,
)
from homeassistant.core import HomeAssistant


async def async_modify_analytics(
    hass: HomeAssistant, analytics_input: AnalyticsInput
) -> AnalyticsModifications:
    """Modify the analytics."""
    return AnalyticsModifications(remove=True)
```

或者只排除部分设备或实体，使用 `DeviceAnalyticsModifications` 和 `EntityAnalyticsModifications`：

```python
"""Analytics platform."""

from homeassistant.components.analytics import (
    AnalyticsInput,
    AnalyticsModifications,
    EntityAnalyticsModifications,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er


async def async_modify_analytics(
    hass: HomeAssistant, analytics_input: AnalyticsInput
) -> AnalyticsModifications:
    """Leave out entities that only exist for diagnostics."""
    entity_registry = er.async_get(hass)
    entities = {}

    for entity_id in analytics_input.entity_ids:
        entry = entity_registry.async_get(entity_id)
        if entry and entry.translation_key == "debug_info":
            entities[entity_id] = EntityAnalyticsModifications(remove=True)

    return AnalyticsModifications(entities=entities)
```

移除一个设备也会同时移除其下的实体。

如果该函数抛出异常，或返回了 `AnalyticsModifications` 以外的内容，Home Assistant 会将整个集成排除在外，并记录一条错误日志。

## 核心中的示例

ESPHome、移动应用和 WLED 都有分析平台。请查看[核心仓库](https://github.com/home-assistant/core/tree/dev/homeassistant/components)中它们的 `analytics.py` 以获取真实示例。

关于构建集成的其他所有内容，请参见[核心与集成](https://www.hasscn.top/contributors/core/)。
