# 将通用模式放在通用模块中

> 铜牌规则 common-modules：协调器（coordinator）位于 coordinator.py 中，基础实体（entity）位于 entity.py 中。

Source: https://www.hasscn.top/contributors/core/quality-scale/common-modules/

这是一条铜牌（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `common-modules`。

许多集成（integration）共享的模式位于每个集成中同一个模块里。[协调器（coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/)放在 `coordinator.py` 中。由所有平台（platform）的实体（entity）共享的基础实体类放在 `entity.py` 中。

## 为什么这很重要

一致性让核心代码更容易上手。当每个集成都将协调器放在 `coordinator.py` 中时，你就能知道在一个从未见过的集成中应该去哪里查找。这能帮助审查者，帮助下一位贡献者，也帮助你在一年后回头查看自己的代码。

基础实体还能消除重复代码：设备信息、命名以及与协调器的关联只需编写一次，而不是每个平台各写一次。

## 示例

`coordinator.py` 存放协调器：

```python
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """Fetch data for My integration."""

    config_entry: MyConfigEntry

    def __init__(
        self, hass: HomeAssistant, entry: MyConfigEntry, client: MyClient
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
        self.client = client

    async def _async_update_data(self) -> MyData:
        """Fetch the latest data."""
        return await self.client.get_data()
```

`entity.py` 存放每个平台赖以构建的基础实体：

```python
class MyEntity(CoordinatorEntity[MyCoordinator]):
    """Base entity for My integration."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: MyCoordinator) -> None:
        """Initialize the entity."""
        super().__init__(coordinator)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, coordinator.data.serial)},
            name=coordinator.data.name,
        )
```

## 如何进行检查

- Pylint 会建议将类移动到它所属的模块（`home-assistant-enforce-class-module`）。它会标记位于 `coordinator.py` 之外的 `DataUpdateCoordinator` 子类，以及位于 `entity.py` 之外、直接派生自 `Entity` 或 `CoordinatorEntity` 等类的基础实体。后一项检查会跳过定义了实体平台（entity platform）的集成，例如 `light`。
- 其余内容在代码审查中进行检查。

## 例外情况

这条规则没有例外。没有协调器或基础实体的集成只是没有需要移动的内容而已。
