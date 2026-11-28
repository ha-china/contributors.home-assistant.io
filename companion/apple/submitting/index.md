# 提交 Apple 拉取请求

> Apple 仓库中的检查清单、拉取请求模板，以及审核过程中可以期待的内容。

Source: https://www.hasscn.top/contributors/companion/apple/submitting/

当你的更改准备就绪后，向 [home-assistant/iOS](https://github.com/home-assistant/iOS) 的 `main` 分支发起一个拉取请求（pull request）。

## 在发起之前

- **运行 autocorrect 和 lint**：先运行 `bundle exec fastlane autocorrect`，再运行 `bundle exec fastlane lint`。
- **运行测试**：`bundle exec fastlane test`。为你修改的行为添加或更新测试。记住[补丁覆盖率](https://www.hasscn.top/contributors/companion/apple/testing/#patch-coverage)门槛。
- **构建你改动过的部分。** 检查你的更改是否影响小组件、手表、CarPlay、扩展或 Mac。参见[目标](https://www.hasscn.top/contributors/companion/apple/targets/)。
- **保持改动小巧。** 每个拉取请求只包含一个想法。如果它变大了，就拆分成后续的拉取请求。
- **用 `Current.isTestFlight` 限制未完成的功能**，并同时发起移除该限制的草稿拉取请求。参见[每项更改的规则](https://www.hasscn.top/contributors/companion/apple/architecture/#rules-for-every-change)。
- **阅读 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)。** 你可以使用 AI 工具，但必须理解并能够解释你提交的所有内容。来自自主代理的拉取请求会被关闭。

## 拉取请求

不要删除模板中的任何内容。请填写：

- **AI 政策**：确认你已阅读，并准确选择一个描述你如何使用 AI 的选项。
- **摘要**：你更改了什么以及为什么。
- **截图**：针对前端之外的 UI 更改，需提供浅色和深色模式下的截图。
- **文档**：添加、更改或移除功能的更改需要在[用户文档](https://github.com/home-assistant/companion.home-assistant)中提交拉取请求。请附上链接。

草稿拉取请求是在一切完善之前，就方向或架构获取早期反馈的好方法。

## 审核

审核者会关注：

- 是否正确。
- 是否对其他目标造成回归。
- 测试覆盖率。
- 是否易于维护。
- 共享代码是否位于正确的模块中。

CI 是审核的一部分，而不是它的替代品。以聚焦的后续提交来处理评论，重新运行 linter 和测试，并在 CI 通过后请求再次审核。用自己的话回答维护者提出的问题。

## 保持你的分支最新

你不需要在 `main` 每次更新时都更新你的分支。只在有理由时更新：出现冲突、最近的更改导致 CI 失败，或者你需要 `main` 上的某个修复。在审核开始之前，rebase 是可以的。审核开始后，选择对现有讨论干扰最小的更新方式。

## 字符串

翻译在 [Lokalise](https://www.hasscn.top/contributors/translate/) 上管理。如果你添加或删除字符串，请保持生成的文件一致。不再使用的字符串会通过 **Lokalise: Delete Keys** 工作流从 Lokalise 和应用中移除，参见[持续集成](https://www.hasscn.top/contributors/companion/apple/ci/#on-your-pull-request)。
