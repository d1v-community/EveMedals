import {HomePage, getHomeMetadata} from './homepage'

export async function generateMetadata() {
  return getHomeMetadata('en')
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const isMockMode = params['m'] === '1'

  return <HomePage isMockMode={isMockMode} />
}
