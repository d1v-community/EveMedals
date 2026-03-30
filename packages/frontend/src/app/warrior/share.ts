import type { MedalSlug } from '~~/chronicle/config/medals'
import { ENetwork } from '~~/types/ENetwork'

export interface WarriorRouteSearchParams {
  network?: string | string[] | undefined
  m?: string | string[] | undefined
  claimed?: string | string[] | undefined
}

interface WarriorRouteOptions {
  mock?: boolean
  claimed?: string[]
  locale?: string
}

const normalizeStringParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

const normalizeStringListParam = (value: string | string[] | undefined) => {
  const normalized = Array.isArray(value) ? value.join(',') : value

  if (!normalized) {
    return []
  }

  return normalized
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

const buildWarriorQueryString = (
  network: ENetwork,
  options?: WarriorRouteOptions
) => {
  const params = new URLSearchParams({ network })

  if (options?.mock) {
    params.set('m', '1')
  }

  if (options?.claimed?.length) {
    params.set('claimed', options.claimed.join(','))
  }

  return params.toString()
}

export const resolveWarriorNetwork = (
  rawNetwork: string | string[] | undefined
): ENetwork => {
  const network = normalizeStringParam(rawNetwork)?.toLowerCase()
  const validNetworks = Object.values(ENetwork)
  return validNetworks.includes(network as ENetwork)
    ? (network as ENetwork)
    : ENetwork.TESTNET
}

export const isMockWarriorRoute = (
  rawMock: string | string[] | undefined
) => normalizeStringParam(rawMock) === '1'

export const resolveMockClaimedSlugs = (
  rawClaimed: string | string[] | undefined
) => normalizeStringListParam(rawClaimed)

export const buildWarriorSharePath = (
  walletAddress: string,
  network: ENetwork,
  options?: WarriorRouteOptions
) => {
  const localePrefix =
    options?.locale && options.locale !== 'en' ? `/${options.locale}` : ''
  return `${localePrefix}/warrior/${walletAddress}?${buildWarriorQueryString(network, options)}`
}

export const buildWarriorImagePath = (
  walletAddress: string,
  network: ENetwork,
  variant: 'opengraph' | 'twitter',
  options?: WarriorRouteOptions
) =>
  `${options?.locale && options.locale !== 'en' ? `/${options.locale}` : ''}/warrior/${walletAddress}/${variant}-image?${buildWarriorQueryString(network, options)}`

export const buildMedalSharePath = (
  walletAddress: string,
  slug: MedalSlug,
  network: ENetwork,
  options?: WarriorRouteOptions
) => {
  const localePrefix =
    options?.locale && options.locale !== 'en' ? `/${options.locale}` : ''
  return `${localePrefix}/warrior/${walletAddress}/medals/${slug}?${buildWarriorQueryString(network, options)}`
}

export const buildMedalImagePath = (
  walletAddress: string,
  slug: MedalSlug,
  network: ENetwork,
  variant: 'opengraph' | 'twitter' | 'discord',
  options?: WarriorRouteOptions
) => {
  const localePrefix =
    options?.locale && options.locale !== 'en' ? `/${options.locale}` : ''
  if (variant === 'discord') {
    return `${localePrefix}/warrior/${walletAddress}/medals/${slug}/discord-image?${buildWarriorQueryString(network, options)}`
  }
  return `${localePrefix}/warrior/${walletAddress}/medals/${slug}/${variant}-image?${buildWarriorQueryString(network, options)}`
}

// ─── Per-medal share text ─────────────────────────────────────────────────────
// Fits comfortably within X's 280-char limit after the URL is appended.

const MEDAL_SHARE_TEXT: Record<MedalSlug, string> = {
  'bloodlust-butcher':
    '5 confirmed kills, chain-indexed. The Bloodlust Butcher medal is now soul-bound to my wallet — permanent, verified, indelible. #EVEFrontier #FrontierChronicle',
  'void-pioneer':
    'Infrastructure deployed in the void and recorded on Sui forever. Void Pioneer — the Frontier remembers who built it first. #EVEFrontier #FrontierChronicle',
  'galactic-courier':
    '10 gate jumps, all indexed. The supply lines that keep Frontier civilizations running — now chain-bound as the Galactic Courier medal. #EVEFrontier #FrontierChronicle',
  'turret-sentry':
    'Guns deployed, perimeter locked. Turret Sentry is now soul-bound on Sui — proof I was holding this ground before the front line moved. #EVEFrontier #FrontierChronicle',
  'assembly-pioneer':
    'Smart Assembly online. Three on-chain infrastructure interactions, now immortalized as the Assembly Pioneer medal on Sui. #EVEFrontier #FrontierChronicle',
  'turret-anchor':
    'Turrets anchored. Territory marked. The Turret Anchor medal is soulbound — a verifiable claim staked permanently in the Frontier. #EVEFrontier #FrontierChronicle',
  'ssu-trader':
    '5 SSU trade operations, chain-indexed. Markets keep moving because of haulers like me. SSU Trader medal — soul-bound on Sui. #EVEFrontier #FrontierChronicle',
  'fuel-feeder':
    'Network nodes stay live because someone fuels them. 5 fuel ops recorded. Fuel Feeder medal now bound on-chain. #EVEFrontier #FrontierChronicle',
}

const MEDAL_SHARE_TEXT_ZH: Record<MedalSlug, string> = {
  'bloodlust-butcher':
    '5 次确认击杀，已被索引并固化。Bloodlust Butcher 勋章现在已经 soul-bound 到我的钱包。#EVEFrontier #FrontierChronicle',
  'void-pioneer':
    '在虚空中留下基础设施，并永久记录在 Sui 上。Void Pioneer 证明是谁先把边境建了起来。#EVEFrontier #FrontierChronicle',
  'galactic-courier':
    '10 次星门跃迁，全部已索引。维系 Frontier 补给线的轨迹，如今作为 Galactic Courier 勋章被链上固化。#EVEFrontier #FrontierChronicle',
  'turret-sentry':
    '炮台已部署，防线已锁定。Turret Sentry 现在已经 soul-bound 上链，证明我曾经守住这块地。#EVEFrontier #FrontierChronicle',
  'assembly-pioneer':
    'Smart Assembly 已上线。三次链上基础设施交互，被沉淀为 Assembly Pioneer 勋章。#EVEFrontier #FrontierChronicle',
  'turret-anchor':
    '炮台已锚定，领地已落钉。Turret Anchor 勋章把这次可验证占领永久留在 Frontier。#EVEFrontier #FrontierChronicle',
  'ssu-trader':
    '5 次 SSU 交易操作，已被链上索引。市场之所以流动，是因为有人真在跑货。SSU Trader 已被绑定。#EVEFrontier #FrontierChronicle',
  'fuel-feeder':
    '节点之所以持续运转，是因为有人在补燃料。5 次加油操作已记录，Fuel Feeder 勋章已经链上绑定。#EVEFrontier #FrontierChronicle',
}

const MEDAL_SHARE_TEXT_IS: Record<MedalSlug, string> = {
  'bloodlust-butcher':
    '5 staðfest dráp, öll skráð. Bloodlust Butcher medalían er nú soul-bound við veskið mitt. #EVEFrontier #FrontierChronicle',
  'void-pioneer':
    'Innviðir reistir í tóminu og varðveittir á Sui. Void Pioneer sýnir hver byggði fyrst í Frontier. #EVEFrontier #FrontierChronicle',
  'galactic-courier':
    '10 gate jumps, öll skráð. Flutningaslóðir Frontier eru nú bundnar á keðju sem Galactic Courier medalían. #EVEFrontier #FrontierChronicle',
  'turret-sentry':
    'Turnar settir upp, jaðarinn læstur. Turret Sentry er nú soul-bound á Sui sem sönnun þess að ég hélt þessari stöðu. #EVEFrontier #FrontierChronicle',
  'assembly-pioneer':
    'Smart Assembly komið online. Þrjú infrastructure interactions eru nú varðveitt sem Assembly Pioneer medalía á Sui. #EVEFrontier #FrontierChronicle',
  'turret-anchor':
    'Turnar ankraðir. Svæði merkt. Turret Anchor medalían skilur eftir sannprófanlega kröfu í Frontier. #EVEFrontier #FrontierChronicle',
  'ssu-trader':
    '5 SSU trade operations, keðjuskráðar. SSU Trader medalían sýnir hver heldur mörkuðunum gangandi. #EVEFrontier #FrontierChronicle',
  'fuel-feeder':
    'Hnútar lifa vegna þess að einhver heldur þeim eldsneytisfylltum. 5 fuel ops skráðar. Fuel Feeder er nú bundin á keðju. #EVEFrontier #FrontierChronicle',
}

/**
 * Returns a compelling, platform-ready share text for the given medal slug.
 * Falls back to a generic template if the slug is unknown.
 */
export const generateMedalShareText = (
  slug: MedalSlug,
  subtitle: string,
  locale: string = 'en'
): string =>
  (locale === 'zh-CN'
    ? MEDAL_SHARE_TEXT_ZH[slug]
    : locale === 'is'
      ? MEDAL_SHARE_TEXT_IS[slug]
      : MEDAL_SHARE_TEXT[slug]) ??
  (locale === 'zh-CN'
    ? `${subtitle} 已在 Frontier Chronicle 中完成链上绑定。#EVEFrontier #FrontierChronicle`
    : locale === 'is'
      ? `${subtitle} er nú bundin á keðju í Frontier Chronicle. #EVEFrontier #FrontierChronicle`
      : `${subtitle} is chain-bound in Frontier Chronicle on Sui. #EVEFrontier #FrontierChronicle`)

export const generateWarriorShareText = ({
  locale,
  rankTitle,
  rankTitleZh,
  score,
  claimedMedalCount,
  totalMedalCount,
  network,
}: {
  locale: string
  rankTitle: string
  rankTitleZh: string
  score: number
  claimedMedalCount: number
  totalMedalCount: number
  network: ENetwork
}) => {
  if (locale === 'zh-CN') {
    return `${rankTitle}（${rankTitleZh}）· Combat Score ${score.toLocaleString()} · ${claimedMedalCount}/${totalMedalCount} 枚勋章已在 Sui ${network.toUpperCase()} 上绑定。`
  }

  if (locale === 'is') {
    return `${rankTitle} (${rankTitleZh}) · Combat Score ${score.toLocaleString()} · ${claimedMedalCount}/${totalMedalCount} medalíur bundnar á Sui ${network.toUpperCase()}.`
  }

  return `${rankTitle} (${rankTitleZh}) · Combat Score ${score.toLocaleString()} · ${claimedMedalCount}/${totalMedalCount} medals bound in Frontier Chronicle on Sui ${network.toUpperCase()}.`
}
