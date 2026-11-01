---
title: 始终为流程结果传递 step_id
description: 在 async_show_form、async_show_menu、async_show_progress 或 async_external_step 中省略 step_id 已被弃用，并将在 2027.5.0 中停止工作。
date: 2026-10-23
authors:
  - G Johansson
areas:
  - core
---

当数据录入流程（data entry flow）的某个步骤显示表单、菜单、进度或外部步骤时，现在必须始终传递 `step_id`。这适用于配置流程（config flows）、选项流程（options flows）、子条目流程（subentry flows）和修复流程（repair flows）中的 `async_show_form`、`async_show_menu`、`async_show_progress` 和 `async_external_step`。

## 原因

到目前为止，`step_id` 是可选的。当您省略它时，流程管理器会填入它已调用的步骤。当一个步骤方法直接调用另一个步骤方法时，这就会出错：结果会获得第一个步骤的步骤 ID，而不是构建它的步骤的步骤 ID。

自行传递 `step_id` 可以消除这种猜测。`step_id` 是您所在的步骤方法的名称，去掉 `async_step_` 前缀：

```python
async def async_step_user(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Wait for the device to pair."""
    if not self._pair_task:
        self._pair_task = self.hass.async_create_task(self._async_pair())

    if not self._pair_task.done():
        return self.async_show_progress(
            step_id="user",
            progress_action="pairing",
            progress_task=self._pair_task,
        )

    return self.async_show_progress_done(next_step_id="finish")
```

## 变更内容

- 核心集成和核心代码中省略 `step_id` 现在会引发错误。所有核心集成都已传递它。
- 自定义集成中省略它会记录弃用警告。流程管理器仍会填入它调用的步骤，因此您的流程在 Home Assistant 2027.5.0 之前仍可正常工作。

在 Home Assistant 2027.5.0 中，`step_id` 将成为必需参数，并且回退机制将被移除。如果您维护自定义集成，请在流程中搜索这四个方法，并在缺少 `step_id` 的地方添加它。

在 [表单、菜单和进度](/core/integrations/flow-steps/) 中了解更多信息。
