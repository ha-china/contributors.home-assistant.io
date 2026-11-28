# Apple 持续集成

> Apple 项目的 GitHub Actions 工作流。哪些会在你的拉取请求、合并之后以及按计划运行。

Source: https://www.hasscn.top/contributors/companion/apple/ci/

Last verified on 2026-10-14, against https://github.com/home-assistant/iOS/tree/main/.github/workflows.

Apple 项目使用 GitHub Actions 和 Fastlane 进行代码检查、测试、构建、翻译和分发。CI 检查的不仅仅是代码能否编译：代码风格、字符串和覆盖率也是审查的一部分。

## 在你的拉取请求上

`ci.yml` 工作流会在每个拉取请求和每次推送到 `main` 时运行。

**Lint** 在 Linux 上运行，因此速度很快：Yamllint、RuboCop、SwiftLint 和 SwiftFormat。参见[代码风格](https://www.hasscn.top/contributors/companion/apple/code-style/)。

**Test** 在 macOS 上使用当前 Xcode 运行。它会解析 Swift 包并运行 `bundle exec fastlane test`。它会上传：

- 代码覆盖率。
- 测试结果和日志。
- 应用的模拟器构建版本 `ios-simulator`，你可以用它来[测试前端更改](https://www.hasscn.top/contributors/companion/apple/get-started/#only-testing-the-frontend)，而无需构建应用。

**Patch coverage** 检查你更改的行中至少 90% 被测试覆盖。参见[补丁覆盖率](https://www.hasscn.top/contributors/companion/apple/testing/#patch-coverage)。

另外两项检查会查看你的差异（diff）。对于来自仓库本身分支的拉取请求，当它们发现问题时会留下评论：

- 你的差异中新增的 `swiftlint:disable`。
- 不再使用的本地化字符串，由 [`Tools/detect_unused_strings.py`](https://github.com/home-assistant/iOS/blob/main/Tools/detect_unused_strings.py) 检测。评论会列出这些键，供 **Lokalise: Delete Keys** 工作流使用，该工作流会从 Lokalise 中删除它们，并打开一个将它们从应用中移除的拉取请求。

## 其他工作流

| 工作流 | 运行时机 | 作用 |
| --- | --- | --- |
| `distribute.yml` | 每次推送到 `main` 时，或由维护者手动触发 | 构建并签名 iOS 和 Mac 应用，并上传到 App Store Connect。参见[发布](https://www.hasscn.top/contributors/companion/apple/releases/) |
| `tag_macos_release.yml`、`release_macos.yml` | 手动触发，或在 `release/*/*` 标签上 | 将 Mac 构建版本发布为 GitHub release |
| `e2e.yml` | 每天 05:00 UTC，或手动触发 | 针对真实的 Home Assistant 运行[端到端测试](https://www.hasscn.top/contributors/companion/apple/testing/#end-to-end-test) |
| `push_ci.yml` | 在 `Sources/PushServer` 发生更改时 | 为推送服务器运行 `swift test` |
| `push_deploy.yml` | 手动触发 | 构建推送服务器镜像并发布到 GitHub Container Registry |
| `download_localized_strings.yml` | 每天 06:00 UTC，或手动触发 | 将新字符串上传到 Lokalise，下载翻译，并打开一个拉取请求 |
| `delete_lokalise_keys.yml`、`auto_delete_unused_strings.yml` | 手动触发 | 从 Lokalise 和应用中删除未使用的字符串 |
| `update_frontend_colors.yml`、`update_brand_icons.yml`、`update_material_design_icons.yml` | 每周，或手动触发 | 重新生成前端颜色、品牌图标和 Material Design Icons，并在它们发生变化时打开拉取请求 |
| `set_version.yml` | 手动触发 | 更新 [`Configuration/Version.xcconfig`](https://github.com/home-assistant/iOS/blob/main/Configuration/Version.xcconfig) 中的版本并打开一个拉取请求 |

macOS 运行器上没有 Docker，因此端到端测试会使用 pip 在运行器上的虚拟环境中安装 Home Assistant。默认情况下，它会从 `dev` 分支安装 Core。手动运行时可以选择安装最新发布版本，或从 PyPI 安装特定版本。
