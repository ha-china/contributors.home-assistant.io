---
title: 创建集成
description: 使用脚手架脚本生成一个新的集成，并了解最小规模的集成是什么样子。
sidebarGroup: 入门
order: 4
---

开始一个新集成（integration）的最快方式，是使用[核心仓库](https://github.com/home-assistant/core)中的脚手架（scaffold）脚本。它会问你几个问题，并生成一个可运行的集成，其中包含配置流程（config flow）、测试和翻译，让你可以直接从设备或服务特有的部分开始。

本页是脚手架以及集成各组成部分的参考。想跟着一步步操作？请参阅[教程](/core/integrations/tutorial/)。

## 它是否应该进入 core？

在编写任何代码之前，请先确认这一点。

对于新集成，项目建议你先以[自定义集成（custom integration）](/glossary/custom-integration/)的形式发布到 [Marketplace](/marketplace/)。这样可以积累经验，迭代速度也更快。等它成熟并拥有一定用户群之后，再联系维护者，例如在 [Discord](https://www.home-assistant.io/join-chat/) 上的 **#core** 频道中询问它是否应该作为内置功能随 Home Assistant 发布。[发布自定义集成](/marketplace/guides/integrations/)介绍了在 core 之外有哪些不同之处。

要作为内置功能发布，集成必须满足以下要求：

- 产品或服务必须现在就能供人们购买和使用。尚未发布的产品、私有测试版（private beta）以及众筹项目均不符合条件。
- 它必须已经站稳脚跟，拥有真实的用户群。Home Assistant 不是新产品的营销平台。
- 所有通信都必须通过 PyPI 上符合[依赖透明度](/core/quality-scale/dependency-transparency/)规则的 Python 库进行。请参阅[构建 Python 库](/core/integrations/api-library/)。

不确定你的集成属于哪种情况？在开始之前，请在 **#core** 频道中询问。

## 保持第一个拉取请求（pull request）足够小

新集成必须达到[集成质量分级（quality scale）](/core/quality-scale/)中的 Bronze 等级，且仅止于此。审查者要求第一个拉取请求保持精简：

- 仅包含一个平台，例如只有 `sensor`。
- 不包含诊断、自定义操作、重新认证流程或重新配置流程。
- 不包含选项流程，除非集成确实离不开它。
- 把较难的规则（例如 `dynamic-devices` 和 `stale-devices`）留到以后再做。

其余内容通过后续的拉取请求逐个提交。一次性倾倒大量代码的大型拉取请求可能会被关闭。[提交拉取请求](/core/development/submitting/#new-integrations)说明了描述中应写明哪些内容。

阅读本页其余内容需要[开发环境](/core/development/environment/)。请在你的 core 代码检出目录的根目录下运行每一条命令。

## 运行脚手架脚本

```shell
python3 -m script.scaffold integration
```

该脚本会要求提供：

- **域名（Domain）**：你的集成的简短且唯一的名称，例如 `airgradient`。它会成为文件夹名称，并且永远不能更改。请参阅[清单文件（manifest）](/core/integrations/manifest/#domain)。
- **名称（Name）**：用户看到的名称，例如 “AirGradient”。
- **GitHub 账号**：你将成为第一位[集成所有者（integration owner）](/glossary/integration-owner/)。
- **PyPI 包**：与你的设备或服务通信的库，使用 `==` 固定版本。如果还没有，请留空。
- **IoT 类别**：集成获取数据的方式，例如 `local_polling` 或 `cloud_push`。
- **认证、发现、OAuth 2.0 以及集成类型**：这些决定了脚本生成哪种配置流程。

根据你的回答，脚本会选用以下配置流程模板之一：

| 你的回答 | 模板 |
| --- | --- |
| 集成类型为 `helper` | `config_flow_helper` |
| 用户使用 OAuth 2.0 登录 | `config_flow_oauth2` |
| 用户需要进行认证，或设备不可被发现 | `config_flow` |
| 可被发现，无需认证 | `config_flow_discovery` |

完成后，脚本会运行 hassfest、更新依赖文件，并根据 `strings.json` 生成英文翻译。最终，你会在 `homeassistant/components/<domain>/` 中得到一个文件夹，并在 `tests/components/<domain>/` 中得到对应的测试文件夹。

> [!NOTE]
> 脚手架会在你的代码应放置的位置留下 `TODO` 注释，以及一个占位类，你需要用自己的库来替换它。在提交拉取请求之前，请先搜索 `TODO`。

## 其他脚手架模板

同一个脚本还可以为已有的集成添加组件。运行脚本时传入模板名称，它会询问你要修改哪个集成：

| 模板 | 添加内容 |
| --- | --- |
| `config_flow` | 带表单的配置流程 |
| `config_flow_discovery` | 适用于无需认证的可发现设备的配置流程 |
| `config_flow_oauth2` | 使用 [OAuth 2.0](/core/integrations/oauth2/) 的配置流程 |
| `config_flow_helper` | 适用于辅助元素（helper）的配置流程 |
| `device_trigger` | [设备触发器](/core/integrations/device-automations/) |
| `device_condition` | [设备条件](/core/integrations/device-automations/) |
| `device_action` | [设备操作](/core/integrations/device-automations/) |
| `reproduce_state` | [重现状态](/core/integrations/reproduce-state/)支持 |
| `significant_change` | [显著变化](/core/integrations/significant-change/)支持 |
| `backup` | 一个[备份平台](/core/integrations/backup/) |

例如，要添加设备触发器：

```shell
python3 -m script.scaffold device_trigger
```

## 最小规模的集成

脚手架生成的内容超出了最低所需。了解哪些内容是必需的会很有帮助，这样你就知道哪些是可选的。一个集成需要两样东西：

- 一个 `manifest.json`，其中至少包含 `domain` 和 `name`。
- 一个 `__init__.py`，其中包含一个返回设置是否成功的 setup 函数。

```json
{
  "domain": "hello_state",
  "name": "Hello, state!"
}
```

```python
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

DOMAIN = "hello_state"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration."""
    hass.states.async_set("hello_state.world", "Paulus")

    return True
```

当 `configuration.yaml` 中包含 `hello_state:` 时，这个集成就会加载。用它来学习没有问题，但与设备或服务通信的集成是通过 UI 中的[配置流程](/core/integrations/config-flow/)进行设置的，而不是通过 YAML。相关规则请参阅 [YAML 配置](/core/integrations/yaml/)。

## 平台：集成中的实体

你的集成通过为所支持的每种实体类型添加一个[平台（platform）](/glossary/platform/)来提供[实体（entity）](/glossary/entity/)。要提供灯，就添加 `light.py`。要提供传感器，就添加 `sensor.py`。每个平台文件都有一个用于创建实体的 `async_setup_entry` 函数，你的集成会将其配置条目（config entry）转发给这些平台：

```python
from homeassistant.const import Platform

PLATFORMS = [Platform.LIGHT, Platform.SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> None:
    """Set up the integration from a config entry."""
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
```

完整的设置与卸载流程请参阅[配置条目](/core/integrations/config-entries/#set-up-the-platforms)；每种实体类型支持的功能请参阅[实体与平台](/core/entities/)。

## 通过库与设备通信

你的集成从不直接与设备或服务通信。所有协议和 API 代码都位于一个独立的 Python 库中，该库发布在 PyPI 上，并由你的集成作为[依赖项（requirement）](/core/integrations/manifest/#requirements)列出。这样既保持了 Home Assistant 的可维护性，也让 Python 社区的其他人能够使用这些代码。

集成负责在该库与 Home Assistant 之间进行转换：它初始化该库，把库的数据转换为实体，并把用户操作转换为对库的调用。[构建 Python 库](/core/integrations/api-library/)介绍了如何编写这样的库。

## Core 集成与自定义集成

核心仓库中的集成位于 `homeassistant/components/` 中。[自定义集成](/glossary/custom-integration/)则位于用户配置目录的 `custom_components/` 文件夹中。两者的构建方式相同，只有清单文件上的两点差异：自定义集成需要提供 `version`，并且其 `documentation` 指向它自己的文档，而不是 home-assistant.io。

[example-custom-config 仓库](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/)中有一些小型示例集成，例如一个从配置条目设置平台的集成。它们是自定义集成，因此包含 `version`。

## 后续步骤

- 在[教程](/core/integrations/tutorial/)中逐步构建一个完整的集成。
- 查看集成的[文件结构](/core/integrations/file-structure/)。
- 填写[清单文件](/core/integrations/manifest/)。
- 构建[配置流程](/core/integrations/config-flow/)，并使用[协调器（coordinator）](/core/integrations/fetching-data/)获取数据。
- 查看质量分级的 [Bronze 等级规则](/core/quality-scale/rules/#bronze)。
