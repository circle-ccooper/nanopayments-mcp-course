# Testing Your Setup

Before moving on, verify that your development environment is correctly configured and all dependencies are installed.

## Step 1: Verify Node.js

```bash
node --version
```

You should see `v18.x.x` or higher. If not, install or update Node.js.

## Step 2: Verify Dependencies

```bash
npx tsx --version
```

This confirms `tsx` (the TypeScript runner) is available.

## Step 3: Run the Verification Script

Create a quick test file to confirm all core packages are importable:

```typescript
// scripts/verify-setup.ts
import { generatePrivateKey } from "viem/accounts";
import { createPublicClient, http } from "viem";

const key = generatePrivateKey();
console.log("viem:        ✓ (generated test key)");

const client = createPublicClient({ transport: http("https://arc-testnet.drpc.org") });
console.log("Public client: ✓ (connected to Arc Testnet)");

console.log("\nAll dependencies verified. Setup is complete!");
```

Run it:

```bash
npx tsx scripts/verify-setup.ts
```

Expected output:

```
viem:        ✓ (generated test key)
Public client: ✓ (connected to Arc Testnet)

All dependencies verified. Setup is complete!
```

## Step 4: Verify Project Structure

Confirm your folders exist:

```bash
ls buyer/ seller/ scripts/
```

You should see all three directories listed (they may be empty for now).

## What to Do If Something Fails

- **`tsx` not found**: Run `npm install tsx` again
- **Import errors**: Run `npm install` to ensure all packages are installed
- **Node version too old**: Install Node.js 18+ from [nodejs.org](https://nodejs.org)

## Next Step

Learn how Circle Gateway makes gasless nanopayments possible.
