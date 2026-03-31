'use client'

import '@mysten/dapp-kit/dist/index.css'
import '@radix-ui/themes/styles.css'
import '@suiware/kit/main.css'
import '@eveworld/ui-components/styles-ui.css'
import SuiProvider from '@suiware/kit/SuiProvider'
import type { AbstractIntlMessages } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useMemo } from 'react'
import useNetworkConfig from '~~/hooks/useNetworkConfig'
import {
  defaultLocale,
  locales,
  type AppLocale,
} from '../../i18n/routing'
import {DEFAULT_TIME_ZONE} from '../../i18n/config'
import { APP_NAME } from '../config/main'
import { getThemeSettings } from '../helpers/theme'
import { ENetwork } from '../types/ENetwork'
import WalletUserSync from '../components/WalletUserSync'
import { ThemeModeProvider } from './ThemeModeProvider'
import ThemeProvider from './ThemeProvider'
import enMessages from '../../../messages/en.json'
import isMessages from '../../../messages/is.json'
import zhCNMessages from '../../../messages/zh-CN.json'

const themeSettings = getThemeSettings()
const orderedLocales = [...locales].sort(
  (left, right) => right.length - left.length
)
const messagesByLocale: Record<AppLocale, AbstractIntlMessages> = {
  en: enMessages,
  'zh-CN': zhCNMessages,
  is: isMessages,
}

const resolveLocaleFromPathname = (
  pathname: string | null,
  fallbackLocale: AppLocale
): AppLocale => {
  if (!pathname) {
    return fallbackLocale
  }

  for (const locale of orderedLocales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale
    }
  }

  return defaultLocale
}

export default function ClientProviders({
  children,
  databaseEnabled,
  initialLocale,
}: {
  children: ReactNode
  databaseEnabled: boolean
  initialLocale: AppLocale
}) {
  const { networkConfig } = useNetworkConfig()
  const pathname = usePathname()
  const locale = useMemo(
    () => resolveLocaleFromPathname(pathname, initialLocale),
    [initialLocale, pathname]
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <NextIntlClientProvider
      key={locale}
      locale={locale}
      messages={messagesByLocale[locale]}
      timeZone={DEFAULT_TIME_ZONE}
    >
      <ThemeModeProvider>
        <ThemeProvider>
          <SuiProvider
            customNetworkConfig={networkConfig}
            defaultNetwork={ENetwork.TESTNET}
            walletAutoConnect={false}
            walletStashedName={APP_NAME}
            themeSettings={themeSettings}
          >
            <WalletUserSync databaseEnabled={databaseEnabled} />
            {children}
          </SuiProvider>
        </ThemeProvider>
      </ThemeModeProvider>
    </NextIntlClientProvider>
  )
}
