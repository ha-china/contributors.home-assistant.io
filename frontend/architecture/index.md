# 前端架构

> 前端是如何组装起来的，从最先加载的脚本，到各个面板、对话框，以及在其中流转的数据。

Source: https://www.hasscn.top/contributors/frontend/architecture/

前端是一个由 web components 组成的单页应用。每个组件都将其模板、样式和逻辑打包在一起，并在浏览器中以 HTML 标签的形式呈现，例如 `<ha-button>` 或 `<hui-tile-card>`。组件可以组合成更大的组件，层层向上，直到应用本身。

## 组成部分

前端分四层加载。

### 引导（Bootstrap）

[`src/entrypoints/core.ts`](https://github.com/home-assistant/frontend/blob/dev/src/entrypoints/core.ts) 是一个最先加载的小脚本。它检查登录凭据，并打开与 Home Assistant Core 的 WebSocket 连接。由于它非常小，在界面的其余部分还在下载时，数据就已经开始流动了。

### 应用外壳（App shell）

[`src/entrypoints/app.ts`](https://github.com/home-assistant/frontend/blob/dev/src/entrypoints/app.ts) 加载根元素 `<home-assistant>`（位于 [`src/layouts/home-assistant.ts`](https://github.com/home-assistant/frontend/blob/dev/src/layouts/home-assistant.ts)）以及全局样式。根元素通过 [`src/state/`](https://github.com/home-assistant/frontend/tree/dev/src/state) 中的一系列 mixin 来设置应用的状态：连接、翻译、主题、对话框、侧边栏等等。然后它渲染 [`src/layouts/home-assistant-main.ts`](https://github.com/home-assistant/frontend/blob/dev/src/layouts/home-assistant-main.ts)，由后者绘制侧边栏，并将当前 URL 交给面板解析器。

### 面板（Panels）

Home Assistant 中的每个页面都是一个[面板（panel）](https://www.hasscn.top/contributors/glossary/panel/)：仪表盘、地图、历史记录、设置。面板位于 [`src/panels/`](https://github.com/home-assistant/frontend/tree/dev/src/panels) 中，只有在有人打开它们时才会加载。Core 决定存在哪些面板，集成也可以添加自己的面板。[路由与面板](https://www.hasscn.top/contributors/frontend/architecture/routing-and-panels/)解释了其工作原理。

### 对话框（Dialogs）

对话框位于 [`src/dialogs/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs) 中，可以在任何页面之上打开。最著名的是[更多信息对话框（more-info dialog）](https://www.hasscn.top/contributors/glossary/more-info-dialog/)，它显示一个实体（entity）的状态、历史记录和设置。

## 文件位置

| 文件夹 | 内容 |
| --- | --- |
| [`src/components/`](https://github.com/home-assistant/frontend/tree/dev/src/components) | 共享的 `ha-*` 组件，随处使用。 |
| [`src/panels/`](https://github.com/home-assistant/frontend/tree/dev/src/panels) | 每个面板一个文件夹。仪表盘位于 [`src/panels/lovelace/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace)。 |
| [`src/dialogs/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs) | 对话框，包括更多信息对话框。 |
| [`src/data/`](https://github.com/home-assistant/frontend/tree/dev/src/data) | 与 Core 通信的类型和函数：WebSocket 命令、订阅和上下文。 |
| [`src/common/`](https://github.com/home-assistant/frontend/tree/dev/src/common) | 不含 UI 的小型辅助工具：格式化、实体辅助函数、装饰器和 DOM 工具。 |
| [`src/state/`](https://github.com/home-assistant/frontend/tree/dev/src/state) | 构成根元素应用状态的 mixin。 |
| [`src/layouts/`](https://github.com/home-assistant/frontend/tree/dev/src/layouts) | 根元素、主布局、面板解析器和页面布局。 |
| [`src/resources/`](https://github.com/home-assistant/frontend/tree/dev/src/resources) | 全局样式和主题定义。 |
| [`src/translations/`](https://github.com/home-assistant/frontend/tree/dev/src/translations) | `en.json`，所有前端文本的英文源文件。 |
| [`src/external_app/`](https://github.com/home-assistant/frontend/tree/dev/src/external_app) | 与配套应用（companion apps）之间的桥接。 |

## 数据如何流动

前端主要通过 [WebSocket API](https://github.com/home-assistant/home-assistant-js-websocket) 与 Core 通信，少数地方使用 REST API。

数据单向流动。当 Core 中发生某些变化时，比如一盏灯被打开，根元素会收到更新并创建一个新的 `hass` 对象，这个变化沿着组件树向下传递到每个需要它的组件。当某个组件想要改变一些东西时，它会调用 Core，并等待变化从上方传下来。

只需要部分数据的组件会使用 [Lit 上下文（context）](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)，而不是整个 `hass` 对象。不属于 `hass` 的数据，比如标签注册表或备份列表，则通过[订阅和命令](https://www.hasscn.top/contributors/frontend/architecture/data/)加载，以保持与 Core 的同步。

## 相关页面

- [组件与 Lit](https://www.hasscn.top/contributors/frontend/architecture/components/)：web components、Lit，以及基于 Web Awesome 构建的 `ha-*` 组件。
- [hass 对象与上下文](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)：组件如何获取数据。
- [数据层](https://www.hasscn.top/contributors/frontend/architecture/data/)：WebSocket 命令、订阅和集合。
- [前端中的翻译](https://www.hasscn.top/contributors/frontend/architecture/translations/)：文本如何被翻译。
- [主题与设计令牌](https://www.hasscn.top/contributors/frontend/architecture/theming/)：主题变量和令牌，以及主题如何应用。
- [路由与面板](https://www.hasscn.top/contributors/frontend/architecture/routing-and-panels/)：URL 如何变成一个页面。
