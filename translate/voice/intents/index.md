# 内置意图（intent）

> Home Assistant 开箱即用所能理解的每一个意图，包括其槽位（slot）、槽位组合以及处理它的集成。

Source: https://www.hasscn.top/contributors/translate/voice/intents/

[意图](https://www.hasscn.top/contributors/glossary/intent/)（intent）是一句话的含义，以 Home Assistant 可以据此行动的形式表达。本页面列出了在 [intents 仓库](https://github.com/OHF-Voice/intents)中拥有句子的每一个意图，因此可以在覆盖它的每种语言中使用。

此列表的来源是 intents 仓库中的 [`intents.yaml`](https://github.com/OHF-Voice/intents/blob/main/intents.yaml)。这是本站上唯一一份完整列表。处理这些意图的代码位于 Home Assistant Core 中：[Core 中的内置意图](https://www.hasscn.top/contributors/core/internals/built-in-intents/)展示了每个处理器的位置，[意图](https://www.hasscn.top/contributors/core/internals/intents/)则说明了如何编写处理器或从你自己的代码中触发意图。

## 如何阅读本页面

每个意图列出了：

- **槽位（slot）**：句子可以填入的信息片段，比如设备的 `name` 或它所在的 `area`。标记为必需的槽位必须被填入，意图才能工作。
- **响应变量**：响应模板可以使用的额外值，除 `slots` 之外。参见[响应](https://www.hasscn.top/contributors/translate/voice/template-syntax/#responses)。
- **槽位组合**：句子可以填入的槽位集合，每个组合附有一个英文示例。句子和测试按槽位组合组织。“卫星区域”（satellite area）表示该区域不是通过语音说出的：它来自听到这句话的语音卫星（voice satellite）。

槽位组合的重要性表示一种语言对它的需求程度：`required`（最低要求，没有它验证会失败）、`usable`（人们所期望的）、`complete`（完整覆盖所必需的）或 `optional`（额外的）。对于通过 `name` 或推断出的 `domain` 来定位实体的组合，重要性按实体域（domain）分别设置。表格显示的是其所有域中的最高级别。[`intents.yaml`](https://github.com/OHF-Voice/intents/blob/main/intents.yaml) 中有完整的细节。

`name`、`area` 和 `floor` 是根据用户 Home Assistant 中实际存在的内容填入的：他们已暴露的实体（entity）的名称、他们的区域（area）以及他们的楼层。

## 设备和实体

### HassTurnOn

打开一个设备或实体。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `domain` | 否 | 目标设备或实体的域 |
| `device_class` | 否 | 目标设备或实体的设备类别 |

<details>
<summary>槽位组合（12）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `domain_only` | `domain` (satellite area) | required | turn on the lights in here |
| `name_only` | `name` | required | turn on the overhead light |
| `area_domain` | `area`, `domain` | required | turn on the lights in the kitchen |
| `floor_domain` | `floor`, `domain` | optional | turn on the lights on the first floor |
| `device_class_cover` | `domain`, `device_class` (satellite area) | complete | open the windows in here |
| `name_area` | `name`, `area` | complete | turn on the overhead light in the kitchen |
| `name_floor` | `name`, `floor` | optional | turn on the overhead light on the first floor |
| `name_script` | `name` | complete | run party time script |
| `name_scene` | `name` | complete | activate mood lighting scene |
| `name_area_scene` | `name`, `area` | complete | activate mood lighting scene in the living room |
| `area_device_class_cover` | `area`, `domain`, `device_class` | complete | open the curtains in the living room |
| `floor_device_class_cover` | `floor`, `domain`, `device_class` | optional | open the curtains on the first floor |

</details>

### HassTurnOff

关闭一个设备或实体。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `domain` | 否 | 目标设备或实体的域 |
| `device_class` | 否 | 目标设备或实体的设备类别 |

<details>
<summary>槽位组合（10）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `domain_only` | `domain` (satellite area) | required | turn off the lights in here |
| `name_only` | `name` | required | turn off the overhead light |
| `area_domain` | `area`, `domain` | required | turn off the lights in the kitchen |
| `floor_domain` | `floor`, `domain` | optional | turn off the lights on the first floor |
| `device_class_cover` | `domain`, `device_class` (satellite area) | complete | close the windows in here |
| `name_area` | `name`, `area` | complete | turn off the overhead light in the kitchen |
| `name_floor` | `name`, `floor` | optional | turn off the overhead light on the first floor |
| `area_device_class_cover` | `area`, `domain`, `device_class` | complete | close the curtains in the living room |
| `floor_device_class_cover` | `floor`, `domain`, `device_class` | optional | close the curtains on the first floor |
| `domain_all` | `domain` | optional | turn off all the lights in the house |

</details>

### HassGetState

获取或检查实体的状态。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `domain` | 否 | 目标设备或实体的域 |
| `device_class` | 否 | 目标设备或实体的设备类别 |
| `state` | 否 | 要匹配的状态名称 |

响应变量：`state`（第一个匹配实体的状态）、`query.matched`（匹配查询和状态名称的状态列表）、`query.unmatched`（匹配除状态名称之外所有条件的状态列表）。

<details>
<summary>槽位组合（12）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_only` | `name` | complete | what is the outside temperature |
| `name_state` | `name`, `state` | complete | is the sliding door open |
| `name_state_area` | `name`, `state`, `area` | complete | is the garage door open in the garage |
| `name_state_floor` | `name`, `state`, `floor` | complete | is the bedroom window open on the second floor |
| `name_where` | `name` | complete | where is jane |
| `name_zone` | `name`, `state` | complete | is jane home |
| `domain_state` | `domain`, `state` | complete | are all the lights off |
| `domain_state_area` | `area`, `domain`, `state` | complete | which lights are on in the kitchen |
| `domain_state_floor` | `floor`, `domain`, `state` | complete | are all the lights off on the first floor |
| `device_class_state` | `domain`, `device_class`, `state` | complete | are all the windows closed |
| `device_class_state_area` | `area`, `domain`, `device_class`, `state` | complete | are all the windows closed in the bedroom |
| `device_class_state_floor` | `floor`, `domain`, `device_class`, `state` | complete | are all the windows closed on the second floor |

</details>

### HassSetPosition

设置实体的位置。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `domain` | 否 | 目标设备或实体的域 |
| `device_class` | 否 | 目标设备或实体的设备类别 |
| `position` | 是 | 0 到 100 之间的位置 |

<details>
<summary>槽位组合（6）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_only` | `name`, `position` | complete | set curtain left to 50% |
| `device_class` | `domain`, `device_class`, `position` (satellite area) | complete | set the curtains to 50% |
| `area_device_class` | `area`, `domain`, `device_class`, `position` | complete | set the curtains to 50% in the bedroom |
| `name_area` | `name`, `area`, `position` | optional | set the curtain left in the living room to 50% |
| `name_floor` | `name`, `floor`, `position` | optional | set the curtain left on the main floor to 50% |
| `floor_device_class` | `floor`, `domain`, `device_class`, `position` | optional | set the curtains on the main floor to 50% |

</details>

## 对话

### HassNevermind

什么都不做。用于取消一个请求。由 `intent` 集成处理。

此意图没有槽位。

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | nevermind |

</details>

### HassRespond

返回响应但不执行任何操作。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `response` | 否 | 用于响应的文本 |

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | optional | hello |

</details>

### HassBroadcast

在其他卫星上播报一条消息。由 `assist_satellite` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `message` | 是 | 要播报的消息 |

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `message_only` | `message` | optional | broadcast that dinner is ready |

</details>

## 日期和时间

### HassGetCurrentDate

获取当前日期。由 `intent` 集成处理。

此意图没有槽位。

响应变量：`date`（包含日、月、年的日期对象）。

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | what is the date |

</details>

### HassGetCurrentTime

获取当前时间。由 `intent` 集成处理。

此意图没有槽位。

响应变量：`time`（包含时、分、秒的时间对象）。

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | what time is it |

</details>

## 灯光和风扇

### HassLightSet

设置灯光的亮度或颜色。由 `light` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `domain` | 否 | 目标设备或实体的域 |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `brightness` | 否 | 0 到 100 之间的亮度百分比 |
| `color` | 否 | 颜色的名称 |
| `temperature` | 否 | 1000 到 10000 开尔文之间的色温 |

<details>
<summary>槽位组合（12）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_brightness` | `name`, `brightness` | usable | set the overhead light brightness to 50% |
| `name_color` | `name`, `color` | usable | set the overhead light to red |
| `name_temperature` | `name`, `temperature` | usable | set the overhead light color temperature to 2700 Kelvin |
| `brightness_only` | `brightness`, `domain` (satellite area) | complete | set the brightness in here to 50% |
| `area_brightness` | `area`, `brightness`, `domain` | complete | set the living room brightness to 50% |
| `floor_brightness` | `floor`, `brightness`, `domain` | complete | set the main floor brightness to 50% |
| `color_only` | `color`, `domain` (satellite area) | complete | set the lights in here to red |
| `area_color` | `area`, `color`, `domain` | complete | set the living room to red |
| `floor_color` | `floor`, `color`, `domain` | complete | set the main floor to red |
| `temperature_only` | `temperature`, `domain` (satellite area) | complete | set the light color temperature in here to 2700 Kelvin |
| `area_temperature` | `area`, `temperature`, `domain` | complete | set the living room light color temperature to 2700 Kelvin |
| `floor_temperature` | `floor`, `temperature`, `domain` | complete | set the main floor color temperature to 2700 Kelvin |

</details>

### HassFanSetSpeed

设置风扇的速度。由 `fan` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `percentage` | 是 | 0 到 100 之间的速度百分比 |

<details>
<summary>槽位组合（4）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | `percentage` (satellite area) | complete | set fans to 50% |
| `name_only` | `name`, `percentage` | complete | set ceiling fan to 50% |
| `area_only` | `area`, `percentage` | complete | set kitchen fans to 50% |
| `floor_only` | `floor`, `percentage` | complete | set first floor fans to 50% |

</details>

## 温控和天气

### HassClimateSetTemperature

设置期望的室内温度。由 `climate` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `temperature` | 是 | 以度为单位的温度 |

<details>
<summary>槽位组合（4）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `temperature_only` | `temperature` (satellite area) | complete | set the temperature to 30 degrees |
| `name_temperature` | `name`, `temperature` | complete | set the EcoBee to 30 degrees |
| `area_temperature` | `area`, `temperature` | complete | set the bedroom temperature to 30 degrees |
| `floor_temperature` | `floor`, `temperature` | complete | set the temperature of the main floor to 30 degrees |

</details>

### HassClimateGetTemperature

获取实际的室内温度，而不是 `HassClimateSetTemperature` 设置的目标温度。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |

响应变量：`state`（包含温度的实体的状态）。

<details>
<summary>槽位组合（4）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 (satellite area) | usable | what is the temperature |
| `name_only` | `name` | usable | what is the temperature of the EcoBee |
| `area_only` | `area` | usable | what is the temperature in the bedroom |
| `floor_only` | `floor` | complete | what is the temperature downstairs |

</details>

### HassClimateSetFanMode

设置温控设备的风扇模式。由 `climate` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |
| `fan_mode` | 是 | 要设置的风扇模式 |

<details>
<summary>槽位组合（4）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `fan_mode_only` | `fan_mode` (satellite area) | complete | set the fan mode to auto |
| `name_fan_mode` | `name`, `fan_mode` | complete | set the EcoBee fan to auto |
| `area_fan_mode` | `area`, `fan_mode` | complete | set the bedroom fan mode to low |
| `floor_fan_mode` | `floor`, `fan_mode` | complete | set the fan mode on the first floor to low |

</details>

### HassGetWeather

获取当前天气。由 `weather` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 要使用的天气实体的名称 |

响应变量：`state`（包含天气的实体的状态）。

<details>
<summary>槽位组合（2）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | what is the weather |
| `name_only` | `name` | usable | what is the weather in New York |

</details>

## 列表

### HassShoppingListAddItem

向购物清单添加一个条目。由 `shopping_list` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `item` | 是 | 要添加的条目 |

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `item_only` | `item` | optional | add apples to my shopping list |

</details>

### HassShoppingListCompleteItem

勾选购物清单中的一个条目。由 `shopping_list` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `item` | 是 | 要勾选的条目 |

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `item_only` | `item` | optional | check off apples from my shopping list |

</details>

### HassListAddItem

向待办清单添加一个条目。由 `todo` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `item` | 是 | 要添加的条目 |
| `name` | 是 | 清单的名称 |

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_item` | `item`, `name` | complete | add apples to my shopping list |

</details>

### HassListCompleteItem

勾选待办清单中的一个条目。由 `todo` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `item` | 是 | 要勾选的条目 |
| `name` | 是 | 清单的名称 |

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_item` | `item`, `name` | complete | check off take out the trash from my chores list |

</details>

### HassListRemoveItem

从待办清单中移除一个条目。由 `todo` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `item` | 是 | 要移除的条目 |
| `name` | 是 | 清单的名称 |

<details>
<summary>槽位组合（1）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_item` | `item`, `name` | complete | remove take out the trash from my chores list |

</details>

## 媒体

### HassMediaPause

暂停一个媒体播放器。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |

<details>
<summary>槽位组合（3）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 (satellite area) | usable | pause |
| `name_only` | `name` | usable | pause TV |
| `area_only` | `area` | usable | pause music in kitchen |

</details>

### HassMediaUnpause

恢复播放一个媒体播放器。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |

<details>
<summary>槽位组合（3）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 (satellite area) | usable | resume |
| `name_only` | `name` | usable | resume TV |
| `area_only` | `area` | usable | resume music in kitchen |

</details>

### HassMediaNext

将媒体播放器跳到下一个条目。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |

<details>
<summary>槽位组合（3）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 (satellite area) | usable | next track |
| `name_only` | `name` | usable | next track on the stereo |
| `area_only` | `area` | usable | next track in the kitchen |

</details>

### HassMediaPrevious

将媒体播放器跳回上一个条目。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |

<details>
<summary>槽位组合（3）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 (satellite area) | complete | previous track |
| `name_only` | `name` | complete | previous track on the stereo |
| `area_only` | `area` | complete | previous track in the kitchen |

</details>

### HassSetVolume

设置媒体播放器的音量。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `volume_level` | 是 | 0 到 100 之间的音量级别 |

<details>
<summary>槽位组合（3）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | `volume_level` (satellite area) | complete | set volume to 50% |
| `name_only` | `name`, `volume_level` | complete | set TV volume to 50% |
| `area_only` | `area`, `volume_level` | complete | set volume in kitchen to 50% |

</details>

### HassSetVolumeRelative

增大或减小媒体播放器的音量。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `volume_step` | 是 | up、down，或 -100 到 100 之间要改变的百分比 |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |

<details>
<summary>槽位组合（4）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | `volume_step` (satellite area) | complete | increase volume |
| `name_only` | `volume_step`, `name` | complete | decrease TV volume |
| `area_only` | `volume_step`, `area` | complete | decrease volume in kitchen |
| `floor_only` | `volume_step`, `floor` | complete | increase volume on first floor |

</details>

### HassMediaPlayerMute

静音一个媒体播放器。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |

<details>
<summary>槽位组合（2）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 (satellite area) | complete | mute |
| `name_only` | `name` | complete | mute the TV |

</details>

### HassMediaPlayerUnmute

取消静音一个媒体播放器。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |

<details>
<summary>槽位组合（2）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 (satellite area) | complete | unmute |
| `name_only` | `name` | complete | unmute the TV |

</details>

### HassMediaSearchAndPlay

搜索一个媒体条目并播放它。由 `media_player` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `search_query` | 是 | 要搜索并播放的媒体 |
| `media_class` | 否 | 要搜索的媒体类型（album、app、artist、channel、composer、contributing_artist、directory、episode、game、genre、image、movie、music、playlist、podcast、season、track、tv_show、url、video） |

响应变量：`media`（匹配到的媒体条目，作为一个 `BrowseMedia` 对象，当搜索没有找到任何内容时为 `None`）。

<details>
<summary>槽位组合（8）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | `search_query` (satellite area) | optional | play Pink Floyd |
| `name_only` | `name`, `search_query` | optional | play Pink Floyd on Sonos Speakers |
| `area_only` | `area`, `search_query` | optional | play Pink Floyd in the Living Room |
| `name_area` | `name`, `area`, `search_query` | optional | play Pink Floyd on the Sonos Speakers in the Living Room |
| `media_class_only` | `search_query`, `media_class` (satellite area) | optional | play Pink Floyd playlist |
| `name_media_class` | `name`, `search_query`, `media_class` | optional | play Pink Floyd album on Sonos Speakers |
| `area_media_class` | `area`, `search_query`, `media_class` | optional | play Pink Floyd movie in the Living Room |
| `name_area_media_class` | `name`, `area`, `search_query`, `media_class` | optional | play Pink Floyd podcast on the Sonos Speakers in the Living Room |

</details>

## 定时器

### HassStartTimer

启动一个定时器。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `hours` | 否 | 小时数 |
| `minutes` | 否 | 分钟数 |
| `seconds` | 否 | 秒数 |
| `name` | 否 | 附加到定时器的名称 |
| `conversation_command` | 否 | 定时器结束时执行的命令 |

<details>
<summary>槽位组合（21）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `hours_only` | `hours` | usable | set a timer for 1 hour |
| `minutes_only` | `minutes` | usable | set a timer for 10 minutes |
| `seconds_only` | `seconds` | usable | set a timer for 30 seconds |
| `hours_minutes` | `hours`, `minutes` | complete | set a timer for 1 hour and 10 minutes |
| `hours_seconds` | `hours`, `seconds` | complete | set a timer for 1 hour and 30 seconds |
| `minutes_seconds` | `minutes`, `seconds` | complete | set a timer for 10 minutes and 30 seconds |
| `hours_minutes_seconds` | `hours`, `minutes`, `seconds` | complete | set a timer for 1 hour 10 minutes and 30 seconds |
| `name_hours` | `name`, `hours` | complete | set a timer for 1 hour named pizza |
| `name_minutes` | `name`, `minutes` | complete | set a timer for 10 minutes named pizza |
| `name_seconds` | `name`, `seconds` | complete | set a timer for 30 seconds named pizza |
| `name_hours_minutes` | `name`, `hours`, `minutes` | complete | set a timer for 1 hour and 10 minutes named pizza |
| `name_hours_seconds` | `name`, `hours`, `seconds` | complete | set a timer for 1 hour and 30 seconds named pizza |
| `name_minutes_seconds` | `name`, `minutes`, `seconds` | complete | set a timer for 10 minutes and 30 seconds named pizza |
| `name_hours_minutes_seconds` | `name`, `hours`, `minutes`, `seconds` | complete | set a timer for 1 hour 10 minutes and 30 seconds named pizza |
| `command_hours` | `conversation_command`, `hours` | optional | turn off the lights in 1 hour |
| `command_minutes` | `conversation_command`, `minutes` | optional | turn off the lights in 10 minutes |
| `command_seconds` | `conversation_command`, `seconds` | optional | turn off the lights in 30 seconds |
| `command_hours_minutes` | `conversation_command`, `hours`, `minutes` | optional | turn off the lights in 1 hour and 10 minutes |
| `command_hours_seconds` | `conversation_command`, `hours`, `seconds` | optional | turn off the lights in 1 hour and 30 seconds |
| `command_minutes_seconds` | `conversation_command`, `minutes`, `seconds` | optional | turn off the lights in 10 minutes and 30 seconds |
| `command_hours_minutes_seconds` | `conversation_command`, `hours`, `minutes`, `seconds` | optional | turn off the lights in 1 hour 10 minutes and 30 seconds |

</details>

### HassCancelTimer

取消一个定时器。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `start_hours` | 否 | 定时器启动时设定的小时数 |
| `start_minutes` | 否 | 定时器启动时设定的分钟数 |
| `start_seconds` | 否 | 定时器启动时设定的秒数 |
| `name` | 否 | 附加到定时器的名称 |
| `area` | 否 | 用于启动定时器的设备所在的区域 |

<details>
<summary>槽位组合（6）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | cancel my timer |
| `name_only` | `name` | complete | cancel the pizza timer |
| `area_only` | `area` | complete | cancel the kitchen timer |
| `hours_only` | `start_hours` | usable | cancel the 1 hour timer |
| `minutes_only` | `start_minutes` | usable | cancel the 10 minute timer |
| `seconds_only` | `start_seconds` | usable | cancel the 30 second timer |

</details>

### HassCancelAllTimers

取消所有定时器。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `area` | 否 | 用于启动定时器的设备所在的区域 |

<details>
<summary>槽位组合（2）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | cancel all timers |
| `area_only` | `area` | complete | cancel all timers in the kitchen |

</details>

### HassIncreaseTimer

为定时器增加时间。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `hours` | 否 | 小时数 |
| `minutes` | 否 | 分钟数 |
| `seconds` | 否 | 秒数 |
| `start_hours` | 否 | 定时器启动时设定的小时数 |
| `start_minutes` | 否 | 定时器启动时设定的分钟数 |
| `start_seconds` | 否 | 定时器启动时设定的秒数 |
| `name` | 否 | 附加到定时器的名称 |
| `area` | 否 | 用于启动定时器的设备所在的区域 |

<details>
<summary>槽位组合（26）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `hours_only` | `hours` | complete | add 1 hour to my timer |
| `minutes_only` | `minutes` | complete | add 10 minutes to my timer |
| `seconds_only` | `seconds` | complete | add 30 seconds to my timer |
| `minutes_seconds` | `minutes`, `seconds` | complete | add 10 minutes and 30 seconds to my timer |
| `hours_minutes` | `hours`, `minutes` | complete | add 1 hour and 10 minutes to my timer |
| `hours_seconds` | `hours`, `seconds` | complete | add 1 hour and 30 seconds to my timer |
| `name_hours` | `name`, `hours` | complete | add 1 hour to the pizza timer |
| `name_minutes` | `name`, `minutes` | complete | add 10 minutes to the pizza timer |
| `name_seconds` | `name`, `seconds` | complete | add 30 seconds to the pizza timer |
| `name_hours_minutes` | `name`, `hours`, `minutes` | complete | add 1 hour and 10 minutes to the pizza timer |
| `name_hours_seconds` | `name`, `hours`, `seconds` | complete | add 1 hour and 30 seconds to the pizza timer |
| `area_hours` | `area`, `hours` | complete | add 1 hour to the kitchen timer |
| `area_minutes` | `area`, `minutes` | complete | add 10 minutes to the kitchen timer |
| `area_seconds` | `area`, `seconds` | complete | add 30 seconds to the kitchen timer |
| `area_minutes_seconds` | `area`, `minutes`, `seconds` | complete | add 10 minutes and 30 seconds to the kitchen timer |
| `area_hours_minutes` | `area`, `hours`, `minutes` | complete | add 1 hour and 10 minutes to the kitchen timer |
| `area_hours_seconds` | `area`, `hours`, `seconds` | complete | add 1 hour and 30 seconds to the kitchen timer |
| `hours_start_hours` | `start_hours`, `hours` | complete | add 1 hour to the 2 hour timer |
| `hours_start_minutes` | `start_minutes`, `hours` | complete | add 1 hour to the 10 minute timer |
| `hours_start_seconds` | `start_seconds`, `hours` | complete | add 1 hour to the 30 second timer |
| `minutes_start_hours` | `start_hours`, `minutes` | complete | add 10 minutes to my timer |
| `minutes_start_minutes` | `start_minutes`, `minutes` | complete | add 10 minutes to the 20 minute timer |
| `minutes_start_seconds` | `start_seconds`, `minutes` | complete | add 10 minutes to the 40 second timer |
| `seconds_start_hours` | `start_hours`, `seconds` | complete | add 30 seconds to my timer |
| `seconds_start_minutes` | `start_minutes`, `seconds` | complete | add 30 seconds to the 20 minute timer |
| `seconds_start_seconds` | `start_seconds`, `seconds` | complete | add 30 seconds to the 40 second timer |

</details>

### HassDecreaseTimer

从定时器中减少时间。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `hours` | 否 | 小时数 |
| `minutes` | 否 | 分钟数 |
| `seconds` | 否 | 秒数 |
| `start_hours` | 否 | 定时器启动时设定的小时数 |
| `start_minutes` | 否 | 定时器启动时设定的分钟数 |
| `start_seconds` | 否 | 定时器启动时设定的秒数 |
| `name` | 否 | 附加到定时器的名称 |
| `area` | 否 | 用于启动定时器的设备所在的区域 |

<details>
<summary>槽位组合（26）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `hours_only` | `hours` | complete | remove 1 hour to my timer |
| `minutes_only` | `minutes` | complete | remove 10 minutes to my timer |
| `seconds_only` | `seconds` | complete | remove 30 seconds to my timer |
| `hours_minutes` | `hours`, `minutes` | complete | remove 1 hour and 10 minutes to my timer |
| `hours_seconds` | `hours`, `seconds` | complete | remove 1 hour and 30 seconds to my timer |
| `minutes_seconds` | `minutes`, `seconds` | complete | remove 10 minutes and 30 seconds to my timer |
| `name_hours` | `name`, `hours` | complete | remove 1 hour from the pizza timer |
| `name_minutes` | `name`, `minutes` | complete | remove 10 minutes from the pizza timer |
| `name_seconds` | `name`, `seconds` | complete | remove 30 seconds from the pizza timer |
| `name_hours_minutes` | `name`, `hours`, `minutes` | complete | remove 1 hour and 10 minutes from the pizza timer |
| `name_hours_seconds` | `name`, `hours`, `seconds` | complete | remove 1 hour and 30 seconds from the pizza timer |
| `area_hours` | `area`, `hours` | complete | remove 1 hour from the kitchen timer |
| `area_minutes` | `area`, `minutes` | complete | remove 10 minutes from the kitchen timer |
| `area_seconds` | `area`, `seconds` | complete | remove 30 seconds from the kitchen timer |
| `area_minutes_seconds` | `area`, `minutes`, `seconds` | complete | remove 10 minutes and 30 seconds from the kitchen timer |
| `area_hours_minutes` | `area`, `hours`, `minutes` | complete | remove 1 hour and 10 minutes from the kitchen timer |
| `area_hours_seconds` | `area`, `hours`, `seconds` | complete | remove 1 hour and 30 seconds from the kitchen timer |
| `hours_start_hours` | `start_hours`, `hours` | complete | remove 1 hour from the 2 hour timer |
| `hours_start_minutes` | `start_minutes`, `hours` | complete | remove 1 hour from the 10 minute timer |
| `hours_start_seconds` | `start_seconds`, `hours` | complete | remove 1 hour from the 30 second timer |
| `minutes_start_hours` | `start_hours`, `minutes` | complete | remove 10 minutes to my timer |
| `minutes_start_minutes` | `start_minutes`, `minutes` | complete | remove 10 minutes from the 20 minute timer |
| `minutes_start_seconds` | `start_seconds`, `minutes` | complete | remove 10 minutes from the 40 second timer |
| `seconds_start_hours` | `start_hours`, `seconds` | complete | remove 30 seconds to my timer |
| `seconds_start_minutes` | `start_minutes`, `seconds` | complete | remove 30 seconds to the 20 minute timer |
| `seconds_start_seconds` | `start_seconds`, `seconds` | complete | remove 30 seconds to the 40 second timer |

</details>

### HassPauseTimer

暂停一个正在运行的定时器。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `start_hours` | 否 | 定时器启动时设定的小时数 |
| `start_minutes` | 否 | 定时器启动时设定的分钟数 |
| `start_seconds` | 否 | 定时器启动时设定的秒数 |
| `name` | 否 | 附加到定时器的名称 |
| `area` | 否 | 用于启动定时器的设备所在的区域 |

<details>
<summary>槽位组合（6）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | pause my timer |
| `name_only` | `name` | complete | pause the pizza timer |
| `area_only` | `area` | complete | pause the kitchen timer |
| `hours_only` | `start_hours` | complete | pause the 1 hour timer |
| `minutes_only` | `start_minutes` | complete | pause the 10 minute timer |
| `seconds_only` | `start_seconds` | complete | pause the 30 second timer |

</details>

### HassUnpauseTimer

恢复一个已暂停的定时器。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `start_hours` | 否 | 定时器启动时设定的小时数 |
| `start_minutes` | 否 | 定时器启动时设定的分钟数 |
| `start_seconds` | 否 | 定时器启动时设定的秒数 |
| `name` | 否 | 附加到定时器的名称 |
| `area` | 否 | 用于启动定时器的设备所在的区域 |

<details>
<summary>槽位组合（6）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | resume my timer |
| `name_only` | `name` | complete | resume the pizza timer |
| `area_only` | `area` | complete | resume the kitchen timer |
| `hours_only` | `start_hours` | complete | resume the 1 hour timer |
| `minutes_only` | `start_minutes` | complete | resume the 10 minute timer |
| `seconds_only` | `start_seconds` | complete | resume the 30 second timer |

</details>

### HassTimerStatus

报告一个或多个定时器的状态。由 `intent` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `start_hours` | 否 | 定时器启动时设定的小时数 |
| `start_minutes` | 否 | 定时器启动时设定的分钟数 |
| `start_seconds` | 否 | 定时器启动时设定的秒数 |
| `name` | 否 | 附加到定时器的名称 |
| `area` | 否 | 用于启动定时器的设备所在的区域 |

响应变量：`timers`，一个定时器对象列表。每个定时器都有 `is_active`（运行时为 true，暂停时为 false）、`name` 和 `area`（两者均为可选）、`total_seconds_left`、`rounded_hours_left`、`rounded_minutes_left`、`rounded_seconds_left`，以及定时器启动时设定的 `start_hours`、`start_minutes` 和 `start_seconds`。

<details>
<summary>槽位组合（6）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | usable | how much time is left on my timer |
| `name_only` | `name` | complete | how much time is left on the pizza timer |
| `area_only` | `area` | complete | how much time is left on the kitchen timer |
| `hours_only` | `start_hours` | complete | how much time is left on the 1 hour timer |
| `minutes_only` | `start_minutes` | complete | how much time is left on the 10 minute timer |
| `seconds_only` | `start_seconds` | complete | how much time is left on the 30 second timer |

</details>

## 吸尘器和割草机

### HassVacuumStart

启动一个吸尘器。由 `vacuum` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |
| `floor` | 否 | 楼层的名称 |

<details>
<summary>槽位组合（3）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_only` | `name` | complete | start rover |
| `area_only` | `area` | complete | vacuum the kitchen |
| `floor_only` | `floor` | complete | vacuum the main floor |

</details>

### HassVacuumReturnToBase

让吸尘器返回基站。由 `vacuum` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 否 | 区域的名称 |

<details>
<summary>槽位组合（2）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `name_only` | `name` | complete | return rover to base |
| `area_only` | `area` | complete | return kitchen vacuum to base |

</details>

### HassVacuumCleanArea

让吸尘器清扫一个区域。由 `vacuum` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |
| `area` | 是 | 要清扫的区域的名称 |

<details>
<summary>槽位组合（3）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `context_area` | 无 (satellite area) | usable | vacuum in here |
| `area_only` | `area` | complete | vacuum the kitchen |
| `name_area` | `name`, `area` | complete | vacuum the kitchen with rover |

</details>

### HassLawnMowerStartMowing

启动一个割草机。由 `lawn_mower` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |

<details>
<summary>槽位组合（2）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | complete | start mowing |
| `name_only` | `name` | complete | start clippy |

</details>

### HassLawnMowerDock

让割草机返回充电座。由 `lawn_mower` 集成处理。

| 槽位 | 必需 | 描述 |
| --- | --- | --- |
| `name` | 否 | 设备或实体的名称 |

<details>
<summary>槽位组合（2）</summary>

| 组合 | 槽位 | 重要性 | 示例 |
| --- | --- | --- | --- |
| `default` | 无 | complete | stop mowing |
| `name_only` | `name` | complete | return clippy to base |

</details>

## 没有句子的意图

Home Assistant 还注册了另外几个在 intents 仓库中没有句子的意图。你无法对内置对话代理说出它们，但代码仍然可以触发它们。其中一些还作为工具提供给使用 AI 模型的对话代理。不要为它们向 intents 仓库添加句子：`intents.yaml` 中没有列出它们。

| 意图 | 作用 | 槽位 | 处理者 |
| --- | --- | --- | --- |
| `HassToggle` | 切换一个设备或实体 | 可选的 `name`、`area`、`floor`、`domain` 和 `device_class` | `intent` |
| `HassStopMoving` | 停止一个正在移动的卷帘或阀门 | 可选的 `name`、`area`、`floor`、`domain` 和 `device_class` | `intent` |
| `HassOpenCover` | 打开一个卷帘。请改用 `HassTurnOn` | 可选的 `name`、`area`、`floor`、`domain` 和 `device_class` | `cover` |
| `HassCloseCover` | 关闭一个卷帘。请改用 `HassTurnOff` | 可选的 `name`、`area`、`floor`、`domain` 和 `device_class` | `cover` |
| `HassHumidifierSetpoint` | 设置目标湿度 | `name` 和 `humidity`（0 到 100），两者均为必需 | `humidifier` |
| `HassHumidifierMode` | 设置加湿器的模式 | `name` 和 `mode`，两者均为必需 | `humidifier` |
| `HassShoppingListLastItems` | 列出购物清单上的最后五个条目 | 无 | `shopping_list` |
