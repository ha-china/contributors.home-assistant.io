---
title: 设置失败与异常
description: 设备离线时重试设置，凭据失效时启动重新身份验证，并在动作中抛出正确的异常。
sidebarLabel: Setup failures and exceptions
sidebarGroup: Setup and configuration
order: 9
---

设备会离线，服务会出现故障，密码会过期。您的集成必须能够自行从中恢复，只要问题一消失就恢复，而且无需用户重启 Home Assistant。为此您无需编写重试循环：您只需抛出正确的异常，剩下的交给 Home Assistant 处理。

## 在设置期间

从 `__init__.py` 中的 `async_setup_entry` 抛出以下异常：

| 异常 | 适用场景 | Home Assistant 的行为 |
| --- | --- | --- |
| `ConfigEntryNotReady` | 设备或服务离线或尚未就绪 | 将配置条目（config entry）置于 `SETUP_RETRY`，并以逐渐增长的延迟进行重试，最长间隔为 10 分钟 |
| `ConfigEntryAuthFailed` | 凭据不再有效 | 将条目置于 `SETUP_ERROR`，并启动[重新身份验证流程](/core/integrations/reauth-reconfigure/#reauthentication) |
| `ConfigEntryError` | 出现了重试也无法解决的问题 | 将条目置于 `SETUP_ERROR`，并且不会重试 |

这三个异常都定义在 `homeassistant.exceptions` 中。

```python
from homeassistant.exceptions import (
    ConfigEntryAuthFailed,
    ConfigEntryNotReady,
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""
    client = ExampleClient(entry.data[CONF_HOST], entry.data[CONF_TOKEN])

    try:
        await client.connect()
    except ExampleAuthError as err:
        raise ConfigEntryAuthFailed(
            translation_domain=DOMAIN,
            translation_key="invalid_auth",
        ) from err
    except ExampleConnectionError as err:
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN,
            translation_key="cannot_connect",
            translation_placeholders={"host": entry.data[CONF_HOST]},
        ) from err
    ...
```

应从集成自身的 `async_setup_entry` 中抛出这些异常。平台（platform）的 `async_setup_entry` 运行得太晚：当它抛出 `ConfigEntryNotReady`、`ConfigEntryAuthFailed` 或 `ConfigEntryError` 时，Home Assistant 只会记录一条错误并跳过该平台。它不会重试，也不会启动重新身份验证。

如果您使用[数据更新协调器](/core/integrations/fetching-data/)（data update coordinator），当第一次更新失败时，`await coordinator.async_config_entry_first_refresh()` 会自动为您抛出 `ConfigEntryNotReady`；而来自协调器的 `ConfigEntryAuthFailed` 则会在任何时候启动重新身份验证，而不仅仅是在设置期间。

如果您的集成支持发现（discovery），Home Assistant 也会在再次发现设备时立即进行重试。当设置在 Home Assistant 仍在启动的过程中失败时，重试会等到启动完成之后才进行。

### 异常消息

异常的消息会显示在集成的页面上，让用户了解发生了什么。请像上面的示例一样使用已翻译的消息，文本放在 `strings.json` 的 `exceptions` 部分：

```json
{
  "exceptions": {
    "cannot_connect": {
      "message": "Could not connect to the Example device at {host}."
    },
    "invalid_auth": {
      "message": "The token of your Example account is no longer valid."
    }
  }
}
```

如果您没有提供消息，当您通过 `from` 从另一个异常抛出异常时，Home Assistant 会采用引发它的那个异常的消息。

不要自行记录该问题。Home Assistant 会记录重试情况，而充满相同警告的日志对任何人都没有帮助。

### 重试前等待

如果设备或服务会告知何时恢复可用，例如速率限制重置时间或 `Retry-After` 标头，请将该秒数作为 `retry_after` 传入。当它比正常延迟更长时，Home Assistant 会将其用于下一次尝试，最长为一天：

```python
except ExampleRateLimitError as err:
    raise ConfigEntryNotReady(
        translation_domain=DOMAIN,
        translation_key="rate_limited",
        retry_after=err.retry_after,
    ) from err
```

## 从 YAML 设置的平台

通过 `async_setup_platform` 从 YAML 设置平台的集成应改为抛出 `PlatformNotReady`。之后，Home Assistant 会重试该平台的设置。它将第一次重试记录为警告，后续重试则以调试级别记录。

## 动作（action）和实体方法中的异常

当动作失败时，用户会在 UI 中、自动化追踪中，或调用它的脚本中看到该错误。请抛出与所出问题相匹配的异常：

| 异常 | 适用场景 |
| --- | --- |
| `ServiceValidationError` | 用户操作有误，例如值的组合无效 |
| `HomeAssistantError` | 其他原因导致失败，例如设备没有响应 |

区别在于调用方收到的返回结果。前端所使用的 WebSocket API 会报告 `service_validation_error` 或 `home_assistant_error`，而 REST API 则以状态码 400 或 500 进行响应。在默认日志级别下，两者都不会记录堆栈跟踪。

请抛出 `ServiceValidationError` 而不是 `ValueError`。这些规则适用于[动作](/core/integrations/actions/)以及由动作调用的实体方法，例如 `async_turn_on` 或 `async_set_hvac_mode`。

```python
from homeassistant.exceptions import HomeAssistantError


async def async_turn_on(self, **kwargs: Any) -> None:
    """Turn the switch on."""
    try:
        await self.coordinator.client.turn_on()
    except ExampleConnectionError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="communication_error",
            translation_placeholders={"error": str(err)},
        ) from err
```

`HomeAssistantError` 及所有继承它的异常都接受 `translation_domain`、`translation_key` 和 `translation_placeholders`。翻译后的消息会以用户的语言显示。使用翻译的异常是[质量分级](/core/quality-scale/)（quality scale）金牌级（Gold tier）的一项规则。
