# UI 文本

> 界面如何说话。Home Assistant 的语气、风格和用词，适用于每一位编写标签、按钮或错误信息的人。

Source: https://www.hasscn.top/contributors/design/ui-text/

每一个标签、按钮、错误信息和空状态都是设计决策。好的 UI 文本能帮助人们理解正在发生什么、接下来该做什么，而且往往让人察觉不到它的存在。

当你设计一个界面时会编写 UI 文本，构建界面时同样会：在前端中，以及在集成的 `strings.json` 中。同样的准则适用于这两种场景。

## Home Assistant 如何说话

UI 文本遵循 Home Assistant 的[个性](https://www.hasscn.top/contributors/brand/personality/)。在界面中，这五个特质体现在细微之处：

- **Welcoming（热情友好）**：以对方能理解的方式交流，绝不居高临下。这体现在错误信息的解释方式上。
- **Candid（坦诚直率）**：有话直说。不要用虚假的简单性掩盖复杂性，也不要假装限制不存在。
- **Supportive（乐于支持）**：引导人们向前，而不是越俎代庖。
- **Generous（慷慨大方）**：给予人们控制权和透明度。不使用欺骗性设计。
- **Independent（独立自主）**：Home Assistant 不需要听起来像一个老牌科技品牌。

同样的语气在界面之外（如文档和社区回复中）如何体现，请参阅[语气与风格](https://www.hasscn.top/contributors/brand/voice-and-tone/)。

## 风格

- 使用美式英语写作，语气友好且信息明确。
- 直接与用户对话，在合适的地方使用"你"和"你的"。
- 简洁清晰。使用主动语态。
- 同时为技术人员和非技术人员写作。在常用的家庭自动化术语可以表达清楚时，避免使用行话。
- 标题、按钮、标签以及界面中的所有其他内容都使用句首大写（sentence case）："Create new automation"，而不是"Create New Automation"；"Device settings"，而不是"Device Settings"。
- 完整地写"Home Assistant"。绝不使用"HA"或"HASS"。
- 使用"like"或"for example"，而不是拉丁语缩写。
- 在列表中使用牛津逗号（Oxford comma）。
- 不要使用全大写来强调。
- 在集成的文本中，用反引号包裹类似代码的值，例如实体（entity）ID 和文件名。品牌和协议名称按照其所有者的写法书写，例如 Z-Wave 和 MQTT，不加反引号。

## 用词

- 一个事物只有一个名称。[术语表](https://www.hasscn.top/contributors/glossary/)列出了 Home Assistant 使用的术语，以及不应再使用的旧名称，例如用"service"指代[操作（action）](https://www.hasscn.top/contributors/glossary/action/)。
- 产品术语在句子中使用小写：automation、entity、device。
- 在与 Home Assistant 用户交流时，说"integration"，而不是"component"。
- 选择与用户实际操作相符的词。"Join"或"Apply"可能比"Group"表达得更准确。

## 指南

- [按钮和标签](https://www.hasscn.top/contributors/design/ui-text/buttons-and-labels/)：按钮上的文字、对话框标题以及字段旁的说明。
- [消息](https://www.hasscn.top/contributors/design/ui-text/messages/)：错误、警告、空状态、确认和成功消息。
- [移除、删除、添加或创建](https://www.hasscn.top/contributors/design/ui-text/remove-delete/)：四个容易混淆的词。

## 翻译

所有 UI 文本都会被翻译成数十种语言，因此编写时必须让翻译人员能够顺利处理：

- 用户看到的每个字符串都要经过翻译系统。代码本身不包含任何文本。
- 使用占位符表示值，并保持句子完整。绝不将翻译后的片段拼接在一起。
- 通过清晰的键名和占位符名称为翻译人员提供上下文。
- 在集成中，如果已有适用于相同文本的通用翻译键，请复用它。

[让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)包含详细说明。文档的[风格指南](https://www.hasscn.top/contributors/writing/reference/style/)同样适用于 UI 文本，例如用"select"而不是"click"。
