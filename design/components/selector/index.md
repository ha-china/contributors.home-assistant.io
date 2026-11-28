# 选择器

> ha-selector 为选择器（selector）渲染合适的控件。选择器是对一个值的简短描述，集成、蓝图和表单在 Home Assistant 的各处都会用到它。

Source: https://www.hasscn.top/contributors/design/components/selector/

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Light" data-props='{"selector": {"entity": {"filter": {"domain": "light"}}}, "value": "light.living_room_lamp", "required": false}'></ha-selector>
<ha-selector label="Brightness" data-props='{"selector": {"number": {"min": 0, "max": 100, "unit_of_measurement": "%"}}, "value": 70, "required": false}'></ha-selector>
<ha-selector label="Turn off when nobody is home" data-props='{"selector": {"boolean": {}}, "value": true, "required": false}'></ha-selector>
```

## 概述

选择器描述一个值：“来自 light 域的一个实体（entity）”、“0 到 100 之间的一个数字”、“这些选项中的一个”。选择器组件接收这个描述，并显示与之匹配的控件。这正是同一种值在 Home Assistant 的各处看起来都一致的原因。

这些选择器与 Home Assistant 的其他部分共享：

- 集成用它们来呈现其动作（action）的字段。你向自动化（automation）添加动作时看到的表单就是由它们构建的。
- 蓝图（blueprint）用它们来呈现其输入。
- 集成可以在其配置流程和选项流程的表单中使用它们。
- 前端在自己的表单中使用它们，例如仪表盘（dashboard）卡片的可视化编辑器。

## 何时使用

在以下情况下单独使用选择器组件：

- 根据从别处获得的选择器逐个渲染字段。前端对动作、触发器和条件的字段，以及蓝图输入就是这样做的。

在以下情况下不要单独使用它：

- 一个表单。把选择器放进[表单](https://www.hasscn.top/contributors/design/components/form/)的 schema 中，由表单来渲染它，并带有标签、辅助文本、错误提示和布局。大多数时候你需要的正是这一点。

## 结构

选择器本身没有组成部分。它根据选择器的类型显示一个控件，并传递标签、辅助文本、值和其他设置。该控件通常是本站上的其他组件之一，例如[实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)或[开关](https://www.hasscn.top/contributors/design/components/switch/)。

## 变体

每种选择器类型都是一个变体。以下是最常见的几种。每一节说明人们会看到什么，以及它们提供什么类型的值。每种类型的选项列在代码部分的[每种类型的选项](https://www.hasscn.top/contributors/design/components/selector/#options-per-type)下。

### 文本

用于自由文本，显示为[文本输入框](https://www.hasscn.top/contributors/design/components/input/)。它可以扩展为多行以容纳较长的文本，为密码隐藏输入内容，检查电子邮件地址或网址，并在值的前后显示固定文本。它也可以接受一个值列表。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Name" data-props='{"selector": {"text": {}}, "value": "Living room", "required": false}'></ha-selector>
<ha-selector label="Message" data-props='{"selector": {"text": {"multiline": true}}, "value": "The front door is open.", "required": false}'></ha-selector>
<ha-selector label="Password" data-props='{"selector": {"text": {"type": "password"}}, "required": false}'></ha-selector>
<ha-selector label="Address" data-props='{"selector": {"text": {"prefix": "https://", "suffix": "/api"}}, "value": "example.local", "required": false}'></ha-selector>
```

### 数字

