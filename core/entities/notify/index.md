# 通知实体

> 构建一个向设备或服务发送消息的通知（notify）实体，例如聊天、电子邮件地址或显示器。

Source: https://www.hasscn.top/contributors/core/entities/notify/

通知实体（notify entity）向设备或服务发送消息：短信、电子邮件、聊天消息，或设备显示屏上的文本。消息一旦发送，便一去不返。请继承 `homeassistant.components.notify` 中的 `NotifyEntity`。

如果设备具有一个保持存在且用户可以更改的文本值，请改用[文本（text）实体](https://www.hasscn.top/contributors/core/entities/text/)。

## 属性

通知实体没有平台特定的属性。每个实体都具有的通用属性（如 `name`、`available` 和 `unique_id`）在[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)页面中有说明。通知实体不进行轮询：`should_poll` 默认为 `False`。

## 支持的功能

| 常量 | 描述 |
| --- | --- |
| `NotifyEntityFeature.TITLE` | 实体支持在消息旁边附带一个标题。 |

使用 `_attr_supported_features` 设置功能。默认情况下没有任何功能。当你实现同步版的 `send_message` 时，只有在设置了 `TITLE` 的情况下，基类才会将 `title` 传递给它。参见[支持的功能](https://www.hasscn.top/contributors/glossary/supported-features/)。

## 方法

### 发送消息

当自动化（automation）或脚本调用 `notify.send_message` 动作（action）时被调用。请实现以下两种方法之一。

```python
class MyNotifier(NotifyEntity):
    # Implement one of these methods.

    def send_message(self, message: str, title: str | None = None) -> None:
        """Send a message."""

    async def async_send_message(
        self, message: str, title: str | None = None
    ) -> None:
        """Send a message."""
```

### 记录通知

基类会记录通过 `notify.send_message` 发送的每一条消息。当你的集成（integration）也通过其他方式发送消息时，例如通过其自身的、带有额外选项的动作，你需要自行记录这些消息：调用 `self._async_record_notification()`，或者从事件循环之外的线程调用 `self._record_notification()`。它会更新状态（state）并将其写入。

只记录由 Home Assistant 发送的消息。从外部传入的消息，或由其他系统发送的消息，不属于通知实体：请对这些消息使用[事件（event）实体](https://www.hasscn.top/contributors/core/entities/event/)。

## 状态

通知实体的状态是从 Home Assistant 发送的最后一条消息的时间戳，以 UTC 的 ISO 8601 字符串表示。在第一条消息发送之前，它为 `unknown`。基类会在你的发送方法返回后记录它，并在重启后恢复它。你不能自行设置它：`state` 是 final 的。

## 示例

```python
from homeassistant.components.notify import (
    NotifyEntity,
    NotifyEntityFeature,
)


class ExampleChatNotifier(NotifyEntity):
    """Send messages to a chat channel."""

    _attr_has_entity_name = True
    _attr_supported_features = NotifyEntityFeature.TITLE

    def __init__(self, client: ExampleClient, channel: str) -> None:
        """Initialize the notifier."""
        self._client = client
        self._channel = channel
        self._attr_name = channel
        self._attr_unique_id = f"{client.account_id}_{channel}"

    async def async_send_message(
        self, message: str, title: str | None = None
    ) -> None:
        """Send a message to the channel."""
        await self._client.post(self._channel, message, title=title)
```

频道名称来自聊天服务，因此示例直接将它用作实体的名称，而不是使用翻译键。参见[实体命名](https://www.hasscn.top/contributors/core/entities/naming/)。
