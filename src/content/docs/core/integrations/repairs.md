---
title: 维修
description: 告知用户需要处理的问题，并通过维修流程（repair flow）帮助他们解决这些问题。
sidebarGroup: Integration features
order: 6
---

[维修（repair）](/glossary/repair/)问题会告知用户需要注意的事项，例如过旧的固件、即将停用的 API，或不再受支持的 YAML 配置。问题会显示在 **设置** > **系统** > **维修** 中。有些问题只说明需要做什么，另一些则可以通过维修流程当场修复。

维修也是公布影响用户的[弃用（deprecation）](/core/development/deprecating/)的方式，这是它最常见的用途之一。核心 API 的弃用则改为通过日志报告给开发者。

## 创建问题

```python
from homeassistant.helpers import issue_registry as ir

ir.async_create_issue(
    hass,
    DOMAIN,
    "firmware_too_old",
    is_fixable=False,
    severity=ir.IssueSeverity.ERROR,
    translation_key="firmware_too_old",
    translation_placeholders={"version": device.firmware_version},
    learn_more_url="https://www.home-assistant.io/integrations/example",
)
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `domain` | | 创建问题的域 |
| `issue_id` | | 问题的 ID，在域内唯一。使用现有 ID 创建问题会更新它。 |
| `is_fixable` | | 用户是否可以通过维修流程修复问题 |
| `severity` | | 严重程度。见下文。 |
| `translation_key` | | `strings.json` 中标题和描述的键 |
| `translation_placeholders` | `None` | 文本中占位符的值 |
| `config_entry_id` | `None` | 问题所属的配置条目。当该条目被禁用时，问题被隐藏；当条目被移除时，问题被删除。参见[属于配置条目的问题](#issues-that-belong-to-a-config-entry)。 |
| `breaks_in_ha_version` | `None` | 某些内容失效的版本，如 `"2027.4.0"` |
| `learn_more_url` | `None` | 用户获取更多信息的地方 |
| `is_persistent` | `False` | 问题是否在重启后保留。参见[持久性](#persistence)。 |
| `issue_domain` | `None` | 当您代表另一个集成创建问题时设置 |
| `data` | `None` | 用于维修流程的数据。不向用户显示。 |

| 严重程度 | 使用时机 |
| --- | --- |
| `IssueSeverity.CRITICAL` | 保留给真正危急的情况 |
| `IssueSeverity.ERROR` | 现在已经出问题，需要立即处理 |
| `IssueSeverity.WARNING` | 将来会出问题，例如 API 即将停用 |

文本放在 `strings.json` 的 `issues` 下面：

```json
{
  "issues": {
    "firmware_too_old": {
      "title": "The firmware of your Example device is too old",
      "description": "Update the firmware from {version} in the Example app."
    }
  }
}
```

可修复的问题没有 `description`，取而代之的是 `fix_flow`，其中包含其[维修流程](#fix-an-issue-with-a-repair-flow)各步骤的文本，方式与配置流程（config flow）相同：

```json
{
  "issues": {
    "settings_outdated": {
      "title": "Your Example settings need to be updated",
      "fix_flow": {
        "step": {
          "confirm": {
            "title": "Update the Example settings",
            "description": "Select **Submit** to update your settings."
          }
        }
      }
    }
  }
}
```

## 删除问题

当问题消失后，删除该问题：

```python
ir.async_delete_issue(hass, DOMAIN, "firmware_too_old")
```

一种典型的模式：在 `async_setup_entry` 中检查问题是否存在，然后根据结果创建或删除该问题。

只有在问题真正消失时才删除它。删除问题并再次创建，会将其作为新问题显示给用户，并且会忘记用户已忽略它。当您一次检查整个问题集时，例如每个设备一个问题，请使用[刷新](#refresh-a-set-of-issues)，而不是先全部删除。

您不需要在 `async_unload_entry` 或 `async_remove_entry` 中删除问题。请设置 [`config_entry_id`](#issues-that-belong-to-a-config-entry)，Home Assistant 会处理它们。在卸载时删除问题甚至对用户不利：重新加载也会卸载条目，因此用户忽略的每个问题都会重新出现。

## 属于配置条目的问题

当问题涉及一个配置条目时，例如设备上的固件过旧或 API 密钥过期，请将 `config_entry_id` 设置为该条目的 ID。问题随后属于该条目：当条目被禁用时，问题被隐藏；当条目被移除时，问题被删除。您不需要在 `async_remove_entry` 中自行删除它。

```python
ir.async_create_issue(
    hass,
    DOMAIN,
    f"firmware_too_old_{entry.entry_id}",
    config_entry_id=entry.entry_id,
    is_fixable=False,
    severity=ir.IssueSeverity.WARNING,
    translation_key="firmware_too_old",
    translation_placeholders={"version": device.firmware_version},
)
```

需要记住的几点：

- 问题仍由其域和 `issue_id` 标识，因此 `issue_id` 必须在您的域内保持唯一。当多个配置条目可能引发同类型问题时，请将条目 ID 放入 `issue_id`。否则所有条目共享一个问题，它属于最后创建它的条目，移除该条目会为所有条目删除它。
- 配置条目必须存在。传递未知 ID 会引发 `HomeAssistantError`。在 `async_remove_entry` 中，条目已经不存在。
- 创建已存在的问题会替换其 `config_entry_id`，即使您省略 `config_entry_id` 也是如此。每次创建问题时都请传递它。
- 属于不再存在的配置条目的问题会在 Home Assistant 启动时被删除。
- 当条目被禁用时，问题会从 **维修** 和 `issues()` 模板函数中隐藏，但不会被删除。当用户重新启用条目时，问题会重新出现，无论是否被忽略。
- 不要为即将移除自身的配置条目设置 `config_entry_id`，例如迁移到另一个集成的条目。有关迁移的通知会随条目一起被删除。
- 在您的集成设置 `config_entry_id` 之前创建的问题，在再次创建之前不属于任何条目。大多数问题会在下次启动时再次创建。一个[持久](#persistence)问题如果不再创建，可能仍需要在 `async_remove_entry` 中删除一段时间。

对于不涉及单个配置条目的问题，例如不再受支持的 YAML 配置，请省略 `config_entry_id`。

## 通过维修流程修复问题

对于 `is_fixable=True` 的问题，用户会看到一个 **修复** 按钮。它会启动维修流程：一个[数据录入流程（data entry flow）](/core/integrations/flow-steps/)，与配置流程类似。当流程以 `async_create_entry` 结束时，该问题即被移除。

如果修复只是需要用户确认，则无需任何代码：在没有 `repairs.py` 的情况下，Home Assistant 会使用 `ConfirmRepairFlow`，它会要求用户确认，然后移除该问题。该确认的文本是问题 `fix_flow` 中的 `confirm` 步骤。

对于其他情况，请创建包含 `async_create_fix_flow` 的 `repairs.py`，它会为问题返回相应的流程：

```python
import probatio

