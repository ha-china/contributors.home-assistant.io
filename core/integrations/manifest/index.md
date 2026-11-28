# 集成清单（manifest）

> manifest.json 中每个键的作用及其接受的值。

Source: https://www.hasscn.top/contributors/core/integrations/manifest/

每个集成都有一个[清单（manifest）](https://www.hasscn.top/contributors/glossary/manifest/)：即集成文件夹中的一个 `manifest.json` 文件，它告诉 Home Assistant 这个集成是什么、需要什么，以及如何被发现。Home Assistant 在加载任何代码之前都会先读取它。

以下是 AirGradient 集成的清单：

```json
{
  "domain": "airgradient",
  "name": "AirGradient",
  "codeowners": ["@airgradienthq", "@joostlek"],
  "config_flow": true,
  "documentation": "https://www.home-assistant.io/integrations/airgradient",
  "integration_type": "device",
  "iot_class": "local_polling",
  "quality_scale": "platinum",
  "requirements": ["airgradient==0.10.0"],
  "zeroconf": ["_airgradient._tcp.local."]
}
```

Hassfest 是 core 的验证脚本，会检查每一个清单。它要求键按以下顺序排列：先是 `domain`，再是 `name`，其余键按字母顺序排列。运行 `python3 -m script.hassfest` 来检查你的清单，它会自动为你排序键。

## 必需的键

### domain

集成简短且唯一的名称，由小写字母、数字和下划线组成，例如 `mobile_app`。它必须与清单所在文件夹的名称一致，并且永远不能更改：配置条目（config entry）、实体 ID 和用户的自动化都引用它。

### name

用户看到的名称。使用产品或服务的名称，并遵循以下规则：

- 如果产品或服务同时具有本地集成和云集成，云集成要在名称中加上 "Cloud"，例如 **LIFX Cloud**。
- 本地集成（或同时支持本地和云的集成）使用原有名称，例如 **LIFX**。不要添加 "Local"。
- 天生基于云的产品或服务的集成直接使用其名称，例如 **iCloud**，而不是 **iCloud Cloud**。

### codeowners

负责该集成的人员的 GitHub 用户名或团队名称列表，例如 `["@frenck"]`。他们会在出现 issue 和拉取请求（pull request）时收到通知。至少要添加你自己。质量等级达到 Silver 及以上的集成必须至少有一名集成负责人。

### documentation

文档的 URL。对于 core 中的集成，它是 `https://www.home-assistant.io/integrations/<domain>`。自定义集成必须指向其自己的文档，并通过 `https` 提供。

### iot_class

[IoT 类别（IoT class）](https://www.hasscn.top/contributors/glossary/iot-class/)：集成与设备或服务通信的方式。每个连接到其他事物的集成都必须设置此项。

| 值 | 含义 |
| --- | --- |
| `local_polling` | 直接与设备通信，按固定间隔请求更新 |
| `local_push` | 直接与设备通信，设备在发生变化时主动通知 Home Assistant |
| `cloud_polling` | 通过云端通信，按固定间隔请求更新 |
| `cloud_push` | 通过云端通信，云端在发生变化时主动通知 Home Assistant |
| `assumed_state` | Home Assistant 无法获取状态，因此假定状态为最后一条命令的结果 |
| `calculated` | 不与任何设备通信，而是通过计算得出结果 |

## 设置与类型

### integration_type

集成所针对的对象类型。core 中带有配置流程（config flow）的集成必须设置它。缺失时，Home Assistant 会将该集成视为 `hub`，但无论如何都应设置它。

| 值 | 用途 |
| --- | --- |
| `device` | 每个配置条目对应单个设备，例如 ESPHome |
| `hub` | 访问多个设备或服务的网关，例如 Philips Hue |
| `service` | 每个配置条目对应单个服务，例如 DuckDNS |
| `helper` | 帮助用户创建自动化的实体，例如导数（derivative）或分组 |
| `entity` | 基础实体平台，例如 `sensor` 或 `light`。一般不应使用。 |
| `hardware` | 硬件集成，例如 Raspberry Pi。一般不应使用。 |
| `system` | 保留给系统集成使用。一般不应使用。 |
| `virtual` | 根本不是集成，而是指向另一个集成的指针。参见[虚拟集成](https://www.hasscn.top/contributors/core/integrations/manifest/#virtual-integrations)。 |

`hub` 与 `device` 或 `service` 的区别在于一个配置条目代表什么：hub 提供对许多设备或服务的访问，而其他类型恰好只提供一个。

### categories

用户在网站的集成页面、应用内以及 Marketplace 中查找集成时使用的分类。每个条目是一个分类，例如 `energy`，或者是带有子分类的分类，例如 `energy.meters_monitoring`。第一个条目是主分类：它是最能说明该集成用途的分类。

以下是 Shelly 集成的分类：

```json title="manifest.json"
{
  "categories": [
    "plugs_switches",
    "lighting.bulbs_lamps",
    "energy.meters_monitoring"
  ]
}
```

Hassfest 会检查：

- 有一到三个条目，且没有重复。
- 每个条目都是已知的分类或子分类。
- 分类不会与其自身的某个子分类并列出现，例如 `energy` 与 `energy.meters_monitoring`。
- entity、system 和 virtual 类型的集成不含该键。
- core 中的其他所有集成都必须有该键。对于自定义集成，该键是可选的。

这些检查大多需要 core 中的分类列表，因此 hassfest 只在 core 检出（checkout）内进行验证时才会运行它们。针对自定义集成的 hassfest GitHub action 则会运行这些检查。对于自定义集成，未知分类在 hassfest 中只会产生警告而不是错误，这样即使某个分类在 core 中发生变化，也不会导致你仓库中的 hassfest 失败。[HACS action](https://www.hasscn.top/contributors/marketplace/reference/validation/) 在遇到未知分类时则会失败。

完整的分类列表以及如何选择合适分类，参见[集成分类](https://www.hasscn.top/contributors/core/integrations/categories/)。

### config_flow

当集成有 `config_flow.py` 时设置 `"config_flow": true`，这样用户就可以从 UI 中添加它。参见[配置流程](https://www.hasscn.top/contributors/core/integrations/config-flow/)。

### single_config_entry

当集成仅支持一个配置条目时设置 `"single_config_entry": true`。这样 Home Assistant 就会阻止用户添加第二个配置条目。

## 依赖与要求

### requirements

集成所需的 Python 包列表，采用 `pip` 格式并固定到精确版本，例如 `["airgradient==0.10.0"]`。Home Assistant 在加载集成之前会先安装它们。如果安装失败，集成将不会加载。

自定义集成只应列出那些不是 Home Assistant 本身所需依赖的包。

在你开发库（library）期间，可以针对尚未发布到 PyPI 的版本测试你的集成。请自行安装该库，并告诉 Home Assistant 不要替换它。在你的 core 检出目录中运行以下命令，并将该库放在旁边的文件夹中：

```shell
uv pip install -e ../my-library
hass --skip-pip-packages my-library
```

若要让 Home Assistant 完全不安装或替换任何包，请改用 `hass --skip-pip` 启动。

在开发容器中，你的检出旁边的文件夹并不存在：参见[在 Home Assistant 中试用你的库](https://www.hasscn.top/contributors/core/integrations/api-library/#try-your-library-in-home-assistant)。

或者将依赖指向一个 git 引用，可以是分支、标签（tag）或提交（commit）：

```json
{
  "requirements": [
    "my-library@git+https://github.com/me/my-library.git@my-branch"
  ]
}
```

不要提交带有 git 依赖的拉取请求。请先在 PyPI 上发布该库。

### dependencies

必须在本集成加载之前完成设置的其他集成。当你的集成离开另一个集成就无法工作时使用此键，例如它需要 webhooks（`webhook`）或 MQTT 连接（`mqtt`）时。它并不保证另一个集成的配置条目已经设置完成。

### after_dependencies

你的集成可以使用但并不需要的集成。如果它们已被配置，Home Assistant 会先设置它们。无论哪种情况，它们的依赖包都会被安装，因此你可以放心地从它们导入。例如，`camera` 列出了 `media_player`：如果 `media_player` 已配置，它会在 `camera` 之前加载；如果没有配置，`camera` 也会照常加载。

Hassfest 会检查你从中导入的集成是否列在 `dependencies` 或 `after_dependencies` 中，但有一些例外。你可以从实体平台集成（如 `sensor` 或 `light`）以及一组内部集成（如 `webhook` 或 `zone`）导入，而无需列出它们。完整列表是 [`script/hassfest/dependencies.py`](https://github.com/home-assistant/core/blob/dev/script/hassfest/dependencies.py) 中的 `ALLOWED_USED_COMPONENTS`。这只涵盖导入：如果你的集成需要其中某个集成被设置，例如 `webhook`，仍然要列出它。切勿在 `dependencies` 中列出 `homeassistant` 或 `persistent_notification`。它们总是会加载，hassfest 会在那里拒绝它们。core 中的集成只能列出 core 中的其他集成。自定义集成也可以列出自定义集成。

### loggers

你的依赖包在其 `logging.getLogger` 调用中使用的日志记录器（logger）名称列表，例如 `["aiohue"]`。Home Assistant 用它将库的日志消息关联到你的集成，例如当用户为该集成启用调试日志时。

## 质量与状态

### quality_scale

集成所达到的[集成质量等级（quality scale）](https://www.hasscn.top/contributors/core/quality-scale/)级别：`bronze`、`silver`、`gold` 或 `platinum`。新集成必须至少达到 `bronze`。值 `internal`、`legacy`、`custom` 和 `no_score` 保留给特殊情况使用。

### disabled

阻止集成加载的简短原因，例如 `"Library is broken with the latest firmware"`。Home Assistant 会记录该原因。

### preview_features

集成提供的 Labs 预览功能：在成为集成的常规组成部分之前，由用户自行开启的实验性功能。每个键是一个功能的 slug，并带有用于反馈、获取更多信息以及报告问题的可选链接。完整的工作流程参见 [Labs](https://www.hasscn.top/contributors/core/development/labs/)。

```json
{
  "preview_features": {
    "my_preview_feature": {
      "feedback_url": "https://community.home-assistant.io/t/12345",
      "learn_more_url": "https://www.home-assistant.io/integrations/example",
      "report_issue_url": "https://github.com/home-assistant/core/issues"
    }
  }
}
```

## 仅限自定义集成

以下键仅在自定义集成中有效：

- `version`：必填。[AwesomeVersion](https://github.com/ludeeus/awesomeversion) 能够识别的版本，例如 `"1.2.0"`（SemVer）或 `"2026.10.1"`（CalVer）。
- `issue_tracker`：用户报告 issue 的 URL。core 中的集成省略它，Home Assistant 会链接到 core 仓库。
- `import_executor`：Home Assistant 在执行器（executor）中导入集成，这样缓慢的导入就不会阻塞[事件循环（event loop）](https://www.hasscn.top/contributors/glossary/event-loop/)。仅当你的集成必须在事件循环中导入时才将其设置为 `false`。

## 发现

这些键告诉 Home Assistant 如何识别你的设备，并在发现设备时启动你的配置流程。这些值必须遵循一些规则（有的要求小写，有的要求大写），hassfest 会进行检查。[发现（Discovery）](https://www.hasscn.top/contributors/core/integrations/discovery/)介绍了接下来会发生什么。

### bluetooth

匹配器（matcher）列表。当设备满足至少一个匹配器中的所有键时，即视为匹配。

| 键 | 匹配内容 |
| --- | --- |
| `local_name` | 广播的名称。支持通配符，但前三个字符中不能使用。 |
| `service_uuid` | 128 位服务 UUID，小写 |
| `service_data_uuid` | 128 位服务数据 UUID，小写 |
| `manufacturer_id` | 制造商 ID，整数 |
| `manufacturer_data_start` | 制造商数据的前几个字节，以 0 到 255 之间的整数列表表示 |
| `connectable` | 如果设备只需要广播，则设置为 `false`。默认为 `true`。 |

```json
{
  "bluetooth": [
    { "local_name": "Prodigio_*" },
    { "manufacturer_id": 76, "manufacturer_data_start": [6] }
  ]
}
```

要匹配 16 位 UUID，请将其转换为 128 位：用它替换 `00000000-0000-1000-8000-00805f9b34fb` 的第三和第四个字节。16 位 UUID `0xfd3d` 变为 `0000fd3d-0000-1000-8000-00805f9b34fb`。

### zeroconf

mDNS 服务类型列表。每一项可以是字符串，也可以是带有 `type` 和过滤器的对象。对于像 `_http._tcp.local.` 这样的通用类型，请使用过滤器，这样就不会匹配到网络上的每一台 Web 服务器。

```json
{
  "zeroconf": [
    "_googlecast._tcp.local.",
    { "type": "_http._tcp.local.", "name": "example*" },
    {
      "type": "_axis-video._tcp.local.",
      "properties": { "macaddress": "00408c*" }
    }
  ]
}
```

`name` 上的过滤器和 `properties` 中的过滤器必须为小写，并且可以使用通配符。位于条目顶层的过滤器 `macaddress`、`model` 和 `manufacturer` 已弃用：请改用 `properties`。

### ssdp

针对 SSDP 头 `st`、`usn`、`ext` 和 `server`（小写），以及 UPnP 设备描述中字段（例如 `manufacturer` 或 `deviceType`）的匹配器列表。当设备满足至少一个匹配器中的所有键时，即视为匹配。

```json
{
  "ssdp": [
    {
      "st": "roku:ecp",
      "manufacturer": "Roku",
      "deviceType": "urn:roku-com:device:player:1-0"
    }
  ]
}
```

### homekit

HomeKit 设备的型号名称。当设备的完整型号名称或其第一个单词（直到空格或连字符为止）出现在列表中时，即视为匹配。型号也可以是带通配符的模式，例如 `LIFX*`。你不需要使用 HomeKit 协议：你可以用任何你喜欢的方式与设备通信。一旦你的集成匹配了某个型号，未与 HomeKit 配对的设备的发现信息将不再发送给监听 HomeKit zeroconf 类型的集成。

```json
{
  "homekit": {
    "models": ["LIFX"]
  }
}
```

### lorawan

LoRaWAN 匹配器列表。每个匹配器是一对值：一个协议栈（例如 `"chirpstack"` 或 `"tts"`），以及网络服务器为你的供应商使用的品牌 ID，以字符串或整数表示。你的集成需要将 `config_flow` 设置为 `true`，并在其 `dependencies` 中包含 `lorawan`。

```json
{
  "config_flow": true,
  "dependencies": ["lorawan"],
  "lorawan": [["chirpstack", 744], ["tts", "sensecap"]]
}
```

匹配其中一对的设备会启动你配置流程的 `integration_discovery` 步骤。匹配器只负责选中你的集成：你的库决定支持哪些型号。参见 [LoRaWAN 设备](https://www.hasscn.top/contributors/core/internals/lorawan/)。

### mqtt

为发现而订阅的 MQTT 主题列表。同时也要将 `mqtt` 添加到 `dependencies`（或 `after_dependencies`）中。

```json
{
  "mqtt": ["tasmota/discovery/#"]
}
```

在你的集成自己订阅主题之前，请使用 `await mqtt.async_wait_for_mqtt_client(hass)` 等待 MQTT 客户端。它会在 MQTT 尚在设置时等待，一旦客户端可用就返回 `True`；如果 MQTT 未设置或未能在限时内可用，则返回 `False`。

### dhcp

针对 DHCP 流量的匹配器列表。`hostname` 必须为小写，`macaddress`（MAC 地址的前半部分，不含冒号）必须为大写并包含通配符。匹配使用 [Unix 文件名模式](https://docs.python.org/3/library/fnmatch.html)。

```json
{
  "dhcp": [
    { "hostname": "rachio-*", "macaddress": "009D6B*" },
    { "hostname": "[dp]achio-*", "macaddress": "009D6B*" },
    { "registered_devices": true }
  ]
}
```

带有 `"registered_devices": true` 的匹配器会匹配你的集成已经在[设备注册表（device registry）](https://www.hasscn.top/contributors/core/integrations/device-registry/)中通过 MAC 地址连接注册的设备。当主机名或 MAC 前缀匹配的范围过宽时，可以用它来获知已知设备的新 IP 地址。

当你的设备支持 `zeroconf` 或 `ssdp` 时，请优先使用它们。它们通常比 DHCP 提供更好的体验。

### usb

针对 USB 设备的匹配器列表：`vid` 和 `pid`（大写），以及 `serial_number`、`manufacturer` 和 `description`（小写，允许使用通配符）。[Debian wiki](https://wiki.debian.org/HowToIdentifyADevice/USB) 解释了如何找到这些值。`known_devices` 是匹配器涵盖的产品名称列表。它不用于匹配。

```json
{
  "usb": [
    { "vid": "10C4", "pid": "EA60", "description": "*zigbee*" }
  ]
}
```

> [!WARNING]
> 一些 VID 和 PID 组合被许多不相关的设备使用。VID `10C4` 搭配 PID `EA60` 可以是任何 Silicon Labs CP2102 USB 转串口芯片。请同时基于 `description` 或其他值进行匹配，否则用户会收到针对不属于你的设备的发现消息。

## 虚拟集成

有些产品所使用的集成并不是以它们命名的。August 蓝牙锁使用 Yale Access Bluetooth 集成，而有些产品仅使用 Z-Wave 之类的标准。虚拟集成（virtual integration）帮助用户找到正确的集成：它只是一个清单，不包含任何代码，并且只有 core 中的集成才能提供。

虚拟集成有 `domain`、`name`、`"integration_type": "virtual"`，以及以下两个键之一：

- `supported_by`：支持该产品的集成的 domain。
- `iot_standards`：产品使用的标准列表：`homekit`、`zigbee` 或 `zwave`。

```json
{
  "domain": "august_ble",
  "name": "August Bluetooth",
  "integration_type": "virtual",
  "supported_by": "yalexs_ble"
}
```

用户在添加集成时会找到该产品，Home Assistant 会将他们引导至正确的配置流程。该产品还会在 [home-assistant.io](https://www.home-assistant.io/) 上获得一个自动生成的页面。请将该产品的徽标添加到 [brands 仓库](https://www.hasscn.top/contributors/core/integrations/brands/)中。

> [!TIP]
> 如果某个品牌生产使用 Zigbee 等标准的产品，请改为在[品牌（brand）](https://www.hasscn.top/contributors/core/integrations/brands/#brand-files)上设置 IoT 标准。只有当这样做会让用户感到困惑时，才使用虚拟集成。
