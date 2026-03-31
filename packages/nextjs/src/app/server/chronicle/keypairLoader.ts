import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

export interface ChronicleKeypairConfig {
  keypair: Ed25519Keypair
  publicKeyBytes: Uint8Array
  publicKeyBase64: string
  address: string
}

const decodeHex = (value: string) => {
  const normalized = value.startsWith('0x') ? value.slice(2) : value

  if (normalized.length === 0 || normalized.length % 2 !== 0) {
    return null
  }

  if (!/^[0-9a-fA-F]+$/.test(normalized)) {
    return null
  }

  return Uint8Array.from(Buffer.from(normalized, 'hex'))
}

const decodeBase64 = (value: string) => {
  try {
    const bytes = Buffer.from(value, 'base64')

    if (bytes.length === 0) {
      return null
    }

    return Uint8Array.from(bytes)
  } catch {
    return null
  }
}

export const parseChronicleSecretKey = (rawValue: string) => {
  if (rawValue.startsWith('suiprivkey1')) {
    return Ed25519Keypair.fromSecretKey(rawValue)
  }

  const trimmed = rawValue.trim()
  const decoded = decodeHex(trimmed) || decodeBase64(trimmed)

  if (!decoded || decoded.length !== 32) {
    throw new Error(
      'Chronicle private key must be a suiprivkey string, 32-byte hex, or 32-byte base64 secret'
    )
  }

  return Ed25519Keypair.fromSecretKey(decoded)
}

export const loadChronicleKeypairConfig = (
  secret: string | undefined
): ChronicleKeypairConfig | null => {
  if (!secret) {
    return null
  }

  const keypair = parseChronicleSecretKey(secret)
  const publicKeyBytes = keypair.getPublicKey().toRawBytes()

  return {
    keypair,
    publicKeyBytes,
    publicKeyBase64: Buffer.from(publicKeyBytes).toString('base64'),
    address: keypair.toSuiAddress(),
  }
}
