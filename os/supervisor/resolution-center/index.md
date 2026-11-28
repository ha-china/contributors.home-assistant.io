# 解决中心

> Supervisor 如何通过检查和评估发现问题、将其跟踪为议题，并通过建议进行修复。

Source: https://www.hasscn.top/contributors/os/supervisor/resolution-center/

解决中心（resolution center）是 Supervisor 用来监控系统的方式。它会发现问题、记录问题，并在可能的情况下提供修复方案。用户在 Home Assistant 中以[修复](https://www.hasscn.top/contributors/glossary/repair/)的形式看到结果：Core 的 `hassio` 集成会将它们转换为修复议题。

代码位于 [`supervisor/resolution/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/resolution)，管理器是 `sys_resolution`。

## 核心概念

| 概念 | 含义 | 定义为 |
| --- | --- | --- |
| 议题（Issue） | 发现的问题，例如磁盘空间不足 | `IssueType` |
| 建议（Suggestion） | 针对一个或多个议题的修复方案，例如创建备份 | `SuggestionType` |
| 上下文（Context） | 议题所在的位置：`system`、`core`、`addon`、`plugin`、`mount` 等 | `ContextType` |
| 不受支持原因 | 系统不受支持的原因，例如修改过的 Docker 配置 | `UnsupportedReason` |
| 不健康原因 | 系统无法被信任正常运行的原因，例如 Docker 损坏 | `UnhealthyReason` |

它们都是 [`supervisor/resolution/const.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/resolution/const.py) 中的枚举。

一个议题包含类型、上下文和可选的引用（例如应用的 slug）。建议包含相同的内容，并指向它所修复的议题。

## 受支持与健康

这是两个不同的概念：

- **不受支持（Unsupported）** 意味着系统可以运行，但其配置方式不受本项目支持，例如主机不是 Home Assistant OS。用户会看到一条通知，但一切仍能正常工作。
- **不健康（Unhealthy）** 意味着系统处于 Supervisor 无法安全开展工作的状态。带有 `healthy` 条件的任务将拒绝运行，这会阻止大多数更新。

不受支持原因在 home-assistant.io 上有专门的页面向用户解释，地址为 `https://www.home-assistant.io/more-info/unsupported/<reason>`。Supervisor 会在警告中记录该链接。

## 检查、评估和修复

解决中心有三类插件，各自位于独立的文件夹中。这些文件夹中的每个模块都会通过其 `setup()` 函数自动加载。

- **检查（Checks）**（`checks/`）查找问题并创建议题。每个检查还会重新验证它之前创建的议题，并在问题消失后将其关闭。
- **评估（Evaluations）**（`evaluations/`）决定系统是否受支持。每个评估会添加或清除一个不受支持原因。
- **修复（Fixups）**（`fixups/`）执行建议。有些会自动运行，有些则等待用户应用。

每小时以及在应用建议之后，Supervisor 会运行所有检查，然后运行所有评估，最后运行可以自动执行的修复。

## 编写检查

一个检查需要继承 `CheckBase`。以下是来自 [`supervisor/resolution/checks/free_space.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/resolution/checks/free_space.py) 的可用空间检查，略有精简：

```python
class CheckFreeSpace(CheckBase):
    """Check for low free space."""

    async def run_check(self) -> None:
        """Create the issue when the system is affected."""
        if await self.approve_check(Issue(self.issue, self.context)):
            self.sys_resolution.create_issue(
                IssueType.FREE_SPACE, ContextType.SYSTEM
            )

    async def approve_check(self, issue: Issue) -> bool:
        """Return True while the issue still exists."""
        free_space = await self.sys_host.info.free_space()
        return free_space <= MINIMUM_FREE_SPACE_THRESHOLD

    @property
    def issue(self) -> IssueType:
        return IssueType.FREE_SPACE

    @property
    def context(self) -> ContextType:
        return ContextType.SYSTEM

    @property
    def states(self) -> list[CoreState]:
        return [CoreState.RUNNING, CoreState.STARTUP]
```

- `run_check` 查找问题并创建议题，通常会附带一个建议。
- `approve_check` 回答现有议题是否仍然适用。基类使用它来关闭已经消失的议题。
- `states` 限制检查运行的时间。

该模块还需要一个返回检查实例的 `setup(coresys)` 函数。评估和修复遵循相同的模式，分别使用 `EvaluateBase` 和 `FixupBase`。

当你添加新的议题或建议类型时，Core 需要为它提供翻译，以便前端能够显示有意义的修复。这需要向 Core 中的 `hassio` 集成提交一个单独的拉取请求。

## 通过命令行

`ha resolution info` 显示当前的议题、建议和原因。`ha resolution suggestion apply <uuid>` 应用一个修复，`ha resolution healthcheck` 立即运行检查。可以使用 `ha resolution check options <slug> --enabled=false` 关闭单个检查。
