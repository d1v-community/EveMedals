import type { MedalSlug } from '../config/medals'
import type { ScoreBreakdownEntry, WarriorScore } from '../types'
import { getRankByScore, MAX_DISPLAY_SCORE } from '../config/ranks'

// ─── Rarity weight table ──────────────────────────────────────────────────────
// Max raw score (8 medals, all claimed + full-set bonus):
//   claimed raw = 1000 + 600 + 350 + 150 + 150 + 350 + 150 + 150 = 2900
//   full-set bonus = 2900 * 0.25 = 725
//   MAX_RAW_SCORE = 3625
const MAX_RAW_SCORE = 3625

const RARITY_WEIGHTS: Record<string, number> = {
  Legendary: 1000,
  Epic: 600,
  Rare: 350,
  Uncommon: 150,
  Common: 50,
}

interface MedalInput {
  slug: MedalSlug
  rarity: string
  claimed: boolean
  unlocked: boolean
}

export const computeWarriorScore = (medals: MedalInput[]): WarriorScore => {
  const breakdown: ScoreBreakdownEntry[] = []
  let claimedRaw = 0
  let unlockedRaw = 0
  let claimedMedalCount = 0
  let unlockedMedalCount = 0

  for (const medal of medals) {
    const basePoints = RARITY_WEIGHTS[medal.rarity] ?? 0

    if (medal.claimed) {
      const contribution = basePoints
      claimedRaw += contribution
      claimedMedalCount++
      breakdown.push({ medal: medal.slug, basePoints, multiplier: 1.0, contribution })
    } else if (medal.unlocked) {
      const contribution = basePoints * 0.5
      unlockedRaw += contribution
      unlockedMedalCount++
      breakdown.push({ medal: medal.slug, basePoints, multiplier: 0.5, contribution })
    } else {
      breakdown.push({ medal: medal.slug, basePoints, multiplier: 0, contribution: 0 })
    }
  }

  const hasFullSet = claimedMedalCount === medals.length && medals.length > 0
  const fullSetBonus = hasFullSet ? claimedRaw * 0.25 : 0
  const rawScore = claimedRaw + unlockedRaw + fullSetBonus
  const displayScore = Math.min(
    MAX_DISPLAY_SCORE,
    Math.round((rawScore / MAX_RAW_SCORE) * MAX_DISPLAY_SCORE)
  )

  return {
    displayScore,
    rank: getRankByScore(displayScore),
    claimedMedalCount,
    unlockedMedalCount,
    hasFullSet,
    breakdown,
  }
}
