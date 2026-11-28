# 开关

> 开关（switch）、切换辅助元素（toggle helper）或警报器（siren）的更多信息视图，围绕一个大的开/关切换开关构建。

Source: https://www.hasscn.top/contributors/design/more-info/switch/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="switch.desk_plug"></ha-demo-more-info>
<ha-demo-more-info entity="input_boolean.guest_mode"></ha-demo-more-info>
```

## 它显示什么

开关只做一件事：开或关。它的视图是较新视图中最简单的一个：顶部显示状态，下方是一个大的竖直[控制开关](https://www.hasscn.top/contributors/design/components/controls/)，开在顶部。它使用电源图标表示开，使用带斜线的电源图标表示关。

桌面插座是一个开关，它处于开启状态。访客模式是一个切换辅助元素（`input_boolean`），它处于关闭状态。两者显示相同的视图。

## 警报器

警报器使用相同的视图，用扬声器图标表示开，用静音扬声器表示关。当警报器支持音调、音量或持续时间时，切换开关下方的**更多控制**按钮会打开一个视图，您可以在其中选择音调、音量和持续时间，并用它们开启或关闭警报器。

示例之家没有警报器，所以这里没有它的演示。

## 设计说明

- 开关采用状态的颜色，这样您从房间另一头就能看出某样东西是否开启。
- 当集成无法得知真实状态（假定状态）时，开关会变成两个独立的按钮，一个用于开，一个用于关，这样您始终可以发送这两种命令。
- 没有亮度调节的灯和没有风速调节的风扇也使用这个相同的开关作为它们的主要控制，并使用各自的图标。

## 代码层面

这些视图是 `more-info-switch`、`more-info-input_boolean` 和 `more-info-siren`，位于 [`src/dialogs/more-info/controls/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/controls) 中。它们共享来自 [`src/state-control/ha-state-control-toggle.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-control/ha-state-control-toggle.ts) 的 `ha-state-control-toggle`，并向其传递开和关的图标。高级警报器控件位于 [`src/dialogs/more-info/components/siren/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components/siren) 中，`SirenEntityFeature` 枚举位于 [`src/data/feature/siren_entity_feature.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/feature/siren_entity_feature.ts) 中。

源码：[`more-info-switch.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-switch.ts)
