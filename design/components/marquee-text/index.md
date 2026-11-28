# 跑马灯文本

> 当单行文本过长无法完整显示时，跑马灯文本（Marquee text）会将其缓慢地来回滚动。

Source: https://www.hasscn.top/contributors/design/components/marquee-text/

Live demo of `ha-marquee-text`.

```html
<ha-marquee-text style="width: 220px">Bohemian Rhapsody (Remastered 2011), Queen, A Night at the Opera</ha-marquee-text>
```

## 概述

跑马灯文本通过将单行文本向左滚动直到末尾可见、暂停后再滚动回来，使其在固定空间内保持可读。能够完整显示的文本不会移动。

## 何时使用

在以下情况使用跑马灯文本：

- 会自行变化、且人们只会瞥一眼的文本，例如媒体播放器对话框中正在播放的歌曲标题，或时钟卡片上的日期行

不要在以下情况使用跑马灯文本：

- 标签、按钮或任何人们需要阅读才能完成任务的文本
- 大多数其他文本。移动的文本更难阅读且容易分散注意力，因此它只是特例。让文本换行，或用省略号截断并在其他地方显示完整文本。
- 多行的长文本。请使用 [faded](https://www.hasscn.top/contributors/design/components/faded/) 内容。

## 结构

1. **容器**：占据全部可用宽度，并裁剪文本
2. **文本**：单行文本，在容器内移动

## 变体

### 悬停时暂停

跑马灯文本可以在指针悬停在其上时暂停，以便人们停下文本来阅读。在触摸文本时也会暂停。

Live demo of `ha-marquee-text`.

```html
<ha-marquee-text pause-on-hover style="width: 220px">Hover over me to pause this long line of text</ha-marquee-text>
```

## 行为

- **能完整显示**：能在容器内完整显示的文本不会移动。
- **过长**：文本以每秒 15 像素的速度向左滚动（在 60 Hz 屏幕上），直到其末尾可见，暂停 1 秒，滚动回起点，再次暂停，然后重复。
- **悬停**：启用暂停功能时，当指针悬停在文本上或触摸文本时，文本会停止，当指针离开或触摸结束时继续滚动。未启用时，悬停没有任何效果。
- 文本无法被选中，也不会对指针本身做出反应。

## 规格

| 属性 | 值 |
| --- | --- |
| 宽度 | 其容器的 100% |
| 速度 | 默认每秒 15 像素。组件每帧移动文本速度的六十分之一，因此在快于 60 Hz 的屏幕上滚动得更快。 |
| 两端暂停时间 | 默认 1000 毫秒 |
| 字体大小 | 1em，即周围文本的大小 |
| 换行 | 无，文本保持单行 |

组件自身不设置任何颜色。文本保持其周围页面的颜色。

## 指南

Do and don't, as live demos.

**Do:** 开启悬停时暂停，以便人们停下文本来阅读。

```html
<ha-marquee-text pause-on-hover style="width: 220px">Bohemian Rhapsody (Remastered 2011), Queen, A Night at the Opera</ha-marquee-text>
```

**Don't:** 让文本一直移动而无法停止。

```html
<ha-marquee-text style="width: 220px">Bohemian Rhapsody (Remastered 2011), Queen, A Night at the Opera</ha-marquee-text>
```

前端中的每一处使用都会在悬停时暂停，你的使用也应如此。

## 无障碍

### 键盘

跑马灯文本不可聚焦，也没有键盘交互。暂停功能只能通过指针或触摸使用。

### 动效

滚动不会遵循系统的减弱动态效果设置。对于要求减少动效的人，它仍会继续移动。这也是将其仅用于人们只会瞥一眼的文本的另一个原因。

### 屏幕阅读器

屏幕阅读器会读取完整文本，而不仅仅是可见的部分。

### 在代码中

该组件没有角色（role）。默认插槽中的文本是页面的一部分。

## 相关

- [Faded](https://www.hasscn.top/contributors/design/components/faded/)：多行的长文本，被截断并淡出

## 在代码中

该元素是 `<ha-marquee-text>`。它会占据其容器的全部宽度，因此请通过布局或宽度来约束它。

```html
<ha-marquee-text pause-on-hover>
  Bohemian Rhapsody (Remastered 2011)
</ha-marquee-text>
```

组件在首次渲染时测量一次文本。如果文本之后发生变化而变长或变短，滚动距离不会重新测量。

### 属性

- `speed`：滚动速度，以每秒像素为单位。默认为 `15`。
- `pause-duration`：在每一端暂停的时长，以毫秒为单位。默认为 `1000`。
- `pause-on-hover`：当指针悬停在文本上或触摸文本时暂停滚动。默认关闭。

### 插槽

- 默认：文本。保持为单行的纯文本。

Source: [`src/components/ha-marquee-text.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-marquee-text.ts)
