# 表单

> ha-form 根据模式（schema）渲染一个完整的表单，为每个值选择合适的字段，并返回数据。

Source: https://www.hasscn.top/contributors/design/components/form/

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Host", "required": true, "selector": {"text": {}}}, {"name": "Port", "selector": {"number": {"min": 1, "max": 65535, "mode": "box"}}}, {"name": "Use SSL", "selector": {"boolean": {}}}], "data": {"Host": "192.168.1.20", "Port": 8080, "Use SSL": false}}'></ha-form>
```

## 概述

表单组件将模式（schema）转换为表单。模式是一个字段列表。每个字段都有一个名称，并说明它保存什么类型的值。表单为每个字段选择合适的控件，进行布局，并将数据作为一个以字段名称为键的对象整体返回。

它在 Home Assistant 中随处可见：在集成的配置流程中、在辅助元素（helper）的选项中、在仪表盘卡片的可视化编辑器中，以及在自动化和脚本的设置中。配置流程的表单直接来自集成，是后端发送的模式。前端使用同一个组件来渲染它们。

本页的演示使用了易读的名称，例如 **Host**，因为在没有其他内容时，名称就是标签。在实际代码中，名称是像 `host` 这样的键，而标签来自翻译。参见[标签和辅助文本](https://www.hasscn.top/contributors/design/components/form/#labels-and-helpers)。

## 何时使用

在以下情况使用表单：

- 超过一两个字段的表单。你写的代码更少，而且你的表单在外观和行为上都与 Home Assistant 中的其他表单一致：相同的间距、相同的控件、相同的校验。
- 一起保存的设置，例如辅助元素的选项或卡片的编辑器

在以下情况不要使用表单：

- 单个独立运作的控件，例如立即应用设置的开关。直接使用那个组件，例如[开关](https://www.hasscn.top/contributors/design/components/switch/)或[输入框](https://www.hasscn.top/contributors/design/components/input/)。

## 结构

1. **表单错误**：关于整个表单的错误，位于顶部
2. **字段错误或警告**：位于相关字段正上方的[警告提示](https://www.hasscn.top/contributors/design/components/alert/)
3. **字段**：一个值的控件，带有其标签和辅助文本。大多数字段是一个[选择器](https://www.hasscn.top/contributors/design/components/selector/)。
4. **网格**：可选，字段并排显示
5. **可展开区块**：可选，位于可开合的标题下的字段

## 变体

### 字段即选择器

前端中几乎每个字段都是一个选择器（selector）：对值的简短描述，例如“来自 light 域的一个实体”或“0 到 100 之间的一个数字”。选择器决定使用哪个控件。这些选择器与集成在其动作字段中使用的选择器相同，也与蓝图（blueprint）在其输入中使用的选择器相同。[选择器](https://www.hasscn.top/contributors/design/components/selector/)页面列出了所有选择器，并附有各自的演示。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Light", "selector": {"entity": {"filter": {"domain": "light"}}}}, {"name": "Brightness", "selector": {"number": {"min": 0, "max": 100, "unit_of_measurement": "%"}}}, {"name": "Transition", "selector": {"duration": {}}}], "data": {"Light": "light.living_room_lamp", "Brightness": 70}}'></ha-form>
```

### 必填字段和默认值

必填字段会显示必填标记，空值将无法通过校验。默认值是人们将字段留空时的值。对于非必填字段，默认值会显示为占位符。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Name", "required": true, "selector": {"text": {}}}, {"name": "Scan interval", "default": 30, "selector": {"number": {"min": 5, "max": 3600, "mode": "box", "unit_of_measurement": "seconds"}}}], "data": {}}'></ha-form>
```

### 标签和辅助文本

每个字段都有一个标签，并且可以在其下方显示帮助文本。两者都来自翻译。如果没有翻译的标签，表单会显示字段的名称。这对于快速测试没问题，但对用户来说并不合适：名称是像 `scan_interval` 这样的键，而且没有被翻译。字段内部的值，例如下拉选择的选项，也会被翻译。

### 网格

网格将字段并排显示。用于属于一起的短字段，例如最小值和最大值。列的宽度至少为 200 像素，在没有空间时会换行到新的一行，因此网格在手机上会堆叠显示。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "", "type": "grid", "schema": [{"name": "Minimum", "selector": {"number": {"mode": "box"}}}, {"name": "Maximum", "selector": {"number": {"mode": "box"}}}]}, {"name": "Step", "selector": {"number": {"mode": "box"}}}], "data": {"Minimum": 0, "Maximum": 100, "Step": 1}}'></ha-form>
```

### 可展开区块

