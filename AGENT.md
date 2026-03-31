# Repository Instructions for AI Agents

`AGENTS.md` is the standard filename in the OpenAI/Codex docs. If this repo keeps using `AGENT.md`, make sure your agent runtime is configured to read it as a fallback filename.

## Goal

This repository is a `pnpm` monorepo for a Sui dApp:

- `packages/nextjs`: Next.js 16 app, App Router, static export build
- `packages/contract`: Move package plus Suibase-based network and deployment helpers

When making changes, keep edits scoped to the package that owns the behavior.

## Working Rules

- Start from the repo root unless a task is clearly package-local.
- Prefer minimal diffs; do not refactor unrelated code while solving a focused task.
- Check for existing uncommitted changes before editing and avoid overwriting user work.
- Prefer `rg` for code search and `pnpm` scripts for build, lint, test, and deploy workflows.
- Do not edit generated or environment-specific files unless the task explicitly requires it:
  - `packages/nextjs/next-env.d.ts`
  - `packages/nextjs/dist/**`
  - `packages/nextjs/.next/**`
  - `packages/nextjs/.env.local`

## Common Commands

Run these from the repository root:

- `pnpm dev`: start the Next.js dev server
- `pnpm build`: build contract and Next.js
- `pnpm lint`: lint the Next.js app
- `pnpm test`: run contract Move tests
- `pnpm nextjs:build`
- `pnpm nextjs:lint`
- `pnpm contract:build`
- `pnpm contract:test`

Network and deployment helpers:

- `pnpm localnet:start`
- `pnpm localnet:deploy`
- `pnpm devnet:deploy`
- `pnpm testnet:deploy`
- `pnpm mainnet:deploy`

These depend on Suibase and local Sui tooling. Do not assume they are available unless verified in the environment.

## Next.js Notes

- Next.js source lives under `packages/nextjs/src/app`.
- Use the existing path alias: `~~/* -> packages/nextjs/src/app/*`.
- The Next.js app is built as a static export:
  - `packages/nextjs/next.config.ts` sets `output: "export"`
  - build output goes to `packages/nextjs/dist`
- Follow the existing project structure:
  - shared UI: `components/`
  - app-wide config: `config/`
  - providers: `providers/`
  - Sui dApp logic: `dapp/`
- Prefer existing patterns and dependencies already used in the app before introducing new ones.

Next.js verification after UI or TypeScript changes:

- `pnpm nextjs:lint`
- `pnpm nextjs:build`

## Contract Notes

- The Move package is in `packages/contract/move/medals`.
- Build and test through the provided scripts instead of calling Move tooling manually unless necessary.
- Deployment scripts write contract package IDs into `packages/nextjs/.env.local`.
- Do not hardcode deployed package IDs in Next.js code; read them from the expected env vars.

Contract verification after Move or deployment-script changes:

- `pnpm contract:build`
- `pnpm contract:test`

## Task Routing

- For wallet, network, or transaction UI issues, inspect both:
  - `packages/nextjs/src/app/dapp/**`
  - `packages/nextjs/src/app/config/**`
- For contract behavior changes, update both:
  - `packages/contract/move/medals/**`
  - any Next.js code that depends on the contract interface
- For deployment or environment-variable issues, inspect:
  - `packages/contract/scripts/copy-package-id.js`
  - `packages/nextjs/.env.local` usage sites
  - `vercel.json` when the issue is specific to production deployment

## Response Expectations

- State assumptions when environment-dependent commands cannot be verified locally.
- Report what was changed, what was verified, and what could not be verified.
- If a task is ambiguous, inspect the relevant package first and choose the smallest reasonable implementation.
