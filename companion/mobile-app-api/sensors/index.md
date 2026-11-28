# 传感器

> 从应用注册传感器和二进制传感器，更新其状态，并与 Home Assistant 保持启用状态同步。

Source: https://www.hasscn.top/contributors/companion/mobile-app-api/sensors/

应用可以向其在 Home Assistant 中的设备添加自己的传感器和二进制传感器（binary sensor）：电池电量、步数、Wi-Fi 网络，以及设备所知的任何信息。这些传感器完全由应用管理。每个传感器都会成为应用设备的一个实体（entity）。

## 注册传感器

在更新之前，先注册每个传感器。每次请求注册一个传感器：

```json
{
  "type": "register_sensor",
  "data": {
    "type": "sensor",
    "unique_id": "battery_level",
    "name": "Battery level",
    "state": 42,
    "device_class": "battery",
    "unit_of_measurement": "%",
    "state_class": "measurement",
    "entity_category": "diagnostic",
    "icon": "mdi:battery",
    "attributes": {
      "charging": false
    }
  }
}
```

| 键 | 必填 | 类型 | 描述 |
| --- | --- | --- | --- |
| `type` | 是 | string | `sensor` 或 `binary_sensor` |
| `unique_id` | 是 | string | 一个在此注册中唯一的 ID。每次更新都需要它 |
| `name` | 是 | string | 传感器的名称。Home Assistant 会把设备名称放在它前面 |
| `state` | 否 | boolean、number 或 string | 当前状态 |
| `device_class` | 否 | string | [传感器](https://www.hasscn.top/contributors/core/entities/sensor/)或[二进制传感器](https://www.hasscn.top/contributors/core/entities/binary-sensor/)的设备类型 |
| `unit_of_measurement` | 否 | string | 状态的单位 |
| `state_class` | 否 | string | 状态类别。仅适用于传感器，不适用于二进制传感器 |
| `entity_category` | 否 | string | `config` 或 `diagnostic` |
| `icon` | 否 | string | 图标，例如 `mdi:battery`。默认为 `mdi:cellphone` |
| `attributes` | 否 | object | 额外的状态属性 |
| `disabled` | 否 | boolean | 该实体在 Home Assistant 中是否被禁用 |

注册成功会返回 `201` 和 `{"success": true}`。实体会立即出现。

注册一个已存在的传感器也没有问题。如果名称、设备类型、单位、实体类别、图标和启用状态发生了变化，Home Assistant 会更新它们，并像更新一样处理该请求。因此，请一并发送当前的 `state`、`icon` 和 `attributes`：省略 `state` 会使状态变为未知，省略 `icon` 或 `attributes` 会使其恢复为默认值。

## 更新传感器

可以在一次请求中更新任意数量的传感器。`data` 是一个列表：

```json
{
  "type": "update_sensor_states",
  "data": [
    {
      "type": "sensor",
      "unique_id": "battery_level",
      "state": 41,
      "icon": "mdi:battery-40",
      "attributes": {
        "charging": false
      }
    }
  ]
}
```

| 键 | 必填 | 类型 | 描述 |
| --- | --- | --- | --- |
| `type` | 是 | string | `sensor` 或 `binary_sensor` |
| `unique_id` | 是 | string | 注册传感器时使用的 ID |
| `state` | 是 | boolean、number、string 或 `null` | 新状态。字符串 `unavailable` 会将传感器标记为不可用 |
| `icon` | 否 | string | 图标。如果省略，会回退为 `mdi:cellphone`，因此如果设置了图标，请在每次更新时都发送它 |
| `attributes` | 否 | object | 状态属性，会替换旧的属性 |

更新分两步检查：

1. 首先检查整个列表，验证每个传感器的 `type` 是否有效以及是否存在 `unique_id`。如果有一个传感器未通过此检查，整个请求都会被拒绝：你会收到一个带有 `200` 的空 `{}`，并且所有传感器都不会被更新。
2. 然后逐个检查每个传感器。未注册的传感器会以 `not_registered` 失败。只允许使用上表中的键。其他任何内容，例如 `name`，或类型错误的状态，都会使该传感器以 `invalid_format` 失败。其他传感器仍会被更新。

第二步之后，响应中会包含每个 `unique_id` 的结果：

```json
{
  "battery_level": {
    "success": true
  },
  "steps": {
    "success": true,
    "is_disabled": true
  },
  "pressure": {
    "success": false,
    "error": {
      "code": "not_registered",
      "message": "sensor pressure is not registered"
    }
  },
  "light_level": {
    "success": false,
    "error": {
      "code": "invalid_format",
      "message": "<what is wrong>"
    }
  }
}
```

`not_registered` 表示你需要先注册该传感器。`invalid_format` 表示更新不符合模式（schema）。

## 保持启用状态同步

用户可以在 Home Assistant 中禁用实体。被禁用的传感器不值得在手机上继续采集：它只会白白消耗电池电量。因此，应用和 Home Assistant 会在两个方向上保持每个传感器的启用状态同步：

- **用户在应用中开启或关闭某个传感器**：再次为它发送 `register_sensor`，并将 `disabled` 设置为 `true` 或 `false`。
- **应用更新了一个在 Home Assistant 中被禁用的传感器**：更新会成功，但结果中会包含 `"is_disabled": true`。将其视为一个信号，从 Home Assistant 获取启用状态。
- **用户在 Home Assistant 中开启或关闭某个实体**：[`get_config`](https://www.hasscn.top/contributors/companion/mobile-app-api/sending-data/#get_config) 响应中包含 `entities`，它将每个 `unique_id` 映射到其启用状态。在应用中应用它。

```json
{
  "entities": {
    "battery_level": {
      "disabled": false
    },
    "steps": {
      "disabled": true
    }
  }
}
```

官方应用的用户按照[传感器文档](https://companion.home-assistant.io/docs/core/sensors)中所述管理他们的传感器。
