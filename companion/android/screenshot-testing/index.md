# Android 截图测试

> 使用 Compose Preview Screenshot Testing，确保 Android 应用中的 Compose UI 只在有意的更改时才发生变化。

Source: https://www.hasscn.top/contributors/companion/android/screenshot-testing/

Last verified on 2026-11-06, against https://github.com/home-assistant/android/blob/main/.github/workflows/pr.yml.

截图测试会将 UI 与仓库中的参考图像进行比较。当渲染出的 UI 不再与其参考图像匹配时，测试就会失败，因此每一次 UI 更改都是有意的。它们只测试外观，从不测试逻辑。

当 UI 库更新时，它们尤其有用。它们在 Wear Compose 等库的 beta 版本上已经证明了自身的价值，因为库中的更改可能会改变应用的外观。

## 工作原理

该应用使用 [Compose Preview Screenshot Testing](https://developer.android.com/studio/preview/compose-screenshot-testing-with-testsuites)，并将其设置为 Android Gradle Plugin 的一个测试套件。它在 JVM 上渲染 composable，因此无需模拟器。这使得它们比仪器测试更快、更便宜。

测试位于每个模块的 `src/screenshotTest` 中。这是该套件编译的唯一源集：没有 flavor 或构建类型的变体。该套件针对每个模块的一个变体运行，参考图像存储在其旁边：

| 模块 | 变体 | 参考图像 |
| --- | --- | --- |
| `:app` | `fullDebug` | `src/screenshotTestDefaultFullDebug/reference` |
| `:common` 和 `:wear` | `debug` | `src/screenshotTestDefaultDebug/reference` |

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

第一个任务覆盖 `:common` 和 `:wear`，第二个覆盖 `:app`，后者有 flavor。Android Studio 在 **Screenshot tests verification** 运行配置中也有相同的两个任务。当测试失败时，模块中 `build/reports/tests/<task name>/index.html` 的报告会显示参考图像、新图像以及它们的差异。

CI 在每个 pull request 上运行相同的验证，在 **Screenshot Tests** 任务中，差异会导致检查失败，直到问题解决。

在有意的 UI 更改之后，更新参考图像：

```bash
./gradlew \
  updateDebugScreenshotTestDefaultTestSuite \
  updateFullDebugScreenshotTestDefaultTestSuite
```

更新后不要立即运行测试任务：它会与你刚刚从相同代码生成的图像进行比较。相反，请查看更新后的图像，并检查只有你打算更改的内容发生了变化。在你的 pull request 中解释这些更改。

## 当 CI 与你的机器不一致时

不同操作系统之间的渲染会略有差异，例如在抗锯齿方面（参见这个 [Google issue](https://issuetracker.google.com/issues/348590914)）。阈值被保持在尽可能低的水平，这样真实的问题就不会被掩盖。这意味着你在本地生成的图像可能会在 CI 上失败。

不要在本地纠结于像素差异。如果你的截图测试仅仅因为这些差异而失败，维护者会在审查过程中处理。他们可以运行 **Update Screenshots** 工作流（`updateScreenshot.yml`），该工作流会在与 CI 所用主机相同类型的环境中重新生成图像，并将其提交到你的分支。运行它需要对仓库的写权限，并且它只适用于主仓库中的分支，不适用于 fork。该工作流不会重新触发 pull request 检查：之后请推送一个新的 commit 来触发它们。
