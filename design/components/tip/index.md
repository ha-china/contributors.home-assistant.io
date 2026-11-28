# 提示

> 提示（tip）是一条简短的、可选的提示信息，比如键盘快捷键或指向更多帮助的指引，居中显示在其所属内容的下方。

Source: https://www.hasscn.top/contributors/design/components/tip/

## 概述

提示是单行的帮助信息，用户可以放心地忽略它。它以一个灯泡图标和 **Tip!** 一词开头，后面是以较浅颜色显示的提示内容。你可以在 **Settings**（设置）页面底部、搜索对话框底部，以及创建新自动化的对话框中找到提示，其中一条提示会指引你在哪里可以找到更多蓝图。

它需要 Home Assistant 的翻译才能显示其前缀，因此这里没有实时演示。

## 何时使用

在以下情况使用提示：

- 能让操作更快捷的快捷方式，比如键盘快捷键
- 指向更多帮助或更多内容的指引，比如社区或蓝图交换平台

不要在以下情况使用提示：

- 完成任务所必须了解的信息。请将其放在正文中，或使用[警告框](https://www.hasscn.top/contributors/design/components/alert/)。
- 警告或错误信息。请使用[警告框](https://www.hasscn.top/contributors/design/components/alert/)。
- 针对某个字段的提示。请使用该字段的辅助文本。

## 结构

1. **图标**：一个灯泡
2. **前缀**：**Tip!** 一词，中等字重，经过翻译
3. **文本**：提示内容，使用次要文本颜色。其中可以包含链接或按钮。

整个提示居中显示。

## 变体

提示只有一种。变化的是内容：纯文本，或包含链接或按钮的文本。

在 **Settings** 页面上，前端每次会随机选择一条提示。在窄屏幕上，关于键盘快捷键的提示会被排除。

## 行为

提示本身不执行任何操作。其中的链接或按钮照常工作。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 对齐方式 | 居中 | None |
| 前缀字重 | 500 | `--ha-font-weight-medium` |
| 文本颜色 | 次要文本颜色 | `--secondary-text-color` |
| 前缀与文本之间的间距 | 2px | None |

图标使用默认图标大小 24px（`--mdc-icon-size`）。文本的大小跟随周围文本。

## 指南

- 将其放在内容的末尾，不碍事的位置。前端也是这样放置提示的：**Settings** 页面上卡片下方、搜索对话框的页脚，以及蓝图列表下方。

## 无障碍

### 键盘

提示本身没有键盘行为。其中的链接或按钮会像其他地方一样进入 Tab 键顺序。

### 屏幕阅读器

屏幕阅读器会将前缀和文本作为普通文本朗读。图标仅起装饰作用。

### 在代码中

提示没有角色（role）。图标是一个 `ha-svg-icon`。撰写文本时，应确保它在 "Tip!" 之后读起来通顺。

## 相关内容

- [警告框](https://www.hasscn.top/contributors/design/components/alert/)：用于用户必须了解的信息
- [工具提示](https://www.hasscn.top/contributors/design/components/tooltip/)：悬停或聚焦时显示的简短提示
- [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)：如何撰写提示内容

## 在代码中

该元素是 `<ha-tip>`。将提示内容放入其默认插槽（slot）：

```html
<ha-tip>
  <a href="..." target="_blank" rel="noreferrer">Discover more blueprints</a>
</ha-tip>
```

前缀来自翻译键 `ui.panel.config.tips.tip`。

### 插槽

- 默认：提示的文本。

Source: [`src/components/ha-tip.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-tip.ts)
