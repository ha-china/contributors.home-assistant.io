---
title: 当用户需要采取行动时提出修复问题
description: "黄金规则 repair-issues：集成会针对用户可以修复的问题提出修复问题。"
sidebarLabel: repair-issues
sidebarGroup: Gold
order: 20
---

这是一条黄金（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `repair-issues`。

当出现用户可以解决的问题时，集成会提出一个[修复问题（repair issue）](/glossary/repair/)。它会显示在**设置** > **系统** > **修复** 下，并附带对问题的说明以及处理方法。当集成在用户确认后能够自行修复问题时，它会添加一个修复流程来引导用户完成修复。

修复问题必须是可操作的。如果用户对此无能为力，就不要仅仅为了说明有问题而提出修复问题。

## 为什么这很重要

日志是问题被忽略的地方。修复问题则是 Home Assistant 用通俗易懂的语言、以用户自己的语言告诉用户有什么需要注意的事情，以及该怎么做。它把“我的集成停止工作了”变成“将你设备的固件更新到 2.0 版本”。

用户无法处理的问题是噪音。它会让用户学会忽略修复问题，从而错过真正重要的那些。

## 示例

在设置过程中，集成会检查本地服务的版本。当版本过旧时，它会提出一个修复问题并停止：

```python
async def async_setup_entry(
    hass: HomeAssistant, entry: MyConfigEntry
) -> None:
    """Set up My integration from a config entry."""
    client = MyClient(entry.data[CONF_HOST])
    version = await client.get_version()

    if version < MINIMUM_VERSION:
        ir.async_create_issue(
            hass,
            DOMAIN,
            "outdated_version",
            is_fixable=False,
            severity=ir.IssueSeverity.ERROR,
            translation_key="outdated_version",
            translation_placeholders={"minimum": str(MINIMUM_VERSION)},
        )
        raise ConfigEntryError(
            translation_domain=DOMAIN,
            translation_key="outdated_version",
        )

    ir.async_delete_issue(hass, DOMAIN, "outdated_version")
    ...
```

`ir` 是 `homeassistant.helpers.issue_registry`。该问题的文本位于 `strings.json` 的 `issues` 部分，与异常消息放在一起：

```json
{
  "exceptions": {
    "outdated_version": {
      "message": "My service is out of date."
    }
  },
  "issues": {
    "outdated_version": {
      "title": "My service is out of date",
      "description": "Update My service to version {minimum} or newer."
    }
  }
}
```

问题解决后应删除该问题，就像示例中在设置成功时所做的那样。

## 如何检查

- 当提出的问题在 `strings.json` 中缺少翻译时，测试会失败。
- 集成是否只在用户需要采取行动的情况下提出问题，会在审查中进行检查。

## 例外情况

如果集成不存在需要修复问题的情况，则此规则不适用。
