const EVE_EYES_BASE_URL =
  process.env.EVE_EYES_BASE_URL || 'https://eve-eyes.d0v.xyz'
const EVE_EYES_API_KEY = process.env.EVE_EYES_API_KEY
const MOVE_CALL_PAGE_SIZE = 100
const FREE_SCAN_PAGE_LIMIT = 3
const DEFAULT_AUTHENTICATED_SCAN_PAGE_LIMIT = 6
const AUTHENTICATED_SCAN_PAGE_LIMIT = Math.max(
  FREE_SCAN_PAGE_LIMIT,
  Number(
    process.env.EVE_EYES_SCAN_PAGE_LIMIT ||
      DEFAULT_AUTHENTICATED_SCAN_PAGE_LIMIT
  )
)
const QUERY_BATCH_SIZE = Math.max(
  1,
  Number(process.env.EVE_EYES_SCAN_CONCURRENCY || 2)
)
const PAGE_REQUEST_DELAY_MS = Math.max(
  0,
  Number(process.env.EVE_EYES_SCAN_PAGE_DELAY_MS || 120)
)
const QUERY_BATCH_DELAY_MS = Math.max(
  0,
  Number(process.env.EVE_EYES_SCAN_BATCH_DELAY_MS || 180)
)
const EVE_EYES_MAX_RETRIES = Math.max(
  0,
  Number(process.env.EVE_EYES_SCAN_MAX_RETRIES || 3)
)
const EVE_EYES_RETRY_BASE_DELAY_MS = Math.max(
  100,
  Number(process.env.EVE_EYES_SCAN_RETRY_DELAY_MS || 600)
)

interface EveEyesActionEntity {
  value: string
  kind: string
  label: string
}

export interface EveEyesMoveCall {
  txDigest: string
  callIndex: number
  packageId: string | null
  moduleName: string
  functionName: string
  rawCall: string
  transactionTime: string | null
  createdAt: string | null
  network: string | null
  senderAddress: string | null
  status: string | null
  checkpoint: string | null
  actionSummary: string | null
  actionEntities: EveEyesActionEntity[]
}

interface EveEyesMoveCallPage {
  items: EveEyesMoveCall[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    freePageLimit: number
  }
  auth: {
    type: string
  }
}

interface EveEyesWindow {
  items: EveEyesMoveCall[]
  authType: string
  scanLimitReached: boolean
  scannedPages: number
}

interface EveEyesQueryDefinition {
  key: string
  params: Record<string, string>
}

export interface WalletActivitySnapshot {
  counts: {
    killmailAttacks: number
    networkNodeAnchors: number
    storageUnitAnchors: number
    gateJumps: number
    turretOps: number
    assemblyOps: number
    turretAnchors: number
    ssuTradeOps: number
    networkNodeFuels: number
  }
  characterId: string | null
  evePackageId: string | null
  observedNetwork: string | null
  lastActivityAt: string | null
  scanMode: 'preview' | 'authenticated'
  scanLimitReached: boolean
  scannedPages: number
}

const buildHeaders = () => {
  if (!EVE_EYES_API_KEY) {
    return undefined
  }

  return {
    Authorization: `ApiKey ${EVE_EYES_API_KEY}`,
  }
}

const delay = async (milliseconds: number) => {
  if (milliseconds <= 0) {
    return
  }

  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

const parseRetryAfterMilliseconds = (headerValue: string | null) => {
  if (!headerValue) {
    return null
  }

  const seconds = Number(headerValue)

  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000
  }

  const retryAt = Date.parse(headerValue)

  if (Number.isNaN(retryAt)) {
    return null
  }

  return Math.max(0, retryAt - Date.now())
}

const fetchMoveCallPage = async (
  params: Record<string, string>,
  page: number
): Promise<EveEyesMoveCallPage> => {
  const searchParams = new URLSearchParams({
    ...params,
    includeActionSummary: '1',
    page: String(page),
    pageSize: String(MOVE_CALL_PAGE_SIZE),
  })

  for (let attempt = 0; attempt <= EVE_EYES_MAX_RETRIES; attempt += 1) {
    const response = await fetch(
      `${EVE_EYES_BASE_URL}/api/indexer/move-calls?${searchParams.toString()}`,
      {
        cache: 'no-store',
        headers: buildHeaders(),
      }
    )

    if (response.ok) {
      return response.json()
    }

    const isRateLimited = response.status === 429
    const isLastAttempt = attempt === EVE_EYES_MAX_RETRIES

    if (!isRateLimited || isLastAttempt) {
      if (isRateLimited) {
        throw new Error(
          'Eve Eyes rate limit hit. Chronicle will need a slower retry in a moment.'
        )
      }

      throw new Error(`Eve Eyes move-calls request failed: ${response.status}`)
    }

    const retryAfterDelay =
      parseRetryAfterMilliseconds(response.headers.get('retry-after')) ??
      EVE_EYES_RETRY_BASE_DELAY_MS * 2 ** attempt

    await delay(retryAfterDelay)
  }

  throw new Error('Eve Eyes move-calls request failed: retry budget exhausted')
}

