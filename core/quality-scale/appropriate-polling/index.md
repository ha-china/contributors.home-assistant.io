# 以适当的间隔轮询

> 铜牌规则 appropriate-polling：轮询型集成使用与其数据相匹配的间隔。

Source: https://www.hasscn.top/contributors/core/quality-scale/appropriate-polling/

这是一条铜牌（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `appropriate-polling`。

如果集成会[轮询](https://www.hasscn.top/contributors/glossary/polling/)设备或服务，则应设置一个与数据相匹配的轮询间隔。该间隔是作为开发者的你为大多数用户做出的选择，而不是配置流程中的字段。

## 为什么这很重要

在理想世界中，每台设备都会主动推送更新。但许多设备和服务无法做到这一点，因此 Home Assistant 必须主动询问。询问过于频繁会在两端浪费资源，还可能导致用户被云服务限流。

什么才是合适的取决于数据本身。空气质量传感器不会每 5 秒就发生变化：对于几乎所有人来说，每分钟轮询一次就已经足够。而对于每小时才更新一次太阳能发电量的云服务来说，每分钟被轮询一次毫无益处。

确实需要不同间隔的用户可以通过自动化（automation）[定义自己的轮询间隔](https://www.home-assistant.io/common-tasks/general/#defining-a-custom-polling-interval)。

## 示例

使用[协调器](https://www.hasscn.top/contributors/glossary/coordinator/)（coordinator）时，在创建它时传入 `update_interval`：

```python
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """Fetch data for My integration."""

    config_entry: MyConfigEntry

    def __init__(self, hass: HomeAssistant, entry: MyConfigEntry) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
```

自行轮询的实体（entity）（即 `should_poll` 设置为 `True` 的实体）会使用其平台模块中的 `SCAN_INTERVAL` 常量：

```python
SCAN_INTERVAL = timedelta(minutes=1)


class MySensor(SensorEntity):
    """A sensor that polls by itself."""

    _attr_should_poll = True
```

## 如何检查

- 当配置流程要求填写轮询间隔（例如 `CONF_SCAN_INTERVAL` 或 `update_interval`）时，Pylint 会发出警告（`home-assistant-config-flow-polling-field`）。
- 间隔本身是否合适会在审查中检查。请准备好解释你的选择。

## 例外情况

如果集成不进行轮询，例如因为设备会主动推送更新，则此规则不适用。

## 相关规则

- [parallel-updates](https://www.hasscn.top/contributors/core/quality-scale/parallel-updates/)：设置并行更新的数量。
