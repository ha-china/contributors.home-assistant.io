# 区域选择器

> 区域选择器让用户选择家中的一个区域（area），或当场创建一个新区域。

Source: https://www.hasscn.top/contributors/design/components/area-picker/

Live demo of `ha-area-picker`, connected to a demo Home Assistant.

```html
<ha-area-picker value="living_room" no-add></ha-area-picker>
<ha-area-picker no-add></ha-area-picker>
```

## 概述

区域选择器是用于选择一个[区域](https://www.hasscn.top/contributors/glossary/area/)的字段：设备所在的房间、卡片显示的区域、辅助元素（helper）所属的区域。选择该字段会打开一个可搜索的区域列表。每个区域显示其图标以及所在的楼层。

## 何时使用

在以下情况使用区域选择器：

- 只选择一个区域
- 将某项内容分配给一个区域，而用户所需的区域可能尚不存在

在以下情况不要使用区域选择器：

- 选择多个区域。请使用区域[选择器（selector）](https://www.hasscn.top/contributors/design/components/selector/)，它允许选择多个。
- 选择操作所作用的对象。请使用目标选择器：它接受区域，但也接受实体（entity）、设备（device）、楼层和标签。
- 表单中的字段。请在[表单](https://www.hasscn.top/contributors/design/components/form/)中使用区域选择器，表单会为你渲染该选择器。

## 结构

1. **字段**：显示值并打开列表的按钮
2. **标签**：位于字段内，默认为 **Area**
3. **值**：区域的图标和名称，其楼层显示在下方
4. **清除按钮**：移除值，当字段不是必填时显示
5. **箭头**：表示该字段会打开一个列表
6. **辅助文本**：字段下方的可选文本
7. **列表**：带有搜索字段和区域的弹出框，末尾有添加新区域的选项

## 变体

### 标签

标签默认为 **Area**。当字段需要更多上下文时，可以设置自己的标签，例如 **Area of the device**。

标签显示在字段内。一旦用户选择了一个位于某楼层的区域，字段会用楼层替代标签，因此显示为区域名称，楼层在其下方。没有楼层的区域（如 **Garden**）则保留标签。

Live demo of `ha-area-picker`, connected to a demo Home Assistant.

```html
<ha-area-picker label="Area of the device" value="bedroom" no-add></ha-area-picker>
<ha-area-picker label="Area of the device" value="garden" no-add></ha-area-picker>
```

### 添加区域

在列表末尾，选择器提供添加新区域的选项。当用户搜索一个不存在的区域时，该选项会将搜索内容作为名称：**Add new area 'Attic'**。选择它会打开创建区域的对话框，并在创建完成后选中新区域。在本页的演示中，该对话框不会打开。

Live demo of `ha-area-picker`, connected to a demo Home Assistant. 搜索一个不存在的区域，例如 Attic，即可看到该建议。

```html
<ha-area-picker></ha-area-picker>
```

该选项可以关闭。

### 过滤

你可以将列表限制为包含某些实体的区域，例如只显示有灯的区域：

Live demo of `ha-area-picker`, connected to a demo Home Assistant.

```html
<ha-area-picker include-domains='["light"]' no-add></ha-area-picker>
```

过滤器会查看区域中的实体，以及其中设备所包含的实体。你还可以按这些实体的设备类（device class）过滤，排除某些域（domain）的实体，或排除某些区域。

### 添加按钮

选择器可以显示一个按钮而不是空字段。一旦用户选择了一个区域，选择器就会像普通选择器一样显示它。这适合列表场景，用户在其中逐个添加区域。

Live demo of `ha-area-picker`, connected to a demo Home Assistant.

```html
<ha-area-picker add-button-label="Add area" no-add></ha-area-picker>
```

## 行为

- **启用**：选择字段会打开列表，并将焦点移至其搜索字段。
- **悬停和按下**：字段显示涟漪效果。
- **聚焦**：字段底部的线条变为 2px 粗，并使用主色。
- **搜索**：输入时会随输入过滤列表。当没有匹配项时，列表会显示 **No areas found for** 你的搜索词。当家中没有区域时，会显示 **No areas available**。
- **未知**：当值是一个不存在的区域时，字段变为浅警告色并显示 **Unknown area selected**。
- **禁用**：字段变暗至 50% 不透明度，且无法打开。
- **窄屏**：当窗口宽度不超过 870px 或高度不超过 500px 时，列表会以底部抽屉（bottom sheet）而非弹出框的形式打开。

选择一个区域会关闭列表。新值会在列表关闭后上报。

Live demo of `ha-area-picker`, connected to a demo Home Assistant.

```html
<ha-area-picker value="attic" no-add></ha-area-picker>
<ha-area-picker value="kitchen" disabled></ha-area-picker>
```

## 规格

区域选择器使用前端的共享选择器字段和列表，即 `ha-picker-field` 和 `ha-generic-picker`。

### 字段

| 属性 | 值 | 令牌 |
| --- | --- | --- |
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
| 未知背景 | 浅警告填充 | `--ha-color-fill-warning-quiet-resting` |
| 未知文本 | 警告文本 | `--ha-color-on-warning-normal` |
| 禁用 | 禁用表单背景上 50% 不透明度 | `--ha-color-form-background-disabled` |
| 辅助文本上方的间距 | 8px | `--ha-space-2` |

### 列表

| 属性 | 值 | 令牌 |
| --- | --- | --- |
| 宽度 | 字段的宽度，至少 250px | `--ha-generic-picker-width` |
| 最大高度 | 窗口高度的 70% 与 500px 中的较小值。当窗口高度不超过 1000px 时，为 70% 与 400px 中的较小值 | None |
| 圆角半径 | 8px | `--ha-border-radius-md` |
| 阴影 | 中等阴影 | `--ha-box-shadow-m` |
| 底部抽屉圆角半径 | 20px | `--ha-border-radius-2xl` |
| 底部抽屉最大宽度 | 600px | None |

## 指南

- 在有帮助的地方保留添加区域的选项：当用户将某项内容分配给一个区域时，他们所需的区域可能尚不存在。
- 在创建区域没有意义的地方关闭添加区域的选项，例如在过滤器中，或从已有内容的区域中选择时。
- 当仅用 **Area** 无法说明区域的用途时，请设置自己的标签。

Do and don't, as live demos. Both are connected to a demo Home Assistant.

**Do:** 当字段需要上下文时，说明区域的用途。

```html
<ha-area-picker label="Area of the device" no-add></ha-area-picker>
```

**Don't:** 保留通用标签，让人无法看出选择区域的目的。

```html
<ha-area-picker no-add></ha-area-picker>
```

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至字段，以及清除按钮（如果存在）。禁用的字段会被跳过。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 当字段获得焦点时，打开列表。 |
| 输入 | 搜索列表。列表打开时，焦点位于搜索字段中。 |
| <kbd>Arrow down</kbd> 和 <kbd>Arrow up</kbd> | 在区域之间移动。 |
| <kbd>Home</kbd> 和 <kbd>End</kbd> | 跳转到第一个或最后一个区域。 |
| <kbd>Page up</kbd> 和 <kbd>Page down</kbd> | 在列表中按页移动。 |
| <kbd>Enter</kbd> | 选择高亮的区域。搜索时，最顶部的匹配项会被高亮。当列表中只有一个选项时，<kbd>Enter</kbd> 会选择它。 |
| <kbd>Escape</kbd> | 关闭列表。 |

### 焦点

字段获得焦点时显示为更粗的底部线条，而不是焦点环。当列表以弹出框形式打开时，焦点保持在其中。在列表中，焦点保持在搜索字段中，同时方向键移动高亮。

### 目标尺寸

字段高度至少为 56px，并填满所获得的宽度。清除按钮为 32px × 32px。

### 屏幕阅读器

- 字段以按钮的形式播报，其名称由标签和其中的区域组成。当所选区域位于某楼层时，名称为区域和楼层名称。
- 列表以包含选项列表的对话框形式播报，所选区域被标记为已选中。
- 清除按钮以用户所用语言的 "Clear" 播报。

### 代码层面

- 焦点被委托给字段中的一个原生 `<button>`。其可访问名称是标签与字段中文本的组合。当所选区域位于某楼层时，标签会被省略。
- 列表在一个角色为 `dialog` 且 `aria-modal="true"` 的元素中打开，以标签命名。弹出框会捕获焦点。
- 列表的角色为 `listbox`，每个区域的角色为 `option`，所选区域带有 `aria-selected`。
- 高亮的行用 `active` 属性标记。列表不设置 `aria-activedescendant`。
- 清除按钮以翻译后的标签 `ui.common.clear` 作为其可访问名称。

## 相关内容

- [设备选择器](https://www.hasscn.top/contributors/design/components/device-picker/)：选择一个设备
- [实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)：选择一个实体
- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：区域选择器（selector），用于选择一个或多个区域
- [表单](https://www.hasscn.top/contributors/design/components/form/)：根据 schema 渲染选择器

## 代码中

该元素为 `<ha-area-picker>`。它从应用提供的上下文中读取区域、楼层、设备、实体和状态，因此你无需向它传递 `hass`。

```ts
html`
  <ha-area-picker
    .value=${this._areaId}
    .includeDomains=${["light"]}
    @value-changed=${this._areaChanged}
  ></ha-area-picker>
`;
```

在 HTML 中，列表属性接受 JSON：

```html
<ha-area-picker include-domains='["light"]' no-add></ha-area-picker>
```

### 属性（Attributes）

- `label`：标签。默认为 **Area**。
- `value`：所选区域的 ID。
- `helper`：字段下方的帮助文本。
- `placeholder`：空字段中的文本。
- `no-add`：隐藏添加新区域的选项。
- `include-domains`：只显示包含这些域的实体的区域。
- `exclude-domains`：隐藏包含这些域的实体的区域。
- `include-device-classes`：只显示包含这些设备类的实体的区域。
- `exclude-areas`：隐藏这些区域。
- `add-button-label`：显示一个带有此标签的按钮，而不是空字段。
- `required`：将字段标记为必填。
- `disabled`：禁用选择器。

### 特性（Properties）

这些只能通过代码设置：

- `deviceFilter`：一个函数，接收每个设备注册表条目，返回 `true` 表示保留。只显示包含匹配设备的区域。
- `entityFilter`：一个函数，接收每个实体的状态对象，返回 `true` 表示保留。只显示包含匹配实体的区域。

### 方法

- `open()`：打开列表。

### 事件

- `value-changed`：当用户选择或清除一个区域时触发。新区域 ID 位于 `event.detail.value` 中，清除时为 `undefined`。
- `change`：在 `value-changed` 之后触发。

源码：[`src/components/ha-area-picker.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-area-picker.ts)
