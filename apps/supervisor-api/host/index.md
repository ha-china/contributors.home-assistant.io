# Host and OS endpoints

> Supervisor API 中面向主机系统、Home Assistant OS、硬件、网络、时间、挂载和 Docker 的端点。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/host/

这些端点触及容器之下的部分：主机系统及其操作系统。其中大多数需要带 `manager` 或 `admin` 角色的 `hassio_api: true`。`/info` 类端点（如 `GET /host/info`）对任意角色开放。

某些端点只存在于 Home Assistant OS 上，或需要较新的版本。它们在不可用时会返回 `404`。

## 主机（Host）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/host/info` | 主机信息 |
| `POST` | `/host/options` | 更改主机设置 |
| `POST` | `/host/reboot` | 重启主机 |
| `POST` | `/host/shutdown` | 关闭主机 |
| `POST` | `/host/reload` | 重新读取主机信息 |
| `GET` | `/host/services` | 列出 systemd 服务 |
| `GET` | `/host/disks` | 列出可挂载的磁盘 |
| `GET` | `/host/disks/<disk>/usage` | 磁盘用量 |
| `GET` | `/host/logs` | 主机日志 |
| `GET` | `/host/logs/boots` | 列出 journal 中的启动记录 |
| `GET` | `/host/logs/identifiers` | 列出 journal 中的 syslog 标识符 |

### `GET /host/info`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `agent_version` | string or null | OS Agent 的版本 |
| `apparmor_version` | string or null | AppArmor 的版本 |
| `chassis` | string or null | 机箱类型，例如 `embedded` 或 `vm` |
| `virtualization` | string or null | 虚拟化类型，没有则为空 |
| `cpe` | string or null | 操作系统的 CPE 名称 |
| `deployment` | string or null | 部署类型，例如 `production` 或 `development` |
| `disk_free` | float | 剩余磁盘空间，单位 GiB |
| `disk_total` | float | 磁盘总空间，单位 GiB |
| `disk_used` | float | 已用磁盘空间，单位 GiB |
| `disk_life_time` | float or null | 数据盘已使用的寿命百分比，磁盘上报时才有 |
| `features` | list | 主机支持的特性，例如 `reboot`、`network` 或 `haos` |
| `all_features` | list | 全部特性。`features` 会略去旧客户端的 `ntp` |
| `hostname` | string or null | 主机名 |
| `llmnr_hostname` | string or null | LLMNR 使用的主机名 |
| `kernel` | string or null | 内核版本 |
| `operating_system` | string or null | 操作系统名称 |
| `timezone` | string or null | 主机的时区 |
| `dt_utc` | string | UTC 当前时间，ISO 8601 格式 |
| `dt_synchronized` | boolean or null | 时钟已同步则为 `true` |
| `use_ntp` | boolean or null | 主机使用 NTP 则为 `true` |
| `startup_time` | float or null | 上次启动所花的秒数 |
| `boot_timestamp` | integer or null | 上次启动的时间戳，单位微秒，由 systemd 上报 |
| `broadcast_llmnr` | boolean or null | 主机通过 LLMNR 宣告自己则为 `true` |
| `broadcast_mdns` | boolean or null | 主机通过 mDNS 宣告自己则为 `true` |

### `POST /host/options`

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `hostname` | string | 否 | 新主机名 |

### `POST /host/reboot`

重启主机。Home Assistant 正在执行数据库迁移时会失败，除非强制执行。

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `force` | boolean | 否 | 即使正在数据库迁移也重启。默认 `false` |

### `POST /host/shutdown`

关闭主机。接受与 `POST /host/reboot` 相同的 `force` 键。

### `POST /host/reload`

重新读取主机信息。

### `GET /host/services`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `services` | list | 一个 [主机服务模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#host-service) 列表 |

### `GET /host/disks`

