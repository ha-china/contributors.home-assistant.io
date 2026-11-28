# 合并（Merge）

> 将拉取请求（pull request）中的更改纳入其提交目标仓库。被合并（merged）意味着你的更改已被接受。

Source: https://www.hasscn.top/contributors/glossary/merge/

- Also: merged, merging, merge conflict

只有维护者（maintainer）才能合并拉取请求。一旦合并，GitHub 会将其标记为 **Merged**。接下来会发生什么取决于仓库：对 `current` 分支上文档的修复会在网站重新构建后立即在 home-assistant.io 上生效，而对代码的更改则会在下一个版本发布时到达用户手中。

当你的分支和基础分支修改了同一个文件中相同的行时，就会发生合并冲突（merge conflict），此时 Git 无法自行将它们合并。必须有人来选择保留哪个版本。GitHub 可以在浏览器中解决简单的冲突，即使用拉取请求页面上的 **Resolve conflicts** 功能。

## Related terms

- [拉取请求（Pull request）](https://www.hasscn.top/contributors/glossary/pull-request/): 在 GitHub 上将更改合并到代码仓库的请求，合并前会先进行审查。
- [维护者（Maintainer）](https://www.hasscn.top/contributors/glossary/maintainer/): 能够批准并合并仓库中拉取请求（pull request）的贡献者。
- [分支（Branch）](https://www.hasscn.top/contributors/glossary/branch/): 仓库中一条独立的更改线，让你可以在不影响主版本的情况下进行开发。
