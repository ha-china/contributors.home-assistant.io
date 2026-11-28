# Android 版本发布

> 对 Android 应用的更改如何从合并的拉取请求（pull request）流转到内部测试人员、Beta 版和生产环境，以及如何自行构建签名的发布版本。

Source: https://www.hasscn.top/contributors/companion/android/releases/

Last verified on 2026-10-14, against https://github.com/home-assistant/android/tree/main/.github/workflows.

每个合并的拉取请求都会立即发布给内部测试人员。每周，最新的构建版本会发布到公开 Beta 版。当 Beta 版稳定后，维护者会将其提升为生产版本。本页介绍这一流程，以及如何在自己的机器上构建签名的发布版本。

## 从合并到生产

### 内部测试

当拉取请求合并到 `main` 分支时，CI 会构建发布版本并将其发布到 Play Store 的内部测试轨道。内部测试人员会立即获得每一项更改。这个应用功能繁多，因此他们无法在每个构建版本上测试每个功能。

`main` 分支上每个提交的 APK 也会附加到 [On Push 工作流运行](https://github.com/home-assistant/android/actions/workflows/onPush.yml)中。

### 每周 Beta

每周日 04:00 UTC（美洲时间为周六晚上），CI 会标记一个新版本，创建包含 APK 的 GitHub 预发布版本，并将最新的 `main` 构建版本提升为公开 Beta 版。在此截止时间之前，`ChangelogContent.kt` 中的应用内更新日志应列出本周的新功能和不向后兼容的更改。

任何人都可以[在 Google Play 上加入 Beta 测试](https://play.google.com/apps/testing/io.homeassistant.companion.android)。Beta 用户能发现测试和内部测试人员无法发现的问题。

Google 会审核每一个进入公开 Beta 版的构建版本。审核所需时间不定，可能超过一周。当上一个每周 Beta 版仍在审核中而下一个每周 Beta 版到来时，上一个会被丢弃。这不会阻塞任何流程，但当你疑惑为什么某个 Beta 版延迟时，了解这一点会很有帮助。

### 提升为生产版本

当 Beta 版稳定后，维护者会将其提升为生产版本，并推送给所有从 [Google Play](https://play.google.com/store/apps/details?id=io.homeassistant.companion.android) 安装该应用的用户。

在提升之前：

- 在 Beta 版发布后等待几天，让 Beta 用户有时间发现回归问题。
- 检查 [`app/src/main/kotlin/io/homeassistant/companion/android/changelog/ChangelogContent.kt`](https://github.com/home-assistant/android/blob/main/app/src/main/kotlin/io/homeassistant/companion/android/changelog/ChangelogContent.kt) 中的应用内更新日志是否涵盖了本次发布的内容。
- 检查 Sentry 中 Beta 版的问题数量是否异常。
- 检查 [Google Play Console](https://play.google.com/console) 是否有崩溃、ANR 和其他异常情况。
- 在[配套应用文档](https://github.com/home-assistant/companion.home-assistant)中准备一个拉取请求，移除本次发布中各功能的 Beta 标签。

提升步骤：

1. 在 [GitHub](https://github.com/home-assistant/android/releases) 上编辑最新的 Beta 版发布。保留自动生成的提交列表，并在顶部添加一个与 `ChangelogContent.kt` 相符的**本次发布亮点**部分。示例请参见 [2026.6.1](https://github.com/home-assistant/android/releases/tag/2026.6.1)。
2. 取消勾选 **pre-release**（预发布）复选框，并将其设置为 **latest**（最新）发布。

这会触发 `release.yml`，它使用 Fastlane 将 Beta 轨道提升为生产版本，涵盖手机、Wear OS 和 Automotive 应用。Google 会先审核该发布，这通常需要几天时间。审核期间无需进行任何操作。

### 其他商店

Play Store 仅覆盖 `full` 变体。发布之后：

- 将 `minimal` Automotive 应用发送到 Harman Ignite 商店。
- 在 [Amazon 开发者控制台](https://developer.amazon.com/apps-and-games/console/apps/list.html)中提交发布以供审核。APK 和更新日志在构建 Beta 版时已由 `onPush.yml` 中的 `prep_amazon` Fastlane lane 上传。
- 在 Meta Quest 商店上发布 `minimal` 应用。
- F-Droid 会在几天后自行构建发布版本。参见 [F-Droid](https://www.hasscn.top/contributors/companion/android/ci/#f-droid)。

### 发布上线后

- 合并移除 Beta 标签的文档拉取请求。
- 如果本次发布修复了自上一个生产版本以来的安全问题，请在 GitHub 发布说明中亮点部分之后添加一个**已披露的安全公告**部分，并为每个公告提供链接。
- 对于包含重大更改或出色新功能的发布，请社区经理协助宣传，例如发布博客文章或在社交媒体上推广。

## 自行构建签名发布版本

只有在你发布自己的构建版本时才需要这样做。发布构建必须经过签名。

> [!WARNING]
> 请妥善保管你的密钥库（keystore）及其密码，切勿提交到代码库中。

1. 在 Android Studio 中通过 **Build** > **Generate Signed App Bundle or APK** 创建密钥库，或使用现有的密钥库。记住密码和密钥别名。
2. 将其命名为 `release_keystore.keystore`，并放到你构建的每个应用模块中：[`app/`](https://github.com/home-assistant/android/tree/main/app)、[`wear/`](https://github.com/home-assistant/android/tree/main/wear) 或 [`automotive/`](https://github.com/home-assistant/android/tree/main/automotive)。或者将 `KEYSTORE_PATH` 设置为它的位置。
3. 设置签名变量：
   - `KEYSTORE_PASSWORD`
   - `KEYSTORE_ALIAS`
   - `KEYSTORE_ALIAS_PASSWORD`
   - `KEYSTORE_PATH`（如果密钥库在其他位置）

   读取这些变量的签名配置位于 [`build-logic/convention/src/main/kotlin/AndroidApplicationConventionPlugin.kt`](https://github.com/home-assistant/android/blob/main/build-logic/convention/src/main/kotlin/AndroidApplicationConventionPlugin.kt)。
4. 为所有应用或单个模块构建 APK 或应用包（app bundle）：

```bash
# APKs
./gradlew assembleRelease
./gradlew :app:assembleRelease

# App bundles
./gradlew bundleRelease
./gradlew :wear:bundleRelease
```

你也可以在 Android Studio 中通过 **Build** > **Generate Signed App Bundle or APK** 进行构建。
