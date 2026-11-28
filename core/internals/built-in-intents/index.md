# 内置意图处理器

> Home Assistant 自带意图的处理器位于 Core 中的何处、它们如何找到实体，以及在哪里可以查询每个意图及其槽位。

Source: https://www.hasscn.top/contributors/core/internals/built-in-intents/

内置意图（built-in intent）是 Home Assistant Core 自行处理的[意图](https://www.hasscn.top/contributors/core/internals/intents/)，例如 `HassTurnOn` 或 `HassStartTimer`。触发它们的句子（涵盖所有语言）存放在[意图仓库](https://github.com/OHF-Voice/intents)中。对这些意图进行处理的处理器则位于 Core 中。

完整的列表（包含每个槽位、槽位组合以及一个例句）位于翻译板块的[内置意图](https://www.hasscn.top/contributors/translate/voice/intents/)页面。该列表与 [`intents.yaml`](https://github.com/OHF-Voice/intents/blob/main/intents.yaml)（定义这些意图的文件）保持一致。本页介绍 Core 这一边的情况：处理器位于何处，以及在处理它们时需要注意什么。

## 处理器的位置

每个内置意图都由一个集成（integration）注册，并且仅在该集成已加载时才可用。大多数实体域（entity domain）都在 `intent.py` 平台中注册各自的意图处理器，该平台由 `intent` 集成设置。

| 集成 | 代码 | 意图 |
| --- | --- | --- |
| `intent` | [`homeassistant/components/intent/__init__.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/intent/__init__.py) | 打开和关闭、切换、状态、位置、停止、日期、时间、室内温度，以及对话意图 `HassNevermind` 和 `HassRespond` |
| `intent` | [`homeassistant/components/intent/timers.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/intent/timers.py) | 定时器 |
| `assist_satellite` | [`homeassistant/components/assist_satellite/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/assist_satellite/intent.py) | `HassBroadcast` |
| `climate` | [`homeassistant/components/climate/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/climate/intent.py) | 设置温度和风扇模式 |
| `cover` | [`homeassistant/components/cover/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/cover/intent.py) | `HassOpenCover` 和 `HassCloseCover` |
| `fan` | [`homeassistant/components/fan/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/fan/intent.py) | `HassFanSetSpeed` |
| `humidifier` | [`homeassistant/components/humidifier/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/humidifier/intent.py) | 目标湿度和模式 |
| `lawn_mower` | [`homeassistant/components/lawn_mower/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/lawn_mower/intent.py) | 割草和返回充电座 |
| `light` | [`homeassistant/components/light/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/light/intent.py) | `HassLightSet` |
| `media_player` | [`homeassistant/components/media_player/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/media_player/intent.py) | 暂停、恢复播放、下一个、上一个、音量、静音，以及搜索并播放 |
| `shopping_list` | [`homeassistant/components/shopping_list/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/shopping_list/intent.py) | 购物清单 |
| `todo` | [`homeassistant/components/todo/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/intent.py) | 待办事项列表 |
| `vacuum` | [`homeassistant/components/vacuum/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/vacuum/intent.py) | 启动、返回基站以及清扫区域 |
| `weather` | [`homeassistant/components/weather/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/weather/intent.py) | `HassGetWeather` |

最常用意图的名称是 [`homeassistant/helpers/intent.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/intent.py) 中的常量，例如 `intent.INTENT_TURN_ON`。请使用这些常量，而不要使用字符串。

## 查找实体

大多数作用于实体的意图都使用相同的槽位来查找实体：`name`、`area`、`floor`、`domain` 和 `device_class`。处理器会将这些槽位与用户 Home Assistant 中的实体、区域（area）和楼层（floor）进行匹配。当 Assist 之类的助手发送意图时，只有已暴露给该助手的实体才会参与匹配。

当语句中未提到区域时，某些槽位组合会使用听到该语句的语音卫星（voice satellite）所在的区域。翻译页面将这些组合标记为“satellite area”。

## 没有句子的意图

少数内置意图在意图仓库中没有对应的句子，因此内置对话代理（conversation agent）永远不会产生它们。代码仍然可以触发它们，其中一些还会作为工具提供给 AI 对话代理。其中 `HassOpenCover` 和 `HassCloseCover` 这两个意图已由 `HassTurnOn` 和 `HassTurnOff` 覆盖：在新代码中请使用后者。[没有句子的意图列表](https://www.hasscn.top/contributors/translate/voice/intents/#intents-without-sentences) 列出了所有这些意图。

## 相关内容

- [意图](https://www.hasscn.top/contributors/core/internals/intents/)：编写你自己的处理器，并从代码或通过 HTTP 触发意图。
- [对话 API](https://www.hasscn.top/contributors/core/internals/conversation-api/) 和 [LLM API](https://www.hasscn.top/contributors/core/internals/llm-api/)：文本和 AI 模型如何转化为意图。
- [语音翻译](https://www.hasscn.top/contributors/translate/voice/)：每个意图背后的句子如何按语言编写。
