# 版本管理

> Home Assistant Core 的版本是如何构建的，从稳定版到 beta 版、nightly 版和开发版本。

Source: https://www.hasscn.top/contributors/core/development/versioning/

Home Assistant Core 使用[日历化版本管理（calendar versioning）](https://calver.org/)。版本号由三部分组成：

```text
YYYY.MM.PATCH
```

| 部分 | 含义 |
| --- | --- |
| `YYYY` | 发布年份，例如 `2026`。 |
| `MM` | 发布月份，不带前导零：`5`，而不是 `05`。 |
| `PATCH` | 该月份内的补丁版本号，从 `0` 开始。 |

因此 `2026.5.0` 是 2026 年 5 月的发布版本，而 `2026.5.1` 和 `2026.5.2` 是它的补丁版本。关于发布时间表和发布渠道，请参阅[发布常见问题](https://www.home-assistant.io/faq/release/)。

## Beta 版、nightly 版和开发版本

版本号遵循 [PEP 440](https://peps.python.org/pep-0440/)，因此补丁部分可以带有后缀，用于表示非稳定版本：

| 类型 | 格式 | 示例 |
| --- | --- | --- |
| 稳定版 | `YYYY.MM.PATCH` | `2026.5.0` |
| Beta 版 | `YYYY.MM.PATCH` + `b<N>` | `2026.5.0b0` |
| Nightly 版 | `YYYY.MM.PATCH` + `.dev<YYYYMMDDHHMM>` | `2026.7.0.dev202607241254` |
| 开发版 | `YYYY.MM.PATCH` + `.dev<N>` | `2026.7.0.dev0` |

## 版本号所在位置

版本号在 [`homeassistant/const.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/const.py) 中通过 `MAJOR_VERSION`、`MINOR_VERSION` 和 `PATCH_VERSION` 常量进行设置。`dev` 分支始终以下一个版本的开发版本形式存在，例如 `2026.7.0.dev0`。

版本号并非来自标签或日期，而是有意进行提升的，使用的是 [`script/version_bump.py`](https://github.com/home-assistant/core/blob/dev/script/version_bump.py)，它知道如何切换到下一个 `minor`、`patch`、`dev`、`beta` 或 `nightly` 版本。发布第一个 beta 版会将 `2026.7.0.dev0` 变为 `2026.7.0b0`，而正式发布则会去掉后缀：`2026.7.0`。

## 比较版本

当你的代码需要根据 Home Assistant 的版本执行不同操作时，请使用 [AwesomeVersion](https://github.com/ludeeus/awesomeversion) 来比较版本。不要自己解析版本字符串：beta 版、开发版本和补丁版本必须能够正确排序，而这很容易出错。
