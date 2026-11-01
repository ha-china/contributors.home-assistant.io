---
title: 使用严格类型检查
description: "白金级规则 strict-typing：集成（integration）已完全类型化，并使用严格的 mypy 设置进行检查。"
sidebarLabel: strict-typing
sidebarGroup: Platinum
order: 3
---

这是一条白金级规则。在 `quality_scale.yaml` 中，它被称为 `strict-typing`。

集成必须完全类型化，并被列在 core 的 `.strict-typing` 文件中，这样 mypy 才会以严格设置对其进行检查。其依赖库也必须类型化，并按照 [PEP 561](https://peps.python.org/pep-0561/) 中的说明附带一个 `py.typed` 文件。

## 为什么它很重要

Python 不会在运行时检查类型，因此错误的类型会以缺陷的形式出现在用户面前。类型提示（type hints）让 mypy 能在代码合并之前发现这些缺陷。严格模式使 mypy 在缺少类型提示时直接失败，因此不会漏过任何未类型化的代码。

依赖库也很重要。如果没有 `py.typed` 文件，mypy 会将来自该库的所有内容都视为 `Any`，集成中所有涉及该库的类型提示都将起不到任何检查作用。

## 示例

将集成按字母顺序添加到 [core 仓库](https://github.com/home-assistant/core) 根目录下的 `.strict-typing` 文件中：

```text
homeassistant.components.my_integration.*
```

然后让 hassfest 更新 `mypy.ini`，并对该集成运行 mypy：

```shell
python3 -m script.hassfest -p mypy_config
mypy homeassistant/components/my_integration
```

使用严格类型时，在所有会获取配置条目（config entry）的地方都要使用类型化的配置条目：包括 `async_setup_entry`、`async_unload_entry`、各平台、诊断以及选项流程。有关如何定义它，请参阅 [runtime-data](/core/quality-scale/runtime-data/)：

```python
type MyConfigEntry = ConfigEntry[MyClient]


async def async_setup_entry(
    hass: HomeAssistant, entry: MyConfigEntry
) -> None:
    """Set up My integration from a config entry."""
```

请参阅 [Typing](/core/development/typing/)，了解 core 如何使用类型提示和 mypy。

## 如何检查

- Hassfest，当该规则为 `done` 时：集成必须列在 `.strict-typing` 中，并且其清单（manifest）中的每一项依赖要求都必须附带 `py.typed` 文件，或者有单独的 `types-` 存根（stubs）包。Hassfest 只能检查你环境中已安装的、且版本符合清单要求的依赖。
- Hassfest，当该规则与 [runtime-data](/core/quality-scale/runtime-data/) 一起被标记为 `done` 时：`async_setup_entry`、`async_unload_entry` 以及 `__init__.py` 中的其他入口点、各平台、`diagnostics.py` 和选项流程都必须使用类型化的配置条目，名称形如 `MyConfigEntry`。
- 当协调器（coordinator）未使用集成的类型化配置条目时，Pylint 会发出警告（`home-assistant-coordinator-untyped-config-entry`）。
- Mypy 在 CI 和 Git 钩子中运行，遇到类型错误时会失败。

## 例外情况

此规则没有任何例外。

## 相关规则

- [runtime-data](/core/quality-scale/runtime-data/)：将运行时数据存储在 runtime_data 中。
