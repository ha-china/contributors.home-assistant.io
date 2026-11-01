---
title: 实体
description: 实体在 Home Assistant Core 中的工作原理，以及每个实体平台（从传感器和灯光到语音和 AI）的参考。
order: 20
sidebarGroups:
  - Basics
  - Sensors and status
  - Lights and climate
  - Openings and security
  - Media
  - Remotes and signals
  - Voice and AI
  - Appliances
  - Inputs and helpers
---

[实体（entity）](/glossary/entity/)是 Home Assistant 中拥有状态（state）的最小单元：一条温度读数、一盏灯、一把锁。用户用实体来构建自动化（automation）、仪表盘（dashboard）和语音指令，因此实体是你所编写的任何集成（integration）中最显眼的部分。

实体按领域（domain）划分，例如 `sensor`、`light` 或 `climate`。每个领域都是一个实体平台（entity platform）：一个拥有自身属性、特性和状态的基类，所有集成都以相同的方式实现它。正是这种共同的结构，使得一个品牌的灯在界面中、自动化中以及语音助手中，都能与另一个品牌的灯完全一致地工作。

这些页面面向构建或维护集成，或参与实体平台本身开发的开发者。内容假设你了解 Python，并且已经运行了[开发环境](/core/development/)。要了解集成最初是如何设置其平台并创建实体的，请从[集成](/core/integrations/)开始。

## 实体如何工作

1. 你的集成在平台模块（例如 `sensor.py`）中创建实体对象，并将它们传递给 `async_add_entities`。
2. Home Assistant 会在[实体注册表](/core/entities/registry/)中注册每个实体，将其与所属设备（device）关联，并为其分配一个实体 ID。
3. 实体通过[轮询或推送](/core/entities/state-updates/)保持数据最新，并将其状态写入状态机。
4. 用户通过动作（action）来控制实体，这些动作会调用你实体上的方法，例如 `async_turn_on`。
5. 当集成卸载时，实体会被移除，并[进行自我清理](/core/entities/lifecycle/)。

## 基础

请先阅读这些内容。它们适用于每个实体，无论其领域是什么。

- [实体类](/core/entities/entity-class/)：基类、设置属性的三种方式，以及通用属性。
- [实体命名](/core/entities/naming/)：`has_entity_name`、翻译名称、友好名称和实体 ID。
- [更新状态](/core/entities/state-updates/)：轮询、推送、写入状态和可用性。
- [实体生命周期](/core/entities/lifecycle/)：实体被添加、更改和移除时运行的钩子。
- [状态和属性](/core/entities/state-attributes/)：哪些内容会进入状态对象，哪些内容应避免放入其中。
- [图标](/core/entities/icons/)：图标翻译和 icon 属性。
- [实体注册表](/core/entities/registry/)：唯一 ID、设备、实体类别和已禁用的实体。

## 实体平台

每个平台页面都遵循相同的结构：实体代表什么、它的属性、它支持的特性、你需要实现的方法、它的状态，以及一个示例。当前端以自己的方式展示某个领域时，该页面会链接到[设计区域](/design/more-info/)中对应的更多信息（more-info）视图。

### 传感器和状态

- [传感器（sensor）](/core/entities/sensor/)：测量或读取到的数值，例如温度或功率读数。
- [二进制传感器（binary sensor）](/core/entities/binary-sensor/)：只有开或关两种状态的事物，例如敞开的门或检测到的运动。
- [事件（event）](/core/entities/event/)：发生的某件事，例如按下按钮或门铃响起。
- [天气（weather）](/core/entities/weather/)：当前天气状况和预报。
- [设备追踪器（device tracker）](/core/entities/device-tracker/)：设备在哪里，或者它是否在家。
- [地理位置（geolocation）](/core/entities/geo-location/)：来自外部数据源的带有位置信息的事件。
- [日历（calendar）](/core/entities/calendar/)：具有开始和结束时间的事件。
- [空气质量（air quality）](/core/entities/air-quality/)：已弃用，请改用传感器。

