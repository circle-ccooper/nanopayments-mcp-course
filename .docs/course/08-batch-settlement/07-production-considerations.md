# Production Considerations

Before deploying a nanopayment system to production, consider these aspects.

## Security

- **Private keys** — Use a secure key management system (KMS, HSM) rather than `.env` files
- **Seller address** — Use a dedicated receiving address, not a hot wallet
- **Rate limiting** — Protect your API from abuse regardless of payment status
- **Input validation** — Validate all request parameters, not just payment

## Monitoring

- **Log payments** — Record every `req.payment` object for auditing
- **Track balances** — Monitor your Gateway balance for withdrawals
- **Alert on errors** — Watch for `settlement_failed` or `insufficient_balance` errors
- **Uptime** — Your server needs to be available for the 402 negotiation flow

## Pricing Strategies

| Strategy | Example | Use Case |
|----------|---------|----------|
| Fixed per-request | `gateway.require("$0.001")` | Simple APIs |
| Tiered by endpoint | Different prices per route | Multiple resource types |
| Dynamic pricing | Calculate per-request based on query | Variable-cost resources |

For dynamic pricing, use `BatchFacilitatorClient` directly instead of the middleware.

## Payment Validity

Payment signatures must have at least **3 days of validity**. The `validBefore` timestamp in the buyer's EIP-3009 authorization must be at least 3 days in the future, or Gateway will reject it. The SDK handles this automatically.

## Error Handling

The middleware returns appropriate HTTP errors when payments fail:

| Scenario | HTTP Status | Action |
|----------|-------------|--------|
| No payment | 402 | Client should pay |
| Invalid signature | 402 | Client should re-sign |
| Insufficient balance | 402 | Client should deposit more |
| Server error | 503 | Retry |

## Next Step

Review the course summary and what you can build next.
