# 集成中的事件

> 让设备的事件对用户可用，并使用事件辅助元素（helper）响应 Home Assistant 内部发生的事情。

Source: https://www.hasscn.top/contributors/core/integrations/events/

Home Assistant 中发生的一切都会经过事件总线（event bus）：状态变化、动作（action）调用，以及 Home Assistant 本身的启动和停止。你的集成（integration）可以将自己的[事件（event）](https://www.hasscn.top/contributors/glossary/event/)放到该总线上，也可以监听发生的事情。

本页介绍在你的集成中使用事件。总线底层的工作原理，例如事件对象包含哪些内容、监听器如何运行以及事件过滤器，请参阅[核心工作原理：事件](https://www.hasscn.top/contributors/core/internals/events/)。

## 让设备事件可用

许多设备具有不属于状态的事件：按钮被按下、检测到移动、门铃响了。

提供这些事件的首选方式是使用[事件实体（event entity）](https://www.hasscn.top/contributors/core/entities/event/)。用户可以在一个地方找到设备的所有事件，并像其他任何实体一样在自动化（automation）中使用它们。

### 在总线上触发事件

一些集成直接在事件总线上触发事件。将事件类型命名为 `<domain>_event`，例如 `zha_event`，并在事件属于某个设备时，添加来自[设备注册表（device registry）](https://www.hasscn.top/contributors/core/integrations/device-registry/)的 `device_id`：

```python
hass.bus.async_fire(
    "example_event",
    {
        "device_id": device_entry.id,
        "type": "button_pressed",
    },
)
```

如果设备只触发事件而没有实体，请[自行将其注册到设备注册表](https://www.hasscn.top/contributors/core/integrations/device-registry/#register-a-device-yourself)，这样就有设备可以关联这些事件。

几条规则：

- 在集成的设置阶段（`__init__.py` 中的 `async_setup_entry`）将你设备的事件转换为 Home Assistant 事件，而不是在实体代码中进行。
- 不要用状态伪造事件。按钮按下后 `on` 30 秒的二进制传感器并不是事件。
- 用户很难发现总线事件。[设备触发器（device trigger）](https://www.hasscn.top/contributors/core/integrations/device-automations/)曾是集成让这些事件可见的方式，但新的设备自动化已不再被接受。请使用事件实体。

## 监听 Home Assistant

当 Home Assistant 内部发生某些事情时，你的集成可能需要做出响应。如果有合适的辅助元素，请使用 `homeassistant.helpers.event` 中的辅助元素：它们经过了优化，只会针对你关心的变化调用你的代码，这在拥有数千个实体的系统上非常重要。只有在没有合适的辅助元素时才直接监听总线。

每个辅助元素都返回一个用于移除监听器的函数。使用 `entry.async_on_unload`（或在实体中使用 `self.async_on_remove`）注册它，以便在配置条目（config entry）卸载时停止监听器：

```python
from homeassistant.core import Event, EventStateChangedData, callback
from homeassistant.helpers.event import async_track_state_change_event


@callback
def _async_outside_temperature_changed(
    event: Event[EventStateChangedData],
) -> None:
    """React to a new outside temperature."""
    if (new_state := event.data["new_state"]) is None:
        return
    ...


entry.async_on_unload(
    async_track_state_change_event(
        hass, ["sensor.outside_temperature"], _async_outside_temperature_changed
    )
)
```

大多数辅助元素也有不带 `async_` 前缀的版本，供不在事件循环（event loop）中运行的代码使用。

### 状态变化

| 辅助元素 | 用途 |
| --- | --- |
| `async_track_state_change_event` | 跟踪特定实体的状态变化 |
| `async_track_state_added_domain` | 跟踪被添加到一个或多个域（domain）的实体 |
| `async_track_state_removed_domain` | 跟踪从一个或多个域中移除的实体 |
| `async_track_state_change_filtered` | 使用可稍后更新的过滤器跟踪状态变化 |
| `async_track_same_state` | 当实体在一段时间内保持某个状态时运行某些操作 |

### 模板（template）

| 辅助元素 | 用途 |
| --- | --- |
| `async_track_template` | 当模板变为真时运行某些操作 |
| `async_track_template_result` | 当模板的结果发生变化时运行某些操作 |

### 注册表

| 辅助元素 | 用途 |
| --- | --- |
| `async_track_entity_registry_updated_event` | 跟踪特定实体的注册表变化 |
| `async_track_device_registry_updated_event` | 跟踪特定设备的注册表变化 |

### 时间

| 辅助元素 | 用途 |
| --- | --- |
| `async_call_later` | 延迟一段时间后运行一次某些操作 |
| `async_track_point_in_time` | 在某个时间点运行一次某些操作 |
| `async_track_point_in_utc_time` | 在 UTC 的某个时间点运行一次某些操作 |
| `async_track_time_interval` | 按间隔重复运行某些操作 |
| `async_track_time_change` | 当本地时间匹配某个模式时运行某些操作 |
| `async_track_utc_time_change` | 当 UTC 时间匹配某个模式时运行某些操作 |
| `async_track_sunrise` | 每天在相对于日出偏移的时间运行某些操作 |
| `async_track_sunset` | 每天在相对于日落偏移的时间运行某些操作 |

大多数时间辅助元素会在调用你的函数时传入其运行的时间点，类型为 `datetime`。日出和日落辅助元素调用时不带参数。注意参数的顺序：`async_track_point_in_time(hass, action, point_in_time)` 和 `async_track_time_interval(hass, action, interval)` 将你的函数放在前面，而 `async_call_later(hass, delay, action)` 将延迟放在前面，延迟以秒为单位或以 `timedelta` 形式表示。

如果你需要轮询（poll），请使用[协调器（coordinator）](https://www.hasscn.top/contributors/core/integrations/fetching-data/)而不是 `async_track_time_interval`。

### Home Assistant 的启动

要在 Home Assistant 启动后运行某些操作，请使用 `homeassistant.helpers.start` 中的 `async_at_started`。如果 Home Assistant 已经在运行，它会立即运行，当用户稍后添加你的集成时正是这种情况。`async_at_start` 对较早的启动阶段执行同样的操作。

```python
from homeassistant.helpers.start import async_at_started

entry.async_on_unload(async_at_started(hass, _async_start_export))
```

## 直接监听总线

当没有合适的辅助元素时，使用 `hass.bus.async_listen` 监听总线，或者对于只需要触发一次的事件，使用 `hass.bus.async_listen_once`。两者都返回一个用于移除监听器的函数。

```python
from homeassistant.const import EVENT_HOMEASSISTANT_STOP

entry.async_on_unload(
    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _async_disconnect)
)
```

`EVENT_HOMEASSISTANT_START`、`EVENT_HOMEASSISTANT_STARTED` 和 `EVENT_HOMEASSISTANT_STOP` 在每次运行中只触发一次，因此对它们使用 `async_listen_once` 是正确的选择。

| 事件 | 触发时机 |
| --- | --- |
| `EVENT_HOMEASSISTANT_START` | 设置完成，Home Assistant 进入启动阶段 |
| `EVENT_HOMEASSISTANT_STARTED` | 所有集成都已有机会加载。语音助手以及导出状态的集成经常使用它。 |
| `EVENT_HOMEASSISTANT_STOP` | Home Assistant 进入停止阶段 |
| `EVENT_HOMEASSISTANT_FINAL_WRITE` | 将数据写入磁盘的最后机会 |
| `EVENT_HOMEASSISTANT_CLOSE` | 清理（teardown） |
| `EVENT_STATE_CHANGED` | 实体的状态发生了变化。请改用[状态变化辅助元素](https://www.hasscn.top/contributors/core/integrations/events/#state-changes)。 |
| `EVENT_ENTITY_REGISTRY_UPDATED` | 实体注册表发生了变化。请改用[注册表辅助元素](https://www.hasscn.top/contributors/core/integrations/events/#registries)。 |
| `EVENT_COMPONENT_LOADED` | 一个集成加载完成。请改用 `async_at_start`。 |
| `EVENT_SERVICE_REGISTERED`、`EVENT_SERVICE_REMOVED` | 一个动作被注册或移除 |
| `EVENT_CALL_SERVICE` | 一个动作被调用 |
| `EVENT_CORE_CONFIG_UPDATE` | 核心配置发生了变化 |
| `EVENT_THEMES_UPDATED` | 主题发生了变化 |
