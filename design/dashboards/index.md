# 仪表盘

> 什么是仪表盘和卡片，如何选择合适的卡片，以及每张卡片遵循的原则。

Source: https://www.hasscn.top/contributors/design/dashboards/

仪表盘（dashboard）是 Home Assistant 的主屏幕：人们每天都会在这里查看家中动态并控制家居。仪表盘由卡片（card）构建而成。每张卡片只做一件事，比如显示一盏灯、一个图表或天气。

每张卡片在这里都有一个专属页面，供设计师和前端开发者共同使用。首先是**用法**：何时使用该卡片、哪些选项会改变其外观，以及在其中放置什么内容。**配置**列出各个选项，并附有 YAML 示例。**代码实现**告诉你该卡片在前端中的位置。这些页面上的示例是来自前端的真实卡片，运行在一个虚拟的家中，可切换应用的浅色或深色主题。

## 视图与分区

仪表盘有一个或多个视图（view），即顶部的标签页。默认的视图类型是分区视图（sections view）：卡片放置在分区（section）中，每个分区是一个 12 列的网格。分区的宽度在 320 到 500 像素之间，随着屏幕变宽，视图会增加分区的列数。

分区中的行高为 56 像素，行间距为 8 像素。每张卡片都会告诉网格它需要多少列和行，以及它的最小值是多少。一个磁贴卡片（tile card）占用半个分区和一行，因此两个磁贴可以并排放置。人们可以在编辑器中调整卡片大小，但受卡片自身设置的限制。

较旧的视图（如瀑布流视图）根据卡片高度将其放置在列中。它们仍然可用，但新仪表盘从分区开始。

## 选择卡片

从[磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)开始。它显示一个实体（entity）、其状态（state），并通过功能（feature）提供人们所需的控制。当你将一个实体添加到分区时，它会变成一个磁贴，Home Assistant 为你构建的仪表盘也主要由磁贴组成。大多数情况下，磁贴就是正确的答案。

当磁贴无法胜任时，选择其他卡片：

