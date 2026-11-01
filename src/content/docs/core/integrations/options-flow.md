---
title: 选项流程
description: 让用户在设置完成后更改集成的行为方式，并在更改时重新加载集成。
sidebarGroup: Setup and configuration
order: 4
---

[选项流程（options flow）](/glossary/options-flow/)让用户可以在设置完成后更改配置项（config entry）的设置，例如要包含哪些设备或是否显示访客。用户通过该配置项的 **Configure** 按钮打开它。这些选项最终会存放在 `entry.options` 中。

选项用于描述集成如何运行。更改连接方式（例如新的主机地址）属于[重新配置（reconfiguration）](/core/integrations/reauth-reconfigure/)，更改凭据则属于[重新认证（reauthentication）](/core/integrations/reauth-reconfigure/#reauthentication)。轮询间隔也不是一个选项：你需要为用户选择它，参见[适当的轮询（appropriate polling）](/core/quality-scale/appropriate-polling/)。

## 添加选项流程

在配置流程（config flow）中通过 `async_get_options_flow` 返回你的选项流程。选项流程从 `async_step_init` 开始，并通过 `self.config_entry` 访问该配置项。

```python
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.core import callback

OPTIONS_SCHEMA = probatio.Schema(
    {probatio.Required(CONF_SHOW_GUESTS, default=False): bool}
)


class ExampleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Example."""

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: ConfigEntry,
    ) -> ExampleOptionsFlow:
        """Create the options flow."""
        return ExampleOptionsFlow()


class ExampleOptionsFlow(OptionsFlowWithReload):
    """Handle the options of Example."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                OPTIONS_SCHEMA, self.config_entry.options
            ),
        )
```

选项流程中的 `async_create_entry` 并不会创建新的配置项：它将 `data` 存储为现有配置项的新选项。`add_suggested_values_to_schema` 会用当前选项填充表单。文本应放在 `strings.json` 的 `options` 键下，方式与[配置流程文本](/core/integrations/flow-steps/#labels-and-descriptions)相同。

在选项流程的 `__init__` 中无法使用配置项。请在各个步骤中使用 `self.config_entry`。

## 对新选项做出响应

大多数集成需要重新加载才能使用新选项。像上面的示例那样，继承 `OptionsFlowWithReload` 而不是 `OptionsFlow`，这样当选项更改时，Home Assistant 就会重新加载该配置项。

如果你的集成无需重新加载即可应用新选项，请继承 `OptionsFlow`，并在设置该配置项时注册一个更新监听器（update listener）。它会在配置项被更新时运行，并在配置项卸载时停止：

```python
async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""
    ...
    entry.async_on_unload(entry.add_update_listener(async_update_options))


async def async_update_options(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Apply the new options."""
    entry.runtime_data.show_guests = entry.options[CONF_SHOW_GUESTS]
```

不要将两者结合使用：当配置项已有更新监听器时，`OptionsFlowWithReload` 会引发错误。更新监听器也会在配置项的其他每次更新时被调用，因此如果你使用更新监听器，就由它负责重新加载。当重新配置或重新认证流程、或会更新配置项的发现（discovery）重新加载一个带有更新监听器的配置项时，Home Assistant 会记录一条警告。该警告计划在 Home Assistant 2026.12 中变为错误。子配置项（subentry）重新配置流程若重新加载带有更新监听器的配置项，已经会引发错误。
