# 伴侣应用（Companion apps）

> 适用于 Android、iOS、iPadOS、macOS、watchOS、Wear OS 以及车载系统的官方 Home Assistant 应用。它们是如何构建的，以及如何参与构建。

Source: https://www.hasscn.top/contributors/companion/

伴侣应用（companion apps）让你把 Home Assistant 装进口袋、戴在手腕上、带进汽车里。它们显示与你在浏览器中看到的相同的前端，并增加了只有设备上的应用才能实现的功能：传感器、位置、通知、小组件、手表应用以及车载屏幕。

共有两个应用，各自位于独立的仓库中，由各自的贡献者团队构建：

| 应用 | 运行平台 | 语言 | 仓库 |
| --- | --- | --- | --- |
| Android | Android 手机和平板、Wear OS、Android Auto、Android Automotive、Meta Quest | Kotlin | [home-assistant/android](https://github.com/home-assistant/android) |
| Apple | iPhone、iPad、Mac、Apple Watch、CarPlay | Swift | [home-assistant/iOS](https://github.com/home-assistant/iOS) |

两者都通过 Core 中同一个集成（integration）`mobile_app` 与 Home Assistant 通信。该集成是一个公开的 API，因此其他应用也可以使用它。

本板块面向希望参与这两个应用开发的开发者，以及任何想要构建自己的、与 Home Assistant 通信的应用的人。你需要熟悉 Kotlin 和 Android Studio，或者熟悉 Swift 和 Xcode。如果你不想写代码也想帮忙，同样有很多事情可做：参见[参与方式](https://www.hasscn.top/contributors/companion/#ways-to-help)。

## 参与方式

- **修复缺陷或开发功能**：在 Android 或 iOS 仓库中挑选一个 issue。
- **测试测试版**：加入 [Google Play 上的 Android 测试版](https://play.google.com/apps/testing/io.homeassistant.companion.android)或 [TestFlight 上的 iOS 测试版](https://www.home-assistant.io/ios/beta/)，并报告出现的问题。
- **测试拉取请求（pull request）**：安装某个拉取请求的构建版本，并告诉作者它是否正常工作。参见[测试拉取请求构建](https://www.hasscn.top/contributors/companion/android/get-started/#test-a-pull-request-build)。
- **审查（review）**：任何人都可以对拉取请求发表评论。即使是一段简短的审查也有帮助。
- **翻译**：两个应用都在 Lokalise 上进行翻译。参见[翻译](https://www.hasscn.top/contributors/translate/)。
- **编写文档**：用户文档位于 [companion.home-assistant.io](https://companion.home-assistant.io/)，存放在 [companion.home-assistant](https://github.com/home-assistant/companion.home-assistant) 仓库中。

## 从这里开始

- [你的第一次贡献](https://www.hasscn.top/contributors/companion/first-contribution/)：选择你的平台，构建应用，并提交你的第一个拉取请求。
- [应用如何融入整体](https://www.hasscn.top/contributors/architecture/platform/companion-apps/)：从网页视图到推送服务的整体概览。

## Android

- [Android 概览](https://www.hasscn.top/contributors/companion/android/)：仓库、模块，以及在哪里找到所需内容。
- [入门](https://www.hasscn.top/contributors/companion/android/get-started/)：设置 Android Studio 并构建应用。
- [架构](https://www.hasscn.top/contributors/companion/android/architecture/)和 [UI 架构](https://www.hasscn.top/contributors/companion/android/ui-architecture/)：应用及其界面是如何组织的。
- [测试](https://www.hasscn.top/contributors/companion/android/testing/)：单元测试、截图测试、插桩测试和端到端测试。
- [提交拉取请求](https://www.hasscn.top/contributors/companion/android/submitting/)：检查清单和审查流程。

## Apple

- [Apple 概览](https://www.hasscn.top/contributors/companion/apple/)：仓库、target，以及在哪里找到所需内容。
- [入门](https://www.hasscn.top/contributors/companion/apple/get-started/)：设置 Xcode、签名，并构建应用。
- [架构](https://www.hasscn.top/contributors/companion/apple/architecture/)和 [target](https://www.hasscn.top/contributors/companion/apple/targets/)：代码如何在 iPhone、Watch、CarPlay、小组件和 Mac 之间共享。
- [提交拉取请求](https://www.hasscn.top/contributors/companion/apple/submitting/)：检查清单和审查流程。

## 移动应用 API

- [移动应用 API](https://www.hasscn.top/contributors/companion/mobile-app-api/)：应用如何连接到 Home Assistant、注册自身、发送传感器数据和位置信息，以及接收通知。适用于两个官方应用，也适用于你自己的应用。

## 联系谁

- 加入 [Home Assistant Discord](https://www.home-assistant.io/join-chat)，并在 **Channels & Roles** 下选择开发者角色。然后前往 [Android 项目讨论帖](https://discord.com/channels/330944238910963714/1346948551892009101)，或 [**#apple-apps**](https://discord.com/channels/330944238910963714/1481713628553019392) 频道。超出单个应用范围的问题，例如 `mobile_app` 集成，适合在 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道讨论。
- 缺陷和功能请求请提交到 [Android](https://github.com/home-assistant/android/issues) 或 [iOS](https://github.com/home-assistant/iOS/issues) 仓库的 issues。
- 关于 Core 中 `mobile_app` 集成的问题请前往 [core 仓库](https://github.com/home-assistant/core)。
