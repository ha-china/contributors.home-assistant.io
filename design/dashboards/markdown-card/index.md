# Markdown 卡片

> Markdown 卡片显示用 Markdown 编写的文本，并作为模板渲染，因此可以将固定文本与实时状态混合在一起。

Source: https://www.hasscn.top/contributors/design/dashboards/markdown-card/

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "markdown",
        "title": "Welcome home",
        "content": "The **laundry** is almost done.\nDinner is at **seven**, and the shopping list is on the fridge."
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

Markdown 卡片用于显示文本。可以用它在仪表盘（dashboard）上放置一条便签，比如欢迎信息、给访客的 household 规则，或设备旁的操作说明。由于内容是模板，它还可以把状态嵌入到句子中，比如“前门已关闭，室外温度为 12 °C”。

当文字比控件更能表达意思时，就使用它。对于单个状态，[平铺卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)或[实体卡片（entity card）](https://www.hasscn.top/contributors/design/dashboards/entity-card/)更清晰，并且在有人重命名实体（entity）后仍能正常工作。对于一组卡片上方的标题，请使用[标题卡片（heading card）](https://www.hasscn.top/contributors/design/dashboards/heading-card/)，而不是带大标题的 Markdown 卡片。

### 模板

内容每次都会发送到 Home Assistant 并作为模板渲染。卡片会订阅渲染结果，因此只要模板中使用的状态发生变化，它就会立即更新。模板如下所示：

```jinja
The front door is {{ states("binary_sensor.front_door") }}.
```

在模板内部，`config` 保存卡片的配置，`user` 保存当前查看者的姓名。

本网站上的演示背后没有 Home Assistant 来渲染模板，因此它们只显示纯 Markdown。

### 格式化

该卡片以 Home Assistant 其余部分相同的方式渲染 Markdown。内容中的单个换行符在卡片上就是一个换行。除了常规 Markdown 之外，前端的一些元素也可以使用，例如 `<ha-icon>`、`<ha-alert>` 和 `<ha-qr-code>`。GitHub alert 风格的引用块会变成警告框。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "markdown",
        "content": "> [!TIP]\n> The guest Wi-Fi password is on the back of the router."
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

仅允许使用一组安全的 HTML。脚本、样式以及大多数其他标签都会被移除。

### 仅文本

设置 `text_only: true` 后，卡片没有背景、边框或阴影，文本直接显示在仪表盘上。可以用它在卡片之间放置一行文字，比如某个区域中的简短说明。在此模式下不显示标题。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "markdown",
        "text_only": true,
        "content": "Lights in the garden turn on at sunset, and off at midnight."
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 操作

除非为其设置了 `tap_action`，否则选中该卡片时不会执行任何操作。设置后，整张卡片会变成一个按钮，带有波纹效果和指针光标。例如，可以用它导航到包含更多详细信息的视图。不要同时在文本中放置链接并在卡片上设置操作：人们无法分辨在哪里点击会发生什么。

### 内容

- 保持简短。卡片不是页面，过长的文本会把控件挤出屏幕。
- 使用完整的句子来书写，把状态嵌入句子中，而不是罗列原始值。
- 当模板可能渲染为空时，使用 `show_empty: false`，比如只在需要关注时才显示的提醒。此时卡片会自动隐藏。

## 配置

- `content`（字符串，必填）：要显示的 Markdown。作为模板渲染。
- `title`（字符串）：卡片的标题。在 `text_only` 模式下不显示。
- `text_only`（布尔值）：显示不带卡片背景、边框和阴影的文本。默认为 `false`。
- `show_empty`（布尔值）：当内容渲染为空时仍显示卡片。默认为 `true`。
- `entity_id`（字符串或列表）：用于更新模板的实体，适用于 Home Assistant 无法推断模板使用了哪些实体的情况。
- `card_size`（数字）：卡片在瀑布流（masonry）视图中的高度，以 50 像素为单位。默认为行数的一半。
- `theme`（字符串）：此卡片使用的主题。
- `tap_action`、`hold_action`、`double_tap_action`（操作）：选中、长按或双击卡片时发生的事情。默认为 `none`。

```yaml
type: markdown
title: "Garden"
content: >
  The irrigation is **{{ states("valve.garden_irrigation") }}**,
  and it is {{ states("sensor.outdoor_temperature") }} °C outside.
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-markdown-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-markdown-card.ts)，元素为 `<hui-markdown-card>`。它通过 [`src/data/ws-templates.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/ws-templates.ts) 中的 `subscribeRenderTemplate` 渲染内容，并使用 `<ha-markdown>` 显示结果——这是前端其余部分渲染 Markdown 所用的同一组件。Markdown 在 Web worker [`src/resources/markdown-worker.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/markdown-worker.ts) 中进行解析和净化，该文件还保存了允许使用的元素列表。

当模板出错时，在编辑卡片期间，错误会以警告框的形式显示在文本上方。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-markdown-card.ts)
