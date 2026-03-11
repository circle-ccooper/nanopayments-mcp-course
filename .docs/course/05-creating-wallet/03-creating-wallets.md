# Creating Consumer and Merchant Wallets

Generate two wallets using viem: one for the **consumer** (buyer/payer) and one for the **merchant** (seller/receiver).

## Generate Wallets

Use `generatePrivateKey` and `privateKeyToAccount` from viem to create both wallets:

```typescript
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const consumerKey = generatePrivateKey();
const consumerAccount = privateKeyToAccount(consumerKey);

const merchantKey = generatePrivateKey();
const merchantAccount = privateKeyToAccount(merchantKey);

console.log("Consumer Wallet");
console.log(`  Address: ${consumerAccount.address}`);
console.log(`  Private Key: ${consumerKey}`);
console.log("");
console.log("Merchant Wallet");
console.log(`  Address: ${merchantAccount.address}`);
console.log(`  Private Key: ${merchantKey}`);
```

## Full Script — `scripts/create-wallets.ts`

This script generates both wallets and writes them to your `.env` file:

```typescript
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { readFileSync, writeFileSync, existsSync } from "fs";

const consumerKey = generatePrivateKey();
const consumerAccount = privateKeyToAccount(consumerKey);

const merchantKey = generatePrivateKey();
const merchantAccount = privateKeyToAccount(merchantKey);

console.log("Consumer Wallet");
console.log(`  Address: ${consumerAccount.address}`);
console.log(`  Private Key: ${consumerKey}`);
console.log("");
console.log("Merchant Wallet");
console.log(`  Address: ${merchantAccount.address}`);
console.log(`  Private Key: ${merchantKey}`);

const envPath = ".env";
let envContent = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";

if (envContent.includes("CONSUMER_PRIVATE_KEY=0x")) {
  console.log("\nWallets already exist in .env — not overwriting.");
} else {
  envContent = [
    "# Consumer wallet",
    `CONSUMER_PRIVATE_KEY=${consumerKey}`,
    `CONSUMER_WALLET_ADDRESS=${consumerAccount.address}`,
    "",
    "# Merchant wallet",
    `MERCHANT_PRIVATE_KEY=${merchantKey}`,
    `MERCHANT_WALLET_ADDRESS=${merchantAccount.address}`,
    "",
  ].join("\n");

  writeFileSync(envPath, envContent);
  console.log("\nWallets written to .env");
}
```

Run the script:

```bash
tsx scripts/create-wallets.ts
```

Expected output:

```
Consumer Wallet
  Address: 0x1234...abcd
  Private Key: 0xabcd...1234

Merchant Wallet
  Address: 0x5678...efgh
  Private Key: 0xefgh...5678

Wallets written to .env
```

## What Just Happened

- `generatePrivateKey()` creates a cryptographically random 32-byte private key
- `privateKeyToAccount(key)` derives the public address from the private key
- Both the key and address are saved to `.env` for use throughout the course

## Next Step

Verify your wallets are correctly configured.
