---
title: 构建你的第一个集成
description: 逐步构建一个小而完整的集成，从脚手架（scaffold）到配置流程（config flow）、协调器（coordinator）、传感器、测试，以及一个达到 Bronze 级别的拉取请求（pull request）。
sidebarLabel: Tutorial
sidebarGroup: Getting started
order: 2
---

在本教程中，你将为本地网络上的一台空气质量监测仪构建一个完整的集成。它通过 UI 进行设置，每分钟轮询一次监测仪，并将其温度、湿度和细尘显示为传感器。在这个过程中，你会接触到 core 中新集成所需的每一个部分：一个库、一个配置流程（config flow）、一个协调器（coordinator）、实体、测试、文档、一个品牌标识，以及一个拉取请求。

到最后，你的集成将满足[质量分级](/core/quality-scale/)（quality scale）中 Bronze 级别的每一条规则，这是 core 中新集成的最低要求。每一步都会说明它照顾到了哪些规则，最后几步则把它们全部核对一遍。

监测仪及其库 `exampleair` 是为本教程虚构的。你可以用自己的设备和它的库跟着做：代码的形状是一样的，只是名称和数据不同。这些代码以 `theben_conexa` 为蓝本，它是一个最近加入 core 的小型 Bronze 集成，面向本地设备，包含一个传感器平台、一个协调器以及同样的一组测试。如果有帮助，你可以在阅读本页时同时打开它的代码。

对配置条目（config entry）、平台（platform）或协调器这些词感到陌生？请先阅读[集成是如何融入的](/core/integrations/concepts/)。这只需要五分钟。

## 开始之前

