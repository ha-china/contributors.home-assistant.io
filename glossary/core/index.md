# Home Assistant Core

> Home Assistant 核心的 Python 应用程序，包含所有集成，位于 home-assistant/core 仓库中。

Source: https://www.hasscn.top/contributors/glossary/core/

- In code: `homeassistant/`
- Also: Core

Core 运行事件循环（event loop）、状态机（state machine）、注册表（registries）以及每一个集成（integration）。无论周围运行着什么，每个 Home Assistant 安装都会运行 Core。

当人们在对话中说 "core" 时，通常指的是这个仓库以及为它工作的人。在文字中，首次出现时应写作 Home Assistant Core。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [事件循环（event loop）](https://www.hasscn.top/contributors/glossary/event-loop/): 运行 Home Assistant Core 的 asyncio 循环。阻塞它的代码，比如在没有 `await` 的情况下等待网络，会让其他所有任务都停止。
- [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/): 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。
- [前端](https://www.hasscn.top/contributors/glossary/frontend/): Home Assistant 的网页界面，使用 Lit 和 TypeScript 构建，位于 home-assistant/frontend 仓库中。
