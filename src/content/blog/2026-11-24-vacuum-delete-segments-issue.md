---
title: 删除真空吸尘器分区已更改的修复问题
description: 真空吸尘器实体（entity）新增 async_delete_segments_issue() 方法，使集成（integration）能够在机器人再次报告已保存的分区时删除“分区已更改”修复。
date: 2026-11-24
authors:
  - Jan Bouwhuis
areas:
  - core
---

支持 `CLEAN_AREA` 的真空吸尘器集成（integration）在真空吸尘器报告的分区与区域映射中保存的分区不同时，会调用 `async_create_segments_issue()`。到目前为止，集成（integration）无法再次删除该[修复](/glossary/repair/)。该问题仅在用户保存更改后的区域映射时才会被删除。当真空吸尘器再次报告已保存的分区时，修复仍然保持打开状态，并且保存未更改的映射也无法清除它。

`StateVacuumEntity` 现在新增了一个方法 `async_delete_segments_issue()`，用于再次删除该问题。

## 当分区再次匹配时删除问题

当真空吸尘器报告的分区与 `last_seen_segments` 相同时，调用 `async_delete_segments_issue()`。如果不存在问题，调用它不会产生任何效果，因此您可以在每次更新时调用它。

```python
from homeassistant.components.vacuum import Segment, StateVacuumEntity
from homeassistant.core import callback


class MyVacuum(StateVacuumEntity):
    """Representation of a vacuum."""

    @callback
    def _async_handle_segments(self, segments: list[Segment]) -> None:
        """Create or delete the segments changed repair issue."""
        if (last_seen := self.last_seen_segments) is None:
            # No area mapping has been saved yet
            return
        if {s.id: s for s in last_seen} != {s.id: s for s in segments}:
            self.async_create_segments_issue()
        else:
            self.async_delete_segments_issue()
```

该方法通过问题 ID 删除问题。这意味着它也会删除在实体（entity）重新加载之前创建的问题。与 `async_create_segments_issue()` 一样，当实体（entity）没有实体注册表条目时，它会引发 `RuntimeError`。

用户保存更改后的区域映射后，您无需调用该方法。在这种情况下，真空吸尘器实体（entity）仍会自行删除该问题。

## 更新您的集成

如果您的集成（integration）调用了 `async_create_segments_issue()`，请在报告的分区再次与 `last_seen_segments` 匹配时，也调用 `async_delete_segments_issue()`。MQTT 真空吸尘器平台已从 [core PR #194248](https://github.com/home-assistant/core/pull/194248) 开始执行此操作。

有关更多信息，请参阅 [core PR #194247](https://github.com/home-assistant/core/pull/194247) 和[真空吸尘器实体文档](/core/entities/vacuum/#cleaning-areas)。
