# 加载指示器（Spinner）

> 加载指示器（Spinner）用于显示某项内容正在加载或进行中，适用于你不知道需要多长时间的情况。

Source: https://www.hasscn.top/contributors/design/components/spinner/

Live demo of `ha-spinner`.

```html
<ha-spinner></ha-spinner>
```

## 概述

加载指示器（Spinner）用于显示某项内容正在加载或进行中，适用于你不知道需要多长时间的情况：加载数据、连接设备、执行操作。请将它显示在结果将要出现的位置，这样人们就知道自己在等待什么。

## 何时使用

在以下情况使用加载指示器：

- 等待某个没有已知时长的事物
- 整个页面、面板或卡片正在加载

在以下情况不要使用加载指示器：

- 由按钮触发的操作。请使用[按钮](https://www.hasscn.top/contributors/design/components/button/)的 `loading` 状态，或[进度按钮](https://www.hasscn.top/contributors/design/components/progress-button/)。这样反馈会保留在人们所选的对象上。
- 相对于已知最大值的量级。请使用[进度条](https://www.hasscn.top/contributors/design/components/bar/)。
- 加载失败。请将加载指示器替换为说明出错原因的[警告](https://www.hasscn.top/contributors/design/components/alert/)。

## 结构

1. **轨道（Track）**：指示器背后的完整圆环
2. **指示器（Indicator）**：沿轨道增长、缩短并旋转的弧线

## 变体

### 尺寸

共有四种尺寸。请选择适合其等待填充的空间的尺寸：

- **极小（Tiny）**：16px
- **小（Small）**：28px
- **中（Medium）**：48px，默认尺寸
- **大（Large）**：68px

Live demo of `ha-spinner`.

```html
<ha-spinner size="tiny"></ha-spinner>
<ha-spinner size="small"></ha-spinner>
<ha-spinner size="medium"></ha-spinner>
<ha-spinner size="large"></ha-spinner>
```

## 行为

加载指示器只有一种状态：它会持续旋转，直到你将其移除。它没有悬停、聚焦或按下状态。整个加载指示器每 3.5 秒旋转一圈，而弧线每 1.5 秒增长和缩短一次。其样式没有针对减少动态效果的单独规则，因此当有人要求减少动态效果时，动画仍以相同方式运行。

## 规格参数

| 尺寸 | 直径 | Token |
| --- | --- | --- |
| 极小 | 16px | `--ha-spinner-size` |
| 小 | 28px | `--ha-spinner-size` |
| 中（默认） | 48px | `--ha-spinner-size` |
| 大 | 68px | `--ha-spinner-size` |

| 属性 | 值 | Token |
| --- | --- | --- |
| 轨道和指示器宽度 | 4px | 无 |
| 指示器颜色 | 主颜色 | `--primary-color`，通过 `--ha-spinner-indicator-color` |
| 轨道颜色 | 分隔线颜色 | `--divider-color`，通过 `--ha-spinner-divider-color` |
| 指示器端点 | 圆形 | 无 |
| 旋转 | 每圈 3.5 秒，线性 | 无 |
| 弧线动画 | 1.5 秒，ease-in-out | 无 |

## 指南

Do and don't, as live demos.

**Do:** 在触发加载的按钮上显示加载状态。

```html
<ha-button loading>Save</ha-button>
```

**Don't:** 在按钮旁边放置一个单独的加载指示器。

```html
<ha-button>Save</ha-button>
<ha-spinner size="small"></ha-spinner>
```

- 不要让加载指示器永远运行下去。如果加载失败，请将其替换为警告。

## 无障碍

### 键盘

加载指示器不可聚焦，也没有键盘交互。

### 屏幕阅读器

加载指示器会被播报为一个名为“Loading”的进度条，不带值，因为没有已知的进度。

### 在代码中

加载指示器具有 `progressbar` 角色，其可访问名称“Loading”来自 Web Awesome 的本地化，并且没有值。

## 相关内容

- [按钮](https://www.hasscn.top/contributors/design/components/button/)：用于操作的 `loading` 状态
- [进度按钮](https://www.hasscn.top/contributors/design/components/progress-button/)：显示其操作结果的按钮
- [进度条](https://www.hasscn.top/contributors/design/components/bar/)：相对于已知最大值的量级
- [警告](https://www.hasscn.top/contributors/design/components/alert/)：加载失败时使用

## 代码实现

该元素为 `<ha-spinner>`。它基于 [Web Awesome spinner](https://webawesome.com/docs/components/spinner/)。

```html
<ha-spinner></ha-spinner>
<ha-spinner size="small"></ha-spinner>
```

### 属性

- `size`：`tiny`、`small`、`medium` 或 `large`。不设置时，加载指示器为 48 像素，与 `medium` 相同。

### 样式

- `--ha-spinner-size`：尺寸，用于预设尺寸都不合适的情况。`size` 属性会自动为你设置此项。
- `--ha-spinner-indicator-color`：移动的部分。默认为 `var(--primary-color)`。
- `--ha-spinner-divider-color`：其背后的轨道。默认为 `var(--divider-color)`。

Source: [`src/components/ha-spinner.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-spinner.ts)
