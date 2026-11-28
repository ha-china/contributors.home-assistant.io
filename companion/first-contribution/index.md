# 你的第一次伴侣应用贡献

> 选择 Android 或 Apple，在你的机器上构建应用，并提交你的第一个 pull request。

Source: https://www.hasscn.top/contributors/companion/first-contribution/

你对伴侣应用（companion app）的第一次贡献不一定非得是一个功能。一个小 bug 修复、一个没人处理的 lint 警告，或者一个缺失的测试，都是很好的起点。它能让你完整地走一遍整个流程：构建、修改、测试、pull request、评审。

## 1. 选择你的平台

这两个应用除了它们所通信的 API 之外没有任何共享内容。选择与你的技能以及你每天使用的设备相匹配的那一个：

| | Android | Apple |
| --- | --- | --- |
| 语言 | Kotlin | Swift |
| IDE | Android Studio | Xcode（需要 Mac） |
| 构建系统 | Gradle | Xcode 与 Swift Package Manager，工具链使用 Fastlane |
| UI | Jetpack Compose（旧版 XML 正在迁移中） | SwiftUI 和 UIKit |
| 仓库 | [home-assistant/android](https://github.com/home-assistant/android) | [home-assistant/iOS](https://github.com/home-assistant/iOS) |

开发 Apple 应用需要一台 Mac。对于 Android，任何能运行 Android Studio 的机器都可以。

## 2. 打个招呼

加入 [Home Assistant Discord](https://www.home-assistant.io/join-chat)，在 **Channels & Roles** 下选择开发者角色，然后前往 [Android 项目讨论帖](https://discord.com/channels/330944238910963714/1346948551892009101)或 [**#apple-apps**](https://discord.com/channels/330944238910963714/1481713628553019392) 频道。告诉大家你想做什么。这能避免你去做别人已经在做的东西。

## 3. 构建应用

按照你所在平台的设置指南操作：

- [Android 入门](https://www.hasscn.top/contributors/companion/android/get-started/)
- [Apple 入门](https://www.hasscn.top/contributors/companion/apple/get-started/)

在模拟器、仿真器或你自己的设备上运行应用，并将其连接到一个 Home Assistant 实例。最好使用测试实例：应用在每次连接到服务器时，都会将自己注册为一台新设备（device）。

## 4. 找点事情做

适合新手的切入点：

- **一个开放的 issue**：浏览 [Android issues](https://github.com/home-assistant/android/issues) 或 [iOS issues](https://github.com/home-assistant/iOS/issues)。一个你能复现的小问题是最理想的。
- **Lint 基线**（Android）：app、wear、automotive、common 和 microwakeword 模块各自都有一个 `lint-baseline.xml`，其中记录了从未修复的已知问题。修复一个，然后把它从基线中移除，就完成了。参见[代码风格与 lint 检查](https://www.hasscn.top/contributors/companion/android/code-style/#baselines)。
- **缺失的测试**：为没有测试的代码添加一个测试。两个仓库都非常重视测试，Apple 仓库甚至要求你修改的大部分代码行都必须有测试覆盖。
- **让你烦恼的东西**：你自己遇到的 bug 是最好的第一个课题，因为你已经知道它为什么重要。

## 5. 提交 pull request

Fork 仓库，创建分支，进行修改，然后针对 `main` 提交一个 pull request。完整填写 pull request 模板；其中包含一个清单，并会询问你如何使用 AI 工具。在开始之前，请阅读 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)。

提交指南中有详细说明：

- [提交 Android pull request](https://www.hasscn.top/contributors/companion/android/submitting/)
- [提交 Apple pull request](https://www.hasscn.top/contributors/companion/apple/submitting/)

如果你的修改对用户可见，还需要在[用户文档](https://github.com/home-assistant/companion.home-assistant)中提交一个 pull request。

> [!NOTE]
> 评审可能需要一段时间。请保持耐心，同时确保 CI 保持绿色（通过）。

## 接下来做什么

- 阅读你所在平台的架构：[Android](https://www.hasscn.top/contributors/companion/android/architecture/) 或 [Apple](https://www.hasscn.top/contributors/companion/apple/architecture/)。
- 好奇应用是如何与 Home Assistant 通信的？阅读[移动应用 API](https://www.hasscn.top/contributors/companion/mobile-app-api/)。
