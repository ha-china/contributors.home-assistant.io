# 集成页面的 front matter

> 集成页面顶部可用的每个键、其作用以及可接受的取值。

Source: https://www.hasscn.top/contributors/writing/reference/front-matter/

每个集成页面都以 front matter 开头：位于两行 `---` 之间的一块 YAML。它不仅仅是元数据。它驱动着[集成概览](https://www.home-assistant.io/integrations/)、设置按钮、发现文本、质量等级徽章以及页面侧边栏。

许多键与 Home Assistant Core 中的集成清单（manifest）相对应。这些键必须与清单完全一致。其中一些键（例如 `ha_quality_scale`）会通过从核心代码库同步的文档更新，因此在第一个版本之后你很少需要改动它们。但在新页面中把它们写对仍然是你的责任。

## 示例

一个通过 UI（用户界面）设置的集成的典型页面：

```yaml
---
title: Awesome Lights
description: Control your Awesome Lights from Home Assistant.
ha_release: 2026.11
ha_categories:
  - lighting.lighting_systems
ha_iot_class: Local Push
ha_config_flow: true
ha_codeowners:
  - "@your-github-username"
ha_domain: awesome_lights
ha_integration_type: hub
ha_platforms:
  - light
  - sensor
ha_quality_scale: bronze
ha_zeroconf: true
related:
  - docs: /docs/automation/
    title: Automations
  - url: https://www.example.com/awesome-lights/manual
    title: Awesome Lights user manual
---
```

下面的键按用途分组。不适用于你的集成的键直接省略即可。不要将某个键设置为 `false` 来表示“否”。

## 基础键

这些键应出现在每个集成页面上。

- `title`：集成的名称。使用清单中的 `name`，并按其原样书写。
- `description`：一句话描述页面的内容。搜索引擎和链接预览会显示它。
- `ha_domain`：集成的域名（domain）。它必须与清单中的 `domain` 以及页面的文件名一致。对于上面的示例，即 `source/_integrations/awesome_lights.markdown`。
- `ha_release`：首次包含该集成的 Home Assistant 发布版本，格式为 `YYYY.M`。对于新集成，即下一个发布版本：如果当前版本是 2026.10，则使用 2026.11。如果缺少此键，站点构建将失败。
- `ha_codeowners`：负责该集成的 GitHub 用户名或团队，每个都以 `@` 开头。与清单中的 `codeowners` 保持一致。每个条目都要加引号，因为裸的 `@` 在 YAML 值的开头是无效的。

> [!IMPORTANT]
> 以零结尾的版本号要加引号，例如 `ha_release: "2025.10"`。如果不加引号，YAML 会将 `2025.10` 读取为数字 2025.1，页面就会显示错误的版本。

## 分类

这些键描述集成是什么以及做什么。它们为集成概览上的筛选器提供数据。

- `ha_categories`：一到三个类别标识符的列表。对于拥有自己 Core 实现的集成，使用与其清单中 `categories` 相同的标识符。类别描述的是产品或服务，而不是它提供的实体（entity）平台。第一个条目是主要类别。
  - 使用类别，例如 `lighting`，或子类别，例如 `lighting.lighting_systems`。
  - 不要列出重复项，也不要将某个类别与其自身的子类别同时列出。
  - 标识符及如何选择请参阅[集成类别](https://www.hasscn.top/contributors/core/integrations/categories/)。
  - 没有 `ha_categories` 的页面不会出现在集成概览中。实体和系统页面是有意省略此键的。
  - 旧的 `ha_category` 键已不再被接受。
- `ha_integration_type`：集成的类型。它必须与清单中的 `integration_type` 一致：`device`、`entity`、`hardware`、`helper`、`hub`、`service`、`system` 或 `virtual`。如果清单未设置，则类型为 `hub`。
- `ha_iot_class`：集成与设备或服务通信的方式。使用 `Local Polling`、`Local Push`、`Cloud Polling`、`Cloud Push`、`Assumed State` 或 `Calculated`，与清单中的 `iot_class` 一致。取决于设置方式的集成使用 `Configurable`。[IoT class 博客文章](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things/)解释了每个类别。
- `ha_platforms`：集成实现的实体平台，例如 `light` 和 `sensor`。当集成支持下载诊断信息时，也要列出 `diagnostics`。
- `ha_config_flow`：如果集成通过 UI 设置，则设置为 `true`。这会在页面侧边栏中添加设置按钮。否则请省略此键。
- `ha_quality_scale`：集成在质量等级（quality scale）中的级别：`bronze`、`silver`、`gold` 或 `platinum`。Home Assistant 内部的集成使用 `internal`，尚未评分的较旧集成使用 `legacy`。对于新集成，使用 `bronze`。此键会通过从核心代码库同步的文档更新，因此通常不需要手动编辑。

### 协议与连接器

根据集成的用途选择类别。引入多种设备类型的集线器和无线电协议使用 `hubs_protocols`。用于串口、Modbus 或 Web API 的通用连接器使用 `diy_makers`。针对特定产品的集成使用该产品的类别，无论它使用什么协议。请参阅[如何选择集成类别](https://www.hasscn.top/contributors/core/integrations/categories/#how-to-choose)。

## 发现

当集成可以通过相应方式被发现时，将这些键设置为 `true`。它们必须与清单中的发现条目一致。不适用的键请省略。

- `ha_bluetooth`：通过蓝牙（Bluetooth）发现。
- `ha_dhcp`：通过 DHCP 发现。
- `ha_homekit`：通过 HomeKit 发现。
- `ha_mqtt`：通过 MQTT 发现。
- `ha_ssdp`：通过 SSDP 发现。
- `ha_zeroconf`：通过 mDNS（也称为 Zeroconf）发现。

当设置了 `ha_dhcp`、`ha_homekit`、`ha_mqtt`、`ha_ssdp` 或 `ha_zeroconf` 时，页面上的标准配置文本会告诉读者 Home Assistant 可以自动找到他们的设备。请参阅[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/#reusable-text)。

## 相关链接

`related` 会在页面末尾添加链接。每个条目是一个链接：

- `docs`：指向 home-assistant.io 上某个页面的路径，例如 `/docs/automation/`。它可以包含锚点。这些链接显示在**相关主题**下。`title` 是可选的：如果没有提供，则使用所链接页面的标题。
- `url`：指向其他网站的链接。这些链接显示在**相关链接**下，并在新标签页中打开。务必添加 `title`，否则将显示裸 URL。

```yaml
related:
  - docs: /voice_control/s3_box_voice_assistant/
    title: Create an ESP32-S3-BOX-3 voice assistant
  - url: https://esphome.io/projects/
    title: ESPHome projects
```

指向不存在页面的 `docs` 条目会被静默丢弃，因此请检查你的路径。

## 虚拟集成与品牌

有些页面并不记录拥有自己代码的集成。它们的存在是为了让人们能够通过品牌名称找到产品。

*虚拟集成（virtual integration）*是通过另一个集成工作的产品。它的清单使用 `integration_type: virtual`，并且分为两种。

“由……支持”类型指向实际执行工作的集成。例如，Dacia 汽车通过 Renault 集成工作。

- `ha_supporting_domain`：执行工作的集成的域名，例如 `renault`。它必须与虚拟集成清单中的 `supported_by` 一致。页面上的设置按钮和链接使用此域名。
- `ha_supporting_integration`：该集成的名称，例如 `Renault`。生成的页面使用它来告诉读者应设置哪个集成。

“IoT 标准”类型是其设备使用标准协议的品牌：

- `ha_iot_standard`：产品使用的标准：`zigbee`、`zwave` 或 `homekit`。它必须与清单中的 `iot_standards` 一致。Matter 产品的品牌页面使用 `matter`。对于 Zigbee 和 Z-Wave，页面会显示一个按钮，用于开始添加使用该标准的设备。

*品牌（brand）*页面将同一制造商的多个集成或产品归到一个名称下。例如，Google 品牌页面归组了 Google 的各个集成，而 Inovelli 品牌页面指向其设备使用的 Zigbee 和 Z-Wave 标准。品牌不等同于虚拟集成。

- `ha_brand`：如果页面代表的是品牌而非实际集成，则设置为 `true`。此时页面将从品牌图片而不是集成图片中获取其徽标。在常规集成页面上请省略此键。

设置了 `ha_supporting_domain` 的虚拟集成在自身未设置 `ha_categories` 时，会继承其支持集成的类别。没有支持集成的品牌页面（例如 Matter、Zigbee 和 Z-Wave 品牌）不会继承类别，需要自己的 `ha_categories`。

## 仅限维护者

不要自行添加这些键。它们由维护者设置。

- `works_with`：将品牌标记为 [Works with Home Assistant](https://works-with.home-assistant.io/) 合作伙伴计划的一部分。它会添加该计划的徽章，并在页面上生成关于该计划的文本。每个值是产品通过认证的一种连接方式。如果适用，可以列出多个，例如同时列出 `zigbee` 和 `matter`。
  - `zwave`：显示为 Z-Wave，并添加 Z-Wave 徽章和入门文本。
  - `zigbee`：显示为 Zigbee，并添加 Zigbee 徽章和入门文本。
  - `matter`：显示为 Matter，并添加 Matter 徽章和入门文本。
  - `bluetooth`：产品通过蓝牙连接。
  - `local`：产品在本地工作，例如通过本地网络。
  - 任何其他值将按原样显示，首字母大写。
- `featured`：设置为 `true` 以在集成概览中突出显示该集成。请注意，此键没有 `ha_` 前缀。
