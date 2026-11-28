# 场景（Scene）

> 场景的更多信息视图，包含一个“激活”按钮以及场景所控制的实体。

Source: https://www.hasscn.top/contributors/design/more-info/scene/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="scene.movie_night"></ha-demo-more-info>
<ha-demo-more-info entity="scene.good_night"></ha-demo-more-info>
```

## 显示内容

场景没有可更改的状态，只有可执行的操作：将一组设备设置为你保存时的状态。因此它的视图是一行带有**激活**按钮的状态行，下方是场景中包含的实体。

场景的状态是它最后一次被激活的时刻，如果从未激活过则为未知。这个晚安场景从未被激活过，所以它的状态是未知。

实体以磁贴卡片的形式显示，每行一个。每个磁贴显示实体的状态，并且当实体有适合的控件时会显示该控件，例如可调光灯具的亮度滑块。这样你无需离开对话框即可检查和微调场景所做的设置。

## 设计说明

- **激活**是行末的一个小型文本[按钮](https://www.hasscn.top/contributors/design/components/button/)。它是唯一的操作，因此不需要更高的视觉权重。
- 磁贴会省略所有成员共有的信息。电影之夜场景中的所有内容都在客厅，所以它的磁贴不显示区域。晚安场景横跨客厅和走廊，所以它的磁贴会显示。
- 隐藏的实体会从列表中省略。
- 在信息视图中，对话框不显示场景的历史记录。历史记录只需点击一次即可查看，位于页眉的**历史**按钮后面。

## 代码实现

状态行是 [`src/state-summary/state-card-scene.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-scene.ts) 中的 `state-card-scene`。实体列表由 [`src/dialogs/more-info/more-info-content.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/more-info-content.ts) 中的 `more-info-content` 渲染，适用于任何包含成员的实体。它根据场景的 `entity_id` 属性构建磁贴卡片网格。

源码：[`state-card-scene.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-scene.ts)
