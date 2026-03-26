'use client'

import EveFrontierLogo from '@eveworld/ui-components/assets/logo.svg'
import { useCurrentWallet } from '@mysten/dapp-kit'
import { Link } from '@radix-ui/themes'
import Balance from '@suiware/kit/Balance'
import NetworkType from '@suiware/kit/NetworkType'
import { APP_NAME } from '../../config/main'
import Image from 'next/image'
import CustomConnectButton from '../CustomConnectButton'

const Header = () => {
  const { isConnected } = useCurrentWallet()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,9,10,0.84)] backdrop-blur-xl transition-colors duration-500">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sds-light outline-none hover:no-underline"
        >
          <Image
            width={88}
            height={32}
            src={EveFrontierLogo}
            alt="EVE Frontier"
            className="h-10 w-auto"
          />
          <div className="min-w-0">
            <div className="font-display text-lg uppercase tracking-[0.2em] sm:text-xl">
              {APP_NAME}
            </div>
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[#f4efe2]/60">
              eve frontier player chronicle
            </div>
          </div>
        </Link>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="sds-system-chip">pilot terminal</span>
            {isConnected ? (
              <div className="sds-system-chip">
                <Balance />
              </div>
            ) : null}
            {isConnected ? (
              <div className="sds-system-chip">
                <NetworkType />
              </div>
            ) : null}
          </div>

          <div className="sds-connect-button-container shrink-0">
            <CustomConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header
