# 使用公开数据

> 以 JSON 格式下载数据集，或使用 Prometheus 抓取它们，并构建你自己的图表。

Source: https://www.hasscn.top/contributors/data/guides/public-data/

[analytics.home-assistant.io](https://analytics.home-assistant.io/) 上的所有内容也以数据文件的形式提供，任何人都可以免费使用。这些文件只包含汇总的总量数据，绝不包含单个安装的数据。每次处理分析数据时，这些文件都会重新生成。

## 数据集

| 文件 | 内容 |
| --- | --- |
| [`/data.json`](https://analytics.home-assistant.io/data.json) | 全部内容：`current` 下的当前总量，以及 `history` 下的历史数据。 |
| [`/current_data.json`](https://analytics.home-assistant.io/current_data.json) | 仅包含当前总量。从这里开始。 |
| [`/custom_integrations.json`](https://analytics.home-assistant.io/custom_integrations.json) | 每个自定义集成（integration）的安装数量，以及所使用的版本。 |
| [`/addons.json`](https://analytics.home-assistant.io/addons.json) | 每个应用（app）的安装数量，以及所使用的版本。文件名仍使用应用的旧名称。 |

## 当前总量包含的内容

`current_data.json` 包含以下内容（除其他外）：

- `active_installations`：在过去 60 天内上报数据的安装数量。
- `installation_types`：按安装类型划分的安装数量。
- `versions`：按 Home Assistant 版本划分的安装数量。
- `countries`：按国家代码划分的安装数量。
- `integrations`：按集成（integration）域划分的安装数量。
- `operating_system` 和 `supervisor`：主板、操作系统版本和架构。
- `avg_automations`、`avg_integrations`、`avg_states`、`avg_users` 和 `avg_addons`：共享统计数据（statistical data）的安装的平均值。
- `reports_integrations`、`reports_addons` 和 `reports_statistics`：有多少安装共享使用数据（usage data）和统计数据（statistical data）。计算集成、应用或数量的百分比时，请使用这些数值，而不是 `active_installations`。
- `energy` 和 `recorder`：有多少安装使用能源仪表盘（energy dashboard），以及使用哪些数据库引擎。
- `last_updated`：数据最后一次处理的时间，以毫秒为单位的时间戳表示。

## 快速一览

使用 `curl` 和 `jq` 查看使用量最多的十个集成：

```bash
curl -s https://analytics.home-assistant.io/current_data.json \
  | jq '.integrations | to_entries | sort_by(-.value) | .[:10]'
```

或者使用 Python：

```python
import json
from urllib.request import urlopen

URL = "https://analytics.home-assistant.io/current_data.json"

with urlopen(URL) as response:
    data = json.load(response)

total = data["reports_integrations"]
top = sorted(data["integrations"].items(), key=lambda item: -item[1])

for domain, count in top[:10]:
    print(f"{domain}: {count / total:.1%}")
```

## Prometheus

同样的数据也以 Prometheus 文本格式发布，因此你可以将其抓取到自己的监控系统中：

- `/prometheus/base`
- `/prometheus/integrations`
- `/prometheus/custom_integrations`
- `/prometheus/addons`

例如，作为一个抓取任务（scrape job）：

```yaml
scrape_configs:
  - job_name: "homeassistant_analytics_integrations"
    scrape_interval: 1h
    metrics_path: /prometheus/integrations
    scheme: https
    static_configs:
      - targets:
          - "analytics.home-assistant.io"
```

数据只有在被处理时才会变化，因此每小时抓取超过一次是没有意义的。

## 需要注意的事项

- 这些数字仅包含选择加入的安装。实际的安装数量更高，但没有人知道具体多多少。
- 并非所有共享基本分析数据的人也会共享使用数据或统计数据。计算百分比时，请始终除以对应的 `reports_*` 数值。
- 安装在最后一次上报 60 天后会从数据中消失。

想要修改网站或数据处理流程？代码位于 [analytics.home-assistant.io 仓库](https://github.com/home-assistant/analytics.home-assistant.io)。拉取请求（Pull requests）请提交到 `dev` 分支。
