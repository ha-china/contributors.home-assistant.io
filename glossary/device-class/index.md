# 设备类别

> 实体（entity）测量什么或是什么，例如 `temperature` 或 `door`。它决定了图标、单位，以及前端如何显示该实体。

Source: https://www.hasscn.top/contributors/glossary/device-class/

- In code: `device_class`, `SensorDeviceClass`, `BinarySensorDeviceClass`
- Also: device classes

具有 `door` 设备类别（device class）的二进制传感器（binary sensor）会显示为“打开”和“关闭”，而不是“开”和“关”。具有 `temperature` 设备类别的传感器会获得正确的图标，并转换为用户选择的单位。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [状态类（state class）](https://www.hasscn.top/contributors/glossary/state-class/): 传感器的值如何表现，例如 `measurement` 或 `total_increasing`，以便 Home Assistant 能为其保留长期统计信息。
