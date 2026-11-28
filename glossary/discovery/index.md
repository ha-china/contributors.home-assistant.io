# 发现（Discovery）

> 查找设备和服务的位置，例如在网络中或通过蓝牙，以便 Home Assistant 可以提供设置它们的选项。

Source: https://www.hasscn.top/contributors/glossary/discovery/

- In code: `zeroconf`, `ssdp`, `dhcp`, `bluetooth`, `usb`, `async_step_zeroconf`
- In the UI: Discovered
- Also: discovered

集成在其清单（manifest）中列出其设备可以被找到的方式，例如通过 mDNS（`zeroconf`）、SSDP、DHCP、蓝牙或 USB。当 Home Assistant 找到匹配项时，它会启动该集成的配置流程（config flow），并将该设备显示为已发现（discovered）。

## Related terms

- [配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/): 在用户界面中设置集成并创建配置条目的步骤。
- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
