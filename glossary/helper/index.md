# 辅助元素（Helper）

> 用户在 UI 中创建的一种实体（entity），用于保存某个值或组合其他实体，例如开关、数字、计时器或分组。

Source: https://www.hasscn.top/contributors/glossary/helper/

- In code: `input_boolean`, `input_number`, `input_select`, `timer`
- Also: helpers

许多辅助元素本身就是独立的集成（integration），例如 `input_boolean`、`input_number` 或 `timer`。另一些辅助元素则用于组合实体，例如分组（group）或模板传感器（template sensor）。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [模板](https://www.hasscn.top/contributors/glossary/template/): 一段 Jinja2 代码片段，根据状态计算出某个值，例如几个传感器的平均温度。
