# Home Assistant 中的异步

> 为什么 Home Assistant 运行在单个 asyncio 事件循环上、你所编写的函数有哪些类型，以及如何将工作移入和移出事件循环。

Source: https://www.hasscn.top/contributors/core/internals/asyncio/

Home Assistant Core 运行在 Python 的 `asyncio` 之上。所有核心对象，比如状态机（state machine）、事件总线（event bus）和注册表（registries），都位于同一个线程中：[事件循环（event loop）](https://www.hasscn.top/contributors/glossary/event-loop/)。同一时刻只有一段代码在事件循环中运行。在两个 `await` 之间，你的代码运行时不会有其他代码插入其中，因此当其他代码查看状态时，状态变更永远不会处于完成一半的状态。

这有两面性。当一个协程（coroutine）在等待某些东西（比如网络响应）时，其他代码会在期间运行。因此，跨越 `await` 的任务仍然可能需要 `asyncio.Lock` 来避免两次运行互相干扰。例如，协调器（coordinator）在刷新时就是这样做的。但是，当事件循环中的代码发生_阻塞_时，比如同步库的网络调用或从磁盘读取文件，_所有东西_都要等待。单个阻塞调用就会让整个系统变得迟缓。本页的大部分内容就是在讲如何避免这种情况。

刚接触 asyncio？Python 文档中的[使用 asyncio 进行开发](https://docs.python.org/3/library/asyncio-dev.html)是一个很好的起点，[Robert Smallshire 的这场演讲](https://www.youtube.com/watch?v=M-UcUs7IMIM)讲述了 asyncio 如何以及为什么以这种方式工作，同样值得一听。

## 函数的种类

Home Assistant 有一套命名约定：名称以 `async_` 开头的函数必须在事件循环中运行。你需要打交道的是四种函数。

### 协程函数

使用 `async def` 声明。调用一个协程函数会返回一个协程，在被 await 或作为任务（task）调度之前它什么也不做。在它等待期间，事件循环中会运行其他工作。

```python
async def async_update_data(self) -> None:
    """Fetch the latest data from the device."""
    self._data = await self._client.async_get_status()
```

任何需要等待 I/O 的操作都可以使用协程函数，前提是你调用的库是异步的。

### 回调函数

使用来自 `homeassistant.core` 的 `@callback` 装饰的普通函数。它承诺在事件循环中运行是安全的：不做任何 I/O，也永远不会阻塞。它不能 await 任何东西，但可以调度任务。

```python
from homeassistant.core import Event, callback


@callback
def _async_handle_event(self, event: Event) -> None:
    """Handle an event from the bus."""
    self._last_event = event.data
    self.async_write_ha_state()
```

为什么不把所有东西都做成协程？为了速度和一致性。Home Assistant 会立即运行回调。而协程必须被包装成任务并调度，且每个 `await` 都是一个其他代码可能插入运行的点。在核心代码中，事件监听器、状态变更处理器和小型辅助函数都是回调。

忘记 `@callback` 是一个常见的 bug。此时 Home Assistant 会将该函数当作阻塞函数，并在线程中运行它，而在线程中调用 `async_` API 不是线程安全的。参见[线程安全](https://www.hasscn.top/contributors/core/internals/thread-safety/)。

### 线程安全函数

只做计算的函数，比如 `sum()` 或合并两个字典，在任何地方都是安全的。它们没有专门的标记。如有疑问，请阅读其实现代码。

### 其他所有函数

会执行 I/O、休眠，或者不能确定是否安全的函数。它们不得在事件循环中运行，请将它们放入执行器（executor）中运行。

## 将阻塞工作移至执行器

执行器是一个用于阻塞代码的线程池。在事件循环中，使用 `hass.async_add_executor_job` 将函数交给它，并 await 结果：

```python
data = await hass.async_add_executor_job(client.get_status)
```

参数跟在函数后面。对于关键字参数，请将调用包装在 `functools.partial` 中：

```python
from functools import partial

data = await hass.async_add_executor_job(
    partial(client.get_status, include_history=True)
)
```

如果存在异步库，请优先使用。执行器线程比协程开销大得多，而且线程池并非没有限制。关于 Home Assistant 能检测到哪些调用以及如何处理，请参见[阻塞操作](https://www.hasscn.top/contributors/core/internals/blocking-operations/)。

## 在后台启动工作

要启动一个协程而不等待其完成，请创建任务。在集成（integration）中，请使用配置条目（config entry）上的方法，这样任务就会与该条目的生命周期绑定在一起：

```python
entry.async_create_background_task(
    hass, self._async_listen(), "my_integration listener"
)
```

- `entry.async_create_task(hass, coro)` 和 `hass.async_create_task(coro)` 创建的任务会被 Home Assistant 在启动期间等待。
- `entry.async_create_background_task(hass, coro, name)` 和 `hass.async_create_background_task(coro, name)` 为需要长时间运行的东西创建任务，比如套接字上的监听器。它不会拖慢启动，并且会在关闭时被取消。配置条目版本还会在条目卸载时被取消。

## 从线程调用异步代码

有时你正处于某个线程中，比如同步库的回调，此时需要调用异步的东西。如果该 API 有同步版本，请使用同步版本，比如使用 `hass.bus.fire` 而不是 `hass.bus.async_fire`。否则，请在事件循环上调度协程并等待结果：

```python
import asyncio


def say_hello(hass: HomeAssistant, target: str) -> str:
    """Call async code from a thread and wait for it."""
    return asyncio.run_coroutine_threadsafe(
        async_say_hello(hass, target), hass.loop
    ).result()
```

> [!WARNING]
> 切勿在事件循环内部这样做：这会导致死锁。另外，当协程本身使用执行器时也要小心，因为这也可能造成死锁。

## 将你的代码改为异步

如果你参与开发的集成仍在使用同步代码，以下是对应的异步版本：

| 同步 | 异步 |
| --- | --- |
| `def setup(hass, config)` | `async def async_setup(hass, config)` |
| 实体（entity）上的 `def update(self)` | `async def async_update(self)` |
| `def turn_on(self, **kwargs)` | `async def async_turn_on(self, **kwargs)` |

实体的属性是从事件循环中读取的。绝不要在属性中执行 I/O：请在更新方法或[协调器](https://www.hasscn.top/contributors/glossary/coordinator/)中获取数据，然后返回你存储的内容。

## 尽早发现错误

开发时请打开调试模式。它会让 Home Assistant 检查许多线程安全和阻塞方面的错误，并附上堆栈跟踪进行报告。将以下内容添加到 `configuration.yaml` 中：

```yaml
homeassistant:
  debug: true
```

你也可以使用 Python 的 [asyncio 调试模式](https://docs.python.org/3/library/asyncio-dev.html#debug-mode)启动 Home Assistant，它会报告从未被 await 的协程以及耗时过长的回调。
