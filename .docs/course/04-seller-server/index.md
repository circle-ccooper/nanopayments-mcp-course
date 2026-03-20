# Module 4: Seller Server

Build an Express API that accepts gasless USDC payments using x402 middleware.

## Lessons

1. **Building the Seller Server** — What you'll build and how the 402 flow works
2. **Why This Architecture** — Why Express middleware is the right pattern for nanopayment APIs
3. **Creating the Server** — Express setup with `createGatewayMiddleware`
4. **Protecting Routes** — Using `gateway.require()` to add payment requirements to routes
5. **Testing the Paywall** — Start the server, send requests, and verify 402 responses
6. **Troubleshooting** — Common server startup and configuration issues

## Key Concepts

- `createGatewayMiddleware` returns a middleware object for protecting Express routes
- `gateway.require("$0.001")` wraps any route with a price
- Unpaid requests get `402 Payment Required`; paid requests get `req.payment` with payer details
- The middleware handles all payment verification and settlement automatically
