# 任务

> Supervisor 如何以任务（job）的形式运行工作，包括条件、并发限制、节流，以及客户端可以跟踪的进度。

Source: https://www.hasscn.top/contributors/os/supervisor/jobs/

Supervisor 所做的几乎所有耗时操作都是一个任务（job）：安装应用、更新 Core、创建备份。任务是一个带有 `@Job` 装饰器的异步方法。该装饰器处理了原本需要在各处重复编写的逻辑：检查系统是否处于允许该工作运行的状态、防止同时运行两次，以及报告进度。

代码位于 [`supervisor/jobs/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/jobs)。

## 一个任务

```python
from ..jobs.const import JobConcurrency, JobCondition
from ..jobs.decorator import Job


class HomeAssistantCore(JobGroup):
    @Job(
        name="home_assistant_core_update",
        conditions=[
            JobCondition.FREE_SPACE,
            JobCondition.HEALTHY,
            JobCondition.INTERNET_HOST,
        ],
        on_condition=HomeAssistantJobError,
        concurrency=JobConcurrency.GROUP_REJECT,
    )
    async def update(self, version: AwesomeVersion | None = None) -> None:
        """Update Home Assistant Core."""
```

这是从 [`supervisor/homeassistant/core.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/homeassistant/core.py) 精简而来的。各部分说明：

- `name`：在整个 Supervisor 中唯一。它会出现在 API 和日志中。
- `conditions`：任务运行前必须满足的条件。
- `on_condition`：条件不满足时抛出的异常。如果没有指定，任务会记录失败并返回。
- `concurrency`：当该任务（或其所在组）已经在运行时的处理方式。

## 条件

条件在 [`supervisor/jobs/const.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/jobs/const.py) 中定义为 `JobCondition`。一些常见的条件：

| 条件 | 满足条件时通过 |
| --- | --- |
| `healthy` | 系统未被标记为不健康 |
| `free_space` | 数据磁盘上有足够的可用空间 |
| `internet_host`, `internet_system` | 主机或 Supervisor 本身可以访问互联网 |
| `running` | Supervisor 处于运行状态 |
| `haos` | 系统运行的是 Home Assistant OS |
| `os_agent` | OS Agent 可用 |
| `supervisor_updated` | Supervisor 运行的是最新版本 |
| `plugins_updated` | 每个插件都运行其最新版本 |
| `auto_update` | 自动更新已开启 |
| `mount_available` | 主机支持网络存储挂载 |

为了便于调试，可以使用 `ha jobs options --ignore-conditions <condition>` 忽略条件。执行此操作的系统会被标记为不受支持，原因为 `job_conditions`。可以使用 `ha jobs reset` 撤销。

## 并发与节流

`JobConcurrency` 控制当一个任务已在运行时再次被调用时的处理方式：

- `REJECT`：立即失败。
- `QUEUE`：等待正在运行的任务完成后再运行。
- `GROUP_REJECT` 和 `GROUP_QUEUE`：相同，但适用于同一组中的任何任务。

组（group）是继承自 `JobGroup` 的类，例如一个应用或 Home Assistant Core。同一实例上的所有任务共享一个锁，因此应用在被备份时无法被更新。任务可以调用其所在组内的其他任务而不会死锁。

`JobThrottle` 限制任务的运行频率。`THROTTLE` 会跳过一个周期内的调用，`RATE_LIMIT` 允许每个周期内一定数量的调用，超过后则失败。两者都有组变体。它们需要 `throttle_period`，速率限制还需要 `throttle_max_calls`。

## 进度与子任务

每个任务都有一个 UUID、一个阶段、一个进度百分比以及它的错误信息。从任务内部启动的任务会成为它的子任务。通过 `child_job_syncs`，一个任务可以从子任务获取进度，例如更新任务从拉取镜像的过程中获取进度。

客户端通过 API（使用 `/jobs/info` 和 `/jobs/<uuid>`）以及 Core 接收到的事件来跟踪任务。前端就是这样显示更新进度的。带有 `internal=True` 的任务不会对外暴露。带有 `cleanup=False` 的任务在完成后仍保持可读，以便客户端稍后获取结果。
