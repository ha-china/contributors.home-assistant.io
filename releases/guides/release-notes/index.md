# 发布说明与发布派对

> 每月发布说明是如何完成的，你可以如何帮助改进它们，以及发布派对是什么。

Source: https://www.hasscn.top/contributors/releases/guides/release-notes/

每次发布都附带发布说明：这是 [home-assistant.io](https://www.home-assistant.io/) 上的一篇博客文章，解释了有哪些新内容、有哪些变化，以及人们需要做什么。对许多人来说，这是他们了解一次发布的唯一途径。把它做好非常重要。

## 发布说明包含什么

发布说明每个月都遵循相同的结构：

- **引言**，包含亮点，顶部还有发布派对的录像。
- **重大功能**，每个功能都有独立的章节、截图，通常还有一段短视频。
- **集成（integration）**：新增的集成、值得关注的改进、达到[质量分级（quality scale）](https://www.hasscn.top/contributors/glossary/quality-scale/)新级别的集成、现在可以从 UI 设置的集成，以及被移除的集成。
- **其他值得关注的变更**：值得了解的较小功能。
- **补丁版本（patch release）**：在当月添加，包含每个补丁版本的修复。
- **需要帮助？加入社区**：在哪里获取帮助，以及在哪里报告问题。
- **向后不兼容的变更**：每一条[向后不兼容的变更（backward-incompatible change）](https://www.hasscn.top/contributors/releases/guides/backward-incompatible-changes/)，按集成分组，并列出对自定义集成开发者重要的开发者博客文章。
- **所有变更**：指向完整变更日志的链接。

完整变更日志列出了该版本中每一个已合并的拉取请求（pull request）及其作者。它由发布团队使用 [release helper scripts](https://github.com/home-assistant/hass-release) 生成。

## 谁来撰写

发布说明由发布团队撰写，并得到其他人的帮助。提供帮助的人会在每次发布文章的顶部被点名致谢。撰写发布说明并不是一个公开的全民参与活动，但你可以通过多种方式提供帮助。

## 你可以如何帮助

- **写好拉取请求描述。** 发布说明的作者会阅读拉取请求来理解一个功能。清晰的描述，加上展示变更内容的截图，可以为他们节省大量时间。
- **写好向后不兼容的变更章节。** 它几乎会被原样复制到发布说明中。参见[记录向后不兼容的变更](https://www.hasscn.top/contributors/releases/guides/backward-incompatible-changes/)。
- **按时提交你的文档。** 没有文档的功能很难撰写，也很难链接。请将文档拉取请求提交到 home-assistant.io 的 `next` 分支，与代码一起提交。参见[撰写文档](https://www.hasscn.top/contributors/writing/)。
- **审阅 beta 版发布说明。** 在 beta 周期间，发布说明已经发布在 [rc.home-assistant.io](https://rc.home-assistant.io/latest-release-notes/) 上。发现错误、失效链接或不清楚的内容？请在 [Discord](https://www.home-assistant.io/join-chat/) 的 [**#beta**](https://discord.com/channels/330944238910963714/427516175237382144) 频道中报告，或在 [home-assistant.io](https://github.com/home-assistant/home-assistant.io) 上提交 issue 或拉取请求。

## 发布派对

在发布日，会有一场发布派对：在 [Home Assistant YouTube 频道](https://youtube.com/@home_assistant)上进行的直播。[Open Home Foundation](https://www.hasscn.top/contributors/glossary/open-home-foundation/) 的 Home Assistant 团队和社区团队会共同筹备。他们会介绍新内容，并展示功能的实际运行。有时还会有嘉宾加入，谈论他们所做的工作。

录像随后会嵌入到发布说明的顶部，方便你之后观看。

## 补丁版本发布说明

补丁版本没有自己的博客文章。它们的变更会被添加到当月的发布说明中，位于**补丁版本**部分之下，并附上日期和修复列表。
