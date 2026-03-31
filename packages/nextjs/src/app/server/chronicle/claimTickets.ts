import { bcs } from '@mysten/sui/bcs'
import { createHash, randomBytes } from 'node:crypto'
import type { MedalSlug } from '~~/chronicle/config/medals'
import type { ChronicleClaimTicket, ChronicleMedalState } from '~~/chronicle/types'
import { ENetwork } from '~~/types/ENetwork'
import {
  loadChronicleKeypairConfig,
  type ChronicleKeypairConfig,
} from '~~/server/chronicle/keypairLoader'

const CLAIM_DOMAIN_SEPARATOR = 'frontier-chronicle-claim-v1'
const DEFAULT_TICKET_TTL_MS = 10 * 60 * 1000

const claimPayloadBcs = bcs.struct('ClaimPayload', {
  registry_id: bcs.Address,
  template_id: bcs.Address,
  claimer: bcs.Address,
  medal_kind: bcs.u8(),
  template_version: bcs.u64(),
  proof_digest: bcs.vector(bcs.u8()),
  evidence_uri: bcs.string(),
  issued_at_ms: bcs.u64(),
  deadline_ms: bcs.u64(),
  nonce: bcs.vector(bcs.u8()),
})

export interface ActiveMedalTemplate {
  kind: number
  objectId: string
  templateVersion: number
  slug: MedalSlug
}

interface ClaimSignerConfig {
  keypair: ChronicleKeypairConfig['keypair']
  publicKeyBytes: Uint8Array
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const loadClaimSignerConfig = (): ClaimSignerConfig | null => {
  const loadedSigner = loadChronicleKeypairConfig(
    process.env.CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY
  )

  if (!loadedSigner) {
    return null
  }

  return {
    keypair: loadedSigner.keypair,
    publicKeyBytes: loadedSigner.publicKeyBytes,
  }
}

export const getConfiguredClaimSignerPublicKeyBase64 = () => {
  const signer = loadClaimSignerConfig()

  if (!signer) {
    return null
  }

  return Buffer.from(signer.publicKeyBytes).toString('base64')
}

const resolveTicketTtlMs = () => {
  const raw = Number(process.env.CHRONICLE_CLAIM_TICKET_TTL_MS || DEFAULT_TICKET_TTL_MS)

  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_TICKET_TTL_MS
  }

  return raw
}

const resolveSiteUrl = () =>
  trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

const buildEvidenceUri = (
  walletAddress: string,
  slug: MedalSlug,
  network: ENetwork
) => `${resolveSiteUrl()}/warrior/${walletAddress}/medals/${slug}?network=${network}`

const buildClaimMessageBytes = (payload: {
  registry_id: string
  template_id: string
  claimer: string
  medal_kind: number
  template_version: bigint
  proof_digest: number[]
  evidence_uri: string
  issued_at_ms: bigint
  deadline_ms: bigint
  nonce: number[]
}) => {
  const payloadBytes = claimPayloadBcs.serialize(payload).toBytes()
  const domainBytes = new TextEncoder().encode(CLAIM_DOMAIN_SEPARATOR)
  const message = new Uint8Array(domainBytes.length + payloadBytes.length)

  message.set(domainBytes)
  message.set(payloadBytes, domainBytes.length)

  return message
}

const createProofDigest = (proof: string) =>
  Uint8Array.from(createHash('sha256').update(proof, 'utf8').digest())

export const buildClaimTickets = async (
  walletAddress: string,
  network: ENetwork,
  registryObjectId: string | null,
  medals: ChronicleMedalState[],
  activeTemplates: Map<number, ActiveMedalTemplate>
): Promise<Partial<Record<number, ChronicleClaimTicket>>> => {
  if (!registryObjectId) {
    return {}
  }

  const signer = loadClaimSignerConfig()

  if (!signer) {
    return {}
  }

  const issuedAtMs = Date.now()
  const deadlineMs = issuedAtMs + resolveTicketTtlMs()
  const claimTicketsByKind: Partial<Record<number, ChronicleClaimTicket>> = {}

  for (const medal of medals) {
    if (!medal.unlocked || medal.claimed || !medal.proof) {
      continue
    }

    const template = activeTemplates.get(medal.kind)

    if (!template) {
      continue
    }

    const proofDigest = createProofDigest(medal.proof)
    const nonce = randomBytes(16)
    const evidenceUri = buildEvidenceUri(walletAddress, medal.slug, network)
    const messageBytes = buildClaimMessageBytes({
      registry_id: registryObjectId,
      template_id: template.objectId,
      claimer: walletAddress,
      medal_kind: medal.kind,
      template_version: BigInt(template.templateVersion),
      proof_digest: [...proofDigest],
      evidence_uri: evidenceUri,
      issued_at_ms: BigInt(issuedAtMs),
      deadline_ms: BigInt(deadlineMs),
      nonce: [...nonce],
    })
    const signature = await signer.keypair.sign(messageBytes)

    claimTicketsByKind[medal.kind] = {
      templateObjectId: template.objectId,
      templateVersion: template.templateVersion,
      proofDigestBase64: Buffer.from(proofDigest).toString('base64'),
      evidenceUri,
      issuedAtMs: String(issuedAtMs),
      deadlineMs: String(deadlineMs),
      nonceBase64: Buffer.from(nonce).toString('base64'),
      signerPublicKeyBase64: Buffer.from(signer.publicKeyBytes).toString('base64'),
      signatureBase64: Buffer.from(signature).toString('base64'),
    }
  }

  return claimTicketsByKind
}

export const isClaimSigningConfigured = () =>
  Boolean(process.env.CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY)
