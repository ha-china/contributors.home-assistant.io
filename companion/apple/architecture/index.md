# Apple 架构

> Home Assistant Apple 应用是如何组织的。源代码文件夹、共享代码、Current 环境，以及每次改动都要遵循的规则。

Source: https://www.hasscn.top/contributors/companion/apple/architecture/

Last verified on 2026-10-14, against https://github.com/home-assistant/iOS/blob/main/Package.resolved.

Apple 应用最初是一个带有少量原生附加功能的网页视图，后来发展成一个混合代码库，包含原生引导流程、传感器、小组件、App Intents、Apple Watch 应用、CarPlay 和实时活动。一个仓库即可构建所有这些内容，覆盖 iOS、iPadOS、watchOS，以及通过 Mac Catalyst 运行的 macOS。

## 技术栈

- **Swift**，新 UI 使用 SwiftUI。较旧的界面以及 Apple 框架需要的地方仍在使用 UIKit。
- **Xcode**，使用 `HomeAssistant.xcodeproj`。依赖项为 Swift 包。
- **[Fastlane](https://fastlane.tools/)** 用于代码检查、测试、版本管理和分发。
- **[WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)** 用于前端，应用与前端之间通过 JavaScript 消息总线通信。
- **[WidgetKit](https://developer.apple.com/documentation/widgetkit)** 和 **[App Intents](https://developer.apple.com/documentation/appintents)** 用于小组件、控件和快捷指令。

你最常接触到的库：

- [HAKit](https://github.com/home-assistant/HAKit)：Home Assistant API 客户端，用于 WebSocket 和 REST API。
- [GRDB.swift](https://github.com/groue/GRDB.swift)：SQLite 存储。
- [Alamofire](https://github.com/Alamofire/Alamofire)：HTTP。
- [PromiseKit](https://github.com/mxcl/PromiseKit)：较旧代码中的 promise。新代码使用 async 和 await。
- [SFSafeSymbols](https://github.com/SFSafeSymbols/SFSafeSymbols)：类型安全的 SF Symbols。
- [KeychainAccess](https://github.com/kishikawakatsumi/KeychainAccess)：钥匙串存储。
- [XCGLogger](https://github.com/DaveWoodCom/XCGLogger)：日志记录，通过 `Current.Log` 使用。
- [ObjectMapper](https://github.com/tristanhimmelman/ObjectMapper)：较旧模型中的 JSON 映射。

## 源代码文件夹

| 文件夹 | 内容 |
| --- | --- |
| `Sources/App` | iPhone 和 iPad 应用：引导流程、设置、网页视图、摄像头、通知、kiosk 模式 |
| `Sources/Shared` | 所有 target 共享的代码：API 和网络、数据库、模型、传感器、位置、Assist、通知、小组件支持 |
| `Sources/Extensions` | 应用扩展：小组件、App Intents、intent、分享、通知服务和内容、推送提供方，以及 Matter |
| `Sources/Watch`, `Sources/WatchApp` | Apple Watch 应用及其与手机的通信 |
| `Sources/CarPlay` | CarPlay 模板和操作 |
| `Sources/MacBridge` | Catalyst 构建的 Mac 专用代码 |
| `Sources/Thread` | Thread 凭据的管理与共享 |
| `Sources/Improv` | 使用 Improv 通过蓝牙设置设备 |
| `Sources/PushServer` | 推送中继服务器，一个独立的 Swift 包 |
| `Sources/SharedPush` | 推送通知负载的解析。推送服务器保留自己的副本 |
| `Sources/SharedTesting` | 测试辅助工具 |
| `Tests` | 单元测试、UI 测试、快照测试和小组件测试 |
| `Configuration` | Xcode 构建设置 |
| `fastlane` | Fastlane lanes |

仓库在 [`Sources/`](https://github.com/home-assistant/iOS/tree/main/Sources) 下还有更小的模块，例如 `HADesignSystem` 和 `HAModels`。

## 代码放在哪里

一个功能往往出现在不止应用一个地方。一个实体（entity）操作可能同时出现在应用、小组件、手表、快捷指令和 CarPlay 中。在动手之前，先决定代码应该放在哪里：

1. 多个 target 都需要的逻辑放在 `Sources/Shared`。
2. 只属于某一个界面的代码放在对应的 target 中，例如 `Sources/Extensions/Widgets` 或 `Sources/CarPlay`。
3. 大多数功能从 `Sources/App` 开始。先去那里看看事情是怎么做的。
4. 在编写新代码之前，先看看 `Tests/App` 和 `Tests/Shared` 中的示例。

扩展在严格的限制下运行，无法使用应用能用的所有 API。共享代码必须保证在扩展中可以安全使用。

## Current 环境

代码库中最重要的模式是全局的 `Current`，它是一个 `AppEnvironment`，持有所有依赖项：日期、服务器、日志器、数据库等等。它遵循 Point-Free 的 [How to control the world](https://www.pointfree.co/blog/posts/21-how-to-control-the-world) 中的"World"模式。

生产代码从它读取：

```swift
let now = Current.date()
let server = Current.servers.all.first
Current.Log.info("Something happened")
```

测试则替换它们需要的部分：

```swift
Current.date = { Date(timeIntervalSince1970: 1_000_000) }
Current.servers = FakeServerManager()
```

绝不要在测试之外对 `Current` 赋值。一旦这样做，一条自定义 SwiftLint 规则会让 CI 失败。

## 每次改动都要遵循的规则

这些规则来自项目自身的指南，评审者会将它们应用于每一个拉取请求（pull request）：

- **每个文件一个类型**，文件以该类型命名。唯一例外是嵌套在类型内部的小型私有辅助类型。
- **每个 SwiftUI 视图都有一个 `#Preview`。**
- **每个屏幕一个标题。** 如果一个屏幕的 `List` 以 `AppleLikeListTopRowHeader` 开头，它的标题已经显示在该头部中，因此不要再设置 `.navigationTitle`。否则用户滚动时会出现两个标题叠加。
- **确认对话框放在它的触发器上。** 把 `.confirmationDialog` 放在打开它的那个 `Button` 上，而不是放在父级 `List`、`Section` 或其他容器上。这样对话框就与它自己的控件绑定，不会因无关的控件而触发。
- **仅限 Beta 的功能使用 `Current.isTestFlight`**，不要用其他任何方式：不用构建设置、`#if` 分支或隐藏的设置。每个将功能置于该开关之后的拉取请求，都要附带第二个草稿状态的拉取请求，用于移除该开关，它从第一个拉取请求分出并与之关联。这样把功能移出 Beta 只需一次合并。
- **传感器是可选加入的。** 在用户开启传感器之前，任何东西都不会上报，应用更新也绝不会开始上报新的内容。当前无法读取的传感器仍会列出，状态（state）为 `unavailable`。如果它需要某项权限，开启它的操作就是请求该权限的时机。启用是按服务器进行的：新添加的服务器默认不启用任何东西。

## 与 Home Assistant 通信

与 Android 应用一样，该应用通过两种方式与 Home Assistant 通信：

- **移动应用 API。** 在引导流程中，`HomeAssistantAPI`（位于 [`Sources/Shared/API/HAAPI.swift`](https://github.com/home-assistant/iOS/blob/main/Sources/Shared/API/HAAPI.swift)）会向 `mobile_app` 集成（integration）注册该应用。此后，传感器、位置更新和其他设备（device）数据通过它获得的 webhook，经由 `WebhookManager` 发送到服务器。应用注册时支持加密，`WebhookPayloadCrypto` 负责加密负载。传感器位于 `Sources/Shared/API/Webhook/Sensors`。相关服务器端内容请参阅[移动应用 API](https://www.hasscn.top/contributors/companion/mobile-app-api/)。
- **WebSocket 和 REST API**，通过 [HAKit](https://github.com/home-assistant/HAKit) 使用，用于实体状态和操作等。新的服务器调用请使用它，并配合 `async` 和 `await`。

## 与前端通信

网页视图加载 Home Assistant 前端，并通过外部认证向其传递访问令牌，因此用户无需登录两次。应用与前端通过外部总线交换消息，例如打开原生设置或扫描二维码。前端一侧的内容记录在[外部认证](https://www.hasscn.top/contributors/frontend/reference/external-auth/)和[外部总线](https://www.hasscn.top/contributors/frontend/reference/external-bus/)中。
