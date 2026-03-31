# 首页中保真方案

更新时间：2026-03-27

## 设计目标

首页要解决的不是“展示系统做了多少事”，而是让玩家立刻完成这三件事：

1. 理解产品价值
2. 连接钱包并开始扫描
3. 明白扫描后会得到什么结果

这版中保真方案基于当前项目已有视觉资产与业务逻辑，不另起炉灶。

## 视觉方向

### 关键词

- 工业终端
- 作战入口
- 冷硬秩序
- 可验证战绩

### 视觉主张

首页不要再像“功能展厅”，而要像“进入 Frontier 档案系统的操作台”。

因此建议：

- 首屏突出结果导向，不突出系统炫技
- 中段强调真实扫描与真实门槛
- 后段再释放分享价值和可信解释

### 沿用现有设计语言

基于当前 `packages/nextjs/src/app/styles/index.css` 的变量体系：

- 主色：`--sds-martian`
- 深底：`--sds-ink-0 ~ --sds-ink-3`
- 文字：`--sds-paper`
- 辅助色：`--sds-steel`、`--sds-amber`、`--sds-success`

### 字体策略

- 主标题：`var(--sds-font-display)`
- 正文：`var(--sds-font-inter)`
- 标签、状态、数据：`var(--sds-font-mono)`

不要新增别的花里胡哨字体，现有体系已经够用了。

## 页面结构

建议首页结构如下：

1. Header
2. Hero
3. How It Works
4. Live Chronicle
5. Achievement Preview
6. Proof & Trust
7. Warrior Card
8. Footer

## 中保真页面草图

```text
+----------------------------------------------------------------------------------------------------------------+
| HEADER                                                                                                         |
| [Logo + Product Name]                      [How It Works] [Achievements] [Live Chronicle] [Warrior Card]     |
|                                                                                           [Wallet Button]      |
+----------------------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------------------+
| HERO                                                                                                           |
|                                                                                                                |
| [Eyebrow] VERIFIED FRONTIER IDENTITY                                                                           |
| 把你在 Frontier 的行为，变成可验证的链上资历                                                                   |
| 连接钱包后，系统会扫描跃迁、锚定、击杀记录，实时显示进度，并在达标时开放勋章领取。                           |
|                                                                                                                |
| [Connect Wallet & Scan]   [View Sample Warrior Card]                                                           |
|                                                                                                                |
| [chip] Eve Eyes indexed   [chip] Sui testnet   [chip] soulbound medals                                         |
|                                                                                                                |
|                                                     +------------------------------------------------------+   |
|                                                     | LIVE PREVIEW                                         |   |
|                                                     | scan status      READY TO ANALYZE                   |   |
|                                                     | combat score     4178                               |   |
|                                                     | claimable        2 medals                           |   |
|                                                     | last event       gate jump confirmed                |   |
|                                                     | network          testnet                            |   |
|                                                     +------------------------------------------------------+   |
+----------------------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------------------+
| HOW IT WORKS                                                                                                   |
| [01] Connect Wallet         [02] Scan Activity          [03] Claim Medal                                       |
| wallet identity             Eve Eyes proof path         Sui soulbound proof                                    |
+----------------------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------------------+
| LIVE CHRONICLE                                                                                                 |
| +-------------------------------------------+  +------------------------------------------------------------+ |
| | wallet state                              |  | Chronicle Dashboard                                         | |
| | network state                             |  | medal progress                                               | |
| | env notes                                 |  | proof sources                                                | |
| | preview / testnet / claim rules           |  | claim readiness                                               | |
| +-------------------------------------------+  +------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------------------+
| ACHIEVEMENT PREVIEW                                                                                             |
| +----------------------------+ +----------------------------+ +----------------------------+                   |
| | Galactic Courier           | | Void Pioneer               | | Bloodlust Butcher          |                   |
| | jump threshold             | | anchor threshold           | | attacker threshold         |                   |
| | progress bar               | | progress bar               | | progress bar               |                   |
| +----------------------------+ +----------------------------+ +----------------------------+                   |
|                                                                                                                |
| +------------------------------------------------------------------------------------------------------------+ |
| | SCORE SUMMARY                                                                                              | |
| | claimed medal = full score | verified only = partial score | full set = bonus | rank tier preview        | |
| +------------------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------------------+
| PROOF & TRUST                                                                                                  |
| Data Source | Supported Behaviors | Threshold Logic | On-chain Result                                           |
+----------------------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------------------+
| WARRIOR CARD                                                                                                   |
| +------------------------------------------------+ +--------------------------------------------------------+ |
| | shareable warrior preview                      | | use cases                                              | |
| | score / title / medals / wallet               | | recruitment / guild proof / public profile            | |
| +------------------------------------------------+ +--------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------------------+
```

