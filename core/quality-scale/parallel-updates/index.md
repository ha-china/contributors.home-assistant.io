# 设置并行更新的数量

> 白银规则 parallel-updates：每个实体平台都设置 PARALLEL_UPDATES。

Source: https://www.hasscn.top/contributors/core/quality-scale/parallel-updates/

这是一条白银规则（Silver rule）。在 `quality_scale.yaml` 中，它被称为 `parallel-updates`。

集成的每个[平台（platform）](https://www.hasscn.top/contributors/glossary/platform/)模块，例如 `sensor.py` 或 `light.py`，都必须显式设置 `PARALLEL_UPDATES`。它是 Home Assistant 同时运行该平台的实体（entity）更新和实体操作（action）的最大数量。`0` 表示没有限制。

## 为什么这很重要

有些设备和服务无法同时处理大量请求。一台拥有十个实体的小型设备，当十个实体在同一时刻更新，或者当某个场景同时打开它的十个开关时，可能会不堪重负。`PARALLEL_UPDATES` 可以让 Home Assistant 将它们排入队列。

显式设置它也意味着有人认真思考过这个问题。正确的值取决于设备，而只有集成才了解这一点。

## 示例

每个实体都需要与设备通信的平台一次只发送一个请求：

```python
PARALLEL_UPDATES = 1


class MySwitch(SwitchEntity):
    """A switch on the device."""
```

使用[协调器（coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/)时，数据已经在一处统一获取，因此实体更新不需要限制。在只读平台上，例如 `sensor` 或 `binary_sensor`，将其设置为 `0`：

```python
# The coordinator fetches the data, so updates need no limit
PARALLEL_UPDATES = 0
```

不过，协调器并不会限制操作。在有操作的平台上，例如 `switch` 或 `light`，请考虑设备一次能接受多少条命令，并据此设置相应的值。

## 如何检查

- Pylint，当该规则标记为 `done` 时：每个平台模块都必须定义模块级别的 `PARALLEL_UPDATES`（`home-assistant-missing-parallel-updates`）。
- 该值是否适合设备，则在代码审查中检查。

## 例外情况

如果集成没有实体平台，则该规则不适用。

## 相关规则

- [appropriate-polling](https://www.hasscn.top/contributors/core/quality-scale/appropriate-polling/)：以合适的间隔进行轮询。
