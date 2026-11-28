# 集成页面结构

> 集成页面的各个章节的顺序，以及用于填充它们的区块和可复用文本。

Source: https://www.hasscn.top/contributors/writing/reference/integration-page/

每个集成页面都遵循相同的结构。熟悉一个页面的读者可以在所有页面中找到方向，审阅者也能一眼看出缺少了什么。

你不必从零开始。复制[集成页面模板](https://github.com/home-assistant/home-assistant.io/blob/current/source/_integrations/_integration_docs_template.markdown)，其中包含每个章节及示例内容。围绕它的步骤，比如使用哪个分支以及品牌拉取请求，见[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)。页面顶部的键见[集成 front matter](https://www.hasscn.top/contributors/writing/reference/front-matter/)。

## 章节

按以下顺序使用这些章节。省略不适用于你的集成的章节。

1. **简介**，不带标题。集成做什么、连接哪个品牌或服务，以及一个用例：人们可以用它做什么。链接到制造商或服务的网站。如果该集成是其他集成使用的构建模块，请添加[可复用文本](https://www.hasscn.top/contributors/writing/reference/integration-page/#reusable-text)中的构建模块文本。
2. **支持的设备**：已知可以工作的设备和型号。当市面上有多个版本时，提及你测试过的版本，包括固件。
3. **不支持的设备**：已知无法工作的设备，免得有人费力去发现。
4. **前提条件**：设置之前读者需要的一切，以编号步骤呈现。比如安装制造商的应用、创建账户，或获取 API 密钥或访问令牌。逐步说明如何获取凭据。
5. **配置**：如何添加集成。对于从 UI 设置的集成，使用标准配置文本，后跟一个解释设置表单每个字段的 [`configuration_basic` 区块](https://www.hasscn.top/contributors/writing/reference/integration-page/#the-configuration_basic-block)。对于仅支持 YAML 的集成，展示 `configuration.yaml` 的示例，后跟一个 [`configuration` 区块](https://www.hasscn.top/contributors/writing/reference/integration-page/#the-configuration-block)。
6. **配置选项**：设置后读者可以更改的选项，放在 `configuration_basic` 区块中。
7. **支持的功能**：集成提供的实体（entity），按平台分组，每个平台一个标题，比如 **Sensors** 或 **Buttons**。对于每个实体，给出简短描述，并在有帮助时说明哪些设备具有它以及任何备注。
8. **触发器列表**、**条件列表**和**动作列表**：从单独的文件生成。见[触发器、条件和动作](https://www.hasscn.top/contributors/writing/reference/integration-page/#triggers-conditions-and-actions)。
9. **示例**：展示集成用途的自动化示例。见[示例](https://www.hasscn.top/contributors/writing/reference/integration-page/#examples)。
10. **数据更新**：集成如何获取数据。是否轮询，频率如何？设备是否推送更新？
11. **已知限制**：集成无法做到的事情，以及与读者预期不同的工作方式。
12. **故障排除**：常见问题，包括症状、原因和解决方法。
13. **社区笔记**：可选。社区分享的技巧和经验，比如某个特定设备的表现。
14. **移除集成**：如何移除它。以标准移除文本开头，并添加读者需要做的任何额外操作，比如从制造商的应用中移除 Home Assistant。

适用于整个页面的几条规则：

- 步骤和示例应使用 Home Assistant 自带的功能。不要依赖自定义集成或自定义卡片。
- 提到其他集成时，链接到其页面。
- 先描述 UI 方式。YAML 放在后面，如果有的话。
- 在将拉取请求标记为准备好审阅之前，删除模板中的注释。

### 支持的功能

以嵌套列表的形式列出每个实体及其详细信息：

```markdown
### Sensors

- **Boiler temperature**
  - **Description**: Current temperature of the boiler.
  - **Available for machines**: all
  - **Remarks**: About 3 degrees higher than the target temperature,
    because it is measured in a different place.
```

对于选择（select）实体，添加一个列出选项的 **Options** 条目。

### 示例

每个示例以一个简短的标题和一句说明它解决什么问题的话开头。然后按照读者在 UI 中构建的方式描述自动化，并将 YAML 版本放在可折叠部分中：

```liquid
### Automation: Turn off the status LEDs at night

The status LEDs are bright. Turn them off when the sun goes down.

- **Trigger**: Sun: after sunset
- **Action**: Turn off light

{% details "YAML example for turning off the LEDs at night" %}

{% example %}
automation: |
  alias: "Turn off the LEDs at night"
  triggers:
    - trigger: sun
      event: sunset
  actions:
    - action: light.turn_off
      target:
        entity_id: light.device_leds
{% endexample %}

{% enddetails %}
```

在示例部分顶部添加一次关于将 YAML 粘贴到可视化编辑器中的提示：

```liquid
{% include docs/paste_yaml_tip.md %}
```

`example` 区块接受一种输入：`automation`、`script`、`trigger`、`condition`、`action` 或 `template`。在其中按照 [YAML 风格](https://www.hasscn.top/contributors/writing/reference/yaml/)编写 YAML。

蓝图（blueprint）放在仓库的 [`source/blueprints/integrations/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/blueprints/integrations) 文件夹中，大多数放在以集成域名命名的文件夹中，或者放在社区论坛的[蓝图交流区](https://community.home-assistant.io/c/blueprints-exchange)。使用 `blueprint_example` 标签在页面上展示它们。对于仓库中的蓝图，给出它在那个文件夹内的路径：

```liquid
{% blueprint_example blueprint="example/example_notification.yaml" %}
```

该标签会渲染一个导入蓝图的按钮。对于仓库中的蓝图，它还会以 YAML 形式渲染相同的自动化、脚本或模板实体，供喜欢手动设置的读者使用。因此蓝图文件是示例的唯一副本：不要在页面上重复它的 YAML。蓝图可以是 `automation`、`script` 或 `template` 蓝图。

对于托管在其他地方的蓝图，给出其 URL。此时标签只渲染导入按钮：

```liquid
{% blueprint_example blueprint="https://community.home-assistant.io/t/example/123" %}
```

### 故障排除

为每个问题提供单独的可折叠部分，以症状作为标题，后跟描述和解决方法：

```liquid
{% details "Can't set up the device" %}

### Symptom: "This device can't be reached"

When you try to set up the integration, the form shows the message
"This device can't be reached".

#### Description

The device does not allow local connections yet.

#### Resolution

1. Make sure the device is powered on.
2. In the app of the manufacturer, turn on local access.

{% enddetails %}
```

## 触发器、条件和动作

集成的每个触发器、条件和动作都有自己的文件，以及网站上的独立页面。集成页面通过一个 include 列出它们，该 include 从这些文件构建列表：

```liquid
{% include integrations/triggers.md %}

{% include integrations/conditions.md %}

{% include integrations/actions.md %}
```

每个 include 会添加自己的二级标题。如果集成还没有该类型的已记录条目，include 会说明这一点，并链接到所有条目的概览。如果集成三者都有，你可以改用一个 include：

```liquid
{% include integrations/triggers_conditions_actions.md %}
```

### 文件放在哪里

以集成的域名和条目名称命名每个文件，使用 `.markdown` 扩展名：

- 触发器放在 [`source/_triggers/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_triggers) 中，比如 `light.brightness_changed.markdown`。
- 条件放在 [`source/_conditions/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_conditions) 中，比如 `light.is_on.markdown`。
- 动作放在 [`source/_actions/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_actions) 中，比如 `light.turn_on.markdown`。

### Front matter

- `title`：名称，与 UI 中显示的一致，比如 `Light brightness changed`。
- `trigger`、`condition` 或 `action`：条目的完整名称，比如 `light.brightness_changed`。使用与文件类型匹配的键。
- `domain`：集成的域名，比如 `light`。集成页面用它来查找属于它的文件。
- `description`：一句关于该条目功能的话。
- `related_triggers`、`related_conditions` 或 `related_actions`：可选。同类相关条目的列表，会从页面链接过去。
- `since`：仅用于动作，可选。引入该动作的 Home Assistant 版本，以带引号的字符串表示。

### 页面布局

触发器文件如下所示。条件和动作遵循相同的布局，只是使用它们自己的 include：`conditions/...` 和 `actions/...` 而不是 `triggers/...`。

```liquid
---
title: "Light brightness changed"
trigger: light.brightness_changed
domain: light
description: "Triggers when the brightness of one or more lights changes."
related_triggers:
  - light.brightness_crossed_threshold
---

The **Light brightness changed** trigger fires after... Use it to...

{% include triggers/ui_header.md %}

To use this trigger in an automation:

1. Go to {% my automations title="**Settings** > **Automations & scenes**" %}.
2. Open an existing automation, or select **Create automation** >
   **Create new automation**.
3. In the **When** section, select **Add trigger**.
4. Search for and select **Light brightness changed**.
5. Under **Targets**, select what you want to watch.
6. Select **Save**.

### Options in the UI

{% options_ui %}
Threshold type:
  description: How much the brightness has to change before it fires.
{% endoptions_ui %}

{% include triggers/yaml_header.md %}

In YAML, refer to this trigger as `light.brightness_changed`:

{% example %}
trigger: |
  trigger: light.brightness_changed
  target:
    entity_id: light.living_room
  options:
    threshold: 10
{% endexample %}

### Options in YAML

{% options_yaml %}
threshold:
  description: The minimum change in brightness, in percent.
  required: false
  type: any
{% endoptions_yaml %}

{% include triggers/targets.md %}

{% include triggers/behavior.md %}

## Good to know

- Anything else the reader should know.

{% include triggers/try_it.md %}

{% include triggers/more_examples.md %}

### Automation: A real use case

{% include triggers/stuck.md %}

{% include triggers/related.md %}
```

各类型之间的差异：

- **条件**在 **And if** 部分中添加，使用 **Add condition**。
- **动作**在 **Then do** 部分中添加，使用 **Add action**。脚本也使用动作，并且不需要触发器。
- 如果条目支持目标（target），保留 `targets.md` include。如果它支持带行为选项的多个目标，保留 `behavior.md`。动作没有 `behavior.md`。
- 在 **More examples** 下，按照[示例](https://www.hasscn.top/contributors/writing/reference/integration-page/#examples)的格式添加一个或多个示例。

### 按照 UI 的方式命名条目

在 UI 步骤或示例中提到触发器、条件或动作时，使用 UI 显示的名称。

对于不与品牌、产品或服务绑定的通用集成，比如 `fan`、`vacuum`、`media_player` 或 `climate`，不要在名称前加上集成名：

- 好：`**Action**: Turn on fan`
- 差：`**Action**: Fan: Turn on fan`

对于与品牌、产品或服务绑定的集成，把集成名称放在前面。这有助于读者将它们与同名的通用条目区分开：

- 好：`**Action**: Jellyfin: Play media`

### options_ui 区块

`options_ui` 区块按照 UI 显示的方式列出触发器、条件或动作的选项。使用 UI 中的标签作为键。

- 每个选项都需要一个 `description`。没有它构建会失败。
- `required` 是可选的，接受 `true` 或 `false`。设置后，该选项会显示 **Required** 或 **Optional** 标签。
- 没有 `type`。UI 会为读者处理这一点。

### options_yaml 区块

`options_yaml` 区块以 YAML 键的形式列出选项。它遵循与 [`configuration` 区块](https://www.hasscn.top/contributors/writing/reference/integration-page/#the-configuration-block)相同的规则：

- 每个选项都需要一个 `description` 和一个 `type`。
- 将 `required` 设置为 `true` 或 `false`。有默认值的选项不是必需的。
- 如果有 `default`，请记录它。
- 如果接受多种类型，列出它们，比如 `type: [string, integer]`。

## 可复用文本

有些文本在许多集成页面上是相同的。与其重新编写，不如从 [`source/_includes/integrations/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_includes/integrations) 中包含它。[Liquid 辅助工具](https://www.hasscn.top/contributors/writing/reference/liquid/)页面解释了 include 和其他标签。

### 配置

标准配置文本会添加 **Configuration** 标题、一个启动设置的 My 按钮，以及按钮不起作用时的手动步骤：

```liquid
{% include integrations/config_flow.md %}
```

文本会根据页面进行调整：

- 如果在 [front matter](https://www.hasscn.top/contributors/writing/reference/front-matter/#discovery) 中设置了某个发现键，它会告诉读者 Home Assistant 可以自行发现设备。
- 对于辅助元素（helper），步骤会通过 **Helpers** 标签页进行。
- 添加 `name="..."` 以使用与页面标题不同的名称，或添加 `domain="..."` 以启动另一个域名的设置。

对于集成的选项，对应的文本会添加一个 **Options** 标题，并说明如何打开它们：

```liquid
{% include integrations/option_flow.md %}
```

### 其他片段

- `integrations/building_block_integration.md`：一条说明，解释该集成是一个构建模块，被其他集成使用，读者无法自行添加。
- `integrations/remove_device_service.md`：移除集成实例的标准步骤。
- `integrations/serial_connected.md`：说明设备需要串口连接，直接连接或通过串口代理。
- `integrations/infrared_controlled.md` 和 `integrations/radio_frequency_controlled.md`：说明该集成需要一个已经设置好的红外或射频适配器。
- `integrations/restart_ha_after_config_inclusion.md`：对于 YAML 集成，告诉读者在更改 `configuration.yaml` 后重启 Home Assistant。

在 [`source/_includes/integrations/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_includes/integrations) 中查看每个片段的当前文本。

## configuration_basic 区块

使用 `configuration_basic` 区块来解释设置表单的字段，或从 UI 设置的集成的选项。使用 UI 中的标签作为键：

```liquid
{% configuration_basic %}
Host:
  description: "The IP address or hostname of your bridge. For example,
    `192.168.1.100`. You can find it in the app, under **Bridge settings**
    > **Local API**."
Local access token:
  description: "The local access token of your bridge. You can find it in
    the app, under **Bridge settings** > **Local API**."
{% endconfiguration_basic %}
```

每个字段只接受一个 `description`，这是必需的。没有 `required` 或 `type`。UI 已经把这些说清楚了。

## configuration 区块

使用 `configuration` 区块来记录在 YAML 中设置的集成的变量。它紧跟在 `configuration.yaml` 的示例之后：

```liquid
{% configuration %}
api_key:
  description: The API key of your account.
  required: true
  type: string
name:
  description: The name of the sensor in Home Assistant.
  required: false
  type: string
  default: Awesome sensor
monitored_conditions:
  description: The conditions to create sensors for.
  required: true
  type: list
  keys:
    temperature:
      description: The current temperature.
    humidity:
      description: The current humidity.
{% endconfiguration %}
```

每个变量的键：

- `description`：变量的作用。必需。这里可以使用 Markdown。
- `required`：必需。`true` 将变量显示为 **Required**，`false` 显示为 **Optional**。有默认值的变量永远不是必需的，所以将其设置为 `false`。对于必须一起使用或不能组合使用的变量，你也可以使用 `inclusive` 或 `exclusive`。
- `type`：变量接受的值的类型。必需，嵌套在 `list` 或 `template` 下的变量除外。使用下面类型之一。如果接受多种类型，列出它们：`type: [string, integer]`。
- `default`：默认值，如果有的话。对于 `boolean` 类型的可选变量是必需的。
- `keys`：`map` 或 `list` 类型变量的嵌套变量。嵌套变量使用相同的键。参见[模板集成](https://www.home-assistant.io/integrations/template/)页面以获取详细示例。

接受的类型：

- `action`
- `any`
- `boolean`
- `date`
- `datetime`
- `device_class`
- `float`
- `icon`
- `integer`
- `list`
- `map`
- `selector`
- `string`
- `template`
- `time`
- `timedelta`

构建过程会检查这些规则。缺少描述、未知类型、`required` 值不是上述四种之一，或者可选的 boolean 没有默认值，都会导致网站构建失败，并报出指出该变量的错误。

## 图片、图标和标志

### 图标和标志

集成的图标和标志来自[品牌仓库](https://github.com/home-assistant/brands)。你不需要在文档中为它们添加任何内容。页面会根据集成的域名自动获取它们。

- 在品牌仓库中打开一个拉取请求，将图片添加到 `core_integrations/<domain>/`。在核心拉取请求中将其列在 **This PR belongs together with** 下，并在品牌拉取请求的同一行列出核心拉取请求。
- 至少添加一个 `icon.png`。欢迎提供 `logo.png`、深色背景版本以及高分辨率 `@2x` 版本。[品牌 README](https://github.com/home-assistant/brands/blob/master/README.md) 列出了确切尺寸和要求。
- 如果该集成最初是自定义集成，现在已成为 Home Assistant 的一部分，请将其图片从 `custom_integrations` 移动到 `core_integrations`。

### 其他图片

将截图和其他图片存储在文档仓库中，放在你的集成的文件夹里：

- 集成页面的图片放在 `source/images/integrations/<domain>/` 中。
- 博客文章的图片放在 [`source/images/blog/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/images/blog) 中。

[图片和视频](https://www.hasscn.top/contributors/writing/reference/images/)介绍了如何拍摄好的截图以及编写替代文本。