用于数字。有范围时，它显示一个[滑块](https://www.hasscn.top/contributors/design/components/slider/)，旁边有一个用于输入精确数字的字段。它也可以只显示字段，没有范围时就是这样。单位和步长是可选的。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Volume" data-props='{"selector": {"number": {"min": 0, "max": 100, "unit_of_measurement": "%"}}, "value": 35, "required": false}'></ha-selector>
<ha-selector label="Target temperature" data-props='{"selector": {"number": {"min": 7, "max": 35, "step": 0.5, "mode": "box", "unit_of_measurement": "°C"}}, "value": 21, "required": false}'></ha-selector>
```

### 布尔

用于开或关。它显示一个[开关](https://www.hasscn.top/contributors/design/components/switch/)，标签在旁边。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Show the state" helper="Shows the state below the name." data-props='{"selector": {"boolean": {}}, "value": true, "required": false}'></ha-selector>
```

### 选择

用于从列表中选择一个选项。每个选项都有一个值和一个人们看到的标签。

选项少于六个时，选项显示为单选按钮。达到六个或更多时，它们显示在下拉列表中。也可以明确指定选择器使用这两种方式中的哪一种。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Mode" data-props='{"selector": {"select": {"options": [{"value": "single", "label": "Single"}, {"value": "restart", "label": "Restart"}, {"value": "queued", "label": "Queued"}, {"value": "parallel", "label": "Parallel"}]}}, "value": "single", "required": false}'></ha-selector>
<ha-selector label="Day" data-props='{"selector": {"select": {"mode": "dropdown", "options": [{"value": "mon", "label": "Monday"}, {"value": "tue", "label": "Tuesday"}, {"value": "wed", "label": "Wednesday"}, {"value": "thu", "label": "Thursday"}, {"value": "fri", "label": "Friday"}, {"value": "sat", "label": "Saturday"}, {"value": "sun", "label": "Sunday"}]}}, "value": "mon", "required": false}'></ha-selector>
```

选项也可以显示为[选择框](https://www.hasscn.top/contributors/design/components/select-box/)：大块的磁贴，带有描述，还可以带一张图片。用于少数需要解释说明的选项。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Layout" data-props='{"selector": {"select": {"mode": "box", "options": [{"value": "horizontal", "label": "Horizontal", "description": "The icon next to the name."}, {"value": "vertical", "label": "Vertical", "description": "The icon above the name."}]}}, "value": "horizontal", "required": false}'></ha-selector>
```

人们也可以选择多个选项。作为列表时，选项显示为复选框。作为下拉列表时，已选的选项在其上方显示为标签（chip）。选择器可以让人们输入自己的值，并按标签对选项排序。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Notify on" data-props='{"selector": {"select": {"multiple": true, "options": [{"value": "open", "label": "Open"}, {"value": "closed", "label": "Closed"}, {"value": "unavailable", "label": "Unavailable"}]}}, "value": ["open"], "required": false}'></ha-selector>
```

### 实体

用于实体。它显示[实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)。它可以只提供符合条件的实体，依据是其域、设备类（device class）、集成、支持的功能或单位。人们可以选择一个实体，也可以选择多个。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Temperature sensor" data-props='{"selector": {"entity": {"filter": {"domain": "sensor", "device_class": "temperature"}}}, "value": "sensor.living_room_temperature", "required": false}'></ha-selector>
<ha-selector label="Lights" data-props='{"selector": {"entity": {"multiple": true, "filter": {"domain": "light"}}}, "value": ["light.living_room_lamp"], "required": false}'></ha-selector>
```

### 设备

用于设备（device）。它显示[设备选择器](https://www.hasscn.top/contributors/design/components/device-picker/)。它可以按设备本身过滤，例如其集成或制造商，也可以只提供拥有匹配实体的设备。人们可以选择一个设备，也可以选择多个。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Speaker" data-props='{"selector": {"device": {"entity": {"domain": "media_player"}}}, "value": "speaker", "required": false}'></ha-selector>
```

### 区域

用于区域（area）。它显示[区域选择器](https://www.hasscn.top/contributors/design/components/area-picker/)。与设备选择器一样，它可以按区域中的实体和设备过滤。人们可以选择一个区域，也可以选择多个。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Area" data-props='{"selector": {"area": {}}, "value": "kitchen", "required": false}'></ha-selector>
<ha-selector label="Areas" data-props='{"selector": {"area": {"multiple": true}}, "value": ["living_room", "bedroom"], "required": false}'></ha-selector>
```

### 楼层和标签

用于楼层（floor）或标签（label）。它们的工作方式与区域选择器相同，只是标签选择器没有过滤器。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Floor" data-props='{"selector": {"floor": {}}, "value": "ground", "required": false}'></ha-selector>
<ha-selector label="Label" data-props='{"selector": {"label": {}}, "value": "energy", "required": false}'></ha-selector>
```

### 目标

用于动作作用的对象。人们可以添加实体、设备、区域、楼层和标签，任意组合，动作会应用于所有这些对象。可以添加的内容可以像实体选择器和设备选择器那样进行过滤。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Targets" data-props='{"selector": {"target": {"entity": {"domain": "light"}}}, "value": {"area_id": ["living_room"], "entity_id": ["light.kitchen_ceiling"]}, "required": false}'></ha-selector>
```

### 时间和日期

用于一天中的时间、日期，或两者。时间选择器显示秒，除非将其关闭。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Wake-up time" data-props='{"selector": {"time": {"no_second": true}}, "value": "07:30:00", "required": false}'></ha-selector>
<ha-selector label="Date" data-props='{"selector": {"date": {}}, "value": "2026-12-24", "required": false}'></ha-selector>
<ha-selector label="Date and time" data-props='{"selector": {"datetime": {}}, "value": "2026-12-24 07:30:00", "required": false}'></ha-selector>
```

### 时长

用于一段时间，例如延迟或过渡。它显示小时、分钟和秒。可以添加天和毫秒，也可以去掉秒。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Delay" data-props='{"selector": {"duration": {}}, "value": {"hours": 0, "minutes": 5, "seconds": 0}, "required": false}'></ha-selector>
<ha-selector label="Keep the history for" data-props='{"selector": {"duration": {"enable_day": true, "enable_second": false}}, "value": {"days": 10, "hours": 0, "minutes": 0}, "required": false}'></ha-selector>
```

时长也可以为负，例如太阳条件中相对于日落的偏移量。在偏移版本中，人们先选择**无偏移**、**之前**或**之后**，然后输入时长。

### 色温

用于色温，显示为一个滑块，滑块背后带有光的颜色，单位为开尔文（kelvin）或 mired。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Color temperature" data-props='{"selector": {"color_temp": {"unit": "kelvin", "min": 2200, "max": 6500}}, "value": 2700, "required": false}'></ha-selector>
```

### 颜色

RGB 颜色选择器用于颜色，通过浏览器的颜色选择器来选取。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Color" data-props='{"selector": {"color_rgb": {}}, "value": [255, 160, 60], "required": false}'></ha-selector>
```

对于仪表盘上某个元素的颜色，请改用主题颜色选择器。它按名称提供主题中的颜色，因此颜色会跟随主题变化。

### 图标

用于图标，带有可搜索的所有图标列表。它可以显示人们在未选择时使用的图标。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="Icon" data-props='{"selector": {"icon": {}}, "value": "mdi:sofa", "required": false}'></ha-selector>
```

### 状态

用于实体的状态（state），例如恒温器的制热。选择器提供某个实体的可能状态，并带有其翻译后的名称。在表单中，该实体通常来自另一个字段。

Live demo of `ha-selector`, connected to a demo Home Assistant.

```html
<ha-selector label="State" data-props='{"selector": {"state": {"entity_id": "climate.thermostat"}}, "value": "heat", "required": false}'></ha-selector>
```

### 没有演示的选择器

有些选择器需要比本页演示中更多的 Home Assistant 功能。位置选择器显示地图。模板和对象选择器是代码编辑器，带字段的对象选择器是一组小表单的列表。动作、条件和触发器选择器显示其对应部分的完整自动化编辑器。媒体选择器可浏览来自媒体播放器的媒体。

总共有六十多种选择器类型。完整列表见代码部分的[所有选择器类型](https://www.hasscn.top/contributors/design/components/selector/#all-selector-types)。

## 行为

- **更改**：当人们更改值时，选择器会报告新值。其形式取决于类型。
- **必填**：选择器默认为必填，除非被标记为可选。一个没有自身校验的必填选择器在为空时是无效的。
- **禁用**：禁用的选择器会禁用其控件。
- **较旧的选择器**：较旧的名称和过滤选项会在控件显示之前转换为当前形式。

每个控件的各种状态，例如悬停、聚焦和错误，都来自它所渲染的组件。

## 规格

选择器自身不绘制任何内容，因此它没有尺寸、间距或颜色。每种类型看起来都像它所显示的组件：参见[文本输入框](https://www.hasscn.top/contributors/design/components/input/)、[开关](https://www.hasscn.top/contributors/design/components/switch/)、[滑块](https://www.hasscn.top/contributors/design/components/slider/)、[选择框](https://www.hasscn.top/contributors/design/components/select-box/)，以及[实体](https://www.hasscn.top/contributors/design/components/entity-picker/)、[设备](https://www.hasscn.top/contributors/design/components/device-picker/)和[区域](https://www.hasscn.top/contributors/design/components/area-picker/)选择器的规格。

## 指南

为值选择最具体的选择器。实体 ID 是文本，但实体选择器为人们提供一个可搜索的列表，带有名称和图标，并且只提供符合条件的实体。选择器越具体，人们需要输入的内容就越少，可能犯的错误也越少。

Do and don't, as live demos. Both are connected to a demo Home Assistant.

**Do:** Use the entity selector for an entity.

```html
<ha-selector label="Light" data-props='{"selector": {"entity": {"filter": {"domain": "light"}}}, "value": "light.living_room_lamp", "required": false}'></ha-selector>
```

**Don't:** Ask people to type an entity ID in a text field.

```html
<ha-selector label="Light" data-props='{"selector": {"text": {}}, "value": "light.living_room_lamp", "required": false}'></ha-selector>
```

- 对于少数需要解释说明的选项，将选择（select）的选项显示为选择框。
- 对动作使用目标选择器，这样人们可以说“客厅里的所有灯”，而不必逐个挑选灯。要选择一个特定的实体，请使用实体选择器。

## 无障碍

### 键盘、焦点和屏幕阅读器

选择器自身不添加任何内容。键盘支持、焦点以及屏幕阅读器播报的内容都来自它所显示的控件：参见每个组件的页面，例如[实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)、[开关](https://www.hasscn.top/contributors/design/components/switch/)或[滑块](https://www.hasscn.top/contributors/design/components/slider/)。

### 在代码中

`ha-selector` 自身不添加任何 role、label 或按键。对它调用 `focus()` 会聚焦它所渲染的控件。

## 相关内容

- [表单](https://www.hasscn.top/contributors/design/components/form/)：根据 schema 渲染选择器
- [实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)、[设备选择器](https://www.hasscn.top/contributors/design/components/device-picker/)和[区域选择器](https://www.hasscn.top/contributors/design/components/area-picker/)：实体、设备和区域选择器背后的控件
- [选择框](https://www.hasscn.top/contributors/design/components/select-box/)：选择（select）选择器的 box 模式
- [选择器文档](https://www.home-assistant.io/docs/blueprint/selectors/)：所有选项，即集成和蓝图使用它们的方式

## 在代码中

该元素是 `<ha-selector>`。选择器和大多数值只能从代码中通过属性（property）设置。

```ts
html`
  <ha-selector
    .hass=${this.hass}
    .selector=${{ number: { min: 0, max: 100, unit_of_measurement: "%" } }}
    .value=${this._brightness}
    .label=${"Brightness"}
    .required=${false}
    @value-changed=${this._brightnessChanged}
  ></ha-selector>
`;
```

在本站的 HTML 中，属性放在 `data-props` 中，以 JSON 形式表示：

```html
<ha-selector label="Brightness" data-props='{"selector": {"number": {"min": 0, "max": 100}}, "value": 70}'></ha-selector>
```

### YAML 和代码中的选择器

在 YAML 中，选择器是一个键，其值为类型，选项位于其下：

```yaml
brightness:
  selector:
    number:
      min: 0
      max: 100
      unit_of_measurement: "%"
```

在前端中，它是一样的，以对象形式表示：

```js
{ number: { min: 0, max: 100, unit_of_measurement: "%" } }
```

有关每种选择器的所有选项，即集成和蓝图使用它们的方式，请参阅[选择器文档](https://www.home-assistant.io/docs/blueprint/selectors/)。

### 每种类型的选项

每种类型最常用的选项。[home-assistant.io 上的选择器文档](https://www.home-assistant.io/docs/blueprint/selectors/)包含全部选项。

- `text`：`multiline` 用于较长的文本，`type` 用于其他输入类型，如 `password`、`email` 或 `url`，`prefix` 和 `suffix` 用于值前后的文本，`multiple` 用于列表。值是一个字符串，或一个字符串列表。
- `number`：`min`、`max`、`step` 和 `unit_of_measurement`。`mode` 为 `slider` 或 `box`。没有范围时，它是一个输入框。值是一个数字。
- `boolean`：没有选项。值为 `true` 或 `false`。
- `select`：`options`，为字符串或带有 `value` 和 `label` 的对象。`mode` 为 `list`、`dropdown` 或 `box`。没有指定模式时，少于六个选项显示为列表。还有 `multiple`、`custom_value` 和 `sort`。值是所选选项的 `value`，使用 `multiple` 时为一个列表。
- `entity`：`filter`，可按 `domain`、`device_class`、`integration`、`supported_features` 或 `unit_of_measurement` 过滤，以及 `multiple`。值是一个实体 ID，或一个实体 ID 列表。
- `device`：`filter`，按设备本身过滤，例如其 `integration` 或 `manufacturer`，`entity` 用于只提供拥有匹配实体的设备，以及 `multiple`。值是一个设备 ID，或一个设备 ID 列表。
- `area` 和 `floor`：`entity` 和 `device`，用于只提供拥有匹配实体或设备的项，以及 `multiple`。`label`：只有 `multiple`。值是一个 ID，或一个 ID 列表。
- `target`：`entity` 和 `device`，用于过滤可添加的内容。值是一个对象，包含 `entity_id`、`device_id`、`area_id`、`floor_id` 和 `label_id`，每个都是 ID 或 ID 列表，且只包含正在使用的那些。
- `time`：`no_second` 隐藏秒。值是一个形如 `07:30:00` 的字符串。`date` 给出 `2026-12-24`，`datetime` 给出 `2026-12-24 07:30:00`。
- `duration`：`enable_day`、`enable_millisecond` 和 `enable_second`（将其设为 `false` 可去掉秒）。`mode` 设为 `signed` 允许负时长，`mode` 设为 `offset` 会先要求选择**无偏移**、**之前**或**之后**。值是一个对象，包含 `hours`、`minutes` 和 `seconds`，启用时还有 `days` 和 `milliseconds`。
- `color_temp`：`unit` 设为 `kelvin`，以及带有 `min` 和 `max` 的范围。没有单位时，它以 mired 为单位。值是一个数字。
- `color_rgb`：没有选项。值是一个列表，包含红、绿、蓝的值，范围从 0 到 255。
- `ui_color`：主题的颜色，按名称。
- `icon`：`placeholder`，人们在未选择时使用的图标。值是图标名称，例如 `mdi:sofa`。
- `state`：`entity_id`，提供其状态列表的实体。在表单中，该实体通常通过 `context` 来自另一个字段。值是状态。

### 所有选择器类型

前端支持以下选择器类型：

- `action`：动作列表，例如脚本中的动作。
- `addon`：一个应用。`app` 选择器的旧名称。
- `app`：一个应用。
- `area`：一个区域。
- `areas_display`：区域的顺序，以及哪些被隐藏。
- `assist_pipeline`：一个 Assist 管道。
- `attribute`：实体的一个属性。
- `automation_behavior`：自动化如何处理多个触发器或条件。
- `backup_location`：存储备份的位置。
- `boolean`：开或关。
- `button_toggle`：从少数选项中选择一个，显示为一排按钮。
- `choose`：让人们在多个选择器之间选择，例如一个数字或一个实体。
- `color_rgb`：一种颜色，以红、绿、蓝表示。
- `color_temp`：一种色温。
- `condition`：条件列表。
- `config_entry`：一个集成条目。
- `constant`：一个固定值，显示为文本。
- `conversation_agent`：一个对话代理。
- `country`：一个国家。
- `date`：一个日期。
- `datetime`：一个日期和一个时间。
- `device`：一个设备。
- `device_class`：某个域的一个设备类。
- `duration`：一段时间。
- `entity`：一个实体。
- `entity_name`：实体名称在仪表盘上的显示方式。
- `file`：要上传的文件。
- `floor`：一个楼层。
- `icon`：一个图标。
- `label`：一个标签。
- `language`：一种语言。
- `location`：地图上的一个位置，可选带半径。
- `media`：一个媒体项目，来自媒体浏览器。
- `navigation`：Home Assistant 中的一个路径，例如仪表盘视图。
- `number`：一个数字。
- `numeric_threshold`：一个阈值，例如高于或低于某个数字或实体的状态。
- `object`：任意数据，以 YAML 表示，或一个由固定字段项组成的列表。
- `period`：一段时间，例如今天或本周。
- `qr_code`：显示一个二维码。它不接受输入。
- `select`：从列表中选择一个或多个选项。
- `selector`：一个选择器，用于自行构建选择器的编辑器，例如蓝图编辑器。
- `serial_port`：一个串口，例如 U 盘。
- `state`：实体的一个状态。
- `state_class`：传感器的一个状态类。
- `statistic`：一个统计量。
- `stt`：一个语音转文字引擎。
- `target`：动作的实体、设备、区域、楼层和标签。
- `template`：一个模板，在代码编辑器中。
- `text`：文本。
- `theme`：一个主题。
- `time`：一天中的一个时间。
- `timezone`：一个时区。
- `trigger`：触发器列表。
- `tts`：一个文字转语音引擎。
- `tts_voice`：文字转语音引擎的一个声音。
- `ui_action`：人们点击卡片时发生的事情。
- `ui_clock_date_format`：时钟卡片的日期格式。
- `ui_color`：主题的一种颜色。
- `ui_state_content`：卡片作为实体状态显示的内容。
- `ui_time_format`：一种时间格式。
- `unit_of_measurement`：一个计量单位。

以 `ui_` 开头的选择器是为仪表盘卡片的编辑器设计的。

### 属性

这些只能从代码中设置：

- `selector`：选择器。必填。
- `hass`：Home Assistant 对象。大多数选择器都需要它。
- `context`：来自别处的值，某些选择器会用到，例如状态选择器的实体。`ha-form` 会从字段的 `context` 中填充它。
- `localizeValue`：一个函数，接收一个翻译键并返回文本。带有 `translation_key` 的选择器用它来显示其选项的标签。

### 特性（attribute）

- `value`：值。任何不是字符串的内容请使用 property。
- `label`：标签。
- `helper`：帮助文本，位于控件下方。
- `placeholder`：没有值时显示的值。`ha-form` 会将其设置为字段的默认值。
- `name`：字段的名称。
- `required`：将字段标记为必填。注意：默认为 `true`。对于可选字段，请将该 property 设为 `false`。
- `disabled`：禁用控件。
- `narrow`：告知控件它处于窄屏上。

### 方法

- `reportValidity()`：检查值，有效时返回 `true`。
- `focus()`：聚焦控件。

### 事件

- `value-changed`：当人们更改值时触发。新值位于 `event.detail.value` 中。其形式取决于选择器类型。

来源：[`src/components/ha-selector/ha-selector.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-selector/ha-selector.ts)。选择器类型位于 [`src/data/selector.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts)，每种类型在 [`src/components/ha-selector/`](https://github.com/home-assistant/frontend/tree/dev/src/components/ha-selector) 中都有自己的组件。
