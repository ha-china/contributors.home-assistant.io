# 依赖与供应链

> Home Assistant 安装的每个库都在其中运行。Home Assistant 对依赖项有什么要求、会自动检查什么，以及它自身的工作流是如何受到保护的。

Source: https://www.hasscn.top/contributors/security/guides/dependencies/

集成（integration）通过库与设备和服务通信，而这些库来自 PyPI。每个[依赖要求](https://www.hasscn.top/contributors/glossary/requirement/)都是最终进入 Home Assistant 的代码，进入每一个安装了它的用户的家中。如果攻击者接管了一个库，或者在其依赖中塞入一个恶意包，他们就进来了。这就是供应链攻击，也是 Home Assistant 对依赖来源严格把关的原因。

## Home Assistant 对一个库的要求

质量分级中的[依赖透明度](https://www.hasscn.top/contributors/core/quality-scale/dependency-transparency/)规则设定了基线。每个带有外部依赖的集成都必须满足它，从 Bronze 级开始：

- 源代码在 OSI 认可的许可证下可用。
- 该包在 PyPI 上可用。
- PyPI 上的包由公开的 CI 流水线构建并发布。
- PyPI 上的每个版本都对应公开仓库中的一个带标签的发布。

这条规则的存在，是为了让项目能够信任它随每个版本一起发布的依赖。

## 自动检查的内容

你不必手动检查所有这些。有几个工具会审查每一个更改依赖要求的拉取请求（pull request）。

### hassfest

hassfest 会验证每个集成的清单（manifest）中的 `requirements`：

- 核心集成必须将每个依赖要求固定到确切的版本，例如 `"example-library==1.2.3"`。
- 它会遍历完整的依赖树，而不仅仅是直接依赖，并标记不应存在的包：作为运行时依赖的测试、构建或文档工具、`types-` 包，以及一些无人维护的包。
- 它会标记安装了顶层 `test`、`tests`、`doc` 或 `docs` 文件夹，或顶层 `.pth` 或 `.start` 文件的包。

### Check requirements

更改 Core 依赖要求文件的拉取请求会收到来自 **Check requirements** 工作流的一条评论，每个更改的包占一行：

| 检查项 | 检查内容 |
| --- | --- |
| No Advisories | PyPI 报告新版本没有已知漏洞。 |
| Not Yanked | 新版本没有从 PyPI 上被撤回（yanked）。 |
| Repo Public | 源仓库可公开访问。 |
| CI Upload | PyPI 上的发布带有证明（attestation），显示是哪个流水线发布的。 |
| Release Pipeline | 该库的发布工作流：由标签、发布或受保护的分支触发，最好使用 OIDC 而不是存储的令牌来发布，并且没有绕过它的上传途径。 |
| Security | 对库源代码的快速扫描，查找明显的供应链危险信号。 |
| PR Link | 新包链接到其源仓库。版本升级链接到提到两个版本的更新日志或比较。 |
| Async Safe | 库中 `async` 函数内的阻塞调用。 |

这些检查的一部分由 AI 代理完成，其余由脚本完成。请正确看待 **Security** 这一行：它只是一次廉价的初筛，而不是安全审查。通过显示为 ☑️，而不是 ✅，这样就不会有人把它当作认可的印章。

### 许可证

Core 的 CI 会提取每个已安装包的许可证，并使用 [`script/licenses.py`](https://github.com/home-assistant/core/blob/dev/script/licenses.py) 检查其是否获得 OSI 认可。

## 当你添加或更新依赖时

- 对于新库，在拉取请求中链接其源仓库；对于更新，链接更新日志或两个版本之间的比较。Check requirements 工作流会查找它，审查者也需要它。
- 只更改版本和重新生成的依赖要求文件，以及新版本所需的代码更改。运行 `python3 -m script.gen_requirements_all` 来重新生成这些文件。
- 如果新版本引入了它自己的新依赖，请在拉取请求中说明。
- 如果你是该库的维护者：从公开的 CI 流水线发布它，并在 PyPI 上使用可信发布（trusted publishing），以便发布可以追溯到其源代码。

审查者会遵循一份[依赖更新检查清单](https://www.hasscn.top/contributors/core/development/reviewing/#dependency-updates)。在提交之前值得先读一读。

## GitHub 工作流

项目自身的 CI 也是供应链的一部分。[core 仓库](https://github.com/home-assistant/core)中的工作流遵循几种你在审查中会看到的模式：

- **Action 固定到 commit SHA**，并在注释中注明版本，例如 `actions/checkout@<sha> # v7.0.1`。Renovate 会保持这些固定项是最新的。
- **权限从零开始。** 工作流在顶部设置 `permissions: {}`，每个作业列出它所需的权限，例如 `contents: read`。
- **检出（checkout）不保留凭据**：在 `actions/checkout` 上设置 `persist-credentials: false`。
- **zizmor**，一个 GitHub 工作流的 linter，在 core 仓库中以 pedantic 模式运行，作为 pre-commit 钩子并在 CI 中运行。[frontend 仓库](https://github.com/home-assistant/frontend)对其工作流运行 `actionlint`。

如果你修改了工作流，请遵循这些模式。

### 以前出过什么问题

2023 年，GitHub Security Lab 在 [actions 仓库](https://github.com/home-assistant/actions)中的一个共享 action `helpers/version` 里发现了一个[表达式注入](https://github.com/home-assistant/core/security/advisories/GHSA-jff5-5j3g-vhqc)漏洞。它将 `${{ github.head_ref }}`（拉取请求的分支名称）直接放入 `run:` 脚本中。GitHub 会在 shell 运行之前填充表达式，因此包含 shell 代码的分支名称会成为脚本的一部分。根据安全公告，攻击者可以利用这一点泄露机密并更改仓库。

永远不要将包含外部数据（如分支名称、标题或评论）的表达式放入 `run:` 脚本中。将其作为环境变量传入，让 shell 将其视为数据：

```yaml
- name: Show the branch
  env:
    HEAD_REF: ${{ github.head_ref }}
  run: echo "Branch: ${HEAD_REF}"
```

zizmor 会标记这种模板注入。

## 相关内容

- [带着安全意识进行审查](https://www.hasscn.top/contributors/security/guides/reviewing/)：在拉取请求中要注意什么。
- [自动检查](https://www.hasscn.top/contributors/security/reference/checks/)：所有检查汇总在一张表中。
- [依赖要求](https://www.hasscn.top/contributors/core/integrations/manifest/#requirements)：清单中的 `requirements` 键。
