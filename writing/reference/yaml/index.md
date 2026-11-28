# YAML style

> 文档中的 YAML 示例应当是什么样子，让它们易于阅读、复制和改写。

Source: https://www.hasscn.top/contributors/writing/reference/yaml/

人们会把 YAML 示例原样复制到自己的配置里。当所有示例都遵循同一种风格时，它们就更容易阅读、更容易对比，也更容易一次写对。

本页分为两部分。第一部分讲通用 YAML，适用于你写的任何 YAML。第二部分讲 Home Assistant 特有的选择——在 Home Assistant 里，同一件事往往有不止一种写法。

## 通用 YAML

### 缩进

用 2 个空格缩进。

```yaml
# Good
lighting:
  brightness: 80

# Bad
lighting:
    brightness: 80
```

### 布尔值

只使用小写的 `true` 和 `false`。`yes`、`no`、`on`、`off` 这些值看起来亲切，但会让 YAML 新手感到困惑。YAML 1.2 也已将它们从布尔值中移除，所以坚持用 `true` 和 `false` 能让示例经得起未来变化。

```yaml
# Good
enabled: true
visible: false

# Bad
enabled: True
visible: off
debug: yes
```

### 注释

注释帮助读者理解示例的作用。

- 注释单独占一行，放在它所解释的那一行的上方。行尾注释在小屏幕上很难阅读。
- 注释的缩进层级与它所属的行保持一致。
- `#` 后面加一个空格，注释以大写字母开头。

```yaml
# Good
sensor:
  # Check every five minutes
  scan_interval: 300

# Acceptable, but prefer the style above
sensor:
  scan_interval: 300 # Check every five minutes

# Bad
sensor:
# Check every five minutes
  scan_interval: 300
  #Check every five minutes
  timeout: 10
  # check every five minutes
  retries: 3
```

### 列表

YAML 里称为序列（sequence）。在文档中，请称它们为列表（list）。

列表用块样式（block style）书写，每个条目缩进到它的键下面。

```yaml
# Good
colors:
  - red
  - green
  - blue

# Bad
colors:
- red
- green
- blue
```

避免流样式（flow style），也就是带方括号的行内写法。它看起来紧凑，但一旦值变长就很难阅读。如果确实要用，逗号后面加一个空格，括号内侧不留空格。

```yaml
# Acceptable
colors: [red, green, blue]

# Bad
colors: [ red, green, blue ]
colors: [red,green,blue]
lights: ["light.living_room_window", "light.living_room_corner"]
```

### 映射

映射（mapping）也被称为字典、哈希表或键值对。在文档中，请称它们为映射。

映射始终用块样式书写。不允许使用看起来像 JSON 的流样式。

```yaml
# Good
position:
  x: 10
  y: 20

# Bad
position: { x: 10, y: 20 }
```

### 空值

空值留空即可。不要写 `null` 或 `~`。

```yaml
# Good
history:

# Bad
history: null
history: ~
```

### 字符串

