# 保护伴侣应用（companion apps）的安全

> Android 和 iOS 应用的安全公告中关于链接、导出组件、WebView 和 JavaScript 桥接的教训。

Source: https://www.hasscn.top/contributors/security/guides/companion-apps/

[伴侣应用（companion app）](https://www.hasscn.top/contributors/glossary/companion-app/)登录到用户的 Home Assistant 服务器，并将该登录状态保存在手机上。这使得应用成为通往家的一把钥匙。任何能让应用自行执行操作的东西——比如同一部手机上的另一个应用、消息中的链接，或框架中的网页——都可以在不知道密码的情况下使用这把钥匙。

伴侣应用的大多数安全公告都归结为这一个理念。本指南按错误类型逐一讲解，并说明应用目前采取的措施。关于这些应用是如何构建的，请参阅[伴侣应用](https://www.hasscn.top/contributors/companion/)。

## 在根据链接执行操作前先询问

这些应用会对链接和标签做出反应：NFC 标签、二维码、`homeassistant://` 链接，以及指向 `https://www.home-assistant.io/tag/` 的通用链接。操作系统会将这些内容传递给应用，而不关心是谁发送的。手机上的另一个应用可以发送同样的链接，而无需用户参与。

这曾两次出问题：

- 2023 年，一个链接或二维码可以让 iOS 和 macOS 应用在服务器上[调用动作（action）](https://github.com/home-assistant/core/security/advisories/GHSA-h2jp-7grc-9xpp)，而无需询问。
- 2026 年，其他应用可以在 [Android 应用](https://github.com/home-assistant/core/security/advisories/GHSA-2xqv-hwrf-983f)和 [iOS 应用](https://github.com/home-assistant/core/security/advisories/GHSA-j23v-9672-677j)中打开标签链接，扫描结果会直接发送到服务器。标签通常与解锁门或解除警报的自动化（automation）绑定。

教训：链接是一个请求，而不是命令。当它会在服务器上更改某些内容时，用户必须先在应用内批准。

应用目前采取的措施：

- 两个应用在将来自链接的标签扫描发送到服务器之前都会询问，提供**仅允许一次**和**始终允许**选项。用户可以通过设置撤回已始终允许的标签。
- iOS 应用在因 URL 而调用动作、触发事件或发送位置之前会请求确认。

如果你添加了作用于服务器的新链接、新 intent 或新快捷方式，请为它提供同样的确认。

## 显示你连接的是哪台服务器

Android 应用的一条邀请链接携带了服务器的地址，应用会针对该地址开始引导流程，而[不显示该地址](https://github.com/home-assistant/core/security/advisories/GHSA-68f4-97mf-f68w)。随后登录页面在一个没有地址栏的 WebView 中加载。一个伪造的服务器可以展示一个完美的登录页面副本并收集密码。

教训：当链接决定应用连接到哪里时，在任何事情发生之前先向用户显示连接目标。Android 应用现在会显示一个邀请界面，其中包含服务器地址、一条“只接受来自你信任的人的邀请”的警告，以及**接受**和**拒绝**按钮。

## 让内部 URL 留在家里

服务器的内部 URL 通常是纯 `http:`，这在家庭网络中没问题，但在其他任何地方都不行。iOS 应用曾[回退到内部 URL](https://github.com/home-assistant/core/security/advisories/GHSA-cm5v-547m-qh5h)，即使所在网络不在用户列出的家庭 Wi-Fi 网络之列。在公共网络上，令牌可能以明文形式发送给在该地址上应答的任何人。

教训：一个旨在限制某事发生范围的列表，必须在每条路径上都进行限制，包括回退路径。iOS 应用现在为每台服务器提供连接安全级别。当内部 URL 是服务器的唯一 URL 且不是 `https:` 时，这个选择很重要。选择**最安全**时，应用只在用户列出的家庭网络上使用该 URL。选择**较不安全**时，它会在任何地方使用该 URL，用户需自行接受这一风险。Android 应用为每台服务器保留了类似的选择，即 `allowInsecureConnection`。

## 保持组件私有

在 Android 上，带有 `android:exported="true"` 的 activity、service 或 receiver 可以被手机上的任何应用以任意数据启动。Android 应用的位置 receiver 曾被导出，并[接受来自任何应用的位置更新](https://github.com/home-assistant/core/security/advisories/GHSA-77r5-pw5w-mgj3)。一个恶意应用可以发送伪造的位置，并触发对某人回家做出反应的自动化。

修复方案展示了这一模式：

- 处理位置数据的 receiver 不再被导出。
- 一个小的、独立的 receiver 保持导出，用于 Tasker 等工具使用的公开 action。它只接受那一个 action，丢弃调用方随附的任何数据，并在应用内部传递请求。

```xml
<receiver
    android:name=".sensors.LocationSensorReceiver"
    android:exported="false" />
```

在导出一个组件之前，问问还有谁需要访问它。如果答案是没有人，就设置 `android:exported="false"`。如果其他应用必须访问它，就接受能工作的最小方案，并且永远不要信任随之而来的数据。

Android 仓库的[架构技能](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-architecture/SKILL.md)增加了一条相关规则：始终设置 `PendingIntent` 的可变性，并默认使用 `FLAG_IMMUTABLE`，因为不必要的可变性会扩大攻击面。

## 在 WebView 中只加载服务器

应用的 WebView 运行前端，并可以访问令牌。2023 年，一个链接可以让 Android 应用在该 WebView 中[加载任意 URL](https://github.com/home-assistant/core/security/advisories/GHSA-jvpm-q3hq-86rg)。攻击者的页面随后将以与前端相同的权限运行。

教训：来自链接、intent 或通知的 URL 是不可信的。在 WebView 加载它之前，先检查它指向哪里。

## 保护 JavaScript 桥接

前端通过一个 JavaScript 桥接与应用通信：Android 上是 `window.externalApp`，iOS 上是 `getExternalAuth` 等消息处理器。前端通过它请求访问令牌。

2026 年，[两个错误叠加在一起](https://github.com/home-assistant/core/security/advisories/GHSA-7jp2-p2fw-mgvf)，让框架中的网页——比如仪表盘（dashboard）上的网页卡片——能够获取该令牌：

1. 桥接响应了每一个框架，包括来自其他源的框架。
2. 应用将消息中的回调名称未经检查地放入了它在主框架中运行的 JavaScript 中。

应用目前采取的措施：

- 在 Android 上，较新的桥接 `externalAppV2` 使用 `addWebMessageListener`，并忽略来自框架的消息，以及与已加载服务器不匹配的源的消息。当服务器和 WebView 支持时，应用会使用它。
- 在 Android 上，`getExternalAuth` 和 `revokeExternalAuth` 只接受前端使用的两个回调名称 `externalAuthSetToken` 和 `externalAuthRevokeToken`，对两个桥接均如此。
- 在 iOS 上，`SafeScriptMessageHandler` 只传递来自主框架、且 scheme、host 和端口与服务器 URL 匹配的消息。

Android 检查的核心如下所示：

```kotlin
if (!isMainFrame) {
    Timber.w("Ignored message from iframe")
    return@addWebMessageListener
}
val currentUri = stateProvider().url?.toUri()
if (!sourceOrigin.hasSameOrigin(currentUri)) {
    return@addWebMessageListener
}
```

教训：按框架和按源来决定谁可以与桥接通信。并且永远不要把消息中的值变成代码：改为将它与一个固定列表进行比较。

## 让机密远离日志

用户在报告问题时会分享日志。Android 仓库的[日志技能](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-logging-errors/SKILL.md)要求你将用户数据包裹在 `sensitive()` 中，这样它就不会出现在发布版日志中。实体（entity）ID 没问题。URL 以及任何能识别服务器或用户的内容则不行。对于存储在手机上的数据，[架构技能](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-architecture/SKILL.md)指向了 `EncryptedSharedPreferences`。

## 相关内容

- [过往安全公告](https://www.hasscn.top/contributors/security/reference/advisories/#companion-apps)：伴侣应用的所有安全公告汇总在一张表中。
- [前端中的不可信内容](https://www.hasscn.top/contributors/security/guides/frontend/)：前端一侧，即应用所展示的内容。
- [伴侣应用](https://www.hasscn.top/contributors/companion/)：这些应用是如何构建的。
