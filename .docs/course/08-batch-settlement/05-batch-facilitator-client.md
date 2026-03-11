# Using BatchFacilitatorClient

If you're not using Express, or need custom logic like dynamic pricing, use the `BatchFacilitatorClient` directly instead of the middleware.

## Direct Usage

```typescript
import { BatchFacilitatorClient } from "@circle-fin/x402-batching/server";

const facilitator = new BatchFacilitatorClient();

async function handleRequest(req: any, res: any) {
  const signature = req.headers["payment-signature"];

  if (!signature) {
    return res.status(402).json({
      x402Version: 2,
      accepts: [/* payment requirements */],
    });
  }

  const payload = JSON.parse(Buffer.from(signature, "base64").toString());
  const requirements = { /* your payment requirements */ };

  const settlement = await facilitator.settle(payload, requirements);
  if (!settlement.success) {
    return res.status(402).json({ error: settlement.errorReason });
  }

  res.json({ data: "Your paid content", paid_by: settlement.payer });
}
```

## Key Methods

| Method | Description |
|--------|-------------|
| `verify(payload, requirements)` | Verify a payment without committing |
| `settle(payload, requirements)` | Verify and commit in one step (recommended) |
| `getSupported()` | Fetch supported networks and contract addresses |

## When to Use This

- **Custom frameworks** (Fastify, Hono, Koa, raw HTTP)
- **Dynamic pricing** — calculate the price per request based on query parameters
- **Pre-verification** — verify before settling (use `verify()` then `settle()`)
- **Hybrid flows** — combine Gateway batching with standard on-chain payments

## Next Step

Learn about cross-chain capabilities.
