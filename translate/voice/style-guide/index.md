# 语音风格指南

> 如何编写符合人们说话方式的句子，以及简短清晰的回复。

Source: https://www.hasscn.top/contributors/translate/voice/style-guide/

好的句子只匹配人们会说的话，别无其他。好的回复只告诉人们发生了什么，别无更多。本页收集了对所有语言都适用的经验。您的语言负责人可能在此基础上有针对您语言的额外约定。

## 句子

### 像人们说话那样编写

不要逐字翻译英文模板。想一想您语言中的人们在家里对着角落里的音箱会怎么说出这个命令。既要包含简短形式（“厨房灯打开”），也要包含完整形式（“把厨房的灯打开”），以及您的语言所允许的语序。

如果您的语言语序自由，请使用[排列](https://www.hasscn.top/contributors/translate/voice/template-syntax/#permutations)，例如 `({name}; <area>)`，而不是把每种语序都写出来。

### 示例使用您的语言

每组句子都有一个 `example`。请用您的语言编写。它向审阅者和进度概览展示该组句子旨在匹配的内容。

### 对重复的部分使用规则

当相同的词语反复出现时，比如打开某个东西的动词，请把它们放入[展开规则](https://www.hasscn.top/contributors/translate/voice/template-syntax/#expansion-rules)（expansion rule）中。这样您就可以在一处改进它们。保持规则简单：规则内不要有列表，规则内也不要再嵌套规则。否则没人能弄清一个模板到底匹配什么。

### 把礼貌用语留给跳过词

人们会在命令中加上“请”或“能不能”。不要把这些词加到每个模板中。把它们放入您语言的[跳过词](https://www.hasscn.top/contributors/translate/voice/template-syntax/#skip-words)（skip words）中，匹配器就会在所有地方忽略它们。

### 控制句子数量

每个可选部分都会使模板匹配的句子数量翻倍。可选部分稍多几个，您的语言就会有数百万个句子，这会让 Assist 在小型设备上运行缓慢。请使用 `count_sentences` 检查（参见[动手尝试](https://www.hasscn.top/contributors/translate/voice/contributing/#try-things-out)），并且宁可使用几个清晰的模板，也不要使用一个匹配一切的模板。

### 不要匹配过多

过于宽松的模板会捕获属于其他意图（intent）的句子。这种情况最常发生在[通配符](https://www.hasscn.top/contributors/translate/voice/template-syntax/#wildcards)（wildcard）上，因为它们匹配任意文本：一个宽松的“播放 `{search_query}`”可能会吞掉“把灯调到最大”。请在通配符周围加上具体的词语。每次拉取请求（pull request）的检查都会捕获这个问题，但在编写时避免它更容易。

### 翻译值，保留 Home Assistant 需要的内容

Home Assistant 期望为英文的颜色、状态（state）和其他值，使用[列表](https://www.hasscn.top/contributors/translate/voice/template-syntax/#values-in-your-language-values-for-home-assistant)的 `in` 和 `out` 形式：您的词语作为输入，英文值作为输出。

### 来自 AI 模型的草稿

仓库可以为 AI 模型生成一个提示词（prompt），以获得某个意图句子的初稿：

```shell
python3 -m script.intentfest llm_template nl HassListAddItem
```

请把输出当作草稿。您才是母语使用者：阅读每一个句子，删掉没人会说的话，补上缺失的内容。

### 与界面保持一致

使用与您语言中的 Home Assistant 界面相同的词语和称呼方式。如果您的语言已就正式或非正式称呼达成一致，或就某些词语的翻译达成一致，请遵循这些约定。参见[语言指南](https://www.hasscn.top/contributors/translate/reference/languages/)。

## 回复

### 简洁

回复是语音播报的，所以每个词都很重要。

- 当命令针对单个设备时，不要重复其名称。“灯已打开”就足够了。
- 当命令针对一个区域（area）时，不要重复区域名称，也不要列出其实体（entity）。
- 当回复列出实体时，如果不超过四个，请全部列出。如果更多，请列出前三个，并说明还有多少个，例如“厨房、走廊、书房，还有 2 个”。

对于列表，请使用与英文回复相同的模板，这样每个回复的读法都一致。不要编写自己的变体：

```jinja
{% if query.matched %}
  {% set match = query.matched | map(attribute="name") | sort | list %}
  {% if match | length > 4 %}
    Yes, {{ match[:3] | join(", ") }} and {{ (match | length - 3) }} more
  {%- else -%}
    Yes,
    {% for name in match -%}
      {% if not loop.first and not loop.last %}, {% elif loop.last and not loop.first %} and {% endif -%}
      {{ name }}
    {%- endfor -%}
  {% endif %}
{% else %}
  No
{% endif %}
```

请翻译其中的词语，比如“Yes”、“No”、“and”和“more”，并保持逻辑原样。

### 使用现在时

“灯是开着的”，而不是“灯当时是开着的”。

### 使用主动语态

“打开了灯”，而不是“灯被打开了”。

卷帘（cover）和阀门是例外。它们打开或关闭需要一段时间，所以它们的回复描述正在发生的事情：“正在打开”、“正在关闭”。
