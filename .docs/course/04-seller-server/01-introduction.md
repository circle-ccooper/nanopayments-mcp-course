# Building the Seller Server

In this module, you'll build a seller API that accepts gasless USDC payments using the x402 protocol and Circle Gateway.

## What You'll Build

An Express API with x402 payment middleware that:

1. Returns `402 Payment Required` for unpaid requests
2. Accepts signed payment authorizations from buyers
3. Verifies and settles payments via Circle Gateway
4. Serves the paid resource

## How It Works

```
Client → GET /weather → Server
Server ← 402 Payment Required (with payment details)

Client signs EIP-3009 authorization (off-chain, zero gas)

Client → GET /weather + PAYMENT-SIGNATURE header → Server
Server verifies signature via Gateway
Server ← 200 OK + weather data
```

The middleware handles all payment negotiation, verification, and settlement. You just wrap your routes with `gateway.require("$0.001")` and serve data.

## Next Step

Understand why this architecture is the right choice for nanopayment APIs.
