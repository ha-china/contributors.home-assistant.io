# 动效

> Home Assistant 界面的动画时长令牌（token），以及动效如何尊重那些要求减少动效的用户。

Source: https://www.hasscn.top/contributors/design/foundations/motion/

动效帮助人们了解发生了什么：对话框在页面之上打开，提示消息（toast）从底部滑入，控件移动到它的新值。谨慎使用时，它能解释一个变化；使用过度时，它会碍事，对某些人来说，它会让界面难以使用，甚至令人不适。

## 时长令牌

动画使用以下令牌之一，它们定义在前端的 [`src/resources/theme/core.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/core.globals.ts) 中：

- `--ha-animation-duration-instant`：75 毫秒
- `--ha-animation-duration-fast`：150 毫秒
- `--ha-animation-duration-normal`：250 毫秒
- `--ha-animation-duration-slow`：350 毫秒
- `--ha-animation-duration-none`：1 毫秒

Web Awesome 组件使用相同的值：它们的普通过渡使用 `--ha-animation-duration-fast`，快速过渡使用 `--ha-animation-duration-instant`。

## 减少动效

用户可以要求其操作系统减少动效。浏览器会通过 `prefers-reduced-motion: reduce` 将这一偏好传递给页面。当该设置生效时，前端会将所有时长令牌设置为 1 毫秒。所有以这些令牌计时的内容都会立即发生，无需你做任何额外处理。

一些组件走得更远，会关闭自身的动画，例如对话框、底部抽屉、涟漪效果、侧边栏和骨架屏加载器。如果你的组件以令牌未覆盖的方式进行动画，比如循环动画，请为它也添加一个 `@media (prefers-reduced-motion: reduce)` 块。

需要在 JavaScript 中获知该设置的代码，例如决定是否播放动画的图表，可以使用 `reducedMotionContext` Lit 上下文。

## 指南

这些指南来自前端的样式规范，其中大部分是为视图过渡（view transitions）编写的：

- 仅在状态之间有意义的连续性时使用视图过渡。
- 保持过渡简洁。细微的淡入淡出和交叉淡入淡出通常效果最好。
- 使用 `--ha-animation-duration-fast`、`--ha-animation-duration-normal` 或 `--ha-animation-duration-slow` 来控制时长。
- 保持动效细微并使用令牌，并通过现有的全局变量尊重减少动效的偏好。

对于页面级过渡，前端通过 [`src/common/util/view-transition.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/util/view-transition.ts) 中的 `withViewTransition()` 辅助函数使用 View Transitions API。[前端主题](https://www.hasscn.top/contributors/frontend/architecture/theming/)页面介绍了代码层面的内容。

## 相关内容

- [无障碍](https://www.hasscn.top/contributors/design/foundations/accessibility/)：WCAG 对动效的要求。
- [加载指示器](https://www.hasscn.top/contributors/design/components/spinner/)和[加载](https://www.hasscn.top/contributors/design/patterns/loading/)：表示“请稍候”的动效。
