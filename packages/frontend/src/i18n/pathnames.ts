import { defaultLocale, type AppLocale } from './routing'

export const localizeHref = (locale: string, path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (locale === defaultLocale) {
    return normalizedPath
  }

  return `/${locale}${normalizedPath}`
}

export const withLocale = (locale: string, path: string) =>
  localizeHref(locale as AppLocale, path)
