# What Are Nanopayments?

**Nanopayments** are sub-cent payments that enable pay-per-use pricing for digital resources. Instead of subscriptions or upfront charges, you charge fractions of a cent for each API call, compute unit, or piece of data consumed.

## The Problem

Traditional payment systems don't work for high-frequency, low-value transactions:

| Approach | Problem |
|----------|---------|
| **Credit cards** | High fixed fees (~$0.30 per transaction) make sub-dollar payments uneconomical |
| **On-chain transfers** | Each transaction costs gas, making sub-cent payments impractical |
| **Subscriptions** | Overpay for light usage, underpay for heavy usage |

## The Solution: Deposit → Pay → Settle

Circle Nanopayments solve this with a three-step flow:

1. **Deposit** — The buyer deposits USDC into Circle Gateway (one-time on-chain transaction)
2. **Pay** — Each resource request is paid with a signed authorization (off-chain, zero gas)
3. **Settle** — Gateway batches thousands of authorizations into a single on-chain transaction

This makes sub-cent payments viable. A buyer can make 10,000 payments at $0.001 each, and Gateway settles them all in one transaction.

## Real-World Use Cases

- **AI Agent Commerce** — Agents pay for compute, data, and services autonomously
- **Pay-Per-Use APIs** — Charge $0.001 per request instead of $99/month
- **Data Marketplaces** — Buy individual data points at sub-cent prices
- **Content Monetization** — Pay-per-article or pay-per-second streaming

## The Tech Stack

| Component | Purpose |
|-----------|---------|
| **USDC** | Stablecoin used for payments (1 USDC = $1) |
| **Circle Gateway** | Infrastructure that pools deposits and settles batches |
| **x402 Protocol** | HTTP standard for payment negotiation |
| **`@circle-fin/x402-batching`** | SDK for building sellers and buyers |
| **viem** | Wallet generation and on-chain interactions |

## Next Step

Learn how USDC works and why it's ideal for nanopayments.
