import type {
  ChronicleDemoMintCandidate,
  ChronicleDemoMintState,
  ChronicleMedalState,
} from '~~/chronicle/types'
import { ENetwork } from '~~/types/ENetwork'
import type { ActiveMedalTemplate } from './claimTickets'

const hasClaimableMedals = (medals: ChronicleMedalState[]) =>
  medals.some((medal) => medal.claimable)

export const buildDemoMintCandidates = ({
  medals,
  activeTemplates,
}: {
  medals: ChronicleMedalState[]
  activeTemplates: Map<number, ActiveMedalTemplate>
}): ChronicleDemoMintCandidate[] =>
  medals
    .filter((medal) => {
      const template = activeTemplates.get(medal.kind)

      return (
        template != null &&
        template.objectId === medal.templateObjectId &&
        !medal.claimed
      )
    })
    .map((medal) => ({
      kind: medal.kind,
      slug: medal.slug,
      title: medal.title,
      subtitle: medal.subtitle,
      rarity: medal.rarity,
      requirement: medal.requirement,
      teaser: medal.teaser,
      progressCurrent: medal.progressCurrent,
      progressTarget: medal.progressTarget,
      progressPercent: medal.progressPercent,
      progressLabel: medal.progressLabel,
      proof: medal.proof,
      templateObjectId: medal.templateObjectId!,
    }))

export const resolveDemoMintState = ({
  network,
  medals,
  activeTemplates,
  contractConfigured,
  registryObjectId,
  runtimeReady,
}: {
  network: ENetwork
  medals: ChronicleMedalState[]
  activeTemplates: Map<number, ActiveMedalTemplate>
  contractConfigured: boolean
  registryObjectId: string | null
  runtimeReady: boolean
}): ChronicleDemoMintState | null => {
  if (
    network !== ENetwork.TESTNET ||
    !contractConfigured ||
    !registryObjectId ||
    hasClaimableMedals(medals) ||
    !runtimeReady
  ) {
    return null
  }

  const candidates = buildDemoMintCandidates({ medals, activeTemplates })

  if (candidates.length === 0) {
    return null
  }

  return { candidates }
}
