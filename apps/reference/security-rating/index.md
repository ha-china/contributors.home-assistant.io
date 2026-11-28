# 安全评级

> Supervisor 如何计算应用的安全评级（1 到 8），以及哪些选择会使其升高或降低。

Source: https://www.hasscn.top/contributors/apps/reference/security-rating/

每个应用都有一个安全评级，在其页面上显示为 1 到 8 的数字。数字越高越好。用户在安装你的应用之前会查看它，因此在发布之前值得检查一下。Supervisor 会根据你的配置来计算它（Supervisor 代码中的 [`rating_security`](https://github.com/home-assistant/supervisor/blob/main/supervisor/apps/utils.py)）。

## 计算方式

每个应用从 5 开始。然后：

| 条件 | 变化 |
| --- | --- |
| 加载了自定义 AppArmor 配置文件（`apparmor.txt`） | +1 |
| `apparmor: false` | -1 |
| `ingress: true` | +2 |
| 没有 ingress，但也没有主机网络（host network）和映射到主机的端口 | +2 |
| 没有 ingress，但 `auth_api: true`（且有主机网络或映射端口） | +1 |
| 在 `privileged` 中包含 `BPF`、`CHECKPOINT_RESTORE`、`DAC_READ_SEARCH`、`NET_ADMIN`、`NET_RAW`、`PERFMON`、`SYS_ADMIN`、`SYS_MODULE`、`SYS_PTRACE` 或 `SYS_RAWIO` 中的任意一项能力，或 `kernel_modules: true` | -1，仅一次 |
| `hassio_role: manager` | -1 |
| `hassio_role: admin` | -2 |
| `host_network: true` | -1 |
| `host_pid: true` | -2 |
| `host_uts: true` 且 `privileged` 中包含 `SYS_ADMIN` | -1 |
| `docker_api: true` 或 `full_access: true` | 评级为 1，无论其他条件如何 |

结果会保持在 1 到 8 之间。ingress、无暴露和 `auth_api` 三项加成中只有一项生效，按此顺序优先。

需要注意的几点：

- AppArmor 加成在你的配置文件加载后即生效，这发生在应用安装时。在此之前，应用商店显示的评级不包含它。
- 在 `config.yaml` 中主机端口为 `null` 的端口默认是关闭的，不算作已映射。评级查看的是你的配置，而不是用户开启的端口。
- 代码中有针对签名镜像的加成，但目前并未使用：现在没有任何应用能获得它。
- `AUDIT_WRITE`、`MKNOD`、`SETFCAP`、`IPC_LOCK`、`SYS_NICE`、`SYS_RESOURCE` 和 `SYS_TIME` 不会影响评级。

## 示例

一个带有 ingress、自定义 AppArmor 配置文件且没有其他特权的应用得到 5 + 2 + 1 = 8。同一个应用如果设置了 `host_network: true` 和 `NET_ADMIN`，则得到 5 + 2 + 1 - 1 - 1 = 6。

要提升你的应用评级，请参阅[保护你的应用](https://www.hasscn.top/contributors/apps/guides/security/)。
