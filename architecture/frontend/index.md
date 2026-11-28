# 前端

> Web 界面在整个 Home Assistant 中的位置，以及在哪里可以找到它的详细信息。

Source: https://www.hasscn.top/contributors/architecture/frontend/

[前端](https://www.hasscn.top/contributors/glossary/frontend/)（frontend）是用户看到的一切：仪表盘、设置、自动化编辑器，以及每一个对话框。它是一个 Web 应用程序，使用 Lit 和 TypeScript 构建，位于 [home-assistant/frontend](https://github.com/home-assistant/frontend) 仓库中。Core 提供其文件，它在浏览器中运行，[伴侣应用](https://www.hasscn.top/contributors/architecture/platform/companion-apps/)（companion apps）也会显示它。

## 它在整体中的位置

- **它自身不保存任何状态。** 它显示的一切都来自 Core，通过 [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/) 传输，并且每次更改都会推送给它。关闭浏览器，什么都不会丢失。
- **它从不直接与设备通信。** 选择一盏灯会在 Core 中执行一个操作，由 Core 的集成与该灯通信。前端只看到实体（entity）。
- **文本来自两个地方。** 前端自身的文本来自它的翻译文件。集成的文本，比如实体名称和设置步骤，来自 Core，来自每个集成的 `strings.json`。
- **它分部分加载。** 称为面板（panel）的页面和仪表盘卡片只在需要时才加载，因此第一页速度很快。

## 详细信息

[前端](https://www.hasscn.top/contributors/frontend/)（Frontend）区域解释了它是如何构建的：

- [架构](https://www.hasscn.top/contributors/frontend/architecture/)：应用程序的各个部分，以及代码在仓库中的位置。
- [hass 对象与上下文](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)：组件如何获取所需的数据。
- [数据层](https://www.hasscn.top/contributors/frontend/architecture/data/)：前端如何与 Core 通信。
- [路由与面板](https://www.hasscn.top/contributors/frontend/architecture/routing-and-panels/)：页面，以及它们如何加载。

以及本区域中的：[仪表盘](https://www.hasscn.top/contributors/architecture/frontend/dashboards/)，视图、卡片和策略（strategy）如何协同工作。

组件及其设计记录在[设计](https://www.hasscn.top/contributors/design/components/)（Design）区域中。

## 参与这方面的工作

- 前端新手？从[你的第一个前端贡献](https://www.hasscn.top/contributors/frontend/first-contribution/)开始。
- 前端区域中的[架构](https://www.hasscn.top/contributors/frontend/architecture/)：应用程序是如何构建的。
- 想改进它的外观？[设计](https://www.hasscn.top/contributors/design/first-contribution/)区域是起点。
