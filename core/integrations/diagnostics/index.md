# 诊断

> 让用户下载配置条目或设备的数据，以便他们在报告问题时进行分享，且不会泄露机密信息。

Source: https://www.hasscn.top/contributors/core/integrations/diagnostics/

[诊断（diagnostics）](https://www.hasscn.top/contributors/glossary/diagnostics/)功能让用户下载一个包含您的集成（integration）数据的 JSON 文件，并将其附加到 issue 中。对于作为维护者的您来说，这通常是了解用户家中情况的最快方式。

用户可以在集成页面上通过配置条目（config entry）的菜单下载该条目的诊断数据，也可以在设备页面上下载设备的诊断数据。如果您的集成没有设备诊断功能，设备页面将改为提供配置条目的诊断数据。

诊断是[质量标准（quality scale）](https://www.hasscn.top/contributors/core/quality-scale/)金牌（Gold）级别的一项规则。

## 添加诊断

创建 `diagnostics.py`，并实现以下一个或两个函数：

```python
from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.const import CONF_API_KEY, CONF_PASSWORD
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntry

TO_REDACT = {CONF_API_KEY, CONF_PASSWORD, "serial_number"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    return {
        "entry_data": async_redact_data(entry.data, TO_REDACT),
        "data": async_redact_data(
            entry.runtime_data.data.to_dict(), TO_REDACT
        ),
    }


async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: ExampleConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """Return diagnostics for a device."""
    appliance = entry.runtime_data.get_appliance(device)

    return {"details": async_redact_data(appliance.raw_data, TO_REDACT)}
```

## 排除敏感数据

用户会在公开的 issue 中发布诊断数据。请确保其中不包含任何敏感信息，例如：

- 密码、API 密钥和令牌
- 位置数据，例如坐标和地址
- 个人信息，例如姓名和电子邮件地址

`async_redact_data` 会将您所列键的值替换为 `**REDACTED**`，包括嵌套字典和列表中的值。值为 `None` 或空字符串的值将保持原样，因此您仍然可以看出某个值未被设置。请手动检查诊断输出：来自 API 的数据所包含的内容往往超出您的预期。

要包含设备或实体（entity）注册表条目，请使用 `homeassistant.components.diagnostics` 中的 `device_entry_as_dict` 或 `entity_entry_as_dict` 对其进行转换。它们会省略条目的内部字段。

## 测试诊断

使用快照（snapshot）来测试输出，这样对输出的更改就会在代码审查中显现出来。`tests/components/diagnostics` 中的测试辅助函数 `get_diagnostics_for_config_entry` 和 `get_diagnostics_for_device` 会返回用户将要下载的内容。请参阅[快照测试](https://www.hasscn.top/contributors/core/development/tests/#snapshot-tests)。
