# 为实体提供唯一 ID

> 青铜规则 entity-unique-id：每个实体都有一个唯一 ID，以便用户可以对其进行自定义。

Source: https://www.hasscn.top/contributors/core/quality-scale/entity-unique-id/

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `entity-unique-id`。

集成的每个实体（entity）都必须拥有一个[唯一 ID（unique ID）](https://www.hasscn.top/contributors/glossary/unique-id/)。该 ID 必须是稳定的：同一个实体在重启、重新加载或固件更新之后获得的 ID 保持不变。请使用设备或服务提供的某些信息，例如序列号或 MAC 地址，并结合一个表示该实体所测量内容的键。

## 为什么重要

实体[注册表（registry）](https://www.hasscn.top/contributors/glossary/registry/)通过唯一 ID 在重启之后记住各个实体。正是这一点让用户能够重命名实体、更改其实体 ID、所属区域、图标或单位，并保留这些更改。没有唯一 ID，这一切都无法实现，这样的实体也不过是屏幕上的一个数值而已。

唯一 ID 只需要在每个集成和每个平台内保持唯一即可。不要把集成的域名（domain）或平台（platform）放入其中：注册表已经同时包含了这两者。

## 示例

在创建实体时设置 `_attr_unique_id`：

```python
class MySensor(SensorEntity):
    """Temperature sensor of a device."""

    def __init__(self, device: MyDevice) -> None:
        """Initialize the sensor."""
        self._attr_unique_id = f"{device.serial_number}_temperature"
```

使用[实体描述（entity description）](https://www.hasscn.top/contributors/glossary/entity-description/)时，常见的模式是设备序列号加上该描述的 `key`。

避免使用 IP 地址、主机名以及用户可以更改的名称。它们会发生变化，而一旦变化，用户就会丢失他们的自定义设置。在发布之后更改唯一 ID 的构造方式需要进行迁移（migration），所以从一开始就要做对。

## 如何检查

- Pylint，当该规则为 `done` 时：`home-assistant-missing-entity-unique-id` 会在实体类并非总是设置唯一 ID 时发出警告，而 `home-assistant-entity-unique-id-static` 会在唯一 ID 是固定字符串、且所在集成允许存在多个配置条目（config entry）时发出警告。
- Pylint，针对每个集成：`home-assistant-entity-unique-id-redundant-domain` 和 `home-assistant-entity-unique-id-redundant-platform` 会在唯一 ID 重复了域名或平台时发出警告。
- ID 是否稳定会在审查中检查。

## 例外

如果集成没有任何实体，则此规则不适用。

## 相关规则

- [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/)：防止出现重复的配置条目。
