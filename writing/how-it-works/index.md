# 文档是如何运作的

> 页面存放在哪里、应使用哪个分支，以及一次更改如何从拉取请求（pull request）变为 home-assistant.io 上的内容。

Source: https://www.hasscn.top/contributors/writing/how-it-works/

文档和 [home-assistant.io](https://www.home-assistant.io/) 的其余部分都存放在同一个 GitHub 仓库中：[home-assistant/home-assistant.io](https://github.com/home-assistant/home-assistant.io)。该网站使用 [Jekyll](https://jekyllrb.com/) 构建。页面是 Markdown 文件，并使用一些 [Liquid 辅助工具](https://www.hasscn.top/contributors/writing/reference/liquid/) 来实现诸如链接到 Home Assistant 界面等功能。

## 页面存放在哪里

所有内容都在 `source` 文件夹中。你最常打交道的部分：

- `source/_integrations`：每个集成（integration）一个页面，以其域名命名，例如 `hue.markdown`。
- `source/_docs`：通用文档，例如自动化、脚本和备份指南。
- `source/_dashboards`：仪表盘（dashboard）和卡片。
- [`source/_data/glossary.yml`](https://github.com/home-assistant/home-assistant.io/blob/current/source/_data/glossary.yml)：术语提示背后的术语表。
- `source/_redirects`：页面移动后旧 URL 的重定向位置。
- [`source/_includes/asides/docs_sitemap.html`](https://github.com/home-assistant/home-assistant.io/blob/current/source/_includes/asides/docs_sitemap.html)：通用文档的侧边栏。它由人工维护，因此 `source/_docs` 中需要在侧边栏占位的新页面会在那里添加一个链接。

## 分支

该仓库有两个可供选择的分支：

- **`current`** 是人们当前使用的发行版所对应的文档。对现有文档的修复和改进应以此为目标分支。
- **`next`** 是即将发布的发行版所对应的文档。当你为尚未发布的新集成或新功能撰写文档时，应以此为目标分支。

选择正确的分支很重要：`next` 上的更改只有在下一个发行版发布后才会生效。拉取请求模板会提醒你，机器人也会提醒：当基础分支与你的拉取请求不匹配时，它会添加 `needs-rebase` 标签并留下一条评论，告诉你应使用哪个分支。

要为来自核心（core）拉取请求的新功能撰写文档？请为每个核心拉取请求打开一个对应的文档拉取请求，并将它们相互链接。这样两者就可以在同一个发行版中一起合并。

## 父拉取请求

记录代码更改的文档拉取请求有一个_父级_：包含该代码更改的拉取请求，位于 core 或 frontend 等仓库中。请双向链接它们：在你的文档拉取请求的 **This PR belongs together with** 下列出父级，并在父级的同一行中列出你的文档拉取请求。

机器人会跟踪这些链接，并为你的文档拉取请求添加标签：

- `has-parent`：你的拉取请求及其父级相互列出。列出代码拉取请求的拉取请求预期以 `next` 为目标，而没有列出的则预期以 `current` 为目标。
- `parent-merged`：父级已合并，因此文档可以跟进。
- `needs-rebase`：拉取请求的目标分支错误。更改基础分支，并在需要时进行变基（rebase）。

你还可能看到 `awaits-parent`，这表示该拉取请求正在等待其父拉取请求合并。

机器人也会让两个拉取请求保持同步。当你的拉取请求只有一个父级，且父级在未合并的情况下被关闭时，你的文档拉取请求也会被关闭。当父级被重新打开时，你的也会被重新打开。

因此，`next` 上的文档拉取请求会等待其父拉取请求。这可能需要一段时间，这没有问题：带有 `has-parent` 标签的拉取请求永远不会被标记为过期（stale）。

## 从拉取请求到上线

1. 你打开一个拉取请求。
2. 自动检查运行：remark 检查 Markdown，textlint 检查拼写和术语，并构建网站的 Astro 部分。详情请参阅[自动检查](https://www.hasscn.top/contributors/writing/reference/checks/)。
3. Netlify 会构建包含你的更改的完整网站的 **Deploy Preview**。
4. 维护者审查该更改。
5. 一旦合并到 `current`，Netlify 就会将更改发布到 home-assistant.io。`next` 上的更改会随发行版发布而上线。

60 天内没有活动的拉取请求和议题（issue）会被标记为过期，并在 7 天后被关闭，除非有新的动静。一条评论或一个新的提交就足以让它们保持打开状态。
