# 向后不兼容的变更

> 一种需要用户或开发者在他们那一侧做出更改的变更，例如修改他们的配置或自定义集成。

Source: https://www.hasscn.top/contributors/glossary/backward-incompatible-change/

- In code: `breaking-change (label)`
- Also: backward-incompatible changes
- Formerly: breaking change (old name: don't use it in new text)

带有向后不兼容变更的拉取请求（pull request）如果可能影响用户，会获得 `breaking-change` 标签，并在其描述中说明变更内容及应对措施。该文本会出现在发布说明的**向后不兼容的变更**部分。在弃用期结束后移除已弃用的核心 API，且仅自定义集成仍可使用该 API 时，不会获得此标签：这些开发者会在开发者博客上得知相关信息。[记录向后不兼容的变更](https://www.hasscn.top/contributors/releases/guides/backward-incompatible-changes/#when-it-is-backward-incompatible) 中有详细说明。

Home Assistant Core 的拉取请求模板和该标签将其称为“breaking change”。两者含义相同。发布说明将其称为向后不兼容变更，你所撰写的一切内容也应如此。

在可能的情况下，变更不会立即成为向后不兼容的：它会先经历[弃用（deprecation）](https://www.hasscn.top/contributors/glossary/deprecation/)阶段。

## Related terms

- [弃用（Deprecation）](https://www.hasscn.top/contributors/glossary/deprecation/): 宣布某项内容将在后续版本中移除，在此之前它仍可正常工作，以便人们有时间进行迁移。
- [发布（Release）](https://www.hasscn.top/contributors/glossary/release/): Home Assistant 的新版本。每月第一个星期三发布一个新版本，期间还会有补丁发布。
- [拉取请求（Pull request）](https://www.hasscn.top/contributors/glossary/pull-request/): 在 GitHub 上将更改合并到代码仓库的请求，合并前会先进行审查。
