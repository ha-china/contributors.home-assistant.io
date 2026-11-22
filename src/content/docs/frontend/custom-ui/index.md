---
title: 自定义卡片及更多
description: 构建卡片、卡片功能、徽章、视图、仪表盘策略和面板，供用户加载到自己的 Home Assistant 中，而无需修改前端。
order: 30
sidebarLabel: 自定义卡片及更多
---

内置卡片已经覆盖了很多场景，但并非全部。你无需改动[前端仓库](https://github.com/home-assistant/frontend)，就可以向界面添加自己的构建模块：编写一个 JavaScript 文件，将其加载到 Home Assistant 中，然后像使用内置卡片一样使用它。成千上万的社区卡片就是这样制作的。

## 你可以构建什么

| 内容 | 显示位置 | 页面 |
| --- | --- | --- |
| [卡片（Card）](/glossary/card/) | 在仪表盘上，与内置卡片并列 | [自定义卡片](/frontend/custom-ui/card/) |
| [卡片功能（Card feature）](/glossary/card-feature/) | 在磁贴卡片或其他支持功能的卡片内部 | [自定义卡片功能](/frontend/custom-ui/card-feature/) |
| [徽章（Badge）](/glossary/badge/) | 在视图顶部 | [自定义徽章](/frontend/custom-ui/badge/) |
| [策略（Strategy）](/glossary/strategy/) | 通过代码生成整个仪表盘、视图或区块 | [自定义策略](/frontend/custom-ui/strategy/) |
| [视图（View）](/glossary/view/)布局 | 以你自己的方式排列视图中的卡片 | [自定义视图](/frontend/custom-ui/view/) |
| [面板（Panel）](/glossary/panel/) | 一个独立的全页面，并在侧边栏中有链接 | [自定义面板](/frontend/custom-ui/panel/) |

## 工作原理

它们中的每一个都是一个[自定义元素（custom element）](https://developer.mozilla.org/docs/Web/API/Web_components/Using_custom_elements)：一个以标签名注册的 JavaScript 类。Home Assistant 创建该元素，在其上设置属性，例如 `hass` 和配置，然后将其放到页面上。元素渲染什么内容完全由你决定。

1. 在 JavaScript 模块中**编写元素**，并使用 `customElements.define()` 注册它。
2. 将该模块作为[仪表盘资源](/frontend/custom-ui/resources/)**加载**到 Home Assistant 中。面板则通过其自身的配置加载。
3. 在仪表盘中使用 `custom:` 前缀来**使用它**，例如 `type: custom:my-card`。

为了便于查找，你还可以注册你的元素，使其显示在卡片选择器、功能选择器或新建仪表盘对话框中，并为其选项提供可视化编辑器。

## 使用哪些工具

你可以使用任何能生成标准自定义元素的库，也可以完全不使用。这些页面上的示例使用纯 JavaScript，因此你可以直接复制并运行它们，无需构建步骤。

对于更大的项目，[Lit](https://lit.dev/) 是一个不错的选择：前端本身就在使用它，因此[架构](/frontend/architecture/)页面上的模式可以直接套用。请将你自己的 Lit 副本或任何其他库打包进你的模块中。

前端没有面向自定义卡片的公开组件库。前端仓库中没有任何内容将 `ha-*` 元素列为受支持，也没有承诺它们保持不变。它们只在前端需要时才会被加载，并且可能在任何版本中发生变化。如果你的卡片依赖其中某个元素，它可能会毫无预警地失效。

`ha-card` 是实践中（而非纸面上）唯一的例外。它是内置卡片的容器，接受 `--ha-card-background` 和 `--ha-card-border-radius` 等卡片主题变量，并且大多数自定义卡片都会将其内容包裹在其中，正如[自定义卡片示例](/frontend/custom-ui/card/)所做的那样。使用它可以让你的卡片融入整体风格，但要知道它同样不提供任何保证。对于其他任何内容，例如选择器或表单字段，请自行构建或打包。要在你的卡片内显示内置卡片或某个标准对话框，请使用[卡片辅助工具（card helpers）](/frontend/custom-ui/card/#card-helpers)，前端会特意为自定义卡片加载它们。

## 共享概念

- **`hass`**：包含 Home Assistant 完整状态的对象。每次变化时，你的元素都会收到一个新的对象。[hass 对象参考](/frontend/reference/hass-object/)列出了其中的内容。
- **`setConfig(config)`**：以你的卡片、徽章或功能的 YAML 配置被调用。当配置无效时抛出错误，Home Assistant 会将其显示给用户。
- **`custom:` 前缀**：将你的元素与内置元素区分开。你的元素 `my-card` 以 `type: custom:my-card` 的形式使用。

## 设计

自定义卡片与内置卡片风格一致时效果最佳。使用[主题变量](/frontend/architecture/theming/)，例如 `--card-background-color` 和 `--primary-text-color`，使你的卡片遵循用户的主题和深色模式。设计板块的[仪表盘](/design/dashboards/)页面解释了内置卡片是如何设计的，以及为什么这样设计。

## 分享你的作品

To publish what you built, so others can install it from the Marketplace, see [dashboard cards and plugins](/marketplace/guides/dashboard/). To let people try your card on a web page first, see [live demos](/frontend/custom-ui/demo/).

你认为你的卡片应该进入前端本身吗？项目建议你先在 [Marketplace](/marketplace/) 上发布新卡片。你可以积累经验，并且能够更快地迭代。一旦它成熟并拥有用户群，请联系维护者，例如在 [Discord](https://www.home-assistant.io/join-chat/) 上的 **#frontend** 频道，探讨它是否应该作为内置功能发布。
