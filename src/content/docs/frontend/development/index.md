---
title: 开发
description: 前端开发本身所需的一切内容：环境、运行方式、画廊与演示、编码指南、测试以及审查。
order: 10
---

这些页面用于参与 [frontend 仓库](https://github.com/home-assistant/frontend) 的开发：修复 bug、改进界面以及添加新功能。而构建供他人自行安装的卡片或面板则无需这些内容。相关内容请参阅[自定义卡片及更多](/frontend/custom-ui/)。

## 工具

前端使用 TypeScript 编写，基于 [Lit](https://lit.dev/)，并使用 [Rspack](https://rspack.dev/) 进行打包。依赖由 [pnpm](https://pnpm.io/) 管理。测试通过 [Vitest](https://vitest.dev/) 和 [Playwright](https://playwright.dev/) 运行。所有需要的命令都是 `package.json` 中的脚本，因此你可以使用 `pnpm` 来运行它们。

## 页面

- [设置环境](/frontend/development/environment/)：使用 devcontainer，或在你自己的机器上。
- [运行前端](/frontend/development/run/)：针对开发版 Home Assistant，或针对你已有的 Home Assistant。
- [画廊与演示](/frontend/development/gallery-and-demo/)：在完全没有 Home Assistant 的情况下处理组件和仪表盘。
- [编码指南](/frontend/development/guidelines/)：前端代码的编写方式，以及审查者关注的内容。
- [Linting 与测试](/frontend/development/testing/)：在打开拉取请求之前需要运行的检查。
- [构建](/frontend/development/builds/)：进行生产构建，并在真实的 Home Assistant 上尝试他人的拉取请求。
- [打开拉取请求](/frontend/development/pull-requests/)：你的拉取请求在审查前需要满足的条件。
- [审查与发布](/frontend/development/review-and-release/)：你的拉取请求会发生什么，以及它如何到达用户手中。

所有命令和端口汇总：[命令](/frontend/reference/commands/)。
