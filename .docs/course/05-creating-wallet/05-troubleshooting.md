# Troubleshooting

If wallet creation or verification fails, check the following.

1. That `viem` is installed (`npm list viem`)
2. That your `.env` file exists and is in the project root directory
3. That you ran the create-wallets script before the verify-wallets script
4. That you're using the `--env-file=.env` flag when running verification

Common issues include:

- **`MISSING private key` during verification**: Your `.env` file doesn't have the wallet keys. Run `npx tsx scripts/create-wallets.ts` first to generate them.
- **`Key → Address match: ✗`**: The address in `.env` doesn't match the private key. This can happen if you manually edited the `.env` file and changed one value without the other. Re-run `scripts/create-wallets.ts` to regenerate both wallets (delete the existing entries first).
- **`Wallets already exist in .env — not overwriting`**: The script found existing keys in `.env`. If you want to regenerate, remove the `CONSUMER_PRIVATE_KEY` and related lines from `.env` first.
- **`Cannot find module 'viem/accounts'`**: viem isn't installed or your project isn't configured as an ES module. Run `npm install viem` and ensure `package.json` has `"type": "module"`.
- **Private key format errors**: Private keys must start with `0x` and be 66 characters long (0x + 64 hex characters). If yours looks different, regenerate wallets.
- **`.env` file not created**: Check file permissions in your project directory. The script uses `writeFileSync` which requires write access to the project root.

If you're having trouble, check that the `.env` file contains lines like:

```
CONSUMER_PRIVATE_KEY=0x...
CONSUMER_WALLET_ADDRESS=0x...
MERCHANT_PRIVATE_KEY=0x...
MERCHANT_WALLET_ADDRESS=0x...
```

In the next module, you'll fund your consumer wallet with testnet USDC.
