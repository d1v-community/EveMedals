import createMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Warrior routes are mounted both as default-locale pages and [locale] wrappers.
  // Excluding them from the locale middleware avoids redirect loops with
  // `localePrefix: as-needed` while keeping the rest of the app locale-aware.
  matcher: ['/((?!api|_next|_vercel|warrior|.*\\..*).*)'],
}
