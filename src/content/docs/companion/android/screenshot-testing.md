---
title: Android 截图测试
description: 使用 Compose Preview Screenshot Testing，确保 Android 应用中的 Compose UI 只在有意的更改时才发生变化。
sidebarLabel: 截图测试
sidebarGroup: Test
order: 2
source: https://github.com/home-assistant/android/blob/main/.github/workflows/pr.yml
lastVerified: 2026-11-06
---

截图测试会将 UI 与仓库中的参考图像进行比较。当渲染出的 UI 不再与其参考图像匹配时，测试就会失败，因此每一次 UI 更改都是有意的。它们只测试外观，从不测试逻辑。

当 UI 库更新时，它们尤其有用。它们在 Wear Compose 等库的 beta 版本上已经证明了自身的价值，因为库中的更改可能会改变应用的外观。

## 工作原理

The app uses [Compose Preview Screenshot Testing](https://developer.android.com/studio/preview/compose-screenshot-testing-with-testsuites), set up as a test suite of the Android Gradle Plugin. It renders composables on the JVM, so no emulator is needed. That makes them much faster and cheaper than instrumentation tests.

Tests live in `src/screenshotTest` of each module. That is the only source set the suite compiles: there is no flavor or build type variation of it. The suite runs against one variant per module, and the reference images are stored next to it:

| Module | Variant | Reference images |
| --- | --- | --- |
| `:app` | `fullDebug` | `src/screenshotTestDefaultFullDebug/reference` |
| `:common` and `:wear` | `debug` | `src/screenshotTestDefaultDebug/reference` |

## 编写截图测试

- **渲染真实的 composable**，而不是简化的副本，并覆盖每个有意义的状态：加载中、空、错误，以及在有多个服务器有影响时包含多个服务器的情况。
- **复用你的预览。** 使用相同的 composable 和预览注解，这样预览和测试就不会产生偏差。
- **覆盖尺寸和主题**：从 Wear OS 手表这样的小屏幕到电视这样的大屏幕，并覆盖浅色和深色模式。使用配置注解来设置设备尺寸、主题和其他参数。

## 运行和更新

检查是否有任何变化：

```bash
./gradlew \
  testDebugScreenshotTestDefaultTestSuite \
  testFullDebugScreenshotTestDefaultTestSuite
```

The first task covers `:common` and `:wear`, the second `:app`, which has flavors. Android Studio has the same two tasks in the **Screenshot tests verification** run configuration. When a test fails, the report in `build/reports/tests/<task name>/index.html` of the module shows the reference, the new image, and their difference.

CI runs the same validation on every pull request, in the **Screenshot Tests** job, and a difference fails the check until it is resolved.

在有意的 UI 更改之后，更新参考图像：

```bash
./gradlew \
  updateDebugScreenshotTestDefaultTestSuite \
  updateFullDebugScreenshotTestDefaultTestSuite
```

Don't run the test task right after an update: it compares against images you just generated from the same code. Look at the updated images instead, and check that only what you meant to change has changed. Explain the changes in your pull request.

## 当 CI 与你的机器不一致时

不同操作系统之间的渲染会略有差异，例如在抗锯齿方面（参见这个 [Google issue](https://issuetracker.google.com/issues/348590914)）。阈值被保持在尽可能低的水平，这样真实的问题就不会被掩盖。这意味着你在本地生成的图像可能会在 CI 上失败。

不要在本地纠结于像素差异。如果你的截图测试仅仅因为这些差异而失败，维护者会在审查过程中处理。他们可以运行 **Update Screenshots** 工作流（`updateScreenshot.yml`），该工作流会在与 CI 所用主机相同类型的环境中重新生成图像，并将其提交到你的分支。运行它需要对仓库的写权限，并且它只适用于主仓库中的分支，不适用于 fork。该工作流不会重新触发 pull request 检查：之后请推送一个新的 commit 来触发它们。
