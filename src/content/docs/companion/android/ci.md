---
title: Android 持续集成
description: Android 应用的 GitHub Actions 工作流。哪些会在你的拉取请求上运行、合并后运行，以及定时运行。
sidebarLabel: Continuous integration
sidebarGroup: Ship
order: 2
source: https://github.com/home-assistant/android/tree/main/.github/workflows
lastVerified: 2026-10-27
---

Android 应用在所有环节都使用 GitHub Actions：检查拉取请求、构建发布版本，并通过 [Fastlane](https://fastlane.tools/) 将其发布到应用商店。共享的步骤以本地 action 的形式存放在 `.github/actions` 中。

该应用与 Home Assistant Core 一样，使用[日历版本号](https://calver.org/)：`YYYY.MM.patch`。

## 工作流

| 工作流 | 运行时机 | 作用 |
| --- | --- | --- |
| `pr.yml` | 每个拉取请求 | 检查代码风格、构建、测试，并附加 APK |
| `pr-emulator-wtf.yml` | 在 `pr.yml` 完成后 | 在 Emulator.wtf 上运行 `:app` 的插桩测试 |
| `zizmor.yml` | 每个拉取请求，以及每周一 05:30 UTC | 使用 [zizmor](https://docs.zizmor.sh/) 扫描工作流和本地 action 本身，并将发现上传到代码扫描 |
| `onPush.yml` | 每次推送到 `main` | 构建发布版本并发布到 Play Store 的内部轨道 |
| `weekly.yml` | 每周日 04:00 UTC | 标记新版本，并以 `beta` 标志运行 `onPush.yml`，这会创建 GitHub 预发布版本并将构建提升到 beta 轨道 |
| `e2e.yml` | 每天 05:00 UTC | 针对真实的 Home Assistant 运行[端到端测试](/companion/android/e2e-testing/)。失败时，它会启动 `e2e-triage`，一个代理工作流，调查失败并在 issue 中报告 |
| `monthly.yml` | 每月第一天 | 创建当月第一个版本标签 `YYYY.MM.0` |
| `release.yml` | 当预发布版本成为正式版本时，或手动触发 | 将 beta 版本提升到 Play Store 的生产环境 |
| `updateScreenshot.yml` | 由维护者手动触发 | 重新生成[截图](/companion/android/screenshot-testing/)参考 |
| `renovate-lockfiles.yml` | 每次推送到 `renovate/` 分支 | 更新 Renovate 拉取请求的[锁文件](/companion/android/dependencies/)并推送它们 |

## 在你的拉取请求上

`pr.yml` 会检查你的更改：

- KTLint、Detekt、Android Lint 和 Yamllint。参见[代码风格和 lint](/companion/android/code-style/)。
- 锁文件与版本目录匹配。
- 所有依赖项的许可证与项目的 Apache 2.0 许可证兼容，使用 `.github/scripts/check_licenses.py` 检查。
- 单元测试和截图测试。
- 每个应用都能以 debug 和 release 模式构建。
- `common/schemas` 中现有的数据库模式未被更改，并且构建不会产生你忘记提交的模式更改。要更改数据库，请改为增加其版本号。
- 如果你的拉取请求更改了 `.github/actions/download-translations` 中的 Lokalise 设置，翻译仍然可以下载。
- `zizmor.yml` 以 pedantic 模式使用 [zizmor](https://docs.zizmor.sh/) 扫描每个工作流和本地 action，无论你的拉取请求是否触及它们。生成的 `e2e-triage.lock.yml` 会被跳过，因为它无法手动编辑。任何发现都会导致检查失败，并且这些发现也会作为代码扫描注释出现在你的拉取请求上。参见[修改工作流](#changing-a-workflow)。
- 它将 APK 作为工件上传，以便任何人都可以[测试你的更改](/companion/android/get-started/#test-a-pull-request-build)。

CI 上的 debug 构建使用 `.github/mock-google-services.json` 中的模拟 Firebase 文件。

当某项检查失败时，请修复它并推送一个新的提交：这会重新启动工作流。当你快速推送多个提交时，只有最新的一个会被构建。更早的运行会被取消。

如果你是新贡献者，维护者必须先批准你拉取请求上的每次 CI 运行。运行 CI 会消耗大量资源，所以在你的工作准备好供人查看之前，不要打开拉取请求，即使是草稿也不行。随时推送到你自己的 fork 则没有问题。

### 插桩测试

`:app` 的插桩测试在 [Emulator.wtf](https://emulator.wtf) 上运行，覆盖从 `androidSdk-min` 到 `androidSdk-target` 的每个 API 级别，只需几秒钟。

这需要两个工作流。`pr.yml` 构建测试 APK 和设备列表。然后，在 `pr.yml` 完成时触发的 `pr-emulator-wtf.yml` 运行它们，并在拉取请求上报告结果。这种拆分正是它能在 fork 上运行的原因：由 fork 启动的工作流无法访问 secrets，因此无法连接到 Emulator.wtf。第二个工作流在主仓库的上下文中运行，并且只运行第一个工作流构建的 APK，绝不会运行来自 fork 的代码。

`:wear`、`:automotive`、`:common` 和 `:microwakeword` 的插桩测试在 GitHub Actions 的常规 Android 模拟器上运行。Emulator.wtf 只提供手机、平板和显示器设备，因此这是 Wear OS 和 Automotive 的唯一选择。一个 runner 上只能容纳一个模拟器，所以每个 API 级别和设备配置都是独立的任务，而且每个任务都比整个 Emulator.wtf 运行慢得多。这就是为什么这些目标只覆盖少数几个 API 级别。

## 合并之后

每次推送到 `main` 都会经过 `onPush.yml`。它会从 Lokalise 下载最新翻译，根据已合并的拉取请求生成发布说明，构建所有应用的发布版本，将 APK 附加到工作流运行中，并发布到 Play Store 的内部测试轨道。签名密钥和发布所需的其他文件来自仓库的 secrets，并且只在运行期间添加。

所有商店部署都通过 [Fastlane](https://fastlane.tools/) 进行。它的配置（包括工作流调用的 lane）位于 `fastlane` 文件夹中。

带 `beta` 标志运行时（`weekly.yml` 每周日都会这样做），它还会创建一个包含 APK 的 GitHub 预发布版本，准备 Amazon 商品页面，并将构建提升到 beta 轨道。

因此，每个合并的拉取请求都会到达内部测试人员。关于通往生产环境的其余流程，请参见[发布](/companion/android/releases/)。

## 修改工作流

- 将多个工作流需要的步骤放在 `.github/actions` 中的本地 action 中，而不是复制它们。
- 仔细选择触发器。每次运行都会消耗资源，因此工作流只应在其结果重要时运行。
- 切勿将 secrets 放在工作流文件中。像现有工作流那样，在运行时从仓库 secrets 中传入它们。
- 让 [zizmor](https://docs.zizmor.sh/) 满意：为每个作业命名，只给它需要的权限并附上原因注释，设置 `concurrency` 组，并将 action 固定到提交 SHA。
- 在标记的行上使用 `# zizmor: ignore[rule-name]` 并附上原因来抑制误报，就像 `pr-emulator-wtf.yml` 所做的那样。不要忽略整个文件。
- 周一的运行还会检查新的公告和过期的固定版本，并在失败时打开或评论 `zizmor-failure` issue。

## F-Droid

[F-Droid](https://f-droid.org/packages/io.homeassistant.companion.android.minimal/) 会根据每个 GitHub 发布版本自行构建 `minimal` 应用，遵循其[元数据](https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/io.homeassistant.companion.android.minimal.yml)。每个发布版本为此包含三个文件：

- `version_code.txt`：构建的版本号。
- `strings.zip`：构建时来自 Lokalise 的翻译。
- `locales_config.xml`：根据这些翻译生成的[区域设置配置](https://developer.android.com/guide/topics/resources/app-languages#use-localeconfig)。

发布版本何时出现在 F-Droid 上由 F-Droid 决定。
