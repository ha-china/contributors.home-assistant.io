---
title: 文档是如何运作的
description: 页面存放在哪里、应使用哪个分支，以及一次更改如何从拉取请求（pull request）变为 home-assistant.io 上的内容。
order: 2
sidebarLabel: 运作方式
---

文档和 [home-assistant.io](https://www.home-assistant.io/) 的其余部分都存放在同一个 GitHub 仓库中：[home-assistant/home-assistant.io](https://github.com/home-assistant/home-assistant.io)。该网站使用 [Jekyll](https://jekyllrb.com/) 构建。页面是 Markdown 文件，并使用一些 [Liquid 辅助工具](/writing/reference/liquid/) 来实现诸如链接到 Home Assistant 界面等功能。

## 页面存放在哪里

所有内容都在 `source` 文件夹中。你最常打交道的部分：

- `source/_integrations`：每个集成（integration）一个页面，以其域名命名，例如 `hue.markdown`。
- `source/_docs`：通用文档，例如自动化、脚本和备份指南。
- `source/_dashboards`：仪表盘（dashboard）和卡片。
- `source/_data/glossary.yml`：术语提示背后的术语表。
- `source/_redirects`：页面移动后旧 URL 的重定向位置。
- `source/_includes/asides/docs_sitemap.html`：通用文档的侧边栏。它由人工维护，因此 `source/_docs` 中需要在侧边栏占位的新页面会在那里添加一个链接。

## 分支

该仓库有两个可供选择的分支：

- **`current`** 是人们当前使用的发行版所对应的文档。对现有文档的修复和改进应以此为目标分支。
- **`next`** 是即将发布的发行版所对应的文档。当你为尚未发布的新集成或新功能撰写文档时，应以此为目标分支。

选择正确的分支很重要：`next` 上的更改只有在下一个发行版发布后才会生效。拉取请求模板会提醒你，机器人也会提醒：当基础分支与你的拉取请求不匹配时，它会添加 `needs-rebase` 标签并留下一条评论，告诉你应使用哪个分支。

要为来自核心（core）拉取请求的新功能撰写文档？请为每个核心拉取请求打开一个对应的文档拉取请求，并将它们相互链接。这样两者就可以在同一个发行版中一起合并。

## 父拉取请求

A documentation pull request that documents a code change has a _parent_: the pull request with that code change, in a repository like core or frontend. Link them both ways: list the parent under **This PR belongs together with** in your documentation pull request, and your documentation pull request on the same line of the parent.

机器人会跟踪这些链接，并为你的文档拉取请求添加标签：

- `has-parent`: your pull request and its parent list each other. A pull request that lists a code pull request is expected to target `next`, and one without is expected to target `current`.
- `parent-merged`: the parent is merged, so the documentation can follow.
- `needs-rebase`: the pull request targets the wrong branch. Change the base branch, and rebase if needed.

你还可能看到 `awaits-parent`，这表示该拉取请求正在等待其父拉取请求合并。

The bot keeps both pull requests in step, too. When your pull request has a single parent and the parent is closed without being merged, your documentation pull request is closed as well. When the parent is reopened, so is yours.

因此，`next` 上的文档拉取请求会等待其父拉取请求。这可能需要一段时间，这没有问题：带有 `has-parent` 标签的拉取请求永远不会被标记为过期（stale）。

## 从拉取请求到上线

1. 你打开一个拉取请求。
2. 自动检查运行：remark 检查 Markdown，textlint 检查拼写和术语，并构建网站的 Astro 部分。详情请参阅[自动检查](/writing/reference/checks/)。
3. Netlify 会构建包含你的更改的完整网站的 **Deploy Preview**。
4. 维护者审查该更改。
5. 一旦合并到 `current`，Netlify 就会将更改发布到 home-assistant.io。`next` 上的更改会随发行版发布而上线。

60 天内没有活动的拉取请求和议题（issue）会被标记为过期，并在 7 天后被关闭，除非有新的动静。一条评论或一个新的提交就足以让它们保持打开状态。
