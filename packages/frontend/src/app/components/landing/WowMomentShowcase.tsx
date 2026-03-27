'use client'

import { useState } from 'react'
import {
  CheckCircle2Icon,
  QrCodeIcon,
  RocketIcon,
  Share2Icon,
  SmartphoneIcon,
} from 'lucide-react'

type DemoStep = {
  id: 'trigger' | 'share' | 'project' | 'scan'
  label: string
  duration: string
  title: string
  description: string
  cue: string
}

type ShareFormat = {
  label: string
  size: string
  hint: string
  accent: string
  route: string
}

const demoSteps: DemoStep[] = [
  {
    id: 'trigger',
    label: '动作 1',
    duration: '20s',
    title: '完成第 10 次跃迁，触发“星际物流商”勋章',
    description:
      '玩家触发真实门槛 `10 次 gate::jump` 后，Chronicle 面板立刻亮起，把行为识别、进度达标和可领取状态连成一个瞬间。',
    cue: '先证明系统真能读懂 `gate::jump`，不是 PPT 挂件。',
  },
  {
    id: 'share',
    label: '动作 2',
    duration: '30s',
    title: '点击真实 Share Dialog，弹出勋章分享卡',
    description:
      '展示现有分享资产的两个真实尺寸：OpenGraph 1200×630 和 X 1200×600，让观众看到这不是截图，而是现成可传播素材。',
    cue: '让观众看到“这个东西已经能被转发”。',
  },
  {
    id: 'project',
    label: '动作 3',
    duration: '40s',
    title: '投屏手机，当场发到 X 或 Demo 群',
    description:
      '用手机投屏模拟现场分享，但文案和目标渠道都贴近现有实现：X、Telegram，以及复制链接后发进 Discord 群。',
    cue: '把产品价值从“成就系统”拉到“流量入口”。',
  },
  {
    id: 'scan',
    label: '动作 4',
    duration: '40s',
    title: '扫描卡片二维码，跳到真实勋章详情页',
    description:
      '镜头切到二维码与详情页，展示新玩家扫卡后直接落到 medal detail page，看到当前验证状态、网络信息和进一步进入应用的入口。',
    cue: '完成从分享卡到 Web App 的闭环。',
  },
]

const shareFormats: ShareFormat[] = [
  {
    label: 'OpenGraph',
    size: '1200 × 630',
    hint: 'Discord / Telegram / 群聊预览卡使用这一版',
    accent: '#f0642f',
    route:
      '/warrior/0x17c9...8be2/medals/galactic-courier/opengraph-image?network=testnet',
  },
  {
    label: 'X Preview',
    size: '1200 × 600',
    hint: 'X 分享使用单独比例，避免裁切掉核心信息',
    accent: '#d9a441',
    route:
      '/warrior/0x17c9...8be2/medals/galactic-courier/twitter-image?network=testnet',
  },
]

const qrMatrix = [
  '111111100101111111',
  '100000101101000001',
  '101110100001011101',
  '101110101111011101',
  '101110100101011101',
  '100000101001000001',
  '111111101010111111',
  '000000000110000000',
  '101011100101110101',
  '010101011111001010',
  '111000111001011101',
  '001011000110100010',
  '111010101011101110',
  '000000001010000000',
  '111111100111010010',
  '100000101001011011',
  '101110101110101001',
  '100000100010001111',
]

const starDots = [
  { top: '6%', left: '12%', size: 4, opacity: 0.4 },
  { top: '12%', left: '36%', size: 3, opacity: 0.32 },
  { top: '20%', left: '62%', size: 5, opacity: 0.36 },
  { top: '18%', left: '84%', size: 3, opacity: 0.28 },
  { top: '42%', left: '18%', size: 4, opacity: 0.3 },
  { top: '52%', left: '44%', size: 2, opacity: 0.25 },
  { top: '58%', left: '70%', size: 3, opacity: 0.22 },
  { top: '70%', left: '10%', size: 4, opacity: 0.22 },
  { top: '74%', left: '26%', size: 3, opacity: 0.24 },
  { top: '82%', left: '56%', size: 2, opacity: 0.2 },
  { top: '86%', left: '78%', size: 4, opacity: 0.22 },
] as const

function FrontierWordmark() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center bg-[#69b8f7] text-2xl font-black text-[#081018] [clip-path:polygon(18%_0,82%_0,100%_50%,82%_100%,18%_100%,0_50%)]">
        F
      </div>
      <div className="font-display text-lg uppercase tracking-[0.12em] text-[#f4efe2]">
        FRONTIER // <span className="text-[#69b8f7]">MEDALS</span>
      </div>
    </div>
  )
}

