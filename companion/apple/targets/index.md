# Apple 目标

> Apple 项目中的应用、扩展、Apple Watch、CarPlay 和 Mac 目标，以及当你的改动涉及共享代码时需要检查的内容。

Source: https://www.hasscn.top/contributors/companion/apple/targets/

Xcode 项目从同一套代码构建出许多产品。共享代码中的改动可能会影响到所有产品，因此请检查你的改动涉及哪些产品。

## 各个 scheme

| Scheme | 构建内容 |
| --- | --- |
| `App-Debug` | 应用，用于本地开发。从这里开始 |
| `App-Release` | 应用，发布版本 |
| `Tests-Unit` | CI 运行的单元测试 |
| `Tests-UI` | UI 测试和端到端引导测试 |
| `WatchApp` | Apple Watch 应用 |
| `Extensions-*` | 每个应用扩展各一个，例如 `Extensions-Widgets` |

## iPhone 和 iPad

主应用，位于 `Sources/App`。大多数功能都从这里开始。

## 小组件、控件和 App Intents

`Sources/Extensions/Widgets` 和 `Sources/Extensions/AppIntents` 支持主屏幕和锁定屏幕小组件、控制中心控件以及快捷指令。它们以扩展的形式运行，在应用之外。

出现在小组件、手表、CarPlay 和快捷指令中的条目共享同一个模型 `MagicItem`。如果你添加一种新的条目或操作类型，它很可能需要在所有这些地方都能正常工作。

## 通知

多个目标负责处理通知：

- 通知服务扩展（notification service extension），在通知显示之前对其进行修改，例如下载附件。
- 通知内容扩展（notification content extension），用于通知的展开视图，例如摄像头画面。
- 推送提供方扩展（push provider extension），用于家庭网络中的本地推送。

实时活动（Live Activities）是应用和小组件的一部分。在处理通知时，请检查所有这些部分。请参阅[用户文档](https://companion.home-assistant.io/docs/notifications/notifications-basic)了解用户可以用它们做什么。

## Apple Watch

手表应用位于 `Sources/Watch` 和 `Sources/WatchApp`，其复杂功能（complications）和小组件位于 `Sources/WatchWidgets`。对操作、通知、复杂功能或共享设置的改动通常也需要在手表上进行测试。手表有自己的测试，由 `bundle exec fastlane test` 在手表模拟器上运行。

## CarPlay

`Sources/CarPlay` 包含受支持实体的模板、列表项、筛选器和操作。

## 分享和 Matter

分享扩展处理从其他应用分享到 Home Assistant 的内容。Matter 扩展是添加 Matter 设备流程的一部分。如果你的改动涉及传入内容或设备设置，请检查这些部分。

## Mac

Mac 应用使用 Mac Catalyst 从同一套代码构建。`Sources/MacBridge` 包含 Mac 特有的部分。即使你只开发 iOS 功能，共享代码也会为 Mac 编译，因此必须能在那里构建。

## 推送服务器

`Sources/PushServer` 是一个独立的 Swift 包，用于推送中继。它不属于 Xcode 项目，并且有自己的测试。它携带了 `Sources/SharedPush` 中通知解析器的一份副本：当你修改其中一处时，请判断另一处是否也需要相同的改动。请参阅[测试](https://www.hasscn.top/contributors/companion/apple/testing/#the-push-server)。
