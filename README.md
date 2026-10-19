# 战锤 3 新兵营

《全面战争：战锤 III》中文新手攻略站。资料核对至 **Update 9.0 / Patch 9.0.x（2026 年 10 月）**。

## 内容

- **首页**：三种战役、开局设置、前 30 回合路线、12 个新手错误、派系小测验
- **战役篇**：回合流程、界面解剖、经济、行省、军队、外交、英雄、成长、终局、30 回合清单
- **战斗篇**：战前决策、属性表、兵种克制、四种阵型、战斗流程、魔法、攻城、生存战、操作设置
- **派系篇**：25 个可玩种族，可按阵营 / 玩法 / 难度筛选，点击查看详情
- **兵种百科**：25 个派系页，每页包含 6 个推荐兵种、完整兵种表（生命 / 护甲 / 近攻 / 近防 / 武器 / 远程 / 维护）与 20 槽配兵思路
- **全局兵种库**：2000+ 单位，可按种族、角色、T 级筛选，按生命 / 护甲 / 武器 / 维护排序
- **DLC 篇**：2022–2026 时间线、购买优先级、种族拥有关系、常见问题
- **词典**：70+ 条中英文术语，支持搜索与分类

## 本地预览

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 部署

纯静态站点，无构建步骤。推送到 GitHub 后，在仓库 **Settings → Pages** 选择 `main` 分支根目录即可。仓库内已包含 `.nojekyll`。

## 数据

兵种数值来自游戏数据表整理（TW Database，Patch 9.0.4 / Ultra 规模 / 0 级），不含科技、技能、装备与战场增益。单位图标来自游戏素材，版权归 Creative Assembly / SEGA / Games Workshop 所有。

## 目录

```
index.html          首页
campaign.html       战役篇
battle.html         战斗篇
factions.html       派系篇
wiki.html           兵种百科首页
units.html          全局兵种库
wiki/               25 个派系兵种页
dlc.html            DLC 指南
glossary.html       术语词典
assets/css/style.css
assets/js/          site.js / factions.js / glossary.js / units.js
assets/data/        units.json / factions.json / picks.json / units-data.js
assets/img/         图片素材
```

## 素材与版权

游戏截图、派系原画与标志版权归 **Creative Assembly / SEGA / Games Workshop** 所有。本站为非官方、非商业的粉丝攻略，美术素材仅用于说明与评论。攻略文字与自制图表为本站原创。

部分机制与数值参考了官方补丁说明、SEGA 支持文档、Total War Academy 与社区资料；版本更新后以游戏内说明为准。
