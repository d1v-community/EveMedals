import type { ChronicleClaimOrigin } from '~~/chronicle/types'

export const resolveClaimOriginFromEvidenceUri = (
  evidenceUri: string | null | undefined
): Exclude<ChronicleClaimOrigin, null> =>
  evidenceUri === 'admin-mint' ? 'demo-mint' : 'claim'
