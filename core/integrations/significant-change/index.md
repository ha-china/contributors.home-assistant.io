# 重大变化

> 告诉导出数据的集成（如语音助手），您的实体类型有哪些状态变化是重要的。

Source: https://www.hasscn.top/contributors/core/integrations/significant-change/

Home Assistant 不仅收集数据，还会将数据发送到其他服务，例如 Google Assistant 和 Alexa。这些服务并不希望收到每一次微小的变化。电池电量减少了 0.1%，或温度变化了 0.1 度，都不值得发送一条消息。重大变化（significant change）支持让您的实体（entity）集成（integration）来决定哪些变化是重要的。

此功能适用于定义实体类型的实体集成，例如 `sensor` 或 `light`。

## 添加支持

最快的方法是使用脚手架（scaffold）脚本：

```shell
python3 -m script.scaffold significant_change
```

或者创建包含 `async_check_significant_change` 的 `significant_change.py`：

```python
from typing import Any

from homeassistant.core import HomeAssistant, callback


@callback
def async_check_significant_change(
    hass: HomeAssistant,
    old_state: str,
    old_attrs: dict,
    new_state: str,
    new_attrs: dict,
    **kwargs: Any,
) -> bool | None:
    """Return whether the change is significant."""
```

当变化重大时返回 `True`，不重大时返回 `False`，无法判断时返回 `None`。Home Assistant 会将 `None` 视为 `True`：只有 `False` 会过滤掉变化。

几点需要了解的事项：

- `old_state` 是最后一个被视为重大的状态（state），而不是上一个状态。累积起来的小变化在某个时点会变得重大。
- 将您已知的所有属性（attribute）都考虑在内，而不仅仅是状态。
- 使用[设备类别（device class）](https://www.hasscn.top/contributors/glossary/device-class/)来区分不同类型的实体：对温度而言重大的变化，对电池而言并不重大。
- Home Assistant 会为您处理 `unknown` 和 `unavailable`。
