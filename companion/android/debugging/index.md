# Android 调试工具

> Android 应用调试构建中的开发者游乐场、Compose 目录、StrictMode 和 LeakCanary。

Source: https://www.hasscn.top/contributors/companion/android/debugging/

Android 应用的调试构建（debug build）自带一些工具，可以加快开发速度并尽早发现问题。这些工具都不会出现在发布构建（release build）中。

## 开发者游乐场

应用依赖服务器和网页视图，因此想尝试某个功能往往意味着要先完成引导流程并经过几个界面。开发者游乐场跳过了这些步骤。它是调试构建中的一个[应用快捷方式](https://developer.android.com/develop/ui/views/launch/shortcuts/creating-shortcuts#static)：长按应用图标并选择 **DevPlayground**。在 Android Studio 中，`dev playground` 运行配置可以直接打开它。它的代码位于 `app/src/debug` 源集中，因此永远不会进入发布版本。

在游乐场中，你可以（除其他功能外）故意让应用崩溃或触发快速失败（fail fast）、启动 NFC 标签模拟器，以及打开包含所有 `HA*` 组件的 [Compose 目录](https://www.hasscn.top/contributors/companion/android/compose/#the-compose-catalog)。

请随意使用游乐场。但只提交对其他开发者也有帮助的更改，例如用于测试崩溃报告的崩溃按钮，或展示所有组件和主题的目录。已提交的游乐场代码与其他代码一样，需遵循[代码风格](https://www.hasscn.top/contributors/companion/android/code-style/)和[最佳实践](https://www.hasscn.top/contributors/companion/android/best-practices/)。那里不需要翻译。

## StrictMode

[StrictMode](https://developer.android.com/reference/android/os/StrictMode) 在 Android 12 或更新版本的设备上的调试构建中是开启的。它会捕获主线程上的磁盘和网络访问，以及较新 Android 版本已弃用的行为，这使得迁移到新的 Android API 级别更加容易。

无论是 [VM 策略](https://developer.android.com/reference/android/os/StrictMode.VmPolicy.Builder)还是[线程策略](https://developer.android.com/reference/android/os/StrictMode.ThreadPolicy.Builder)的违规，都会进入 `FailFast`，因此调试构建会因此崩溃。来自项目无法控制的代码的已知违规（例如 WebView 或厂商框架），会通过 [`app/src/main/kotlin/io/homeassistant/companion/android/util/IgnoreViolationRules.kt`](https://github.com/home-assistant/android/blob/main/app/src/main/kotlin/io/homeassistant/companion/android/util/IgnoreViolationRules.kt) 中的规则被忽略。

如果 StrictMode 阻碍了你，可以在某次构建中将其关闭：

```bash
./gradlew :app:assembleFullDebug -PnoStrictMode
```

或者在 `gradle.properties` 中取消注释 `noStrictMode=true`。如果你不得不将其关闭，请提交一个 issue 或在 [Discord](https://www.home-assistant.io/join-chat/) 上提及，以便从根本上解决问题。

## LeakCanary

[LeakCanary](https://square.github.io/leakcanary/) 已包含在调试构建中，会在你工作时报告内存泄漏，以便你尽早修复。如果它报告了泄漏，请提交一个 issue。如果泄漏来自某个库且目前无法修复，请将其记录下来。

要在构建时不包含它，例如进行性能测试时：

```bash
./gradlew :app:assembleFullDebug -PnoLeakCanary
```

或者在 `gradle.properties` 中设置 `noLeakCanary=true`，可以在项目中设置，也可以在你的 Gradle 用户主目录中设置。

> [!WARNING]
> 没有 LeakCanary 时，解析出的依赖项会发生变化，Gradle 会针对锁文件报错。请按照[依赖项](https://www.hasscn.top/contributors/companion/android/dependencies/#lockfiles)中的说明在本地更新锁文件，但不要提交这些更改。拉取请求上的锁文件检查会在包含 LeakCanary 的情况下重新生成锁文件，如果与你提交的内容不同则会失败。

## FailFast

`FailFast` 会在捕获到发布构建可以默默容忍的错误时使调试构建崩溃。日志中会显示一个带有堆栈跟踪的大号 `CRITICAL FAILURE: FAIL-FAST` 横幅。参见[快速失败](https://www.hasscn.top/contributors/companion/android/best-practices/#fail-fast)。
