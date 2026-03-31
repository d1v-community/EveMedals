import {
  CONTRACT_PACKAGE_ID_NOT_DEFINED,
  DEVNET_CONTRACT_PACKAGE_ID,
  LOCALNET_CONTRACT_PACKAGE_ID,
  MAINNET_CONTRACT_PACKAGE_ID,
  TESTNET_CONTRACT_PACKAGE_ID,
} from '~~/config/network'
import { fullFunctionName } from '~~/helpers/network'
import { ENetwork } from '~~/types/ENetwork'
import { getMedalDefinitionBySlug, type MedalSlug } from '../config/medals'
import type { ChronicleClaimTicket } from '../types'

export type MockMedalTxAction = 'mint' | 'claim'
export type MockMedalTxStageId =
  | 'prepare'
  | 'simulate'
  | 'sign'
  | 'submit'
  | 'finalize'

export interface MockMedalTxStage {
  id: MockMedalTxStageId
  durationMs: number
}

export type MockMedalTxEventId = 'medalClaimed'

export interface MockMedalTxParsedField {
  label: string
  value: string
}

export interface MockMedalTxEvent {
  id: MockMedalTxEventId
  type: string
  packageId: string
  module: string
  sender: string
  parsedJson: MockMedalTxParsedField[]
}

export type MockMedalTxObjectChangeKind =
  | 'created'
  | 'mutated'
  | 'transferred'
  | 'deleted'

export type MockMedalTxObjectRole =
  | 'medal'
  | 'registry'
  | 'template'
  | 'claimTicket'
  | 'gasCoin'

export interface MockMedalTxObjectChange {
  kind: MockMedalTxObjectChangeKind
  role: MockMedalTxObjectRole
  objectId: string
  objectType: string
  owner: string
  ownerType: 'AddressOwner' | 'Shared'
}

export interface MockMedalTxCallArgument {
  label: string
  kind: 'object' | 'pure'
  value: string
}

export interface MockMedalTxBalanceChange {
  owner: string
  coinType: string
  amount: string
}

export interface MockMedalTxClaimPayloadSummary {
  proofDigest: string
  evidenceUri: string
  issuedAtMs: string
  deadlineMs: string
  nonce: string
  signerPublicKey: string
  signature: string
}

export interface MockMedalTxReceipt {
  slug: MedalSlug
  action: MockMedalTxAction
  medalTitle: string
  medalKind: number
  network: ENetwork
  sender: string
  status: 'success'
  epoch: string
  stages: MockMedalTxStage[]
  currentStageIndex: number
  digest: string
  checkpoint: string
  packageId: string
  module: string
  function: string
  target: `${string}::${string}::${string}`
  registryObjectId: string
  templateObjectId: string
  templateVersion: number
  gasPrice: string
  gasPaymentObjectId: string
  gasBudget: string
  gasUsed: string
  computationCost: string
  storageCost: string
  storageRebate: string
  nonRefundableStorageFee: string
  objectId: string
  callArguments: MockMedalTxCallArgument[]
  claimPayload: MockMedalTxClaimPayloadSummary | null
  balanceChanges: MockMedalTxBalanceChange[]
  events: MockMedalTxEvent[]
  objectChanges: MockMedalTxObjectChange[]
  at: string
}

const sleep = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs))

const randomHex = (length: number) => {
  let output = ''

  while (output.length < length) {
    output += Math.floor(Math.random() * 16).toString(16)
  }

  return output.slice(0, length)
}

const decodeBase64 = (value: string) => {
  try {
    if (typeof atob === 'function') {
      const decoded = atob(value)

      return Uint8Array.from(decoded, (char) => char.charCodeAt(0))
    }

    if (typeof Buffer !== 'undefined') {
      return Uint8Array.from(Buffer.from(value, 'base64'))
    }

    return null
  } catch {
    return null
  }
}

