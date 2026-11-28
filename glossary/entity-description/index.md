# 实体描述（entity description）

> 一个包含实体（entity）固定属性的数据类（dataclass），例如其键、翻译键和设备类别（device class），这样许多相似的实体可以共用一个类。

Source: https://www.hasscn.top/contributors/glossary/entity-description/

- In code: `EntityDescription`, `SensorEntityDescription`
- Also: entity descriptions

一个拥有二十个传感器的集成（integration）通常只有一个传感器类，以及一个包含二十个实体描述的列表。每个描述说明了其中一个传感器的不同之处。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [设备类别](https://www.hasscn.top/contributors/glossary/device-class/): 实体（entity）测量什么或是什么，例如 `temperature` 或 `door`。它决定了图标、单位，以及前端如何显示该实体。
- [翻译键（translation key）](https://www.hasscn.top/contributors/glossary/translation-key/): 指向集成（integration）的 `strings.json` 中某段文本的键，以便该文本可以被翻译。集成使用键，而不是代码中的英文文本。
