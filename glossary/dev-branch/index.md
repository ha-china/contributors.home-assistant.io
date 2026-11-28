# Dev 分支

> 许多 Home Assistant 仓库（如 Home Assistant Core 和前端）中进行开发的分支。Pull request 会合并到该分支。

Source: https://www.hasscn.top/contributors/glossary/dev-branch/

- In code: `dev`
- Also: dev, nightly

`dev` 分支包含最新的代码，每夜构建（nightly builds）就是基于它生成的。已发布的版本则存放在另一个分支上，例如 Home Assistant Core 中的 `master`。一些仓库改用 `main` 进行开发，例如 Supervisor 和 Android 应用。

home-assistant.io 上的文档工作方式有所不同：`current` 是读者当前看到的内容，而 `next` 则收集下一个版本将发布的文档。

## Related terms

- [发布（Release）](https://www.hasscn.top/contributors/glossary/release/): Home Assistant 的新版本。每月第一个星期三发布一个新版本，期间还会有补丁发布。
- [拉取请求（Pull request）](https://www.hasscn.top/contributors/glossary/pull-request/): 在 GitHub 上将更改合并到代码仓库的请求，合并前会先进行审查。