function FrontierTopBar() {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <FrontierWordmark />
      <div className="flex items-start gap-4 self-start xl:self-auto">
        <div className="text-right font-mono">
          <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f4efe2]">
            0x42f...a912
          </div>
          <div className="mt-1 text-sm uppercase tracking-[0.12em] text-[#7c8aa5]">
            142.50 sui
          </div>
        </div>
        <div className="border border-[#33587b] px-6 py-4 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-[#69b8f7]">
          Manage Wallet
        </div>
      </div>
    </div>
  )
}

function FrontierHero({
  title,
  status,
  version,
}: {
  title: string
  status: string
  version: string
}) {
  return (
    <div className="mt-12 grid gap-8 xl:grid-cols-[1.3fr_0.7fr] xl:items-start">
      <div>
        <h3 className="font-['Arial_Black','Azeret_Mono','sans-serif'] text-5xl font-black italic leading-[0.95] tracking-[-0.04em] text-[#eef3fb] drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
          {title}
        </h3>
      </div>
      <div className="flex flex-col items-start gap-2 xl:items-end">
        <div className="font-mono text-lg uppercase tracking-[0.22em] text-[#69b8f7]">
          STATUS:. {status}
        </div>
        <div className="font-mono text-sm uppercase tracking-[0.16em] text-white/14">
          {version}
        </div>
      </div>
    </div>
  )
}

