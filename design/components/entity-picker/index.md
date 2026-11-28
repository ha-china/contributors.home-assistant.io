# 实体选择器

> 实体选择器让人们可以通过搜索，从家中的所有实体中选择一个实体。

Source: https://www.hasscn.top/contributors/design/components/entity-picker/

Live demo of `ha-entity-picker`, connected to a demo Home Assistant.

```html
<ha-entity-picker label="Entity" value="light.living_room_lamp"></ha-entity-picker>
<ha-entity-picker label="Entity"></ha-entity-picker>
```

## 概述

实体选择器是用于选择一个[实体](https://www.hasscn.top/contributors/glossary/entity/)的字段：卡片显示的灯、辅助元素（helper）读取的传感器、自动化监视的实体。选择该字段会打开一个可搜索的列表。每一行显示实体名称，并附带其设备和区域作为上下文，这样人们就能区分两个都叫 **Ceiling** 的灯。

实体选择器是前端中使用最多的选择器，在大多数地方它通过实体选择器（selector）来使用。当你在表单之外构建自定义编辑器时，可以直接使用该元素。

## 何时使用

在以下情况使用实体选择器：

- 只选择一个实体
- 表单之外的自定义编辑器

不要在以下情况使用实体选择器：

- 选择多个实体。请使用实体[选择器](https://www.hasscn.top/contributors/design/components/selector/)，它允许选择多个。它会为每个实体渲染一个选择器，并在其下方显示用于选择下一个实体的选择器，一旦列表中已有实体，该选择器就会变成一个**添加实体**按钮。
- 选择操作所作用的对象，比如要打开的灯。请使用目标选择器：它可以在一个字段中接受实体、设备、区域、楼层和标签。
- 选择设备而不是它的某个实体。请使用[设备选择器](https://www.hasscn.top/contributors/design/components/device-picker/)。
- 表单中的字段。不要自己放置选择器：请在 [ha-form](https://www.hasscn.top/contributors/design/components/form/) schema 中使用实体选择器（selector），表单会为你渲染该选择器。

## 结构

1. **标签**：位于字段上方
2. **字段**：显示值并打开列表的按钮
3. **值或占位符**：实体的状态图标和名称，以及其设备和区域；为空时显示**选择一个实体**
4. **清除按钮**：移除值，当字段不是必填时显示
5. **箭头**：表示该字段会打开一个列表
6. **辅助文本**：字段下方的可选文本
7. **列表**：带有搜索字段和实体的弹出框。每一行包含状态图标、实体名称、其设备和区域，行末是集成名称。

## 变体

### 已过滤

只显示对该字段有意义的实体。你可以按域名（domain）、设备类别、计量单位进行过滤，也可以按要包含或排除的实体 ID 列表进行过滤。

Live demo of `ha-entity-picker`, connected to a demo Home Assistant. 只有灯和开关。

```html
<ha-entity-picker label="Entity" include-domains='["light", "switch"]'></ha-entity-picker>
```

Live demo of `ha-entity-picker`, connected to a demo Home Assistant. 只有温度和湿度传感器。

```html
<ha-entity-picker label="Sensor" include-domains='["sensor"]' include-device-classes='["temperature", "humidity"]'></ha-entity-picker>
```

### 带辅助文本

标签说明实体的用途：**Entity**、**Temperature sensor**、**Light to control**。当这个选择需要解释时，在字段下方添加辅助文本。

Live demo of `ha-entity-picker`, connected to a demo Home Assistant.

```html
<ha-entity-picker label="Temperature sensor" include-domains='["sensor"]' include-device-classes='["temperature"]' helper="The card shows the temperature of this sensor."></ha-entity-picker>
```

### 显示实体 ID

列表在每行末尾显示每个实体的集成。选择器也可以改为在名称下方显示实体 ID。人们也可以在自己的个人资料设置中为所有选择器开启此功能。在人们以实体 ID 思考的地方使用它，比如高级或面向 YAML 的界面。

Live demo of `ha-entity-picker`, connected to a demo Home Assistant.

```html
<ha-entity-picker label="Entity" show-entity-id></ha-entity-picker>
```

### 添加按钮

在实体列表中，用于选择下一个实体的选择器可以显示为按钮。此时它始终显示为按钮，而不会显示值。选择一个实体会报告它，这样你就可以把它添加到你的列表中。按钮标签默认为**添加实体**，并且可以更改。

Live demo of `ha-entity-picker`, connected to a demo Home Assistant.

```html
<ha-entity-picker add-button></ha-entity-picker>
```

### 自定义实体 ID

默认情况下，人们只能从列表中选择实体。选择器也可以接受一个尚不存在的、手动输入的实体 ID。输入的值仍然必须看起来像一个实体 ID，例如 `light.attic`。

## 行为

- **启用**：选择该字段会打开列表，并将焦点移至其搜索字段。
- **悬停和按下**：字段显示涟漪效果。
- **聚焦**：字段底部的线条变为 2px 粗，并使用主色。
- **搜索**：输入时会即时过滤列表。当没有匹配项时，列表会显示**未找到与你的搜索词匹配的实体**。
- **未知**：当值是一个不存在的实体时，比如已被移除的实体，字段会变为低调的警告色，并显示**已选择未知实体**。人们随后可以选择另一个实体，或清除该字段。
- **禁用**：字段变暗至 50% 不透明度，且无法打开。
- **窄屏**：当窗口宽度不超过 870px 或高度不超过 500px 时，列表会以底部抽屉的形式打开，而不是弹出框。

选择一个实体会关闭列表。新值会在列表关闭后报告。

Live demo of `ha-entity-picker`, connected to a demo Home Assistant.

```html
<ha-entity-picker label="Entity" value="light.attic"></ha-entity-picker>
<ha-entity-picker label="Entity" value="climate.thermostat" disabled></ha-entity-picker>
```

## 规格

实体选择器使用前端共享的选择器字段和列表，即 `ha-picker-field` 和 `ha-generic-picker`。

### 字段

| 属性 | 值 | 令牌 |
| --- | --- | --- |
| 标签与字段之间的间距 | 8px | None |
| 最小高度 | 56px | None |
| 起始内边距 | 16px | `--ha-space-4` |
| 结束内边距 | 8px | `--ha-space-2` |
| 各部分之间的间距 | 8px | `--ha-space-2` |
| 圆角半径 | 顶部 4px，底部为直角 | `--ha-border-radius-sm` |
| 背景 | 表单背景 | `--ha-color-form-background` |
| 底部线条 | 1px | `--ha-color-border-neutral-loud` |
| 底部线条，聚焦时 | 2px | `--mdc-theme-primary` |
| 底部线条，无效时 | 2px | `--error-color` |
| 占位符文本 | 次要文本颜色 | `--secondary-text-color` |
| 清除按钮 | 32px | `--ha-icon-button-size` |
| 箭头图标 | 20px，位于 32px 宽的区域内 | `--mdc-icon-size` |
| 未知背景 | 低调警告填充 | `--ha-color-fill-warning-quiet-resting` |
| 未知文本 | 警告文本 | `--ha-color-on-warning-normal` |
| 禁用 | 禁用表单背景上 50% 不透明度 | `--ha-color-form-background-disabled` |
| 辅助文本上方的间距 | 8px | `--ha-space-2` |

### 列表

| 属性 | 值 | 令牌 |
| --- | --- | --- |
| 宽度 | 字段的宽度，至少 250px | `--ha-generic-picker-width` |
| 最大宽度 | 该宽度，除非另行设置 | `--ha-generic-picker-max-width` |
| 最大高度 | 窗口高度的 70% 与 500px 中的较小者。当窗口高度不超过 1000px 时，为 70% 与 400px 中的较小者 | None |
| 圆角半径 | 8px | `--ha-border-radius-md` |
| 阴影 | 中等阴影 | `--ha-box-shadow-m` |
| 行分隔线 | 行与行之间 1px | `--divider-color` |
| 底部抽屉圆角半径 | 20px | `--ha-border-radius-2xl` |
| 底部抽屉最大宽度 | 600px | None |

## 指南

- 只显示对该字段有意义的实体。控制灯的卡片应该只提供灯。
- 避免过于严格的过滤条件，以免人们最终得到一个空列表却不知道原因。
- 只在人们以实体 ID 思考的地方显示实体 ID。

Do and don't, as live demos. Both are connected to a demo Home Assistant.

**Do:** 按字段的需要过滤列表，并说明实体的用途。

```html
<ha-entity-picker label="Light to control" include-domains='["light"]'></ha-entity-picker>
```

**Don't:** 不要为只适用于一种类型的字段提供家中的所有实体。

```html
<ha-entity-picker label="Entity"></ha-entity-picker>
```

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至字段，以及清除按钮（如果存在）。禁用的字段会被跳过。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 当字段获得焦点时，打开列表。 |
| 输入 | 搜索列表。列表打开时，焦点位于搜索字段中。 |
| <kbd>Arrow down</kbd> 和 <kbd>Arrow up</kbd> | 在实体之间移动。 |
| <kbd>Home</kbd> 和 <kbd>End</kbd> | 跳转到第一个或最后一个实体。 |
| <kbd>Page up</kbd> 和 <kbd>Page down</kbd> | 在列表中按页移动。 |
| <kbd>Enter</kbd> | 选择高亮显示的实体。搜索时，最顶部的匹配项会被高亮显示。当列表中只有一个选项时，<kbd>Enter</kbd> 会选择它。 |
| <kbd>Escape</kbd> | 关闭列表。 |

### 焦点

字段获得焦点时显示为更粗的底部线条，而不是焦点环。当列表作为弹出框打开时，焦点保持在其中。在列表中，当方向键移动高亮时，焦点保持在搜索字段中。

### 目标尺寸

字段高度至少为 56px，并填满它获得的宽度。清除按钮为 32px × 32px。

### 屏幕阅读器

- 字段会被播报为一个按钮，由其标签和其中的实体命名。
- 列表会被播报为一个包含选项列表的对话框，被选中的实体会被标记为已选择。
- 清除按钮会被播报为"Clear"，使用用户的语言。

### 在代码中

- 焦点被委托给字段中的一个原生 `<button>`。弹出框会捕获焦点。列表中高亮显示的行会用 `active` 属性标记。列表不设置 `aria-activedescendant`。
- 字段上方的标签是一个未与字段关联的 `<label>` 元素。字段是一个原生 `<button>`，它通过 `aria-labelledby` 将标签作为其可访问名称的一部分，连同字段中的文本一起。
- 列表在一个角色为 `dialog` 且 `aria-modal="true"` 的元素中打开，以标签命名。
- 列表的角色为 `listbox`，每个实体的角色为 `option`，被选中的实体带有 `aria-selected`。
- 清除按钮的可访问名称为"Clear"，会翻译成用户的语言。

## 相关内容

- [设备选择器](https://www.hasscn.top/contributors/design/components/device-picker/)：选择一个设备
- [区域选择器](https://www.hasscn.top/contributors/design/components/area-picker/)：选择一个区域
- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：实体选择器（selector），用于一个或多个实体
- [表单](https://www.hasscn.top/contributors/design/components/form/)：从 schema 渲染选择器
- [状态图标](https://www.hasscn.top/contributors/design/components/state-icon/)：每一行中的图标

## 在代码中

该元素是 `<ha-entity-picker>`。它从应用提供的上下文中读取状态、注册表和翻译，因此你不需要向它传递 `hass`。

```ts
html`
  <ha-entity-picker
    .label=${"Light"}
    .value=${this._entityId}
    .includeDomains=${["light"]}
    @value-changed=${this._entityChanged}
  ></ha-entity-picker>
`;
```

在 HTML 中，列表属性接受 JSON：

```html
<ha-entity-picker label="Light" include-domains='["light"]'></ha-entity-picker>
```

### 属性

- `label`：字段上方的标签。
- `value`：所选实体的实体 ID。
- `helper`：字段下方的帮助文本。
- `placeholder`：空字段中的文本。默认为**选择一个实体**。
- `search-label`：列表中搜索字段的占位符。
- `include-domains`：只显示这些域名的实体。
- `exclude-domains`：隐藏这些域名的实体。
- `include-device-classes`：只显示具有这些设备类别的实体。
- `include-unit-of-measurement`：只显示具有这些计量单位的实体。
- `include-entities`：只显示这些实体。
- `exclude-entities`：隐藏这些实体。
- `show-entity-id`：在列表中显示每个实体的实体 ID。
- `allow-custom-entity`：接受一个不在列表中的、手动输入的实体 ID。
- `add-button`：显示一个按钮而不是字段。
- `add-button-label`：该按钮的标签。默认为**添加实体**。
- `hide-clear-icon`：隐藏清除值的按钮。
- `required`：将字段标记为必填。
- `disabled`：禁用选择器。
- `autofocus`：在渲染时聚焦选择器。

### 特性

这些只能通过代码设置：

- `entityFilter`：一个函数，接收每个实体的状态对象，并返回 `true` 以显示它。用于属性无法表达的过滤条件，比如受支持的功能。
- `extraOptions`：实体上方的额外行。每行包含一个 `id`（被选中时的值，不必是实体 ID）、一个 `primary` 文本，以及可选的 `secondary` 文本、`icon`、`icon_path` 或用于显示其图标的 `entity_id`。设置 `hide_clear` 可在该选项被选中时隐藏清除按钮。
- `createDomains`：人们可以直接从列表中为其创建新实体的辅助元素域名。选择其中一个会打开创建该辅助元素的对话框，并在创建完成后选中新实体。创建辅助元素在本页的演示中不可用。

### 方法

- `open()`：打开列表。

### 事件

- `value-changed`：当人们选择或清除一个实体时触发。新的实体 ID 位于 `event.detail.value` 中，清除时为 `undefined`。
- `change`：在 `value-changed` 之后触发。

### 样式

- `--ha-generic-picker-width`：列表的宽度。默认为字段的宽度，且至少为 `250px`。
- `--ha-generic-picker-max-width`：列表的最大宽度。

在窄屏上，列表会以底部抽屉的形式打开，而不是在字段下方。

Source: [`src/components/entity/ha-entity-picker.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/entity/ha-entity-picker.ts)
