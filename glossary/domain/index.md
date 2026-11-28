# 域（Domain）

> 集成的简短唯一标识符，例如 `hue` 或 `light`。它也是每个实体 ID 的第一部分。

Source: https://www.hasscn.top/contributors/glossary/domain/

- In code: `DOMAIN`, `"domain" in manifest.json`

域（domain）是集成所在文件夹的名称，也是其清单文件中 `domain` 键的值。它为小写，单词之间使用下划线，并且一旦集成发布就永远不会更改。

实体（entity）也有域：即实体的类型，例如 `light.kitchen` 中的 `light`。这是定义该实体类型的集成的域，而不是提供该实体的集成的域。一个 Hue 灯泡是 `light.living_room`，而不是 `hue.living_room`。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [实体 ID（Entity ID）](https://www.hasscn.top/contributors/glossary/entity-id/): 实体的 ID：由域（domain）和对象 ID 组成，例如 `light.kitchen`。
- [平台（Platform）](https://www.hasscn.top/contributors/glossary/platform/): 集成如何提供一种类型的实体，例如 Hue 集成的 `light` 平台。也用于集成平台，即插入另一个集成的文件。
