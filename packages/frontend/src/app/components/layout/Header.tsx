'use client'

import EveFrontierLogo from '@eveworld/ui-components/assets/logo.svg'
import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit'
import { Link } from '@radix-ui/themes'
import Balance from '@suiware/kit/Balance'
import NetworkType from '@suiware/kit/NetworkType'
import { APP_NAME } from '../../config/main'
import Image from 'next/image'
import NextLink from 'next/link'
import CustomConnectButton from '../CustomConnectButton'

const Header = () => {
  const { isConnected } = useCurrentWallet()
  const account = useCurrentAccount()

  return (
    <header className="sds-header">
      {/* Top orange accent line */}
      <div className="sds-header-top-bar" aria-hidden="true" />

      {/* Horizontal scanline sweep */}
      <div className="sds-header-scanline" aria-hidden="true" />

      {/* Corner bracket decorations */}
      <div className="sds-corner-tl" aria-hidden="true" />
      <div className="sds-corner-tr" aria-hidden="true" />
      <div className="sds-corner-bl" aria-hidden="true" />
      <div className="sds-corner-br" aria-hidden="true" />

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
            <div className="flex items-center gap-2">
              <span className="sds-header-live-dot" aria-label="System online" />
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[#f4efe2]/58">
                eve frontier player chronicle
              </div>
            </div>
          </div>
        </Link>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {[
              { href: '/#how-it-works', label: 'How It Works' },
              { href: '/#achievements', label: 'Achievements' },
              { href: '/#warrior-card', label: 'Warrior Card' },
              { href: '/#chronicle-command', label: 'Live Chronicle' },
            ].map((link) => (
              <a key={link.href} href={link.href} className="sds-header-nav-link">
                {link.label}
              </a>
            ))}
            <NextLink href="/warrior" className="sds-header-nav-link">
              Warriors
            </NextLink>
            {account && (
              <NextLink
                href={`/warrior/${account.address}`}
                className="sds-header-nav-cta"
              >
                My Card →
              </NextLink>
            )}
          </nav>

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

      {/* Bottom gradient border */}
      <div className="sds-header-bottom-bar" aria-hidden="true" />
    </header>
  )
}
export default Header
