---
title: Android 上的推送通知
description: 设置你自己的 Firebase 项目和推送服务，适用于开发通过 Firebase Cloud Messaging 传递的通知时。
sidebarLabel: Push notifications
sidebarGroup: Set up
order: 2
---

`full` 版本通过 Firebase Cloud Messaging（FCM）接收通知。Home Assistant 将通知发送到项目的推送服务，推送服务将其交给 FCM，再由 FCM 传递到手机。[移动应用 API](/companion/mobile-app-api/notifications/) 描述了这一约定。

只有在你开发这条路径时才需要自己的设置。对于其他所有情况，[入门指南](/companion/android/get-started/#3-add-a-firebase-configuration)中的模拟 Firebase 文件就足够了，通知仍会通过 WebSocket 连接到达应用。`minimal` 版本也是通过这种方式获取通知的。

> [!TIP]
> 设置 FCM 需要一些精力。如果你能用 WebSocket 通知测试你的更改，就那样做。

## 设置你自己的 FCM 项目

1. 在 [Firebase 控制台](https://console.firebase.google.com)中创建一个项目。
2. 为以下每个应用 ID 向项目添加一个 Android 应用：
   - `io.homeassistant.companion.android`
   - `io.homeassistant.companion.android.debug`
   - `io.homeassistant.companion.android.minimal`
   - `io.homeassistant.companion.android.minimal.debug`
3. 在你的 Firebase 项目中创建默认的 Cloud Firestore 数据库。推送服务将其速率限制保存在那里，除非你将其配置为使用 Valkey。
4. 将 [home-assistant/mobile-apps-fcm-push](https://github.com/home-assistant/mobile-apps-fcm-push) 中的推送服务部署到你的 Firebase 项目。
5. 将应用指向你的服务。将已部署的 `androidV1` 函数的 URL 添加到 Gradle 用户主目录（`~/.gradle/gradle.properties`）中的 `gradle.properties`，而不是仓库中的那个文件：

   ```properties
   homeAssistantAndroidPushUrl=https://push.example.com/api/sendPush/android/v1
   ```

   （可选）也可以将速率限制检查指向你的服务：

   ```properties
   homeAssistantAndroidRateLimitUrl=https://push.example.com/api/checkRateLimits
   ```

   如果没有这些覆盖配置，应用将使用仓库 `gradle.properties` 中设置的项目自带的推送服务。

6. 从你的 Firebase 项目下载 `google-services.json`，并将其放入 `app/`、`automotive/` 和 `wear/` 中。

`google-services.json` 文件必须包含所有四个应用 ID 的客户端。如果缺少其中一个，FCM 将无法在该构建中工作，只有 WebSocket 通知能够到达。
