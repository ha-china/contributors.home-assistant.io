# 长期统计

> 记录器永久保存的传感器数值每小时汇总，例如平均值、最小值和最大值，或累计总量，用于长时间跨度的图表和能源仪表盘。

Source: https://www.hasscn.top/contributors/glossary/statistics/

- In code: `statistics`, `state_class`
- Also: statistics, LTS

Home Assistant 会为每个具有[状态类别](https://www.hasscn.top/contributors/glossary/state-class/)的传感器保存统计数据。与历史记录不同，这些统计数据不会在十天之后被清除。五分钟的汇总也会被保存，但保存时长与历史记录相同。

## Related terms

- [Recorder（记录器）](https://www.hasscn.top/contributors/glossary/recorder/): 将状态和事件的历史记录存储到数据库中的集成。
- [状态类（state class）](https://www.hasscn.top/contributors/glossary/state-class/): 传感器的值如何表现，例如 `measurement` 或 `total_increasing`，以便 Home Assistant 能为其保留长期统计信息。
