---
title: "目标现在可以排除实体"
description: "目标现在可以通过排除块来排除实体、设备、区域、楼层和标签。这对自行解析目标的集成意味着什么。"
date: 2026-10-21
authors:
  - Jan-Philipp Benecke
areas:
  - core
---

针对区域、楼层或标签进行定位很方便，直到你想要其中的全部内容，但除了一两个东西。到目前为止，唯一的办法是逐一列出每个实体，这失去了首先针对区域的意义。

因此，目标现在可以有一个 `exclude` 块。它使用与目标本身相同的键，Home Assistant 会从解析后的目标中移除它匹配到的任何内容：

```yaml
action: light.turn_on
target:
  floor_id: ground_floor
  exclude:
    area_id: kitchen
    label_id: night_light
```

排除项与目标一样被解析，因此它们会保持最新。之后添加到厨房的灯也会被排除。排除项适用于整个目标，包括直接在目标中列出的实体。单独的 `exclude` 块不是有效的目标，它不能嵌套，也不能使用 `all` 或 `none`。

## 对大多数集成无需任何操作

如果 Home Assistant 为您解析目标，您的集成已经支持排除：

- 使用 `async_register_platform_entity_service` 或 `async_register_entity_service` 注册的实体操作，包括 `entity_id: all`
- 基于实体辅助元素构建的触发器和条件，例如 `make_entity_target_state_trigger`
- 使用 `service.async_extract_entities`、`service.async_extract_entity_ids` 或 `target.async_extract_referenced_entity_ids` 的代码
- 使用 `target.async_track_target_selector_state_change_event` 或 `TargetEntityChangeTracker` 跟踪目标的触发器

## 如果您自行解析目标

`cv.TARGET_FIELDS`、`cv.ENTITY_SERVICE_FIELDS` 和 `cv.TARGET_SERVICE_FIELDS` 现在接受 `exclude`，并且由它们构建的每个模式（如 `cv.make_entity_service_schema`）也接受。如果您的代码从目标中读取 `entity_id`、`device_id` 或 `area_id` 并自行解析它们，它现在会接受 `exclude` 块并静默忽略它。这比错误更糟糕：操作或触发器随后会作用于用户要求排除的实体。

请改用目标辅助元素来解析目标。它们会为您应用排除块：

```python
from homeassistant.helpers import target as target_helpers

selection = target_helpers.TargetSelection(call.data)
selected = target_helpers.async_extract_referenced_entity_ids(
    hass, selection
)
entity_ids = selected.referenced | selected.indirectly_referenced
```

如果您的集成无法支持排除，请从 `cv.TARGET_ID_FIELDS` 构建其模式。它包含没有 `exclude` 的目标键，因此排除块会验证失败，而不是被忽略。

## 新的公共 API

- `TargetSelection.exclude`：作为 `TargetSelection` 的排除块，或 `None`。`TargetSelection.has_any_target` 不查看它，因此只有排除块的目标不会指向任何内容。
- `target.async_extract_excluded_entity_ids(hass, target_selection)`：排除块匹配的实体 ID。
- `cv.TARGET_ID_KEYS`：选择目标所指内容的键。当您要求至少一个目标时，请使用它们而不是 `cv.ENTITY_SERVICE_FIELDS` 的键，例如 `probatio.AtLeastOne(*cv.TARGET_ID_KEYS)`。这样，只有排除块的目标就不会通过。
- `cv.TARGET_ID_FIELDS`：没有 `exclude` 的目标字段。

详细信息请参阅 [实体操作](/core/integrations/actions/#entity-actions) 和 [触发器与条件](/core/integrations/triggers-and-conditions/#targets-and-exclusions)。背景信息请参阅 [核心拉取请求 #187290](https://github.com/home-assistant/core/pull/187290)。
