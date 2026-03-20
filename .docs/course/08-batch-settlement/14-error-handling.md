# Error Handling

Production nanopayment systems encounter failures — insufficient balances, network timeouts, signature issues, and more. Proper error handling ensures your application degrades gracefully and provides actionable feedback.

## Seller-Side Error Handling

The middleware returns appropriate HTTP errors when payments fail:

| Scenario | HTTP Status | Buyer action |
|----------|-------------|--------------|
| No payment header | 402 | Client should sign and pay |
| Invalid signature | 402 | Client should re-sign |
| Insufficient balance | 402 | Client should deposit more |
| Expired authorization | 402 | Client should generate a new signature |
| Server error | 503 | Retry after delay |

### Handling Errors in Custom Routes

When using the `BatchFacilitatorClient`, wrap settlement calls in try/catch:

```typescript
import { BatchFacilitatorClient } from "@circle-fin/x402-batching/server";

const facilitator = new BatchFacilitatorClient();

async function handlePaidRequest(req: any, res: any) {
  const signature = req.headers["payment-signature"];

  if (!signature) {
    return res.status(402).json({ error: "Payment required" });
  }

  try {
    const payload = JSON.parse(Buffer.from(signature, "base64").toString());
    const settlement = await facilitator.settle(payload, requirements);

    if (!settlement.success) {
      return res.status(402).json({
        error: settlement.errorReason,
        message: getHumanMessage(settlement.errorReason),
      });
    }

    res.json({ data: "paid content" });
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      return res.status(503).json({
        error: "gateway_unavailable",
        message: "Payment service temporarily unavailable. Please retry.",
      });
    }
    return res.status(500).json({ error: "internal_error" });
  }
}

function getHumanMessage(errorReason: string): string {
  const messages: Record<string, string> = {
    insufficient_balance: "Your Gateway balance is too low. Please deposit more USDC.",
    invalid_signature: "Payment signature is invalid. Please try again.",
    nonce_already_used: "This payment was already processed.",
    amount_mismatch: "Payment amount doesn't match the required price.",
    authorization_validity_too_short: "Payment authorization expires too soon. Please generate a new one.",
  };
  return messages[errorReason] || "Payment failed. Please try again.";
}
```

## Buyer-Side Error Handling

### Handling Insufficient Balance

```typescript
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});

async function payWithBalanceCheck(url: string) {
  const balances = await client.getBalances();

  if (balances.gateway.available === 0n) {
    console.error("No Gateway balance. Depositing 1 USDC...");
    await client.deposit("1");
  }

  try {
    const { data, status } = await client.pay(url);
    return data;
  } catch (error) {
    if (error.message?.includes("insufficient_balance")) {
      console.error("Balance too low for this payment. Depositing more...");
      await client.deposit("1");
      const { data } = await client.pay(url);
      return data;
    }
    throw error;
  }
}
```

### Handling Network Timeouts

```typescript
async function payWithRetry(url: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data } = await client.pay(url);
      return data;
    } catch (error) {
      const isRetryable =
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET" ||
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

### Handling Deposit Failures

```typescript
async function safeDeposit(amount: string) {
  try {
    const deposit = await client.deposit(amount);
    console.log(`Deposited ${deposit.formattedAmount} USDC`);
    return deposit;
  } catch (error) {
    if (error.message?.includes("insufficient funds")) {
      console.error(
        "Not enough USDC in wallet for deposit + gas. " +
        "Request tokens from faucet.circle.com"
      );
    } else if (error.message?.includes("user rejected")) {
      console.error("Transaction was rejected by the signer.");
    } else {
      console.error("Deposit failed:", error.message);
    }
    throw error;
  }
}
```

## Next Step

Test the full settlement flow to verify everything works end-to-end.
