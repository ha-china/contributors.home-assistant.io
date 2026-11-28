# 设备选择器

> 设备选择器让人们可以从家中的所有设备中搜索并选择一个设备。

Source: https://www.hasscn.top/contributors/design/components/device-picker/

Live demo of `ha-device-picker`, connected to a demo Home Assistant.

```html
<ha-device-picker label="Device" value="thermostat"></ha-device-picker>
<ha-device-picker label="Device"></ha-device-picker>
```

## 概述

设备选择器是一个用于选择一个[设备](https://www.hasscn.top/contributors/glossary/device/)的字段：可以是物理设备，也可以是 Home Assistant 以设备形式展示的服务。可以理解为设备触发器或操作所作用的设备，或者卡片所展示的设备。点击该字段会打开一个可搜索的列表。每一行显示设备名称、其所在区域，以及其集成的标志和名称。

## 何时使用

在以下情况使用设备选择器：

- 只选择一个设备
- 关注设备本身而非其某个值或控件的字段

在以下情况不要使用设备选择器：

- 单个值或控件，例如温度或灯。请使用[实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)选择实体（entity）。大多数自动化和卡片作用于实体，而不是设备。
- 选择多个设备。请使用设备[选择器（selector）](https://www.hasscn.top/contributors/design/components/selector/)，它允许选择多个。
- 选择操作所作用的对象。请使用目标选择器：它接受设备，也接受实体、区域、楼层和标签。
- 表单中的字段。请在[表单](https://www.hasscn.top/contributors/design/components/form/)中使用设备选择器，表单会为你渲染该选择器。

## 结构

1. **字段**：显示值并打开列表的按钮
2. **标签**：位于字段内部，选择设备后显示在值上方
3. **值或占位符**：设备名称，为空时显示**选择设备**
4. **清除按钮**：移除值，当字段不是必填时显示
5. **箭头**：表示该字段会打开一个列表
6. **辅助文本**：字段下方的可选文本
7. **列表**：带有搜索字段和设备的弹出框。每一行包含集成标志、设备名称、其所在区域，以及位于行尾的集成名称。

## 变体

### 过滤

只提供对该字段有意义的设备。你可以根据设备拥有的实体进行过滤，例如只显示带有灯的设备：

Live demo of `ha-device-picker`, connected to a demo Home Assistant.

```html
<ha-device-picker label="Device" include-domains='["light"]'></ha-device-picker>
```

你还可以根据这些实体的设备类别进行过滤，排除某些域的实体，或排除某些设备。对于其他情况，例如按制造商或集成过滤，可以通过代码编写过滤器。

### 带辅助文本

标签说明了设备的用途。当这个选择需要解释时，在字段下方添加辅助文本。

Live demo of `ha-device-picker`, connected to a demo Home Assistant.

```html
<ha-device-picker label="Speaker" include-domains='["media_player"]' helper="Announcements play on this device."></ha-device-picker>
```

### 子设备

有些设备是另一个设备的一部分，例如多通道继电器的通道。列表会将这些子设备缩进显示在其父设备下方，并用一条线连接，使这种关系一目了然。搜索时顺序保持不变。这些演示中的家没有子设备。

## 行为

- **启用**：点击字段会打开列表，并将焦点移至其搜索字段。
- **悬停和按下**：字段显示涟漪效果。
- **聚焦**：字段底部的线条变为 2px 粗，并显示为主色。
- **搜索**：输入时会实时过滤列表。当没有匹配项时，列表会显示**未找到与**你的搜索词**匹配的设备**。当没有设备时，会显示**没有可用设备**。
- **未知**：当值是一个不存在的设备时，例如已被移除的设备，字段会变为低调的警告色，并显示**已选择未知设备**。
- **已替换**：有时一个集成会用多个新设备替换一个设备。当值指向这样一个被替换的设备时，字段会显示**已替换的设备**，并在其下方显示警告[提醒（alert）](https://www.hasscn.top/contributors/design/components/alert/)。如果只有一个替换设备，其**更新**按钮会切换到它。如果有多个，**选择**会打开一个对话框供选择一个。这依赖于 Home Assistant 提供的信息，本页的演示中没有这些信息。
- **禁用**：字段变暗至 50% 不透明度，无法打开。
- **窄屏**：当窗口宽度不超过 870px 或高度不超过 500px 时，列表会以底部抽屉的形式打开，而不是弹出框。

选择一个设备会关闭列表。新值会在列表关闭后上报。

Live demo of `ha-device-picker`, connected to a demo Home Assistant.

```html
<ha-device-picker label="Device" value="attic_lamp"></ha-device-picker>
<ha-device-picker label="Device" value="desk_plug" disabled></ha-device-picker>
```

## 规格

设备选择器使用前端的共享选择器字段和列表，即 `ha-picker-field` 和 `ha-generic-picker`。

### 字段

| 属性 | 值 | 令牌 |
| --- | --- | --- |
| 最小高度 | 56px | 无 |
| 起始内边距 | 16px | `--ha-space-4` |
| 结束内边距 | 8px | `--ha-space-2` |
| 各部分之间的间距 | 8px | `--ha-space-2` |
| 圆角 | 顶部 4px，底部为直角 | `--ha-border-radius-sm` |
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
| 辅助文本上方间距 | 8px | `--ha-space-2` |

### 列表

| 属性 | 值 | 令牌 |
| --- | --- | --- |
| 宽度 | 字段的宽度，至少 250px | `--ha-generic-picker-width` |
| 最大高度 | 窗口高度的 70% 与 500px 中的较小者。当窗口高度不超过 1000px 时，为 70% 与 400px 中的较小者 | 无 |
| 圆角 | 8px | `--ha-border-radius-md` |
| 阴影 | 中等阴影 | `--ha-box-shadow-m` |
| 子设备缩进 | 48px | `--ha-space-12` |
| 底部抽屉圆角 | 20px | `--ha-border-radius-2xl` |
| 底部抽屉最大宽度 | 600px | 无 |

## 指南

- 只提供对该字段有意义的设备。用于扬声器的字段不应列出恒温器。
- 当人们关注单个值或控件时，优先选择实体而不是设备。

Do and don't, as live demos. Both are connected to a demo Home Assistant.

**Do:** 过滤列表以显示合适的设备，并说明设备的用途。

```html
<ha-device-picker label="Speaker" include-domains='["media_player"]'></ha-device-picker>
```

**Don't:** 在一个通用标签下提供家中的所有设备。

```html
<ha-device-picker label="Device"></ha-device-picker>
```

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至字段，如有清除按钮则移至清除按钮。禁用的字段会被跳过。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 当字段获得焦点时，打开列表。 |
| 输入 | 搜索列表。列表打开时，焦点位于搜索字段中。 |
| <kbd>Arrow down</kbd> 和 <kbd>Arrow up</kbd> | 在设备之间移动。 |
| <kbd>Home</kbd> 和 <kbd>End</kbd> | 跳转到第一个或最后一个设备。 |
| <kbd>Page up</kbd> 和 <kbd>Page down</kbd> | 在列表中按页移动。 |
| <kbd>Enter</kbd> | 选择高亮显示的设备。搜索时，最顶部的匹配项会被高亮显示。当列表中只有一个选项时，<kbd>Enter</kbd> 会选择它。 |
| <kbd>Escape</kbd> | 关闭列表。 |

### 焦点

字段获得焦点时显示为更粗的底部线条，而不是焦点环。当列表以弹出框形式打开时，焦点保持在其中。在列表中，当方向键移动高亮时，焦点保持在搜索字段中。

### 目标尺寸

字段高度至少为 56px，并填满所获得的宽度。清除按钮为 32px × 32px。

### 屏幕阅读器

- 字段会被播报为一个按钮，由其标签和其中的设备命名。
- 列表会被播报为一个包含选项列表的对话框，被选中的设备会被播报为已选中。
- 清除按钮会被播报为"Clear"，使用用户的语言。

### 在代码中

- 焦点被委托给字段中的一个原生 `<button>`。弹出框会捕获焦点。列表中高亮显示的行会标记 `active` 属性。列表不设置 `aria-activedescendant`。
- 字段是一个原生 `<button>`。其可访问名称是标签与字段中的文本的组合。
- 列表在一个角色为 `dialog` 且 `aria-modal="true"` 的元素中打开，以标签命名。
- 列表具有 `listbox` 角色，每个设备具有 `option` 角色，被选中的设备带有 `aria-selected`。
- 每行中的集成标志具有空的 `alt`，因此会被屏幕阅读器跳过。集成名称以文本形式位于行中。
- 清除按钮的可访问名称为"Clear"，已翻译为用户的语言。

## 相关

- [实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)：选择一个实体
- [区域选择器](https://www.hasscn.top/contributors/design/components/area-picker/)：选择一个区域
- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：设备选择器，用于一个或多个设备
- [表单](https://www.hasscn.top/contributors/design/components/form/)：根据 schema 渲染选择器

## 在代码中

该元素是 `<ha-device-picker>`。与实体和区域选择器不同，它需要 `hass`。

```ts
html`
  <ha-device-picker
    .hass=${this.hass}
    .label=${"Device"}
    .value=${this._deviceId}
    .includeDomains=${["light"]}
    @value-changed=${this._deviceChanged}
  ></ha-device-picker>
`;
```

在 HTML 中，列表属性接受 JSON：

```html
<ha-device-picker label="Device" include-domains='["light"]'></ha-device-picker>
```

### 属性

- `label`：字段的标签。
- `value`：所选设备的 ID。
- `helper`：字段下方的帮助文本。
- `placeholder`：空字段中的文本。默认为**选择设备**。
- `search-label`：列表中搜索字段的占位符。
- `include-domains`：只显示拥有这些域实体的设备。
- `exclude-domains`：隐藏拥有这些域实体的设备。
- `include-device-classes`：只显示拥有这些设备类别实体的设备。
- `exclude-devices`：隐藏这些设备。
- `hide-clear-icon`：隐藏清除值的按钮。
- `required`：将字段标记为必填。
- `disabled`：禁用选择器。
- `autofocus`：渲染时聚焦选择器。

### 特性

这些只能通过代码设置：

- `hass`：Home Assistant 对象。必填。
- `deviceFilter`：一个函数，接收每个设备注册表条目，返回 `true` 表示显示它。
- `entityFilter`：一个函数，接收每个实体的状态对象，返回 `true` 表示保留它。只有拥有匹配实体的设备才会显示。
- `replacementDeviceIds`：当值是一个被替换的设备时，将其可替换为的设备限制为这些 ID。

### 方法

- `open()`：打开列表。

### 事件

- `value-changed`：当人们选择或清除设备时触发。新设备 ID 位于 `event.detail.value` 中。

来源：[`src/components/device/ha-device-picker.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/device/ha-device-picker.ts)
