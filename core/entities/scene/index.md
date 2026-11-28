# 场景实体

> 为存储在设备或集线器上的场景构建场景实体，以便用户可以从 Home Assistant 中激活它。

Source: https://www.hasscn.top/contributors/core/entities/scene/

[场景](https://www.hasscn.top/contributors/glossary/scene/)实体（scene entity）可以一次性为一组设备（device）激活一组状态（state），例如照明集线器（hub）上的"电影之夜"。当场景存储在设备或服务（service）上，而 Home Assistant 只需要通知它激活其中一个场景时，您的集成（integration）就需要实现场景实体。请从 `homeassistant.components.scene` 中的 `Scene` 继承。

人们在场景编辑器或 YAML 中自行创建的场景由 Home Assistant 本身处理。这些场景不需要场景实体。

场景没有开或关的状态。如果某样东西会保持开启直到您将其关闭，请使用[开关](https://www.hasscn.top/contributors/core/entities/switch/)。

关于前端如何显示场景，请参见[场景的更多信息视图](https://www.hasscn.top/contributors/design/more-info/scene/)。

## 属性

场景没有平台特定的属性。每个实体（entity）都具有的通用属性，例如 `name`、`available` 和 `unique_id`，见[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)。场景不会轮询：`should_poll` 默认为 `False`。

## 受支持的功能

此实体没有任何受支持的功能。

## 方法

### 激活

当有人在 UI 中激活场景，或自动化（automation）或脚本调用 `scene.turn_on` 动作时，此方法会被调用。两种方法实现其一即可。

```python
class MyScene(Scene):
    # Implement one of these methods.

    def activate(self, **kwargs: Any) -> None:
        """Activate the scene."""

    async def async_activate(self, **kwargs: Any) -> None:
        """Activate the scene."""
```

当动作带有 `transition` 时，您会以关键字参数的形式收到它：即设备达到新状态所需的秒数。如果设备支持，请将其传递下去。

## 状态

场景的状态是它最后一次被激活时的时间戳，以 UTC 时区的 ISO 8601 字符串表示。在首次激活之前，它为 `unknown`。基类会在调用您的激活方法之前立即记录该状态，并在重启后恢复它。您无法自行设置它：`state` 是 final 的。

## 在 Home Assistant 之外激活的场景

有些设备也会自行激活场景，例如带有物理场景按钮的集线器。为了让这些激活也显示在 Home Assistant 中，请从 `BaseScene` 而不是 `Scene` 继承：

- 实现 `_async_activate(self, **kwargs)` 以便从 Home Assistant 激活场景。注意开头的下划线。与 `Scene` 不同，`BaseScene` 不会为您记录激活。
- 当设备通知您场景已处于活动状态时，无论是谁激活的，都先调用 `self._async_record_activation()`，再调用 `self.async_write_ha_state()`。如果是从事件循环之外的线程调用，请使用 `self._record_activation()` 而不是 `_async_record_activation()`。

这样，时间戳就会跟随设备，即使从 Home Assistant 发起的激活需要片刻才能生效时也是如此。

```python
from typing import Any

from homeassistant.components.scene import BaseScene


class ExampleHubScene(BaseScene):
    """A scene stored on the hub."""

    async def _async_activate(self, **kwargs: Any) -> None:
        """Ask the hub to activate the scene."""
        await self._hub.activate_scene(self._scene_id)

    def _handle_scene_activated(self) -> None:
        """Handle the hub reporting that the scene is active."""
        self._async_record_activation()
        self.async_write_ha_state()
```

## 示例

```python
from typing import Any

from homeassistant.components.scene import Scene


class ExampleScene(Scene):
    """A scene stored on the lighting hub."""

    _attr_has_entity_name = True

    def __init__(self, hub: ExampleHub, scene: HubScene) -> None:
        """Initialize the scene."""
        self._hub = hub
        self._scene_id = scene.id
        self._attr_name = scene.name
        self._attr_unique_id = f"{hub.serial}_scene_{scene.id}"

    async def async_activate(self, **kwargs: Any) -> None:
        """Activate the scene."""
        await self._hub.activate_scene(self._scene_id)
```

场景的名称来自集线器，因此本示例直接使用这些名称，而不使用翻译键（translation key）。参见[实体命名](https://www.hasscn.top/contributors/core/entities/naming/)。