from homeassistant.components.repairs import RepairsFlow, RepairsFlowResult
from homeassistant.core import HomeAssistant


class MigrateSettingsFlow(RepairsFlow):
    """Move the settings to the new format."""

    async def async_step_init(
        self, user_input: dict[str, str] | None = None
    ) -> RepairsFlowResult:
        """Start the fix."""
        return await self.async_step_confirm()

    async def async_step_confirm(
        self, user_input: dict[str, str] | None = None
    ) -> RepairsFlowResult:
        """Ask the user to confirm, then fix it."""
        if user_input is not None:
            await async_migrate_settings(self.hass, self.data["entry_id"])
            return self.async_create_entry(data={})

        return self.async_show_form(
            step_id="confirm", data_schema=probatio.Schema({})
        )


async def async_create_fix_flow(
    hass: HomeAssistant,
    issue_id: str,
    data: dict[str, str | int | float | None] | None,
) -> RepairsFlow:
    """Create the flow that fixes an issue."""
    return MigrateSettingsFlow()
```

Home Assistant 会根据问题在流程上设置 `issue_id` 和 `data`。请勿自行将它们传递给流程：否则它们会被覆盖。

### 在配置或选项流程中继续

有时修复方法是重新配置某些内容，例如配置条目或子条目（subentry）。维修流程可以通过 `next_flow` 交接给该流程：

```python
from homeassistant.components.repairs import FlowType
from homeassistant.config_entries import SOURCE_RECONFIGURE

if user_input is not None:
    result = await self.hass.config_entries.flow.async_init(
        DOMAIN,
        context={
            "source": SOURCE_RECONFIGURE,
            "entry_id": self.data["entry_id"],
        },
    )

    return self.async_abort(
        reason="reconfigure",
        next_flow=(FlowType.CONFIG_FLOW, result["flow_id"]),
    )
