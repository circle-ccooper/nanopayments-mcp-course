# Understanding Blockchain Wallets

Before creating wallets, it's important to understand how Ethereum-compatible wallets work.

## What Is a Wallet?

A blockchain wallet is a **key pair**:

- **Private key** — A secret 32-byte hex string that proves ownership. Used to sign transactions and messages. Never share this.
- **Address** — A public identifier derived from the private key. This is what you share with others to receive funds.

Anyone with the private key controls the wallet. Anyone with the address can send funds to it or view its balance.

## Externally Owned Accounts (EOAs)

On EVM chains like Arc, wallets are called **Externally Owned Accounts** (EOAs). They are the simplest type of account:

| Property | Description |
|----------|-------------|
| **Private key** | 32-byte hex string, used for signing |
| **Address** | 20-byte hex string, derived from the public key |
| **Balance** | Amount of native token held (USDC on Arc) |
| **Nonce** | Transaction counter, increments with each transaction |

## viem

We'll use **viem** — a lightweight TypeScript library for Ethereum interactions — to generate wallets and read on-chain data:

```typescript
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log(`Address: ${account.address}`);
```

## Next Step

Generate your consumer and merchant wallets.
