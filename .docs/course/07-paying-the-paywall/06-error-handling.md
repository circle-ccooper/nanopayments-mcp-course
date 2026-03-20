# Error Handling

Payments can fail for several reasons — insufficient balance, network issues, or configuration problems. This lesson covers how to handle each failure mode in the buyer code.

## Common Payment Errors

| Error | Cause | Recovery |
|-------|-------|----------|
| `insufficient_balance` | Gateway balance too low | Deposit more USDC |
| `invalid_signature` | Key mismatch or corruption | Verify `.env` keys match |
| Server connection refused | Seller server not running | Start the server |
| 503 Service Unavailable | Gateway temporarily down | Retry with backoff |

## Handling Insufficient Balance

The most common buyer-side error. Wrap your payment in a balance check:

```typescript
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});

async function payOrDeposit(url: string) {
  const balances = await client.getBalances();

  if (balances.gateway.available === 0n) {
    console.log("No Gateway balance. Depositing 1 USDC...");
    await client.deposit("1");
  }

  try {
    const { data, status, formattedAmount } = await client.pay(url);
    console.log(`Paid ${formattedAmount} USDC — Status: ${status}`);
    return data;
  } catch (error) {
    if (error.message?.includes("insufficient_balance")) {
      console.log("Balance ran out mid-payment. Depositing more...");
      await client.deposit("1");
      const { data } = await client.pay(url);
      return data;
    }
    throw error;
  }
}
```

## Handling Network Errors with Retry

```typescript
async function payWithRetry(url: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.pay(url);
    } catch (error) {
      const isRetryable =
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEDOUT" ||
        error.message?.includes("503");

      if (isRetryable && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
}
```

## Handling `supports()` Failures

Always check if a URL supports Gateway payments before attempting to pay:

```typescript
const support = await client.supports(url);
if (!support.supported) {
  console.error(`${url} does not support Gateway payments.`);
  console.error("The server may not have x402 middleware configured.");
  process.exit(1);
}
```

## Diagnosing Signature Errors

If you get `invalid_signature`, the issue is almost always a key mismatch:

1. Run `scripts/verify-wallets.ts` to confirm keys are valid
2. Check that the `CONSUMER_PRIVATE_KEY` in `.env` matches the wallet that deposited into Gateway
3. Ensure you haven't regenerated wallets after depositing — new keys create a new Gateway balance

## Next Step

Review troubleshooting steps for common payment issues.
