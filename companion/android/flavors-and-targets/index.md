# Android 版本类型与目标平台

> Android 应用的 full 和 minimal 版本类型，以及手机、Android Automotive、Wear OS 和 TV 构建。

Source: https://www.hasscn.top/contributors/companion/android/flavors-and-targets/

Android 应用面向多种设备构建，并有两种版本类型（flavor）。对共享代码的修改可能会影响到所有这些构建，因此了解每种构建是什么会很有帮助。

## 版本类型

`:app` 和 `:automotive` 模块有两种版本类型。`:wear` 模块没有版本类型之分。

| | `full` | `minimal` |
| --- | --- | --- |
| Google Play Services | 有 | 无 |
| 应用程序 ID | `io.homeassistant.companion.android` | `io.homeassistant.companion.android.minimal` |
| 用于[在线检测](https://www.home-assistant.io/getting-started/presence-detection/)的位置跟踪 | 有 | 无 |
| 推送通知 | 通过 Firebase，以及通过 WebSocket | 仅通过 WebSocket，参见[本地推送](https://companion.home-assistant.io/docs/notifications/notification-local) |
| Wear OS 应用 | 有 | 无 |
| 崩溃报告 | 有 | 无 |
| 分发渠道 | Google Play | F-Droid、GitHub 上的 APK、Meta Quest，以及面向汽车厂商的 Android Automotive 构建 |

调试构建会在应用程序 ID 后添加 `.debug`，因此它们可以与正式版应用并存安装。

`minimal` 版本类型是为那些偏好或需要不含 Google Play Services 的应用的用户而存在的，例如设备本身没有这些服务的用户。

请尽量将代码保留在 `main` 源集中，这样两种版本类型的用户都能获得该功能。当有选择时，项目更倾向于开源解决方案。只有需要 Google Play Services 的代码才会放入 `full` 源集，并提供对应的 `minimal` 实现。如果某个 Play Services 功能的开源替代方案变得可行，它也可以移到 `minimal` 中。

## 目标平台

| 目标平台 | 模块 | 最低 SDK |
| --- | --- | --- |
| 手机和平板 | `:app` | `androidSdk-min` |
| Android Automotive | `:automotive` | `androidSdk-automotive-min` |
| Wear OS | `:wear` | `androidSdk-wear-min` |

版本号位于 [`gradle/libs.versions.toml`](https://github.com/home-assistant/android/blob/main/gradle/libs.versions.toml) 中。

### 手机和平板

大多数用户使用的主应用。Android Auto 是其中的一部分：手机将车机屏幕投射到汽车显示屏上。

### Android Automotive

直接运行在汽车上的应用。它使用自己的清单文件编译 `:app` 的源代码。汽车相关的 API 仅从 API 29 开始提供，因此其最低 SDK 更高。

### Wear OS

一个独立的应用，但并非完全独立：它需要手机应用来完成初始设置并获取服务器凭据。之后，它可以直接与 Home Assistant 通信。

### Android TV

手机应用可以安装在 Android TV 上，但没有专门的模块，使用遥控器导航的体验也不太好。更好的电视体验需要拥有自己的模块和导航支持。
