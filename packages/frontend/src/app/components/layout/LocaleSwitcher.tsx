'use client'

import clsx from 'clsx'
import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import {useLocale, useTranslations} from 'next-intl'
import {localizePathname} from '~~/i18n/pathnames'

const LOCALES = ['en', 'zh-CN', 'is'] as const

export default function LocaleSwitcher() {
  const locale = useLocale()
  const t = useTranslations('header')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()

  return (
    <div className="flex items-center gap-1.5">
      <span className="sr-only">{t('localeLabel')}</span>
      {LOCALES.map((item) => {
        const active = locale === item
        const href = localizePathname(item, pathname)
        const targetHref = search ? `${href}?${search}` : href

        return (
          <Link
            key={item}
            href={targetHref}
            className={clsx(
              'rounded border px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] transition-colors',
              active
                ? 'border-[#f0642f]/45 bg-[#f0642f]/12 text-[#f4efe2]'
                : 'border-white/10 bg-white/[0.03] text-[#f4efe2]/56 hover:text-[#f4efe2]'
            )}
          >
            {t(`locale.${item}`)}
          </Link>
        )
      })}
    </div>
  )
}
