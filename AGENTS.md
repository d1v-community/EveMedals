# Repository Guidelines

## Project Identity

This repository is a `pnpm` workspace for an EVE Frontier achievements product built on Sui. It started from `sui-dapp-starter`, but it should not be treated as a generic starter/template repository when making product decisions.

Current business focus:

- Chronicle-style activity scanning for EVE Frontier players
- Medals / soulbound achievement claiming on Sui
- Wallet-based user sync into a SQL database
- Eve Eyes-backed activity ingestion with preview-mode fallback

Important: starter-era names still exist in root metadata, scripts, and parts of the README. Treat the current application code, environment contracts, and Chronicle/medals flows as the source of truth.

## Project Structure & Source Of Truth

This repository has two main packages:

- `packages/nextjs`: Next.js 16 App Router application
- `packages/contract`: Sui Move package plus deployment helpers

Business-critical Next.js/BFF areas:

- `packages/nextjs/src/app/chronicle`: Chronicle UI, medals presentation, scan and claim flows
- `packages/nextjs/src/app/api/chronicle`: server route that builds Chronicle snapshots and claim readiness
- `packages/nextjs/src/app/api/users`: wallet-to-database sync endpoint
- `packages/nextjs/src/app/server/chronicle`: Eve Eyes integration and Chronicle-side server logic
- `packages/nextjs/src/app/server/db`: database client and migration runner
- `packages/nextjs/src/app/components/WalletUserSync.tsx`: wallet connection sync behavior

Contract areas:

- `packages/contract/move/medals/sources/medals.move`: current on-chain medals logic
- `packages/contract/move/medals/tests`: Move tests for medals behavior
- `packages/contract/scripts/copy-package-id.js`: writes deployed package IDs into the Next.js env file

Supporting paths:

- `packages/nextjs/tests`: Node-based integration tests
- `packages/nextjs/db/migrations`: SQL migrations
- `packages/nextjs/public`: static assets

Legacy/template note:

- `packages/nextjs/src/app/dapp` still contains starter-era greeting flow code
- the Move package directory is `move/medals`

Do not assume those names reflect the current product direction. Unless a task explicitly targets the starter demo, prioritize Chronicle, medals, DB sync, and wallet-network behavior.

## Build, Test, And Development Commands

Run commands from the repository root unless a package-specific command is required.

- `pnpm dev`: start the Next.js development server
- `pnpm build`: build the Move package and the Next.js app
- `pnpm lint`: run Next.js ESLint checks
- `pnpm test`: run contract Move tests
- `pnpm --filter nextjs test`: run Next.js integration tests with `node --test`
- `pnpm --filter nextjs db:create-migration <name>`: create a numbered SQL migration
- `pnpm --filter nextjs db:migrate`: apply SQL migrations
- `pnpm localnet:start`: start Suibase localnet and the local explorer
- `pnpm localnet:deploy`: publish the Move package to localnet and update Next.js env state
- `pnpm devnet:deploy`, `pnpm testnet:deploy`, `pnpm mainnet:deploy`: publish to shared networks and update Next.js env state
- `pnpm vercel:prod`: deploy the Next.js app from the repo root via Vercel

Use `*:deploy:no-dependency-check` scripts only when dependency verification issues are understood and the task explicitly calls for that workaround.

## Environment & Runtime Constraints

Key environment variables:

- `DATABASE_URL`: enables server-side database access and wallet user sync
- `EVE_EYES_API_KEY`: enables deeper Eve Eyes history scanning
- `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY`: server-side signer secret used to issue claim tickets
- `CHRONICLE_CLAIM_TICKET_TTL_MS`: claim ticket TTL in milliseconds
- `NEXT_PUBLIC_LOCALNET_CONTRACT_PACKAGE_ID`
- `NEXT_PUBLIC_DEVNET_CONTRACT_PACKAGE_ID`
- `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID`
- `NEXT_PUBLIC_MAINNET_CONTRACT_PACKAGE_ID`

Behavior when configuration is missing:

- without `DATABASE_URL`, the Next.js app still loads, but wallet login does not sync users to the database and DB-backed tests should skip cleanly
- without `EVE_EYES_API_KEY`, Chronicle scanning runs in preview mode and only sees the public Eve Eyes page window, so deeper history can be partial
- without `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY`, unlocked medals can still be verified in the UI, but claim tickets will not be issued
- without a matching `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID`, the app can still load and scan progress, but claim/on-chain interactions for that network are disabled

Network assumption:

- the current default wallet/network behavior is `testnet`
- if a task does not specify a network, assume `testnet` first and verify whether localnet/devnet/mainnet behavior is also affected

## Implementation Guidance For Agents

- Inspect the existing Chronicle flow before designing new abstractions. The usual path is Chronicle UI -> `/api/chronicle` -> server Chronicle/Eve Eyes logic -> network/package ID resolution -> Move medals contract.
- Keep business logic out of presentation components when possible. Database access belongs in server modules and route handlers, not in UI components.
- Prefer extending existing Chronicle, medals, migration, and wallet-sync modules over creating parallel implementations.
- Do not treat root package metadata, starter init scripts, or the first template-oriented sections of `README.md` as the current product spec.
- When a task touches on-chain behavior, verify both Next.js network config and Move contract expectations before changing either side.
- When a task touches persistence, check both the migration files and the server repository code before editing API handlers.

## Coding Style & Naming Conventions

Frontend code is TypeScript-first and follows the existing style:

- 2-space indentation
- single quotes
- no semicolons
- `PascalCase` for React components
- `useSomething` for hooks

Use the existing alias `~~/*` for imports from `packages/nextjs/src/app/*`.

Linting is handled by ESLint 9 with `@typescript-eslint` and `react-hooks`. Formatting uses Prettier with `prettier-plugin-tailwindcss`.

Prefer descriptive module names tied to the business domain. Avoid adding new generic dumping-ground files such as `utils.ts`, `helpers.ts`, or `misc.ts` unless the surrounding code already follows that pattern and the addition is narrowly scoped.

## Testing Guidelines

- Keep Next.js tests in `packages/nextjs/tests` and name them `*.test.mjs`
- keep Move tests under `packages/contract/move/medals/tests`
- add or update tests for behavior changes in contract logic, Chronicle API behavior, database migrations, or wallet sync flows
- if a test depends on `DATABASE_URL`, it should skip cleanly when that variable is not configured

For network-sensitive changes, validate both the configured-package-ID path and the missing-package-ID path when practical.

## Security, Config, And Collaboration

- Do not commit secrets or generated local environment files such as `packages/nextjs/.env.local`
- deployment helpers may create or update `packages/nextjs/.env.local` with deployed package IDs
- prefer environment variables over hardcoded network-specific package IDs

Commit subjects should stay short, imperative, and searchable, preferably with prefixes such as `feat:`, `fix:`, or `docs:`.

Pull requests should include:

- a concise summary
- affected package(s)
- verification commands that were run
- screenshots for UI changes
- explicit notes for migration, environment-variable, network, or deployment impact
