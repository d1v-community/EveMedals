export interface ClaimSignerRegistrationState {
  claimSigningConfigured: boolean
  claimSignerRegistered: boolean
}

export const resolveClaimSignerRegistrationState = (
  configuredSignerPublicKeyBase64: string | null,
  registeredSignerPublicKeys: Set<string>
): ClaimSignerRegistrationState => ({
  claimSigningConfigured: configuredSignerPublicKeyBase64 != null,
  claimSignerRegistered:
    configuredSignerPublicKeyBase64 != null &&
    registeredSignerPublicKeys.has(configuredSignerPublicKeyBase64),
})
