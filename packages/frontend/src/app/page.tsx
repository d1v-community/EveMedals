import type { CSSProperties } from 'react'
import OfficialActionButton from '~~/components/OfficialActionButton'
import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheckIcon,
  DatabaseIcon,
  RadarIcon,
  ShieldCheckIcon,
  WaypointsIcon,
} from 'lucide-react'
import ChronicleDashboard from '~~/chronicle/components/ChronicleDashboard'
import CustomConnectButton from './components/CustomConnectButton'
import EnvironmentRequirements from './components/EnvironmentRequirements'
import NetworkSupportChecker from './components/NetworkSupportChecker'

type SignalTone = 'martian' | 'steel' | 'amber' | 'success'

const heroSignals = [
  {
    label: 'Proof Source',
    value: 'EVE EYES',
    detail: 'player activity index',
  },
  {
    label: 'Recognition Layer',
    value: 'SUI MEDALS',
    detail: 'soulbound identity',
  },
  {
    label: 'Default Network',
    value: 'TESTNET',
    detail: 'wallet-aligned runtime',
  },
  {
    label: 'Player Target',
    value: 'PILOTS',
    detail: '行为优先，不是藏品优先',
  },
]

const operationFeed = [
  {
    time: '00:12',
    title: 'Gate route indexed',
    detail: '成功跃迁会被计入物流轨迹，而不是只留在截图里。',
    tone: 'steel',
  },
  {
    time: '00:31',
    title: 'Anchor behavior matched',
    detail: 'network node 与 storage unit 锚定会进入建设类判定。',
    tone: 'amber',
  },
  {
    time: '00:46',
    title: 'Killmail attacker confirmed',
    detail: '只有被 Eve Eyes 确认的 attacker 记录才会推进战斗奖章。',
    tone: 'martian',
  },
  {
    time: '01:04',
    title: 'Medal turned claimable',
    detail: '达标后才会亮起链上 Claim，不给玩家猜。',
    tone: 'success',
  },
] as const satisfies ReadonlyArray<{
  time: string
  title: string
  detail: string
  tone: SignalTone
}>

const protocolStages = [
  {
    index: '01',
    title: 'Scan frontier behavior',
    description:
      '把跃迁、锚定、击杀这些玩家行为从 Eve Eyes 拉成一份 Chronicle 快照。',
    icon: RadarIcon,
  },
  {
    index: '02',
    title: 'Explain thresholds and proof',
    description:
      '把每条行为映射成可解释的门槛、进度和证据来源，而不是神秘黑盒。',
    icon: ShieldCheckIcon,
  },
  {
    index: '03',
    title: 'Bind achievement on-chain',
    description:
      '达标之后才允许在 Sui 上领取 soulbound medal，把资历写成身份。',
    icon: BadgeCheckIcon,
  },
] as const

const proofChannels = [
  {
    title: 'Transit Ledger',
    subtitle: 'Galactic Courier',
    metric: '10',
    unit: 'gate jumps',
    detail: '真正运转边境的不是口号，而是持续被索引的跃迁记录。',
    source: '`gate::jump` traces become the logistics medal threshold.',
    tone: 'steel',
    icon: WaypointsIcon,
  },
  {
    title: 'Structure Footprint',
    subtitle: 'Void Pioneer',
    metric: '1 / 3',
    unit: 'node or storage anchors',
    detail: '玩家有没有真的在 Frontier 留下基础设施，这一条最能说明建设者身份。',
    source:
      '`network_node::anchor` or `storage_unit::anchor` makes the builder trace count.',
    tone: 'amber',
    icon: DatabaseIcon,
  },
  {
    title: 'Combat Trace',
    subtitle: 'Bloodlust Butcher',
    metric: '5',
    unit: 'confirmed attackers',
    detail: '只有被 killmail 确认的 attacker 记录，才算能拿来吹牛的战斗资历。',
    source: 'Confirmed attacker records are the proof source behind combat medals.',
    tone: 'martian',
    icon: BadgeCheckIcon,
  },
] as const satisfies ReadonlyArray<{
  title: string
  subtitle: string
  metric: string
  unit: string
  detail: string
  source: string
  tone: SignalTone
  icon: LucideIcon
}>

