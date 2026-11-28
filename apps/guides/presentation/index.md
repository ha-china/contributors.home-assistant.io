# 展示你的应用

> 用户在安装你的应用之前和之后所看到的内容。包括简介、文档、更新日志、图标、标志和翻译。

Source: https://www.hasscn.top/contributors/apps/guides/presentation/

如果你分享你的应用，它的展示效果决定了人们是否足够信任它并安装它。清晰的简介、诚实的文档和更新日志大有帮助。这些文件都不是必需的，但缺少它们的已发布应用会让人感觉不完整。

## 简介

应用文件夹中的 `README.md` 就是简介。应用商店会在应用安装之前将其显示在应用页面上。请保持简短：这个应用做什么，以及为什么有人会需要它。这也是人们在 GitHub 上浏览你的仓库时看到的内容。

## 文档

`DOCS.md` 是文档，显示在应用的**文档**标签页中。当出现问题时，用户会来这里查找，因此请涵盖：

- 如何安装和设置应用。
- 每个选项、它的作用以及示例。
- 用户需要在应用之外做的任何事情，比如设置集成（integration）。
- 已知的限制。
- 在哪里寻求帮助和报告错误。
- 应用的许可证。

如果你的应用需要比通常更多的权限，比如 `host_network` 或关闭保护模式，请在这里解释原因。用户会看到警告，他们理应知道原因。

## 更新日志

`CHANGELOG.md` 列出每个版本的变更。当有更新可用时，用户会看到它，并阅读它来决定是否立即更新。把最新的版本放在最上面，并清楚地标明不向后兼容的变更。[Keep a Changelog](https://keepachangelog.com/) 是一个值得遵循的良好格式。

## 图标和标志

| 文件 | 格式 | 大小 |
| --- | --- | --- |
| `icon.png` | PNG，正方形 | 建议 128 × 128 像素 |
| `logo.png` | PNG | 建议大约 250 × 100 像素，其他尺寸也可以 |

图标显示在应用商店和已安装应用列表中，标志显示在应用页面上。两者都是可选的。请确保它们在浅色和深色背景上都美观。

## 翻译

**配置**标签页会显示你的选项和端口。如果没有翻译，它会显示原始键名，比如 `log_level` 或 `8080/tcp`。在 `translations` 文件夹中为每种语言添加一个文件，为它们提供可读的名称和描述：

```yaml
# translations/en.yaml
configuration:
  log_level:
    name: "Log level"
    description: "How much detail to write to the log."
network:
  8080/tcp: "Web interface (not needed with ingress)"
```

参见[添加选项](https://www.hasscn.top/contributors/apps/guides/options/#translate-the-options)和[翻译文件格式](https://www.hasscn.top/contributors/apps/reference/files/#translation-file)。

## 阶段

并非每个应用都对所有人都适用。在 `config.yaml` 中设置 `stage`，告诉用户你的应用处于什么状态：

- `stable`：默认值。
- `experimental`：可以使用，但预计会有粗糙之处和变更。
- `deprecated`：不再维护。请在文档中为用户提供替代方案。

## 提供测试渠道

要让用户在其他人之前试用新版本，请将它们保存在一个单独的分支中。用户在 `#` 后面加上分支名称来添加你的仓库：

```text
https://github.com/me/my-apps#next
```

在该分支的 `repository.yaml` 中为仓库指定一个不同的 `name`，比如 "My apps (beta)"，以便用户在应用商店中区分它们。请在你的文档中提及这个测试渠道。
