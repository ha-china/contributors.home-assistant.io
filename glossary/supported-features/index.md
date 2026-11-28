# 支持的功能

> 实体（entity）设置的一个数字，用于表明其类型支持哪些功能，例如可以设置位置的卷帘（cover）。

Source: https://www.hasscn.top/contributors/glossary/supported-features/

- In code: `supported_features`, `CoverEntityFeature`, `LightEntityFeature`

每个功能都是一个二进制位，来自像 `CoverEntityFeature` 这样的枚举。前端只显示受支持功能的控件，Home Assistant 也只允许执行与之匹配的操作（action）。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [动作（Action）](https://www.hasscn.top/contributors/glossary/action/): Home Assistant 可以执行的操作，例如打开灯或发送通知。自动化、脚本和仪表盘会执行动作。
