---
title: 弃用
description: 如何在不一夜之间破坏用户家庭的情况下移除或更改 Home Assistant Core 中的行为。弃用期、修复问题，以及面向开发者 API 的辅助工具。
sidebarGroup: Changing behavior
order: 1
---

[弃用](/glossary/deprecation/)是指被安排在稍后执行的[不向后兼容的更改](/glossary/backward-incompatible-change/)。旧行为继续工作，所有受影响的人都会收到警告，而移除会在之后的版本中发生。

任何你要移除的内容都必须先经过弃用。即使你认为只有少数人在使用它也是如此：一个实体（entity）、一个动作（action）或一个常量都可能被你无法看到的自动化、脚本、仪表盘（dashboard）和自定义集成（custom integration）所使用。

## 时长

| 受影响的对象 | 最短期限 |
| --- | --- |
| 用户：YAML 配置、动作、实体、属性、集成 | 6 个月 |
| 开发者：常量、辅助工具（helper）、实体属性、自定义集成使用的平台 API | 12 个月 |

当生态系统尚未跟上时，弃用期可以延长，但绝不能缩短。以[版本格式](/core/development/versioning/)在 `breaks_in_ha_version` 中指明执行移除的版本，例如 `"2027.1.0"`。

只要旧行为仍然有效，就使用 `IssueSeverity.WARNING`。只有当它已经停止工作时才使用 `IssueSeverity.ERROR`：集成已不存在，或者迁移失败，用户的配置不再生效。当你移除一个无法创建修复问题（repair issue）的面向开发者的功能时，日志级别也采用同样的划分。

## 面向用户的弃用

