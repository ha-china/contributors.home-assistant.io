---
title: "备份代理现在可以重命名"
description: 自 Home Assistant Core 2026.11 起，集成可以通过 async_rename_agent 将代理的备份设置移动到新的代理 ID。
date: 2026-10-26
authors:
  - Josef Zweck
areas:
  - core
---

自 Home Assistant Core 2026.11 起，集成可以使用 `async_rename_agent` 重命名备份代理。

当您的集成更改了代理 `unique_id` 的构建方式，从而改变了代理的 ID 时，请使用此功能。这样用户就能保留其代理的备份设置，无需重新设置。

```python
from homeassistant.components.backup import async_get_manager

async_get_manager(hass).async_rename_agent(
    f"{DOMAIN}.{old_agent_unique_id}", f"{DOMAIN}.{new_agent_unique_id}"
)
```

在您的 `manifest.json` 中的 `after_dependencies` 中添加 `backup`。更多信息请参阅 [重命名代理](/core/integrations/backup/#rename-an-agent)。
