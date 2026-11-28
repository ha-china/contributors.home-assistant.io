# 模式

> Home Assistant 界面中反复出现的情形，例如表单、等待、空列表或错误，以及前端如何处理它们。

Source: https://www.hasscn.top/contributors/design/patterns/

组件是一个构建模块。模式则是多个组件如何协同工作，以处理界面中反复出现的情形：填写表单、等待某件事、发现列表为空，或者遇到错误。

对于其中大多数情形，Home Assistant 已经有了现成的解决方案。在所有地方使用相同的解决方案，意味着人们只需学习一次。在你设计一种展示错误或等待的新方式之前，请先在这里查看。

每种模式都描述了它适用的场景、工作方式、使用了哪些[组件](https://www.hasscn.top/contributors/design/components/)，以及在无障碍和文本方面需要注意的事项。

## 模式列表

- [表单与校验](https://www.hasscn.top/contributors/design/patterns/forms/)：收集输入、辅助文本、必填字段，以及显示错误所在。
- [加载](https://www.hasscn.top/contributors/design/patterns/loading/)：加载指示器、显示进度的按钮，以及骨架屏。
- [空状态](https://www.hasscn.top/contributors/design/patterns/empty-states/)：当还没有内容可显示，或没有结果时，应该展示什么。
- [错误与消息](https://www.hasscn.top/contributors/design/patterns/errors/)：警告、Toast 提示和修复。该选择哪一种，以及如何措辞。
- [确认与撤销](https://www.hasscn.top/contributors/design/patterns/confirmations/)：在操作无法撤销前进行询问，在可以撤销时提供撤销功能，以及避免丢失未保存的更改。

## 相关内容

- [无障碍](https://www.hasscn.top/contributors/design/foundations/accessibility/)：每种模式都必须满足的要求。
- [界面文本](https://www.hasscn.top/contributors/design/ui-text/)：用于这些模式中的文字。
- 缺少某个模式，或者认为某个模式需要修改？请在 [UX design discussions](https://github.com/OpenHomeFoundation/ux-design/discussions) 的 **Design system** 分类中发起讨论。