返回可用于[磁盘挂载](https://www.hasscn.top/contributors/apps/supervisor-api/host/#mounts)的带分区磁盘。

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `disks` | list | 磁盘列表，每个磁盘包含 `name`、`vendor`、`model`、`serial`、`size`、`id`、`dev_path`、`connection_bus`、`removable`、`ejectable` 和 `partitions` |

每个分区包含 `device`、`uuid`、`label`、`filesystem`、`size`、`read_only` 和 `mountable`。

### `GET /host/disks/<disk>/usage`

返回磁盘空间的占用情况，单位字节。`<disk>` 使用 `default` 表示系统盘，或某个挂载的名称。`default` 始终指系统盘，因此名为 `default` 的挂载无法在此测量。

| 查询参数 | 说明 |
| --- | --- |
| `max_depth` | 文件夹要向下展开多少层。系统盘默认为 1，挂载默认为 0 |

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 条目的 ID |
| `label` | string | 条目的名称 |
| `total_bytes` | integer | 磁盘大小。只在最顶层条目上出现 |
| `used_bytes` | integer | 已用空间 |
| `children` | list | 每个部分的相同结构。没有更细的展开时省略 |

对系统盘而言，children 是 `system`、`addons_data`、`addons_config`、`media`、`share`、`backup`、`ssl` 和 `homeassistant`，`max_depth` 决定在它们内部展开多少层。

挂载没有这样的固定部分，因此 Supervisor 会遍历它的文件夹。`max_depth` 为 0 或 1 时只返回总量，2 会加上第一层文件夹，再往下每层加 1。一个 `other` 子项存放不属于任何文件夹的内容，例如挂载顶层的文件。如果遍历期间文件发生了变化、文件夹合计超过 `used_bytes`，则省略展开。

Supervisor 通过实际访问挂载来测量，如果尚未挂载会先挂载。不存在的挂载返回 `404`。无法读取或已不再挂载的挂载返回错误。测量超过 60 秒时请求返回错误，但测量会继续进行。测量期间，对同一挂载和 `max_depth` 的新请求会等待它完成，而不是再启动一次。`max_depth` 小于 2 时视为同一深度。

### 主机日志

`GET /host/logs` 返回主机日志，工作方式与其他[日志端点](https://www.hasscn.top/contributors/apps/supervisor-api/#log-endpoints)相同。默认显示最重要的服务，每行都带时间戳和进程名，与 `verbose` 一样。以下端点可以进一步缩小范围：

| 路径 | 返回 |
| --- | --- |
| `/host/logs/follow` | 日志，随后持续输出新行 |
| `/host/logs/boots/<bootid>` | 某一次启动的日志 |
| `/host/logs/boots/<bootid>/follow` | 某一次启动的日志，随后持续输出新行 |
| `/host/logs/identifiers/<identifier>` | 某个 syslog 标识符的日志 |
| `/host/logs/identifiers/<identifier>/follow` | 某个标识符的日志，随后持续输出新行 |
| `/host/logs/boots/<bootid>/identifiers/<identifier>` | 某次启动中某个标识符的日志 |
| `/host/logs/boots/<bootid>/identifiers/<identifier>/follow` | 同上，随后持续输出新行 |

### `GET /host/logs/boots`

按偏移量返回 journal 中的启动记录。`0` 是当前启动。

```json
{
  "boots": {
    "0": "b1c386a144fd44db8f855d7e907256f8",
    "-1": "a3b0e6b2f2cf4e1d9d1e1c8b9a7f6e5d"
  }
}
```

### `GET /host/logs/identifiers`

以 `identifiers` 返回 journal 中的 syslog 标识符。常用的有：排查网络问题的 `NetworkManager`、蓝牙相关的 `bluetoothd`，以及编辑 AppArmor 配置时用到的 `audit`。

## Home Assistant OS

以下端点只在 Home Assistant OS 上可用。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/os/info` | 操作系统信息 |
| `POST` | `/os/update` | 更新操作系统 |
| `POST` | `/os/config/sync` | 从 U 盘加载配置 |
| `GET` | `/os/config/swap` | swap 设置 |
| `POST` | `/os/config/swap` | 更改 swap 设置 |
| `POST` | `/os/boot-slot` | 切换启动槽并重启 |
| `GET` | `/os/datadisk/list` | 数据可以迁移到的磁盘 |
| `POST` | `/os/datadisk/move` | 把数据迁移到另一块磁盘 |
| `POST` | `/os/datadisk/wipe` | 抹除数据盘 |
| `GET` | `/os/boards/<board>` | 检查板型 |
| `GET` | `/os/boards/yellow` | Home Assistant Yellow 的设置 |
| `POST` | `/os/boards/yellow` | 更改 Home Assistant Yellow 的设置 |
| `GET` | `/os/boards/green` | Home Assistant Green 的设置 |
| `POST` | `/os/boards/green` | 更改 Home Assistant Green 的设置 |
| `GET` | `/os/boards/raspberrypi/firmware` | Raspberry Pi 固件状态 |
| `POST` | `/os/boards/raspberrypi/firmware/update` | 更新 Raspberry Pi 固件 |
| `GET` | `/os/ssh/authorized_keys` | 列出主机的 SSH 密钥 |
| `POST` | `/os/ssh/authorized_keys` | 为主机添加 SSH 密钥 |
| `DELETE` | `/os/ssh/authorized_keys` | 移除主机的全部 SSH 密钥 |

### `GET /os/info`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `version` | string | 已安装的版本 |
| `version_latest` | string | 可用的最新版本 |
| `version_pending` | string or null | 已安装但等待重启的版本 |
| `update_available` | boolean | 有可用更新则为 `true` |
| `board` | string | 板型名称，例如 `generic-x86-64` 或 `yellow` |
| `boot` | string | 当前的启动槽 |
| `data_disk` | string | 数据盘的 ID |
| `boot_slots` | dictionary | 每个启动槽（`A` 和 `B`）一个[启动槽模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#boot-slot)。调用 `POST /os/boot-slot` 时使用这些名称 |

### `POST /os/update`

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `version` | string | 否 | 要安装的版本。默认为最新版本 |

把更新安装到非活动槽，然后返回。它不会重启：新版本在 `GET /os/info` 的 `version_pending` 中等待，直到系统重启，例如通过 `POST /host/reboot`。在那之前，`version` 仍是正在运行的版本。对 2026.8 之前的 Home Assistant Core 版本，`version` 会改报 pending 版本，以避免再次提供同一个更新。

### `POST /os/config/sync`

从 U 盘加载配置，例如网络设置。

### `GET /os/config/swap`

需要 Home Assistant OS 15.0 或更新版本。

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `swap_size` | string | swap 文件的大小，例如 `1G` |
| `swappiness` | integer | 内核 swappiness，取值 0 到 200 |

### `POST /os/config/swap`

接受相同的键。`swap_size` 是一个数字加可选单位：`B`、`K`、`M` 或 `G`，可选地后跟 `B` 或 `iB`。小于 40 kB 会关闭 swap。更改会创建一个「需要重启」事项（reboot required issue）。

### `POST /os/boot-slot`

切换到另一个启动槽并重启进入。

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `boot_slot` | string | 是 | `A` 或 `B` |

### `GET /os/datadisk/list`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `devices` | list | 数据可以迁移到的磁盘 ID |
| `disks` | list | 一个[磁盘模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#disk)列表 |

### `POST /os/datadisk/move`

把数据分区迁移到另一块磁盘，并重启系统。

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `device` | string | 是 | 目标磁盘的 ID 或设备路径 |

### `POST /os/datadisk/wipe`

抹除数据盘并重启。只有具有 `admin` 角色的应用才能调用。

抹除会格式化数据分区和 overlay 分区。这会删除数据盘上的 Home Assistant、所有应用、备份和媒体，以及主机设置（如网络连接）。操作系统及其启动槽保留。重启后，系统会重新下载 Home Assistant 并进入 onboarding，如同全新安装。你可能需要重新配置网络才能访问它。

### `GET /os/boards/<board>`

当 `<board>` 是当前使用的板型时返回成功（空数据），否则返回错误。`<board>` 是 `GET /os/info` 中 `board` 的值。

### `GET /os/boards/yellow`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `disk_led` | boolean | 磁盘活动 LED 亮起 |
| `heartbeat_led` | boolean | 心跳 LED 亮起 |
| `power_led` | boolean | 电源 LED 亮起 |

`POST /os/boards/yellow` 接受相同的键，全部可选。更改会创建一个「需要重启」事项。

### `GET /os/boards/green`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `activity_led` | boolean | 活动 LED 亮起 |
| `power_led` | boolean | 电源 LED 亮起 |
| `system_health_led` | boolean | 系统健康 LED 亮起 |

`POST /os/boards/green` 接受相同的键，全部可选。

### `GET /os/boards/raspberrypi/firmware`

返回 Raspberry Pi 引导加载固件的状态，以及板载 VL805 USB 控制器固件（如有）的状态。当板型没有可管理的固件，或 OS Agent 低于 1.9.0 时返回 `404`。

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `current_version` | string or null | 已安装的固件版本 |
| `latest_version` | string or null | 操作系统附带的最新固件版本 |
| `update_available` | boolean | 有可用更新则为 `true` |
| `update_blocked` | boolean | 启动设备不允许更新则为 `true` |
| `update_pending` | boolean | 有更新等待重启则为 `true` |
| `blocked_reason` | string or null | 更新被阻止的原因，没有则为 `null`。目前无论原因如何都是 `unsupported_boot_device` |

### `POST /os/boards/raspberrypi/firmware/update`

把 Raspberry Pi 固件更新到操作系统附带的版本。`update_blocked` 为 `true` 时返回错误。新固件在重启后生效，因此成功的更新会创建一个「需要重启」事项。

### 主机的 SSH 密钥

`/os/ssh/authorized_keys` 管理主机 `root` 用户的 SSH 密钥，用于[端口 22222 上的 SSH 服务器](https://www.hasscn.top/contributors/os/operating-system/debugging/)。只有 Home Assistant Core 可以调用这些端点，应用不可以。

- `GET` 以 `keys` 返回密钥，文件中每个非空、非注释行一条。需要 OS Agent 1.11.0 或更新版本，否则返回 `404`。
- `POST` 把你以 `key` 发送的密钥（如 `ssh-ed25519 AAAA...`）追加到现有密钥之后。密钥不得超过 3000 字节，且不能包含控制字符。自 OS Agent 1.10.0 起，密钥还必须是 OpenSSH `authorized_keys` 文件的一行有效内容，包括选项部分。添加密钥也会启动主机的 SSH 服务器。
- `DELETE` 移除全部密钥。它同时停止 SSH 服务器，这会终止已打开的会话。

## 硬件（Hardware）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/hardware/info` | 设备和驱动器 |
| `GET` | `/hardware/audio` | 音频设备 |

### `GET /hardware/info`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `devices` | list | 一个[设备模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#device)列表 |
| `drives` | list | 一个[驱动器模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#drive)列表 |

### `GET /hardware/audio`

按名称和描述返回主机的音频设备。

```json
{
  "audio": {
    "input": {
      "0,0": "Mic"
    },
    "output": {
      "1,0": "Jack",
      "0,1": "HDMI"
    }
  }
}
```

## 网络（Network）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/network/info` | 所有接口和内部网络 |
| `POST` | `/network/reload` | 重新读取网络状态 |
| `GET` | `/network/interface/<interface>/info` | 单个接口 |
| `POST` | `/network/interface/<interface>/update` | 更改接口 |
| `GET` | `/network/interface/<interface>/accesspoints` | 扫描 Wi-Fi 网络 |
| `POST` | `/network/interface/<interface>/vlan/<id>` | 创建 VLAN |

`<interface>` 是接口名称，例如 `eth0`，主接口可用 `default`。

### `GET /network/info`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `interfaces` | list | 一个[网络接口模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#network-interface)列表 |
| `docker` | dictionary | 内部网络：`interface`、`address`、`gateway` 和 `dns` |
| `host_internet` | boolean or null | 主机能访问互联网则为 `true` |
| `supervisor_internet` | boolean | Supervisor 能访问互联网则为 `true` |

```json
{
  "interfaces": [
    {
      "interface": "eth0",
      "type": "ethernet",
      "enabled": true,
      "connected": true,
      "primary": true,
      "mac": "52:54:00:12:34:56",
      "ipv4": {
        "method": "auto",
        "address": ["192.168.1.100/24"],
        "nameservers": ["192.168.1.1"],
        "gateway": "192.168.1.1",
        "route_metric": null,
        "ready": true
      },
      "ipv6": null,
      "wifi": null,
      "vlan": null,
      "mdns": "default",
      "llmnr": "default"
    }
  ],
  "docker": {
    "interface": "hassio",
    "address": "172.30.32.0/23",
    "gateway": "172.30.32.1",
    "dns": "172.30.32.3"
  },
  "host_internet": true,
  "supervisor_internet": true
}
```

### `POST /network/reload`

重新读取网络状态，并检查互联网连接。

### `GET /network/interface/<interface>/info`

返回一个[网络接口模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#network-interface)。

### `POST /network/interface/<interface>/update`

更改接口的配置。至少发送一个键。你发送的某个块会替换该块的全部配置，因此要发送该块的所有键。

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `enabled` | boolean | 否 | 启用或禁用接口 |
| `ipv4` | dictionary | 否 | IPv4 设置，见下文 |
| `ipv6` | dictionary | 否 | IPv6 设置，见下文 |
| `wifi` | dictionary | 否 | Wi-Fi 设置，见下文 |
| `mdns` | string | 否 | `default`、`off`、`resolve` 或 `announce` |
| `llmnr` | string | 否 | `default`、`off`、`resolve` 或 `announce` |

`ipv4` 和 `ipv6` 块接受：

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `method` | string | `auto`、`static` 或 `disabled`。默认 `static` |
| `address` | list | 带前缀的地址，例如 `192.168.1.100/24` |
| `gateway` | string | 网关 |
| `nameservers` | list | DNS 服务器 |
| `route_metric` | integer | 路由度量，数值越小越优先 |
| `addr_gen_mode` | string | 仅限 IPv6：`eui64`、`stable-privacy`、`default-or-eui64` 或 `default` |
| `ip6_privacy` | string | 仅限 IPv6：`disabled`、`enabled-prefer-public`、`enabled` 或 `default` |

`wifi` 块接受：

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | string | `infrastructure`、`mesh`、`adhoc` 或 `ap`。默认 `infrastructure` |
| `auth` | string | `open`、`wep` 或 `wpa-psk`。默认 `open` |
| `ssid` | string | 网络名称 |
| `psk` | string | 网络密码 |

```json
{
  "ipv4": {
    "method": "static",
    "address": ["192.168.1.100/24"],
    "gateway": "192.168.1.1",
    "nameservers": ["192.168.1.1"]
  }
}
```

### `GET /network/interface/<interface>/accesspoints`

扫描 Wi-Fi 网络。只在无线接口上可用。

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `accesspoints` | list | 一个[接入点模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#access-point)列表 |

### `POST /network/interface/<interface>/vlan/<id>`

在以太网接口上创建 VLAN。`<id>` 是 VLAN ID，取值 0 到 4094。接受更新端点的 `ipv4`、`ipv6`、`mdns` 和 `llmnr` 键。这里 `method` 默认为 `auto` 而不是 `static`。

## 时间（Time）

这些端点设置主机用于同步时钟的 NTP 服务器。它们需要 Home Assistant OS 18.3 或更新版本，否则返回 `404`。可用时，`GET /host/info` 的 `all_features` 会列出 `ntp`。

### `GET /time/info`

以 `config` 返回 Supervisor 配置的服务器。主机也可能从其他途径（如 DHCP）获得服务器，因此实际使用的服务器可能不同。

```json
{
  "config": {
    "servers": ["time.cloudflare.com"],
    "fallback_servers": []
  }
}
```

### `POST /time/options`

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `servers` | list | 否 | 要使用的 NTP 服务器 |
| `fallback_servers` | list | 否 | 其他服务器不可达时使用的 NTP 服务器 |

省略的键保持原值。空列表会清空已配置的服务器。每个服务器是主机名或 IP 地址。更改之后，主机的时间同步服务会重启。

## 挂载（Mounts）

挂载把网络共享和本地磁盘加入系统，用于备份、媒体或 share 文件夹。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/mounts` | 列出挂载 |
| `POST` | `/mounts/options` | 更改挂载设置 |
| `POST` | `/mounts` | 添加挂载 |
| `PUT` | `/mounts/<name>` | 更改挂载 |
| `DELETE` | `/mounts/<name>` | 移除挂载 |
| `POST` | `/mounts/<name>/reload` | 重新挂载 |

### `GET /mounts`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `default_backup_mount` | string or null | 备份默认写入的挂载名称，本地备份为 `null` |
| `mounts` | list | 一个[挂载模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#mount)列表 |

### `POST /mounts/options`

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `default_backup_mount` | string or null | 否 | 备份挂载的名称，本地备份为 `null` |

### `POST /mounts`

添加一个挂载。请求体是一个[挂载模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#mount)。

```json
{
  "name": "nas_backups",
  "usage": "backup",
  "type": "cifs",
  "server": "nas.local",
  "share": "backups",
  "username": "homeassistant",
  "password": "secret"
}
```

你添加的第一个备份挂载会成为默认备份位置。

### `PUT /mounts/<name>`

替换一个挂载的配置。请求体与 `POST /mounts` 相同。名称不可更改。

### `DELETE /mounts/<name>`

移除一个挂载。

### `POST /mounts/<name>/reload`

检查挂载是否有响应。有响应的挂载保持原样；否则 Supervisor 以相同配置重新挂载，仍然无法访问时返回错误。适用于共享一度不可达的情况。

## Docker

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/docker/info` | Docker 信息 |
| `POST` | `/docker/options` | 更改 Docker 设置 |
| `GET` | `/docker/registries` | 列出带凭据的容器镜像仓库 |
| `POST` | `/docker/registries` | 为镜像仓库添加凭据 |
| `DELETE` | `/docker/registries/<hostname>` | 移除镜像仓库的凭据 |
| `POST` | `/docker/migrate-storage-driver` | 切换存储驱动 |
| `POST` | `/docker/reset-storage` | 在下次重启时重置 Docker 存储 |

### `GET /docker/info`

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `version` | string | Docker 版本 |
| `enable_ipv6` | boolean or null | 内部网络启用 IPv6 则为 `true` |
| `mtu` | integer or null | 内部网络的 MTU |
| `storage` | string | 存储驱动 |
| `logging` | string | 日志驱动 |
| `registries` | dictionary | 带凭据的镜像仓库，按主机名索引，含 `username` |

### `POST /docker/options`

更改需要重启才能生效，并创建一个「需要重启」事项。

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `enable_ipv6` | boolean or null | 否 | 为内部网络启用 IPv6 |
| `mtu` | integer or null | 否 | 内部网络的 MTU，取值 68 到 65535 |

### `GET /docker/registries`

```json
{
  "registries": {
    "ghcr.io": {
      "username": "octocat"
    }
  }
}
```

### `POST /docker/registries`

为一个容器镜像仓库添加凭据。Supervisor 用它们拉取镜像。Docker Hub 的主机名请使用 `docker.io`。

```json
{
  "ghcr.io": {
    "username": "octocat",
    "password": "ghp_secret"
  }
}
```

### `DELETE /docker/registries/<hostname>`

移除一个镜像仓库的凭据。

### `POST /docker/migrate-storage-driver`

在下次重启时切换 Docker 存储驱动，并创建一个「需要重启」事项。需要 Home Assistant OS 17.0 或更新版本，否则返回 `404`。

| 键 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `storage_driver` | string | 是 | `overlayfs` |

### `POST /docker/reset-storage`

在下次重启时丢弃全部镜像和容器，并创建一个「需要重启」事项。重启后，系统会重新下载 Supervisor、Home Assistant Core、插件和应用的镜像，因此需要互联网访问。需要 Home Assistant OS 18.3 或更新版本，否则返回 `404`。
