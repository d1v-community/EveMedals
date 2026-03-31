import assert from 'node:assert/strict'
import test from 'node:test'
import { validateDemoMintRequestBody } from '../src/app/server/chronicle/demoMintRequest.ts'
import { buildDemoMintCandidates, resolveDemoMintState } from '../src/app/server/chronicle/demoMintState.ts'
import { resolveClaimOriginFromEvidenceUri } from '../src/app/server/chronicle/claimOrigin.ts'
import { ENetwork } from '../src/app/types/ENetwork.ts'
import type { ChronicleMedalState } from '../src/app/chronicle/types.ts'

const WALLET_ADDRESS = `0x${'1'.repeat(64)}`

const buildMedal = (
  overrides: Partial<ChronicleMedalState> & Pick<ChronicleMedalState, 'slug' | 'kind'>
): ChronicleMedalState => ({
  kind: overrides.kind,
  slug: overrides.slug,
  title: overrides.title ?? overrides.slug,
  subtitle: overrides.subtitle ?? overrides.slug,
  rarity: overrides.rarity ?? 'Rare',
  requirement: overrides.requirement ?? 'Requirement',
  teaser: overrides.teaser ?? 'Teaser',
  unlocked: overrides.unlocked ?? false,
  claimed: overrides.claimed ?? false,
  claimable: overrides.claimable ?? false,
  progressCurrent: overrides.progressCurrent ?? 0,
  progressTarget: overrides.progressTarget ?? 10,
  progressPercent: overrides.progressPercent ?? 0,
  progressLabel: overrides.progressLabel ?? '0 / 10',
  proof: overrides.proof ?? null,
  templateObjectId: overrides.templateObjectId ?? null,
  claimTicket: overrides.claimTicket ?? null,
  claimOrigin: overrides.claimOrigin ?? null,
})

test('resolveClaimOriginFromEvidenceUri distinguishes real claim from demo mint', () => {
  assert.equal(resolveClaimOriginFromEvidenceUri('admin-mint'), 'demo-mint')
  assert.equal(
    resolveClaimOriginFromEvidenceUri(
      'https://frontier-chronicle.vercel.app/warrior/demo'
    ),
    'claim'
  )
  assert.equal(resolveClaimOriginFromEvidenceUri(null), 'claim')
})

test('resolveDemoMintState exposes active template candidates only when runtime is ready and no live claim exists', () => {
  const medals = [
    buildMedal({
      kind: 1,
      slug: 'bloodlust-butcher',
      title: 'Bloodlust Butcher',
      subtitle: 'Bloodlust Butcher',
      progressCurrent: 2,
      progressTarget: 5,
      progressPercent: 40,
      progressLabel: '2 / 5',
      proof: null,
      templateObjectId: `0x${'2'.repeat(64)}`,
    }),
    buildMedal({
      kind: 2,
      slug: 'void-pioneer',
      title: 'Void Pioneer',
      subtitle: 'Void Pioneer',
      claimed: true,
      claimOrigin: 'demo-mint',
      templateObjectId: `0x${'3'.repeat(64)}`,
    }),
    buildMedal({
      kind: 3,
      slug: 'galactic-courier',
      title: 'Galactic Courier',
      subtitle: 'Galactic Courier',
      progressCurrent: 9,
      progressTarget: 10,
      progressPercent: 90,
      progressLabel: '9 / 10',
      proof: 'Eve Eyes indexed 9 successful gate::jump call(s).',
      templateObjectId: `0x${'4'.repeat(64)}`,
    }),
  ]
  const activeTemplates = new Map([
    [
      1,
      {
        kind: 1,
        objectId: `0x${'2'.repeat(64)}`,
        templateVersion: 1,
        slug: 'bloodlust-butcher',
      },
    ],
    [
      2,
      {
        kind: 2,
        objectId: `0x${'3'.repeat(64)}`,
        templateVersion: 1,
        slug: 'void-pioneer',
      },
    ],
    [
      3,
      {
        kind: 3,
        objectId: `0x${'4'.repeat(64)}`,
        templateVersion: 1,
        slug: 'galactic-courier',
      },
    ],
  ])

  assert.deepEqual(
    buildDemoMintCandidates({ medals, activeTemplates }).map((candidate) => candidate.slug),
    ['bloodlust-butcher', 'galactic-courier']
  )

  const state = resolveDemoMintState({
    network: ENetwork.TESTNET,
    medals,
    activeTemplates,
    contractConfigured: true,
    registryObjectId: `0x${'5'.repeat(64)}`,
    runtimeReady: true,
  })

  assert.deepEqual(
    state?.candidates.map((candidate) => candidate.slug),
    ['bloodlust-butcher', 'galactic-courier']
  )

  const blockedByLiveClaim = resolveDemoMintState({
    network: ENetwork.TESTNET,
    medals: [
      ...medals,
      buildMedal({
        kind: 4,
        slug: 'turret-sentry',
        claimable: true,
        unlocked: true,
        templateObjectId: `0x${'6'.repeat(64)}`,
      }),
    ],
    activeTemplates: new Map([
      ...activeTemplates,
      [
        4,
        {
          kind: 4,
          objectId: `0x${'6'.repeat(64)}`,
          templateVersion: 1,
          slug: 'turret-sentry',
        },
      ],
    ]),
    contractConfigured: true,
    registryObjectId: `0x${'5'.repeat(64)}`,
    runtimeReady: true,
  })

  assert.equal(blockedByLiveClaim, null)

  const blockedByNetwork = resolveDemoMintState({
    network: ENetwork.MAINNET,
    medals,
    activeTemplates,
    contractConfigured: true,
    registryObjectId: `0x${'5'.repeat(64)}`,
    runtimeReady: true,
  })

  assert.equal(blockedByNetwork, null)
})

test('validateDemoMintRequestBody rejects invalid wallet addresses before any runtime work', () => {
  assert.throws(
    () =>
      validateDemoMintRequestBody({
        walletAddress: 'not-a-wallet',
        network: ENetwork.TESTNET,
        medalSlug: 'galactic-courier',
      }),
    /walletAddress must be a valid Sui address/
  )
})

test('validateDemoMintRequestBody rejects invalid medal slugs before any snapshot fetch', () => {
  assert.throws(
    () =>
      validateDemoMintRequestBody({
        walletAddress: WALLET_ADDRESS,
        network: ENetwork.TESTNET,
        medalSlug: 'not-a-real-medal',
      }),
    /medalSlug is invalid/
  )
})
