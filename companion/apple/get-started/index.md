# Apple 入门

> 安装 Xcode 和 Ruby 工具链，设置代码签名，并在模拟器或你自己的设备上运行 Home Assistant 应用。

Source: https://www.hasscn.top/contributors/companion/apple/get-started/

你需要一台 Mac。本页面将带你从全新克隆到应用在模拟器中运行。

## 要求

- **Xcode**：项目当前要求的版本见 [README](https://github.com/home-assistant/iOS#getting-started)。该项目会很快跟进新的 Xcode 版本，因此有时需要使用来自 [Apple Developer Downloads](https://developer.apple.com/download/) 的 beta 版本。
- **Ruby**：用于运行代码检查器和测试的 Bundler 和 Fastlane。版本见 `.ruby-version`。
- **Apple 开发者团队 ID**，用于代码签名。

第三方库是 Swift 包。Xcode 会自行解析它们。

## 1. Fork、克隆和创建分支

1. 在 GitHub 上 fork [home-assistant/iOS](https://github.com/home-assistant/iOS)。
2. 克隆你的 fork 并创建一个分支：

   ```bash
   git clone https://github.com/<your-github-username>/iOS.git
   cd iOS
   git checkout -b fix-widget-refresh
   ```

## 2. 安装 Ruby 工具链

选择一种安装 Ruby 的方式，然后安装 gems。使用 [mise](https://mise.jdx.dev/)：

```bash
brew install mise
mise install
bundle install
```

使用 [rbenv](https://github.com/rbenv/rbenv)：

```bash
brew install rbenv ruby-build
rbenv install
bundle install
```

Ruby 版本在 `.ruby-version` 中。如果你已经有匹配的 Ruby，只需运行 `bundle install` 即可。

## 3. 设置代码签名

应用使用了需要代码签名的 entitlements，即使在模拟器中也是如此。Debug 构建使用自动配置，但你需要告诉 Xcode 使用哪个团队和 bundle ID。

创建 `Configuration/HomeAssistant.overrides.xcconfig`：

```text
DEVELOPMENT_TEAM = YourTeamID
BUNDLE_ID_PREFIX = some.bundle.prefix
```

- `DEVELOPMENT_TEAM` 是你的团队 ID，来自 [Apple 开发者门户](https://developer.apple.com/account)。它形如 `ABCDEFG123`。
- `BUNDLE_ID_PREFIX` 是一个由你控制的前缀，以便 Xcode 能为它创建配置描述文件。

Git 会忽略此文件。Xcode 会为你的团队生成描述文件，而你的团队没有的功能（如重要提醒）将被关闭。

## 4. 运行应用

1. 在 Xcode 中打开 `HomeAssistant.xcodeproj`。
2. 选择 **App-Debug** scheme。
3. 选择一个模拟器或你的设备。
4. 构建并运行。

如果可以，请将它连接到 Home Assistant 的测试实例：每次引导流程都会在服务器上注册一个新设备。

## 常用命令

```bash
# Check formatting and lint, without changing files
bundle exec fastlane lint

# Fix what can be fixed automatically
bundle exec fastlane autocorrect

# Run the unit tests
bundle exec fastlane test

# Run autocorrect before every commit
bundle exec fastlane install_git_hooks
```

## 仅测试前端

正在开发[前端](https://www.hasscn.top/contributors/frontend/)并想在应用中查看效果？你不需要构建应用：

1. 安装 Xcode，并从 **Xcode** > **Open Developer Tool** > **Simulator** 打开模拟器。
2. 从 `main` 分支上最近一次 [CI workflow](https://github.com/home-assistant/iOS/actions/workflows/ci.yml) 运行中下载 `ios-simulator` 构建产物。
3. 将 `.app` 拖到模拟器上并启动。
4. 在 Safari 中，在高级设置里开启 **Develop** 菜单。然后使用 **Develop** > **Simulator** 在应用的 web 视图上打开 Web Inspector。

## AI 工具

仓库在 `AGENTS.md` 中提供了 AI 编程工具的使用说明，并在 [`.agents/skills/`](https://github.com/home-assistant/iOS/tree/main/.agents/skills) 中提供了技能，例如 `ha-ios-architecture`、`ha-ios-testing` 和 `ha-ios-workflow-ci`。拉取请求模板会询问你是否使用了 AI 以及如何使用。[使用 AI 工具参与贡献](https://www.hasscn.top/contributors/start/ai-tools/)列出了所有技能，并解释了 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)对你的要求。

## 接下来

- 阅读[架构](https://www.hasscn.top/contributors/companion/apple/architecture/)和[目标](https://www.hasscn.top/contributors/companion/apple/targets/)。
- 在提交第一个拉取请求之前，请查看[代码风格](https://www.hasscn.top/contributors/companion/apple/code-style/)。
