# 平台（Platform）

> 集成如何提供一种类型的实体，例如 Hue 集成的 `light` 平台。也用于集成平台，即插入另一个集成的文件。

Source: https://www.hasscn.top/contributors/glossary/platform/

- In code: `Platform.LIGHT`, `light.py`
- Also: platforms, entity platform, integration platform

**实体平台（entity platform）**是集成中提供一种类型实体的部分。Hue 集成有一个用于灯的 `light.py` 和一个用于传感器的 `sensor.py`：即它的 `light` 和 `sensor` 平台。

**集成平台（integration platform）**是让一个集成插入另一个集成的文件，例如用于[诊断（diagnostics）](https://www.hasscn.top/contributors/glossary/diagnostics/)的 `diagnostics.py` 或用于修复（repairs）的 `repairs.py`。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [域（Domain）](https://www.hasscn.top/contributors/glossary/domain/): 集成的简短唯一标识符，例如 `hue` 或 `light`。它也是每个实体 ID 的第一部分。
