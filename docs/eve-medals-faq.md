# EVE Medals 官网 FAQ

更新时间：2026-03-31

## 1. What is EVE Medals?

`EVE Medals` is an achievement verification and social identity product for `EVE Frontier`.

It transforms meaningful Frontier activity into verifiable medal states, on-chain honors, Warrior profiles, and shareable cards.

---

## 2. Is this just an NFT project?

No.

The goal is not simply to mint collectibles. The core idea is to turn real player activity into visible, verifiable, and shareable honor.

On-chain medals are one part of the system. The bigger product is the combination of:

- activity indexing
- achievement verification
- on-chain medal ownership
- Warrior identity display
- social sharing

---

## 3. Where does the achievement data come from?

The current product flow combines indexed player activity with on-chain medal ownership.

In practice, this means player activity is first read and structured through the Chronicle flow, then mapped into medal states, and finally reflected through Sui-based honor ownership.

---

## 4. What does the blockchain part do?

Sui is used as the medal ownership and honor layer.

It helps provide:

- medal claiming
- wallet-bound honor state
- on-chain ownership lookup

The product is not purely chain-native from end to end. It intentionally combines indexed activity and on-chain proof.

---

## 5. Can players already claim medals?

The product already supports medal claiming flows in the current architecture.

That said, target-environment contract alignment is still being finalized, so the exact trust level depends on the configured deployment environment.

---

## 6. Are share cards already live?

Yes.

The current codebase already includes:

- Warrior profile share cards
- individual medal share cards
- dynamic social images
- QR-based re-entry points
- share actions for platforms such as X, Telegram, and Discord

---

## 7. Does the QR code go directly to on-chain proof?

Not yet.

The QR flow currently returns users to the product-side verification page rather than jumping directly into an explorer-first chain proof view.

That is enough to support a verifiable product loop today, but stronger explorer-linked verification is still a future upgrade direction.

---

## 8. Is this already a full social growth engine?

Not yet.

The product already has shareable assets and distribution entry points, but full growth attribution is still incomplete.

What exists today:

- share links
- share cards
- QR re-entry
- basic share event tracking

What is still being built:

- referral logic
- campaign attribution
- conversion funnel measurement
- stronger growth analytics

---

## 9. Why does this matter for EVE Frontier players?

Because Frontier rewards meaningful contribution, but contribution is often hard to carry outside the game itself.

`EVE Medals` helps make effort:

- visible
- verifiable
- portable
- socially expressive

That creates a stronger identity layer around what players have actually done.

---

## 10. What is the product today, in one sentence?

Today, `EVE Medals` is best described as:

> a working achievement verification and sharing product for EVE Frontier, evolving toward a stronger identity and growth layer.

---

## 11. What comes next?

The next major steps are:

- tighter trusted-environment contract alignment
- stronger verification exits
- referral and attribution systems
- a more measurable social growth loop

---

## 12. Is this already production complete?

No.

The core product loop is already real and working, but it is still in an active build phase. The current state is best understood as a strong product foundation rather than a fully finished final form.
