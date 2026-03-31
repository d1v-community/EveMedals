# EVE Medals
[![Discord chat](https://img.shields.io/discord/1237259509366521866.svg?logo=discord&style=flat-square)](https://discord.com/invite/HuDPpXz4Hx)

[English](./README.md) | [简体中文](./README.zh-CN.md) | [Íslenska](./README.is-IS.md)

![EVE Medals](./docs/assets/EveMedals.png)

[在 Sui Overflow 2024 黑客松 Randomness 赛道获得第一名](https://blog.sui.io/2024-sui-overflow-hackathon-winners/)

`EVE Medals` 是一个构建在 Sui 上的 `EVE Frontier` 成就产品。它会扫描玩家活动，把可验证进度转成奖章可领取状态，发放钱包绑定奖章，并通过公开的 Warrior 页面展示和分享证明。

这个仓库是当前线上 `Frontier Chronicle -> Medal Claim -> Warrior Share` 产品流程的 `pnpm` monorepo。仓库里仍然残留少量 starter 时期的命名和目录，但真正的业务事实来源是 Chronicle、奖章、钱包同步和 Warrior 页面。

## 产品主流程

1. 玩家连接 Sui 钱包
2. 应用基于已索引的 `EVE Frontier` 活动和链上奖章状态构建 Chronicle 快照
3. 达标奖章进入可领取状态
4. BFF 生成签名 claim ticket，Move 合约铸造钱包绑定奖章
5. 已领取奖章展示在 Warrior 页面和分享入口中

## 仓库结构

- `packages/nextjs`：Next.js 16 应用，包含 Chronicle 面板、API 路由、钱包同步、Warrior 页面和分享能力
- `packages/contract`：位于 `move/medals` 的 Sui Move 包和网络部署辅助脚本
- `docs`：产品、架构、演示和评审资料

关键业务路径：

- `packages/nextjs/src/app/chronicle`
- `packages/nextjs/src/app/api/chronicle/route.ts`
- `packages/nextjs/src/app/api/users/route.ts`
- `packages/nextjs/src/app/server/chronicle`
- `packages/nextjs/src/app/server/db`
- `packages/contract/move/medals/sources/medals.move`

## 当前已实现能力

- 基于 Eve Eyes 的 Chronicle 活动扫描
- 可解释的奖章门槛和领取准备状态
- 带 TTL 校验的签名 claim ticket
- Sui 上的钱包绑定奖章铸造
- 在配置 `DATABASE_URL` 时自动执行钱包到数据库的用户同步
- Warrior 公开页面和分享追踪能力

## 环境要求

- [Node.js 20+](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Suibase](https://suibase.io/how-to/install.html)

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

按需创建 `packages/nextjs/.env.local`：

```bash
DATABASE_URL=postgres://...
EVE_EYES_API_KEY=...
CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY=suiprivkey...
CHRONICLE_CLAIM_TICKET_TTL_MS=600000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=0x...
```

如果你使用下面的工作区脚本部署 Move 合约，对应网络的 `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` 会自动写入 `packages/nextjs/.env.local`。

### 3. 启动应用

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

如果没有额外指定网络，应用默认按 `testnet` 的钱包和网络行为运行。

## 带合约的本地开发

先启动本地 Sui 基础设施：

```bash
pnpm localnet:start
```

然后把奖章合约部署到 localnet：

```bash
pnpm localnet:deploy
```

接下来：

1. 把钱包切到 `localnet`
2. 用钱包自带 faucet，或者执行：

```bash
pnpm localnet:faucet 0xYOURADDRESS
```

3. 使用 `pnpm dev` 启动应用

本地 Explorer 地址是 [http://localhost:9001](http://localhost:9001)。

## 环境变量缺失时的行为

| 变量 | 作用 | 缺失时的行为 |
| --- | --- | --- |
| `DATABASE_URL` | 启用服务端数据库访问和钱包同步 | 应用仍可加载，但 `/api/users` 会返回 `databaseEnabled: false`，钱包同步会跳过 |
| `EVE_EYES_API_KEY` | 启用更深的 Eve Eyes 历史扫描 | Chronicle 会退回 preview 模式，只能看到公开页面窗口内的数据 |
| `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY` | 为奖章领取签发 claim ticket | 仍可扫描和验证奖章，但不会签发 claim ticket |
| `CHRONICLE_CLAIM_TICKET_TTL_MS` | claim ticket 的有效期，单位毫秒 | 默认值为 `600000` |
| `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` | 各网络对应的合约 package ID | 仍可扫描，但当前网络的领取和链上交互会被禁用 |
| `NEXT_PUBLIC_SITE_URL` | 用于证据页和分享链接的站点地址 | 回退到 `http://localhost:3000` |

## 常用命令

除非特别说明，以下命令都在仓库根目录执行。

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动 Next.js 开发服务器 |
| `pnpm build` | 构建 Move 合约和 Next.js 应用 |
| `pnpm lint` | 运行 Next.js 工作区的 ESLint |
| `pnpm test` | 运行 Move 合约测试 |
| `pnpm --filter nextjs test` | 运行 Next.js 集成测试 |
| `pnpm --filter nextjs db:create-migration <name>` | 创建带序号的 SQL 迁移文件 |
| `pnpm --filter nextjs db:migrate` | 执行 SQL 迁移 |
| `pnpm localnet:start` | 启动 localnet 和本地 explorer |
| `pnpm localnet:deploy` | 发布 Move 合约到 localnet，并把 package ID 写入 `.env.local` |
| `pnpm devnet:deploy` | 发布到 devnet，并更新 `.env.local` |
| `pnpm testnet:deploy` | 发布到 testnet，并更新 `.env.local` |
| `pnpm mainnet:deploy` | 发布到 mainnet，并更新 `.env.local` |
| `pnpm vercel:prod` | 从仓库根目录通过 Vercel 部署应用 |

只有在你明确知道依赖校验问题来源时，才使用 `*:deploy:no-dependency-check`。

## 数据库与钱包同步

- 钱包连接会触发 `packages/nextjs/src/app/components/WalletUserSync.tsx`
- 客户端会把钱包身份同步到 `POST /api/users`
- SQL 迁移文件位于 `packages/nextjs/db/migrations`
- 当前测试覆盖了迁移流程和用户同步集成逻辑

现有迁移文件：

- `packages/nextjs/db/migrations/00001_init.sql`
- `packages/nextjs/db/migrations/00002_share_events.sql`

## 网络与部署说明

- 如果没有显式指定网络，应用默认优先按 `testnet` 处理
- `pnpm localnet:deploy`、`pnpm devnet:deploy`、`pnpm testnet:deploy` 和 `pnpm mainnet:deploy` 都会发布 `packages/contract/move/medals`
- 部署辅助脚本会把 package ID 写入 `packages/nextjs/.env.local`
- 不要提交 `packages/nextjs/.env.local` 或任何密钥
- 如果你从 CI 或 Vercel 部署，请同步配置相同的 `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID`

常用辅助命令：

- `pnpm devnet:address`
- `pnpm testnet:address`
- `pnpm mainnet:address`
- `pnpm devnet:links`
- `pnpm testnet:links`
- `pnpm mainnet:links`

## 测试

合约测试：

```bash
pnpm test
```

Next.js 集成测试：

```bash
pnpm --filter nextjs test
```

Lint：

```bash
pnpm lint
```

## 文档

- [黑客松一页纸](./docs/eve-medals-hackathon-one-pager.md)
- [评审指引](./docs/eve-medals-judge-guide.md)
- [Chronicle 产品架构](./docs/chronicle-product-architecture.md)
- [1 分钟答辩稿](./docs/eve-medals-1min-defense.md)
- [5 分钟演示脚本](./docs/eve-medals-demo-5min-script.md)

## 许可证

Copyright (c) 2024 Konstantin Komelin and other contributors

代码采用 [MIT](./LICENSE) 许可证。

NFT 使用的 SVG 图形采用 [CC-BY 4.0](./LICENSE-GRAPHICS) 许可证。
