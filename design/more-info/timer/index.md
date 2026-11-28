# 定时器

> 定时器辅助元素（helper）的更多信息视图，包含实时倒计时、时长输入框，以及启动、暂停和取消按钮。

Source: https://www.hasscn.top/contributors/design/more-info/timer/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="timer.laundry"></ha-demo-more-info>
<ha-demo-more-info entity="timer.tea"></ha-demo-more-info>
```

## 显示内容

定时器顶部的状态是倒计时。定时器运行时，它会实时递减，例如 **22:52**。暂停时，状态会附加说明，例如 **22:52 (Paused)**。空闲时，则显示 **Idle**。

其下方是一个时长输入框，包含小时、分钟和秒。它初始为定时器设置好的时长，并在定时器运行期间保持不变，因此不会随倒计时跳动。修改它即可让定时器以不同的时间启动。

输入框下方是一排文本[按钮](https://www.hasscn.top/contributors/design/components/button/)，用于放置各项操作。显示哪些按钮取决于状态：

- **Idle（空闲）**：**Start（启动）**，以输入框中的时长启动定时器。
- **Active（活动）**：**Set（设置）**，以输入框中的时长重新启动，以及 **Pause（暂停）**、**Cancel（取消）** 和 **Finish（结束）**。
- **Paused（已暂停）**：**Set（设置）**、**Start（启动）**（用于继续）、**Cancel（取消）** 和 **Finish（结束）**。

洗衣定时器正在运行，因此它显示 **Set（设置）**、**Pause（暂停）**、**Cancel（取消）** 和 **Finish（结束）**。茶定时器处于空闲状态，因此只显示 **Start（启动）**。

## 设计说明

- 这些操作是纯文本按钮，而不是大型控件。定时器的核心是时间，因此倒计时和输入框才是视觉焦点。
- 当对话框打开时定时器结束，倒计时会闪烁两次，即使你没有盯着数字也能注意到。
- 定时器可以有预设，即操作下方的一排固定时长，一键即可启动定时器。这些预设来自实体（entity）设置，不包含在这些演示中。
- 你输入的时长可以长于定时器设置好的时长。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-timer.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-timer.ts) 中的 `more-info-timer`。预设是 [`src/dialogs/more-info/components/timers/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components/timers) 中的 `ha-more-info-timer-presets`。倒计时文本来自 [`src/data/timer.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/timer.ts) 中的 `computeDisplayTimer`。

Source: [`more-info-timer.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-timer.ts)
