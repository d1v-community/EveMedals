import type { MedalDefinition } from '~~/chronicle/config/medals'
import { getMedalDefinitionByKind } from '~~/chronicle/config/medals'
import type {
  ChronicleClaimTicket,
  ChronicleMedalState,
  ChronicleMetrics,
} from '~~/chronicle/types'

// ─── Shared server-only snapshot logic ───────────────────────────────────────
// Used by both /api/chronicle/route.ts and /warrior/[walletAddress]/page.tsx

const clampPercent = (current: number, target: number) => {
  if (target <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)))
}

const buildStandardMedal = (
  definition: MedalDefinition,
  current: number,
  target: number,
  claimed: boolean,
  proof: string | null,
  progressLabel: string,
  claimTicket: ChronicleClaimTicket | null
): ChronicleMedalState => {
  const unlocked = current >= target

  return {
    kind: definition.kind,
    slug: definition.slug,
    title: definition.title,
    subtitle: definition.subtitle,
    rarity: definition.rarity,
    requirement: definition.requirement,
    teaser: definition.teaser,
    unlocked,
    claimed,
    claimable: unlocked && !claimed && claimTicket != null,
    progressCurrent: current,
    progressTarget: target,
    progressPercent: clampPercent(current, target),
    progressLabel,
    proof,
    claimTicket,
  }
}

const buildVoidPioneerMedal = (
  claimed: boolean,
  networkNodeAnchors: number,
  storageUnitAnchors: number,
  claimTicket: ChronicleClaimTicket | null
): ChronicleMedalState => {
  const definition = getMedalDefinitionByKind(2)

  if (!definition) {
    throw new Error('Void Pioneer medal definition is missing')
  }

  const unlocked = networkNodeAnchors >= 1 || storageUnitAnchors >= 3
  const progressCurrent = unlocked
    ? networkNodeAnchors >= 1
      ? 1
      : 3
    : Math.min(storageUnitAnchors, 3)
  const progressTarget = unlocked && networkNodeAnchors >= 1 ? 1 : 3
  const proof =
    networkNodeAnchors >= 1
      ? `Eve Eyes indexed ${networkNodeAnchors} successful network_node::anchor call(s).`
      : storageUnitAnchors >= 3
        ? `Eve Eyes indexed ${storageUnitAnchors} successful storage_unit::anchor call(s).`
        : null

  return {
    kind: definition.kind,
    slug: definition.slug,
    title: definition.title,
    subtitle: definition.subtitle,
    rarity: definition.rarity,
    requirement: definition.requirement,
    teaser: definition.teaser,
    unlocked,
    claimed,
    claimable: unlocked && !claimed && claimTicket != null,
    progressCurrent,
    progressTarget,
    progressPercent: unlocked ? 100 : clampPercent(progressCurrent, progressTarget),
    progressLabel: `${networkNodeAnchors}/1 network node 或 ${storageUnitAnchors}/3 storage units`,
    proof,
    claimTicket,
  }
}

export const buildMedalStates = (
  counts: ChronicleMetrics,
  claimedSlugs: Set<string>,
  claimTicketsByKind: Partial<Record<number, ChronicleClaimTicket>>
): ChronicleMedalState[] => {
  const bloodlust = getMedalDefinitionByKind(1)
  const courier = getMedalDefinitionByKind(3)
  const turretSentry = getMedalDefinitionByKind(4)
  const assemblyPioneer = getMedalDefinitionByKind(5)
  const turretAnchor = getMedalDefinitionByKind(6)
  const ssuTrader = getMedalDefinitionByKind(7)
  const fuelFeeder = getMedalDefinitionByKind(8)

  if (!bloodlust || !courier || !turretSentry || !assemblyPioneer || !turretAnchor || !ssuTrader || !fuelFeeder) {
    throw new Error('Medal catalog is incomplete')
  }

  return [
    buildStandardMedal(
      bloodlust,
      counts.killmailAttacks,
      5,
      claimedSlugs.has(bloodlust.slug),
      counts.killmailAttacks >= 5
        ? `Eve Eyes indexed ${counts.killmailAttacks} confirmed killmail attacker call(s).`
        : null,
      `${counts.killmailAttacks} / 5 indexed killmail attacker records`,
      claimTicketsByKind[bloodlust.kind] || null
    ),
    buildVoidPioneerMedal(
      claimedSlugs.has('void-pioneer'),
      counts.networkNodeAnchors,
      counts.storageUnitAnchors,
      claimTicketsByKind[2] || null
    ),
    buildStandardMedal(
      courier,
      counts.gateJumps,
      10,
      claimedSlugs.has(courier.slug),
      counts.gateJumps >= 10
        ? `Eve Eyes indexed ${counts.gateJumps} successful gate::jump call(s).`
        : null,
      `${counts.gateJumps} / 10 verified gate jumps`,
      claimTicketsByKind[courier.kind] || null
    ),
    buildStandardMedal(
      turretSentry,
      counts.turretOps,
      3,
      claimedSlugs.has(turretSentry.slug),
      counts.turretOps >= 3
        ? `Eve Eyes indexed ${counts.turretOps} turret operation(s).`
        : null,
      `${counts.turretOps} / 3 indexed turret operations`,
      claimTicketsByKind[turretSentry.kind] || null
    ),
    buildStandardMedal(
      assemblyPioneer,
      counts.assemblyOps,
      3,
      claimedSlugs.has(assemblyPioneer.slug),
      counts.assemblyOps >= 3
        ? `Eve Eyes indexed ${counts.assemblyOps} Smart Assembly interaction(s).`
        : null,
      `${counts.assemblyOps} / 3 Smart Assembly interactions`,
      claimTicketsByKind[assemblyPioneer.kind] || null
    ),
    buildStandardMedal(
      turretAnchor,
      counts.turretAnchors,
      3,
      claimedSlugs.has(turretAnchor.slug),
      counts.turretAnchors >= 3
        ? `Eve Eyes indexed ${counts.turretAnchors} turret::anchor call(s).`
        : null,
      `${counts.turretAnchors} / 3 turret anchor deployments`,
      claimTicketsByKind[turretAnchor.kind] || null
    ),
    buildStandardMedal(
      ssuTrader,
      counts.ssuTradeOps,
      5,
      claimedSlugs.has(ssuTrader.slug),
      counts.ssuTradeOps >= 5
        ? `Eve Eyes indexed ${counts.ssuTradeOps} SSU deposit/withdraw call(s).`
        : null,
      `${counts.ssuTradeOps} / 5 SSU deposit or withdraw operations`,
      claimTicketsByKind[ssuTrader.kind] || null
    ),
    buildStandardMedal(
      fuelFeeder,
      counts.networkNodeFuels,
      5,
      claimedSlugs.has(fuelFeeder.slug),
      counts.networkNodeFuels >= 5
        ? `Eve Eyes indexed ${counts.networkNodeFuels} network_node::feed_fuel call(s).`
        : null,
      `${counts.networkNodeFuels} / 5 network node fuel feeds`,
      claimTicketsByKind[fuelFeeder.kind] || null
    ),
  ]
}
