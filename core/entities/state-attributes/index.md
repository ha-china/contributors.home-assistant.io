# 状态与属性

> 哪些内容会进入实体的状态对象、何时应添加额外的属性，以及如何让属性不进入历史记录。

Source: https://www.hasscn.top/contributors/core/entities/state-attributes/

每当实体（entity）写入自己的状态（state）时，Home Assistant 都会将其转换成[状态机](https://www.hasscn.top/contributors/glossary/state-machine/)中的一个状态对象（state object）。这个对象就是自动化（automation）、前端和历史记录所看到的内容。它由两部分组成：[状态](https://www.hasscn.top/contributors/glossary/state/)本身，以及一组[属性](https://www.hasscn.top/contributors/glossary/attribute/)。

## 状态

状态是一个简短的字符串，例如 `on`、`21.5` 或 `cleaning`。你不需要自己构建它：平台的基类（base class）会根据其自身的特性（property）来计算状态，例如开关（switch）的 `is_on`，或传感器（sensor）的 `native_value`。各平台页面列出了每个域（domain）可能的状态。

有几条规则适用于所有实体：

- 当 `available` 为 `False` 时，状态为 `unavailable`。
- 当状态为 `None` 时，它会变成 `unknown`。
- 数字会被转换为字符串。浮点数会四舍五入到便于阅读的精度。
- 状态最多为 255 个字符。过长的状态会被记录为错误，并被替换为 `unknown`。较长的文本应放在属性中，或者改用其他类型的实体。

请使用平台定义的状态。如果某个域使用 `on` 和 `off`，就不要自创 `running`。如果你需要该域中没有的词汇，请检查是否有更合适的其他平台，例如枚举型[传感器](https://www.hasscn.top/contributors/core/entities/sensor/)或[选择](https://www.hasscn.top/contributors/core/entities/select/)实体。

## 属性

Home Assistant 会按照以下顺序从多个来源填充属性：

1. 该域的功能属性（capability attribute），例如灯支持的颜色模式列表。它们描述实体能够做什么，同时也会存储在实体注册表（entity registry）中。
2. 该域的状态属性（state attribute），例如灯当前的亮度。在实体不可用（unavailable）时会省略。
3. 你的 `extra_state_attributes`。在实体不可用时同样会省略。
4. 通用属性：`unit_of_measurement`、`assumed_state`、`attribution`、`device_class`、`entity_picture`、`icon`、`friendly_name` 和 `supported_features`（仅在设置了它们时才会包含）。

前两项来自平台基类。不要在集成（integration）中重写 `state_attributes` 或 `capability_attributes`。

### 额外状态属性

`extra_state_attributes` 用于存放解释状态的集成特定信息。一个好的属性能帮助人们理解或使用当前状态，例如读数的来源，或下一次计划运行的时间。

```python
class ExampleSensor(SensorEntity):
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the station that measured the value."""
        return {"station": self._station.name}
```

或者在准备好这些值后，直接设置 `_attr_extra_state_attributes`。

在添加属性之前，请先想想它是否应该是一个独立的实体。属性无法在能源仪表盘（energy dashboard）中使用，没有长期统计（long term statistics），也不能那么容易地被翻译。会自行变化的值，例如电池电量或信号强度，几乎总是作为独立的传感器效果更好。关于设备的静态信息，例如固件版本或序列号，应该放在[设备信息](https://www.hasscn.top/contributors/core/entities/registry/#linking-to-a-device)中，而不是属性中。

属性名称为小写的 `snake_case`。值必须是可 JSON 序列化的。

### 属性不应时有时无

在自动化或模板（template）中使用属性的人，需要能够区分“这个实体没有这个属性”和“它当前没有值”。这些规则适用于每一个状态属性，而不仅仅是那些额外属性：

- 预期存在的属性始终在字典中。当它当前没有值时，其值为 `None`。
- 非预期的属性则完全不在字典中。

不可用的实体是一个例外：如上所述，它会省略其所在域的状态属性以及其额外状态属性。

当实体支持某个属性时，该属性就是预期存在的，例如当它属于实体所支持的 `supported_features` 中的某项功能时。设备此刻是否有对应的值并不重要：这正是 `None` 的用途。灯（light）的基类就是这样工作的。支持特效的灯始终拥有 `effect` 属性，并且在灯关闭时该属性为 `None`。不支持特效的灯则没有 `effect` 属性。

这一决定是在[关于实体属性的架构讨论](https://github.com/home-assistant/architecture/discussions/680)中做出的。

## 让属性不进入历史记录

记录器（recorder）会存储每一次状态变更，包括其属性。它只会省略少数几个属性，例如 `attribution` 和 `supported_features`；当一个状态的所有属性加在一起超过 16 KiB 时，它会丢弃该状态的全部属性，并在日志中记录一条警告。从不变化的属性，或者日后没有用处的属性，只会占用数据库空间。请使用类属性（class attribute）将它们排除：

```python
from homeassistant.const import MATCH_ALL


class ExampleCamera(Camera):
    _unrecorded_attributes = frozenset({"access_token", "snapshot_url"})
```

- `_unrecorded_attributes` 用于你的集成的实体类。
- `_entity_component_unrecorded_attributes` 用于某个域的基类，例如风扇（fan）的 `preset_modes`。

两者都必须是类属性。在实例上设置它们不会有任何作用。使用 `MATCH_ALL` 可以一次性排除所有内容。即便如此，Home Assistant 仍会继续记录 `device_class`、`unit_of_measurement`、`friendly_name` 和 `state_class`，因为其他功能依赖它们。

## 应避免的做法

- 当没有发生有意义的变化时，不要在每次更新时都更改属性，例如“上次检查”时间戳。每一次更改都会在数据库中新增一行，并产生一个自动化能感知到的状态变更事件。
- 不要把同一个值既放在属性中，又放在状态中。
- 不要使用属性来绕过某个域缺失的功能。请改为[提议添加该功能](https://www.hasscn.top/contributors/core/entities/entity-class/#proposing-changes-to-an-entity-model)。
