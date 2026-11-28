# 状态图标

> Home Assistant 如何根据实体的状态选择图标和颜色。

Source: https://www.hasscn.top/contributors/design/components/state-icon/

Live demo of `state-badge`, connected to a demo Home Assistant.

```html
<state-badge data-props='{"stateObj": {"entity_id": "light.living_room_lamp", "state": "on", "attributes": {"friendly_name": "Floor lamp", "brightness": 120, "color_mode": "hs", "hs_color": [32, 60], "rgb_color": [255, 170, 102]}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge data-props='{"stateObj": {"entity_id": "light.kitchen_ceiling", "state": "off", "attributes": {"friendly_name": "Kitchen ceiling"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "climate.thermostat", "state": "heat", "attributes": {"friendly_name": "Thermostat", "hvac_action": "heating", "current_temperature": 20.5, "temperature": 21}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "binary_sensor.front_door", "state": "on", "attributes": {"friendly_name": "Front door", "device_class": "door"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "cover.bedroom_blinds", "state": "open", "attributes": {"friendly_name": "Bedroom blinds", "current_position": 70, "device_class": "blind"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "person.alex", "state": "home", "attributes": {"friendly_name": "Alex"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "switch.desk_plug", "state": "unavailable", "attributes": {"friendly_name": "Desk plug"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
```

## 概述

Home Assistant 中的每个实体（entity）都有一个图标，图标会跟随其状态（state）变化。门窗传感器在门打开时显示一扇打开的门，在门关闭时显示一扇关闭的门。点亮的灯可以显示其颜色和亮度。人们通过这些图标来了解家中设备的状态，往往在阅读任何文字之前就已经看到了。

完成这项工作的是两个组件：

- **状态图标（state icon）**根据实体的状态为其选择图标。它本身没有颜色。
- **状态徽章（state badge）**将该图标放入一个 40px 的圆形徽章中，并添加颜色。它出现在实体行的开头、更多信息对话框的标题栏、选择器以及许多其他地方。

## 何时使用

在以下情况使用它们：

- 任何需要带图标显示实体的地方

不要在以下情况使用它们：

