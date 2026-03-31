# EVE Medals
[![Discord chat](https://img.shields.io/discord/1237259509366521866.svg?logo=discord&style=flat-square)](https://discord.com/invite/HuDPpXz4Hx)

[English](./README.md) | [简体中文](./README.zh-CN.md) | [Íslenska](./README.is-IS.md)

![EVE Medals](./docs/assets/EveMedals.png)

[Hlaut 1. sæti í Randomness-flokknum í Sui Overflow 2024 hakkaþoninu](https://blog.sui.io/2024-sui-overflow-hackathon-winners/)

`EVE Medals` er afreksvara fyrir `EVE Frontier` á Sui. Hún skannar virkni leikmanna, breytir staðfestanlegri framvindu í stöðu fyrir medalíukröfu, gefur út veskisbundnar medalíur og birtir opinber Warrior-snið til að deila sönnun.

Þessi geymsla er `pnpm` monorepo fyrir lifandi vöruflæðið `Frontier Chronicle -> Medal Claim -> Warrior Share`. Enn eru til nokkur heiti og möppur frá starter-tímabilinu, en Chronicle, medalíur, veskissamstilling og Warrior-síður eru raunveruleg heimild um núverandi vöruhegðun.

## Vöruflæði

1. Leikmaður tengir Sui-veski
2. Forritið byggir Chronicle-snapshot úr skráðri `EVE Frontier` virkni og keðjustöðu medalía
3. Medalíur sem ná skilyrðum verða kröfuhæfar
4. BFF gefur út undirritað claim ticket og Move-samningurinn mintar veskisbundna medalíu
5. Kröfð medalía birtist á Warrior-síðum og deilingarflötum

## Uppbygging geymslu

- `packages/nextjs`: Next.js 16 forrit, Chronicle mælaborð, API leiðir, veskissamstilling, Warrior-síður og deilingarflötur
- `packages/contract`: Sui Move pakki í `move/medals` ásamt hjálparskriftum fyrir dreifingu á mismunandi net
- `docs`: vöru-, arkitektúr-, kynningar- og dómnefndargögn

Lykilslóðir í viðskiptalógík:

- `packages/nextjs/src/app/chronicle`
- `packages/nextjs/src/app/api/chronicle/route.ts`
- `packages/nextjs/src/app/api/users/route.ts`
- `packages/nextjs/src/app/server/chronicle`
- `packages/nextjs/src/app/server/db`
- `packages/contract/move/medals/sources/medals.move`

## Það sem virkar nú þegar

- Chronicle virkni-skönnun studd af Eve Eyes
- skýranleg viðmið medalía og staða fyrir kröfu
- undirrituð claim ticket með TTL-prófun
- mintun veskisbundinna medalía á Sui
- samstilling frá veski í gagnagrunn þegar `DATABASE_URL` er stillt
- opinberar Warrior-síður og rakning fyrir deilingu

## Forsendur

- [Node.js 20+](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Suibase](https://suibase.io/how-to/install.html)

## Fljótleg byrjun

### 1. Setja upp háðir

```bash
pnpm install
```

### 2. Stilla umhverfisbreytur

Búðu til `packages/nextjs/.env.local` eftir þörfum:

```bash
DATABASE_URL=postgres://...
EVE_EYES_API_KEY=...
CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY=suiprivkey...
CHRONICLE_CLAIM_TICKET_TTL_MS=600000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=0x...
```

Ef þú dreifir Move-pakkanum með vinnusvæðisskriftunum hér að neðan verður samsvarandi `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` sjálfkrafa skrifað í `packages/nextjs/.env.local`.

### 3. Ræsa forritið

```bash
pnpm dev
```

Opnaðu [http://localhost:3000](http://localhost:3000).

Forritið notar sjálfgefið `testnet` fyrir veski og net nema þú veljir annað net sérstaklega.

## Staðbundin þróun með samningi

Ræstu staðbundna Sui innviði:

```bash
pnpm localnet:start
```

Dreifðu medalíupakkanum á localnet:

```bash
pnpm localnet:deploy
```

Síðan:

1. Skiptu veskinu yfir á `localnet`
2. Fylltu veskið með faucet í veskinu eða keyrðu:

```bash
pnpm localnet:faucet 0xYOURADDRESS
```

3. Ræstu forritið með `pnpm dev`

Staðbundinn Explorer er á [http://localhost:9001](http://localhost:9001).

## Hegðun umhverfisbreyta

| Breyta | Hlutverk | Hegðun þegar hún vantar |
| --- | --- | --- |
| `DATABASE_URL` | Virkjar gagnagrunnsaðgang á þjónshlið og veskissamstillingu | Forritið hleðst samt, en `/api/users` skilar `databaseEnabled: false` og samstilling er sleppt |
| `EVE_EYES_API_KEY` | Virkjar dýpri Eve Eyes söguskönnun | Chronicle fellur aftur í preview mode og sér aðeins opinbera gluggann |
| `CHRONICLE_CLAIM_SIGNER_PRIVATE_KEY` | Undirritar claim ticket fyrir mintun medalía | Enn er hægt að skanna og staðfesta medalíur, en claim ticket eru ekki gefin út |
| `CHRONICLE_CLAIM_TICKET_TTL_MS` | Gildistími claim ticket í millisekúndum | Sjálfgefið `600000` |
| `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` | Netbundin package ID fyrir samninga | Enn er hægt að skanna, en kröfur og keðjusamskipti eru óvirk á því neti |
| `NEXT_PUBLIC_SITE_URL` | Grunnslóð fyrir sönnunarsíður og deilingartengla | Fellur aftur í `http://localhost:3000` |

## Algengar skipanir

Keyrðu allar skipanir frá rót geymslunnar nema annað sé tekið fram.

| Skipun | Hvað hún gerir |
| --- | --- |
| `pnpm dev` | Ræsir Next.js forritið í þróunarham |
| `pnpm build` | Byggir Move-pakkann og Next.js forritið |
| `pnpm lint` | Keyrir ESLint fyrir Next.js vinnusvæðið |
| `pnpm test` | Keyrir Move samningspróf |
| `pnpm --filter nextjs test` | Keyrir Next.js samþættingarpróf |
| `pnpm --filter nextjs db:create-migration <name>` | Býr til númeraða SQL migration skrá |
| `pnpm --filter nextjs db:migrate` | Framkvæmir SQL migration |
| `pnpm localnet:start` | Ræsir localnet og staðbundinn explorer |
| `pnpm localnet:deploy` | Birtir Move pakkann á localnet og skrifar package ID í `.env.local` |
| `pnpm devnet:deploy` | Birtir á devnet og uppfærir `.env.local` |
| `pnpm testnet:deploy` | Birtir á testnet og uppfærir `.env.local` |
| `pnpm mainnet:deploy` | Birtir á mainnet og uppfærir `.env.local` |
| `pnpm vercel:prod` | Dreifir forritinu frá rót geymslunnar með Vercel |

Notaðu `*:deploy:no-dependency-check` aðeins þegar þú skilur vandann með dependency verification og velur workaround meðvitað.

## Gagnagrunnur og veskissamstilling

- Veskistenging virkjar `packages/nextjs/src/app/components/WalletUserSync.tsx`
- Biðlarinn samstillir veskisauðkenni við `POST /api/users`
- SQL migration skrár eru í `packages/nextjs/db/migrations`
- Núverandi próf ná yfir migration og samþættingarflæði notendasamstillingar

Núverandi migration skrár:

- `packages/nextjs/db/migrations/00001_init.sql`
- `packages/nextjs/db/migrations/00002_share_events.sql`

## Athugasemdir um net og dreifingu

- Forritið gerir nú ráð fyrir `testnet` þegar ekkert net er tilgreint
- `pnpm localnet:deploy`, `pnpm devnet:deploy`, `pnpm testnet:deploy` og `pnpm mainnet:deploy` birta öll `packages/contract/move/medals`
- Hjálparskriftur fyrir dreifingu skrifa package ID í `packages/nextjs/.env.local`
- Ekki commit-a `packages/nextjs/.env.local` eða nein leyndarmál
- Ef þú dreifir úr CI eða Vercel þarftu að spegla sömu `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` gildi í því umhverfi

Gagnleg hjálparskipanir:

- `pnpm devnet:address`
- `pnpm testnet:address`
- `pnpm mainnet:address`
- `pnpm devnet:links`
- `pnpm testnet:links`
- `pnpm mainnet:links`

## Próf

Samningspróf:

```bash
pnpm test
```

Next.js samþættingarpróf:

```bash
pnpm --filter nextjs test
```

Lint:

```bash
pnpm lint
```

## Skjöl

- [Hackathon one-pager](./docs/eve-medals-hackathon-one-pager.md)
- [Judge guide](./docs/eve-medals-judge-guide.md)
- [Chronicle product architecture](./docs/chronicle-product-architecture.md)
- [1-minute defense](./docs/eve-medals-1min-defense.md)
- [5-minute demo script](./docs/eve-medals-demo-5min-script.md)

## Leyfi

Copyright (c) 2024 Konstantin Komelin and other contributors

Kóðinn er gefinn út undir [MIT](./LICENSE).

SVG grafík sem notuð er fyrir NFT er gefin út undir [CC-BY 4.0](./LICENSE-GRAPHICS).
