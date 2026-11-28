---
title: "遮阳实体可以描述其倾斜位置"
description: "Home Assistant Core 2026.12 新增了四个可选的遮阳属性，用于说明百叶板在何处开启、在何处关闭以及其角度。"
date: 2026-11-25
authors:
  - Paul Bottein
areas:
  - core
---

自 Home Assistant Core 2026.12 起，`CoverEntity` 新增了四个可选的属性，用于描述遮阳的倾斜位置含义：`open_tilt_position`、`closed_tilt_positions`、`tilt_start_angle` 和 `tilt_end_angle`。

倾斜位置是一个从 0 到 100 的数字，文档规定 0 为关闭，100 为开启。许多遮阳并非如此工作。很多百叶窗的百叶板会旋转 180°，因此它们在 0 和 100 处都是关闭的，而在 50 处是开启的。实体上没有任何信息说明这一点。前端和 Alexa 假设百叶板在 100 处开启，而 HomeKit 桥接器假设它们在 50 处开启。它们将在后续版本中读取这些新属性。

如果你的集成未设置任何新属性，遮阳的行为不会改变：它在 100 处开启，在 0 处关闭。如果它支持 `SET_TILT_POSITION`，其状态将获得 `open_tilt_position` 和 `closed_tilt_positions` 属性，因此你测试中的状态快照会发生变化。

## 新属性

`open_tilt_position` 是百叶板开启时的倾斜位置，即 `open_cover_tilt` 将其移动到的位置。

`closed_tilt_positions` 是百叶板关闭时的倾斜位置列表：0、100 或两者。`close_cover_tilt` 将百叶板移动到最关闭的位置。当 0 和 100 都包含时，你的集成决定其含义：如果一端遮挡更多光线，则在该端关闭。如果两端关闭程度相同，它可以保持已知关闭的百叶板不动，或始终关闭到同一端。如果倾斜位置仅为假设，它仍会关闭。

`tilt_start_angle` 和 `tilt_end_angle` 是倾斜位置 0 和 100 处百叶板的角度，范围从 -90 到 90 度。0° 表示百叶板垂直于遮阳，而在 -90° 和 90° 时，百叶板平躺在遮阳平面内。两者必须同时设置或都不设置。

当你仅设置角度时，Home Assistant 会计算出位置：遮阳在角度最接近 0° 处开启，在百叶板最平躺处关闭。

一个在刻度中间开启的百叶窗：

```python
class MyBlind(CoverEntity):
    _attr_supported_features = (
        CoverEntityFeature.OPEN_TILT
        | CoverEntityFeature.CLOSE_TILT
        | CoverEntityFeature.SET_TILT_POSITION
    )
    _attr_open_tilt_position = 50
    _attr_closed_tilt_positions = [0, 100]
```

一个知道其百叶板角度的百叶窗。它在 50 处开启，此时角度为 0°，在 0 和 100 处关闭：

```python
class MyBlind(CoverEntity):
    _attr_supported_features = (
        CoverEntityFeature.OPEN_TILT
        | CoverEntityFeature.CLOSE_TILT
        | CoverEntityFeature.SET_TILT_POSITION
    )
    _attr_tilt_start_angle = -90
    _attr_tilt_end_angle = 90
```

## Home Assistant 中的变化

- 支持 `SET_TILT_POSITION` 的遮阳将获得 `open_tilt_position` 和 `closed_tilt_positions` 属性，除非集成另有说明，否则它们分别为 100 和 `[0]`。当集成同时设置两个角度时，会添加 `tilt_start_angle` 和 `tilt_end_angle` 属性。
- `toggle_tilt` 在百叶板处于关闭位置时将其开启，否则将其关闭。以前它只在 0 处开启。
- 存储倾斜位置的场景仍会将百叶板移动到该位置。仅表示开启或关闭的场景仍会开启或关闭倾斜。只能设置倾斜位置的遮阳会被移动到开启位置或第一个关闭位置，而以前使用 100 和 0。

## 采用这些属性

当你的集成开始设置这些属性时，`toggle_tilt`、场景以及后续的前端和语音助手将在新的开启位置（而非 100）开启百叶板。这会改变用户看到的内容，因此请将拉取请求标记为[向后不兼容更改](/releases/guides/backward-incompatible-changes/)：勾选 **Breaking change** 并填写拉取请求描述中的 **Breaking change** 部分。该部分将进入发布说明。在同一拉取请求中，让 `open_cover_tilt` 将百叶板移动到 `open_tilt_position`，并让 `close_cover_tilt` 遵循[遮阳实体文档](/core/entities/cover/#tilt-position)中的规则。

## 检查你的集成是否使用了新名称

如果你的遮阳实体已经有一个名为 `open_tilt_position`、`closed_tilt_positions`、`tilt_start_angle` 或 `tilt_end_angle` 的属性用于其他用途，Home Assistant 现在会将其读取为新属性。如果值不符合预期，会引发 `ValueError`，并且支持 `SET_TILT_POSITION` 的遮阳将不会被添加。请重命名它，或使其返回新属性所期望的值。Hunter Douglas PowerView 集成因此重命名了其自身的 `open_tilt_position`。

如果你的实体覆盖了 `capability_attributes`，请包含 `super().capability_attributes`，否则新属性将被遗漏。

更多详细信息请参阅[遮阳实体文档](/core/entities/cover/#tilt-position)。
