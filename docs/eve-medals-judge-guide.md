# EVE Medals Judge Guide

更新时间：2026-04-01

## 一句话看项目

> `EVE Medals` 把 `EVE Frontier` 玩家真实发生过的行为，变成可验证的勋章、Warrior 档案和可分享卡片。

## 评委建议关注的 4 个点

1. 这不是静态 NFT 展示页，而是 `行为索引 -> 资格判断 -> 链上绑定 -> 分享回流` 的完整产品环。
2. Chronicle 页面会把 Frontier 行为翻译成可解释的阈值、证据和状态，不是黑箱打分。
3. 真实 claim 依赖服务端 claim signer 和链上 registry 的双重校验，不是前端自己伪造成功状态。
4. 为了避免黑客松现场被“新钱包零记录”卡死，testnet 额外准备了 Demo Mint fallback，把演示继续推到真实上链和分享。

## 本次 Demo 你会看到什么

标准 4 分钟演示会覆盖 3 个结果：

1. 一个有真实 Frontier 行为的钱包，展示勋章从可领取到已绑定。
2. 一个没有记录的新钱包，在 testnet 上走 Demo Mint fallback。
3. Warrior / Medal 分享页，证明结果可以传播，并且能回到验证页面。

## 技术拆解

### 链下

- Eve Eyes 负责 Frontier 行为索引
- Chronicle snapshot 负责把行为翻译成 medal progress / proof / readiness
- Wallet sync 可把钱包身份同步到 SQL

### 链上

- Sui Move 合约负责 soulbound medal 持有证明
- Claim ticket 由服务端签发
- Move 合约负责验签、验模板、验过期时间、验重复领取

### 前端

- Chronicle Dashboard 展示行为、阈值、证据和领取状态
- Warrior 页面展示公开档案
- Share 卡片和二维码负责外部传播

## 现场边界说明

请把当前版本理解为：

> 一个已经跑通主链路的 `working product loop`

当前 demo 的重点是：

- 可验证成就
- 链上绑定
- 可分享荣誉

而不是：

- 完整社交增长漏斗
- 大规模生产级运营后台
- 已经封装到零配置的多网络 SaaS

## 风险与保底

### 正常优先级

1. 优先演示真实 claim
2. 新钱包没有记录时，切 Demo Mint fallback
3. 如果 testnet 或外部索引临场抽风，使用 `/?m=1` 的 mock 模式保住叙事和产品闭环

### 需要提前配好的环境

- `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID`
- `EVE_EYES_API_KEY`
- `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY`
- `CHRONICLE_DEMO_MINTER_PRIVATE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 建议评委提问方向

如果你想快速判断项目是不是只停留在概念，可以追问这几件事：

1. claim 为什么不是前端直接 mint
2. proof 和 share 页面之间如何回流验证
3. Demo Mint fallback 为什么只开放在 testnet
4. 后续如何把 Warrior / Medal 分享变成增长入口

## 配套资料

- [Hackathon one-pager](./eve-medals-hackathon-one-pager.md)
- [4-minute demo script](./eve-medals-demo-4min-script.md)
- [5-minute demo script](./eve-medals-demo-5min-script.md)
- [Chronicle claim success flow](./chronicle-claim-success-flow.md)
