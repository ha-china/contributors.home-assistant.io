---
title: Labs 预览功能
description: 发布一个已完成的功能，让用户可以通过 Home Assistant Labs 选择启用，收集反馈，并将其转正为标准功能。
sidebarLabel: Labs
sidebarGroup: Changing behavior
order: 3
---

Home Assistant Labs 让用户可以在某个预览功能成为标准功能之前选择启用它。用户可以在 **设置** > **系统** > **Labs** 下找到它，并可以在那里开启或关闭每个功能。

Labs 功能是已完成并经过测试的。尚未确定的只是它的设计：它的外观、工作方式以及它应该做什么，这些都将根据用户在家中实际使用后的反馈来塑造。这使得 Labs 不同于 beta 测试，后者测试的是整个版本的稳定性。

预览功能具有以下特点：

- **默认关闭**：由用户自行开启。
- **生产可用**：经过充分测试，不是实验性或半成品。
- **可能变更**：它们可以根据反馈进行更改、扩展或移除。
- **可逆**：用户可以随时再次关闭它们，无需重启。

## 何时使用 Labs

Labs 适用于：

- 界面的重大变更或重新设计
- 架构上的重大变更
- 用户反馈将影响最终设计的功能

Labs 不适用于：

- 本应作为集成（integration）一部分的设置。这类设置请使用集成的选项。
- 可以直接进入版本发布的小改动
- 无法在 Home Assistant 运行期间开启和关闭的功能
- 存在已知严重缺陷、或尚未完成的功能。这些应留在开发阶段。

## 添加预览功能

### 1. 在 manifest 中声明

将该功能添加到集成的 `manifest.json` 中的 `preview_features`：

```json
{
  "domain": "example",
  "name": "Example",
  "preview_features": {
    "new_dashboard": {
      "feedback_url": "https://community.home-assistant.io/t/...",
      "learn_more_url": "https://www.home-assistant.io/integrations/example",
      "report_issue_url": "https://github.com/home-assistant/core/issues/new"
    }
  }
}
```

- `feedback_url`：用户提交反馈的地方，例如论坛主题或 GitHub 讨论。
- `learn_more_url`：该功能的文档。
- `report_issue_url`：用户报告缺陷的地方。

这三项都是可选的，但请务必添加：没有它们，你想要的反馈就无处可去。

然后运行 hassfest，它会将该功能添加到 `homeassistant/generated/labs.py`：

```shell
python3 -m script.hassfest
```

### 2. 添加文本

在 `strings.json` 中为该功能命名并描述：

```json
{
  "preview_features": {
    "new_dashboard": {
      "name": "New dashboard",
      "description": "Replaces the Example panel with a new dashboard."
    }
  }
}
```

请说明该功能的作用，并提及它可能会根据反馈而扩展。你可以使用 Markdown。

如果开启或关闭该功能会产生用户应当知晓的后果，例如关闭后仍然保留的迁移，请在描述中说明。你还可以添加 `enable_confirmation` 和 `disable_confirmation`，它们会替换标准的确认消息。在用户执行操作的那一刻，用它们来提醒用户相关后果。它们不能替代描述。

### 3. 检查标志

在 Python 中，检查该功能是否已开启：

```python
from homeassistant.components.labs import async_is_preview_feature_enabled


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""
    if async_is_preview_feature_enabled(hass, DOMAIN, "new_dashboard"):
        await async_setup_new_dashboard(hass)
    else:
        await async_setup_classic_panel(hass)
```

请像这样将预览代码和标准代码清晰地分开。将 `preview=True` 标志深入传递到你的代码中，会让以后难以移除其中任何一部分。

在前端，`src/data/labs.ts` 中的 `fetchLabFeatures` 会返回这些功能及其启用状态。

### 4. 在功能开启或关闭时作出响应

预览功能可以在 Home Assistant 运行期间开启和关闭，无需重启。这是一项硬性要求。使用 `async_subscribe_preview_feature` 订阅变更，它只会为属于你自己的功能调用你的监听器：

```python
from homeassistant.components.labs import (
    EventLabsUpdatedData,
    async_subscribe_preview_feature,
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""

    async def _async_preview_toggled(
        event_data: EventLabsUpdatedData,
    ) -> None:
        if event_data["enabled"]:
            await async_setup_new_dashboard(hass)
        else:
            await async_remove_new_dashboard(hass)

    entry.async_on_unload(
        async_subscribe_preview_feature(
            hass, DOMAIN, "new_dashboard", _async_preview_toggled
        )
    )
```

在运行时效果良好的做法：加载和卸载界面的一部分、创建和移除实体（entity）、启动和停止后台任务，以及注册事件监听器。效果不佳的做法：更改 Home Assistant 的启动方式、更改仅在启动时加载的集成，以及任何需要修改 `configuration.yaml` 的操作。

对于更复杂的情况，你可以直接监听 `EVENT_LABS_UPDATED` 事件。

### 5. 为反馈做好准备

在发布该功能之前，先创建反馈的场所：[社区论坛](https://community.home-assistant.io/)上的主题，或 GitHub 讨论或 issue。将其链接到 `feedback_url`。在 [home-assistant.io](https://www.home-assistant.io/) 上你的集成页面中记录该功能：它的作用、你希望获得什么反馈，以及如何开启它。

[My Home Assistant](/glossary/my-link/) 链接可以直接将用户带到 Labs 中你的功能处，并高亮显示它。这在发布说明、文档和论坛帖子中效果很好：

```text
https://my.home-assistant.io/redirect/labs/?domain=example&preview_feature=new_dashboard
```

[Kitchen Sink](https://github.com/home-assistant/core/tree/dev/homeassistant/components/kitchen_sink) 集成有一个完整的示例，其中包含一个会创建修复问题（repair issue）的预览功能。

## 测试两种状态

在功能开启和关闭两种情况下测试你的集成，并测试切换过程。若要在功能开启的状态下开始测试，请在设置集成之前填充 Labs 的存储：

```python
async def test_new_dashboard(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    mock_config_entry: MockConfigEntry,
) -> None:
    """Test the integration with the new dashboard enabled."""
    hass_storage["core.labs"] = {
        "version": 1,
        "data": {
            "preview_feature_status": [
                {"domain": DOMAIN, "preview_feature": "new_dashboard"},
            ]
        },
    }
    mock_config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
```

若要在测试中切换它，请使用 `hass_ws_client` fixture 发送 `labs/update` 消息：

```python
client = await hass_ws_client(hass)
await client.send_json_auto_id(
    {
        "type": "labs/update",
        "domain": DOMAIN,
        "preview_feature": "new_dashboard",
        "enabled": True,
    }
)
assert (await client.receive_json())["success"]
```

## 处于预览阶段时

- 关注反馈并据此行动。快速修复缺陷。
- 在预览阶段允许进行破坏性变更，但应尽量避免。如果必须进行，请自动迁移用户的数据和设置。无论是否处于预览阶段，人们都在家中依赖它。
- 随着功能的变更，保持描述的准确性。
- 不要让功能永远留在 Labs 中。从一开始就规划它如何转正，或者如何移除。

## 转正或移除

当功能准备好成为标准功能时：

1. 从 `manifest.json` 的 `preview_features` 中移除它。
2. 移除标志检查，使该功能始终开启。
3. 运行 `python3 -m script.hassfest`。
4. 更新文档，并在发布说明中宣布。

当它未能成功时：

1. 从 `manifest.json` 的 `preview_features` 中移除它。
2. 移除代码以及 `strings.json` 中的文本。
3. 运行 `python3 -m script.hassfest`。
4. 在发布说明中宣布移除，并解释原因。
