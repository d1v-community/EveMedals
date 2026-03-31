import { getChronicleSnapshot } from '~~/server/chronicle/getSnapshot'
import { adminMintDemoMedal } from '~~/server/chronicle/demoMint'
import { validateDemoMintRequestBody } from '~~/server/chronicle/demoMintRequest'
import { ENetwork } from '~~/types/ENetwork'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const json = (payload: unknown, init?: ResponseInit) =>
  Response.json(payload, init)

export async function POST(request: Request) {
  try {
    const { walletAddress, network, medalSlug } = validateDemoMintRequestBody(
      await request.json()
    )

    if (network !== ENetwork.TESTNET) {
      return json(
        { error: 'Demo mint is only available on testnet' },
        { status: 403 }
      )
    }

    const snapshot = await getChronicleSnapshot(
      walletAddress,
      network
    )

    if (!snapshot.demoMint) {
      return json(
        { error: 'Demo mint is not available for the current wallet state' },
        { status: 403 }
      )
    }

    const candidate = snapshot.demoMint.candidates.find(
      (entry) => entry.slug === medalSlug
    )

    if (!candidate) {
      return json(
        { error: 'The requested medal is not eligible for demo mint' },
        { status: 403 }
      )
    }

    const result = await adminMintDemoMedal({
      walletAddress,
      network,
      medalSlug,
    })

    return json({
      success: true,
      slug: result.slug,
      digest: result.digest,
    })
  } catch (error) {
    if (
      error instanceof Error &&
      [
        'walletAddress must be a valid Sui address',
        'medalSlug is invalid',
      ].includes(error.message)
    ) {
      return json({ error: error.message }, { status: 400 })
    }

    if (error instanceof Error && error.message.startsWith('network must be one of:')) {
      return json({ error: error.message }, { status: 400 })
    }

    const message =
      error instanceof Error ? error.message : 'Demo mint failed unexpectedly'

    return json({ error: message }, { status: 500 })
  }
}
