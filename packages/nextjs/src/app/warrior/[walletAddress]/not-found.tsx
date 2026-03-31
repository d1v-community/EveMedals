import { getLocale, getTranslations } from 'next-intl/server'
import { withLocale } from '~~/i18n/pathnames'

export default async function WarriorNotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'warriorNotFound' })

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--sds-dark)' }}
    >
      <div className="text-center flex flex-col items-center gap-6">
        <div className="sds-radar-ring" style={{ width: 80, height: 80, opacity: 0.4 }} />
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--sds-font-mono)' }}
          >
            {t('eyebrow')}
          </p>
          <h1
            className="text-2xl font-bold uppercase tracking-wider"
            style={{ color: '#f0642f', fontFamily: 'var(--sds-font-display)' }}
          >
            {t('title')}
          </h1>
          <p
            className="mt-2 text-sm max-w-xs"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--sds-font-mono)' }}
          >
            {t('body')}
          </p>
        </div>
        <a
          href={withLocale(locale, '/')}
          className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
          style={{ color: '#f0642f', fontFamily: 'var(--sds-font-mono)' }}
        >
          {t('backLink')}
        </a>
      </div>
    </main>
  )
}
