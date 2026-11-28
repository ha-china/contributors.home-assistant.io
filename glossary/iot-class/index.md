# IoT class

> 集成（integration）如何获取数据：本地还是云端，轮询还是推送。在 manifest 中设置。

Source: https://www.hasscn.top/contributors/glossary/iot-class/

- In code: `"iot_class" in manifest.json`

IoT class 告诉用户在设置集成（integration）之前可以对它有什么期望，比如它是否能在没有互联网的情况下继续工作。最常见的几种是 `local_push`、`local_polling`、`cloud_push` 和 `cloud_polling`。

## Related terms

- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
- [轮询（Polling）](https://www.hasscn.top/contributors/glossary/polling/): 按固定时间间隔向设备或服务请求新数据。与之相反的是推送（push），即设备在发生变化时主动发送更新。
