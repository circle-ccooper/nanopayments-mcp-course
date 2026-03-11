# Verifying Your Wallets

Before funding your wallets, verify that the private keys and addresses in your `.env` are valid and consistent.

## Verification Script

Create `scripts/verify-wallets.ts` to confirm each private key derives the expected address:

```typescript
import { privateKeyToAccount } from "viem/accounts";
import { isAddress } from "viem";

interface WalletConfig {
  label: string;
  privateKey: string | undefined;
  expectedAddress: string | undefined;
}

const wallets: WalletConfig[] = [
  {
    label: "Consumer",
    privateKey: process.env.CONSUMER_PRIVATE_KEY,
    expectedAddress: process.env.CONSUMER_WALLET_ADDRESS,
  },
  {
    label: "Merchant",
    privateKey: process.env.MERCHANT_PRIVATE_KEY,
    expectedAddress: process.env.MERCHANT_WALLET_ADDRESS,
  },
];

let allValid = true;

for (const wallet of wallets) {
  if (!wallet.privateKey) {
    console.log(`${wallet.label}: MISSING private key`);
    allValid = false;
    continue;
  }

  const account = privateKeyToAccount(wallet.privateKey as `0x${string}`);
  const addressMatch =
    account.address.toLowerCase() === wallet.expectedAddress?.toLowerCase();

  console.log(`${wallet.label} Wallet`);
  console.log(`  Address: ${account.address}`);
  console.log(`  Key → Address match: ${addressMatch ? "✓" : "✗"}`);
  console.log(`  Valid address: ${isAddress(account.address) ? "✓" : "✗"}`);
  console.log("");

  if (!addressMatch) allValid = false;
}

if (allValid) {
  console.log("All wallets verified successfully!");
} else {
  console.log("One or more wallets failed verification. Check your .env file.");
}
```

Run it:

```bash
tsx --env-file=.env scripts/verify-wallets.ts
```

Expected output:

```
Consumer Wallet
  Address: 0x1234...abcd
  Key → Address match: ✓
  Valid address: ✓

Merchant Wallet
  Address: 0x5678...efgh
  Key → Address match: ✓
  Valid address: ✓

All wallets verified successfully!
```

## What This Checks

| Check | What It Verifies |
|-------|------------------|
| Private key present | The `.env` file has a private key set |
| Key → Address match | The address in `.env` was derived from the stored private key |
| Valid address | The address is a properly formatted Ethereum address |

## Congratulations

Your wallets are ready! Next, you'll fund them with testnet USDC and deposit into Gateway.
