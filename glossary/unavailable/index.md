# 不可用（Unavailable）

> 实体（entity）的一种特殊状态，表示 Home Assistant 目前无法访问它。与之相对的 unknown 状态表示可以访问但尚无值。

Source: https://www.hasscn.top/contributors/glossary/unavailable/

- In code: `STATE_UNAVAILABLE`, `STATE_UNKNOWN`, `available`
- Also: unknown

当设备离线或 API 调用失败时，集成（integration）会通过将 `available` 设置为 `False` 来将其实体标记为不可用。它绝不会报告一个编造的值来代替。

## Related terms

- [状态](https://www.hasscn.top/contributors/glossary/state/): 实体（entity）的当前值，例如 `on`、`21.5` 或 `playing`，连同其属性一起。
- [协调器（Coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/): 一种辅助元素（helper），按计划一次性为多个实体（entity）获取数据，从而只需向设备或 API 请求一次，而不是每个实体各请求一次。
