---
title: Android 架构
description: Android 应用背后的原则、模块、技术栈，以及手机、汽车和手表应用如何协同工作。
sidebarLabel: 架构
sidebarGroup: Architecture
order: 1
---

该应用遵循 Google 的[推荐应用架构](https://developer.android.com/topic/architecture)，并从 [Now in Android](https://github.com/android/nowinandroid) 中汲取灵感。这个项目历史悠久，因此你会发现一些尚未遵循这些规则的代码。本页描述的是项目的发展方向。如有疑问，请遵循本页，而不是你旁边的代码。

## 带有原生功能的 Web 视图

Home Assistant 一直是一个强大的渐进式 Web 应用（progressive web app），Android 应用正是建立在这一基础之上。它的主屏幕是一个显示 Home Assistant 前端的 [WebView](https://developer.android.com/reference/android/webkit/WebView)。应用与前端之间通过 JavaScript 桥接进行通信：前端通过[外部认证（external authentication）](/frontend/reference/external-auth/)向应用请求访问令牌，并通过[外部总线（external bus）](/frontend/reference/external-bus/)交换消息。具体工作原理请参阅[前端屏幕](/companion/android/frontend-screen/)。

其余一切都是原生的：入门引导、设置、传感器、通知、小组件、磁贴、Assist，以及汽车和手表应用。

## 原则

- **仅使用 Kotlin。** 整个代码库都是 Kotlin，并将保持不变。
- **所有新 UI 都使用 Compose。** 不再使用新的 XML 布局、数据绑定或视图绑定。新小组件使用 Jetpack Glance。新屏幕使用 `HATheme` 主题。较旧的 `HomeAssistantAppTheme` 是 Material 2，已弃用。请参阅 [Compose 与设计系统](/companion/android/compose/)。
- **所有并发都使用协程（coroutines）和 Flow。**
- **依赖注入使用 Hilt。** 切勿手动创建需要注入的类。
- **保持代码与产品变体（flavor）无关。** 将代码放在 `main` 源集中，让两个[变体](/companion/android/flavors-and-targets/)都能使用。只有需要 Google Play Services 的代码才放入 `full`。
- **紧跟 Android 的发展。** 目标 SDK 跟随最新的 Android 版本，新版本发布时会进行测试。
- **根据服务器版本控制功能**，当功能需要较旧版本 Home Assistant 所不具备的能力时，例如 `server.version?.isAtLeast(2025, 6, 0)`。

## 模块

模块列表见 [Android 概览](/companion/android/#the-repository)。以下几点值得了解：

- 共享的 Gradle 配置位于 `build-logic`（一个包含的构建）中的约定插件里。如果你需要在多个模块中使用相同的设置，就应该放在那里。
- `:common` 存放手机、汽车和手表应用共享的所有内容，包括 `common/src/main/res/values/strings.xml` 中的所有面向用户的字符串。只编辑英文文件：翻译来自 Lokalise。请参阅[翻译](/translate/)。
- `:automotive` 没有自己的源代码。它使用不同的清单文件和更高的最低 SDK 来编译 `:app` 的源代码。

在模块内部，代码按功能打包：`sensors/`、`notifications/`、`settings/`、`onboarding/`、`widgets/`、`frontend/` 等等。

## 技术栈

| 关注点 | 应用使用的技术 |
| --- | --- |
| UI | [Jetpack Compose](https://developer.android.com/compose)，小组件使用 [Glance](https://developer.android.com/develop/ui/compose/glance) |
| 导航 | Navigation Compose，使用类型安全的路由 |
| 依赖注入 | [Hilt](https://developer.android.com/training/dependency-injection/hilt-android) |
| 并发 | [Kotlin 协程](https://kotlinlang.org/docs/coroutines-overview.html)和 Flow |
| WebSocket API | [OkHttp](https://square.github.io/okhttp/) |
| REST API | [Retrofit](https://square.github.io/retrofit/) |
| 序列化 | Kotlinx.serialization |
| 数据库 | [Room](https://developer.android.com/training/data-storage/room)，用于用户数据 |
| 应用设置 | SharedPreferences，封装在 `LocalStorage` 抽象之后 |
| 日志 | [Timber](https://github.com/JakeWharton/timber) |

## 选择流类型

当你暴露一个流时，根据在无人收集时值必须发生什么来选择其类型：

| 它承载的内容 | 使用 |
| --- | --- |
| 状态：只有最新值重要，重新渲染也没问题，比如屏幕状态或模式 | `StateFlow` |
| 每个收集器都必须收到的事件，或者一旦其上下文消失就毫无意义、无人监听时必须丢弃的事件，比如绑定到已加载页面的 WebView 操作 | `SharedFlow` |
| 一个消费者必须恰好处理一次、绝不丢失也绝不重复的事件，比如导航、snackbar 或打开链接 | `Channel(Channel.BUFFERED)` 通过 `receiveAsFlow()` 暴露 |

`Channel` 会保留值直到有消费者出现，并将每个值交给单个收集器。在屏幕开始收集之前发送的事件仍然会到达。没有重放的 `SharedFlow` 会将其丢弃。在协程中使用 `send`，仅在无法挂起的回调中使用 `trySend`。

## 与 Home Assistant 通信

该应用使用三个通道：

- [`mobile_app` 集成](/companion/mobile-app-api/)的 **Webhook**，用于传感器更新、位置信息和注册更新。
- **WebSocket API**，保持开启以支持实时功能，如 Assist、小组件中的实体状态，以及不依赖 Firebase 的通知。
- **REST API**，用于其余部分。

传感器在后台收集，并通过前台服务和工作器（worker）发送到 Home Assistant。

## Wear OS

Wear OS 应用是 `:wear` 中的一个独立应用。它无法自行完成入门引导：它通过 [Wearable Data Layer](https://developer.android.com/training/wearables/data/data-layer) 从手机应用获取服务器 URL 和凭据。这需要 Google Play Services，因此只能与手机应用的 `full` 变体配合使用。设置完成后，手表通过 WebSocket API 和自己的 webhook 直接与 Home Assistant 通信。

## Android Automotive 和 Android Auto

Android Auto 从手机应用运行：它将 `:app` 中的汽车屏幕投射到车载显示屏上。Android Automotive 是一个独立的构建版本 `:automotive`，直接在汽车上运行。两者使用相同的源代码。

## 深层链接（Deep link）

该应用处理 `homeassistant://` 链接以打开应用的特定部分。面向用户的说明见 [URL 处理器文档](https://companion.home-assistant.io/docs/integrations/url-handler/)。

## 下一步

- [UI 架构](/companion/android/ui-architecture/)：单个屏幕是如何构建的。
- [最佳实践](/companion/android/best-practices/)：每次代码审查中都会出现的编码规则。
