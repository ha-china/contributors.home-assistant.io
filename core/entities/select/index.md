# Select 实体

> 构建一个选择实体（select entity），让用户从固定列表中选择一个选项，例如运行模式。

Source: https://www.hasscn.top/contributors/core/entities/select/

选择实体（select entity）让用户从你的集成（integration）提供的一个有限列表中选择一个选项，例如设备的运行模式或运动传感器的灵敏度。请继承 `homeassistant.components.select` 中的 `SelectEntity`。

只有在没有更合适的平台时才使用 select。灯泡的效果本可以做成一个 select，但它属于支持效果的 [light](https://www.hasscn.top/contributors/core/entities/light/) 实体。风扇预设、空调（climate）模式和媒体播放器的音源也是如此。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `options` | `list[str]` | 必填 | 用户可以从中选择的选项。 |
| `current_option` | `str \| None` | `None` | 当前选中的选项。 |

你也可以在 `SelectEntityDescription` 上设置 `options`。当属性和描述都没有提供选项时，该属性会抛出 `AttributeError`。

每个实体都具有的通用属性，如 `name`、`available` 和 `unique_id`，见[实体类（entity class）](https://www.hasscn.top/contributors/core/entities/entity-class/)。

## 支持的功能

该实体没有支持的功能。

## 翻译选项

选项是值，而不是给人阅读的文本。请将它们设为小写的 `snake_case` 键，如 `eco` 或 `high_power`，在实体上设置[翻译键（translation key）](https://www.hasscn.top/contributors/glossary/translation-key/)，并将每个选项作为状态（state）在 `strings.json` 中进行翻译：

```json
{
  "entity": {
    "select": {
      "operating_mode": {
        "name": "Operating mode",
        "state": {
          "eco": "Eco",
          "high_power": "High power"
        }
      }
    }
  }
}
```

前端会显示这些翻译，而自动化（automation）继续使用这些稳定的键工作。参见[让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)，以及[图标](https://www.hasscn.top/contributors/core/entities/icons/)，为每个选项设置专属图标。

## 方法

### 选择选项

当有人在 UI 中选择一个选项，或者自动化或脚本调用 `select.select_option` 动作（action）时被调用。两者实现其一即可。

```python
class MySelect(SelectEntity):
    # Implement one of these methods.

    def select_option(self, option: str) -> None:
        """Change the selected option."""

    async def async_select_option(self, option: str) -> None:
        """Change the selected option."""
```

基类会先校验选项：你只会收到在 `options` 中的选项。其他任何值都会在你的方法运行前抛出 `ServiceValidationError`。

动作 `select.select_first`、`select.select_last`、`select.select_next` 和 `select.select_previous` 由基类处理。它们会根据 `options` 和 `current_option` 计算出新的选项，然后用它调用你的 select 方法。你无需实现它们。

## 状态

状态为 `current_option`。当 `current_option` 为 `None`，或者它不在 `options` 中时，状态为 `unknown`。

`options` 是一个能力属性（capability attribute）：它会被写入[实体注册表（entity registry）](https://www.hasscn.top/contributors/core/entities/registry/)，并被排除在 recorder 历史记录之外。

## 示例

```python
from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory


class ExampleOperatingMode(SelectEntity):
    """The operating mode of a heat pump."""

    _attr_has_entity_name = True
    _attr_translation_key = "operating_mode"
    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = ["eco", "comfort", "high_power"]

    def __init__(self, device: ExampleDevice) -> None:
        """Initialize the select."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_operating_mode"
        self._attr_current_option = device.mode

    async def async_select_option(self, option: str) -> None:
        """Change the operating mode."""
        await self._device.set_mode(option)
        self._attr_current_option = option
        self.async_write_ha_state()
```
