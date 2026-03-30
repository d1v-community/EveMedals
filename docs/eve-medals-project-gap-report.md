# EVE Medals 项目定位与差异报告

更新时间：2026-03-31  
判断口径：基于当前工作区代码、文档和目录结构，不把仓库里的 starter 历史残留当产品事实。

## 1. 这个项目现在到底是干什么的

这仓库当前更准确的定义，不是一个单纯“发 NFT 做社交裂变”的展示页，而是一套围绕 `EVE Frontier` 玩家行为验证的产品闭环：

`Eve Eyes 行为索引 -> Chronicle 快照计算 -> 勋章解锁/领取 -> Warrior 展示与分享`

按代码现状，它已经包含这些主线能力：

1. 扫描玩家在 `EVE Frontier` 里的可索引行为，并生成 `Chronicle snapshot`
2. 把行为进度映射成 8 枚勋章状态：`locked / verified / claimable / claimed`
3. 在 Sui 上铸造或领取勋章对象，并回查钱包已持有勋章
4. 生成 `Warrior Profile` 总卡和 `Medal Share` 单勋章分享页/分享图
5. 钱包登录后把用户同步进 SQL 数据库
6. 记录基础分享事件

一句话讲，这项目当前更像：

> 一个基于 `Eve Eyes + Sui` 的 EVE Frontier 成就验证与分享产品，而不只是一个“NFT 社交增长引擎”。

## 2. 与你给出的产品表述逐句对照

你的目标表述：

> EVE Medals 是一个基于 NFT 的 EVE Frontier 社交增长引擎。  
> 我们为玩家铸造代表成就与荣誉的 NFT，并自动生成可分享的战绩卡片，将链上数据转化为社交资产，在提升玩家认同感的同时，实现社交裂变增长。

### 2.1 `“基于 NFT 的 EVE Frontier 社交增长引擎”`

**部分成立，但现在说大了。**

当前代码更偏向：

- 成就验证产品
- 勋章领取产品
- Warrior 身份展示产品
- 社交分享能力的雏形

还不能很扎实地叫“增长引擎”，原因是：

- 没有 `referral / invite / campaign` 参数体系
- 没有完整裂变归因链路
- 没有分享转化漏斗
- 没有用户拉新闭环

最多只能说已经有了“可传播入口”和“基础分享埋点”，还不是成熟增长系统。

### 2.2 `“为玩家铸造代表成就与荣誉的 NFT”`

**大方向成立，但实现细节和口号不完全一致。**

成立的部分：

- 前端确实围绕勋章成就在做
- 合约里确实有 `Medal`、`MedalTemplate`、`MedalRegistry`
- 服务端会根据快照生成可领取状态
- Warrior 页面会回查钱包已持有勋章

差异点：

1. 当前核心不是“纯链上成就系统”，而是“链下索引验证 + 链上持有证明”。
   - 成就数据主要来自 `Eve Eyes`
   - 链上更多承担的是结算与持有证明

2. 当前不是“真正自动铸造”。
   - 更准确是：玩家行为先被验证，再由用户发起 `claim` 或 `mint`
   - 不是后台自动空投到玩家钱包

3. 当前合约还有一个公开 `mint_medal_nft` 路径。
   - 这和“只有成就验证后才铸造”存在语义偏差
   - 前端虽然只在已解锁时展示这个入口，但从产品叙事上看，会削弱“成就真实性完全由验证驱动”的说法

4. 你已经明确说明：**还没真正对接最终 testnet 合约**。
   - 这意味着“testnet 上真实可验证、真实可传播”的产品口径现在还不能说满

### 2.3 `“自动生成可分享的战绩卡片”`

**这条其实已经基本成立。**

按当前代码，已存在：

- `Warrior Profile` 总卡分享
- 单勋章分享卡
- `Open Graph / Twitter / Discord` 动态图片
- 分享弹窗
- 复制链接
- 下载图片
- `X / Telegram / Discord` 分享入口
- 二维码

