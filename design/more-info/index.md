# 更多信息

> 选择实体时打开的对话框，以及每种类型的实体在其中呈现的视图。

Source: https://www.hasscn.top/contributors/design/more-info/

在 Home Assistant 中几乎任何地方选择一个实体（entity），都会打开“更多信息”对话框。这是唯一一个可以看到单个实体全部信息的地方：它的状态、用于更改状态的控制、它之前做过什么，以及它的设置。由于它可以从仪表盘、搜索、实体表格以及其他对话框中打开，它是人们最常看到的界面之一。

该对话框对每个实体都是相同的。其中显示的内容取决于域（domain）：灯会有亮度滑块，恒温器会有圆形表盘，计时器会有时长输入框。这些页面展示了每个域的视图，由真实前端在一个虚拟家庭中实时渲染。

## 结构

该对话框包含一个页眉和几个可以在其间切换的视图。

- **页眉**：一个关闭按钮、实体的名称，以及其上方显示所属区域（area）和设备（device）的面包屑导航。右侧有**历史**按钮、**设置**按钮和一个菜单。菜单包含**添加到…**、实体的收藏选项（如果有）、指向设备的链接、**相关**和**详情**。**设置**按钮和菜单仅对管理员显示。
- **信息视图**：默认视图。对于采用较新设计的域，它以一个大的状态开头，例如 **71%** 或 **已上锁**，以及状态上次更改的时间。选择该时间可以在相对时间和绝对时间之间切换。其下方是主控制，再下方是次级控制。较旧的域则在顶部显示一行状态。没有自己视图的域（例如传感器），还会在其下方显示历史图表和活动列表。
- **历史**：实体的历史图表和活动。对于拥有自己视图的域，历史内容位于页眉按钮之后，这样信息视图就可以专注于控制设备。
- **设置**：实体设置，例如名称、图标、区域，以及是否已启用。
- **相关**：实体的上下文，例如它所在的楼层、区域、设备、集成（integration）和标签，随后是与它相关的其他项目，例如使用它的自动化和脚本。
- **详情**：实体 ID、原始状态、上次更改和更新的时间，以及所有属性。页眉中的一个代码按钮可将其切换为 YAML。

当一个实体是其他实体的组合时，例如灯组或场景，信息视图会在控制项下方以磁贴卡片的形式列出成员，以便逐个控制它们。

## 设计原则

较新的“更多信息”视图遵循相同的模式，因此灯、锁和风扇看起来像是一个系列。

