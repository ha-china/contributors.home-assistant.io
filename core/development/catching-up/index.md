# 保持分支最新

> 将 Home Assistant Core 的 dev 分支的最新更改合并到你的分支，并解决冲突。

Source: https://www.hasscn.top/contributors/core/development/catching-up/

`dev` 分支更新很快。如果你的工作需要较长时间，或者你的 pull request 正在等待审核，请不时引入最新的更改。这样可以避免冲突，以及只有当你的更改与最新代码相遇时才会出现的问题。

一旦你的 pull request 已创建，请使用 `git merge`，而不是 `git rebase`。rebase 会重写审核者已经看过的提交。

## 合并最新的 dev

确保你已将 Home Assistant 仓库添加为名为 `upstream` 的远程仓库。如果你按照[环境搭建](https://www.hasscn.top/contributors/core/development/environment/)操作过，就已经有了。否则，请添加它：

```shell
git remote add upstream https://github.com/home-assistant/core.git
```

然后，在你的分支上执行：

```shell
git fetch upstream dev
git merge upstream/dev
```

## 解决冲突

如果 Git 报告了冲突：

1. 运行 `git status` 查看哪些文件存在冲突。
2. 编辑每个文件，解决 `<<<<<<<` 和 `>>>>>>>` 标记之间的内容。
3. 使用 `git add` 添加已解决的文件。
4. 使用 `git commit` 完成合并。默认的提交信息即可。

再次运行测试：没有冲突的合并仍可能破坏你的代码。

## 推送

```shell
git push
```

如果 Git 提示上游分支的名称与你的分支名称不匹配，说明你的分支仍在跟踪 `upstream/dev`。先用 `git push -u origin HEAD` 推送一次，之后普通的 `git push` 和 `git pull` 就会使用你的 fork 了。

如果推送被拒绝，说明在此期间有人向你的分支推送了内容。可能是你自己在另一台电脑上操作，也可能是审核者应用了某条建议。先拉取这些更改，再推送：

```shell
git pull --no-rebase
git push
```

## 确保结果干净

如果你的 pull request 突然显示了其他人的提交，说明合并出了问题。包含无关提交的 pull request 无法被审核。最简单的解决办法是从最新的 `dev` 创建一个新分支，只包含你的更改，然后创建一个新的 pull request。
