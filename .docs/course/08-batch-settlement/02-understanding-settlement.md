# Understanding Batched Settlement

Before diving into the technical details, let's understand *why* batched settlement is the foundation of the nanopayment system.

## The Core Problem

Every on-chain transaction costs gas. On Ethereum mainnet, a simple ERC-20 transfer can cost $0.50–$5.00 depending on congestion. Even on low-cost L2s, each transaction has a base cost. If you're charging $0.001 per API call, settling each payment individually would cost more in gas than the payment itself.

## How Batching Solves This

Instead of settling each payment on-chain, Gateway collects signed authorizations off-chain and settles them in bulk:

| Approach | Gas cost per payment | Viable minimum payment |
|----------|---------------------|----------------------|
| Individual settlement | Full gas per transaction | ~$0.01+ |
| Batched settlement | Gas / number of payments | $0.000001 |

A single batch transaction can settle thousands of individual payments. The gas cost is amortized across all payments in the batch.

## The Mental Model

Think of Gateway like a tab at a restaurant:

1. **Open the tab** — Deposit USDC into Gateway (one-time on-chain transaction)
2. **Order items** — Each API call is a signed authorization (off-chain, zero gas)
3. **Close the tab** — Gateway settles all your authorizations in one batch (one on-chain transaction)

The difference: instead of one person's tab, Gateway batches thousands of buyers and sellers into a single settlement.

## Payment Lifecycle

```
1. Buyer deposits USDC into Gateway Wallet   (one-time on-chain tx)
2. Buyer requests resource from seller API
3. Seller responds: 402 Payment Required
4. Buyer signs EIP-3009 authorization         (off-chain, zero gas)
5. Buyer retries request with signature
6. Seller submits authorization to Gateway
7. Seller serves resource immediately
8. Gateway collects authorizations
9. Gateway settles batch on-chain             (single tx for thousands of payments)
10. Seller's Gateway balance is credited
```

## Balance States

| State | Description |
|-------|-------------|
| `available` | Spendable balance — set after deposit or after receiving a settled batch payment |

### Example: Alice sends 10 USDC to Bob

| Event | Alice (sender) | Bob (receiver) |
|-------|----------------|----------------|
| Initial state | available: 100 | available: 0 |
| Authorization submitted | available: 90 | available: 0 |
| Batch settled on-chain | available: 90 | available: 10 |

When Alice submits her authorization, Gateway locks her funds internally. Once the batch settles on-chain, Bob's available balance increases.

## Why This Matters for Developers

As a developer, batched settlement means:

- **Buyers** make a single deposit and then pay for thousands of requests at zero gas cost
- **Sellers** receive payments immediately (Gateway credits them before the batch settles)
- **Economics** work at any price point — even $0.000001 per request is viable
- **UX** is seamless — the buyer's client library handles everything automatically

## Next Step

Learn how Gateway verifies each payment before including it in a batch.
