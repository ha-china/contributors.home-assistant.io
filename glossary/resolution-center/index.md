# 解决方案中心

> Supervisor 中查找系统问题（如磁盘空间不足）并建议修复方法的部分。

Source: https://www.hasscn.top/contributors/glossary/resolution-center/

- In code: `supervisor/resolution/`, `IssueType`, `SuggestionType`

解决方案中心（resolution center）会运行检查，将发现的问题记录为议题（issue），并提供修复这些问题的建议。它还会跟踪系统不受支持或不健康的原因。用户不会看到这个名称：Core 的 `hassio` 集成将其议题显示为[修复](https://www.hasscn.top/contributors/glossary/repair/)。请参阅[解决方案中心](https://www.hasscn.top/contributors/os/supervisor/resolution-center/)。

## Related terms

- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
- [修复（Repair）](https://www.hasscn.top/contributors/glossary/repair/): Home Assistant 在“修复”（Repairs）中向用户显示的问题，以及相应的处理方法，例如即将失效的配置。
