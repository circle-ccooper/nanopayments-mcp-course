# Troubleshooting

If payments aren't working, check the following.

1. That the seller server is running at `http://localhost:3000`
2. That your `.env` has `CONSUMER_PRIVATE_KEY` and `CONSUMER_WALLET_ADDRESS` set
3. That you have a positive Gateway balance (run `buyer/balance.ts`)
4. That the private key in `.env` is the same one used to deposit into Gateway

Common issues include:

- **`ECONNREFUSED` on `client.pay()`**: The seller server isn't running. Start it with `npx tsx --env-file=.env seller/server.ts` in a separate terminal.
- **`insufficient_balance` error**: Your Gateway balance is 0 or too low. Run `buyer/deposit.ts` to deposit more USDC. If that fails, request tokens from [faucet.circle.com](https://faucet.circle.com).
- **`invalid_signature` error**: The private key signing the payment doesn't match the wallet that deposited into Gateway. If you regenerated wallets after depositing, you need to deposit again with the new key.
- **`client.supports()` returns `false`**: The URL doesn't return a valid 402 response. Check that the seller server has `gateway.require()` on the route you're hitting.
- **Payment succeeds but response data is unexpected**: Check the seller's route handler. The `req.payment` object should be available with payer details.
- **Withdrawal fails**: The merchant wallet needs USDC for gas. Fund it from [faucet.circle.com](https://faucet.circle.com) before withdrawing.
- **Cross-chain withdrawal pending**: These are near-instant but may take up to a minute. Check the destination chain's block explorer.

If you're having trouble, add verbose logging to the buyer script:

```typescript
console.log("Supports:", await client.supports(url));
console.log("Balances:", await client.getBalances());
```

This will show you the current state before attempting payment.

In the next module, you'll learn how batch settlement, verification, and security work under the hood.