const hexFromBase64 = (value: string, fallbackBytes: number) => {
  const bytes = decodeBase64(value)

  if (!bytes || bytes.length !== fallbackBytes) {
    return `0x${randomHex(fallbackBytes * 2)}`
  }

  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

const randomMist = (min: number, max: number) =>
  BigInt(min + Math.floor(Math.random() * (max - min + 1)))

const formatMist = (value: bigint) => `${value.toString()} MIST`

const resolvePackageIdForNetwork = (network: ENetwork) => {
  switch (network) {
    case 'localnet':
      return LOCALNET_CONTRACT_PACKAGE_ID
    case 'devnet':
      return DEVNET_CONTRACT_PACKAGE_ID
    case 'mainnet':
      return MAINNET_CONTRACT_PACKAGE_ID
    case 'testnet':
    default:
      return TESTNET_CONTRACT_PACKAGE_ID
  }
}

const resolveMockPackageId = (network: ENetwork, packageId?: string | null) => {
  if (packageId && packageId !== CONTRACT_PACKAGE_ID_NOT_DEFINED) {
    return packageId
  }

  const configured = resolvePackageIdForNetwork(network)

  if (configured !== CONTRACT_PACKAGE_ID_NOT_DEFINED) {
    return configured
  }

  return `0x${'9'.repeat(64)}`
}

const SUI_CLOCK_OBJECT_ID = '0x6'

const buildStages = (action: MockMedalTxAction): MockMedalTxStage[] => {
  if (action === 'mint') {
    return [
      { id: 'prepare', durationMs: 520 },
      { id: 'simulate', durationMs: 760 },
      { id: 'sign', durationMs: 680 },
      { id: 'submit', durationMs: 860 },
      { id: 'finalize', durationMs: 620 },
    ]
  }

  return [
    { id: 'prepare', durationMs: 460 },
    { id: 'simulate', durationMs: 720 },
    { id: 'sign', durationMs: 640 },
    { id: 'submit', durationMs: 820 },
    { id: 'finalize', durationMs: 560 },
  ]
}

const buildGasSummary = () => {
  const computationCost = randomMist(28_000_000, 56_000_000)
  const storageCost = randomMist(4_000_000, 9_000_000)
  const storageRebate = randomMist(2_000_000, 6_000_000)
  const nonRefundableStorageFee = randomMist(120_000, 480_000)
  const gasUsed = computationCost + storageCost - storageRebate
  const gasBudget = gasUsed + randomMist(20_000_000, 45_000_000)
  const gasPrice = randomMist(750, 1250)

  return {
    gasPrice: formatMist(gasPrice),
    gasBudget: formatMist(gasBudget),
    gasUsed: formatMist(gasUsed),
    computationCost: formatMist(computationCost),
    storageCost: formatMist(storageCost),
    storageRebate: formatMist(storageRebate),
    nonRefundableStorageFee: formatMist(nonRefundableStorageFee),
    netSpend: formatMist(gasUsed + nonRefundableStorageFee),
  }
}

const buildClaimPayload = (
  claimTicket: ChronicleClaimTicket | null | undefined
): MockMedalTxClaimPayloadSummary => ({
  proofDigest: hexFromBase64(claimTicket?.proofDigestBase64 ?? '', 32),
  evidenceUri:
    claimTicket?.evidenceUri ??
    `https://frontier-chronicle.vercel.app/mock/claim/${randomHex(16)}`,
  issuedAtMs:
    claimTicket?.issuedAtMs ??
    String(Date.now() - 2 * 60 * 1000),
  deadlineMs:
    claimTicket?.deadlineMs ??
    String(Date.now() + 8 * 60 * 1000),
  nonce: hexFromBase64(claimTicket?.nonceBase64 ?? '', 16),
  signerPublicKey: hexFromBase64(
    claimTicket?.signerPublicKeyBase64 ?? '',
    32
  ),
  signature: hexFromBase64(claimTicket?.signatureBase64 ?? '', 64),
})

const buildCallArguments = ({
  action,
  recipient,
  registryObjectId,
  templateObjectId,
  claimPayload,
}: {
  action: MockMedalTxAction
  recipient: string
  registryObjectId: string
  templateObjectId: string
  claimPayload: MockMedalTxClaimPayloadSummary | null
}): MockMedalTxCallArgument[] => {
  if (action === 'mint') {
    return [
      { label: 'admin_cap', kind: 'object', value: `0x${'a'.repeat(64)}` },
      { label: 'registry', kind: 'object', value: registryObjectId },
      { label: 'template', kind: 'object', value: templateObjectId },
      { label: 'recipient', kind: 'pure', value: recipient },
    ]
  }

  return [
    { label: 'registry', kind: 'object', value: registryObjectId },
    { label: 'template', kind: 'object', value: templateObjectId },
    { label: 'clock', kind: 'object', value: SUI_CLOCK_OBJECT_ID },
    {
      label: 'proof_digest',
      kind: 'pure',
      value: claimPayload?.proofDigest ?? `0x${randomHex(64)}`,
    },
    {
      label: 'evidence_uri',
      kind: 'pure',
      value:
        claimPayload?.evidenceUri ??
        `https://frontier-chronicle.vercel.app/mock/evidence/${randomHex(12)}`,
    },
    {
      label: 'issued_at_ms',
      kind: 'pure',
      value: claimPayload?.issuedAtMs ?? String(Date.now() - 2 * 60 * 1000),
    },
    {
      label: 'deadline_ms',
      kind: 'pure',
      value: claimPayload?.deadlineMs ?? String(Date.now() + 8 * 60 * 1000),
    },
    {
      label: 'nonce',
      kind: 'pure',
      value: claimPayload?.nonce ?? `0x${randomHex(32)}`,
    },
    {
      label: 'signer_public_key',
      kind: 'pure',
      value: claimPayload?.signerPublicKey ?? `0x${randomHex(64)}`,
    },
    {
      label: 'signature',
      kind: 'pure',
      value: claimPayload?.signature ?? `0x${randomHex(128)}`,
    },
  ]
}

const buildMockEvents = ({
  sender,
  packageId,
  templateObjectId,
  medalKind,
  templateVersion,
  medalObjectId,
  proofDigest,
}: {
  sender: string
  packageId: string
  templateObjectId: string
  medalKind: number
  templateVersion: number
  medalObjectId: string
  proofDigest: string
}): MockMedalTxEvent[] => [
  {
    id: 'medalClaimed',
    type: `${packageId}::medals::EventMedalClaimed`,
    packageId,
    module: 'medals',
    sender,
    parsedJson: [
      { label: 'medal_id', value: medalObjectId },
      { label: 'owner', value: sender },
      { label: 'template_id', value: templateObjectId },
      { label: 'medal_kind', value: String(medalKind) },
      { label: 'template_version', value: String(templateVersion) },
      { label: 'proof_digest', value: proofDigest },
    ],
  },
]

const buildObjectChanges = ({
  packageId,
  medalObjectId,
  registryObjectId,
  gasPaymentObjectId,
  owner,
}: {
  packageId: string
  medalObjectId: string
  registryObjectId: string
  gasPaymentObjectId: string
  owner: string
}): MockMedalTxObjectChange[] => [
  {
    kind: 'mutated',
    role: 'registry',
    objectId: registryObjectId,
    objectType: `${packageId}::medals::MedalRegistry`,
    owner: 'Shared',
    ownerType: 'Shared',
  },
  {
    kind: 'created',
    role: 'medal',
    objectId: medalObjectId,
    objectType: `${packageId}::medals::Medal`,
    owner,
    ownerType: 'AddressOwner',
  },
  {
    kind: 'transferred',
    role: 'medal',
    objectId: medalObjectId,
    objectType: `${packageId}::medals::Medal`,
    owner,
    ownerType: 'AddressOwner',
  },
  {
    kind: 'mutated',
    role: 'gasCoin',
    objectId: gasPaymentObjectId,
    objectType: '0x2::coin::Coin<0x2::sui::SUI>',
    owner,
    ownerType: 'AddressOwner',
  },
]

export const createMockMedalReceipt = ({
  slug,
  action,
  medalTitle,
  walletAddress,
  network,
  packageId,
  registryObjectId,
  templateObjectId,
  claimTicket,
}: {
  slug: MedalSlug
  action: MockMedalTxAction
  medalTitle: string
  walletAddress?: string
  network?: ENetwork
  packageId?: string | null
  registryObjectId?: string | null
  templateObjectId?: string | null
  claimTicket?: ChronicleClaimTicket | null
}): MockMedalTxReceipt => {
  const definition = getMedalDefinitionBySlug(slug)
  const stages = buildStages(action)
  const resolvedNetwork = network ?? ENetwork.TESTNET
  const resolvedPackageId = resolveMockPackageId(resolvedNetwork, packageId)
  const sender = walletAddress ?? `0x${randomHex(64)}`
  const medalObjectId = `0x${randomHex(64)}`
  const gasPaymentObjectId = `0x${randomHex(64)}`
  const resolvedRegistryObjectId = registryObjectId ?? `0x${'b'.repeat(64)}`
  const resolvedTemplateObjectId =
    templateObjectId ??
    claimTicket?.templateObjectId ??
    `0x${slug
      .replace(/-/g, '')
      .padEnd(64, String(definition?.kind ?? 0))
      .slice(0, 64)}`
  const templateVersion = claimTicket?.templateVersion ?? 1
  const claimPayload = action === 'claim' ? buildClaimPayload(claimTicket) : null
  const callArguments = buildCallArguments({
    action,
    recipient: sender,
    registryObjectId: resolvedRegistryObjectId,
    templateObjectId: resolvedTemplateObjectId,
    claimPayload,
  })
  const gas = buildGasSummary()
  const functionName = action === 'claim' ? 'claim_medal' : 'admin_mint'
  const target = fullFunctionName(resolvedPackageId, functionName)
  const medalKind = definition?.kind ?? 0
  const proofDigest = claimPayload?.proofDigest ?? '0x'

  return {
    slug,
    action,
    medalTitle,
    medalKind,
    network: resolvedNetwork,
    sender,
    status: 'success',
    epoch: String(480 + Math.floor(Math.random() * 16)),
    stages,
    currentStageIndex: 0,
    digest: `0x${randomHex(64)}`,
    checkpoint: `${100000 + Math.floor(Math.random() * 900000)}`,
    packageId: resolvedPackageId,
    module: 'medals',
    function: functionName,
    target,
    registryObjectId: resolvedRegistryObjectId,
    templateObjectId: resolvedTemplateObjectId,
    templateVersion,
    gasPrice: gas.gasPrice,
    gasPaymentObjectId,
    gasBudget: gas.gasBudget,
    gasUsed: gas.gasUsed,
    computationCost: gas.computationCost,
    storageCost: gas.storageCost,
    storageRebate: gas.storageRebate,
    nonRefundableStorageFee: gas.nonRefundableStorageFee,
    objectId: medalObjectId,
    callArguments,
    claimPayload,
    balanceChanges: [
      {
        owner: sender,
        coinType: '0x2::sui::SUI',
        amount: `-${gas.netSpend}`,
      },
    ],
    events: buildMockEvents({
      sender,
      packageId: resolvedPackageId,
      templateObjectId: resolvedTemplateObjectId,
      medalKind,
      templateVersion,
      medalObjectId,
      proofDigest,
    }),
    objectChanges: buildObjectChanges({
      packageId: resolvedPackageId,
      medalObjectId,
      registryObjectId: resolvedRegistryObjectId,
      gasPaymentObjectId,
      owner: sender,
    }),
    at: new Date().toISOString(),
  }
}

export const runMockMedalTransaction = async ({
  slug,
  action,
  medalTitle,
  receipt: existingReceipt,
  onUpdate,
}: {
  slug: MedalSlug
  action: MockMedalTxAction
  medalTitle: string
  receipt?: MockMedalTxReceipt
  onUpdate?: (receipt: MockMedalTxReceipt) => void
}) => {
  const receipt =
    existingReceipt ?? createMockMedalReceipt({ slug, action, medalTitle })

  for (let index = 0; index < receipt.stages.length; index += 1) {
    receipt.currentStageIndex = index
    receipt.at = new Date().toISOString()
    onUpdate?.({ ...receipt })
    await sleep(receipt.stages[index].durationMs)
  }

  receipt.at = new Date().toISOString()
  return { ...receipt }
}