- **一个大的主控制。** 每个视图都有一个执行实体主要功能的控制，并占据大部分空间：垂直滑块、大开关或圆形表盘。这些来自[控件](https://www.hasscn.top/contributors/design/components/controls/)系列，设计上既适合鼠标操作，也适合手指操作。
- **次级控制在下方。** 模式、预设和其他设置以一排紧凑的[选择菜单](https://www.hasscn.top/contributors/design/components/select-menu/)的形式位于主控制下方。小的模式切换，例如灯的亮度或颜色，则以一排圆形图标按钮的形式紧随其下。
- **状态优先。** 顶部的大状态让你在操作之前就能了解当前情况。视图会在有帮助时重新表述它：灯显示其亮度，窗帘显示 **Open · 70%**。
- **只显示设备能做的事。** 每个控制都会检查实体支持的功能。当设备无法执行某项操作时，该控制不会出现。它不会以禁用状态显示，而是直接消失。只有当实体不可用，或某个操作在当前状态下没有意义时（例如关闭已经关上的门），控制才会被禁用。
- **颜色跟随状态。** 控件会采用实体状态对应的颜色，例如开启的灯为琥珀色，已上锁的锁为绿色，使用与[状态图标](https://www.hasscn.top/contributors/design/components/state-icon/)相同的颜色。

## 视图

### 灯光与温控

- [Light](https://www.hasscn.top/contributors/design/more-info/light/)
- [Climate](https://www.hasscn.top/contributors/design/more-info/climate/)
- [Fan](https://www.hasscn.top/contributors/design/more-info/fan/)
- [Humidifier](https://www.hasscn.top/contributors/design/more-info/humidifier/)
- [Water heater](https://www.hasscn.top/contributors/design/more-info/water-heater/)

### 门窗与安防

- [Cover](https://www.hasscn.top/contributors/design/more-info/cover/)
- [Valve](https://www.hasscn.top/contributors/design/more-info/valve/)
- [Lock](https://www.hasscn.top/contributors/design/more-info/lock/)
- [Alarm control panel](https://www.hasscn.top/contributors/design/more-info/alarm-control-panel/)

### 媒体

- [Media player](https://www.hasscn.top/contributors/design/more-info/media-player/)

### 家电

- [Vacuum](https://www.hasscn.top/contributors/design/more-info/vacuum/)
- [Lawn mower](https://www.hasscn.top/contributors/design/more-info/lawn-mower/)
- [Switch](https://www.hasscn.top/contributors/design/more-info/switch/)
- [Update](https://www.hasscn.top/contributors/design/more-info/update/)

### 辅助元素

- [Input number](https://www.hasscn.top/contributors/design/more-info/input-number/)
- [Number](https://www.hasscn.top/contributors/design/more-info/number/)
- [Input text](https://www.hasscn.top/contributors/design/more-info/input-text/)
- [Timer](https://www.hasscn.top/contributors/design/more-info/timer/)
- [Scene](https://www.hasscn.top/contributors/design/more-info/scene/)

### 信息

- [Weather](https://www.hasscn.top/contributors/design/more-info/weather/)
- [Person](https://www.hasscn.top/contributors/design/more-info/person/)
- [Sun](https://www.hasscn.top/contributors/design/more-info/sun/)

## 代码实现

该对话框是 `ha-more-info-dialog`，位于 [`src/dialogs/more-info/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info)。信息视图是 `ha-more-info-info`，它渲染 `more-info-content`。该元素从 [`src/dialogs/more-info/controls/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/controls) 中为实体的域选择视图 `more-info-<domain>`。采用较新设计的域列表是 [`src/dialogs/more-info/const.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/const.ts) 中的 `DOMAINS_WITH_NEW_MORE_INFO`。

顶部的大状态是 `ha-more-info-state-header`，次级控制行是 `ha-more-info-control-select-container`，两者都位于 [`src/dialogs/more-info/components/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components) 中。大多数主控制位于 [`src/state-control/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control) 中，每个域一个文件夹。

源码：[`src/dialogs/more-info/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info)

## All pages in this section

### Lights and climate

- [加湿器](https://www.hasscn.top/contributors/design/more-info/humidifier/): 加湿器或除湿器的更多信息视图，带有一个用于设定目标湿度的圆形转盘。
- [温控](https://www.hasscn.top/contributors/design/more-info/climate/): 恒温器或空调的更多信息视图，围绕圆形温度转盘构建。
- [灯](https://www.hasscn.top/contributors/design/more-info/light/): 灯的更多信息视图，带有一个大亮度滑块以及颜色和色温开关。
- [热水器](https://www.hasscn.top/contributors/design/more-info/water-heater/): 热水器的更多信息视图，带有一个用于目标温度的圆形表盘，以及用于运行模式和离家模式的菜单。
- [风扇](https://www.hasscn.top/contributors/design/more-info/fan/): 风扇的更多信息视图，包含速度控制以及用于预设、风向和摆头的菜单。

### Openings and security

- [窗帘（Cover）](https://www.hasscn.top/contributors/design/more-info/cover/): 百叶窗、卷帘、车库门及其他窗帘类设备的更多信息视图，带有位置滑块或打开和关闭按钮。
- [防盗报警控制面板](https://www.hasscn.top/contributors/design/more-info/alarm-control-panel/): 报警系统的更多信息视图，带有用于选择布防模式的垂直选择器。

### Media

- [媒体播放器](https://www.hasscn.top/contributors/design/more-info/media-player/): 扬声器、电视或其他媒体播放器的更多信息视图，布局类似音乐应用。

### Appliances

- [割草机](https://www.hasscn.top/contributors/design/more-info/lawn-mower/): 机器人割草机的更多信息视图，带有动画状态图片以及启动、停止和回充电座的按钮。
- [吸尘器](https://www.hasscn.top/contributors/design/more-info/vacuum/): 扫地机器人的更多信息视图，带有动态状态图片和一排命令按钮。
- [开关](https://www.hasscn.top/contributors/design/more-info/switch/): 开关（switch）、切换辅助元素（toggle helper）或警报器（siren）的更多信息视图，围绕一个大的开/关切换开关构建。
- [更新](https://www.hasscn.top/contributors/design/more-info/update/): 更新实体（entity）的更多信息视图，包含版本、发行说明以及跳过或安装按钮。

### Helpers

- [场景（Scene）](https://www.hasscn.top/contributors/design/more-info/scene/): 场景的更多信息视图，包含一个“激活”按钮以及场景所控制的实体。
- [定时器](https://www.hasscn.top/contributors/design/more-info/timer/): 定时器辅助元素（helper）的更多信息视图，包含实时倒计时、时长输入框，以及启动、暂停和取消按钮。
- [数字（Number）](https://www.hasscn.top/contributors/design/more-info/number/): 设备的数字（number）实体的更多信息视图，即状态行中的滑块或数字输入框。
- [数字输入辅助元素](https://www.hasscn.top/contributors/design/more-info/input-number/): 数字辅助元素（number helper）、滑块或数字输入框在状态行中的更多信息视图。
- [文本输入辅助元素](https://www.hasscn.top/contributors/design/more-info/input-text/): 文本辅助元素（text helper）的更多信息视图，即状态行中的一个文本输入框。

### Information

- [人员](https://www.hasscn.top/contributors/design/more-info/person/): 人员的更多信息视图，在地图上显示其所在位置。
- [天气](https://www.hasscn.top/contributors/design/more-info/weather/): 天气实体的更多信息视图，包含当前状况、详细信息和预报。
- [太阳](https://www.hasscn.top/contributors/design/more-info/sun/): 太阳的更多信息视图，包含下一次日出和日落、高度角和方位角。

### 开口与安全

- [阀门](https://www.hasscn.top/contributors/design/more-info/valve/): 水阀或气阀的更多信息视图，包含开和关的开关、按钮或位置滑块。
