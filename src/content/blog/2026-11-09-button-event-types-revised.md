---
title: 按钮事件实体的修订标准事件类型
description: 按钮事件实体新增 SINGLE_PRESS 和 MULTI_PRESS，PRESS_END 现在仅表示释放，旧的多次按压类型已弃用。
date: 2026-11-09
authors:
  - Abílio Costa
areas:
  - core
---

[按钮事件实体的标准事件类型](/blog/2026/07/22/button-standard-event-types/)已修订。`PRESS_END` 现在仅表示按钮被释放，新的 `SINGLE_PRESS` 和 `MULTI_PRESS` 类型描述设备计数的按压次数，而 `MULTI_PRESS_ONGOING`、`MULTI_PRESS_END` 和 `ATTR_MULTI_PRESS_COUNT` 已弃用。

有关完整背景，请参阅[架构讨论](https://github.com/home-assistant/architecture/discussions/1502)。

<!--truncate-->

## 变更内容

事件类型现在分为两层。物理层类型描述按钮按下和释放。手势层类型描述设备根据按压次数得出的结论。

| 事件类型 | 状态 | 层 | 含义 |
| --- | --- | --- | --- |
| `SINGLE_PRESS` | 新增 | 手势 | 设备得出结论，恰好发生了一次短按。 |
| `MULTI_PRESS` | 新增 | 手势 | 设备已完成对两次或更多次按压的计数。 |
| `PRESS_END` | 变更 | 物理 | 按钮在设备未归类为长按的按压后被释放。它不再表示已计数的单次按压。 |

`MULTI_PRESS` 在 `press_count` 属性（`ATTR_PRESS_COUNT` 常量）中包含按压次数。仅在同时列出 `SINGLE_PRESS` 时，才在 `event_types` 中列出它。

## 弃用项

| 已弃用 | 改用 |
| --- | --- |
| `ATTR_MULTI_PRESS_COUNT` | `ATTR_PRESS_COUNT` |
| `ButtonEventType.MULTI_PRESS_END` | `ButtonEventType.MULTI_PRESS` |
| `ButtonEventType.MULTI_PRESS_ONGOING` | 集成特定的事件类型 |

使用它们会记录警告，并将在 Home Assistant 2027.5.0 中移除。

## 需要做什么

- 如果您的集成在设备计数后为单次按压触发 `PRESS_END`，请改用 `SINGLE_PRESS`。
- 将弃用的类型和常量替换为上表中的内容。
- 切换会改变用户看到的事件类型和属性，因此请告知他们。

有关完整详细信息，请参阅[事件实体文档](/core/entities/event/#standard-event-types)。
