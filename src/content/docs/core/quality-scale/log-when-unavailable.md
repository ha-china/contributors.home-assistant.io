---
title: 不可用时记录一次日志，恢复时再记录一次
description: "银级规则 log-when-unavailable：集成在连接丢失时记录一次日志，并在连接恢复时再记录一次。"
sidebarLabel: log-when-unavailable
sidebarGroup: Silver
order: 7
---

这是一条银级（Silver）规则。在 `quality_scale.yaml` 中，它被称为 `log-when-unavailable`。

当无法访问设备或服务时，集成（integration）会记录一次日志。当能够再次访问时，集成也会记录一次日志。而不会在期间每次更新失败时都记录。如果您自己编写这些消息，请以 `info` 级别记录。

## 为什么重要

当实体（entity）变为[不可用（unavailable）](/glossary/unavailable/)时，用户会查看日志以找出原因。连接丢失时的一条消息，以及连接恢复时的一条消息，能告诉他们发生了什么以及何时发生。每次轮询失败都记录一条消息会把有用的信息淹没在噪音中，填满日志文件，并掩盖其他问题。

## 示例

### 使用协调器时

协调器（coordinator）会为您完成此操作。当更新失败时，抛出 `UpdateFailedUnreachable`。协调器在第一次失败时以 `info` 级别记录日志，在失败持续期间保持静默，并在数据获取恢复时以 `info` 级别记录日志：

```python
async def _async_update_data(self) -> MyData:
    """Fetch the latest data."""
    try:
        return await self.client.get_data()
    except MyConnectionError as err:
        raise UpdateFailedUnreachable(
            translation_domain=DOMAIN,
            translation_key="update_unreachable",
        ) from err
```

### 使用 async_update 时

自行更新的实体会跟踪自己是否已经记录过日志：

```python
class MySensor(SensorEntity):
    """A sensor that updates itself."""

    _unavailable_logged = False

    async def async_update(self) -> None:
        """Fetch the latest value."""
        try:
            data = await self.client.get_data()
        except MyConnectionError as err:
            self._attr_available = False
            if not self._unavailable_logged:
                _LOGGER.info("The device is unavailable: %s", err)
                self._unavailable_logged = True
            return

        self._attr_available = True
        self._attr_native_value = data.temperature
        if self._unavailable_logged:
            _LOGGER.info("The device is available again")
            self._unavailable_logged = False
```

## 如何检查

- 当错误在同一个代码块中、在向 Home Assistant 抛出它之前，以警告（warning）级别或更高级别被记录时，Pylint 会发出警告，例如在抛出 `UpdateFailed` 之前记录日志（`home-assistant-log-and-raise`）。Home Assistant 已经会报告这些异常。
- 其余部分在代码审查中检查。

## 例外情况

如果集成没有实体，则此规则不适用。

## 相关规则

- [entity-unavailable](/core/quality-scale/entity-unavailable/)：在适当的时候将实体标记为不可用。
