---
title: 弃用某些功能
description: Home Assistant 的弃用政策、它对使用者意味着什么，以及弃用如何在发布说明中呈现。
order: 3
---

[弃用](/glossary/deprecation/)（deprecation）是一种计划在未来进行的、不向后兼容的变更。旧方式在一段时间内仍然可用，所有使用它的人都会收到警告，只有在这段时间过后它才会被移除。这让人们可以按照自己的节奏进行迁移。

本页面介绍的是这项政策，以及它对用户和发布说明意味着什么。关于如何在代码中弃用某些内容，包括修复问题（repair issues）、翻译字符串以及正确的严重级别，请参阅 Core 与集成部分：[弃用](/core/development/deprecating/)。

## 规则

任何要被移除的内容都必须先经过弃用。即使你认为只有少数人在使用它，这条规则依然适用，因为一个实体（entity）、动作（action）或选项可能被用于其他人无法看到的自动化、脚本和仪表盘中。

## 时限

| 受影响的对象 | 最短期限 |
| --- | --- |
| 用户：YAML 配置、动作、实体、属性、集成 | 6 个月 |
| 开发者：自定义集成所使用的常量、辅助元素（helper）、实体属性和平台 API | 12 个月 |

弃用公告中会指明旧方式将在哪个版本中被移除。当人们需要更多时间时，期限可以延长，但绝不会缩短。

## 用户会看到什么

需要用户采取行动的弃用会以[修复](/glossary/repair/)（repair）的形式出现在 **设置** > **系统** > **修复** 中，且只出现在受影响的安装实例上。该修复会说明什么内容将被移除、何时移除，以及应该怎么做。受影响的人会收到通知，而不受影响的人则不会被打扰。

## 在发布说明中

一项弃用会在发布说明中出现两次：

1. **When it starts.** The release notes of the version that deprecates something can list it under **Backward-incompatible changes**, like "The uptime sensor is deprecated and will be removed in a future release. Use the new last restart sensor instead."
2. **When it ends.** The pull request that removes the old way, after the deprecation period, is a backward-incompatible change when it can still affect users who did not act on the deprecation. Its text from the pull request ends up in the same section of that release. See [When it is backward-incompatible](/releases/guides/backward-incompatible-changes/#when-it-is-backward-incompatible).

影响自定义集成开发者的 Python API 弃用会在[开发者博客](/blog/)上公告。发布说明会链接该版本中最值得关注的文章，而旧代码在仍然可用期间会记录一条警告。

## 在拉取请求中

The pull request template of the [core repository](https://github.com/home-assistant/core) has a type of change for this: check **Deprecation** when the break happens in the future, and **Breaking change** when it happens now. A pull request that starts a deprecation is the first. The one that ends it is the second, unless it only removes a core API that nothing in Home Assistant Core uses anymore.
