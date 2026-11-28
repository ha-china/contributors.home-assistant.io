# 实体 ID（Entity ID）

> 实体的 ID：由域（domain）和对象 ID 组成，例如 `light.kitchen`。

Source: https://www.hasscn.top/contributors/glossary/entity-id/

- In code: `entity_id`
- Also: entity IDs, object ID

用户会在自动化、模板和 YAML 中看到并输入实体 ID（entity ID），而且他们可以修改它们。代码绝不应依赖于实体 ID。要识别一个实体，请使用其[唯一 ID（unique ID）](https://www.hasscn.top/contributors/glossary/unique-id/)。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [唯一 ID（Unique ID）](https://www.hasscn.top/contributors/glossary/unique-id/): 集成分配给实体（entity）或配置条目（config entry）的一个 ID，它永远不会改变，因此 Home Assistant 在重启后仍能识别它。
- [域（Domain）](https://www.hasscn.top/contributors/glossary/domain/): 集成的简短唯一标识符，例如 `hue` 或 `light`。它也是每个实体 ID 的第一部分。
