import type { CombatRank } from '../types'

export const RANK_CATALOG: CombatRank[] = [
  {
    tier: 0,
    title: 'Void Drifter',
    titleZh: '虚空漂泊者',
    minScore: 0,
    maxScore: 0,
    tone: 'steel',
    description: 'No verified achievements on record.',
  },
  {
    tier: 1,
    title: 'Frontier Recruit',
    titleZh: '边境征兵',
    minScore: 1,
    maxScore: 999,
    tone: 'steel',
    description: 'First steps into the Frontier have been recorded.',
  },
  {
    tier: 2,
    title: 'Sector Operative',
    titleZh: '星区行动员',
    minScore: 1000,
    maxScore: 2499,
    tone: 'amber',
    description: 'Operational presence confirmed across multiple domains.',
  },
  {
    tier: 3,
    title: 'Void Ranger',
    titleZh: '虚空游骑兵',
    minScore: 2500,
    maxScore: 3999,
    tone: 'amber',
    description: 'A seasoned operator with a verifiable combat and exploration record.',
  },
  {
    tier: 4,
    title: 'Command Vanguard',
    titleZh: '指挥先锋',
    minScore: 4000,
    maxScore: 5499,
    tone: 'azure',
    description: 'Leads from the front. Achievements span combat, logistics, and infrastructure.',
  },
  {
    tier: 5,
    title: 'Warlord Aspirant',
    titleZh: '战主候选',
    minScore: 5500,
    maxScore: 6999,
    tone: 'martian',
    description: 'A rising force whose record commands respect in any fleet.',
  },
  {
    tier: 6,
    title: 'Frontier Marshal',
    titleZh: '边境元帅',
    minScore: 7000,
    maxScore: 8999,
    tone: 'martian',
    description: 'Battle-hardened and chain-verified. The Frontier remembers.',
  },
  {
    tier: 7,
    title: 'Apex Sovereign',
    titleZh: '至高主权者',
    minScore: 9000,
    maxScore: 10000,
    tone: 'crimson',
    description: 'Absolute mastery across all Frontier domains. Undeniable.',
  },
]

export const getRankByScore = (score: number): CombatRank => {
  if (score <= 0) return RANK_CATALOG[0]

  for (let i = RANK_CATALOG.length - 1; i >= 0; i--) {
    if (score >= RANK_CATALOG[i].minScore) {
      return RANK_CATALOG[i]
    }
  }

  return RANK_CATALOG[0]
}

export const MAX_DISPLAY_SCORE = 10000
