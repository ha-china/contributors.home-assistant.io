# 伴侣应用（companion apps）如何融入

> Android 和 Apple 设备上的 Home Assistant：应用中的前端，加上来自设备本身的传感器、通知、小组件等。

Source: https://www.hasscn.top/contributors/architecture/platform/companion-apps/

[伴侣应用（companion apps）](https://www.hasscn.top/contributors/glossary/companion-app/)将 Home Assistant 带到手机、平板、手表、汽车和 Mac 上。它们显示与浏览器相同的[前端（frontend）](https://www.hasscn.top/contributors/architecture/frontend/)，并添加只有设备上的应用才能做到的事情：传感器、位置、通知、小组件和快捷控制。

## 简而言之

- Android 应用使用 Kotlin 编写，Apple 应用使用 Swift 编写。两者各有自己的代码仓库。
- 主屏幕是前端，运行在 web 视图中。原生部分围绕在它周围。
- 应用通过 `mobile_app` 集成（integration）注册自己，从而将手机变成一个带有实体（entity）的设备（device）。
- 应用通过 webhook 发送传感器数据和位置。通知则通过推送服务返回。

## 两个部分

| 部分 | 作用 |
| --- | --- |
| web 视图中的前端 | 仪表盘（dashboard）、设置，以及你在浏览器中看到的一切 |
| 原生代码 | 登录、传感器、位置、通知、小组件、手表应用、车载应用，以及应用自身的设置 |

前端知道自己运行在应用中，并通过一个桥接器与应用通信：例如扫描二维码、显示原生设置，或使用手机的麦克风进行语音操作。

## 注册

当用户登录应用时，应用会通过 `mobile_app` 集成注册自己。这会创建一个[配置条目（config entry）](https://www.hasscn.top/contributors/core/integrations/config-entries/)和一个代表手机的设备，并为应用分配一个 [webhook](https://www.hasscn.top/contributors/architecture/connections/)。该 webhook 可以加密，因此即使通过未加密的连接，其数据也是安全的。

从那时起，应用会通过该 webhook 发送传感器数据（如电池电量）及其位置。每个传感器都会成为手机设备的一个实体。借助 Home Assistant Link，该 webhook 在家庭网络之外也能工作。

## 通知

Home Assistant 无法直接联系到手机。通知通过项目的推送服务发送，该服务将通知交给 Google 和 Apple 的服务，再由它们送达手机。应用在注册时会告诉 `mobile_app` 将通知发送到哪里。

## 代码位置

| 内容 | 位置 |
| --- | --- |
| Android，包括 Wear OS 和 Android Auto | [home-assistant/android](https://github.com/home-assistant/android) |
| iOS、iPadOS、macOS、watchOS 和 CarPlay | [home-assistant/iOS](https://github.com/home-assistant/iOS) |
| Core 侧 | [`homeassistant/components/mobile_app/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/mobile_app) |
| 前端中的桥接器 | [home-assistant/frontend](https://github.com/home-assistant/frontend) 中的 [`src/external_app/`](https://github.com/home-assistant/frontend/tree/dev/src/external_app) |

## 参与贡献

- 从[你的第一次伴侣应用贡献](https://www.hasscn.top/contributors/companion/first-contribution/)开始。
- 各应用的构建方式：[Android 架构](https://www.hasscn.top/contributors/companion/android/architecture/)和 [Apple 架构](https://www.hasscn.top/contributors/companion/apple/architecture/)。
- [移动应用 API](https://www.hasscn.top/contributors/companion/mobile-app-api/)：注册、传感器和通知，适用于官方应用和你自己的应用。
