# How Batched Settlement Works

Circle Gateway enables nanopayments by batching many individual payment authorizations into a single on-chain transaction. Instead of settling each payment separately, Gateway collects signed authorizations off-chain, computes net balance changes, and applies them in bulk.

## The Economics of Batching

| Approach | Gas cost per payment | Viable minimum payment |
|----------|---------------------|----------------------|
| Individual settlement | Full gas per transaction | ~$0.01+ |
| Batched settlement | Gas / number of payments | $0.000001 |

By settling net positions rather than individual transfers, Gateway reduces both the number of on-chain transactions and total gas consumed.

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

## Next Step

See the contract addresses and supported networks.
