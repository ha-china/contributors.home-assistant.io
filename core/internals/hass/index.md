# Python 中的 hass 对象

> 每个集成（integration）都会获得的 HomeAssistant 实例、它上面挂载了什么，以及 hass.config 上的核心配置。

Source: https://www.hasscn.top/contributors/core/internals/hass/

阅读任何一个集成的代码，你都会到处看到一个名为 `hass` 的变量。它是正在运行的 Home Assistant 实例，是来自 [`homeassistant/core.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/core.py) 的 `HomeAssistant` 类的一个对象。你的代码与系统其余部分的任何交互都要通过它进行。

## hass 上挂载了什么

| 属性 | 说明 |
| --- | --- |
| `hass.bus` | [事件总线](https://www.hasscn.top/contributors/core/internals/events/)。触发事件并监听它们。 |
| `hass.states` | [状态机](https://www.hasscn.top/contributors/core/internals/states/)。读取和写入实体（entity）的状态。 |
| `hass.services` | [动作注册表](https://www.hasscn.top/contributors/core/internals/actions/)。注册和调用动作（action）。这个名字比"动作"一词出现得更早。 |
| `hass.config` | 核心配置：位置、单位、时区、语言和路径。参见[下文](https://www.hasscn.top/contributors/core/internals/hass/#the-core-configuration)。 |
| `hass.config_entries` | 所有集成的配置条目（config entry）。 |
| `hass.auth` | [认证管理器](https://www.hasscn.top/contributors/core/internals/auth/)：用户、群组和令牌。 |
| `hass.data` | 一个字典，用于存放整个实例范围内共享的数据。使用来自 `homeassistant.util.hass_dict` 的带类型 `HassKey` 作为键。属于某个配置条目的数据则应改放在 `entry.runtime_data` 中。 |
| `hass.loop` | 所有代码都运行于其上的 asyncio 事件循环。 |
| `hass.state` | Home Assistant 处于其生命周期的哪个阶段：一个 `CoreState`，例如 `CoreState.starting`、`CoreState.running` 或 `CoreState.stopping`。 |

除此之外，`hass` 还有用于调度工作的方法：`async_create_task`、`async_create_background_task` 和 `async_add_executor_job`。[Home Assistant 中的异步编程](https://www.hasscn.top/contributors/core/internals/asyncio/)解释了何时该用哪一个。

## 核心的四个组成部分

在底层，核心是一台由四个部分组成的小机器：

- **事件总线**承载着发生的一切。其他部分在它上面触发事件，而任何代码都可以监听。
- **状态机**保存着每个实体的当前状态，并在状态变化时触发 `state_changed` 事件。
- **动作注册表**保存着集成注册的每一个动作。调用一个动作会触发 `call_service` 事件，然后运行对应的处理程序。
- **配置**描述了这个实例：它位于哪里、使用哪些单位，以及加载了哪些内容。

其他一切，从实体到自动化（automation），都是以辅助元素（helper）和集成的形式构建在这些部分之上的。

## 从哪里获得 hass

你永远不需要自己创建 `hass`。Home Assistant 会把它交给你：

- **集成初始化**：`__init__.py` 中的 `async_setup_entry(hass, entry)` 在配置条目被设置时获得它。同时会在启动时进行一些设置的集成，则在 `async_setup(hass, config)` 中获得它。
- **平台**：平台文件（例如 `sensor.py`）中的 `async_setup_entry(hass, entry, async_add_entities)`。
- **实体**：`self.hass`，在实体被添加到 Home Assistant 之后才可用。在 `__init__` 中它尚未被设置。
- **配置流程（config flow）**和**选项流程（options flow）**：`self.hass`。
- **动作处理程序**：`ServiceCall` 上的 `call.hass`。

关于集成如何围绕这些入口点组装起来，请参阅[构建集成](https://www.hasscn.top/contributors/core/integrations/)。

## 核心配置

`hass.config` 是来自 [`homeassistant/core_config.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/core_config.py) 的 `Config` 类的一个实例。用户大多在**设置** > **系统** > **常规**下设置这些内容。只能读取，不要写入：这些值由核心拥有，并替你保存。

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `latitude` | `float` | 家的纬度。 |
| `longitude` | `float` | 家的经度。 |
| `elevation` | `int` | 家的海拔高度，单位始终为米。 |
| `radius` | `int` | 家庭地理位置区域（zone）的半径，单位始终为米。 |
| `location_name` | `str` | 实例的名称。默认为 `Home`。 |
| `time_zone` | `str` | 时区名称，例如 `Europe/Amsterdam`。 |
| `units` | `UnitSystem` | 单位制：公制或美式惯用单位。 |
| `currency` | `str` | 货币代码，例如 `EUR`。 |
| `country` | `str \| None` | 家的国家代码（如果已设置）。 |
| `language` | `str` | 实例的语言，例如 `en`。 |
| `internal_url` | `str \| None` | 用户为本地网络配置的 URL。 |
| `external_url` | `str \| None` | 用户为网络外部配置的 URL。 |
| `config_dir` | `str` | 配置目录的路径。 |
| `api` | `ApiConfig \| None` | HTTP 服务器的配置，在 `http` 集成完成设置之后才会有值。 |
| `components` | `set[str]` | 已加载的集成。 |
| `config_source` | `ConfigSource` | 配置的来源：`default`、`discovered`、`storage`（在用户界面中设置）或 `yaml`。 |
| `allowlist_external_dirs` | `set[str]` | 集成可以从中读取文件的文件夹。 |
| `allowlist_external_urls` | `set[str]` | 集成可以从中获取文件的 URL。 |
| `media_dirs` | `dict[str, str]` | 媒体文件夹，按名称索引。 |
| `skip_pip` | `bool` | 如果为 `True`，则启动时不安装依赖（requirements）。 |
| `skip_pip_packages` | `list[str]` | 安装依赖（requirements）时要跳过的包。 |
| `recovery_mode` | `bool` | Home Assistant 是否在恢复模式下运行。 |
| `safe_mode` | `bool` | Home Assistant 是否在安全模式下运行，即不加载自定义集成。 |
| `debug` | `bool` | 调试模式是否开启。 |

有几个辅助方法值得了解：

- `hass.config.path("my_file.json")` 返回配置目录内的一个路径。
- `hass.config.cache_path("my_cache")` 返回缓存目录中的一个路径，适用于可以重新生成、且不属于备份的数据。
- `hass.config.is_allowed_path(path)` 和 `hass.config.is_allowed_external_url(url)` 会对照允许列表进行检查。在访问来自用户的路径或 URL 之前，请先使用它们。`is_allowed_path` 会执行阻塞式 I/O：请通过 `hass.async_add_executor_job` 在执行器（executor）中调用它，而不要在事件循环中调用。
- `hass.config.distance(lat, lon)` 返回与家的距离，使用单位制的长度单位（千米或英里）。

不要直接读取这些 URL 来构建链接。请使用 `homeassistant.helpers.network` 中的 `get_url(hass)`：它会根据具体情况选择正确的 URL，并且了解 Home Assistant Link。
