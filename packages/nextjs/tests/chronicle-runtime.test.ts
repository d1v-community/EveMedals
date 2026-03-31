import assert from 'node:assert/strict'
import test from 'node:test'
import { getClaimSigningWarning, getClaimSignerRegistrationWarning } from '../src/app/chronicle/config/businessCopy.ts'
import { buildChronicleWarnings } from '../src/app/server/chronicle/chronicleArchitecture.ts'
import { resolveClaimSignerRegistrationState } from '../src/app/server/chronicle/claimSignerRuntime.ts'
import { buildMedalStates } from '../src/app/server/chronicle/snapshot.ts'

const baseCounts = {
  killmailAttacks: 5,
  networkNodeAnchors: 0,
  storageUnitAnchors: 0,
  gateJumps: 0,
  turretOps: 0,
  assemblyOps: 0,
  turretAnchors: 0,
  ssuTradeOps: 0,
  networkNodeFuels: 0,
}

const activeTemplates = new Map([
  [
    1,
    {
      kind: 1,
      objectId: `0x${'1'.repeat(64)}`,
      templateVersion: 1,
      slug: 'bloodlust-butcher',
    },
  ],
])

const sampleClaimTicket = {
  templateObjectId: `0x${'1'.repeat(64)}`,
  templateVersion: 1,
  proofDigestBase64: Buffer.from(Uint8Array.from({ length: 32 }, (_, index) => index)).toString('base64'),
  evidenceUri: 'http://localhost:3000/warrior/demo/medals/bloodlust-butcher?network=testnet',
  issuedAtMs: '1000',
  deadlineMs: '2000',
  nonceBase64: Buffer.from(Uint8Array.from({ length: 16 }, (_, index) => 255 - index)).toString('base64'),
  signerPublicKeyBase64: Buffer.from(Uint8Array.from({ length: 32 }, () => 7)).toString('base64'),
  signatureBase64: Buffer.from(Uint8Array.from({ length: 64 }, () => 9)).toString('base64'),
}

const buildRuntimeWarnings = (runtime: {
  claimSigningConfigured: boolean
  claimSignerRegistered: boolean
}) =>
  buildChronicleWarnings(
    null,
    {
      contractConfigured: true,
      registryObjectId: `0x${'2'.repeat(64)}`,
      activeTemplates,
      ...runtime,
    },
    'en'
  )

const getBloodlustState = (claimTicketEnabled: boolean) =>
  buildMedalStates(
    baseCounts,
    new Map(),
    claimTicketEnabled ? { 1: sampleClaimTicket } : {},
    activeTemplates,
    'en'
  ).find((medal) => medal.slug === 'bloodlust-butcher')

test('Chronicle claim gating only enables claim when the configured signer is registered', () => {
  const missingSigner = resolveClaimSignerRegistrationState(null, new Set())
  assert.deepEqual(missingSigner, {
    claimSigningConfigured: false,
    claimSignerRegistered: false,
  })
  assert.deepEqual(buildRuntimeWarnings(missingSigner), [getClaimSigningWarning('en')])
  assert.equal(getBloodlustState(false)?.claimTicket, null)
  assert.equal(getBloodlustState(false)?.claimable, false)

  const unregisteredSigner = resolveClaimSignerRegistrationState(
    sampleClaimTicket.signerPublicKeyBase64,
    new Set([Buffer.from(Uint8Array.from({ length: 32 }, () => 3)).toString('base64')])
  )
  assert.deepEqual(unregisteredSigner, {
    claimSigningConfigured: true,
    claimSignerRegistered: false,
  })
  assert.deepEqual(buildRuntimeWarnings(unregisteredSigner), [
    getClaimSignerRegistrationWarning('en'),
  ])
  assert.equal(getBloodlustState(false)?.claimTicket, null)
  assert.equal(getBloodlustState(false)?.claimable, false)

  const registeredSigner = resolveClaimSignerRegistrationState(
    sampleClaimTicket.signerPublicKeyBase64,
    new Set([sampleClaimTicket.signerPublicKeyBase64])
  )
  assert.deepEqual(registeredSigner, {
    claimSigningConfigured: true,
    claimSignerRegistered: true,
  })
  assert.deepEqual(buildRuntimeWarnings(registeredSigner), [])
  assert.equal(getBloodlustState(true)?.claimTicket?.templateObjectId, sampleClaimTicket.templateObjectId)
  assert.equal(getBloodlustState(true)?.claimable, true)
})