function CardHex({ active = false, icon = 'dot' }: { active?: boolean; icon?: 'dot' | 'share' | 'qr' }) {
  return (
    <div className="relative h-24 w-20 bg-[#152235]/72 [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]">
      {icon === 'dot' ? (
        <div
          className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            active ? 'bg-[#69b8f7] shadow-[0_0_18px_rgba(105,184,247,0.65)]' : 'bg-white/20'
          }`}
        />
      ) : null}
      {icon === 'share' ? (
        <Share2Icon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white/28" />
      ) : null}
      {icon === 'qr' ? (
        <QrCodeIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white/28" />
      ) : null}
    </div>
  )
}

function MedalBlueprintCard({
  title,
  titleEn,
  badge,
  badgeTone = 'blue',
  metaRight,
  footerLeft,
  footerRight,
  icon = 'dot',
  highlight = false,
  description,
}: {
  title: string
  titleEn?: string
  badge: string
  badgeTone?: 'blue' | 'green'
  metaRight: string
  footerLeft: string
  footerRight: string
  icon?: 'dot' | 'share' | 'qr'
  highlight?: boolean
  description?: string
}) {
  const badgeClass =
    badgeTone === 'green'
      ? 'border-[#4ecdc4]/40 text-[#4ecdc4] bg-[#4ecdc4]/8'
      : 'border-[#33587b] text-[#69b8f7] bg-[#0f1a28]'

  return (
    <article
      className={`relative border px-8 py-8 ${
        highlight ? 'border-[#69b8f7] shadow-[0_0_36px_rgba(105,184,247,0.08)]' : 'border-[#4470a0]'
      } bg-[rgba(8,13,22,0.72)]`}
    >
      <div className="flex items-start justify-between gap-6">
        <CardHex active={highlight} icon={icon} />
        <div className="flex flex-col items-end gap-3 text-right">
          <div className={`border px-4 py-2 font-mono text-sm font-semibold uppercase tracking-[0.08em] ${badgeClass}`}>
            {badge}
          </div>
          <div className="font-mono text-sm uppercase tracking-[0.08em] text-[#69b8f7]/84">
            {metaRight}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="font-['Arial_Black','Azeret_Mono','sans-serif'] text-4xl font-black italic tracking-[-0.05em] text-[#eef3fb] sm:text-5xl">
          {title}
        </div>
        {titleEn ? (
          <div className="mt-3 font-mono text-sm uppercase tracking-[0.22em] text-white/18">
            {titleEn}
          </div>
        ) : null}
      </div>

      <div className="mt-14 border-t border-white/6 pt-8">
        {description ? (
          <p className="mb-6 max-w-xl text-sm leading-7 text-white/44">{description}</p>
        ) : null}
        <div className="flex items-center justify-between gap-4 font-mono text-sm uppercase tracking-[0.08em] text-white/22">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      </div>
    </article>
  )
}

function FrontierScene({
  title,
  status,
  version,
  children,
}: {
  title: string
  status: string
  version: string
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-[#1b3552] bg-[radial-gradient(circle_at_20%_0%,rgba(30,69,111,0.16),transparent_26%),linear-gradient(180deg,#060b12_0%,#09111a_100%)] px-5 py-5 sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0">
        {starDots.map((dot, index) => (
          <span
            key={`${dot.left}-${dot.top}-${index}`}
            className="absolute rounded-full bg-[#8fcbff]"
            style={{
              top: dot.top,
              left: dot.left,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              opacity: dot.opacity,
              boxShadow: '0 0 12px rgba(143,203,255,0.18)',
            }}
          />
        ))}
      </div>
      <div className="relative">
        <FrontierTopBar />
        <FrontierHero title={title} status={status} version={version} />
        <div className="mt-12">{children}</div>
      </div>
    </div>
  )
}

function StepBadge({
  active,
  label,
  duration,
}: {
  active: boolean
  label: string
  duration: string
}) {
  return (
    <div
      className="rounded-[1rem] border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.22em]"
      style={{
        borderColor: active ? 'rgba(240,100,47,0.34)' : 'rgba(255,255,255,0.08)',
        background: active ? 'rgba(240,100,47,0.12)' : 'rgba(255,255,255,0.03)',
        color: active ? '#f0642f' : 'rgba(244,239,226,0.7)',
      }}
    >
      {label} · {duration}
    </div>
  )
}

function ShareFormatButton({
  active,
  format,
  onClick,
}: {
  active: boolean
  format: ShareFormat
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[1rem] border px-3 py-3 text-left transition-transform hover:-translate-y-0.5"
      style={{
        borderColor: active ? `${format.accent}55` : 'rgba(255,255,255,0.08)',
        background: active ? `${format.accent}18` : 'rgba(255,255,255,0.03)',
      }}
    >
      <div
        className="font-mono text-[0.62rem] uppercase tracking-[0.24em]"
        style={{ color: active ? format.accent : '#f4efe2' }}
      >
        {format.label}
      </div>
      <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/42">
        {format.size}
      </div>
      <p className="mt-2 text-xs leading-6 text-white/62">{format.hint}</p>
    </button>
  )
}

function GateTriggerPanel() {
  return (
    <FrontierScene
      title="我的勋章库"
      status="CONNECTED TO SUI-TESTNET"
      version="chronicle_live.v1.0"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <MedalBlueprintCard
          title="星际物流商"
          titleEn="GALACTIC COURIER"
          badge="STATUS: CLAIM_READY"
          metaRight="GATE::JUMP x10"
          footerLeft="OBJ_ID: 0x17c9...8be2"
          footerRight="VERSION: 1"
          highlight
          description="累计第 10 次跃迁已被 Chronicle 识别，卡片状态从进度跟踪切到可领取。"
        />
        <article className="border border-[#4470a0] bg-[rgba(8,13,22,0.72)] px-8 py-8">
          <div className="flex items-start justify-between gap-6">
            <CardHex icon="dot" />
            <div className="flex items-center gap-3 rounded-full border border-[#4ecdc4]/28 bg-[#4ecdc4]/10 px-4 py-2 font-mono text-sm uppercase tracking-[0.08em] text-[#4ecdc4]">
              <RocketIcon className="h-4 w-4" />
              gate::jump confirmed
            </div>
          </div>
          <div className="mt-8 grid gap-3">
            {[
              ['event', 'gate::jump'],
              ['route', 'K-02 frontier lane'],
              ['wallet', '0x17c9...8be2'],
              ['recognition', 'galactic courier threshold reached'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border border-white/6 bg-white/[0.02] px-4 py-3 font-mono text-sm uppercase tracking-[0.08em]"
              >
                <span className="text-white/22">{label}</span>
                <span className="text-[#69b8f7]">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-white/6 pt-8">
            <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.08em] text-[#7ec38f]">
              <CheckCircle2Icon className="h-4 w-4" />
              claim-ready
            </div>
          </div>
        </article>
      </div>
    </FrontierScene>
  )
}

function SharePanel({
  format,
  onFormatChange,
}: {
  format: ShareFormat
  onFormatChange: (format: ShareFormat) => void
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.68fr_1.32fr]">
      <div className="space-y-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/18 p-4">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#f0642f]">
            share trigger
          </div>
          <div className="mt-4 grid gap-3">
            {shareFormats.map((item) => (
              <ShareFormatButton
                key={item.label}
                active={item.label === format.label}
                format={item}
                onClick={() => onFormatChange(item)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
            real flow mapping
          </div>
          <p className="mt-3 text-sm leading-7 text-white/66">
            这里贴近现有实现来演：`MedalShareDialog` 已经支持复制链接、下载卡片、发到
            X、发到 Telegram，以及复制后跳 Discord。
          </p>
        </div>
      </div>

      <FrontierScene
        title="我的勋章库"
        status="CONNECTED TO SUI-MAINNET"
        version="explore_contract_v1.2.1"
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <MedalBlueprintCard
            title="星路先驱"
            titleEn="GALACTIC COURIER"
            badge="STATUS: JUST_MINTED"
            metaRight="NEW_OBJECT"
            footerLeft="OBJ_ID: 0x82f...94a1"
            footerRight="VERSION: 1"
            highlight
            description={`分享卡素材已生成，当前尺寸 ${format.size}，可直接用于 ${format.label} 预览。`}
          />
          <MedalBlueprintCard
            title="贸易巨擘"
            titleEn={format.label.toUpperCase()}
            badge="TYPE: ACHIEVEMENT"
            metaRight={`ASSET: ${format.label}`}
            footerLeft={`ROUTE: ${format.route}`}
            footerRight="DATE: 2026.03.28"
            icon="share"
            description="点击 Share 后展示的就是这类素材卡。现在先用 mock 对齐你给的终端蓝图风，再逐步换成真实渲染截图。"
          />
        </div>
      </FrontierScene>
    </div>
  )
}

function ProjectPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#f0642f]">
              phone projection
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
              从手机发出去，观众才真信这玩意能传播
            </h3>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-[#f4efe2]">
            <SmartphoneIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-[18rem] rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,16,18,1),rgba(8,9,10,1))] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
            <div className="rounded-[1.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(240,100,47,0.18),transparent_38%),linear-gradient(180deg,rgba(21,23,26,1),rgba(12,13,16,1))] p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/34">
                  live cast
                </span>
                <span className="rounded-full bg-[#7ec38f]/12 px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#7ec38f]">
                  mirrored
                </span>
              </div>
              <div className="mt-5 rounded-[1.2rem] border border-white/8 bg-black/22 p-4">
                <div className="font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
                  share to x
                </div>
                <p className="mt-3 text-xs leading-6 text-white/62">
                  I just unlocked Galactic Courier in Frontier Chronicle on Sui
                  Testnet. Scan the card and inspect the live medal record.
                </p>
              </div>
              <div className="mt-4 grid gap-2">
                {[
                  'attach image: galactic-courier-card.png',
                  'share url: /warrior/.../medals/galactic-courier?network=testnet',
                  'audience: x / telegram / discord demo group',
                ].map((line) => (
                  <div
                    key={line}
                    className="rounded-[0.9rem] border border-white/8 bg-white/[0.03] px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white/48"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-[#7ec38f]/18 bg-[linear-gradient(180deg,rgba(126,195,143,0.08),rgba(9,10,12,0.96))] p-5">
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#7ec38f]">
          distribution angle
        </div>
        <div className="mt-5 grid gap-3">
          {[
            {
              title: '不是“我有个勋章”',
              detail: '而是“我现在能把它扔进社交网络里，让别人顺着卡片回来”。',
            },
            {
              title: '不是“网页里自嗨”',
              detail: '而是现场投屏一发，所有人都明白这玩意可以进入真实玩家传播链路。',
            },
            {
              title: '不是“分享完就断”',
              detail:
                '卡片本身带着二维码，落点是现有 medal detail page，不是一个空壳宣传页。',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-4"
            >
              <div className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#f4efe2]">
                {item.title}
              </div>
              <p className="mt-2 text-sm leading-7 text-white/66">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScanPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.68fr_1.32fr]">
      <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#f0642f]">
              scan this card
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
              二维码就是新玩家入口
            </h3>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-[#f4efe2]">
            <QrCodeIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-[18rem] border border-white/12 bg-white/[0.03] p-4">
            <div className="flex items-center justify-center bg-[#08090a] p-4">
              <div className="grid grid-cols-[repeat(18,minmax(0,0.64rem))] gap-[0.1rem]">
              {qrMatrix.join('').split('').map((cell, index) => (
                <span
                  key={`${index}-${cell}`}
                  className="h-[0.64rem] w-[0.64rem]"
                  style={{
                    background: cell === '1' ? '#f4efe2' : 'transparent',
                  }}
                />
              ))}
              </div>
            </div>
            <div className="mt-3 text-center font-mono text-[0.56rem] uppercase tracking-[0.18em] text-white/44">
              scan to open the medal verification page
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
            speaker line
          </div>
          <p className="mt-3 text-sm leading-7 text-white/66">
            这里现场扫一下，不是回到首页，而是直接进入真实的 medal detail page。
            项目里服务端已经会为分享卡生成二维码，扫码后会重算当前 Chronicle 快照和勋章状态。
          </p>
        </div>
      </div>

      <FrontierScene
        title="我的勋章库"
        status="CONNECTED TO SUI-MAINNET"
        version="explore_contract_v1.2.1"
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <MedalBlueprintCard
            title="星路先驱"
            titleEn="MEDAL DETAIL"
            badge="STATUS: INDEX_VERIFIED"
            metaRight="OBJECT_PAGE"
            footerLeft="OBJ_ID: 0x82f...94a1"
            footerRight="VERSION: 2"
            highlight
            description="扫码后直接落到真实勋章详情页，看到最新 Chronicle 验证状态与页面入口。"
          />
          <MedalBlueprintCard
            title="贸易巨擘"
            titleEn="WEB APP ENTRY"
            badge="TYPE: ACHIEVEMENT"
            metaRight="NETWORK: TESTNET"
            footerLeft="OPEN WARRIOR PROFILE"
            footerRight="DATE: 2026.03.28"
            icon="qr"
            description="观众扫完码之后，不是看一张死图，而是进入应用继续看勋章、看验证、看入口。"
          />
        </div>
      </FrontierScene>
    </div>
  )
}

export default function WowMomentShowcase() {
  const [activeStep, setActiveStep] = useState<DemoStep['id']>('trigger')
  const [activeFormat, setActiveFormat] = useState<ShareFormat>(shareFormats[0])

  const currentStep = demoSteps.find((step) => step.id === activeStep) || demoSteps[0]

  return (
    <section id="wow-moment" className="scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="sds-panel sds-grid-overlay rounded-[2.2rem] border px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#f0642f]">
                wow moment demo
              </div>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-[#f4efe2] sm:text-5xl">
                别只讲系统，现场要把“解锁 → 分享 → 扫码引流”演出来。
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#f4efe2]/66">
              这一段专门为台上演示准备，但全部贴着现有产品流来 mock。
              观众看到的不是虚构流程，而是一条已经能接到真实页面和真实分享资产的传播闭环。
            </p>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
            <div className="space-y-4">
              {demoSteps.map((step) => {
                const active = step.id === activeStep

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className="block w-full rounded-[1.5rem] border p-4 text-left transition-transform hover:-translate-y-0.5"
                    style={{
                      borderColor: active ? 'rgba(240,100,47,0.28)' : 'rgba(255,255,255,0.08)',
                      background: active
                        ? 'linear-gradient(180deg,rgba(240,100,47,0.12),rgba(15,16,18,0.96))'
                        : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <StepBadge active={active} label={step.label} duration={step.duration} />
                    </div>
                    <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#f4efe2]/70">
                      {step.description}
                    </p>
                    <div className="mt-4 rounded-[1rem] border border-white/10 bg-black/18 px-3 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/44">
                      潜台词：{step.cue}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(11,12,14,0.98),rgba(15,17,20,0.96))] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-white/42">
                    stage mock
                  </div>
                  <div className="mt-2 text-lg font-semibold text-[#f4efe2]">
                    {currentStep.label} · {currentStep.duration}
                  </div>
                </div>
                <div className="rounded-full border border-[#f0642f]/20 bg-[#f0642f]/10 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#f0642f]">
                  keynote mode
                </div>
              </div>

              {activeStep === 'trigger' && <GateTriggerPanel />}
              {activeStep === 'share' && (
                <SharePanel
                  format={activeFormat}
                  onFormatChange={setActiveFormat}
                />
              )}
              {activeStep === 'project' && <ProjectPanel />}
              {activeStep === 'scan' && <ScanPanel />}
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {[
              '入口不是首页按钮本身，而是观众在卡片上第一次看到“这玩意能扫进去”。',
              '分享卡不只服务老玩家炫耀，更服务新玩家第一次接触 EVE Frontier。',
              '这套 mock 已经和现有 medal slug、分享尺寸、二维码落点对齐，后续替换真数据不会撕裂。',
            ].map((line) => (
              <div
                key={line}
                className="rounded-[1.2rem] border border-white/10 bg-black/18 px-4 py-4 text-sm leading-7 text-[#f4efe2]/66"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