## 各模块详细规格

### 1. Header

#### 目标

- 提供清晰站点入口
- 保持导航稳定
- 让钱包操作固定可见

#### 结构

- 左侧：Logo + 产品名 + 简短身份标签
- 中部：4 个导航项
- 右侧：钱包按钮

#### 导航项

- `How It Works`
- `Achievements`
- `Live Chronicle`
- `Warrior Card`

#### 交互建议

- 当前区块滚动进入视口时，对应导航高亮
- Header 保持 sticky
- 滚动后背景加深，边框更明显

### 2. Hero

#### 目标

- 讲清产品
- 给出唯一主动作
- 展示扫描结果预期

#### 布局

- 桌面端：左右双栏，`5:4` 或 `6:5`
- 移动端：纵向堆叠，CTA 在上，结果预览卡在下

#### 左侧内容

- Eyebrow：
  - `VERIFIED FRONTIER IDENTITY`
- 主标题：
  - `把你在 Frontier 的行为，变成可验证的链上资历`
- 副标题：
  - `连接钱包后，系统会扫描跃迁、锚定、击杀记录，实时显示成就进度，并在达标时开放链上勋章领取。`

#### CTA

- 主按钮：`Connect Wallet & Scan`
- 次按钮：`View Sample Warrior Card`

#### 信任标签

- `Eve Eyes Indexed`
- `Sui Testnet`
- `Soulbound Medals`

#### 右侧结果预览卡

不要做成复杂终端矩阵，建议做成一张“战术结果卡”：

- 顶部状态条
  - `READY TO ANALYZE`
- 核心指标
  - `Combat Score`
  - `Claimable Medals`
  - `Last Event`
  - `Network`
- 底部一行提示
  - `Your timeline becomes verifiable once activity is detected.`

#### 视觉重点

- 主标题最大
- CTA 第二优先级
- 右侧卡片作为“结果承诺”
- 背景保留轻量 grid 和 radial glow，不要比正文更抢眼

### 3. How It Works

#### 目标

- 让用户在 3 秒内搞懂流程

#### 卡片结构

每张卡只保留：

- 编号
- 标题
- 一句说明
- 一个小图标

#### 推荐文案

1. `Connect Wallet`
   - `Use your Sui wallet as the identity anchor for your pilot record.`
2. `Scan Frontier Activity`
   - `Chronicle reads jumps, anchors, and combat traces from Eve Eyes.`
3. `Claim Verified Medals`
   - `Only threshold-complete achievements unlock soulbound on-chain claim.`

#### 版式建议

- 桌面端横排 3 卡
- 移动端纵排 3 卡
- 卡片高度一致
- 编号要大但不要喧宾夺主

### 4. Live Chronicle

#### 目标

- 让用户尽快进入真实业务模块

#### 布局

- 左侧窄栏：状态与提示
- 右侧宽栏：`ChronicleDashboard`

#### 左侧内容结构

1. 标题
   - `Live Chronicle`
2. 简短说明
   - `Connect your wallet to inspect what the system already recognizes.`
3. 状态块
   - wallet status
   - network status
   - DB / preview mode note
4. 规则提示
   - `default network: testnet`
   - `without EVE_EYES_API_KEY: preview mode`
   - `missing package ID: progress visible, claim disabled`

#### 交互建议

- Hero CTA 点击后直接滚动到这里
- 如果钱包未连接，右侧 Dashboard 顶部提示用户先连接
- 如果已连接，直接展示进度与 claim readiness

### 5. Achievement Preview

#### 目标

- 展示玩家到底在追什么
- 把复杂规则压缩成人能懂的目标卡

#### 结构

- 上半区：3 张代表成就卡
- 下半区：分数规则摘要

#### 成就卡字段

每张卡建议包含：

- medal 名称
- 行为类型
- 阈值
- 当前示例进度
- 一句意义说明

#### 三张代表卡

1. `Galactic Courier`
   - 代表物流/跃迁
2. `Void Pioneer`
   - 代表建设/锚定
3. `Bloodlust Butcher`
   - 代表战斗/击杀

