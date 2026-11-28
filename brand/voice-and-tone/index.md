# 语气与风格

> Home Assistant 的个性在文档、界面、错误消息、社区回复、发布说明和社交媒体中如何呈现。

Source: https://www.hasscn.top/contributors/brand/voice-and-tone/

[个性](https://www.hasscn.top/contributors/brand/personality/)是 Home Assistant 是谁。语气（voice）则是这个“人”在写作时听起来的样子。无论你撰写一页文档、一个按钮标签，还是在[论坛](https://community.home-assistant.io/)上的一条回复，语气都是一致的。变化的是风格（tone）：错误消息需要与发布公告不同的风格。

本页介绍语气在每个场景中的运用。详细的规则，如语法、大小写和格式，见文档的[风格指南](https://www.hasscn.top/contributors/writing/reference/style/)，界面的规则见 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。本页不再重复这些内容。

## 通用原则

无论在哪里写作，以下几点都适用：

- **与读者对话。** 使用“你”和“你的”，而不是“用户”或“用户们”。
- **面向全世界写作。** 使用美式英语，句子简短，用词平实。许多读者的第一语言并不是英语。
- **友好且信息丰富。** 不要过于正式，也不要比必要的更技术化。
- **包容。** 保持写作客观，不带偏见，不包含任何排斥他人的内容。
- **完整书写"Home Assistant"。** 不要使用"HA"或"HASS"。参见[名称与标志](https://www.hasscn.top/contributors/brand/name-and-logo/)。
- **使用术语表中的词汇。** 按照[术语表](https://www.hasscn.top/contributors/glossary/)定义的方式使用术语，不要使用已弃用的名称，例如用"service"指代[动作（action）](https://www.hasscn.top/contributors/glossary/action/)、用"add-on"指代应用，或用"Lovelace"指代仪表盘（dashboard）。

## 文档

[home-assistant.io](https://www.home-assistant.io/) 上的文档往往是人们最先阅读的内容，它面向广泛的受众。大多数读者通过界面使用 Home Assistant，其中许多人并不是开发者。

- **热情友好**：假设读者主要使用 UI。先展示通过界面操作的路径，将 YAML、模板和代码作为供有需要的人使用的可选路径。
- **坦诚直率**：不要用营销语言掩盖局限性或复杂性。如实说明某项功能能做什么、不能做什么。
- **给予支持**：让 Home Assistant 显得平易近人。避免让它听起来脆弱、困难或容易损坏的措辞。
- **慷慨大方**：为读者提供他们所需的内容，先讲基础，后讲细节，不要让读者迷失其中。
- **不设门槛**：不要将 YAML 或更复杂的功能标记为“高级”，除非产品本身使用了这个词。

同样的风格也适用于 home-assistant.io 上的博客文章。参见[撰写文档](https://www.hasscn.top/contributors/writing/)和[风格指南](https://www.hasscn.top/contributors/writing/reference/style/)。

## 界面文本

标签、按钮、对话框和辅助文本往往在一秒钟内被读完，而且常常是在用户正忙于其他事情的时候。

- 简洁清晰，使用主动语态。
- 同时面向技术型和非技术型读者。在熟悉的家庭自动化术语可用时，避免使用行话。
- 在合适的情况下，直接用“你”和“你的”称呼用户。
- 选择与实际发生的情况相符的词，例如可恢复的操作用"remove"（移除），永久删除的操作用"delete"（删除）。参见[移除还是删除](https://www.hasscn.top/contributors/design/ui-text/remove-delete/)。

完整的指南和示例见 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。界面中的每个字符串都会被翻译，因此在添加字符串时请参见[让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)。

## 错误消息

错误是最能体现个性的时刻：指南将错误说明的方式列为体现热情友好的细节之一。此时有人被卡住了，想要继续前进。

- **热情友好**：用平实的语言解释出了什么问题，让不了解代码的人也能明白。
- **坦诚直率**：如实说明发生了什么。不要用模糊的消息掩盖局限性。
- **给予支持**：在有下一步可做时，说明该怎么做。

[消息](https://www.hasscn.top/contributors/design/ui-text/messages/)详细介绍了错误、警告、修复和空状态。

## 社区回复

社区如何与新手交流是指南中另一个被点名强调的场景。论坛、[Discord](https://www.home-assistant.io/join-chat/) 或拉取请求（pull request）中的回复都代表着 Home Assistant 在说话，即使你是以个人身份撰写的。

- **热情友好**：在对方的水平上交流，绝不居高临下。每个人都是从新手开始的。
- **给予支持**：帮助人们前进而不越俎代庖。指出确切能帮到他们的页面，并解释原因。
- **坦诚但不生硬**：当某事不可行时如实相告，但表达方式要友善。

[欢迎新手](https://www.hasscn.top/contributors/community/guides/welcome-newcomers/)提供了实用建议，[行为准则](https://www.hasscn.top/contributors/start/code-of-conduct/)适用于所有场合。

## 发布说明和博客文章

发布说明解释了有哪些新功能、有什么变化，以及人们需要做什么。对许多人来说，这是他们了解一个版本所阅读的唯一内容。

- **坦诚直率**：对[不向后兼容的变更（backward-incompatible change）](https://www.hasscn.top/contributors/glossary/backward-incompatible-change/)以及人们需要采取的措施直言不讳。不要把它们藏在亮点之后。
- **慷慨大方**：通过截图或短视频展示某项功能能为用户的家庭带来什么，并链接到文档。
- **不设门槛**：可以直截了当，可以有点不走寻常路，不必把自己看得太严肃。Home Assistant 不需要听起来像一个企业科技品牌。

有关发布说明如何成文，请参见[发布说明与发布派对](https://www.hasscn.top/contributors/releases/guides/release-notes/)。

## 社交媒体

只有[官方账号](https://www.hasscn.top/contributors/community/guides/social-media/#the-official-accounts)才能代表 Home Assistant 发言。当你用自己的账号分享 Home Assistant 时，你是以个人身份发言，但同样的个性依然适用：友好，如实说明哪些可行、哪些不可行，并且友善。行为准则同样适用于社交媒体。可以有不同意见，但不可以起哄围攻。

参见[在社交媒体上提供帮助](https://www.hasscn.top/contributors/community/guides/social-media/)。
