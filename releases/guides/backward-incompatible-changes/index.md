# 记录不向后兼容的变更

> 当你的变更意味着用户需要做某些操作时，告诉他们什么会失效、如何修复以及原因。这些文字会出现在发布说明中。

Source: https://www.hasscn.top/contributors/releases/guides/backward-incompatible-changes/

不向后兼容的变更（backward-incompatible change）是指要求人们在更新后在自己这边做某些操作的变更，比如修改他们的配置、自动化（automation）或仪表盘（dashboard）。Home Assistant 会尽力避免这类变更。当无法避免时，必须把它解释清楚，因为成千上万的人会在更新前阅读它。

## 尽量避免它

在编写不向后兼容的变更之前，先检查是否可以避免它：

- 旧的方式能否在一段时间内与新方式并存继续工作？那么它是一个[弃用（deprecation）](https://www.hasscn.top/contributors/releases/guides/deprecations/)，还不是不向后兼容的变更。
- Home Assistant 能否自动迁移旧配置？那么任何人都不需要做任何事。

## 何时属于不向后兼容的变更

要问的问题是：这个变更是否会在用户更新后立即影响到他们？当出现以下情况时，请将你的拉取请求标记为不向后兼容的变更，填写 **Breaking change** 部分并添加 `breaking-change` 标签：

- 它立即破坏了某些功能，且没有事先[弃用（deprecation）](https://www.hasscn.top/contributors/releases/guides/deprecations/)。用户没有提前收到通知，也没有机会在更新前采取行动。
- 它在弃用期结束后移除了集成中的某些内容。用户曾通过[修复（repair）](https://www.hasscn.top/contributors/glossary/repair/)收到警告，但有些人可能没有采取行动，移除仍然会影响他们。

在以下情况下不要标记：

- 没有任何功能被破坏。
- 它在弃用期结束后移除了已弃用的[核心 API](https://www.hasscn.top/contributors/core/development/deprecating/#developer-facing-deprecations)，例如辅助元素或常量，并且 Home Assistant Core 中不再有任何集成或其他代码使用它。只有自定义集成可能仍然受到影响，而它们的开发者在弃用开始时已在[开发者博客](https://www.hasscn.top/contributors/blog/)上收到通知。

最短弃用期——用户可见内容为 6 个月，核心 API 为 12 个月——请参阅[弃用某些内容](https://www.hasscn.top/contributors/releases/guides/deprecations/#how-long)。

## 标记拉取请求

[核心仓库](https://github.com/home-assistant/core)的拉取请求模板包含一个变更类型清单。当现有功能如上所述对用户造成破坏时，勾选 **Breaking change**；当破坏发生在未来版本时，勾选 **Deprecation**。拉取请求随后会获得 `breaking-change` 标签，这会使你的文字出现在发布说明中。

## 编写不向后兼容的变更部分

拉取请求模板以一个 **Breaking change** 部分开头。模板说得很直白：告诉用户什么会失效、如何让它重新工作，以及原因。这些文字会随发布说明一起发布，所以要为用户而写，而不是为开发者。

一个好的不向后兼容的变更部分会回答三个问题：

1. **什么变了？** 描述用户看到的东西，而不是代码。“`uptime` 传感器已被移除”是可以的。“重构了传感器平台”则不行。
2. **我需要做什么？** 给出具体步骤。如果用户需要修改 YAML，请展示新的 YAML。
3. **为什么？** 一两句话就够了。当人们理解了原因，就更容易接受变更。

例如：

```markdown
The **Subscribed to Xbox Game Pass** binary sensor has been removed,
because it never worked. The Xbox API always reported `false`, whether
you were subscribed to Game Pass or not.

If you use this binary sensor in an automation or a dashboard, remove it.
```

## 提示

- 写作时要让不了解该集成（integration）的人也能看懂。很多人会阅读每一条不向后兼容的变更，只是为了确认它是否影响自己。
- 使用用户在 UI 中看到的名称，指明发生变化的集成以及实体（entity）、操作（action）或选项。
- 不要掩盖失效。如果有东西停止工作，请在第一句话中说明。
- 当变更在审查过程中发生演变时，保持拉取请求中的该部分内容为最新。
- 遵循[用户文档的写作风格](https://www.hasscn.top/contributors/writing/reference/style/)。发布说明也使用这种风格。

## 你的文字会怎样处理

在准备发布时，发布团队会收集所有带有 `breaking-change` 标签的已合并拉取请求中的不向后兼容的变更部分。它们会出现在发布说明的 **Backward-incompatible changes** 之下，按集成分组，并附上指向你的拉取请求和文档的链接。发布说明的作者可能会为了清晰和一致而编辑你的文字。

只影响开发者的不向后兼容的变更，比如 Python API 的变更，会改为发布在开发者博客上。发布说明会链接到这些文章。