这里要纠正一个认知：  
你说“卡片不能分享、二维码也没有”，但按当前代码和已有文档，这俩并不是“没有”，而是：

- **分享卡已经有**
- **二维码已经有**
- **但增长闭环和验证落点还不够强**

也就是说，问题不是“分享能力不存在”，而是“分享能力还没进化成真正的增长系统”。

### 2.4 `“将链上数据转化为社交资产”`

**部分成立，但描述不准确。**

更准确的说法应是：

> 把 `EVE Frontier` 行为索引数据和 Sui 链上持有状态，组合成可传播的身份/荣誉资产。

原因：

- 当前分享卡的主要输入不是纯链上数据
- 它同时依赖 `Eve Eyes` 的行为索引结果
- 链上部分主要用于“是否已持有/是否已绑定”这类证明

所以如果你对外讲“把链上数据转成社交资产”，不算全错，但不够准确。  
更准确是“把行为验证结果 + 链上持有状态，转成社交资产”。

### 2.5 `“实现社交裂变增长”`

**现在只能算方向，不算已实现。**

目前只具备这些基础：

- 分享链接
- 分享图片
- 二维码落地页
- 基础分享事件记录

但还缺少增长系统该有的关键结构：

- 邀请关系
- 分享来源归因
- campaign 标记
- 裂变奖励或任务机制
- 分享到访问到连接钱包的全链路转化统计

所以现阶段最多能说：

> 项目已经具备社交传播素材和传播入口，但尚未完成真正的裂变增长闭环。

## 3. 这个项目相对目标表述，多了什么

这部分是你那段口号里没有明确写出来，但仓库里已经做了的能力。

### 3.1 Chronicle 行为快照系统

这项目不是“手工发 NFT”，而是有完整的行为扫描与成就判断层：

- 通过 `Eve Eyes` 拉 `killmail / gate / turret / assembly / storage_unit / network_node` 等行为
- 组装成 `ChronicleSnapshot`
- 计算 8 枚勋章的进度与状态

这是产品真正的技术主线。

### 3.2 Warrior 身份页

当前不只是“单张分享卡”，还有完整的 Warrior 页面：

- 展示钱包地址
- 展示角色信息
- 展示勋章总览
- 展示分数与 rank
- 作为分享卡二维码落地页/验证页的一部分

这比“只会发 NFT 卡片”更完整。

### 3.3 钱包用户同步到数据库

当前项目还有一条你口号里没写的业务能力：

- 钱包连接后调用 `/api/users`
- 用户信息落 SQL
- 为后续用户系统和运营埋基础

这说明项目已经在往“产品系统”方向走，不只是 demo 营销页。

### 3.4 预览模式降级

当关键环境没配齐时，系统不会直接炸：

- 没有 `EVE_EYES_API_KEY`：进入 `preview mode`
- 没有合约 package id：还能看进度，但不能 claim
- 没有 `DATABASE_URL`：页面能跑，但不会同步用户

这说明它已经考虑了线上运行时的降级体验。

## 4. 这个项目相对目标表述，还缺什么

### 4.1 还没接到真正可信的 testnet 合约

这是你已经明确知道的，也是当前最关键的现实差距。

影响：

- 对外不能把“testnet 已完整跑通”讲得太满
- 分享页里的“链上绑定”可信度还不能按正式产品口径对外承诺
- Demo 可以讲，正式产品背书还差最后一脚

### 4.2 裂变增长能力缺失

这是和“社交增长引擎”差距最大的一刀。

当前没有：

- 邀请码
- referral 参数
- 分享来源归因
- 新用户回流统计
- 从分享到钱包连接到领取的转化漏斗

所以它现在更像“可分享的成就产品”，不是“增长引擎”。

### 4.3 二维码落点不够强

当前二维码不是没做，而是**落到站内验证页**。

这意味着：

- 适合讲“可验证”
- 但不适合讲“直接链上证明”

