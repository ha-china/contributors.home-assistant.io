# Assist 如何理解语言

> 意图、句子、槽位、列表和响应。Assist 背后的理念，以及一句语音指令如何变成一个操作。

Source: https://www.hasscn.top/contributors/translate/voice/how-assist-understands/

在写下你的第一句话之前，先了解这句话会经历什么会很有帮助。本页面将跟踪一条指令，从有人说出它的那一刻，到 Assist 做出回答的那一刻。

## 从语音到操作

当你与 Assist 对话时，你的指令会经过几个步骤。这些步骤合称为 [Assist 流水线（pipeline）](https://www.hasscn.top/contributors/glossary/assist-pipeline/)：

1. **语音转文本（speech to text）** 将音频转换为句子，比如“打开厨房的灯”。
2. **对话（conversation）** 弄清这句话的含义。内置的[对话代理（conversation agent）](https://www.hasscn.top/contributors/glossary/conversation-agent/)通过将句子与[意图仓库](https://github.com/OHF-Voice/intents)中的模板进行匹配来完成这一步。其结果是一个意图。
3. **意图处理（intent handling）** 执行该意图，例如打开厨房的灯。
4. **响应（response）** 根据你所用语言的模板生成，比如“已打开灯”。
5. **文本转语音（text to speech）** 朗读该响应。

第 2 步和第 4 步就是需要你参与的地方。句子和响应位于[意图仓库](https://github.com/OHF-Voice/intents)中。它们以 `home-assistant-intents` 包的形式发布，Home Assistant 会包含这个包。

集成可以为其中某些步骤接入自己的引擎：[对话代理](https://www.hasscn.top/contributors/core/entities/conversation/)、[语音转文本](https://www.hasscn.top/contributors/core/entities/stt/)或[文本转语音](https://www.hasscn.top/contributors/core/entities/tts/)。你编写的句子由内置的对话代理使用。

你也可以通过打字与 Assist 交流。此时语音相关的步骤会被跳过，但匹配的工作方式相同。

## 意图

[意图（intent）](https://www.hasscn.top/contributors/glossary/intent/)是一句话的含义，以 Home Assistant 可以执行的形式表示。“打开厨房的灯”、“厨房灯开一下”和“把厨房里的灯打开”是三个具有相同意图的句子：`HassTurnOn`，针对厨房的灯。

意图名称以 `Hass` 开头，比如 `HassTurnOn`、`HassGetState` 或 `HassStartTimer`。意图列表对所有语言都是相同的。它定义在 [`intents.yaml`](https://github.com/OHF-Voice/intents/blob/main/intents.yaml) 中，[内置意图](https://www.hasscn.top/contributors/translate/voice/intents/)对每个意图都有说明。

## 槽位

槽位（slot）是意图所需的一条信息。在“打开厨房的灯”中，有两个槽位：

- `area` 是“厨房”。
- `domain` 是“light”，因为“灯”这个词告诉 Assist 你指的是哪类设备。

有些槽位由用户在 Home Assistant 中设置的内容填充：`name`（实体的名称）、`area` 和 `floor`。Home Assistant 在匹配句子时会提供这些值。其他槽位来自仓库中的列表，比如颜色，或者来自数字，比如 50% 的亮度。

## 槽位组合

人们会用不同的方式请求同一件事。“打开吊灯”指定了一个实体。“打开厨房的灯”指定了一个区域和一类设备。一个句子所填充的每组槽位就是一个槽位组合（slot combination），并有自己的名称：

- `name_only`：“打开吊灯”
- `area_domain`：“打开厨房的灯”
- `domain_only`：“把这里的灯打开”，其中区域是你正在对话的语音卫星所在的区域

句子和测试按意图和槽位组合进行组织。每个槽位组合都有一个重要性级别，表示某种语言对它的需求程度，从 `required` 到 `optional`。[进度总览](https://ohf-voice.github.io/intents/)使用这些级别为每种语言评分。

## 句子模板

你不需要写出每一个可能的句子。你编写的是模板，它们可以同时描述许多句子：

```text
(turn | switch) on [the] {name}
```

这个模板可以匹配“turn on the overhead light”、“switch on overhead light”以及这些词的其他所有组合。`( | )` 列出可选项，`[ ]` 标记可选词，`{name}` 是一个槽位。匹配模板的引擎是 [hassil](https://github.com/OHF-Voice/hassil)。[模板句子语法](https://www.hasscn.top/contributors/translate/voice/template-syntax/)提供了完整的参考。

## 列表和扩展规则

有两个工具可以让模板保持简短易读：

- **列表（list）** 保存槽位的可能取值，比如一盏灯可以有的颜色。列表也可以是一个数字范围，或者是一个匹配任意文本的通配符，比如一首歌的名称。
- **扩展规则（expansion rule）** 是模板中可复用的片段。一个名为 `turn`、内容为 `(turn | switch)` 的规则，让你可以在每个文件中写 `<turn> on [the] {name}`。

两者都是按语言定义的，因为每种语言的用词不同。

## 响应

在 Home Assistant 处理完一个意图后，Assist 会做出回答。回答来自你所用语言中的响应模板，使用 [Jinja2](https://jinja.palletsprojects.com/en/latest/templates/) 编写。响应可以使用槽位的值，某些意图还会提供更多信息，比如你所询问实体的状态：

```yaml
one: "{{ slots.name | capitalize }} is {{ state.state_with_unit }}"
```

每组句子都指向适合它的响应。这样，“打开车库门”可以回答“正在打开”，而“打开台灯”则回答“已打开灯”。

## 测试

每个句子模板至少需要一个测试句子。测试描述一个小型家庭（一些区域、一些实体）、几个句子、它们应填充的槽位，以及 Assist 应给出的确切响应。测试会在每次拉取请求（pull request）时运行，因此当其他人修改某些内容时，你的句子仍能正常工作。[测试语法](https://www.hasscn.top/contributors/translate/voice/test-syntax/)说明了如何编写测试。

## 下一步

准备好尝试了吗？[贡献句子和响应](https://www.hasscn.top/contributors/translate/voice/contributing/)将引导你完成第一次修改。
