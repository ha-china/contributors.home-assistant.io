# 人员

> 人员的更多信息视图，在地图上显示其所在位置。

Source: https://www.hasscn.top/contributors/design/more-info/person/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="person.alex"></ha-demo-more-info>
<ha-demo-more-info entity="person.sam"></ha-demo-more-info>
```

## 显示内容

关于一个人，你想知道的问题是“他们在哪里？”。该视图用地图来回答这个问题。顶部是状态行，显示该人员所在的地理位置区域（zone），例如**家**或**公司**。其下方是一张地图，放大显示该人员所在的位置，并用一个标记显示其姓名首字母或照片。

Alex 在家，由手机追踪。Sam 在公司。

对于管理员，地图下方有一个**从当前位置创建地理位置区域**按钮，可将该人员所在的位置转换为新的地理位置区域。该按钮不包含在这些演示中。

## 设计说明

- 只有当人员的位置已知时才显示地图：位置来自其自身的坐标，或来自其所在的地理位置区域。两者都没有的人员则只显示状态行。
- **从当前位置创建地理位置区域**仅在人员拥有自身坐标时显示，因为地理位置区域需要一个起始位置。
- 地图会自动围绕该人员调整显示范围，因此你无需缩放或平移即可找到他们。
- 状态显示的是地理位置区域的名称，而不是坐标。人们习惯以地点来思考，例如**家**或**公司**。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-person.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-person.ts) 中的 `more-info-person`。地图是来自 [`src/components/map/`](https://github.com/home-assistant/frontend/tree/dev/src/components/map) 的 `ha-map`。人员（person）域没有更新的更多信息设计，因此对话框顶部仍显示状态行。

来源：[`more-info-person.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-person.ts)
