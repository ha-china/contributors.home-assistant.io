# Android

> 适用于 Android、Wear OS、Android Auto 和 Android Automotive 的 Home Assistant 应用。仓库里有什么，以及从哪里开始。

Source: https://www.hasscn.top/contributors/companion/android/

Android 应用始于 2019 年，如今已有数百万人使用。它的核心是一个显示 Home Assistant 前端的 web view。围绕它的是各种原生功能：从手机上报的传感器、通知、小组件、磁贴、NFC 标签、Assist、Wear OS 应用，以及用于 Android Auto 和 Android Automotive 的车机屏幕。

该项目完全使用 Kotlin 编写。新的 UI 使用 Jetpack Compose。你仍会找到早于现行规范的老代码，例如 XML 布局和 view binding。这些代码会随时间逐步迁移，这里的页面描述的是新代码应有的样子。

## 仓库

所有内容都在 [home-assistant/android](https://github.com/home-assistant/android) 中。它是一个包含多个模块的 Gradle 项目：

| 模块 | 说明 |
| --- | --- |
| `:app` | 手机和平板应用 |
| `:automotive` | Android Automotive 应用。复用 `:app` 的源代码 |
| `:wear` | Wear OS 应用 |
| `:common` | 所有应用共享的代码：数据层、传感器、WebSocket 和 REST 客户端、设计系统，以及所有字符串 |
| `:testing-unit` | 各模块单元测试共享的辅助工具 |
| `:lint` | 项目的自定义 lint 规则 |
| `:microwakeword` | 设备端唤醒词检测 |
| `:provides-sensor-processor` | 用于传感器注册的代码生成器 |
| `build-logic` | 以相同方式配置每个模块的约定插件 |

最低和目标 SDK 版本位于 [`gradle/libs.versions.toml`](https://github.com/home-assistant/android/blob/main/gradle/libs.versions.toml) 中的 `androidSdk-*` 键下。

## 环境搭建

- [入门](https://www.hasscn.top/contributors/companion/android/get-started/)：安装 Android Studio、构建应用并运行它。
- [推送通知](https://www.hasscn.top/contributors/companion/android/push-notifications/)：如果你从事通知相关工作，请设置你自己的 Firebase 项目。

## 架构

- [架构](https://www.hasscn.top/contributors/companion/android/architecture/)：原则、技术栈，以及各模块如何组合在一起。
- [UI 架构](https://www.hasscn.top/contributors/companion/android/ui-architecture/)：一个屏幕是如何构建的，从视图到仓库层。
- [前端屏幕](https://www.hasscn.top/contributors/companion/android/frontend-screen/)：承载 web view 的屏幕，也是 UI 架构的参考实现。
- [变体与目标](https://www.hasscn.top/contributors/companion/android/flavors-and-targets/)：`full` 和 `minimal`，以及手机、车机、手表和电视构建。

## 编写代码

- [Compose 与设计系统](https://www.hasscn.top/contributors/companion/android/compose/)：使用 `HATheme` 和 `HA*` 组件构建 UI。
- [最佳实践](https://www.hasscn.top/contributors/companion/android/best-practices/)：强类型、并发、依赖注入，以及快速失败。
- [代码风格与 lint](https://www.hasscn.top/contributors/companion/android/code-style/)：KTLint、Detekt 和 Android linter。
- [依赖](https://www.hasscn.top/contributors/companion/android/dependencies/)：版本目录、lockfile 和 Renovate。
- [调试工具](https://www.hasscn.top/contributors/companion/android/debugging/)：开发者 playground、StrictMode 和 LeakCanary。

## 测试

- [测试](https://www.hasscn.top/contributors/companion/android/testing/)：如何编写测试，以及使用 JUnit、MockK、Robolectric 和 Turbine 进行单元测试。
- [截图测试](https://www.hasscn.top/contributors/companion/android/screenshot-testing/)
- [插桩测试](https://www.hasscn.top/contributors/companion/android/instrumentation-testing/)
- [端到端测试](https://www.hasscn.top/contributors/companion/android/e2e-testing/)

## 发布

- [提交 pull request](https://www.hasscn.top/contributors/companion/android/submitting/)：检查清单、模板和审查流程。
- [持续集成](https://www.hasscn.top/contributors/companion/android/ci/)：你的 pull request 上会运行什么，以及合并之后会发生什么。
- [发布](https://www.hasscn.top/contributors/companion/android/releases/)：从合并的 pull request 到 Play Store，以及自行构建签名发布版本。

## 联系谁

- [Home Assistant Discord](https://www.home-assistant.io/join-chat) 上的 [Android 项目讨论串](https://discord.com/channels/330944238910963714/1346948551892009101)。请先在 **Channels & Roles** 下选择开发者角色。
- Android 仓库中的 [Issues](https://github.com/home-assistant/android/issues)，用于提交缺陷和功能请求。
- 有关应用在用户端的工作方式，请参阅[伴侣应用文档](https://companion.home-assistant.io/)。

## All pages in this section

### Architecture

- [Android 架构](https://www.hasscn.top/contributors/companion/android/architecture/): Android 应用背后的原则、模块、技术栈，以及手机、汽车和手表应用如何协同工作。
- [前端屏幕](https://www.hasscn.top/contributors/companion/android/frontend-screen/): 在 Web 视图中显示 Home Assistant 前端的 Android 屏幕，包括其状态、JavaScript 桥接和外部总线。
- [Android 版本类型与目标平台](https://www.hasscn.top/contributors/companion/android/flavors-and-targets/): Android 应用的 full 和 minimal 版本类型，以及手机、Android Automotive、Wear OS 和 TV 构建。

### Write code

- [Compose 与设计系统](https://www.hasscn.top/contributors/companion/android/compose/): 使用 Jetpack Compose、HATheme 和 `HA*` 组件构建 Android UI。预览、Compose 目录、小组件和导航。
- [Android 调试工具](https://www.hasscn.top/contributors/companion/android/debugging/): Android 应用调试构建中的开发者游乐场、Compose 目录、StrictMode 和 LeakCanary。

### Test

- [测试 Android 应用](https://www.hasscn.top/contributors/companion/android/testing/): 如何为 Android 应用编写测试，以及如何使用 JUnit、MockK、Robolectric 和 Turbine 编写单元测试。
- [Android 截图测试](https://www.hasscn.top/contributors/companion/android/screenshot-testing/): 使用 Compose Preview Screenshot Testing，确保 Android 应用中的 Compose UI 只在有意的更改时才发生变化。
- [Android 插桩测试（instrumentation tests）](https://www.hasscn.top/contributors/companion/android/instrumentation-testing/): 在真实的 Android 运行时上测试 Android 应用，覆盖每个受支持 API 级别的模拟器。

### Ship

- [提交 Android 拉取请求](https://www.hasscn.top/contributors/companion/android/submitting/): 检查清单、拉取请求模板、应用内更新日志，以及 Android 仓库中评审的流程。
- [Android 持续集成](https://www.hasscn.top/contributors/companion/android/ci/): Android 应用的 GitHub Actions 工作流。哪些会在你的拉取请求上运行、合并后运行，以及定时运行。
- [Android 版本发布](https://www.hasscn.top/contributors/companion/android/releases/): 对 Android 应用的更改如何从合并的拉取请求（pull request）流转到内部测试人员、Beta 版和生产环境，以及如何自行构建签名的发布版本。

### 设置

- [Android 入门](https://www.hasscn.top/contributors/companion/android/get-started/): 安装 Android Studio，fork 并克隆仓库，构建应用，并在模拟器或手机上运行。
- [Android 上的推送通知](https://www.hasscn.top/contributors/companion/android/push-notifications/): 设置你自己的 Firebase 项目和推送服务，适用于开发通过 Firebase Cloud Messaging 传递的通知时。
