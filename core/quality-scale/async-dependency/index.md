# 使用异步依赖

> 白金规则 async-dependency：集成所使用的库基于 asyncio。

Source: https://www.hasscn.top/contributors/core/quality-scale/async-dependency/

这是一条白金（Platinum）规则。在 `quality_scale.yaml` 中，它被称为 `async-dependency`。

集成（integration）用来与设备或服务通信的库必须是专为 asyncio 编写的。其 I/O 操作（例如网络请求）以协程的形式在 Home Assistant 的[事件循环（event loop）](https://www.hasscn.top/contributors/glossary/event-loop/)上运行，而不是使用需要线程的阻塞调用。

## 为什么这很重要

Home Assistant 运行在 asyncio 之上。阻塞式的库无法在事件循环上运行，因此每次调用都必须交给执行器（executor）中的线程，结果还需要返回到事件循环。每一次这样的切换都会耗费时间和内存，当众多集成轮询众多设备时，这些开销会不断累积。异步库可以避免所有这些问题，而且集成代码也会因此变得更加简洁。

## 示例

使用阻塞式库时，每次调用都要经过执行器：

```python
data = await hass.async_add_executor_job(client.get_data)
```

使用异步库时，你可以直接 await 该调用：

```python
data = await client.get_data()
```

如果你自行维护该库，这通常意味着基于 `aiohttp` 或 `httpx` 来构建 HTTP 功能，或基于 asyncio 流（stream）来构建原始套接字功能。这也使得 [inject-websession](https://www.hasscn.top/contributors/core/quality-scale/inject-websession/) 成为可能。

## 检查方式

该规则在代码审查中进行检查。代码中的一个良好提示是对该库的调用使用了 `async_add_executor_job`。

## 例外情况

如果集成没有外部依赖，或者其依赖不执行任何 I/O 操作，则此规则不适用。

## 相关规则

- [inject-websession](https://www.hasscn.top/contributors/core/quality-scale/inject-websession/)：传入 web 会话。
- [dependency-transparency](https://www.hasscn.top/contributors/core/quality-scale/dependency-transparency/)：使用透明的依赖。
