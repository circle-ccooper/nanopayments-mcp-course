# Troubleshooting

If you encounter issues requesting testnet tokens, checking balances, or depositing into Gateway, check the following.

1. That your `CONSUMER_WALLET_ADDRESS` is a valid Ethereum address (starts with `0x`, 42 characters)
2. That you selected **Arc Testnet** on the faucet (not Ethereum Sepolia or another network)
3. That your `.env` has both `CONSUMER_PRIVATE_KEY` and `CONSUMER_WALLET_ADDRESS` set
4. That you're using `--env-file=.env` when running scripts

Common issues include:

- **Faucet says "already requested"**: The faucet limits requests to once per 2 hours per token/network pair. Wait and try again later.
- **Faucet shows success but balance is 0**: Tokens may take a few seconds to arrive. Wait 10–15 seconds and re-run `scripts/check-balance.ts`. Also confirm you checked the right address.
- **`check-balance.ts` shows 0 but faucet confirmed**: Make sure the address in your script matches `CONSUMER_WALLET_ADDRESS` in `.env`. Also verify you're querying Arc Testnet RPC (`https://arc-testnet.drpc.org`).
- **Deposit fails with "insufficient funds for gas"**: Your wallet doesn't have enough USDC to cover both the deposit amount and gas. On Arc, USDC is the gas token. If you requested 20 USDC and are depositing 1 USDC, you should have plenty. Check your balance.
- **Deposit fails with "execution reverted"**: The Gateway Wallet contract may have rejected the transaction. Common causes: you're depositing 0, or the approval step failed. Try running the deposit script again.
- **`CONSUMER_PRIVATE_KEY` errors**: Ensure the key starts with `0x` and is exactly 66 characters. Re-run `scripts/verify-wallets.ts` to confirm.
- **Network/RPC errors**: The Arc Testnet RPC at `https://arc-testnet.drpc.org` may be temporarily slow. Retry after a moment.

If the deposit script succeeded but Gateway balance shows 0, wait a few seconds — the balance update may take a moment to propagate.

In the next module, you'll use your Gateway balance to pay for resources on the seller server.
