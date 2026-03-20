# Testing the Payment Flow

Let's verify the full payment round-trip works: from the buyer's request, through the 402 negotiation, to receiving the paid resource.

## Prerequisites

- Seller server running (`npx tsx --env-file=.env seller/server.ts`)
- Consumer wallet with Gateway balance (from Module 6)

## Step 1: Verify the Seller is Running

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/weather
```

Expected output: `402`. If you get a connection error, start the seller server.

## Step 2: Make a Payment

```bash
npx tsx --env-file=.env buyer/pay.ts http://localhost:3000/weather
```

Expected:

```
Status: 200
Amount paid: 0.001000 USDC
Response: {
  "location": "San Francisco, CA",
  ...
}
```

## Step 3: Check Buyer Balance After Payment

```bash
npx tsx --env-file=.env buyer/balance.ts
```

The Gateway `available` balance should be lower than before by approximately $0.001.

## Step 4: Pay for a Different Route

```bash
npx tsx --env-file=.env buyer/pay.ts http://localhost:3000/premium-data
```

This route costs $0.01. Verify it succeeds with the higher amount.

## Step 5: Verify Seller Received Payments

Check the terminal running the seller server. You should see console output like:

```
Paid 0.001000 USDC by 0x... on eip155:5042002
Paid 0.010000 USDC by 0x... on eip155:5042002
```

## Verification Checklist

| Check | Expected |
|-------|----------|
| Unpaid request returns 402 | `curl` gets HTTP 402 |
| `client.pay()` returns 200 | Weather data received |
| Buyer balance decreased | Lower by $0.001 after payment |
| Different prices work | $0.01 route also succeeds |
| Seller logs payments | Payment details in server terminal |

## Next Step

Learn about error handling for payment failures.
