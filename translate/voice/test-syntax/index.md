# 测试语法

> 如何编写测试，以证明你的句子匹配正确的意图、填充正确的槽位并给出正确的回复。

Source: https://www.hasscn.top/contributors/translate/voice/test-syntax/

[intents 仓库](https://github.com/OHF-Voice/intents)中的每个句子模板都有测试覆盖。测试会给出几个示例句子，并说明它们必须填充哪些槽位，以及 Assist 必须回答什么。测试会在每次拉取请求（pull request）时运行。

## 测试存放的位置

测试与[句子文件](https://www.hasscn.top/contributors/translate/voice/template-syntax/#sentence-files)一一对应，每个意图和槽位组合对应一个文件：

```text
tests/<language>/<intent>/<slot_combination>.yaml
```

每个测试文件都是独立的。它会声明所需的家居环境：其句子所涉及的楼层、区域、实体、计时器和媒体。测试文件之间不共享任何内容，因此你可以只阅读和修改一个文件，而无需查看其他文件。

## 一个测试文件

```yaml
# tests/en/HassTurnOn/name_only.yaml
language: "en"

entities:
  - name: "Overhead Light"
    domain: "light"
  - name: "Sliding Door"
    domain: "cover"

tests:
  - sentences:
      - "turn on Overhead Light"
      - "Overhead light on"
    slots:
      name: "Overhead Light"
    response: "Turned on the light"

  - sentences:
      - "open Sliding Door"
    slots:
      name: "Sliding Door"
    response: "Opening"
```

`tests` 包含一个或多个组。每个组包含：

| 键 | 是否必需 | 含义 |
| --- | --- | --- |
| `sentences` | 是 | 要尝试的句子 |
| `slots` | 是，当该组合包含槽位时 | 每个句子必须填充的槽位及其值 |
| `response` | 是 | Assist 必须回答的确切文本 |
| `timers` | 否 | 仅属于该组的[计时器](https://www.hasscn.top/contributors/translate/voice/test-syntax/#timers-and-media) |
| `media` | 否 | 仅属于该组的[媒体](https://www.hasscn.top/contributors/translate/voice/test-syntax/#timers-and-media) |

每个句子都必须匹配文件名所对应的意图和槽位组合。`slots` 必须准确列出 `intents.yaml` 中该组合的槽位，如果组合中包含 `domain`，也要包含它，例如 `domain: "light"`。`response` 是完整渲染后的回复，会逐字符进行比较。

> [!IMPORTANT]
> 每个句子模板必须至少被一个测试句子匹配到。当某个模板从未被使用时，测试会失败并列出未测试的模板。因此，添加模板时，请同时添加能匹配到它的测试句子。

## 固定装置（fixture）

测试文件顶部的楼层、区域和实体是它的固定装置（fixture）。它们扮演用户在 Home Assistant 中已配置内容的作用。你只需编写名称：ID 会由名称生成。

```yaml
language: "en"

floors:
  - name: "First Floor"

areas:
  - name: "Kitchen"
    floor: "First Floor"
  - name: "Living Room"

entities:
  - name: "Kitchen Switch"
    domain: "switch"
    area: "Kitchen"
  - name: "Curtain Left"
    domain: "cover"
    area: "Living Room"
```

实体可以接受：

| 键 | 是否必需 | 含义 |
| --- | --- | --- |
| `name` | 是 | 句子中用于指代该实体的名称 |
| `domain` | 是 | 实体域，例如 `light` 或 `cover` |
| `area` | 否 | 同一文件中声明的某个区域的名称 |
| `state` | 否 | 实体的状态，当回复会读取它时使用。当口语中的状态与 Home Assistant 存储的状态不同时，使用 `in` 和 `out` |
| `state_with_unit` | 否 | 状态及其单位，例如 `22 °C` |
| `attributes` | 否 | 回复或匹配所依赖的属性。设备类别（device class）写在这里，如 `device_class` |
| `is_exposed` | 否 | 对于未暴露给 Assist 的实体，设置为 `false`。回复中会将其排除，例如在回答关于状态的问题时 |

```yaml
entities:
  - name: "Living Room Window"
    domain: "cover"
    state: "open"
    attributes:
      device_class: "window"
```

请为固定装置使用具体的名称，例如"Garage Door Left"或"Curtains Left"，而不是"garage door"这样的通用名称。否则，对于"open the garage door"这样的句子，测试将无法区分名称和设备类型。

## 计时器和媒体

使用计时器或媒体的意图会像其他固定装置一样声明它们。可以将它们放在文件顶部供所有组使用，也可以放在单个组中：

```yaml
# tests/en/HassTimerStatus/area_only.yaml
language: "en"

areas:
  - name: "Kitchen"

timers:
  - is_active: true
    area: "Kitchen"
    start_minutes: 5
    total_seconds_left: 180
    rounded_hours_left: 0
    rounded_minutes_left: 3
    rounded_seconds_left: 0

tests:
  - sentences:
      - "how much time is left on the kitchen timer"
      - "kitchen timer status"
    slots:
      area: "Kitchen"
    response: "3 minutes left."
```

计时器至少需要 `start_hours`、`start_minutes` 或 `start_seconds` 中的一项，并且需要 `total_seconds_left`、`rounded_hours_left`、`rounded_minutes_left` 和 `rounded_seconds_left` 全部项。`name`、`area` 和 `is_active` 是可选的。

媒体项只有一个 `title`：

```yaml
# tests/en/HassMediaSearchAndPlay/area_only.yaml
language: "en"

areas:
  - name: "Kitchen"

media:
  - title: "The Office"

tests:
  - sentences:
      - "play The Office in the Kitchen"
    slots:
      search_query: "The Office"
      area: "Kitchen"
    response: "Playing media"
```

## 上下文区域

某些槽位组合在 `intents.yaml` 中带有 `context_area: true`。它们的区域来自语音卫星设备，而不是来自句子，例如"vacuum in here"。Home Assistant 会传递该区域的名称，因此像 `Cleaning {{ slots.area }}` 这样的回复仍然会说出真实的名称。

在此类组合的测试文件中，用 `context_area: true` 标记卫星设备所在的区域，并在回复中写出其名称：

```yaml
# tests/en/HassVacuumCleanArea/context_area.yaml
language: "en"

areas:
  - name: "Living Room"
    context_area: true

tests:
  - sentences:
      - "vacuum in here"
      - "clean this room"
    response: "Cleaning Living Room"
```

只能标记一个区域，并且只能在带有 `context_area: true` 的组合的文件中标记。回复所读取的实体必须位于被标记的区域中，因为卫星设备的区域会像口语中提到的区域一样过滤实体。如果没有标记的区域，测试将使用占位符名称 `__context_area__`。

## 运行测试

运行你的语言的测试：

```shell
pytest tests --language en
```

省略 `--language` 可测试所有语言，添加 `-k <intent>` 可测试单个意图，添加 `-n auto` 可并行运行。在 VS Code 或 codespace 中，通过 **Terminal** > **Run Task** > **Run tests for current file** 可以验证你的语言并运行当前打开文件的测试。
