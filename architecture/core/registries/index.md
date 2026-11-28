# 注册表与存储

> Home Assistant 将其对实体、设备和区域的了解保存在哪里，用户的更改如何与集成报告的内容分开保存，以及数据是如何存储的。

Source: https://www.hasscn.top/contributors/architecture/core/registries/

[状态机（state machine）](https://www.hasscn.top/contributors/core/internals/states/)知道当前真实的情况，并在重启后将其遗忘。[注册表（registry）](https://www.hasscn.top/contributors/glossary/registry/)则记住其余的内容：哪些实体和设备存在、它们在哪里、叫什么名字，以及用户对它们做了哪些更改。

本页是概览。集成如何与每个注册表协作，请参见下方链接的 Core 与集成部分。

## 简而言之

- 有一个注册表用于实体、设备、区域（area）、楼层、标签和分类，还有一个用于“修复”（Repairs）下显示的问题。
- 集成通过其实体的唯一 ID 和提供的设备信息来填充这些注册表。
- 用户在 UI 中更改它们：名称、区域、图标。这些更改与集成报告的内容分开保存，并且以用户的更改为准。
- 注册表、配置条目以及大多数其他数据都以 JSON 文件的形式存放在 `.storage` 文件夹中。

## 两个来源，一个结果

以一个实体为例。集成说它叫 "Temperature"，是一个温度传感器。用户将其重命名为 "Outside"，并放到花园区域。两者都会被保存，存放在不同的字段中：

| 来自集成的字段 | 来自用户的字段 |
| --- | --- |
| `original_name` | `name` |
| `original_icon` | `icon` |
| `original_device_class` | `device_class` |

当实体写入其状态时，如果用户设置了值，则以用户的值为准。集成可以随时更新自己的字段，而不会覆盖用户的选择。这就是[用户的选择优先](https://www.hasscn.top/contributors/architecture/principles/#the-users-choices-win)这一原则。

## 各类注册表

| 注册表 | 保存的内容 | 详细信息 |
| --- | --- | --- |
| 实体 | 每个具有[唯一 ID](https://www.hasscn.top/contributors/glossary/unique-id/) 的实体，以及用户对它的更改 | [实体注册表](https://www.hasscn.top/contributors/core/entities/registry/)（面向实体作者），以及[实体注册表](https://www.hasscn.top/contributors/core/integrations/entity-registry/)（用于查找和迁移条目） |
| 设备 | 每个设备，来自集成实体的设备信息 | [设备注册表](https://www.hasscn.top/contributors/core/integrations/device-registry/) |
| 区域和楼层 | 用户如何描述自己的家 | [区域注册表](https://www.hasscn.top/contributors/core/integrations/area-registry/) |
| 标签和分类 | 用户如何对事物分组，以及如何整理自动化和脚本 | 代码，见下方链接 |
| 问题 | 用户需要处理的事项，显示在 **设置** > **修复** 下 | [修复](https://www.hasscn.top/contributors/core/integrations/repairs/) |

没有唯一 ID 的实体仍然可以工作，但用户无法在 UI 中对它们进行任何更改。

注册表遵循配置条目、设备和实体的层级关系。禁用一个配置条目，其设备和实体也会被禁用。禁用一个设备，其实体也会随之禁用。移除一个设备或配置条目，属于它的实体也会从注册表中移除。

注册表中处于启用状态、但当前没有集成提供的实体（例如其集成设置失败时），仍会显示在状态机中：状态为 `unavailable`，并带有属性 `restored: true`。

## 存储

Home Assistant 将自己的数据以 JSON 文件的形式存储在配置文件夹的 `.storage` 中：注册表、配置条目、用户、仪表盘等等。集成也可以使用 `Store` 做同样的事情，它会对数据进行版本控制，在版本变化时迁移数据，将时间上接近的多次写入合并为一次，并且默认拒绝读取主版本号高于其已知版本的数据，例如在降级之后。

`.storage` 中的文件是内部文件。它们会随版本变化而改变，用户不应手动编辑它们。`configuration.yaml` 是配置的另一个存放之处。它由用户编写，Home Assistant 只读取它。

## 代码中的位置

| 内容 | 位置 |
| --- | --- |
| 实体注册表 | [`homeassistant/helpers/entity_registry.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/entity_registry.py) |
| 设备注册表、`DeviceInfo` | [`homeassistant/helpers/device_registry.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/device_registry.py) |
| 区域、楼层、标签和分类注册表 | [`homeassistant/helpers/`](https://github.com/home-assistant/core/tree/dev/homeassistant/helpers) 中的 `area_registry.py`、`floor_registry.py`、`label_registry.py`、`category_registry.py` |
| 问题注册表 | [`homeassistant/helpers/issue_registry.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/issue_registry.py) |
| `Store` | [`homeassistant/helpers/storage.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/storage.py) |

## 参与贡献

- 刚接触 Core？从[你对 Core 的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。
- 为你的实体提供唯一 ID 和设备：参见质量标准中的[实体唯一 ID](https://www.hasscn.top/contributors/core/quality-scale/entity-unique-id/) 和[设备](https://www.hasscn.top/contributors/core/quality-scale/devices/)规则。
