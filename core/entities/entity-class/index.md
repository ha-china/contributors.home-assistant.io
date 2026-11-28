# 实体类

> 每个实体都构建于其上的 Entity 基类、设置其属性的三种方式，以及每个实体都拥有的通用属性。

Source: https://www.hasscn.top/contributors/core/entities/entity-class/

Home Assistant 中的每个实体都是一个 Python 对象，继承自 `homeassistant.helpers.entity` 中的 `Entity`。不过，你几乎从不直接继承 `Entity`，而是继承实体平台（entity platform）的基类，例如 `SwitchEntity` 或 `SensorEntity`。该类在本文所述的通用属性和方法之上，添加了其所属域（domain）的属性和方法。

## 一个最小化的实体

这个开关将其状态保存在内存中。它是其设备的主要功能，因此它以该设备命名。

```python
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN


class ExampleSwitch(SwitchEntity):
    """A switch that remembers if it is on."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_is_on = False

    def __init__(self, serial: str) -> None:
        """Initialize the switch."""
        self._attr_unique_id = serial
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, serial)},
            name="Garden pump",
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the switch on."""
        self._attr_is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the switch off."""
        self._attr_is_on = False
        self.async_write_ha_state()
```

本页的其余部分以及本组中的其他页面将逐一解释该示例的各个部分。

## 设置属性

Home Assistant 每次写入状态时都会读取实体的属性。你可以通过三种方式提供属性。它们最终都会到达同一个地方，所以请选择可读性最好的那种。

### 带 `_attr_` 前缀的属性

大多数属性在基类中都有一个默认实现，该实现返回一个同名但带 `_attr_` 前缀的属性（attribute）。`device_class` 属性返回 `self._attr_device_class`，开关的 `is_on` 属性返回 `self._attr_is_on`，依此类推。当它们从不变化时，将其设置为类属性；当它们会变化时，将其设置为实例属性。

```python
class ExampleSwitch(SwitchEntity):
    _attr_icon = "mdi:water-pump"

    def __init__(self, serial: str) -> None:
        self._attr_unique_id = serial
```

这是最常见的风格。当你自己的代码需要某个值时，请读取属性（property）（`self.available`），而不是属性（attribute）（`self._attr_available`）。并非每个平台属性都有对应的 `_attr_` 属性：各平台的页面会在没有时予以说明。

### 属性方法

当某个值需要计算得出时，请重写属性本身。

```python
class ExampleSwitch(SwitchEntity):
    @property
    def is_on(self) -> bool:
        """Return if the pump is running."""
        return self._device.pump_speed > 0
```

> [!IMPORTANT]
> 属性必须从内存中返回数据。绝不要在属性中执行 I/O 操作，例如网络请求或读取文件。请在你的更新方法或[协调器（coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/)中获取数据，并让属性读取已有的数据。属性在每次状态写入时都会被调用，因此请保持其开销低廉。

### 实体描述

