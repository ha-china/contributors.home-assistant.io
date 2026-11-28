# 策略（Strategy）

> 一种代码，用于根据家庭本身、其区域、设备和实体来构建仪表盘、视图或部分，而不是使用固定配置。

Source: https://www.hasscn.top/contributors/glossary/strategy/

- In code: `strategy`, `ll-strategy-*`
- Also: 策略, 仪表盘策略

用户首次打开 Home Assistant 时看到的仪表盘是由策略（strategy）构建的。当用户添加设备时，它会保持更新，直到用户接管控制并对其进行编辑。

## Related terms

- [仪表盘](https://www.hasscn.top/contributors/glossary/dashboard/): 一个由卡片组成的页面，用于显示和控制家庭。用户可以拥有任意数量的仪表盘。
- [视图（View）](https://www.hasscn.top/contributors/glossary/view/): 仪表盘中的一个页面。其类型（如 sections、masonry 或 panel）决定了卡片的布局方式。
- [区域](https://www.hasscn.top/contributors/glossary/area/): 家中一个房间或空间，例如厨房，设备和实体归属于其中。
