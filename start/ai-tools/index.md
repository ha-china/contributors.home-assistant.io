# 使用 AI 工具参与贡献

> 在贡献时如何用好 AI 编程工具。AI 政策对你的要求、各仓库为智能体（agent）准备的指令和技能、常见任务的工作流程，以及每次都需要自己检查的内容。

Source: https://www.hasscn.top/contributors/start/ai-tools/

你可以在为 Home Assistant 做贡献时使用 AI 工具，而且多个仓库都带有专门为它们编写的指令和技能。本页是 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)的实操部分：如何从工具中获得高质量的成果，以及如何始终做一个理解并能为结果负责的人。

AI 工具可以为你省去大量的阅读和打字，但它不能替你省去理解。审阅者能分辨出区别，而且政策对看起来像未经审阅的 AI 输出的拉取请求（pull request）有明确规定：它们会被关闭。

## 政策在实践中的要求

[AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)很短。在日常工作中，它归结为以下几点：

- **你要理解每一处改动，并能用自己的话解释它。** 如果你解释不了某一行，就在打开拉取请求之前弄清楚它的作用，或者删掉它。
- **你要始终掌控流程。** 不允许使用自主运行的智能体。智能体可以在你的机器上写代码，但由你决定提交什么。不要让工具在未经你审阅的情况下打开 issue 或拉取请求，或发表评论。
- **你要亲自回答审阅者。** 用 AI 修正语法没问题，但回答的实质内容必须是你自己的。
- **在模板要求的地方如实披露。** [Home Assistant Core](https://github.com/home-assistant/core/blob/dev/.github/PULL_REQUEST_TEMPLATE.md) 和[前端](https://github.com/home-assistant/frontend/blob/dev/.github/PULL_REQUEST_TEMPLATE.md)的拉取请求模板中有两个复选框："I understand the code I am submitting and can explain how it works"（我理解我提交的代码并能解释其工作原理），以及 "Any generated code has been carefully reviewed for correctness and compliance with project standards"（所有生成的代码都经过仔细审阅，确保正确并符合项目标准）。[Android](https://github.com/home-assistant/android/blob/main/.github/pull_request_template.md) 和 [iOS](https://github.com/home-assistant/iOS/blob/main/.github/pull_request_template.md) 模板要求你确认已阅读政策，并从三个选项中恰好选择一个：未使用 AI、AI 辅助，或完全由 AI 生成且经你审阅并理解的代码。保留模板中的这些部分，并且只在属实的情况下勾选。
- **你把 AI 的审阅评论当作普通审阅评论对待。** 一些项目使用 AI 工具进行审阅和分类。它们可能是错的。如果你认为某条评论有误，请简短地说明。

智能体指令对工具说的也是同样的话。在 core、前端、两个应用、[home-assistant.io](https://github.com/home-assistant/home-assistant.io) 和 Supervisor 中，这些指令都以一个 "AI policy"（AI 政策）章节结尾，告诉智能体不要自主打开 issue 或拉取请求，也不要在未经你审阅的情况下替你发表评论。

## 各仓库如何为你的智能体做准备

你不必从零开始向 AI 工具解释 Home Assistant。大多数仓库为智能体准备了两种文件：

- **指令（Instructions）**：一个 Markdown 文件，包含仓库的基本信息，比如如何搭建环境、运行测试、格式化代码，以及智能体经常搞错的规则。大多数工具在每次会话开始时都会读取它。
- **技能（Skills）**：每个文件夹中包含一个 `SKILL.md` 文件。其 front matter 中有 `name` 和 `description`。当你的任务与其描述匹配，或者你按名称请求时，工具会加载该技能。在 Claude Code 中，技能还会变成一个命令：`ha-review` 技能可以通过 `/ha-review` 运行。

两者都是纯 Markdown 文件，值得你自己读一读。例如，core 的集成技能用几十行就概括了审阅指南。

### 哪个工具读取哪个文件

每个工具会在自己的位置查找。以下是各工具官方文档的说明：

| 文件或文件夹 | 读取者 |
| --- | --- |
| `AGENTS.md` | [Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)，以及在没有 `CLAUDE.md` 时的 [Claude Code](https://code.claude.com/docs/en/memory) |
| `CLAUDE.md` | Claude Code。GitHub Copilot 也接受根目录下的 `CLAUDE.md` 或 `GEMINI.md` |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.github/instructions/*.instructions.md` | GitHub Copilot，针对匹配每个文件的 `applyTo` 模式的文件 |
| `.claude/skills/` | [Claude Code](https://code.claude.com/docs/en/skills) 和 [GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| `.agents/skills/` | [Codex](https://learn.chatgpt.com/docs/build-skills) 和 GitHub Copilot |
| `.github/skills/` | GitHub Copilot |

为了用一个来源服务所有工具，这些仓库使用符号链接。例如在前端中，`CLAUDE.md` 和 `.github/copilot-instructions.md` 链接到 `AGENTS.md`，`.claude/skills` 链接到 `.agents/skills`。这样，大多数工具都能得到相同的指令。不过，并非每个工具都能找到每个技能文件夹。例如 Codex 读取 `.agents/skills/` 而不读取 `.claude/skills/`，所以在 core 和 home-assistant.io 中，你需要自己把它指向某个技能。

- **[Core](https://github.com/home-assistant/core)**：`AGENTS.md`，`CLAUDE.md` 链接到它。`.github/copilot-instructions.md` 由 `script/gen_copilot_instructions.py` 从它生成，并带有针对 Copilot 代码审阅的额外规则。技能位于 `.claude/skills/`，`.claude/agents/` 中有一个 `raise-pull-request` 子智能体。
- **[Frontend](https://github.com/home-assistant/frontend)**：`AGENTS.md`，`CLAUDE.md` 和 `.github/copilot-instructions.md` 链接到它。技能位于 `.agents/skills/`。
- **[Android](https://github.com/home-assistant/android)**：`AGENTS.md`，`CLAUDE.md`、`GEMINI.md`、`.github/copilot-instructions.md` 和 `.junie/guidelines.md` 链接到它。技能位于 `.agents/skills/`，`.github/skills/` 中有一个。
- **[iOS](https://github.com/home-assistant/iOS)**：`AGENTS.md`，`CLAUDE.md` 和 `.github/copilot-instructions.md` 链接到它。技能位于 `.agents/skills/`。
- **[home-assistant.io](https://github.com/home-assistant/home-assistant.io)**：`.github/copilot-instructions.md`，`AGENTS.md`、`CLAUDE.md` 和 `GEMINI.md` 链接到它。技能位于 `.claude/skills/`。
- **[Supervisor](https://github.com/home-assistant/supervisor)**：`.github/copilot-instructions.md`，`AGENTS.md` 和 `CLAUDE.md` 链接到它。没有技能。
- **[本站](https://github.com/home-assistant/contributors.home-assistant.io)**：`.github/copilot-instructions.md`，`AGENTS.md` 和 `CLAUDE.md` 链接到它，审阅清单位于 `.github/instructions/`。技能位于 `.github/skills/`，`.claude/skills` 链接到它。

[operating-system](https://github.com/home-assistant/operating-system) 仓库有 AI 政策，但没有智能体指令或技能。

## 各仓库的技能

每个技能一行。选择名称即可阅读技能本身。

### Home Assistant Core

| 技能 | 用途 |
| --- | --- |
| [`ha-integration-knowledge`](https://github.com/home-assistant/core/blob/dev/.claude/skills/ha-integration-knowledge/SKILL.md) | 构建、测试和审阅集成。该技能要求在查看任何集成时都把它作为主要参考 |
| [`ha-quality-scale-verify`](https://github.com/home-assistant/core/blob/dev/.claude/skills/ha-quality-scale-verify/SKILL.md) | 检查集成是否遵循某条质量等级规则，或达到某个等级 |
| [`ha-review`](https://github.com/home-assistant/core/blob/dev/.claude/skills/ha-review/SKILL.md) | 对照目标分支审阅代码改动，每条发现都会被二次核对 |
| [`ha-pr-reviewer`](https://github.com/home-assistant/core/blob/dev/.claude/skills/ha-pr-reviewer/SKILL.md) | 在 GitHub 上审阅拉取请求。它只在你的终端中报告，不会在 GitHub 上执行操作 |
| [`ha-pr-comment-audit`](https://github.com/home-assistant/core/blob/dev/.claude/skills/ha-pr-comment-audit/SKILL.md) | 查找拉取请求上尚未处理的审阅评论 |
| [`ha-merge-queue`](https://github.com/home-assistant/core/blob/dev/.claude/skills/ha-merge-queue/SKILL.md) | 查找已准备好合并的开放拉取请求。主要供维护者使用 |
| [`bump-dependency`](https://github.com/home-assistant/core/blob/dev/.claude/skills/bump-dependency/SKILL.md) | 升级 Python 依赖、重新生成依赖文件，并准备拉取请求 |

### Frontend

| 技能 | 用途 |
| --- | --- |
| [`ha-frontend-components`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-components/SKILL.md) | 对话框、表单、警告、键盘快捷键、工具提示、面板、卡片和按钮 |
| [`ha-frontend-contexts`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-contexts/SKILL.md) | Lit contexts，以及让组件摆脱宽泛的 `hass` 对象 |
| [`ha-frontend-demo`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-demo/SKILL.md) | 独立演示、其配置及其模拟的 API |
| [`ha-frontend-events`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-events/SKILL.md) | 事件的类型定义、派发和声明 |
| [`ha-frontend-gallery`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-gallery/SKILL.md) | 画廊的页面、演示和内容 |
| [`ha-frontend-lit`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-lit/SKILL.md) | Lit 约定：响应式属性、状态、生命周期和 DOM 查询 |
| [`ha-frontend-review`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-review/SKILL.md) | 审阅前端改动、准备拉取请求，以及填写模板 |
| [`ha-frontend-styling`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-styling/SKILL.md) | CSS、主题、间距、响应式布局、RTL 和视图过渡 |
| [`ha-frontend-testing`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-testing/SKILL.md) | Lint、类型检查、Vitest、Playwright 和开发服务器 |
| [`ha-frontend-types`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-types/SKILL.md) | TypeScript 约定以及与后端的数据契约 |
| [`ha-frontend-user-facing-text`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-user-facing-text/SKILL.md) | 标签、错误、术语，以及需要翻译的字符串 |
| [`ha-frontend-ux-readiness`](https://github.com/home-assistant/frontend/blob/dev/.agents/skills/ha-frontend-ux-readiness/SKILL.md) | 判断新的卡片、徽章、界面或交互模式是否需要设计团队的意见 |

### Android 应用

| 技能 | 用途 |
| --- | --- |
| [`ha-android-architecture`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-architecture/SKILL.md) | 模块、分层、Hilt、安全存储，以及调用 Home Assistant API |
| [`ha-android-committing`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-committing/SKILL.md) | 完成一项改动：格式化、测试、更新日志、分支名称和拉取请求 |
| [`ha-android-concurrency`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-concurrency/SKILL.md) | 协程、调度器、Flow 和线程安全 |
| [`ha-android-e2e-debugging`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-e2e-debugging/SKILL.md) | 查明端到端测试失败的原因 |
| [`ha-android-kotlin-style`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-kotlin-style/SKILL.md) | Kotlin 风格：常量、类型、时间、命名和注释 |
| [`ha-android-logging-errors`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-logging-errors/SKILL.md) | 日志、错误处理，以及避免用户数据进入日志 |
| [`ha-android-review`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-review/SKILL.md) | 从正确性、风格和安全性方面审阅改动 |
| [`ha-android-skill-maintenance`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-skill-maintenance/SKILL.md) | 保持 `AGENTS.md` 和各技能的更新 |
| [`ha-android-testing`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-testing/SKILL.md) | 单元测试、Robolectric、Flow 和截图测试 |
| [`ha-android-ui`](https://github.com/home-assistant/android/blob/main/.agents/skills/ha-android-ui/SKILL.md) | Compose 界面、ViewModel、导航、小组件和设计系统 |
| [`agentic-workflows`](https://github.com/home-assistant/android/blob/main/.github/skills/agentic-workflows/SKILL.md) | 在仓库中设计和调试 GitHub Agentic Workflows |

Android 仓库还在 `.claude/settings.json` 中有一个 Claude Code 钩子，在智能体编辑测试时提醒它加载 `ha-android-testing`。

### iOS 应用

| 技能 | 用途 |
| --- | --- |
| [`ha-ios-architecture`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-architecture/SKILL.md) | 项目结构、target、`Current` 依赖模式，以及代码签名 |
| [`ha-ios-code-style`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-code-style/SKILL.md) | Swift 风格、SwiftFormat、SwiftLint、图标和日志 |
| [`ha-ios-concurrency`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-concurrency/SKILL.md) | async/await、actor、Combine，以及使用 HAKit 与服务器通信 |
| [`ha-ios-localization`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-localization/SKILL.md) | 添加或修改面向用户的字符串 |
| [`ha-ios-magicitem`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-magicitem/SKILL.md) | 由小组件、Apple Watch、CarPlay 和 App Shortcuts 共享的条目模型 |
| [`ha-ios-persistence`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-persistence/SKILL.md) | 使用 GRDB、Realm 或 UserDefaults 存储数据 |
| [`ha-ios-push-live-activities`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-push-live-activities/SKILL.md) | 推送通知和实时活动（Live Activities） |
| [`ha-ios-skill-maintenance`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-skill-maintenance/SKILL.md) | 保持各技能和 `AGENTS.md` 的更新 |
| [`ha-ios-testing`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-testing/SKILL.md) | 单元测试、快照测试和模拟依赖 |
| [`ha-ios-ui`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-ui/SKILL.md) | SwiftUI 和 UIKit 约定，以及设计系统包 |
| [`ha-ios-webview`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-webview/SKILL.md) | 显示前端的网页视图、其消息总线，以及深链接 |
| [`ha-ios-workflow-ci`](https://github.com/home-assistant/iOS/blob/main/.agents/skills/ha-ios-workflow-ci/SKILL.md) | 提交前步骤的顺序、TestFlight 门槛，以及 CI 检查 |

### home-assistant.io 上的文档

| 技能 | 用途 |
| --- | --- |
| [`home-assistant-docs-writing-style`](https://github.com/home-assistant/home-assistant.io/blob/current/.claude/skills/home-assistant-docs-writing-style/SKILL.md) | 任何文档、页面或面向用户的文字 |
| [`home-assistant-markdown-liquid-style`](https://github.com/home-assistant/home-assistant.io/blob/current/.claude/skills/home-assistant-markdown-liquid-style/SKILL.md) | Markdown、Liquid、链接、图片、术语表条目、My links 和文本框 |
| [`home-assistant-yaml-style`](https://github.com/home-assistant/home-assistant.io/blob/current/.claude/skills/home-assistant-yaml-style/SKILL.md) | YAML 示例、自动化、脚本和模板 |
| [`document-integration-docs`](https://github.com/home-assistant/home-assistant.io/blob/current/.claude/skills/document-integration-docs/SKILL.md) | 以分页格式编写或更新集成的文档 |
| [`create-blog-post`](https://github.com/home-assistant/home-assistant.io/blob/current/.claude/skills/create-blog-post/SKILL.md) | 把 Google Docs 草稿变成博客文章 |
| [`create-astro-component`](https://github.com/home-assistant/home-assistant.io/blob/current/.claude/skills/create-astro-component/SKILL.md) | 把网站的一部分重建为 Astro 组件 |
| [`update-agent-instructions`](https://github.com/home-assistant/home-assistant.io/blob/current/.claude/skills/update-agent-instructions/SKILL.md) | 更新仓库的智能体指令 |

### 本贡献者网站

| 技能 | 用途 |
| --- | --- |
| [`write-page`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/write-page/SKILL.md) | 添加或修改页面，从选择区域到运行检查 |
| [`review`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/review/SKILL.md) | 审阅拉取请求、页面或网站代码，每条论断都会对照源码核对 |
| [`fact-check`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/fact-check/SKILL.md) | 对照源仓库核查现有页面，并修复不成立的内容 |
| [`add-glossary-term`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/add-glossary-term/SKILL.md) | 添加或修改术语表条目 |
| [`design-component-page`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/design-component-page/SKILL.md) | 设计（Design）区域中带实时演示的组件页面 |
| [`update-demos`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/update-demos/SKILL.md) | 从较新的前端重建实时组件演示 |
| [`port-developers-change`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/port-developers-change/SKILL.md) | 把旧开发者文档中的改动迁移到本站 |
| [`create-blog-post`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/create-blog-post/SKILL.md) | 把草稿变成本站上的博客文章 |
| [`update-agent-instructions`](https://github.com/home-assistant/contributors.home-assistant.io/blob/main/.github/skills/update-agent-instructions/SKILL.md) | 更新智能体指令，并同步与 home-assistant.io 共享的写作规则 |

## 常见任务的工作流程

这些工作流程把上述技能与本站上的指南结合起来。它们适用于任何会读取技能文件夹的工具。如果你的工具不读取，就自己把它指向相应的 `SKILL.md` 文件。

### 修复集成中的 bug

1. 先自己复现这个 bug，并在 GitHub 上找到对应的 issue。如果你从未见过它失败，智能体无法告诉你它的修复是否修好了*你的* bug。
2. 让智能体在加载 `ha-integration-knowledge` 技能的情况下查找原因。要求它在修改代码之前先写一个因该 bug 而失败的测试。没有修复也能通过的测试证明不了任何东西。
3. 让它修复代码，然后像[运行测试](https://www.hasscn.top/contributors/core/development/testing/)中那样，自己运行该集成的测试：`pytest tests/components/<domain>`。如果修复改动了 `strings.json`，core 的 `AGENTS.md` 会告诉智能体先重新生成英文翻译，因为测试会读取这些内容。
4. 阅读 diff。智能体喜欢添加超出修复本身的内容：额外的"防御性"检查、复述代码的注释，以及顺手做的重构。Core 的指令告诉智能体避免复述代码的注释和验证已覆盖的检查，但你还是要自己检查，并删掉修复不需要的东西。
5. 自己打开拉取请求，并填写好[模板](https://www.hasscn.top/contributors/core/development/submitting/)。Core 有一个 `raise-pull-request` 子智能体，可以运行检查并替你填写模板。要知道它会推送你的分支并以草稿形式打开拉取请求。它会把 "I understand the code..." 和 "Any generated code has been carefully reviewed..." 留作未勾选，等你确认属实后再勾选。

### 构建新集成并达到 Bronze 等级

新集成必须达到[质量等级](https://www.hasscn.top/contributors/core/quality-scale/)的 Bronze 等级，而且它的第一个拉取请求应保持较小。先阅读[创建集成](https://www.hasscn.top/contributors/core/integrations/create/)：它解释了新集成何时应进入 core，并设定了审阅者会要求的限制。

1. **从库开始。** `ha-integration-knowledge` 技能指出集成应当是薄封装，协议和设备逻辑应放在 PyPI 上的独立库中。智能体会很乐意在你的集成里写一个 HTTP 客户端。不要让它这么做。参见[构建 Python 库](https://www.hasscn.top/contributors/core/integrations/api-library/)。
2. **自己生成骨架**，使用 `python3 -m script.scaffold integration`。脚手架会在你的代码应放置的位置留下 `TODO` 注释，以及一个所有规则都设为 `todo` 的 `quality_scale.yaml`。
3. **与智能体一起逐个平台填写**，并加载 `ha-integration-knowledge`。在继续之前，让它向你解释配置流程（config flow）和协调器（coordinator）。之后你需要向审阅者解释它们。
4. **在 `quality_scale.yaml` 中如实标记 Bronze 规则**：`done`，或带原因的 `exempt`。[规则](https://www.hasscn.top/contributors/core/quality-scale/rules/)对每条都有解释。
5. **用 `ha-quality-scale-verify` 验证。** 该技能一次检查一条规则，以及某个等级的所有 Bronze 规则。在工具存在时它会运行工具（如 hassfest），而不是从代码中猜测，并且在无法检查时把规则标记为未验证。一些 Bronze 规则在 core 仓库之外：`brands` 资源，以及需要你在 home-assistant.io 上提交文档拉取请求的 `docs-*` 规则。阅读报告，并修复或豁免它发现的问题。
6. **自己运行检查**：你的集成的测试以及 `prek run --all-files`。参见 [Linters、hassfest 和 CI](https://www.hasscn.top/contributors/core/development/checks/)。
7. **阅读每一行**，然后按上述方式打开拉取请求。审阅者会问某段代码为什么在那里。"AI 写的"不是政策接受的答案。

### 审阅拉取请求

审阅对整个项目都有帮助，core 模板也邀请你审阅另外两个拉取请求。AI 工具可以帮你在不熟悉的改动中找到方向，但你发布的审阅仍然必须是你自己的。

- **Core**：`ha-pr-reviewer` 使用 GitHub CLI 读取拉取请求，用 `ha-review` 进行审阅，并用 `ha-pr-comment-audit` 检查开放的评论线程。它只在你的终端中报告。
- **Frontend**：`ha-frontend-review`，以及与改动匹配的配套技能。它会先读取已有评论，并让人类反馈优先于智能体的反馈。
- **Android**：`ha-android-review`。

然后在写下来之前，把每条发现对照代码核实。删掉你无法确认或不理解的条目。用你自己的话发布审阅。不要粘贴工具的输出，也不要让工具替你发布。[审阅拉取请求](https://www.hasscn.top/contributors/core/development/reviewing/)说明了一次好的 core 审阅关注什么。

### 在前端添加卡片

对于新卡片，项目首先推荐通过 Marketplace 分享，参见[分享它](https://www.hasscn.top/contributors/frontend/custom-ui/#share-it)。以下步骤针对前端本身的卡片。

1. 加载 `ha-frontend-components` 和 `ha-frontend-styling`。组件技能列出了卡片必须做到的事：验证其配置，处理加载、错误、不可用和实体缺失的情况，并在需要时提供编辑器。
2. 在写大量代码之前先阅读 `ha-frontend-ux-readiness`。新卡片既是代码，也是设计决策。当方向尚未确定时，审阅者会请设计团队提供意见。参见[审阅与发布](https://www.hasscn.top/contributors/frontend/development/review-and-release/)和[我们的设计方式](https://www.hasscn.top/contributors/design/how-we-design/)。
3. 把每个可见字符串都通过翻译系统处理，如 `ha-frontend-user-facing-text` 所解释的。
4. 运行 `pnpm lint` 和 `pnpm test`，并亲自在浅色和深色模式以及手机上试用卡片。在拉取请求中附上截图或短视频：前端模板要求提供它们。

你自己仓库中的自定义卡片没有可加载的技能。[自定义卡片指南](https://www.hasscn.top/contributors/frontend/custom-ui/card/)是那里的参考。

### 在 home-assistant.io 上编写文档

home-assistant.io 的指令告诉智能体在编辑之前加载匹配的技能，并加载所有适用的技能：

- `home-assistant-docs-writing-style` 用于任何文字内容。
- `home-assistant-markdown-liquid-style` 用于链接、图片、Liquid 和其他站点语法。
- `home-assistant-yaml-style` 用于 YAML 示例。
- `document-integration-docs` 用于集成页面。它接受域名参数，比如 Claude Code 中的 `/document-integration-docs <domain>`，并且当你把 core 和前端克隆在文档旁边时，它会读取 core 中该集成的触发、条件和动作。

这些指令中有两条规则对 AI 工作最为重要。除非你要求，智能体不得编造新的仪表盘、卡片、自动化或脚本示例。而且 `document-integration-docs` 不得信任 issue 文本或现有文档，除非 core 予以确认。用同样的标准要求你自己的审阅：把每个选项、默认值和步骤对照代码核实，并在 Deploy Preview 中查看你的页面。[编写文档](https://www.hasscn.top/contributors/writing/)包含其余内容。

### 翻译不是 AI 任务

界面的翻译在 [Lokalise](https://www.hasscn.top/contributors/glossary/lokalise/) 中由人来完成。[翻译规则](https://www.hasscn.top/contributors/translate/reference/rules/)要求你只翻译成你的母语，因为机器翻译一眼就能看出来。两个应用的智能体指令从另一面表示赞同：智能体只添加或修改英文字符串。Android 技能指出翻译文件来自 Lokalise，绝不能添加或编辑；iOS 技能指出只能修改英文 `.strings` 文件。

有一个已记录的例外。对于[语音意图](https://www.hasscn.top/contributors/translate/voice/style-guide/#drafts-from-an-ai-model)，[intents 仓库](https://github.com/OHF-Voice/intents)可以生成一个提示词，你把它粘贴到 AI 模型中来起草某个意图的句子。那只是草稿，需要由母语者重写。

## 每次都要自己检查的内容

工具的输出只是草稿。以下是能抓住那些在本站审阅中反复出现的错误的检查项。

- **对照代码核实，且要在正确的分支上。** 事实依据是仓库的默认分支，比如 core 和前端的 `dev`。不是你的记忆，不是工具的记忆，也不是几周前的本地克隆。函数名、参数和命令都会变。
- **关于人、流程和数字的论断需要来源。** 谁来决定、谁审阅、需要多长时间、有多少个。代码无法证明这些，而工具会用听起来合理的内容填补空白。找到官方页面，否则就删掉。
- **留意绝对化的词语。** "总是"、"从不"、"每一个"、"只有"。寻找例外：第二条代码路径、回退机制、功能开关。工具在总结时常常会丢失条件。
- **跨生命周期边界测试。** 在正常路径上工作的代码，会在第一次更新时、卸载和重新加载时、迁移之后、设备消失又回来时，或者列表为空时出问题。问问自己每种情况下会发生什么。
- **从全新开始，按顺序运行每个步骤。** 工具编写的说明常常漏掉一个 `cd`、一次安装，或后续步骤需要的某个设置。
- **不要让摘要代替来源。** 抓取页面或文件的工具给你的是它的摘要，而摘要会弄乱名称和数字。在依赖某个细节之前，自己阅读来源。
- **提交之前阅读 diff。** 查找你没有要求的改动、承诺超出代码实际功能的注释，以及你无法解释的代码。

## 为你的智能体提供关于本站的上下文

本站发布了 [`/llms.txt`](https://www.hasscn.top/contributors/llms.txt)，一个按 [llms.txt 格式](https://llmstxt.org/)编写的、面向 AI 工具的区域和页面索引。在任务开始时把它交给你的智能体，这样它就能找到适用的指南，而不是靠猜测，或在别处阅读过时的页面。同样的规则也适用于它在其中找到的内容：那只是起点，代码才是依据。

## 找谁咨询

- 不确定你对 AI 的使用是否符合政策？在你的拉取请求中，或在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上询问维护者。
- 某个技能给出了错误的建议？在携带它的仓库中打开 issue 或拉取请求。技能和其他文件一样被维护。
