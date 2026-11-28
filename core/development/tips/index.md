# 技巧与窍门

> 一些让 Home Assistant Core 开发更轻松的小技巧，从堆叠拉取请求（pull request）到在自己的系统上测试更改。

Source: https://www.hasscn.top/contributors/core/development/tips/

这里收集了一些值得了解、但不需要单独成页的内容。发现了这里缺少的技巧？请使用本页底部的编辑链接添加它。

## 将大工作量拆分为一系列拉取请求

现代化改造一个旧的集成（integration）时，很容易想一次性完成。不要这样做。请将工作拆分为相互独立的更改，并逐个提交。不要在一个拉取请求中混入清理工作和新功能，也不要在一个拉取请求中解决多个问题。一次性提交大量代码的拉取请求不会成为评审的优先事项，甚至可能被关闭。

为了在第一个拉取请求处于评审期间时继续工作，请基于第一个分支创建下一个分支：

1. 从当前拉取请求的分支创建下一个拉取请求的分支，并继续在其中编写代码。
2. 当当前拉取请求根据评审反馈收到新的提交时，将它们合并到下一个分支中。
3. 一旦当前拉取请求被合并，用最新的 `dev` 更新下一个分支，使其只包含自己的更改。
4. 打开下一个拉取请求，然后重复上述步骤。

在第一个拉取请求合并之前，不要打开下一个拉取请求。依赖未合并工作的拉取请求对评审者来说无法着手处理。

## 在你的生产系统上尝试更改

你可以在自己的 Home Assistant 上运行修改过的核心集成，方法是将其作为自定义集成（custom integration）加载：

1. 将集成的文件夹复制到 `/config/custom_components/`。
2. 在其 `manifest.json` 中添加一个 `version`，例如 `"version": "0.0.0"`。自定义集成需要这个字段。
3. 如果集成包含 `strings.json`，请在你的开发环境中运行 `python3 -m script.translations develop --integration example`，并将 `example` 替换为你的域名。将其生成的 `translations/en.json` 复制到已复制的文件夹中。直接复制 `strings.json` 只有在它不包含 `[%key:...]` 引用时才有效，因为 Home Assistant 不会为自定义集成解析这些引用。
4. 重启 Home Assistant。

自定义集成会取代具有相同域名的内置集成，但在安全模式和恢复模式下除外，这两种模式会跳过自定义集成。完成后请将其移除，否则你会永远停留在那个版本上。

## 尝试某个库的新版本

要在库发布之前在 Home Assistant 中测试对它的更改，请参阅[在 Home Assistant 中试用你的库](https://www.hasscn.top/contributors/core/integrations/api-library/#try-your-library-in-home-assistant)。

## 你的新配置流程没有显示

前端会进行激进的缓存。当你添加了配置流程（config flow）但集成没有出现在列表中时，请先检查日志中是否有错误。如果没有错误，请对浏览器进行强制刷新。

## 附上链接寻求帮助

当你在 [Discord](https://www.home-assistant.io/join-chat/) 上提出技术问题时，请在 [**#coding-support**](https://discord.com/channels/330944238910963714/1257019582112334014) 中开启一个线程，先将你的工作推送到一个分支，然后分享链接。能看到你代码的人能更快地帮助你。不要将大段代码粘贴到线程中：它们难以阅读。

## 参考优秀的示例

[集成质量标准](https://www.hasscn.top/contributors/core/quality-scale/)中 Platinum 和 Gold 等级的集成维护良好，是了解某项功能如何实现的绝佳参考。等级信息位于集成的 `manifest.json` 中。

## 生成一个新集成

脚手架脚本会问你几个问题，然后创建一个新集成的文件，包含配置流程和测试作为起点：

```shell
python3 -m script.scaffold integration
```

在 Visual Studio Code 中，这就是 **Create new integration** 任务。[构建集成](https://www.hasscn.top/contributors/core/integrations/)解释了它会生成哪些内容。
