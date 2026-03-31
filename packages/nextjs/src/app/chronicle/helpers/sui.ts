import type { ENetwork } from '~~/types/ENetwork'

/**
 * 生成 Sui 链上浏览器的 URL
 */
export function getSuiExplorerUrl(
  network: ENetwork,
  objectId: string,
  type: 'object' | 'address' | 'txblock' = 'object'
): string {
  const baseUrls: Record<ENetwork, string> = {
    mainnet: 'https://suiscan.xyz/mainnet',
    testnet: 'https://suiscan.xyz/testnet',
    devnet: 'https://suiscan.xyz/devnet',
    localnet: 'http://localhost:9001',
  }

  const pathMap = {
    object: 'object',
    address: 'account',
    txblock: 'tx',
  }

  return `${baseUrls[network]}/${pathMap[type]}/${objectId}`
}
