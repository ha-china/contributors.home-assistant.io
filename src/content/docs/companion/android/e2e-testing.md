---
title: Android 端到端测试
description: 每晚针对真实 Home Assistant 在所有 API 级别上运行 Android 应用的 Maestro 测试，以及如何调试失败。
sidebarLabel: 端到端测试
sidebarGroup: 测试
order: 4
source: https://github.com/home-assistant/android/blob/main/.github/workflows/e2e.yml
lastVerified: 2026-11-05
---

所有其他测试都模拟服务器。端到端（E2E）测试则不然：它们像用户一样，针对真实的 Home Assistant 运行真实的应用程序。这能捕获其他测试无法发现的问题，例如 Core 或前端的更改破坏了引导流程，或某个特定 Android 版本上的 web view 问题。

共有两个测试：一个通过普通 HTTP 进行引导，另一个通过需要客户端证书的代理进行引导，即双向 TLS（mTLS）。

## 运行时机

`e2e.yml` 工作流在以下情况运行：

- 每晚 05:00 UTC 在 `main` 分支上运行，针对 Home Assistant 的 `dev` 镜像（最新的开发构建版本）。
- 在任意分支上通过 **Run workflow** 手动运行。可选的 `home-assistant-version` 输入用于选择要测试的镜像标签。

它不属于拉取请求（pull request）检查的一部分。它需要为每个受支持的 API 级别启动一个模拟器，对每个拉取请求来说开销太大。

## 它做什么

