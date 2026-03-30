'use client'

import { isValidSuiObjectId } from '@mysten/sui/utils'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Link } from '@radix-ui/themes'
import Faucet from '@suiware/kit/Faucet'
import { HeartIcon } from 'lucide-react'
import {useTranslations} from 'next-intl'
import OfficialActionButton from '../OfficialActionButton'
import {
  CONTRACT_PACKAGE_ID_NOT_DEFINED,
  CONTRACT_PACKAGE_VARIABLE_NAME,
  EXPLORER_URL_VARIABLE_NAME,
} from '../../config/network'
import { packageUrl } from '../../helpers/network'
import { notification } from '../../helpers/notification'
import useNetworkConfig from '../../hooks/useNetworkConfig'
import ThemeSwitcher from '../ThemeSwitcher'

const Footer = () => {
  const { useNetworkVariables } = useNetworkConfig()
  const networkVariables = useNetworkVariables()
  const explorerUrl = networkVariables[EXPLORER_URL_VARIABLE_NAME]
  const packageId = networkVariables[CONTRACT_PACKAGE_VARIABLE_NAME]
  const currentAccount = useCurrentAccount()
  const isPackageConfigured =
    packageId !== CONTRACT_PACKAGE_ID_NOT_DEFINED &&
    isValidSuiObjectId(packageId)
  const t = useTranslations('footer')

  return (
    <footer className="relative px-4 py-5 sm:px-6 lg:px-8">
      <div className="sds-footer-divider mb-5" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 lg:w-1/3">
          <span className="sds-system-chip">{t('supportChip')}</span>
          {currentAccount != null && (
            <>
              <Faucet
                onError={notification.error}
                onSuccess={notification.success}
              />
              {isPackageConfigured ? (
                <OfficialActionButton
                  className="!text-xs"
                  href={packageUrl(explorerUrl, packageId)}
                  icon="external"
                  typeClass="ghost"
                >
                  {t('explorer')}
                </OfficialActionButton>
              ) : null}
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm text-[#f4efe2]/58 lg:items-center">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[#f4efe2]/45">
            {t('runtimeLabel')}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>{t('builtWith')}</span>
            <HeartIcon className="h-4 w-4 text-[#f0642f]" />
            <Link
              href="https://d1v.ai"
              target="_blank"
              rel="noopener noreferrer"
              highContrast={true}
            >
              d1v.ai
            </Link>
            <span>{t('forPilots')}</span>
            <span className="hidden sm:inline">·</span>
            <Link
              href="http://x.com/d1v_lab"
              target="_blank"
              rel="noopener noreferrer"
              highContrast={true}
            >
              @d1v_lab
            </Link>
          </div>
        </div>

        <div className="flex justify-start lg:w-1/3 lg:justify-end">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}
export default Footer