可展开区块将字段分组在一个用户可以打开和关闭的标题下。用它来让长表单保持清爽：把大多数人需要的字段放在顶部，把其余的收起来，例如高级选项或卡片的交互功能。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Name", "selector": {"text": {}}}, {"name": "advanced", "type": "expandable", "flatten": true, "title": "Advanced options", "schema": [{"name": "Scan interval", "selector": {"number": {"min": 5, "max": 3600, "mode": "box", "unit_of_measurement": "seconds"}}}, {"name": "Debug logging", "selector": {"boolean": {}}}]}], "data": {"Name": "Living room"}}'></ha-form>
```

标题文本是区块的标题，如果没有标题，则使用其翻译后的标签。区块可以在标题前显示一个图标。区块默认是关闭的，除非被设置为默认展开。区块的帮助文本会作为描述显示在其内容的顶部。卡片编辑器大量使用这些区块，并带有图标，例如 **Content** 和 **Interactions**。

### 条件字段

有些字段只有在另一个字段具有某个特定值时才有意义。这样的字段只有在其条件匹配时才会显示。在这里，用户名和密码只有在开启身份验证后才会显示：

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Use authentication", "selector": {"boolean": {}}}, {"name": "Username", "visible": {"field": "Use authentication", "value": true}, "selector": {"text": {}}}, {"name": "Password", "visible": {"field": "Use authentication", "value": true}, "selector": {"text": {"type": "password"}}}], "data": {"Use authentication": false}}'></ha-form>
```

### 其他字段类型

在选择器出现之前，表单有自己的字段类型，现在仍然可以渲染它们。你主要在配置流程中看到它们，后端仍在发送这些类型。在新表单中，请使用选择器。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Name", "type": "string"}, {"name": "Port", "type": "integer"}, {"name": "Mode", "type": "select", "options": [["auto", "Automatic"], ["manual", "Manual"]]}, {"name": "Enabled", "type": "boolean"}], "data": {"Name": "Living room", "Mode": "auto", "Enabled": true}}'></ha-form>
```

完整的类型列表见[代码部分](https://www.hasscn.top/contributors/design/components/form/#other-field-types-in-code)中的[其他字段类型](https://www.hasscn.top/contributors/design/components/form/#other-field-types-in-code)。

## 行为

- **更改**：任何字段中的每次更改都会更新表单的数据，并一次性报告全部数据。
- **错误**：表单错误显示在顶部的错误提示中。字段错误显示在该字段正上方的错误提示中。错误列表会在提示中以项目符号列表的形式显示。
- **警告**：字段的警告在该字段没有错误时，显示在该字段正上方的警告提示中。没有针对整个表单的警告。
- **校验**：检查表单会检查每个可见字段，并将焦点移动到第一个无效的字段。
- **隐藏字段**：条件不匹配的字段不会被渲染，并且在检查表单时会被跳过。它的值不再计入其他字段的条件。
- **禁用**：禁用的表单会禁用其所有字段。单个字段也可以被禁用。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Host", "required": true, "selector": {"text": {}}}, {"name": "Port", "selector": {"number": {"min": 1, "max": 65535, "mode": "box"}}}], "data": {"Host": "192.168.1.200", "Port": 8080}, "error": {"base": "Could not connect to the device.", "Host": "No device answers on this address."}}'></ha-form>
```

## 规格

表单只设置其各部分之间的间距。每个字段具有其自身组件的规格。

