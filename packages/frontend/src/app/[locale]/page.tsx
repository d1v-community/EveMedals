import {notFound} from 'next/navigation'
import {HomePage, getHomeMetadata} from '../homepage'
import {locales} from '../../i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params

  if (!locales.includes(locale as (typeof locales)[number])) {
    return getHomeMetadata('en')
  }

  return getHomeMetadata(locale)
}

export default async function LocalizedPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{locale}, resolvedSearchParams] = await Promise.all([params, searchParams])

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  const isMockMode = resolvedSearchParams['m'] === '1'

  return <HomePage isMockMode={isMockMode} />
}
