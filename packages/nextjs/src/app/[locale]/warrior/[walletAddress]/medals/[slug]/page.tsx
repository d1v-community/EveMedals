import type { Metadata } from 'next'
import MedalSharePage, {
  generateMetadata as generateRootMetadata,
} from '../../../../../warrior/[walletAddress]/medals/[slug]/page'
import type { WarriorRouteSearchParams } from '~~/warrior/share'

interface LocalizedMedalPageProps {
  params: Promise<{ locale: string; walletAddress: string; slug: string }>
  searchParams: Promise<WarriorRouteSearchParams>
}

export async function generateMetadata({
  params,
  searchParams,
}: LocalizedMedalPageProps): Promise<Metadata> {
  const { walletAddress, slug } = await params

  return generateRootMetadata({
    params: Promise.resolve({ walletAddress, slug }),
    searchParams,
  })
}

export default async function LocalizedMedalSharePage({
  params,
  searchParams,
}: LocalizedMedalPageProps) {
  const { walletAddress, slug } = await params

  return MedalSharePage({
    params: Promise.resolve({ walletAddress, slug }),
    searchParams,
  })
}
