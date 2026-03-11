# What is x402?

x402 is an open, neutral standard for internet-native payments built on the HTTP `402 Payment Required` status code. It defines how a server communicates that payment is required and how a client can provide proof of payment.

## The Problem

Traditional payment systems weren't designed for programmatic, high-frequency transactions:

- **Credit cards** carry high fixed fees, require account creation, and settle slowly
- **Standard on-chain payments** require gas for every transaction, making sub-cent payments uneconomical
- **Neither approach** works for AI agents, per-request billing, or machine-to-machine commerce

## How x402 Works

The protocol uses three HTTP headers to negotiate payment:

| Header | Direction | Purpose |
|--------|-----------|---------|
| `PAYMENT-REQUIRED` | Server → Client | Payment requirements (scheme, price, network, destination) |
| `PAYMENT-SIGNATURE` | Client → Server | Signed payment payload proving authorization |
| `PAYMENT-RESPONSE` | Server → Client | Confirmation that payment was verified |

The flow:

```
1. Client requests a resource     →  GET /premium-data
2. Server responds with 402       ←  402 Payment Required + payment details
3. Client signs payment off-chain    (zero gas)
4. Client retries with signature  →  GET /premium-data + PAYMENT-SIGNATURE header
5. Server verifies and responds   ←  200 OK + resource data
```

## How Nanopayments Fits In

x402 defines the *negotiation* — a server says "pay me" and a client responds with a payment payload. But x402 doesn't prescribe how payments are funded, verified, or settled.

**Nanopayments** is a payment method for x402 that uses Circle Gateway's batched settlement:

- Buyers fund payments from a Gateway balance (deposited once on-chain)
- When a server returns `402`, the buyer signs an **EIP-3009 authorization** off-chain (zero gas)
- The server submits the authorization to Gateway for verification and settlement
- Gateway collects authorizations and settles net positions in bulk on-chain

## Key Advantage

From x402's perspective, nanopayments is just another payment method. The difference is that the underlying payment is **gasless** and settled through batching — making sub-cent payments economically viable.

## Next Step

Explore the server-side SDK that makes building a paywall trivial.