| 属性 | 值 | Token |
| --- | --- | --- |
| 字段之间的间距 | 24px | 无 |
| 字段提示与字段之间的间距 | 4px | 无 |
| 网格列间距 | 8px | `--ha-space-2` |
| 网格行间距 | 24px | `--ha-space-6` |
| 网格最小列宽 | 200px | `--form-grid-min-width` |
| 网格列数 | 能容纳多少就多少 | `--form-grid-column-count` |
| 可展开区块 | 带边框的[展开面板](https://www.hasscn.top/contributors/design/components/expansion-panel/)，8px 圆角 | `--ha-border-radius-md` |
| 可展开区块内容内边距 | 12px | 无 |
| 区块描述下方的间距 | 24px | 无 |
| 区块图标颜色 | 次要文本颜色 | `--secondary-text-color` |

## 指南

- 在合理的情况下将字段设为可选，并为它们提供合理的默认值。好的默认值能帮助用户，又不会妨碍想要其他设置的用户。
- 为每个字段提供合适的标签、在有帮助的地方提供辅助文本，以及清晰的校验反馈。措辞请参见 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。

Do and don't, as live demos. Both are connected to a demo Home Assistant.

**Do:** 说明出了什么问题，以及人们可以如何处理。

```html
<ha-form data-props='{"schema": [{"name": "Host", "required": true, "selector": {"text": {}}}], "data": {"Host": "192.168.1.200"}, "error": {"Host": "No device answers on this address. Check that the device is turned on."}}'></ha-form>
```

**Don't:** 显示让人摸不着头脑的模糊错误。

```html
<ha-form data-props='{"schema": [{"name": "Host", "required": true, "selector": {"text": {}}}], "data": {"Host": "192.168.1.200"}, "error": {"Host": "Invalid input."}}'></ha-form>
```

## 无障碍

### 键盘和焦点

表单不添加自己的按键：每个字段自行处理其键盘输入。<kbd>Tab</kbd> 按照模式的顺序在字段之间移动。聚焦表单会聚焦其第一个字段。检查表单会将焦点移动到第一个无效的字段。

### 屏幕阅读器

每个字段都通过其自身的标签进行播报，如其组件页面所述。在已打开的表单上出现的错误和警告会被大多数屏幕阅读器立即读出，但它们没有与其字段关联。可展开区块的标题会作为标题（heading）播报。

### 在代码中

- 表单会委托焦点，因此聚焦 `<ha-form>` 会聚焦其第一个字段。
- 表单不是 `<form>` 元素，也没有自己的角色（role）。
- 每个字段通过 `computeLabel` 获取其标签，字段组件将其转换为可访问名称。具体方式请参见各组件的页面。
- 错误和警告是带有 `alert` 角色的提示。当它们出现在已打开的表单上时，大多数屏幕阅读器会立即读出。它们没有通过 `aria-describedby` 与其字段关联。
- 可展开区块的标题具有 `heading` 角色，默认为第 3 级。

## 相关内容

- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：表单的字段
- [展开面板](https://www.hasscn.top/contributors/design/components/expansion-panel/)：可展开区块的基础
- [警告提示](https://www.hasscn.top/contributors/design/components/alert/)：错误和警告的显示方式
- [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)：如何编写标签、辅助文本和错误信息

## 在代码中

该元素是 `<ha-form>`。模式、数据和函数只能通过代码以属性（property）的形式设置。

```ts
const SCHEMA = [
  { name: "host", required: true, selector: { text: {} } },
  { name: "port", selector: { number: { min: 1, max: 65535, mode: "box" } } },
  { name: "ssl", selector: { boolean: {} } },
] as const satisfies readonly HaFormSchema[];

html`
  <ha-form
    .hass=${this.hass}
    .data=${this._data}
    .schema=${SCHEMA}
    .error=${this._errors}
    .computeLabel=${this._computeLabel}
    .computeHelper=${this._computeHelper}
    @value-changed=${this._valueChanged}
  ></ha-form>
`;
```

在本站的 HTML 中，属性放在 `data-props` 中，以 JSON 形式表示：

```html
<ha-form data-props='{"schema": [{"name": "Host", "selector": {"text": {}}}], "data": {}}'></ha-form>
```

### 字段

一个字段看起来像这样：

```js
{ name: "brightness", selector: { number: { min: 0, max: 100, unit_of_measurement: "%" } } }
```

每个字段还可以有：

- `required`：该字段需要一个值。它会显示必填标记，空值将无法通过校验。
- `default`：人们将字段留空时的值。对于非必填字段，默认值会显示为占位符。
- `disabled`：显示该字段，但用户无法更改它。
- `description`：一个对象，包含 `suggested_value`（在表单打开时填入）和 `suffix`（显示在较旧的文本和数字字段的末尾）。
- `visible`：何时显示该字段。参见[条件](https://www.hasscn.top/contributors/design/components/form/#conditions)。
- `context`：将另一个字段的值传递给该字段。参见[上下文](https://www.hasscn.top/contributors/design/components/form/#context)。

### 标签、辅助文本和值

在实际代码中，传入 `computeLabel`。它接收每个字段的模式，并返回标签。大多数表单会在翻译中查找名称：

```ts
private _computeLabel = (schema: SchemaUnion<typeof SCHEMA>) =>
  this.hass.localize(`ui.panel.config.my_feature.fields.${schema.name}`);
```

`computeHelper` 的工作方式相同，返回字段下方的帮助文本。对于不需要帮助的字段，返回空即可。

对于字段内部的值，例如下拉选择的选项，传入 `localizeValue`。带有 `translation_key` 的选择器会通过它查找其选项标签。

### 错误和警告

设置 `error` 来显示出了什么问题。它是一个以字段名称为键的对象。键 `base` 用于关于整个表单的错误，例如连接失败。

错误消息按原样显示，除非你传入 `computeError`。配置流程将翻译键作为错误发送，并使用 `computeError` 将它们转换为文本。

`warning` 的工作方式相同，只是用警告代替错误，并使用 `computeWarning` 将其转换为文本。它没有 `base`。

### 网格

```js
{
  name: "",
  type: "grid",
  schema: [
    { name: "min", selector: { number: { mode: "box" } } },
    { name: "max", selector: { number: { mode: "box" } } },
  ],
}
```

名称为空时，网格的字段直接写入表单本身的数据。有名称时，它们写入该名称下的嵌套对象，除非你设置了 `flatten: true`。设置 `column_min_width` 可以更改最小列宽。

### 可展开区块

区块具有 `type: "expandable"` 和自己的 `schema`。添加 `icon` 或 `iconPath` 可以在标题前显示图标。设置 `expanded: true` 可以让区块从一开始就展开。与网格一样，区块的字段写入嵌套对象，除非你设置了 `flatten: true`。设置 `headingLevel` 可以更改标题的标题级别，默认为 3。

### 条件

在字段上设置 `visible`，使其仅在满足条件时显示。它可以是 `true` 或 `false`、一个条件，或者一个必须全部匹配的条件列表。

```js
{
  name: "password",
  visible: { field: "use_auth", value: true },
  selector: { text: { type: "password" } },
}
```

条件将一个 `field` 与一个 `value` 进行比较。`operator` 默认为 `eq`，也可以是 `not_eq`、`in`、`not_in`（带一个值列表）、`exists` 或 `not_exists`。要组合条件，请使用 `condition: "and"`、`"or"` 或 `"not"`，并带一个 `conditions` 列表。

### 上下文

有些选择器需要另一个值才能工作：状态选择器需要知道要列出哪个实体的状态。在字段上设置 `context`，将选择器的上下文键映射到另一个字段的名称。例如，状态选择器从 `filter_entity` 键读取实体：

```js
{ name: "state", selector: { state: {} }, context: { filter_entity: "entity" } }
```

### 代码中的其他字段类型

- `string`：文本字段。当 `format` 设置为 `email` 或 `url` 时，它使用相应的输入类型。名称包含 `password`、`secret` 或 `token` 的字段会被遮蔽。
- `integer`：整数。同时具有 `valueMin` 和 `valueMax` 时，它会显示为滑块。
- `float`：小数。
- `boolean`：复选框。
- `select`：从值和标签对的列表中选择一个选项。
- `multi_select`：多个选项，以复选框形式显示，列表较长时以下拉形式显示。
- `positive_time_period_dict`：以小时、分钟和秒表示的时长。
- `constant`：以文本形式显示标签和固定的 `value`。

类型 `grid`、`expandable`、`optional_actions` 和 `divider` 用于布局。`optional_actions` 将其字段隐藏在一个添加按钮后面，因此用户只添加他们需要的字段。`divider` 在字段之间绘制一条分隔线。

### 属性

这些只能通过代码设置：

- `schema`：字段列表。必填。
- `data`：值，以字段名称为键的对象。
- `hass`：Home Assistant 对象。大多数选择器都需要它。
- `error`：要显示的错误，以字段名称为键，`base` 用于整个表单。
- `warning`：要显示的警告，以字段名称为键。
- `computeLabel`：一个函数，接收字段的模式和数据，返回标签。
- `computeHelper`：一个函数，接收字段的模式，返回帮助文本。
- `computeError`：一个函数，接收错误和模式，返回要显示的文本。
- `computeWarning`：同上，用于警告。
- `localizeValue`：一个函数，接收翻译键，返回文本。选择器用它来获取其选项的标签。
- `context`：传递给表单中每个选择器的值，与每个字段的上下文合并。

### 特性（Attributes）

- `disabled`：禁用所有字段。
- `narrow`：告知选择器表单处于窄屏上。

### 方法

- `reportValidity()`：检查每个可见字段，聚焦第一个无效字段，并在表单有效时返回 `true`。在保存之前调用它。

### 事件

- `value-changed`：在任何字段的每次更改时触发。`event.detail.value` 包含表单的全部数据，而不仅仅是被更改的字段。表单也会更新自己的 `data`。

### 样式

- `--form-grid-column-count`：网格中的列数。默认为能容纳多少就多少。
- `--form-grid-min-width`：网格列的最小宽度。默认为 `200px`。

字段周围的包装元素作为 `root` 部分暴露。

来源：[`src/components/ha-form/ha-form.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-form/ha-form.ts)