### 灯光和气候

- [灯（light）](/core/entities/light/)
- [气候（climate）](/core/entities/climate/)
- [风扇（fan）](/core/entities/fan/)
- [加湿器（humidifier）](/core/entities/humidifier/)
- [热水器（water heater）](/core/entities/water-heater/)

### 门窗和安全

- [卷帘（cover）](/core/entities/cover/)：百叶窗、窗帘、车库门和大门。
- [阀门（valve）](/core/entities/valve/)：水阀和燃气阀。
- [锁（lock）](/core/entities/lock/)
- [警报控制面板（alarm control panel）](/core/entities/alarm-control-panel/)
- [警笛（siren）](/core/entities/siren/)

### 媒体

- [媒体播放器（media player）](/core/entities/media-player/)：音箱、电视和功放。
- [摄像头（camera）](/core/entities/camera/)：静态图像和实时视频流。
- [图像（image）](/core/entities/image/)：会不时变化的静态图像。

### 遥控和信号

- [Remote](/core/entities/remote/): send commands to other devices.
- [Infrared](/core/entities/infrared/): shared infrared transmitters and receivers.
- [Radio frequency](/core/entities/radio-frequency/): shared RF transmitters and receivers.

### 语音和 AI

- [对话（conversation）](/core/entities/conversation/)：理解并应答人们对 Assist 所说内容的代理。
- [语音转文本（speech-to-text）](/core/entities/stt/)
- [文本转语音（text-to-speech）](/core/entities/tts/)
- [唤醒词检测（wake word detection）](/core/entities/wake-word/)
- [Assist 卫星（Assist satellite）](/core/entities/assist-satellite/)：能够聆听并作出回应的设备。
- [AI 任务（AI task）](/core/entities/ai-task/)：使用模型生成数据或图像。

### 家电

- [吸尘器（vacuum）](/core/entities/vacuum/)
- [割草机（lawn mower）](/core/entities/lawn-mower/)
- [更新（update）](/core/entities/update/)：固件和软件更新。

### 输入和辅助元素

- [开关（switch）](/core/entities/switch/)：打开或关闭某个东西。
- [按钮（button）](/core/entities/button/)：触发单个动作。
- [数字（number）](/core/entities/number/)、[选择（select）](/core/entities/select/)和[文本（text）](/core/entities/text/)：为设备设置一个值。
- [日期（date）](/core/entities/date/)、[日期和时间（date and time）](/core/entities/datetime/)和[时间（time）](/core/entities/time/)：为设备设置一个时刻。
- [场景（scene）](/core/entities/scene/)：激活存储在设备上的场景。
- [待办事项列表（to-do list）](/core/entities/todo/)：带有状态的条目列表。
- [通知（notify）](/core/entities/notify/)：发送消息。

## 选择合适的平台

选择与该事物本质相符的平台，而不是最容易实现的那个。一个只能开启和关闭的水泵是开关，但阀门就是阀门，灯就是灯，即使它们同样只有开和关。合适的平台能为用户提供正确的控件，为语音助手提供正确的设备类型，并在设备功能不断增强时为你提供正确的特性。每个平台页面都说明了它在什么情况下合适、什么情况下不合适。

如果没有合适的平台，或者某个平台缺少许多设备都具备的功能，请不要用属性（attribute）来变通实现。请先在[架构讨论](https://github.com/home-assistant/architecture/discussions)中提出更改建议。参见[提议对实体模型的更改](/core/entities/entity-class/#proposing-changes-to-an-entity-model)。

## 向谁咨询

- 在构建实体时有疑问？请在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 **#core** 频道中提问。
- 想为某个领域添加特性、状态或设备类别？请在[架构仓库](https://github.com/home-assistant/architecture/discussions)中发起讨论。一旦做出决定，就会以架构决策记录（architecture decision record）的形式记录在那里。
- 在实体平台中发现了 bug？请在 [core 仓库](https://github.com/home-assistant/core/issues)中提交 issue。
