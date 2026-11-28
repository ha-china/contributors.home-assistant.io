# 记录支持的功能

> Gold 规则 docs-supported-functions：文档描述了集成（integration）提供的实体（entity）和功能。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-supported-functions/

这是一条 Gold 级规则。在 `quality_scale.yaml` 中，它被称为 `docs-supported-functions`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成页面描述了该集成提供的功能：它在每个平台上提供的实体、每个实体的作用，以及在哪些设备上可用。请按实体类型对列表进行排序；当集成支持的设备差异很大时，也可以按设备排序。

## 为什么这很重要

用户希望在购买设备之前知道自己会得到什么。想要一台可以监控的冰箱的用户，如果在购买后才发现集成只报告门是否打开、而不报告温度，会感到失望。一份清晰的实体列表能够设定正确的预期。

该列表还能帮助已经拥有该设备的用户找到他们要找的实体，并理解其含义。

## 示例

按实体类型排序：

```markdown
## Supported functionality

### Buttons

- **Start backflush**
  - **Description**: Starts the backflush of the machine. Turn the
    paddle within 15 seconds after you press it.
  - **Available for machines**: all

### Sensors

- **Coffee temperature**
  - **Description**: Current temperature of the coffee boiler.
  - **Available for machines**: all
- **Steam temperature**
  - **Description**: Current temperature of the steam boiler.
  - **Available for machines**: Micra, GS3
  - **Remarks**: Disabled by default.
```

按设备排序：

```markdown
## Supported functionality

### Air purifier

#### Sensors

- **Filter life remaining**: The remaining life of the filter, in days.
- **Purified volume**: The volume of air the purifier cleaned, in cubic
  meters. Disabled by default.

#### Numbers

- **Favorite level**: The fan level of the favorite mode, from 0 to 10.
```

关于该部分应放在哪里，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 如何检查

在审查中检查，通常是在文档的拉取请求（pull request）上进行。

## 例外情况

此规则没有例外。
