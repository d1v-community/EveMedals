'use client'

import { useCurrentAccount } from '@mysten/dapp-kit'
import Link from 'next/link'

const MOCK_MEDALS = [
  { label: 'Bloodlust Butcher', tone: '#e63946', claimed: true },
  { label: 'Void Pioneer', tone: '#7c919d', claimed: true },
  { label: 'Galactic Courier', tone: '#4ecdc4', claimed: false },
  { label: 'Turret Sentry', tone: '#d9a441', claimed: false },
  { label: 'Assembly Pioneer', tone: '#8ea1ad', claimed: false },
]

const USE_CASES = [
  {
    icon: '🛡',
    title: 'Alliance Recruitment',
    desc: 'Share your card with fleet commanders to prove cross-domain capability.',
  },
  {
    icon: '📋',
    title: 'Employer Verification',
    desc: 'Let corps verify your record without trusting self-reported stats.',
  },
  {
    icon: '📊',
    title: 'Community Standing',
    desc: 'Your score is persistent, public, and tamper-proof on-chain.',
  },
]

export default function WarriorCallout() {
  const account = useCurrentAccount()

  return (
    <section
      id="warrior-card"
      className="relative py-24 px-4 sm:px-8"
      style={{ background: 'var(--sds-dark)' }}
    >
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
            Warrior Profile Card
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold uppercase tracking-wide leading-tight mb-4"
            style={{ color: '#f3ede2', fontFamily: 'var(--sds-font-display)', maxWidth: 520 }}
          >
            可分享的边境身份：让对方看到的是链上验证的实力。
          </h2>
          <p
            className="text-sm max-w-lg"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--sds-font-mono)', lineHeight: 1.75 }}
          >
            每位玩家都拥有一张专属档案卡，包含战力评分、军衔称号和所有勋章记录。
            复制链接，发到 Discord，任何人都能即时验证你的 Frontier 资历。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Mock card preview */}
          <div
            className="sds-panel relative overflow-hidden sds-reveal"
            style={{
              padding: '1.75rem',
              background: 'linear-gradient(135deg, #111315 0%, rgba(240,100,47,0.04) 100%)',
              border: '1px solid rgba(240,100,47,0.2)',
            }}
          >
            <div className="sds-scanline pointer-events-none" />

            {/* Header */}
            <div className="mb-5">
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--sds-font-mono)' }}
              >
                Frontier Chronicle · Warrior Profile
              </p>
              <p
                className="text-2xl font-bold uppercase tracking-wider"
                style={{ color: '#f0642f', fontFamily: 'var(--sds-font-display)' }}
              >
                Frontier Marshal
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--sds-font-mono)' }}>
                边境元帅 · Tier 6
              </p>
            </div>

            {/* Mock score */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className="flex flex-col items-center justify-center rounded"
                style={{
                  width: 90,
                  height: 72,
                  background: 'rgba(240,100,47,0.08)',
                  border: '1px solid rgba(240,100,47,0.2)',
                }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: '#f0642f', fontFamily: 'var(--sds-font-mono)' }}
                >
                  7420
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--sds-font-mono)' }}
                >
                  / 10000
                </span>
              </div>
              <div
                className="flex-1 rounded p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'var(--sds-font-mono)' }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>WALLET</span>
                  <span className="text-xs" style={{ color: '#f3ede2' }}>0x1a2b...ef90</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>NETWORK</span>
                  <span className="text-xs" style={{ color: '#f3ede2' }}>TESTNET</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>MEDALS BOUND</span>
                  <span className="text-xs" style={{ color: '#f0642f' }}>2 / 5</span>
                </div>
              </div>
            </div>

            {/* Mock medals */}
            <div className="flex gap-3 mb-5">
              {MOCK_MEDALS.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center gap-1"
                  title={m.label}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      background: m.claimed ? `rgba(${hexToRgb(m.tone)}, 0.12)` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${m.claimed ? `rgba(${hexToRgb(m.tone)}, 0.4)` : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: m.claimed ? 1 : 0.4,
                    }}
                  >
                    <span style={{ fontSize: 10, color: m.tone }}>◈</span>
                  </div>
                  <span style={{ fontSize: 8, color: m.claimed ? '#7ec38f' : 'rgba(255,255,255,0.2)', fontFamily: 'var(--sds-font-mono)' }}>
                    {m.claimed ? 'BOUND' : 'LOCKED'}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="pt-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--sds-font-mono)' }}>
                Frontier Chronicle · Verified on Sui
              </span>
              <span
                className="sds-system-chip text-xs px-2 py-0.5"
                style={{ color: '#f0642f', borderColor: 'rgba(240,100,47,0.2)' }}
              >
                Deep Scan
              </span>
            </div>

            {/* Preview label */}
            <div
              className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--sds-font-mono)',
                fontSize: 9,
                letterSpacing: '0.1em',
              }}
            >
              PREVIEW
            </div>
          </div>

          {/* Use cases + CTA */}
          <div className="flex flex-col gap-6 sds-reveal" style={{ animationDelay: '120ms' }}>
            <div className="flex flex-col gap-4">
              {USE_CASES.map((uc) => (
                <div
                  key={uc.title}
                  className="flex items-start gap-4 p-4 rounded"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{uc.icon}</span>
                  <div>
                    <p
                      className="text-sm font-bold mb-1"
                      style={{ color: '#f3ede2', fontFamily: 'var(--sds-font-mono)' }}
                    >
                      {uc.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--sds-font-mono)', lineHeight: 1.6 }}
                    >
                      {uc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              {account ? (
                <Link
                  href={`/warrior/${account.address}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm uppercase tracking-widest font-bold transition-all hover:opacity-85 active:scale-95"
                  style={{
                    background: '#f0642f',
                    color: '#111315',
                    fontFamily: 'var(--sds-font-mono)',
                    borderRadius: 4,
                    textDecoration: 'none',
                  }}
                >
                  Generate My Card →
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--sds-font-mono)' }}
                  >
                    Connect your wallet to generate your warrior card.
                  </p>
                  <a
                    href="#chronicle-command"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm uppercase tracking-widest font-bold transition-all hover:opacity-85"
                    style={{
                      border: '1px solid rgba(240,100,47,0.45)',
                      color: '#f0642f',
                      fontFamily: 'var(--sds-font-mono)',
                      borderRadius: 4,
                      textDecoration: 'none',
                    }}
                  >
                    Connect Wallet →
                  </a>
                </div>
              )}
              <p
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--sds-font-mono)' }}
              >
                Your card URL: frontier-chronicle.xyz/warrior/0x...
              </p>
            </div>
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