- 展示随时间变化的内容，比如过去一天的温度：[历史图表卡片](https://www.hasscn.top/contributors/design/dashboards/history-graph-card/)或[传感器卡片](https://www.hasscn.top/contributors/design/dashboards/sensor-card/)。
- 针对单个设备的大型、聚焦的控制：[温控器卡片](https://www.hasscn.top/contributors/design/dashboards/thermostat-card/)、[灯光卡片](https://www.hasscn.top/contributors/design/dashboards/light-card/)或[媒体控制卡片](https://www.hasscn.top/contributors/design/dashboards/media-control-card/)。
- 在狭小空间内展示多个实体，比如一列设置项：[实体组卡片](https://www.hasscn.top/contributors/design/dashboards/entities-card/)。
- 展示不是实体的内容，比如文本或网页：[Markdown 卡片](https://www.hasscn.top/contributors/design/dashboards/markdown-card/)或[网页卡片](https://www.hasscn.top/contributors/design/dashboards/iframe-card/)。
- 在一组卡片上方显示标题：[标题卡片](https://www.hasscn.top/contributors/design/dashboards/heading-card/)。

## 卡片原则

这些原则源自前端中卡片的工作方式。在设计新卡片或修改现有卡片时，请遵循它们。

- **适应网格。** 卡片以分区网格的列和行来定义自身大小，而不是以像素。为它提供一个合理的默认大小和最小值，并确保人们在调整其大小时它依然美观。
- **跟随状态。** 卡片使用实体状态的图标和颜色，因此一盏开着的灯在每张卡片上看起来都一样。不要为状态已经表达的内容发明新颜色。
- **一次点击，一个预期结果。** 默认情况下，选择一个实体会打开其更多信息对话框。快捷操作（比如从磁贴的图标切换灯光）应放在人们预期它们出现的位置。大多数显示实体的卡片都支持 `tap_action`、`hold_action` 和 `double_tap_action`，因此人们可以更改点击后的行为。
- **复用功能。** 卡片内的控件是卡片功能（feature），比如亮度滑块或窗帘的按钮。一个功能只需构建一次，磁贴卡片、区域卡片、温控器卡片和加湿器卡片都可以使用它。在添加新卡片之前，先考虑添加一个功能。
- **只显示存在的内容。** 卡片会隐藏实体不支持的内容，比如只支持调光的灯的颜色控件。不要显示毫无作用的控件。
- **出现问题时如实呈现。** 当实体不可用时，卡片会如实显示并变灰。当配置有误时，卡片会变成一个错误卡片，说明缺少什么。
- **支持可视化编辑。** 每张卡片都有可视化编辑器，因此人们无需 YAML 即可完成设置。新选项需要在编辑器中有对应的字段。

## 实体卡片

- [磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)：一个实体、其状态及其控件。默认选择。
- [实体卡片](https://www.hasscn.top/contributors/design/dashboards/entity-card/)：一个实体的状态，大而清晰。
- [按钮卡片](https://www.hasscn.top/contributors/design/dashboards/button-card/)：针对一个实体或操作的大按钮。
- [实体组卡片](https://www.hasscn.top/contributors/design/dashboards/entities-card/)：实体列表，每行一个。
- [概览卡片](https://www.hasscn.top/contributors/design/dashboards/glance-card/)：一目了然地显示几个实体的状态。
- [实体筛选卡片](https://www.hasscn.top/contributors/design/dashboards/entity-filter-card/)：只显示处于特定状态的实体。

## 控制

- [灯光卡片](https://www.hasscn.top/contributors/design/dashboards/light-card/)：一盏灯的亮度，以旋钮呈现。
- [温控器卡片](https://www.hasscn.top/contributors/design/dashboards/thermostat-card/)：目标温度，以旋钮呈现。
- [加湿器卡片](https://www.hasscn.top/contributors/design/dashboards/humidifier-card/)：目标湿度，以旋钮呈现。
- [警报面板卡片](https://www.hasscn.top/contributors/design/dashboards/alarm-panel-card/)：通过键盘布防和撤防警报。
- [媒体控制卡片](https://www.hasscn.top/contributors/design/dashboards/media-control-card/)：正在播放的内容，以及播放控制。
- [待办事项卡片](https://www.hasscn.top/contributors/design/dashboards/todo-list-card/)：待办事项列表中的条目。

## 信息

- [传感器卡片](https://www.hasscn.top/contributors/design/dashboards/sensor-card/)：传感器的数值，附带小图表。
- [仪表卡片](https://www.hasscn.top/contributors/design/dashboards/gauge-card/)：以旋钮显示单个数值。
- [历史图表卡片](https://www.hasscn.top/contributors/design/dashboards/history-graph-card/)：状态随时间的变化。
- [天气预报卡片](https://www.hasscn.top/contributors/design/dashboards/weather-forecast-card/)：当前天气，以及未来数天或数小时的预报。
- [地图卡片](https://www.hasscn.top/contributors/design/dashboards/map-card/)：人和物的位置。
- [Markdown 卡片](https://www.hasscn.top/contributors/design/dashboards/markdown-card/)：以 Markdown 编写的文本。
- [植物状态卡片](https://www.hasscn.top/contributors/design/dashboards/plant-status-card/)：植物的生长状况。
- [时钟卡片](https://www.hasscn.top/contributors/design/dashboards/clock-card/)：时间，数字或模拟样式。

## 分组与布局

- [标题卡片](https://www.hasscn.top/contributors/design/dashboards/heading-card/)：为一组卡片提供标题。
- [区域卡片](https://www.hasscn.top/contributors/design/dashboards/area-card/)：一个区域（area），及其传感器和控件。
- [网格与堆叠卡片](https://www.hasscn.top/contributors/design/dashboards/grid-card/)：以网格、行或列排列的卡片。
- [条件卡片](https://www.hasscn.top/contributors/design/dashboards/conditional-card/)：仅在满足条件时显示的卡片。

## 媒体与图片

- [图片卡片](https://www.hasscn.top/contributors/design/dashboards/picture-card/)：被选中时会执行操作的图片。
- [图片实体卡片](https://www.hasscn.top/contributors/design/dashboards/picture-entity-card/)：以图片或摄像头画面显示的实体。
- [图片概览卡片](https://www.hasscn.top/contributors/design/dashboards/picture-glance-card/)：一张图片，顶部带有一行实体。
- [图片元素卡片](https://www.hasscn.top/contributors/design/dashboards/picture-elements-card/)：放置在图片上的实体和操作，比如平面图。
- [网页卡片](https://www.hasscn.top/contributors/design/dashboards/iframe-card/)：嵌入仪表盘内的网页。

## All pages in this section

### Entity cards

- [实体卡片](https://www.hasscn.top/contributors/design/dashboards/entities-card/): 实体卡片以列表形式显示实体，每行一个，每行都带有适合该实体的控件。它是在一张卡片中紧凑地显示多个实体的方式。
- [实体卡片（entity card）](https://www.hasscn.top/contributors/design/dashboards/entity-card/): 实体卡片以大号数值显示一个实体的状态，并附带其名称和图标。它专为希望一目了然读取的数字而设计。
- [实体筛选卡片](https://www.hasscn.top/contributors/design/dashboards/entity-filter-card/): 实体筛选卡片只显示列表中符合筛选条件的实体，例如已打开的灯。它会包装另一张卡片，默认为实体卡片。
- [按钮卡片](https://www.hasscn.top/contributors/design/dashboards/button-card/): 按钮卡片是一个带有图标和名称的大方形按钮。它执行一个操作，例如切换灯的开关或激活一个场景。
- [概览卡片（Glance card）](https://www.hasscn.top/contributors/design/dashboards/glance-card/): 概览卡片并排显示多个实体的状态，每个实体包括名称、图标和状态。它是一眼就能读完的概览。
- [磁贴卡片（Tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/): 磁贴卡片显示一个实体（entity）的图标、名称和状态，并可以为其添加控件。它几乎是所有内容的默认卡片。

### Controls

- [加湿器卡片](https://www.hasscn.top/contributors/design/dashboards/humidifier-card/): 加湿器卡片以表盘形式显示加湿器或除湿器，用于查看湿度并设置目标湿度。
- [媒体控制卡片](https://www.hasscn.top/contributors/design/dashboards/media-control-card/): 媒体控制卡片显示媒体播放器正在播放的内容，包括封面图片、控制按钮和播放进度。
- [待办事项列表卡片](https://www.hasscn.top/contributors/design/dashboards/todo-list-card/): 待办事项列表卡片显示待办事项列表中的条目，可以勾选完成、添加新条目以及重新排序。
- [恒温器卡片](https://www.hasscn.top/contributors/design/dashboards/thermostat-card/): 恒温器卡片将气候或热水器实体显示为一个旋钮，用于读取温度并设置目标温度。
- [报警面板卡片](https://www.hasscn.top/contributors/design/dashboards/alarm-panel-card/): 报警面板卡片可布防和撤防报警系统，并提供用于输入密码的数字键盘。
- [灯光卡片](https://www.hasscn.top/contributors/design/dashboards/light-card/): 灯光卡片将一盏灯显示为一个大的圆形按钮，周围有一个用于设置亮度的圆环。

### Information

- [Markdown 卡片](https://www.hasscn.top/contributors/design/dashboards/markdown-card/): Markdown 卡片显示用 Markdown 编写的文本，并作为模板渲染，因此可以将固定文本与实时状态混合在一起。
- [仪表盘卡片（Gauge card）](https://www.hasscn.top/contributors/design/dashboards/gauge-card/): 仪表盘卡片在一个表盘上显示一个数值，并用颜色标示良好、需要注意或糟糕的范围。
- [传感器卡片](https://www.hasscn.top/contributors/design/dashboards/sensor-card/): 传感器卡片以大号字体显示一个数值传感器的值，并在下方可选显示其近期历史的折线图。
- [历史图表卡片](https://www.hasscn.top/contributors/design/dashboards/history-graph-card/): 历史图表卡片显示一个或多个实体（entity）的状态在过去几小时内的变化情况，数值以折线图呈现，其他内容则以时间线呈现。
- [地图卡片](https://www.hasscn.top/contributors/design/dashboards/map-card/): 地图卡片在交互式地图上显示人员、设备和地理位置区域（zone）的位置，并可选显示它们曾经到过的轨迹。
- [天气预报卡片](https://www.hasscn.top/contributors/design/dashboards/weather-forecast-card/): 天气预报卡片显示当前天气以及来自天气实体（entity）的未来几天或几小时的预报。
- [时钟卡片](https://www.hasscn.top/contributors/design/dashboards/clock-card/): 时钟卡片以数字或模拟时钟的形式显示当前时间，并可选择显示日期。
- [植物状态卡片](https://www.hasscn.top/contributors/design/dashboards/plant-status-card/): 植物状态卡片显示植物的读数，例如湿度和光照，并指出需要关注的那一项。

### Grouping and layout

- [区域卡片](https://www.hasscn.top/contributors/design/dashboards/area-card/): 区域卡片汇总家中的一个区域，包括其图片、传感器和警报，并可为其中的一切添加控制。
- [条件卡片](https://www.hasscn.top/contributors/design/dashboards/conditional-card/): 条件卡片（conditional card）仅在其条件满足时显示另一张卡片，例如灯处于开启状态，或屏幕足够宽。
- [标题卡片](https://www.hasscn.top/contributors/design/dashboards/heading-card/): 标题卡片在一组卡片上方显示标题，并可通过可选的徽章显示该组的状态。
- [网格卡片和堆叠卡片](https://www.hasscn.top/contributors/design/dashboards/grid-card/): 网格卡片、水平堆叠卡片和垂直堆叠卡片用于容纳其他卡片，将它们并排或上下排列为一张卡片。

### Media and pictures

- [图片元素卡片](https://www.hasscn.top/contributors/design/dashboards/picture-elements-card/): 图片元素卡片可将图标、标签、徽章和按钮放置在图片上的任意位置，例如平面图上的灯具。
- [图片卡片](https://www.hasscn.top/contributors/design/dashboards/picture-card/): 图片卡片显示一张图片，并且可以在你选中它时执行操作，比如打开另一个视图。
- [图片概览卡片](https://www.hasscn.top/contributors/design/dashboards/picture-glance-card/): 图片概览卡片显示一张图片，底部有一排实体图标，可一目了然地查看和控制一个房间或摄像头画面。
- [实体图片卡片](https://www.hasscn.top/contributors/design/dashboards/picture-entity-card/): 实体图片卡片将一个实体显示为图片，并在底部的栏上显示其名称和状态。它是适用于摄像头的卡片。
- [网页卡片](https://www.hasscn.top/contributors/design/dashboards/iframe-card/): 网页卡片通过 iframe 在仪表盘中嵌入另一个网页。
