# 更新实体

> 构建一个更新实体，告知用户有新的固件或软件版本可用，并允许他们进行安装。

Source: https://www.hasscn.top/contributors/core/entities/update/

更新实体（update entity）会告知用户，某个设备或服务有更新的版本可用，例如灯泡或路由器的固件，或应用程序或容器的软件。它还可以从 Home Assistant 安装该更新、显示发行说明（release notes），并在安装过程中报告进度。请继承 `homeassistant.components.update` 中的 `UpdateEntity`。

用户可以在**设置**（Settings）中找到可用的更新，它们位于 Home Assistant 自身更新的旁边。有关前端如何展示更新，请参阅[更新更多信息视图](https://www.hasscn.top/contributors/design/more-info/update/)。

## 属性

除了[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)之外，更新实体还具有以下属性。每个属性都可以通过其对应的 `_attr_` 属性来设置，例如 `_attr_installed_version`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `installed_version` | `str \| None` | `None` | 当前已安装并正在使用的版本。 |
| `latest_version` | `str \| None` | `None` | 可用的最新版本。 |
| `title` | `str \| None` | `None` | 软件的名称（例如 `Tasmota`），用于名称与设备或实体名称不同的情况。 |
| `release_summary` | `str \| None` | `None` | 发行说明的简短摘录。最多 255 个字符。 |
| `release_url` | `str \| None` | `None` | 完整发行说明的链接。 |
| `auto_update` | `bool` | `False` | 设备或服务会自行更新。用户不能跳过此类实体的版本。 |
| `in_progress` | `bool \| None` | `False` | 是否正在进行安装。需要 `UpdateEntityFeature.PROGRESS`。 |
| `update_percentage` | `int \| float \| None` | `None` | 安装进行到什么程度，从 0 到 100。需要 `UpdateEntityFeature.PROGRESS`，并且仅在 `in_progress` 为 `True` 时显示。 |
| `display_precision` | `int` | `0` | `update_percentage` 显示的小数位数。 |
| `device_class` | `UpdateDeviceClass \| None` | `None` | 更新的类型。参见[设备类别](https://www.hasscn.top/contributors/core/entities/update/#device-classes)。 |
| `restart_required` | `bool` | `False` | 安装此更新后，Home Assistant 需要重启。参见[安装](https://www.hasscn.top/contributors/core/entities/update/#install)。 |
| `has_update` | `bool` | 比较版本 | 是否有可用更新。参见[判断是否有可用更新](https://www.hasscn.top/contributors/core/entities/update/#decide-whether-an-update-is-available)。 |

更新实体更改了一些通用默认值：

- 当实体支持 `INSTALL` 时，`entity_category` 为 `EntityCategory.CONFIG`，否则为 `EntityCategory.DIAGNOSTIC`。你可以自行设置该属性来覆盖默认值。当实体具有实体描述（entity description）时，则会改用该描述中的 `entity_category`。`UpdateEntityDescription` 默认将其设为 `EntityCategory.CONFIG`。
- `entity_picture` 为你的集成的品牌图标。
- 没有名称但具有设备类别（device class）的实体，会以其设备类别命名，例如**固件**（Firmware）。

## 支持的功能

使用按位或（`|`）运算符组合 `UpdateEntityFeature` 的各个值。当调用 `update.install` 动作（action）时，Home Assistant 会检查这些值，并拒绝执行实体不支持的操作。

| 值 | 描述 |
| ----- | ----------- |
| `INSTALL` | 可以通过 Home Assistant 安装该更新。实现 `install`。 |
| `SPECIFIC_VERSION` | 可以安装特定版本，作为 `version` 传递给 `install`。 |
| `BACKUP` | 当 `backup` 为 `True` 时，设备或服务可以在安装前进行备份。 |
| `PROGRESS` | 实体通过 `in_progress` 和 `update_percentage` 报告安装进度。 |
| `RELEASE_NOTES` | 实体可以获取完整的发行说明。实现 `release_notes`。 |

即使没有 `PROGRESS`，Home Assistant 仍会显示安装正在进行：在你的安装方法运行期间，它会自行设置 `in_progress`。当设备报告真实进度时，请设置 `PROGRESS`，这能让用户更清楚地了解情况。

## 设备类别

| 值 | 描述 |
| ----- | ----------- |
| `UpdateDeviceClass.FIRMWARE` | 该更新是设备的固件。 |

## 方法

### 安装

需要 `UpdateEntityFeature.INSTALL`。实现 `install` 或 `async_install`。

```python
async def async_install(
    self, version: str | None, backup: bool, **kwargs: Any
) -> None:
    """Install an update."""
```

`version` 是要安装的版本，为 `None` 时表示最新版本。`backup` 表示要求先进行备份。当 `update.install` 动作调用它时，Home Assistant 已经检查过：有可安装的内容、当前没有正在进行的安装，并且实体支持所请求的版本和备份。

安装完成后即可返回；如果失败，则抛出 `HomeAssistantError`。无论以哪种方式结束，Home Assistant 随后都会将 `_attr_in_progress` 重置为 `False` 并写入状态。如果你重写了 `in_progress` 属性，请确保到那时它报告的是 `False`。

如果更新只有在 Home Assistant 重启后才会生效，请将 `restart_required` 设置为 `True`。一旦安装顺利完成而未抛出异常，实体就会代表你的集成[请求重启](https://www.hasscn.top/contributors/core/integrations/restart-required/)。如果安装失败，则不会。

### 发行说明

需要 `UpdateEntityFeature.RELEASE_NOTES`。实现 `release_notes` 或 `async_release_notes`，并返回最新版本的完整发行说明。前端会在用户安装之前，在更多信息（more-info）对话框中显示这些内容，并渲染 Markdown。

```python
async def async_release_notes(self) -> str | None:
    """Return the release notes."""
```

### 比较版本

默认情况下，如果 [AwesomeVersion](https://github.com/ludeeus/awesomeversion) 判定一个版本更新，它就会被视为更新。如果你的版本不适合用这种方式进行比较，请重写 `version_is_newer`。

```python
def version_is_newer(
    self, latest_version: str, installed_version: str
) -> bool:
    """Return True if latest_version is newer than installed_version."""
```

### 判断是否有可用更新

有些设备或服务会直接告知是否有可用更新，而不是提供 Home Assistant 可以比较的版本。对于这些情况，请重写 `has_update` 属性。

```python
@property
def has_update(self) -> bool:
    """Return whether an update is available."""
    return self.device.update_available
```

只有当 `installed_version` 和 `latest_version` 均已知且不相同，并且用户没有跳过最新版本时，Home Assistant 才会读取 `has_update`。默认情况下，它会调用 `version_is_newer`。

## 状态

当有可用更新时，状态为 `on`；当已安装的版本就是最新版本时，状态为 `off`。Home Assistant 会根据 `installed_version` 和 `latest_version` 得出这一结果；`state` 属性是最终结果。

- 当任一版本为 `None` 时，状态为 `unknown`。
- 当两个版本相同时，状态为 `off`。
- 当用户跳过了最新版本时，状态为 `off`，直到出现更新的版本。
- 否则，状态取决于 `has_update`。默认情况下，当最新版本更新时状态为 `on`，当版本无法比较时也是如此。

跳过版本以及清除已跳过的版本都由 Home Assistant 处理，你无需实现这些功能。

## 示例

```python
from typing import Any

from homeassistant.components.update import (
    UpdateDeviceClass,
    UpdateEntity,
    UpdateEntityFeature,
)


class MyFirmwareUpdate(MyEntity, UpdateEntity):
    """Firmware updates for the device."""

    _attr_device_class = UpdateDeviceClass.FIRMWARE
    _attr_supported_features = (
        UpdateEntityFeature.INSTALL | UpdateEntityFeature.PROGRESS
    )

    def __init__(self, coordinator: MyCoordinator) -> None:
        """Set up the entity."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.device.serial}_firmware"

    @property
    def installed_version(self) -> str | None:
        """Return the installed firmware version."""
        return self.coordinator.data.firmware

    @property
    def latest_version(self) -> str | None:
        """Return the newest firmware version."""
        return self.coordinator.data.latest_firmware

    @property
    def in_progress(self) -> bool:
        """Return whether the firmware is being installed."""
        return self.coordinator.data.updating

    @property
    def update_percentage(self) -> int | None:
        """Return the install progress."""
        return self.coordinator.data.update_progress

    async def async_install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        """Install the latest firmware."""
        await self.coordinator.device.install_firmware()
        await self.coordinator.async_request_refresh()
```

`MyEntity` 是该集成的共享基础实体，它是一个 `CoordinatorEntity`，设置了 `_attr_has_entity_name = True` 和设备信息。该实体没有自己的名称，因此根据其设备类别被命名为**固件**（Firmware）。
