# Understanding the Payment Flow

Before writing the buyer code, let's understand exactly what happens during a nanopayment — from the buyer's perspective and under the hood.

## What the Buyer Sees

From the buyer's perspective, paying for a resource is a single function call:

```typescript
const { data } = await client.pay("http://localhost:3000/weather");
```

That one line handles an entire multi-step negotiation. Let's break down what happens inside.

## What Happens Under the Hood

### Step 1: Initial Request

The client sends a standard HTTP request to the seller's URL. No special headers — just a normal `GET` request.

### Step 2: 402 Response

The seller's middleware sees no `PAYMENT-SIGNATURE` header and returns `402 Payment Required`. The response body contains an `accepts` array describing what payment the seller expects:

```json
{
  "x402Version": 2,
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:5042002",
    "amount": "1000",
    "payTo": "0x..."
  }]
}
```

### Step 3: Off-Chain Signing

The client reads the `accepts` array and signs an **EIP-3009 `TransferWithAuthorization`** message. This is a cryptographic signature — not an on-chain transaction. It authorizes a specific amount to a specific recipient, with a unique nonce and validity window.

Key properties of this signature:

- **Zero gas** — it's an off-chain operation
- **Non-replayable** — unique nonce prevents double-use
- **Scoped** — authorizes exactly the requested amount to exactly the requested address
- **Time-bounded** — includes `validAfter` and `validBefore` timestamps

### Step 4: Retry with Payment

The client retries the original request, this time with a `PAYMENT-SIGNATURE` header containing the base64-encoded authorization.

### Step 5: Verification and Settlement

The seller's middleware extracts the signature, sends it to Gateway for verification and settlement, and if successful, calls `next()` to run the route handler.

### Step 6: Response

The buyer receives the resource data — weather info, premium content, or whatever the API serves.

## Why EIP-3009?

EIP-3009 (`TransferWithAuthorization`) is an Ethereum standard that enables token transfers authorized by a signature rather than an on-chain `approve` + `transferFrom` flow. It's ideal for nanopayments because:

- The buyer never submits a transaction — Gateway does
- Each authorization is for a specific amount and recipient
- Built-in nonce and validity window prevent abuse
- Widely supported by USDC on all major chains

## Next Step

Write the buyer script that pays for x402-protected resources.
