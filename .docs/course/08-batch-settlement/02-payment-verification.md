# How Payment Verification Works

When the seller middleware receives a `PAYMENT-SIGNATURE` header, it submits the payment to Gateway for verification and settlement. Here's what happens.

## The Verification Flow

1. **Buyer** signs an EIP-3009 `TransferWithAuthorization` message off-chain
2. **Buyer** attaches it as a base64-encoded `PAYMENT-SIGNATURE` header
3. **Seller middleware** extracts the payment payload
4. **Seller middleware** calls Gateway's `settle()` endpoint
5. **Gateway** verifies the EIP-3009 signature
6. **Gateway** checks the buyer has sufficient balance
7. **Gateway** locks the buyer's funds and credits the seller's pending balance
8. **Seller** serves the resource immediately

## What Gateway Checks

| Check | Description |
|-------|-------------|
| Signature validity | EIP-3009 signature matches the `from` address |
| Amount match | Signed amount matches the required payment |
| Address match | `to` address matches the seller's `payTo` address |
| Nonce uniqueness | Payment nonce hasn't been used before |
| Validity window | `validBefore` is at least 3 days in the future |
| Balance | Buyer has sufficient Gateway balance |

## Error Codes

If verification fails, Gateway returns a specific error:

| Error | Cause |
|-------|-------|
| `invalid_signature` | EIP-3009 signature verification failed |
| `amount_mismatch` | Signed amount doesn't match required amount |
| `address_mismatch` | `to` address doesn't match `payTo` |
| `nonce_already_used` | Payment nonce was already submitted |
| `authorization_validity_too_short` | `validBefore` is less than 3 days from now |
| `insufficient_balance` | Buyer's Gateway balance is too low |

## Settle vs. Verify

Gateway offers two endpoints:

- **`settle()`** — Verifies and commits the payment in one step. Recommended for production.
- **`verify()`** — Verifies without committing. Useful for pre-checks.

The SDK middleware uses `settle()` by default for low latency and guaranteed settlement.

## Next Step

Learn about the security architecture that protects this flow.
