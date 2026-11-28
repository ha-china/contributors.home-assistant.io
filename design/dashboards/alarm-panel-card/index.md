# 报警面板卡片

> 报警面板卡片可布防和撤防报警系统，并提供用于输入密码的数字键盘。

Source: https://www.hasscn.top/contributors/design/dashboards/alarm-panel-card/

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
        "type": "alarm-panel",
        "entity": "alarm_control_panel.home_alarm"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

报警面板卡片的外观和工作方式类似于报警系统的数字键盘。在顶部，您可以看到名称和一个显示状态的标签（chip），例如**已撤防**。其下方是用于布防报警的按钮。当报警布防后，这些按钮会为一个**撤防**按钮腾出空间，该按钮使用危险色。选择状态标签会打开更多信息对话框。

当报警需要密码时，卡片会显示一个密码输入框。对于数字密码，下方会显示一个数字键盘，足够大，适合在壁挂平板上使用。对于包含字母的密码，则只显示输入框，由用户手动输入。当报警没有密码，或已为其设置了默认密码时，则完全不显示输入框和数字键盘。

请将报警面板卡片用于作为报警面板的仪表盘（dashboard），例如前门的平板电脑。如果只是快速查看状态，或从您所在的房间进行布防，带有报警模式功能的[磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)要小得多。

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
        "type": "tile",
        "entity": "alarm_control_panel.home_alarm",
        "features": [
          {
            "type": "alarm-modes",
            "modes": [
              "armed_home",
              "armed_away",
              "disarmed"
            ]
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 布防按钮

如果报警系统支持，卡片默认显示**在家布防**和**离家布防**。通过 `states`，您可以选择显示哪些按钮以及显示顺序。只显示人们实际使用的模式。每多一个按钮，就多一项需要匆忙中阅读的内容。

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
        "type": "alarm-panel",
        "entity": "alarm_control_panel.home_alarm",
        "states": [
          "arm_home",
          "arm_away",
          "arm_night"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 当有多个报警系统时，请使用能说明是哪个报警系统的名称，例如**车库报警**。否则，使用实体（entity）的名称即可。
- 省略报警系统不支持的布防模式。卡片会将它们从默认列表中过滤掉，但不会从您自己设置的列表中过滤掉。

## 配置

- `entity`（字符串，必填）：要显示的报警系统。仅支持 `alarm_control_panel` 域的实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `states`（列表）：要显示的布防按钮：`arm_home`、`arm_away`、`arm_night`、`arm_vacation` 和 `arm_custom_bypass`。如果报警系统支持，默认为 `arm_home` 和 `arm_away`。
- `theme`（字符串）：仅应用于此卡片的主题。

```yaml
type: alarm-panel
entity: alarm_control_panel.home_alarm
states:
  - arm_home
  - arm_away
  - arm_night
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-alarm-panel-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-alarm-panel-card.ts)，元素为 `<hui-alarm-panel-card>`。布防按钮是填充外观的 [`<ha-button>`](https://www.hasscn.top/contributors/design/components/button/) 元素，数字键盘是由 [`<ha-control-button>`](https://www.hasscn.top/contributors/design/components/controls/) 元素组成的网格，密码输入框是一个 [`<ha-input>`](https://www.hasscn.top/contributors/design/components/input/)。输入框和数字键盘是否显示取决于实体的 `code_format` 属性，以及实体注册表选项中的默认密码。

该卡片没有自己的网格选项，因此在分区视图中，它会占据分区的全部宽度，并根据需要占用高度。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-alarm-panel-card.ts)
