# Paying the Paywall Server

With USDC deposited into Gateway, you're ready to pay for x402-protected resources. The `GatewayClient` handles the full payment negotiation automatically.

## What You'll Do

1. **Pay** for a resource using `client.pay(url)`
2. **Check** your Gateway balance after payments
3. **Withdraw** USDC from Gateway back to your wallet

## The Payment Flow

```
1. client.pay(url) sends GET /weather
2. Server responds: 402 Payment Required
3. Client signs EIP-3009 authorization (off-chain, zero gas)
4. Client retries with PAYMENT-SIGNATURE header
5. Server verifies, settles, and returns the resource
6. client.pay() returns the response data
```

All of this happens in a single `client.pay()` call.

## Prerequisites

- Seller server running from Module 4 (`npx tsx --env-file=.env seller/server.ts`)
- Gateway balance from Module 6

## Next Step

Pay for your first x402-protected resource.
