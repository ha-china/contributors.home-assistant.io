# 许可与 CLA

> Home Assistant 使用哪些许可证，贡献者许可协议（Contributor License Agreement）的内容是什么，以及如何签署。

Source: https://www.hasscn.top/contributors/start/licensing/

你为 Home Assistant 贡献的一切内容都会以开源许可证的形式与世界共享。在你的第一个代码贡献被合并之前，你需要通过签署贡献者许可协议（Contributor License Agreement，CLA）来确认你有权以这种方式分享它。这只需要做一次。

## 许可证

- **代码**以 [Apache License 2.0](https://www.home-assistant.io/developers/license/) 发布。这包括 Home Assistant Core、前端以及其他软件仓库。
- home-assistant.io 上的**文档**以 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://github.com/home-assistant/home-assistant.io/blob/current/LICENSE.md) 发布。

每个仓库的根目录下都有一个 `LICENSE` 文件。如有疑问，以该仓库中的这个文件为准。

## 贡献者许可协议

CLA 很简短。做出贡献即表示你证明以下内容：

```txt
By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the Apache 2.0 license; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the Apache 2.0 license; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it) is maintained indefinitely
    and may be redistributed consistent with this project or the open
    source license(s) involved.
```

简单来说：内容是你自己写的，或者它来自允许你分享的开源作品。同时你明白，你的贡献是公开的，并将保持公开。

CLA 基于 Linux 项目的[开发者原产地证书（Developer Certificate of Origin）](https://elinux.org/Developer_Certificate_Of_Origin)，修改为指明 Apache 2.0 许可证，并去掉了签署（sign-off）部分。其文本根据 [Creative Commons Attribution-ShareAlike 3.0 Unported License](https://creativecommons.org/licenses/by-sa/3.0/) 授权使用。完整页面及其历史记录可在 [home-assistant.io](https://www.home-assistant.io/developers/cla/) 上查看。

## 签署

你无需提前做任何事情。Home Assistant 的代码仓库，例如 Core、前端、伴侣应用（companion apps）、Supervisor、Home Assistant OS 以及官方应用，都会检查每个拉取请求（pull request）是否已签署 CLA。当你第一次在其中某个仓库打开拉取请求而尚未签署时，一个机器人会发表评论并附上链接。按照该链接及其中的说明操作即可。签署一次后，它也将覆盖你未来的贡献。

## 来自其他地方的代码

当你引入并非由你编写的代码时，第 (b) 条就很关键，例如来自其他项目的代码片段。只有在其许可证允许的情况下才这样做，并在你的拉取请求中说明其来源。使用 AI 工具编写的代码也是如此：你要对自己提交的内容负责。请参阅 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)。

## 致谢

Home Assistant 有一个[致谢页面](https://www.home-assistant.io/developers/credits/)，列出了为该项目各个仓库做出贡献的人们。
