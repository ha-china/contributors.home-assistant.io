---
title: "使用 UpdateFailedUnreachable 在 info 级别记录不可达设备"
description: "Home Assistant Core 2026.12 新增了 UpdateFailedUnreachable，它是 UpdateFailed 的子类。数据更新协调器会以 info 级别而非 error 级别记录它。"
date: 2026-11-13
authors:
  - Shay Levy
areas:
  - core
---

Home Assistant Core 2026.12 在数据更新协调器中新增了 `UpdateFailedUnreachable`。当设备或服务无法访问时，可从 `_async_update_data` 中抛出该异常。协调器会以 `info` 级别记录首次失败，而非 `error` 级别，这正是质量量表中 [log-when-unavailable](/core/quality-scale/log-when-unavailable/) 规则所要求的。

<!--truncate-->

## 原因

log-when-unavailable 规则要求您在设备或服务无法访问时以 `info` 级别记录一次，并在其恢复访问时再记录一次。使用协调器时，第二条消息已经存在：`Fetching <name> data recovered` 会以 `info` 级别记录。但第一条消息并不存在。抛出 `UpdateFailed` 会以 `error` 级别记录 `Error fetching <name> data: <message>`，因此迁移到协调器的集成会在其设备离线时每次都记录错误。

## 如何使用

`UpdateFailedUnreachable` 是 `UpdateFailed` 的子类，因此其行为相同：协调器的实体变为不可用，协调器会在下一个间隔重试，并且 `retry_after` 同样有效。唯一的区别在于日志消息：首次失败会以 `info` 级别记录一次，内容为 `<name> is unavailable: <message>`。

```python
from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
    UpdateFailedUnreachable,
)


class MyCoordinator(DataUpdateCoordinator[MyData]):
    """Fetch data for all entities."""

    async def _async_update_data(self) -> MyData:
        """Fetch the latest data."""
        try:
            return await self.client.get_data()
        except MyConnectionError as err:
            raise UpdateFailedUnreachable(
                translation_domain=DOMAIN,
                translation_key="update_unreachable",
            ) from err
```

有关完整更改，请参阅 [拉取请求](https://github.com/home-assistant/core/pull/188683)，有关协调器及其异常的更多信息，请参阅 [获取数据](/core/integrations/fetching-data/)。
