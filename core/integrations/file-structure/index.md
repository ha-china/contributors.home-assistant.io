# 集成文件结构

> 集成的文件、每个文件的用途，以及 Home Assistant 在何处查找集成。

Source: https://www.hasscn.top/contributors/core/integrations/file-structure/

每个集成都存放在以其[域（domain）](https://www.hasscn.top/contributors/glossary/domain/)命名的文件夹中。移动应用集成的域为 `mobile_app`，因此它的所有文件都位于 `mobile_app/` 中。Home Assistant 通过文件名来识别集成的大多数功能，因此下述文件名非常重要。

## 必需的文件

- `manifest.json`：描述集成、它的依赖要求，以及它如何被发现。请参见[清单文件（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/)。
- `__init__.py`：集成本身，包含其设置函数。如果集成仅提供一个平台（platform），此文件可以只包含一条 docstring，例如 `"""The Mobile App integration."""`。

## 常见的文件

| 文件 | 内容 |
| --- | --- |
| `const.py` | 常量，例如 `DOMAIN` |
| `config_flow.py` | [配置流程（config flow）](https://www.hasscn.top/contributors/core/integrations/config-flow/)和[选项流程（options flow）](https://www.hasscn.top/contributors/core/integrations/options-flow/) |
| `coordinator.py` | [数据更新协调器（data update coordinator）](https://www.hasscn.top/contributors/core/integrations/fetching-data/)，如果你对它进行了子类化 |
| `entity.py` | 你的各平台共享的基础实体（entity）类 |
| `light.py`、`sensor.py` 等 | 每种实体类型对应一个[平台](https://www.hasscn.top/contributors/glossary/platform/)。请参见[实体与平台](https://www.hasscn.top/contributors/core/entities/)。 |
| `strings.json` | 所有面向用户的文本，使用英文。请参见[使你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)。 |
| `icons.json` | 实体、操作和表单分区的图标 |
| `services.yaml` | 你的集成所注册的[操作（actions）](https://www.hasscn.top/contributors/core/integrations/actions/)的描述 |
| `quality_scale.yaml` | 你的集成中每条[质量标准（quality scale）](https://www.hasscn.top/contributors/core/quality-scale/)规则的状态 |

## 平台文件

有些文件是集成平台：当需要它们提供的功能时，Home Assistant 会按文件名加载它们。你只需添加该文件，相应功能就会出现。

| 文件 | 功能 |
| --- | --- |
| `diagnostics.py` | [诊断（Diagnostics）](https://www.hasscn.top/contributors/core/integrations/diagnostics/) |
| `system_health.py` | [系统健康（System health）](https://www.hasscn.top/contributors/core/integrations/system-health/) |
| `repairs.py` | [修复流程（Repair flows）](https://www.hasscn.top/contributors/core/integrations/repairs/) |
| `reproduce_state.py` | 用于场景的[状态重现（Reproduce state）](https://www.hasscn.top/contributors/core/integrations/reproduce-state/) |
| `significant_change.py` | [重要变更（Significant change）](https://www.hasscn.top/contributors/core/integrations/significant-change/) |
| `backup.py` | [备份代理和钩子（Backup agents and hooks）](https://www.hasscn.top/contributors/core/integrations/backup/) |
| `media_source.py` | [媒体源（Media source）](https://www.hasscn.top/contributors/core/integrations/media-source/) |
| `application_credentials.py` | 用于 OAuth 2.0 的[应用凭据（Application credentials）](https://www.hasscn.top/contributors/core/integrations/oauth2/#application-credentials) |
| `device_trigger.py`、`device_condition.py`、`device_action.py` | [设备自动化（Device automations）](https://www.hasscn.top/contributors/core/integrations/device-automations/) |

## Home Assistant 在何处查找集成

当配置条目（config entry）或 `configuration.yaml` 引用某个集成的域，或者另一个集成依赖它时，Home Assistant 会查找该集成。它会在两个位置查找：

- `<config directory>/custom_components/<domain>`
- `homeassistant/components/<domain>`（随 Home Assistant 一起发布的集成）

与内置集成使用相同域的自定义集成会覆盖该内置集成。这样做虽然可行，但用户随后将不再收到该集成的更新，而且清单文件中需要一个 `version`。除非你确实有意替换某个内置集成，否则请为自定义集成选择一个独一无二的域。

## 自定义集成中的品牌图像

自定义集成可以在集成文件夹内的 `brand/` 文件夹中附带自己的图标和徽标。核心（core）中的集成则将它们放在[品牌仓库（brands repository）](https://github.com/home-assistant/brands)中。请参见[集成品牌与图像](https://www.hasscn.top/contributors/core/integrations/brands/)。

## 测试

测试位于集成文件夹之外，在 `tests/components/<domain>/` 中。请参见[编写测试](https://www.hasscn.top/contributors/core/development/tests/)。
