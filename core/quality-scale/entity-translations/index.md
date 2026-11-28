# 翻译实体名称

> 黄金规则 entity-translations：实体名称来自 strings.json，因此可以被翻译。

Source: https://www.hasscn.top/contributors/core/quality-scale/entity-translations/

这是一条黄金（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `entity-translations`。

实体（entity）通过[翻译键（translation key）](https://www.hasscn.top/contributors/glossary/translation-key/)从 `strings.json` 获取名称，而不是在 Python 中硬编码英文名称。Home Assistant 的翻译者随后会将这些名称翻译成它支持的每一种语言。

## 为什么重要

Home Assistant 在世界各地都被使用，很多人使用的不是英语。在荷兰语、日语或巴西葡萄牙语界面中，一个名为“Phase voltage”的实体似乎是件小事，但几百个这样的实体加在一起，就会让人觉得 Home Assistant 并不是为你而做的。

翻译后的名称只适用于 `has_entity_name` 设置为 `True` 的实体，这也是 [has-entity-name](https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/) 规则的要求。

## 示例

在实体上设置翻译键：

```python
class MyVoltageSensor(SensorEntity):
    """The phase voltage of My device."""

    _attr_has_entity_name = True
    _attr_translation_key = "phase_voltage"
```

然后在 `strings.json` 的 `entity` 下，按平台和翻译键添加名称：

```json
{
  "entity": {
    "sensor": {
      "phase_voltage": {
        "name": "Phase voltage"
      }
    }
  }
}
```

对于一个名为“My device”的设备，该实体将显示为“My device Phase voltage”。

`binary_sensor`、`button`、`event`、`infrared`、`number`、`sensor` 或 `update` 平台上带有设备类别（device class）的实体，当设备类别的名称适用时，无需翻译键。它会以设备类别命名，例如“Temperature”，而该名称已经被翻译。这不适用于带有 `enum` 设备类别的传感器。

关于如何编写翻译者能够使用的字符串，请参见[让你的字符串可被翻译](https://www.hasscn.top/contributors/translate/guides/developers/)。

## 如何检查

- Hassfest 会验证 `strings.json` 的格式。
- 当翻译键只是重复设备类别的名称时，Pylint 会发出警告（`home-assistant-redundant-translation-key`）。
- 每个实体是否都有翻译后的名称会在审查中检查。

## 例外情况

- 如果集成（integration）没有实体，则此规则不适用。
- 如果实体只有用户自行定义、无法翻译的名称，则此规则不适用。
- 如果所有实体都使用其所属设备的名称（即 `_attr_name = None`），则此规则不适用。

## 相关规则

- [has-entity-name](https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/)：使用 has_entity_name。
- [entity-device-class](https://www.hasscn.top/contributors/core/quality-scale/entity-device-class/)：使用设备类别。
- [icon-translations](https://www.hasscn.top/contributors/core/quality-scale/icon-translations/)：使用图标翻译。
- [exception-translations](https://www.hasscn.top/contributors/core/quality-scale/exception-translations/)：翻译异常消息。
