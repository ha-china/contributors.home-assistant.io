# Android 依赖

> Android 应用中的版本目录、依赖锁定文件和 Renovate。

Source: https://www.hasscn.top/contributors/companion/android/dependencies/

Last verified on 2026-10-14, against https://github.com/home-assistant/android/blob/main/.github/workflows/renovate-lockfiles.yml.

Android 应用对其依赖进行严格管控。每个库都在一处声明，每个解析出的版本都被锁定，并且有一个机器人负责保持它们更新。

## 版本目录

所有依赖都声明在[版本目录](https://docs.gradle.org/current/userguide/version_catalogs.html) [`gradle/libs.versions.toml`](https://github.com/home-assistant/android/blob/main/gradle/libs.versions.toml) 中。这是添加依赖的唯一方式：在目录之外声明的依赖不会被接受。所有版本集中在一处，每个模块都使用相同版本的共享库，一次更新即可作用于整个项目。模块通过 `libs` 访问器引用它：

```kotlin
dependencies {
    implementation(libs.kotlinx.coroutines.android)
}
```

## 锁定文件

项目使用 Gradle [依赖锁定](https://docs.gradle.org/current/userguide/dependency_locking.html)。每个模块都有一个 `gradle.lockfile`，其中包含每个直接依赖和传递依赖的确切版本，因此在每台机器上构建结果都相同，传递依赖也不会在无人察觉的情况下悄悄变化。

在目录中添加或更改任何内容后，请更新锁定文件并提交：

```bash
./gradlew alldependencies --write-locks
```

当目录发生了变化但锁定文件没有更新时，CI 会失败。

## Renovate

[Renovate](https://docs.renovatebot.com/) 会打开拉取请求来更新依赖，其配置位于 `renovate.json5`。它会在版本发布三天后才提议更新，以便让其他用户先发现早期的问题。相关的库（例如 AndroidX 或 Kotlin 的库）会被归组到同一个拉取请求中。

Renovate 本身不会修改锁定文件。`Auto-update Renovate lockfiles` 工作流（[`.github/workflows/renovate-lockfiles.yml`](https://github.com/home-assistant/android/blob/main/.github/workflows/renovate-lockfiles.yml)）会在每个 Renovate 分支上运行，更新锁定文件，并将其推送到同一分支。

## 仅使用稳定版本

项目避免使用库的 alpha、beta 和候选发布版本。当某个功能仅在预发布版本中可用时，可以在拉取请求中协商例外情况。这会带来代价：API 可能随每次更新而变化，必须有人来处理这些问题。
