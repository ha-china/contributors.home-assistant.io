# 记录设置参数

> 白银级规则 docs-installation-parameters：文档描述设置过程中要求填写的每个字段。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-installation-parameters/

这是一条白银级（Silver）规则。在 `quality_scale.yaml` 中，它被称为 `docs-installation-parameters`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成（integration）页面必须描述用户在设置集成时填写的每个字段。对于每个字段，请说明它是什么，以及用户可以在哪里找到该值。

## 为什么重要

没有什么比设置表单要求填写你没有的东西更令人沮丧的了。“本地访问令牌”（local access token）？从哪里获取？当文档列出每个字段以及在哪里找到它时，用户就可以在开始之前准备好所有内容，并一次性完成设置。

## 示例

对于通过 UI 设置的集成，请在标准配置文本之后添加一个 `configuration_basic` 块。标签应与设置表单中显示的完全一致：

```markdown
{% include integrations/config_flow.md %}

{% configuration_basic %}
Host:
  description: "The IP address of your bridge. You can find it in your
    router, or in the app under **Bridge settings** > **Local API**."
Local access token:
  description: "The local access token of your bridge. You can find it
    in the app under **Bridge settings** > **Local API**."
{% endconfiguration_basic %}
```

对于在 YAML 中设置的集成，请改用 `configuration` 块，它还会列出变量是否为必填项及其类型。两种块的说明请参阅[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/#the-configuration-block)，如何提交文档拉取请求（pull request）请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)。

## 如何检查

此规则在代码审查和文档拉取请求的审查中进行检查。

## 例外情况

如果集成在设置过程中不要求填写任何内容，则此规则不适用。

## 相关规则

- [docs-configuration-parameters](https://www.hasscn.top/contributors/core/quality-scale/docs-configuration-parameters/)：记录配置选项。
- [docs-installation-instructions](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-instructions/)：记录安装步骤。
