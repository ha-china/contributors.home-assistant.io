# Recorder（记录器）

> 将状态和事件的历史记录存储到数据库中的集成。

Source: https://www.hasscn.top/contributors/glossary/recorder/

- In code: `recorder`, `home-assistant_v2.db`
- Also: database

历史图表、日志簿和长期统计数据都从 Recorder（记录器）的数据库中读取数据。默认情况下，它保留十天的历史记录。

## Related terms

- [长期统计](https://www.hasscn.top/contributors/glossary/statistics/): 记录器永久保存的传感器数值每小时汇总，例如平均值、最小值和最大值，或累计总量，用于长时间跨度的图表和能源仪表盘。
- [状态](https://www.hasscn.top/contributors/glossary/state/): 实体（entity）的当前值，例如 `on`、`21.5` 或 `playing`，连同其属性一起。
- [事件（Event）](https://www.hasscn.top/contributors/glossary/event/): 事件总线（event bus）上的一条消息，表示发生了某件事情，例如状态变化或按钮按下。任何代码都可以监听事件。