[实体描述（entity description）](https://www.hasscn.top/contributors/glossary/entity-description/)是一个冻结的 dataclass，用于保存某一类实体的静态属性。每个平台都有自己的子类，例如 `SensorEntityDescription`。将其设置为 `self.entity_description`，基类就会从中读取 `device_class`、`translation_key` 和 `entity_category` 等属性。

唯一必填的字段是 `key`，一个在你的平台内唯一的字符串。它是构建唯一 ID 的良好基础。

当一个类服务于多个仅在设置上有所不同的实体时，实体描述就大显身手了。你可以将它们声明在一个元组中，并在设置过程中遍历它。

```python
from collections.abc import Callable
from dataclasses import dataclass

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import UnitOfTemperature
from homeassistant.helpers.typing import StateType


@dataclass(frozen=True, kw_only=True)
class ExampleSensorEntityDescription(SensorEntityDescription):
    """Describes an Example sensor."""

    value_fn: Callable[[ExampleDevice], StateType]


SENSORS: tuple[ExampleSensorEntityDescription, ...] = (
    ExampleSensorEntityDescription(
        key="water_temperature",
        translation_key="water_temperature",
        device_class=SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda device: device.water_temperature,
    ),
)


class ExampleSensor(SensorEntity):
    """A sensor of an Example device."""

    entity_description: ExampleSensorEntityDescription
    _attr_has_entity_name = True

    def __init__(
        self,
        device: ExampleDevice,
        description: ExampleSensorEntityDescription,
    ) -> None:
        """Initialize the sensor."""
        self._device = device
        self.entity_description = description
        self._attr_unique_id = f"{device.serial}_{description.key}"

    @property
    def native_value(self) -> StateType:
        """Return the value from the device."""
        return self.entity_description.value_fn(self._device)
```

`_attr_` 属性的优先级高于描述。因此，你可以共享一个描述，同时仍为单个实体重写其中的某个值。

## 通用属性

这些属性存在于每个实体上。它们全部都是可选的。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `assumed_state` | `bool` | `False` | 当状态只是猜测时为 `True`，因为设备无法上报它。此时前端会显示分开的开和关按钮，而不是一个切换开关。参见[假定状态](https://www.hasscn.top/contributors/core/entities/state-updates/#assumed-state)。 |
| `attribution` | `str \| None` | `None` | 数据提供方要求你展示的品牌标识文本。 |
| `available` | `bool` | `True` | 当 Home Assistant 无法读取或控制设备时为 `False`。状态将变为 `unavailable`。参见[更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/#availability)。 |
| `device_class` | `str \| None` | `None` | 实体是什么或测量什么，取自其所属域的列表。参见[设备类（device class）](https://www.hasscn.top/contributors/glossary/device-class/)。 |
| `device_info` | `DeviceInfo \| ChildDeviceInfo \| None` | `None` | 该实体所属的设备。参见[实体注册表](https://www.hasscn.top/contributors/core/entities/registry/#linking-to-a-device)。 |
| `entity_category` | `EntityCategory \| None` | `None` | 标记配置类或诊断类实体。参见[实体注册表](https://www.hasscn.top/contributors/core/entities/registry/#entity-categories)。 |
| `entity_picture` | `str \| None` | `None` | 用于替代图标显示的图片 URL。 |
| `entity_registry_enabled_default` | `bool` | `True` | 实体首次注册时是否默认启用。 |
| `entity_registry_visible_default` | `bool` | `True` | 实体首次注册时是否默认可见。 |
| `extra_state_attributes` | `Mapping[str, Any] \| None` | `None` | 你的集成的额外属性。参见[状态与属性](https://www.hasscn.top/contributors/core/entities/state-attributes/)。 |
| `force_update` | `bool` | `False` | 将每次更新都写入状态机，即使没有任何变化。参见[更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/#force-update)。 |
| `has_entity_name` | `bool` | `False` | 当 `name` 仅描述实体而非设备时为 `True`。新集成必须使用。参见[实体命名](https://www.hasscn.top/contributors/core/entities/naming/)。 |
| `icon` | `str \| None` | `None` | 固定图标。建议使用图标翻译。参见[图标](https://www.hasscn.top/contributors/core/entities/icons/)。 |
| `name` | `str \| None` | 未设置 | 实体的名称。`None` 表示该实体是其设备的主要功能。参见[实体命名](https://www.hasscn.top/contributors/core/entities/naming/)。 |
| `should_poll` | `bool` | `True` | Home Assistant 是否轮询该实体。推送模式请设为 `False`。参见[更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/)。 |
| `supported_features` | `int \| None` | `None` | 实体支持的特性的位标志，取自其所属域的 `EntityFeature` 枚举。参见[支持的特性](https://www.hasscn.top/contributors/glossary/supported-features/)。 |
| `translation_key` | `str \| None` | `None` | 用于 `strings.json` 和 `icons.json` 中已翻译的名称、状态、状态属性和图标的键。 |
| `translation_placeholders` | `Mapping[str, str]` | `{}` | 已翻译名称中占位符的值。 |
| `unique_id` | `str \| None` | `None` | 一个稳定的 ID，在你的集成和域内唯一。使用注册表时必须提供。参见[实体注册表](https://www.hasscn.top/contributors/core/entities/registry/#unique-id)。 |

当实体应从其翻译键或设备类获取名称时，请将 `name` 留空。设置 `_attr_name = None` 与此不同：它明确表示“该实体没有自己的名称”。

### 更改能力

你可以在实体运行期间更改 `device_class`、`supported_features` 以及某个域的能力属性，但应尽量少做。每次更改都会更新实体注册表，而某些使用方（例如语音助手）在看到更改时会与其云服务重新同步。当实体在一小时内更新其能力超过 100 次时，Home Assistant 会记录一条警告。

## 你不应重写的属性

有些属性属于平台基类或 Home Assistant 本身。

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `state` | `StateType` | 写入状态机的状态。每个平台基类都根据其自身的属性（如 `is_on` 或 `native_value`）来实现它。只有在直接继承 `Entity` 的子类中才自行设置它。 |
| `state_attributes` | `dict[str, Any] \| None` | 该域的标准属性，例如灯的亮度。由平台基类实现。 |
| `capability_attributes` | `dict[str, Any] \| None` | 描述实体能做什么的属性，例如效果列表。它们也会存储在实体注册表中。由平台基类实现。 |
| `unit_of_measurement` | `str \| None` | 状态的单位。`sensor` 和 `number` 等平台会根据其自身的 `native_unit_of_measurement` 计算得出。 |
| `enabled` | `bool` | 除非注册表条目被禁用，否则为 `True`。由 Home Assistant 管理。 |

## 对实体模型提出更改

每个域的属性、特性和状态由实现该域的所有集成共享，因此更改它们比更改单个集成的影响更大。如果你想向某个域添加内容，请先在[架构讨论](https://github.com/home-assistant/architecture/discussions)中提出。只有当新增内容在多个品牌中普遍适用时才会被考虑，而不仅仅服务于某一个设备。
