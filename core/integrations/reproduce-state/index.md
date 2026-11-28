# 重现状态

> 通过将存储的状态转换回动作调用，让场景与您的实体集成中的实体协同工作。

Source: https://www.hasscn.top/contributors/core/integrations/reproduce-state/

[场景](https://www.hasscn.top/contributors/glossary/scene/)（scene）存储一组实体（entity）的状态，例如“客厅灯光为 30% 且暖白色”。当场景被激活时，Home Assistant 必须通过调用正确的动作（action），将这些状态重新变为现实。它会请求每个实体域（entity domain）的集成（integration）来完成这项工作。

这适用于实体集成，例如 `light` 或 `climate`：即定义实体类型及其动作的集成。而仅提供现有类型实体的集成（例如灯光平台）则不需要它。

## 添加支持

最快的方法是使用脚手架（scaffold）脚本：

```shell
python3 -m script.scaffold reproduce_state
```

或者创建带有 `async_reproduce_states` 的 `reproduce_state.py`：

```python
from collections.abc import Iterable
from typing import Any

from homeassistant.core import Context, HomeAssistant, State


async def async_reproduce_states(
    hass: HomeAssistant,
    states: Iterable[State],
    *,
    context: Context | None = None,
    reproduce_options: dict[str, Any] | None = None,
) -> None:
    """Reproduce the given states."""
```

对于每个状态，将其与实体的当前状态进行比较，如果已经匹配则跳过，并调用相应的动作使实体达到所存储的状态和属性（attribute）。将 `context` 传递给动作调用，以便这些更改与场景相关联。对于无法重现的状态（例如无效的状态值），记录警告并跳过它们。并行执行这些状态，例如使用 `asyncio.gather`，这样包含许多实体的场景就能快速应用。

[switch 集成](https://github.com/home-assistant/core/blob/dev/homeassistant/components/switch/reproduce_state.py) 的 `reproduce_state.py` 是一个简短而完整的示例。
