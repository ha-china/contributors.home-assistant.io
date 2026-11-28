# 天气

> 天气实体的更多信息视图，包含当前状况、详细信息和预报。

Source: https://www.hasscn.top/contributors/design/more-info/weather/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="weather.home"></ha-demo-more-info>
```

## 显示内容

天气实体没有任何可控制的内容，因此其视图纯粹用于阅读。从上到下依次为：

- **当前状况**：一张天气图片、天气状况（例如 **局部多云**），以及多久之前发生了变化。右侧以大号文字显示温度，当预报包含当天最高和最低温度时，会在其下方显示。
- **详细信息**：当前气压、湿度、风速及风向、能见度的列表，每项都带有图标。天气服务未报告的详细信息会被省略。
- **预报**：一行天或小时，每项带有天气图标、温度和最低温度。
- **数据来源**：底部一行显示数据来源，例如 **Weather forecast from met.no**。

当天气服务提供多种类型的预报时，预报上方的标签页可在它们之间切换：**每日**、**每小时**和**每日两次**。上方的天气有每日和每小时预报，因此会有两个标签页。

## 设计说明

- 将鼠标悬停在状况下方的时间上，可以查看状态（state）上次变化的时间和上次更新的时间。
- 每个数值都以天气服务的单位显示，例如 °C 和 km/h。
- 每小时和每日两次的预报会按天对其条目进行分组，每天有一个标题。
- 预报在对话框打开时获取，在到达之前会显示加载指示器。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-weather.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-weather.ts) 中的 `more-info-weather`。预报订阅、单位以及 `getSecondaryWeatherAttribute` 等辅助函数位于 [`src/data/weather.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/weather.ts) 中。

源码：[`more-info-weather.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-weather.ts)
