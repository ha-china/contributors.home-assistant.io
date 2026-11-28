# 分析数据共享的内容

> 开启分析（analytics）后，Home Assistant 按选项发送的每个字段，附示例数据。

Source: https://www.hasscn.top/contributors/data/reference/analytics-data/

分析（analytics）分为多个选项，可在**设置** > **系统** > **分析**中分别开启。使用情况和统计数据需要开启基本分析。本页面列出了每个选项在报告中添加的内容。最权威的来源是 core 中的[分析集成（integration）](https://github.com/home-assistant/core/tree/dev/homeassistant/components/analytics)。

## 基本分析

只要开启了分析，就始终包含在报告中。

| 字段 | 说明 |
| --- | --- |
| `uuid` | 你的安装实例的随机标识符，在首次发送分析数据时生成。它仅用于将你的安装实例只统计一次。 |
| `version` | Home Assistant 版本，例如 `2026.10.0`。 |
| `installation_type` | 安装类型，例如 `Home Assistant OS` 或 `Home Assistant Container`。 |
| `supervisor` | 仅限有 Supervisor 的安装：安装是否 `healthy`（健康）和 `supported`（受支持），以及其架构 `arch`。 |
| `operating_system` | 仅限 Home Assistant OS：`board`（主板）以及操作系统的 `version`。 |

接收方会根据 IP 地址添加 `country`（国家）。对于美国，还会添加 `region`（地区），即所在的州。

```json
{
  "uuid": "12a3456bc78d90123ef4567a789012b3",
  "version": "2026.10.0",
  "installation_type": "Home Assistant OS",
  "supervisor": {
    "healthy": true,
    "supported": true,
    "arch": "amd64"
  },
  "operating_system": {
    "board": "odroid-n2",
    "version": "18.3"
  }
}
```

## 使用情况

按名称添加你正在使用的内容。

| 字段 | 说明 |
| --- | --- |
| `integrations` | 你使用的内置集成的域名（domain），例如 `hue` 或 `zha`。 |
| `custom_integrations` | 你使用的每个自定义集成的域名和版本。 |
| `addons` | 仅限有 Supervisor 的安装：每个应用的 `slug`、`version`，以及 `protected`（受保护）模式和 `auto_update`（自动更新）是否开启。 |
| `energy` | 能源仪表盘（dashboard）是否已 `configured`（配置）。 |
| `recorder` | 记录器（recorder）的数据库 `engine`，例如 `sqlite`，以及其 `version`。 |
| `certificate` | Home Assistant 是否使用自己的证书提供 HTTPS 服务。 |

一个集成在以下情况下会被统计：从用户界面设置且未被禁用或忽略、在 YAML 中配置，或者提供了未被禁用的实体（entity）。

```json
{
  "integrations": ["hue", "zha"],
  "custom_integrations": [
    { "domain": "my_integration", "version": "1.2.0" }
  ],
  "addons": [
    {
      "slug": "core_mosquitto",
      "protected": true,
      "version": "6.5.1",
      "auto_update": false
    }
  ],
  "energy": { "configured": true },
  "recorder": { "engine": "sqlite", "version": "3.49.1" },
  "certificate": false
}
```

## 统计数据

只添加数量，绝不添加名称。

| 字段 | 说明 |
| --- | --- |
| `state_count` | 实体（entity）的数量。 |
| `automation_count` | 自动化（automation）的数量。 |
| `integration_count` | 内置集成的数量，统计方式与使用情况部分相同。 |
| `addon_count` | 仅限有 Supervisor 的安装：应用的数量。 |
| `user_count` | 用户的数量，不包括系统用户。 |

## 诊断

不会向报告添加任何内容。它会为 Supervisor 和 OS Agent 开启向 [Sentry](https://sentry.io/) 发送崩溃报告的功能。参见[分析的工作原理](https://www.hasscn.top/contributors/data/how-it-works/#diagnostics)。

## 设备

将你的设备（device）的单独快照发送到设备数据库，而不是分析接收方。它不需要开启基本分析，但需要在**设置** > **系统** > **实验室**中开启**设备数据库**预览功能。开启该功能也会开启此选项。关于其包含的内容，参见[设备数据库](https://www.hasscn.top/contributors/data/how-it-works/#the-device-database)。

## 保留时长

接收方为每个安装实例保留一条记录。当报告与已存储的内容不同时会重写该记录，即使没有任何变化，也至少每 30 天重写一次。60 天未被重写的记录将被移除。
