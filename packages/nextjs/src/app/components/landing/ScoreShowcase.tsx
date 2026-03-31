import {getTranslations} from 'next-intl/server'
import { RANK_CATALOG } from '~~/chronicle/config/ranks'

const MEDAL_WEIGHTS = [
  { rarity: 'Legendary', medal: 'Bloodlust Butcher', points: 1000, tone: '#e63946' },
  { rarity: 'Epic', medal: 'Void Pioneer', points: 600, tone: '#7c919d' },
  { rarity: 'Rare', medal: 'Galactic Courier', points: 350, tone: '#4ecdc4' },
  { rarity: 'Rare', medal: 'Turret Anchor', points: 350, tone: '#d9a441' },
  { rarity: 'Uncommon', medal: 'Turret Sentry', points: 150, tone: '#d9a441' },
  { rarity: 'Uncommon', medal: 'Assembly Pioneer', points: 150, tone: '#8ea1ad' },
  { rarity: 'Uncommon', medal: 'SSU Trader', points: 150, tone: '#4ecdc4' },
  { rarity: 'Uncommon', medal: 'Fuel Feeder', points: 150, tone: '#8ea1ad' },
]

const RANK_TONE_COLORS: Record<string, string> = {
  steel: '#8ea1ad',
  amber: '#d9a441',
  azure: '#7c919d',
  martian: '#f0642f',
  crimson: '#e63946',
}

export default async function ScoreShowcase() {
  const t = await getTranslations('score')

  return (
    <section
      id="combat-score"
      className="relative px-4 py-24 sm:px-8"
      style={{ background: 'linear-gradient(180deg, var(--sds-dark) 0%, rgba(17,19,21,0.95) 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 sds-grid-overlay"
        style={{ opacity: 0.03 }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mb-14 sds-reveal">
          <p
            className="mb-3 text-xs uppercase tracking-widest"
            style={{ color: '#f0642f', fontFamily: 'var(--sds-font-mono)' }}
          >
            {t('eyebrow')}
          </p>
          <h2
            className="mb-4 text-2xl font-bold uppercase tracking-wide leading-tight sm:text-3xl"
            style={{ color: '#f3ede2', fontFamily: 'var(--sds-font-display)', maxWidth: 560 }}
          >
            {t('title')}
          </h2>
          <p
            className="max-w-2xl text-sm"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--sds-font-mono)', lineHeight: 1.75 }}
          >
            {t('body')}
          </p>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sds-panel col-span-1 p-5 sds-reveal" style={{ animationDelay: '0ms' }}>
            <p
              className="mb-4 text-xs uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
            >
              {t('weightsTitle')}
            </p>
            <div className="flex flex-col gap-2">
              {MEDAL_WEIGHTS.map((medal) => (
                <div key={medal.medal} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ background: medal.tone }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--sds-font-mono)' }}
                    >
                      {medal.medal}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: medal.tone, fontFamily: 'var(--sds-font-mono)' }}
                  >
                    {medal.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sds-panel p-5 sds-reveal" style={{ animationDelay: '80ms' }}>
            <p
              className="mb-4 text-xs uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
            >
              {t('rulesTitle')}
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: t('claimed'), value: '× 1.0', color: '#7ec38f' },
                { label: t('verified'), value: '× 0.5', color: '#d9a441' },
                { label: t('fullSet'), value: '+25%', color: '#f0642f' },
                { label: t('normalized'), value: '0–10,000', color: '#f3ede2' },
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

          <div
            className="sds-panel p-5 sds-reveal"
            style={{ animationDelay: '160ms', background: 'rgba(240,100,47,0.04)', border: '1px solid rgba(240,100,47,0.18)' }}
          >
            <p
              className="mb-4 text-xs uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
            >
              {t('sampleTitle')}
            </p>
            <div className="flex flex-col gap-2 text-xs" style={{ fontFamily: 'var(--sds-font-mono)', color: 'rgba(255,255,255,0.5)' }}>
              <span>Bloodlust Butcher (claimed)</span>
              <span style={{ color: '#7ec38f' }}>= 1000 pts</span>
              <span>Galactic Courier (verified)</span>
              <span style={{ color: '#d9a441' }}>= 175 pts (×0.5)</span>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 4 }}>
                <div className="flex justify-between">
                  <span>{t('sampleTotal')}</span>
                  <span style={{ color: '#f0642f', fontWeight: 700 }}>4,178</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>{t('sampleRank')}</span>
                  <span style={{ color: '#f0642f' }}>Command Vanguard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sds-reveal" style={{ animationDelay: '240ms' }}>
          <p
            className="mb-4 text-xs uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
          >
            {t('rankTitle')}
          </p>
          <div className="flex flex-wrap gap-2">
            {RANK_CATALOG.map((rank) => {
              const color = RANK_TONE_COLORS[rank.tone] || '#8ea1ad'
              return (
                <div
                  key={rank.tier}
                  className="flex min-w-[120px] flex-col gap-0.5 rounded px-3 py-2"
                  style={{
                    background: `rgba(${hexToRgb(color)}, 0.07)`,
                    border: `1px solid rgba(${hexToRgb(color)}, 0.2)`,
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
