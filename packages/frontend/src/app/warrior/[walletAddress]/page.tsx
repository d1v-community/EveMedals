import { isValidSuiAddress } from '@mysten/sui/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getChronicleSnapshot } from '~~/server/chronicle/getSnapshot'
import { ENetwork } from '~~/types/ENetwork'
import WarriorCard from './components/WarriorCard'

interface PageProps {
  params: Promise<{ walletAddress: string }>
  searchParams: Promise<{ network?: string }>
}

const resolveNetwork = (n: string | undefined): ENetwork => {
  const valid = Object.values(ENetwork)
  return valid.includes(n as ENetwork) ? (n as ENetwork) : ENetwork.TESTNET
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { walletAddress } = await params
  const { network: rawNetwork } = await searchParams

  if (!isValidSuiAddress(walletAddress)) {
    return { title: 'Warrior Not Found — Frontier Chronicle' }
  }

  try {
    const network = resolveNetwork(rawNetwork)
    const snapshot = await getChronicleSnapshot(walletAddress, network)
    const { rank, displayScore, claimedMedalCount } = snapshot.warriorScore
    const short = `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`

    return {
      title: `${rank.title} — Frontier Chronicle`,
      description: `Combat Score: ${displayScore.toLocaleString()} / 10,000 · ${claimedMedalCount} Medal${claimedMedalCount !== 1 ? 's' : ''} Bound · ${short}`,
      openGraph: {
        title: `${rank.title} (${rank.titleZh}) — Frontier Chronicle`,
        description: `Combat Score: ${displayScore.toLocaleString()} / 10,000 · ${claimedMedalCount} Medal${claimedMedalCount !== 1 ? 's' : ''} Bound on Sui ${network}`,
        siteName: 'Frontier Chronicle',
      },
      twitter: {
        card: 'summary',
        title: `${rank.title} — Frontier Chronicle`,
        description: `Combat Score: ${displayScore.toLocaleString()} / 10,000 · ${claimedMedalCount} Medals Bound · Verified on Sui`,
      },
    }
  } catch {
    return { title: 'Warrior Profile — Frontier Chronicle' }
  }
}

export default async function WarriorPage({ params, searchParams }: PageProps) {
  const { walletAddress } = await params
  const { network: rawNetwork } = await searchParams

  if (!isValidSuiAddress(walletAddress)) {
    notFound()
  }

  const network = resolveNetwork(rawNetwork)

  let snapshot
  try {
    snapshot = await getChronicleSnapshot(walletAddress, network)
  } catch {
    notFound()
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--sds-dark)' }}
    >
      <div className="w-full max-w-2xl">
        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--sds-font-mono)' }}
        >
          ← Frontier Chronicle
        </a>

        <WarriorCard snapshot={snapshot} />
      </div>
    </main>
  )
}
