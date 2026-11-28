# 审查拉取请求

> 关于审查 Home Assistant Core 拉取请求的实用指南。首先检查什么、针对不同类型的变更关注什么，以及如何给出反馈。

Source: https://www.hasscn.top/contributors/core/development/reviewing/

任何人都可以审查拉取请求，每一次审查都有帮助。你不需要是维护者：用自己的设备测试一个变更、发现一个缺失的测试，或者提出一个好问题，都能推动拉取请求前进。审查也是了解 core 如何运作的最快方式，而且拉取请求模板要求每位贡献者审查另外两个拉取请求。

本指南基于 core 中的审查者实际最常评论的内容。把它当作检查清单，而不是照本宣科的脚本。

## 在哪里找到拉取请求

- [没有审查记录的拉取请求](https://github.com/home-assistant/core/pulls?q=is%3Aopen+is%3Apr+-author%3A%40me+-draft%3Atrue+-label%3Awaiting-for-upstream+sort%3Acreated-desc+review%3Anone+-status%3Afailure)，且检查项通过。
- `small-pr` 标签，用于快速处理的小改动。
- 你正在使用的集成的拉取请求，这样你可以进行真实测试。

## 1. 准入检查

在阅读任何代码之前先检查这些。如果有一项不通过，评论后即可停止：继续审查只会浪费你的时间。

- **CLA 已签署。** 拉取请求带有 `cla-signed` 标签，而不是 `cla-needed`。
- **CI 通过。** 如果因该变更而失败，请作者修复，并将拉取请求转为草稿。
- **只做一件事。** 一个 bug 修复、一个功能、一个集成，或一次重构。如果混杂了多件事，请作者拆分。
- **勾选了一种变更类型**，并且与代码实际做的事相符。
- **不依赖另一个未关闭的拉取请求。**
- **描述解释了原因。** bug 修复链接了对应的 issue。新集成解释了产品或服务。
- **模板已填写完整**，没有空白的向后不兼容变更部分，也没有光秃秃的 `fixes #`。

### 拉取请求可能无法完成的信号

- 来自没有已合并拉取请求记录的人的大型新集成，最有可能被放弃。在 CI 通过并且第一条机器人反馈被处理之前，不要投入深入的审查。
- 未经审查的 AI 输出的迹象：修复不存在的问题、为不可能发生的条件编写防御性代码、在行为没有变化的情况下修改测试夹具（fixture），或者在明显存在基本误解的代码之上配上精美的描述。[AI 政策](https://www.hasscn.top/contributors/core/development/submitting/#using-ai)适用。

## 2. 按变更类型

### 新集成

[集成质量量表](https://www.hasscn.top/contributors/core/quality-scale/)的 Bronze 级别是基线。

- **范围**：`PLATFORMS` 中的一个平台。第一个拉取请求中不包含诊断、重新配置流程或选项流程（除非确实需要）。
- **清单（manifest）**：`iot_class` 与集成实际的通信方式相符。
- **库**：开源，PyPI 上的许可证与其 LICENSE 文件一致，并且与 Apache 2.0 兼容。MIT、BSD、Apache 2.0、LGPL、MPL 2.0、ISC 和 Unlicense 都可以。GPL 和 AGPL 不行，库的依赖项使用这些许可证的也不行。对于多年不活跃、最近更换了维护者的库要格外小心。
- **`quality_scale.yaml`**：每条 Bronze 规则都是 `done`，或者是带有有效理由的 `exempt`。抽查确认 `done` 是真实的。
- **配置流程**：在创建条目之前测试连接，失败时显示清晰的错误，并设置唯一 ID，使同一设备不能被添加两次。
- **发现**：Zeroconf、DHCP 和 SSDP 模式只匹配目标设备。过于宽泛的模式会错误地认领不该认领的设备。`manifest.json` 中的每种发现方法在配置流程中都有对应的 `async_step_*`。用户主动启动的步骤应该优先于同一设备的发现流程：在那里向 `async_set_unique_id` 传入 `raise_on_progress=False`。支持 Zeroconf 的集成可以添加 DHCP 作为后备，用于 mDNS 工作不佳的网络。对于会更改 IP 地址或主机名的设备，DHCP 匹配器中的 `registered_devices` 允许已设置的设备被重新发现。
- **字符串**：用户看到的所有内容都在 `strings.json` 中，使用句首大写（sentence case），在合适的地方使用通用字符串。字符串以 Markdown 渲染，因此类似代码的值，如实体 ID、动作名称和文件名，要放在反引号中。品牌和协议名称不用反引号，并保留其官方拼写，如 Z-Wave。

### 新功能

- 一个连贯的新增内容，遵循该集成现有的风格，并保持其质量量表级别。
- 向后不兼容的变更已为用户做了说明。某项变更是否会对用户造成破坏是一种人为判断，而 AI 审查者经常判断错误。
- 如果配置条目中存储的数据发生变化，配置流程的 `VERSION` 已提升，`async_migrate_entry` 迁移旧条目，并且测试覆盖了迁移。提升了版本却没有迁移代码同样是错误的。
- `async_unload_entry` 清理设置所创建的一切。
- 错误处理在设置失败时不会读取 `entry.runtime_data`：它可能尚未被设置。
- 新实体拥有完整的设备信息：制造商、型号、序列号和固件版本（在设备提供这些信息的情况下）。

### Bug 修复

- 有一个确认该 bug 的 issue。
- 修复是最小化的，并且修复的是原因，而不是症状。把所有东西都包在 `try` 和 `except` 里不是修复。
- 最好有一个在没有该修复时会失败的测试。
- 没有不相关的变更，比如快照更新或重构测试。

### 依赖项更新

这些很少收到很多评论，但它们带着最大的安全风险。

- 只有 `manifest.json` 中的版本、重新生成的依赖文件，以及新版本所需的代码变更。检查 `quality_scale` 和 `loggers` 没有从清单中消失。
- 描述链接到更新日志或 diff。阅读上游 diff：留意新的网络调用、`subprocess` 或 `os.system`、新的文件访问，以及对环境变量的访问。
- 新的传递依赖被明确指出。它们是供应链攻击最常见的入口。
- 许可证没有变化，PyPI 维护者没有变化，源代码仓库没有迁移或被归档。

### 代码质量

- 代码变得更好，而不仅仅是不同，并且行为没有变化。
- 测试的变更与代码的变更相匹配，且不超出范围。

## 3. 测试

- 测试位于 `tests/components/<domain>/`，使用类型注解，并通过 Home Assistant 的公共接口。参见[编写测试](https://www.hasscn.top/contributors/core/development/tests/)。
- 它们模拟（mock）的是库，而不是 Home Assistant，共享的夹具放在 `conftest.py` 中。
- 平台使用 `snapshot_platform`。时间使用 `freezer` 夹具。不 patch `sys.modules`。
- 配置流程测试覆盖每一步和每一种错误，并在出错后继续直到条目被创建。尽早阅读它们：它们常常能揭示其余代码中的问题。
- 错误情况有测试：设备离线、错误的响应、过期的凭据。

## 4. 实体

实体问题占据审查者大部分的注意力。

**实体类别（entity category）。** 问问用户用这个实体做什么：

- 用于仪表盘的内容，设备的主要功能：无类别。
- 改变设备行为的设置，比如模式或阈值：`EntityCategory.CONFIG`。
- 用于调试的信息，比如固件版本、信号强度或 IP 地址，以及带有 `identify` 设备类别的按钮：`EntityCategory.DIAGNOSTIC`。如果它只对调试有用，还应通过 `entity_registry_enabled_default=False` 默认禁用。

不要过度分类。带有类别的实体会从默认仪表盘和语音助手中隐藏。

**未知（unknown）与不可用（unavailable）。** 对用户来说这是两回事：

- `native_value` 返回 `None`：设备可达，但当前值未知。
- `available` 为 `False`：设备或服务无法访问。

注意对可能为 `None` 的值使用 `bool(value)` 或 `int(value)`。`bool(None)` 会把缺失的值变成"关闭"，而 `bool("0")` 是 `True`。要显式转换，比如 `value == "1"`。

**更多要检查的：**

- 唯一 ID 是稳定的：用 `format_mac()` 规范化的 MAC 地址、序列号，或来自设备的 ID。绝不要用 IP 地址或主机名。
- 新实体使用实体描述（entity description）。
- 新数据是单独的实体，而不是额外的状态属性，除非它只与主实体一起才有意义。
- 在合适的地方设置设备类别（device class）和状态类别（state class），不合适的地方则省略。
- 基于协调器（coordinator）的平台设置 `PARALLEL_UPDATES = 0`。
- 发出命令后，实体要么等待设备确认新状态，要么乐观地更新状态，且选择适合该设备。参见[发出命令之后](https://www.hasscn.top/contributors/core/entities/state-updates/#after-a-command)。

## 5. 代码

- **协调器**：轮询通过 `DataUpdateCoordinator` 进行，类型标注如 `DataUpdateCoordinator[ExampleData]`，间隔合理。一次性工作，比如登录，放在 `_async_setup` 中。`_async_update_data` 只获取数据。
- **认证错误**抛出 `ConfigEntryAuthFailed`，它会启动重新认证，而不是 `UpdateFailed`，后者只会永远重试。重新认证只有在配置流程有 `async_step_reauth` 时才有效。
- **动作**失败时抛出 `HomeAssistantError`，让用户看到错误。它们不吞掉异常，也不重复记录错误。
- **异常**是具体的，`try` 块很小。不用 `except Exception:`。
- **`assert`** 只在测试中使用，以及在 `TYPE_CHECKING` 块内。
- **清理**：监听器、定时器和连接在卸载时关闭，连接在 Home Assistant 停止时关闭。
- **风格**：常量放在 `const.py`，提前返回，在键有保证时直接访问字典，不做动作 schema 已经做过的检查，没有注释掉的代码。参见[代码风格](https://www.hasscn.top/contributors/core/development/style/)。

## 6. Git 卫生

- 拉取请求打开后，已推送的提交不再被修改（amend）、压缩（squash）或变基（rebase）。从 `dev` 合并是可以的。参见[保持分支最新](https://www.hasscn.top/contributors/core/development/catching-up/)。
- 如果拉取请求突然包含来自 `dev` 的不相关提交，说明历史被破坏了。请作者提供一个干净的分支和全新的拉取请求。

## 一个好的顺序

1. 准入检查。如果缺少 CLA、CI 失败或信号不佳，就停止。
2. 范围：它只做一件事吗？
3. 清单和质量量表。
4. 配置流程测试。
5. 实体。
6. 其他测试。
7. 代码。
8. `strings.json`。
9. 批准、请求变更，或评论。

## 给出反馈

要具体：说明需要改什么，以及为什么。尽可能链接到文档。如果一个拉取请求需要大幅返工，请明确说出来，而不是留下五十条加起来意思是"推倒重来"的评论。

要友善。对面的人往往是志愿者，也许这是他们的第一个拉取请求。解释、提问，并说声谢谢。
