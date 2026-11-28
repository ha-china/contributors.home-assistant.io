# 实体

> 实体在 Home Assistant Core 中的工作原理，以及每个实体平台（从传感器和灯光到语音和 AI）的参考。

Source: https://www.hasscn.top/contributors/core/entities/

[实体（entity）](https://www.hasscn.top/contributors/glossary/entity/)是 Home Assistant 中拥有状态（state）的最小单元：一条温度读数、一盏灯、一把锁。用户用实体来构建自动化（automation）、仪表盘（dashboard）和语音指令，因此实体是你所编写的任何集成（integration）中最显眼的部分。

实体按领域（domain）划分，例如 `sensor`、`light` 或 `climate`。每个领域都是一个实体平台（entity platform）：一个拥有自身属性、特性和状态的基类，所有集成都以相同的方式实现它。正是这种共同的结构，使得一个品牌的灯在界面中、自动化中以及语音助手中，都能与另一个品牌的灯完全一致地工作。

这些页面面向构建或维护集成，或参与实体平台本身开发的开发者。内容假设你了解 Python，并且已经运行了[开发环境](https://www.hasscn.top/contributors/core/development/)。要了解集成最初是如何设置其平台并创建实体的，请从[集成](https://www.hasscn.top/contributors/core/integrations/)开始。

## 实体如何工作

1. 你的集成在平台模块（例如 `sensor.py`）中创建实体对象，并将它们传递给 `async_add_entities`。
2. Home Assistant 会在[实体注册表](https://www.hasscn.top/contributors/core/entities/registry/)中注册每个实体，将其与所属设备（device）关联，并为其分配一个实体 ID。
3. 实体通过[轮询或推送](https://www.hasscn.top/contributors/core/entities/state-updates/)保持数据最新，并将其状态写入状态机。
4. 用户通过动作（action）来控制实体，这些动作会调用你实体上的方法，例如 `async_turn_on`。
5. 当集成卸载时，实体会被移除，并[进行自我清理](https://www.hasscn.top/contributors/core/entities/lifecycle/)。

## 基础

请先阅读这些内容。它们适用于每个实体，无论其领域是什么。

- [实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)：基类、设置属性的三种方式，以及通用属性。
- [实体命名](https://www.hasscn.top/contributors/core/entities/naming/)：`has_entity_name`、翻译名称、友好名称和实体 ID。
- [更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/)：轮询、推送、写入状态和可用性。
- [实体生命周期](https://www.hasscn.top/contributors/core/entities/lifecycle/)：实体被添加、更改和移除时运行的钩子。
- [状态和属性](https://www.hasscn.top/contributors/core/entities/state-attributes/)：哪些内容会进入状态对象，哪些内容应避免放入其中。
- [图标](https://www.hasscn.top/contributors/core/entities/icons/)：图标翻译和 icon 属性。
- [实体注册表](https://www.hasscn.top/contributors/core/entities/registry/)：唯一 ID、设备、实体类别和已禁用的实体。

## 实体平台

每个平台页面都遵循相同的结构：实体代表什么、它的属性、它支持的特性、你需要实现的方法、它的状态，以及一个示例。当前端以自己的方式展示某个领域时，该页面会链接到[设计区域](https://www.hasscn.top/contributors/design/more-info/)中对应的更多信息（more-info）视图。

### 传感器和状态

- [传感器（sensor）](https://www.hasscn.top/contributors/core/entities/sensor/)：测量或读取到的数值，例如温度或功率读数。
- [二进制传感器（binary sensor）](https://www.hasscn.top/contributors/core/entities/binary-sensor/)：只有开或关两种状态的事物，例如敞开的门或检测到的运动。
- [事件（event）](https://www.hasscn.top/contributors/core/entities/event/)：发生的某件事，例如按下按钮或门铃响起。
- [天气（weather）](https://www.hasscn.top/contributors/core/entities/weather/)：当前天气状况和预报。
- [设备追踪器（device tracker）](https://www.hasscn.top/contributors/core/entities/device-tracker/)：设备在哪里，或者它是否在家。
- [地理位置（geolocation）](https://www.hasscn.top/contributors/core/entities/geo-location/)：来自外部数据源的带有位置信息的事件。
- [日历（calendar）](https://www.hasscn.top/contributors/core/entities/calendar/)：具有开始和结束时间的事件。
- [空气质量（air quality）](https://www.hasscn.top/contributors/core/entities/air-quality/)：已弃用，请改用传感器。

### 灯光和气候

- [灯（light）](https://www.hasscn.top/contributors/core/entities/light/)
- [气候（climate）](https://www.hasscn.top/contributors/core/entities/climate/)
- [风扇（fan）](https://www.hasscn.top/contributors/core/entities/fan/)
- [加湿器（humidifier）](https://www.hasscn.top/contributors/core/entities/humidifier/)
- [热水器（water heater）](https://www.hasscn.top/contributors/core/entities/water-heater/)

### 门窗和安全

- [卷帘（cover）](https://www.hasscn.top/contributors/core/entities/cover/)：百叶窗、窗帘、车库门和大门。
- [阀门（valve）](https://www.hasscn.top/contributors/core/entities/valve/)：水阀和燃气阀。
- [锁（lock）](https://www.hasscn.top/contributors/core/entities/lock/)
- [警报控制面板（alarm control panel）](https://www.hasscn.top/contributors/core/entities/alarm-control-panel/)
- [警笛（siren）](https://www.hasscn.top/contributors/core/entities/siren/)

### 媒体

- [媒体播放器（media player）](https://www.hasscn.top/contributors/core/entities/media-player/)：音箱、电视和功放。
- [摄像头（camera）](https://www.hasscn.top/contributors/core/entities/camera/)：静态图像和实时视频流。
- [图像（image）](https://www.hasscn.top/contributors/core/entities/image/)：会不时变化的静态图像。

### 遥控和信号

- [Remote](https://www.hasscn.top/contributors/core/entities/remote/): 向其他设备发送命令。
- [Infrared](https://www.hasscn.top/contributors/core/entities/infrared/): 共享的红外发射器和接收器。
- [Radio frequency](https://www.hasscn.top/contributors/core/entities/radio-frequency/): 共享的射频发射器和接收器。

### 语音和 AI

- [对话（conversation）](https://www.hasscn.top/contributors/core/entities/conversation/)：理解并应答人们对 Assist 所说内容的代理。
- [语音转文本（speech-to-text）](https://www.hasscn.top/contributors/core/entities/stt/)
- [文本转语音（text-to-speech）](https://www.hasscn.top/contributors/core/entities/tts/)
- [唤醒词检测（wake word detection）](https://www.hasscn.top/contributors/core/entities/wake-word/)
- [Assist 卫星（Assist satellite）](https://www.hasscn.top/contributors/core/entities/assist-satellite/)：能够聆听并作出回应的设备。
- [AI 任务（AI task）](https://www.hasscn.top/contributors/core/entities/ai-task/)：使用模型生成数据或图像。

### 家电

- [吸尘器（vacuum）](https://www.hasscn.top/contributors/core/entities/vacuum/)
- [割草机（lawn mower）](https://www.hasscn.top/contributors/core/entities/lawn-mower/)
- [更新（update）](https://www.hasscn.top/contributors/core/entities/update/)：固件和软件更新。

### 输入和辅助元素

- [开关（switch）](https://www.hasscn.top/contributors/core/entities/switch/)：打开或关闭某个东西。
- [按钮（button）](https://www.hasscn.top/contributors/core/entities/button/)：触发单个动作。
- [数字（number）](https://www.hasscn.top/contributors/core/entities/number/)、[选择（select）](https://www.hasscn.top/contributors/core/entities/select/)和[文本（text）](https://www.hasscn.top/contributors/core/entities/text/)：为设备设置一个值。
- [日期（date）](https://www.hasscn.top/contributors/core/entities/date/)、[日期和时间（date and time）](https://www.hasscn.top/contributors/core/entities/datetime/)和[时间（time）](https://www.hasscn.top/contributors/core/entities/time/)：为设备设置一个时刻。
- [场景（scene）](https://www.hasscn.top/contributors/core/entities/scene/)：激活存储在设备上的场景。
- [待办事项列表（to-do list）](https://www.hasscn.top/contributors/core/entities/todo/)：带有状态的条目列表。
- [通知（notify）](https://www.hasscn.top/contributors/core/entities/notify/)：发送消息。

## 选择合适的平台

选择与该事物本质相符的平台，而不是最容易实现的那个。一个只能开启和关闭的水泵是开关，但阀门就是阀门，灯就是灯，即使它们同样只有开和关。合适的平台能为用户提供正确的控件，为语音助手提供正确的设备类型，并在设备功能不断增强时为你提供正确的特性。每个平台页面都说明了它在什么情况下合适、什么情况下不合适。

如果没有合适的平台，或者某个平台缺少许多设备都具备的功能，请不要用属性（attribute）来变通实现。请先在[架构讨论](https://github.com/home-assistant/architecture/discussions)中提出更改建议。参见[提议对实体模型的更改](https://www.hasscn.top/contributors/core/entities/entity-class/#proposing-changes-to-an-entity-model)。

## 向谁咨询

- 在构建实体时有疑问？请在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 [**#coding-support**](https://discord.com/channels/330944238910963714/1257019582112334014) 中发起讨论。
- 想为某个领域添加功能、状态或设备类别？请在[架构仓库](https://github.com/home-assistant/architecture/discussions)中发起讨论。当做出决定时，会以架构决策记录的形式记录在那里。
- 发现实体平台中的错误？请在[核心仓库](https://github.com/home-assistant/core/issues)中提交问题。

## All pages in this section

### Basics

- [实体类](https://www.hasscn.top/contributors/core/entities/entity-class/): 每个实体都构建于其上的 Entity 基类、设置其属性的三种方式，以及每个实体都拥有的通用属性。
- [更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/): 通过轮询或推送让实体与其设备保持同步，在恰当的时机写入状态，并如实报告可用性。
- [实体生命周期](https://www.hasscn.top/contributors/core/entities/lifecycle/): Home Assistant 添加和移除实体时会发生什么，以及你用来订阅、清理和响应注册表（registry）变化的钩子（hook）。
- [状态与属性](https://www.hasscn.top/contributors/core/entities/state-attributes/): 哪些内容会进入实体的状态对象、何时应添加额外的属性，以及如何让属性不进入历史记录。
- [图标](https://www.hasscn.top/contributors/core/entities/icons/): 在 icons.json 中使用图标翻译（icon translations）为实体提供跟随其状态变化的图标，以及何时应改用 icon 属性。

### Sensors and status

- [日历实体](https://www.hasscn.top/contributors/core/entities/calendar/): 暴露一个包含具有开始和结束时间的事件的日历，并可选地允许用户创建、更新和删除这些事件。
- [设备跟踪器实体](https://www.hasscn.top/contributors/core/entities/device-tracker/): 报告设备在哪里：或者通过其位置，或者通过它是否连接到网络或信标。
- [事件实体](https://www.hasscn.top/contributors/core/entities/event/): 将物理世界中发生的事情（如按下按钮或门铃响起）转化为可用于自动化的实体。
- [地理位置实体](https://www.hasscn.top/contributors/core/entities/geo-location/): 在地图上显示来自外部数据源且带有位置的事件，例如地震或野火。
- [传感器实体](https://www.hasscn.top/contributors/core/entities/sensor/): 报告只读值（如温度、功率读数或时间戳）及其单位，并可选择加入长期统计。
- [天气实体](https://www.hasscn.top/contributors/core/entities/weather/): 报告当前天气状况，并提供每日、每小时或每日两次的天气预报。

### Lights and climate

- [气候实体（climate entity）](https://www.hasscn.top/contributors/core/entities/climate/): 为控制温度、湿度和风扇的恒温器、空调和热泵构建气候实体。
- [风扇实体](https://www.hasscn.top/contributors/core/entities/fan/): 构建一个可控制转速、转动方向、摆动和预设模式的风扇实体。
- [加湿器实体](https://www.hasscn.top/contributors/core/entities/humidifier/): 为向空气中增加湿气或去除湿气的设备构建加湿器实体。
- [灯实体](https://www.hasscn.top/contributors/core/entities/light/): 构建一个可以开关、调光以及更改颜色或色温的灯实体。
- [热水器实体（Water heater entity）](https://www.hasscn.top/contributors/core/entities/water-heater/): 为将水加热至目标温度的锅炉和水箱构建热水器实体。

### Openings and security

- [报警控制面板实体](https://www.hasscn.top/contributors/core/entities/alarm-control-panel/): 构建一个可布防、撤防并触发安防系统的报警控制面板实体。
- [卷帘实体](https://www.hasscn.top/contributors/core/entities/cover/): 构建用于百叶窗、遮光帘、车库门、大门及其他可开合物体的卷帘实体。
- [锁实体](https://www.hasscn.top/contributors/core/entities/lock/): 为智能门锁构建锁实体（lock entity），可进行上锁、解锁，并可选择性地打开门。
- [警报器实体](https://www.hasscn.top/contributors/core/entities/siren/): 构建一个警报器实体，适用于以音调、音量和持续时间发声的警报器和门铃。
- [阀门实体](https://www.hasscn.top/contributors/core/entities/valve/): 为控制水或气体流动的设备构建阀门实体。

### Media

- [摄像头实体](https://www.hasscn.top/contributors/core/entities/camera/): 显示摄像头的静态图像，以及可选的通过 HLS 或 WebRTC 传输的实时视频流。
- [图片实体](https://www.hasscn.top/contributors/core/entities/image/): 显示一张会不时变化的静态图片，例如地图、快照或二维码。
- [媒体播放器实体](https://www.hasscn.top/contributors/core/entities/media-player/): 控制任何播放音频或视频的设备，从智能音箱到电视或 AV 功放。

### Remotes and signals

- [红外实体](https://www.hasscn.top/contributors/core/entities/infrared/): 在集成之间共享红外硬件，让一个集成负责收发信号，另一个集成知道这些信号的含义。
- [遥控器实体](https://www.hasscn.top/contributors/core/entities/remote/): 向其他设备发送命令，就像万能遥控器上的按钮一样，还可以在多个活动之间切换。

### Voice and AI

- [Assist 卫星实体](https://www.hasscn.top/contributors/core/entities/assist-satellite/): 为监听语音命令并说出响应的设备构建 Assist 卫星实体。
- [语音转文本实体](https://www.hasscn.top/contributors/core/entities/stt/): 构建一个语音转文本实体，将音频流转换为 Assist 所需的文本。
- [文本转语音实体](https://www.hasscn.top/contributors/core/entities/tts/): 构建一个文本转语音实体，将文本转换为音频，可一次性完成，也可在语言模型书写的同时流式生成。
- [唤醒词检测实体](https://www.hasscn.top/contributors/core/entities/wake-word/): 构建一个唤醒词实体，监听音频流并在有人说出唤醒词时进行报告。

### Appliances

- [割草机实体](https://www.hasscn.top/contributors/core/entities/lawn-mower/): 为能割草、暂停并返回基座的机器人割草机构建割草机实体。
- [更新实体](https://www.hasscn.top/contributors/core/entities/update/): 构建一个更新实体，告知用户有新的固件或软件版本可用，并允许他们进行安装。
- [吸尘器实体](https://www.hasscn.top/contributors/core/entities/vacuum/): 为能够清扫、回充并清扫家中特定区域的扫地机器人构建吸尘器实体。

### Inputs and helpers

- [日期实体](https://www.hasscn.top/contributors/core/entities/date/): 构建一个日期实体，让人们能够在设备上设置一个日历日期，例如假期模式的开始日期。
- [日期时间实体](https://www.hasscn.top/contributors/core/entities/datetime/): 构建一个日期时间实体，让人们能够在设备上设置一个时间点，例如充电会话开始的时间。
- [通知实体](https://www.hasscn.top/contributors/core/entities/notify/): 构建一个向设备或服务发送消息的通知（notify）实体，例如聊天、电子邮件地址或显示器。
- [数字实体](https://www.hasscn.top/contributors/core/entities/number/): 构建一个数字实体（number entity），让人们可以在设备上设置一个数值，例如目标档位或超时时间。
- [场景实体](https://www.hasscn.top/contributors/core/entities/scene/): 为存储在设备或集线器上的场景构建场景实体，以便用户可以从 Home Assistant 中激活它。
- [Select 实体](https://www.hasscn.top/contributors/core/entities/select/): 构建一个选择实体（select entity），让用户从固定列表中选择一个选项，例如运行模式。
- [开关实体](https://www.hasscn.top/contributors/core/entities/switch/): 为您可以打开和关闭的东西（如继电器或智能插座）构建开关实体。
- [文本实体](https://www.hasscn.top/contributors/core/entities/text/): 构建一个文本实体，让人们能够在设备上设置简短的文本值，例如显示屏上的消息或网络名称。
- [时间实体](https://www.hasscn.top/contributors/core/entities/time/): 构建一个时间实体，让人们可以在设备上设置一天中的某个时间，例如唤醒时间。
- [待办事项列表实体](https://www.hasscn.top/contributors/core/entities/todo/): 为购物清单、任务列表或任何其他带有状态的有序项目列表构建待办事项列表实体。

### 传感器与状态

- [二元传感器实体](https://www.hasscn.top/contributors/core/entities/binary-sensor/): 报告只有开或关两种状态的事物，例如打开的门或检测到的移动。
- [空气质量实体](https://www.hasscn.top/contributors/core/entities/air-quality/): 已弃用的空气质量实体，以及应使用的替代方案。

### 语音与 AI

- [AI 任务实体](https://www.hasscn.top/contributors/core/entities/ai-task/): 构建一个 AI 任务实体，让自动化可以请求模型生成数据或图像，或评估问题。
- [对话实体](https://www.hasscn.top/contributors/core/entities/conversation/): 构建一个对话代理，接收来自 Assist 的文本并作出回答，背后可以有或没有语言模型。

### 输入与辅助元素

- [按钮实体](https://www.hasscn.top/contributors/core/entities/button/): 构建一个按钮实体，用于触发设备或服务上的单个操作，例如重启。

### 遥控与信号

- [射频实体](https://www.hasscn.top/contributors/core/entities/radio-frequency/): 在集成之间共享射频发射器和接收器，使一个集成拥有无线电，另一个集成知道设备的编码。
