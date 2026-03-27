import type { ChronicleSnapshot } from '~~/chronicle/types'
import { ENetwork } from '~~/types/ENetwork'

/**
 * 生成 Demo 模式的模拟数据，用于 Demo Day 演示
 */
export function generateDemoSnapshot(
  walletAddress: string,
  network: ENetwork
): ChronicleSnapshot {
  return {
    profile: {
      walletAddress,
      characterId: 'DEMO-CHAR-12345',
    },
    metrics: {
      killmailCount: 7,
      anchorCount: 2,
      jumpCount: 15,
    },
    medals: [
      {
        kind: 3,
        slug: 'galactic-courier',
        title: 'Galactic Courier',
        subtitle: '星际物流商',
        rarity: 'Common',
        unlocked: true,
        claimed: true,
        claimable: false,
        progressCurrent: 15,
        progressTarget: 10,
        proof: '15 gate::jump events indexed by Chronicle',
      },
      {
        kind: 1,
        slug: 'bloodlust-butcher',
        title: 'Bloodlust Butcher',
        subtitle: '嗜血屠夫',
        rarity: 'Rare',
        unlocked: true,
        claimed: false,
        claimable: true,
        progressCurrent: 7,
        progressTarget: 5,
        proof: '7 confirmed attacker records in killmail data',
      },
      {
        kind: 2,
        slug: 'void-pioneer',
        title: 'Void Pioneer',
        subtitle: '虚空拓荒者',
        rarity: 'Uncommon',
        unlocked: true,
        claimed: false,
        claimable: true,
        progressCurrent: 2,
        progressTarget: 1,
        proof: '2 anchor events (network_node or storage_unit)',
      },
    ],
    warnings: [
      '⚠️ DEMO MODE: This is simulated data for demonstration purposes',
    ],
    network,
  }
}
