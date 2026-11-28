# 状态

> 状态机如何保存每个实体的当前状态、状态对象包含哪些内容，以及为什么集成要通过实体来写入状态。

Source: https://www.hasscn.top/contributors/core/internals/states/

`hass.states` 上的状态机（state machine）保存着 Home Assistant 中每个实体的当前状态。仪表盘（dashboard）读取它，自动化（automation）基于它触发，记录器（recorder）存储每一次变化。它是一个规则很少的简单存储，而这是有意为之。

## 通过实体写入状态

首先要注意的是：作为集成（integration）开发者，你几乎永远不会自己调用状态机。你创建[实体](https://www.hasscn.top/contributors/core/entities/)，实体基类会通过 `async_write_ha_state()` 写入它们的状态。它会处理实体 ID、名称、单位、图标、设备类别（device class）、可用性，以及每个实体都具有的属性。手动写入状态会跳过所有这些，而且用户无法重命名、隐藏或配置你写入的内容。

请继续阅读，了解其背后的运作机制。

## 状态对象

每个状态都是来自 `homeassistant.core` 的 `State` 对象。状态是不可变的：一次更改会创建一个新对象。

| 属性 | 描述 |
| --- | --- |
| `entity_id` | 实体 ID，例如 `light.kitchen_ceiling`：由域名（domain）、一个点号和对象 ID 组成。 |
| `domain` | 点号前面的部分，例如 `light`。 |
| `object_id` | 点号后面的部分，例如 `kitchen_ceiling`。 |
| `state` | 状态本身，始终是长度不超过 255 个字符的字符串，例如 `on` 或 `21.5`。 |
| `attributes` | 包含额外信息的只读字典。请保持其可被 JSON 序列化。 |
| `last_changed` | `state` 上次更改的时间。 |
| `last_updated` | `state` 或任何属性上次更改的时间。 |
| `last_reported` | 状态上次被写入的时间，即使没有任何变化。 |
| `context` | 导致此状态的 `Context`。 |
| `name` | 友好名称（friendly name），来自 `friendly_name` 属性，否则为将下划线替换为空格的对象 ID。 |

[home-assistant.io 上的状态对象页面](https://www.home-assistant.io/docs/configuration/state_object/)从用户的角度描述了同一个对象。

## 读取状态

```python
state = hass.states.get("sun.sun")
if state is not None:
    elevation = state.attributes.get("elevation")
```

- `hass.states.get(entity_id)` 返回 `State`，如果实体不存在则返回 `None`。务必处理 `None`：实体会不断出现和消失。
- `hass.states.async_all(domain)` 返回所有状态，或一个或多个域名的所有状态。
- `hass.states.async_entity_ids(domain)` 仅返回实体 ID。
- `hass.states.is_state(entity_id, "on")` 是一个用于比较的快捷方式。

请记住，状态也可能是 `unavailable` 或 `unknown`。常量 `STATE_UNAVAILABLE` 和 `STATE_UNKNOWN` 位于 [`homeassistant/const.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/const.py) 中。

## 写入状态

`hass.states.async_set(entity_id, state, attributes)` 会创建或替换一个状态。接下来会发生什么取决于改变了什么：

- **状态或属性发生了变化**：状态机会存储一个新的 `State`，并触发一个 `state_changed` 事件，其数据中包含 `entity_id`、`old_state` 和 `new_state`。只有当 `state` 本身发生变化时，`last_changed` 才会更新。
- **没有任何变化**：状态机会更新 `last_reported`，并改为触发一个 `state_reported` 事件。监听 `state_reported` 需要使用 `event_filter`，因为它触发得非常频繁。
- **`force_update=True`**：即使没有任何变化，也会触发 `state_changed` 事件，并且 `last_changed` 也会更新。

长度超过 255 个字符的状态不会被存储。状态机会记录一个错误，并改为存储 `unknown`。

`hass.states.async_remove(entity_id)` 会移除一个状态，并触发一个 `state_changed` 事件，其中 `new_state` 被设置为 `None`。监听器必须预期到这种情况；同样，当实体是新创建的时候，`old_state` 也可能为 `None`。

与所有以 `async_` 开头的方法一样，这些方法必须在事件循环中运行。如果要从其他线程调用，请使用 `hass.states.set` 和 `hass.states.remove`。

## 实体上的额外属性

在实体上，额外信息放在 `extra_state_attributes` 属性中。它返回一个字典，该字典最终会出现在 `attributes` 中。

```python
@property
def extra_state_attributes(self) -> dict[str, Any]:
    """Return extra attributes of the entity."""
    return {"filter_life": self._filter_life}
```

不要重写 `state_attributes`：实体基类（例如灯）使用它来存放其域名的属性。此外，在添加属性之前请三思。每个属性都会随每一次状态变化一起被存储，而频繁变化的值应该属于它自己的实体。详情请参见[实体](https://www.hasscn.top/contributors/core/entities/)。
