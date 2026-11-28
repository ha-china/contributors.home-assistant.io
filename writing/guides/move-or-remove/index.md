# 移动、重命名或删除页面

> 文档页面会被各种地方链接引用。这里介绍如何在不破坏这些链接的情况下进行修改。

Source: https://www.hasscn.top/contributors/writing/guides/move-or-remove/

文档页面会被论坛帖子、博客文章、其他网站以及 Home Assistant 本身链接。当 URL 发生变化时，这些链接应该保持有效。

## 移动或重命名页面

在 `source/_redirects` 中添加一条从旧 URL 到新 URL 的重定向：

```text
/integrations/old_name  /integrations/new_name  301
```

当你把某个章节移动到另一个页面时也是如此：将旧地址重定向到内容现在所在的位置。

## 删除集成页面

当某个集成（integration）从 Home Assistant 中移除，或整个集成被弃用时，其文档也应一并删除：

1. 从 `source/_integrations` 中删除该页面，如果它包含触发、条件和动作，也一并删除 `source/_triggers`、`source/_conditions` 和 `source/_actions` 中的相应内容。
2. 从[品牌仓库](https://github.com/home-assistant/brands)中移除其图标和标志。
3. 从 `CODEOWNERS` 文件中移除其条目。
4. 在 `source/_redirects` 中为已移除的集成添加一条重定向。所有已移除的集成都指向同一个页面，该页面向访客解释发生了什么：

   ```text
   /integrations/old_name  /more-info/removed-integration  301
   ```

## 已弃用的功能

不要等到功能被移除才行动。[文档仓库](https://github.com/home-assistant/home-assistant.io)中的规则是："当某个功能被弃用或某个集成从 Home Assistant 中移除时，删除其文档。"

- 如果某个功能被弃用，请从集成页面中删除其章节。
- 不要在文档中添加弃用声明。
- 如果整个集成被弃用，请按照[删除集成页面](https://www.hasscn.top/contributors/writing/guides/move-or-remove/#remove-an-integration-page)中的说明删除其页面。