- **一个开发环境。**按照[你的第一次贡献](/core/first-contribution/#2-set-up-your-environment)或[开发环境](/core/development/environment/)指南搭建一个。请在该环境中、从你 core 检出（checkout）的根目录运行本页上的每一条命令。
- **一个适合进入 core 的设备或服务。**它必须是人们今天就能购买和使用的，并且有真实的用户群。参见[创建集成](/core/integrations/create/#does-it-belong-in-core)。对于新集成，项目建议你先在 [Marketplace](/marketplace/) 中发布。自定义集成（custom integration）的构建方式相同，因此你在这里学到的所有内容都可以迁移过去。
- **一些 Python 基础。**你应该熟悉类、`async` 和 `await` 以及类型提示（type hints）。你还不需要了解 Home Assistant 的代码。
- **时间。**规划几个晚上。之后的审查比编写代码花的时间更长，通常需要数周。这是正常的。

然后为你的集成创建一个分支，从 Home Assistant 最新的 `dev` 分支开始。请先做这件事：core 的 pre-commit 钩子包含 `no-commit-to-branch`，它会拒绝在 `dev`、`rc` 和 `master` 上的每一次提交。

```shell
git fetch upstream
git checkout -b add-example-air upstream/dev
```

`upstream` 是你在[你的第一次贡献](/core/first-contribution/#2-set-up-your-environment)中添加的 `home-assistant/core` 远程仓库。

## 1. 从库开始

你的集成从不直接与设备通信。这项工作由 PyPI 上的一个 Python 库完成，你的集成只在库和 Home Assistant 之间进行转换。如果你的设备还没有库，请先编写一个：[构建 Python 库](/core/integrations/api-library/)解释了怎么做，以及在 core 接受它之前它必须满足什么条件。

本教程使用一个具有以下接口的小型异步库：

```python
from dataclasses import dataclass

from aiohttp import ClientSession


@dataclass
class Status:
    """The status of an Example Air monitor."""

    serial_number: str
    name: str
    firmware: str
    temperature: float
    humidity: float
    pm25: int


class ExampleAirError(Exception):
    """Base error of the library."""


class ExampleAirConnectionError(ExampleAirError):
    """The monitor could not be reached."""


class ExampleAirClient:
    """Talk to an Example Air monitor."""

    def __init__(self, host: str, session: ClientSession) -> None:
        """Initialize the client."""

    async def get_status(self) -> Status:
        """Return the current status of the monitor."""
```

它有三点对 Home Assistant 很重要：

- 它是异步的，因此永远不会阻塞[事件循环](/glossary/event-loop/)（event loop）。
- 它接受调用者传入的 `aiohttp` 会话，因此可以使用 Home Assistant 的共享会话。
- 它抛出自己的异常，因此集成能够区分设备无法访问和其他问题。

Core 对库的发布方式也有要求。这就是[依赖透明](/core/quality-scale/dependency-transparency/)（dependency-transparency）规则：

- 源代码位于公开的仓库中，采用 OSI 认可的许可证，如 MIT 或 Apache 2.0。
- 每个版本都发布在 PyPI 上，由公开的 CI 流水线构建和发布，而不是手动上传。
- PyPI 上的每个版本都对应该仓库中的一个带标签的版本（tagged release）。

在开始集成之前先设置好这些。你需要在拉取请求中链接发布工作流（release workflow）和标签，审查者会检查它们。

在开发过程中，以可编辑模式（editable mode）安装你的库，这样你就可以同时修改库和集成。库放在哪里取决于你的设置方式。

手动设置时，一切都直接在你的电脑上运行。把库保存在 core 检出目录旁边的文件夹中，激活虚拟环境，然后从 core 检出目录安装它：

```shell
uv pip install -e ../exampleair
```

开发容器只挂载了你的 core 检出目录，因此 `../exampleair` 在容器内不存在。改为在容器内克隆库，例如克隆到你的主文件夹中，然后从那里安装：

```shell
git clone https://github.com/YOUR_GITHUB_USERNAME/exampleair ~/exampleair
uv pip install -e ~/exampleair
```

经常推送你的库更改：当容器重建时，core 检出目录之外的所有内容都会丢失。一旦你的库发布到 PyPI，你也可以跳过可编辑安装，改用 `uv pip install exampleair==0.1.0` 安装已发布的版本。

## 2. 生成集成

运行脚手架（scaffold）脚本：

```shell
python3 -m script.scaffold integration
```

它会问几个问题。对于本教程，答案如下：

| 问题 | 答案 |
| --- | --- |
| 域（domain）是什么？ | `example_air` |
| 你的集成名称是什么？ | `Example Air` |
| 你的 GitHub 用户名是什么？ | 你的 GitHub 用户名 |
| 你依赖哪个 PyPI 包和版本？ | `exampleair==0.1.0` |
| 你的集成将如何获取数据？ | `local_polling` |
| Home Assistant 是否需要用户进行身份验证？ | `no` |
| 设备/服务在本地网络上是否可发现？ | `no` |
| 集成类型是什么？ | `device` |
| 用户能否使用 OAuth2 对设备进行身份验证？ | `no` |

域是永久性的：它会成为文件夹的名称，并且永远无法更改。参见[清单文件](/core/integrations/manifest/#domain)。

由于监测仪不可发现，脚本会生成一个带表单的配置流程。然后它会运行 hassfest 验证结果，更新依赖文件（requirement files），并生成英文翻译。你现在拥有：

```text
homeassistant/components/example_air/
├── __init__.py
├── config_flow.py
├── const.py
├── manifest.json
├── quality_scale.yaml
└── strings.json
tests/components/example_air/
├── __init__.py
├── conftest.py
└── test_config_flow.py
```

生成的代码可以运行，但它只是一个模板：其中有 `TODO` 注释和一个 `PlaceholderHub` 类，你的库将放在那里。接下来的步骤会替换所有这些内容。

## 3. 检查清单文件

打开 `manifest.json`。脚手架根据你的回答填写了它，并添加了几个空键（用于依赖和发现）。删除这些空键：core 中几乎所有集成都会省略它们。剩下的是：

```json
{
  "domain": "example_air",
  "name": "Example Air",
  "codeowners": ["@your-github-username"],
  "config_flow": true,
  "documentation": "https://www.home-assistant.io/integrations/example_air",
  "integration_type": "device",
  "iot_class": "local_polling",
  "quality_scale": "bronze",
  "requirements": ["exampleair==0.1.0"]
}
```

- `quality_scale` 从一开始就是 `bronze`：新集成必须至少达到 Bronze。在 `quality_scale.yaml` 中的每条 Bronze 规则都变为 `done` 或 `exempt` 之前，hassfest 会为此报告错误。你会在第 11 步达到这一点。
- `requirements` 使用 `==` 将你的库固定到确切版本。Hassfest 要求这样做，而且这也是[依赖透明](/core/quality-scale/dependency-transparency/)的另一半。

[清单文件](/core/integrations/manifest/)解释了每一个键。

## 4. 构建配置流程

[配置流程](/core/integrations/config-flow/)是用户添加集成时看到的对话框。它会询问主机地址，连接到监测仪以检查其是否正常工作，并确保同一台监测仪不会被添加两次。

将 `config_flow.py` 替换为：

```python
"""Config flow for the Example Air integration."""

import logging
from typing import Any, override

from exampleair import ExampleAirClient, ExampleAirConnectionError
import probatio

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import CONF_HOST
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = probatio.Schema(
    {probatio.Required(CONF_HOST): str}
)


class ExampleAirConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Example Air."""

    VERSION = 1

    @override
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow started by the user."""
        errors: dict[str, str] = {}

        if user_input is not None:
            client = ExampleAirClient(
                user_input[CONF_HOST],
                session=async_get_clientsession(self.hass),
            )

            try:
                status = await client.get_status()
            except ExampleAirConnectionError:
                errors["base"] = "cannot_connect"
            except Exception:
                _LOGGER.exception("Unexpected exception")
                errors["base"] = "unknown"
            else:
                await self.async_set_unique_id(status.serial_number)
                self._abort_if_unique_id_configured()

                return self.async_create_entry(
                    title=status.name, data=user_input
                )

        return self.async_show_form(
            step_id="user",
            data_schema=STEP_USER_DATA_SCHEMA,
            errors=errors,
        )
```

这里发生了什么：

- 第一次时，`user_input` 为 `None`，该步骤显示表单。
- 当用户提交时，流程会连接到监测仪。如果连接失败，它会再次显示表单并给出错误。这就是[先测试后配置](/core/quality-scale/test-before-configure/)（test-before-configure）规则。
- 序列号成为配置条目的唯一 ID。`_abort_if_unique_id_configured` 会在该监测仪已被设置时停止流程。这就是[唯一配置条目](/core/quality-scale/unique-config-entry/)（unique-config-entry）规则。绝不要将 IP 地址用作唯一 ID：它会变化。
- `async_get_clientsession` 为你提供 Home Assistant 的共享 Web 会话。
- `@override` 告诉类型检查器这个方法重写了父类中的某个方法。Core 的 mypy 配置要求使用它。

core 中的模式（schema）是用 Probatio 编写的，这是 Home Assistant 使用的验证库。以 `probatio` 导入它，不要使用别名。

用户看到的所有文本都存放在 `strings.json` 中，绝不出现在代码里。将其替换为：

```json
{
  "config": {
    "step": {
      "user": {
        "data": {
          "host": "[%key:common::config_flow::data::host%]"
        },
        "data_description": {
          "host": "The hostname or IP address of your Example Air monitor."
        }
      }
    },
    "error": {
      "cannot_connect": "[%key:common::config_flow::error::cannot_connect%]",
      "unknown": "[%key:common::config_flow::error::unknown%]"
    },
    "abort": {
      "already_configured": "[%key:common::config_flow::abort::already_configured_device%]"
    }
  },
  "exceptions": {
    "update_failed": {
      "message": "An error occurred while fetching data from the monitor."
    }
  }
}
```

`[%key:...%]` 引用复用了已经翻译成每种语言的字符串。`data_description` 解释每个字段，这是[配置流程](/core/quality-scale/config-flow/)规则所要求的。`exceptions` 部分用于下一步中的协调器。每次修改 `strings.json` 后，重新生成英文翻译，Home Assistant 和测试都会读取它们：

```shell
python3 -m script.translations develop --integration example_air
```

有关该文件的每个部分，参见[翻译](/core/integrations/translations/)；有关如何编写它们，参见[让你的字符串可翻译](/translate/guides/developers/)。

## 5. 使用协调器获取数据

监测仪在一个请求中返回其所有数值。[协调器](/core/integrations/fetching-data/)每分钟发出一次该请求，并将结果交给所有实体。当监测仪停止响应时，它还会将实体标记为不可用，并且只记录一次日志。

创建 `coordinator.py`：

```python
"""Coordinator for the Example Air integration."""

from datetime import timedelta
import logging
from typing import override

from exampleair import ExampleAirClient, ExampleAirError, Status

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
    UpdateFailed,
)

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

type ExampleAirConfigEntry = ConfigEntry[ExampleAirCoordinator]


class ExampleAirCoordinator(DataUpdateCoordinator[Status]):
    """Fetch the status of an Example Air monitor."""

    config_entry: ExampleAirConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: ExampleAirConfigEntry,
        client: ExampleAirClient,
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=config_entry,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
        self.client = client

    @override
    async def _async_update_data(self) -> Status:
        """Fetch the latest status from the monitor."""
        try:
            return await self.client.get_status()
        except ExampleAirError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="update_failed",
            ) from err
```

- `ExampleAirConfigEntry` 是一个带类型的配置条目。它的 `runtime_data` 就是协调器，因此你的平台可以免费获得一个带类型的协调器。
- `update_interval` 由集成固定。用户无法更改它，配置流程也绝不能询问它。选择一个适合数据的间隔：参见[适当轮询](/core/quality-scale/appropriate-polling/)（appropriate-polling）。
- `UpdateFailed` 告诉协调器更新失败。它的消息是可翻译的，来自 `strings.json` 的 `exceptions` 部分。
- 协调器位于 `coordinator.py` 中，基础实体位于 `entity.py` 中。这就是[通用模块](/core/quality-scale/common-modules/)（common-modules）规则。

## 6. 设置配置条目

`__init__.py` 将一切连接起来。Home Assistant 会为每个配置条目调用 `async_setup_entry`：在启动时，以及在用户添加监测仪时。将该文件替换为：

```python
"""The Example Air integration."""

from exampleair import ExampleAirClient

from homeassistant.const import CONF_HOST, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .coordinator import ExampleAirConfigEntry, ExampleAirCoordinator

_PLATFORMS: list[Platform] = [Platform.SENSOR]


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleAirConfigEntry
) -> None:
    """Set up Example Air from a config entry."""
    client = ExampleAirClient(
        entry.data[CONF_HOST], session=async_get_clientsession(hass)
    )

    coordinator = ExampleAirCoordinator(hass, entry, client)
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, _PLATFORMS)


async def async_unload_entry(
    hass: HomeAssistant, entry: ExampleAirConfigEntry
) -> None:
    """Unload a config entry."""
    await hass.config_entries.async_unload_platforms_or_raise(
        entry, _PLATFORMS
    )
```

- `async_config_entry_first_refresh` 在任何实体存在之前获取第一批数据。当监测仪离线时，它会引发 `ConfigEntryNotReady`，Home Assistant 会在稍后重试设置。这就是[先测试后设置](/core/quality-scale/test-before-setup/)（test-before-setup）规则。
- 协调器放在 `entry.runtime_data` 中，而不是 `hass.data`。这就是[运行时数据](/core/quality-scale/runtime-data/)（runtime-data）规则。
- `_PLATFORMS` 只有一个平台。新集成从一个平台开始：更多平台会在后续的拉取请求中添加。
- `async_unload_entry` 让用户无需重启即可移除或重新加载集成。
- 没有 `async_setup`，因为这个集成没有添加自己的[动作](/glossary/action/)（action）。如果你的集成有，请在 `async_setup` 中注册它们，而不是在这里。这就是[动作设置](/core/quality-scale/action-setup/)（action-setup）规则，对于本集成它是豁免的。

## 7. 添加实体

首先，在 `entity.py` 中创建一个基础实体。监测仪的每个实体共享相同的设备和相同的协调器：

```python
"""Base entity for the Example Air integration."""

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import ExampleAirCoordinator


class ExampleAirEntity(CoordinatorEntity[ExampleAirCoordinator]):
    """Base class for Example Air entities."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: ExampleAirCoordinator) -> None:
        """Initialize the entity."""
        super().__init__(coordinator)
        status = coordinator.data

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, status.serial_number)},
            manufacturer="Example",
            model="Example Air",
            name=status.name,
            serial_number=status.serial_number,
            sw_version=status.firmware,
        )
```

- `CoordinatorEntity` 将实体订阅到协调器，并在更新失败时使其不可用。
- `_attr_has_entity_name = True` 让每个实体在其设备的上下文中命名，比如“客厅温度”。这就是[实体名称](/core/quality-scale/has-entity-name/)（has-entity-name）规则。
- `DeviceInfo` 将监测仪放入[设备注册表](/core/integrations/device-registry/)（device registry），这样用户看到一个包含其所有传感器的设备。
- 这些实体自身不订阅任何内容。`CoordinatorEntity` 在 `async_added_to_hass` 中订阅协调器，并在实体被移除时取消订阅。如果你以后添加自己的订阅，比如库推送的更新，请遵循[实体事件设置](/core/quality-scale/entity-event-setup/)（entity-event-setup）规则。对于本集成，该规则是豁免的。

然后是传感器平台，位于 `sensor.py` 中：

```python
"""Sensor platform for the Example Air integration."""

from collections.abc import Callable
from dataclasses import dataclass
from typing import override

from exampleair import Status

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import (
    UnitOfDensity,
    UnitOfRatio,
    UnitOfTemperature,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import (
    AddConfigEntryEntitiesCallback,
)

from .coordinator import ExampleAirConfigEntry, ExampleAirCoordinator
from .entity import ExampleAirEntity


@dataclass(frozen=True, kw_only=True)
class ExampleAirSensorEntityDescription(SensorEntityDescription):
    """Describe an Example Air sensor."""

    value_fn: Callable[[Status], float | int]


SENSORS: tuple[ExampleAirSensorEntityDescription, ...] = (
    ExampleAirSensorEntityDescription(
        key="temperature",
        device_class=SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda status: status.temperature,
    ),
    ExampleAirSensorEntityDescription(
        key="humidity",
        device_class=SensorDeviceClass.HUMIDITY,
        native_unit_of_measurement=UnitOfRatio.PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda status: status.humidity,
    ),
    ExampleAirSensorEntityDescription(
        key="pm25",
        device_class=SensorDeviceClass.PM25,
        native_unit_of_measurement=UnitOfDensity.MICROGRAMS_PER_CUBIC_METER,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda status: status.pm25,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleAirConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Example Air sensors."""
    coordinator = entry.runtime_data

    async_add_entities(
        ExampleAirSensor(coordinator, description)
        for description in SENSORS
    )


class ExampleAirSensor(ExampleAirEntity, SensorEntity):
    """A sensor of an Example Air monitor."""

    entity_description: ExampleAirSensorEntityDescription

    def __init__(
        self,
        coordinator: ExampleAirCoordinator,
        description: ExampleAirSensorEntityDescription,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = (
            f"{coordinator.data.serial_number}_{description.key}"
        )

    @property
    @override
    def native_value(self) -> float | int:
        """Return the value of the sensor."""
        return self.entity_description.value_fn(self.coordinator.data)
```

- [实体描述](/glossary/entity-description/)（entity description）将每个传感器描述为数据：它的设备类别（device class）、单位，以及如何获取其数值。以后添加一个传感器只是在 `SENSORS` 中多一个条目。
- 设备类别为每个传感器提供名称、图标和正确的单位换算。因为这些传感器有设备类别，所以它们不需要自己的名称。
- 唯一 ID 由序列号和键组合而成。它永远不会改变，并且正是它让用户能够重命名实体。这就是[实体唯一 ID](/core/quality-scale/entity-unique-id/)（entity-unique-id）规则。

[实体与平台](/core/entities/)为每种实体类型都有一页，比如[传感器实体](/core/entities/sensor/)。

## 8. 试一试

在 Home Assistant 能够在列表中显示你的集成之前，重新生成列出所有集成的文件：

```shell
python3 -m script.hassfest --skip-plugins quality_scale
```

如果不带 `--integration-path`，hassfest 会验证每一个集成并更新生成的文件，比如 `CODEOWNERS` 和 `homeassistant/generated/config_flows.py`。这些更改应包含在你的拉取请求中。它只有在没有发现错误时才会写入这些更改，而你的 `quality_scale.yaml` 目前还全是 `todo`。这就是为什么这次运行要跳过质量分级检查，与脚手架脚本的做法相同。从第 11 步开始，你在运行时不再使用 `--skip-plugins`。

现在启动你的开发实例。在开发容器中，打开命令面板（Command Palette），选择 **Tasks: Run Task**，然后选择 **Run Home Assistant Core**。访问 `http://localhost:8123`，在 **设置** > **设备与服务** 下，选择 **添加集成** 并搜索 **Example Air**。输入你监测仪的地址，你应该会看到一个带有三个传感器的新设备。

没有正常工作？在 `config/configuration.yaml` 中为你的集成和库开启调试日志，然后重启：

```yaml
logger:
  default: info
  logs:
    homeassistant.components.example_air: debug
    exampleair: debug
```

集成不在列表中？先检查日志中是否有错误，然后对浏览器进行强制刷新：前端的缓存非常激进。[你的第一次贡献](/core/first-contribution/#4-make-the-change)中有更多关于运行和调试代码的内容，包括如何从开发容器访问你网络上的设备。

## 9. 编写测试

core 中的每个新集成都带有测试，并且配置流程需要完全的覆盖率。测试在没有真实设备的情况下运行：你模拟（mock）库，让 Home Assistant 真实地运行。[编写测试](/core/development/tests/)解释了这背后的理念。

从共享的 fixture 开始，位于 `tests/components/example_air/conftest.py` 中：

```python
"""Common fixtures for the Example Air tests."""

from collections.abc import Generator
from unittest.mock import AsyncMock, MagicMock, patch

from exampleair import Status
import pytest

from homeassistant.components.example_air.const import DOMAIN
from homeassistant.const import CONF_HOST

from tests.common import MockConfigEntry


@pytest.fixture
def mock_setup_entry() -> Generator[AsyncMock]:
    """Override async_setup_entry."""
    with patch(
        "homeassistant.components.example_air.async_setup_entry",
        return_value=None,
    ) as mock_setup_entry:
        yield mock_setup_entry


@pytest.fixture
def mock_example_air_client() -> Generator[MagicMock]:
    """Mock the Example Air client."""
    with (
        patch(
            "homeassistant.components.example_air.ExampleAirClient",
            autospec=True,
        ) as mock_client,
        patch(
            "homeassistant.components.example_air.config_flow"
            ".ExampleAirClient",
            new=mock_client,
        ),
    ):
        client = mock_client.return_value
        client.get_status.return_value = Status(
            serial_number="EA123456",
            name="Living room",
            firmware="1.2.0",
            temperature=21.5,
            humidity=45.0,
            pm25=8,
        )
        yield client


@pytest.fixture
def mock_config_entry() -> MockConfigEntry:
    """Return the config entry of a monitor."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Living room",
        unique_id="EA123456",
        data={CONF_HOST: "192.168.1.50"},
    )
```

客户端在你集成导入它的位置被打补丁（patch）：一次在 `__init__.py` 中，一次在 `config_flow.py` 中。

### 测试配置流程

替换 `test_config_flow.py`。测试正常路径（happy path）、每一个错误以及重复检查。每个错误测试都以一个已创建的条目结束，以证明流程能够恢复：

```python
"""Test the Example Air config flow."""

from unittest.mock import MagicMock

from exampleair import ExampleAirConnectionError
import pytest

from homeassistant.components.example_air.const import DOMAIN
from homeassistant.config_entries import SOURCE_USER
from homeassistant.const import CONF_HOST
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from tests.common import MockConfigEntry


@pytest.mark.usefixtures("mock_setup_entry", "mock_example_air_client")
async def test_user_flow(hass: HomeAssistant) -> None:
    """Test adding a monitor."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {}

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.168.1.50"}
    )

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Living room"
    assert result["data"] == {CONF_HOST: "192.168.1.50"}
    assert result["result"].unique_id == "EA123456"


@pytest.mark.usefixtures("mock_setup_entry")
@pytest.mark.parametrize(
    ("exception", "error"),
    [
        pytest.param(
            ExampleAirConnectionError, "cannot_connect", id="cannot_connect"
        ),
        pytest.param(Exception, "unknown", id="unknown"),
    ],
)
async def test_user_flow_errors(
    hass: HomeAssistant,
    mock_example_air_client: MagicMock,
    exception: type[Exception],
    error: str,
) -> None:
    """Test errors, and that the flow recovers from them."""
    mock_example_air_client.get_status.side_effect = exception

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.168.1.50"}
    )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": error}

    mock_example_air_client.get_status.side_effect = None

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.168.1.50"}
    )

    assert result["type"] is FlowResultType.CREATE_ENTRY


@pytest.mark.usefixtures("mock_example_air_client")
async def test_already_configured(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Test that the same monitor cannot be added twice."""
    mock_config_entry.add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.168.1.60"}
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
```

这些测试合在一起构成了[配置流程测试覆盖率](/core/quality-scale/config-flow-test-coverage/)（config-flow-test-coverage）规则：

- 正常路径会检查已创建的条目，包括其唯一 ID。当唯一 ID 的构建方式意外发生变化时，这个测试会捕捉到它。
- 表单能显示的每个错误都有一个测试，并且这些测试中的每一个都以一个已创建的条目结束。这证明用户可以解决问题并完成设置。Pylint 会对从未完成流程的错误测试发出警告。
- 重复测试为序列号相同的监测仪输入不同的主机地址，并期望流程以 `already_configured` 中止。每个测试都以最终结果结束：已创建的条目或中止。
- 它们合在一起执行了 `config_flow.py` 的每一行。你可以用下面的覆盖率报告来检查这一点。

### 测试设置

在 `test_init.py` 中，测试集成能够加载和卸载，以及当监测仪离线时会重试设置：

```python
"""Test the setup of the Example Air integration."""

from unittest.mock import MagicMock

from exampleair import ExampleAirConnectionError
import pytest

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant

from tests.common import MockConfigEntry


@pytest.mark.usefixtures("mock_example_air_client")
async def test_load_unload(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Test loading and unloading a config entry."""
    mock_config_entry.add_to_hass(hass)

    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.LOADED

    await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.NOT_LOADED


async def test_setup_retry_when_offline(
    hass: HomeAssistant,
    mock_example_air_client: MagicMock,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Test that setup is retried when the monitor is offline."""
    mock_example_air_client.get_status.side_effect = (
        ExampleAirConnectionError
    )
    mock_config_entry.add_to_hass(hass)

    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.SETUP_RETRY
```

### 测试传感器

在 `test_sensor.py` 中，一个快照测试（snapshot test）一次性检查每个传感器：它的状态、单位、设备类别和注册表条目：

```python
"""Test the Example Air sensors."""

import pytest
from syrupy.assertion import SnapshotAssertion

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from tests.common import MockConfigEntry, snapshot_platform


@pytest.mark.usefixtures("mock_example_air_client")
async def test_sensors(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    entity_registry: er.EntityRegistry,
    snapshot: SnapshotAssertion,
) -> None:
    """Test the sensors of a monitor."""
    mock_config_entry.add_to_hass(hass)

    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    await snapshot_platform(
        hass, entity_registry, snapshot, mock_config_entry.entry_id
    )
```

### 运行测试

快照测试的第一次运行会创建快照。然后运行所有测试并生成覆盖率报告：

```shell
pytest tests/components/example_air --snapshot-update
pytest tests/components/example_air \
  --cov=homeassistant.components.example_air \
  --cov-report term-missing
```

打开 `tests/components/example_air/snapshots/test_sensor.ambr` 并阅读它：只有在你检查过快照正确无误之后，它才能证明什么。覆盖率报告会显示没有测试覆盖到的行。`config_flow.py` 必须达到 100%。[运行测试](/core/development/testing/)中有更多运行它们的方法。

## 10. 添加品牌标识和文档

有七条 Bronze 规则与 core 中的代码完全无关。它们是在另外两个仓库中满足的，通过与你的拉取请求一同提交的其他拉取请求完成。现在就开始：它们会被单独审查，而且当它们已经就位时，你的 core 拉取请求也更容易审查。

### 品牌标识

你集成的图标和标志（logo）放入 [brands 仓库](https://github.com/home-assistant/brands)中，放在以你的域命名的文件夹里：`core_integrations/example_air/`。至少添加 `icon.png` 和 `icon@2x.png`，如果品牌有宽版标志，还要添加 logo。[品牌与品牌图像](/core/integrations/brands/#brand-images-for-core-integrations)列出了每个文件和图像要求。这就是[品牌](/core/quality-scale/brands/)（brands）规则。

### 文档

每个集成在 [home-assistant.io](https://www.home-assistant.io/) 上都有一个页面。在一个针对 [home-assistant.io 仓库](https://github.com/home-assistant/home-assistant.io)的拉取请求中编写它，目标分支为 `next`，从集成页面模板开始。[为集成编写文档](/writing/guides/integration/)会一步一步带你完成。

对于 Bronze，页面需要三样东西，每一项都是一条独立的规则：

- **产品描述**，放在开头几行，并附上制造商的链接。这就是 [docs-high-level-description](/core/quality-scale/docs-high-level-description/) 规则。
- **安装步骤**，把用户在开始之前必须做的任何事情作为前置条件列出。这就是 [docs-installation-instructions](/core/quality-scale/docs-installation-instructions/) 规则。
- **如何移除集成**，包括在 Home Assistant 之外遗留的任何内容。这就是 [docs-removal-instructions](/core/quality-scale/docs-removal-instructions/) 规则。

对于 Example Air，`source/_integrations/example_air.markdown` 中的这些部分可能如下所示：

```markdown
The **Example Air** {% term integration %} connects Home Assistant to
the air quality monitors of [Example](https://www.example.com). It shows
the temperature, humidity, and fine dust that your monitor measures.

## Prerequisites

1. Set up your monitor with the **Example** app, and connect it to your
   network.
2. In the app, look up the IP address of your monitor.

{% include integrations/config_flow.md %}

## Removing the integration

This integration follows standard integration removal. No extra steps
are required.

{% include integrations/remove_device_service.md %}
```

Bronze 的另外三条文档规则——[docs-actions](/core/quality-scale/docs-actions/)、[docs-triggers](/core/quality-scale/docs-triggers/) 和 [docs-conditions](/core/quality-scale/docs-conditions/)——是关于记录集成的动作、触发器和条件的。Example Air 没有这些，所以这些规则是豁免的。

## 11. 填写质量分级

打开 `quality_scale.yaml`。脚手架将每条规则都列为 `todo`。Hassfest 要求质量分级的每条规则都在文件中，并且每条 Bronze 规则为 `done`，或者为 `exempt` 并附有说明原因的注释。你的集成现在满足所有这些规则：

| 规则 | 状态 | 位置 |
| --- | --- | --- |
| [action-setup](/core/quality-scale/action-setup/) | 豁免 | 无动作，[第 6 步](#6-set-up-the-config-entry) |
| [appropriate-polling](/core/quality-scale/appropriate-polling/) | 已完成 | 一分钟，[第 5 步](#5-fetch-the-data-with-a-coordinator) |
| [brands](/core/quality-scale/brands/) | 已完成 | [第 10 步](#the-brand) |
| [common-modules](/core/quality-scale/common-modules/) | 已完成 | `coordinator.py` 和 `entity.py`，第 5 和第 7 步 |
| [config-flow](/core/quality-scale/config-flow/) | 已完成 | [第 4 步](#4-build-the-config-flow) |
| [config-flow-test-coverage](/core/quality-scale/config-flow-test-coverage/) | 已完成 | [第 9 步](#test-the-config-flow) |
| [dependency-transparency](/core/quality-scale/dependency-transparency/) | 已完成 | 第 [1](#1-start-with-the-library) 和 [3](#3-check-the-manifest) 步 |
| [docs-actions](/core/quality-scale/docs-actions/) | 豁免 | 无动作 |
| [docs-conditions](/core/quality-scale/docs-conditions/) | 豁免 | 无条件 |
| [docs-high-level-description](/core/quality-scale/docs-high-level-description/) | 已完成 | [第 10 步](#the-documentation) |
| [docs-installation-instructions](/core/quality-scale/docs-installation-instructions/) | 已完成 | [第 10 步](#the-documentation) |
| [docs-removal-instructions](/core/quality-scale/docs-removal-instructions/) | 已完成 | [第 10 步](#the-documentation) |
| [docs-triggers](/core/quality-scale/docs-triggers/) | 豁免 | 无触发器 |
| [entity-event-setup](/core/quality-scale/entity-event-setup/) | 豁免 | 仅协调器，[第 7 步](#7-add-the-entities) |
| [entity-unique-id](/core/quality-scale/entity-unique-id/) | 已完成 | [第 7 步](#7-add-the-entities) |
| [has-entity-name](/core/quality-scale/has-entity-name/) | 已完成 | [第 7 步](#7-add-the-entities) |
| [runtime-data](/core/quality-scale/runtime-data/) | 已完成 | [第 6 步](#6-set-up-the-config-entry) |
| [test-before-configure](/core/quality-scale/test-before-configure/) | 已完成 | [第 4 步](#4-build-the-config-flow) |
| [test-before-setup](/core/quality-scale/test-before-setup/) | 已完成 | [第 6 步](#6-set-up-the-config-entry) |
| [unique-config-entry](/core/quality-scale/unique-config-entry/) | 已完成 | [第 4 步](#4-build-the-config-flow) |

将该文件替换为：

```yaml
rules:
  # Bronze
  action-setup:
    status: exempt
    comment: "The integration does not register actions."
  appropriate-polling: done
  brands: done
  common-modules: done
  config-flow-test-coverage: done
  config-flow: done
  dependency-transparency: done
  docs-actions:
    status: exempt
    comment: "The integration does not register actions."
  docs-conditions:
    status: exempt
    comment: "The integration does not provide conditions."
  docs-high-level-description: done
  docs-installation-instructions: done
  docs-removal-instructions: done
  docs-triggers:
    status: exempt
    comment: "The integration does not provide triggers."
  entity-event-setup:
    status: exempt
    comment: "Entities only subscribe to the coordinator."
  entity-unique-id: done
  has-entity-name: done
  runtime-data: done
  test-before-configure: done
  test-before-setup: done
  unique-config-entry: done

  # Silver
  action-exceptions: todo
  config-entry-unloading: todo
  docs-configuration-parameters: todo
  docs-installation-parameters: todo
  entity-unavailable: todo
  integration-owner: todo
  log-when-unavailable: todo
  parallel-updates: todo
  reauthentication-flow: todo
  test-coverage: todo

  # Gold
  devices: todo
  diagnostics: todo
  discovery-update-info: todo
  discovery: todo
  docs-data-update: todo
  docs-examples: todo
  docs-known-limitations: todo
  docs-supported-devices: todo
  docs-supported-functions: todo
  docs-troubleshooting: todo
  docs-use-cases: todo
  dynamic-devices: todo
  entity-category: todo
  entity-device-class: todo
  entity-disabled-by-default: todo
  entity-translations: todo
  exception-translations: todo
  icon-translations: todo
  reconfiguration-flow: todo
  repair-issues: todo
  stale-devices: todo

  # Platinum
  async-dependency: todo
  inject-websession: todo
  strict-typing: todo
```

Silver、Gold 和 Platinum 规则暂时保持 `todo`。其中一些已经触手可及，但把它们留给以后的拉取请求。只有当规则确实完成时才将其标记为 `done`：一条被标记为 `done` 的规则会在 hassfest 和 pylint 中开启额外的检查，其余部分由审查者检查。

文档和品牌规则在此文件中为 `done`，但它们是在其他拉取请求中满足的。审查者会检查那些拉取请求，所以在你的拉取请求中链接它们。

### 自行检查

不要只听信本页的说法。按照 CI 的方式验证你的集成：

```shell
python3 -m script.hassfest \
  --integration-path homeassistant/components/example_air
pytest tests/components/example_air \
  --cov=homeassistant.components.example_air \
  --cov-report term-missing
```

Hassfest 现在会运行你标记为 `done` 的规则的验证器，比如 `config-flow`、`runtime-data`、`test-before-setup` 和 `unique-config-entry`。覆盖率报告必须显示 `config_flow.py` 达到 100%。[所有规则的列表](/core/quality-scale/rules/)用一行文字解释每条规则，[自行检查](/core/quality-scale/raise-tier/#check-it-yourself)解释了每项检查能证明什么，以及它不能证明什么。

## 12. 发起拉取请求

打算先在 Marketplace 发布？请改为按照[发布自定义集成](/marketplace/guides/integrations/)操作，等你的集成成熟并拥有用户群后再回到这一步。

在推送之前，对所有内容运行 linter，并最后一次运行 hassfest，不跳过任何内容。包含它们更改的每一个文件，也包括你的集成文件夹之外的文件：

```shell
prek run --all-files
python3 -m script.hassfest
```

现在你的拉取请求包含你的集成、它的测试、生成的文件以及更新后的依赖文件。在你开始时创建的分支上提交，推送到你的 fork，然后针对 [home-assistant/core](https://github.com/home-assistant/core) 的 `dev` 分支发起拉取请求。[提交拉取请求](/core/development/submitting/)会逐一讲解模板。对于一个新集成：

- 选择 **New integration** 作为变更类型。
- 解释这个设备或服务是什么，并链接到你库的源代码仓库、它的发布工作流，以及你所依赖版本的标签。
- 链接文档和品牌的拉取请求。
- 保持只包含你在这里构建的内容：一个平台，没有更多。诊断、动作、重新认证和选项以后再说，每次一个拉取请求。

然后等待就开始了。新集成的审查需要时间，有时需要数周。在等待期间，审查其他人的拉取请求：这是学习的最佳方式，也能让整个队列为每个人更快地推进。[发起拉取请求之后](/core/development/review-process/)解释了接下来会发生什么。

## 接下来做什么

你的集成已经合入。现在让它变得更好，每次一个小的拉取请求：

- [提升级别](/core/quality-scale/raise-tier/)（raise tier）到 Silver：优雅地处理离线设备，如果你的设备需要凭据则添加重新认证，并达到超过 95% 的测试覆盖率。
- 添加[诊断](/core/integrations/diagnostics/)（diagnostics），让用户在报告错误时可以分享集成所看到的内容。
- 支持[发现](/core/integrations/discovery/)（discovery），让 Home Assistant 自动找到监测仪。
- 添加第二个平台，比如用于空气质量报警的[二进制传感器](/core/entities/binary-sensor/)（binary sensor）。
