# Why This Architecture

Before writing code, let's understand why we're building the seller as an Express server with x402 middleware — and what alternatives exist.

## The Design Decision

The nanopayment seller has one job: serve resources and get paid per request. There are several ways to implement this, but the x402 middleware approach has specific advantages.

## Option 1: Manual Payment Checking (What We're Not Doing)

You could check for payment in every route handler manually:

```typescript
app.get("/weather", async (req, res) => {
  const signature = req.headers["payment-signature"];
  if (!signature) return res.status(402).json({ /* payment details */ });
  const isValid = await verifyPayment(signature);
  if (!isValid) return res.status(402).json({ /* error */ });
  res.json({ temperature: "68°F" });
});
```

This works, but you'd repeat the same payment logic in every route. Bugs in one route wouldn't be caught in others.

## Option 2: Express Middleware (What We're Doing)

Express middleware sits between the request and your route handler. The `createGatewayMiddleware` approach means:

- **One line per route** — `gateway.require("$0.001")` protects any route
- **Separation of concerns** — your route handlers focus on business logic, not payment
- **Consistent behavior** — every protected route follows the same 402 negotiation flow
- **No boilerplate** — the SDK handles signature verification, settlement, and error responses

## Why Express?

Express is the most widely-used Node.js web framework with the largest ecosystem of middleware. For this course, it provides a familiar foundation. However, the pattern works with any framework — Module 8 covers using the `BatchFacilitatorClient` directly for Fastify, Hono, Koa, or raw HTTP servers.

## The 402 Flow

When a request hits a protected route:

```
1. Request arrives without PAYMENT-SIGNATURE header
2. Middleware returns 402 Payment Required with payment details
3. x402-compatible client reads the 402 response
4. Client signs an EIP-3009 authorization (off-chain, zero gas)
5. Client retries with the PAYMENT-SIGNATURE header
6. Middleware verifies signature with Gateway, settles payment
7. Middleware calls next() — your route handler runs
8. Route handler has access to req.payment with payer details
```

The buyer's client library handles steps 3–5 automatically. From the buyer's perspective, `client.pay(url)` is a single call.

## Next Step

Create the Express server with the Gateway middleware.
