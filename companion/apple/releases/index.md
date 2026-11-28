# Apple 版本发布

> 对 Apple 应用的更改如何从合并的 pull request 一路到达 App Store Connect、版本号如何设置，以及 Mac 构建如何成为 GitHub release。

Source: https://www.hasscn.top/contributors/companion/apple/releases/

每个合并的 pull request 都会被构建、签名，并上传到 App Store Connect。构建从那里到达 TestFlight 测试人员和 App Store。本页介绍这条路径中位于仓库内的部分，以及如何自行构建一个 release。

## 从合并到 App Store Connect

### 每次推送到 main

当 pull request 被合并到 `main` 时，`distribute.yml` 工作流会使用 Fastlane 构建两个应用：

- **iOS**：`bundle exec fastlane ios build` 为 App Store 归档应用，并将其上传到 App Store Connect。
- **Mac**：`bundle exec fastlane mac build` 从同一个归档构建 Mac 应用两次。一次构建 Developer ID 版本（由 Apple 进行公证），另一次构建 Mac App Store 软件包（上传到 App Store Connect）。

每次运行还会将其构建保存为 artifacts：iOS 的 `.ipa`、Developer ID Mac 应用（`mac-developer-id.zip`）、Mac App Store 软件包，以及调试符号。

构建号是 [`Configuration/Version.xcconfig`](https://github.com/home-assistant/iOS/blob/main/Configuration/Version.xcconfig) 中的 `CURRENT_PROJECT_VERSION`，后跟工作流运行的编号。该运行编号将 App Store Connect 中的构建与其来源的 commit 关联起来。

### TestFlight

任何人都可以[加入 TestFlight beta](https://www.home-assistant.io/ios/beta/)。Beta 用户能发现测试无法发现的问题。

尚未准备好面向所有人的功能可以仅在 TestFlight 上发布，由 `Current.isTestFlight` 控制。将此类功能移出 beta 的方式，就是合并其移除该开关的草稿 pull request。参见[每次更改的规则](https://www.hasscn.top/contributors/companion/apple/architecture/#rules-for-every-change)。

将构建推送给 TestFlight 测试人员以及发布到 App Store 的操作在 App Store Connect 中进行，而不是在仓库中。

### 设置版本号

用户看到的版本号是 [`Configuration/Version.xcconfig`](https://github.com/home-assistant/iOS/blob/main/Configuration/Version.xcconfig) 中的 `MARKETING_VERSION`。维护者通过 **Version: Set Version** 工作流（`set_version.yml`）来修改它，该工作流会运行 `bundle exec fastlane set_version`，并打开一个包含新版本的 pull request。

### GitHub 上的 Mac 版本发布

Developer ID Mac 应用也会发布在 [GitHub releases 页面](https://github.com/home-assistant/iOS/releases)上。

1. 维护者使用 release 标签（例如 `release/2026.5.0/2026.1987`）和 `main` 上的一个 commit 运行 **Tag macOS Release** 工作流。标签中的最后一个数字是构建该 commit 的 Distribute 运行的编号。
2. 该工作流会等待那个 Distribute 运行成功，为该 commit 打上标签，然后启动 **Release macOS** 工作流。
3. **Release macOS** 会创建一个带有自动生成 release notes 的 GitHub pre-release，并附上来自 Distribute 运行的 Developer ID 应用。

对已有的 release 再次运行会更新该 release，并按维护者之前设置的方式保留其 pre-release 状态。

### 商店信息

App Store 的描述、关键词和 release notes 位于 `fastlane/metadata` 中，每种语言一个文件夹。它们与应用的字符串一样，在 [Lokalise](https://www.hasscn.top/contributors/translate/) 上进行翻译。`update_lokalise_metadata` lane 将商店文本上传到 Lokalise，`update_asc_metadata` 将翻译上传到 App Store Connect。

## 自行构建 release

只有当你拥有该项目 Apple 开发者团队的访问权限时才需要这样做。两个 lane 都会使用团队的证书进行签名，并上传到 App Store Connect。

Fastlane 从环境变量或 `.env` 文件读取其配置，例如 Apple ID 和团队 ID。相关值请参见 [`.env.sample`](https://github.com/home-assistant/iOS/blob/main/.env.sample)。然后运行：

```bash
# Build and upload the Mac app
bundle exec fastlane mac build

# Build and upload the iOS app
bundle exec fastlane ios build
```

两者都会将其构建保存到 `build/` 中。

对于你自己的设备，你不需要以上任何步骤：使用你自己的团队运行 `App-Debug` scheme，如[入门指南](https://www.hasscn.top/contributors/companion/apple/get-started/#3-set-up-code-signing)中所述。
