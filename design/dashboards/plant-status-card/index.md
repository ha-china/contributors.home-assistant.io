# 植物状态卡片

> 植物状态卡片显示植物的读数，例如湿度和光照，并指出需要关注的那一项。

Source: https://www.hasscn.top/contributors/design/dashboards/plant-status-card/

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
        "type": "plant-status",
        "entity": "plant.monstera"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

植物状态卡片专为一种实体（entity）设计：来自 plant 集成（integration）的植物实体。该实体汇集了植物的各项传感器，例如湿度、温度、光照、电导率和电池电量，并且知道每项读数应处于的取值范围。卡片将所有读数排成一行显示，每项读数带有图标、数值和单位。

超出取值范围的读数会以错误颜色加粗显示。在演示中，龟背竹的湿度过低。这正是这张卡片的意义所在：您可以一眼看出哪株植物需要浇水、需要光照，或者需要更换电池。

选择某项读数会打开其背后传感器的更多信息对话框，其中包含历史记录。

该卡片仅适用于植物实体。对于单个植物传感器，例如未使用 plant 集成的湿度传感器，请使用[平铺卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)或[传感器卡片](https://www.hasscn.top/contributors/design/dashboards/sensor-card/)。

### 图片

当植物实体带有图片时，卡片会将其显示为横幅，并在其上方显示名称。没有图片时，则仅显示名称，如演示中所示。

### 内容

- 卡片显示植物实体所拥有的读数。您无法选择显示哪些读数，因此如果某个传感器不应显示在卡片上，请在 plant 集成中将其省略。
- 电池图标会随电量变化，并采用电池电量对应的颜色，例如电量几乎耗尽时显示为红色。
- 当植物实体的名称不是人们常用的植物名称时，可以使用 `name`。

## 配置

- `entity`（字符串，必填）：要显示的植物实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `theme`（字符串）：此卡片使用的主题。

```yaml
type: plant-status
entity: plant.monstera
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-plant-status-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-plant-status-card.ts)，元素为 `<hui-plant-status-card>`。它显示的读数是其所知的植物实体属性：`moisture`、`temperature`、`brightness`、`conductivity` 和 `battery`。实体的 `problem` 属性指出了哪些读数超出范围。`sensors` 属性将每项读数与其传感器实体关联起来：卡片利用它按照对应传感器的格式显示数值，并打开其更多信息对话框。

在瀑布流视图中，该卡片的固定大小为 3，在分区视图中则占满整行宽度。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-plant-status-card.ts)