```

中止并不会移除该问题。请在修复完成后自行删除它，例如在重新配置步骤中、就在 `async_update_reload_and_abort` 之前，或在 `async_setup_entry` 中。

如果配置条目的迁移失败，而用户可以修复导致失败的原因，请在修复完成后从维修流程中调用 `hass.config_entries.async_retry_migration(entry_id)`。参见[迁移配置条目](/core/integrations/config-entries/#migrate-a-config-entry)。

## 刷新一组问题

通常，您的集成会一次检查整个问题集：每个设备、每辆车或配置中的每个项目一个问题。检查后，仍然存在的问题必须保留，新问题的必须创建，已消失问题的必须删除。这包括重启前的问题，以及不再存在的设备的问题。

先删除所有问题，然后创建仍然有效的问题，这种做法很诱人。但请不要这样做：每个仍然存在的问题都会获得一个全新的问题。用户会看到问题消失又出现，并且他们忽略的每个问题都会再次显示。跟踪您自己创建了哪些问题需要大量代码，而且仍然会遗漏重启前的问题。

问题刷新可以为您完成这项工作。您为一组问题开始刷新，创建仍然有效的问题，然后完成刷新。完成时会删除该组中未再次创建的问题。再次创建的问题从未被删除，因此它们保持被忽略状态，用户看不到任何变化。

之前：

```python
issue_registry = ir.async_get(hass)
for domain, issue_id in list(issue_registry.issues):
    if domain == DOMAIN and issue_id.startswith("firmware_too_old_"):
        ir.async_delete_issue(hass, DOMAIN, issue_id)

for device in coordinator.data.devices.values():
    if device.firmware_version < MINIMUM_FIRMWARE:
        ir.async_create_issue(
            hass,
            DOMAIN,
            f"firmware_too_old_{device.id}",
            config_entry_id=entry.entry_id,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="firmware_too_old",
            translation_placeholders={"version": device.firmware_version},
        )
```

之后：

```python
with ir.async_refresh_issues(
    hass,
    DOMAIN,
    issue_id_pattern="firmware_too_old_",
    config_entry_id=entry.entry_id,
):
    for device in coordinator.data.devices.values():
        if device.firmware_version < MINIMUM_FIRMWARE:
            ir.async_create_issue(
                hass,
                DOMAIN,
                f"firmware_too_old_{device.id}",
                config_entry_id=entry.entry_id,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key="firmware_too_old",
                translation_placeholders={"version": device.firmware_version},
            )
```

### 选择要刷新的问题

`ir.async_refresh_issues` 返回一个 `IssuesRefresh`。它接受问题的域，并使用以下参数缩小集合范围：

| 参数 | 选择内容 |
| --- | --- |
| `issue_id_pattern` | ID 与正则表达式匹配的问题，从 ID 开头匹配。传递字符串或编译后的 `re.Pattern`。 |
| `issue_ids` | 恰好这些问题。不存在的问题的 ID 会被跳过。 |
| `config_entry_id` | 仅[属于](#issues-that-belong-to-a-config-entry)此配置条目的问题。与其他两个参数组合使用。 |

传递 `issue_id_pattern` 或 `issue_ids`，不能同时传递：这会引发 `ValueError`。两者都不传递则刷新该域的所有问题。

模式使用 `re.match` 匹配，从问题 ID 的开头开始。因此像 `firmware_too_old_` 这样的简单前缀是有效的模式。以分隔符结尾，例如 `battery_low_` 中的 `_`，这样它就不会也匹配 `battery_lowest_abc123`。当您多次使用时，请传递编译后的模式：

```python
import re

VEHICLE_ISSUE_ID_PATTERN = re.compile(
    f"({'|'.join(map(re.escape, VEHICLE_ISSUE_TYPES))})_"
)

with ir.async_refresh_issues(
    hass,
    DOMAIN,
    issue_id_pattern=VEHICLE_ISSUE_ID_PATTERN,
    config_entry_id=entry.entry_id,
):
    ...
