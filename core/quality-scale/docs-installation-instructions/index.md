# 记录安装步骤

> 青铜规则 docs-installation-instructions：文档包含分步设置说明，并列出前提条件。

Source: https://www.hasscn.top/contributors/core/quality-scale/docs-installation-instructions/

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `docs-installation-instructions`。

[home-assistant.io](https://www.home-assistant.io/) 上的集成页面必须逐步说明如何设置集成。如果在设置之前还需要执行某些操作，例如创建账户、安装应用程序或在设备上启用本地 API，页面应将这些列为前提条件。

## 为什么重要

设置是用户对您的集成的最初体验。如果设备需要先修改某项设置，而文档中却没有说明，用户就会遇到无法连接的配置流程（config flow），并且不知道原因。清晰的说明（包括需要做哪些准备）可以避免这种挫败感，也能减少大量的支持问题。

## 示例

将前提条件列为编号步骤，然后在设置部分使用标准的配置流程 include：

```markdown
## Prerequisites

1. Install the **MyProduct** app on your phone, and create an account.
2. Add your device in the app.
3. In the app, go to **Settings** and turn on **Local API**.

{% include integrations/config_flow.md %}
```

该 include 会添加一个 [My link](https://www.hasscn.top/contributors/glossary/my-link/) 徽章，`{% my config_flow_start badge domain=domain %}`，它会在读者自己的 Home Assistant 中打开您集成的配置流程。您无需自己添加该徽章。

有关其在页面中的位置，请参阅[编写集成文档](https://www.hasscn.top/contributors/writing/guides/integration/)和[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)。

## 如何检查

通过评审进行检查。文档拉取请求（pull request）的评审者会阅读这些说明，理想情况下还会亲自按照说明操作。

## 例外情况

此规则没有例外情况。

## 相关规则

- [docs-installation-parameters](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-parameters/)：记录设置参数。
- [docs-removal-instructions](https://www.hasscn.top/contributors/core/quality-scale/docs-removal-instructions/)：记录如何移除集成。
