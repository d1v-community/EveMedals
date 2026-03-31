import assert from 'node:assert/strict'
import test from 'node:test'
import { GET } from '../src/app/api/chronicle/route.ts'
import { generateDemoSnapshot } from '../src/app/server/chronicle/demoData.ts'
import { ENetwork } from '../src/app/types/ENetwork.ts'

const WALLET_ADDRESS = `0x${'1'.repeat(64)}`

test('GET /api/chronicle preserves locale for demo warnings, progress labels, and proof', async () => {
  for (const locale of ['en', 'zh-CN', 'is'] as const) {
    const request = new Request(
      `http://localhost/api/chronicle?walletAddress=${WALLET_ADDRESS}&network=testnet&demo=true&locale=${encodeURIComponent(locale)}`
    )
    const response = await GET(request)
    const payload = await response.json()
    const expected = generateDemoSnapshot(WALLET_ADDRESS, ENetwork.TESTNET, locale)

    assert.equal(response.status, 200)
    assert.deepEqual(payload.warnings, expected.warnings)

    for (const expectedMedal of expected.medals) {
      const actualMedal = payload.medals.find(
        (entry: { slug: string }) => entry.slug === expectedMedal.slug
      )

      assert.ok(actualMedal, `expected route medal ${expectedMedal.slug} for ${locale}`)
      assert.equal(actualMedal.progressLabel, expectedMedal.progressLabel)
      assert.equal(actualMedal.proof, expectedMedal.proof)
    }
  }
})
