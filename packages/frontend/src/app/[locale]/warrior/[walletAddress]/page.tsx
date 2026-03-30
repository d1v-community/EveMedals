import type { Metadata } from 'next'
import WarriorPage, {
  generateMetadata as generateRootMetadata,
} from '../../../warrior/[walletAddress]/page'
import type { WarriorRouteSearchParams } from '~~/warrior/share'

interface LocalizedPageProps {
  params: Promise<{ locale: string; walletAddress: string }>
  searchParams: Promise<WarriorRouteSearchParams>
}

export async function generateMetadata({
  params,
  searchParams,
}: LocalizedPageProps): Promise<Metadata> {
  const { walletAddress } = await params

  return generateRootMetadata({
    params: Promise.resolve({ walletAddress }),
    searchParams,
  })
}

export default async function LocalizedWarriorPage({
  params,
  searchParams,
}: LocalizedPageProps) {
  const { walletAddress } = await params

  return WarriorPage({
    params: Promise.resolve({ walletAddress }),
    searchParams,
  })
}
