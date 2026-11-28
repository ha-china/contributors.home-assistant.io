# 在本地预览网站

> 在自己的电脑上运行 home-assistant.io，以便在分享之前查看较大的改动。

Source: https://www.hasscn.top/contributors/writing/guides/local-preview/

对于小的修复，拉取请求（pull request）上的 Deploy Preview 就足够了。对于较大的改动，比如新页面或重构的章节，在编写时就能在本地看到成果会更快。

## 使用 devcontainer

最简单的方法是使用带 devcontainer 的 Visual Studio Code。它会为你设置好一切，无需在电脑上安装 Ruby。

1. Fork [home-assistant.io 仓库](https://github.com/home-assistant/home-assistant.io)并在 Visual Studio Code 中打开它。
2. 收到提示时，在容器中重新打开该文件夹。
3. 打开命令面板并运行 **Tasks: Run Task** > **Preview**。
4. 在浏览器中打开 `http://localhost:4000`。

## 不使用 devcontainer

你需要 Ruby 和 Node.js。项目使用的版本记录在仓库的 [`.ruby-version`](https://github.com/home-assistant/home-assistant.io/blob/current/.ruby-version) 和 [`.nvmrc`](https://github.com/home-assistant/home-assistant.io/blob/current/.nvmrc) 文件中。需要 Node.js 是因为生成网站时也会构建其 Astro 部分。

1. 为你的系统安装 Ruby、Bundler 和 Node.js。你的 Linux 发行版自带的 Ruby 包可能比 `.ruby-version` 中的版本旧。如果 `bundle` 因此失败，请改用 mise 安装 Ruby。Ruby 和 Bundler 的安装方法：

   - Fedora：

     ```shell
     sudo dnf -y install \
       gcc-c++ ruby ruby-devel rubygem-bundler rubygem-json rubygem-rake
     ```

   - Debian 或 Ubuntu：

     ```shell
     sudo apt-get install \
       ruby ruby-dev ruby-bundler ruby-json g++ zlib1g-dev
     ```

   - macOS，如果系统自带的 Ruby 无法使用，可使用 Homebrew：

     ```shell
     RUBY_FORMULA="ruby@$(cut -d . -f 1,2 .ruby-version)"
     brew install "$RUBY_FORMULA"
     export PATH="$(brew --prefix "$RUBY_FORMULA")/bin:$PATH"
     ```

   - 使用 [mise](https://mise.jdx.dev/)：仓库会让 mise 从 `.ruby-version` 读取 Ruby 版本。运行 `mise trust`、`mise install ruby` 和 `gem install bundler`。如果你的系统有预编译的 Ruby，mise 会直接下载，否则会从源码构建。该构建需要编译器和开发库。

2. 在你克隆的仓库中，安装依赖：

   ```shell
   bundle
   npm install
   ```

3. 生成一次网站。第一次需要一分钟：

   ```shell
   bundle exec rake generate
   ```

4. 启动预览：

   ```shell
   bundle exec rake preview
   ```

5. 打开 `http://127.0.0.1:4000`。对文件的更改会被自动检测到，刷新浏览器即可看到。

集成（integration）页面位于 `source/_integrations`，通用文档位于 `source/_docs`。[文档的工作方式](https://www.hasscn.top/contributors/writing/how-it-works/#where-pages-live)列出了其他文件夹。

### 在另一台机器上

预览只监听 `127.0.0.1`，因此无法从其他电脑访问。在没有显示器的服务器上工作？传入它应监听的 IP 地址：

```shell
bundle exec rake "preview[192.168.0.123]"
```

或者保持原样，从你自己的电脑通过 SSH 转发端口：

```shell
ssh -L 4000:localhost:4000 user@ip-of-the-server
```

## 运行检查

在拉取请求上运行的相同检查也可以在你的电脑上运行。它们需要 Node.js：

```shell
npm install
npm run markdown:lint
npm run textlint
```

`markdown:lint` 检查 Markdown 结构。`textlint` 检查拼写和术语。[自动化检查](https://www.hasscn.top/contributors/writing/reference/checks/)说明了它们检查的内容，以及如何处理误报。
