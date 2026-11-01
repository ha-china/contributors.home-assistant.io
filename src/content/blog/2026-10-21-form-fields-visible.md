---
title: "根据其他字段显示表单字段"
description: 自 Home Assistant Core 2026.11 起，配置流程、选项流程和蓝图可以仅在其他字段具有特定值时显示某个字段。
date: 2026-10-21
authors:
  - Paul Bottein
areas:
  - core
---

自 Home Assistant Core 2026.11 起，配置流程、选项流程和蓝图可以仅在其他字段具有特定值时显示某个字段。您不再需要额外的步骤，或在提交后再次显示表单，仅仅为了显示或隐藏几个字段。流程和蓝图使用相同的 `visible` 条件。

## 配置流程和选项流程

为 `homeassistant.data_entry_flow` 中的 `Required` 或 `Optional` 标记添加 `visible` 条件：

```python
from homeassistant import data_entry_flow
from homeassistant.helpers.selector import BooleanSelector

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_SSL, default=False): BooleanSelector(),
        data_entry_flow.Required(
            CONF_VERIFY_SSL,
            default=True,
            visible={"field": CONF_SSL, "value": True},
        ): BooleanSelector(),
    }
)
```

**验证 SSL 证书** 复选框仅在 **使用 SSL** 被选中时显示。当其隐藏时，它不是必填项，其值也不会被保存。

阅读 [根据其他字段显示的字段](/core/integrations/flow-steps/#fields-that-show-based-on-another-field) 了解可用的条件以及隐藏字段的行为。

## 蓝图

蓝图输入和输入部分接受相同的 `visible` 键，位于 `default` 和 `collapsed` 旁边：

```yaml
blueprint:
  name: Motion light
  domain: automation
  input:
    dim_mode:
      name: Dimming
      default: none
      selector:
        select:
          options:
            - none
            - fixed
    brightness:
      name: Brightness
      default: 50
      visible:
        field: dim_mode
        value: fixed
      selector:
        number:
          min: 1
          max: 100
```

**亮度** 仅在 **调光** 设置为 `fixed` 时显示。隐藏的输入不需要值。自动化随后会获取输入的 `default`（此处为 `50`），或在其没有默认值时获取 `None`，即使在输入被隐藏之前已输入了值也是如此。在输入部分上设置 `visible` 会隐藏整个部分及其输入。

阅读用户文档中的 [根据其他输入显示输入](https://www.home-assistant.io/docs/blueprint/schema/#showing-inputs-based-on-other-inputs) 了解详细信息。
