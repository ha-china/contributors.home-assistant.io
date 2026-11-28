# YAML 配置

> 集成何时仍可以在 configuration.yaml 中进行配置，以及 Home Assistant 如何验证该配置。

Source: https://www.hasscn.top/contributors/core/integrations/yaml/

`configuration.yaml` 是由用户自己编写的配置文件。在很长一段时间里，每个集成都是通过它来设置的。如今，大多数集成在 UI 中通过[配置流程（config flow）](https://www.hasscn.top/contributors/core/integrations/config-flow/)进行设置。

## 何时允许使用 YAML

该规则来自 [ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md)：

- 与设备或服务通信的集成只能在 UI 中进行配置。在极少数情况下会有例外。
- 所有其他集成，例如辅助元素（helper）或仅处理数据的集成，可以在 YAML 中配置，在 UI 中配置，或两者兼用。

这适用于每一个新的集成。对于与设备或服务通信且仍保留 YAML 的现有集成，我们鼓励它们添加配置流程并移除 YAML 支持。对其 YAML 配置的更改已不再被接受。

## 不支持 YAML 的集成

即使不支持 YAML，您的 `__init__.py` 中通常也会有 `async_setup` 函数，例如用于[注册动作（action）](https://www.hasscn.top/contributors/core/integrations/actions/)。Hassfest 要求每个在 `__init__.py` 中包含 `async_setup` 或 `setup` 函数的集成在该文件中定义一个 `CONFIG_SCHEMA`。它也接受由 `sensor` 等实体集成（entity integration）定义的 `PLATFORM_SCHEMA` 或 `PLATFORM_SCHEMA_BASE`，或者接受 `config.py` 中的 `async_validate_config` 函数。在不支持 YAML 的情况下，请使用 `homeassistant.helpers.config_validation` 中的以下辅助函数之一：

```python
from homeassistant.helpers import config_validation as cv

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
```

| 辅助函数 | 使用场景 |
| --- | --- |
| `config_entry_only_config_schema` | 该集成仅通过配置条目（config entry）进行设置。如果用户仍然将该域名（domain）添加到 YAML 中，Home Assistant 会记录一个错误，并创建一个修复问题（repair issue），提示用户在 UI 中添加该集成。 |
| `platform_only_config_schema` | 该集成只有平台（platform）在 YAML 中进行配置，其自身的键下没有任何内容 |
| `empty_config_schema` | 该集成可以通过 YAML 中其自身的键进行设置，但不接受任何选项 |

## 如何验证 YAML

当 Home Assistant 加载一个在 YAML 中配置的集成时，它会首先使用该集成的 `CONFIG_SCHEMA` 验证配置。您的设置函数收到的 `config` 就是该验证的结果。

```python
import probatio

from homeassistant.helpers import config_validation as cv

CONFIG_SCHEMA = probatio.Schema(
    {
        DOMAIN: probatio.Schema(
            {
                probatio.Required(CONF_NAME): cv.string,
                probatio.Optional(CONF_PORT, default=80): cv.port,
            }
        )
    },
    extra=probatio.ALLOW_EXTRA,
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration from YAML."""
    if DOMAIN not in config:
        return True

    name = config[DOMAIN][CONF_NAME]
    ...
    return True
```

该模式（schema）会接收整个配置，因此请使用 `extra=probatio.ALLOW_EXTRA`，从而不改动其他集成的键。

## YAML 中的平台

较旧的集成将其配置放在某个实体集成的域名下，并使用一个 `platform` 键：

```yaml
sensor:
  - platform: example
    name: "Outside"
```

这是实体集成的现有机制，新集成不得使用它。根据 [ADR-0007](https://github.com/home-assistant/architecture/blob/master/adr/0007-integration-config-yaml-structure.md)，集成的所有 YAML 配置都放在其自身域名对应的键下。随后，集成会使用 `homeassistant.helpers.discovery` 中的 `async_load_platform` 自行加载其平台：

```python
from homeassistant.const import Platform
from homeassistant.helpers.discovery import async_load_platform


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration and its platforms from YAML."""
    hass.async_create_task(
        async_load_platform(
            hass, Platform.SENSOR, DOMAIN, config[DOMAIN], config
        )
    )

    return True
```

平台在其 `async_setup_platform` 中以 `discovery_info` 的形式接收数据。在集成被重构之前，现有集成的平台部分中的 YAML 配置处于冻结状态。

对于实体集成来说，`PLATFORM_SCHEMA` 就是这一机制在底层的运作方式。Home Assistant 会收集每一个以该域名开头的键（例如 `sensor:` 和 `sensor living room:`）的配置，先根据实体集成的模式（`PLATFORM_SCHEMA_BASE`，否则为 `PLATFORM_SCHEMA`）验证每一项，再根据其平台（如果有）的 `PLATFORM_SCHEMA` 进行验证，并丢弃未知平台的项或配置无效的项。

## 从 YAML 迁移到配置流程

当集成迁移到配置流程时，现有的 YAML 配置通常会被导入一次。`async_setup` 使用 `import` 来源启动该流程，配置流程在 `async_step_import` 中创建配置条目，集成会创建一个[修复问题](https://www.hasscn.top/contributors/core/integrations/repairs/)，告知用户移除 YAML。不再支持 YAML 是一项[向后不兼容的更改](https://www.hasscn.top/contributors/glossary/backward-incompatible-change/)，因此请遵循[弃用流程](https://www.hasscn.top/contributors/core/development/deprecating/)。

关于 YAML 中的 OAuth 2.0 凭据，请参阅[来自 YAML 的凭据](https://www.hasscn.top/contributors/core/integrations/oauth2/#credentials-from-yaml)。
