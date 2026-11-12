---
title: Liquid 辅助工具
description: home-assistant.io 在 Markdown 之上添加的所有 Liquid 标签，从 My 链接和术语表提示框到文本框和可复用片段。
order: 3
---

[home-assistant.io](https://www.home-assistant.io/) 使用 Jekyll 构建，并采用 [Liquid](https://shopify.github.io/liquid/) 进行模板渲染。在纯 Markdown 的基础上，网站添加了一组 Liquid 标签，用于实现 Markdown 无法完成的功能：指向读者自己 Home Assistant 的链接、术语表提示框、图标、文本框等等。

请在能帮助读者的地方使用它们，而不是因为它们存在就用。包裹内容的标签（如文本框）都有一个以 `end` 开头的对应闭合标签：

```liquid
{% tip %}
This text is inside the tag.
{% endtip %}
```

## My 链接

My 链接会在读者自己的 Home Assistant 安装中打开一个页面。每当你需要把读者引导到界面中的某个位置时，都可以使用它，这样读者可以直接跳转过去，而不用在菜单中翻找：

```liquid
Go to {% my integrations title="**Settings** > **Devices & services**" %} and select your integration.
```

`my` 后面的第一个单词是页面的名称。`title` 是链接文本。请按照 UI 路径的格式书写，使用粗体并在各步骤之间用 `>` 分隔，与任何 [UI 路径](/writing/reference/style/#ui-elements-and-steps)的写法一致。

以下是你最常用到的 My 链接：

```liquid
- {% my areas title="**Settings** > **Areas, labels & zones**" %}
- {% my automations title="**Settings** > **Automations & scenes**" %}
- {% my backup title="**Settings** > **System** > **Backups**" %}
- {% my general title="**Settings** > **System** > **General**" %}
- {% my integrations title="**Settings** > **Devices & services**" %}
- {% my labs title="**Settings** > **System** > **Labs**" %}
- {% my logs title="**Settings** > **System** > **Logs**" %}
- {% my network title="**Settings** > **System** > **Network**" %}
- {% my profile title="**User profile**" %}
```

### 查找页面名称

在 Home Assistant 中打开该页面，然后按键盘上的 `m`。如果该页面有对应的 My 链接，Home Assistant 就会显示出来。名称是链接的最后一部分：例如 `https://my.home-assistant.io/redirect/logs/` 的名称就是 `logs`。

[My 链接生成器](https://my.home-assistant.io/create-link/)列出了所有 My 链接及其接受的参数。

### 其他选项

大多数 My 链接只需要一个 `title`。针对特殊情况，还有一些额外的选项：

- `badge` 将链接显示为 My 徽章图片，而不是文本。徽章不能有 `title`。
- `domain` 为需要集成的页面设置集成，例如 `config_flow_start`，它会开始设置特定的集成。
- `addon`、`blueprint_url`、`brand`、`repository_url` 和 `service` 传递页面应打开的应用程序、蓝图、品牌、仓库或操作。
- `search` 在带有搜索字段的页面（如 `logs`）上填充搜索字段。
- `provider`、`integration` 和 `raw` 选择 `logs` 页面显示的内容。`provider` 是要打开的日志，如 `supervisor` 或应用程序 slug。`integration` 将 Home Assistant Core 日志过滤为一个或多个集成，用逗号分隔。`raw` 显示完整的 Home Assistant Core 日志，而不仅仅是错误。

```liquid
{% my config_flow_start badge domain="hue" %}
{% my blueprint_import badge blueprint_url="https://example.com/blueprint.yaml" %}
{% my logs title="**Settings** > **System** > **Logs**"
   provider="supervisor" search="token" %}
```

没有 `title` 时，链接会回退到默认文本。该默认文本并不总是符合[风格指南](/writing/reference/style/)的要求，因此在正文中的链接请添加 `title`。

## 术语表提示框

Home Assistant 有自己的词汇体系：实体（entity）、设备（device）、集成（integration）、区域（area）等等。[术语表](https://www.home-assistant.io/docs/glossary/)对它们进行了解释。在页面上标记一个术语，读者就能在提示框中看到它的定义，通常还带有了解更多信息的链接：

```liquid
{% term <term> [<text>] %}
```

一些示例：

```liquid
{% term integration %}
{% term entity %}
{% term "configuration.yaml" %}
{% term "Home Assistant Operating System" %}
```

- **含有空格或点的术语需要加引号。** 单个单词可以不加引号。
- **别名也可以使用。** 每个术语表条目都可以列出别名，例如复数形式。所以 `automations` 和 `automation` 一样可用。匹配时忽略大小写。
- **术语必须存在。** 如果术语不在术语表中，构建就会失败，因此 Deploy Preview 会帮你发现拼写错误。

默认情况下，提示框将术语本身显示为文本。若要将提示框放在其他词语上，请在术语后面添加文本：

```liquid
I used an {% term automation "automation to turn on the lights" %} at sunset.
```

你不需要标记术语的每一次出现。在它首次出现在页面上时标记，或者在读者最可能感到困惑的地方标记即可。

### 向术语表添加术语

缺少某个术语，或者发现某个定义可以写得更清楚？请编辑 [`source/_data/glossary.yml`](https://github.com/home-assistant/home-assistant.io/blob/current/source/_data/glossary.yml)。条目按字母顺序排序，每个条目可以包含以下键：

- `term`：术语本身。必填。
- `definition`：完整的解释，显示在术语表页面上。必填。
- `excerpt`：用于提示框的较短版本。当定义较长时请添加。
- `link`：读者可以了解更多信息的页面。
- `aliases`：应当匹配的术语其他形式，例如复数形式。

```yaml
- term: Scene
  definition: >-
    Scenes capture the states you want certain entities to be. For example, a
    scene can specify that light A should be turned on and light B should be
    bright red.
  link: /integrations/scene/
  aliases:
    - scenes
```

[本站的术语表](/glossary/)是另一个术语表。它解释的是为 Home Assistant 做贡献时使用的术语。

## 行内图标

要指向界面中的某个图标时，请将其行内显示。这些图标来自 [Iconify 上的 Material Design Icons 图标集](https://icon-sets.iconify.design/mdi/)，与 Home Assistant 使用的图标集相同：

```liquid
Select the three dots {% icon "mdi:dots-vertical" %} menu.
```

图标会根据其名称获得一个提示框。若要自定义，请添加 `title`：

```liquid
{% icon "mdi:dots-vertical" title="Three dots menu" %}
```

你最常用到的图标：

```liquid
- Three dots menu: {% icon "mdi:dots-vertical" %}
- Hamburger menu: {% icon "mdi:menu" %}
- Edit: {% icon "mdi:edit" %}
- Revert: {% icon "mdi:restore" %}
- Eye: {% icon "mdi:eye" %}
- Trash: {% icon "mdi:trash" %}
- Cog: {% icon "mdi:cog" %}
- Cog outline: {% icon "mdi:cog-outline" %}
- Drag: {% icon "mdi:drag" %}
- Move cursor: {% icon "mdi:cursor-move" %}
- Arrow left: {% icon "mdi:arrow-left-bold" %}
- Arrow right: {% icon "mdi:arrow-right-bold" %}
- Checkbox list: {% icon "mdi:order-checkbox-ascending" %}
- Upload network: {% icon "mdi:upload-network" %}
- Security network: {% icon "mdi:security-network" %}
- Routes: {% icon "mdi:routes" %}
```

要查找其他图标的名称，请在 Iconify 上搜索，然后在名称前面加上 `mdi:`。

## 可折叠详情

详情块会隐藏内容，直到读者将其展开。请将它用于大多数读者可以跳过的内容，例如如何从供应商处获取凭据，或者故障排除问题列表（每位读者通常只需要其中一条）：

```liquid
{% details "Generate a client ID and client secret" %}

1. Register your account as a developer account at the vendor's developer portal.
2. Create a new application.
3. Enter an **Application name** of your choice, for example **Home Assistant**.

{% enddetails %}
```

- **标题是必填的**，需放在引号中。标题要让读者不用展开就能知道里面是什么内容。对于故障排除，请使用症状或错误信息。
- **标题中可以使用 Markdown**，例如用反引号标记代码。
- **可以在标题前添加图标**，使用 `icon` 选项，例如 `icon="mdi:information"`。
- **在开始标签之后和闭合标签之前保留空行**，这样内部的 Markdown 才能正确渲染。

请使用 Liquid 详情块，而不是 HTML 的 `<details>` 元素。Liquid 版本与网站的外观保持一致。

## 文本框

文本框能让信息从周围的文本中突显出来。它们只有在少量使用时才有效：一个满是文本框的页面反而没有任何东西能突显出来。在添加文本框之前，先问问自己一句普通的话是否就够了。

共有六种类型。请选择与信息内容相匹配的那一种：

- **Tip（提示）：** 让某件事更简单或更好的建议。即使读者跳过也不会出问题。
- **Note（注意）：** 有帮助的额外信息，但不属于主要流程的一部分。
- **Important（重要）：** 读者若想成功就不能错过的内容，例如某项要求。
- **Caution（谨慎）：** 可能导致数据丢失、意外行为或其他难以撤销后果的操作。
- **Warning（警告）：** 对系统安全或完整性的风险，或造成人身伤害的风险。这是最强烈的文本框，只在真正需要时使用。
- **Labs：** 标记某个功能是 Labs 预览功能，并告诉读者如何启用它。

```liquid
{% tip %}
Group your lights in an area, so you can turn them all off with one action.
{% endtip %}

{% note %}
The integration updates the data every 5 minutes.
{% endnote %}

{% important %}
Your device needs firmware version 2.0 or later.
{% endimportant %}

{% caution %}
Removing the integration also removes all its entities from your automations.
{% endcaution %}

{% warning %}
Disconnect the power before you open the device.
{% endwarning %}

{% labs %}
Requires the **Feature name** Labs preview feature. Enable it at {% my labs title="**Settings** > **System** > **Labs**" %}.
{% endlabs %}
```

每个文本框都会将其类型显示为标题，例如 **Tip**。若要在此标题上追加内容，请使用 `title`。若要替换默认图标，请使用 `icon`：

```liquid
{% note title="Older devices" icon="mdi:router-wireless" %}
Devices from before 2020 need a firmware update first.
{% endnote %}
```

该文本框会显示 **Note: Older devices** 作为其标题。

## 示例块

`example` 块用于展示自动化、脚本、模板或其他代码，并在其上方显示标签，同时内置术语表提示框和语法高亮。请将它用于希望读者理解并加以改编的示例，而不是普通的代码块。

内容是 YAML。它的第一个键设置标签，代码则以 `|` 块的形式放在其下方：

```liquid
{% example %}
automation: |
  alias: "Match fan to ceiling light"
  triggers:
    - trigger: light.brightness_changed
      target:
        entity_id: light.living_room_ceiling
      options:
        threshold: 10
  actions:
    - action: fan.set_percentage
      target:
        entity_id: fan.living_room
      data:
        percentage: >-
          {{ state_attr('light.living_room_ceiling', 'brightness_pct') | int }}
{% endexample %}
```

这些键用于设置输入的类型以及显示在其上方的标签。它们定义在 [`plugins/example.rb`](https://github.com/home-assistant/home-assistant.io/blob/current/plugins/example.rb) 中：

- `action`
- `automation`
- `condition`
- `script`
- `template`
- `trigger`

每个块只能使用其中一个。另外还有三个可选键可以添加更多信息：

- `output` 在代码下方显示其运行结果，中间用一个箭头分隔。这对模板尤其有用。
- `type` 指明结果的类型，显示在输出标签旁边。例如 `string` 或 `number`。
- `title` 为标签添加简短描述，例如 **Template: Format a temperature**。

```liquid
{% example %}
template: |
  {% from 'formatter.jinja' import format_entity %}
  {{ format_entity('sensor.outdoor_temperature') }}
  {{ format_entity('sensor.indoor_temperature') }}
output: |
  Outdoor temperature: 22.5
  Indoor temperature: 21.0
{% endexample %}
```

代码块的 80 字符限制在这里同样适用。对于较长的模板，请使用 `>-` 将其拆分为多行，就像第一个示例中那样。

## 可复用文本

有些文本会出现在许多页面上，例如添加集成的步骤。与其复制它，不如从 [`source/_includes`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_includes) 中包含一个共享片段：

```liquid
{% include integrations/config_flow.md %}
```

路径是相对于 `source/_includes` 的。当共享文本发生更改时，所有包含它的页面都会随之更新。

有些片段接受参数。请查看片段文件以了解它读取哪些参数：文件中以 `include.<name>` 形式书写的任何内容都是参数。

```liquid
{% include integrations/wwha.md url="https://www.eltako.com" name="Eltako" %}
```

在集成页面上常见的片段：

- `integrations/config_flow.md`：如何通过 UI 添加集成。
- `integrations/option_flow.md`：如何在设置完成后更改集成的选项。
- `integrations/remove_device_service.md`：如何移除集成。
- `integrations/supported_brand.md`：用于通过其他集成支持的品牌。

## 配置块

集成页面使用 `configuration_basic` 块描述在 UI 中设置的选项，使用 `configuration` 块描述 YAML 选项。两者都在[集成页面](/writing/reference/integration-page/)中有介绍。