字符串用双引号。Home Assistant 示例中的某些值是例外，参见[不加引号的字符串](https://www.hasscn.top/contributors/writing/reference/yaml/#strings-that-stay-unquoted)。

```yaml
# Good
greeting: "Welcome home!"

# Avoid
greeting: Welcome home!

# Bad
greeting: 'Welcome home!'
```

### 长字符串

不要用 `\n` 来换行，也不要把长字符串写成一行。改用块标量（block scalar）：

- 字面样式（literal style）`|` 保留你写下的换行。
- 折叠样式（folded style）`>` 把多行合并成一行，行之间以空格相连。

```yaml
# Good
message: |
  The washing machine is done.
  Time to empty it.
summary: >
  This text is spread over several lines in YAML,
  but Home Assistant reads it as one single line.

# Bad
message: "The washing machine is done.\nTime to empty it.\n"
```

优先使用不带修剪指示符（chomping indicator）的 `|` 和 `>`。如果示例需要对结尾换行做特殊处理，可以使用：

- 剥离指示符（strip indicator）`|-` 或 `>-`，去掉结尾换行及其后的空行。
- 保留指示符（keep indicator）`|+` 或 `>+`，保留结尾换行及其后的空行。

## Home Assistant YAML

Home Assistant 常常接受不止一种写法的相同配置。以下规则各选其一，让所有示例看起来一致。

### 省略默认值和空小节

不要写已经取默认值的选项。例外情况是：示例本身就是专门讲这个选项的。

空小节同理，比如 `conditions: []` 或 `data: {}`，还有 `mode: single`——它是自动化和脚本的默认模式。

```yaml
# Good
triggers:
  - trigger: state
    entity_id: binary_sensor.front_door
actions:
  - action: light.turn_on
    target:
      entity_id: light.hallway

# Bad
mode: single
triggers:
  - trigger: state
    entity_id: binary_sensor.front_door
conditions: []
actions:
  - action: light.turn_on
    target:
      entity_id: light.hallway
    data: {}
```

### 占位符

当需要读者自己填入一个值时，占位符用大写字母，单词之间用下划线分隔。这样一眼就能看出哪里需要替换。

```yaml
api_key: YOUR_API_KEY
host: YOUR_DEVICE_IP_ADDRESS
```

除非文中明确说明，示例都应当能在 `configuration.yaml` 文件中直接工作。

### 不加引号的字符串

字符串一律加双引号，只有一个例外。以下这些值不加引号反而更易读，所以保持不加引号：

- 实体 ID，例如 `binary_sensor.front_door`
- 实体属性，例如 `temperature`
- 设备 ID
- 区域 ID
- 平台类型，例如 `light` 或 `switch`
- 触发器类型，例如 `state` 或 `time`
- 条件类型，例如 `state` 或 `numeric_state`
- 动作名称，例如 `light.turn_on`
- 设备类别（device class），例如 `motion` 或 `problem`
- 事件名称
- 只接受一组固定选项的值，例如自动化中的 `mode`

```yaml
# Good
actions:
  - action: notify.mobile_app_phone
    data:
      message: "The front door is open."
  - action: light.turn_on
    target:
      entity_id: light.hallway
      area_id: entrance
    data:
      transition: 5

# Bad
actions:
  - action: "notify.mobile_app_phone"
    data:
      message: The front door is open.
```

### 动作的目标

把动作指向一个实体有三个位置：`target` 键下、直接写在动作上、或放在 `data` 里。始终使用 `target`。

它是最灵活的方式。除了实体，目标还可以包含设备、区域、楼层和标签（label），而且可以组合使用。

```yaml
# Good
actions:
  # Target one entity
  - action: light.turn_on
    target:
      entity_id: light.living_room
  # Target every light in an area
  - action: light.turn_on
    target:
      area_id: living_room
  # Combine an area, an entity, and a device
  - action: light.turn_on
    target:
      area_id: living_room
      entity_id: light.office_desk
      device_id: 8f2b6e4c1a9d4e7b9c3f5a1d2e6b8c4f

# Bad
actions:
  - action: light.turn_on
    entity_id: light.living_room
  - action: light.turn_on
    data:
      entity_id: light.living_room
```

### 单个值还是值列表

很多选项既接受单个值，也接受值列表。有些还接受逗号分隔的字符串。对于这些选项：

- 只有一个值时用单个值，不要包成列表。
- 多于一个值时用块样式的列表。
- 绝不要把多个值塞进一个逗号分隔的字符串里。

```yaml
# Good
entity_id: light.living_room

# Good
entity_id:
  - light.living_room
  - light.kitchen

# Bad
entity_id: light.living_room, light.kitchen

# Bad
entity_id: [light.living_room, light.kitchen]

# Bad
entity_id:
  - light.living_room
```

### 单个映射还是映射列表

`triggers`、`conditions`、`actions` 和 `sequence` 这类选项既接受单个映射，也接受映射列表。始终使用列表，哪怕只有一项。

列表让读者知道还可以继续添加条目，也让他们能把其中一项直接复制进自己的配置，而不用改动结构。

```yaml
# Good
actions:
  - action: light.turn_on
    target:
      entity_id: light.living_room

# Bad
actions:
  action: light.turn_on
  target:
    entity_id: light.living_room
```

## 模板

模板很强大，但对新手来说很难读懂。如果纯 YAML 能做到，就用纯 YAML。

还有另一个原因。在 [home-assistant.io](https://www.home-assistant.io/) 上，模板需要额外的转义，否则网站会把它们误认为 Liquid。参见 [Liquid helpers](https://www.hasscn.top/contributors/writing/reference/liquid/)。不写模板，就不用转义。

```yaml
# Good
conditions:
  - condition: numeric_state
    entity_id: sun.sun
    attribute: elevation
    below: 4

# Bad
conditions:
  - condition: template
    value_template: "{{ state_attr('sun.sun', 'elevation') < 4 }}"
```

### 模板中的引号

模板本身是字符串，所以外面用双引号，模板内部用单引号。

```yaml
# Good
greeting: "{{ 'Good morning' if now().hour < 12 else 'Hello' }}"

# Bad
greeting: '{{ "Good morning" if now().hour < 12 else "Hello" }}'
```

### 长模板

把长模板拆成多行，让读者能跟上逻辑。为此使用块标量，参见[长字符串](https://www.hasscn.top/contributors/writing/reference/yaml/#long-strings)。

```yaml
# Good
conditions:
  - >-
    {{
      is_state('lock.front', 'locked')
      and is_state('lock.back', 'locked')
    }}

# Bad
conditions:
  - "{{ is_state('lock.front', 'locked') and is_state('lock.back', 'locked') }}"
```

这个反例还算短。想象它再叠加五个条件，你就明白为什么这种方式撑不住了。

### 短条件语法

模板条件请用简写形式。更短、更干净。

```yaml
# Good
conditions: "{{ states('sensor.outdoor_temperature') | float(0) > 25 }}"

# Bad
conditions:
  - condition: template
    value_template: >-
      {{ states('sensor.outdoor_temperature') | float(0) > 25 }}
```

### 过滤器

过滤器管道符 `|` 两侧各留一个空格。如果这样让表达式不够清晰，就加括号。

```yaml
# Good
conditions:
  - "{{ states('sensor.humidity') | float(0) > 60 }}"
  - "{{ target == (states('input_number.target') | int(0)) }}"

# Bad
conditions:
  - "{{ states('sensor.humidity')|float(0) > 60 }}"
  - "{{ target == (states('input_number.target')|int(0)) }}"
```

### 状态与属性

读取状态和属性请使用辅助函数：`states()`、`is_state()`、`state_attr()` 和 `is_state_attr()`。不要直接从 `states` 对象上读取。

这些辅助函数能正确处理尚未就绪的实体，比如 Home Assistant 启动期间。直接读 `states` 对象在这种情况下会报错。

```yaml
# Good
temperature: "{{ states('sensor.temperature') }}"
target: "{{ state_attr('climate.living_room', 'temperature') }}"

# Bad
temperature: "{{ states.sensor.temperature.state }}"
target: "{{ states.climate.living_room.attributes.temperature }}"
```
