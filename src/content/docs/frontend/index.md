---
title: 前端
description: Home Assistant 的网页界面。它如何构建、如何参与开发，以及如何用你自己的卡片、面板和仪表盘来扩展它。
---

前端（frontend）是人们在 Home Assistant 中看到和触摸到的一切：仪表盘、设置页面、自动化编辑器、更多信息对话框，以及所有其他界面。同一套代码可以运行在浏览器中、[伴侣应用（companion apps）](/glossary/companion-app/)中，以及某人走廊里的壁挂平板上。它位于自己的代码仓库中：[home-assistant/frontend](https://github.com/home-assistant/frontend)。

它是一个 TypeScript 应用，使用 [Lit](https://lit.dev/) 基于 Web 组件构建。它通过 WebSocket 连接与 [Home Assistant Core](/glossary/core/) 通信，并在家中的状态发生变化时保持自身同步。

## 这个领域适合谁

- **前端贡献者**：想修复 bug、打磨界面，或在前端本身构建新功能的人。
- **集成开发者**：其后端改动需要在界面中新增内容，例如更多信息视图或 WebSocket 命令。
- **第三方开发者**：构建[自定义卡片（custom cards）](/glossary/custom-card/)、卡片特性、徽章、仪表盘策略或面板，供人们自行安装。
- **伴侣应用开发者**：将前端嵌入原生应用中。

你需要熟悉 TypeScript 或 JavaScript、HTML 和 CSS。Lit 和 Web 组件可以在实践中轻松上手。

## 快速，且无处不在

前端是一个渐进式 Web 应用（progressive web app），采用移动优先的设计。它必须在内存有限的低端 Android 手机上保持快速，也必须能在多年前就停止更新的旧平板上继续工作。为了兼顾两者，每个版本都会发布两个构建：

- **现代版（Modern）**：面向最近两年发布的浏览器。几乎无需转译，polyfill 很少，速度最快。
- **旧版（Legacy）**：面向较旧的浏览器，最低支持 [`.browserslistrc`](https://github.com/home-assistant/frontend/blob/dev/.browserslistrc) 中锁定的版本，例如旧 iPad 上的 Safari 12 和旧 Fire 平板上的 Chrome 59。

Home Assistant 会为每个浏览器提供它能运行的构建。在添加依赖或使用新的浏览器 API 时，请同时考虑这两个版本。

## 从这里开始

- [Your first frontend contribution](/frontend/first-contribution/): set up the environment, pick an issue, and open a pull request.
- [Custom cards and more](/frontend/custom-ui/): build your own card for your dashboard. No development environment needed: a JavaScript file in your Home Assistant is enough to start.
- [Open a pull request](/frontend/development/pull-requests/): what your pull request needs before it gets reviewed.
- [Review and release](/frontend/development/review-and-release/): what happens to your pull request, and how it reaches users.

## 指南与参考

- [开发](/frontend/development/)：开发环境、运行前端、gallery 和 demo、编码规范以及测试。
- [架构](/frontend/architecture/)：前端是如何组装起来的。Lit 和 `ha-*` 组件、`hass` 对象与上下文、数据层、翻译、主题、路由以及面板。
- [自定义卡片等](/frontend/custom-ui/)：构建卡片、卡片特性、徽章、视图、策略和面板，供人们加载到自己的 Home Assistant 中。
- [扩展前端](/frontend/extending/)：为某个域（domain）添加更多信息视图或状态卡片，或为你的集成添加 WebSocket 命令。
- [参考](/frontend/reference/)：命令、`hass` 对象、外部认证，以及伴侣应用使用的外部总线。

## 相关领域

- [设计](/design/)：界面背后的原则与基础。其中的[组件](/design/components/)、[仪表盘卡片](/design/dashboards/)和[更多信息视图](/design/more-info/)各自都有独立页面，面向设计师和开发者，配有实时示例和对应的代码。
- [翻译](/translate/)：前端的英文文本由社区翻译。[让你的字符串可翻译](/translate/guides/developers/)介绍了如何编写便于译者处理的字符串。
- [Core 与集成](/core/)：前端所通信的后端。
- [伴侣应用](/companion/)：封装前端的 Android 和 iOS 应用。

## 找谁交流

- [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 **#frontend** 频道是提问前端相关问题的地方。看不到该频道？在 **Channels & Roles** 下，选择 **I want to contribute dev skills to Home Assistant**。
- 界面中的 bug 和 pull request 都在[前端仓库](https://github.com/home-assistant/frontend)中处理。新功能的想法请提交到 [GitHub discussions](https://github.com/orgs/home-assistant/discussions)。
- 设计和 UX 问题请前往 [UX design discussions](https://github.com/OpenHomeFoundation/ux-design/discussions)，或 Discord 上的 **#designers** 频道。产品和 UX 讨论在 **#product-and-ux** 中进行。

当你寻求帮助时，请把你的工作推送到一个分支并分享链接。当别人能看到代码时，会更快地帮到你。
