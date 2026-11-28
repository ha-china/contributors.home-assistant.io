# 组件

> Home Assistant 界面的构建模块，每个组件一页，包含指南、规格、无障碍信息和代码。

Source: https://www.hasscn.top/contributors/design/components/

界面由一组共享的组件构建而成。复用它们可以让 Home Assistant 保持一致，也为每个人节省工作量。在你设计或构建新东西之前，请先检查这些组件中是否已有能胜任的。

这些页面上的示例是来自前端的真实组件，实时运行于应用的浅色或深色主题中。

## 组件页面的结构

每个组件都有一个页面，供设计师和开发者共同使用。设计在前，代码在后，每个页面都采用相同的顺序，方便你知道去哪里查找：

1. **概述**：用一两句话说明该组件是什么。
2. **何时使用**：它承担的任务，以及何时用其他组件更合适。
3. **结构剖析**：它由哪些部分组成。
4. **变体**：它有哪些版本，以及何时选用哪种。
5. **行为**：用户与之交互时会发生什么。
6. **规格**：尺寸、间距和颜色，以[设计令牌（design tokens）](https://www.hasscn.top/contributors/design/foundations/)表示。
7. **指南**：如何正确使用它，通常包含“应该做”和“不该做”。
8. **无障碍**：键盘、焦点、目标尺寸，以及屏幕阅读器会朗读的内容，最后是代码中的角色（role）和 ARIA。
9. **相关内容**：与之搭配的组件和[模式（patterns）](https://www.hasscn.top/contributors/design/patterns/)。
10. **代码**：元素、其属性、插槽（slot）、事件，以及如何设置样式。

开发者可以直接跳到**代码**部分。设计师可以在那之前停下。**无障碍**部分的结构也是如此：先介绍用户能获得什么，比如键盘支持、焦点、目标尺寸，以及屏幕阅读器会朗读的内容，然后是**代码中**部分，介绍背后的角色和 ARIA 属性。

## 规格的所在之处

这些页面是 Home Assistant 组件的参考：它们的外观、行为，以及何时使用。它们取代了 design.home-assistant.io。

要修改一个组件：

1. 在 [UX 设计讨论](https://github.com/OpenHomeFoundation/ux-design/discussions)的 **Design system** 分类中发起讨论，并在那里确定方向。
2. 在[前端仓库](https://github.com/home-assistant/frontend)中打开一个修改该组件的拉取请求（pull request）。
3. 向[本站](https://github.com/home-assistant/contributors.home-assistant.io)打开一个更新该组件页面的拉取请求。

完整流程请参见[我们的设计方式](https://www.hasscn.top/contributors/design/how-we-design/#where-a-component-is-specified)。

## Actions

- [按钮（Button）](https://www.hasscn.top/contributors/design/components/button/)：启动一个操作，比如保存表单或打开对话框。
- [进度按钮（Progress button）](https://www.hasscn.top/contributors/design/components/progress-button/)：需要一些时间的操作，并显示其进展如何。
- [下拉菜单（Dropdown）](https://www.hasscn.top/contributors/design/components/dropdown/)：按钮背后的操作或选项菜单。

## Input

- [文本输入框（Text input）](https://www.hasscn.top/contributors/design/components/input/)：单行文本，比如名称、数字或密码。
- [文本域（Textarea）](https://www.hasscn.top/contributors/design/components/textarea/)：跨越多行的文本。
- [开关（Switch）](https://www.hasscn.top/contributors/design/components/switch/)：开启或关闭单个设置。
- [滑块（Slider）](https://www.hasscn.top/contributors/design/components/slider/)：通过拖动从范围中选取一个数字。
- [选择框（Select box）](https://www.hasscn.top/contributors/design/components/select-box/)：从几个选项中选一个，以卡片形式并排显示。
- [颜色选择器（Color picker）](https://www.hasscn.top/contributors/design/components/color-picker/)：在色轮上选取色相和饱和度，比如灯的颜色。

## Pickers

- [实体选择器（Entity picker）](https://www.hasscn.top/contributors/design/components/entity-picker/)：选择一个实体（entity），支持搜索。
- [设备选择器（Device picker）](https://www.hasscn.top/contributors/design/components/device-picker/)：选择一个设备（device），支持搜索。
- [区域选择器（Area picker）](https://www.hasscn.top/contributors/design/components/area-picker/)：选择一个区域（area），或当场新建一个。

## Forms

- [表单（Form）](https://www.hasscn.top/contributors/design/components/form/)：由模式（schema）渲染出的完整表单。
- [选择器（Selector）](https://www.hasscn.top/contributors/design/components/selector/)：为值匹配合适的控件，集成（integration）、蓝图（blueprint）和表单都会用到。

## Feedback and status

- [提醒（Alert）](https://www.hasscn.top/contributors/design/components/alert/)：页面上一条简短而重要的消息。
- [对话框（Dialog）](https://www.hasscn.top/contributors/design/components/dialog/)：在当前屏幕之上进行决策或输入。
- [自适应对话框（Adaptive dialog）](https://www.hasscn.top/contributors/design/components/adaptive-dialog/)：在大屏幕上是对话框，在手机上是底部抽屉。
- [徽章（Badge）](https://www.hasscn.top/contributors/design/components/badge/)：药丸形的小块状态信息。
- [标签徽章（Label badge）](https://www.hasscn.top/contributors/design/components/label-badge/)：经典的圆形状态徽章。
- [加载指示器（Spinner）](https://www.hasscn.top/contributors/design/components/spinner/)：表示某物正在加载。
- [工具提示（Tooltip）](https://www.hasscn.top/contributors/design/components/tooltip/)：悬停或聚焦时显示的简短提示。
- [提示（Tip）](https://www.hasscn.top/contributors/design/components/tip/)：内容下方简短的可选提示，比如键盘快捷键。
- [状态图标（State icon）](https://www.hasscn.top/contributors/design/components/state-icon/)：基于实体状态显示的图标和颜色。

## Showing values

- [条形（Bar）](https://www.hasscn.top/contributors/design/components/bar/)：显示某物的使用量。
- [仪表盘（Gauge）](https://www.hasscn.top/contributors/design/components/gauge/)：表盘上的单个数值。
- [控件（Controls）](https://www.hasscn.top/contributors/design/components/controls/)：用于操作设备的大尺寸、触控友好的控件。
- [控制滑条（Control scrubber）](https://www.hasscn.top/contributors/design/components/control-scrubber/)：在固定窗口下拖动一条滑条，适用于循环范围，比如色相。
- [选择菜单（Select menu）](https://www.hasscn.top/contributors/design/components/select-menu/)：用于选择单个选项的紧凑下拉菜单，比如恒温器的模式。

## Layout and content

- [列表（List）](https://www.hasscn.top/contributors/design/components/list/)：一行行的条目。
- [展开面板（Expansion panel）](https://www.hasscn.top/contributors/design/components/expansion-panel/)：需要时才展开的部分。
- [跑马灯文本（Marquee text）](https://www.hasscn.top/contributors/design/components/marquee-text/)：放不下时会滚动的单行文本。
- [渐隐（Faded）](https://www.hasscn.top/contributors/design/components/faded/)：长文本的开头，其余部分渐隐，直到用户选择后才显示。

## 更大的构建模块

组件会组合成界面中更大的部分，每个部分都有独立的章节：

- [仪表盘（Dashboards）](https://www.hasscn.top/contributors/design/dashboards/)：用户放在其仪表盘上的卡片。
- [更多信息（More info）](https://www.hasscn.top/contributors/design/more-info/)：选择一个实体时打开的对话框，以及每种类型的实体在其中获得的视图。

## 缺少什么吗？

并非前端中的每个组件在这里都有页面。缺失的页面本身就是很好的贡献：按照上述大纲向[本站](https://github.com/home-assistant/contributors.home-assistant.io)打开一个拉取请求。如果你认为某个组件应该修改，请在 [UX 设计讨论](https://github.com/OpenHomeFoundation/ux-design/discussions)的 **Design system** 分类中发起讨论。开发者可以在前端的 [`src/components`](https://github.com/home-assistant/frontend/tree/dev/src/components) 中找到每个组件的代码，[前端（Frontend）](https://www.hasscn.top/contributors/frontend/)板块介绍了如何使用它。

## All pages in this section

### 布局和内容

- [列表](https://www.hasscn.top/contributors/design/components/list/): 列表显示一组行，每行包含一行文本，并可选地带一个图标、第二行文本以及末尾的内容。
