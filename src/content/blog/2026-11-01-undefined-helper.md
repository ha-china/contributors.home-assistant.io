---
title: 未定义哨兵值变更
description: 弃用 UNDEFINED 和 UndefinedType，改用 Undefined
date: 2026-11-01
authors:
  - Marc Mueller
areas:
  - core
---

自 Home Assistant Core 2026.12 起，`UNDEFINED` 和 `UndefinedType` 辅助元素（helper）已弃用，建议改用 `Undefined`。

```python
# old
from homeassistant.helpers.typing import UNDEFINED, UndefinedType

def some_function(
    variable: str | UndefinedType | None = UNDEFINED,
) -> None:
    ...
```

```python
# new
from homeassistant.helpers.typing import Undefined

def some_function(
    variable: str | Undefined | None = Undefined,
) -> None:
    ...
```
