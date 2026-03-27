import type { ActiveMedalTemplate } from '~~/server/chronicle/claimTickets'

export interface ChronicleRuntimeFlags {
  contractConfigured: boolean
  registryObjectId: string | null
  claimSigningConfigured: boolean
  activeTemplates: Map<number, ActiveMedalTemplate>
}

export const buildChronicleWarnings = (
  activityWarning: string | null,
  runtime: ChronicleRuntimeFlags
) => {
  const warnings: string[] = []

  if (activityWarning) {
    warnings.push(activityWarning)
  }

  if (!runtime.contractConfigured) {
    warnings.push(
      'No medals contract package is configured for the current wallet network. Progress can be scanned, but claiming is disabled.'
    )
    return warnings
  }

  if (!runtime.registryObjectId) {
    warnings.push(
      'The medals package is configured, but the shared registry event could not be located yet.'
    )
  }

  if (runtime.registryObjectId && !runtime.claimSigningConfigured) {
    warnings.push(
      'Claim signing is not configured on the server. Unlocked medals remain verified until CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY is set.'
    )
  }

  if (runtime.activeTemplates.size === 0) {
    warnings.push(
      'The medals package is reachable, but no active medal templates were discovered on-chain yet.'
    )
  }

  return warnings
}
