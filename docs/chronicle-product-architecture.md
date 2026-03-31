# Frontier Chronicle Product Architecture

这个仓库现在的主线不是 starter demo，而是一个能跑的 `Chronicle -> Medal -> Warrior Share` 产品。

这份文档只讲产品架构边界，不讲具体安全票据实现细节。

## 产品主线

Chronicle 的目标很简单：

1. 玩家连接 Sui 钱包
2. 服务端聚合玩家在 EVE Frontier 里的可索引活动
3. 系统把活动进度映射成 Chronicle 奖章状态
4. 已达标的奖章可以发起链上领取
5. 已领取的奖章回流到 Warrior 页面用于展示和传播

## 分层原则

参考 `world-contracts` 的价值不在于照搬 Solidity/MUD 代码，而在于把世界拆成清晰的职责边界。

Chronicle 当前建议保持这四层：

### 1. Product State Layer

职责：定义产品里“什么叫一个奖章、一个玩家快照、一个 Warrior 展示状态”。

当前对应：

- `packages/nextjs/src/app/chronicle/config/medals.ts`
- `packages/nextjs/src/app/chronicle/types.ts`
- `packages/contract/move/medals/sources/medals.move`

边界要求：

- 奖章定义属于产品状态，不属于 UI 组件
- 链上模板是产品状态的链上表示，不应该由前端页面拼出来

### 2. Ingestion & Verification Layer

职责：从外部世界拿到玩家行为，并整理成 Chronicle 可消费的活动计数和证据。

当前对应：

- `packages/nextjs/src/app/server/chronicle/eveEyes.ts`

边界要求：

- 外部数据接入单独放在 server 侧
- UI 不直接碰 Eve Eyes
- 未来如果接官方 world data / gate context，也进这一层，不要散落到页面代码里

### 3. Chronicle Application Layer

职责：把外部活动、链上状态、产品规则装配成一个统一的 snapshot。

当前对应：

- `packages/nextjs/src/app/server/chronicle/getSnapshot.ts`
- `packages/nextjs/src/app/server/chronicle/snapshot.ts`
- `packages/nextjs/src/app/server/chronicle/contractState.ts`
- `packages/nextjs/src/app/server/chronicle/chronicleArchitecture.ts`

边界要求：

- 这一层负责“编排”
- 只输出 Chronicle snapshot，不直接处理页面交互
- 奖章进度计算和链上对象读取分开，避免一个文件既做 RPC 又做业务判断

### 4. Delivery Layer

职责：把 Chronicle snapshot 交给 API、Dashboard 和 Warrior 页面消费。

当前对应：

- `packages/nextjs/src/app/api/chronicle/route.ts`
- `packages/nextjs/src/app/chronicle/hooks/useChronicleSnapshot.ts`
- `packages/nextjs/src/app/chronicle/components/ChronicleDashboard.tsx`
- `packages/nextjs/src/app/warrior/[walletAddress]/page.tsx`

边界要求：

- API 只做参数校验和返回
- Hook 只做请求生命周期管理
- Dashboard 只做展示和交互，不负责拼业务规则

## 链上层怎么定位

Move 合约不是“后端的替代品”，而是 Chronicle 产品里的结算层。

它应该只负责：

- 奖章模板注册与版本化
- 奖章是否已被某钱包领取
- 奖章 mint 和持久化

它不应该负责：

- 扫描 EVE 外部活动
- 抓外部 API
- 组装 UI 所需快照

## 当前仓库的推荐演进方向

### 继续保留

- `ChronicleDashboard` 作为单一入口页
- `getChronicleSnapshot` 作为 Chronicle 应用层入口
- `medals.move` 作为链上奖章结算模块

### 继续拆分

- 把链上读取代码维持在 `server/chronicle/contractState.ts`
- 把 snapshot 规则维持在 `server/chronicle/snapshot.ts`
- 把外部数据源维持在 `server/chronicle/eveEyes.ts`

### 不要再做的事

- 不要把更多 RPC 查询塞回 `getSnapshot.ts`
- 不要让页面组件自己推导链上状态
- 不要把 starter-era demo 的 greeting 流程继续混进 Chronicle 主线

## 跑通产品的最小闭环

一个可运行的 Chronicle 奖章产品，最小需要满足：

1. `/api/chronicle` 能稳定返回 snapshot
2. dashboard 能区分 `claimable / in progress / claimed`
3. 合约 package id 能随网络正确切换
4. Warrior 页面能展示已领取结果
5. 当外部索引或链上配置不完整时，系统返回 warning，而不是整页崩掉

这就是当前仓库应该持续守住的产品闭环。
