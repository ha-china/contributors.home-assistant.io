# 锁

> 锁的更多信息视图，带有一个大的锁开关和一个单独的、需确认的开门按钮。

Source: https://www.hasscn.top/contributors/design/more-info/lock/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="lock.front_door"></ha-demo-more-info>
```

## 显示内容

锁的主要控件是一个大的竖向[控制开关](https://www.hasscn.top/contributors/design/components/controls/)。上锁状态在顶部，解锁状态在底部，图标分别为闭合和打开的挂锁。开关会采用状态对应的颜色，例如上锁时为绿色。

当锁正在上锁或解锁时，图标会闪烁，让你在状态改变之前就能看到有事情正在发生。

有些锁不仅能解锁，还能打开门。上面的前门锁就支持该功能，因此它在开关下方会有一个**开门**按钮。开门不是你想误触就执行的操作，所以需要点击两次：

1. 选择**开门**。按钮会变为**确定要打开吗？**。
2. 在几秒内再次选择它即可开门。按钮会短暂显示**已完成**，然后恢复为**开门**。

如果等待时间过长，按钮会自动恢复为**开门**。

## 其他状态

- **卡住（Jammed）**：开关会被一个大的卡住锁图标取代，下方有**解锁**和**上锁**按钮，以便你向任一方向重试。
- **未知（Unknown）**：开关会变为两个独立的按钮，**上锁**和**解锁**，因为没有可供开关所处的状态。
- **已打开、正在打开、正在上锁或正在解锁**：**开门**按钮被禁用，因为门已经打开或正在操作中。

## 设计说明

- 当锁需要密码时，Home Assistant 会在上锁、解锁或开门之前通过单独的对话框要求输入密码。在实体（entity）设置中存储的密码可以跳过该询问。
- 上锁和解锁是同一个开关上的一种手势操作。开门则被单独分离出来，作为一个带有自身确认步骤的按钮，因为它无法通过把开关拨回去来撤销。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-lock.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-lock.ts) 中的 `more-info-lock`。开关是 [`src/state-control/lock/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/lock) 中的 `ha-state-control-lock-toggle`。辅助函数（如 `canOpen` 和 `callProtectedLockService`）以及 `LockEntityFeature` 枚举位于 [`src/data/lock.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/lock.ts) 中。

源码：[`more-info-lock.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-lock.ts)
