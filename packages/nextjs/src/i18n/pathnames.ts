import { locales, type AppLocale } from './routing'

const orderedLocales = [...locales].sort((left, right) => right.length - left.length)

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`)

export const localizeHref = (locale: string, path: string) => {
  const normalizedPath = normalizePath(path)
  return `/${locale}${normalizedPath}`
}

export const stripLocalePrefix = (path: string) => {
  const normalizedPath = normalizePath(path)

  for (const locale of orderedLocales) {
    if (normalizedPath === `/${locale}`) {
      return '/'
    }

    if (normalizedPath.startsWith(`/${locale}/`)) {
      return normalizedPath.slice(locale.length + 1)
    }
  }

  return normalizedPath
}

export const localizePathname = (locale: string, pathname: string) =>
  localizeHref(locale, stripLocalePrefix(pathname))

export const withLocale = (locale: string, path: string) =>
  localizeHref(locale as AppLocale, path)
