# 代码风格

> Home Assistant Core 中 Python 的风格规则。格式化、docstring、日志、错误处理，以及审查者所关注的约定。

Source: https://www.hasscn.top/contributors/core/development/style/

Core 是一个拥有数千名贡献者的大型代码库。一致的风格使其对所有人来说都易于阅读。大多数规则由工具强制执行，因此你不必记住它们。其余的约定则由审查者指出。

## 格式化和代码检查

你不需要手动格式化代码，也没有需要背诵的风格指南：由工具来决定。

- [Ruff](https://docs.astral.sh/ruff/) 格式化所有代码，其 linter 能捕获大多数问题，包括导入的顺序。Docstring 遵循 Google 约定，Ruff 也会对此进行检查。
- [Pylint](https://pylint.readthedocs.io/) 带有一套为 Home Assistant 编写的检查规则，能捕获 Ruff 看不到的模式。

两者都会在你提交时运行，并在 CI 中再次运行。未通过这些检查的拉取请求（pull request）不会被合并。请参阅 [Linters, hassfest, and CI](https://www.hasscn.top/contributors/core/development/checks/) 了解如何自行运行它们。

Core 要求 Python 3.14 或更新版本，因此请使用它所提供的特性。你不需要 `from __future__ import annotations`（Ruff 甚至会阻止它），并且注解中的前向引用也不需要加引号。

## Docstring 和注释

每个模块、类和函数都有 docstring。文件顶部的 docstring 说明该文件的内容：

```python
"""Support for Example sensors."""
```

类型提示（type hints）用于记录函数的参数。当函数需要更多说明时，请使用 [Google 风格](https://google.github.io/styleguide/pyguide.html#383-functions-and-methods)，并且不要包含类型：它们已经在函数签名中了。

```python
def calculate_dew_point(temperature: float, humidity: float) -> float:
    """Calculate the dew point.

    Args:
        temperature: The temperature in degrees Celsius.
        humidity: The relative humidity, in percent.

    Raises:
        ValueError: If the humidity is not between 0 and 100.
    """
```

注释应是完整的句子并以句号结尾。保持简短，并用它们解释*为什么*，而不是*是什么*：代码本身已经说明了它做什么。不要留下被注释掉的代码。Git 会记住它。

## 顺序和常量

- 在顺序无关紧要的情况下，保持常量以及列表和字典的内容按字母顺序排列。
- 集成（integration）中多个模块使用的常量放在 `const.py` 中，并从那里导入。只有一个模块使用的常量则保留在该模块中。
- 用常量替换魔法字符串。

## 日志

日志记录器（logger）已经添加了集成的名称，因此不要在消息中重复它。与 syslog 消息一样，日志消息不以句号结尾。

```python
_LOGGER.error("No route to device: %s", self._resource)
```

```text
ERROR [homeassistant.components.example] No route to device: 10.0.0.8
```

- 使用 `_LOGGER.debug` 记录任何非面向用户的内容。谨慎使用 `_LOGGER.info`。
- 仅在用户需要采取行动时使用 `_LOGGER.error`，而在某项功能可以工作但不完全正常时使用 `_LOGGER.warning`。设备离线是预期情况，而不是错误。
- 永远不要记录 API 密钥、令牌、用户名或密码。即使是错误的也不要记录。

## 字符串格式化

使用 f-strings，而不是 `%` 或 `str.format`：

```python
name = f"{device_name} {sensor_name}"
```

日志记录是例外。将值作为参数传递，这样消息只在实际记录时才被格式化：

```python
_LOGGER.info("Can't connect to %s at %s", service, host)
```

## 错误处理

- 只捕获你预期的异常，例如你的库的连接和 API 错误。不要使用 `except Exception:`。唯一可接受的位置是配置流程（config flow）步骤的最后一个 `except`，它会使用 `_LOGGER.exception` 记录意外错误并显示 `unknown` 错误，就像脚手架生成的那样。
- 保持 `try` 块较小。只将可能引发你所捕获异常的代码行放入其中。
- 优先使用提前返回而不是深层嵌套：`if not condition: return`。
- 当验证保证某个键存在时，使用 `data["key"]`，而不是 `data.get("key")`。缺失的键是一个 bug，应该让它显现出来。
- 不要为操作（action）模式（schema）已验证的输入添加检查。

当操作失败时，抛出 `HomeAssistantError`，如果输入有误则抛出 `ServiceValidationError`，以便用户在界面中看到错误。不要同时记录日志，消息已经被记录了。

```python
async def async_turn_on(self, **kwargs: Any) -> None:
    """Turn on the switch."""
    try:
        await self.device.turn_on()
    except DeviceConnectionError as err:
        raise HomeAssistantError(f"Failed to turn on: {err}") from err
```

## 使用 assert

Python 在以 `-O` 运行时会移除 `assert` 语句，因此它们不用于运行时检查。在测试中使用它们，以及帮助类型检查器收窄类型。在后一种情况下，将它们放在 `TYPE_CHECKING` 块中，这样它们就永远不会运行：

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    assert self.client is not None
```

## 结构

- 使用 dataclass 传递相关的值，而不是元组或字典。
- 不要在两个地方存储相同的值。
- 实体（entity）使用 `_attr_` 属性，例如 `_attr_native_value`，而不是属性（property），除非该值必须在读取时计算。
- 更改配置或具有安全影响的操作需要管理员权限。使用 `async_register_admin_service` 注册它们。
- 集成中不包含 `.gitignore` 文件。

不确定某些东西应该是什么样子？请查看[集成质量量表](https://www.hasscn.top/contributors/core/quality-scale/)上 Platinum 或 Gold 级别的集成。级别记录在其 `manifest.json` 中。
