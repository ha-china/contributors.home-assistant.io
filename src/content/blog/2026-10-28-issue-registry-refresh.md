---
title: 修复问题可以归属于配置条目，并可刷新
description: 将修复问题链接到其配置条目，Home Assistant 会在条目被移除时删除该问题。刷新一组问题，仅删除过时的问题。
date: 2026-10-28
authors:
  - Erik Montnémery
areas:
  - core
---

问题注册表的两项新增功能，让保持修复问题正确变得更容易，同时不会打扰用户。这两项功能均随 Home Assistant Core 2026.11 发布，并在 [repairs](/core/integrations/repairs/) 中有文档说明。

## 归属于配置条目的问题

您现在可以通过向 `async_create_issue` 或 `create_issue` 传递新的 `config_entry_id` 参数，将修复问题链接到其所属的配置条目。当配置条目被移除时，Home Assistant 会删除该问题，就像删除该条目的设备和实体一样。

```python
from homeassistant.helpers import issue_registry as ir

ir.async_create_issue(
    hass,
    DOMAIN,
    f"outdated_firmware_{entry.entry_id}",
    config_entry_id=entry.entry_id,
    is_fixable=False,
    severity=ir.IssueSeverity.WARNING,
    translation_key="outdated_firmware",
)
```

在涉及单个配置条目时，请设置 `config_entry_id`。如果您的集成有在条目被移除时删除这些问题的代码，一旦问题以 `config_entry_id` 创建，您就可以移除这些代码。在此之前创建的问题在再次创建之前不属于任何条目。大多数问题会在下次启动时重新创建，但一个 [持久化](/core/integrations/repairs/#persistence) 的问题如果不再被创建，可能仍需要在 `async_remove_entry` 中删除一段时间。

需要注意的几点：

- 问题仍由其域和 `issue_id` 标识，因此 `issue_id` 必须在您的域内保持唯一。当多个配置条目可能引发同类型问题时，请将条目 ID 放入 `issue_id`。
- 配置条目必须存在。传递未知 ID 会引发 `HomeAssistantError`。
- 创建已存在的问题会替换其 `config_entry_id`，即使您省略 `config_entry_id` 也是如此。
- 归属于已不存在配置条目的问题会在 Home Assistant 启动时被删除。
- 当配置条目被禁用时，其问题会从 **Repairs** 和 `issues()` 模板函数中隐藏。

此功能在核心 [PR #186197](https://github.com/home-assistant/core/pull/186197) 和 [PR #186369](https://github.com/home-assistant/core/pull/186369) 中实现。详情请参阅 [归属于配置条目的问题](/core/integrations/repairs/#issues-that-belong-to-a-config-entry)。

## 刷新一组问题

一种常见模式是删除某类问题的所有实例，然后创建仍然有效的问题。这很简单，但每个仍然有效的问题都会被删除并重新创建：用户会看到它消失又出现，而且他们忽略的问题会再次显示。同样的情况也发生在集成在配置条目卸载时删除的问题上，因为重新加载也会卸载条目。请改为设置它们的 `config_entry_id`。

新的 `ir.async_refresh_issues` 仅删除过时的问题：

```python
with ir.async_refresh_issues(
    hass,
    DOMAIN,
    issue_id_pattern="firmware_too_old_",
    config_entry_id=entry.entry_id,
):
    for device in coordinator.data.devices.values():
        if device.firmware_version < MINIMUM_FIRMWARE:
            ir.async_create_issue(
                hass,
                DOMAIN,
                f"firmware_too_old_{device.id}",
                config_entry_id=entry.entry_id,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key="firmware_too_old",
                translation_placeholders={"version": device.firmware_version},
            )
```

当问题刷新完成时，它会删除其集合中自刷新开始以来未被创建或保留的问题。被重新创建的问题会保留，因此它们会保持被忽略状态。任何对 `ir.async_create_issue` 的调用都算数，因此辅助功能和回调可以在刷新运行期间创建问题。请将刷新放在检查问题的代码周围，不要包裹 `async_forward_entry_setups`：它在平台失败或稍后重试时不会引发异常，因此刷新会删除从未被检查的问题。该集合还包括重启前的问题，因此刷新会清理已消失设备遗留的问题。

集合通过以下方式之一选择：

- `issue_id_pattern`，一个从问题 ID 开头匹配的正则表达式，如 `firmware_too_old_` 或 `(firmware_too_old|battery_low)_`。纯前缀也是有效模式。
- `issue_ids`，一个问题 ID 列表。
- 两者都不选，以选择该域的所有问题。

`config_entry_id` 将集合缩小到归属于该配置条目的问题。

其他新增功能：

- `ir.async_keep_issue(hass, domain, issue_id)` 和 `IssuesRefresh.async_keep` 用于保留您无法检查的问题，例如未响应的设备的问题。
- `ir.async_delete_issue` 接受 `defer_to_refresh` 参数。处于活动刷新集合中的问题会留给该刷新删除，因此如果它在刷新运行期间被重新创建或保留，它就能存活。这适用于在重新加载期间被移除的实体，这些实体可能会再次创建问题。

`ir.async_refresh_issues` 返回一个 `IssuesRefresh`。在 `with` 块中使用时，它会在块完成时结束刷新，并在引发异常时取消刷新。取消的刷新仅应用延迟删除。您也可以自行调用 `IssuesRefresh.async_finish()` 和 `IssuesRefresh.async_cancel()`。

刷新 API 仅在事件循环中工作。它在核心 [PR #187990](https://github.com/home-assistant/core/pull/187990) 中实现。详情（包括重叠刷新和在工作者线程中检查问题）请参阅 [刷新一组问题](/core/integrations/repairs/#refresh-a-set-of-issues)。
