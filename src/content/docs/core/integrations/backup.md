---
title: 备份
description: 添加一个备份代理（backup agent）来存储 Home Assistant 备份，或者为备份准备你的集成。
sidebarGroup: 集成功能
order: 9
---

集成可以通过两种方式参与备份，两者都位于 `backup.py` 平台文件中：

- **备份代理（backup agent）**将备份存储到某处：网络共享、云存储服务或其他任何地方。用户在备份设置中选择代理。
- **前置和后置钩子（pre and post hooks）**在备份前暂停或准备你的集成，并在备份后恢复。

## 添加备份代理

备份代理继承自 `homeassistant.components.backup` 中的 `BackupAgent`，并实现五个方法：

```python
from collections.abc import AsyncIterator, Callable, Coroutine
from typing import Any

from homeassistant.components.backup import (
    AgentBackup,
    BackupAgent,
    BackupAgentError,
    BackupNotFound,
    OnProgressCallback,
)


class ExampleBackupAgent(BackupAgent):
    """Store backups at Example."""

    domain = DOMAIN

    def __init__(self, entry: ExampleConfigEntry) -> None:
        """Initialize the agent."""
        super().__init__()
        self._client = entry.runtime_data
        self.name = entry.title
        self.unique_id = entry.entry_id

    async def async_upload_backup(
        self,
        *,
        open_stream: Callable[[], Coroutine[Any, Any, AsyncIterator[bytes]]],
        backup: AgentBackup,
        on_progress: OnProgressCallback,
        **kwargs: Any,
    ) -> None:
        """Upload a backup."""

    async def async_download_backup(
        self, backup_id: str, **kwargs: Any
    ) -> AsyncIterator[bytes]:
        """Download a backup."""

    async def async_delete_backup(self, backup_id: str, **kwargs: Any) -> None:
        """Delete a backup."""

    async def async_list_backups(self, **kwargs: Any) -> list[AgentBackup]:
        """List the backups."""

    async def async_get_backup(
        self, backup_id: str, **kwargs: Any
    ) -> AgentBackup:
        """Return one backup."""
```

- `domain`、`name` 和 `unique_id` 用于标识代理。保持 `unique_id` 稳定不变。
- `async_upload_backup` 接收一个打开备份流的函数，以及 `backup` 中的备份元数据。
- `async_download_backup`、`async_delete_backup` 和 `async_get_backup` 在备份不存在时抛出 `BackupNotFound`。
- 对于任何其他错误，抛出 `BackupAgentError` 或继承自它的异常。其他异常不应从代理中抛出。

### 报告上传进度

在上传过程中调用 `on_progress`，例如每上传一个数据块后调用一次，并传入迄今为止已上传的总字节数。Home Assistant 使用它在 UI 中显示上传进度。

```python
on_progress(bytes_uploaded=bytes_sent)
```

### 告知 Home Assistant 你的代理

Home Assistant 从 `backup.py` 中的两个函数获取你的代理：

```python
from homeassistant.core import HomeAssistant, callback


async def async_get_backup_agents(hass: HomeAssistant) -> list[BackupAgent]:
    """Return the backup agents."""
    return [
        ExampleBackupAgent(entry)
        for entry in hass.config_entries.async_loaded_entries(DOMAIN)
    ]


@callback
def async_register_backup_agents_listener(
    hass: HomeAssistant,
    *,
    listener: Callable[[], None],
    **kwargs: Any,
) -> Callable[[], None]:
    """Register a listener for when agents are added or removed."""
    hass.data.setdefault(DATA_BACKUP_AGENT_LISTENERS, []).append(listener)

    @callback
    def remove_listener() -> None:
        """Remove the listener."""
        hass.data[DATA_BACKUP_AGENT_LISTENERS].remove(listener)

    return remove_listener
```

每当你的代理发生变化时，调用这些监听器，以便 Home Assistant 再次请求它们。对于跟随配置条目（config entry）的代理，在 `async_setup_entry` 中，当条目被加载或卸载时调用它们：

```python
def _notify_backup_listeners() -> None:
    for listener in hass.data.get(DATA_BACKUP_AGENT_LISTENERS, []):
        listener()

entry.async_on_unload(entry.async_on_state_change(_notify_backup_listeners))
```

`DATA_BACKUP_AGENT_LISTENERS` 是你自己定义的键，位于 `const.py` 中。

### 重命名代理

代理的 ID 为 `<domain>.<unique_id>`，由代理的 `unique_id` 构建。它不必与配置条目上的任何内容匹配。如果你的集成的新版本以不同方式设置 `unique_id`，用户将失去该代理的备份设置。调用 `async_rename_agent` 一次，将其移动到新 ID，例如在配置条目迁移中：

```python
from homeassistant.components.backup import async_get_manager


async def async_migrate_entry(hass: HomeAssistant, entry: ExampleConfigEntry) -> None:
    """Migrate old entry."""
    if entry.version == 1 and entry.minor_version == 1:
        # The agent used the config entry ID, now it uses the account ID
        async_get_manager(hass).async_rename_agent(
            f"{DOMAIN}.{entry.entry_id}", f"{DOMAIN}.{entry.data[CONF_ACCOUNT_ID]}"
        )
        hass.config_entries.async_update_entry(entry, minor_version=2)
```

- 它会移动代理的设置，包括自动备份是否使用它，以及失败的上传记录。代理存储的备份不受影响。
- 在 `manifest.json` 中将 `backup` 添加到 `after_dependencies`，以便备份集成在你的迁移运行之前完成设置。
- 仅在 ID 发生变化时调用它。

## 为备份做准备

某些集成需要在备份前暂停或写入其数据，以便能够正确恢复。将这两个函数添加到 `backup.py`，或运行 `python3 -m script.scaffold backup`：

```python
from homeassistant.core import HomeAssistant


async def async_pre_backup(hass: HomeAssistant) -> None:
    """Prepare for a backup."""


async def async_post_backup(hass: HomeAssistant) -> None:
    """Resume after a backup."""
```
