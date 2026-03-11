# Server SDK: `@circle-fin/x402-batching/server`

The server SDK provides everything a seller needs to accept nanopayments. It handles the full x402 negotiation, signature verification, and settlement automatically.

## `createGatewayMiddleware`

The primary entry point for Express-based sellers. Creates a middleware object that can protect any route with a price:

```typescript
import { createGatewayMiddleware } from "@circle-fin/x402-batching/server";

const gateway = createGatewayMiddleware({
  sellerAddress: "0x...",   // your wallet address for receiving payments
});
```

### Configuration Options

| Parameter | Required | Description |
|-----------|----------|-------------|
| `sellerAddress` | Yes | Wallet address where payments are credited |
| `networks` | No | Restrict to specific networks (defaults to all) |
| `facilitatorUrl` | No | Custom facilitator URL |
| `description` | No | Resource description in 402 responses |

## `gateway.require(price)`

Wraps any Express route with a payment requirement. Unpaid requests get `402 Payment Required`; paid requests pass through with `req.payment` attached:

```typescript
app.get("/weather", gateway.require("$0.001"), (req, res) => {
  const { payer, amount, network } = req.payment;
  res.json({ data: "weather data", paid_by: payer });
});
```

### `req.payment` Fields

| Field | Type | Description |
|-------|------|-------------|
| `payer` | `string` | Buyer's wallet address |
| `amount` | `string` | Amount paid in USDC |
| `network` | `string` | Blockchain network the payment came from |
| `transaction` | `string` | Settlement transaction ID |
| `verified` | `boolean` | Whether the payment was verified |

## `BatchFacilitatorClient`

For non-Express servers or custom logic (dynamic pricing, pre-verification), use the lower-level client directly:

```typescript
import { BatchFacilitatorClient } from "@circle-fin/x402-batching/server";

const facilitator = new BatchFacilitatorClient();
```

| Method | Description |
|--------|-------------|
| `verify(payload, requirements)` | Verify a payment without committing |
| `settle(payload, requirements)` | Verify and commit in one step |
| `getSupported()` | Fetch supported networks and contracts |

## Next Step

Explore the client SDK that buyers use to deposit and pay.
