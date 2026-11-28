# 更新状态

> 通过轮询或推送让实体与其设备保持同步，在恰当的时机写入状态，并如实报告可用性。

Source: https://www.hasscn.top/contributors/core/entities/state-updates/

实体（entity）映射的是 Home Assistant 之外的东西：一台设备、一个云服务或一个文件。需要有某种机制让两者保持同步。有两种方式可以做到：Home Assistant 按计划定期向实体询问最新消息（轮询，polling），或者实体在发生变化时告知 Home Assistant（推送，push）。

如果设备支持，推送是更好的选择。变化能够立即显现，也不会白白发送请求。当设备或服务只能回答问题时，就使用轮询。

## 轮询

[轮询（polling）](https://www.hasscn.top/contributors/glossary/polling/)是默认方式：`should_poll` 为 `True`。Home Assistant 以固定间隔调用实体的更新方法，然后写入状态。实现其中之一：

```python
class ExampleSensor(SensorEntity):
    async def async_update(self) -> None:
        """Fetch the latest value from the device."""
        self._attr_native_value = await self._device.read_temperature()
```

如果你的库是同步的，请改用 `update()`。此时 Home Assistant 会替你在线程中运行它。与所有属性一样，状态属性应当只返回更新方法所存储的内容。

### 轮询间隔

轮询间隔来自集成（integration）平台模块中的 `SCAN_INTERVAL`，例如 `sensor.py`：

```python
from datetime import timedelta

SCAN_INTERVAL = timedelta(minutes=5)
```

如果没有设置，则使用该域（domain）的默认值：例如传感器和开关为 30 秒，而未设置默认值的域则为 15 秒。当一次更新耗时超过 10 秒时，Home Assistant 会记录一条警告。请选择设备或 API 能轻松承受的间隔。

### 并行更新

平台模块中的 `PARALLEL_UPDATES` 限制该平台有多少个实体可以同时更新或执行操作：

```python
# One request at a time: the device can't handle more
PARALLEL_UPDATES = 1
```

如果没有设置，则由平台中第一个被添加的实体决定整个平台的限制：如果它拥有同步的 `update()` 方法，则为 1；否则不限制。`0` 同样表示不限制。

### 通过协调器轮询

当一次请求就能返回多个实体的数据时，对每个实体分别轮询是一种浪费。请改用[协调器（coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/)：它每个间隔获取一次数据，其下的实体（基于 `CoordinatorEntity`）是推送实体，会在协调器有新数据时写入各自的状态。大多数拥有较多轮询实体的集成都采用这种方式。

## 推送

要使用推送，请将 `should_poll` 设置为 `False`，在实体被添加时订阅设备或库的更新，并在消息到达时写入状态。

```python
class ExampleSensor(SensorEntity):
    _attr_should_poll = False

    async def async_added_to_hass(self) -> None:
        """Subscribe to updates once the entity is added."""
        self.async_on_remove(
            self._device.subscribe(self._handle_update)
        )

    @callback
    def _handle_update(self, value: float) -> None:
        """Store the new value and write it."""
        self._attr_native_value = value
        self.async_write_ha_state()
```

`async_on_remove` 确保实体被移除时订阅会被清理。参见[实体生命周期](https://www.hasscn.top/contributors/core/entities/lifecycle/)。

## 写入状态

这些方法将实体的状态写入状态机。请根据你所在的线程选择合适的方法。

| 方法 | 用途 |
| --- | --- |
| `async_write_ha_state()` | 在事件循环（event loop）中、修改完 `_attr_` 值之后使用。这是你最常用的一个。它不会获取任何数据。 |
| `schedule_update_ha_state()` | 在其他线程中使用，例如同步库的回调。它会把写入操作调度到事件循环上执行。 |
| `async_schedule_update_ha_state(force_refresh=True)` | 在事件循环中使用，适用于需要 Home Assistant 先调用你的更新方法的情况。 |
| `schedule_update_ha_state(force_refresh=True)` | 同上，但在其他线程中使用。 |

在事件循环之外调用 `async_write_ha_state()` 不是线程安全的，Home Assistant 会对这种情况进行报告。当 `force_refresh=False` 时，`async_schedule_update_ha_state` 方法只是调用 `async_write_ha_state`。

执行某个操作（例如开灯）之后该写入什么状态，有专门的章节介绍：[命令之后](https://www.hasscn.top/contributors/core/entities/state-updates/#after-a-command)。

### 添加前更新

将 `update_before_add=True` 传递给 `async_add_entities`，可以在实体被添加之前先调用一次更新方法，使其以真实数据而非 `unknown` 开始。这样首个状态会延迟到该更新完成之后，从而拖慢集成的设置过程。如果使用协调器，则应改为在设置阶段获取首批数据。

## 命令之后

当用户打开一盏灯时，你的实体会向设备发送一条命令。此时你面临一个选择：立即显示新状态，还是等待设备确认。立即写入预期状态的做法称为_乐观更新（optimistic update）_。

没有放之四海而皆准的正确答案。这取决于设备的行为：

- **设备会推送其新状态。** 那就等它。支持推送更新的本地设备会在片刻之内确认变化，此时你写入的状态才是真实状态。命令之后不要写入任何内容。
- **你轮询的是一台会上报状态的设备。** 不要等到下一个间隔：在发出命令后立即请求刷新。如果使用协调器，请调用 `await self.coordinator.async_request_refresh()`。第一次请求会立即刷新，10 秒内的后续请求会被合并为一次刷新。AirGradient 集成的开关（`airgradient/switch.py`）就是这样工作的。
- **设备确认得很慢。** 需要一段时间才能反映变化的云服务，或只能每隔几分钟轮询一次的 API，会让用户长时间面对旧状态。在这种情况下，乐观更新是合理的选择。如果命令没有生效，下一次轮询会纠正状态。
- **设备完全无法上报其状态。** 想想通过红外或射频控制的设备，或者没有状态主题（state topic）的 MQTT 开关。乐观更新是唯一的选择，并且实体还应设置 `assumed_state`，见下文。

乐观更新看起来像这样。只在命令成功后才写入状态：如果发送失败，就抛出错误，并且不要改动状态。不要显示设备从未接受过的状态。

```python
async def async_turn_on(self, **kwargs: Any) -> None:
    """Turn the fan on."""
    await self._device.send(Command.ON)
    self._attr_is_on = True
    self.async_write_ha_state()
```

### 假定状态

当状态只是猜测、因为设备无法上报时，请设置 `_attr_assumed_state = True`。此时前端会显示分开的"开"和"关"按钮，而不是一个切换开关；对于卷帘（cover），则会同时保留打开和关闭两个操作，这样即使猜测有误，用户也总能发送所需的命令。

这类实体可以在重启后借助 `RestoreEntity` 恢复其上一次的状态，因为没有什么可询问的。Core 中有两个例子：

- Dyson 红外集成的风扇（`dyson_infrared/fan.py`）总是假定自己的状态。它在发送每条红外命令后立即写入新状态。
- 没有状态主题、或被用户设置了 `optimistic` 的 MQTT 开关（`mqtt/switch.py`）采用乐观方式。它会设置 `assumed_state`，在发布命令后写入状态，并在启动时恢复其上一次的状态。

## 可用性

`available` 属性告诉 Home Assistant 它能否连接到设备。当它返回 `False` 时，状态变为 [`unavailable`](https://www.hasscn.top/contributors/glossary/unavailable/)，状态属性和额外状态属性会被省略（能力属性、单位和设备类别仍然保留），并且前端会将实体显示为不可用。

```python
async def async_update(self) -> None:
    try:
        value = await self._device.read_temperature()
    except ExampleConnectionError:
        self._attr_available = False
        return

    self._attr_available = True
    self._attr_native_value = value
```

当你无法获取数据时，才应将实体标记为不可用，而不是数据恰好缺失的时候：当前没有数值的传感器应报告 `None`，它会变成 `unknown`。记录第一次失败，并在设备恢复时记录一次，而不是每次更新都记录。

## 强制更新

默认情况下，只有当状态或属性发生变化时，Home Assistant 才会写入新状态。再次写入相同的值只会更新 `last_reported` 时间戳。当每次读数都应算作一次更新时，请将 `force_update` 设置为 `True`，例如直接从硬件读取数据的传感器。请谨慎使用：每次强制更新都是一个状态变化事件，自动化（automation）和记录器（recorder）都会处理它。

## 保持数据库精简

每次状态变化最终都会进入数据库。一个变化频繁、属性也频繁变化的实体会很快把数据库填满。保持额外属性少而稳定，并把快速变化的值移到它们各自的传感器实体中。参见[状态与属性](https://www.hasscn.top/contributors/core/entities/state-attributes/)。
