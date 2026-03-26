import { RANK_CATALOG } from '~~/chronicle/config/ranks'

const MEDAL_WEIGHTS = [
  { rarity: 'Legendary', medal: 'Bloodlust Butcher', points: 1000, tone: '#e63946' },
  { rarity: 'Epic', medal: 'Void Pioneer', points: 600, tone: '#7c919d' },
  { rarity: 'Rare', medal: 'Galactic Courier', points: 350, tone: '#4ecdc4' },
  { rarity: 'Uncommon', medal: 'Turret Sentry', points: 150, tone: '#d9a441' },
  { rarity: 'Uncommon', medal: 'Assembly Pioneer', points: 150, tone: '#8ea1ad' },
]

const RANK_TONE_COLORS: Record<string, string> = {
  steel: '#8ea1ad',
  amber: '#d9a441',
  azure: '#7c919d',
  martian: '#f0642f',
  crimson: '#e63946',
}

export default function ScoreShowcase() {
  return (
    <section
      id="combat-score"
      className="relative py-24 px-4 sm:px-8"
      style={{ background: 'linear-gradient(180deg, var(--sds-dark) 0%, rgba(17,19,21,0.95) 100%)' }}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 sds-grid-overlay"
        style={{ opacity: 0.03 }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-14 sds-reveal">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: '#f0642f', fontFamily: 'var(--sds-font-mono)' }}
          >
            Combat Score System
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold uppercase tracking-wide leading-tight mb-4"
            style={{ color: '#f3ede2', fontFamily: 'var(--sds-font-display)', maxWidth: 520 }}
          >
            一个数字，把你的 Frontier 资历翻译给所有人。
          </h2>
          <p
            className="text-sm max-w-lg"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--sds-font-mono)', lineHeight: 1.75 }}
          >
            你的每一枚链上勋章都会转化为战力评分。稀有度越高，分值越重。
            集齐全套还有 25% 额外加成。最终得分归一化为 0–10,000 以便横向比较。
          </p>
        </div>

        {/* Medal weights table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {/* Card 1: Medal weights */}
          <div
            className="sds-panel p-5 col-span-1 sds-reveal"
            style={{ animationDelay: '0ms' }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
            >
              Rarity Weights
            </p>
            <div className="flex flex-col gap-2">
              {MEDAL_WEIGHTS.map((m) => (
                <div key={m.medal} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: m.tone }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--sds-font-mono)' }}
                    >
                      {m.medal}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: m.tone, fontFamily: 'var(--sds-font-mono)' }}
                  >
                    {m.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Scoring rules */}
          <div
            className="sds-panel p-5 sds-reveal"
            style={{ animationDelay: '80ms' }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
            >
              Scoring Rules
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Medal Claimed (on-chain)', value: '× 1.0', color: '#7ec38f' },
                { label: 'Medal Verified (not claimed)', value: '× 0.5', color: '#d9a441' },
                { label: 'Full Set Bonus (5/5 claimed)', value: '+25%', color: '#f0642f' },
                { label: 'Normalized to', value: '0–10,000', color: '#f3ede2' },
              ].map((rule) => (
                <div key={rule.label} className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--sds-font-mono)' }}
                  >
                    {rule.label}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: rule.color, fontFamily: 'var(--sds-font-mono)' }}
                  >
                    {rule.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Example score */}
          <div
            className="sds-panel p-5 sds-reveal"
            style={{ animationDelay: '160ms', background: 'rgba(240,100,47,0.04)', border: '1px solid rgba(240,100,47,0.18)' }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
            >
              Sample Calculation
            </p>
            <div className="flex flex-col gap-2 text-xs" style={{ fontFamily: 'var(--sds-font-mono)', color: 'rgba(255,255,255,0.5)' }}>
              <span>Bloodlust Butcher (claimed)</span>
              <span style={{ color: '#7ec38f' }}>= 1000 pts</span>
              <span>Galactic Courier (verified)</span>
              <span style={{ color: '#d9a441' }}>= 175 pts (×0.5)</span>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 4 }}>
                <div className="flex justify-between">
                  <span>Total Display Score</span>
                  <span style={{ color: '#f0642f', fontWeight: 700 }}>4,178</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Rank</span>
                  <span style={{ color: '#f0642f' }}>Command Vanguard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank table */}
        <div className="sds-reveal" style={{ animationDelay: '240ms' }}>
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
          >
            Combat Rank Tiers
          </p>
          <div className="flex flex-wrap gap-2">
            {RANK_CATALOG.map((rank) => {
              const color = RANK_TONE_COLORS[rank.tone] || '#8ea1ad'
              return (
                <div
                  key={rank.tier}
                  className="flex flex-col gap-0.5 px-3 py-2 rounded"
                  style={{
                    background: `rgba(${hexToRgb(color)}, 0.07)`,
                    border: `1px solid rgba(${hexToRgb(color)}, 0.2)`,
                    minWidth: 120,
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase"
                    style={{ color, fontFamily: 'var(--sds-font-mono)', letterSpacing: '0.05em' }}
                  >
                    {rank.title}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
                  >
                    {rank.maxScore === 0 ? '0' : `${rank.minScore.toLocaleString()}–${rank.maxScore.toLocaleString()}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255,255,255'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
