import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { fullFunctionName, fullStructName } from '~~/helpers/network'
import {
  isContractConfigured,
  loadChronicleContractState,
  resolveContractPackageId,
} from '~~/server/chronicle/contractState'
import { loadChronicleKeypairConfig } from '~~/server/chronicle/keypairLoader'
import { ENetwork } from '~~/types/ENetwork'
import type { ActiveMedalTemplate } from './claimTickets'

const DEMO_MINTER_ENV_NAME = 'CHRONICLE_DEMO_MINTER_PRIVATE_KEY'
const MAX_OWNED_OBJECTS = 10
const CONFIRMATION_ATTEMPTS = 6
const CONFIRMATION_DELAY_MS = 500

const delay = async (milliseconds: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

const isDemoMintNetwork = (network: ENetwork) => network === ENetwork.TESTNET

const createChronicleClient = (network: ENetwork) =>
  new SuiClient({ url: getFullnodeUrl(network) })

const loadDemoMinterConfig = () =>
  loadChronicleKeypairConfig(process.env[DEMO_MINTER_ENV_NAME])

const queryOwnedAdminCaps = async (
  client: SuiClient,
  owner: string,
  packageId: string
) => {
  const response = await client.getOwnedObjects({
    owner,
    filter: { StructType: fullStructName(packageId, 'AdminCap') },
    options: { showType: true },
    limit: MAX_OWNED_OBJECTS,
  })

  return response.data
    .map((object) => object.data?.objectId ?? null)
    .filter((value): value is string => value != null)
}

export const isDemoMintRuntimeReady = async (
  network: ENetwork,
  packageId: string
) => {
  if (!isDemoMintNetwork(network) || !isContractConfigured(packageId)) {
    return false
  }

  const demoMinter = loadDemoMinterConfig()

  if (!demoMinter) {
    return false
  }

  const client = createChronicleClient(network)
  const adminCapIds = await queryOwnedAdminCaps(
    client,
    demoMinter.address,
    packageId
  )

  return adminCapIds.length === 1
}

const getAdminMintTemplate = ({
  medalSlug,
  activeTemplates,
}: {
  medalSlug: string
  activeTemplates: Map<number, ActiveMedalTemplate>
}) =>
  [...activeTemplates.values()].find((template) => template.slug === medalSlug) ??
  null

const confirmDemoMint = async ({
  client,
  digest,
  walletAddress,
  medalSlug,
  network,
  packageId,
}: {
  client: SuiClient
  digest: string
  walletAddress: string
  medalSlug: string
  network: ENetwork
  packageId: string
}) => {
  await client.waitForTransaction({ digest, timeout: 60_000 })

  for (let attempt = 0; attempt < CONFIRMATION_ATTEMPTS; attempt += 1) {
    const contractState = await loadChronicleContractState(
      walletAddress,
      network,
      packageId
    )

    if (contractState.claimedMedalOrigins.has(medalSlug)) {
      return
    }

    await delay(CONFIRMATION_DELAY_MS)
  }

  throw new Error('Demo mint submitted, but the minted medal was not confirmed in time')
}

export const adminMintDemoMedal = async ({
  walletAddress,
  network,
  medalSlug,
}: {
  walletAddress: string
  network: ENetwork
  medalSlug: string
}) => {
  if (!isDemoMintNetwork(network)) {
    throw new Error('Demo mint is only available on testnet')
  }

  const packageId = resolveContractPackageId(network)

  if (!isContractConfigured(packageId)) {
    throw new Error('The medals contract is not configured for this network')
  }

  const demoMinter = loadDemoMinterConfig()

  if (!demoMinter) {
    throw new Error(`${DEMO_MINTER_ENV_NAME} is not configured on the server`)
  }

  const client = createChronicleClient(network)
  const [adminCapIds, contractState] = await Promise.all([
    queryOwnedAdminCaps(client, demoMinter.address, packageId),
    loadChronicleContractState(walletAddress, network, packageId),
  ])

  if (!contractState.registryObjectId) {
    throw new Error('The shared medal registry is unavailable on the current network')
  }

  if (adminCapIds.length === 0) {
    throw new Error(`Demo minter address ${demoMinter.address} does not own an AdminCap`)
  }

  if (adminCapIds.length > 1) {
    throw new Error(
      `Demo minter address ${demoMinter.address} owns multiple AdminCap objects`
    )
  }

  if (contractState.claimedMedalOrigins.has(medalSlug)) {
    throw new Error('The target wallet already owns this medal')
  }

  const template = getAdminMintTemplate({
    medalSlug,
    activeTemplates: contractState.activeTemplates,
  })

  if (!template) {
    throw new Error('The requested medal template is not active on testnet')
  }

  const tx = new Transaction()
  tx.setSender(demoMinter.address)
  tx.moveCall({
    target: fullFunctionName(packageId, 'admin_mint'),
    arguments: [
      tx.object(adminCapIds[0]),
      tx.object(contractState.registryObjectId),
      tx.object(template.objectId),
      tx.pure.address(walletAddress),
    ],
  })

  const response = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: demoMinter.keypair,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
    requestType: 'WaitForLocalExecution',
  })

  const status = response.effects?.status?.status ?? null

  if (!response.digest || status !== 'success') {
    throw new Error('Demo mint transaction failed to settle successfully')
  }

  await confirmDemoMint({
    client,
    digest: response.digest,
    walletAddress,
    medalSlug,
    network,
    packageId,
  })

  return {
    digest: response.digest,
    slug: medalSlug,
  }
}
