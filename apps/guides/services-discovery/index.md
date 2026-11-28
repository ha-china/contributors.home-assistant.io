# 共享服务并发现集成

> 向其他应用提供 MQTT 代理或 MySQL 数据库，无需询问用户即可使用它们，并让 Home Assistant 为你的应用设置相应的集成。

Source: https://www.hasscn.top/contributors/apps/guides/services-discovery/

Supervisor 帮助应用相互发现，并帮助 Home Assistant 找到你的应用，这样用户就不必手动输入主机名、端口和密码。有两种机制：

- **服务（service）**：提供服务的应用（例如 MQTT 代理）会注册其连接详情，其他应用可以读取这些详情。
- **发现（discovery）**：应用告知 Home Assistant 它正在运行，Home Assistant 会提议为它设置对应的[集成](https://www.hasscn.top/contributors/glossary/integration/)。

## 服务

支持两种服务：`mqtt` 和 `mysql`。在 `config.yaml` 中列出你的应用可以配合使用的服务，并指定一个角色：

```yaml
services:
  - mqtt:want
```

| 角色 | 含义 |
| --- | --- |
| `provide` | 你的应用提供此服务 |
| `want` | 你的应用可以使用此服务，但没有它也能正常工作 |
| `need` | 你的应用需要此服务才能运行 |

你的应用只能读取或写入它所列出的服务。同一时间只能有一个应用提供某项服务。

### 使用服务

从 Supervisor API（`GET /services/mqtt`）读取连接详情，或使用 Bashio：

```bash
#!/command/with-contenv bashio

if bashio::services.available "mqtt"; then
  mqtt_host=$(bashio::services mqtt "host")
  mqtt_port=$(bashio::services mqtt "port")
  mqtt_user=$(bashio::services mqtt "username")
  mqtt_password=$(bashio::services mqtt "password")
else
  bashio::log.warning "No MQTT broker found"
fi
```

最佳实践是为这些详情同时提供配置选项，这样用户就可以连接到并非以应用形式运行的代理。

### 提供服务

你的应用在启动时通过 `POST /services/mqtt` 注册其详情，并在不再提供该服务时通过 `DELETE /services/mqtt` 移除注册。在 `config.yaml` 中以 `provide` 角色列出该服务：移除注册需要该角色。

| 服务 | 键 |
| --- | --- |
| `mqtt` | `host` 和 `port`（必填）、`username`、`password`、`ssl`（默认为 `false`），以及 `protocol`（`3.1` 或 `3.1.1`，默认值） |
| `mysql` | `host` 和 `port`（必填）、`username` 和 `password` |

使用 Bashio：

```bash
#!/command/with-contenv bashio

config=$(bashio::var.json \
  host "$(hostname)" \
  port "^1883" \
  username "app" \
  password "${password}")

bashio::services.publish "mqtt" "${config}"
```

请为使用你服务的应用创建单独的用户，而不是共享一个管理员账户。官方的 Mosquitto 代理应用正是这样做的，是一个很好的参考示例。

## 发现

发现功能让你的应用能够对 Home Assistant 说“我在这里，这是联系我的方式”。随后，Home Assistant 会在 **设置** > **设备与服务** 下显示发现的集成，用户只需一次确认即可完成设置。

### 发送发现消息

在 `config.yaml` 中按域名（domain）列出你的应用会发送发现消息的集成：

```yaml
discovery:
  - adguard
```

然后，在你的应用启动后，向 `POST /discovery` 发送一条消息，其中 `service` 为域名，`config` 为连接详情：

```bash
#!/command/with-contenv bashio

config=$(bashio::var.json \
  host "$(hostname)" \
  port "^3000")

if bashio::discovery "adguard" "${config}" > /dev/null; then
  bashio::log.info "Sent discovery information to Home Assistant"
else
  bashio::log.error "Discovery message to Home Assistant failed!"
fi
```

对于不在你的 `discovery` 列表中的域名，Supervisor 会拒绝该消息。响应中包含一个 `uuid`，你可以使用它通过 `DELETE /discovery/<uuid>` 再次移除该消息。应用被卸载时，其消息也会被移除。

### 在集成中接收

在 Home Assistant 一侧，具有该域名的集成需要一个名为 `hassio` 的[配置流（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/)步骤。它会接收一个 `HassioServiceInfo`，其中包含你发送的 `config`、你的应用的 `name` 和 `slug`，以及该消息的 `uuid`：

```python
async def async_step_hassio(
    self, discovery_info: HassioServiceInfo
) -> ConfigFlowResult:
    """Handle discovery from an app."""
    await self._async_handle_discovery_without_unique_id()
    self._config = discovery_info.config
    return await self.async_step_hassio_confirm()
```

AdGuard Home、ESPHome、Matter、MQTT 和 Z-Wave 等集成已经具备此步骤。要为新的集成添加发现功能，请参阅[核心与集成](https://www.hasscn.top/contributors/core/)部分。