#### 分数规则摘要

不要继续放过长表格，建议改成 4 个横向数据块：

- `Claimed Medal = Full Score`
- `Verified Only = Partial Score`
- `8/8 Claimed = Set Bonus`
- `Rank = Normalized 0–10,000`

### 6. Proof & Trust

#### 目标

- 回答“凭什么判定”
- 建立可信闭环

#### 结构

建议做成 4 个并列说明卡：

1. `Data Source`
   - Eve Eyes public + keyed scan path
2. `Behavior Classes`
   - jump / anchor / attacker confirmation
3. `Threshold Logic`
   - progress is tied to explicit activity counts
4. `On-chain Result`
   - claim unlocks soulbound medal on Sui

#### 风格建议

- 比 Hero 更硬核一点
- 多用 mono 标签和细边框
- 少用大段文案

### 7. Warrior Card

#### 目标

- 告诉玩家扫描后不止能 Claim，还能展示身份

#### 布局

- 左侧：Warrior 总卡预览
- 右侧：使用场景 + CTA

#### 右侧文案结构

- 标题：
  - `把你的 Frontier 档案发给任何人看`
- 说明：
  - `Warrior Card 会汇总你的战力分、头衔与勋章状态，适合招募、社群展示和身份背书。`

#### 使用场景

- `Alliance Recruitment`
- `Employer Verification`
- `Public Reputation`

#### CTA

- `Preview Warrior Card`
- 如果已连接钱包，可显示：
  - `Open My Warrior Page`

## 移动端规格

### 排版原则

- 所有双栏全部改单栏
- CTA 保持靠上
- 数据卡一屏内尽量只出现一个视觉重点

### 模块顺序

1. Hero
2. How It Works
3. Live Chronicle
4. Achievement Preview
5. Proof & Trust
6. Warrior Card

### 移动端 Hero

- 标题不超过 3 行
- CTA 纵向堆叠
- 结果卡紧跟 CTA

### 移动端 Achievement

- 三张 medal 卡纵向排列
- Score summary 放在 medal 卡之后

## 间距与层级建议

### 页面级间距

- 模块上下间距：`72px ~ 112px`
- 模块内卡片间距：`16px ~ 24px`

### 文本层级

- H1：最大，强 display 字体
- H2：模块标题，统一风格
- Label：mono + uppercase
- 正文：不超过 2 种字号层级

### 卡片原则

- 卡片层级不能乱
- 首屏最多 1 个大卡 + 3 个 chip
- 单个模块里不要同时出现 5 种以上容器风格

## 动效建议

只保留 3 类动效，别把页面整成电子垃圾：

1. 首屏元素错位渐入
2. Hero 结果卡轻微呼吸光效
3. 滚动进视口的模块上移淡入

扫描线效果只保留在少数重点卡片中：

- Hero 结果卡
- Warrior Card 预览

不要整页到处扫，晃眼。

## 推荐文案基调

英文标签保留工业系统感，中文主文案负责讲人话。

推荐风格：

- 标签偏英文
- 主标题和解释偏中文
- 数据字段偏英文或中英混合

这样既保留当前气质，又不至于太像硬核后台。

## 与当前实现的映射关系

建议复用或重组的现有模块：

- `CustomConnectButton`
- `EnvironmentRequirements`
- `NetworkSupportChecker`
- `ChronicleDashboard`
- `ScoreShowcase`
- `WarriorCallout`

建议调整方式：

- `ScoreShowcase`：收缩为分数摘要区，不再独立撑大段页面
- `WarriorCallout`：后置，强化成结果价值展示
- `ChronicleDashboard`：前置，成为首页核心业务模块
- `page.tsx`：减少首屏自解释性终端块

## 下一步落地建议

如果你下一步让我继续干，最合理的顺序是：

1. 先按这份中保真方案改首页 section 顺序
2. 重做 Hero 为“左文案 + 右结果预览卡”
3. 前置 `ChronicleDashboard`
4. 合并 `ScoreShowcase` 与 `Proof Classes`
5. 最后再统一文案、按钮和锚点

## 结论

这版首页中保真方案的核心，不是“更酷”，而是“更准”。

要让用户看到首页时，脑子里马上形成这个链路：

`我连钱包 -> 系统扫我的 Frontier 行为 -> 我看到成就进度 -> 达标后领取链上勋章 -> 再把身份分享出去`

这才是这个产品该有的首页叙事。
