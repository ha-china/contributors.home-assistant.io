# 唯一 ID（Unique ID）

> 集成分配给实体（entity）或配置条目（config entry）的一个 ID，它永远不会改变，因此 Home Assistant 在重启后仍能识别它。

Source: https://www.hasscn.top/contributors/glossary/unique-id/

- In code: `unique_id`, `_attr_unique_id`
- Also: unique IDs

拥有唯一 ID 的实体会在实体注册表（entity registry）中获得一个条目。只有这样，用户才能在用户界面中更改其名称、区域（area）、图标和实体 ID。

唯一 ID 来自不会改变的东西，例如序列号或 MAC 地址。而不是名称、IP 地址或主机名：这些是可能改变的。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [注册表](https://www.hasscn.top/contributors/glossary/registry/): Home Assistant 存储其对实体、设备、区域、楼层和标签所知信息的地方，以及用户对这些内容所做的更改。
- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
- [实体 ID（Entity ID）](https://www.hasscn.top/contributors/glossary/entity-id/): 实体的 ID：由域（domain）和对象 ID 组成，例如 `light.kitchen`。
