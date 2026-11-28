# 集成质量等级

> 描述集成好坏程度的等级与规则：集成如何获得某个等级，以及如何提升等级。

Source: https://www.hasscn.top/contributors/core/quality-scale/

Home Assistant 拥有由数千人编写的数千个集成（integration）。集成质量等级（quality scale）是本项目用一个词描述每个集成好坏程度的方式：铜牌（Bronze）、银牌（Silver）、金牌（Gold）或铂金（Platinum）。每个等级（tier）都是一组具体的规则，集成只有遵循该等级及其以下所有等级的每一条规则，才能获得该等级。

> [!TIP]
> 正在开发集成？请从[所有规则](https://www.hasscn.top/contributors/core/quality-scale/rules/)开始：每个等级的所有规则都在一页上，每条规则用一行文字说明其要求，并附有可复制到拉取请求（pull request）中的清单。

## 为什么要有质量等级

对用户来说，等级是一种承诺。他们会在文档中的集成页面以及 **设置** > **设备与服务** 中看到它。铜牌集成可通过 UI 设置，并且有测试。金牌集成可通过网络发现、可重新配置，拥有经过翻译的名称和错误信息，并附带说明哪些设备可正常使用的文档。用户会据此选择设备，因此等级必须真实可信。

对于作为贡献者的你来说，这套等级标准是“完成”的统一定义。这里有的是成文的规则及其背后的理由，而不是审查者的个人偏好。在打开拉取请求之前，你就知道别人期望什么；当你想改进某个集成时，也知道接下来该做什么。

对于维护者和审查者来说，它让数千个集成保持一致。声称满足某条规则的集成会被对照该规则进行检查（部分由工具完成），这样当代码库向前发展时，这些声明才是可信的。

## 工作原理

- 集成的等级是其 `manifest.json` 中的 `quality_scale` 键。许多较旧的集成从未被评级，因此还没有等级。新集成则必须有一个等级。
- 有等级的集成还会有一个 `quality_scale.yaml` 文件。它列出每条规则及其状态：`done`、`todo`，或附带原因的 `exempt`。
- Hassfest（core 的验证脚本）会检查该文件。当该等级所需的某条规则既不是 `done` 也不是 `exempt` 时，检查会失败；此外，它还会对某些标记为 `done` 的规则运行额外检查。
- 审查者检查其余部分，然后由核心团队成员批准新等级。

新集成必须达到铜牌。低于铜牌的集成无法进入 core。

## 从这里开始

1. [等级](https://www.hasscn.top/contributors/core/quality-scale/tiers/)：铜牌、银牌、金牌和铂金的含义，以及等级标准之外的等级，例如 internal（内部）和 legacy（遗留）。
2. [所有规则](https://www.hasscn.top/contributors/core/quality-scale/rules/)：按等级将所有规则列在一页上，并附有可复制到拉取请求中的清单。在这里你可以找到该做什么。
3. [提升集成的等级](https://www.hasscn.top/contributors/core/quality-scale/raise-tier/)：如何逐步提升等级、如何检查你的工作，以及如何让新等级接受审查。
4. [质量等级文件](https://www.hasscn.top/contributors/core/quality-scale/quality-scale-file/)：`quality_scale.yaml` 的格式，以及检查该文件的所有机制。

正在构建新集成？它需要满足每一条[铜牌规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#bronze)。[教程](https://www.hasscn.top/contributors/core/integrations/tutorial/)构建的集成就满足这些规则。

## 规则

每条规则都有自己的页面。[所有规则](https://www.hasscn.top/contributors/core/quality-scale/rules/)按等级列出它们，并附上各自的链接。每个页面都会解释该规则要求什么、为什么、如何实现、如何检查，以及何时不适用。规则页面使用与 `quality_scale.yaml` 中相同的名称，因此 `/core/quality-scale/entity-unique-id/` 就是 `entity-unique-id` 规则的页面。

### 铜牌（Bronze）

基础要求：可通过 UI 设置、经过测试的配置流程（config flow）、唯一 ID 以及基本文档。从 [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/) 开始，或查看[全部 20 条铜牌规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#bronze)。

### 银牌（Silver）

可靠性：处理错误和离线设备、支持重新认证、拥有集成负责人（integration owner），以及超过 95% 的测试覆盖率。从 [integration-owner](https://www.hasscn.top/contributors/core/quality-scale/integration-owner/) 开始，或查看[全部 10 条银牌规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#silver)。

### 金牌（Gold）

最佳用户体验：发现（discovery）、设备、翻译、诊断、修复，以及面向用户的完整文档。从 [devices](https://www.hasscn.top/contributors/core/quality-scale/devices/) 开始，或查看[全部 21 条金牌规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#gold)。

### 铂金（Platinum）

技术卓越：异步依赖、共享的 Web 会话以及严格类型检查（strict typing）。从 [strict-typing](https://www.hasscn.top/contributors/core/quality-scale/strict-typing/) 开始，或查看[全部 3 条铂金规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#platinum)。


## 相关页面

- [构建集成](https://www.hasscn.top/contributors/core/integrations/)：集成如何工作，以及它们由哪些文件组成。
- [编写测试](https://www.hasscn.top/contributors/core/development/tests/)：多条规则所要求的测试。
- [编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)：文档类规则针对的是 [home-assistant.io](https://www.home-assistant.io/) 上的集成页面。
- [让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)：对应翻译相关的规则。

## 与谁交流

- 在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 [**#coding-support**](https://discord.com/channels/330944238910963714/1257019582112334014) 频道中发起讨论，询问关于某条规则的问题，或某个豁免是否合理。
- 集成的负责人（在 `manifest.json` 中列为 `codeowners`）最了解其现状。在你的拉取请求中提及他们。
- 关于修改规则或添加新规则的想法，请提交到 [架构讨论](https://github.com/home-assistant/architecture/discussions)。

## All pages in this section

### Bronze

- [在 async_setup 中注册动作](https://www.hasscn.top/contributors/core/quality-scale/action-setup/): 铜牌规则 action-setup：动作在集成加载时注册，而不是针对每个配置条目注册。
- [以适当的间隔轮询](https://www.hasscn.top/contributors/core/quality-scale/appropriate-polling/): 铜牌规则 appropriate-polling：轮询型集成使用与其数据相匹配的间隔。
- [提供品牌资产](https://www.hasscn.top/contributors/core/quality-scale/brands/): 铜牌规则 brands：该集成在 brands 仓库中拥有 logo 和图标。
- [将通用模式放在通用模块中](https://www.hasscn.top/contributors/core/quality-scale/common-modules/): 铜牌规则 common-modules：协调器（coordinator）位于 coordinator.py 中，基础实体（entity）位于 entity.py 中。
- [使用配置流程从 UI 进行设置](https://www.hasscn.top/contributors/core/quality-scale/config-flow/): 铜级（Bronze）规则 config-flow：集成通过用户界面（UI）进行设置，并带有清晰的配置流程（config flow），将其数据存储在正确的位置。
- [全面测试配置流程](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/): 青铜规则 config-flow-test-coverage：配置流程具有完整的测试覆盖率，包括从错误中恢复。
- [使用透明的依赖项](https://www.hasscn.top/contributors/core/quality-scale/dependency-transparency/): 铜级（Bronze）规则 dependency-transparency：依赖项必须是开源的、发布在 PyPI 上，并通过公开的 CI 构建和发布。
- [为动作编写文档](https://www.hasscn.top/contributors/core/quality-scale/docs-actions/): 铜牌规则 docs-actions：文档描述集成的动作。
- [记录条件](https://www.hasscn.top/contributors/core/quality-scale/docs-conditions/): 青铜规则 docs-conditions：文档描述集成的条件。
- [描述品牌、产品或服务](https://www.hasscn.top/contributors/core/quality-scale/docs-high-level-description/): 青铜规则 docs-high-level-description：文档描述该集成所连接的对象。
- [记录安装步骤](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-instructions/): 青铜规则 docs-installation-instructions：文档包含分步设置说明，并列出前提条件。
- [记录如何移除集成](https://www.hasscn.top/contributors/core/quality-scale/docs-removal-instructions/): 铜牌（Bronze）规则 docs-removal-instructions：文档需说明如何移除集成。
- [记录触发器](https://www.hasscn.top/contributors/core/quality-scale/docs-triggers/): 青铜规则 docs-triggers：文档描述集成的触发器。
- [在实体生命周期中订阅事件](https://www.hasscn.top/contributors/core/quality-scale/entity-event-setup/): 铜级规则 entity-event-setup：实体在 async_added_to_hass 中订阅，并在移除时取消订阅。
- [为实体提供唯一 ID](https://www.hasscn.top/contributors/core/quality-scale/entity-unique-id/): 青铜规则 entity-unique-id：每个实体都有一个唯一 ID，以便用户可以对其进行自定义。
- [使用 has_entity_name](https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/): 铜牌规则 has-entity-name：实体将 has_entity_name 设置为 True，并以所属设备为上下文进行命名。
- [在 runtime_data 中存储运行时数据](https://www.hasscn.top/contributors/core/quality-scale/runtime-data/): Bronze 规则 runtime-data：运行时数据存储在 ConfigEntry.runtime_data 中，并使用带类型的配置条目。
- [在配置流程中测试连接](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/): 青铜规则 test-before-configure：配置流程在创建条目之前测试连接。
- [在设置期间检查连接](https://www.hasscn.top/contributors/core/quality-scale/test-before-setup/): 青铜规则 test-before-setup：设置时会检查其能否正常工作，如果不能，则抛出正确的异常。
- [防止重复的配置条目](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/): 铜级规则 unique-config-entry：同一设备或服务不能被设置两次。

### Silver

- [操作失败时抛出异常](https://www.hasscn.top/contributors/core/quality-scale/action-exceptions/): Silver 级规则 action-exceptions：操作失败时抛出 ServiceValidationError 或 HomeAssistantError。
- [支持卸载配置项（config entry）](https://www.hasscn.top/contributors/core/quality-scale/config-entry-unloading/): 银级规则 config-entry-unloading：集成（integration）可以在不重启的情况下被卸载并重新加载。
- [记录选项](https://www.hasscn.top/contributors/core/quality-scale/docs-configuration-parameters/): 白银级规则 docs-configuration-parameters：文档描述了选项流（options flow）的每一个选项。
- [记录设置参数](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-parameters/): 白银级规则 docs-installation-parameters：文档描述设置过程中要求填写的每个字段。
- [在适当的时候将实体标记为不可用](https://www.hasscn.top/contributors/core/quality-scale/entity-unavailable/): 银级规则 entity-unavailable：当设备或服务无法连接时，实体会变为不可用。
- [拥有集成负责人](https://www.hasscn.top/contributors/core/quality-scale/integration-owner/): 银级（Silver）规则 integration-owner：该集成至少拥有一位集成负责人。
- [不可用时记录一次日志，恢复时再记录一次](https://www.hasscn.top/contributors/core/quality-scale/log-when-unavailable/): 银级规则 log-when-unavailable：集成在连接丢失时记录一次日志，并在连接恢复时再记录一次。
- [设置并行更新的数量](https://www.hasscn.top/contributors/core/quality-scale/parallel-updates/): 白银规则 parallel-updates：每个实体平台都设置 PARALLEL_UPDATES。
- [从 UI 重新进行身份验证](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/): Silver 规则 reauthentication-flow：用户无需移除集成即可输入新的凭据。
- [测试覆盖超过 95% 的代码](https://www.hasscn.top/contributors/core/quality-scale/test-coverage/): Silver 级规则 test-coverage：测试覆盖集成每个模块中超过 95% 的代码。

### Gold

- [创建设备](https://www.hasscn.top/contributors/core/quality-scale/devices/): 黄金规则 devices：实体归入设备，并填写完整的设备信息。
- [实现诊断](https://www.hasscn.top/contributors/core/quality-scale/diagnostics/): Gold 规则 diagnostics：用户可以下载诊断信息，其中敏感数据已被脱敏。
- [支持发现](https://www.hasscn.top/contributors/core/quality-scale/discovery/): 黄金规则 discovery：设备会被自动发现，因此用户无需自行查找。
- [通过发现更新网络信息](https://www.hasscn.top/contributors/core/quality-scale/discovery-update-info/): Gold 级规则 discovery-update-info：发现（discovery）会在地址变化时更新已知设备的地址。
- [记录数据更新方式](https://www.hasscn.top/contributors/core/quality-scale/docs-data-update/): Gold 规则 docs-data-update：文档说明数据如何更新以及更新的频率。
- [记录自动化示例](https://www.hasscn.top/contributors/core/quality-scale/docs-examples/): Gold 规则 docs-examples：文档提供自动化示例或蓝图。
- [记录已知限制](https://www.hasscn.top/contributors/core/quality-scale/docs-known-limitations/): 黄金规则 docs-known-limitations：文档中列出已知限制。
- [记录支持的设备](https://www.hasscn.top/contributors/core/quality-scale/docs-supported-devices/): Gold（金牌）规则 docs-supported-devices：文档中列出已知支持和不支持的设备。
- [记录支持的功能](https://www.hasscn.top/contributors/core/quality-scale/docs-supported-functions/): Gold 规则 docs-supported-functions：文档描述了集成（integration）提供的实体（entity）和功能。
- [故障排查文档](https://www.hasscn.top/contributors/core/quality-scale/docs-troubleshooting/): 金牌规则 docs-troubleshooting：文档帮助用户自行解决常见问题。
- [记录用例](https://www.hasscn.top/contributors/core/quality-scale/docs-use-cases/): 金牌规则 docs-use-cases：文档展示了你可以用集成（integration）做什么。
- [自动添加新设备](https://www.hasscn.top/contributors/core/quality-scale/dynamic-devices/): Gold 规则 dynamic-devices：设置后出现的设备无需重新加载即可自动添加。
- [分配实体类别](https://www.hasscn.top/contributors/core/quality-scale/entity-category/): 金牌（Gold）规则 entity-category：配置类和诊断类实体会拥有实体类别。
- [使用设备类](https://www.hasscn.top/contributors/core/quality-scale/entity-device-class/): 黄金级规则 entity-device-class：实体（entity）在适用的地方都会使用设备类（device class）。
- [禁用噪声大或不太常用的实体](https://www.hasscn.top/contributors/core/quality-scale/entity-disabled-by-default/): 金牌规则 entity-disabled-by-default：只有少数用户需要的实体默认禁用。
- [翻译实体名称](https://www.hasscn.top/contributors/core/quality-scale/entity-translations/): 黄金规则 entity-translations：实体名称来自 strings.json，因此可以被翻译。
- [翻译异常消息](https://www.hasscn.top/contributors/core/quality-scale/exception-translations/): 黄金级规则 exception-translations：向用户显示的错误来自 strings.json，因此可以被翻译。
- [使用图标翻译](https://www.hasscn.top/contributors/core/quality-scale/icon-translations/): 金牌规则 icon-translations：实体图标在 icons.json 中定义。
- [从 UI 重新配置](https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/): Gold 规则 reconfiguration-flow：用户无需删除配置项即可更改其设置。
- [当用户需要采取行动时提出修复问题](https://www.hasscn.top/contributors/core/quality-scale/repair-issues/): 黄金规则 repair-issues：集成会针对用户可以修复的问题提出修复问题。
- [移除失效设备](https://www.hasscn.top/contributors/core/quality-scale/stale-devices/): Gold 规则 stale-devices：已消失的设备会被移除，或者可以由用户自行移除。

### Platinum

- [使用异步依赖](https://www.hasscn.top/contributors/core/quality-scale/async-dependency/): 白金规则 async-dependency：集成所使用的库基于 asyncio。
- [传入 Web 会话](https://www.hasscn.top/contributors/core/quality-scale/inject-websession/): 铂金规则 inject-websession：库接受 Home Assistant 的 Web 会话。
- [使用严格类型检查](https://www.hasscn.top/contributors/core/quality-scale/strict-typing/): 白金级规则 strict-typing：集成（integration）已完全类型化，并使用严格的 mypy 设置进行检查。
