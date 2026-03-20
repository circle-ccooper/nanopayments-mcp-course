# Balances and Withdrawals

After making payments, check your balances and then withdraw USDC from Gateway back to your wallet.

## Step 1: Check Balances — `buyer/balance.ts`

```typescript
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});

console.log(`Buyer address: ${client.address}`);
console.log("");

const balances = await client.getBalances();
console.log("Wallet:");
console.log(`  USDC: ${balances.wallet.formatted}`);
console.log("");
console.log("Gateway:");
console.log(`  Available: ${balances.gateway.formattedAvailable} USDC`);
console.log(`  Total: ${balances.gateway.formattedTotal} USDC`);
```

Run it:

```bash
npx tsx --env-file=.env buyer/balance.ts
```

### Balance Fields

| Field | Description |
|-------|-------------|
| `wallet.balance` | USDC in your on-chain wallet |
| `gateway.available` | Spendable Gateway balance (for payments) |
| `gateway.total` | Total Gateway balance (including pending settlements) |

Your Gateway available balance should be lower than what you deposited, reflecting the payments you made in the previous lesson.

## Step 2: Merchant Withdrawal from Gateway — `seller/withdraw.ts`

After the buyer paid for resources, those funds are now sitting in the **merchant's** Gateway balance. The merchant needs to withdraw earnings from Gateway back to their on-chain wallet.

Like `deposit()`, `withdraw()` is an on-chain transaction that **requires gas**. Under the hood, the SDK calls `gatewayMint()` on the Gateway Wallet contract from the merchant's address. On Arc, USDC is the native gas token, so the merchant wallet needs a small amount of USDC to cover gas fees.

> **Before running the withdrawal**, fund your merchant wallet with testnet USDC at [faucet.circle.com](https://faucet.circle.com). Select **Arc Testnet** and paste your `MERCHANT_WALLET_ADDRESS`. The faucet provides 20 USDC per request — most of this will remain in your wallet since gas fees on Arc are minimal.

Create `seller/withdraw.ts`:

```typescript
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.MERCHANT_PRIVATE_KEY as `0x${string}`,
});

console.log(`Merchant address: ${client.address}`);
console.log("");

const before = await client.getBalances();
console.log("Before withdrawal:");
console.log(`  Wallet USDC: ${before.wallet.formatted}`);
console.log(`  Gateway available: ${before.gateway.formattedAvailable} USDC`);
console.log("");

const amount = process.argv[2] || "0.50";
console.log(`Withdrawing ${amount} USDC from Gateway...`);

const result = await client.withdraw(amount);
console.log(`  Amount: ${result.formattedAmount} USDC`);
console.log(`  Tx: ${result.mintTxHash}`);
console.log("");

const after = await client.getBalances();
console.log("After withdrawal:");
console.log(`  Wallet USDC: ${after.wallet.formatted}`);
console.log(`  Gateway available: ${after.gateway.formattedAvailable} USDC`);
```

Run it to withdraw 0.50 USDC (the default):

```bash
npx tsx --env-file=.env seller/withdraw.ts
```

Or specify a custom amount:

```bash
npx tsx --env-file=.env seller/withdraw.ts 0.25
```

The script shows the merchant's balances before and after the withdrawal so you can confirm the earnings moved from Gateway to the merchant's on-chain wallet.

Copy the `mintTxHash` from the script output and paste it into the [Arc Testnet block explorer](https://testnet.arcscan.app/) to confirm the withdrawal was recorded on-chain.

### How Withdrawal Works

1. `client.withdraw(amount)` tells Gateway to transfer USDC from the merchant's Gateway balance to their wallet
2. The SDK submits the on-chain transaction — the merchant pays a small gas fee
3. The `mintTxHash` is the on-chain transaction hash you can look up on the block explorer
4. Same-chain withdrawals are instant

### Cross-Chain Withdrawals

You can also withdraw to a **different** blockchain by passing a `chain` option:

```typescript
const result = await client.withdraw("0.50", { chain: "baseSepolia" });
console.log(`Withdrew to ${result.destinationChain}`);
```

Cross-chain withdrawals use Gateway's minting infrastructure and are near-instant.

## Congratulations

You've completed the full buyer flow:

1. **Created** wallets and funded them with testnet USDC
2. **Deposited** USDC into Gateway (one-time on-chain transaction)
3. **Paid** for x402-protected resources with zero gas per payment
4. **Checked** your balances after payments
5. **Withdrew** USDC from Gateway back to your wallet

## Next Step

Test the full payment flow end-to-end to verify everything works correctly.
