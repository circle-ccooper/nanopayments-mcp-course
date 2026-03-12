# Setting Up Your Development Environment

Set up your project and install all dependencies needed for the course.

## Requirements

- **Node.js 18+** — Check with:

```bash
node --version
```

## Initialize the Project

```bash
npm init -y
npm pkg set type="module"
```

## Install Dependencies

Install everything needed for the full course:

```bash
npm install viem tsx typescript @circle-fin/x402-batching @x402/core @x402/evm express
npm install --save-dev @types/node @types/express
```

| Package | Purpose |
|---------|---------|
| `viem` | Wallet generation, on-chain reads, and EVM interactions |
| `tsx` | Run TypeScript files directly without a build step |
| `typescript` | TypeScript compiler and type checking |
| `@circle-fin/x402-batching` | Circle Gateway SDK for sellers and buyers |
| `@x402/core` | Core x402 protocol types and utilities |
| `@x402/evm` | EVM payment scheme implementation |
| `express` | Web framework for the seller API |

## Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "types": ["node"]
  }
}
```

## Create Project Structure

Organize your project with separate folders for buyer, seller, and utility scripts:

```bash
mkdir -p buyer seller scripts
```

Your project will follow this structure as you build through the course:

```
project/
├── buyer/           # Buyer/consumer scripts
│   ├── deposit.ts
│   ├── pay.ts
│   └── balance.ts
├── seller/          # Seller/merchant scripts
│   ├── server.ts
│   └── withdraw.ts
├── scripts/         # Utility scripts
│   ├── create-wallets.ts
│   ├── verify-wallets.ts
│   └── check-balance.ts
├── .env
├── package.json
└── tsconfig.json
```

## Create `.env` File

Create a `.env` file with placeholders (you'll fill these in later):

```bash
# Consumer / Buyer wallet
CONSUMER_PRIVATE_KEY=
CONSUMER_WALLET_ADDRESS=

# Merchant / Seller wallet
MERCHANT_PRIVATE_KEY=
MERCHANT_WALLET_ADDRESS=
```

**Important:** Add `.env` to your `.gitignore` to avoid committing secrets.

## Verify Setup

```typescript
import { generatePrivateKey } from "viem/accounts";

const key = generatePrivateKey();
console.log("Setup complete. Generated test key:", key.slice(0, 10) + "...");
```

```bash
npx tsx index.ts
```

## Next Step

Learn how Circle Gateway makes gasless nanopayments possible.
