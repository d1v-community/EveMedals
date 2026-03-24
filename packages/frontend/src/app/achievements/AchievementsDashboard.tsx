'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import CustomConnectButton from '../components/CustomConnectButton'
import { Card, Button } from '@radix-ui/themes'
import AchievementCard from './components/AchievementCard'

export type Achievement = {
  key: string
  name: string
  description: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
  unlocked: boolean
  progress: number
  target: number
  icon: string
}

export type AchievementsResponse = {
  walletAddress: string
  achievements: Achievement[]
  progress: {
    killmail_registry: number
    network_node_anchor: number
    storage_unit_create: number
    gate_jump: number
  }
}

export default function AchievementsDashboard() {
  const account = useCurrentAccount()
  const [data, setData] = useState<AchievementsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const address = account?.address

  useEffect(() => {
    if (!address) {
      setData(null)
      return
    }

    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/achievements?walletAddress=${address}`, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        })
        if (!res.ok) throw new Error(`Failed to load achievements: ${res.status}`)
        const json: AchievementsResponse = await res.json()
        setData(json)
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(e?.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [address])

  const unlockedCount = useMemo(
    () => data?.achievements.filter((a) => a.unlocked).length ?? 0,
    [data]
  )

  if (!address) {
    return (
      <div className="flex w-full max-w-3xl flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Frontier Chronicle</h1>
        <p className="text-slate-500">
          连接钱包以生成你的 EVE 链上名片并查看成就。
        </p>
        <CustomConnectButton />
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <Card className="p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">钱包</h2>
            <p className="text-slate-500 break-all">{address}</p>
          </div>
          <div className="text-sm text-slate-500">
            已解锁 {unlockedCount}/{data?.achievements.length ?? 3} 个成就
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="p-6 text-center">扫描中… 请稍候</Card>
      ) : error ? (
        <Card className="p-6 text-center text-red-600">{error}</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.achievements.map((a) => (
            <AchievementCard key={a.key} achievement={a} />)
          )}
        </div>
      )}

      <div className="mt-2 text-center text-xs text-slate-500">
        数据来源：Eve Eyes Indexer（延迟可能存在）
      </div>

      <div className="mx-auto">
        <Button size="3" disabled title="即将上线">
          领取 SBT 勋章（即将上线）
        </Button>
      </div>
    </div>
  )
}
