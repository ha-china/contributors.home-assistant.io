# 自动化

> 一种规则，当触发器发生且条件满足时执行操作，例如在日落时且家中有人时打开灯光。

Source: https://www.hasscn.top/contributors/glossary/automation/

- In code: `automation`, `automations.yaml`
- Also: automations

用户可以在 UI 中构建自动化（automation），也可以用 YAML 编写。在底层，自动化也是一个实体（entity）：它可以被关闭，并且会记住上次运行的时间。

## Related terms

- [触发器（Trigger）](https://www.hasscn.top/contributors/glossary/trigger/): 启动自动化的条件，例如状态变化、时间或事件。
- [条件（Condition）](https://www.hasscn.top/contributors/glossary/condition/): 自动化或脚本在继续执行之前所做的检查，例如是否有人在家。
- [动作（Action）](https://www.hasscn.top/contributors/glossary/action/): Home Assistant 可以执行的操作，例如打开灯或发送通知。自动化、脚本和仪表盘会执行动作。
- [脚本](https://www.hasscn.top/contributors/glossary/script/): 一组命名的动作序列，可以从自动化、仪表盘或通过语音运行。
- [蓝图（Blueprint）](https://www.hasscn.top/contributors/glossary/blueprint/): 一种自动化、脚本或模板实体，其中留有需要填写的空白，方便他人复用，例如一个运动感应灯，只需填入运动传感器和灯具即可。
