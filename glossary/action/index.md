# 动作（Action）

> Home Assistant 可以执行的操作，例如打开灯或发送通知。自动化、脚本和仪表盘会执行动作。

Source: https://www.hasscn.top/contributors/glossary/action/

- In code: `hass.services`, `services.yaml`, `ServiceCall`, `async_register`
- Also: actions, perform an action
- Formerly: service, service call (old name: don't use it in new text)

集成（integration）会注册动作，并在 `services.yaml` 中描述其字段。动作可以针对实体（entity）、设备（device）、区域（area）、楼层（floor）或标签（label）。

动作以前被称为服务（service），并在 Home Assistant 2024.8 中更名。代码中仍然使用旧名称：`hass.services`、`services.yaml` 和 `ServiceCall`。在文字中，请始终使用“动作”和“执行动作”，而不是“调用服务”。

## Related terms

- [自动化](https://www.hasscn.top/contributors/glossary/automation/): 一种规则，当触发器发生且条件满足时执行操作，例如在日落时且家中有人时打开灯光。
- [脚本](https://www.hasscn.top/contributors/glossary/script/): 一组命名的动作序列，可以从自动化、仪表盘或通过语音运行。
- [目标](https://www.hasscn.top/contributors/glossary/target/): 操作所作用的对象：实体、设备、区域、楼层或标签。
- [选择器（Selector）](https://www.hasscn.top/contributors/glossary/selector/): 描述字段取什么类型的值，例如实体、数字或时间，以便 UI 为其显示正确的控件。
