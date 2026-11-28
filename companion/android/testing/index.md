# 测试 Android 应用

> 如何为 Android 应用编写测试，以及如何使用 JUnit、MockK、Robolectric 和 Turbine 编写单元测试。

Source: https://www.hasscn.top/contributors/companion/android/testing/

测试之所以存在，是因为人都会犯错。一个能在缺陷发布前将其捕获的测试，可以让用户免受困扰，也让你免于调试之苦。每个改变行为的拉取请求（pull request）都应附带测试。

## 测试的种类

| 种类 | 运行环境 | 用途 | 页面 |
| --- | --- | --- | --- |
| 单元测试 | JVM，必要时使用 Robolectric | 逻辑：ViewModel、管理器、仓库 | 本页 |
| 截图测试 | JVM | Compose UI 的外观 | [截图测试](https://www.hasscn.top/contributors/companion/android/screenshot-testing/) |
| 插桩测试 | 模拟器 | 真实 Android 运行时上的行为 | [插桩测试](https://www.hasscn.top/contributors/companion/android/instrumentation-testing/) |
| 端到端测试 | 模拟器，对接真实的 Home Assistant | 关键路径，从登录到仪表盘 | [端到端测试](https://www.hasscn.top/contributors/companion/android/e2e-testing/) |

从单元测试开始。它们速度快，而且大多数代码都应该能以这种方式测试。只有在不得已时才向上面的列表逐级提升。

## 测试命名

按照 [GIVEN, WHEN, THEN](https://en.wikipedia.org/wiki/Given-When-Then) 的方式，把测试命名为句子。这样不用读测试内容就能知道哪里出了问题：

```kotlin
@Test
fun `Given user authenticated when opening app then show dashboard`() {
    // Test implementation
}
```

- **Given** 是起始状态，即准备工作。
- **When** 是你要测试的动作或事件。
- **Then** 是你期望的结果。

## 测试什么

- **通过公共 API 测试行为**，而不是实现细节。遵循公共接口的测试能在重构中存活下来。
- **不要为了测试而放宽可见性。** 通过公共入口点进行测试。实在没有其他办法时，可以使用 [`@VisibleForTesting`](https://developer.android.com/reference/kotlin/androidx/annotation/VisibleForTesting)，例如针对接受 `CoroutineScope` 或 `Clock` 的构造函数。Lint 会标记在测试之外使用此类成员的任何情况，CI 会因 lint 警告而失败。
- **测试你自己的代码，而不是库。** 如果你发现自己在测试某个库，请把测试贡献给那个库。当你确实想固定某个库的行为时，请在测试中说明原因。
- **边构建边写测试。** 测试是开发过程中的工具，而不是事后的负担。它们让你无需运行整个应用就能检查代码，而且尽早编写测试能让代码保持可测试性。
- **不要为了测试而测试。** 跳过琐碎的代码。一个测试应该能在此刻或将来帮到你或下一个人。
- **保持测试相互独立。** 一个测试不得依赖另一个测试，也不得依赖它们的运行顺序。
- **每个测试只测一个行为。** 将几乎相同的测试合并为一个使用 `@ParameterizedTest` 的参数化测试。
- **把一个功能的测试放在同一个类中**，与 `src/test/kotlin/` 下的源码结构保持一致。
- **绝不使用 `Thread.sleep`。** 使用可以伪造时间的 `runTest`。

## 单元测试

```bash
./gradlew test
./gradlew :common:test
```

### 框架

- **[JUnit Jupiter](https://junit.org/)** 用于单元测试。仅在 Robolectric 需要时使用 JUnit 4；两者都运行在 JUnit Platform 上。
- **[MockK](https://mockk.io/)** 用于模拟（mock）。尽可能优先使用真实对象或伪造对象（fake）。
- **[Turbine](https://github.com/cashapp/turbine)** 用于所有 Flow 测试。
- **[Robolectric](https://robolectric.org/)** 用于那些你无法很好地模拟或伪造的、需要 Android API 的代码。相比插桩测试，优先使用它。

一个测试大致如下：

```kotlin
@Test
fun `Given a valid user ID when fetching details then return user`() {
    // Given
    val expectedUser = User(id = "12345", name = "John Doe")
    every { userRepository.getUser("12345") } returns expectedUser

    // When
    val result = userService.getUserDetails("12345")

    // Then
    assertEquals(expectedUser, result)
}
```

### Robolectric

每个 Robolectric 测试类都需要同时加上这两个注解。没有它们，Robolectric 会启动真实的应用程序，从而开启 StrictMode 和 FailFast，可能导致测试 JVM 崩溃：

```kotlin
@RunWith(RobolectricTestRunner::class)
@Config(application = HiltTestApplication::class)
class MyTest {
    // Tests
}
```

Robolectric 只支持 JUnit 4（参见[这个 Robolectric issue](https://github.com/robolectric/robolectric/issues/3477)），因此项目为这些测试保留了 JUnit 4。如果你的代码依赖 Android 系统的真实状态，请改为编写[插桩测试](https://www.hasscn.top/contributors/companion/android/instrumentation-testing/)。

### Flow

使用 Turbine 来测试 Flow。使用 `awaitItem`、`awaitComplete` 和 `expectNoEvents` 进行断言。当你同时收集多个 flow 时，使用 `turbineScope` 和 `testIn`。通过 `shareIn` 创建的 flow 永远不会完成：应以 `expectNoEvents()` 和 `cancelAndConsumeRemainingEvents()` 结束，而不是 `awaitComplete()`。

绝不要使用闩锁（latch）、睡眠或 `verify(timeout = ...)` 来同步发射（emission）。

### 协程与主调度器

在 `viewModelScope` 中运行的代码使用主调度器（main dispatcher），而它在 JVM 上并不存在。请使用与你的框架匹配的辅助工具，将其替换为测试调度器：

```kotlin
// JUnit Jupiter
@ExtendWith(MainDispatcherJUnit5Extension::class)
class MyViewModelTest

// JUnit 4 and Robolectric
@get:Rule
val mainDispatcherRule = MainDispatcherJUnit4Rule()
```

只把它添加到真正涉及主调度器的测试中。两者都使用 `StandardTestDispatcher`；用 `runTest` 和 `advanceUntilIdle` 来推进它。不要为了让测试通过而切换到 `UnconfinedTestDispatcher`。那会掩盖测试本应检查的顺序问题。

### 共享测试辅助工具

`:testing-unit` 模块存放着多个模块的测试所使用的辅助工具。在编写新的辅助工具之前，先去那里看看。其中包括上述主调度器辅助工具、一个 `FakeClock` 和 `TestSharedFlow`。保持 `:testing-unit` 独立于 `:common`，以避免循环依赖。

必须对模块中每个测试都生效的规则，例如重置进程级状态，是通过 `ServiceLoader` 注册的 JUnit Platform 监听器。Robolectric 在自己的类加载器中运行测试，因此这类规则还需要一个 Robolectric 插件。现有的 `TestStateResetPlatformListener` 和 `TestStateResetRobolectricPlugin` 展示了具体做法。
