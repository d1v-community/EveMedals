import {getRequestConfig} from 'next-intl/server'
import {hasLocale} from 'next-intl'
import {defaultLocale, routing} from './routing'
import {DEFAULT_TIME_ZONE} from './config'

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: DEFAULT_TIME_ZONE,
  }
})
