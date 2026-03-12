# Testing the Paywall

Start the seller server and verify it returns `402 Payment Required` for unpaid requests.

## Start the Server

```bash
npx tsx --env-file=.env seller/server.ts
```

Expected output:

```
Seller server listening at http://localhost:3000

Protected routes:
  GET /weather       — $0.001 per request
  GET /premium-data  — $0.01 per request
```

## Send an Unpaid Request

In a separate terminal:

```bash
curl -i http://localhost:3000/weather
```

You should see a `402 Payment Required` response with a JSON body containing an `accepts` array:

```
HTTP/1.1 402 Payment Required

{
  "x402Version": 2,
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:5042002",
      "asset": "0x3600000000000000000000000000000000000000",
      "amount": "1000",
      "payTo": "0x...",
      "extra": {
        "name": "GatewayWalletBatched",
        "version": "1",
        "verifyingContract": "0x0077777d..."
      }
    }
  ]
}
```

This tells the buyer: "Pay 1000 raw USDC ($0.001) to this address using the GatewayWalletBatched scheme."

## What the Buyer Sees

An x402-compatible client (like `GatewayClient`) automatically:

1. Detects the `402` response
2. Reads the `accepts` array
3. Signs an EIP-3009 authorization matching the requirements
4. Retries the request with the `PAYMENT-SIGNATURE` header
5. Receives the `200 OK` response with the paid resource

You'll build the buyer in Module 7 after creating and funding a wallet.

## Congratulations

You've built an x402 nanopayment paywall! Any x402-compatible client can now pay for your API resources with gasless USDC micropayments.

## Next Step

Create a wallet so you can fund it and start paying.