1. 为 mTLS 测试生成证书。这些证书仅在该次运行期间存在。
2. 构建 `fullDebug` APK，关闭 [StrictMode](/companion/android/debugging/#strictmode)，并信任该次运行的证书颁发机构（CA）。
3. 安装 [Maestro](https://maestro.dev/) CLI，并根据其发布的校验和检查下载内容。
4. 从 `.github/e2e/homeassistant` 中的配置启动 Home Assistant，并检查 `mobile_app` 是否已加载。
5. 在 Home Assistant 前启动 mTLS 代理，并检查它是否拒绝没有客户端证书的请求。
6. 在 Emulator.wtf 上为每个 API 级别（从 API 29 到 `androidSdk-target`）启动一个模拟器，并安装该应用。
7. 在所有模拟器上并行运行普通流程。
8. 在模拟器上打开证书安装程序，并运行 mTLS 流程。这仅在普通流程通过后才会发生。
9. 无论结果如何，都会上传调试所需的文件。

设备列表从 API 29 开始，尽管应用支持更旧的版本。在更旧的镜像上，web view 会渲染前端，但其内容永远不会出现在 Maestro 能看到的内容中，因此其上的所有检查都会失败。拉取请求上的[插桩测试](/companion/android/instrumentation-testing/)仍然覆盖完整范围，直到应用的最低 API 级别。

Home Assistant 容器和代理在 GitHub runner 上运行，模拟器在 Emulator.wtf 上运行。一个隧道连接它们，在模拟器内部，`homeassistant.internal` 解析到 runner：端口 8123 是 Home Assistant，端口 8443 是代理。

## mTLS 测试如何工作

`.github/e2e/mtls` 中的代理是 Home Assistant 前面的 nginx。它拒绝每个没有客户端证书的请求，从引导的第一页开始。

其服务器证书由仅在该次运行期间存在的 CA 签名。为了使应用信任它，工作流使用 Gradle 属性 `debugExtraResDir` 进行构建。这会用 `.github/e2e/mtls` 中的副本替换应用的网络安全配置，该副本在可调试构建中信任该 CA。没有该属性的构建则保持不变。

客户端证书的安装方式与用户相同：工作流打开系统证书安装程序，流程会经过它。

> [!IMPORTANT]
> `.github/e2e/mtls/network_security_config.xml` 是 `app/src/main/res/xml/network_security_config.xml` 的副本，并添加了一个部分。当你更改应用的配置时，请在副本中进行相同的更改。

## 流程

流程位于仓库根目录的 `.maestro` 文件夹中，测试的每一步都写在那里：

- [`.maestro/onboarding.yaml`](https://github.com/home-assistant/android/blob/main/.maestro/onboarding.yaml) 通过普通 HTTP 进行引导。
- [`.maestro/onboarding-mtls.yaml`](https://github.com/home-assistant/android/blob/main/.maestro/onboarding-mtls.yaml) 安装客户端证书，然后通过代理进行引导。

它们通过 `.maestro/subflows` 共享步骤，并覆盖应用最关键路径：

- **登录**：真实的登录页面，使用真实凭据，走完整个授权流程。
- **注册**：应用向 `mobile_app` 注册自己，其他一切都依赖于此。
- **前端渲染**：能够到达概览仪表盘（dashboard）证明 web view 在该 API 级别上正常工作。
- **外部总线双向工作**：只有在应用通过[外部总线](/frontend/reference/external-bus/)（external bus）宣告自己之后，前端才会在其设置中显示 **Companion app** 条目，而选中它会让前端请求应用打开其原生设置。

流程从三个参数获取要测试的实例：`HOME_ASSISTANT_URL`、`HOME_ASSISTANT_USERNAME` 和 `HOME_ASSISTANT_PASSWORD`。mTLS 流程还需要两个参数，`MTLS_P12_PASSWORD` 和 `MTLS_CERT_ALIAS`：证书文件的密码，以及给证书的名称。

当你更改流程时：

- 它驱动调试应用 `io.homeassistant.companion.android.debug`。不要更改 `appId`。
- 它在每个 API 级别上运行，因此任何特定于版本的内容都必须是条件性的，例如现有的权限对话框步骤。
- 步骤匹配屏幕上的文本。如果你在应用中重命名了标签，请在同一个拉取请求中更新流程。
- 将多个流程需要的步骤放在子流程中。

[Maestro 文档](https://docs.maestro.dev/api-reference/commands)列出了所有命令。

## 本地运行

安装 [Maestro CLI](https://docs.maestro.dev/getting-started/installing-maestro)，启动一个模拟器或连接一台设备，然后运行：

```bash
./gradlew :app:installFullDebug
maestro test \
  -e HOME_ASSISTANT_URL=http://homeassistant.local:8123 \
  -e HOME_ASSISTANT_USERNAME=<username> \
  -e HOME_ASSISTANT_PASSWORD=<password> \
  .maestro/onboarding.yaml
```

该流程会先清除应用状态，因此总是从全新的引导流程开始。请使用一次性实例：每次运行都会在其上注册一台新设备。

### 运行 mTLS 流程

要运行带 mTLS 的测试，你需要在 Home Assistant 前设置一个需要 mTLS 的反向代理，并为你的证书文件打开证书安装程序对话框。达到此状态的最简单方法是使用下面描述的步骤，这些步骤也在 GitHub Actions 上运行。你需要使用模拟器、Docker，以及在你机器 8123 端口上的 Home Assistant。从模拟器来看，你的机器是 `10.0.2.2`。

1. 生成证书，服务器证书中包含该地址：

   ```bash
   OUT=/tmp/mtls
   .github/e2e/mtls/generate-certs.sh "$OUT" \
     "DNS:homeassistant.internal,IP:10.0.2.2"
   ```

2. 启动代理。使用 Docker Desktop 时，`host.docker.internal` 是你的机器：

   ```bash
   TEMPLATE=/etc/nginx/templates/default.conf.template
   docker run -d --name e2e-mtls-proxy -p 8443:8443 \
     -e E2E_MTLS_UPSTREAM=host.docker.internal:8123 \
     -v "$OUT:/etc/nginx/certs:ro" \
     -v "$PWD/.github/e2e/mtls/nginx.conf.template:$TEMPLATE:ro" \
     nginx:stable-alpine
   ```

3. 安装构建为信任该 CA 的应用：

   ```bash
   ./gradlew :app:installFullDebug -PdebugExtraResDir="$OUT/res"
   ```

4. 在模拟器上打开证书安装程序：

   ```bash
   .github/e2e/mtls/open-cert-installer.sh emulator-5554 "$OUT/client.p12"
   ```

   在 API 32 及以下版本，脚本会改为安装同一文件夹中的 `client_legacy.p12`，因为这些版本的证书安装程序无法读取 `client.p12`。要使用另一个旧版文件，请将其路径作为可选的第三个参数传递。

5. 运行流程，使用 `generate-certs.sh` 的默认密码和名称：

   ```bash
   maestro test \
     -e HOME_ASSISTANT_URL=https://10.0.2.2:8443 \
     -e HOME_ASSISTANT_USERNAME=<username> \
     -e HOME_ASSISTANT_PASSWORD=<password> \
     -e MTLS_P12_PASSWORD=e2ep12pass \
     -e MTLS_CERT_ALIAS=e2eclient \
     .maestro/onboarding-mtls.yaml
   ```

## 调试失败

每次运行都会上传一个 `e2e-artifacts` 工件：

| 文件 | 内容 |
| --- | --- |
| `maestro-results/` | 每个流程和分片的命令跟踪、`maestro.log` 以及失败截图 |
| `logcat-*.txt` | 完整的 logcat，每个模拟器一个文件 |
| `mtls-proxy.log` | mTLS 代理的日志，每个请求一行 |
| `homeassistant.log` | Home Assistant 日志 |
| `homeassistant-config.json` | `/api/config` 响应，包含版本和已加载组件 |
| `homeassistant-container.json` | 容器详细信息，包括确切的镜像 |

按此顺序阅读它们，并在第一个能解释失败的文件处停止。大多数失败会显示在失败的 Maestro 命令及其截图中：这可以区分损坏的屏幕和 Maestro 无法看到的元素。从 Home Assistant 日志开始通常会浪费时间。在代理日志中，`400` 表示没有客户端证书的请求。

只有在排除了应用和流程之后，才去查看上游。`dev` 镜像每晚都会变化，因此请与上一次通过的运行进行比较：两份 `homeassistant-config.json` 文件给出了故障两侧的 Home Assistant 版本。然后查看在此期间 [Core](https://github.com/home-assistant/core) 或[前端](https://github.com/home-assistant/frontend)合入了什么。

## 自动化分诊

夜间运行失败会启动一个 `e2e-triage` 工作流。一个 AI 代理会下载失败运行和上一次成功运行的工件，并遵循 `.agents/skills/ha-android-e2e-debugging` 技能中的流程。它只做诊断：从不更改文件或打开拉取请求。它会在 Android 仓库中报告到一个单独的 `e2e-failure` issue 中，包括供维护者带到 Core 或前端的上游发现。下一次通过的运行会关闭该 issue。
