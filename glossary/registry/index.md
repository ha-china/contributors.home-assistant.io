# 注册表

> Home Assistant 存储其对实体、设备、区域、楼层和标签所知信息的地方，以及用户对这些内容所做的更改。

Source: https://www.hasscn.top/contributors/glossary/registry/

- In code: `er.async_get`, `dr.async_get`, `entity_registry`, `device_registry`
- Also: registries, entity registry, device registry

每种内容都有一个对应的注册表（registry）：实体注册表（entity registry）、设备注册表（device registry）、区域注册表（area registry）等等。它们存储在 `.storage` 中，并在重启后依然保留。

用户的更改保存在注册表中，而不是集成（integration）中。当用户重命名一个实体（entity）时，集成无需知晓。

## Related terms

- [唯一 ID（Unique ID）](https://www.hasscn.top/contributors/glossary/unique-id/): 集成分配给实体（entity）或配置条目（config entry）的一个 ID，它永远不会改变，因此 Home Assistant 在重启后仍能识别它。
- [设备](https://www.hasscn.top/contributors/glossary/device/): 一个物理设备或一项服务，一个或多个实体（entity）归属于它，例如带有温度传感器和湿度传感器的恒温器。
- [区域](https://www.hasscn.top/contributors/glossary/area/): 家中一个房间或空间，例如厨房，设备和实体归属于其中。
- [标签](https://www.hasscn.top/contributors/glossary/label/): 用户放在实体（entity）、设备（device）、区域（area）、自动化（automation）等对象上的标记，用于按自己的方式对它们进行分组，例如所有耗电量大的设备。
