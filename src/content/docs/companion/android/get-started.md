---
title: Android 入门
description: 安装 Android Studio，fork 并克隆仓库，构建应用，并在模拟器或手机上运行。
sidebarLabel: 入门
sidebarGroup: 设置
order: 1
source: https://github.com/home-assistant/android/blob/main/.github/workflows/pr.yml
lastVerified: 2026-11-06
---

Android Studio 是你唯一需要的工具。它自带 Android SDK、模拟器和 JDK。本页面将带你从零开始，直到应用在模拟器上运行。

## 1. 安装 Android Studio

安装最新稳定版的 [Android Studio](https://developer.android.com/studio)。

本项目还需要 NDK 和 CMake，用于原生唤醒词代码。Android Studio 通常会在首次 Gradle 同步时自动安装它们。如果失败，请自行安装：

1. 打开 **Settings** > **Languages & Frameworks** > **Android SDK** > **SDK Tools**。
2. 勾选 **NDK (Side by side)** 和 **CMake**。
3. 安装 `gradle/libs.versions.toml` 中 `androidNdk` 和 `cmake` 下列出的版本。

## 2. Fork、克隆和创建分支

1. 在 GitHub 上 fork [home-assistant/android](https://github.com/home-assistant/android)。不熟悉 fork？GitHub 解释了[如何 fork 一个仓库](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)。
2. 克隆你的 fork，并进入它创建的文件夹：

   ```bash
   git clone https://github.com/<your-github-username>/android.git
   cd android
   ```

   或者在 Android Studio 中，使用 **File** > **New** > **Project from Version Control**。在项目文件夹中运行以下命令。

3. 为你的改动创建一个分支，分支名要能说明你在做什么：

   ```bash
   git checkout -b fix-sensor-crash
   ```

## 3. 添加 Firebase 配置

`full` flavor 使用 Firebase 发送推送通知，构建时每个应用模块都需要一个 `google-services.json` 文件。除非你从事推送通知的开发，否则请使用仓库中的模拟文件。在 `android` 文件夹中运行以下命令：

```bash
cp .github/mock-google-services.json app/google-services.json
cp .github/mock-google-services.json automotive/google-services.json
cp .github/mock-google-services.json wear/google-services.json
```

使用模拟文件时，通知仍然可以通过 WebSocket 连接工作，只是不经过 Firebase。如果你需要真实的推送通知，请参阅[推送通知](/companion/android/push-notifications/)。

## 4. 构建和运行

在 Android Studio 中：

1. 打开项目并等待 Gradle 同步完成。
2. 选择 `app` 运行配置以及一个模拟器或已连接的设备。
3. 选择 **Run**。

在终端中，将 `JAVA_HOME` 设置为 JDK 21（CI 使用的版本），然后运行：

```bash
./gradlew assembleDebug
```

在 Windows 上，使用 `gradlew.bat assembleDebug`。这会构建两个 [flavor](/companion/android/flavors-and-targets/) 的 debug 变体。要在正在运行的模拟器或设备上安装 `full` debug 应用：

```bash
./gradlew :app:installFullDebug
```

debug 构建有自己的应用 ID，即 `io.homeassistant.companion.android.debug`，因此它会与 Play 商店的应用并列安装。它的图标是红色背景，方便你区分两者。

需要签名的 release 构建？请参阅[自行构建签名的 release 版本](/companion/android/releases/#build-a-signed-release-yourself)。

应用运行起来后，将其连接到一个 Home Assistant 实例。如果可以，请使用测试实例：每次你完成引导设置，应用都会在该服务器上注册一个新设备。

## 常用命令

这些是你最常用的命令，与 CI 运行的命令相同：

```bash
# 格式化代码，每次提交前运行
./gradlew :build-logic:convention:ktlintFormat ktlintFormat

# 单元测试，或对单个模块使用 :common:test
./gradlew test

# 静态分析
./gradlew detektMain :build-logic:convention:detektMain --continue
./gradlew lint --continue

# Screenshot tests, per module
./gradlew :app:testFullDebugScreenshotTestDefaultTestSuite
./gradlew :wear:testDebugScreenshotTestDefaultTestSuite
./gradlew :common:testDebugScreenshotTestDefaultTestSuite

# 更改依赖之后
./gradlew alldependencies --write-locks
```

## 测试拉取请求（pull request）构建

你无需构建任何东西就可以尝试别人的改动。CI 会为每个拉取请求构建 APK：

1. 在 GitHub 上打开该拉取请求，进入 **Checks** 标签页。
2. 选择 **Pull Request** 工作流，向下滚动到 **Artifacts**。
3. 下载 **APKs** artifact。你必须登录 GitHub 才能执行此操作。
4. 解压它。其中包含手机、Wear OS 和 Android Automotive 应用的 debug APK。对于手机，请选择 `full` 或 `minimal` APK。
5. 通过手机上的文件管理器安装，或使用 `adb install path/to/app.apk`。

只有构建任务完成后 artifact 才会出现。该任务会等待 lockfile 和 KTLint 检查，因此如果其中任何一项失败，就不会有 APK。

debug APK 会与你的常规应用并列安装，图标为红色，因此你可以在不丢失现有配置的情况下进行测试。

## AI 工具

仓库在 `AGENTS.md` 中提供了 AI 编程工具的使用说明，并在 `.agents/skills/` 中提供了技能，例如 `ha-android-architecture`、`ha-android-testing` 和 `ha-android-review`。拉取请求模板会询问你是否使用了 AI 以及如何使用。[使用 AI 工具贡献](/start/ai-tools/)列出了所有技能，并解释了 [AI 政策](/start/ai-policy/)对你的要求。

## 接下来做什么

- 阅读[架构](/companion/android/architecture/)文档，熟悉代码结构。
- 看看[开发者游乐场](/companion/android/debugging/#the-developer-playground)，这是一个仅限 debug 版本的界面，用于快速尝试各种功能。
- 遇到问题？请在 Discord 上的 [Android 项目讨论帖](discord:android-project)中提问。