const runtimeNotes = [
  '默认按 testnet 校验钱包网络，没指定就先走 testnet。',
  '没有 `EVE_EYES_API_KEY` 时会退回 preview mode，但界面仍能解释进度。',
  '没有当前网络的 package ID 时，进度照样展示，只是链上 Claim 禁用。',
] as const

const toneDotClasses: Record<SignalTone, string> = {
  martian: 'bg-[#f0642f] shadow-[0_0_0_0.24rem_rgba(240,100,47,0.16)]',
  steel: 'bg-[#8ea1ad] shadow-[0_0_0_0.24rem_rgba(142,161,173,0.16)]',
  amber: 'bg-[#d9a441] shadow-[0_0_0_0.24rem_rgba(217,164,65,0.16)]',
  success: 'bg-[#7ec38f] shadow-[0_0_0_0.24rem_rgba(126,195,143,0.16)]',
}

const toneCardClasses: Record<SignalTone, string> = {
  martian:
    'border-[#f0642f]/26 bg-[linear-gradient(180deg,rgba(240,100,47,0.12),rgba(10,10,11,0.96))]',
  steel:
    'border-[#8ea1ad]/24 bg-[linear-gradient(180deg,rgba(142,161,173,0.12),rgba(10,10,11,0.96))]',
  amber:
    'border-[#d9a441]/24 bg-[linear-gradient(180deg,rgba(217,164,65,0.12),rgba(10,10,11,0.96))]',
  success:
    'border-[#7ec38f]/24 bg-[linear-gradient(180deg,rgba(126,195,143,0.12),rgba(10,10,11,0.96))]',
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#f0642f]">
      {children}
    </div>
  )
}

function ProtocolCard({
  index,
  title,
  description,
  icon: Icon,
}: {
  index: string
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <article className="sds-panel sds-reveal rounded-[1.8rem] px-5 py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#f0642f]">
          {index}
        </div>
        <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.04] text-[#f4efe2]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <h3 className="mt-7 font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-[#f4efe2]/68">
        {description}
      </p>
    </article>
  )
}

