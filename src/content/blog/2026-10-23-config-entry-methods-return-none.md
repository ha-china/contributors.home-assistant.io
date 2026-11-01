---
title: 配置条目函数现在返回 None
description: async_setup_entry、async_unload_entry 和 async_migrate_entry 现在在核心中返回 None。这改变了什么，以及对自定义集成意味着什么。
date: 2026-10-23
authors:
  - G Johansson
areas:
  - core
---

集成中 `__init__.py` 文件里的配置条目函数 `async_setup_entry`、`async_unload_entry` 和 `async_migrate_entry` 现在返回 `None` 而不是布尔值。它们要么成功，要么抛出其中一个 `ConfigEntry*` 异常。从 Home Assistant 2026.11.0 开始，核心集成必须遵循新的模式。自定义集成可以继续返回布尔值。

## 为什么

返回 `True` 或 `False` 可以追溯到配置条目的早期阶段。集成记录了一个问题，吞掉了异常，然后返回 `False`。Home Assistant 知道设置失败了，但不知道原因，用户也不知道。

自那以后，`ConfigEntryNotReady`、`ConfigEntryAuthFailed` 和 `ConfigEntryError` 接管了这项工作。它们支持翻译，决定 Home Assistant 是重试还是启动重新认证，并向用户显示出了什么问题。几乎每个集成都已经抛出这些异常，只是因为类型提示要求才以 `return True` 结尾。[架构讨论](https://github.com/home-assistant/architecture/discussions/1463) 提供了完整的背景。

## 核心中发生了什么变化

所有核心集成现在都从这些函数返回 `None`。`return False` 变成了抛出的 `ConfigEntryError`，Pylint 类型提示检查器要求 `-> None`。当核心集成仍然返回布尔值时，Home Assistant 会将其报告为错误，并且设置、卸载或迁移会失败。

设置看起来像这样：

```python
async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""
    coordinator = ExampleCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
```

对于卸载，使用新的 `async_unload_platforms_or_raise`。当平台卸载失败时，它会抛出一个带翻译的 `ConfigEntryError`，而不是返回 `False`：

```python
async def async_unload_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Unload a config entry."""
    await hass.config_entries.async_unload_platforms_or_raise(entry, PLATFORMS)
```

脚手架模板会为新集成生成这种模式。

## 测试

当你在测试中修补核心集成的 `async_setup_entry` 时，例如在配置流测试的 `mock_setup_entry` 夹具中，返回 `None` 而不是 `True`：

```python
@pytest.fixture
def mock_setup_entry() -> Generator[AsyncMock]:
    """Override async_setup_entry."""
    with patch(
        "homeassistant.components.example.async_setup_entry",
        return_value=None,
    ) as mock_setup_entry:
        yield mock_setup_entry
```

使用 `return_value=True` 时，修补后的函数返回布尔值，条目的设置会失败。

## 自定义集成

自定义集成不会受到任何破坏，也没有弃用。返回布尔值仍然受支持：

- `True` 表示成功，和以前一样。
- `False` 现在变成带有通用翻译消息的 `ConfigEntryError`，例如“无法设置配置条目。”条目最终处于与以前相同的状态：`SETUP_ERROR`、`FAILED_UNLOAD` 或 `MIGRATION_ERROR`。区别在于用户现在能看到原因。

不过，还是建议切换。抛出你自己的带有翻译消息的异常，用户就能看到实际出了什么问题，而不是通用消息。

在[配置条目文档](/core/integrations/config-entries/)和[设置失败与异常](/core/integrations/setup-failures/)中了解更多信息。
