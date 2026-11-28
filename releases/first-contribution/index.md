# 你的第一次 Beta 测试

> 加入 Beta 渠道，比其他人提前一周运行下一个版本，并报告出现的问题。

Source: https://www.hasscn.top/contributors/releases/first-contribution/

每个月，下一个版本的 Beta 版会在正式发布前一周推出。在这一周里发现的每一个 Bug，都不会影响到其他所有人的家庭。测试 Beta 版是你能做的最有价值的事情之一，而你只需要一个 Home Assistant 安装即可完成。

## 1. 了解你要参与的事情

Beta 版已接近完成，但还不算完全就绪。大多数时候它运行正常，但有时也会出问题。在加入之前：

- 在一个出现问题只是小麻烦而非灾难的安装上进行测试。如果你的供暖或报警系统依赖 Home Assistant，请三思，或者在第二个安装上进行测试。
- 确保你有最近的备份。如果你允许的话，Home Assistant OS 会在每次更新前自动创建备份。
- 预计一周内会有多个 Beta 版本。修复会随着问题的发现陆续推出。

## 2. 加入 Beta 渠道

在 Home Assistant OS 上：

1. 前往 **设置** > **系统** > **更新**。
2. 在右上角，打开三个点的菜单。
3. 选择 **加入 Beta 渠道**。
4. 安装出现的更新。如果没有出现，请在同一菜单中选择 **检查更新**。

你也可以通过命令行操作：

```bash
ha supervisor options --channel beta
ha supervisor reload
ha core update --backup
```

运行 Home Assistant Container？使用镜像的 `beta` 标签，并重新创建容器：

```bash
docker pull ghcr.io/home-assistant/home-assistant:beta
```

## 3. 阅读 Beta 版发布说明

[Beta 版发布说明](https://rc.home-assistant.io/latest-release-notes/)介绍了新内容，并列出了不向后兼容的变更。请先阅读不向后兼容的变更：它们告诉你哪些地方可能需要你自己做出调整。然后试用你关心的新功能。

## 4. 报告出现的问题

发现了问题？在报告之前：

- 确认这是新问题。它在当前稳定版中是否正常工作？
- 搜索 Issue 跟踪器。可能已经有人报告过了。如果是这样，请把你所知的信息补充到那个 Issue 中，而不是新建一个。

然后在正确的仓库中打开 Issue：

- 集成（integration）、自动化和核心：[core issues](https://github.com/home-assistant/core/issues)。
- 界面、仪表盘（dashboard）和卡片：[frontend issues](https://github.com/home-assistant/frontend/issues)。
- 文档和发布说明：[home-assistant.io issues](https://github.com/home-assistant/home-assistant.io/issues)。

你需要一个免费的 GitHub 账户才能打开 Issue。不熟悉 GitHub？请参阅[无需成为开发者也能使用 GitHub](https://www.hasscn.top/contributors/start/github/)。

请完整填写 Issue 模板。注明你运行的 Beta 版本，例如 `2026.11.0b2`、你的预期、实际发生的情况，以及相关的日志信息。在 core 中，请链接该集成的文档页面，并附上其诊断文件（如果有的话）：模板会要求提供这两项。一份清晰的报告能更快得到修复。

### 报告之后会发生什么

- **标签和集成负责人。** 在 core 中，Home Assistant 机器人会根据你提到的集成添加 `integration:` 标签，并提及该集成的[集成负责人](https://www.hasscn.top/contributors/glossary/integration-owner/)，这样最了解它的人就会收到通知。
- **重复检查。** 一旦 Issue 上有了集成标签，core 中的一个工作流会查找类似的未关闭 Issue。如果找到，它会在评论中链接它们，并添加 `potential-duplicate` 标签。请查看一下：如果其中一个是你的问题，请继续在那里跟进。
- **提问。** 集成负责人或维护者可能会要求提供更多细节，例如日志或诊断信息，或者将 Issue 标记为 `needs-more-information`。在你能回答时请回复，并继续测试下一个 Beta 版本。
- **修复。** 修复最初是一个普通的 Pull Request。在 Beta 周期间，它会进入后续的某个 Beta 版本。正式发布后，它会进入补丁版本。请参阅[让修复进入补丁版本](https://www.hasscn.top/contributors/releases/guides/patch-releases/)。

core 或 frontend 中连续 90 天没有任何活动的 Issue 会被标记为 `stale`，如果之后 7 天内仍无动静，则会被关闭。一条评论就足以让它保持打开状态。

> [!TIP]
> 不确定某个问题是否是 Bug，或者不知道如何报告？请在 [Home Assistant Discord 服务器](https://www.home-assistant.io/join-chat)的 [**#beta**](https://discord.com/channels/330944238910963714/427516175237382144) 频道提问。Beta 周期间，其他测试者和开发者都在那里。

## 5. 留下或离开

正式版发布时，你会像收到普通更新一样收到它。你可以继续留在 Beta 渠道等待下个月，也可以在同一菜单中选择 **离开 Beta 渠道** 离开。离开不会自动降级：当下一个稳定版比你当前运行的版本更新时，你才会收到它。

## 接下来做什么

- 阅读[版本发布是如何运作的](https://www.hasscn.top/contributors/releases/how-it-works/)，了解各阶段会发生什么。
- 在 Beta 版发布说明中发现了错别字或不清楚的地方？这也值得修复。请参阅[发布说明与发布派对](https://www.hasscn.top/contributors/releases/guides/release-notes/)。
