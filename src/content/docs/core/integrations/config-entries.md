---
title: 配置项
description: 配置项（config entry）如何被设置、卸载、删除和迁移，以及你的集成将运行时数据存储在哪里。
sidebarGroup: Setup and configuration
order: 1
---

[配置项](/glossary/config-entry/)（config entry）是一个集成的一个已设置实例，例如一个 Hue 网桥或一个账户。Home Assistant 会存储它，并在每次启动时重新进行设置。用户通过你的集成的[配置流程](/core/integrations/config-flow/)（config flow）创建配置项，之后可以通过[重新配置](/core/integrations/reauth-reconfigure/)或[选项流程](/core/integrations/options-flow/)（options flow）进行更改。

一个配置项包含以下内容：

- `data`：连接所需的配置，例如主机地址或 API 令牌。在正常使用过程中不会改变。
- `options`：用户可以通过选项流程更改的设置。
- `subentries`：可重复的部分，例如天气服务的各个位置。参见[子配置项](/core/integrations/subentries/)。
- `unique_id`：用于标识设备或账户，以避免重复设置。
- `runtime_data`：你的集成在运行期间所需的任何内容。它不会被存储。

## 生命周期

配置项始终处于以下状态之一，这些状态定义在 `homeassistant.config_entries.ConfigEntryState` 中：

| 状态 | 含义 |
| --- | --- |
| `NOT_LOADED` | 未加载。配置项被创建时以及 Home Assistant 启动时所处的状态。 |
| `SETUP_IN_PROGRESS` | 正在设置 |
| `LOADED` | 已设置并正在运行 |
| `SETUP_ERROR` | 设置失败，Home Assistant 不会重试 |
| `SETUP_RETRY` | 设置因某些条件尚未就绪而失败。Home Assistant 会以逐渐增加的延迟进行重试，最长 10 分钟；当集成通过 `retry_after` 要求更长延迟时则可以更长。 |
| `MIGRATION_ERROR` | 配置项需要迁移到更新的版本，但迁移失败了 |
| `UNLOAD_IN_PROGRESS` | 正在卸载 |
| `FAILED_UNLOAD` | 卸载失败或不支持卸载 |

你的代码如何进入 `SETUP_ERROR` 或 `SETUP_RETRY` 状态，请参见[设置失败与异常](/core/integrations/setup-failures/)。

## 设置配置项

当 Home Assistant 启动时，它首先运行你的集成的常规设置（如果有 `async_setup` 的话）。然后它会为每个配置项调用你的 `__init__.py` 中的 `async_setup_entry`，但用户已禁用或忽略的配置项除外。当用户添加新的配置项时，Home Assistant 会立即为该配置项调用 `async_setup_entry`。

```python
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .coordinator import ExampleCoordinator

PLATFORMS = [Platform.SENSOR, Platform.SWITCH]

type ExampleConfigEntry = ConfigEntry[ExampleCoordinator]


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""
    client = ExampleClient(
        entry.data[CONF_HOST], session=async_get_clientsession(hass)
    )

    coordinator = ExampleCoordinator(hass, entry, client)
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
```

`async_setup_entry` returns nothing. When it returns, the setup succeeded, and the entry is `LOADED`. When setup cannot succeed, raise an exception instead, so Home Assistant knows whether to retry, start reauthentication, or give up. See [setup failures and exceptions](/core/integrations/setup-failures/). The same goes for `async_unload_entry` and `async_migrate_entry`.

### Keep runtime data in runtime_data

将你的集成在运行期间所需的内容（例如 API 客户端或[协调器](/glossary/coordinator/)（coordinator））存储在 `entry.runtime_data` 中。使用类型别名为其指定类型，例如上面的 `ExampleConfigEntry`，并在所有接收该配置项的地方使用该别名。这样你的平台就可以免费获得一个带有类型的 `runtime_data`。

不要将属于配置项的数据存放在 `hass.data` 中。`runtime_data` 会随配置项一起被清理，并且类型检查器能够理解它。

### 设置平台

在 `runtime_data` 设置完成后，使用 `async_forward_entry_setups` 将配置项转发到你的[平台](/glossary/platform/)（platform）。然后每个平台都会获得自己的 `async_setup_entry`，用于添加实体（entity）：

```python
from homeassistant.helpers.entity_platform import (
    AddConfigEntryEntitiesCallback,
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Example sensors."""
    coordinator = entry.runtime_data

    async_add_entities(
        ExampleSensor(coordinator, description)
        for description in SENSORS
    )
```

## 卸载配置项

支持卸载功能，这样用户就可以在不重启 Home Assistant 的情况下重新加载或禁用配置项。实现 `async_unload_entry`，卸载你转发到的平台，并清理其他内容，例如连接和监听器。Home Assistant 在调用此函数之前会将状态设置为 `UNLOAD_IN_PROGRESS`。

```python
async def async_unload_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Unload a config entry."""
    await hass.config_entries.async_unload_platforms_or_raise(entry, PLATFORMS)
```

When one of the platforms fails to unload, `async_unload_platforms_or_raise` raises `ConfigEntryError` with a translated message, and the entry goes to `FAILED_UNLOAD`. If your own cleanup fails, raise `ConfigEntryError` too.

Most cleanup does not need its own code. Register it while setting up, and Home Assistant runs it when the entry unloads:

```python
entry.async_on_unload(client.disconnect)
entry.async_on_unload(
    async_track_time_interval(hass, refresh_token, timedelta(hours=1))
)
```

