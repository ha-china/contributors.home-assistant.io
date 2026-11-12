---
title: 主题与设计令牌
description: 前端中每种颜色、尺寸和间距背后的 CSS 变量，以及用户主题如何改变它们。
order: 5
---

前端中的每种颜色、间距、圆角和字体都来自 CSS 自定义属性（CSS custom property）。这正是主题得以实现的原因：主题改变这些变量，整个界面随之改变。这也是组件从不硬编码颜色的原因。

## 设计令牌

基础变量是[设计令牌](/glossary/design-token/)，全部以 `--ha-` 开头。它们定义在 `src/resources/theme/` 中：

| 文件 | 令牌 |
| --- | --- |
| `core.globals.ts` | 间距（`--ha-space-1` 到 `--ha-space-20`，以 4 像素为步长）、圆角（`--ha-border-radius-*`）、边框宽度和动画时长（`--ha-animation-duration-*`） |
| `typography.globals.ts` | 字体族、字号、字重和行高（`--ha-font-*`） |
| `color/core.globals.ts` | 调色板，如 `--ha-color-primary-40` |
| `color/semantic.globals.ts` | 按用途划分的颜色，如 `--ha-color-text-primary`、`--ha-color-fill-danger-loud-resting` 或 `--ha-color-border-neutral-quiet` |

在组件中请使用语义颜色令牌，而不是调色板。语义令牌说明了颜色的用途，因此它可以随主题和深色模式变化，而你的组件无需感知。

设计（Design）区域的[基础（Foundations）](/design/foundations/)部分展示了每个令牌及其在浅色和深色主题中的值：[颜色](/design/foundations/color/)、[排版](/design/foundations/typography/)和[间距](/design/foundations/spacing/)。

## 主题变量

没有 `--ha-` 前缀的旧变量，如 `--primary-color`、`--primary-text-color` 和 `--card-background-color`，仍然随处可见。它们定义在 `src/resources/theme/color/color.globals.ts` 中，大多基于令牌之上，并且是大多数用户主题所设置的。当你更改使用这些变量的组件时，请保持它们正常工作。市场（Marketplace）区域中的[主题变量](/marketplace/reference/theme-variables/)为主题作者列出了这些变量，以及面向主题的组件变量。

Web Awesome 组件有自己的变量，如 `--wa-color-brand-fill-loud`。`src/resources/theme/color/wa.globals.ts` 将它们映射到 Home Assistant 令牌，因此 `ha-*` 包装组件也能跟随主题。

## 在组件中使用它们

```ts
static styles = css`
  :host {
    display: block;
    padding: var(--ha-space-4);
    gap: var(--ha-space-2);
    color: var(--primary-text-color);
    background-color: var(--card-background-color);
    border-radius: var(--ha-border-radius-lg);
  }
`;
```

## 主题如何应用

[主题](/glossary/theme/)是一组带有值的变量。用户通过 Core 中的 `frontend` 集成以 YAML 定义主题，或者安装主题，并在个人资料中选择一个。主题可以在 `modes` 下为浅色和深色模式设置不同的值。

`src/common/dom/apply_themes_on_element.ts` 中的 `applyThemesOnElement()` 将主题的变量设置到元素上。根元素将所选主题应用到整个应用。卡片将来自其自身 `theme` 选项的主题仅应用到该卡片。当主题包含深色模式的值时，在深色模式开启时这些值会叠加应用。

对于默认主题，用户可以在个人资料中选择自己的主色和强调色。前端随后会根据这一种颜色计算出主色调色板以及匹配的文本颜色。

## 从右到左

有些语言是从右向左书写的。前端会为它们翻转布局。请使用逻辑 CSS 属性，如 `margin-inline-start` 和 `padding-inline-end`，这样你的组件也会随之翻转。请使用从右到左的语言，或[画廊](/frontend/development/gallery-and-demo/)中的从右到左切换开关来检查你的更改。
