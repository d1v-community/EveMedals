import { isValidSuiAddress } from '@mysten/sui/utils'
import { getMedalDefinitionBySlug } from '~~/chronicle/config/medals'
import { ENetwork } from '~~/types/ENetwork'

export interface DemoMintRequestBody {
  walletAddress: string
  network: ENetwork
  medalSlug: string
}

export const SUPPORTED_DEMO_MINT_NETWORKS = new Set(Object.values(ENetwork))

export const validateDemoMintRequestBody = (
  body: unknown
): DemoMintRequestBody => {
  const walletAddress =
    body && typeof body === 'object' ? (body as { walletAddress?: unknown }).walletAddress : null
  const network =
    body && typeof body === 'object' ? (body as { network?: unknown }).network : null
  const medalSlug =
    body && typeof body === 'object' ? (body as { medalSlug?: unknown }).medalSlug : null

  if (typeof walletAddress !== 'string' || !isValidSuiAddress(walletAddress)) {
    throw new Error('walletAddress must be a valid Sui address')
  }

  if (
    typeof network !== 'string' ||
    !SUPPORTED_DEMO_MINT_NETWORKS.has(network as ENetwork)
  ) {
    throw new Error(
      `network must be one of: ${Object.values(ENetwork).join(', ')}`
    )
  }

  if (
    typeof medalSlug !== 'string' ||
    getMedalDefinitionBySlug(medalSlug) == null
  ) {
    throw new Error('medalSlug is invalid')
  }

  return {
    walletAddress,
    network: network as ENetwork,
    medalSlug,
  }
}
