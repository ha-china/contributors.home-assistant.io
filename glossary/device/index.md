# 设备

> 一个物理设备或一项服务，一个或多个实体（entity）归属于它，例如带有温度传感器和湿度传感器的恒温器。

Source: https://www.hasscn.top/contributors/glossary/device/

- In code: `DeviceInfo`, `device_registry`, `device_id`
- Also: devices

集成（integration）使用 `DeviceInfo` 来描述其设备：名称、制造商、型号和版本。Home Assistant 将这些信息保存在设备注册表（device registry）中，用户可以在其中重命名设备并将其归入某个[区域](https://www.hasscn.top/contributors/glossary/area/)（area）。

设备也可以是一项服务，例如天气预报，这样它的实体就会被归为一组。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [注册表](https://www.hasscn.top/contributors/glossary/registry/): Home Assistant 存储其对实体、设备、区域、楼层和标签所知信息的地方，以及用户对这些内容所做的更改。
- [区域](https://www.hasscn.top/contributors/glossary/area/): 家中一个房间或空间，例如厨房，设备和实体归属于其中。
