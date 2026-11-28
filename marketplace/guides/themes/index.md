# 发布主题

> 编写主题文件、选择要设置的变量、支持浅色和深色模式、进行测试，并打包以供 Marketplace 使用。

Source: https://www.hasscn.top/contributors/marketplace/guides/themes/

[主题（theme）](https://www.hasscn.top/contributors/glossary/theme/)是一个 YAML 文件，包含 Home Assistant 界面的颜色和一些尺寸。用户可以在自己的个人资料中选择主题，也可以为单个仪表盘视图或卡片设置主题。制作主题不需要编程知识：只需要 YAML，以及一双能看出什么在浅色和深色下都好看的眼睛。

关于前端如何从代码层面应用主题，请参阅[主题与设计令牌（Theming and design tokens）](https://www.hasscn.top/contributors/frontend/architecture/theming/)。本页面面向编写主题的人。

## 主题文件

主题文件是一个映射（mapping）。键是主题的名称，也就是用户在个人资料中看到的名称。其下是各个变量，但不带 CSS 中变量前面的 `--`：

```yaml title="themes/nordic.yaml"
Nordic:
  primary-color: "#5e81ac"
  accent-color: "#d08770"
  card-background-color: "#eceff4"
  primary-background-color: "#e5e9f0"
  primary-text-color: "#2e3440"
  ha-card-border-radius: "16px"
```

每个值都要加引号。在 YAML 中，`#` 会开始一段注释，所以不加引号的颜色会丢失，而且前端本来就要求每个值都是字符串。

一个文件可以包含多个主题，每个主题都在自己的名称之下。Home Assistant 通过 `configuration.yaml` 中的这一行从用户配置的 `themes` 文件夹读取这些文件，这一行是它在创建该文件时自动添加的：

```yaml title="configuration.yaml"
frontend:
  themes: !include_dir_merge_named themes
```

删除了这一行的用户，或者配置较旧的用户，需要把它加回来。请在你的 README 中说明这一点：当你的主题没有显示时，这是首先要检查的事情。

## 要设置哪些变量

前端有两层变量，一个好的主题会同时设置这两层。

### 经典变量

大多数主题会设置下面的变量。它们在前端的 [`src/resources/theme/color/color.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/color/color.globals.ts) 中定义，许多组件会使用它们。[主题变量（Theme variables）](https://www.hasscn.top/contributors/marketplace/reference/theme-variables/)列出了全部变量，并带有浅色和深色模式下的默认值：复制你想更改的那些。

| 变量 | 用途 |
| --- | --- |
| `primary-color` | 主强调色。其他变量（如 `sidebar-selected-icon-color`）默认使用它。 |
| `accent-color` | 第二强调色 |
| `primary-background-color` | 页面的背景 |
| `secondary-background-color` | 第二背景，用于与页面区分开来的表面 |
| `card-background-color` | 卡片。`sidebar-background-color` 和 `ha-card-background` 默认使用它。 |
| `primary-text-color` | 大部分文本 |
| `secondary-text-color` | 次要文本，比如描述 |
| `text-primary-color` | 位于 `primary-color` 之上的文本 |
| `divider-color` | 项目之间的分隔线 |
| `error-color`, `warning-color`, `success-color`, `info-color` | 状态消息和提醒 |
| `sidebar-background-color`, `sidebar-text-color`, `sidebar-icon-color`, `sidebar-selected-icon-color`, `sidebar-selected-text-color` | 侧边栏 |
| `app-header-background-color`, `app-header-text-color` | 仪表盘和其他页面顶部的页眉 |
| `state-icon-color` | 实体（entity）的图标 |

卡片有自己的变量，来自内置卡片的容器 `ha-card`。其他组件也有一些，比如分区视图的间距：它们位于[组件变量（component variables）](https://www.hasscn.top/contributors/marketplace/reference/theme-variables/#component-variables)之下。

| 变量 | 它改变什么 |
| --- | --- |
| `ha-card-background` | 卡片的背景。回退到 `card-background-color`。 |
| `ha-card-border-radius` | 圆角的圆度 |
| `ha-card-border-width`, `ha-card-border-color` | 边框 |
| `ha-card-box-shadow` | 阴影。默认没有。 |
| `ha-card-header-color`, `ha-card-header-font-size` | 卡片的标题 |

实体状态的颜色也有变量，比如 `state-light-active-color` 或 `state-lock-locked-color`。它们全部位于[实体状态（entity states）](https://www.hasscn.top/contributors/marketplace/reference/theme-variables/#entity-states)之下。

### 设计令牌

较新的组件使用[设计令牌（design token）](https://www.hasscn.top/contributors/glossary/design-token/)，其名称以 `ha-` 开头。它们的颜色并不来自 `primary-color`。例如，一个开关的颜色来自 `ha-color-fill-primary-normal-resting`，它指向 `ha-color-primary-90`，即主色板中的一级。因此，只设置 `primary-color` 的主题会让这些组件保持默认的蓝色。

要让它们也使用你的颜色，请设置主色板：十一个层级，从 `ha-color-primary-05`（最暗）到 `ha-color-primary-95`（最亮）。

```yaml title="themes/nordic.yaml"
Nordic:
  primary-color: "#5e81ac"
  ha-color-primary-05: "#0d1520"
  ha-color-primary-10: "#18263a"
  ha-color-primary-20: "#25384f"
  ha-color-primary-30: "#3a5577"
  ha-color-primary-40: "#5e81ac"
  ha-color-primary-50: "#7896bb"
  ha-color-primary-60: "#90a9c8"
  ha-color-primary-70: "#a9bdd5"
  ha-color-primary-80: "#c4d2e3"
  ha-color-primary-90: "#dfe7f0"
  ha-color-primary-95: "#eff3f8"
```

`ha-color-primary-40` 是默认主题中 `primary-color` 的值，所以从这里开始。语义令牌（semantic token），比如 `ha-color-fill-primary-normal-resting`，会自行在深色模式下选择其他层级。这些令牌及其默认值在 Design 区域的[颜色（color）](https://www.hasscn.top/contributors/design/foundations/color/)页面上。

默认主题会为用户做这件事：当用户在个人资料中选择自己的主色时，前端会根据它计算出整个色板。自定义主题得不到这样的帮助，必须自己设置色板。

### RGB 变体

有些组件需要带透明度的颜色，会使用变量的 RGB 变体，比如 `rgb-primary-color`。当你把一个变量设置为十六进制颜色（如 `"#5e81ac"`）时，前端会自动为它创建 RGB 变体。对于其他格式的颜色，比如 `rgb(94, 129, 172)`，你需要自己设置 RGB 变体，用三个数字表示：

```yaml
Nordic:
  primary-color: "rgb(94, 129, 172)"
  rgb-primary-color: "94, 129, 172"
```

### 变量会变化

前端不承诺哪些变量会一直保留。变量可能会在任何版本中被重命名或停止使用。请用每个 beta 版本测试你的主题。

## 浅色和深色

主题可以在 `modes` 之下为浅色和深色模式设置不同的值：

```yaml title="themes/nordic.yaml"
Nordic:
  primary-color: "#5e81ac"
  accent-color: "#d08770"
  modes:
    light:
      primary-background-color: "#e5e9f0"
      card-background-color: "#eceff4"
      primary-text-color: "#2e3440"
    dark:
      primary-background-color: "#2e3440"
      card-background-color: "#3b4252"
      primary-text-color: "#eceff4"
```

`modes` 之外的变量在两种模式下都适用。`modes` 至少需要 `light` 或 `dark` 中的一个。前端对它的处理方式：

- 同时有 `light` 和 `dark` 时，主题会跟随用户或其设备的设置。
- 只有 `dark` 时，主题始终是深色。没有 `dark`，或者完全没有 `modes` 时，主题始终是浅色。
- 在深色模式下，前端先应用它自己的深色配色，然后是你的变量，最后是你的 `dark` 值。你只需要设置你想改变的部分。

## 测试

1. 把你的主题文件复制到配置的 `themes` 文件夹中，与 `configuration.yaml` 放在一起。
2. 运行 `frontend.reload_themes` 动作，或者重启 Home Assistant。有错误的主题不会加载，日志中会说明原因。
3. 在你的个人资料中选择你的主题。如果你的主题同时支持浅色和深色，也在那里切换一下。
4. 浏览用户最常看到的地方：一个包含多种卡片的仪表盘、一个更多信息对话框、设置页面，以及一个带输入框的表单。
5. 检查文本在每个背景上都清晰可读。[无障碍（accessibility）](https://www.hasscn.top/contributors/design/foundations/accessibility/)页面列出了内置主题所满足的对比度，以及应该达到的目标。

也要在手机上检查：窄屏布局对页眉和侧边栏的显示方式不同。

## 打包

把文件放在你仓库的 `themes` 文件夹中：

```text
themes/nordic.yaml
hacs.json
README.md
```

Marketplace 会把你 `themes` 文件夹中的所有内容安装到用户配置的 `themes/<name of your theme file>/` 中，并重新加载主题。在它宣布安装完成之前，它会检查它安装的每个 YAML 文件：

- 必须是不带标签（tag）的有效 YAML。`!include`、`!secret` 和其他标签都会被拒绝：主题会提供给每个用户，而标签可能拉取任意文件。
- 必须通过与 `configuration.yaml` 中主题相同的校验。一个损坏的主题会导致 Home Assistant 在下次启动时无法加载其配置。

把截图放在你的 README 中，包括浅色和深色：目录会检查主题的 README 中是否有图片。[仓库结构（repository structure）](https://www.hasscn.top/contributors/marketplace/reference/repository-structure/#themes)中有详细说明，带有 `category: "theme"` 的 [HACS action](https://github.com/hacs/action) 会对此进行检查。
