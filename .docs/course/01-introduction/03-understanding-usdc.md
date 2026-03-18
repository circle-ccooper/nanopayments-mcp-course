# Understanding USDC for Nanopayments

USDC is the foundation of Circle's nanopayments infrastructure. Understanding its properties helps you design efficient payment flows.

## What Is USDC?

**USDC** is a dollar-pegged stablecoin issued by Circle, backed 100% by highly liquid cash and cash-equivalent assets so that it's always redeemable 1:1 for USD. It's widely used for payments, remittances, and—as in this course—nanopayments.

## Decimal Places

USDC has **6 decimal places**. The smallest unit is 0.000001 USDC (one "micro-USDC"):

| Human Amount | Raw Units |
|--------------|-----------|
| 1 USDC | 1,000,000 |
| 0.001 USDC | 1,000 |
| 0.000001 USDC | 1 |

This granularity makes USDC ideal for nanopayments: you can charge as little as $0.000001 per action.

## Arc Testnet

Arc is Circle's L1 blockchain purpose-built for stablecoin finance. On Arc, **USDC is the native gas token** — there is no separate token like ETH. One token covers both payments and transaction fees.

| Property | Value |
|----------|-------|
| Chain ID | `5042002` |
| Native Token | USDC |
| RPC URL | `https://rpc.testnet.arc.network` |
| Block Explorer | [`https://testnet.arcscan.app`](https://testnet.arcscan.app/) |
| USDC Contract | `0x3600000000000000000000000000000000000000` |

The USDC contract address above provides an optional ERC-20 interface for standard operations like `approve`, `transferFrom`, and `balanceOf`. ERC-20 calls directly affect the native USDC balance.

> **Important:** The native gas balance uses 18 decimals of precision, while the ERC-20 interface uses 6 decimals. Always use the ERC-20 `decimals()` function to interpret balances accurately. For applications integrating USDC on Arc, rely on the ERC-20 interface for reading balances and sending transfers.

## Working with Amounts in Code

When using viem's `parseUnits`:

```typescript
import { parseUnits } from "viem";

// 10 USDC
const amount = parseUnits("10", 6);

// 0.001 USDC (1 millicent per API call)
const nanopaymentAmount = parseUnits("0.001", 6);
```

## Nanopayment Economics

Typical flow:

1. **Charge** — $0.001 per API call (1,000 raw units)
2. **Accumulate** — User makes 100 calls → $0.10 owed
3. **Settle** — Batch settle on-chain when threshold is reached

By batching, you minimize gas costs while still enabling pay-per-use pricing.

## Next Step

Set up your development environment and install the project dependencies.
