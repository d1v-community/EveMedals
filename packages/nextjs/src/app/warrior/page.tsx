'use client'

import { useCurrentAccount } from '@mysten/dapp-kit'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { withLocale } from '~~/i18n/pathnames'
import CustomConnectButton from '../components/CustomConnectButton'

export default function WarriorIndexPage() {
  const account = useCurrentAccount()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('warriorIndex')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !account?.address) return
    router.replace(withLocale(locale, `/warrior/${account.address}`))
  }, [mounted, account, locale, router])

  if (!mounted || account?.address) {
    return null
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(240,100,47,0.12), transparent 22%), var(--sds-dark)',
      }}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#f0642f]">
          {t('eyebrow')}
        </div>
        <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-[#f4efe2]">
          {t('title')}
        </h1>
        <p className="max-w-sm text-sm leading-7 text-white/55">
          {t('body')}
        </p>
        <CustomConnectButton />
      </div>
    </main>
  )
}
