# Monitoring and Alerting

A production nanopayment system needs observability into payment flows, balances, and error rates. Without monitoring, you won't know when payments fail or when balances run low.

## What to Monitor

### Payment Metrics

| Metric | Description | Alert threshold |
|--------|-------------|----------------|
| Payment success rate | % of `settle()` calls that succeed | < 99% |
| Payment latency | Time from request to settlement confirmation | > 2 seconds |
| 402 response rate | % of requests that return 402 | Sudden spike |
| Revenue per hour | Total USDC received per time window | Drop > 50% |

### Balance Metrics

| Metric | Description | Alert threshold |
|--------|-------------|----------------|
| Buyer Gateway balance | Available balance for payments | < minimum deposit threshold |
| Seller Gateway balance | Accumulated earnings pending withdrawal | > maximum before auto-withdraw |
| On-chain wallet balance | USDC in the wallet (for gas and withdrawals) | < 1 USDC |

### Error Tracking

| Error | Action |
|-------|--------|
| `insufficient_balance` | Alert buyer to deposit more USDC |
| `invalid_signature` | Investigate — may indicate key compromise or SDK bug |
| `nonce_already_used` | Check for duplicate request handling |
| `settlement_failed` | Escalate — Gateway infrastructure issue |

## Logging Payments

Log every payment for auditing and debugging:

```typescript
app.get("/weather", gateway.require("$0.001"), (req, res) => {
  const { payer, amount, network, transaction } = req.payment;

  console.log(JSON.stringify({
    event: "payment_received",
    payer,
    amount,
    network,
    transaction,
    route: "/weather",
    timestamp: new Date().toISOString(),
  }));

  res.json({ temperature: "68°F", paid_by: payer });
});
```

## Health Checks

Add a health check endpoint that verifies Gateway connectivity:

```typescript
app.get("/health", async (req, res) => {
  try {
    const facilitator = new BatchFacilitatorClient();
    const supported = await facilitator.getSupported();
    res.json({ status: "ok", networks: supported.length });
  } catch (error) {
    res.status(503).json({ status: "error", message: "Gateway unreachable" });
  }
});
```

## Next Step

Learn about pricing strategies for different types of APIs.
