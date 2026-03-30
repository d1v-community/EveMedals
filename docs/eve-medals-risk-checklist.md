# EVE Medals 评委追问风险点清单

更新时间：2026-03-31

## 目的

这份文档就是专门列“容易被追问、容易翻车、容易被抓字眼狠狠干”的地方。  
不是让你害怕，是让你提前知道哪些话能说，哪些话现在说了就是给自己挖坑。

---

## 1. 产品定位风险

### 风险点

把项目直接说成：

- 社交增长引擎
- 完整增长系统
- EVE Frontier 社交流量平台

### 为什么危险

因为当前代码里虽然有分享入口和基础分享埋点，但还没有：

- referral
- campaign
- 来源归因
- 转化漏斗
- 裂变奖励

### 更安全说法

- achievement verification and sharing product
- identity and distribution layer
- evolving toward growth infrastructure

---

## 2. 链上叙事风险

### 风险点

把项目说成：

- 纯链上成就系统
- 完全由链上数据驱动
- 所有荣誉都直接由链上生成

### 为什么危险

因为当前主数据来源仍然强依赖 `Eve Eyes` 行为索引。  
链上更像是：

- 结果承载
- 荣誉持有证明
- 勋章状态回查

### 更安全说法

- indexed activity + on-chain ownership
- off-chain verification with on-chain honor layer
- behavior verification combined with Sui medal proof

---

## 3. Testnet 完整度风险

### 风险点

把现在的版本讲成：

- final trusted testnet deployment
- fully production-ready testnet contract
- already fully live on target chain environment

### 为什么危险

你自己已经知道：  
**真正可信的 testnet 合约对接还没有完全收口。**

### 更安全说法

- the core flow is working
- testnet integration is being finalized
- contract-side trust and deployment alignment are still being tightened

---

## 4. 分享能力表述风险

### 风险点

说：

- 分享功能还没有
- 目前完全不能分享
- 二维码还没做

### 为什么危险

因为按当前代码现状，这些已经不是“没有”，而是“已经有基础实现，但闭环还不够强”。

### 更准确说法

- share cards already exist
- QR entry points already exist
- the social loop exists in a basic form, but attribution and referral are not complete yet

---

## 5. 二维码验证风险

### 风险点

说：

- 扫码直接上链验证
- 二维码直接跳链上浏览器
- 分享卡就是链上证明页

### 为什么危险

当前二维码主要回到站内验证页，不是直接 explorer。

### 更安全说法

- QR returns users to the live verification page
- QR brings users back into the product context
- verification is re-opened inside the app flow

---

## 6. 自动铸造表述风险

### 风险点

说：

- 玩家行为一发生，系统就自动铸造 NFT
- 所有勋章都是后台自动发放

### 为什么危险

当前更准确的流程是：

- 行为被索引和判断
- 成就满足条件
- 玩家再发起领取或 mint

不是后台无感自动空投。

### 更安全说法

- eligible medals become claimable
- verified achievements unlock medal claiming
- players can claim honors once conditions are met

---

## 7. 真实性风险

### 风险点

说：

- 我们已经完全解决了数据真实性问题
- 所有成就都完全不可质疑

### 为什么危险

现在的真实性来自：

- 外部行为索引
- 固定规则映射
- 链上持有状态

这已经比纯文案强得多，但还不能吹成绝对终局。

### 更安全说法

- verifiable within the current indexing and rules framework
- stronger than static self-declared achievements
- continuing to improve trust and verification depth

---

## 8. 增长量化风险

### 风险点

如果评委问：

- 你们现在裂变效果多少
- 分享带来了多少新用户
- 链接转化率多少

你现场瞎编数字。

### 为什么危险

因为这类问题只要继续追两句，你就会原地爆炸。

### 更安全说法

- current phase is focused on establishing the shareable asset layer
- attribution and measurable conversion are next-phase work
- we intentionally separate what is already working from what is still being built

---

## 9. “这不就是游戏成就系统吗”风险

### 风险点

如果你回答不好，评委会觉得你只是做了个花哨徽章页。

### 推荐回应重点

你要强调区别在这四个词：

- verifiable
- portable
- public-facing
- shareable

不是站内角落里一个小徽章，而是一套可验证、可展示、可传播的荣誉表达层。

---

## 10. 评委如果追问“商业化呢”

### 风险点

一上来就谈大而空的 Web3 商业化。

### 更稳方向

先讲价值，再讲延展：

- 玩家身份与荣誉沉淀
- 组织/公会层面的荣誉体系
- 赛季和事件化荣誉
- 分享和传播带来的用户回流

别一张嘴就“tokenomics”，那玩意现在拿出来就是找抽。

---

## 11. 最危险的几句话

下面这些话现在尽量别说：

- We are already a complete growth engine
- Everything is fully on-chain
- This is already production-complete on trusted testnet
- QR takes users directly to chain proof
- We already have viral user growth working

---

## 12. 最稳的统一回答模板

如果你被追问到不想继续展开，就用这个模板收：

> 当前阶段，我们已经把行为验证、勋章领取、Warrior 展示和分享卡片这条主链路跑通了。  
> 增长归因、更强验证闭环以及最终可信环境对接，是下一阶段正在继续补齐的部分。

这句话稳，短，能救命。
