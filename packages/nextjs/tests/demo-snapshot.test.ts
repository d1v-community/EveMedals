import assert from 'node:assert/strict'
import test from 'node:test'
import { generateDemoSnapshot } from '../src/app/server/chronicle/demoData.ts'
import { ENetwork } from '../src/app/types/ENetwork.ts'

const WALLET_ADDRESS = `0x${'1'.repeat(64)}`

const EXPECTED_DEMO_COPY = {
  en: {
    warning: '⚠️ DEMO MODE: This is simulated data for demonstration purposes.',
    medals: {
      'bloodlust-butcher': {
        progressLabel: '7 / 5 indexed killmail attacker records',
        proof: 'Chronicle indexed 7 confirmed attacker records in killmail data.',
      },
      'void-pioneer': {
        progressLabel: '1/1 network node or 1/3 storage units',
        proof: 'Chronicle indexed 2 anchor events (network_node or storage_unit).',
      },
      'galactic-courier': {
        progressLabel: '15 / 10 verified gate jumps',
        proof: 'Chronicle indexed 15 gate::jump events.',
      },
    },
  },
  'zh-CN': {
    warning: '⚠️ 演示模式：当前为模拟数据，仅用于展示流程。',
    medals: {
      'bloodlust-butcher': {
        progressLabel: '7 / 5 条已索引击杀记录攻击者事件',
        proof: 'Chronicle 已索引 7 条已确认的击杀记录攻击者事件。',
      },
      'void-pioneer': {
        progressLabel: '1/1 个网络节点，或 1/3 个储存单元',
        proof: 'Chronicle 已索引 2 次锚定事件（网络节点或储存单元）。',
      },
      'galactic-courier': {
        progressLabel: '15 / 10 次已验证星门跃迁',
        proof: 'Chronicle 已索引 15 次星门跃迁事件。',
      },
    },
  },
  is: {
    warning: '⚠️ Sýningarhamur: Þetta eru sýndargögn eingöngu fyrir kynningu.',
    medals: {
      'bloodlust-butcher': {
        progressLabel: '7 / 5 skráðir árásaratburðir úr killmail',
        proof: 'Chronicle skráði 7 staðfesta árásaratburði úr killmail.',
      },
      'void-pioneer': {
        progressLabel: '1/1 nethnútur eða 1/3 geymslueiningar',
        proof: 'Chronicle skráði 2 festingaratburði (nethnútur eða geymslueining).',
      },
      'galactic-courier': {
        progressLabel: '15 / 10 staðfest stjörnuhliðarstökk',
        proof: 'Chronicle skráði 15 stjörnuhliðarstökksatburði.',
      },
    },
  },
} as const

test('generateDemoSnapshot keeps warnings, progress labels, and proof localized', () => {
  for (const locale of ['en', 'zh-CN', 'is'] as const) {
    const snapshot = generateDemoSnapshot(WALLET_ADDRESS, ENetwork.TESTNET, locale)
    const expected = EXPECTED_DEMO_COPY[locale]

    assert.deepEqual(snapshot.warnings, [expected.warning])

    for (const [slug, medalExpectation] of Object.entries(expected.medals)) {
      const medal = snapshot.medals.find((entry) => entry.slug === slug)

      assert.ok(medal, `expected demo medal ${slug} to exist for ${locale}`)
      assert.equal(medal?.progressLabel, medalExpectation.progressLabel)
      assert.equal(medal?.proof, medalExpectation.proof)
    }
  }
})
