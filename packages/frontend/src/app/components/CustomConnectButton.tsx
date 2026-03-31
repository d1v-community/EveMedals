'use client'

import ConnectWalletAsset from '@eveworld/ui-components/assets/connect-wallet.svg'
import ExpandDownAsset from '@eveworld/ui-components/assets/expand-down.svg'
import SignOutAsset from '@eveworld/ui-components/assets/sign-out.svg'
import EveButton from '@eveworld/ui-components/components/EveButton'
import {
  ConnectModal,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
} from '@mysten/dapp-kit'
import { LoaderCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`

const CustomConnectButton = () => {
  const currentAccount = useCurrentAccount()
  const { currentWallet, connectionStatus, isConnected, isConnecting } =
    useCurrentWallet()
  const { mutate: disconnectWallet, isPending: isDisconnecting } =
    useDisconnectWallet()
  const [isConnectModalOpen, setConnectModalOpen] = useState(false)

  const statusConfig = {
    disconnected: {
      eyebrow: 'pilot access',
      label: 'Connect Wallet',
      detail: 'Authorize Chronicle terminal access',
      dotClassName: 'sds-status-dot sds-status-dot-disconnected',
    },
    connecting: {
      eyebrow: 'link handshake',
      label: 'Approve In Wallet',
      detail: 'Waiting for your wallet session',
      dotClassName: 'sds-status-dot sds-status-dot-connecting',
    },
    connected: {
      eyebrow: currentWallet?.name || 'wallet linked',
      label: currentAccount ? truncateAddress(currentAccount.address) : 'Wallet Connected',
      detail: 'Tap to inspect or switch wallet',
      dotClassName: 'sds-status-dot sds-status-dot-connected',
    },
  } as const

  const status = statusConfig[connectionStatus]

  return (
    <div className="flex flex-wrap items-stretch gap-2">
      <ConnectModal
        key={connectionStatus}
        open={isConnected ? false : isConnectModalOpen}
        onOpenChange={setConnectModalOpen}
        trigger={
          <button
            type="button"
            className="sds-wallet-terminal group"
            data-connection={connectionStatus}
            disabled={isDisconnecting}
          >
            <span className="sds-wallet-terminal-icon-shell">
              <span className="sds-wallet-terminal-icon-frame">
                <Image
                  src={ConnectWalletAsset}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 opacity-90"
                />
                <span className={status.dotClassName} />
              </span>
              <span className="sds-wallet-terminal-accent">
                {isConnecting ? (
                  <LoaderCircleIcon className="h-3.5 w-3.5 animate-spin text-[#d9a441]" />
                ) : (
                  <Image
                    src={ExpandDownAsset}
                    alt=""
                    width={14}
                    height={14}
                    className="h-3.5 w-3.5 opacity-80"
                  />
                )}
              </span>
            </span>

            <span className="min-w-0 flex-1 text-left">
              <span className="block font-mono text-[0.56rem] uppercase tracking-[0.3em] text-[#f4efe2]/42 transition-colors duration-300 group-hover:text-[#f4efe2]/64">
                {status.eyebrow}
              </span>
              <span className="mt-1 block truncate text-sm font-semibold text-[#f4efe2] sm:text-[0.95rem]">
                {status.label}
              </span>
              <span className="mt-1 block text-[0.72rem] leading-5 text-[#f4efe2]/62">
                {status.detail}
              </span>
            </span>
          </button>
        }
      />

      {isConnected && currentAccount ? (
        <EveButton
          type="button"
          typeClass="ghost"
          aria-label="Disconnect wallet"
          className="sds-wallet-disconnect"
          onClick={() => disconnectWallet()}
          disabled={isDisconnecting}
        >
          {isDisconnecting ? (
            <LoaderCircleIcon className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Image
                src={SignOutAsset}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <span className="font-mono text-[0.56rem] uppercase tracking-[0.26em]">
                Exit
              </span>
            </>
          )}
        </EveButton>
      ) : null}
    </div>
  )
}

export default CustomConnectButton
