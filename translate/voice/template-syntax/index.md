# 模板句子语法

> 句子文件、模板语法、列表、展开规则、回复以及语言通用文件的完整参考。

Source: https://www.hasscn.top/contributors/translate/voice/template-syntax/

本页介绍在[意图仓库](https://github.com/OHF-Voice/intents)中为一种语言编写的所有文件，测试文件除外，测试文件有[单独的页面](https://www.hasscn.top/contributors/translate/voice/test-syntax/)。如果你是初次接触这些内容，请先阅读 [Assist 如何理解语言](https://www.hasscn.top/contributors/translate/voice/how-assist-understands/)。

模板由 [hassil](https://github.com/OHF-Voice/hassil) 进行匹配。该仓库使用 hassil 3。

## 一种语言的文件

| 路径 | 内容 |
| --- | --- |
| `sentences/<language>/<intent>/<slot_combination>.yaml` | 一个意图和槽位组合的[句子文件](https://www.hasscn.top/contributors/translate/voice/template-syntax/#sentence-files) |
| `sentences/<language>/_common.yaml` | [通用文件](https://www.hasscn.top/contributors/translate/voice/template-syntax/#the-common-file)：错误回复、跳过词和设置 |
| `lists/<language>/<group>.yaml` | 该语言的[列表](https://www.hasscn.top/contributors/translate/voice/template-syntax/#lists) |
| `lists/<group>.yaml` | [共享列表](https://www.hasscn.top/contributors/translate/voice/template-syntax/#shared-lists)：所有语言通用的数字范围和通配符 |
| `rules/<language>/<group>.yaml` | 该语言的[展开规则](https://www.hasscn.top/contributors/translate/voice/template-syntax/#expansion-rules) |
| `responses/<language>/<intent>.yaml` | 一个意图的[回复](https://www.hasscn.top/contributors/translate/voice/template-syntax/#responses) |
| `tests/<language>/<intent>/<slot_combination>.yaml` | 一个意图和槽位组合的[测试](https://www.hasscn.top/contributors/translate/voice/test-syntax/) |

列表文件和规则文件的组名由你自己决定。请以对您的语言有意义的方式组织内容，例如用 `lights.yaml` 存放颜色和亮度级别，或用 `verbs.yaml` 存放动词。

除了 [`lists/`](https://github.com/OHF-Voice/intents/tree/main/lists) 中的列表外，每个模板还可以使用 `name`、`area` 和 `floor` 列表。Home Assistant 在匹配句子时，会用用户已公开的实体（entity）、区域（area）和楼层的名称来填充这些列表。

## 槽位组合

所有语言的意图及其槽位组合都在 [`intents.yaml`](https://github.com/OHF-Voice/intents/blob/main/intents.yaml) 中统一声明。你不需要修改这个文件，但需要阅读它。槽位组合如下所示：

```yaml
HassTurnOn:
  slot_combinations:
    name_only:
      description: "Turns on a device or opens a cover by name"
      slots:
        - "name"
      name_domains:
        required:
          - "light"
          - "cover"
        optional:
          - "valve"
      name_domain_groups:
        default:
          - "light"
          - "switch"
      example:
        - "turn on the overhead light"
        - "open sliding door"
```

| 键 | 含义 |
| --- | --- |
| `slots` | 该组合的每个句子必须填充的槽位，不多也不少 |
| `importance` | 一种语言对该组合的需求程度：`required`、`usable`、`complete` 或 `optional` |
| `name_domains` | 对于带有 `name` 槽位的组合：`{name}` 可以匹配的实体域（domain），按重要性分组 |
| `name_domain_groups` | 句子文件可以引用的命名域集合，避免重复列出 |
| `inferred_domains` | 对于带有 `domain` 槽位的组合：句子中的词语可以隐含的域，按重要性分组 |
| `context_area` | 当区域来自语音卫星设备而非句子时为 `true`，例如"打开这里的灯" |
| `wildcard_slots` | 必须由[通配符列表](https://www.hasscn.top/contributors/translate/voice/template-syntax/#wildcards)填充的槽位，例如计时器的名称 |
| `example` | 一个或多个英语示例 |

重要性级别的含义：

- `required`：最低要求。缺少句子时验证将失败。
- `usable`：人们所期望的。缺少句子时验证会发出警告。
- `complete`：完整覆盖该语言所必需的。
- `optional`：额外的，不计入完整覆盖。

当组合使用 `name` 或 `domain` 时，重要性级别在 `name_domains` 或 `inferred_domains` 下按域分别设置，而不是使用 `importance`。

## 句子文件

一个句子文件包含一个意图和一个槽位组合的模板，按 `data` 下的一个或多个组组织：

```yaml
# sentences/en/HassTurnOn/name_only.yaml, shortened
language: "en"
data:
  # lights, switches, and other things you turn on
  - sentences:
      - "<turn> on [<the>] {name}"
      - "activate [<the>] {name}"
    example: "turn on the overhead light"
    name_domains: "default"
    response: "default"

  # covers
  - sentences:
      - "<open> [<the>] {name}"
    example: "open the sliding door"
    name_domains:
      - "cover"
    response: "cover"
```

每个组支持以下键：

| 键 | 必需 | 含义 |
| --- | --- | --- |
| `sentences` | 是 | [句子模板](https://www.hasscn.top/contributors/translate/voice/template-syntax/#template-syntax) |
| `response` | 是 | 当这些句子之一匹配时给出的[回复](https://www.hasscn.top/contributors/translate/voice/template-syntax/#responses)的键 |
| `name_domains` | 当组合带有 `name` 时 | 这些句子针对的实体域，可以是列表，也可以是 `name_domain_groups` 中某个组的名称 |
| `inferred_domain` | 当组合带有 `domain` 时 | 这些句子的词语所隐含的唯一域，例如"灯"对应的 `light` |
| `example` | 否 | 该组匹配的一个句子，用您的语言书写 |
| `speech_to_phrase` | 否 | 设为 `true` 表示该组用于 Speech-to-Phrase，见下文 |

有几条规则适用：

- 每个模板必须恰好填充 `intents.yaml` 为该组合声明的槽位。模板可以直接用 `{slot}` 填充槽位，或通过包含该槽位的展开规则填充。`domain` 槽位是例外：你永远不要在模板中写它，它来自 `inferred_domain`。
- 在 `name_domains` 或 `inferred_domains` 中标记为 `required` 的每个域都必须由某个组覆盖。不一定是同一个组：可以按适合您的语言的方式拆分句子。这就是为什么英语用一个组表示"打开"的事物，用另一个组表示"打开"的窗帘。
- 用您的语言书写 `example`。与英语示例相同的示例会触发警告。

你不需要写句子可以针对哪些实体，也不需要写固定的槽位值。这部分由 `intents.yaml` 生成，从而保证每种语言都保持一致。

### Speech-to-Phrase

Speech-to-Phrase 是一个只识别固定短语集合的语音转文本引擎，这使它在小型硬件上运行很快。带有 `speech_to_phrase: true` 的组用于构建该短语集合。

当一个槽位组合同时带有带标签和不带标签的组时，带标签的组是仅用于 Speech-to-Phrase 的较小集合，Home Assistant 本身会忽略它们。其中的每个句子也必须能被不带标签的组匹配。当所有组都带标签时，它们将同时用于两者。

## 模板语法

一个句子模板可以同时描述许多句子。

### 备选项

将备选项放在圆括号中，并用 `|` 分隔：

```text
set color to (red | green | blue)
```

备选项也可以在单词内部使用。`turn(s | ed | ing)` 匹配 "turns"、"turned" 和 "turning"。

### 可选部分

将可选的单词、短语或单词的一部分放在方括号中：

```text
turn on [the] light[s]
```

这会匹配 "turn on the lights"、"turn on the light"、"turn on lights" 和 "turn on light"。`[this | that]` 使一组备选项变为可选。

### 列表

`{list_name}` 匹配[列表](https://www.hasscn.top/contributors/translate/voice/template-syntax/#lists)中的任意值，并将该值放入同名的槽位中。当槽位名称与列表名称不同时，写作 `{list_name:slot_name}`：

```text
set [the] {name} brightness to {brightness_level:brightness}
```

列表不能位于备选项或可选部分之内。`(text | {list_name})` 和 `[{list_name}]` 都不允许，因为模板必须始终填充相同的槽位。

### 展开规则

`<rule_name>` 会被[展开规则](https://www.hasscn.top/contributors/translate/voice/template-syntax/#expansion-rules)的内容替换：

```text
<turn> on [<the>] {name}
```

### 排列

圆括号中用 `;` 分隔的各个项可以以任意顺序匹配：

```text
<turn> on ({name}; <area>)
```

这同时匹配 "turn on the lamp in the kitchen" 和 "turn on in the kitchen the lamp"，某些语言需要这种能力。各项之间会自动添加空格，因此它们不会合并成新单词。请控制在两到四个项：四个项已经有 24 种顺序，五个则有 120 种。

### 转义

要按字面匹配 `( ) [ ] { } < >` 中的某个字符，请在其前面加反斜杠，例如 `\(`。

### 大小

每个可选部分都会使模板匹配的句子数量翻倍，备选项则会使数量相乘。数量过大会使小型设备上的匹配变慢。可以使用 `count_sentences` 来检查，参见[贡献句子和回复](https://www.hasscn.top/contributors/translate/voice/contributing/#try-things-out)。

## 列表

一个列表保存一个槽位的可能取值。有三种类型：固定值、数字范围和通配符。一种语言的列表位于 `lists/<language>/` 中，每个文件都声明其语言：

```yaml
# lists/en/lights.yaml
language: "en"
lists:
  color:
    values:
      - "white"
      - "red"
      - "orange"
```

### 您的语言中的值，Home Assistant 使用的值

意图处理器期望某些值是英语的，例如颜色。使用 `in` 和 `out` 来匹配您的语言中的词语，并传递英语值：

```yaml
language: "nl"
lists:
  color:
    values:
      - in: "rood"
        out: "red"
      - in: "oranje"
        out: "orange"
```

`in` 可以是带有备选项的模板，`out` 可以是数字。这可以将词语转换为固定数字：

```yaml
language: "en"
lists:
  brightness_level:
    values:
      - in: "(max | maximum | highest)"
        out: 100
      - in: "(minimum | lowest)"
        out: 1
```

值不能包含列表或展开规则，也不能完全为可选。

### 范围

范围匹配数字，可以写成数字或词语。"百分之五十"和 "50 percent" 都能匹配：

```yaml
lists:
  brightness:
    range:
      type: "percentage"
      from: 0
      to: 100
      step: 1
```

| 键 | 必需 | 含义 |
| --- | --- | --- |
| `from` | 是 | 最小数字 |
| `to` | 是 | 最大数字 |
| `step` | 否 | 数字之间的步长，默认为 `1` |
| `type` | 否 | `number`、`percentage` 或 `temperature` |
| `fractions` | 否 | 同时匹配 `halves` 或 `tenths` |
| `multiplier` | 否 | 将匹配到的数字乘以该值 |

### 通配符

通配符匹配任意文本：

```yaml
lists:
  album:
    wildcard: true
  artist:
    wildcard: true
```

使用模板 `play {album} by {artist}` 时，句子 "play the white album by the beatles" 会将 `album` 填充为 "the white album"，将 `artist` 填充为 "the beatles"。通配符是贪婪的，因此请确保其周围的词语足够具体，以免捕获其他意图的句子。

### 共享列表

范围和通配符不需要翻译。将它们放在 [`lists/`](https://github.com/OHF-Voice/intents/tree/main/lists) 根目录下的 `lists/<group>.yaml` 中，所有语言都可以使用。共享文件没有 `language` 键：

```yaml
# lists/lights.yaml
lists:
  brightness:
    range:
      type: "percentage"
      from: 0
      to: 100
  color_temperature:
    range:
      from: 1000
      to: 10000
      step: 100
```

带有值的列表不能共享，因为它们的值是一种语言中的词语。

## 展开规则

展开规则是你经常使用的模板片段。一种语言的规则位于 `rules/<language>/` 中：

```yaml
# rules/en/verbs.yaml
language: "en"
expansion_rules:
  turn: "(turn | switch)"
  open: "(open | raise | lift) [up]"
```

```yaml
# rules/en/common.yaml
language: "en"
expansion_rules:
  the: "(the | my | our)"
  here: "([in] here | [in] (this | the | my | our) (room | area | space))"
```

规则必须包含一些非可选的文本。

规则可以让模板更简短，但也可能使模板难以阅读。以下两条建议可以避免这个问题：

- **规则不应包含列表。** 如果 `{name}` 被隐藏在 `<name>` 规则中，你就无法看出模板填充了哪些槽位。这还会导致词语重复，例如 `[the] <name>` 变成 `[the] [the] {name}`。
- **规则不应使用其他规则。** 否则读者必须沿着链条追踪才能知道模板匹配什么，而且嵌套规则中的备选项会使句子数量快速增长。

当您的语言中存在无人使用的规则或列表时，拉取请求会失败。请删除它们，或者运行 `python3 -m script.intentfest prune --language <language> --write` 来自动完成。

## 回复

每个句子组都会指定一个 `response`。一个意图的回复模板位于 `responses/<language>/<intent>.yaml` 中：

```yaml
# responses/en/HassLightSet.yaml
language: "en"
responses:
  intents:
    HassLightSet:
      brightness: "Brightness set"
```

```yaml
# sentences/en/HassLightSet/name_brightness.yaml, shortened
language: "en"
data:
  - sentences:
      - "[<the>] {name} brightness [to] {brightness} percent"
    example: "set the bedroom lamp brightness to 50%"
    name_domains:
      - "light"
    response: "brightness"
```

回复是 [Jinja2](https://jinja.palletsprojects.com/en/latest/templates/) 模板。它们与句子模板是不同的格式：在这里，`{{ }}` 用于输出一个值。

每个回复都可以使用 `slots`，其中包含每个匹配槽位的值，例如 `{{ slots.name }}`。某些意图会为回复提供更多信息，例如 `state`（第一个匹配的实体）或 `query`（关于状态的问题匹配到的实体）。[内置意图](https://www.hasscn.top/contributors/translate/voice/intents/)按意图列出了这些回复变量，`intents.yaml` 中的 `response_variables` 对它们进行了描述。

当没有指定其他回复时，使用 `default` 回复。请参考[英语回复](https://github.com/OHF-Voice/intents/tree/main/responses/en)中的示例，以及[风格指南](https://www.hasscn.top/contributors/translate/voice/style-guide/#responses)中关于如何编写回复的说明。

## 通用文件

`sentences/<language>/_common.yaml` 保存与单个意图无关的内容：错误回复、跳过词和设置。

### 错误回复

当 Assist 无法处理命令时，它会给出错误回复，例如因为没有实体具有你所说的名称：

```yaml
language: "en"
responses:
  errors:
    no_intent: "Sorry, I couldn't understand that"
    no_area: "Sorry, I am not aware of any area called {{ area }}"
    no_entity: "Sorry, I am not aware of any device called {{ entity }}"
```

完整的键集合在[英语通用文件](https://github.com/OHF-Voice/intents/blob/main/sentences/en/_common.yaml)中。请翻译所有这些键。

### 跳过词

跳过词在匹配时会被忽略。它们是人们在命令中添加但不改变其含义的词语：

```yaml
skip_words:
  - "please"
  - "can you"
```

### 设置

单词之间没有空格分隔的语言可以更改匹配的工作方式：

```yaml
language: "zh-CN"
settings:
  ignore_whitespace: true
```

- `ignore_whitespace`：匹配时忽略空格，适用于中文和日语等语言。
- `filter_with_regex`：已不再有任何效果。它仍然被接受，以便旧文件继续工作。
