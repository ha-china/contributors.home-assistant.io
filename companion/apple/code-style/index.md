# Apple 代码风格

> Apple 项目中的 SwiftFormat、SwiftLint、RuboCop 和 Yamllint，以及审查者关注的编码规范。

Source: https://www.hasscn.top/contributors/companion/apple/code-style/

Last verified on 2026-10-14, against https://github.com/home-assistant/iOS/blob/main/.github/workflows/ci.yml.

Apple 项目会自动格式化并检查（lint）其代码，因此代码审查可以专注于行为和边界情况，而不是风格。

## 工具

| 工具 | 检查内容 | 配置文件 |
| --- | --- | --- |
| [SwiftFormat](https://github.com/nicklockwood/SwiftFormat) | Swift 格式化 | `.swiftformat` |
| [SwiftLint](https://github.com/realm/SwiftLint) | SwiftFormat 未覆盖的 Swift 规则，以及自定义规则 | `.swiftlint.yml` |
| [RuboCop](https://rubocop.org) | Fastlane 的 Ruby 代码 | `.rubocop.yml` |
| [Yamllint](https://yamllint.readthedocs.io/) | 工作流及其他 YAML | `.yamllint.yml` |

## 运行它们

```bash
# Report problems, change nothing
bundle exec fastlane lint

# Fix what can be fixed automatically
bundle exec fastlane autocorrect
```

在每次提交前运行 `autocorrect`。或者让 git 替你完成：

```bash
bundle exec fastlane install_git_hooks
```

在 Xcode 中，这些检查工具只显示警告，不会修改你的代码。CI 还会运行 Yamllint，它不属于 `lint` lane 的一部分。

## 配置强制执行的内容

- **格式化**：每行最多 120 个字符，参数和集合在第一个元素之前换行，仅在初始化器中使用 `self`，`guard` 和 `else` 位于同一行，且不使用文件头注释。
- **SwiftLint** 使用规则白名单，而非所有默认规则。其中包括：禁止 `force_cast` 和 `force_try`，以及较低的圈复杂度。
- **自定义 SwiftLint 规则**：在测试之外绝不向 `Current` 赋值，并使用 `SFSafeSymbols` 而不是原始的 SF Symbol 名称。

```swift
// Wrong
Image(systemName: "house")

// Right
Image(systemSymbol: .house)
```

### 抑制某条规则

使用 `// swiftlint:disable` 时要小心。CI 会在每个拉取请求（pull request）中查找新增的此类注释，并在发现时进行评论（针对来自仓库本身分支的拉取请求），以便维护者确认它确实有必要。每一次抑制都需要充分的理由。

## 约定

- **每个文件一个类型**，以该类型命名，并且每个 SwiftUI 视图都要有 `#Preview`。参见[每次更改的规则](https://www.hasscn.top/contributors/companion/apple/architecture/#rules-for-every-change)。
- **使用 `Current.Log` 记录日志**，绝不使用 `print` 或 `NSLog`。
- **小而命名良好的类型和函数**，便于独立测试。
- **共享代码放入共享模块**，而不是在各个 target 之间复制。不要把对某个 target 的假设写进共享代码或扩展代码中。
- **面向用户的文本**放在 `en.lproj/Localizable.strings` 中。SwiftGen 会生成你在代码中使用的 `L10n` 访问器，翻译来自 [Lokalise](https://www.hasscn.top/contributors/translate/)。

## 生成的文件

有些文件由工具或工作流生成，例如 `L10n` 访问器以及图标和颜色集。生成的文件通常会在顶部注释中说明这一点。不要手动编辑它们：修改源内容并运行相应工具。当你改动 Ruby 或工作流代码时，请确保其检查工具仍然通过。
