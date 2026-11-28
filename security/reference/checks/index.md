# 自动化安全检查

> 用于检查 Home Assistant 的代码、依赖项和工作流是否存在安全问题的工具，以及它们的运行位置。

Source: https://www.hasscn.top/contributors/security/reference/checks/

这些检查会自动运行，因此许多问题在审阅者查看之前就会被发现。它们不能取代审阅：它们只能捕获已知的模式，而不是所有错误。除非表格中另有说明，否则所有检查都在[核心仓库](https://github.com/home-assistant/core)中运行。

| 检查 | 运行位置 | 捕获内容 |
| --- | --- | --- |
| hassfest requirements | CI 中，以及本地通过 `python3 -m script.hassfest` 运行 | Core 集成中未使用 `==` 固定版本的依赖要求。依赖树中不应作为运行时依赖的包，或无人维护的包。安装了顶层 `test`、`tests`、`doc` 或 `docs` 文件夹，或顶层 `.pth` 或 `.start` 文件的包。 |
| 许可证审计 | CI 中，当依赖要求发生变化时 | 未获得 OSI 批准许可证的已安装包（[`script/licenses.py`](https://github.com/home-assistant/core/blob/dev/script/licenses.py)）。 |
| Check requirements | 更改依赖要求文件的拉取请求 | PyPI 上的已知漏洞和被撤回的版本、私有源代码仓库、没有发布证明的版本、薄弱的发布流水线、源代码中明显的危险信号、缺失的更新日志链接，以及 `async` 代码中的阻塞调用。参见[依赖项与供应链](https://www.hasscn.top/contributors/security/guides/dependencies/#check-requirements)。 |
| Ruff 安全规则 | pre-commit 钩子，也在 CI 中 | 类似 `exec`（`S102`）、`eval`（`S307`）、使用 `shell=True` 的 `subprocess`（`S602`）的调用、不安全的 XML 解析、`pickle`、硬编码的临时文件，以及作为默认值的硬编码密码。完整列表位于 `pyproject.toml` 中 `[tool.ruff.lint]` 的 `select` 下。 |
| CodeQL | 每周一次 | 由 GitHub 对 Python 代码进行的代码扫描。 |
| zizmor | pre-commit 钩子，也在 CI 中 | GitHub 工作流中的安全问题，以 pedantic 模式运行。 |
| actionlint | [前端仓库](https://github.com/home-assistant/frontend)的 CI | GitHub 工作流中的错误。 |
| Renovate | 其自身的拉取请求 | 更新依赖项、pre-commit 钩子和固定版本 GitHub Actions 的拉取请求。 |

## 相关内容

- [依赖项与供应链](https://www.hasscn.top/contributors/security/guides/dependencies/)：这些检查对你的拉取请求意味着什么。
- [拉取请求上的检查](https://www.hasscn.top/contributors/core/development/checks/)：Core 的所有检查，不仅限于安全。
