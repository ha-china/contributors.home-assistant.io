---
title: 基础
description: 颜色、排版、间距、动效和无障碍。Home Assistant 中一切设计背后的设计令牌（design token）和规则。
order: 10
---

基础是设计中最细小的决策：存在哪些颜色、文本可以有哪些字号、事物之间留多少空间、事物移动多快。它们被定义为[设计令牌（design token）](/glossary/design-token/)，存放在 [Home Assistant 前端](https://github.com/home-assistant/frontend/tree/dev/src/resources/theme)中，每个组件都由它们构建而成。

颜色、排版和间距页面直接读取这些令牌。你在那里看到的就是前端所使用的内容。

- [Color](/design/foundations/color/): the palettes, and the semantic colors built on them.
- [Typography](/design/foundations/typography/): the type scale and font weights.
- [Spacing](/design/foundations/spacing/): the spacing scale and corner radius.
- [Layout](/design/foundations/layout/): content widths and the gutter at the sides of a page.
- [Accessibility](/design/foundations/accessibility/): contrast, focus, keyboard, labels, target size, and screen readers. What WCAG asks, and how the frontend does it.
- [Motion](/design/foundations/motion/): the animation durations, and how reduced motion works.

> [!TIP]
> 在设计新东西？请坚持使用令牌。自定义的颜色或间距值意味着基础中缺少了某些东西，这值得在 [UX 设计讨论](https://github.com/OpenHomeFoundation/ux-design/discussions)的 **Design system** 分类中发起讨论。
