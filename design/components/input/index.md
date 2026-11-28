# 文本输入框

> 文本输入框让人们输入单行文本，例如名称、数字或密码。

Source: https://www.hasscn.top/contributors/design/components/input/

Live demo of `ha-input`.

```html
<ha-input label="Name" value="Living room"></ha-input>
<ha-input label="Email" type="email" placeholder="you@example.com"></ha-input>
```

## 概述

文本输入框让人们在一行内输入一个简短的值：名称、地址、数字或密码。它的类型会告诉浏览器期望什么样的值，从而在手机上显示正确的键盘、为日期或时间提供正确的选择器，并免费获得基本的校验。

## 何时使用

在以下情况使用文本输入框：

- 人们需要输入的简短值，例如名称、电子邮件地址或端口
- 数字、日期、时间、网址或密码

不要在以下情况使用文本输入框：

- 可能跨越多行的文本，例如描述。请使用 [textarea](https://www.hasscn.top/contributors/design/components/textarea/)。
- 来自已知集合的值。让人们通过 [select box](https://www.hasscn.top/contributors/design/components/select-box/) 或 [picker](https://www.hasscn.top/contributors/design/components/entity-picker/) 来选择。
- 一个范围内的值，此时具体数字不如位置重要。请使用 [slider](https://www.hasscn.top/contributors/design/components/slider/)。

## 结构

1. **容器**：输入框，底部带一条线的填充样式，或描边样式
2. **标签**：为值命名。它位于输入框内部，当输入框获得焦点或有值时会上移。
3. **起始区**：值之前的可选内容，例如图标或前缀
4. **值**：人们输入内容的原生输入框
5. **清除按钮**：可选，当输入框有值时显示
6. **密码切换按钮**：可选，显示或隐藏密码
7. **结束区**：值之后的可选内容，例如单位
8. **提示**：输入框下方的可选帮助文本，当值无效时会被校验消息替换

## 变体

### 外观

有两种外观：

- **Material** 是默认样式：底部带一条线的填充输入框。在表单、对话框和设置中使用。
- **Outlined** 四周有边框，在没有标签时会变得紧凑。前端主要在工具栏、列表和表格中的搜索和筛选字段使用它，因为在这些地方填充式输入框会显得过于厚重。

Live demo of `ha-input`.

```html
<ha-input label="Material" value="Living room"></ha-input>
<ha-input appearance="outlined" label="Outlined" value="Living room"></ha-input>
<ha-input appearance="outlined" placeholder="Search devices"></ha-input>
```

### 类型

选择与值匹配的类型：数字用 number 字段，电子邮件地址用 email 字段，网址用 URL 字段，任何机密内容用 password 字段。为密码字段提供显示密码的按钮，让人们可以检查自己输入的内容。

Live demo of `ha-input`.

```html
<ha-input label="Volume" type="number" value="42"></ha-input>
<ha-input label="Website" type="url" placeholder="https://example.com"></ha-input>
<ha-input label="Password" type="password" value="correct horse" password-toggle></ha-input>
<ha-input label="Date" type="date"></ha-input>
```

### 提示

使用提示来提供帮助人们填写输入框的额外上下文，例如期望的格式或在哪里可以找到该值。保持为一句话。

Live demo of `ha-input`.

```html
<ha-input label="Port" type="number" value="8123" hint="The port Home Assistant listens on."></ha-input>
```

### 前缀和后缀

在值之前或之后放置简短的文本或图标。值之后的单位是最常见的用法：秒、百分比或千克。这让人们不必猜测数字的含义，同时使单位不包含在值本身中。

Live demo of `ha-input`.

```html
<ha-input label="Delay" type="number" value="30">
  <span slot="end">s</span>
</ha-input>
<ha-input label="Brightness" type="number" value="80">
  <span slot="end">%</span>
</ha-input>
```

### 清除按钮

当人们经常想要重新开始时（例如在搜索框中），添加清除按钮。只要输入框有值，它就会显示。

Live demo of `ha-input`.

```html
<ha-input label="Filter" value="kitchen" with-clear></ha-input>
```

## 行为

- **空**：标签位于输入框内部，大小与文本相同。
- **悬停**：material 输入框变为悬停背景色。outlined 输入框改变其边框颜色。
- **聚焦**：material 输入框底部的线变粗并变为主色调，标签变为主色调。outlined 输入框的边框变为主色调。
- **已填写**：一旦输入框有值或获得焦点，标签就会上移并变小。使用 placeholder、date 或 color 类型时，标签始终处于上移状态。
- **必填**：标签会带有一个 `*` 标记。输入框必须有值，表单才有效。
- **禁用**：material 输入框使用禁用背景色，输入框和标签的不透明度减半，值无法更改或聚焦。
- **只读**：显示一个人们可以阅读和复制但不能更改的值。
- **无效**：标签和底部的线变为危险色，校验消息取代提示。当代码将输入框标记为无效、表单检查发现值无效，或者（对于自校验的输入框）失去焦点时，输入框变为无效。一旦人们输入了有效的值，它就会立即恢复为有效。

Live demo of `ha-input`.

```html
<ha-input label="Name" required></ha-input>
<ha-input label="Disabled" value="Can't change this" disabled></ha-input>
<ha-input label="Read-only" value="Can't change this either" readonly></ha-input>
<ha-input label="Port" value="99999" invalid validation-message="Enter a port between 1 and 65535."></ha-input>
```

在输入框中按下 <kbd>Enter</kbd> 会提交其所在的表单。

## 规格

### 尺寸

| 属性 | Material | 带标签的 Outlined | 不带标签的 Outlined |
| --- | --- | --- | --- |
| 输入框高度 | 56px | 56px | 32px |
| 左右内边距 | 16px (`--ha-space-4`) | 16px (`--ha-space-4`) | 8px (`--ha-space-2`) |
| 圆角半径 | 顶部 4px (`--ha-border-radius-sm`)，底部 0 (`--ha-border-radius-square`) | 8px (`--ha-border-radius-md`) | 8px (`--ha-border-radius-md`) |
| 边框 | 底部 1px 线，聚焦时 2px | 四周 1px | 四周 1px |
| 组件下方间距 | 8px (`--ha-space-2`)，通过 `--ha-input-padding-bottom` | 无 | 无 |
| 清除和密码按钮 | 48px | 48px | 24px，带 18px 图标 |

### 字体

| 部分 | 尺寸 | Token |
| --- | --- | --- |
| 标签，位于输入框内 | 14px | `--ha-font-size-m` |
| 标签，上移后 | 10px | `--ha-font-size-xs` |
| 标签上方间距 | 20px，上移后 12px | `--ha-space-5`, `--ha-space-3` |
| 值上方间距 | 12px，无标签时为无 | `--ha-space-3` |
| 提示和校验消息 | 12px | `--ha-font-size-s` |
| 提示最小高度 | 20px | `--ha-space-5` |
| 提示缩进 | 12px | `--ha-space-3` |

标签的字重为 400（`--ha-font-weight-normal`），行高为 1.2（`--ha-line-height-condensed`）。颜色、边框和标签位置的变化耗时 150ms。

### 颜色

| 部分 | 状态 | Token |
| --- | --- | --- |
| Material 背景 | 静止 | `--ha-color-form-background` |
| Material 背景 | 悬停 | `--ha-color-form-background-hover` |
| Material 背景 | 禁用 | `--ha-color-form-background-disabled` |
| Outlined 背景 | 全部 | `--card-background-color` |
| Material 底部的线 | 静止 | `--ha-color-border-neutral-loud` |
| Material 底部的线 | 聚焦 | `--primary-color` |
| Material 底部的线 | 无效 | `--ha-color-border-danger-normal` |
| Outlined 边框 | 静止 | `--ha-color-border-neutral-quiet` |
| Outlined 边框 | 悬停 | `--ha-color-border-neutral-normal` |
| Outlined 边框 | 聚焦 | `--primary-color` |
| 标签 | 静止 | `--secondary-text-color` |
| 标签 | 聚焦，material | `--primary-color` |
| 标签 | 无效 | `--ha-color-fill-danger-loud-resting` |
| Placeholder | 全部 | `--ha-color-neutral-60` |
| 提示 | 全部 | `--ha-color-text-secondary` |
| 校验消息 | 无效 | `--ha-color-on-danger-quiet` |
| 结束区插槽 | 全部 | `--ha-color-text-secondary` |

## 指南

Do and don't, as live demos.

**Do:** 始终为输入框提供一个简短的标签。

```html
<ha-input label="Email" type="email" placeholder="you@example.com"></ha-input>
```

**Don't:** 将 placeholder 用作标签。一旦有人输入内容它就会消失。

```html
<ha-input type="email" placeholder="Email"></ha-input>
```

Do and don't, as live demos.

**Do:** 说明哪里出错了，以及如何修复。

```html
<ha-input label="Port" value="99999" invalid validation-message="Enter a port between 1 and 65535."></ha-input>
```

**Don't:** 只说值是错误的。

```html
<ha-input label="Port" value="99999" invalid validation-message="Invalid value."></ha-input>
```

Do and don't, as live demos.

**Do:** 将单位放在值之后。

```html
<ha-input label="Delay" type="number" value="30"><span slot="end">s</span></ha-input>
```

**Don't:** 让人们把单位输入到值中。

```html
<ha-input label="Delay" value="30 seconds"></ha-input>
```

Do and don't, as live demos.

**Do:** 标记必填的字段。

```html
<ha-input label="Name" required></ha-input>
```

**Don't:** 标记可选的字段。

```html
<ha-input label="Name (optional)"></ha-input>
```


## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移到输入框，然后（如果存在）移到清除按钮和密码切换按钮。禁用的输入框会被跳过。 |
| <kbd>Enter</kbd> | 提交输入框所在的表单。在清除按钮或密码切换按钮上，则选中该按钮。 |
| <kbd>Space</kbd> | 在清除按钮或密码切换按钮上，选中该按钮。 |

number、date 和 time 字段保留浏览器针对这些类型的键盘行为。

### 焦点

焦点显示为底部线（material）或边框（outlined）上的主色调，而不是单独的焦点环。

### 目标尺寸

material 输入框和带标签的 outlined 输入框高度为 56px。不带标签的 outlined 输入框高度为 32px，其按钮为 24px。

### 屏幕阅读器

屏幕阅读器会连同标签一起播报输入框，并将提示作为其描述朗读。当输入框变为无效时，会播报校验消息。必填、禁用和只读状态也会被播报。清除按钮会被播报为“Clear”，密码按钮会被播报为“Show password”或“Hide password”，使用用户的语言。没有标签的输入框只有 placeholder 来描述它，因此请始终为其提供标签。

### 在代码中

- 焦点被委托给组件内部的原生输入框。
- 标签是一个连接到输入框的原生 `<label>`，因此它是可访问名称。
- 没有标签时，`<label>` 为空并对辅助技术隐藏。此时 placeholder 是描述输入框的唯一文本。
- 提示和校验消息通过 `aria-describedby` 连接到输入框，因此屏幕阅读器会将它们作为描述朗读。
- 校验消息位于一个 live region 中，并在输入框无效时获得 `alert` 角色，因此屏幕阅读器会在它出现时播报。
- 必填、禁用和只读设置在原生输入框上，因此辅助技术会按原样获取它们。
- 清除按钮和密码切换按钮使用翻译后的标签作为其可访问名称。

## 相关内容

- [Textarea](https://www.hasscn.top/contributors/design/components/textarea/)：跨多行的文本
- [Form](https://www.hasscn.top/contributors/design/components/form/)：根据 schema 构建输入框
- [Selector](https://www.hasscn.top/contributors/design/components/selector/)：文本和数字选择器会显示此输入框
- [UI text](https://www.hasscn.top/contributors/design/ui-text/)：如何编写标签、提示和错误信息

前端有几个基于此输入框构建的输入框，用于特定任务。请使用它们，而不是重新构建相同的功能：

- `<ha-input-search>`：一个搜索框，带放大镜图标、清除按钮和本地化的 placeholder。
- `<ha-input-copy>`：一个只读值，带复制按钮，并可选地对机密内容（如 token）进行遮蔽。
- `<ha-input-multi>`：一组文本输入框，用于输入多个值，例如一组 URL。

## 代码中

该元素是 `<ha-input>`。它基于 [Web Awesome input](https://webawesome.com/docs/components/input/)。

```html
<ha-input label="Name" value="Living room"></ha-input>
<ha-input label="Email" type="email" placeholder="you@example.com"></ha-input>
<ha-input label="Password" type="password" password-toggle></ha-input>
<ha-input label="Delay" type="number" min="0" step="1">
  <span slot="end">s</span>
</ha-input>
```

### 属性

- `label`：标签。
- `value`：当前值，字符串形式。
- `type`：`text`（默认）、`number`、`password`、`email`、`url`、`tel`、`search`、`date`、`datetime-local`、`time` 或 `color`。
- `appearance`：`material`（默认）或 `outlined`。
- `hint`：输入框下方的帮助文本。
- `placeholder`：输入框为空时显示的文本。
- `required`：将字段设为必填，并在标签后添加标记。
- `disabled`：禁用输入框。
- `readonly`：将输入框设为只读。
- `invalid`：将输入框标记为无效。
- `validation-message`：输入框无效时显示的消息。未设置时，显示浏览器自带的消息。
- `auto-validate`：在输入框失去焦点时进行校验，而不是等待表单提交。
- `pattern`：值必须匹配的正则表达式。
- `minlength` 和 `maxlength`：值的最小和最大长度。
- `min`、`max` 和 `step`：number、date 和 time 输入框的限制和步进粒度。
- `with-clear`：当输入框有值时显示清除按钮。
- `password-toggle`：显示一个用于显示或隐藏密码的按钮。
- `password-visible`：以纯文本形式显示密码。
- `without-spin-buttons`：隐藏浏览器在 number 输入框上的上下按钮。
- `inset-label`：将标签保留在输入框内部，即使 `start` 插槽中有内容。
- `input-id`：组件内部原生输入框的 `id`，用于将其与外部的元素关联。
- `name`、`autocomplete`、`autocapitalize`、`autocorrect`、`autofocus`、`spellcheck`、`inputmode` 和 `enterkeyhint`：传递给原生输入框，工作方式与普通 `<input>` 相同。

### 插槽

- `start`：值之前的内容，例如图标或前缀。
- `end`：值之后的内容，例如单位。
- `label`：带标记的标签。此插槽中的内容会替换 `label` 属性的文本，包括必填标记。
- `hint`：带标记的提示，例如链接。仅在未设置 `hint` 属性时使用。
- `clear-button`：替换清除按钮。
- `password-toggle-button`：替换显示密码的按钮。

### 事件

- `input`：在人们输入时，值的每次变化都会触发。
- `change`：在值被提交时触发，例如输入框失去焦点时。

从元素的 `value` 读取新值。

### 样式

- `--ha-input-padding-top`：输入框上方的间距。
- `--ha-input-padding-bottom`：输入框下方的间距。material 外观默认为 `var(--ha-space-2)`。
- `--ha-input-text-align`：值的对齐方式。默认为 `start`。
- `--ha-input-required-marker`：必填字段标签后的标记。默认为 `"*"`。

Source: [`src/components/input/ha-input.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/input/ha-input.ts)
