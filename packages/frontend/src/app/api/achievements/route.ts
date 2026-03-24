import { NextRequest } from 'next/server'

const EVE_EYES_BASE = process.env.EVE_EYES_BASE_URL || 'https://eve-eyes.d0v.xyz'
const EVE_EYES_API_KEY = process.env.EVE_EYES_API_KEY

// Basic exact-match list for functions; if unknown, fall back to module-only match
const FN = {
  anchor: 'anchor',
  create: 'create',
  jump: 'jump',
}

async function fetchMoveCalls({
  walletAddress,
  moduleName,
  functionName,
  pageSize = 50,
  maxPages = 10,
}: {
  walletAddress: string
  moduleName: string
  functionName?: string
  pageSize?: number
  maxPages?: number
}) {
  let page = 1
  let total = 0

  while (page <= maxPages) {
    const qs = new URLSearchParams()
    qs.set('page', String(page))
    qs.set('pageSize', String(pageSize))
    qs.set('senderAddress', walletAddress)
    qs.set('moduleName', moduleName)
    if (functionName) qs.set('functionName', functionName)

    const url = `${EVE_EYES_BASE}/api/indexer/move-calls?${qs.toString()}`

    const res = await fetch(url, {
      headers: {
        ...(EVE_EYES_API_KEY
          ? { Authorization: `ApiKey ${EVE_EYES_API_KEY}` }
          : {}),
      },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`Eve Eyes error ${res.status}`)
    const json = await res.json()

    const items = Array.isArray(json?.items) ? json.items : []
    total += items.length

    const pagination = json?.pagination
    const hasMore = pagination && pagination.page < pagination.totalPages
    if (!hasMore || items.length === 0) break
    page += 1
  }

  return total
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('walletAddress')?.trim()

  if (!walletAddress || !walletAddress.startsWith('0x')) {
    return new Response(JSON.stringify({ error: 'Invalid walletAddress' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const [killCount, nodeAnchors, storageCreates, gateJumps] = await Promise.all([
      fetchMoveCalls({ walletAddress, moduleName: 'killmail_registry' }),
      fetchMoveCalls({ walletAddress, moduleName: 'network_node', functionName: FN.anchor }),
      fetchMoveCalls({ walletAddress, moduleName: 'storage_unit', functionName: FN.create }),
      fetchMoveCalls({ walletAddress, moduleName: 'gate', functionName: FN.jump }),
    ])

    const achievements = [
      {
        key: 'bloodlust_butcher',
        name: '嗜血屠夫 (Bloodlust Butcher)',
        description: '作为攻击者参与至少 5 次击杀（killmail_registry）',
        rarity: 'Rare' as const,
        unlocked: killCount >= 5,
        progress: killCount,
        target: 5,
        icon: '🩸',
      },
      {
        key: 'void_pioneer',
        name: '深空拓荒者 (Void Pioneer)',
        description: '成功锚定 1 个网络节点或创建 3 个存储单元',
        rarity: 'Epic' as const,
        unlocked: nodeAnchors >= 1 || storageCreates >= 3,
        progress: Math.max(nodeAnchors, storageCreates),
        target: Math.max(1, 3),
        icon: '🌌',
      },
      {
        key: 'galactic_courier',
        name: '星际物流商 (Galactic Courier)',
        description: '调用 star gate 跃迁超过 10 次',
        rarity: 'Common' as const,
        unlocked: gateJumps > 10,
        progress: gateJumps,
        target: 10,
        icon: '📦',
      },
    ]

    return new Response(
      JSON.stringify({
        walletAddress,
        achievements,
        progress: {
          killmail_registry: killCount,
          network_node_anchor: nodeAnchors,
          storage_unit_create: storageCreates,
          gate_jump: gateJumps,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message || 'Failed to load achievements' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
