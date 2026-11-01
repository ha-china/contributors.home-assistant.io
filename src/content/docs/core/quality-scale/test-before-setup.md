---
title: 在设置期间检查连接
description: "青铜规则 test-before-setup：设置时会检查其能否正常工作，如果不能，则抛出正确的异常。"
sidebarLabel: test-before-setup
sidebarGroup: Bronze
order: 19
---

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `test-before-setup`。

当配置条目（config entry）被设置时，`async_setup_entry` 必须检查集成（integration）能否正常工作，并在无法正常工作时抛出正确的异常：

- `ConfigEntryNotReady`：当问题是临时性的，例如设备（device）离线。Home Assistant 稍后会重试设置。
- `ConfigEntryAuthFailed`：当凭证错误或已过期时。如果集成具有重新认证流程，Home Assistant 会启动该流程。
- `ConfigEntryError`：当问题不会自行消失时，例如账户已被关闭。Home Assistant 不会重试。

## 为什么这很重要

这些异常是用户发现问题的途径。**设置** > **设备与服务**中的集成卡片会显示该条目设置失败及其原因，而不是让实体（entity）默默地永远取不到值。Home Assistant 还会以退避（backoff）的方式为你处理重试，因此你不必自己编写这部分逻辑。

## 示例

将库抛出的异常映射为设置时的异常：

```python
async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> None:
    """Set up My integration from a config entry."""
    client = MyClient(entry.data[CONF_HOST])

    try:
        await client.connect()
    except MyConnectionError as err:
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN,
            translation_key="cannot_connect",
        ) from err
    except MyAuthenticationError as err:
        raise ConfigEntryAuthFailed(
            translation_domain=DOMAIN,
            translation_key="invalid_auth",
        ) from err

    entry.runtime_data = client
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
```

这通常是自动获得的。当 [coordinator](/glossary/coordinator/) 的首次更新失败时，`await coordinator.async_config_entry_first_refresh()` 会抛出 `ConfigEntryNotReady`，而更新过程中抛出的 `ConfigEntryAuthFailed` 和 `ConfigEntryError` 则会直接传递。在 OAuth2 会话上调用 `await session.async_ensure_token_valid()` 时，如果令牌无法刷新，就会抛出正确的异常。

不要在抛出异常之前自己记录错误：Home Assistant 已经会报告这些异常，而对于 `ConfigEntryNotReady`，每次重试都会记录一次日志。

### 经常离线的设备

有些设备故意保持离线，例如夜间太阳能逆变器或待机状态的电视。抛出 `ConfigEntryNotReady` 并让 Home Assistant 重试通常仍然是最简单的方法。但你也可以在不连接设备的情况下完成设置。使用 `await coordinator.async_refresh()` 刷新协调器，该方法不会抛出异常，实体（entity）将保持不可用状态，直到设备响应。更新方法抛出的 `ConfigEntryAuthFailed` 仍会启动重新认证流程。在此之前，`coordinator.data` 仍为 `None`，因此在设置平台时读取该数据的代码必须处理这种情况。一旦设备恢复，请获取设置期间无法获取的任何内容，例如设备信息。非临时性错误（如凭证错误或账户已关闭）在检测到时仍必须在设置期间报告。

## 如何检查

- Hassfest（当规则为 `done` 时）：`async_setup_entry` 必须 await `async_config_entry_first_refresh` 或 `async_ensure_token_valid`，或者集成必须在其代码中的某处抛出 `ConfigEntryNotReady`、`ConfigEntryAuthFailed` 或 `ConfigEntryError`。
- Pylint：当错误先以警告级别或更高级别记录日志、然后又被抛出时，`home-assistant-log-and-raise` 会发出警告。
- 对于每种失败情况是否抛出了正确的异常，会在代码审查中检查。

## 例外情况

如果集成无法在设置期间检查其配置，或者它只进行本地计算，则此规则不适用。

## 相关规则

- [runtime-data](/core/quality-scale/runtime-data/)：将运行时数据存储在 runtime_data 中。
- [entity-unavailable](/core/quality-scale/entity-unavailable/)：在适当时将实体标记为不可用。