```

当您的集成可以多次设置时，请传递 `config_entry_id`，这样一个条目的刷新不会删除另一个条目的问题。这仅涵盖属于该条目的问题：在您设置 `config_entry_id` 之前创建的问题，在再次使用它创建之前不属于该集合。

集合在刷新开始时确定。它包括重启前尚未再次创建的问题，因此 `async_setup_entry` 中的刷新也会清理已消失设备的问题。您在刷新期间创建且不在集合中的问题，会照常创建。

### 在任何地方创建问题

您不通过刷新来创建问题。对集合中问题的任何 `ir.async_create_issue` 调用都会保留它。这意味着问题不必在 `with` 块本身中创建：检查问题的辅助函数和回调可以创建它们，只要发生在刷新完成之前。`with` 块也可以等待。

将刷新放在检查问题的代码周围，仅此而已。当平台在创建实体时检查问题时，请在该平台的 `async_setup_entry` 中开始刷新：

```python
async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the cameras."""
    with ir.async_refresh_issues(
        hass,
        DOMAIN,
        issue_id_pattern="rtsp_disabled_",
        config_entry_id=entry.entry_id,
    ):
        entities = _async_camera_entities(hass, entry)
    async_add_entities(entities)
```

不要将 `async_forward_entry_setups` 包裹在刷新中。当平台设置失败，或引发 `PlatformNotReady` 并在稍后重试时，`async_forward_entry_setups` 不会引发异常。刷新随后会在平台检查其问题之前完成，并删除它们，包括用户忽略的问题。

这仅在您的问题 ID 稳定时有效：相同的问题在重新加载或重启后必须获得相同的 ID。请从不会变化的内容构建它们，例如设备的 ID。不要使用计数器，或 Python 的 `hash()`，后者在 Home Assistant 每次启动时都会给出不同的结果。

### 保留无法检查的问题

有时您无法判断问题是否仍然有效。设备没有响应，或者您需要的数据尚不存在。删除问题是不对的，使用过时信息再次创建它也不对。调用 `IssuesRefresh.async_keep` 来保持这些问题不变：

```python
with ir.async_refresh_issues(
    hass,
    DOMAIN,
    issue_id_pattern="firmware_too_old_",
    config_entry_id=entry.entry_id,
) as refresh:
    for device in devices:
        issue_id = f"firmware_too_old_{device.id}"
        try:
            version = await device.async_get_firmware_version()
        except DeviceUnavailable:
            refresh.async_keep([issue_id])
            continue
        if version < MINIMUM_FIRMWARE:
            ir.async_create_issue(
                hass,
                DOMAIN,
                issue_id,
                config_entry_id=entry.entry_id,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key="firmware_too_old",
                translation_placeholders={"version": version},
            )
```

`async_keep` 接受一个问题 ID 列表。它不会创建或更改问题。刷新集合之外的问题会被忽略。

通常，检查问题的代码没有刷新对象，例如在新设备出现时也在刷新之外运行的辅助函数。请在那里调用 `ir.async_keep_issue`：

```python
@callback
def _async_check_stream_issue(
    hass: HomeAssistant, entry: ExampleConfigEntry, camera: Camera
) -> None:
    issue_id = f"rtsp_disabled_{camera.id}"
    if camera.streams is None:
        # The streams could not be read, so the issue can't be checked
        ir.async_keep_issue(hass, DOMAIN, issue_id)
    elif camera.streams.active:
        ir.async_delete_issue(hass, DOMAIN, issue_id)
    else:
        ir.async_create_issue(
            hass,
            DOMAIN,
            issue_id,
            config_entry_id=entry.entry_id,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="rtsp_disabled",
        )
```

`ir.async_keep_issue` 会在每个包含它的活动刷新中保留该问题，就像再次创建它但未更改一样。当没有活动刷新包含该问题时，它什么也不做。

当问题检查对刷新来说太晚时，它也有帮助。假设一个实体在首次运行时创建或删除其问题，这可能在重新加载完成其刷新之后。请在实体设置时保留问题，这发生在刷新期间，而实体稍后再决定。

### 完成或取消

刷新以两种方式之一结束：

- `IssuesRefresh.async_finish()` 删除自刷新开始以来未创建或保留的集合中的问题。
- `IssuesRefresh.async_cancel()` 仅删除其删除被[延迟到刷新](#delete-an-issue-during-a-refresh)的问题。其他问题保持原样，直到下一次完成的刷新。当检查未完成时使用它，因此您无法判断哪些问题是过时的。

一旦刷新结束，再次调用 `async_finish()` 或 `async_cancel()` 不会执行任何操作。

`with` 块在块完成时完成刷新，并在其中引发异常时取消刷新。因为取消的刷新仍会应用延迟删除，所以重新加载也可以在 `with` 块中运行。

您也可以自行调用这些方法，当刷新不适合放在一个块中时。在 `async_setup_entry` 中，使用 `entry.async_on_unload` 注册 `async_cancel`，以便失败的设置取消刷新：

```python
refresh = ir.async_refresh_issues(
    hass,
    DOMAIN,
    issue_id_pattern="gateway_not_found_",
    config_entry_id=entry.entry_id,
)
entry.async_on_unload(refresh.async_cancel)

for site in sites:
    await _async_setup_site(hass, entry, site)

refresh.async_finish()
```

永不结束的刷新永远不会删除任何内容。

### 在刷新期间删除问题

以重新加载为例，它会移除旧实体并添加新实体。旧实体在被移除时删除其问题。当实体被永久移除时这是正确的，但在重新加载期间，新实体可能会再次创建相同的问题。传递 `defer_to_refresh=True` 将决定权留给刷新：

```python
async def async_will_remove_from_hass(self) -> None:
    """Run when the entity is removed."""
    ir.async_delete_issue(
        self.hass, DOMAIN, self.repair_issue_id, defer_to_refresh=True
    )
```

然后在这些问题集的刷新中运行重新加载：

```python
with ir.async_refresh_issues(
    hass,
    DOMAIN,
    issue_ids=[entity.repair_issue_id for entity in old_entities],
):
    for entity in old_entities:
        await entity.async_remove()
    await component.async_add_entities(new_entities)
```

使用 `defer_to_refresh=True`，活动刷新集合中的问题会留给该刷新来删除。如果它在刷新运行期间被再次创建或保留，它就会存活，无论延迟删除之前还是之后，因此旧实体被移除还是新实体被添加先发生并不重要。否则，刷新会在结束时删除它，即使被取消也是如此，因此失败的重新加载不会留下已移除实体的问题。

当没有活动刷新包含该问题时，它会立即被删除，就像您没有传递 `defer_to_refresh` 一样。没有 `defer_to_refresh` 的删除总是立即执行，即使在刷新期间也是如此。

### 重叠的刷新

两个刷新可以包含相同的问题，例如当设置仍在运行时重新加载开始。包含该问题的最新活动刷新决定它，也决定延迟删除：

- 较旧的刷新不会在较新的刷新包含问题时删除它，也不会删除较新刷新保留的问题。
- 当较新的刷新结束而未删除问题时，例如因为它被取消，较旧的刷新再次决定。它仅在问题自较旧刷新开始以来未被创建或保留时才删除它。
- 在较新刷新结束后到达的延迟删除会等待较旧的刷新。
- `IssuesRefresh.async_keep` 为该刷新和较旧的刷新保留问题，而不是为较新的刷新。`ir.async_keep_issue` 在所有刷新中保留它。

### 从另一个线程刷新

刷新仅在事件循环中工作。开始、保留、完成和取消它，以及 `ir.async_keep_issue`，从另一个线程调用时会引发错误，就像问题注册表的其他 `async_` 函数一样。`ir.delete_issue`，即 `ir.async_delete_issue` 的线程安全版本，没有 `defer_to_refresh`。当检查在工作线程中运行时，例如数据库查询，请在线程中计算出问题，并在事件循环中一次性应用它们：

```python
from homeassistant.core import callback
from homeassistant.util.async_ import run_callback_threadsafe


def update_issues(hass: HomeAssistant) -> None:
    """Check for problems, runs in a worker thread."""
    problems = find_problems()

    @callback
    def apply_issues() -> None:
        """Create the issues and delete the stale ones."""
        with ir.async_refresh_issues(
            hass, DOMAIN, issue_id_pattern="units_changed_"
        ):
            for issue_id, placeholders in problems.items():
                ir.async_create_issue(
                    hass,
                    DOMAIN,
                    issue_id,
                    is_fixable=False,
                    severity=ir.IssueSeverity.WARNING,
                    translation_key="units_changed",
                    translation_placeholders=placeholders,
                )

    run_callback_threadsafe(hass.loop, apply_issues).result()
```

在一个回调中完成所有操作，比从线程为每个问题调用 `ir.create_issue` 更简单，后者需要分别调用事件循环来开始和完成刷新。它也更安全：问题仅在刷新开始后创建时才计入刷新，并且在回调运行时事件循环中没有其他内容运行。

## 持久性

问题会一直存在，直到创建它的集成删除它、用户修复它，或[它所属的配置条目](#issues-that-belong-to-a-config-entry)被移除。重启后发生什么取决于 `is_persistent`：

- **非持久**（默认）：重启后问题不会显示，直到您的集成重新创建它。请将其用于您可以主动检查的问题，例如固件过旧。无论如何，您的集成在下一次启动时都会再次检查。
- **持久**：重启后问题会再次显示。请将其用于只有在发生时才能发现的问题，例如更新失败。

Home Assistant 会记住重启后的每个问题，无论是否持久，以及用户是否忽略了它。当您的集成在重启后再次创建非持久问题时，它仍然被忽略。从未再次创建的问题会留在问题注册表中，不显示，直到被删除。[刷新](#refresh-a-set-of-issues)也会清理这些问题。

用户也可以忽略问题。它会保持被忽略状态，也跨重启，直到被删除并再次创建。这就是为什么您只应在问题消失时删除它。
