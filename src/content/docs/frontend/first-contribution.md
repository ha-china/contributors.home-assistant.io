---
title: 你的第一次前端贡献
description: 搭建前端环境，将其连接到 Home Assistant 实例运行，做一个小改动，然后提交你的第一个 pull request。
order: 1
sidebarLabel: 你的第一次贡献
---

进入前端开发最快的方式是做一个小而可见的修复：一个错位的图标、一段被截断的标签、一个在移动端上毫无反应的按钮。保存的瞬间你就能在浏览器中看到结果，审查者也只需一张截图就能做出判断。

## 1. 找一个可以着手的问题

浏览前端仓库中的 [`good first issue` 标签](https://github.com/home-assistant/frontend/labels/good%20first%20issue)，或者[未修复的 bug](https://github.com/home-assistant/frontend/issues)。你自己遇到过的 bug 是绝佳的入门题材，因为你已经知道如何复现它。

留一条评论说明你正在处理这个问题，以免别人同时认领。

> [!TIP]
> 想构建一张新卡片？那不需要下面任何步骤。从[自定义卡片等](/frontend/custom-ui/)开始，然后发布到 [Marketplace](/marketplace/)：项目建议新卡片从这里起步。

## 2. 搭建环境

最简单的搭建方式是使用 Visual Studio Code 和前端仓库的 devcontainer。它会为你安装合适的 Node.js 和 pnpm。

1. 在 GitHub 上[fork 前端仓库](https://github.com/home-assistant/frontend/fork)。
2. 克隆你的 fork，并在 Visual Studio Code 中打开。
3. 当 Visual Studio Code 询问时，选择 **Reopen in Container**。首次启动需要几分钟，因为要安装依赖。

不想使用容器？[搭建环境](/frontend/development/environment/)介绍了两种方式。

## 3. 运行起来

你需要一个 Home Assistant 实例来连接。在 devcontainer 中，你可以在前端旁边运行一个：

1. 打开一个终端并启动 Home Assistant Core。首次运行会安装 Core 的 `dev` 分支，并创建一个带有演示实体（entity）的配置：

   ```shell
   script/core
   ```

2. 打开第二个终端并启动前端开发服务器：

   ```shell
   pnpm dev
   ```

3. 等待 `Build done`，然后在你的电脑上打开 `http://localhost:8124` 并创建一个用户。

家里已经有 Home Assistant 了？你也可以把开发前端指向它。[运行前端](/frontend/development/run/)介绍了这两种方式。

## 4. 进行修改

创建一个分支，进行修改并保存。开发服务器会重新构建，刷新浏览器即可看到结果。

即使是小修复，审查者也会关注以下几点：

- 用户看到的所有文本都来自 `src/translations/en.json`，绝不能硬编码在代码中。
- 使用现有的 `ha-*` 组件和主题变量，不要引入新的颜色或一次性的控件。
- 在窄屏和深色主题下检查你的修改。

[coding guidelines](/frontend/development/guidelines/) 中有详细说明。

## 5. 检查你的工作

在推送之前运行代码检查工具和单元测试：

```shell
pnpm lint
pnpm test
```

pre-commit 钩子会自动格式化你提交的文件，因此大多数样式问题会自动修复。

## 6. 提交 pull request

将你的分支推送到你的 fork，并针对 `dev` 分支打开一个 pull request。完整填写 pull request 模板：从使用者的角度描述更改，勾选恰好一个**更改类型**，并为任何视觉更改添加前后截图。如果模板缺失或不完整，检查将导致 pull request 失败。[打开 pull request](/frontend/development/pull-requests/) 中有详细说明。

然后就要准备回答问题了。审查者可能会要求你修改一些内容，这是正常的。[审查与发布](/frontend/development/review-and-release/)解释了接下来会发生什么。

## 接下来做什么

- 阅读[架构概览](/frontend/architecture/)，了解各个部分如何协同工作。
- 在构建新东西之前，先看看[组件](/design/components/)。复用现有组件几乎总是更好的选择。
- 帮忙审查：测试别人的 pull request 并留下你的发现。这能让所有人的进度更快，包括你自己。
