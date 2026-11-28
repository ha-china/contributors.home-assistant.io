# Linter、hassfest 与 CI

> 每次 commit 和每个针对 Home Assistant Core 的 pull request 都会运行的检查，以及如何自己运行它们。

Source: https://www.hasscn.top/contributors/core/development/checks/

在你的代码被审查之前，机器会先检查它。Linter 检查代码风格，mypy 检查类型，hassfest 检查集成的元数据，而 CI 会把这一切再运行一遍，外加测试。请先自己运行它们：检查未通过的 pull request 不会被审查。

## Git 钩子

`script/setup` 会通过 [prek](https://prek.j178.dev/)（pre-commit 的快速替代品）安装 Git 钩子。每次 commit 时，它们都会对你修改的文件运行。当某个钩子修复了问题（比如格式化）时，commit 会中止：把修改后的文件加入暂存区，然后重新 commit。

这些钩子配置在 `.pre-commit-config.yaml` 中，包括：

- **Ruff**：对代码进行 lint 检查并格式化。
- **codespell**：捕捉常见的拼写错误。
- **yamllint** 和 **Prettier**：检查并格式化 YAML 和 JSON 文件。
- **mypy**：检查[类型注解](https://www.hasscn.top/contributors/core/development/typing/)。
- **pylint**：运行为 Home Assistant 编写的额外检查。
- **gen_requirements_all**：当 `manifest.json` 变化时更新依赖文件。
- **hassfest**：校验集成并更新生成的文件。
- **no-commit-to-branch**：阻止你直接向 `dev` 提交 commit。请在分支上工作。

要对所有文件运行所有钩子：

```shell
prek run --all-files
```

要只对你修改的文件运行，并查看它们修改了什么：

```shell
prek run --show-diff-on-failure
```

在 Visual Studio Code 中，这就是 **Prek** 任务。你也可以对单个文件运行某个 linter，比如 `ruff check homeassistant/components/example/sensor.py` 或 `pylint homeassistant/components/example`。

> [!IMPORTANT]
> 这些钩子可能会修改你集成之外的文件，比如 `CODEOWNERS`、`requirements_all.txt` 或 [`homeassistant/generated/`](https://github.com/home-assistant/core/tree/dev/homeassistant/generated) 中的文件。这些修改应包含在你的 pull request 中。

## Hassfest

Hassfest 是集成的校验器。它会读取你代码周围的文件，比如 `manifest.json`、`strings.json`、`services.yaml`、`icons.json` 和 `quality_scale.yaml`，并检查它们是否完整且一致。它还会根据这些文件生成其他文件，比如 `CODEOWNERS` 以及 [`homeassistant/generated/`](https://github.com/home-assistant/core/tree/dev/homeassistant/generated) 中关于配置流程（config flow）、发现信息等的列表。

在你修改了其中任何文件之后运行它：

```shell
python3 -m script.hassfest
```

只检查一个集成，这样更快：

```shell
python3 -m script.hassfest --integration-path homeassistant/components/example
```

使用 `-p` 可以只运行其中部分插件，比如在修改 `.strict-typing` 之后运行 `-p mypy_config`。

使用 `--skip-plugins` 可以跳过某些插件。新集成的 `quality_scale.yaml` 中每条规则初始都是 `todo`，在每条 Bronze 规则变为 `done` 或 `exempt` 之前，`quality_scale` 插件会将其报告为错误。Hassfest 只有在没有发现错误时才会写入生成的文件，所以在你还在处理这些规则时，可以这样运行：

```shell
python3 -m script.hassfest --skip-plugins quality_scale
```

脚手架脚本对新集成也会做同样的事情。在打开你的 pull request 之前，请再完整运行一次 hassfest，不要跳过任何插件。

## Pylint

除了标准检查之外，core 还有自己的 pylint 插件，位于 [`packages/pylint-home-assistant/`](https://github.com/home-assistant/core/tree/dev/packages/pylint-home-assistant)。它的检查覆盖了 Ruff 无法看到的模式，因为这些模式需要类型推断或读取其他文件，比如 `manifest.json` 和 `quality_scale.yaml`。其中许多检查对应的是审查者过去手动指出的规则。该插件的 [README](https://github.com/home-assistant/core/blob/dev/packages/pylint-home-assistant/README.md) 解释了每项检查。

如果 pylint 对你的代码判断有误（且仅在这种情况下），请使用检查的名称（而不是其代码）为那一行禁用该检查：

```python
hass.data[DOMAIN] = data  # pylint: disable=home-assistant-use-runtime-data
```

审查者会询问原因，所以请准备好解释。

## CI

当你打开 pull request 时，GitHub Actions 会运行 CI 工作流。它会运行钩子、hassfest、pylint 和 mypy，检查依赖项的要求和许可证，并在每个受支持的 Python 版本上运行测试。对于只涉及一个集成的修改，它只运行该集成的测试。涉及 core 本身的修改则会运行完整的测试套件。

如果你的 GitHub 账号是新的，在你第一个 pull request 上的 CI 不会启动，直到有维护者批准它。这是一项安全措施，并不是对你代码的评价。

如果 CI 因为你的修改而失败，请将 pull request 转为草稿，修复问题，然后再标记为就绪。有些测试是不稳定的（flaky）。如果你确信某次失败与你的修改无关，请在 pull request 中说明，并等待维护者处理。不要反复重启运行。
