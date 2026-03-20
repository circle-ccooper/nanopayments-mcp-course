# Dynamic Pricing

The Express middleware uses a fixed price per route (`gateway.require("$0.001")`). For more flexible pricing — based on query parameters, payload size, or user tier — use the `BatchFacilitatorClient` directly.

## Example: Price by Query Complexity

```typescript
import { BatchFacilitatorClient } from "@circle-fin/x402-batching/server";

const facilitator = new BatchFacilitatorClient();

function calculatePrice(query: string): string {
  const wordCount = query.split(" ").length;
  if (wordCount > 100) return "$0.01";
  if (wordCount > 20) return "$0.005";
  return "$0.001";
}

async function handleSearch(req: any, res: any) {
  const query = req.query.q || "";
  const price = calculatePrice(query);
  const signature = req.headers["payment-signature"];

  if (!signature) {
    return res.status(402).json({
      x402Version: 2,
      accepts: [{
        scheme: "exact",
        maxAmountRequired: price,
      }],
    });
  }

  const payload = JSON.parse(Buffer.from(signature, "base64").toString());
  const settlement = await facilitator.settle(payload, { price });

  if (!settlement.success) {
    return res.status(402).json({ error: settlement.errorReason });
  }

  res.json({ results: `Search results for: ${query}`, paid: price });
}
```

## Pricing Strategies

| Strategy | Implementation | Use Case |
|----------|---------------|----------|
| Fixed per-request | `gateway.require("$0.001")` | Simple APIs with uniform cost |
| Tiered by endpoint | Different `gateway.require()` per route | Multiple resource types |
| Query-based | Calculate price from request parameters | Variable-cost resources |
| Payload-based | Price by request/response size | Data transfer APIs |
| Time-based | Price by compute duration | Long-running operations |

## Combining with Middleware

You can mix approaches — use the Express middleware for fixed-price routes and the `BatchFacilitatorClient` for dynamic routes in the same application:

```typescript
import express from "express";
import { createGatewayMiddleware, BatchFacilitatorClient } from "@circle-fin/x402-batching/server";

const app = express();
const gateway = createGatewayMiddleware({ sellerAddress: "0x..." });
const facilitator = new BatchFacilitatorClient();

app.get("/weather", gateway.require("$0.001"), (req, res) => {
  res.json({ temperature: "68°F" });
});

app.get("/search", async (req, res) => {
  // Dynamic pricing handled with facilitator
});
```

## Next Step

Learn about cross-chain deposit capabilities.
