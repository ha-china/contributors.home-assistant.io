# Apple

> 适用于 iPhone、iPad、Mac、Apple Watch 和 CarPlay 的 Home Assistant 应用。仓库里有什么，以及从哪里开始。

Source: https://www.hasscn.top/contributors/companion/apple/

Last verified on 2026-10-14, against https://github.com/home-assistant/iOS/blob/main/CONTRIBUTING.md.

Apple 应用将 Home Assistant 带到了 iPhone、iPad、Mac、Apple Watch 和 CarPlay 上。与 Android 应用一样，它的核心是一个加载 Home Assistant 前端的网页视图。围绕它，很多东西都是原生的：引导流程、设置、传感器、位置、通知和实时活动（Live Activities）、小组件和控制、App Intents 和快捷指令、手表应用及其复杂功能（complications），以及 CarPlay。

所有这些都位于同一个仓库 [home-assistant/iOS](https://github.com/home-assistant/iOS) 中，使用 Swift 编写。Mac 应用通过 Mac Catalyst 从同一份代码构建。

## 仓库

所有内容都在 [home-assistant/iOS](https://github.com/home-assistant/iOS) 中。它是一个 Xcode 项目 `HomeAssistant.xcodeproj`，源代码分布在几个主要文件夹中：

| 文件夹 | 内容 |
| --- | --- |
| `Sources/App` | iPhone 和 iPad 应用 |
| `Sources/Shared` | 所有 target 共享的代码：API、数据库、传感器、通知 |
| `Sources/Extensions` | 小组件、App Intents、通知、分享和 Matter 扩展 |
| `Sources/Watch`、`Sources/WatchApp` | Apple Watch 应用 |
| `Sources/CarPlay` | CarPlay |
| `Sources/MacBridge` | Catalyst 构建专用的 Mac 代码 |
| `Sources/PushServer` | 推送中继服务器，一个独立的 Swift 包 |
| `Tests` | 单元测试、UI 测试、快照测试和小组件测试 |

完整列表见[架构](https://www.hasscn.top/contributors/companion/apple/architecture/#the-source-folders)。

## 环境搭建

- [入门](https://www.hasscn.top/contributors/companion/apple/get-started/)：安装 Xcode 和相关工具，配置签名，并运行应用。

## 架构

- [架构](https://www.hasscn.top/contributors/companion/apple/architecture/)：代码的组织方式、将一切串联起来的 `Current` 环境，以及应用如何与 Home Assistant 通信。
- [Target](https://www.hasscn.top/contributors/companion/apple/targets/)：应用、扩展、手表、CarPlay 和 Mac，以及一次改动可能影响哪些部分。

## 编写代码

- [代码风格](https://www.hasscn.top/contributors/companion/apple/code-style/)：SwiftFormat、SwiftLint 以及项目的约定。

## 测试

- [测试](https://www.hasscn.top/contributors/companion/apple/testing/)：单元测试、快照测试、UI 测试和端到端测试，以及补丁覆盖率门槛。

## 发布

- [提交拉取请求](https://www.hasscn.top/contributors/companion/apple/submitting/)：检查清单、模板和审查流程。
- [持续集成](https://www.hasscn.top/contributors/companion/apple/ci/)：你的拉取请求上会运行什么，以及合并之后会发生什么。
- [发布](https://www.hasscn.top/contributors/companion/apple/releases/)：从合并的拉取请求到 App Store Connect，以及 GitHub 上的 Mac 版发布。

## 翻译

应用的文本在 Lokalise 上翻译，位于其独立的 iOS 项目中。你不需要 Mac 或 Xcode。参见[你的第一次翻译](https://www.hasscn.top/contributors/translate/first-contribution/)。

## 联系谁

- [Home Assistant Discord](https://www.home-assistant.io/join-chat) 上的 [**#apple-apps**](https://discord.com/channels/330944238910963714/1481713628553019392) 频道。请先在 **Channels & Roles** 下选择开发者角色。
- iOS 仓库中的 [Issues](https://github.com/home-assistant/iOS/issues)，用于提交缺陷和功能请求。
- 想提前测试新功能？加入 [TestFlight 测试版](https://www.home-assistant.io/ios/beta/)。
- 有关应用在用户端的工作方式，请参阅[伴侣应用文档](https://companion.home-assistant.io/)。