- 与实体无关的图标。请使用普通图标。
- 紧凑胶囊形中带标签的数值。请使用[徽章（badge）](https://www.hasscn.top/contributors/design/components/badge/)，并将状态图标放在其 `icon` 插槽中。

## 结构

1. **徽章**：状态徽章的 40px 容器，默认为圆形。当实体有图片时，会将图片显示为背景。
2. **图标**：其中的状态图标，由徽章着色。当显示图片时会被隐藏。

## 变体

### 仅图标或徽章

状态图标只是图标本身，使用周围环境的颜色。状态徽章则增加了 40px 容器、状态颜色和图片。

### 颜色

默认情况下只有灯会着色。开启状态颜色后，其他实体也会获得状态颜色。使用主题颜色或其他任何颜色时，实体处于活动状态时会使用该颜色。关闭颜色后，任何内容都不会着色。参见[颜色的选取方式](https://www.hasscn.top/contributors/design/components/state-icon/#how-the-color-is-picked)。

## 行为

### 图标的选取方式

状态图标会依次执行以下步骤，并使用找到的第一个图标：

1. 组件自身设置的图标，例如来自卡片配置。
2. 用户在实体设置中为实体设置的图标。
3. 实体状态中的 icon 属性。
4. 集成（integration）在其图标翻译中为该实体和状态定义的图标。
5. 少数域（domain）的内置图标，这些域的图标不仅取决于状态，例如太阳、更新和设备追踪器。
6. 该域针对此设备类别（device class）和状态的默认图标。例如，具有 `door` 设备类别的二进制传感器在打开和关闭时有不同的图标。
7. 当其他都不匹配时，使用该域的回退图标，未知域则使用书签图标。

步骤 4 和 6 中的图标来自 Home Assistant，会按需加载。在加载完成之前，组件不会显示任何内容。

你可以请求显示实体当前不处于的某个状态的图标。更多信息对话框中的盖子（cover）切换开关就是这样为其打开和关闭按钮工作的：它显示盖子在按钮将要设置的状态下的图标。

Live demo of `ha-state-icon`, connected to a demo Home Assistant. 同一个盖子实体，分别按原样、按关闭状态，以及设置了组件图标来显示。

```html
<ha-state-icon data-props='{"stateObj": {"entity_id": "cover.bedroom_blinds", "state": "open", "attributes": {"friendly_name": "Bedroom blinds", "current_position": 70, "device_class": "blind"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></ha-state-icon>
<ha-state-icon data-props='{"stateObj": {"entity_id": "cover.bedroom_blinds", "state": "open", "attributes": {"friendly_name": "Bedroom blinds", "current_position": 70, "device_class": "blind"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}, "stateValue": "closed"}'></ha-state-icon>
<ha-state-icon icon="mdi:sofa" data-props='{"stateObj": {"entity_id": "cover.bedroom_blinds", "state": "open", "attributes": {"friendly_name": "Bedroom blinds", "current_position": 70, "device_class": "blind"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></ha-state-icon>
```

### 颜色的选取方式

默认情况下，状态徽章只为灯着色。其他所有实体无论处于什么状态，都使用默认图标颜色。开启状态颜色后，其他实体也会按状态着色。在用户配置卡片或行的地方，可以通过**显示状态颜色（Show state color）**选项进行选择。

Live demo of `state-badge`, connected to a demo Home Assistant. 相同的实体，分别在不开启和开启状态颜色的情况下显示。

```html
<state-badge data-props='{"stateObj": {"entity_id": "binary_sensor.front_door", "state": "on", "attributes": {"friendly_name": "Front door", "device_class": "door"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge data-props='{"stateObj": {"entity_id": "person.alex", "state": "home", "attributes": {"friendly_name": "Alex"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge data-props='{"stateObj": {"entity_id": "climate.thermostat", "state": "heat", "attributes": {"friendly_name": "Thermostat", "hvac_action": "heating", "current_temperature": 20.5, "temperature": 21}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "binary_sensor.front_door", "state": "on", "attributes": {"friendly_name": "Front door", "device_class": "door"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "person.alex", "state": "home", "attributes": {"friendly_name": "Alex"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="state" data-props='{"stateObj": {"entity_id": "climate.thermostat", "state": "heat", "attributes": {"friendly_name": "Thermostat", "hvac_action": "heating", "current_temperature": 20.5, "temperature": 21}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
```

开启状态颜色后，颜色来自主题。对于每个实体，徽章会按以下顺序查找主题定义的最具体的颜色：

1. `--state-<domain>-<device class>-<state>-color`，例如 `--state-binary_sensor-door-on-color`。
2. `--state-<domain>-<state>-color`，例如 `--state-person-home-color`。
3. `--state-<domain>-active-color` 或 `--state-<domain>-inactive-color`。
4. `--state-active-color` 或 `--state-inactive-color`。

一个状态是否算作活动状态取决于域：on、open、home 和 playing 是活动状态。off、closed、not_home 和 locked 则不是。非活动实体在徽章中保持默认图标颜色。只有具有状态颜色的域才会着色；例如传感器（sensor）保持默认颜色。电池传感器是例外：它们的颜色跟随电池电量变化。

除此之外：

- 有颜色的灯会显示该颜色，调暗的灯会显示更深的图标。
- 温控器（thermostat）采用它当前正在执行的操作的颜色，例如制热或制冷，而不是其设置模式的颜色。
- 不可用（unavailable）的实体会以不可用颜色显示，无论其属于哪个域。如果设置了自定义颜色，或未开启状态颜色，则保持默认颜色。

Live demo of `state-badge`, connected to a demo Home Assistant. 全亮度的灯、带颜色的调暗的灯，以及关闭的灯。

```html
<state-badge data-props='{"stateObj": {"entity_id": "light.living_room_lamp", "state": "on", "attributes": {"friendly_name": "Floor lamp", "brightness": 255, "color_mode": "brightness"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge data-props='{"stateObj": {"entity_id": "light.living_room_lamp", "state": "on", "attributes": {"friendly_name": "Floor lamp", "brightness": 120, "color_mode": "hs", "hs_color": [32, 60], "rgb_color": [255, 170, 102]}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge data-props='{"stateObj": {"entity_id": "light.kitchen_ceiling", "state": "off", "attributes": {"friendly_name": "Kitchen ceiling"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
```

除了状态颜色之外，徽章还可以使用单一颜色，例如主题颜色（如红色或 primary），或任何 CSS 颜色。实体处于活动状态时使用该颜色，非活动状态时使用默认颜色。颜色也可以完全关闭，包括灯在内。

Live demo of `state-badge`, connected to a demo Home Assistant. 一个设置了自定义颜色的开关，分别为开和关。

```html
<state-badge color="red" data-props='{"stateObj": {"entity_id": "switch.desk_plug", "state": "on", "attributes": {"friendly_name": "Desk plug"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
<state-badge color="red" data-props='{"stateObj": {"entity_id": "switch.desk_plug", "state": "off", "attributes": {"friendly_name": "Desk plug"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
```

### 图片

当实体有图片时，例如带个人资料头像的人员或带专辑封面的媒体播放器，状态徽章会显示图片而不是图标。媒体播放器和摄像头使用轻微圆角，其他图片为圆形。更新（update）实体使用直角。在徽章上设置的图标优先于图片。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 徽章尺寸 | 40px × 40px | 无 |
| 徽章圆角半径 | 50%，圆形 | `--state-badge-border-radius` |
| 有实体图片时的圆角半径 | 50% | `--state-badge-with-image-border-radius` |
| 媒体播放器或摄像头的圆角半径 | 8% | `--state-badge-with-media-image-border-radius` |
| 更新实体的圆角半径 | 0 | `--ha-border-radius-square` |
| 图标尺寸 | 24px | `--mdc-icon-size` |
| 默认图标颜色 | 由主题设置 | `--state-icon-color` |
| 颜色和亮度变化 | 0.3s，ease-in-out | 无 |
| 徽章无内容可显示时的图标 | `#fce588` 颜色的警告图标 | 无 |

## 指南

Do and don't, as live demos. Both are connected to a demo Home Assistant.

**Do:** 让状态徽章自行选择图标，使其跟随状态变化。

```html
<state-badge color="state" data-props='{"stateObj": {"entity_id": "binary_sensor.front_door", "state": "on", "attributes": {"friendly_name": "Front door", "device_class": "door"}, "last_changed": "2026-01-01T00:00:00Z", "last_updated": "2026-01-01T00:00:00Z", "context": {"id": "1", "parent_id": null, "user_id": null}}}'></state-badge>
```

**Don't:** 根据域或状态自己挑选图标。

```html
<ha-svg-icon path="M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z"></ha-svg-icon>
```

- 每当显示实体时都使用这些组件。如果自己挑选图标，会跳过用户或集成设置的图标，而且图标不会随状态变化。
- 在用户配置卡片或行的地方，让他们通过**显示状态颜色（Show state color）**选项选择状态颜色。

## 无障碍

### 焦点

状态徽章本身不可聚焦。当其周围的页面使其可聚焦时，它会显示 2px 的分隔线颜色边框，或者在显示图标时显示分隔线颜色的背景。

### 屏幕阅读器

图标不会为屏幕阅读器提供额外信息，因此状态必须以文本形式出现在附近，例如实体行中的状态。状态图标可以在悬停时以原生工具提示（tooltip）的形式显示格式化后的状态。

### 代码层面

- 图标内的 SVG 对屏幕阅读器隐藏。
- 使用 `state-title` 时，`ha-state-icon` 会将格式化后的状态作为其 `title`。
- `state-badge` 没有角色（role）。

## 相关内容

- [徽章（Badge）](https://www.hasscn.top/contributors/design/components/badge/)：仪表盘（dashboard）徽章，会显示状态图标
- [实体选择器（Entity picker）](https://www.hasscn.top/contributors/design/components/entity-picker/)：为其实体显示状态图标
- [颜色（Color）](https://www.hasscn.top/contributors/design/foundations/color/)：状态颜色背后的主题颜色

## 代码实现

### state-badge

元素为 `<state-badge>`。

```ts
html`<state-badge .stateObj=${stateObj} color="state"></state-badge>`
```

属性（attributes）：

- `color`：`state` 表示按状态着色，`none` 表示不着色，或使用主题颜色或 CSS 颜色在实体活动时显示。不设置时，只有灯会着色。

以下只能作为属性（properties）设置：

- `stateObj`：实体的状态对象。
- `overrideIcon`：图标名称，例如 `mdi:sofa`，用于替代实体的图标。
- `overrideImage`：图片 URL，用于替代图标或实体图片。
- `stateColor`：设置颜色的旧方式，取值为 `true` 或 `false`。`color` 优先于它。

没有 `stateObj`、`overrideIcon` 或 `overrideImage` 时，徽章会显示一个黄色警告图标。

样式：

- `--state-icon-color`：默认图标颜色。由主题设置。
- `--state-badge-border-radius`：默认为 `50%`。
- `--state-badge-with-image-border-radius`：用于实体图片。默认为 `50%`。
- `--state-badge-with-media-image-border-radius`：用于媒体播放器或摄像头图片。默认为 `8%`。

徽章尺寸为 40 × 40 像素。设置 `width` 和 `height` 可以更改。

源码：[`src/components/entity/state-badge.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/entity/state-badge.ts)

### ha-state-icon

元素为 `<ha-state-icon>`。它像任何图标一样，使用周围环境的颜色。

```ts
html`<ha-state-icon .stateObj=${stateObj}></ha-state-icon>`
html`<ha-state-icon .stateObj=${stateObj} .stateValue=${"closed"}></ha-state-icon>`
```

属性（attributes）：

- `icon`：图标名称，例如 `mdi:sofa`，用于替代实体的图标。
- `state-title`：将图标的标题设置为格式化后的状态，使其显示为原生工具提示。

以下只能作为属性（properties）设置：

- `stateObj`：实体的状态对象。
- `stateValue`：要显示图标的状态，替代实体的当前状态。

样式：

- `--mdc-icon-size`：图标尺寸。默认为 `24px`。

源码：[`src/components/ha-state-icon.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-state-icon.ts)
