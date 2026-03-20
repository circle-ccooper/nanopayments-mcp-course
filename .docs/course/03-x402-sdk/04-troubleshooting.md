# Troubleshooting

If you're having trouble understanding the SDK concepts, or encounter issues when you start using the SDK in later modules, refer to this page.

1. That you've installed `@circle-fin/x402-batching` with `npm install`
2. That your import paths use the correct subpath (`/server` or `/client`)
3. That you understand the difference between the server SDK (seller) and client SDK (buyer)

Common issues include:

- **`Cannot find module '@circle-fin/x402-batching/server'`**: The package isn't installed. Run `npm install @circle-fin/x402-batching`. If still failing, check that your `package.json` has `"type": "module"` set.
- **`Cannot find module '@circle-fin/x402-batching/client'`**: Same fix as above — ensure the package is installed and your project is configured as an ES module.
- **Confusion between `createGatewayMiddleware` and `BatchFacilitatorClient`**: Use `createGatewayMiddleware` if you're building an Express server (most common). Use `BatchFacilitatorClient` only if you need a non-Express framework or dynamic pricing. Both are from the `/server` subpath.
- **Confusion between `GatewayClient` methods**: `deposit()` and `withdraw()` are on-chain transactions (cost gas). `pay()` handles the full 402 negotiation (gasless). `getBalances()` is a read-only query. `supports()` checks if a URL accepts Gateway payments.
- **"Which SDK do I import on which side?"**: The seller (API server) uses `@circle-fin/x402-batching/server`. The buyer (paying client) uses `@circle-fin/x402-batching/client`. Never import both in the same file.

In the next module, you'll put these SDK concepts into practice by building the seller server.
