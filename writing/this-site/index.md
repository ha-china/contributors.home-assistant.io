# 改进本贡献者网站

> 修复或添加 contributors.home-assistant.io 上的页面，在您自己的机器上预览，并保持链接和重定向正常工作。

Source: https://www.hasscn.top/contributors/writing/this-site/

本区域的其他内容都是关于 [home-assistant.io](https://www.home-assistant.io/) 上的用户文档的。本页面介绍的是您现在正在阅读的这个网站。它同样是开源的，并且以同样的方式变得更好：有人发现错误或缺失的内容，然后修复它。

源代码位于 [contributors.home-assistant.io 仓库](https://github.com/home-assistant/contributors.home-assistant.io)。它的 README 是维护者指南，包含每个脚本以及各组成部分如何协同工作。本页面介绍编辑一个页面所需了解的内容。

## 修复小问题

每个页面底部都有一个 **Edit this page**（编辑此页面）链接。它会在 GitHub 上打开该页面，您可以在浏览器中修改它并发起拉取请求（pull request）。对于拼写错误、病句或过时的信息，这就足够了。

页面是 Markdown 格式，位于 `src/content/docs/`。写作规则在仓库的 [`.github/copilot-instructions.md`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/copilot-instructions.md) 中：语言、Markdown 和 YAML 风格，以及网站的结构。

## 使用 AI 工具

写作规则同时也是 AI 工具的指令：`AGENTS.md` 和 `CLAUDE.md` 链接到它们。工作流以技能（skill）的形式存放在 `.github/skills/`（也可以通过 `.claude/skills/` 访问），例如用于添加或修改页面的 `write-page`、用于对照源仓库核查页面的 `fact-check`，以及用于审查变更的 `review`。Copilot 代码审查也遵循 `.github/instructions/` 中的检查清单，一份针对页面，一份针对网站代码。

其中最重要的规则是：绝不编造任何内容。本网站上的每一条陈述都需要有可供阅读的来源。[使用 AI 工具贡献](https://www.hasscn.top/contributors/start/ai-tools/#what-to-check-yourself-every-time)列出了能够发现审查中最常见错误的检查项。

## 在本地预览网站

对于比小修复更大的改动，请在您自己的机器上运行网站。

最简单的方法是使用开发容器（dev container）：网站所需的一切都是现成的，在 Windows、macOS 和 Linux 上都一样。在安装了 Docker 和 **Dev Containers** 扩展的 [VS Code](https://code.visualstudio.com/docs/devcontainers/containers) 中打开该仓库，然后选择 **Reopen in Container**。或者在仓库上启动 [GitHub Codespace](https://docs.github.com/en/codespaces)，它在浏览器中运行，您的机器上无需安装任何东西。无论哪种方式，依赖项都会在容器创建时安装好，您只需运行 `pnpm dev`。要运行与拉取请求相同的检查，请在 VS Code 中选择 **Terminal** > **Run Task**，然后选择 **Pull request checks**。

如果不使用开发容器，您需要 Node.js 24（版本号在 `.node-version` 中）和 pnpm。然后安装并启动网站：

```shell
pnpm install
pnpm dev
```

网站现在位于 `http://localhost:4321`，保存页面时会自动重新加载。搜索功能只在构建后可用：

```shell
pnpm build
pnpm preview
```

在发起拉取请求之前，请运行 `pnpm check`。它会检查代码和每个页面的 front matter。

## 添加页面

网站分为多个区域，例如 Core 和集成（integration），或 Design。每个区域是 `src/content/docs/` 中的一个文件夹，每个页面都放在其所属区域的文件夹中。子文件夹会成为侧边栏中的一个分组。页面最多只能放在一级子文件夹中。

每个页面都以 front matter 开头：

```yaml
---
title: "Fetch data"
description: "How your integration gets data from a device or a service."
order: 3
---
```

- `title` 是页面的标题。使用句首大写（sentence case）。
- `description` 显示在标题下方、搜索结果中以及链接预览中。
- `order` 决定页面在侧边栏中的位置，数值小的在前。没有 `order` 的页面排在最后，按标题排序。
- `sidebarLabel` 是侧边栏中较短的标签，用于标题过长的情况。
- `sidebarGroup` 将页面放入侧边栏中的一个命名分组，而不改变其 URL。文件夹的 `index.md` 可以通过 `sidebarGroups` 设置这些分组的顺序。

文件夹的 `index.md` 是它的概览页面。每个区域的结构都相同：概览、首次贡献、指南、参考，以及联系谁。在添加页面之前，先看看相邻的页面，并遵循它的做法。

## 术语表条目

在 Home Assistant 中有特定含义的词语，例如 [config entry](https://www.hasscn.top/contributors/glossary/config-entry/)，在[术语表](https://www.hasscn.top/contributors/glossary/)中都有一个页面。请使用这些术语；当某个术语缺失时，请在术语表中添加它，而不是在您的页面上解释。

术语可以自动链接：其页面 `autolink` 列表中的词语，在页面首次使用时会变成链接。只在那里添加无论出现在哪里都表示该术语的词语。在 `pnpm dev` 运行期间，对 `autolink` 列表的更改会重启服务器，因此每个页面都会获取新词语。

## 实时演示

[Design 区域](https://www.hasscn.top/contributors/design/)在页面上实时展示 Home Assistant 前端的真实组件，使用 MDX 页面中的 `<Demo>` 块。可以从现有的组件页面复制一个演示来开始。组件本身是从前端源码构建并提交的，因此您无需前端即可编辑页面。添加尚未构建的组件是维护者的工作：README 中有说明。

## 检查您的链接

链接到其他页面时使用完整路径和末尾斜杠，例如 `/design/foundations/color/`。要检查网站的所有链接，请构建网站并运行链接检查：

```shell
pnpm build
pnpm links
```

它会列出所有指向不存在页面或标题的链接，以及这些链接所在的页面。同样的检查会在每个拉取请求上运行。

## 移动或重命名页面

移动或重命名页面会改变其 URL，其他网站、书签和搜索引擎中指向旧 URL 的链接将会失效。因此：

1. 移动页面，并更新本网站上指向它的链接。`pnpm links` 可以找出您遗漏的链接。
2. 在您的拉取请求中提及每一个被移动的页面。

然后维护者会为旧 URL 添加重定向。重定向存放在仓库的 `redirects/` 文件夹中，每个区域一个小表，构建过程会将它们转换为网站的重定向。

重命名标题会改变其锚点（anchor），指向该标题的链接将落在页面顶部而不是原位置。当重命名能让页面更好时可以重命名标题，但要知道指向它的旧链接会失去定位。
