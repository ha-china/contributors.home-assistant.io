# 你的第一次安全贡献

> 检查你正在使用的某个集成的诊断信息，找出其中不应存在的数据，并修复发现的问题。

Source: https://www.hasscn.top/contributors/security/first-contribution/

要为 Home Assistant 的安全做出贡献，你不需要是一名安全研究人员。一个很好的起点就用你已有的东西：你自己的 Home Assistant，以及你每天都在使用的某个集成。

用户会把[诊断](https://www.hasscn.top/contributors/glossary/diagnostics/)文件附加到公开的 GitHub issue 上，因此集成必须先从中移除密码、令牌（token）和其他私密数据。这是通过一个需要脱敏的键（key）列表来实现的。当某个键不在这个列表中时，私密数据就会暴露在公开场合。检查这一点具体、工作量小，而且很有用。

## 1. 下载诊断文件

1. 前往 **设置** > **设备与服务**。
2. 选择一个你正在使用的集成。与云服务通信或需要登录的集成是不错的选择，因为它有需要保护的机密信息。
3. 打开三点菜单，选择 **下载诊断**。

并非每个集成都有诊断功能。如果没有，该选项就不会显示：换一个集成即可。

## 2. 阅读文件

在文本编辑器中打开该文件。已被移除的值会显示为 `**REDACTED**`。查找那些本应被移除却未被移除的内容：

- 密码、API 密钥和令牌（token），包括访问令牌和刷新令牌
- 位置数据，例如坐标和地址
- 个人信息，例如姓名和电子邮件地址
- 能指向你或你设备的标识符，例如序列号或账户 ID

来自 API 的数据往往包含集成作者意料之外的内容，所以也要查看嵌套的数据。

## 3. 判断它是什么

大多数时候，你什么也找不到。这是一个好结果，而且你也了解了诊断功能的工作方式。

如果你发现了问题，想一想谁能看到它。如果这些数据本不应出现在用户公开分享的文件中，那就需要修复。如果你认为它可能以其他方式让用户面临风险，或者你不确定，就把它当作漏洞并[私下报告](https://www.hasscn.top/contributors/security/report-a-vulnerability/)。一个最终被证实无害的私下报告代价很小；而一个最终被证实是漏洞的公开披露则会危及家庭安全。

## 4. 修复它

修复通常只需一行代码。诊断代码位于[核心仓库](https://github.com/home-assistant/core)中集成文件夹下的 `diagnostics.py` 文件里。大多数集成会维护一组键，通常命名为 `TO_REDACT`，并将数据通过 `async_redact_data` 处理：

```python
TO_REDACT = {CONF_API_KEY, CONF_PASSWORD, "serial_number"}
```

将缺失的键添加到该集合中。然后更新诊断测试的快照，让审查者看到该值变为 `**REDACTED**`：

```bash
pytest tests/components/example --snapshot-update
```

初次接触 Core？[你对 core 的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)会帮你搭建开发环境，并带你完成第一个 pull request。[诊断](https://www.hasscn.top/contributors/core/integrations/diagnostics/)更详细地解释了相关代码。

## 接下来做什么

- 阅读[安全的集成](https://www.hasscn.top/contributors/security/guides/integrations/)，了解保障集成安全的其他模式。
- 带着[安全意识](https://www.hasscn.top/contributors/security/guides/reviewing/)审查一个 pull request。依赖项更新是一个很好的切入点：[检查清单](https://www.hasscn.top/contributors/core/development/reviewing/#dependency-updates)很短，而风险却是真实存在的。
