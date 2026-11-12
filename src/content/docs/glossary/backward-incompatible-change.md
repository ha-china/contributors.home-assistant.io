---
title: "向后不兼容的变更"
description: "一种需要用户或开发者在他们那一侧做出更改的变更，例如修改他们的配置或自定义集成。"
sidebarGroup: "Contributing"
term:
  aliases:
    - "backward-incompatible changes"
  code:
    - "breaking-change (label)"
  formerly:
    - "breaking change"
  related:
    - "deprecation"
    - "release"
    - "pull-request"
  autolink:
    - "backward-incompatible change"
    - "backward-incompatible changes"
---

带有向后不兼容变更的拉取请求（pull request）如果可能影响用户，会获得 `breaking-change` 标签，并在其描述中说明变更内容及应对措施。该文本会出现在发布说明的**向后不兼容的变更**部分。在弃用期结束后移除已弃用的核心 API，且仅自定义集成仍可使用该 API 时，不会获得此标签：这些开发者会在开发者博客上得知相关信息。[记录向后不兼容的变更](/releases/guides/backward-incompatible-changes/#when-it-is-backward-incompatible) 中有详细说明。

Home Assistant Core 的拉取请求模板和该标签将其称为“breaking change”。两者含义相同。发布说明将其称为向后不兼容变更，你所撰写的一切内容也应如此。

在可能的情况下，变更不会立即成为向后不兼容的：它会先经历[弃用（deprecation）](/glossary/deprecation/)阶段。
