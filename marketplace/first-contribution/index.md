# 分享你的第一个蓝图

> 把家里已经在正常运行的自动化改造成蓝图，自己导入测试，然后分享到 Blueprint Exchange。

Source: https://www.hasscn.top/contributors/marketplace/first-contribution/

最快的分享方式是[蓝图](https://www.hasscn.top/contributors/glossary/blueprint/)（blueprint）。你已经完成了最难的部分：一个在家里能正常工作的自动化。蓝图就是同一个自动化，只是把那些与你家相关的部分——比如用哪个传感器、哪盏灯——留空，让别人来填写。

这大约需要半小时。第 4 步需要一个 GitHub 账号。不需要编程。

如果你已经在 GitHub 上有卡片、主题或集成（integration）？直接跳到[发布要求](https://www.hasscn.top/contributors/marketplace/reference/repository-structure/)和 [HACS action](https://www.hasscn.top/contributors/marketplace/reference/validation/)。让检查变绿也是很好的第一步。

## 1. 挑选一个自动化

挑选一个你在用、而且能正常工作的自动化。小一点更好：一个触发器，一两个动作。比如“检测到有人走动时打开走廊的灯，两分钟后关闭”。

在自动化编辑器中打开它，选择三个点的菜单，然后选择 **Edit in YAML**。把 YAML 复制到文本编辑器中。

## 2. 添加 blueprint 块

在顶部添加一个 `blueprint` 块。它需要一个 `name` 和一个 `domain`。这里的 domain 是 `automation`：蓝图也可以为脚本和模板实体（entity）创建。

```yaml
blueprint:
  name: "Motion light with a timeout"
  description: >
    Turns on a light when motion is detected, and turns it off
    again when there has been no motion for a while.
  domain: automation
  author: "Your name"
```

删除你自动化的 `id` 和 `alias`。从你的蓝图创建的每个自动化都会有自己的这两个值。

## 3. 把特定的部分变成输入

每个与你家相关的实体 ID、区域（area）或数字都变成一个输入。在 `input` 下用[选择器](https://www.hasscn.top/contributors/glossary/selector/)（selector）定义每个输入，这样用户会得到正确的选择器，然后在自动化中用 `!input` 使用它：

```yaml
blueprint:
  name: "Motion light with a timeout"
  description: >
    Turns on a light when motion is detected, and turns it off
    again when there has been no motion for a while.
  domain: automation
  author: "Your name"
  input:
    motion_sensor:
      name: "Motion sensor"
      selector:
        entity:
          filter:
            - domain: binary_sensor
              device_class: motion
    light:
      name: "Light"
      selector:
        target:
          entity:
            - domain: light
    wait_time:
      name: "Wait time"
      description: "How long to keep the light on after the last motion."
      default: 120
      selector:
        number:
          min: 0
          max: 3600
          unit_of_measurement: seconds

mode: restart
max_exceeded: silent

triggers:
  - trigger: state
    entity_id: !input motion_sensor
    from: "off"
    to: "on"

actions:
  - action: light.turn_on
    target: !input light
  - wait_for_trigger:
      - trigger: state
        entity_id: !input motion_sensor
        from: "on"
        to: "off"
  - delay: !input wait_time
  - action: light.turn_off
    target: !input light
```

Home Assistant 会拒绝使用了未定义的 `!input` 的蓝图。每个带有 `default` 的输入对用户来说都是可选的。这个例子与 Home Assistant 自带的运动灯蓝图很接近，即 core 中的 [`motion_light.yaml`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/automation/blueprints/motion_light.yaml)。把它和你的放在一起对照阅读是个很好的检查方法。

## 4. 以 gist 的形式发布

1. 前往 [GitHub Gists](https://gist.github.com/)。
2. 以你的蓝图命名文件，以 `.yaml` 结尾，比如 `motion_light_timeout.yaml`。
3. 粘贴你的蓝图，并将 gist 创建为公开 gist。
4. 复制 gist 的 URL。

## 5. 自己导入测试

按照用户获取它的方式来测试：

1. 在 Home Assistant 中，前往 **Settings** > **Automations & scenes** > **Blueprints**。
2. 选择 **Import blueprint**，粘贴你的 gist 的 URL，然后选择 **Preview**。
3. 选择 **Import blueprint**。
4. 选择你的蓝图，然后选择 **Create automation**。
5. 填写输入，保存，并检查自动化是否按预期工作。

在 gist 中修复不能正常工作的部分，然后再次导入。Home Assistant 会询问是否覆盖你之前导入的蓝图。

当一切正常后，关闭你原来的自动化，以免两者争夺同一盏灯。

## 6. 分享它

把你的蓝图发布到 [Blueprint Exchange](https://community.home-assistant.io/c/blueprints-exchange/53)，即社区论坛的蓝图版块。先阅读它的 [About Blueprints](https://community.home-assistant.io/t/about-blueprints/253788) 主题。简而言之：

- 每个蓝图一个主题，标题要说明它的功能。
- 描述蓝图做什么，需要哪些设备。
- 在第一个帖子中用 YAML 代码块包含完整的蓝图。Home Assistant 可以直接从该主题导入。
- 添加一个导入徽章。在 [my.home-assistant.io](https://my.home-assistant.io/create-link/?redirect=blueprint_import) 上用你的主题 URL 创建一个。
- 从你自己的主题导入一次，以检查它是否正常工作。

就是这样：你分享了你的第一个蓝图。当人们使用它时，他们会在你的主题中提问并提出改进建议。[蓝图](https://www.hasscn.top/contributors/marketplace/guides/blueprints/)介绍了如何修改蓝图而不破坏人们基于它创建的自动化。