Every deprecation that needs the user to do something gets a [repair issue](/glossary/repair/). When an integration can be set up more than once, include the config entry in the `issue_id`, or the issues of different entries overwrite each other. Set the [`config_entry_id`](/core/integrations/repairs/#issues-that-belong-to-a-config-entry) of the issue too, so it is deleted together with the entry. After the deprecation period, open a follow up pull request that removes the old behavior and the issue.

你在自己域名下创建的每个问题都需要在集成的 `strings.json` 中有一个 `issues.<translation_key>` 条目。在 `HOMEASSISTANT_DOMAIN` 下创建的问题（如 `deprecated_yaml`）使用 core 中已有的文本。

### 移除 YAML 支持

要将一个集成从 YAML 迁移到 UI，需要添加一个带有导入步骤的配置流程（config flow）。在 `async_setup` 中导入 YAML 配置。当导入成功时，抛出 core 的 `deprecated_yaml` 问题。该问题属于 `homeassistant` 域，因此要在 `HOMEASSISTANT_DOMAIN` 下创建它，并将 `issue_domain` 设置为你自己的域名：

```python
async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration."""
    if DOMAIN not in config:
        return True

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_IMPORT}, data=config[DOMAIN]
    )
    # On the next start, the import aborts because the entry exists.
    # That is not a failure.
    if result.get("type") is FlowResultType.ABORT and result["reason"] not in (
        "already_configured",
        "single_instance_allowed",
    ):
        # The import failed, so the YAML is not in effect: raise your own
        # issue with ERROR severity here, and stop.
        return True

    ir.async_create_issue(
        hass,
        HOMEASSISTANT_DOMAIN,
        f"deprecated_yaml_{DOMAIN}",
        breaks_in_ha_version="2027.1.0",
        is_fixable=False,
        issue_domain=DOMAIN,
        severity=ir.IssueSeverity.WARNING,
        translation_key="deprecated_yaml",
        translation_placeholders={
            "domain": DOMAIN,
            "integration_title": "Example",
        },
    )
    return True
```

只有在导入成功后才抛出 `deprecated_yaml`。否则你会告诉用户他们的配置已被导入，而实际上并没有。因为条目已存在而中止算作成功：这正是首次导入之后每次启动时发生的情况。你的导入步骤使用哪个原因取决于它如何检查现有条目，因此请将原因与你自己的配置流程相匹配。

当期限结束且 YAML 代码被移除后，将 `CONFIG_SCHEMA` 设置为 `cv.config_entry_only_config_schema(DOMAIN)`。它会为任何仍在 `configuration.yaml` 中保留该集成的人记录一条错误并抛出一个修复问题。

### 单个 YAML 选项

要弃用一个或几个选项，请在读取 YAML 的 `async_setup` 中抛出问题，并且仅在该选项实际被使用时才抛出。该选项在期限结束前会继续工作。

```python
async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration."""
    if CONF_IPV6 in config[DOMAIN]:
        ir.async_create_issue(
            hass,
            DOMAIN,
            "deprecated_ipv6",
            breaks_in_ha_version="2027.1.0",
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="deprecated_ipv6",
        )
```

当期限结束时，不要只是从模式（schema）中删除该选项。在原处放置 `cv.removed(CONF_IPV6)`：它会告诉用户该选项已被移除，而不是因一个笼统的验证错误而失败。

### 动作

在动作的处理程序中抛出问题。要弃用动作的单个字段，仅在该字段被传入时才抛出。

```python
async def render_image(call: ServiceCall) -> ServiceResponse:
    """Render an image."""
    ir.async_create_issue(
        call.hass,
        DOMAIN,
        "deprecated_render_image",
        breaks_in_ha_version="2027.1.0",
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="deprecated_render_image",
    )
```

### 实体和属性

当一个属性变成一个独立的实体、一个实体迁移到另一个平台，或者一个实体被移除时，先创建新实体，并在期限内保持旧实体继续工作。

为每一个仍然存在且已启用的被弃用实体抛出一个问题。使用 `automations_with_entity()` 和 `scripts_with_entity()` 来列出将会失效的自动化和脚本。用户通过禁用该实体来确认弃用。一旦它被禁用且没有任何东西使用它，就将其从注册表（registry）中移除，这样它就不会被再次创建。

```python
def async_deprecate_entity(
    hass: HomeAssistant,
    entity_registry: er.EntityRegistry,
    description: ExampleSwitchEntityDescription,
) -> bool:
    """Return whether the deprecated entity should still be created."""
    entity_id = entity_registry.async_get_entity_id(
        Platform.SWITCH, DOMAIN, description.unique_id
    )
    if entity_id is None:
        return False

    items = automations_with_entity(hass, entity_id) + scripts_with_entity(
        hass, entity_id
    )
    entry = entity_registry.async_get(entity_id)
    if entry.disabled and not items:
        entity_registry.async_remove(entity_id)
        return False

    placeholders = {
        "entity_id": entity_id,
        "new_entity_id": description.replacement_entity_id,
    }
    if items:
        placeholders["items"] = "\n".join(items)

    ir.async_create_issue(
        hass,
        DOMAIN,
        f"deprecated_entity_{entity_id}",
        breaks_in_ha_version="2027.2.0",
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key=(
            "deprecated_entity_used" if items else "deprecated_entity"
        ),
        translation_placeholders=placeholders,
    )
    return True
```

在平台的 `async_setup_entry` 中调用它，并让它的返回值决定添加哪些实体。一个尚不存在的实体会返回 `False`，因此新用户永远不会得到被弃用的实体。

```python
async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the switch platform."""
    coordinator = entry.runtime_data
    entity_registry = er.async_get(hass)

    entities = [
        ExampleSwitch(coordinator, description) for description in SWITCHES
    ]
    entities.extend(
        ExampleSwitch(coordinator, description)
        for description in DEPRECATED_SWITCHES
        if async_deprecate_entity(hass, entity_registry, description)
    )
    async_add_entities(entities)
```

该问题不是持久化的：只要该实体仍在使用，它会在每次启动时被重新创建。消息会列出该实体可能被使用的每一个地方，而不仅仅是自动化和脚本，并告诉用户禁用它就能让问题消失：

```json
{
  "issues": {
    "deprecated_entity": {
      "title": "Deprecated switch detected",
      "description": "The switch `{entity_id}` is deprecated because it has been replaced with `{new_entity_id}`.\n\nUpdate your dashboards, templates, automations, and scripts to use the replacement entity, then disable the deprecated switch and restart Home Assistant."
    }
  }
}
```

上面的代码在实体仍在使用时会使用第二个键 `deprecated_entity_used`。将它添加在 `deprecated_entity` 旁边，使用相同的标题，并在描述中带有一个 `{items}` 占位符：自动化和脚本的列表就放在那里。它的描述告诉用户更新这些内容以及所有仪表盘和模板，然后禁用被弃用的实体并重启。

### 移除一个集成

当一个集成永久停止工作时，例如因为供应商关闭了其 API，就将其移除。将它精简为一个抛出 `ERROR` 问题的存根（stub），并保留一个最小的 `config_flow.py`，这样现有的条目仍能加载，用户也能看到发生了什么。既定的翻译键是 `integration_removed`：

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Set up the integration from a config entry."""
    ir.async_create_issue(
        hass,
        DOMAIN,
        DOMAIN,
        is_fixable=False,
        severity=ir.IssueSeverity.ERROR,
        translation_key="integration_removed",
        translation_placeholders={
            "entries": f"/config/integrations/integration/{DOMAIN}",
        },
    )
```

`entries` 占位符链接到用户的配置条目。在文本中解释集成为何被移除，以及他们可以移除这些条目。在该域的最后一个配置条目被卸载后，在 `async_unload_entry` 中再次删除该问题。

当集成被后继者取代时，这属于弃用：使用带有 `breaks_in_ha_version` 的 `WARNING`，并以 `deprecated` 为原因中止配置流程，这样任何人都无法添加新条目。

### 文档和测试

修复问题和版本发布说明会宣布弃用。不要在 [home-assistant.io](https://www.home-assistant.io/) 的文档中添加弃用通知：它只描述今天可用的功能。

使用 `issue_registry` fixture 测试问题被创建，并且在最后一个配置条目卸载时问题被再次删除。

## 面向开发者的弃用

任何被其他集成导入或继承的内容都是核心 API：`homeassistant/helpers/`、`homeassistant/const.py` 中的所有内容，以及像 `homeassistant/components/sensor/` 这样的实体平台。更改其中之一会影响[自定义集成](/glossary/custom-integration/)的作者，他们需要时间来做出反应。这些弃用有 12 个月的期限，并在[博客](/blog/)上发布一篇文章，指明替代方案（如果有的话）以及执行移除的版本。

下面的辅助工具会记录一条警告，指明使用被弃用代码的集成。它们不会创建修复问题：用户无法修复自定义集成的代码。

### 常量、别名和枚举成员

用 `_DEPRECATED_` 前缀重命名旧常量，将其包装起来，并添加三个模块钩子。这样读取旧名称仍然有效，并会发出警告：

```python
from functools import partial

from homeassistant.helpers.deprecation import (
    DeprecatedConstantEnum,
    all_with_deprecated_constants,
    check_if_deprecated_constant,
    dir_with_deprecated_constants,
)

_DEPRECATED_CONCENTRATION_GRAMS_PER_CUBIC_METER = DeprecatedConstantEnum(
    UnitOfDensity.GRAMS_PER_CUBIC_METER, "2027.8"
)

# Remove these once the module has no deprecated constants left.
__getattr__ = partial(check_if_deprecated_constant, module_globals=globals())
__dir__ = partial(
    dir_with_deprecated_constants, module_globals_keys=[*globals().keys()]
)
__all__ = all_with_deprecated_constants(globals())
```

对于普通值使用 `DeprecatedConstant`，对于枚举成员使用 `DeprecatedConstantEnum`，当类或函数被移动时使用 `DeprecatedAlias`。要弃用你保留的枚举中的一个成员，请使用 `EnumWithDeprecatedMembers` 元类：

```python
class MediaPlayerState(
    StrEnum,
    metaclass=EnumWithDeprecatedMembers,
    deprecated={
        "STANDBY": (
            "MediaPlayerState.OFF or MediaPlayerState.IDLE",
            "2026.8.0",
        ),
    },
):
    """State of media player entities."""

    OFF = "off"
    IDLE = "idle"
    STANDBY = "standby"
```

被弃用的常量只在读取它们的代码属于某个集成时才发出警告。核心代码和测试会静默地读取它们。这就是为什么下面的测试辅助工具要通过一个自定义集成来进行。

### 函数、方法和类

```python
@deprecated_function(
    "homeassistant.helpers.sun.get_astral_observer",
    breaks_in_ha_version="2027.7",
)
@callback
def get_astral_location(hass: HomeAssistant) -> tuple[Location, Elevation]:
    """Get an astral location for Home Assistant."""
```

`@deprecated_class` 在类被实例化时发出警告，是将重命名后的类作为别名保留的方式。两者都以字符串形式接收替代项。要弃用函数不再需要的开头的 `hass` 参数，请使用 `@deprecated_hass_argument`。它会发出警告，并丢弃该参数。

### 模式

有时问题不在于名称，而在于某种使用方式，比如设置一个你想要移除的属性，或者调用一个现在被平台取代的函数。使用 `homeassistant.helpers.frame` 中的 `report_usage()`：

```python
report_usage(
    "calls system_health.async_register_info, which is deprecated; "
    "add a system_health platform instead",
    breaks_in_ha_version="2027.1",
    core_behavior=ReportBehavior.ERROR,
    exclude_integrations={DOMAIN},
)
```

第一个参数会被插入到 "Detected that integration 'domain' ..." 中，因此请将其写成一个动词短语。

`report_usage()` 通过遍历调用栈来找到负责的集成。当集成自己调用被弃用的代码时，这有效。但当核心读取集成之前设置的某些内容时，例如一个被弃用的实体属性，这就无效了：到那时，集成已不在调用栈上。在这种情况下，请从一个知道其来源的对象传递 `integration_domain`，例如实体上的 `self.platform.platform_name`。

三个参数决定谁得到什么。每个参数都接受一个 `ReportBehavior`：`IGNORE` 什么都不说，`LOG` 以 `level` 为每个调用者记录一次，`ERROR` 则记录并抛出 `RuntimeError`。

| 参数 | 适用于 | 默认值 |
| --- | --- | --- |
| `core_behavior` | `homeassistant/` 中的代码，调用栈上没有集成 | `ERROR` |
| `core_integration_behavior` | 内置集成 | `LOG` |
| `custom_integration_behavior` | 自定义集成 | `LOG` |

默认值通常是正确的：核心代码在测试中会大声失败，集成会收到警告。当你仍在迁移内置集成时，将 `core_integration_behavior` 设置为 `IGNORE`，这样自定义集成的作者就能收到警告，而日志不会充满你已经在修复的案例。

### 测试

`tests/common.py` 为被弃用的名称提供了 `import_and_test_deprecated_constant`、`import_and_test_deprecated_constant_enum`、`import_and_test_deprecated_alias` 和 `help_test_all`。`mock_integration_frame` fixture 帮助你测试 `report_usage()` 的警告。
