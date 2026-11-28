# 验证输入

> 在配置流程、动作和 YAML 中，使用 probatio 模式（schema）以及 config_validation 中的辅助函数来验证用户提交给集成的数据。

Source: https://www.hasscn.top/contributors/core/development/input-validation/

无论用户提交给集成的是什么，在使用之前都要先检查。这适用于配置流程表单、动作的数据以及 YAML 配置。在开始时就给出清晰的错误提示，总比在设置进行到一半时出现令人困惑的失败要好。

Core 使用来自 [probatio](https://pypi.org/project/probatio/) 的模式（schema）来验证输入。模式规定了哪些键是必需的或可选的，以及每个键接受的类型或值。

```python
import probatio

from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_PORT
from homeassistant.helpers import config_validation as cv

DEFAULT_PORT = 993

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_HOST): cv.string,
        probatio.Required(probatio.Secret(CONF_PASSWORD)): cv.string,
        probatio.Optional(CONF_PORT, default=DEFAULT_PORT): probatio.Port(),
    }
)
```

在配置流程中，你将这样的模式作为某个步骤的 `data_schema` 传入。对于 YAML，该模式就是集成的 `CONFIG_SCHEMA`。[构建集成](https://www.hasscn.top/contributors/core/integrations/) 对两者都有介绍。

## 模式的规则

- 使用 `import probatio` 导入 probatio。Ruff 会阻止旧的 `vol` 别名，也会阻止直接使用 voluptuous 本身。
- 如果 `homeassistant.const` 中已有 `CONF_*` 常量，就使用它们；否则使用你自己 `const.py` 中定义的常量。
- 把必需的键放在前面，然后是可选的键。
- 默认值必须是有效值。绝不要对字符串使用 `default=None`：如果确实需要默认值，请使用 `default=""`。

## config_validation 中的辅助函数

除了 probatio 的验证器之外，`homeassistant.helpers.config_validation`（通常以 `cv` 导入）还提供了一些针对 Home Assistant 特有内容的验证器：

- **类型**：`cv.string`、`cv.byte`、`cv.boolean`
- **实体 ID**：`cv.entity_id`、`cv.entity_ids`
- **数字**：`cv.small_float`、`cv.positive_int`
- **时间**：`cv.time`、`cv.time_zone`
- **其他**：`cv.template`、`cv.slug`、`cv.temperature_unit`、`cv.latitude`、`cv.longitude`、`cv.isfile`、`cv.sun_event`、`cv.url`、`cv.icon`

对于 MQTT 主题，MQTT 集成在 [`homeassistant/components/mqtt/util.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/mqtt/util.py) 中提供了 `valid_subscribe_topic` 和 `valid_publish_topic`。

一些较旧的 `cv` 辅助函数现在只是 probatio 验证器的简单封装。在 core 中，一条 lint 规则要求你直接使用 probatio 版本：

| 不要使用 | 应使用 |
| --- | --- |
| `cv.ensure_list` | `probatio.EnsureList()` |
| `cv.port` | `probatio.Port()` |
| `cv.has_at_least_one_key` | `probatio.AtLeastOne` |
| `cv.has_at_most_one_key` | `probatio.AtMostOne` |

对于自定义集成，这些 `cv` 名称仍然可以使用。

## 示例

### 限制可选值

```python
DATA_SCHEMA = probatio.Schema(
    {
        probatio.Optional(CONF_METHOD, default="GET"): probatio.In(
            ["GET", "POST"]
        ),
    }
)
```

### 已知选项的列表

```python
SENSOR_TYPES = {
    "article_cache": ("Article cache", "MB"),
    "average_download_rate": ("Average speed", "MB/s"),
}

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Optional(CONF_MONITORED_VARIABLES, default=[]): probatio.All(
            probatio.EnsureList(), [probatio.In(SENSOR_TYPES)]
        ),
    }
)
```

### 密钥

当某个键的值能够授予访问权限时，比如密码、令牌、API 密钥或 PIN 码，请用 `probatio.Secret` 将其包裹起来。这样当验证失败时，错误信息会指出键名和问题所在，但不会显示其值，从而避免密钥出现在日志中：

```text
Invalid config for 'demo': value should be a string for dictionary value
'password', got **REDACTED**
```

只标记真正的密钥。主机名、序列号或 GPIO 引脚都不是密钥，隐藏它们只会让试图修复配置的人无法从错误信息中获得帮助。
