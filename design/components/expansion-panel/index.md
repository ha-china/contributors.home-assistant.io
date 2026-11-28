# 展开面板（Expansion panel）

> 展开面板将一个区域隐藏在标题之后，人们可以在需要时将其展开。

Source: https://www.hasscn.top/contributors/design/components/expansion-panel/

Live demo of `ha-expansion-panel`.

```html
<ha-expansion-panel outlined header="高级设置" secondary="只有知道其作用时才修改这些选项">
  <p>轮询间隔、超时时间以及其他大多数人无需改动选项。</p>
</ha-expansion-panel>
```

## 概述

展开面板（expansion panel）将一个区域隐藏在标题之后，人们可以在需要时将其展开。它能让屏幕保持简洁清爽：大多数人需要的内容直接显示在屏幕上，其余内容则收纳在面板中。

## 何时使用

在以下情况使用展开面板：

- 表单中的高级选项
- 对话框中的可选字段
- 一组筛选器

不要在以下情况使用展开面板：

- 完成任务所必需的内容。如果用户每次都必须展开面板，那么这些内容就不应该放在面板中。
- 一组会打开其他内容的行。请使用[列表](https://www.hasscn.top/contributors/design/components/list/)。

## 结构

1. **容器**：使用 `outlined` 时，整个面板周围有边框和圆角
2. **标题**：用户点击以展开或收起面板的行
3. **前导图标**：可选，标题开头的图标
4. **标题文本**：标题的文字
5. **辅助文本**：可选，标题下方的一行简短文字
6. **箭头图标**：收起时朝下，展开时朝上。位于标题末尾，或使用 `left-chevron` 时位于开头。
7. **标题图标**：可选，位于标题末尾的操作
8. **内容**：展开和收起的区域

## 变体

### 标题

标题应说明面板内的内容。保持简短：**高级设置**、**区域**、**网络**。标题下方的一行辅助文本可以提供简短摘要，例如当前值或用户为何要展开它。

Live demo of `ha-expansion-panel`.

```html
<ha-expansion-panel outlined header="网络">
  <p>IP 地址、DNS 和代理设置。</p>
</ha-expansion-panel>
<ha-expansion-panel outlined header="网络" secondary="正在使用 DHCP">
  <p>IP 地址、DNS 和代理设置。</p>
</ha-expansion-panel>
```

### 描边

描边面板带有边框和圆角。当面板位于表单或对话框中、与其他字段并排时，前端会使用描边样式，使其看起来像一个整体。[表单](https://www.hasscn.top/contributors/design/components/form/)的可展开部分和卡片编辑器就是这样做的。不使用描边时，面板会融入周围环境，这适用于面板列表，例如筛选窗格和卡片选择器。

Live demo of `ha-expansion-panel`.

```html
<ha-expansion-panel header="无描边">
  <p>面板的内容。</p>
</ha-expansion-panel>
<ha-expansion-panel outlined header="有描边">
  <p>面板的内容。</p>
</ha-expansion-panel>
```

### 箭头图标在左侧

默认情况下，箭头图标位于标题末尾。它也可以移到开头。配置页面上的筛选窗格就使用了这种方式，标题中显示活动筛选器的数量以及一个清除按钮。

Live demo of `ha-expansion-panel`.

```html
<ha-expansion-panel left-chevron header="区域">
  <p>按区域筛选。</p>
</ha-expansion-panel>
```

### 默认展开

面板可以从一开始就是展开状态。

Live demo of `ha-expansion-panel`.

```html
<ha-expansion-panel outlined expanded header="要备份的数据">
  <p>设置和历史记录、媒体以及共享文件夹。</p>
</ha-expansion-panel>
```

### 始终展开

没有箭头图标时，用户就无法再展开或收起面板。从一开始就展开的面板，是一个看起来像面板但始终保持展开的区域。

## 行为

- **收起**：只显示标题。内容完全不渲染。
- **展开和收起**：点击标题可展开或收起面板。内容在 300 毫秒内滑开或滑合，箭头图标在 150 毫秒内旋转。
- **焦点**：当标题获得焦点时，其背景变为输入填充色。使用键盘获得焦点时，箭头图标还会获得圆形中性填充。
- **始终展开**：标题无法被选中或聚焦。

## 规格参数

| 属性 | 值 | Token |
| --- | --- | --- |
| 标题最小高度 | 48px | 无 |
| 标题内边距 | 上下为 0，左右为 8px | `--expansion-panel-summary-padding` |
| 内容内边距 | 上下为 0，左右为 8px | `--expansion-panel-content-padding` |
| 标题字重 | 500 | `--ha-font-weight-medium` |
| 标题颜色 | 主要文本颜色 | `--primary-text-color` |
| 辅助文本大小 | 12px | `--ha-font-size-s` |
| 辅助文本颜色 | 次要文本颜色 | `--secondary-text-color` |
| 箭头图标或前导图标与标题之间的间距 | 8px | 无 |
| 箭头图标大小 | 24px | 无 |
| 边框，描边 | 1px solid | `--outline-color` |
| 圆角半径，描边 | 12px | `--ha-border-radius-lg`，通过 `--ha-card-border-radius` |
| 标题聚焦时的背景 | 输入填充 | `--input-fill-color` |
| 键盘聚焦时箭头图标的背景 | 圆形中性填充 | `--ha-color-fill-neutral-normal-active` |
| 展开和收起动画 | 300ms，`cubic-bezier(0.4, 0, 0.2, 1)` | 无 |
| 箭头图标旋转 | 180 度，150ms，`cubic-bezier(0.4, 0, 0.2, 1)` | 无 |

## 指南

- 遵循前端的做法：在表单或对话框中、与其他字段并排时使用描边面板；在面板列表（如筛选窗格）中则不使用描边。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至标题。始终展开的面板会被跳过。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 展开或收起面板。 |

### 焦点

当标题获得焦点时，其背景变为输入填充色。使用键盘获得焦点时，箭头图标还会获得圆形中性填充。

### 目标尺寸

标题高度至少为 48px，宽度与面板相同。

### 屏幕阅读器

标题会被播报为一个已展开或已收起的按钮。展开的内容会被播报为一个区域（region），以标题命名。

### 代码中

- 标题具有 `button` 角色，`aria-expanded` 设置为 `true` 或 `false`。
- 内容具有 `region` 角色，并通过 `aria-labelledby` 由标题命名。
- 面板收起时，内容具有 `aria-hidden="true"`，且不渲染。
- 箭头图标是装饰性的，对屏幕阅读器隐藏。

## 相关内容

- [列表](https://www.hasscn.top/contributors/design/components/list/)：会打开其他内容的行
- [表单](https://www.hasscn.top/contributors/design/components/form/)：`expandable` 模式类型会显示展开面板
- [对话框](https://www.hasscn.top/contributors/design/components/dialog/)：面板在其中承载可选字段

## 代码实现

该元素为 `<ha-expansion-panel>`。内容放在默认插槽中。

```html
<ha-expansion-panel outlined header="Advanced settings" secondary="Optional">
  <p>...</p>
</ha-expansion-panel>
```

内容只在面板展开时渲染。如果其中的内容需要在展开之前就存在，请记住这一点。

### 属性

- `header`：标题文本。
- `secondary`：标题下方的一行简短文字。
- `expanded`：展开面板。会被反射（reflected），并在用户展开或收起面板时更新。
- `outlined`：添加边框和圆角。
- `left-chevron`：将箭头图标放在标题开头。
- `no-collapse`：移除箭头图标，用户无法再展开或收起面板。与 `expanded` 结合使用，可创建一个看起来像面板但始终保持展开的区域。

### 插槽

- 默认：内容。
- `header`：用你自己的内容替换标题文本和辅助文本。
- `secondary`：替换辅助文本。
- `leading-icon`：标题开头的图标。
- `icons`：标题末尾的操作，例如图标按钮。
- `event`：标题和箭头图标之间的内容。

### 事件

- `expanded-will-change`：在面板展开或收起之前触发。`detail` 包含新的 `expanded` 值。
- `expanded-changed`：在面板展开或收起之后触发。`detail` 包含新的 `expanded` 值。

### 样式

- `--expansion-panel-summary-padding`：标题的内边距。默认为 `0 8px`。
- `--expansion-panel-content-padding`：内容的内边距。默认为 `0 8px`。
- `--ha-card-border-radius`：描边面板的圆角半径。默认为 `var(--ha-border-radius-lg)`。

`summary` 部分指向标题，用于自定义属性无法覆盖的样式。

源码：[`src/components/ha-expansion-panel.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-expansion-panel.ts)
