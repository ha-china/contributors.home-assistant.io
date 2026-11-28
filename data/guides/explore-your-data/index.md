# 探索你自己的数据

> 设置 JupyterLab，将其连接到 Home Assistant 的数据库，并运行你的第一份报告。大约需要十五分钟。

Source: https://www.hasscn.top/contributors/data/guides/explore-your-data/

Last verified on 2026-10-16, against https://github.com/home-assistant/home-assistant-notebooks/blob/master/GETTING_STARTED.ipynb.

Home Assistant 会把家中发生的一切记录到数据库中：每一次状态（state）变化、每一个事件，以及随时间推移的统计数据。这些数据属于你，你能从中学到很多东西。供暖什么时候运行？哪些灯亮的时间最长？你的能源使用量如何随季节变化？

本指南将设置 [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/)——一款全世界数据科学家都在使用的工具，并在你自己的数据上运行第一份报告。你的数据全程都保留在你自己的硬件上。

## 整体是如何协作的

- **JupyterLab** 运行 notebook：一种混合了文本、代码和图表的文档。可以把 notebook 想象成一份还能进行计算的文档。
- **HASS Data Detective** 是一个 Python 库，它读取 Home Assistant 数据库，并将其转换成你可以处理的表格。
- **Home Assistant notebooks** 是现成的入门 notebook，位于 [home-assistant-notebooks 仓库](https://github.com/home-assistant/home-assistant-notebooks)。

## 方式一：作为 Home Assistant OS 上的应用

如果你运行的是 Home Assistant OS，最简单的方法是使用 Home Assistant Community Apps 中的 JupyterLab 应用。

1. 在你的 Home Assistant 中打开 [JupyterLab 应用](https://my.home-assistant.io/redirect/supervisor_app/?app=a0d7b954_jupyterlablite&repository_url=https%3A%2F%2Fgithub.com%2Fhassio-addons%2Frepository)。如果你还没有添加 Community Apps 仓库，这一步也会自动添加。
2. 安装该应用并启动它。
3. 打开该应用的网页界面。第一次启动可能需要一分钟。

该应用可以访问你的配置文件夹，默认数据库 `home-assistant_v2.db` 就存放在那里。首次启动时，它还会把 Home Assistant notebooks 克隆到该文件夹的 `notebooks/home-assistant` 中，因此你可以跳过下一步获取 notebook 的操作。

## 方式二：在你自己的电脑上

如果你以其他方式运行 Home Assistant，或者更愿意在单独的电脑上工作，请使用 Python 安装 JupyterLab：

```bash
mkdir ~/notebooks
cd ~/notebooks
python3 -m venv .venv
source .venv/bin/activate
pip install jupyterlab HASS-data-detective seaborn
jupyter lab
```

JupyterLab 会在你的浏览器中打开。Data Detective 负责读取数据库，seaborn 负责绘制图表。

在 Python 3.13 或更新版本上，pip 会安装 HASS Data Detective 3.2，因为更新的版本需要较旧的 Python。该 notebook 可以在 3.2 上正常工作。

你需要能够访问数据库。如果使用默认的 SQLite 数据库，请把配置文件夹中的 `home-assistant_v2.db` 复制到你的电脑上。请在 Home Assistant 停止运行时进行复制，或者从备份中复制，以免得到一个写入了一半的文件。

如果你为记录器（recorder）使用 MariaDB、MySQL 或 PostgreSQL，则改为直接连接它。为此请创建一个具有只读权限的独立数据库用户。你的 notebook 只需要读取权限。

Python 还需要该数据库的驱动程序。请将其安装到同一个虚拟环境中，并使用匹配的前缀作为数据库 URL 的开头：

- **MariaDB 或 MySQL**：运行 `pip install pymysql`，并使用以 `mysql+pymysql://` 开头的 URL。如果你复制了记录器的 `db_url`，而它以 `mysql://` 开头，请修改这一部分。
- **PostgreSQL**：运行 `pip install "psycopg[binary]"`，并使用以 `postgresql://` 开头的 URL。

在 PostgreSQL 服务器上，为名为 `hass` 的记录器数据库创建只读用户的语句如下：

```sql
CREATE USER datascience WITH PASSWORD 'my_secret_password';
GRANT CONNECT ON DATABASE hass TO datascience;
GRANT USAGE ON SCHEMA public TO datascience;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO datascience;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO datascience;
```

`ALTER DEFAULT PRIVILEGES` 语句只对执行该语句的用户所创建的表生效。请以 Home Assistant 连接数据库所用的用户身份运行它，这样新用户也能读取未来架构迁移所创建的表。

## 获取 notebook

在你自己的电脑上，从 JupyterLab 启动器打开一个终端，并克隆这些 notebook：

```bash
git clone https://github.com/home-assistant/home-assistant-notebooks.git
```

## 运行你的第一份报告

1. 在左侧的文件浏览器中，打开 notebooks 文件夹（在你自己的电脑上是 `home-assistant-notebooks`，在应用中是 `notebooks/home-assistant`），然后打开 `GETTING_STARTED.ipynb`。
2. 找到包含 `db = detective.db_from_hass_config()` 的代码单元格。在应用中，保持原样即可：它会通过你的配置找到数据库。在你自己的电脑上，它找不到数据库，因此请将该行替换为连接到你的副本的语句。如果 `home-assistant_v2.db` 的副本与 notebook 在同一文件夹中：

   ```python
   db = detective.HassDatabase("sqlite:///home-assistant_v2.db")
   ```

   对于 MariaDB、MySQL 或 PostgreSQL，请改为传入与记录器的 `db_url` 同类的数据库 URL。
3. 从顶部开始运行各个单元格：选中第一个代码单元格，按 <kbd>Shift</kbd> + <kbd>Enter</kbd> 运行它并移动到下一个单元格。

该 notebook 会将你的传感器数据读入一个表格并绘制出来。它支持 SQLite、MariaDB、MySQL 和 PostgreSQL，并且 **Run** > **Run All Cells** 可以一次性运行所有单元格。在大型数据库上这需要一些时间。仍在运行的单元格旁边会显示 `[*]`。运行完成后，星号会变成一个数字。

## 使用 pandas 读取数据库

如果你想从头开始，或者想了解 notebook 在底层做了什么：上面 `pip install` 已经安装的 [pandas](https://pandas.pydata.org/) 和 SQLAlchemy 可以直接读取数据库。将以下代码粘贴到 notebook 的新单元格中，并放在你的 `home-assistant_v2.db` 副本旁边：

```python
import pandas as pd
import sqlalchemy

engine = sqlalchemy.create_engine("sqlite:///home-assistant_v2.db")

query = sqlalchemy.text("""
    SELECT states_meta.entity_id, states.state, states.last_updated_ts
    FROM states
    JOIN states_meta ON states.metadata_id = states_meta.metadata_id
    WHERE states_meta.entity_id LIKE 'sensor.%'
""")

df = pd.read_sql(query, engine)
df["last_updated"] = pd.to_datetime(
    df["last_updated_ts"], unit="s", utc=True
)
df["state"] = pd.to_numeric(df["state"], errors="coerce")
df = df.dropna(subset=["state"])

print(df.groupby("entity_id")["state"].describe())
```

这段代码会读取所有传感器的状态，把时间戳转换为日期，只保留数值型状态，并打印每个传感器的计数、平均值、最小值和最大值。从这里开始，`df` 就是一个普通的 pandas 表格，你可以对它进行筛选、分组和绘图。

这个查询是纯 SQL，与 notebook 在每种数据库上使用的查询类型相同，因此对于 MariaDB、MySQL 或 PostgreSQL，你只需要修改数据库 URL。

## 让它成为你自己的

最棒的部分：notebook 中的所有内容都可以修改。编辑一个单元格，只运行该单元格，就能立即看到新的结果。你不需要重新运行整个 notebook。

当你想更进一步时：

- [HASS Data Detective 示例](https://github.com/robmarkcole/HASS-data-detective)展示了更多查询和绘制数据的方法。
- [数据模型](https://www.hasscn.top/contributors/data/reference/data-model/)和[数据库架构](https://www.hasscn.top/contributors/data/reference/database-schema/)解释了数据库中包含哪些内容。
- [查询数据库](https://www.hasscn.top/contributors/data/guides/query-the-database/)提供了可以作为起点的 SQL 查询。

## 分享你的发现

做了一个别人可能用得上的 notebook？请分享不带输出的 notebook，这样它就不包含你家的任何数据，其他人也可以在他们自己的数据上运行它。[社区论坛](https://community.home-assistant.io/)是展示它的好地方。
