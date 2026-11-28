# 实体类别（entity category）

> 将实体标记为配置或诊断类别，使其不会显示在设备的主要控制项旁边。

Source: https://www.hasscn.top/contributors/glossary/entity-category/

- In code: `EntityCategory.CONFIG`, `EntityCategory.DIAGNOSTIC`
- In the UI: Configuration, Diagnostic
- Also: entity categories

设备的某项设置（例如其状态指示灯的亮度）是一个配置实体。用于故障排查的信息（例如信号强度）是一个诊断实体。没有类别的实体则是主要的控制项和传感器。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [设备](https://www.hasscn.top/contributors/glossary/device/): 一个物理设备或一项服务，一个或多个实体（entity）归属于它，例如带有温度传感器和湿度传感器的恒温器。
