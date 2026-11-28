# 基础

> 颜色、排版、间距、动效和无障碍。Home Assistant 中一切设计背后的设计令牌（design token）和规则。

Source: https://www.hasscn.top/contributors/design/foundations/

基础是设计中最细小的决策：存在哪些颜色、文本可以有哪些字号、事物之间留多少空间、事物移动多快。它们被定义为[设计令牌（design token）](https://www.hasscn.top/contributors/glossary/design-token/)，存放在 [Home Assistant 前端](https://github.com/home-assistant/frontend/tree/dev/src/resources/theme)中，每个组件都由它们构建而成。

颜色、排版和间距页面直接读取这些令牌。你在那里看到的就是前端所使用的内容。

- [颜色](https://www.hasscn.top/contributors/design/foundations/color/)：调色板，以及基于它们构建的语义颜色。
- [排版](https://www.hasscn.top/contributors/design/foundations/typography/)：字号阶梯和字重。
- [间距](https://www.hasscn.top/contributors/design/foundations/spacing/)：间距阶梯和圆角半径。
- [布局](https://www.hasscn.top/contributors/design/foundations/layout/)：内容宽度和页面两侧的边距。
- [无障碍](https://www.hasscn.top/contributors/design/foundations/accessibility/)：对比度、焦点、键盘、标签、目标大小和屏幕阅读器。WCAG 的要求，以及前端如何实现。
- [动效](https://www.hasscn.top/contributors/design/foundations/motion/)：动画时长，以及减少动态效果如何工作。

> [!TIP]
> 在设计新东西？请坚持使用令牌。自定义的颜色或间距值意味着基础中缺少了某些东西，这值得在 [UX 设计讨论](https://github.com/OpenHomeFoundation/ux-design/discussions)的 **Design system** 分类中发起讨论。
