# Module 3: x402 SDK

Explore the x402 protocol and the server/client SDKs that power the nanopayment flow.

## Lessons

1. **What is x402?** — The HTTP 402 payment standard and how nanopayments fits as a payment method
2. **Server SDK** — `createGatewayMiddleware`, `gateway.require()`, `BatchFacilitatorClient`, and `req.payment` fields
3. **Client SDK** — `GatewayClient` for deposits, payments, balances, and withdrawals
4. **Troubleshooting** — SDK import issues and common configuration mistakes

## Key Concepts

- x402 uses the HTTP `402 Payment Required` status code to negotiate payments
- The server SDK provides Express middleware that handles verification and settlement
- The client SDK provides `GatewayClient` for managing the full buyer flow
- Seller imports from `@circle-fin/x402-batching/server`, buyer from `@circle-fin/x402-batching/client`
