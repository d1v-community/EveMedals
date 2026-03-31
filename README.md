# EVE Medals
[![Discord chat](https://img.shields.io/discord/1237259509366521866.svg?logo=discord&style=flat-square)](https://discord.com/invite/HuDPpXz4Hx)

[English](./README.md) | [简体中文](./README.zh-CN.md) | [Íslenska](./README.is-IS.md)

![EVE Medals](./docs/assets/EveMedals.png)

[Won the 1st place in the Randomness category of the Sui Overflow 2024 hackathon](https://blog.sui.io/2024-sui-overflow-hackathon-winners/)

`EVE Medals` is an `EVE Frontier` achievement product on Sui. It scans player activity, turns verified progress into medal readiness, issues wallet-bound medals, and exposes public Warrior pages for sharing proof.

This repository is a `pnpm` monorepo for the live `Frontier Chronicle -> Medal Claim -> Warrior Share` product flow. Some starter-era names still exist in metadata and a few legacy folders, but Chronicle, medals, wallet sync, and Warrior pages are the source of truth.

## Product Loop

1. A player connects a Sui wallet
2. The app builds a Chronicle snapshot from indexed `EVE Frontier` activity plus on-chain medal state
3. Eligible medals become claimable
4. The BFF issues signed claim tickets and the Move contract mints wallet-bound medals
5. Claimed medals show up on Warrior pages and share surfaces

## Repository Layout

- `packages/nextjs`: Next.js 16 app, Chronicle dashboard, API routes, wallet sync, Warrior pages, share surfaces
- `packages/contract`: Sui Move package at `move/medals` plus network deployment helpers
- `docs`: product, architecture, demo, and judge-facing material

Business-critical paths:

- `packages/nextjs/src/app/chronicle`
- `packages/nextjs/src/app/api/chronicle/route.ts`
- `packages/nextjs/src/app/api/users/route.ts`
- `packages/nextjs/src/app/server/chronicle`
- `packages/nextjs/src/app/server/db`
- `packages/contract/move/medals/sources/medals.move`

## What Is Already Working

- Eve Eyes-backed Chronicle activity scanning
- explainable medal thresholds and claim readiness
- signed claim tickets with TTL checks
- wallet-bound medal minting on Sui
- wallet-to-database sync when `DATABASE_URL` is configured
- public Warrior pages and share tracking surfaces

## Prerequisites

- [Node.js 20+](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Suibase](https://suibase.io/how-to/install.html)

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create `packages/nextjs/.env.local` as needed:

```bash
DATABASE_URL=postgres://...
EVE_EYES_API_KEY=...
CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY=suiprivkey...
CHRONICLE_CLAIM_TICKET_TTL_MS=600000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=0x...
```

If you deploy the Move package with the workspace scripts below, the matching `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` value is written into `packages/nextjs/.env.local` automatically.

### 3. Start the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The app defaults to `testnet` wallet/network behavior unless you intentionally switch to another network.

## Local Development With a Contract

Start local Sui infrastructure:

```bash
pnpm localnet:start
```

Deploy the medals package to localnet:

```bash
pnpm localnet:deploy
```

Then:

1. Switch your wallet to `localnet`
2. Fund the wallet with the built-in wallet faucet or:

```bash
pnpm localnet:faucet 0xYOURADDRESS
```

3. Run the app with `pnpm dev`

Local Explorer is available on [http://localhost:9001](http://localhost:9001).

## Environment Behavior

| Variable | Purpose | Behavior when missing |
| --- | --- | --- |
| `DATABASE_URL` | Enables server-side DB access and wallet sync | App still loads, but `/api/users` returns `databaseEnabled: false` and wallet sync is skipped |
| `EVE_EYES_API_KEY` | Enables deeper Eve Eyes history scanning | Chronicle falls back to preview mode and only sees the public page window |
| `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY` | Signs claim tickets for medal minting | Medals can still be scanned and verified, but claim tickets are not issued |
| `CHRONICLE_CLAIM_TICKET_TTL_MS` | Claim ticket TTL in milliseconds | Defaults to `600000` |
| `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` | Network-specific contract package IDs | Scan can still run, but claim/on-chain interactions are disabled for that network |
| `NEXT_PUBLIC_SITE_URL` | Public site base URL used in evidence/share links | Falls back to `http://localhost:3000` |

## Common Commands

Run all commands from the repository root unless noted otherwise.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Next.js app in development mode |
| `pnpm build` | Build the Move package and the Next.js app |
| `pnpm lint` | Run ESLint for the Next.js workspace |
| `pnpm test` | Run Move contract tests |
| `pnpm --filter nextjs test` | Run Next.js integration tests |
| `pnpm --filter nextjs db:create-migration <name>` | Create a numbered SQL migration |
| `pnpm --filter nextjs db:migrate` | Apply SQL migrations |
| `pnpm localnet:start` | Start localnet and the local explorer |
| `pnpm localnet:deploy` | Publish the Move package to localnet and write the package ID into `.env.local` |
| `pnpm devnet:deploy` | Publish to devnet and update `.env.local` |
| `pnpm testnet:deploy` | Publish to testnet and update `.env.local` |
| `pnpm mainnet:deploy` | Publish to mainnet and update `.env.local` |
| `pnpm vercel:prod` | Deploy the app from the repo root via Vercel |

Use `*:deploy:no-dependency-check` only when dependency verification issues are understood and the workaround is intentional.

## Database and Wallet Sync

- Wallet connect triggers `packages/nextjs/src/app/components/WalletUserSync.tsx`
- The client syncs wallet identity to `POST /api/users`
- SQL migrations live in `packages/nextjs/db/migrations`
- Current test coverage includes migrations and user sync integration flows

Existing migration files:

- `packages/nextjs/db/migrations/00001_init.sql`
- `packages/nextjs/db/migrations/00002_share_events.sql`

## Network and Deployment Notes

- The app currently assumes `testnet` first when no network is specified
- `pnpm localnet:deploy`, `pnpm devnet:deploy`, `pnpm testnet:deploy`, and `pnpm mainnet:deploy` all publish `packages/contract/move/medals`
- Deployment helpers write package IDs into `packages/nextjs/.env.local`
- Do not commit `packages/nextjs/.env.local` or any secrets
- If you deploy from CI or Vercel, mirror the same `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` values in that environment

Useful helpers:

- `pnpm devnet:address`
- `pnpm testnet:address`
- `pnpm mainnet:address`
- `pnpm devnet:links`
- `pnpm testnet:links`
- `pnpm mainnet:links`

### Testnet Claim Signer And Vercel Minting

To keep Chronicle medal minting live on both local Next.js and a future Vercel deployment, keep these rules aligned:

- `pnpm testnet:probe`: inspect the current testnet package, registry, template count, signer count, and whether your configured signer is already registered
- `pnpm testnet:register-signer`: register the public key derived from `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY` into the current testnet `MedalRegistry`
- local `.env.local` should include:
  - `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=0x4de6789f05183cdfbc7756ee7d30e34996ad7ff506142c86146012aaa371fc60`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
  - `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY=<server-side signer secret>`
- Vercel must mirror the same signer and package settings:
  - `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID`
  - `NEXT_PUBLIC_SITE_URL=https://<your-vercel-domain>`
  - `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY`
  - optional: `CHRONICLE_CLAIM_TICKET_TTL_MS`
- the frontend can only mint when that server-side signer public key is already registered on-chain for the same package and registry; setting env vars without `pnpm testnet:register-signer` will still leave claim disabled
- if you rotate `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY`, register the new public key before deploying the new server env to Vercel, or claim tickets will stop minting

## Testing

Contract tests:

```bash
pnpm test
```

Next.js integration tests:

```bash
pnpm --filter nextjs test
```

Lint:

```bash
pnpm lint
```

## Docs

- [Hackathon one-pager](./docs/eve-medals-hackathon-one-pager.md)
- [Judge guide](./docs/eve-medals-judge-guide.md)
- [Chronicle product architecture](./docs/chronicle-product-architecture.md)
- [1-minute defense](./docs/eve-medals-1min-defense.md)
- [5-minute demo script](./docs/eve-medals-demo-5min-script.md)

## License

Copyright (c) 2024 Konstantin Komelin and other contributors

Code is licensed under [MIT](./LICENSE).

SVG graphics used for NFTs are licensed under [CC-BY 4.0](./LICENSE-GRAPHICS).
