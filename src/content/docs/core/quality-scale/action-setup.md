---
title: 在 async_setup 中注册动作
description: "铜牌规则 action-setup：动作在集成加载时注册，而不是针对每个配置条目注册。"
sidebarLabel: action-setup
sidebarGroup: Bronze
order: 1
---

这是一条铜牌（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `action-setup`。

如果集成添加了自己的[动作（action）](/glossary/action/)，应在 `async_setup` 中注册它们，而不是在 `async_setup_entry` 中。这样，只要集成加载，动作就存在，无论[配置条目（config entry）](/glossary/config-entry/)是否已加载。验证在动作内部进行：检查其针对的配置条目是否存在并已加载，如果不存在或输入无效，则抛出 `ServiceValidationError`。

## 为什么重要

许多集成过去在 `async_setup_entry` 中注册动作，并在 `async_unload_entry` 中将其移除。这意味着动作只在条目加载期间存在。当设备在启动时处于离线状态，动作就会缺失，Home Assistant 无法验证使用该动作的自动化和脚本。用户只会看到一个含糊的“找不到动作”（action not found）提示，而不是明确的原因。

在 `async_setup` 中注册后，动作始终存在。当条目未加载时，动作本身会告诉用户它为什么无法运行。

## 示例

Register the actions in `services.py`, in one function called `async_setup_services`. It is a synchronous function, decorated with `@callback`, that takes only `hass`:

```python title="services.py"
@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register the actions of My integration."""

    async def async_get_schedule(call: ServiceCall) -> ServiceResponse:
        """Get the schedule of a device."""
        entry: MyConfigEntry = service.async_get_config_entry(
            hass, DOMAIN, call.data[ATTR_CONFIG_ENTRY_ID]
        )
        schedule = await entry.runtime_data.client.get_schedule()
        return {"schedule": schedule}

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCHEDULE,
        async_get_schedule,
        schema=SERVICE_GET_SCHEDULE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
```

`homeassistant.helpers.service` 中的 `service.async_get_config_entry` 会替你完成这些检查。当条目不存在、属于其他集成或未加载时，它会抛出已翻译的 `ServiceValidationError`。

在 `__init__.py` 的 `async_setup` 中调用该函数。仅通过 UI 设置的集成还需要一个说明这一点的 `CONFIG_SCHEMA`：

```python title="__init__.py"
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up My integration."""
    async_setup_services(hass)
    return True
```

## 如何检查

- Pylint warns when actions are registered in `async_setup_entry` (`home-assistant-service-registered-in-setup-entry`).
- Pylint warns when actions are registered outside `services.py` (`home-assistant-action-registered-outside-services-module`).
- Pylint warns when `async_setup_services` does not have the shape shown in the example (`home-assistant-invalid-setup-services`).
- The checks inside the action are verified in review.

## 例外

如果集成没有注册任何自己的动作，则此规则不适用。

## 相关规则

- [action-exceptions](/core/quality-scale/action-exceptions/)：当动作失败时抛出异常。