要清理实体，请在[实体](/core/entities/)上实现 `async_will_remove_from_hass`。

Do not delete your repair issues when the entry unloads. A reload unloads the entry too, and an issue that is deleted and created again is no longer ignored. Set their [`config_entry_id`](/core/integrations/repairs/#issues-that-belong-to-a-config-entry) instead: they are hidden while the entry is disabled, and deleted when it is removed.

## Remove a config entry

如果用户删除配置项时需要执行某些操作，例如在服务端移除 webhook，请实现 `async_remove_entry`。该函数运行时，配置项已从 `hass.config_entries` 中移除。

```python
async def async_remove_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Handle removal of an entry."""
```

You do not need `async_remove_entry` to clean up the devices and entities of the entry, or the [repair issues that belong to it](/core/integrations/repairs/#issues-that-belong-to-a-config-entry). Home Assistant removes them for you.

## Change a config entry

切勿直接更改 `ConfigEntry` 的属性。应改为调用 `async_update_entry`。它会保存更改，并通知所有监听者：

```python
hass.config_entries.async_update_entry(
    entry, data={**entry.data, CONF_HOST: new_host}
)
```

要重新加载配置项（例如在更改之后），请调用 `hass.config_entries.async_schedule_reload(entry.entry_id)`。

## 迁移配置项

当你存储在配置项中的数据结构发生变化时，应提升配置流程的版本并迁移旧配置项。每个配置项都有一个主版本 `VERSION` 和一个 `MINOR_VERSION`，两者默认均为 `1`。

- **小版本**（minor）升级是向后兼容的。只添加旧代码可以忽略的内容，例如带有默认值的新键。如果只有小版本不同，Home Assistant 即使没有迁移也会设置该配置项。回退到较旧 Home Assistant 版本的用户仍可继续使用它。
- **主版本**（major）升级则不是向后兼容的。当旧代码无法再读取该配置项时使用它，例如键被重命名或移除。较旧的 Home Assistant 版本无法设置已迁移的配置项，除非用户恢复备份。

在你的配置流程上设置新版本：

```python
class ExampleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Example."""

    VERSION = 2
    MINOR_VERSION = 2
```

然后在 `__init__.py` 中实现 `async_migrate_entry`。当存储的主版本比你的配置流程的版本旧，或者主版本相同而小版本不同（包括用户降级 Home Assistant 后留下的_更新_的小版本）时，Home Assistant 会在设置之前调用它。因此，请在每个步骤之前检查版本，对于你不了解的配置项保持原样不做处理。如果配置项的主版本比你的配置流程的新，它将无法设置，并且不会调用你的代码。

在此示例中，版本 2 将 `ip_address` 重命名为 `host`，旧代码无法读取它，因此这是一次主版本升级。版本 2.2 添加了一个端口，旧代码会忽略它，因此这是一次小版本升级：

```python
async def async_migrate_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Migrate an old config entry."""
    if entry.version == 1:
        data = {**entry.data}
        data[CONF_HOST] = data.pop("ip_address")
        hass.config_entries.async_update_entry(
            entry, data=data, version=2, minor_version=1
        )

    if entry.version == 2 and entry.minor_version < 2:
        hass.config_entries.async_update_entry(
            entry,
            data={**entry.data, CONF_PORT: DEFAULT_PORT},
            minor_version=2,
        )
```

由较新版本的 Home Assistant 存储为 2.3 的配置项会原样通过这两项检查，并按原样完成设置。

你的迁移函数返回或抛出的结果决定了接下来会发生什么：

| 结果 | 发生的情况 |
| --- | --- |
| Returns `None` | Migration succeeded, setup continues |
| Raises `ConfigEntryNotReady` | Setup stops, Home Assistant retries later |
| Raises `ConfigEntryError` or any other exception | Setup stops, the entry goes to `MIGRATION_ERROR` |

Give `ConfigEntryNotReady` and `ConfigEntryError` a translated message, so you can tell the user what went wrong.

`MIGRATION_ERROR` 状态不会自行恢复。如果用户可以修复原因，请创建一个[修复](/core/integrations/repairs/)（repair），并在修复完成后从修复流程中调用 `hass.config_entries.async_retry_migration(entry_id)`。

## Return values in custom integrations

Custom integrations may still return a boolean from `async_setup_entry`, `async_unload_entry`, and `async_migrate_entry`, as they did before, and that is not deprecated. This is what it does:

- `True` means success, like `None`.
- `False` becomes a `ConfigEntryError` with a generic message, like "Failed to set up the config entry." The entry goes to `SETUP_ERROR`, `FAILED_UNLOAD`, or `MIGRATION_ERROR`, and the user sees that message.

Switching to `None` and exceptions is still worth it: raise your own `ConfigEntryError` with a translated message, and users see what actually went wrong. The background is in the [architecture discussion](https://github.com/home-assistant/architecture/discussions/1463).

## Follow state changes

要在配置项更改状态时（例如从 `LOADED` 变为 `UNLOAD_IN_PROGRESS`）收到通知，请使用 `async_on_state_change` 注册回调。它返回一个用于移除监听器的函数，因此你可以一直监听直到配置项卸载：

```python
entry.async_on_unload(entry.async_on_state_change(notify_me))
```

## 后台任务

使用 `entry.async_create_background_task(hass, coroutine, name)` 启动属于配置项的长时间运行任务。当配置项卸载时，Home Assistant 会取消它们，因此它们的生命周期绝不会超过配置项。
