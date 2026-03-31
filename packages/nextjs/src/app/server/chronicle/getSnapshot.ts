import { computeWarriorScore } from '~~/chronicle/helpers/score'
import {
  buildChronicleActivityWarning,
  buildClaimTicketFailureWarning,
} from '~~/chronicle/config/businessCopy'
import type {
  ChronicleClaimTicket,
  ChronicleSnapshot,
} from '~~/chronicle/types'
import {
  type ActiveMedalTemplate,
  buildClaimTickets,
  getConfiguredClaimSignerPublicKeyBase64,
} from '~~/server/chronicle/claimTickets'
import { resolveClaimSignerRegistrationState } from '~~/server/chronicle/claimSignerRuntime'
import { buildChronicleWarnings } from '~~/server/chronicle/chronicleArchitecture'
import {
  isContractConfigured,
  loadChronicleContractState,
  resolveContractPackageId,
} from '~~/server/chronicle/contractState'
import {
  isDemoMintRuntimeReady,
} from '~~/server/chronicle/demoMint'
import { resolveDemoMintState } from '~~/server/chronicle/demoMintState'
import { fetchWalletActivitySnapshot } from '~~/server/chronicle/eveEyes'
import { buildMedalStates } from '~~/server/chronicle/snapshot'
import { ENetwork } from '~~/types/ENetwork'

export const getChronicleSnapshot = async (
  walletAddress: string,
  network: ENetwork = ENetwork.TESTNET,
  locale?: string
): Promise<ChronicleSnapshot> => {
  const contractPackageId = resolveContractPackageId(network)
  const contractConfigured = isContractConfigured(contractPackageId)
  const activitySnapshot = await fetchWalletActivitySnapshot(walletAddress)
  let claimedMedalOrigins = new Map<string, 'claim' | 'demo-mint'>()
  let registryObjectId: string | null = null
  let activeTemplates = new Map<number, ActiveMedalTemplate>()
  let registeredSignerPublicKeys = new Set<string>()
  const configuredClaimSignerPublicKeyBase64 = getConfiguredClaimSignerPublicKeyBase64()

  if (contractConfigured) {
    const contractState = await loadChronicleContractState(
      walletAddress,
      network,
      contractPackageId
    )
    claimedMedalOrigins = contractState.claimedMedalOrigins
    registryObjectId = contractState.registryObjectId
    activeTemplates = contractState.activeTemplates
    registeredSignerPublicKeys = contractState.registeredSignerPublicKeys
  }

  const { claimSigningConfigured, claimSignerRegistered } =
    resolveClaimSignerRegistrationState(
      configuredClaimSignerPublicKeyBase64,
      registeredSignerPublicKeys
    )

  const baseMedals = buildMedalStates(
    activitySnapshot.counts,
    claimedMedalOrigins,
    {},
    activeTemplates,
    locale
  )
  let claimTicketsByKind: Partial<Record<number, ChronicleClaimTicket>> = {}
  const warnings = buildChronicleWarnings(
    activitySnapshot.scanLimitReached
      ? buildChronicleActivityWarning({
          scanMode: activitySnapshot.scanMode,
          locale,
        })
      : null,
    {
      contractConfigured,
      registryObjectId,
      claimSigningConfigured,
      claimSignerRegistered,
      activeTemplates,
    },
    locale
  )

  if (contractConfigured && registryObjectId && claimSignerRegistered) {
    try {
      claimTicketsByKind = await buildClaimTickets(
        walletAddress,
        network,
        registryObjectId,
        baseMedals,
        activeTemplates
      )
    } catch (error) {
      warnings.push(
        buildClaimTicketFailureWarning({
          message: error instanceof Error ? error.message : undefined,
          locale,
        })
      )
    }
  }

  const medals = buildMedalStates(
    activitySnapshot.counts,
    claimedMedalOrigins,
    claimTicketsByKind,
    activeTemplates,
    locale
  )
  const demoMintRuntimeReady =
    contractConfigured &&
    registryObjectId &&
    activeTemplates.size > 0 &&
    !medals.some((medal) => medal.claimable)
      ? await isDemoMintRuntimeReady(network, contractPackageId)
      : false
  const demoMint = resolveDemoMintState({
    network,
    medals,
    activeTemplates,
    contractConfigured,
    registryObjectId,
    runtimeReady: demoMintRuntimeReady,
  })

  return {
    profile: {
      walletAddress,
      requestedNetwork: network,
      observedNetwork: activitySnapshot.observedNetwork,
      evePackageId: activitySnapshot.evePackageId,
      characterId: activitySnapshot.characterId,
      lastActivityAt: activitySnapshot.lastActivityAt,
      scanMode: activitySnapshot.scanMode,
      scanLimitReached: activitySnapshot.scanLimitReached,
      scannedPages: activitySnapshot.scannedPages,
      contractConfigured,
      registryObjectId,
    },
    metrics: activitySnapshot.counts,
    medals,
    warnings,
    demoMint,
    warriorScore: computeWarriorScore(medals),
  }
}
