# 动作注册表

> 动作注册表（action registry）的底层工作原理、动作处理程序会接收到什么，以及如何从代码中调用动作。

Source: https://www.hasscn.top/contributors/core/internals/actions/

本页介绍动作注册表（action registry）的底层工作方式：处理程序（handler）会接收到什么、数据如何进行验证，以及动作是如何被调用的。要在您的集成（integration）中注册动作、在 `services.yaml` 中描述它们以及返回响应数据，请参阅[集成中的动作](https://www.hasscn.top/contributors/core/integrations/actions/)。

[动作](https://www.hasscn.top/contributors/glossary/action/)（action）是 Home Assistant 应请求而执行的操作，例如 `light.turn_on` 或 `weather.get_forecasts`。自动化（automation）、脚本、仪表盘（dashboard）、语音助手以及各种 API 都会调用动作。每个动作都存放在 `hass.services` 上的动作注册表中。

> [!NOTE]
> 动作过去被称为服务（service）。代码中几乎处处仍在使用 service 这一名称：`hass.services`、`ServiceCall`、`services.yaml` 以及 `call_service` 事件。在文字中请写“动作”，在代码中请使用代码所使用的名称。

## 注册表

`hass.services.async_register(domain, service, handler)` 会将动作添加到注册表中。对于返回数据的动作，它接受可选的 `schema` 和 `supports_response`。集成（integration）应从 `async_setup` 中，通过其 `services.py` 中的 `async_setup_services` 来注册动作。请参阅[在 async_setup 中注册动作](https://www.hasscn.top/contributors/core/integrations/actions/#register-actions-in-async_setup)。

Home Assistant 使用 `probatio` 来处理模式（schema）。请以 `probatio` 的名称导入，不要使用别名。当您注册了一个模式后，它会在您的处理程序之前运行，因此无效的数据绝不会到达您这里。如果没有模式，`call.data` 就是调用者发送的任何内容。

## 处理程序

处理程序会接收到一个 `ServiceCall`，其中包含：

- `call.data`：经过验证的数据，只读。
- `call.context`：此次调用的 `Context`，其中包含发起调用的用户。凡是以该用户的名义执行的任何操作，都请将其传递下去。请参阅[权限](https://www.hasscn.top/contributors/core/internals/permissions/)。
- `call.domain` 和 `call.service`：被调用的是哪个动作。
- `call.return_response`：调用者是否请求了响应数据。
- `call.hass`：Home Assistant 实例。

处理程序可以是一个协程函数（coroutine function）、一个用 `@callback` 装饰的函数，或者一个普通函数。普通函数会在执行器（executor）中运行，就像[事件监听器](https://www.hasscn.top/contributors/core/internals/events/#listen-for-events)一样。

当出现问题时，处理程序会抛出异常。它从不返回错误码，响应数据中也不会返回。应该抛出哪种异常，请参见[抛出错误](https://www.hasscn.top/contributors/core/integrations/actions/#raise-errors)。

作用于实体（entity）的动作不会注册普通处理程序。`homeassistant.helpers.service` 中的 `async_register_platform_entity_service` 会解析用户选择的目标（实体、设备（device）、区域（area）、楼层或标签），检查权限，并在每个目标实体上调用一个方法。请参阅[实体动作](https://www.hasscn.top/contributors/core/integrations/actions/#entity-actions)。

## 调用动作

```python
await hass.services.async_call(
    "light",
    "turn_on",
    {"brightness": 255},
    target={"entity_id": "light.kitchen"},
    blocking=True,
    context=call.context,
)
```

- `blocking=True` 会等待动作完成，并抛出其异常。使用 `blocking=False` 时，调用会在后台启动，错误只会记录到日志中。
- `return_response=True` 会返回响应数据。它只能与 `blocking=True` 配合使用，并且仅适用于支持响应的动作。
- `context`：传递引发此次调用的上下文，以便正确归因。

从您自己的集成中调用动作的情况并不常见。您应该直接与自己的代码交互。调用其他集成的动作主要是自动化和脚本才会做的事情。

## 底层运行机制

当一个动作被调用时，注册表会查找处理程序，如果存在模式，则根据该模式验证数据，在[事件总线](https://www.hasscn.top/contributors/core/internals/events/)（event bus）上触发一个 `call_service` 事件，然后运行处理程序。`hass.services.async_services()` 返回所有已注册的内容，`hass.services.has_service(domain, service)` 则用于检查某个动作是否存在。注册和移除动作会触发 `service_registered` 和 `service_removed` 事件。
