import { SuiClient, type SuiObjectResponse, getFullnodeUrl } from '@mysten/sui/client'
import { isValidSuiObjectId } from '@mysten/sui/utils'
import { getMedalDefinitionBySlug } from '~~/chronicle/config/medals'
import {
  CONTRACT_PACKAGE_ID_NOT_DEFINED,
  DEVNET_CONTRACT_PACKAGE_ID,
  LOCALNET_CONTRACT_PACKAGE_ID,
  MAINNET_CONTRACT_PACKAGE_ID,
  TESTNET_CONTRACT_PACKAGE_ID,
} from '~~/config/network'
import { fullStructName, getResponseContentField } from '~~/helpers/network'
import { type ActiveMedalTemplate } from '~~/server/chronicle/claimTickets'
import { ENetwork } from '~~/types/ENetwork'

export interface ChronicleContractState {
  claimedSlugs: Set<string>
  registryObjectId: string | null
  activeTemplates: Map<number, ActiveMedalTemplate>
  registeredSignerPublicKeys: Set<string>
}

export const resolveContractPackageId = (network: ENetwork) => {
  switch (network) {
    case ENetwork.LOCALNET: return LOCALNET_CONTRACT_PACKAGE_ID
    case ENetwork.DEVNET: return DEVNET_CONTRACT_PACKAGE_ID
    case ENetwork.TESTNET: return TESTNET_CONTRACT_PACKAGE_ID
    case ENetwork.MAINNET: return MAINNET_CONTRACT_PACKAGE_ID
    default: return CONTRACT_PACKAGE_ID_NOT_DEFINED
  }
}

export const isContractConfigured = (packageId: string) =>
  packageId !== CONTRACT_PACKAGE_ID_NOT_DEFINED && isValidSuiObjectId(packageId)

const getClaimedSlugs = (objects: SuiObjectResponse[]) => {
  const slugs = new Set<string>()
  objects.forEach((object) => {
    const slug = getResponseContentField(object, 'slug')

    if (typeof slug === 'string' && slug.length > 0) {
      slugs.add(slug)
    }
  })
  return slugs
}

const queryAllEvents = async (
  client: SuiClient,
  moveEventType: `${string}::${string}::${string}`
) => {
  const events = []
  let cursor: Awaited<ReturnType<SuiClient['queryEvents']>>['nextCursor'] = null

  while (true) {
    const page = await client.queryEvents({
      query: { MoveEventType: moveEventType },
      cursor,
      limit: 100,
      order: 'descending',
    })

    events.push(...page.data)

    if (!page.hasNextPage || page.nextCursor == null) {
      return events
    }

    cursor = page.nextCursor
  }
}

const getRegistryObjectId = async (client: SuiClient, packageId: string) => {
  const events = await client.queryEvents({
    query: { MoveEventType: fullStructName(packageId, 'EventRegistryCreated') },
    limit: 1,
    order: 'descending',
  })
  const parsedJson = events.data[0]?.parsedJson

  if (
    parsedJson &&
    typeof parsedJson === 'object' &&
    'registry_id' in parsedJson &&
    typeof parsedJson.registry_id === 'string'
  ) {
    return parsedJson.registry_id
  }

  return null
}

const getActiveTemplates = async (client: SuiClient, packageId: string) => {
  const events = await queryAllEvents(
    client,
    fullStructName(packageId, 'EventMedalTemplateAdded')
  )

  const templateIds = [
    ...new Set(
      events
        .map((event) => {
          const parsedJson = event.parsedJson

          if (
            parsedJson &&
            typeof parsedJson === 'object' &&
            'template_id' in parsedJson &&
            typeof parsedJson.template_id === 'string'
          ) {
            return parsedJson.template_id
          }

          return null
        })
        .filter((value): value is string => Boolean(value))
    ),
  ]

  if (templateIds.length === 0) {
    return new Map<number, ActiveMedalTemplate>()
  }

  const objects = await client.multiGetObjects({
    ids: templateIds,
    options: { showContent: true },
  })

  const templates = new Map<number, ActiveMedalTemplate>()

  objects.forEach((object) => {
    const objectId = object.data?.objectId
    const kindValue = getResponseContentField(object, 'medal_kind')
    const templateVersionValue = getResponseContentField(object, 'template_version')
    const slugValue = getResponseContentField(object, 'slug')
    const activeValue = getResponseContentField(object, 'active')

    if (
      !objectId ||
      typeof kindValue !== 'number' ||
      (typeof templateVersionValue !== 'string' && typeof templateVersionValue !== 'number') ||
      typeof slugValue !== 'string' ||
      activeValue !== true
    ) {
      return
    }

    const definition = getMedalDefinitionBySlug(slugValue)

    if (!definition || templates.has(kindValue)) {
      return
    }

    templates.set(kindValue, {
      kind: kindValue,
      objectId,
      templateVersion: Number(templateVersionValue),
      slug: definition.slug,
    })
  })

  return templates
}

const getRegisteredSignerPublicKeys = async (
  client: SuiClient,
  packageId: string
) => {
  const events = await queryAllEvents(
    client,
    fullStructName(packageId, 'EventSignerRotated')
  )
  const signerStates = new Map<string, boolean>()

  events.forEach((event) => {
    const parsedJson = event.parsedJson

    if (
      !parsedJson ||
      typeof parsedJson !== 'object' ||
      !('public_key' in parsedJson) ||
      !('enabled' in parsedJson) ||
      !Array.isArray(parsedJson.public_key) ||
      typeof parsedJson.enabled !== 'boolean'
    ) {
      return
    }

    const publicKey = parsedJson.public_key

    if (
      !publicKey.every(
        (entry) =>
          typeof entry === 'number' && Number.isInteger(entry) && entry >= 0 && entry <= 255
      )
    ) {
      return
    }

    const encoded = Buffer.from(Uint8Array.from(publicKey)).toString('base64')

    if (!signerStates.has(encoded)) {
      signerStates.set(encoded, parsedJson.enabled)
    }
  })

  return new Set(
    [...signerStates.entries()]
      .filter(([, enabled]) => enabled)
      .map(([publicKey]) => publicKey)
  )
}

const getOwnedMedals = async (client: SuiClient, owner: string, packageId: string) => {
  const response = await client.getOwnedObjects({
    owner,
    filter: { StructType: fullStructName(packageId, 'Medal') },
    options: { showContent: true, showDisplay: true },
    limit: 50,
  })

  return response.data
}

export const loadChronicleContractState = async (
  walletAddress: string,
  network: ENetwork,
  packageId: string
): Promise<ChronicleContractState> => {
  const client = new SuiClient({ url: getFullnodeUrl(network) })
  const [ownedMedals, registryObjectId, activeTemplates, registeredSignerPublicKeys] = await Promise.all([
    getOwnedMedals(client, walletAddress, packageId),
    getRegistryObjectId(client, packageId),
    getActiveTemplates(client, packageId),
    getRegisteredSignerPublicKeys(client, packageId),
  ])

  return {
    claimedSlugs: getClaimedSlugs(ownedMedals),
    registryObjectId,
    activeTemplates,
    registeredSignerPublicKeys,
  }
}
