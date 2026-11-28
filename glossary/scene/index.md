# 场景

> 为实体（entity）保存的一组状态，例如观影时调暗的灯光和拉上的窗帘，可以一次性激活。

Source: https://www.hasscn.top/contributors/glossary/scene/

- In code: `scene`, `scenes.yaml`
- Also: scenes

激活一个场景会将其中每个实体设置为保存的状态。场景不会按顺序执行步骤。如需按顺序执行，请使用[脚本](https://www.hasscn.top/contributors/glossary/script/)。

## Related terms

- [脚本](https://www.hasscn.top/contributors/glossary/script/): 一组命名的动作序列，可以从自动化、仪表盘或通过语音运行。
- [动作（Action）](https://www.hasscn.top/contributors/glossary/action/): Home Assistant 可以执行的操作，例如打开灯或发送通知。自动化、脚本和仪表盘会执行动作。
