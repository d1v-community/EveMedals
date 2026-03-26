import AlertAsset from '@eveworld/ui-components/assets/alert.svg'
import Image from 'next/image'
import { hasDatabaseUrl } from '~~/server/db/client.mjs'

const CONTRACT_ENV_VARS = [
  'NEXT_PUBLIC_LOCALNET_CONTRACT_PACKAGE_ID',
  'NEXT_PUBLIC_DEVNET_CONTRACT_PACKAGE_ID',
  'NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID',
  'NEXT_PUBLIC_MAINNET_CONTRACT_PACKAGE_ID',
] as const

const CONTRACT_PLACEHOLDER = '0xNOTDEFINED'
const eveEyesApiKeyConfigured =
  typeof process.env.EVE_EYES_API_KEY === 'string' &&
  process.env.EVE_EYES_API_KEY.trim().length > 0

function getConfiguredContractEnvVars() {
  return CONTRACT_ENV_VARS.filter((key) => {
    const value = process.env[key]
    return typeof value === 'string' && value.trim() !== '' && value !== CONTRACT_PLACEHOLDER
  })
}

const EnvironmentRequirements = () => {
  const configuredContractEnvVars = getConfiguredContractEnvVars()
  const databaseEnabled = hasDatabaseUrl()

  if (configuredContractEnvVars.length > 0 && databaseEnabled) {
    return null
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-2">
      {configuredContractEnvVars.length === 0 ? (
        <div className="sds-panel rounded-[1.4rem] px-4 py-4 text-sm text-[#f4efe2]/84">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[#d9a441]">
            <Image
              src={AlertAsset}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>config notice</span>
          </div>
          <div className="mt-2 text-base font-semibold text-[#f4efe2]">
            当前网络没有公开的 medals package 也没关系
          </div>
          <div className="mt-2 leading-7 text-[#f4efe2]/68">
            页面依旧能扫描玩家行为，只是链上 Claim 会保持关闭。只要后面补上这些环境变量，领取链路就会自动接回去：
          </div>
          <div className="mt-3 font-mono text-xs leading-6 text-[#f4efe2]/74">
            {CONTRACT_ENV_VARS.join('\n')}
          </div>
        </div>
      ) : null}

      {!databaseEnabled ? (
        <div className="sds-panel rounded-[1.4rem] px-4 py-4 text-sm text-[#f4efe2]/84">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[#8ea1ad]">
            <Image
              src={AlertAsset}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>runtime notice</span>
          </div>
          <div className="mt-2 text-base font-semibold text-[#f4efe2]">
            数据库同步当前关闭
          </div>
          <div className="mt-2 leading-7 text-[#f4efe2]/68">
            <code>DATABASE_URL</code> 为空，所以钱包连接后不会同步用户档案到 SQL。
            扫描和前端显示不受影响。
          </div>
        </div>
      ) : null}

      {!eveEyesApiKeyConfigured ? (
        <div className="rounded-[1.4rem] border border-[#d9a441]/35 bg-[#2a2112]/72 px-4 py-4 text-sm text-[#f9e3b2] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.32em]">
            <Image
              src={AlertAsset}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>eve eyes preview mode</span>
          </div>
          <div className="mt-2 text-base font-semibold">
            当前只在公开窗口里取样
          </div>
          <div className="mt-2 leading-7">
            <code>EVE_EYES_API_KEY</code> 为空，所以 Dashboard
            只会扫描公开页的行为窗口。Claim 判定仍然可用，但深历史数据可能不完整。
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default EnvironmentRequirements
