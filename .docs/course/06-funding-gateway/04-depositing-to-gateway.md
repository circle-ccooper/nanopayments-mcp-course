# Depositing USDC into Gateway

Before making gasless payments, deposit USDC from your wallet into the Gateway Wallet contract. This is a one-time on-chain transaction. After this, all payments are gasless.

## Deposit Script — `buyer/deposit.ts`

```typescript
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});

console.log(`Buyer address: ${client.address}`);

const balances = await client.getBalances();
console.log(`Wallet USDC: ${balances.wallet.formatted}`);
console.log(`Gateway balance: ${balances.gateway.formattedAvailable} USDC`);

if (balances.gateway.available < 1_000_000n) {
  console.log("\nDepositing 1 USDC into Gateway...");
  const deposit = await client.deposit("1");
  if (deposit.approvalTxHash) {
    console.log(`  Approval tx: ${deposit.approvalTxHash}`);
  }
  console.log(`  Deposit tx: ${deposit.depositTxHash}`);
  console.log(`  Amount: ${deposit.formattedAmount} USDC`);
} else {
  console.log("\nGateway balance sufficient — skipping deposit.");
}

const updated = await client.getBalances();
console.log(`\nUpdated Gateway balance: ${updated.gateway.formattedAvailable} USDC`);
```

Run it:

```bash
npx tsx --env-file=.env buyer/deposit.ts
```

## What `client.deposit()` Does

The `GatewayClient.deposit()` method handles both the ERC-20 approval and the Gateway deposit in one call:

1. **Approves** the Gateway Wallet contract to spend your USDC (if needed)
2. **Deposits** USDC into the Gateway Wallet contract
3. Returns transaction hashes and the deposited amount

After the deposit confirms, your Gateway balance is available for gasless payments.

## Verify on the Block Explorer

Copy the `depositTxHash` (and `approvalTxHash` if one was printed) from the script output and paste it into the [Arc Testnet block explorer](https://testnet.arcscan.app/). Search for the transaction hash to confirm your deposit was recorded on-chain.

## Congratulations

You've funded your Gateway wallet! Your consumer wallet now has a Gateway balance that can be used for gasless nanopayments.

## Next Step

Verify your deposit worked by testing your balances.
