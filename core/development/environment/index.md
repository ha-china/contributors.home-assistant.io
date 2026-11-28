# 搭建你的开发环境

> 通过开发容器或在 Linux、macOS 或 Windows 上手动安装，获得一个可用的 Home Assistant Core 开发环境。

Source: https://www.hasscn.top/contributors/core/development/environment/

Last verified on 2026-10-12, against https://github.com/home-assistant/core/blob/dev/pyproject.toml.

你需要一个开发环境来从源码运行 Home Assistant、运行测试以及运行代码检查工具（linter）。有两种方式可以获得：

- **开发容器**（推荐）：Visual Studio Code 会构建一个 Docker 容器，其中包含正确的 Python 版本、所有依赖项以及已配置好的代码检查工具。在 Linux、macOS 和 Windows 上你都能获得相同的配置。例外情况是对 USB 闪存盘等硬件的访问，请参阅下面的说明。
- **手动搭建**：你自己安装 Python 和系统库，并创建虚拟环境。如果你不想使用 Docker 或 Visual Studio Code，可以使用这种方式。

## 开发容器

### 你需要什么

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- Docker。如何安装取决于你的操作系统，请参阅下文。

> [!NOTE]
> 容器使得使用 USB 闪存盘或电脑的蓝牙适配器等硬件变得更加困难。在 Linux 主机上，你可以将它们透传给容器。在 Windows 上，Docker 运行在 WSL 内部，而 WSL 自身无法访问 USB 设备：你需要先使用 [usbipd-win](https://learn.microsoft.com/windows/wsl/connect-usb) 将设备挂载到 WSL。在 macOS 上，容器无法直接访问这些硬件。Docker Desktop 可以通过 [USB/IP](https://docs.docker.com/desktop/features/usbip/) 在网络上共享 USB 设备，但这需要额外的设置。

### 在 Linux 上安装 Docker

按照适用于你发行版的说明安装 [Docker Engine](https://docs.docker.com/engine/install/)。然后按照[安装后步骤](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)操作，这样你就可以在不使用 root 的情况下使用 Docker。

### 在 macOS 上安装 Docker

安装 [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/)。

### 在 Windows 上安装 Docker

在 Windows 上，一切都在 WSL2（适用于 Linux 的 Windows 子系统）中运行。

1. 安装 WSL2 及默认的 Ubuntu 发行版。在 Windows 终端中运行：

   ```shell
   wsl --install
   ```

2. 检查你的发行版是否运行在 WSL 版本 2 上：

   ```shell
   wsl -l -v
   ```

   如果显示的是版本 1，请使用 `wsl --set-version <distro name> 2` 进行转换。

3. Docker Engine 作为 systemd 服务运行，因此需要启用 systemd。使用 `wsl` 启动 WSL shell，并将以下内容添加到 `/etc/wsl.conf`（使用 `sudo`）：

   ```ini
   [boot]
   systemd=true
   ```

4. 在 Windows 终端中使用 `wsl --shutdown` 重启 WSL，然后再次启动它。
5. 在 WSL 内部，按照上面的 Linux 说明安装 Docker Engine。

从现在开始，所有操作都在 WSL 内部进行，包括克隆仓库。位于文件系统 Windows 一侧的代码会遇到权限问题。

### 在容器中打开仓库

1. 在 GitHub 上[复刻（fork）core 仓库](https://github.com/home-assistant/core/fork)。
2. 克隆你的复刻仓库，将 Home Assistant 仓库添加为 `upstream`，并在 Visual Studio Code 中打开它：

   ```shell
   git clone https://github.com/YOUR_GITHUB_USERNAME/core
   cd core
   git remote add upstream https://github.com/home-assistant/core.git
   code .
   ```

3. Visual Studio Code 会检测到容器配置，并询问你是否要**在容器中重新打开（Reopen in Container）**。选择它。如果它要求安装 Dev Containers 扩展，请安装。
4. 等待容器构建完成。第一次需要几分钟时间。完成后，它会运行 `script/setup`，安装所有依赖项以及用于代码检查工具的 Git 钩子。

要检查一切是否正常，打开命令面板（<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>，macOS 上为 <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>），选择 **Tasks: Run Task**，然后选择 **Run Home Assistant Core**。当终端中的输出变慢时，打开 `http://localhost:8123`。你应该会看到引导设置界面。

之后要回到容器，打开 Visual Studio Code，在侧边栏中选择 **Remote Explorer**，然后选择该容器。

### 任务

容器自带了针对你最常做的事情的任务。打开命令面板，选择 **Tasks: Run Task**，然后选择其中一个：

| 任务 | 作用 |
| --- | --- |
| **Run Home Assistant Core** | 使用 `config/` 中的配置启动 Home Assistant。 |
| **Pytest** | 运行完整的测试套件。 |
| **Pytest (changed tests only)** | 仅运行你修改过的测试文件。 |
| **Code Coverage** | 运行一个集成的测试，并生成覆盖率报告。 |
| **Update syrupy snapshots** | 更新一个集成的快照。 |
| **Prek** | 对你的更改运行代码检查工具。 |
| **Generate Requirements** | 在你更改了某个依赖项之后更新 `requirements_all.txt`。 |
| **Install all (test & production) Requirements** | 重新安装所有依赖项。 |
| **Compile English translations** | 将 `strings.json` 文件转换为英文翻译。 |
| **Create new integration** | 启动用于生成新集成的脚手架。 |

要重启仍在运行的任务，请选择 **Tasks: Restart Running Task**。

### 调试

容器自带调试配置。按 <kbd>F5</kbd> 在调试器中启动 Home Assistant，它会在你设置的任何断点处停止。**Run and Debug** 视图中还有用于调试当前测试文件或附加到正在运行实例的配置。

要调试运行在其他地方的实例（例如你的生产系统），请使用 [debugpy 集成](https://www.home-assistant.io/integrations/debugpy/)。

从 Home Assistant 2026.11 开始，你还可以在没有调试器的情况下查看正在运行的 Home Assistant 内部情况，即使用 **Settings** > **Tools** > **Debug console** 下的调试控制台。它在 `hass` 可用的情况下运行 Python 代码，将结果显示为可展开的对象，并在你输入时自动补全代码。例如，要查看太阳的状态：

```python
hass.states.get("sun.sun")
```

调试控制台通过在 `configuration.yaml` 中添加 `debug_console:` 来启用，`script/setup` 会将其添加到此容器的配置中。在其他环境中，你需要自己添加并重启 Home Assistant；请参阅 [Debug console 集成](https://www.home-assistant.io/integrations/debug_console/)。代码在 Home Assistant 的事件循环中运行，因此请对异步调用使用 `await`，并使用 `await hass.async_add_executor_job(...)` 运行阻塞式工作。

### 当容器无法构建时

构建失败的容器通常基于过时的复刻仓库。

1. 确保你的复刻仓库与 Home Assistant 的 `dev` 分支保持同步。
2. 使用 `docker buildx prune` 清理 Docker 构建缓存。
3. 如果这没有帮助，选择 **Open configuration in recovery devcontainer**，在其终端中运行 `git pull upstream dev`，然后从命令面板中选择 **Dev Containers: Rebuild Container**。

## 手动搭建

Core 需要较新的 Python：其 [`pyproject.toml`](https://github.com/home-assistant/core/blob/dev/pyproject.toml) 中的 `requires-python` 要求 3.14.2 或更新版本。你的操作系统自带的 Python 通常较旧。如果你使用较旧的 Python 创建虚拟环境，它将无法工作：请安装正确的版本，删除 `.venv` 文件夹，然后重新运行安装。

### 安装系统依赖

Home Assistant 及其依赖项需要一些系统库和构建工具。

在 Ubuntu 或 Debian 上：

```shell
sudo apt-get update
sudo apt-get install autoconf libssl-dev libxml2-dev libxslt1-dev libjpeg-dev \
  libffi-dev libudev-dev zlib1g-dev pkg-config libavformat-dev \
  libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev \
  libswresample-dev libavfilter-dev ffmpeg libgammu-dev \
  build-essential
```

在 Fedora 上：

```shell
sudo dnf update
sudo dnf install autoconf openssl-devel libxml2-devel libxslt-devel \
  libjpeg-turbo-devel libffi-devel systemd-devel zlib-devel \
  pkgconf-pkg-config libavformat-free-devel libavcodec-free-devel \
  libavdevice-free-devel libavutil-free-devel libswscale-free-devel \
  ffmpeg-free-devel libavfilter-free-devel ffmpeg-free gcc gcc-c++ \
  cmake
```

在 Arch 或 Manjaro 上：

```shell
sudo pacman -Sy base-devel autoconf libxml2 libxslt libjpeg-turbo \
  libffi systemd zlib pkgconf ffmpeg gcc cmake
```

在 macOS 上，安装 [Homebrew](https://brew.sh/) 并使用它安装依赖项：

```shell
brew install autoconf ffmpeg cmake make
```

一些依赖项（例如 `cryptography` 和 `orjson`）包含 Rust 代码。如果你的平台没有预构建的软件包，它们将从源码构建，这需要 Rust 工具链。如果安装因为缺少 `rustc` 或 `cargo` 而失败，请运行 `brew install rust`。

在 NixOS 上，将这个 `default.nix` 放在仓库中并激活它，例如使用 [direnv](https://direnv.net/)：

```nix
let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  packages = with pkgs; [
    autoconf
    clang
    cmake
    ffmpeg
    ffmpeg.dev
    gammu
    libffi.dev
    libjpeg.dev
    libxml2.dev
    libxslt.dev
    openssl_3.dev
    pkg-config
    python314
    zlib.dev
  ];
  env = {
    LD_LIBRARY_PATH = "${pkgs.libjpeg.out}/lib";
  };
}
```

在 Windows 上，安装带有 Ubuntu 的 [WSL](https://learn.microsoft.com/windows/wsl/install)，并在 WSL 内部按照 Ubuntu 的说明操作。将所有代码保留在 WSL 内部。

### 使用 uv 安装 Python

获取正确 Python 的最简单方法是 [uv](https://docs.astral.sh/uv/)，这是 core 所使用的包管理器。使用[官方安装器](https://docs.astral.sh/uv/getting-started/installation/)安装它：

```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

之后你不必自己安装 Python。core 仓库中有一个 `.python-version` 文件，其中包含开发容器所使用的确切版本，uv 会读取它：当安装脚本创建虚拟环境时，如果你还没有该版本，uv 会下载它。要提前安装，请在克隆仓库后，在仓库文件夹中运行 `uv python install`。

如果 uv 报告找不到所需 Python 版本的下载，说明你的 uv 版本太旧。重新运行安装器来更新它。

在 NixOS 上，`default.nix` 中的 `python314` 提供了 Python，你不需要为此使用 uv。

### 设置仓库

复刻（fork）[core 仓库](https://github.com/home-assistant/core/fork)，克隆你的复刻仓库，并将 Home Assistant 仓库添加为 `upstream`：

```shell
git clone https://github.com/YOUR_GITHUB_USERNAME/core
cd core
git remote add upstream https://github.com/home-assistant/core.git
```

然后运行安装脚本：

```shell
script/setup
```

如果没有激活的虚拟环境，它会创建一个到 `.venv`，如果你安装了 uv 则使用 uv，否则使用 `python3 -m venv`。如果已有激活的虚拟环境，它会改用那个。然后它会安装所有依赖项，安装用于代码检查工具的 Git 钩子，并在 `config` 文件夹中创建配置。

### 运行 Home Assistant

在每个新终端中激活虚拟环境：

```shell
source .venv/bin/activate
```

然后使用 `config` 文件夹中的配置启动 Home Assistant：

```shell
hass -c config
```

打开 `http://localhost:8123` 即可查看。

如果 `hass` 在 macOS 上因 `SIGKILL` 而崩溃，你的终端应用可能缺少蓝牙权限。请在 **System Settings** > **Privacy & Security** > **Bluetooth** 下添加它。

### WSL 中的网络

如果无法从 Windows 打开 `http://localhost:8123`，请使用 `ip addr show eth0` 找到 WSL 的地址，并使用斜杠前的 `inet` 地址。例如，`172.20.37.6/20` 变为 `http://172.20.37.6:8123`。

默认情况下，WSL 使用 NAT 网络，这会阻止 Home Assistant 发现你网络上的设备。[镜像模式网络（Mirrored mode networking）](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking)为 WSL 提供与 Windows 相同的网络接口（包括多播），因此基于 mDNS 的发现功能可以正常工作。

## 仓库中的 AI 工具

如果你使用 AI 编程工具，它不必猜测 core 是如何工作的。仓库中有一个包含智能体（agent）说明的 `AGENTS.md` 文件，以及 [`.claude/skills/`](https://github.com/home-assistant/core/tree/dev/.claude/skills) 中的技能，例如用于构建集成的 `ha-integration-knowledge` 和用于检查质量等级规则的 `ha-quality-scale-verify`。它们对人类来说也值得一读。

你对结果负责：请参阅 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)。[使用 AI 工具贡献](https://www.hasscn.top/contributors/start/ai-tools/)列出了所有技能，并演示了如何使用它们修复一个 bug 以及构建一个达到铜牌（Bronze）等级的集成。

## 接下来做什么

- [运行测试](https://www.hasscn.top/contributors/core/development/testing/)：在打开拉取请求（pull request）之前运行测试。
- [代码检查工具、hassfest 和 CI](https://www.hasscn.top/contributors/core/development/checks/)：提交时会运行什么。
