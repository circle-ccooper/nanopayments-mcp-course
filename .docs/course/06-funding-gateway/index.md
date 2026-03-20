# Module 6: Funding Gateway

Fund your wallet with testnet USDC and deposit into Circle Gateway.

## Lessons

1. **Funding Your Gateway Wallet** — Overview of the funding process
2. **Requesting Testnet Tokens** — Use the Circle faucet to get free USDC on Arc Testnet
3. **Checking Wallet Balance** — Read on-chain USDC balance using viem
4. **Depositing USDC into Gateway** — Transfer USDC from your wallet to the Gateway Wallet contract
5. **Testing Your Deposit** — Verify balances and confirm the deposit on the block explorer
6. **Troubleshooting** — Faucet, balance, and deposit issues

## Key Concepts

- The Circle faucet distributes 20 USDC per request on Arc Testnet
- Only the consumer wallet needs funding — the merchant receives payments automatically
- Deposit is a one-time on-chain transaction; all subsequent payments are gasless
- On Arc, USDC is the native gas token — one token covers everything
