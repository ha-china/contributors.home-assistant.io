# 测试 Apple 应用

> Apple 项目中的单元测试、快照测试、UI 测试和端到端测试，使用 Current 进行模拟，以及补丁覆盖率门槛。

Source: https://www.hasscn.top/contributors/companion/apple/testing/

Apple 应用运行在多个目标（target）上，并且大量代码在这些目标之间共享。当人们不断修改引导流程、小组件、通知、手表应用等内容时，测试能让这些共享代码保持稳定。

## 运行测试

```bash
bundle exec fastlane test
```

这会在 iPhone 模拟器上运行 `Tests-Unit` scheme，并在 Apple Watch 模拟器上运行手表测试。在 Xcode 中，选择 `Tests-Unit` scheme，然后按下 <kbd>Command</kbd>+<kbd>U</kbd>。

## 测试的位置

| 文件夹 | 测试内容 |
| --- | --- |
| `Tests/App` | 应用行为 |
| `Tests/Shared` | 共享逻辑：模型、数据库、传感器、通知和工具类 |
| `Tests/Widgets` | 小组件 |
| `Tests/WatchAppTests`, `Tests/WatchComplications` | 手表应用及其表盘复杂功能 |
| `Tests/UI` | UI 测试和端到端测试 |
| `Tests/Mocks` | 各测试共享的模拟对象（mock） |

测试的结构与 `Sources` 一致。共享的辅助代码位于 `Sources/SharedTesting`。

## 使用 Current 进行模拟

每个依赖项都存放在 [`Current`](https://www.hasscn.top/contributors/companion/apple/architecture/#the-current-environment) 中，因此测试只需在其 setup 中替换所需的部分：

```swift
override func setUp() {
    super.setUp()
    Current.date = { Date(timeIntervalSince1970: 1_000_000) }
    Current.servers = FakeServerManager()
}
```

## 快照测试

新的 SwiftUI 视图会使用 `SharedTesting` 中的辅助工具进行快照测试，覆盖浅色和深色模式：

```swift
import SharedTesting

func testMyView() {
    assertLightDarkSnapshots(of: MyView())
}
```

参考图像存放在测试旁边的 `__Snapshots__` 文件夹中。如果你有意修改了某个视图，请在提交更新后的图像之前先仔细查看它们。

## 端到端测试

[`Tests/UI/OnboardingE2ETests.swift`](https://github.com/home-assistant/iOS/blob/main/Tests/UI/OnboardingE2ETests.swift) 会针对真实的 Home Assistant 运行引导流程：从欢迎界面一直到前端通过外部总线打开的原生设置界面。它每晚在 `E2E` 工作流中运行，而不会在拉取请求（pull request）上运行。

它所驱动的元素具有来自 [`Sources/App/Accessibility/`](https://github.com/home-assistant/iOS/tree/main/Sources/App/Accessibility) 中 `AccessibilityIdentifier` 的标识符。请在那里添加用例，而不要匹配可见文本，因为翻译会破坏文本匹配。

如果要自己运行它，请先从 `.github/e2e/homeassistant` 启动 Home Assistant 实例（其 README 说明了具体方法），然后：

```bash
bundle exec fastlane e2e
```

## 推送服务器

`Sources/PushServer` 是一个独立的 Swift 包，拥有自己的测试：

```bash
cd Sources/PushServer
swift test
```

## 补丁覆盖率

CI 要求你的拉取请求所更改的代码行至少有 90% 被单元测试覆盖。低于该标准时，**Patch coverage** 检查会失败，并且任务摘要会列出没有测试运行的代码行。对于来自仓库本身分支的拉取请求，机器人还会请求更改，并在一次推送达到标准后撤销该审查。

只有可执行的代码行才计入。`Tests-Unit` 的任何目标都不会构建的文件（例如仅限手表或仅限小组件的代码）会被跳过，没有更改任何可覆盖代码的拉取请求也是如此。当代码确实无法进行单元测试时（例如 UIKit 的底层管道代码），维护者可以撤销该审查。请在拉取请求描述中说明原因。

你可以在本地得到相同的数字。请从仓库根目录运行以下命令，而不是从 `Sources/PushServer` 运行：

```bash
bundle exec fastlane test
python3 Tools/xccov_to_lcov.py \
  fastlane/test_output/Tests-Unit.xcresult \
  --lcov fastlane/test_output/coverage.lcov
python3 Tools/diff_coverage.py fastlane/test_output/coverage.lcov \
  --base origin/main
```

## 良好习惯

- 每个测试只验证一种行为。
- 优先编写确定性测试，而不是对时序敏感的测试。
- 当某项更改会影响多个目标时，尽量在靠近共享逻辑的地方进行测试。
