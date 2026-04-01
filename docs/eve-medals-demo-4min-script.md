# EVE Medals 4 分钟演示脚本

更新时间：2026-04-01

## 0. 录制前检查

正式录制前先确认这 6 件事：

1. `pnpm build`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm --filter nextjs test`
5. `pnpm testnet:probe`
6. `packages/nextjs/.env.local` 或部署环境里已经配置：
   - `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID`
   - `EVE_EYES_API_KEY`
   - `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY`
   - `CHRONICLE_DEMO_MINTER_PRIVATE_KEY`
   - `NEXT_PUBLIC_SITE_URL`

重点说明：

- 如果缺 `CHRONICLE_DEMO_MINTER_PRIVATE_KEY`，新钱包没有真实记录时，看不到 “Demo Mint” 兜底按钮。
- 如果缺 `EVE_EYES_API_KEY`，页面还能演示，但会退回 preview 扫描窗口，历史行为可能不完整。
- 如果临场网络不稳，保底入口是首页加 `?m=1` 的 mock 模式。

---

## 1. 4 分钟视频目标

这 4 分钟只讲一件事：

> `EVE Medals` 可以把 EVE Frontier 的真实行为变成可验证勋章；即便遇到新钱包在 testnet 没资产、没记录，也还能继续把演示跑到链上 mint 和分享。

视频里一定要覆盖 3 个结果：

1. 真实行为 -> 可领取 / 已绑定勋章
2. 新钱包零记录 -> Demo Mint 兜底
3. Warrior / Share 页面 -> 可传播证明

---

## 2. 推荐录制顺序

建议准备两个钱包：

- `Wallet A`：已有 Frontier 行为，至少能展示一枚 `claimable` 或 `claimed`
- `Wallet B`：新钱包，最好没有任何记录，用来演示 demo mint fallback

---

## 3. 逐分钟脚本

### 00:00 - 00:25 开场

画面：

- 打开首页
- 镜头停在 Chronicle 主区域，不要先滚太多

讲稿：

> 大家好，我们做的是 `EVE Medals`。  
> 它把 `EVE Frontier` 玩家真实发生过的行为，转成可验证的勋章、Warrior 档案和可分享卡片。  
> 今天我会用 4 分钟演示完整链路，包括真实 claim，以及新用户没有记录时的 testnet Demo Mint 兜底。

### 00:25 - 01:20 展示真实 Chronicle 扫描

画面：

- 连接 `Wallet A`
- 停在 Chronicle Dashboard 顶部
- 展示 `Deep Scan / Preview Scan`、已索引页数、最近轨迹、Ready To Claim
- 往下滚到 `Ready To Claim` / `In Progress` / `Bound`

讲稿：

> 这里不是单纯列 NFT，而是把 Frontier 行为翻译成门槛、证据和链上状态。  
> 系统会从 Eve Eyes 拉取行为，再把结果组装成 Chronicle snapshot。  
> 你可以看到哪些行为已经被索引、哪些勋章在推进、哪些已经达到领取条件。

### 01:20 - 02:05 演示真实 claim

画面：

- 在 `Wallet A` 上点击一枚可领取勋章
- 钱包确认
- 等待交易成功提示
- 刷新后展示该勋章进入 `Bound`
- 打开 explorer 或展示 digest 提示

讲稿：

> 当某枚勋章满足条件后，服务端会生成 claim ticket，钱包发起真实 testnet 交易，Move 合约校验票据后完成 mint。  
> 所以这里不是前端自己说“你达标了”，而是有服务端签票和链上验票的完整闭环。  
> 现在这枚勋章已经绑定到钱包，并且状态已经回流到产品里。

### 02:05 - 02:45 演示新钱包零记录的兜底 mint

画面：

- 切换到 `Wallet B`
- Chronicle 顶部显示没有可领取勋章
- 向下滚到 `Ready To Claim` 区域
- 展示 `临时演示 Mint 一枚`
- 打开弹窗，选一枚勋章

讲稿：

> 黑客松演示还有一个现实问题：新钱包在 testnet 往往没有资产，也没有历史行为。  
> 如果这时候完全卡死，演示就断了。  
> 所以我们补了一条 testnet-only 的 Demo Mint fallback。  
> 当当前钱包没有真实可领取勋章时，仍然可以从 active template 里临时 mint 一枚，把后面的绑定和分享链路继续跑完。

### 02:45 - 03:20 完成 Demo Mint

画面：

- 点击确认 Demo Mint
- 等成功弹窗出来
- 展示 digest
- 进入分享

讲稿：

> 这一步走的是服务端 demo admin 发起的真实 testnet `admin_mint`。  
> 它不会伪造 Chronicle 的真实进度和证据，只是保证在黑客松场景下，新钱包也能继续把链上绑定和分享流程展示完整。

### 03:20 - 03:55 展示 Warrior / Share

画面：

- 打开 Warrior 分享页或单 medal 分享页
- 展示卡片、二维码、分享按钮
- 如果方便，顺手打开一个生成后的图片或分享链接

讲稿：

> 勋章绑定完成后，它不会停在站内列表里。  
> 我们会把结果回流到 Warrior 页面和单勋章分享卡里。  
> 所以我们传播出去的不是一张没法验证的海报，而是一条可以回到产品、继续验证的荣誉入口。

### 03:55 - 04:00 收尾

讲稿：

> `EVE Medals` 想做的不是发一张 NFT 图，而是把 EVE Frontier 的真实行为，变成可验证、可展示、可传播的荣誉资产。谢谢大家。

---

## 4. 现场说辞重点

视频里尽量反复强调这 4 句：

1. `真实行为 -> snapshot -> medal state`
2. `claim 不是前端自说自话，而是服务端签票 + 链上验票`
3. `新钱包零记录时，testnet 还有 Demo Mint fallback`
4. `分享出去的是可回流验证的荣誉入口，不是死海报`

---

## 5. 录制时的保底方案

如果现场出现问题，按这个优先级救：

1. 真实 claim 正常，就优先录真实 claim
2. 新钱包没有行为时，切 Demo Mint fallback
3. 如果 testnet 抽风，立刻切 `/?m=1` 的 mock 模式，保住叙事和界面流程

Mock 模式适合兜底展示：

- 勋章状态变化
- 交易分步面板
- Warrior / 分享卡
- 完整 narration

但录视频时要明确说这是 fallback，不要把 mock 当成主链路。
