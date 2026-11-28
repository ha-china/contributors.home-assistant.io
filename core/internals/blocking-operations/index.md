# 阻塞操作

> 如何避免阻塞 I/O 和缓慢的导入进入事件循环，以及如何修复 Home Assistant 报告的阻塞调用。

Source: https://www.hasscn.top/contributors/core/internals/blocking-operations/

[事件循环](https://www.hasscn.top/contributors/glossary/event-loop/)（event loop）中的阻塞调用会让整个 Home Assistant 停滞，直到它返回为止。网络 I/O、磁盘 I/O、休眠以及繁重的计算都会造成阻塞。请在执行器（executor）中执行这些操作，或者使用异步替代方案。

Home Assistant 会检测事件循环中的许多阻塞调用，并在日志中报告它们，同时给出发起调用的集成（integration）及其所在行。其中两个调用，`sleep` 和 `putrequest`，还会被直接阻止：该调用会抛出 `RuntimeError` 而不是执行。如果您是通过此类报告来到这里的，请在下面的列表中查找您的调用。

## 在执行器中运行阻塞代码

在 Home Assistant 中，请使用 `hass.async_add_executor_job`。在库中，请使用标准的 `loop.run_in_executor`：

```python
import asyncio
from functools import partial

# In Home Assistant
result = await hass.async_add_executor_job(blocking_code, "something")
result = await hass.async_add_executor_job(
    partial(blocking_code_with_kwargs, kwarg=True)
)

# In library code
loop = asyncio.get_running_loop()
result = await loop.run_in_executor(None, blocking_code, "something")
```

请阅读 Python 关于[运行阻塞代码](https://docs.python.org/3/library/asyncio-dev.html#running-blocking-code)的说明，了解其中的陷阱。

## Home Assistant 检测的调用

### 文件系统：open、glob、walk、listdir、scandir 以及 pathlib 的读取和写入

`open`、`glob.glob`、`glob.iglob`、`os.walk`、`os.listdir`、`os.scandir` 以及 `pathlib.Path` 的 `read_text`、`read_bytes`、`write_text`、`write_bytes` 等方法都会进行磁盘 I/O。请在执行器中运行它们。Home Assistant 未检测到的调用也是如此，例如 `os.stat` 或 `os.path.exists`。

> [!WARNING]
> Home Assistant 只检测 `open` 调用，而不检测其后对文件的读取和写入。当您把 `open` 移入执行器时，请把读取和写入一并移过去。只移动 `open` 的修复方式会让阻塞 I/O 留在原地，而很长时间内都没人会注意到它。

### sleep

请将 `time.sleep` 替换为 `await asyncio.sleep`。阻塞式休眠的一个常见来源是 `pyserial-asyncio`。请改用 [`serialx`](https://github.com/puddly/serialx)：它原生支持 asyncio，并且与 `serial`、`serial_asyncio` 和 `serial_asyncio_fast` 导入兼容。参见[从 pyserial 迁移到 serialx](https://www.hasscn.top/contributors/blog/2026/04/27/pyserial-to-serialx/)。

### putrequest

`http.client` 及在其之上构建的任何东西（例如 `urllib` 和 `requests`）都会执行阻塞的网络 I/O。请在执行器中运行它们，或者更好的做法是切换到 `aiohttp` 这样的异步 HTTP 客户端。

### SSL：load_default_certs、load_verify_locations、load_cert_chain 和 set_default_verify_paths

创建 SSL 上下文会从磁盘读取证书。请不要自行创建：使用 Home Assistant 已经在事件循环之外准备好的共享客户端和上下文。

- 对于 `aiohttp`：使用来自 `homeassistant.helpers.aiohttp_client` 的 `async_get_clientsession(hass)`。
- 对于 `httpx2`：使用来自 `homeassistant.helpers.httpx_client` 的 `get_async_client(hass)`。
- 对于其他情况：使用 `homeassistant.util.ssl` 中的辅助函数，例如 `get_default_context()`。

### import_module

导入模块会从磁盘读取它。请参见下文的[导入](https://www.hasscn.top/contributors/core/internals/blocking-operations/#imports)。

## 导入

导入需要小心处理，原因有二：导入会从磁盘读取文件，这会造成阻塞；而且 CPython 中的导入[不是线程安全的](https://github.com/python/cpython/issues/83065)。

### 在模块级别导入

如果您的集成在模块顶部导入所需内容，并且 `__init__.py` 导入它所需的模块，那么您无需担心。Home Assistant 会在事件循环启动之前加载您的集成，或者在导入执行器（import executor）中加载：这是一个专门用于导入的独立线程。

对于几乎所有的集成来说，这都是正确的选择。

### 稍后导入，需谨慎

有时某个模块只在少见的情况下才需要，或者顶层导入会造成循环导入。这时：

- 如果模块已经加载，普通的 `import` 语句没有问题：Python 不会再次加载它。
- 如果模块只在一处被导入，请把导入放入一个函数中，并使用 `hass.async_add_executor_job` 运行该函数。
- 如果模块可能同时从不同的地方被导入，请使用 `homeassistant.helpers.importlib` 中的 `async_import_module`。它会缓存结果，并让并发的导入相互等待。

```python
from homeassistant.helpers.importlib import async_import_module

module = await async_import_module(
    hass, f"homeassistant.components.my_integration.{name}"
)
```

要检查某个模块是否已加载，请查看 `sys.modules`。只要加载*开始*，模块就会出现在那里，因此当从多个路径导入时，请留意竞态条件。

### 仅用于类型检查的导入

如果您只是出于类型注解的需要而导入，请为其加上保护，使它在运行时完全不被导入：

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from some_library import SomeClass


def some_function() -> SomeClass:
    ...
```

### 很少使用的代码

导入会消耗 CPU 时间和磁盘 I/O，加载之后还会占用内存。对于只是偶尔需要的代码，延迟导入可能是更好的权衡，前提是它遵循上述规则。

## 尽早发现阻塞调用

在开发时开启调试模式，即在 `configuration.yaml` 的 `homeassistant:` 下设置 `debug: true`，并使用 Python 的 [asyncio 调试模式](https://docs.python.org/3/library/asyncio-dev.html#debug-mode)运行。这两种方式都能捕获那些否则只会表现为系统缓慢的阻塞调用。