const collectMoveCalls = async (
  params: Record<string, string>
): Promise<EveEyesWindow> => {
  const maxPages = EVE_EYES_API_KEY
    ? AUTHENTICATED_SCAN_PAGE_LIMIT
    : FREE_SCAN_PAGE_LIMIT

  const items: EveEyesMoveCall[] = []
  let authType = 'anonymous'
  let totalPages = 1
  let scannedPages = 0

  for (let page = 1; page <= maxPages; page += 1) {
    if (page > 1 && PAGE_REQUEST_DELAY_MS > 0) {
      await delay(PAGE_REQUEST_DELAY_MS)
    }

    const payload = await fetchMoveCallPage(params, page)
    authType = payload.auth.type
    totalPages = payload.pagination.totalPages
    scannedPages = page
    items.push(...payload.items)

    if (page >= totalPages) {
      break
    }
  }

  return {
    items,
    authType,
    scanLimitReached: totalPages > scannedPages,
    scannedPages,
  }
}

const collectMoveCallsInBatches = async (
  definitions: EveEyesQueryDefinition[]
) => {
  const windows = new Map<string, EveEyesWindow>()

  for (let index = 0; index < definitions.length; index += QUERY_BATCH_SIZE) {
    const batch = definitions.slice(index, index + QUERY_BATCH_SIZE)
    const entries = await Promise.all(
      batch.map(async (definition) => [
        definition.key,
        await collectMoveCalls(definition.params),
      ] as const)
    )

    entries.forEach(([key, value]) => {
      windows.set(key, value)
    })

    if (index + QUERY_BATCH_SIZE < definitions.length) {
      await delay(QUERY_BATCH_DELAY_MS)
    }
  }

  return windows
}

const dedupeMoveCalls = (...collections: EveEyesMoveCall[][]) => {
  const deduped = new Map<string, EveEyesMoveCall>()

  collections.flat().forEach((item) => {
    deduped.set(`${item.txDigest}:${item.callIndex}`, item)
  })

  return [...deduped.values()]
}

const getLatestTimestamp = (items: EveEyesMoveCall[]) => {
  return (
    items
      .map((item) => item.transactionTime || item.createdAt)
      .filter((value): value is string => typeof value === 'string')
      .sort((left, right) => right.localeCompare(left))[0] || null
  )
}

const getCharacterId = (items: EveEyesMoveCall[]) => {
  for (const item of items) {
    const character = item.actionEntities.find(
      (entity) => entity.label === 'character'
    )

    if (character) {
      return character.value
    }
  }

  return null
}

const getFirstValue = (
  items: EveEyesMoveCall[],
  pick: (item: EveEyesMoveCall) => string | null
) => {
  for (const item of items) {
    const value = pick(item)

    if (value) {
      return value
    }
  }

  return null
}