function ProofChannelCard({
  channel,
  index,
}: {
  channel: (typeof proofChannels)[number]
  index: number
}) {
  const Icon = channel.icon

  return (
    <article
      className={`sds-panel sds-reveal rounded-[1.9rem] border px-6 py-6 ${toneCardClasses[channel.tone]}`}
      style={{ animationDelay: `${index * 120}ms` } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#f4efe2]/52">
            {channel.subtitle}
          </div>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
            {channel.title}
          </h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.04] text-[#f4efe2]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-7 flex items-end gap-3">
        <div className="font-display text-5xl leading-none text-[#f4efe2]">
          {channel.metric}
        </div>
        <div className="max-w-[12rem] pb-1 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#f4efe2]/58">
          {channel.unit}
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-[#f4efe2]/72">
        {channel.detail}
      </p>

      <div className="mt-6 border border-white/10 bg-black/14 px-4 py-4">
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#f4efe2]/42">
          proof source
        </div>
        <div className="mt-3 text-sm leading-7 text-[#f4efe2]/82">
          {channel.source}
        </div>
      </div>
    </article>
  )
}

function FeedRow({
  event,
  index,
}: {
  event: (typeof operationFeed)[number]
  index: number
}) {
  return (
    <article
      className="sds-reveal border border-white/10 bg-black/16 px-4 py-4"
      style={{ animationDelay: `${index * 120}ms` } as CSSProperties}
    >
      <div className="flex items-start gap-3">
        <span
          className={`sds-pulse-dot mt-1.5 h-2.5 w-2.5 rounded-full ${toneDotClasses[event.tone]}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold tracking-wide text-[#f4efe2]">
              {event.title}
            </div>
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-[#f4efe2]/42">
              {event.time}
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#f4efe2]/66">
            {event.detail}
          </p>
        </div>
      </div>
    </article>
  )
}

function TacticalPreview() {
  return (
    <div className="sds-panel sds-grid-overlay sds-scanline overflow-hidden rounded-[2rem] border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,100,47,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(142,161,173,0.12),transparent_28%)]" />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[#f0642f]">
              simulated chronicle relay
            </div>
            <h2 className="mt-3 max-w-lg font-display text-3xl uppercase tracking-[0.08em] text-[#f4efe2]">
              把玩家行为转成链上可解释的 Frontier 资历。
            </h2>
          </div>

          <div className="flex h-24 w-24 items-center justify-center border border-[#f0642f]/24 bg-black/16">
            <div className="relative h-16 w-16">
              {[0, 1, 2].map((ring) => (
                <span
                  key={ring}
                  className="sds-radar-ring absolute inset-0 rounded-full border border-[#f0642f]/28"
                  style={{ animationDelay: `${ring * 1.1}s` } as CSSProperties}
                />
              ))}
              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0642f] shadow-[0_0_0_0.28rem_rgba(240,100,47,0.16)]" />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {heroSignals.map((signal) => (
            <div
              key={signal.label}
              className="border border-white/10 bg-black/16 px-4 py-4"
            >
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#f4efe2]/42">
                {signal.label}
              </div>
              <div className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
                {signal.value}
              </div>
              <div className="mt-2 text-sm text-[#f4efe2]/62">
                {signal.detail}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="border border-white/10 bg-black/18 p-5">
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#f4efe2]/42">
              observed activity classes
            </div>
            <div className="mt-5 space-y-4">
              {proofChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[#f4efe2]">
                      {channel.title}
                    </div>
                    <div className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[#f4efe2]/42">
                      {channel.metric} {channel.unit}
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-white/8">
                    <div
                      className="h-full bg-[linear-gradient(90deg,#f0642f_0%,#f0ba6e_100%)]"
                      style={{
                        width:
                          channel.subtitle === 'Void Pioneer'
                            ? '58%'
                            : channel.subtitle === 'Bloodlust Butcher'
                              ? '82%'
                              : '68%',
                      }}
                    />
                  </div>
                  <div className="mt-3 text-sm leading-6 text-[#f4efe2]/64">
                    {channel.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {operationFeed.map((event, index) => (
              <FeedRow key={event.title} event={event} index={index} />
            ))}

            <div className="border border-[#7ec38f]/28 bg-[linear-gradient(135deg,rgba(126,195,143,0.18),rgba(10,10,11,0.92))] px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#c9efd3]">
                    claim readiness
                  </div>
                  <div className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-[#f4efe2]">
                    Frontline proof sealed
                  </div>
                </div>
                <span className="border border-[#7ec38f]/30 bg-[#7ec38f]/12 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[#dbf5e2]">
                  ready to claim
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#e2f5e8]">
                这块不是拿来摆 NFT 海报的。它的职责是告诉玩家：你的行为已经被
                Frontier 体系认出来了，现在能不能上链、为什么能上链。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative pb-14">
      <section className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="sds-panel sds-grid-overlay overflow-hidden rounded-[2.4rem] border">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,100,47,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(142,161,173,0.08),transparent_28%)]" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-8">
              <div className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#f0642f]">
                eve frontier chronicle terminal
              </div>
              <nav className="flex flex-wrap items-center gap-2">
                <OfficialActionButton
                  className="!px-3 !py-2 !text-[0.62rem]"
                  icon="none"
                  targetId="protocol"
                  typeClass="ghost"
                >
                  Protocol
                </OfficialActionButton>
                <OfficialActionButton
                  className="!px-3 !py-2 !text-[0.62rem]"
                  icon="none"
                  targetId="proof-classes"
                  typeClass="ghost"
                >
                  Proof Classes
                </OfficialActionButton>
                <OfficialActionButton
                  className="!px-3 !py-2 !text-[0.62rem]"
                  icon="none"
                  targetId="chronicle-command"
                  typeClass="ghost"
                >
                  Live Chronicle
                </OfficialActionButton>
              </nav>
            </div>

            <div className="grid gap-10 px-5 py-7 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-10">
              <div className="flex flex-col justify-between">
                <div>
                  <SectionEyebrow>pilot-facing redesign</SectionEyebrow>
                  <h1 className="mt-6 max-w-3xl font-display text-5xl uppercase leading-[0.92] tracking-[0.08em] text-[#f4efe2] sm:text-6xl xl:text-7xl">
                    让 Frontier 行为自己开口。
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f4efe2]/72">
                    这套前端不再把奖章当收藏页摆拍，而是先向玩家说明：
                    Eve Eyes 会扫描你做过什么、系统如何判定门槛、为什么现在能或者不能 Claim。
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <OfficialActionButton targetId="chronicle-command">
                    Open Live Chronicle
                  </OfficialActionButton>
                  <div className="sds-connect-button-container">
                    <CustomConnectButton />
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="border border-white/10 bg-black/16 px-4 py-4">
                    <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#f4efe2]/44">
                      Why this matters
                    </div>
                    <div className="mt-3 text-sm leading-7 text-[#f4efe2]/72">
                      玩家一进来就该知道系统认什么，不该被迫先研究合约、钱包和一堆花里胡哨的卡片。
                    </div>
                  </div>
                  <div className="border border-white/10 bg-black/16 px-4 py-4">
                    <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#f4efe2]/44">
                      Official direction
                    </div>
                    <div className="mt-3 text-sm leading-7 text-[#f4efe2]/72">
                      视觉语气按 EVE Frontier 官方 dapps 的 `martianred / crude / neutral`
                      语义收紧，不再走泛 Web3 仪表盘风格。
                    </div>
                  </div>
                </div>
              </div>

              <TacticalPreview />
            </div>
          </div>
        </div>
      </section>

      <section
        id="protocol"
        className="scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="sds-panel rounded-[2rem] px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <SectionEyebrow>Protocol</SectionEyebrow>
                <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-[#f4efe2] sm:text-5xl">
                  先把行为索引出来，再谈荣誉。
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#f4efe2]/66">
                这条链路必须讲透，不然玩家只会看到“为什么按钮是灰的”。首页的职责就是把规则解释到不需要猜。
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-3">
              {protocolStages.map((stage, index) => (
                <div
                  key={stage.index}
                  style={{ animationDelay: `${index * 100}ms` } as CSSProperties}
                >
                  <ProtocolCard {...stage} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="proof-classes"
        className="scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
            <div className="sds-panel rounded-[2rem] px-5 py-6 sm:px-7 sm:py-7">
              <SectionEyebrow>Proof Classes</SectionEyebrow>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-[#f4efe2] sm:text-5xl">
                被 Frontier 记住的，是做过的事。
              </h2>
              <p className="mt-5 text-base leading-8 text-[#f4efe2]/70">
                跃迁、锚定、击杀，这三类行为是当前成就系统最直观的玩家轨迹。
                UI 要做的是把这些轨迹翻译成门槛、证据和领取状态，而不是摆一排华而不实的卡。
              </p>
              <div className="mt-8 border border-white/10 bg-black/14 px-4 py-4">
                <div className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[#f4efe2]/44">
                  Design objective
                </div>
                <p className="mt-3 text-sm leading-7 text-[#f4efe2]/72">
                  让玩家在一分钟内回答三个问题：我被记录了什么、我还差多少、为什么现在能不能 Claim。
                </p>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {proofChannels.map((channel, index) => (
                <ProofChannelCard
                  key={channel.title}
                  channel={channel}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="chronicle-command"
        className="scroll-mt-28 px-4 py-8 pb-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <div className="sds-panel rounded-[2rem] px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <SectionEyebrow>Live Chronicle</SectionEyebrow>
                <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-[#f4efe2] sm:text-5xl">
                  下面这块才是玩家自己的实时编年史。
                </h2>
                <p className="mt-4 text-base leading-8 text-[#f4efe2]/72">
                  看完规则，直接连钱包。这里会拉真实 Chronicle 快照、解释进度、给出可领取状态，并把环境问题明确写出来。
                </p>
              </div>

              <div className="grid gap-2 md:max-w-md">
                {runtimeNotes.map((note) => (
                  <div
                    key={note}
                    className="border border-white/10 bg-black/16 px-4 py-3 text-sm leading-6 text-[#f4efe2]/78"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <EnvironmentRequirements />
          <NetworkSupportChecker />
          <ChronicleDashboard />
        </div>
      </section>
    </div>
  )
}
