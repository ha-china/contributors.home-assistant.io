# Android 最佳实践

> 每次 Android 代码审查中都会出现的编码规则。强类型、时间、并发、依赖注入、日志记录，以及快速失败。

Source: https://www.hasscn.top/contributors/companion/android/best-practices/

这些是审查者在 Android 应用中关注的实践。大多数归结为一个理念：让编译器和工具来发现错误，而不是靠人。

## 通用原则

- **SOLID、KISS 和 DRY。** 常规原则。
- **跟随社区。** 对于本页面未涵盖的内容，[Now in Android](https://github.com/android/nowinandroid) 应用展示了本项目所遵循的实践。
- **保持直接。** 不要为单一实现或可能永远不会到来的未来添加抽象。直接使用库或 API，当出现第二个真实使用场景时再抽象，或者为了隐藏模块之外的实现而抽象（例如在 `:common` 中定义公共接口，并通过 Hilt 绑定 `internal` 实现）。
- **不要存储可以从现有状态推导出的内容。**
- **先找根因再修复。** 缺陷修复应说明实际原因以及如何复现。不要使用只修补症状的投机性变通方案。
- **小类、小函数。** 一个难以命名的函数承担了太多职责。
- **组合优于继承。** 用小的、可复用的部分构建行为，而不是深层的类层次结构。
- **经得起时间考验的注释。** 为公共函数编写文档，在有帮助的地方添加注释，并保持注释与代码同步更新。问问自己：六个月后你还能看懂吗？

## 使用强类型表达逻辑

字符串用于显示以及来自外部的原始值。不要用它们来控制行为：拼写错误也能正常编译，却会在运行时出错。请改用密封类（sealed class）或接口，必要时可以使用 `enum`。

```kotlin
private const val DESTINATION_KEY = "destination"

@Parcelize
sealed interface Destination : Parcelable {
    data object General : Destination
    data class Notifications(val title: String) : Destination
    data object Privacy : Destination
}

fun newInstance(destination: Destination): Intent =
    Intent().apply { putExtra(DESTINATION_KEY, destination) }
```

密封类型优于枚举：每个分支都可以携带自己的数据，比如上面的 `title`。而且当你用 `when` 处理它们时，不要写 `else` 分支：

```kotlin
fun onIntent(intent: Intent) {
    val destination = IntentCompat.getParcelableExtra(
        intent,
        DESTINATION_KEY,
        Destination::class.java,
    )
    when (destination) {
        Destination.General -> showGeneral()
        is Destination.Notifications -> showNotifications(destination.title)
        Destination.Privacy -> showPrivacy()
        null -> showDefault()
    }
}
```

这样，新增一个分支时，所有尚未处理它的地方都会导致构建失败，这正是你想要的效果。你的 IDE 还能找到使用某个特定目的地的所有位置，这是字符串永远无法提供的。详情请参阅 [Kotlin 密封类文档](https://kotlinlang.org/docs/sealed-classes.html)。

如果必须使用字符串，请将其定义为 `const val`（参见[禁止魔法数字或字符串](https://www.hasscn.top/contributors/companion/android/code-style/#no-magic-numbers-or-strings)），或者将其包装在[内联值类](https://kotlinlang.org/docs/inline-classes.html)中。

## 使用真实类型表示时间

永远不要用裸数字表示时间或时长。单位很容易混淆。使用 `Instant`、`Duration` 及其相关类型，并尽早转换那些返回毫秒的 API 的值：

```kotlin
// Bad: seconds or milliseconds?
const val THRESHOLD = 600000

// Good
val THRESHOLD = 10.minutes
```

永远不要调用 `System.currentTimeMillis()`。通过 Hilt 注入 `kotlin.time.Clock`，这样测试就可以控制时间。如果确实需要原始值，请把单位写进名称：`THRESHOLD_MS`。

## 不可变性

优先使用不可变的数据类，并通过 `copy()` 或返回新实例的函数来产生变更。可见性默认使用 `private` 或 `internal`。

## 并发

- 将协程绑定到生命周期，例如 `viewModelScope` 或 `lifecycleScope`，以避免泄漏。
- 任何被多个协程访问的内容都必须是线程安全的。如果不是，就让它变得安全，或者不要共享它。
- 竞态条件非常难以调试。要提前为此做好设计。

## 依赖注入

所有可以注入的内容都通过 [Hilt](https://developer.android.com/training/dependency-injection/hilt-android) 提供。永远不要手动创建被注入的类。

当你需要同一类型的两个绑定时，请使用自定义限定符注解，而不是 `@Named("...")`。自定义注解可以进行类型检查、易于查找，并且重命名安全。`NoNamedAnnotation` lint 规则会在使用 `@Named` 时使构建失败：

```kotlin
@Qualifier
@Retention(AnnotationRetention.RUNTIME)
annotation class NamedKeyChain

@Inject
@NamedKeyChain
lateinit var keyChainRepository: KeyChainRepository
```

[Pull request #5667](https://github.com/home-assistant/android/pull/5667) 展示了一次从 `@Named("keyChainRepository")` 到 `@NamedKeyChain` 的真实迁移。

## 日志记录

使用 [Timber](https://github.com/JakeWharton/timber)，永远不要使用 `android.util.Log`。linter 会在出现 `Log` 调用时使构建失败。只记录有助于他人调试问题的内容，而不是所有内容，消息要说明什么失败了以及针对什么。永远不要记录令牌、密码或其他敏感数据。对于在 debug 构建中有帮助的用户数据，请将其包装在 `sensitive()` 中，它会在 debug 构建中显示该数据，并在 release 构建中隐藏它。

## 快速失败

发现缺陷越晚，修复就越困难。尽可能在构建时捕获错误：使用带穷举 `when` 的密封类型，以及在编译器无法强制约束时使用 [lint 规则](https://www.hasscn.top/contributors/companion/android/code-style/#custom-lint-rules)。当同一条意见在审查中反复出现时，把它变成工具，而不是依赖记忆：自定义 lint 规则、KTLint 覆盖、`FailFast` 检查，或测试监听器。

不要吞掉异常。至少要记录它们。更好的做法是：使用 `FailFast`。它会记录错误、在 debug 构建中崩溃以便你注意到，并在 release 构建中回退到安全值：

```kotlin
import io.homeassistant.companion.android.common.util.FailFast

val value = FailFast.failOnCatch(
    message = { "Couldn't read value, state: ${api.state()}" },
    fallback = "fallback",
) {
    api.value()
}
```

当 `FailFast` 触发时，Logcat 会显示来自 `CrashFailFastHandler` 的大号 `CRITICAL FAILURE: FAIL-FAST` 横幅，随后是你的消息和堆栈跟踪，因此很难被忽略。

## 以小步骤交付大改动

小的 pull request 能更快地被审查。把一个大改动拆分成多个步骤，每一步都保持应用可用。如果一次重构无法在一个小的 pull request 中交付，就把新路径放在 `WIPFeature` 对象中的一个标志后面，该标志通常仅在 debug 构建中通过 `BuildConfig.DEBUG` 启用。在用户继续使用旧路径的同时合并这些步骤，功能完成后移除该标志。其余内容请参阅[提交 pull request](https://www.hasscn.top/contributors/companion/android/submitting/)。
