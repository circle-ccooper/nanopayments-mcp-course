# Paying for Resources

With USDC in Gateway, use `client.pay(url)` to pay for x402-protected resources. The client handles the full `402` negotiation flow automatically.

## Payment Script — `buyer/pay.ts`

```typescript
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});

const url = process.argv[2] || "http://localhost:3000/weather";

console.log(`Buyer address: ${client.address}`);
console.log(`Paying for: ${url}`);
console.log("");

const support = await client.supports(url);
if (!support.supported) {
  console.error("This URL does not support Gateway payments.");
  process.exit(1);
}

const { data, status, formattedAmount } = await client.pay(url);

console.log(`Status: ${status}`);
console.log(`Amount paid: ${formattedAmount} USDC`);
console.log("Response:", JSON.stringify(data, null, 2));
```

Run it (with the seller server running):

```bash
tsx --env-file=.env buyer/pay.ts http://localhost:3000/weather
```

Expected output:

```
Buyer address: 0x...
Paying for: http://localhost:3000/weather

Status: 200
Amount paid: 0.001000 USDC
Response: {
  "location": "San Francisco, CA",
  "temperature": "68°F",
  "conditions": "Partly cloudy",
  "paid_by": "0x..."
}
```

## What `client.pay()` Does Automatically

1. Sends a `GET` request to the URL
2. Receives the `402 Payment Required` response with payment details
3. Signs an EIP-3009 `TransferWithAuthorization` off-chain (zero gas)
4. Retries the request with the `PAYMENT-SIGNATURE` header
5. Returns the response data, status, and amount paid

## Custom Requests

`client.pay()` accepts standard `fetch` options for `POST` requests, custom headers, etc.:

```typescript
const { data } = await client.pay(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "weather in NYC" }),
});
```

## Next Step

Check your balances and learn about withdrawals.
