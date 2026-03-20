# Module 7: Paying the Paywall

Use the buyer client to pay for x402-protected resources with gasless nanopayments.

## Lessons

1. **Paying the Paywall Server** — What you'll do and prerequisites
2. **Understanding the Payment Flow** — How EIP-3009 signing and 402 negotiation work under the hood
3. **Making Payments** — Use `client.pay()` to pay for resources automatically
4. **Balances and Withdrawals** — Check balances and withdraw earnings from Gateway
5. **Testing the Payment Flow** — End-to-end verification of the full payment round-trip
6. **Error Handling** — Handle insufficient balance, network errors, and signature failures
7. **Troubleshooting** — Common payment issues and debugging steps

## Key Concepts

- `client.pay(url)` handles the full 402 negotiation in a single call
- `client.supports(url)` checks if a URL accepts Gateway payments before paying
- Payments are gasless — only the initial deposit costs gas
- Merchants withdraw earnings from Gateway with `client.withdraw()`