如果你想把叙事拉到更强信任感，后面可以补：

- explorer 出口
- 站内验证页 + explorer 双跳转
- 更明显的链上 object / tx 证明入口

### 4.4 Discord 不是原生一键分享

当前 Discord 更接近：

- 复制链接
- 打开 Discord
- 用户自己粘贴发送

这个可以讲成“支持 Discord 分发”，但别讲成“原生一键发消息”。

### 4.5 增长数据还比较浅

当前能看到的只是基础分享事件记录。

还缺：

- 分享后访问量
- 分享后连接钱包量
- 分享后 claim 转化
- 渠道效果比较

没有这些数据，你就很难把“增长引擎”讲成可量化产品。

### 4.6 “成就即铸造”这层约束还不够硬

从产品叙事上，最理想的口径应该是：

> 玩家只有满足成就条件，才能得到这枚荣誉勋章。

但当前实现里，公开 `mint_medal_nft` 入口会让这个口径变松。  
即便前端已经尽量把入口藏在“已解锁”条件下，产品表达上仍然不如“只允许签名 claim”来得硬。

## 5. 当前最准确的产品定位建议

如果你现在要对外写一句更贴近代码现实的话，我建议改成下面这种版本：

> EVE Medals / Frontier Chronicle 是一套面向 EVE Frontier 玩家行为验证的成就产品。  
> 它会把 Eve Eyes 索引到的边境行为与 Sui 链上持有状态组合成可验证的勋章与 Warrior 档案，并生成可分享的社交卡片，为后续的社交传播与增长提供基础设施。

如果你想保留“增长”这个方向，但又不想吹过头，可以写成：

> EVE Medals 是一个基于 Sui 的 EVE Frontier 成就与社交传播系统。  
> 我们将玩家的 Frontier 行为验证结果转化为链上勋章、Warrior 档案和可分享卡片，先建立身份认同与传播入口，再逐步补齐增长归因与裂变机制。

这两版都比“已经是社交增长引擎”更稳。

## 6. 结论

### 当前真实定位

当前项目的真实定位是：

> `行为验证 + 勋章领取 + Warrior 展示 + 分享能力`

不是：

> `已经成熟的 NFT 社交裂变增长引擎`

### 与目标表述的核心差别

最大的差别有 4 个：

1. 当前产品核心是 `Chronicle 验证闭环`，不是 `增长闭环`
2. 数据来源不只是链上，还强依赖 `Eve Eyes` 行为索引
3. 分享卡和二维码其实已经有了，但增长归因还没成型
4. 真正可信的 `testnet` 合约对接还没完成

### 最终判断

如果按“有没有产品雏形”看：

**有，而且已经不是空壳。**

如果按“能不能直接叫社交增长引擎”看：

**现在还差火候，尤其差在 testnet 可信上线、裂变归因、分享转化闭环这三块。**

## 7. 证据文件

核心参考文件：

- `docs/chronicle-product-architecture.md`
- `docs/demo-day-v2-share-status.md`
- `docs/chronicle-contract-capability-summary.md`
- `packages/frontend/src/app/api/chronicle/route.ts`
- `packages/frontend/src/app/server/chronicle/getSnapshot.ts`
- `packages/frontend/src/app/server/chronicle/snapshot.ts`
- `packages/frontend/src/app/server/chronicle/eveEyes.ts`
- `packages/frontend/src/app/server/chronicle/contractState.ts`
- `packages/frontend/src/app/server/chronicle/claimTickets.ts`
- `packages/frontend/src/app/server/warrior/share.ts`
- `packages/frontend/src/app/server/warrior/medalShare.ts`
- `packages/frontend/src/app/server/warrior/qr.ts`
- `packages/frontend/src/app/warrior/[walletAddress]/components/MedalShareDialog.tsx`
- `packages/frontend/src/app/api/share-stats/route.ts`
- `packages/frontend/src/app/api/users/route.ts`
- `packages/backend/move/greeting/sources/medals.move`
