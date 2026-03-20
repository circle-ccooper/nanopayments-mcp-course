# Creating the Seller Server

Create `seller/server.ts` — an Express server with Circle Gateway payment middleware.

## The Server

```typescript
import express from "express";
import { createGatewayMiddleware } from "@circle-fin/x402-batching/server";

const app = express();

const gateway = createGatewayMiddleware({
  sellerAddress: process.env.MERCHANT_WALLET_ADDRESS as string,
});
```

That's all the setup needed. The `createGatewayMiddleware` function returns a middleware object with a `require()` method for protecting routes.

## Configuration

| Parameter | Description |
|-----------|-------------|
| `sellerAddress` | Your wallet address for receiving payments |
| `networks` | *(optional)* Restrict to specific networks (defaults to all supported) |
| `facilitatorUrl` | *(optional)* Custom facilitator URL |
| `description` | *(optional)* Resource description in 402 responses |

By default, the middleware accepts payments from **any** Gateway-supported blockchain. A buyer who deposited on Base Sepolia can pay a seller on Arc Testnet.

## Next Step

Protect your API routes with payment requirements.
