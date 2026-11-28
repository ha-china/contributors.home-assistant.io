# 实体（Entity）

> Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。

Source: https://www.hasscn.top/contributors/glossary/entity/

- In code: `Entity`, `entity_id`
- Also: entities

实体（entity）是用户看到并使用的东西：在仪表盘上、在自动化中，以及通过语音使用。集成（integration）会创建它们，通常每个[设备](https://www.hasscn.top/contributors/glossary/device/)会有多个实体。

每个实体都有一个类型，例如 `light` 或 `sensor`，类型决定了它能做什么以及外观如何。它的[状态](https://www.hasscn.top/contributors/glossary/state/)是它当前的值，例如 `on` 或 `21.5`。

## Related terms

- [实体 ID（Entity ID）](https://www.hasscn.top/contributors/glossary/entity-id/): 实体的 ID：由域（domain）和对象 ID 组成，例如 `light.kitchen`。
- [状态](https://www.hasscn.top/contributors/glossary/state/): 实体（entity）的当前值，例如 `on`、`21.5` 或 `playing`，连同其属性一起。
- [设备](https://www.hasscn.top/contributors/glossary/device/): 一个物理设备或一项服务，一个或多个实体（entity）归属于它，例如带有温度传感器和湿度传感器的恒温器。
- [平台（Platform）](https://www.hasscn.top/contributors/glossary/platform/): 集成如何提供一种类型的实体，例如 Hue 集成的 `light` 平台。也用于集成平台，即插入另一个集成的文件。
- [唯一 ID（Unique ID）](https://www.hasscn.top/contributors/glossary/unique-id/): 集成分配给实体（entity）或配置条目（config entry）的一个 ID，它永远不会改变，因此 Home Assistant 在重启后仍能识别它。
