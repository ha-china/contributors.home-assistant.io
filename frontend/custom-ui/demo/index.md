# 展示你的卡片的实时演示

> 在任意网页上嵌入可操作的仪表盘卡片，包括你自己的自定义卡片，并使用 Home Assistant 演示的模拟后端。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/demo/

Last verified on 2026-11-05, against https://github.com/home-assistant/frontend/tree/dev/demo/src/embed.

截图展示卡片的外观。实时演示展示其工作方式：人们可以打开灯、移动滑块，并看到其他卡片随之变化。[Home Assistant 演示](https://demo.home-assistant.io/) 发布了一些元素，可以将真实的仪表盘卡片放到任意网页上，比如你的 README 站点或博客。它们在浏览器中针对模拟后端运行，因此不需要 Home Assistant 服务器。

- `<ha-embed-provider>` 持有模拟后端及其实体。
- `<ha-embed-card>` 渲染一张卡片，并使用某个 provider 的后端。
- `<ha-embed-section>` 渲染一个分区，或一个[分区策略](https://www.hasscn.top/contributors/frontend/custom-ui/strategy/#a-section-strategy)，方式相同。
- `<ha-embed-view>` 渲染一个视图、一个[视图策略](https://www.hasscn.top/contributors/frontend/custom-ui/strategy/#a-view-strategy)，或仪表盘中的一个视图。
- `<ha-embed-dashboard>` 渲染一个仪表盘，或一个[仪表盘策略](https://www.hasscn.top/contributors/frontend/custom-ui/strategy/#a-dashboard-strategy)，并带有其标签页。

同一 provider 中的所有卡片共享其实体。当你在一张卡片中更改某个实体时，其他卡片会显示该更改。

在这里试试：走廊磁贴及其下方的恒温器卡片共享一个走廊恒温器。更改磁贴中的目标温度或恒温器卡片中的模式，另一张卡片会随之变化。每张卡片都有一个卡片功能。室外温度的趋势图由演示根据其当前状态生成。

Live demo of dashboard cards, from the embed of the Home Assistant demo.

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
  <script type="application/json">
    [
      {
        "entity_id": "climate.hallway",
        "state": "heat",
        "attributes": {
          "friendly_name": "Hallway",
          "current_temperature": 19.5,
          "temperature": 21,
          "min_temp": 7,
          "max_temp": 30,
          "target_temp_step": 0.5,
          "hvac_modes": [
            "heat",
            "cool",
            "off"
          ],
          "supported_features": 1
        }
      },
      {
        "entity_id": "sensor.outside_temperature",
        "state": "12.3",
        "attributes": {
          "friendly_name": "Outside",
          "device_class": "temperature",
          "state_class": "measurement",
          "unit_of_measurement": "°C"
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 6">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "sensor.outside_temperature",
        "features": [
          {
            "type": "trend-graph"
          }
        ],
        "grid_options": {
          "columns": 6
        }
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 6">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "climate.hallway",
        "features": [
          {
            "type": "target-temperature"
          }
        ],
        "grid_options": {
          "columns": 6
        }
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "thermostat",
        "entity": "climate.hallway",
        "features": [
          {
            "type": "climate-hvac-modes",
            "hvac_modes": [
              "heat",
              "cool",
              "off"
            ]
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

演示的[组件页面](https://demo.home-assistant.io/components.html)展示了所有这些功能，并带有每个选项。

## 加载脚本

将演示的脚本添加到你的页面。它也会从演示站点加载其所有其他文件：

```html
<script
  type="module"
  src="https://demo.home-assistant.io/embed.js"
></script>
```

## 添加一张卡片

将实体放在 provider 内部的 script 标签中，将卡片配置放在卡片内部的 script 标签中。两者都接受带有 `type="application/json"` 的 JSON，或带有 `type="text/yaml"` 的 YAML。卡片配置与仪表盘中的相同。

```html
<ha-embed-provider>
  <script type="text/yaml">
    - entity_id: light.kitchen
      state: "on"
      attributes:
        friendly_name: Kitchen
        supported_color_modes:
          - brightness
        color_mode: brightness
        brightness: 180
  </script>
  <ha-embed-card>
    <script type="text/yaml">
      type: tile
      entity: light.kitchen
      features:
        - type: light-brightness
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

每个实体都有一个 `entity_id`、一个 `state` 和 `attributes`。可选的键 `area_id`、`device_id` 和 `platform` 设置其在实体注册表中的条目。如果没有 `last_changed`，实体会在一个随机的近期时间发生变化。

实体保留其所有属性，就像在 Home Assistant 中一样，因此只有你的集成设置的属性也会存在。具有专门模拟的实体，包括灯、气候、遮帘、人员、设备跟踪器等，会自行处理一些属性，这些属性优先于你设置的内容：例如，关闭的灯没有亮度。

YAML 需要其缩进。如果你的站点压缩 HTML，请确保压缩器保留 script 标签中的空白，或使用 JSON。provider 的 `entities` 属性和卡片的 `config` 属性也接受 JSON。

## 展示你的自定义卡片

在演示脚本之后加载你的卡片脚本到页面上，并使用其 `custom:` 类型，与仪表盘中的方式相同：

```html
<script
  type="module"
  src="https://demo.home-assistant.io/embed.js"
></script>
<script
  type="module"
  src="https://example.com/my-card.js"
></script>

<ha-embed-card>
  <script type="text/yaml">
    type: custom:my-card
    entity: light.kitchen
  </script>
</ha-embed-card>
```

你的卡片会获得与内置卡片相同的模拟 `hass` 对象，并且 `window.loadCardHelpers()` 可用于[卡片辅助工具](https://www.hasscn.top/contributors/frontend/custom-ui/card/#card-helpers)。卡片辅助工具仅在演示脚本运行后才存在。模块脚本按页面上的顺序运行，因此请将你的卡片脚本放在其后，以防你的卡片在其脚本加载时立即使用它们。许多内置卡片（如地图卡片）仅在卡片首次需要时才加载，因此请通过卡片辅助工具创建内置卡片，而不是通过其元素名称。当你的卡片脚本位于与页面不同的站点时，该站点需要为其发送 CORS 头。

自定义策略以相同方式加载。在演示脚本之后加载其脚本，并在分区、视图或仪表盘的 `strategy` 中使用其 `custom:` 类型。

## 展示一个分区

`<ha-embed-section>` 以与分区视图相同的方式渲染一个分区。其配置与仪表盘中的相同：当没有 `strategy` 时，`title` 会变成标题卡片，标题跨越顶部，`strategy` 会生成分区。分区采用元素的宽度。此示例使用[添加一张卡片](https://www.hasscn.top/contributors/frontend/custom-ui/demo/#add-a-card)中的 provider，并添加了一个 `switch.kettle`：

```html
<ha-embed-section>
  <script type="text/yaml">
    cards:
      - type: heading
        heading: Kitchen
      - type: tile
        entity: light.kitchen
      - type: tile
        entity: switch.kettle
  </script>
</ha-embed-section>
```

在这里试试：一个带有标题的分区、两个可以打开和关闭的磁贴，以及它们下方的一个宽磁贴。天花板灯属于 `devices` 中的一个设备。

Live demo of a dashboard section, from the embed of the Home Assistant demo.

```html
<ha-embed-provider>
  <script type="application/json">
    {
      "entities": [
        {
          "entity_id": "light.kitchen_ceiling",
          "state": "on",
          "device_id": "kitchen_ceiling",
          "attributes": {
            "friendly_name": "Ceiling",
            "supported_color_modes": [
              "brightness"
            ],
            "color_mode": "brightness",
            "brightness": 200
          }
        },
        {
          "entity_id": "switch.kettle",
          "state": "off",
          "area_id": "kitchen",
          "attributes": {
            "friendly_name": "Kettle",
            "device_class": "outlet"
          }
        },
        {
          "entity_id": "sensor.kitchen_temperature",
          "state": "21.4",
          "area_id": "kitchen",
          "attributes": {
            "friendly_name": "Kitchen temperature",
            "device_class": "temperature",
            "state_class": "measurement",
            "unit_of_measurement": "°C"
          }
        }
      ],
      "areas": [
        {
          "area_id": "kitchen",
          "name": "Kitchen"
        }
      ],
      "devices": [
        {
          "id": "kitchen_ceiling",
          "name": "Kitchen ceiling light",
          "area_id": "kitchen"
        }
      ]
    }
  </script>
  <ha-embed-section>
    <script type="application/json">
      {
        "cards": [
          {
            "type": "heading",
            "heading": "Kitchen"
          },
          {
            "type": "tile",
            "entity": "light.kitchen_ceiling",
            "tap_action": {
              "action": "toggle"
            }
          },
          {
            "type": "tile",
            "entity": "switch.kettle",
            "tap_action": {
              "action": "toggle"
            }
          },
          {
            "type": "tile",
            "entity": "sensor.kitchen_temperature",
            "grid_options": {
              "columns": 12
            }
          }
        ]
      }
    </script>
  </ha-embed-section>
</ha-embed-provider>
```

按设备或区域对实体进行分组的分区策略需要 provider 中有这些数据。请参阅[区域、设备、日历和能源](https://www.hasscn.top/contributors/frontend/custom-ui/demo/#areas-devices-calendars-and-energy)。

## 展示一个视图

`<ha-embed-view>` 渲染一个视图，包括其徽章和布局，`strategy` 会生成视图。为元素提供视图所需的宽度：masonry 和 sidebar 视图根据页面宽度（而非元素宽度）选择列数。此示例使用[添加一张卡片](https://www.hasscn.top/contributors/frontend/custom-ui/demo/#add-a-card)中的 provider：

```html
<ha-embed-view>
  <script type="text/yaml">
    type: sections
    badges:
      - entity: light.kitchen
    sections:
      - cards:
          - type: tile
            entity: light.kitchen
  </script>
</ha-embed-view>
```

在这里试试：一个带有室外温度徽章的分区视图，以及在有空间时并排的两个分区。

Live demo of a dashboard view, from the embed of the Home Assistant demo.

```html
<ha-embed-provider>
  <script type="application/json">
    [
      {
        "entity_id": "light.living_room",
        "state": "off",
        "attributes": {
          "friendly_name": "Living room",
          "supported_color_modes": [
            "brightness"
          ],
          "color_mode": "brightness",
          "brightness": 255
        }
      },
      {
        "entity_id": "switch.coffee_maker",
        "state": "on",
        "attributes": {
          "friendly_name": "Coffee maker",
          "device_class": "outlet"
        }
      },
      {
        "entity_id": "climate.hallway",
        "state": "heat",
        "attributes": {
          "friendly_name": "Hallway",
          "current_temperature": 19.5,
          "temperature": 21,
          "min_temp": 7,
          "max_temp": 30,
          "target_temp_step": 0.5,
          "hvac_modes": [
            "heat",
            "off"
          ],
          "supported_features": 1
        }
      },
      {
        "entity_id": "sensor.outside_temperature",
        "state": "12.3",
        "attributes": {
          "friendly_name": "Outside",
          "device_class": "temperature",
          "state_class": "measurement",
          "unit_of_measurement": "°C"
        }
      }
    ]
  </script>
  <ha-embed-view>
    <script type="application/json">
      {
        "type": "sections",
        "max_columns": 2,
        "badges": [
          {
            "entity": "sensor.outside_temperature"
          }
        ],
        "sections": [
          {
            "cards": [
              {
                "type": "heading",
                "heading": "Living room"
              },
              {
                "type": "tile",
                "entity": "light.living_room",
                "tap_action": {
                  "action": "toggle"
                }
              },
              {
                "type": "tile",
                "entity": "switch.coffee_maker",
                "tap_action": {
                  "action": "toggle"
                }
              }
            ]
          },
          {
            "cards": [
              {
                "type": "heading",
                "heading": "Hallway"
              },
              {
                "type": "thermostat",
                "entity": "climate.hallway"
              }
            ]
          }
        ]
      }
    </script>
  </ha-embed-view>
</ha-embed-provider>
```

视图策略和仪表盘策略都使用 `strategy` 键。要展示仪表盘的一个视图，或仪表盘策略的一个视图，请将仪表盘放在 `dashboard` 中，并将视图的路径或索引放在 `view` 中。如果没有 `view`，则显示第一个视图。

```yaml
dashboard:
  strategy:
    type: custom:my-dashboard
view: overview
```

## 展示一个仪表盘

`<ha-embed-dashboard>` 渲染整个仪表盘及其标签页，`strategy` 会生成仪表盘。仪表盘在元素内部滚动，位于其工具栏下方。元素高度为 600 像素；设置其 `height` 以更改该值。要从第一个视图以外的视图开始，请将其 `view` 属性设置为该视图的路径或索引。此示例使用[添加一张卡片](https://www.hasscn.top/contributors/frontend/custom-ui/demo/#add-a-card)中的 provider：

```html
<ha-embed-dashboard style="height: 480px">
  <script type="text/yaml">
    views:
      - title: Home
        path: home
        cards:
          - type: tile
            entity: light.kitchen
      - title: Kitchen
        path: kitchen
        cards:
          - type: light
            entity: light.kitchen
  </script>
</ha-embed-dashboard>
```

在这里试试：一个带有两个标签页的仪表盘。在它们之间切换，或选择第一个标签页上的走廊磁贴以转到第二个标签页。

Live demo of a dashboard with its tabs, from the embed of the Home Assistant demo.

```html
<ha-embed-provider>
  <script type="application/json">
    [
      {
        "entity_id": "light.living_room",
        "state": "off",
        "attributes": {
          "friendly_name": "Living room",
          "supported_color_modes": [
            "brightness"
          ],
          "color_mode": "brightness",
          "brightness": 255
        }
      },
      {
        "entity_id": "switch.coffee_maker",
        "state": "on",
        "attributes": {
          "friendly_name": "Coffee maker",
          "device_class": "outlet"
        }
      },
      {
        "entity_id": "climate.hallway",
        "state": "heat",
        "attributes": {
          "friendly_name": "Hallway",
          "current_temperature": 19.5,
          "temperature": 21,
          "min_temp": 7,
          "max_temp": 30,
          "target_temp_step": 0.5,
          "hvac_modes": [
            "heat",
            "off"
          ],
          "supported_features": 1
        }
      }
    ]
  </script>
  <ha-embed-dashboard>
    <script type="application/json">
      {
        "views": [
          {
            "title": "Home",
            "path": "home",
            "type": "sections",
            "max_columns": 2,
            "sections": [
              {
                "cards": [
                  {
                    "type": "heading",
                    "heading": "Living room"
                  },
                  {
                    "type": "tile",
                    "entity": "light.living_room",
                    "tap_action": {
                      "action": "toggle"
                    }
                  },
                  {
                    "type": "tile",
                    "entity": "switch.coffee_maker",
                    "tap_action": {
                      "action": "toggle"
                    }
                  }
                ]
              },
              {
                "cards": [
                  {
                    "type": "heading",
                    "heading": "Hallway"
                  },
                  {
                    "type": "tile",
                    "entity": "climate.hallway",
                    "tap_action": {
                      "action": "navigate",
                      "navigation_path": "climate"
                    }
                  }
                ]
              }
            ]
          },
          {
            "title": "Climate",
            "path": "climate",
            "type": "sections",
            "sections": [
              {
                "cards": [
                  {
                    "type": "thermostat",
                    "entity": "climate.hallway"
                  }
                ]
              }
            ]
          }
        ]
      }
    </script>
  </ha-embed-dashboard>
</ha-embed-provider>
```

工具栏仅显示标签页、视图标题以及子视图的返回按钮。没有编辑模式。每个仪表盘保持自己的视图，因此你页面的地址保持不变，并且一个页面上的两个仪表盘不会相互跟随。

仪表盘中的链接工作方式如下：

- 指向仪表盘某个视图的链接，如 `navigation_path: climate` 或 `/my-dashboard/climate`，会显示该视图。
- 子视图的返回按钮在其 `back_path` 是此仪表盘的视图时转到该路径。否则，它会转到之前的视图，如果没有则转到第一个视图，因此指向其他页面的 `back_path` 不会离开演示。
- 指向你页面上锚点的链接，如 `#setup`，会滚动页面到该位置。
- 其他 `navigate` 操作不执行任何操作。`url` 操作会打开其页面，与仪表盘中的方式相同。

## 在视图进入视野时加载演示

在包含多个演示或演示位于页面较下方的页面上，你可以等到演示接近视野时再加载演示脚本，以便页面的其余部分先加载。元素在设置时读取其 script 标签，因此当脚本稍后加载时，卡片仍能找到其实体和配置。观察页面上的每张卡片、分区、视图和仪表盘，然后先导入演示脚本，再导入你的卡片脚本：

```js
const loadDemo = async () => {
  await import("https://demo.home-assistant.io/embed.js");
  await import("https://example.com/my-card.js");
};

const observer = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      loadDemo();
    }
  },
  { rootMargin: "400px 0px" },
);
for (const demo of document.querySelectorAll(
  "ha-embed-card, ha-embed-section, ha-embed-view, ha-embed-dashboard",
)) {
  observer.observe(demo);
}
```

provider 内部的卡片、分区、视图和仪表盘也算在内。`querySelectorAll` 不会查看 shadow root 内部，因此对于你自己组件内部的演示，请改为观察这些组件。它不观察 provider：页面顶部的 provider 会立即加载演示，即使其卡片位于较下方。从模块脚本运行它，以便页面元素在查找时已存在。以这种方式加载时，请省略演示和你的卡片的 script 标签。

## 将卡片放在页面上的任意位置

卡片不必位于 provider 内部。provider 外部的卡片使用页面上的第一个 provider。位于你自己组件内部的卡片使用该组件周围的 provider，即使通过其 shadow root 也是如此。将包含所有实体的一个 provider 放在页面顶部，并将卡片放在其下方的任意位置，穿插在你的文本之间。如果页面没有 provider，卡片会添加一个空的 provider。分区、视图和仪表盘以相同方式找到其 provider，并接受相同的 `provider` 属性。

要使用另一个 provider，请将卡片的 `provider` 属性设置为该 provider 的 ID：

```html
<ha-embed-provider id="living-room">…</ha-embed-provider>

<ha-embed-card provider="living-room">…</ha-embed-card>
```

在卡片添加到页面之前设置 `provider`。卡片在添加时选择其 provider，并且不会跟随后续更改。

## 在一个站点上展示多个项目

如果你维护多个卡片或策略，则不需要为每个项目都建一个演示站点。为每个项目提供一个演示配置，将实体放在 `entities` 中，将要展示的内容放在 `cards`、`sections`、`views` 或 `dashboard` 中。配置可以全部放在宿主站点中，也可以由每个项目自行维护，例如在其代码旁边放一个 `demo.yml`：

```yaml
entities:
  - entity_id: light.kitchen
    state: "on"
    attributes:
      friendly_name: Kitchen
cards:
  - type: custom:my-card
    entity: light.kitchen
```

然后站点渲染每个配置：实体进入 provider，每张卡片、分区、视图或仪表盘进入其元素，作为其 script 标签中的 YAML。为每个项目提供自己的 provider，以便其实体保持分离，并在演示脚本之后加载每个卡片的脚本。

## 亮色和暗色

卡片跟随浏览器的亮色或暗色模式。当你的站点有自己的暗色模式开关时，请将 provider 的 `color-scheme` 属性设置为 `light` 或 `dark`。卡片在内部保留其样式，不会更改你页面的样式。唯一的例外是 Roboto 字体：脚本会将其字体面添加到页面，因此使用 Roboto 的页面文本在脚本加载后可能会看起来不同。

## 区域、设备、日历和能源

某些卡片需要非实体的数据。要设置这些数据，请在 provider 的 script 标签中放置一个对象，而不是列表。该对象在 `entities` 中包含列表，并可以包含以下任何键：

- `areas`：区域列表，每个区域包含 `area_id` 和 `name`。如果没有此键，实体的每个 `area_id` 和设备都会成为一个区域。
- `devices`：设备列表，每个设备包含 `id` 和 `name`，并可选择包含 `manufacturer`、`model` 和 `area_id`。实体通过其 `device_id` 属于某个设备，因此卡片和策略可以找到该设备及其名称。
- `calendars`：按实体 ID 列出的日历实体的事件。每个事件包含 `summary`、`start` 和 `end`。未列出的日历会获得今天附近的示例事件。列表为空的日历没有事件。
- `energy`：能源设置，即 `energy/get_prefs` 响应中需要的键。如果没有此键，则未设置能源。

```yaml
entities:
  - entity_id: calendar.family
    state: "off"
    attributes:
      friendly_name: Family
  - entity_id: light.kitchen_ceiling
    state: "on"
    device_id: kitchen_ceiling
    attributes:
      friendly_name: Ceiling
areas:
  - area_id: kitchen
    name: Kitchen
devices:
  - id: kitchen_ceiling
    name: Kitchen ceiling light
    manufacturer: Acme
    model: Smart bulb
    area_id: kitchen
calendars:
  calendar.family:
    - summary: Dentist
      start: "2026-11-02T15:30:00+00:00"
      end: "2026-11-02T16:15:00+00:00"
```

日历卡片仅显示其显示日期内的事件，因此请将这些日期更改为接近你演示日期的日期。要始终有事件，请将日历从 `calendars` 中省略，并使用示例事件。它们设置在演示脚本加载日期的附近，并且再次加载页面时会再次设置它们。

天气实体根据其条件和温度，或在其具有 `forecast` 属性时根据该属性，获得生成的预报。设置 `supported_features` 以显示预报。

## 从你的页面更改和观察实体

要更改一个实体，请在 `provider.hass.mockEntities` 中更新它。其他实体保持不变，实体记住的内容（如关闭灯的亮度）也保持不变。从模块脚本运行它，在 provider 设置其实体之后。这会关闭[添加一张卡片](https://www.hasscn.top/contributors/frontend/custom-ui/demo/#add-a-card)中的厨房灯：

```js
await customElements.whenDefined("ha-embed-provider");
const provider = document.querySelector("ha-embed-provider");
await provider.updateComplete;

provider.hass.mockEntities["light.kitchen"].update({ state: "off" });
```

要使用实体的操作，请在同一个模块脚本中调用它。provider 会更新状态和卡片：

```js
provider.hass.callService(
  "light",
  "turn_on",
  { brightness_pct: 50 },
  { entity_id: "light.kitchen" },
);
```

设置 provider 的 `entities` 属性会替换所有实体，它们会从你设置的内容重新开始。

当其中一个或多个实体的状态发生变化时，provider 会触发 `states-changed` 事件。其 detail 包含 `states`，即按实体 ID 列出的所有实体的状态。

## 模拟后端可以做什么

模拟后端只知道 Home Assistant API 的一部分。在选择展示内容时，请记住这些限制：

- 灯、开关、气候、遮帘、风扇、锁、媒体播放器等操作会更改实体的状态。
- 操作只能到达按实体 ID 定位的实体。针对区域或设备的操作不执行任何操作。
- 历史和统计信息是根据每个实体的当前状态生成的。演示中的一些能源传感器（如 `sensor.solar_production`）会获得自己生成的统计信息，因此其状态不会改变其图表。
- 模板不会渲染。模板订阅会从你传递的变量中填充简单的 `{{ variable }}` 引用，并原样返回其余内容。REST `template` 端点返回错误。
- 日志簿为空。
- 卡片的 `toggle`、`perform-action` 和 `url` 操作有效。打开对话框的操作（如 `more-info`）不执行任何操作。带有 `confirmation` 的操作不执行任何操作，因为它会等待不会打开的对话框，除非确认豁免了演示用户。
- 指向你页面上锚点的 `navigate` 操作（如 `#setup`）会滚动到该位置。仪表盘也会跟随指向其自身视图的链接，如[展示一个仪表盘](https://www.hasscn.top/contributors/frontend/custom-ui/demo/#show-a-dashboard)所述，给定 `dashboard` 的视图也是如此，如[展示一个视图](https://www.hasscn.top/contributors/frontend/custom-ui/demo/#show-a-view)所述。其他 `navigate` 操作不执行任何操作。
- 后端不处理的操作，或针对其没有的实体的操作，不执行任何操作。它们不会返回错误。
- 其他等待答案的请求（通过 WebSocket 或 REST）会收到错误。

模拟代码位于[前端仓库](https://github.com/home-assistant/frontend)的 [`demo/src/stubs/`](https://github.com/home-assistant/frontend/tree/dev/demo/src/stubs) 中。如果你的卡片需要它们不知道的请求，请参阅[画廊和演示](https://www.hasscn.top/contributors/frontend/development/gallery-and-demo/#embed-cards-on-other-sites)了解在哪里添加。
