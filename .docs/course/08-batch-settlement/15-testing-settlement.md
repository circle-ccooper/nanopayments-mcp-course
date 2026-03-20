# Testing the Settlement Flow

Before wrapping up, verify the full nanopayment round-trip works end-to-end. This lesson walks through a systematic verification of every component you've built.

## Prerequisites

- Consumer wallet funded with testnet USDC (from Module 6)
- Gateway balance deposited (from Module 6)
- Seller server code from Module 4

## Step 1: Start the Seller Server

```bash
npx tsx --env-file=.env seller/server.ts
```

Verify you see:

```
Seller server listening at http://localhost:3000
```

## Step 2: Verify the Paywall Returns 402

In a separate terminal:

```bash
curl -s http://localhost:3000/weather | jq .
```

Expected: a JSON response with `x402Version` and `accepts` array. If you get a connection error, the server isn't running.

## Step 3: Check Buyer Balance

```bash
npx tsx --env-file=.env buyer/balance.ts
```

Verify the Gateway `available` balance is greater than 0. If it's 0, re-run the deposit script from Module 6.

## Step 4: Make a Payment

```bash
npx tsx --env-file=.env buyer/pay.ts http://localhost:3000/weather
```

Expected output:

```
Status: 200
Amount paid: 0.001000 USDC
Response: {
  "location": "San Francisco, CA",
  "temperature": "68°F",
  ...
}
```

## Step 5: Verify Balance Changed

```bash
npx tsx --env-file=.env buyer/balance.ts
```

The Gateway `available` balance should be lower than before the payment by approximately $0.001.

## Step 6: Make Multiple Payments

Run the payment script several times to verify repeated payments work:

```bash
for i in {1..5}; do
  echo "--- Payment $i ---"
  npx tsx --env-file=.env buyer/pay.ts http://localhost:3000/weather
  echo ""
done
```

Each payment should succeed with status 200.

## Step 7: Check Merchant Balance

```bash
npx tsx --env-file=.env seller/withdraw.ts 0
```

Pass `0` to just check the balance without withdrawing. The merchant's Gateway `available` balance should reflect the accumulated payments.

## Verification Checklist

| Check | Expected |
|-------|----------|
| Server starts without errors | `Seller server listening at http://localhost:3000` |
| Unpaid request returns 402 | JSON with `x402Version` and `accepts` |
| Buyer has Gateway balance | `available` > 0 |
| Payment succeeds | Status 200 with response data |
| Buyer balance decreased | Lower by ~$0.001 per payment |
| Multiple payments work | All return status 200 |
| Seller received payments | Merchant Gateway balance > 0 |

## What to Do If Something Fails

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Connection refused | Server not running | Start with `npx tsx --env-file=.env seller/server.ts` |
| 402 on paid request | Invalid signature | Check `CONSUMER_PRIVATE_KEY` in `.env` |
| `insufficient_balance` | Gateway balance is 0 | Run `buyer/deposit.ts` again |
| Deposit fails | No USDC in wallet | Request from [faucet.circle.com](https://faucet.circle.com) |
| `MERCHANT_WALLET_ADDRESS` error | Missing env var | Run `scripts/verify-wallets.ts` |

## Next Step

Review common issues and troubleshooting steps.
