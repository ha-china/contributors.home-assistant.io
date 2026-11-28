# 编写并分享蓝图

> 编写一个带有良好输入项和选择器的蓝图，进行测试，在不破坏他人已有配置的前提下进行修改，并分享它。

Source: https://www.hasscn.top/contributors/marketplace/guides/blueprints/

[蓝图（blueprint）](https://www.hasscn.top/contributors/glossary/blueprint/)是一种自动化、脚本或模板实体，其中留有空白供用户填写。一个蓝图可以被多次使用：一次用于走廊，一次用于浴室，每次使用各自的设备和设置。

蓝图并不在 Marketplace 中。用户通过 URL 导入它们，Home Assistant 会记住该 URL 以获取新版本。[工作原理](https://www.hasscn.top/contributors/marketplace/how-it-works/#blueprints)介绍了用户可以从哪些地方导入。刚接触蓝图？[你的第一个贡献](https://www.hasscn.top/contributors/marketplace/first-contribution/)会从头到尾带你完成第一个蓝图。

完整的模式（schema）以及每个选择器（selector）都在 home-assistant.io 上为用户提供了文档：[蓝图模式](https://www.home-assistant.io/docs/blueprint/schema/)和[选择器](https://www.home-assistant.io/docs/blueprint/selectors/)。本页讲的是如何编写一个让他人乐于使用并持续使用的蓝图。

## 蓝图块

每个蓝图都以一个 `blueprint` 块开始，随后是其所属域（domain）的配置：自动化的触发器、条件和动作，脚本的序列，或模板实体的配置。

```yaml
blueprint:
  name: "Notify when a door stays open"
  description: >
    Sends a notification when a door has been open for too long.
    Needs a door sensor and a device with the companion app.
  domain: automation
  author: "Your name"
  homeassistant:
    min_version: "2024.6.0"
  input:
    door:
      name: "Door"
      selector:
        entity:
          filter:
            - domain: binary_sensor
              device_class: door
```

| 键 | |
| --- | --- |
| `name` | 必填。简短，并说明它的用途。 |
| `domain` | 必填。`automation`、`script` 或 `template`。 |
| `description` | 蓝图的功能，以及用户需要什么。支持 Markdown。导入对话框和编辑器中会显示它。 |
| `author` | 你的名字，或你的论坛用户名。 |
| `homeassistant` | `min_version`：你的蓝图所支持的最早的 Home Assistant 版本，格式为 `major.minor.patch`。 |
| `input` | 空白项。见下文。 |
| `source_url` | 不要填写。Home Assistant 会将其设置为用户导入时使用的 URL。 |

## 输入项

每个输入项都有一个键，你可以在 `!input` 中使用它，此外还有这些选项：

- `name` 和 `description`：用户在表单中看到的内容。
- `selector`：用户获得的控件。如果没有选择器，用户只会得到一个纯文本框，只能猜测该输入什么。
- `default`：使输入项变为可选。没有默认值时，用户必须填写它。

在配置中使用 `!input <key>` 来引用每个输入项。如果蓝图使用了未定义的 `!input`，Home Assistant 会拒绝它。

输入项不是模板变量。要在模板中使用输入项，请先将其定义为变量：

```yaml
variables:
  door_entity: !input door

actions:
  - action: notify.notify
    data:
      message: "{{ state_attr(door_entity, 'friendly_name') }} is still open."
```

### 选择合适的选择器

选择器决定了你的蓝图是否易于使用。以下几点会有所帮助：

- 对实体选择器按 `domain` 和 `device_class` 进行过滤，让用户只看到有意义的实体。一个列出全屋所有传感器的门传感器选择器就像一道谜题。
- 对动作所作用的对象使用 `target` 选择器。这样用户可以选择实体、设备、区域（area）、楼层或标签（label），而你只需将其直接传递给 `target`。
- 为 `number` 输入项设置合理的 `min`、`max` 和 `unit_of_measurement`。
- 对用户可以开启或关闭的可选行为使用 `boolean`。

[选择器](https://www.home-assistant.io/docs/blueprint/selectors/)页面列出了所有选择器，设计区的[选择器组件](https://www.hasscn.top/contributors/design/components/selector/)展示了每个选择器的外观。

### 将输入项分组到分区中

当输入项较多时，将它们分组到分区（section）中。分区有自己的 `input` 键，还可以选择性地包含 `name`、`icon`、`description` 和 `collapsed`：

```yaml
blueprint:
  name: "Notify when a door stays open"
  domain: automation
  homeassistant:
    min_version: "2024.6.0"
  input:
    door:
      name: "Door"
      selector:
        entity:
          filter:
            - domain: binary_sensor
              device_class: door
    advanced:
      name: "Advanced"
      icon: mdi:cog
      collapsed: true
      input:
        wait_time:
          name: "Wait time"
          default: 300
          selector:
            number:
              min: 30
              max: 3600
              unit_of_measurement: seconds
```

分区只改变表单的外观。你仍然通过输入项自身的键来使用它们，例如 `!input wait_time`，因此每个键在所有分区中都必须是唯一的。分区需要 Home Assistant 2024.6 或更新版本：使用它们时请设置 `min_version`。

## 模板实体蓝图

`domain: template` 的蓝图描述一个模板实体。用户在 `configuration.yaml` 中通过 `use_blueprint` 进行设置：

```yaml
template:
  - use_blueprint:
      path: homeassistant/inverted_binary_sensor.yaml
      input:
        reference_entity: binary_sensor.front_door
    name: "Front door closed"
    unique_id: front_door_closed
```

Home Assistant 自带的[反转二进制传感器](https://github.com/home-assistant/core/blob/dev/homeassistant/components/template/blueprints/inverted_binary_sensor.yaml)是一个完整的示例。其他内置蓝图也是很好的示例：[自动化](https://github.com/home-assistant/core/tree/dev/homeassistant/components/automation/blueprints)和[脚本](https://github.com/home-assistant/core/tree/dev/homeassistant/components/script/blueprints)。

## 测试它

按照用户获取蓝图的方式进行测试：从你将要分享的 URL 导入它。

1. 前往 **设置** > **自动化与场景** > **蓝图**，选择 **导入蓝图**，并输入你的 URL。
2. 基于它创建一个自动化或脚本。先只填写必填的输入项，以便测试你的默认值。
3. 在你的家中让场景实际发生，当自动化没有按预期运行时，检查自动化的追踪（trace）信息。
4. 再创建第二个，将每个输入项都设置为不同的值。

然后考虑边界情况：一个 `unavailable` 的传感器、一个留空的可选输入项、一个目标是区域而非实体的目标，以及当自动化仍在运行时触发器再次触发会发生什么。最后一点就是自动化的 `mode`：对于类似人体感应灯的场景，`restart` 通常是正确的选择。

## 在不破坏它的前提下修改它

每个基于你蓝图构建的自动化都使用用户导入的那份副本。当用户选择 **重新导入蓝图** 时，Home Assistant 会用你的新版本覆盖旧版本，所有基于它构建的自动化都会立即使用新版本。用户没有机会先填写任何新的内容。因此：

- 永远不要重命名输入项。人们构建的自动化仍然以旧名称传递值。在新名称下，该输入项就缺失了。
- 为每个新增输入项提供 `default`。Home Assistant 会拒绝缺少无默认值输入项的自动化，因此如果不提供默认值，所有基于你蓝图构建的自动化都会停止工作。
- 不要改变输入项所期望的内容，比如它的选择器，或者把秒改成分钟。Home Assistant 不会将已存储的值与新选择器进行校验：旧值会原样传入。
- 当你开始使用 Home Assistant 的新功能时，提高 `min_version`。这样旧版本的用户会得到清晰的错误提示，而不是一个损坏的自动化。
- 对于较大的改动，以新的 URL 发布一个新蓝图。用户准备好后会自行迁移。

蓝图模式没有版本号。在你的论坛主题或仓库中说明改了什么、什么时候改的，以便用户知道何时需要重新导入。

## 分享它

用户导入所用的 URL 就是你的蓝图的标识：重新导入时会从那里获取。选定一个地方，并把蓝图一直放在那里。

- **社区论坛上的一个主题。** 将它发布在 [Blueprint Exchange](https://community.home-assistant.io/c/blueprints-exchange/53)。Home Assistant 会导入首帖中第一个包含蓝图的 YAML 代码块，因此要发布新版本时，请编辑该帖子。请遵循 [About Blueprints](https://community.home-assistant.io/t/about-blueprints/253788) 主题中的规则：每个蓝图一个主题、标题清晰、说明其功能和所需条件、在帖子中包含完整蓝图，以及一个导入徽章。
- **GitHub 上的一个文件。** 仓库会保留每次更改的历史记录，人们还可以提交 issue 和 pull request。分享默认分支上该文件的 URL，这样重新导入时就能获取最新版本。
- **一个 GitHub gist。** 快捷，适合小东西。

论坛主题和 GitHub 文件可以很好地配合：把蓝图放在 GitHub 上，用主题来讨论它。然后让 GitHub URL 成为导入徽章中使用的那个链接。

导入徽章是一个 [My link](https://www.hasscn.top/contributors/glossary/my-link/)：它会在读者自己的 Home Assistant 中打开导入对话框，并预填你的蓝图 URL。[My link 创建器](https://my.home-assistant.io/create-link/?redirect=blueprint_import)可以根据你的蓝图 URL 为你生成它。它会给你如下 Markdown：

```markdown
[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fgithub.com%2Fme%2Fmy-blueprints%2Fblob%2Fmain%2Fmotion_light.yaml)
```

`blueprint_url` 是你的蓝图的 URL，经过 URL 编码。已导入该蓝图的用户也可以从他们的蓝图列表中通过 **分享蓝图** 来分享它：这会创建同样的链接。

正在为某个集成（integration）编写文档？与集成页面配套的蓝图可以放在 home-assistant.io 上。参见[集成页面](https://www.hasscn.top/contributors/writing/reference/integration-page/)。
