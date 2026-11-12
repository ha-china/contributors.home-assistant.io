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

Pull requests with a backward-incompatible change that can affect users get the `breaking-change` label, and explain in their description what changes and what to do about it. That text ends up in the **Backward-incompatible changes** section of the release notes. Removing a deprecated core API after its deprecation period, when only custom integrations can still use it, does not get the label: those developers hear about it on the developer blog instead. [Document a backward-incompatible change](/releases/guides/backward-incompatible-changes/#when-it-is-backward-incompatible) has the details.

Home Assistant Core 的拉取请求模板和该标签将其称为“breaking change”。两者含义相同。发布说明将其称为向后不兼容变更，你所撰写的一切内容也应如此。

在可能的情况下，变更不会立即成为向后不兼容的：它会先经历[弃用（deprecation）](/glossary/deprecation/)阶段。
