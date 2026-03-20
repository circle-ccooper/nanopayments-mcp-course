# Pricing Strategies

Choosing the right pricing model for your nanopayment API affects both revenue and user adoption. The flexibility of per-request pricing enables models that weren't possible with subscriptions or credit cards.

## Common Pricing Models

### Fixed Per-Request

The simplest model — every request costs the same:

```typescript
app.get("/weather", gateway.require("$0.001"), handler);
app.get("/premium-data", gateway.require("$0.01"), handler);
```

**Best for:** Uniform-cost resources where every request has roughly the same value and compute cost.

### Tiered by Resource

Different endpoints have different prices based on the value or cost of the underlying resource:

| Endpoint | Price | Rationale |
|----------|-------|-----------|
| `/weather` | $0.001 | Cheap data, cached |
| `/ai-summary` | $0.01 | Requires LLM inference |
| `/premium-report` | $0.10 | Expensive computation |

### Volume Discounts

Track cumulative spending and reduce per-request price for high-volume buyers:

```typescript
async function getPrice(payer: string): Promise<string> {
  const totalSpent = await getPayerTotal(payer);
  if (totalSpent > 100) return "$0.0005";
  if (totalSpent > 10) return "$0.0008";
  return "$0.001";
}
```

This requires using the `BatchFacilitatorClient` for dynamic pricing.

### Time-Based

Charge based on compute duration rather than a flat fee. Useful for APIs that perform variable-length operations:

```typescript
const startTime = Date.now();
const result = await expensiveComputation(query);
const duration = (Date.now() - startTime) / 1000;
const price = `$${(duration * 0.001).toFixed(6)}`;
```

## Pricing Guidelines

| Factor | Recommendation |
|--------|---------------|
| **Cost basis** | Price above your marginal cost (compute, API calls, bandwidth) |
| **Market rate** | Check what similar APIs charge — nanopayments should be cheaper than subscriptions for light users |
| **Minimum viable** | Even $0.000001 works technically, but consider the value you're providing |
| **Transparency** | Include pricing in your API documentation and 402 responses |

## Payment Validity

Payment signatures must have at least **3 days of validity**. The `validBefore` timestamp in the buyer's EIP-3009 authorization must be at least 3 days in the future, or Gateway will reject it. The SDK handles this automatically — you don't need to set it manually.

## Next Step

Learn about error handling patterns for production nanopayment systems.
