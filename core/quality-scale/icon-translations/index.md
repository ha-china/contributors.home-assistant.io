# 使用图标翻译

> 金牌规则 icon-translations：实体图标在 icons.json 中定义。

Source: https://www.hasscn.top/contributors/core/quality-scale/icon-translations/

这是一条金牌（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `icon-translations`。

需要专属图标的实体（entity）通过其[翻译键（translation key）](https://www.hasscn.top/contributors/glossary/translation-key/)从 `icons.json` 中获取图标，而不是在 Python 中设置 `icon`。这个名字听起来有些奇怪：其实并没有翻译任何内容。翻译键只是将实体与其图标关联起来的引用，就像它将实体与其名称关联起来一样。

`icons.json` 可以设置默认图标、每个状态（state）对应的图标，对于数值型实体，还可以为每个数值区间设置图标。它还可以为状态属性的值设置图标，例如气候（climate）实体的预设模式。

> [!NOTE]
> 实体也会从其设备类别（device class）获取图标。当实体的含义与设备类别的含义完全一致时，请保留该图标。PM2.5 传感器不需要专属图标。

## 为什么重要

图标曾经是实体状态的一部分，每次更新时都会写入状态机（state machine），尽管它们几乎从不变化。有了图标翻译，前端根据状态选取图标，状态机的工作量因此减少。一个集成（integration）的所有图标都集中在一个文件中，便于审阅和修改。

## 示例

实体设置一个翻译键：

```python
class MyPollenSensor(SensorEntity):
    """The tree pollen level."""

    _attr_has_entity_name = True
    _attr_translation_key = "tree_pollen"
```

`icons.json` 为它提供一个默认图标，以及 `high` 状态对应的另一个图标：

```json
{
  "entity": {
    "sensor": {
      "tree_pollen": {
        "default": "mdi:tree",
        "state": {
          "high": "mdi:tree-outline"
        }
      }
    }
  }
}
```

对于数值型实体，`range` 会选取小于或等于状态值的最大区间值所对应的图标：

```json
{
  "entity": {
    "sensor": {
      "water_level": {
        "default": "mdi:water-off",
        "range": {
          "0": "mdi:water-outline",
          "50": "mdi:water-percent",
          "90": "mdi:water"
        }
      }
    }
  }
}
```

状态为 60 时显示 `mdi:water-percent`，90 及以上显示 `mdi:water`。当状态低于最小区间、不可用（unavailable）或不是数字时，使用默认图标。区间键可以是整数或小数，例如 `"0.5"`，并且必须按升序排列。当实体同时具有 `state` 和 `range` 图标时，`state` 图标优先。

## 如何检查

- Hassfest 验证 `icons.json`：格式、必须为数字且按升序排列的区间键，以及必须与默认图标不同的状态图标。
- Pylint 会因不存在的 `mdi:` 图标而失败，包括 `icons.json` 中的（`home-assistant-mdi-icon-json-not-found`）和 Python 代码中的（`home-assistant-mdi-icon-not-found`）。
- 对于本应放在 `icons.json` 中的图标是否在 Python 中设置，会在代码审查时进行检查。

## 例外情况

- 如果集成没有实体，此规则不适用。
- 如果实体不使用专属图标，例如因为其设备类别的图标已经适用，此规则不适用。

## 相关规则

- [entity-translations](https://www.hasscn.top/contributors/core/quality-scale/entity-translations/)：翻译实体名称。
- [entity-device-class](https://www.hasscn.top/contributors/core/quality-scale/entity-device-class/)：使用设备类别。
