# 防盗报警控制面板

> 报警系统的更多信息视图，带有用于选择布防模式的垂直选择器。

Source: https://www.hasscn.top/contributors/design/more-info/alarm-control-panel/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="alarm_control_panel.home_alarm"></ha-demo-more-info>
```

## 显示内容

报警系统始终处于且仅处于一种模式，因此主要控件是一个高大的垂直[选择控件](https://www.hasscn.top/contributors/design/components/controls/)：每种模式对应一个按钮，垂直堆叠，当前模式高亮显示。每种模式都有一个图标和一个简短标签，例如**在家**（Home）、**外出**（Away）、**夜间**（Night）和**已撤防**（Disarmed）。

**已撤防**始终显示。其他模式仅在报警系统支持时才会显示：

- **在家**、**外出**和**夜间**。
- **度假**（Vacation）。
- **自定义**（Custom），用于自定义旁路。

上方的报警系统支持在家、外出和夜间模式，因此它有四个按钮。选择器会随着模式数量的增加而变高。

当报警系统正在布防、等待或已触发时，没有可选择的模式。选择器会腾出空间显示一个大的状态图标，下方有一个**撤防**（Disarm）按钮。

## 设计说明

- 所选模式采用状态的颜色，因此已撤防的报警系统看起来平静，而已布防的则醒目突出。
- 当报警系统需要密码时，Home Assistant 会在更改模式前通过单独的对话框要求输入密码。对于布防，仅在报警系统声明布防需要密码时才会询问。对于撤防，只要报警系统设置了密码就一定会询问。实体（entity）设置中已存储的密码会跳过该询问。
- 选择会立即切换到新模式。当更改失败时（例如密码错误），会切换回原模式。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-alarm_control_panel.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-alarm_control_panel.ts) 中的 `more-info-alarm_control_panel`。模式选择器是 [`src/state-control/alarm_control_panel/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/alarm_control_panel) 中的 `ha-state-control-alarm_control_panel-modes`。模式、它们的图标以及 `AlarmControlPanelEntityFeature` 枚举位于 [`src/data/alarm_control_panel.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/alarm_control_panel.ts) 中。

源码：[`more-info-alarm_control_panel.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-alarm_control_panel.ts)
