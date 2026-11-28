# 配置子条目

> 将配置条目拆分为用户逐个添加的部分，例如天气服务的各个位置。

Source: https://www.hasscn.top/contributors/core/integrations/subentries/

[配置子条目（config subentry）](https://www.hasscn.top/contributors/glossary/config-subentry/)是配置条目（config entry）的一个组成部分，用户可以单独添加、更改和删除它。以天气服务为例：配置条目保存账户信息，而每个您想要获取天气预报的位置都是一个子条目。用户从配置条目的页面添加子条目，无需再次设置账户。

子条目拥有自己的流程。子条目流程的工作方式类似于[配置流程（config flow）](https://www.hasscn.top/contributors/core/integrations/config-flow/)，但有两点不同：它只能以 `user` 或 `reconfigure` 步骤开始，并且不支持发现和重新身份验证。

## 添加子条目类型

告诉 Home Assistant 您的配置条目支持哪些类型的子条目，以及每种类型由哪个流程处理：

```python
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigSubentryFlow,
    SubentryFlowResult,
)
from homeassistant.core import callback


class ExampleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Example."""

    @classmethod
    @callback
    def async_get_supported_subentry_types(
        cls, config_entry: ConfigEntry
    ) -> dict[str, type[ConfigSubentryFlow]]:
        """Return the subentry types this integration supports."""
        return {"location": LocationSubentryFlow}


class LocationSubentryFlow(ConfigSubentryFlow):
    """Add and change a location."""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Add a new location."""
        if user_input is not None:
            return self.async_create_entry(
                title=user_input[CONF_NAME],
                data=user_input,
                unique_id=f"{user_input[CONF_LATITUDE]}"
                f"_{user_input[CONF_LONGITUDE]}",
            )

        return self.async_show_form(
            step_id="user", data_schema=LOCATION_SCHEMA
        )
```

在子条目流程中，`self._get_entry()` 返回父配置条目。配置流程也可以直接创建子条目，方法是将 `subentries` 传递给它自己的 `async_create_entry`。

## 唯一 ID

子条目可以拥有唯一 ID。[与配置条目相同的规则](https://www.hasscn.top/contributors/core/integrations/config-flow/#what-makes-a-good-unique-id)同样适用，唯一的不同是它只需在其所属的配置条目内保持唯一。

## 重新配置子条目

添加 `reconfigure` 步骤，让用户能够更改现有的子条目。只要该步骤存在，Home Assistant 就会显示此选项。使用 `self._get_reconfigure_subentry()` 获取子条目，并以 `async_update_and_abort` 或 `async_update_reload_and_abort` 结束：

```python
async def async_step_reconfigure(
    self, user_input: dict[str, Any] | None = None
) -> SubentryFlowResult:
    """Change an existing location."""
    entry = self._get_entry()
    subentry = self._get_reconfigure_subentry()

    if user_input is not None:
        return self.async_update_reload_and_abort(
            entry, subentry, data_updates=user_input
        )

    return self.async_show_form(
        step_id="reconfigure",
        data_schema=self.add_suggested_values_to_schema(
            LOCATION_SCHEMA, subentry.data
        ),
    )
```

`async_update_reload_and_abort` 会重新加载父配置条目。如果该条目具有更新监听器（update listener），它将引发错误。

## 在设置时使用子条目

子条目位于 `entry.subentries` 中，这是一个从子条目 ID 到 `ConfigSubentry` 的映射，包含其 `subentry_type`、`title`、`data` 和 `unique_id`。要获取某一类型的所有子条目，请调用 `entry.get_subentries_of_type("location")`。

实体（entity）和设备（device）可以属于一个子条目。添加实体时请传入 `config_subentry_id`，这样它们会被归组到正确的子条目下，并随其一起移除：

```python
async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up a weather entity per location."""
    for subentry in entry.get_subentries_of_type("location"):
        async_add_entities(
            [ExampleWeather(entry.runtime_data, subentry)],
            config_subentry_id=subentry.subentry_id,
        )
```

## 文本和翻译

子条目流程的文本放在 `strings.json` 的 `config_subentries` 下，每个子条目类型对应一个键。除了常见的 `step`、`error` 和 `abort` 部分之外，每种类型还需要：

- `entry_type`：该类型单个子条目的名称，例如 “Location”。
- `initiate_flow`：启动流程的按钮标签。`user` 为必需，`reconfigure` 为可选。

```json
{
  "config_subentries": {
    "location": {
      "entry_type": "Location",
      "initiate_flow": {
        "user": "Add location",
        "reconfigure": "Change location"
      },
      "step": {
        "user": {
          "title": "Add location",
          "data": {
            "name": "[%key:common::config_flow::data::name%]"
          }
        },
        "reconfigure": {
          "title": "Change location"
        }
      }
    }
  }
}
```
