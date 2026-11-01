---
title: 开发
description: 前端开发本身所需的一切内容：环境、运行方式、画廊与演示、编码指南、测试以及审查。
order: 10
---

这些页面用于参与 [frontend 仓库](https://github.com/home-assistant/frontend) 的开发：修复 bug、改进界面以及添加新功能。而构建供他人自行安装的卡片或面板则无需这些内容。相关内容请参阅[自定义卡片及更多](/frontend/custom-ui/)。

## 工具

前端使用 TypeScript 编写，基于 [Lit](https://lit.dev/)，并使用 [Rspack](https://rspack.dev/) 进行打包。依赖由 [pnpm](https://pnpm.io/) 管理。测试通过 [Vitest](https://vitest.dev/) 和 [Playwright](https://playwright.dev/) 运行。所有需要的命令都是 `package.json` 中的脚本，因此你可以使用 `pnpm` 来运行它们。

## 页面

- [Set up the environment](/frontend/development/environment/): with the devcontainer, or on your own machine.
- [Run the frontend](/frontend/development/run/): against a development Home Assistant, or against one you already have.
- [The gallery and the demo](/frontend/development/gallery-and-demo/): work on components and dashboards without a Home Assistant at all.
- [Coding guidelines](/frontend/development/guidelines/): how frontend code is written, and what reviewers look for.
- [Linting and tests](/frontend/development/testing/): the checks to run before you open a pull request.
- [Builds](/frontend/development/builds/): make a production build, and try out someone else's pull request on a real Home Assistant.
- [Open a pull request](/frontend/development/pull-requests/): what your pull request needs before it gets reviewed.
- [Review and release](/frontend/development/review-and-release/): what happens to your pull request, and how it reaches users.

所有命令和端口汇总：[命令](/frontend/reference/commands/)。
