# 创建并分享一个存储库

> 将你的应用放入一个 Git 存储库中，让用户添加到他们的应用商店，并让添加过程只需一步。

Source: https://www.hasscn.top/contributors/apps/guides/repository/

用户从存储库（repository）安装应用。存储库是一个在根目录下带有 `repository.yaml` 的 Git 存储库，每个应用对应一个文件夹。它可以容纳单个应用，也可以容纳数十个应用。

## 创建存储库

最快的入门方式是使用[示例应用存储库](https://github.com/home-assistant/apps-example)。在 GitHub 上选择 **Use this template**，你就能一次性获得一个应用、文档文件、一个 AppArmor 配置文件、一个 devcontainer 以及构建工作流。然后：

1. 重命名 `example` 文件夹，并在其 `config.yaml` 中将 `slug` 设置为相同的名称。
2. 将 `config.yaml` 中的 `image` 改为你自己的镜像仓库，例如 `ghcr.io/<your-username>/my-app`。
3. 修改所有指向 `home-assistant/apps-example` 的链接和名称。这包括 [`.github/workflows/build-app.yaml`](https://github.com/home-assistant/apps-example/blob/main/.github/workflows/build-app.yaml) 中的 `github.repository` 检查：在你修改之前，该工作流会在除示例存储库之外的任何存储库中跳过构建。
4. 更新 `repository.yaml`。

或者从头开始，使用以下目录结构：

```text
my-apps/
  my_app/
    config.yaml
    Dockerfile
    DOCS.md
    README.md
  repository.yaml
  README.md
```

`repository.yaml` 用于命名存储库及其维护者：

```yaml
name: "My apps"
url: "https://github.com/me/my-apps"
maintainer: "Jane Doe <jane@example.com>"
```

只有 `name` 是必需的。该文件也可以是 `repository.yml` 或 `repository.json`。如果没有这个文件，或者文件无效，Supervisor 将完全不加载该存储库。

Supervisor 会在存储库中的任意深度查找应用，因此你可以根据需要将它们分组放在文件夹中。隐藏文件夹以及名为 `rootfs` 的文件夹会被跳过。

## 将存储库添加到 Home Assistant

用户在应用商店中添加你的存储库：

1. 前往 **设置** > **应用**，然后选择 **安装应用**。
2. 在右上角的菜单中，选择 **存储库**。
3. 输入你的存储库的 URL，然后选择 **添加**。

你的应用随后会显示在应用商店中，位于一个以 `repository.yaml` 中的 `name` 命名的分区里。

URL 可以以 `#` 和分支名称结尾，例如 `https://github.com/me/my-apps#next`。此时 Supervisor 会使用该分支而不是默认分支。这就是你提供[测试版通道（beta channel）](https://www.hasscn.top/contributors/apps/guides/presentation/#offer-a-beta-channel)的方式。

Supervisor 使用 Git 克隆存储库，因此它不必位于 GitHub 上。设备可以访问的任何 Git URL 都可以使用。

## 让添加只需一步

[My 链接（My link）](https://www.hasscn.top/contributors/glossary/my-link/)会在用户自己的 Home Assistant 中打开正确的页面。`supervisor_add_addon_repository` 链接会打开添加应用存储库的对话框，并且你的 URL 已经预先填好。将它作为徽章放在你的 README 中：

```markdown
[![Open your Home Assistant instance and show the add app repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fme%2Fmy-apps)
```

将 `repository_url=` 后面经过 URL 编码的部分替换为你的存储库的 URL。[My 链接生成器](https://my.home-assistant.io/create-link/?redirect=supervisor_add_addon_repository)可以为你构建链接和徽章，并对 URL 进行编码。

要链接到某个应用的页面，请使用带有应用完整 slug（包括[存储库 ID](https://www.hasscn.top/contributors/apps/guides/repository/#the-repository-id)）的 `supervisor_app` 链接：`https://my.home-assistant.io/redirect/supervisor_app/?app=a1b2c3d4_my_app`。

## 存储库 ID

Supervisor 会为每个存储库分配一个 ID：即其 URL（如果包含 `#branch` 则一并计入）的小写 SHA-1 哈希值的前 8 个字符。你的应用会在其 slug 前面加上这个 ID，例如 `a1b2c3d4_my_app`，在内部网络上则显示为 `a1b2c3d4-my-app`。

由于 ID 来自 URL，因此来自不同分支或已重命名的存储库中的相同应用，对 Supervisor 而言是不同的应用。一旦有人开始使用，请保持 URL 稳定不变。

要查看你的存储库的 ID，可以在 Supervisor API 上调用 `GET /store/repositories`，或在终端中运行 `ha store`。

## 分享它

当你的存储库准备就绪后：

- 为存储库编写一个 README，简要描述每个应用，并附上[添加存储库的徽章](https://www.hasscn.top/contributors/apps/guides/repository/#make-it-one-step)。
- 在社区论坛的 [Share your Projects](https://community.home-assistant.io/c/projects/9) 分类中发布它。
- 留意 issue。你的应用的用户会在那里找到你。
