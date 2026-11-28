# 轮询（Polling）

> 按固定时间间隔向设备或服务请求新数据。与之相反的是推送（push），即设备在发生变化时主动发送更新。

Source: https://www.hasscn.top/contributors/glossary/polling/

- In code: `should_poll`, `SCAN_INTERVAL`, `update_interval`
- Also: poll, push

推送（push）速度更快，并且对设备和网络的负载更小，因此在设备支持时集成会优先使用它。否则，将由[协调器（coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/)按固定间隔进行轮询。

## Related terms

- [协调器（Coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/): 一种辅助元素（helper），按计划一次性为多个实体（entity）获取数据，从而只需向设备或 API 请求一次，而不是每个实体各请求一次。
- [IoT class](https://www.hasscn.top/contributors/glossary/iot-class/): 集成（integration）如何获取数据：本地还是云端，轮询还是推送。在 manifest 中设置。
