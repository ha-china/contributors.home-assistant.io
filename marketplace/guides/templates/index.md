# 发布模板宏

> 分享可供他人导入到自己模板中的 Jinja 宏，以单个模板文件的形式由 Marketplace 安装到 custom_templates 中。

Source: https://www.hasscn.top/contributors/marketplace/guides/templates/

[模板（template）](https://www.hasscn.top/contributors/glossary/template/)文件存放 Jinja 宏：可复用的模板片段，其他人可以将其导入到自己的模板中，用于自动化、脚本和模板实体。宏的工作方式以及用户如何导入它们，请参阅 home-assistant.io 上的[自定义模板与宏](https://www.home-assistant.io/docs/templating/custom-templates/)。

这是 Marketplace 中最小的一种类型：只有一个文件。目录和 HACS action 将其称为 `template`。

## 文件

将你的宏写在一个 `.jinja` 文件中：

```jinja title="battery.jinja"
{% macro battery_icon(entity_id) %}
{% set level = states(entity_id) | int(0) %}
{{ 'mdi:battery-alert' if level < 20 else 'mdi:battery' }}
{% endmacro %}
```

用户通过你的文件名来导入宏：

```jinja
{% from 'battery.jinja' import battery_icon %}
{{ battery_icon('sensor.front_door_battery') }}
```

这意味着你的文件名会成为人们使用它的一部分。请选择一个不太可能与他人冲突的名称，并且之后不要重命名。当 `filename` 发生变化时，Marketplace 会在下次更新时删除旧文件，所有导入它的模板都会失效。

## 打包

将文件放在仓库的根目录，并在 `hacs.json` 中通过 `filename` 指定它的名称：

```text
battery.jinja
hacs.json
README.md
```

```json title="hacs.json"
{
  "name": "Battery macros",
  "filename": "battery.jinja"
}
```

当 `filename` 指定的不是根目录下的 `.jinja` 文件时，Marketplace 会拒绝该模板仓库。它只安装这一个文件，安装到用户配置的 `custom_templates` 文件夹中，并重新加载自定义模板，因此立即可用。

还有一些额外的规则，因为 Home Assistant 在启动时会读取 `custom_templates` 中的每一个文件：

- 文件必须是 UTF-8 编码。Home Assistant 无法解码的文件会阻止它启动。
- 文件必须小于 5 MiB。Home Assistant 会跳过更大的文件。
- 模板不支持 `zip_release`：压缩包会解压到所有模板共享的文件夹中。
- 两个仓库不能安装同名文件。Marketplace 会拒绝第二个。

HACS 要求模板使用 GitHub releases。请为每个版本发布一个 release。参见[发布与更新](https://www.hasscn.top/contributors/marketplace/guides/releases/)。

## 在你的仓库中检查

在每次推送和拉取请求（pull request）时，使用 `category: "template"` 运行 [HACS action](https://github.com/hacs/action)。在 README 中添加几个宏的使用示例：这是用户决定是否想要使用它时阅读的内容。
