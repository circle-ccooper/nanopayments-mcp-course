# Client SDK: `@circle-fin/x402-batching/client`

The client SDK provides everything a buyer needs to deposit USDC, pay for resources, and manage their Gateway balance.

## `GatewayClient`

The primary entry point for buyers. Initialized with a private key for signing payment authorizations:

```typescript
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.BUYER_PRIVATE_KEY as `0x${string}`,
});
```

### Configuration

| Parameter | Required | Description |
|-----------|----------|-------------|
| `chain` | Yes | Blockchain to connect to (`"arcTestnet"`, `"baseSepolia"`, etc.) |
| `privateKey` | Yes | Wallet private key for signing authorizations |
| `rpcUrl` | No | Custom RPC URL |

## Key Methods

### `client.deposit(amount)`

Deposits USDC from the wallet into Gateway. Handles ERC-20 approval automatically:

```typescript
const deposit = await client.deposit("1"); // deposit 1 USDC
console.log(`Deposit tx: ${deposit.depositTxHash}`);
```

### `client.pay(url, options?)`

Pays for an x402-protected resource. Handles the full 402 negotiation flow automatically:

```typescript
const { data, status, formattedAmount } = await client.pay(url);
```

1. Sends a request to the URL
2. Receives `402 Payment Required` with payment details
3. Signs an EIP-3009 authorization off-chain (zero gas)
4. Retries the request with the `PAYMENT-SIGNATURE` header
5. Returns the response data

### `client.getBalances()`

Returns both wallet and Gateway balances:

```typescript
const balances = await client.getBalances();
console.log(`Wallet: ${balances.wallet.formatted}`);
console.log(`Gateway: ${balances.gateway.formattedAvailable} USDC`);
```

| Field | Description |
|-------|-------------|
| `wallet.balance` | USDC in the on-chain wallet |
| `gateway.available` | Spendable Gateway balance |
| `gateway.total` | Total Gateway balance (including pending) |

### `client.withdraw(amount, options?)`

Withdraws USDC from Gateway back to the wallet:

```typescript
const result = await client.withdraw("5");
console.log(`Withdrew ${result.formattedAmount} USDC`);
```

### `client.supports(url)`

Checks if a URL supports Gateway batched payments:

```typescript
const support = await client.supports(url);
if (!support.supported) {
  console.log("URL does not support Gateway payments");
}
```

## Next Step

Now that you understand the SDK, let's build the seller server.
