'use client'

import AlertAsset from '@eveworld/ui-components/assets/alert.svg'
import { useCurrentAccount } from '@mysten/dapp-kit'
import useNetworkType from '@suiware/kit/useNetworkType'
import Image from 'next/image'
import { isNetworkSupported, supportedNetworks } from '../helpers/network'

const NetworkSupportChecker = () => {
  const { networkType } = useNetworkType()
  const currentAccount = useCurrentAccount()

  const okNetworks = supportedNetworks()

  if (currentAccount == null || okNetworks.length === 0) {
    return <></>
  }

  // @fixme: Find a better type for the networkType.
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  if (networkType == null || isNetworkSupported(networkType as any)) {
    return <></>
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-2">
      <div className="rounded-[1.4rem] border border-[#f04e3e]/38 bg-[#291413]/76 px-4 py-4 text-[#ffd2cb] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.32em]">
          <Image
            src={AlertAsset}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4"
          />
          <span>network mismatch</span>
        </div>
        <div className="mt-2 text-base font-semibold">
          当前钱包网络 <span className="font-mono">{networkType}</span>{' '}
          不在 Chronicle 支持列表里
        </div>
        <div className="mt-2 text-sm leading-7">
          请在钱包里切到以下网络之一：
          <span className="ml-2 font-mono uppercase tracking-[0.18em]">
            {okNetworks.join(', ')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default NetworkSupportChecker
