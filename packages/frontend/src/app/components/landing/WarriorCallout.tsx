'use client'

import { useCurrentAccount } from '@mysten/dapp-kit'
import Link from 'next/link'
import {useTranslations} from 'next-intl'

const MOCK_MEDALS = [
  { label: 'Bloodlust Butcher', tone: '#e63946', claimed: true },
  { label: 'Void Pioneer', tone: '#7c919d', claimed: true },
  { label: 'Galactic Courier', tone: '#4ecdc4', claimed: false },
  { label: 'Turret Sentry', tone: '#d9a441', claimed: false },
  { label: 'Assembly Pioneer', tone: '#8ea1ad', claimed: false },
  { label: 'Turret Anchor', tone: '#d9a441', claimed: false },
  { label: 'SSU Trader', tone: '#4ecdc4', claimed: false },
  { label: 'Fuel Feeder', tone: '#8ea1ad', claimed: false },
]

export default function WarriorCallout() {
  const account = useCurrentAccount()
  const t = useTranslations('warrior')

  const useCases = [
    {
      icon: '🛡',
      title: t('useCases.allianceTitle'),
      desc: t('useCases.allianceBody'),
    },
    {
      icon: '📋',
      title: t('useCases.employerTitle'),
      desc: t('useCases.employerBody'),
    },
    {
      icon: '📊',
      title: t('useCases.communityTitle'),
      desc: t('useCases.communityBody'),
    },
  ]

  return (
    <section
      id="warrior-card"
      className="relative px-4 py-24 sm:px-8"
      style={{ background: 'var(--sds-dark)' }}
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
            style={{ color: '#f3ede2', fontFamily: 'var(--sds-font-display)', maxWidth: 620 }}
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

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div
            className="sds-panel relative overflow-hidden sds-reveal"
            style={{
              padding: '1.75rem',
              background: 'linear-gradient(135deg, #111315 0%, rgba(240,100,47,0.04) 100%)',
              border: '1px solid rgba(240,100,47,0.2)',
            }}
          >
            <div className="sds-scanline pointer-events-none" />

            <div className="mb-5">
              <p
                className="mb-1 text-xs uppercase tracking-widest"
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
                Tier 6 · Command Rank
              </p>
            </div>

            <div className="mb-5 flex items-center gap-4">
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
                <div className="mb-1 flex justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('wallet')}</span>
                  <span className="text-xs" style={{ color: '#f3ede2' }}>0x1a2b...ef90</span>
                </div>
                <div className="mb-1 flex justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('network')}</span>
                  <span className="text-xs" style={{ color: '#f3ede2' }}>TESTNET</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('medalsBound')}</span>
                  <span className="text-xs" style={{ color: '#f0642f' }}>2 / 8</span>
                </div>
              </div>
            </div>

            <div className="mb-5 flex gap-3">
              {MOCK_MEDALS.map((medal) => (
                <div
                  key={medal.label}
                  className="flex flex-col items-center gap-1"
                  title={medal.label}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      background: medal.claimed ? `rgba(${hexToRgb(medal.tone)}, 0.12)` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${medal.claimed ? `rgba(${hexToRgb(medal.tone)}, 0.4)` : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: medal.claimed ? 1 : 0.4,
                    }}
                  >
                    <span style={{ fontSize: 10, color: medal.tone }}>◈</span>
                  </div>
                  <span style={{ fontSize: 8, color: medal.claimed ? '#7ec38f' : 'rgba(255,255,255,0.2)', fontFamily: 'var(--sds-font-mono)' }}>
                    {medal.claimed ? 'BOUND' : 'LOCKED'}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--sds-font-mono)' }}>
                Frontier Chronicle · {t('verified')}
              </span>
              <span
                className="sds-system-chip text-xs px-2 py-0.5"
                style={{ color: '#f0642f', borderColor: 'rgba(240,100,47,0.2)' }}
              >
                Deep Scan
              </span>
            </div>

            <div
              className="absolute right-3 top-3 rounded px-2 py-0.5 text-xs"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--sds-font-mono)',
                fontSize: 9,
                letterSpacing: '0.1em',
              }}
            >
              {t('preview')}
            </div>
          </div>

          <div className="flex flex-col gap-6 sds-reveal" style={{ animationDelay: '120ms' }}>
            <div className="flex flex-col gap-4">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded p-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p
                      className="mb-1 text-sm font-bold"
                      style={{ color: '#f3ede2', fontFamily: 'var(--sds-font-mono)' }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--sds-font-mono)', lineHeight: 1.6 }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {account ? (
                <Link
                  href={`/warrior/${account.address}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-85 active:scale-95"
                  style={{
                    background: '#f0642f',
                    color: '#111315',
                    fontFamily: 'var(--sds-font-mono)',
                    borderRadius: 4,
                    textDecoration: 'none',
                  }}
                >
                  {t('generate')}
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--sds-font-mono)' }}
                  >
                    {t('connectHint')}
                  </p>
                </div>
              )}
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
