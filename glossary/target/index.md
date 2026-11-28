# 目标

> 操作所作用的对象：实体、设备、区域、楼层或标签。

Source: https://www.hasscn.top/contributors/glossary/target/

- In code: `target`, `entity_id`, `area_id`, `floor_id`, `label_id`
- Also: targets

目标（target）在操作运行时被解析。以区域（area）为目标意味着该区域中当时所有匹配的实体（entity），因此新添加的设备也会被包含在内。

## Related terms

- [动作（Action）](https://www.hasscn.top/contributors/glossary/action/): Home Assistant 可以执行的操作，例如打开灯或发送通知。自动化、脚本和仪表盘会执行动作。
- [区域](https://www.hasscn.top/contributors/glossary/area/): 家中一个房间或空间，例如厨房，设备和实体归属于其中。
- [楼层](https://www.hasscn.top/contributors/glossary/floor/): 住宅的一个层级，例如一楼，其中包含多个区域。
- [标签](https://www.hasscn.top/contributors/glossary/label/): 用户放在实体（entity）、设备（device）、区域（area）、自动化（automation）等对象上的标记，用于按自己的方式对它们进行分组，例如所有耗电量大的设备。
