# EVE Medals
[![Discord chat](https://img.shields.io/discord/1237259509366521866.svg?logo=discord&style=flat-square)](https://discord.com/invite/HuDPpXz4Hx)

[中文文档](./README.zh-CN.md)

![Spoiler](https://repository-images.githubusercontent.com/794883099/f0937c6b-c021-41db-b44a-a287b29111c3)

[Won the 1st place in the Randomness category of the Sui Overflow 2024 hackathon](https://blog.sui.io/2024-sui-overflow-hackathon-winners/)

## One-line Punch

`EVE Medals` turns real `EVE Frontier` activity into verifiable medals, Warrior profiles, and shareable proof.

Current positioning:

> A working achievement verification and sharing product for EVE Frontier.

This repository should be read as an `EVE Medals` / `Frontier Chronicle` product, not as a generic starter template.

Core product loop:

`activity scan -> achievement state -> medal claim -> Warrior profile -> share`

Core packages:

- `packages/nextjs`: Chronicle dashboard, Warrior pages, API routes, DB sync, share surfaces
- `packages/contract`: Sui Move medals contract and deployment helpers

Judge-facing docs:

- [Hackathon one-pager](./docs/eve-medals-hackathon-one-pager.md)
- [Chronicle product architecture](./docs/chronicle-product-architecture.md)
- [1-minute defense](./docs/eve-medals-1min-defense.md)
- [5-minute demo script](./docs/eve-medals-demo-5min-script.md)

## What This Product Does

`EVE Medals` is built around one focused loop:

1. Scan a player wallet for indexed `EVE Frontier` activity
2. Map that activity into medal progress and readiness
3. Let eligible players claim wallet-bound medals on Sui
4. Reflect the result into a public Warrior page and share surfaces

What is already real:

- Eve Eyes-backed activity scanning
- explainable medal thresholds and claim readiness
- Sui medal ownership lookup and claim flow
- Warrior profile pages and share cards
- QR/share re-entry paths

What is still in progress:

- trusted deployment alignment across target environments
- stronger proof exits to explorer-linked verification
- referral, attribution, and conversion measurement

## Prerequisites

Before you begin, install the following:

- [Suibase](https://suibase.io/how-to/install.html)
- [Node (>= 20)](https://nodejs.org/en/download/)
- [pnpm (>= 9)](https://pnpm.io/installation)

## Installation

### Repository Setup

```bash
pnpm install
```

This repository is already the product codebase. Clone it directly and use the workspace scripts below instead of starter-template init commands.

## Usage

#### 1. Run the local Sui network:

```bash
pnpm localnet:start
```

Local Sui Explorer will be available on [localhost:9001](http://localhost:9001/)

#### 2. Deploy the demo contract to the local network:

```bash
pnpm localnet:deploy
```

_This command skips dependency verifications to prevent dependency version mismatch issues, which are caused by local and remote Sui version mismatch. The deploy commands for devnet, testnet and mainnet do perform such verifications._

#### 3. Switch to the local network in your browser wallet settings.

#### 4. Fund your localnet account/address:

You have a few options here:

a) Use the Faucet button integrated into your wallet (e.g. Sui Wallet).

b) Copy the localnet address from your wallet and run the following in your console:

```bash
pnpm localnet:faucet 0xYOURADDRESS
```

c) Run the app and use the Faucet button in the footer.

#### 5. Run the app:

```bash
pnpm start
```
Additional commands live in the root and package-level `package.json` files.

## Test

#### Contract

```bash
pnpm test
```

## Docs & Support

- [Judge Notes](./docs/eve-medals-judge-guide.md)
- [Product Architecture](./docs/chronicle-product-architecture.md)
- [@suiware/kit Docs](https://www.npmjs.com/package/@suiware/kit)
- [Discord Support](https://discord.com/invite/HuDPpXz4Hx)  

## Useful Links

- [Useful VSCode Extensions](./.vscode/extensions.json)
- [Suibase Docs](https://suibase.io/intro.html)
- [Move Book](https://move-book.com/)
- [Sui Move: Code Conventions](https://docs.sui.io/concepts/sui-move-concepts/conventions)
- [@mysten/create-dapp - official starter](https://www.npmjs.com/package/@mysten/create-dapp)
- [Awesome Sui](https://github.com/sui-foundation/awesome-sui)

## License & Copyright

Copyright (c) 2024 Konstantin Komelin and other contributors

Code is licensed under [MIT](./LICENSE)

SVG Graphics used for NFTs is licensed under [CC-BY 4.0](./LICENSE-GRAPHICS)

## Current Repository Notes

This repository should now be treated as the living `EVE Medals` / `Frontier Chronicle` product codebase. Product behavior is defined by the Chronicle scan flow, the claim-only medals contract, wallet sync, and Warrior share surfaces.

This repo is a pnpm monorepo:

- `packages/nextjs`: Next.js app
- `packages/contract`: Move package + Suibase helpers

## Frontier Chronicle Demo

This repository now ships a hackathon-ready `Frontier Chronicle` flow for EVE Frontier:

- Eve Eyes-backed activity scan via `app/api/chronicle`
- Non-transferable `medals::medals` SBT contract
- Claim-only `claim_medal` entrypoint with signed claim tickets, TTL checks, and duplicate-safe admin reissue
- Wallet dashboard for scan -> claim -> showcase

Recommended environment:

```bash
NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=0x...
EVE_EYES_API_KEY=...
CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY=suiprivkey...
CHRONICLE_CLAIM_TICKET_TTL_MS=600000
NEXT_PUBLIC_SITE_URL=https://frontier-chronicle.xyz
# optional override
EVE_EYES_BASE_URL=https://eve-eyes.d0v.xyz
```

Notes:

- If `EVE_EYES_API_KEY` is missing, the dashboard still works in preview mode, but only scans the public page window from Eve Eyes.
- Claiming requires a configured `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` for the wallet network.
- `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY` is a server-side key used by the Next.js BFF to sign claim tickets. It must never be exposed through `NEXT_PUBLIC_*`.
- The default wallet network in the app is now `testnet`, because the Eve Eyes index currently tracks frontier activity there.

### Develop (from repo root)

```bash
pnpm dev
```

### Deploy the Next.js app to Vercel (from repo root)

```bash
pnpm vercel:prod
```

Notes:

- The repo root now includes [`vercel.json`](./vercel.json), so `vercel` / `vercel --prod` run from the root will build the Next.js app in `packages/nextjs`.
- `pnpm vercel:prod` is now just a thin wrapper around `vercel --prod`.
- If you deploy in Vercel Dashboard, keep the project root at the repository root so this config is picked up.

### Database and migrations

The `packages/nextjs` app now includes both the UI and the server-side BFF logic through Next.js route handlers.

Required env:

- `DATABASE_URL=...`

What is included:

- Wallet login auto-sync: when a user connects a wallet, the Next.js app calls [`/api/users`](./packages/nextjs/src/app/api/users/route.ts) and upserts the user into the database.
- SQL migration runner: execute `.sql` files in order and track them in `schema_migrations`.
- Migration generator: create sequential files like `00001_init.sql`, `00002_add_profiles.sql`.

Commands:

```bash
pnpm --filter nextjs db:create-migration add_profiles
pnpm --filter nextjs db:migrate
pnpm --filter nextjs test
```

Migration files live in:

- [`packages/nextjs/db/migrations`](./packages/nextjs/db/migrations)

The initial migration has already been created here:

- [`packages/nextjs/db/migrations/00001_init.sql`](./packages/nextjs/db/migrations/00001_init.sql)

Current database behavior:

- The migration upgrades the existing `users` table to support wallet fields.
- Wallet connect will create or update a user by `wallet_address`.
- The API stores `wallet_address`, `wallet_name`, `chain`, and `last_seen_at`.

### Contract (Move) deployment

The `packages/contract` workspace is the Move package. Deploying it will also write the deployed package id into `packages/nextjs/.env.local` so the Next.js app can call it.

#### Localnet (recommended for development)

1) Start local network (+ explorer):

```bash
pnpm localnet:start
```

2) Deploy Move package to localnet:

```bash
pnpm localnet:deploy
```

After a successful deploy, `packages/nextjs/.env.local` will be created/updated with:

- `NEXT_PUBLIC_LOCALNET_CONTRACT_PACKAGE_ID=...`

#### Devnet / Testnet / Mainnet

1) Ensure the corresponding network setup is ready:

```bash
pnpm devnet:start
# or: pnpm testnet:start
# or: pnpm mainnet:start
```

2) Deploy:

```bash
pnpm devnet:deploy
# or: pnpm testnet:deploy
# or: pnpm mainnet:deploy
```

This will create/update `packages/nextjs/.env.local` with:

- `NEXT_PUBLIC_DEVNET_CONTRACT_PACKAGE_ID=...`
- `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=...`
- `NEXT_PUBLIC_MAINNET_CONTRACT_PACKAGE_ID=...`

Notes:

- Mainnet has no faucet; you need a funded address.
- Useful helpers: `pnpm devnet:address` / `pnpm testnet:address` / `pnpm mainnet:address` and `pnpm devnet:links` / `pnpm testnet:links` / `pnpm mainnet:links`.
- If you run into dependency verification issues, there are `*:deploy:no-dependency-check` scripts (use with care).
- If you deploy from another machine/CI (e.g. Vercel), set the same `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` env vars in that environment as well (Vercel Project Settings -> Environment Variables, or `vercel env add ...`).
