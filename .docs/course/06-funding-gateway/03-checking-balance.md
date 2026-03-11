# Checking Wallet Balance

Verify that your consumer wallet received testnet tokens by reading the on-chain balance with viem.

## Reading USDC Balances

On Arc, USDC is the native gas token with 18 decimals of precision for native balances. However, Arc also provides an **ERC-20 interface** at `0x3600000000000000000000000000000000000000` that uses the standard 6 decimals. The recommended approach is to use the ERC-20 interface for reading balances to avoid mixing decimal formats:

```typescript
import { createPublicClient, http, formatUnits, erc20Abi } from "viem";

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;

const client = createPublicClient({
  transport: http("https://arc-testnet.drpc.org"),
});

const balance = await client.readContract({
  address: USDC_ADDRESS,
  abi: erc20Abi,
  functionName: "balanceOf",
  args: [process.env.CONSUMER_WALLET_ADDRESS as `0x${string}`],
});

console.log(`Balance: ${formatUnits(balance, 6)} USDC`);
```

> **Note:** The native balance (`getBalance`) uses 18 decimals, while the ERC-20 interface uses 6 decimals. Avoid mixing these values directly. For applications integrating USDC on Arc, rely on the standard ERC-20 interface for reading balances and sending transfers.

## Full Script — `scripts/check-balance.ts`

```typescript
import { createPublicClient, http, formatUnits, erc20Abi } from "viem";

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;

const client = createPublicClient({
  transport: http("https://arc-testnet.drpc.org"),
});

const address = process.env.CONSUMER_WALLET_ADDRESS as `0x${string}`;

const balance = await client.readContract({
  address: USDC_ADDRESS,
  abi: erc20Abi,
  functionName: "balanceOf",
  args: [address],
});

const formatted = Number(formatUnits(balance, 6)).toFixed(2);

console.log("Consumer Wallet");
console.log(`  Address: ${address}`);
console.log(`  ${formatted} USDC`);
```

Run the script:

```bash
npx tsx --env-file=.env scripts/check-balance.ts
```

Expected output:

```
Consumer Wallet
  Address: 0xa1d8...61d5
  20.00 USDC
```

## Next Step

Deposit USDC from your wallet into Circle Gateway.
