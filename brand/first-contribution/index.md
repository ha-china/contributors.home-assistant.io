# 你的第一次品牌贡献

> 选择一个页面或一段界面文本，对照 Home Assistant 的个性来阅读它，并加以改进。

Source: https://www.hasscn.top/contributors/brand/first-contribution/

品牌本身并不是你直接贡献的对象。它体现在其他一切事物中：一页文档、一个对话框、一条错误消息。因此，最好的第一次贡献是微小而具体的：选取一段文本，带着品牌个性去阅读它，然后让它变得更好。

不需要设计技能或编程知识，只需要一个 GitHub 账号。对于文档，你可以在浏览器中亲自完成修改。对于界面文本，你可以指出问题所在并让开发者去修改，或者如果你熟悉代码仓库，也可以亲自修改。

## 1. 阅读品牌个性

通读一遍[个性](https://www.hasscn.top/contributors/brand/personality/)。注意每个特质“不是什么”的列表。它们能帮你发现某个特质被推得太过了：坦率变成了生硬，支持变成了居高临下，热情变成了谄媚。

## 2. 选择要阅读的内容

从你非常熟悉的内容开始，这样你才能判断它是否正确：

- **一页文档**，位于 [home-assistant.io](https://www.home-assistant.io/) 上，关于你自己设置过的内容。
- **一段界面文本**，比如你遇到过的对话框或错误消息。

保持在一个页面或一个对话框的范围内。小的修改更容易被审阅。

## 3. 对照特质来阅读

阅读时问自己几个问题：

- **热情**：它是否以读者能理解的水平与他们交流，还是居高临下？它是否假设了读者可能不具备的知识？
- **坦率**：它是否表达了真正的意思？它是否隐瞒了某个限制，或者把某件事说得比实际更简单？
- **支持**：当出现问题时，它是否说明了下一步该怎么做？
- **慷慨**：它是否把读者需要的内容提供给他们，而不是把它埋没起来？
- **独立**：它听起来像 Home Assistant，还是像一个企业科技品牌？

同时检查基本规范："Home Assistant" 是否完整书写，是否用 "select" 而不是 "click"，术语是否按照[术语表](https://www.hasscn.top/contributors/glossary/)的定义使用。[语气和语调](https://www.hasscn.top/contributors/brand/voice-and-tone/)展示了这些特质在不同类型文本中的表现。

## 4. 进行修改

在哪里修改取决于你选择的内容：

- **文档**：home-assistant.io 上的每个页面都有一个 **Edit** 链接。[你的第一次文档修复](https://www.hasscn.top/contributors/writing/first-contribution/)会引导你直接在浏览器中完成操作。
- **界面文本，不写代码**：在[前端仓库](https://github.com/home-assistant/frontend/issues)中提交一个 issue，说明所在的界面、引用当前的文本，并建议你的版本。或者，如果你不确定合适的措辞，可以先把它带到 [Home Assistant Discord](https://www.home-assistant.io/join-chat-design) 的 [**#designers**](https://discord.com/channels/330944238910963714/1463606665311158284) 频道。在建议新措辞之前，请先阅读 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。
- **界面文本，以 pull request 形式**：界面的英文文本位于[前端仓库](https://github.com/home-assistant/frontend)的 [`src/translations/en.json`](https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json) 中，而集成的文本位于[核心仓库](https://github.com/home-assistant/core)中该集成的 `strings.json` 里。这些是代码仓库：在那里提交 pull request 会运行自动化检查，并且需要签署[贡献者许可协议](https://www.hasscn.top/contributors/start/licensing/)（Contributor License Agreement），机器人会在你第一次提交时要求签署。

不要在翻译工具中修改英文文本。翻译人员以英文源文本为依据，所以请在英文源文本中修复，翻译会随之更新。

在你的 issue 或 pull request 中，解释哪里感觉不对，以及为什么你的版本更好。指出相关的特质会很有帮助：“原文隐瞒了这只能在本地使用的事实，所以我让它对此保持坦率”，这样的说明很容易审阅。

刚接触 GitHub？请参阅[使用 GitHub，无需成为开发者](https://www.hasscn.top/contributors/start/github/)。

## 接下来做什么

- 阅读[语气和语调](https://www.hasscn.top/contributors/brand/voice-and-tone/)，了解品牌个性在其他地方的表现。
- 喜欢改进文字？[写作文档](https://www.hasscn.top/contributors/writing/)区域和 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)还有很多事情可做。
- 会说其他语言？在[翻译](https://www.hasscn.top/contributors/translate/)中把同样的语气带到那种语言中。
