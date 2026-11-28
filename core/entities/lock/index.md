# 锁实体

> 为智能门锁构建锁实体（lock entity），可进行上锁、解锁，并可选择性地打开门。

Source: https://www.hasscn.top/contributors/core/entities/lock/

锁实体（lock entity）控制一把锁：它可以上锁、解锁，并且在某些锁上，通过收回锁舌来开门。它可以要求输入密码。继承自 `homeassistant.components.lock` 中的 `LockEntity`。

有关前端如何显示锁，请参阅[锁的更多信息视图](https://www.hasscn.top/contributors/design/more-info/lock/)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. A lock that locks, unlocks, and opens the door, in a tile card. The card is live: unlock it, or open the door.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <script type="application/json">
    [
      {
        "entity_id": "lock.front_door",
        "state": "locked",
        "attributes": {
          "friendly_name": "Front door",
          "supported_features": 1
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "lock.front_door",
        "features": [
          {
            "type": "lock-commands"
          },
          {
            "type": "lock-open-door"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 属性

除了[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)之外，锁实体还具有以下属性。每个属性都可以通过其 `_attr_` 属性设置，例如 `_attr_is_locked`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `is_locked` | `bool \| None` | `None` | 锁是否已上锁。 |
| `is_locking` | `bool \| None` | `None` | 锁是否正在上锁过程中。 |
| `is_unlocking` | `bool \| None` | `None` | 锁是否正在解锁过程中。 |
| `is_open` | `bool \| None` | `None` | 锁是否已解锁并释放了锁舌。 |
| `is_opening` | `bool \| None` | `None` | 锁是否正在释放锁舌过程中。 |
| `is_jammed` | `bool \| None` | `None` | 锁是否尝试移动（上锁、解锁或打开）但未完成时卡住。 |
| `code_format` | `str \| None` | `None` | 密码必须匹配的正则表达式，如 `^\d{4}$`。`None` 表示锁不需要密码。 |
| `changed_by` | `str \| None` | `None` | 最后更改锁的人或物，如用户名或键盘。 |

## 密码

设置 `code_format` 后，Home Assistant 会在调用你的方法之前，将上锁、解锁或开门操作中提供的密码与该正则表达式进行比对，不匹配时会抛出验证错误。对于未提供密码的操作同样会执行此检查：空密码也必须匹配 `code_format`，因此像 `^\d{4}$` 这样的模式会使每个操作都必须提供密码。你的方法会通过 `kwargs` 中的 `ATTR_CODE` 接收密码，且仅在存在密码时才会传入，因此当密码为可选项时，请使用 `kwargs.get(ATTR_CODE)` 读取它。

用户可以在实体设置中保存默认密码。当操作未提供密码时，Home Assistant 会使用该默认密码。不匹配 `code_format` 的默认密码会被忽略。你无需为此做任何处理：它会从[实体注册表选项](https://www.hasscn.top/contributors/core/entities/registry/)中读取该设置，并为你添加密码。

## 支持的功能

将 `LockEntityFeature` 标志设置为 `supported_features`。参见[支持的功能](https://www.hasscn.top/contributors/glossary/supported-features/)。

| 值 | 描述 |
| ----- | ----------- |
| `OPEN` | 锁可以打开门锁舌。实现 `open`。 |

## 方法

实现每个方法的同步或异步版本，不要同时实现两者。

| 方法 | 异步版本 | 描述 |
| ------ | ------------- | ----------- |
| `lock(**kwargs: Any)` | `async_lock` | 上锁。 |
| `unlock(**kwargs: Any)` | `async_unlock` | 解锁。 |
| `open(**kwargs: Any)` | `async_open` | 打开门锁舌。需要 `OPEN`。 |

## 状态

状态是一个 `LockState`，按以下顺序取自第一个为 `True` 的属性：

| 值 | 来源 | 描述 |
| ----- | ---- | ----------- |
| `LockState.JAMMED` | `is_jammed` | 锁尝试移动但未完成时卡住。 |
| `LockState.OPENING` | `is_opening` | 锁正在释放锁舌。 |
| `LockState.LOCKING` | `is_locking` | 锁正在上锁。 |
| `LockState.OPEN` | `is_open` | 锁未锁定且已释放锁舌。 |
| `LockState.UNLOCKING` | `is_unlocking` | 锁正在解锁。 |
| `LockState.LOCKED` | `is_locked` 为 `True` | 锁已上锁。 |
| `LockState.UNLOCKED` | `is_locked` 为 `False` | 锁未上锁。 |

当以上条件都不适用且 `is_locked` 为 `None` 时，状态为 `unknown`。

`OPEN` 需要同时满足：锁未锁定，*并且*其锁舌已释放。锁仍锁定时释放锁舌不是打开状态。

## 示例

```python
from typing import Any

from homeassistant.components.lock import LockEntity


class MyLock(LockEntity):
    """A smart lock with a four digit code."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_code_format = r"^\d{4}$"

    def __init__(self, device: MyDevice) -> None:
        """Set up the lock."""
        self._device = device
        self._attr_unique_id = device.serial

    @property
    def is_locked(self) -> bool:
        """Return if the lock is locked."""
        return self._device.locked

    @property
    def is_jammed(self) -> bool:
        """Return if the lock is jammed."""
        return self._device.jammed

    async def async_lock(self, **kwargs: Any) -> None:
        """Lock the lock."""
        await self._device.lock()

    async def async_unlock(self, **kwargs: Any) -> None:
        """Unlock the lock."""
        await self._device.unlock(kwargs["code"])
```
