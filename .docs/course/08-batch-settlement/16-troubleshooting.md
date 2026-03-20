# Troubleshooting

If you encounter issues with settlement, verification, or the advanced topics in this module, check the following.

## Settlement Issues

1. Verify the seller server is running and accessible at `http://localhost:3000`
2. Verify the buyer has a positive Gateway balance with `buyer/balance.ts`
3. Check that both `CONSUMER_PRIVATE_KEY` and `MERCHANT_WALLET_ADDRESS` are set in `.env`
4. Ensure the seller server was started with `--env-file=.env` flag

Common issues include:

- **`insufficient_balance` on every payment**: Your Gateway balance is 0. Run `buyer/deposit.ts` to deposit USDC. If that fails, request testnet USDC from [faucet.circle.com](https://faucet.circle.com) first.
- **`invalid_signature` errors**: The payment signature doesn't match expectations. This usually means the `CONSUMER_PRIVATE_KEY` in `.env` is wrong or the key doesn't correspond to the address that deposited into Gateway.
- **`nonce_already_used`**: You're replaying an old payment. The SDK generates unique nonces automatically — if you see this, it may indicate a caching issue. Restart both the seller server and buyer script.
- **`authorization_validity_too_short`**: The system clock on your machine may be significantly off. Verify your system time is accurate.
- **`address_mismatch`**: The `payTo` address in the payment doesn't match the seller's configured `sellerAddress`. Check `MERCHANT_WALLET_ADDRESS` in `.env`.

## Cross-Chain Issues

- **Cross-chain withdrawal pending**: Cross-chain withdrawals are near-instant but may take up to a minute in rare cases. Check the transaction hash on the destination chain's block explorer.
- **"Unsupported chain" error**: Verify you're using a valid `SupportedChainName` from the SDK. Check the supported networks list in the course.
- **Withdrawal fails with "insufficient gas"**: The withdrawing wallet needs native gas tokens on the destination chain. On Arc, USDC covers gas; on other chains, you need ETH, AVAX, etc.

## BatchFacilitatorClient Issues

- **`settle()` returns `{ success: false }`**: Check `settlement.errorReason` for the specific cause. The error codes are the same as those listed in the Payment Verification lesson.
- **Cannot import `BatchFacilitatorClient`**: Verify you're importing from `@circle-fin/x402-batching/server`, not `@circle-fin/x402-batching/client`.

## General Debugging

If you're stuck, add logging to see what's happening:

```typescript
app.get("/weather", gateway.require("$0.001"), (req, res) => {
  console.log("Payment received:", JSON.stringify(req.payment, null, 2));
  res.json({ temperature: "68°F" });
});
```

Check the terminal running the seller server for payment details or error messages.

## Next Step

Review the course summary and explore what you can build next.
