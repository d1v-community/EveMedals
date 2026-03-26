# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Frontier Chronicle** — EVE Frontier 成就系统，基于 Sui 区块链构建。核心流程：Eve Eyes 扫描玩家行为 → 前端解释进度门槛 → 玩家达标后在 Sui 上领取灵魂绑定勋章（Soulbound Medal）。

Monorepo 结构（pnpm workspaces）：
- `packages/frontend` — Next.js 16 App Router 前端
- `packages/backend` — Sui Move 合约包 + Suibase 部署脚本

## Commands

```bash
# 开发
pnpm dev                        # 启动前端开发服务器
pnpm build                      # 构建 Move 合约 + 前端

# 测试
pnpm test                       # Move 合约测试
pnpm --filter frontend test     # 前端集成测试（需要 DATABASE_URL）

# 代码质量
pnpm lint                       # 前端 ESLint
pnpm format                     # 前端格式化

# 数据库
pnpm --filter frontend db:create-migration <name>   # 生成 SQL 迁移文件
pnpm --filter frontend db:migrate                   # 应用迁移

# 本地网络（开发用）
pnpm localnet:start             # 启动 Suibase localnet + 本地浏览器
pnpm localnet:deploy            # 部署 Move 合约到 localnet，自动写入 .env.local

# 共享网络部署
pnpm testnet:deploy             # 部署到 testnet（默认目标网络）
pnpm devnet:deploy
pnpm mainnet:deploy

# Vercel
pnpm vercel:prod                # 部署到生产
```

## Architecture

### 数据流

```
Eve Eyes API
    ↓
GET /api/chronicle?walletAddress=&network=
    ↓  (server/chronicle/eveEyes.ts)
fetchWalletActivitySnapshot()   — 拉取玩家行为页数，汇总 killmail / anchor / jump 计数
    ↓
buildMedalStates()              — 对照门槛判断 unlocked / claimed / claimable
    ↓
ChronicleSnapshot               — 返回 profile + metrics + medals + warnings
    ↓
useChronicleSnapshot() hook     — 前端轮询，驱动 ChronicleDashboard
    ↓
claim_medal() Move 交易          — 前端通过 chronicle/helpers/transactions.ts 构造并提交
```

### 关键模块

| 路径 | 职责 |
|---|---|
| `src/app/api/chronicle/route.ts` | Chronicle API 路由，聚合 Eve Eyes + Sui 链上状态 |
| `src/app/server/chronicle/eveEyes.ts` | Eve Eyes API 客户端，preview/authenticated 两种扫描模式 |
| `src/app/chronicle/types.ts` | `ChronicleSnapshot` 等核心类型定义 |
| `src/app/chronicle/config/medals.ts` | 三种勋章的元数据定义（kind / slug / 门槛） |
| `src/app/chronicle/hooks/useChronicleSnapshot.ts` | 前端数据获取 hook |
| `src/app/chronicle/helpers/transactions.ts` | 构造 `claim_medal` PTB 交易 |
| `src/app/components/WalletUserSync.tsx` | 钱包连接时自动同步用户到数据库 |
| `src/app/api/users/route.ts` | 钱包用户 upsert 接口 |
| `src/app/server/db/` | SQL 迁移执行器与数据库访问 |
| `packages/backend/move/greeting/sources/medals.move` | Move 合约：Medal SBT + MedalRegistry |

### Move 合约

合约模块名：`medals::medals`。三种勋章 kind（`u8`）：
- `1` = Bloodlust Butcher（5 killmail 攻击）
- `2` = Void Pioneer（1 network node 锚 或 3 storage unit 锚）
- `3` = Galactic Courier（10 gate 跃迁）

`MedalRegistry` 作为共享对象存在，通过 dynamic field 防止重复领取（`ClaimKey { owner, medal_kind }`）。

## Environment Variables

前端需要以下环境变量（`packages/frontend/.env.local` 或部署平台）：

```
# Move 合约包 ID（localnet:deploy / testnet:deploy 等会自动写入）
NEXT_PUBLIC_LOCALNET_CONTRACT_PACKAGE_ID=
NEXT_PUBLIC_DEVNET_CONTRACT_PACKAGE_ID=
NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=
NEXT_PUBLIC_MAINNET_CONTRACT_PACKAGE_ID=

# Eve Eyes 活动索引 API（缺失时退回 preview 模式，只扫公开首页）
EVE_EYES_API_KEY=
EVE_EYES_BASE_URL=https://eve-eyes.d0v.xyz   # 可选覆盖

# 数据库（缺失时钱包同步功能禁用，前端其他功能仍正常）
DATABASE_URL=
```

**默认网络：testnet**（Eve Eyes 当前索引 frontier testnet 活动）。

## Code Conventions

- TypeScript，2 空格缩进，单引号，无分号
- `~~/*` 是 `packages/frontend/src/app/*` 的路径别名
- 新增勋章类型：先改 `chronicle/config/medals.ts`，再改 `api/chronicle/route.ts` 中的 `buildMedalStates`，最后改 Move 合约
- server-only 逻辑（DB、Eve Eyes 调用）放 `src/app/server/`，不能在客户端组件中直接使用
- 扩展现有模块（chronicle / medals / db）而不是创建平行抽象
- 前端测试在 `DATABASE_URL` 缺失时应干净地 skip，不应报错退出
