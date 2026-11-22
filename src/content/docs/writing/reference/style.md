---
title: 文档风格指南
description: home-assistant.io 上每个页面的语言、语气和 Markdown 格式规则。
order: 1
sidebarLabel: 风格指南
---

文档遵循 [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)。在拼写和用词方面，它使用 [Merriam-Webster](https://www.merriam-webster.com/)，也就是 Microsoft 所依赖的同一本词典。本页列出了我们在此基础上增加的规则，以及你最常遇到的规则。

页面使用 [GitHub Flavored Markdown](https://github.github.com/gfm/) 编写，并使用一些 [Liquid 辅助工具](/writing/reference/liquid/)来实现 Markdown 无法完成的功能。图片和视频有[单独的页面](/writing/reference/images/)，[YAML 示例](/writing/reference/yaml/)也是如此。如何组织页面请参阅[组织页面结构](/writing/guides/structure/)。

## 语言和语气

- **使用美式英语写作。** Home Assistant 在全世界范围内被使用，许多读者并非以英语为母语。简短的句子和朴实的词语对每个人都有帮助。
- **与读者对话。** 使用“你”和“你的”，而不是“用户”。
- **友好而直接。** 像向一位喜欢技术的朋友解释某件事那样写作。要有信息量且亲切，而不是正式或技术化。
- **为使用 UI 的用户写作。** 大多数读者从不打开 YAML 文件。先展示 UI 路径，将 YAML 或其他手动配置作为需要时的选项。
- **让 Home Assistant 显得平易近人。** 避免使用让它听起来脆弱、困难或容易出错的措辞。不要将 YAML 或更复杂的功能称为“高级”，除非产品本身使用了这个词。
- **诚实。** 不要用营销语言掩盖局限性或复杂性。如实说明某项功能能做什么、不能做什么。
- **包容。** 保持写作客观，避免性别偏见、两极分化的言论，以及任何基于种族或宗教排斥他人的内容。不遵守此要求的写作可能违反[行为准则](https://github.com/home-assistant/home-assistant.io/blob/current/CODE_OF_CONDUCT.md)。

## 词语和术语

- **完整书写“Home Assistant”。** 不要写“HA”或“HASS”。
- **使用“选择”（select），而不是“点击”（click）。** “Click”只适用于鼠标。“Select”也适用于触摸屏、键盘和屏幕阅读器。只有在描述特定的鼠标操作（如右键单击或双击）时才使用“click”。
- **避免拉丁语缩写。** 不要写“e.g.”、“i.e.”、“etc.”或“etcetera”。改用“like”、“for example”或“such as”。
- **不要使用“master/slave”。** 使用符合上下文的[替代词](https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/m/master-slave)，例如“client/server”、“leader/follower”、“main/replica”或“controller/device”。
- **匹配名称的官方拼写。** 品牌、服务、协议、集成（integration）和平台的书写方式与其所有者的写法一致。例如，是“Z-Wave”，而不是“Zwave”、“Z-wave”、“Z Wave”或“ZWave”。“GitHub”、“WebSocket”和“Wi-Fi”也是如此。
- **一致地使用术语表中的术语。** 当页面使用 Home Assistant 的术语（如实体（entity）、设备（device）或集成）时，请按照[术语表](/glossary/)定义的方式使用。在 [home-assistant.io](https://www.home-assistant.io/) 上，你可以将定义显示为工具提示，参见[术语表工具提示](/writing/reference/liquid/#glossary-tooltips)。

自动检查会强制执行一份很长的品牌和产品拼写列表。该列表位于[`.textlintrc.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.textlintrc.json)中。如果检查标记了一个拼写正确的名称，请在同一个 pull request 中将其添加到那里。有关检查的工作方式，请参阅[自动检查](/writing/reference/checks/)。

## 标点和语法

- **使用牛津逗号。** 在包含三个或更多项目的列表中，在“and”或“or”之前加逗号：“Zigbee, Z-Wave, and Matter”。
- **句子以句号结尾。** 遵循正常的语法规则，包括作为完整句子的列表项。
- **句号后使用一个空格。** 绝不要两个。
- **少用破折号。** 太多破折号会产生冗长、纠缠的句子，而且它们是机器生成文本的常见标志。应改为重组句子：
  - 将长句拆分为两个较短的句子。
  - 要引出列表或解释？使用冒号。
  - 要插入补充说明？使用括号或逗号。

  如果破折号确实是最佳选择，请遵循 [Merriam-Webster 风格](https://www.merriam-webster.com/grammar/em-dash-en-dash-how-to-use)：em dash（长破折号）前后不加空格。复合词中的连字符，如“built-in”或“Z-Wave”，没有问题。

## 格式基础

- **每个句子单独一行。** 没有行长度限制，因此不要按固定宽度换行。
  相反，将段落的每个句子放在新的一行，使用单个换行符。
  Markdown 仍会将这几行渲染为一个段落。
  这使审阅更容易：当你更改一个句子时，差异只显示该行，审阅者可以准确评论或建议更改该句子。
  这是可选的，但推荐这样做，将整个段落保持在一行上也是可以的。
  当你更改一个单行的段落时，只将该段落拆分为句子，并保持其他段落不变。
  不要进行仅更改段落换行方式的编辑。
- **优先使用 Markdown 而不是 HTML。** 仅在 Markdown 无法完成时使用 HTML，例如带标题的图片。
- **用空行包围块。** 标题、列表、代码块和文本框前后都需要一个空行。

## 标题

页面的标题就是它的一级标题。它来自文件顶部 front matter 中的 `title`，所以你永远不需要自己写 `#` 标题：

```markdown
---
title: "Create an automation"
---
```

页面内容从二级标题开始。使用带 `#` 字符的 Markdown 标题，从二级到六级：

```markdown
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6
```

- **使用句首大写。** 仅首单词和专有名词大写：“Create an automation”，而不是“Create An Automation”。Microsoft 有[更多关于大写的内容](https://learn.microsoft.com/en-us/style-guide/capitalization)。
- **不要跳级。** 四级标题必须位于三级标题之下。
- **了解目录中显示的内容。** 在 home-assistant.io 上，只有二级和三级标题会出现在页面旁边的目录中。将读者需要单独查找的任何内容放在二级或三级标题下。
- **为主题命名。** 像“区域设置”这样的标题能告诉读者接下来的内容。“概述”或“须知”则不能。[组织页面结构](/writing/guides/structure/)针对每种类型的章节提供了建议。

## 强调

- **使用斜体进行强调。** 使用下划线：`_emphasized words_`。不要使用单个星号。
- **不要用大写字母进行强调。** 全大写的文字读起来像在喊叫。
- **不要用粗体进行强调。** 粗体保留给 UI 元素使用。也不要用粗体文本代替标题。

请节制使用强调。当所有内容都很突出时，就没有内容突出了。

## UI 元素和步骤

使用双星号以粗体书写 UI 元素或显示的 UI 文本（如传感器状态）的名称：`**Settings**`。按照界面中的原样书写。

要描述界面中的路径，请在各步骤之间使用大于号（`>`）。`>` 本身不加粗：

```markdown
1. Go to **Settings** > **Devices & services**.
2. Select **Restart Home Assistant** > **Quick reload**.
```

要书写你在 UI 中看到的错误消息，不要使用粗体。将消息括在引号中。

当路径从 Home Assistant 中的页面开始时，使用 [My 链接](/writing/reference/liquid/#my-links)，以便读者可以直接跳转到他们自己安装中的该页面。要指向界面中的图标，请使用[内联图标](/writing/reference/liquid/#inline-icons)。

## 文件路径、名称和输入

对文件路径、文件名、变量名以及读者在字段中输入的任何文本使用反引号：

- `/boot/config.txt` 文件
- `configuration.yaml` 文件
- `this` 变量
- 输入 `/newbot`

当示例中的某个值需要替换为读者自己的值时，请用大写字母加下划线书写，例如 `YOUR_API_KEY` 或 `REPLACE_ME`。

## 列表

- **选择正确的类型。** 按顺序执行的步骤使用编号列表。顺序无关紧要时使用项目符号。
- **项目符号使用 `-`。** 不要使用 `*` 或 `+`。
- **正确编号有序列表。** 写 `1.`、`2.`、`3.`，而不是每行都写 `1.`。
- **每个项目以大写字母开头**，除非有理由不这样做，例如命令或代码值。
- **保持标点一致。** 如果至少有一个项目是完整句子，则每个项目都以句号结尾。如果都不是，则完全不加句号。
- **不要以分号、逗号或“and”、“or”结尾项目。**
- **列表前后留一个空行。**

```markdown
1. Select **Create area**.
2. Enter a **Name** for the area.
3. Select **Create**.
```

## 代码块

使用三个反引号的围栏代码块，并始终在起始反引号后注明语言：

````markdown
```yaml
automation:
  - alias: "Turn on the porch light at sunset"
```
````

home-assistant.io 上的语法高亮使用 [Prism](https://prismjs.com/)。常用的语言名称有：

- `yaml` 用于配置和自动化（YAML 中的模板也会被高亮）
- `template` 或 `jinja2` 用于独立模板
- `bash` 或 `shell` 用于命令
- `json`
- `python`
- `markdown`
- `html`
- `text` 用于纯文本输出，例如日志行

代码块还有一些其他规则：

- **每行不超过 80 个字符。** 过长的行会迫使读者横向滚动，尤其是在手机上。
- **命令前不要加 `$` 提示符。** 读者会直接从页面复制命令，提示符会破坏这一点。只有当代块同时显示输出，且需要提示符来区分命令与其输出时才使用。
- **用更多反引号嵌套围栏。** 要在代码块内显示代码块，请让外层围栏的反引号多于内层。内层使用三个反引号的块用四个反引号包围，内层使用四个的用五个包围。

`````markdown
````markdown
```yaml
key: value
```
````
`````

YAML 示例在缩进、引号等方面有自己的规则。请参阅 [YAML 风格](/writing/reference/yaml/)。

## 表格

避免使用表格。许多人在手机上阅读文档，小屏幕上的宽表格很难使用。列表几乎总是更好：

- 两列的表格是伪装的列表。直接写成列表。
- 如果无法避免表格，请保持列数较少，且每个单元格中的文字简短。
- 对于配置选项，请改用[集成页面](/writing/reference/integration-page/)中描述的块。

## 链接

指向 home-assistant.io 上其他页面的链接遵循已发布的 URL，而不是仓库中的文件：

- **使用绝对路径**，以 `/` 开头。
- **省略 `source` 目录。**
- **省略第一个目录的前导下划线。**
- **以斜杠结尾，而不是文件扩展名**，如 `.markdown`、`.md` 或 `.mdx`。
- **不要写完整域名。** 使用 `/integrations/date/`，而不是 `https://www.home-assistant.io/integrations/date/`。

例如，要链接到 `source/_integrations/date.markdown`：

```markdown
[Date](/integrations/date/)
```

当页面提到某个集成或平台时，将其名称链接到其文档页面，例如 `[Philips Hue](/integrations/hue/)`。这样读者可以直接跳转到详细信息。

对于一般链接：

- **不要使用裸 URL。** 不要将 `https://example.org` 或 `<https://example.org>` 直接粘贴到文本中。为每个链接提供描述性文字。
- **不要使用联盟或跟踪链接。**
- **链接文字应描述目标。** 避免使用“这里”或“此链接”。

## 缩写和首字母缩略词

尽量少用缩写和首字母缩略词。确实需要时，请将其包裹在 `<abbr>` 标签中。这样读者会看到完整术语的工具提示：

```html
<abbr title="Audio & video">A/V</abbr>
<abbr title="current transformers">CT</abbr>
<abbr title="Dutch smart meter requirement">DSMR</abbr>
<abbr title="embedded MultiMediaCard">eMMC</abbr>
<abbr title="flash video">FLV</abbr>
<abbr title="Large Language Models">LLMs</abbr>
<abbr title="Model Context Protocol">MCP</abbr>
<abbr title="pan, tilt, and zoom">PTZ</abbr>
<abbr title="real-time messaging protocol">RTMP</abbr>
<abbr title="real-time streaming protocol">RTSP</abbr>
<abbr title="USB-On-The-Go">USB-OTG</abbr>
```

对于 Home Assistant 自己的术语，[术语表工具提示](/writing/reference/liquid/#glossary-tooltips)是更好的选择。
