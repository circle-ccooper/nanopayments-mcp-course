# Testing Your Deposit

After depositing USDC into Gateway, verify that everything worked correctly by checking both your wallet and Gateway balances.

## Step 1: Check On-Chain Balance

Run the balance checker from the earlier lesson:

```bash
npx tsx --env-file=.env scripts/check-balance.ts
```

Your on-chain USDC balance should be **lower** than before the deposit — the difference is the amount you deposited plus gas fees.

## Step 2: Check Gateway Balance

The deposit script should have printed an updated Gateway balance. You can also check it by running the buyer balance script (you'll create this in Module 7, but here's a preview):

```typescript
// scripts/check-gateway-balance.ts
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});

const balances = await client.getBalances();
console.log("Consumer Gateway Balance");
console.log(`  Available: ${balances.gateway.formattedAvailable} USDC`);
console.log(`  Total: ${balances.gateway.formattedTotal} USDC`);
console.log(`  Wallet: ${balances.wallet.formatted} USDC`);
```

```bash
npx tsx --env-file=.env scripts/check-gateway-balance.ts
```

## Step 3: Verify on Block Explorer

If your deposit script printed a `depositTxHash`, look it up on the [Arc Testnet block explorer](https://testnet.arcscan.app/):

1. Go to https://testnet.arcscan.app/
2. Paste the transaction hash in the search bar
3. Confirm the transaction shows a successful USDC transfer to the Gateway Wallet contract

## Verification Checklist

| Check | Expected |
|-------|----------|
| On-chain balance decreased | Lower than the faucet amount (20 USDC) by your deposit + gas |
| Gateway available balance > 0 | Shows the amount you deposited |
| Block explorer shows transaction | Successful transfer to Gateway Wallet contract |

## Next Step

If all checks pass, you're ready to pay for resources. If something looks wrong, see the troubleshooting page.
