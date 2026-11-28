# 编写文档

> 通过改进 home-assistant.io 上的文档，帮助数百万人更好地使用 Home Assistant。

Source: https://www.hasscn.top/contributors/writing/

[home-assistant.io](https://www.home-assistant.io/) 上的文档往往是人们在设置设备、构建自动化（automation）或遇到问题时最先阅读的内容。那里的每一页都由社区撰写和改进。一句更清晰的表述、一个缺失的步骤，或一张修复的截图，都能帮助在你之后阅读该页面的每一个人。

你不需要是开发者。只要你能把事情讲清楚，你就能提供帮助。

想改进这个贡献者网站？请参阅[改进此贡献者网站](https://www.hasscn.top/contributors/writing/this-site/)。

## 你为谁写作

大多数阅读文档的人是通过 Home Assistant 的界面来使用它的，而不是通过 YAML 文件。请优先为他们写作：展示在 UI 中的操作路径，同时保留技术细节供需要的人查阅。[风格指南](https://www.hasscn.top/contributors/writing/reference/style/)解释了具体做法。

## 两种贡献方式

- **小修小补**只需几分钟，而且完全可以在浏览器中完成。比如一个错别字、一张过时的截图、一个与 UI 不再相符的步骤。每个页面都有一个 **Edit**（编辑）链接。
- **较大的改动**，比如新页面或重构某个章节，使用网站的本地副本会更方便，这样你可以在分享之前预览你的工作。

## 使用 AI 工具写作

[文档仓库](https://github.com/home-assistant/home-assistant.io)在 `.claude/skills/` 中为 AI 工具提供了技能（skills）：一个用于写作风格，一个用于 Markdown 和 Liquid，一个用于 YAML 示例，以及用于集成（integration）页面的 `document-integration-docs`。仓库的指令会告诉智能体（agent）在编辑前先加载这些技能，并且除非你要求，否则不要凭空编造新的自动化、脚本或仪表盘（dashboard）示例。页面上的每一处论断仍需你对照代码进行核实。[使用 AI 工具贡献](https://www.hasscn.top/contributors/start/ai-tools/#write-documentation-on-home-assistantio)介绍了完整的工作流程。

## 从这里开始

- [你的第一个文档修复](https://www.hasscn.top/contributors/writing/first-contribution/)：直接在浏览器中修复一个小问题。
- [文档是如何运作的](https://www.hasscn.top/contributors/writing/how-it-works/)：页面存放在哪里、该使用哪个分支，以及改动如何上线。

## 指南

- [组织页面结构](https://www.hasscn.top/contributors/writing/guides/structure/)：概念、任务、参考，以及何时使用哪一种。
- [在本地预览网站](https://www.hasscn.top/contributors/writing/guides/local-preview/)：在你自己的电脑上运行文档。
- [编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)：面向添加新集成的开发者。
- [移动、重命名或删除页面](https://www.hasscn.top/contributors/writing/guides/move-or-remove/)：同时不破坏链接。

## 参考

- [风格指南](https://www.hasscn.top/contributors/writing/reference/style/)：语言、语气和格式。
- [图片和视频](https://www.hasscn.top/contributors/writing/reference/images/)：截图、说明文字和嵌入的视频。
- [Liquid 辅助工具](https://www.hasscn.top/contributors/writing/reference/liquid/)：My 链接、术语提示和文本框。
- [YAML 风格](https://www.hasscn.top/contributors/writing/reference/yaml/)：YAML 示例应如何编写。
- [自动化检查](https://www.hasscn.top/contributors/writing/reference/checks/)：你的拉取请求（pull request）上的检查会检查什么。
- [集成 front matter](https://www.hasscn.top/contributors/writing/reference/front-matter/)：集成页面顶部的每一个键。
- [集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)：集成页面的各个章节，以及用于填充它们的区块。
- [品牌](https://www.hasscn.top/contributors/brand/)：Home Assistant 的个性与声音，每一页都应体现这一点。

## 与谁交流

- 读者通过 **Provide feedback**（提供反馈）链接在页面上留下反馈。这些反馈会成为 [GitHub 上的 issue](https://github.com/home-assistant/home-assistant.io/issues)，是寻找可做事项的好地方。
- 对你的改动有疑问？在你的拉取请求中提问。审阅者很乐意帮你把它改好。
- 想聊聊文档？加入 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 [**#documentation**](https://discord.com/channels/330944238910963714/1475552849835458691) 频道。
