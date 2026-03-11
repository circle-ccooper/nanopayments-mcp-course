# Dispute Resolution

All payment authorizations are cryptographically signed by the buyer. This provides a strong foundation for dispute resolution.

## Non-Repudiation

Every payment includes an EIP-3009 `TransferWithAuthorization` signed by the buyer's private key. This signature proves:

1. **The buyer authorized the exact amount** to the exact seller
2. **The authorization was signed by the buyer's key** (verifiable by anyone)
3. **The nonce is unique** (prevents replay)
4. **The timestamp window is explicit** (`validAfter` and `validBefore`)

The buyer cannot credibly deny authorization — the signature is non-repudiable.

## How Disputes Work

| Claim | Evidence |
|-------|----------|
| "I didn't authorize that payment" | EIP-3009 signature proves the buyer's key signed it |
| "I was charged the wrong amount" | The signed `value` field shows the exact authorized amount |
| "I was charged twice" | Each payment has a unique nonce; Gateway rejects duplicates |
| "The seller didn't deliver" | Application-level dispute — outside the payment protocol |

## Best Practices

### For Sellers

- **Log all payments** — Store the `req.payment` object for every paid request
- **Return receipts** — Include payment details in API responses (`paid_by`, `amount`, `transaction`)
- **Set fair prices** — Use `gateway.require()` with transparent pricing

### For Buyers

- **Use `client.supports()`** — Verify a URL supports Gateway before paying
- **Check balances** — Use `client.getBalances()` to monitor spending
- **Keep records** — Store the response from each `client.pay()` call

## Settlement Guarantee

Once Gateway accepts a payment authorization via `settle()`:

- The buyer's funds are locked immediately
- The seller's balance is credited after the next batch settles on-chain
- The buyer cannot double-spend those funds

This provides the same settlement guarantee as an on-chain transfer, with the efficiency of batching.

## Next Step

Learn about using the BatchFacilitatorClient for custom server frameworks.
