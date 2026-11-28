# 实体命名

> has_entity_name、翻译键和设备类如何为您的实体命名，以及 Home Assistant 如何将其转换为友好名称和实体 ID。

Source: https://www.hasscn.top/contributors/core/entities/naming/

一个好的实体名称应该简短，且只说明这个实体是什么："Battery"（电池）、"Power usage"（用电量）、"Child lock"（童锁）。Home Assistant 会自动在其前面加上设备名称。作为集成（integration）作者，您的任务是以可翻译的方式为实体提供这个简短名称。

## 使用 `has_entity_name`

在每个实体上将 `has_entity_name` 设置为 `True`。新集成必须这样做。它告诉 Home Assistant，实体的名称仅描述实体本身，而不描述它所属的设备。

```python
class ExampleSensor(SensorEntity):
    _attr_has_entity_name = True
```

设置了 `has_entity_name` 之后，实体的名称是以下三种情况之一：

- **有自己的名称**，比如 "Battery"，适用于设备上多个实体中的某个实体。请通过[翻译键（translation key）](https://www.hasscn.top/contributors/core/entities/naming/#translated-names)提供它。
- **`None`**，适用于作为其设备主要功能的实体，例如智能灯泡的灯。此时实体将采用设备的名称。
- **未设置**，适用于某些平台：此时实体根据其[设备类（device class）](https://www.hasscn.top/contributors/core/entities/naming/#names-from-the-device-class)命名。

实体名称以大写字母开头，其余为小写，除非某个单词是专有名词或总是以大写书写的缩写词。

未设置 `has_entity_name` 的集成使用旧版行为，即 `name` 中包含包括设备在内的完整名称。请不要在任何新内容中使用它。

## 翻译名称

不要硬编码英文名称。请设置 `translation_key`，并将名称放在集成 `strings.json` 文件的 `entity` 部分中。翻译名称仅适用于将 `has_entity_name` 设置为 `True` 的实体：

```json
{
  "entity": {
    "sensor": {
      "water_temperature": {
        "name": "Water temperature"
      }
    }
  }
}
```

`entity` 下的键是实体的域（domain），其下面的键是翻译键。同一个翻译键用于翻译实体的状态（state）和状态属性、其测量单位，以及查找其[图标](https://www.hasscn.top/contributors/core/entities/icons/)。有关 `strings.json` 文件的完整介绍，请参阅[翻译](https://www.hasscn.top/contributors/core/integrations/translations/)。

```python
class ExampleSensor(SensorEntity):
    _attr_has_entity_name = True
    _attr_translation_key = "water_temperature"
```

仅当名称在所有语言中都相同时才可以跳过翻译：专有名词、型号名称，或来自设备或其库的名称。在这些情况下，直接设置 `name`。

> [!NOTE]
> 翻译名称在实体首次创建时以 Home Assistant 服务器的语言解析，而不是以用户界面的语言。之后更改服务器语言不会重命名现有实体。

### 占位符

当名称中包含每个实体各不相同的部分（例如频道号）时，请在翻译中使用占位符（placeholder），并用 `translation_placeholders` 填充它：

```json
{
  "entity": {
    "switch": {
      "outlet": {
        "name": "Outlet {number}"
      }
    }
  }
}
```

```python
class ExampleOutlet(SwitchEntity):
    _attr_has_entity_name = True
    _attr_translation_key = "outlet"

    def __init__(self, number: int) -> None:
        self._attr_translation_placeholders = {"number": str(number)}
```

如果占位符与名称不匹配，Home Assistant 会在开发和 beta 版本上引发错误，并在稳定版本上记录警告。

## 来自设备类的名称

当您不设置名称时，某些平台会根据实体的设备类为其命名：`binary_sensor`、`button`、`event`、`number`、`sensor` 和 `update`，以及 `infrared` 的发射器和接收器实体。具有 `temperature` 设备类且没有名称的传感器被称为 "Temperature"，并翻译为服务器语言。在许多情况下，这就足够了。具有 `enum` 设备类的传感器是例外：它们不会从中获得名称。

这仅在名称完全未设置时发生。`_attr_name = None` 仍然表示"使用设备名称"。

## 友好名称和实体 ID

Home Assistant 根据实体名称和设备名称构建 `friendly_name` 属性：

| 情况 | 友好名称 |
| --- | --- |
| 实体没有设备 | 实体名称 |
| 实体有设备和名称 | 设备名称，然后是实体名称："Nightlight Battery" |
| 实体有设备，且其名称为 `None` | 设备名称："Nightlight" |

实体 ID 同样由名称部分构建，在实体首次注册时生成。默认情况下，这些部分是区域（area）、父设备的名称（对于子设备而言）、设备名称和实体名称，因此一个名为 "Nightlight" 且没有区域的设备，其电池传感器会变为 `sensor.nightlight_battery`，而它的灯会变为 `light.nightlight`。这些名称来自英文翻译，除非服务器语言是那些以自身语言生成实体 ID 的语言之一。用户可以选择 Home Assistant 为新实体 ID 使用哪些部分。因此，请勿在您的集成中依赖特定的实体 ID：请在[实体注册表（entity registry）](https://www.hasscn.top/contributors/core/entities/registry/)中通过实体的唯一 ID（unique ID）查找实体。

当用户重命名实体或其设备时，Home Assistant 会使用新的名称。您的代码无需知晓。
