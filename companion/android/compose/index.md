# Compose 与设计系统

> 使用 Jetpack Compose、HATheme 和 `HA*` 组件构建 Android UI。预览、Compose 目录、小组件和导航。

Source: https://www.hasscn.top/contributors/companion/android/compose/

Android 应用中所有新的 UI 都使用 [Jetpack Compose](https://developer.android.com/compose)。不再使用新的 XML 布局、数据绑定或视图绑定。新的小组件使用 [Jetpack Glance](https://developer.android.com/develop/ui/compose/glance)；旧的 RemoteViews 小组件不再扩展。

## 设计系统

应用在 Material 3 之上拥有自己的设计系统，位于 `:common` 模块的 `io.homeassistant.companion.android.common.compose` 中：

- **`HATheme`** 在浅色和深色模式下应用 Home Assistant 的配色。在 `setContent` 中应用一次即可，不要在屏幕 composable 内部应用。
- **`HA*` 组件**，例如 `HAAccentButton`、`HAFilledButton`、`HATextField`、`HACheckbox`、`HASwitch`、`HALoading`、`HADropdownMenu` 和 `HAModalBottomSheet`。它们位于主题旁边的 `composable` 包中。请使用它们而不是 Material 组件。
- **`LocalHAColorScheme.current`** 用于获取颜色。切勿硬编码颜色。
- **`HATextStyle`** 用于排版，**`HADimens.SPACE*`** 用于间距和尺寸。内边距不要使用魔法数字。

直接使用原始的 Material 3 组件在浅色或深色模式下会得到错误的颜色。如果你需要的 `HA*` 封装组件还不存在，请先创建它，放在单独的 pull request 中，并附带截图测试和 Compose 目录中的一个页面。

> [!NOTE]
> 你还会发现 `HomeAssistantAppTheme`，这是一个基于 Material 2 的主题。它已被弃用，仅保留到使用它的剩余屏幕迁移完成。不要在新 UI 中使用它，也不要在同一屏幕中混用 Material 2 和 Material 3。

### Compose 目录

Debug 构建包含所有 `HA*` 组件的目录。从[开发者游乐场](https://www.hasscn.top/contributors/companion/android/debugging/#the-developer-playground)通过 **Start HA Compose Catalog** 打开它。在构建新内容之前请先查看它。

## 编写屏幕

遵循 [UI 架构](https://www.hasscn.top/contributors/companion/android/ui-architecture/)：一个有状态的屏幕负责收集 ViewModel 状态，一个无状态的内容 composable 负责渲染它。这就是[状态提升](https://developer.android.com/develop/ui/compose/state-hoisting)（state hoisting），它能让你的 composable 保持可复用且易于预览。除此之外：

- **保持 composable 简小。** 将大屏幕拆分为小的私有 composable，当文件变大时将它们移到各自的文件中。
- **只传递 composable 所需的内容**，而不是整个状态。
- **UI 中不包含逻辑。** 不要在 composable 中进行排序、过滤或映射。状态应携带可直接显示的数据。如果必须在组合期间进行计算，请使用 `remember`。
- **以组件命名文件**，例如 `SettingsScreen.kt` 或 `UserCard.kt`。无状态层使用 `*Screen` 或 `*Content`。`*View` 是遗留命名。
- **无障碍**：在自定义的可点击行上设置语义 `Role`，例如 `Modifier.clickable(role = Role.Checkbox)`，并为图片提供内容描述。
- **错误和反馈**应显示在 snackbar 中，而不是 toast。
- **文本**来自 `stringResource(R.string.*)`，字符串位于 [`common/src/main/res/values/strings.xml`](https://github.com/home-assistant/android/blob/main/common/src/main/res/values/strings.xml) 中。

## 预览

为每个主要的 composable 添加一个 `@Preview`，并包裹在 `HAThemeForPreview` 中，它还会绘制正确的背景：

```kotlin
@Preview
@Composable
private fun SettingsScreenPreview() {
    HAThemeForPreview {
        SettingsScreenContent(
            uiState = SettingsUiState.Default,
            onToggleSetting = {},
        )
    }
}
```

预览是最快的迭代方式：无需构建、无需服务器、无需引导流程。请添加多个预览，覆盖每个有意义的状态、浅色和深色模式，以及不同的屏幕尺寸。截图测试渲染的是相同的 composable，因此一个好的预览就等于完成了一半的[截图测试](https://www.hasscn.top/contributors/companion/android/screenshot-testing/)。

应用运行后，Android Studio 中的 Compose live edit 和热重载可以在不重新构建的情况下显示许多更改。结构性更改仍然需要重新构建。

## 导航

应用使用 Navigation Compose，并正在迁移到单个 activity 和单个导航图，该导航图由各功能的子图构建而成。新屏幕放入导航图中；旧的 activity 会随时间逐步迁移。

使用类型安全的路由：

```kotlin
@Serializable
data class FeatureRoute(val value: Int)

fun NavGraphBuilder.featureNavGraph(navController: NavController) {
    composable<FeatureRoute> {
        FeatureScreen(
            value = it.toRoute<FeatureRoute>().value,
            onNavigateBack = { navController.popBackStack() },
        )
    }
}
```

导航需要测试，包括返回栈。