export const fetchWalletActivitySnapshot = async (
  walletAddress: string
): Promise<WalletActivitySnapshot> => {
  const windows = await collectMoveCallsInBatches([
    {
      key: 'killmailRegistry',
      params: {
        senderAddress: walletAddress,
        moduleName: 'killmail_registry',
      },
    },
    {
      key: 'killmail',
      params: {
        senderAddress: walletAddress,
        moduleName: 'killmail',
      },
    },
    {
      key: 'networkNode',
      params: {
        senderAddress: walletAddress,
        moduleName: 'network_node',
        functionName: 'anchor',
      },
    },
    {
      key: 'storageUnit',
      params: {
        senderAddress: walletAddress,
        moduleName: 'storage_unit',
        functionName: 'anchor',
      },
    },
    {
      key: 'gateJump',
      params: {
        senderAddress: walletAddress,
        moduleName: 'gate',
        functionName: 'jump',
      },
    },
    {
      key: 'turret',
      params: {
        senderAddress: walletAddress,
        moduleName: 'turret',
      },
    },
    {
      key: 'assembly',
      params: {
        senderAddress: walletAddress,
        moduleName: 'assembly',
      },
    },
    {
      key: 'turretAnchor',
      params: {
        senderAddress: walletAddress,
        moduleName: 'turret',
        functionName: 'anchor',
      },
    },
    {
      key: 'ssuDeposit',
      params: {
        senderAddress: walletAddress,
        moduleName: 'storage_unit',
        functionName: 'deposit',
      },
    },
    {
      key: 'ssuWithdraw',
      params: {
        senderAddress: walletAddress,
        moduleName: 'storage_unit',
        functionName: 'withdraw',
      },
    },
    {
      key: 'networkNodeFuel',
      params: {
        senderAddress: walletAddress,
        moduleName: 'network_node',
        functionName: 'feed_fuel',
      },
    },
  ])

  const killmailRegistryWindow = windows.get('killmailRegistry')!
  const killmailWindow = windows.get('killmail')!
  const networkNodeWindow = windows.get('networkNode')!
  const storageUnitWindow = windows.get('storageUnit')!
  const gateJumpWindow = windows.get('gateJump')!
  const turretWindow = windows.get('turret')!
  const assemblyWindow = windows.get('assembly')!
  const turretAnchorWindow = windows.get('turretAnchor')!
  const ssuDepositWindow = windows.get('ssuDeposit')!
  const ssuWithdrawWindow = windows.get('ssuWithdraw')!
  const networkNodeFuelWindow = windows.get('networkNodeFuel')!

  const killmailCalls = dedupeMoveCalls(
    killmailRegistryWindow.items,
    killmailWindow.items
  )
  const ssuTradeCalls = dedupeMoveCalls(
    ssuDepositWindow.items,
    ssuWithdrawWindow.items
  )
  const activityCalls = dedupeMoveCalls(
    killmailCalls,
    networkNodeWindow.items,
    storageUnitWindow.items,
    gateJumpWindow.items,
    turretWindow.items,
    assemblyWindow.items
  )

  return {
    counts: {
      killmailAttacks: killmailCalls.length,
      networkNodeAnchors: networkNodeWindow.items.length,
      storageUnitAnchors: storageUnitWindow.items.length,
      gateJumps: gateJumpWindow.items.length,
      turretOps: turretWindow.items.length,
      assemblyOps: assemblyWindow.items.length,
      turretAnchors: turretAnchorWindow.items.length,
      ssuTradeOps: ssuTradeCalls.length,
      networkNodeFuels: networkNodeFuelWindow.items.length,
    },
    characterId: getCharacterId(gateJumpWindow.items),
    evePackageId: getFirstValue(activityCalls, (item) => item.packageId),
    observedNetwork: getFirstValue(activityCalls, (item) => item.network),
    lastActivityAt: getLatestTimestamp(activityCalls),
    scanMode: [
      killmailRegistryWindow.authType,
      killmailWindow.authType,
      networkNodeWindow.authType,
      storageUnitWindow.authType,
      gateJumpWindow.authType,
      turretWindow.authType,
      assemblyWindow.authType,
      turretAnchorWindow.authType,
      ssuDepositWindow.authType,
      ssuWithdrawWindow.authType,
      networkNodeFuelWindow.authType,
    ].some((authType) => authType !== 'anonymous')
      ? 'authenticated'
      : 'preview',
    scanLimitReached:
      killmailRegistryWindow.scanLimitReached ||
      killmailWindow.scanLimitReached ||
      networkNodeWindow.scanLimitReached ||
      storageUnitWindow.scanLimitReached ||
      gateJumpWindow.scanLimitReached ||
      turretWindow.scanLimitReached ||
      assemblyWindow.scanLimitReached ||
      turretAnchorWindow.scanLimitReached ||
      ssuDepositWindow.scanLimitReached ||
      ssuWithdrawWindow.scanLimitReached ||
      networkNodeFuelWindow.scanLimitReached,
    scannedPages:
      killmailRegistryWindow.scannedPages +
      killmailWindow.scannedPages +
      networkNodeWindow.scannedPages +
      storageUnitWindow.scannedPages +
      gateJumpWindow.scannedPages +
      turretWindow.scannedPages +
      assemblyWindow.scannedPages +
      turretAnchorWindow.scannedPages +
      ssuDepositWindow.scannedPages +
      ssuWithdrawWindow.scannedPages +
      networkNodeFuelWindow.scannedPages,
  }
}
