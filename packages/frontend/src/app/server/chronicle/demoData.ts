import { getMedalDefinitionByKind } from '~~/chronicle/config/medals'
import { computeWarriorScore } from '~~/chronicle/helpers/score'
import type { ChronicleMedalState, ChronicleSnapshot } from '~~/chronicle/types'
import { ENetwork } from '~~/types/ENetwork'

const buildDemoMedal = ({
  kind,
  unlocked,
  claimed,
  claimable,
  progressCurrent,
  progressTarget,
  proof,
}: {
  kind: 1 | 2 | 3
  unlocked: boolean
  claimed: boolean
  claimable: boolean
  progressCurrent: number
  progressTarget: number
  proof: string
}): ChronicleMedalState => {
  const definition = getMedalDefinitionByKind(kind)

  if (!definition) {
    throw new Error(`Missing medal definition for demo kind ${kind}`)
  }

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
    claimable,
    progressCurrent,
    progressTarget,
    progressPercent: Math.round((progressCurrent / progressTarget) * 100),
    progressLabel: `${progressCurrent} / ${progressTarget}`,
    proof,
    templateObjectId: null,
    claimTicket: null,
  }
}

/**
 * 生成 Demo 模式的模拟数据，用于 Demo Day 演示
 */
export function generateDemoSnapshot(
  walletAddress: string,
  network: ENetwork
): ChronicleSnapshot {
  const medals = [
    buildDemoMedal({
      kind: 3,
      unlocked: true,
      claimed: true,
      claimable: false,
      progressCurrent: 15,
      progressTarget: 10,
      proof: '15 gate::jump events indexed by Chronicle',
    }),
    buildDemoMedal({
      kind: 1,
      unlocked: true,
      claimed: false,
      claimable: true,
      progressCurrent: 7,
      progressTarget: 5,
      proof: '7 confirmed attacker records in killmail data',
    }),
    buildDemoMedal({
      kind: 2,
      unlocked: true,
      claimed: false,
      claimable: true,
      progressCurrent: 2,
      progressTarget: 1,
      proof: '2 anchor events (network_node or storage_unit)',
    }),
  ]

  return {
    profile: {
      walletAddress,
      requestedNetwork: network,
      observedNetwork: network,
      evePackageId: 'demo-eve-package',
      characterId: 'DEMO-CHAR-12345',
      lastActivityAt: new Date('2026-03-31T00:12:00.000Z').toISOString(),
      scanMode: 'preview',
      scanLimitReached: false,
      scannedPages: 1,
      contractConfigured: false,
      registryObjectId: null,
    },
    metrics: {
      killmailAttacks: 7,
      networkNodeAnchors: 1,
      storageUnitAnchors: 1,
      gateJumps: 15,
      turretOps: 0,
      assemblyOps: 0,
      turretAnchors: 0,
      ssuTradeOps: 0,
      networkNodeFuels: 0,
    },
    medals,
    warnings: [
      '⚠️ DEMO MODE: This is simulated data for demonstration purposes',
    ],
    warriorScore: computeWarriorScore(medals),
  }
}
