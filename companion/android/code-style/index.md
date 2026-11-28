# Android 代码风格与代码检查

> Android 应用中的 KTLint、Detekt、Android Linter 和 Yamllint。如何运行它们、抑制问题，以及使用基线（baseline）。

Source: https://www.hasscn.top/contributors/companion/android/code-style/

Android 应用使用工具来强制执行代码风格，这样代码评审就可以专注于逻辑而不是格式。CI 会在你的拉取请求（pull request）上运行所有这些工具，并将发现的问题以 diff 中的评论形式报告。

## 这些工具

| 工具 | 检查内容 | 配置位置 |
| --- | --- | --- |
| [KTLint](https://pinterest.github.io/ktlint) | Kotlin 格式化 | `.editorconfig` |
| [Detekt](https://detekt.dev/) | 可维护性和正确性 | [`.detekt/detekt.yml`](https://github.com/home-assistant/android/blob/main/.detekt/detekt.yml) |
| Android Lint | Android API 使用和项目规则 | [`build-logic/convention/src/main/kotlin/AndroidCommonConventionPlugin.kt`](https://github.com/home-assistant/android/blob/main/build-logic/convention/src/main/kotlin/AndroidCommonConventionPlugin.kt) |
| [Yamllint](https://github.com/adrienverge/yamllint) | YAML 文件 | `.yamllint` |

通过所有这些检查并不意味着代码就是好的。它只意味着评审者可以专注于真正重要的东西。

## 运行它们

```bash
# Format Kotlin, run before every commit
./gradlew :build-logic:convention:ktlintFormat ktlintFormat

# Check formatting without changing files
./gradlew ktlintCheck :build-logic:convention:ktlintCheck --continue

# Detekt, with type resolution, as CI runs it
./gradlew detektMain :build-logic:convention:detektMain --continue

# Android Lint
./gradlew lint --continue

# YAML
yamllint --strict --format github .
```

`--continue` 会报告所有模块中的问题，而不是在第一次失败时就停止。`build-logic` 是一个包含构建（included build），因此它的任务需要显式调用。对于单个模块，使用模块路径，例如 `./gradlew :app:detektMain`。

要在每次提交前运行 KTLint 检查，请安装一次 git 钩子（hook）：

```bash
./gradlew addKtlintCheckGitPreCommitHook
```

Yamllint 不会修复任何东西；请自行修复它报告的问题。

## Android Lint 设置

Android Lint 非常严格：警告会被视为错误，任何不在基线（baseline）中的问题都会导致构建失败。有几条规则是特意调整过的：

- `LogNotTimber` 是错误级别，因此所有日志都通过 Timber 输出。
- `MissingTranslation` 已关闭，因为翻译只在发布构建中通过 Lokalise 提供。
- 依赖版本检查已关闭，因为更新由 Renovate 负责。

## 抑制某个问题

只要有可能，请修复问题而不是抑制它们。当你无法修复时：

- 对于单个位置，在尽可能小的代码结构上使用 `@Suppress("rule-id")`。
- 对于 Android Lint，问题也可以放入模块的 `lint-baseline.xml` 中，详见[基线](https://www.hasscn.top/contributors/companion/android/code-style/#baselines)。
- 要为整个项目修改某条规则，请打开一个专门的拉取请求并说明原因。对于 Android Lint，修改 `AndroidCommonConventionPlugin.kt` 中的 `lint` 块。对于 KTLint，修改 `.editorconfig` 并在该规则上方添加注释说明原因，如果需要更多解释，请附上 GitHub issue 的链接。如果修改涉及代码，请使用两个提交：一个用于规则，一个用于它所影响的代码。

## 基线

各模块都有基线文件，记录了在启用某个工具之前就存在的问题：

- Android Lint 使用 `lint-baseline.xml`。
- Detekt 使用 `detekt-baseline-*.xml`。Android 模块每个变体（variant）有一个，例如 `detekt-baseline-release.xml`；JVM 模块使用 `detekt-baseline-main.xml`。

新问题会导致 CI 失败。基线中的问题则不会。

> [!TIP]
> 修复基线中的一个问题并将其从文件中移除，是一个很好的首次贡献。

当 Android Gradle Plugin 或 Detekt 的更新改变了规则时，请重新生成基线并查看变化：

```bash
./gradlew updateLintBaseline
./gradlew detektBaselineMain :build-logic:convention:detektBaselineMain \
  --continue
```

然后逐条查看新增的条目。能在同一个拉取请求中修复的就修复，必须等待的则打开一个 issue。

## 自定义 lint 规则

`:lint` 模块包含项目自己的 lint 规则。它们检查诸如 Kotlinx.serialization 缺少 `@Serializable` 注解、Room 实体上的可变属性，以及 `evaluateJavascript` 的使用等问题。如果你在评审中反复看到同样的错误，可以提议添加一条规则。

## CI 中的 SARIF 报告

这些检查工具会生成 SARIF 报告，GitHub 会将其作为标注（annotation）显示在你的拉取请求上。每个模块都会生成自己的报告，而 GitHub 每次运行只接受一份，因此 CI 会使用 [`.github/scripts/merge_sarif.py`](https://github.com/home-assistant/android/blob/main/.github/scripts/merge_sarif.py) 将它们合并。你在本地不需要这样做，但可以在检查工具运行之后执行它：`python3 .github/scripts/merge_sarif.py` 会在你运行它的目录中生成 `merged_results.sarif`。

## 约定

这些工具无法捕获所有问题。以下约定同样适用。

### 英语

所有代码和注释都使用英语。拼写错误在所难免，而且许多贡献者并非英语母语者。评审者可能会提出修改建议；在 IDE 中使用拼写检查器会有帮助。

### 不使用魔法数字或字符串

用命名常量替换无法解释的值，并在定义该值的地方加以说明：

```kotlin
// Explanation, or a link, about why the threshold is 42
const val SUPER_IMPORTANT_THRESHOLD = 42

if (value == SUPER_IMPORTANT_THRESHOLD) {
    // Do something
}
```

常量遵循 [Kotlin 命名约定](https://kotlinlang.org/docs/coding-conventions.html#property-names)。

### 常量放在哪里

1. 在文件之外使用的常量，在导入时必须能通过其自身名称或其父级名称轻松识别。
2. 大多数常量放在它们所属类的文件中，作为 `private const val` 放在文件顶部、类之外。
3. 仅在常量必须从外部访问，或者同一文件中的多个类需要同名常量（例如 `DEFAULT_TIMEOUT`）时，才使用 `companion object`。
4. 当一个文件中的常量过多，或者它们跨模块共享时，将它们移到 `*Constants.kt` 文件中，并分组到一个 `object` 里。

如果测试需要使用一个私有常量，请将其标记为 `@VisibleForTesting`，而不是将其设为公开。

这些规则还比较新，所以你会在代码中发现一些尚未遵循这些规则的常量。遇到时可以随手修复。

### TODO 需要关联 issue

TODO 容易被遗忘。请避免使用。当你和评审者一致认为某件事需要以后再做时，添加一个 TODO，并附上指向 GitHub issue 的完整链接：

```kotlin
// TODO Missing feature https://github.com/home-assistant/android/issues/404
```

始终使用完整链接，绝不要只写 `#404`：纯数字在 GitHub 之外是有歧义的。链接到代码时，请使用永久链接（permalink，在 GitHub 上按 <kbd>y</kbd> 键），这样链接在后续变更后仍然有效。
