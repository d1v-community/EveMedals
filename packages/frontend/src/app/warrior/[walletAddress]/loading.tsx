import { useTranslations } from 'next-intl'

export default function WarriorLoading() {
  const t = useTranslations('warriorLoading')

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--sds-dark)' }}
    >
      <div className="w-full max-w-2xl">
        <div
          className="sds-panel relative overflow-hidden animate-pulse"
          style={{ padding: '2rem', maxWidth: 680, margin: '0 auto' }}
        >
          <div className="sds-scanline pointer-events-none" />
          {/* Title skeleton */}
          <div
            className="h-4 rounded mb-2"
            style={{ background: 'rgba(255,255,255,0.06)', width: '45%' }}
          />
          <div
            className="h-8 rounded mb-6"
            style={{ background: 'rgba(255,255,255,0.08)', width: '60%' }}
          />
          {/* Score meter skeleton */}
          <div className="flex gap-8 mb-8">
            <div
              className="rounded-full"
              style={{ width: 220, height: 120, background: 'rgba(255,255,255,0.05)' }}
            />
            <div className="flex-1 flex flex-col gap-3">
              <div className="h-24 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.04)', width: '80%' }} />
            </div>
          </div>
          {/* Medal roster skeleton */}
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded"
                style={{ width: 56, height: 72, background: 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </div>
          {/* Loading label */}
          <p
            className="mt-6 text-xs uppercase tracking-widest text-center"
            style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--sds-font-mono)' }}
          >
            {t('label')}
          </p>
        </div>
      </div>
    </main>
  )
}
