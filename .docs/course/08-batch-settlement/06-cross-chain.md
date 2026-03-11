# Cross-Chain Capabilities

One of Gateway's key features is that deposits and withdrawals can happen on different blockchains. A buyer who deposits on Arc Testnet can pay a seller who withdraws on Base Sepolia.

## Cross-Chain Deposits

The buyer deposits USDC on their preferred chain. The `GatewayClient` is initialized with a `chain` parameter:

```typescript
const client = new GatewayClient({
  chain: "baseSepolia",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});
await client.deposit("10");
```

Once deposited, the Gateway balance can be used to pay sellers on **any** supported chain.

## Cross-Chain Withdrawals

Sellers (and buyers) can withdraw to any supported chain:

```typescript
const result = await client.withdraw("5", { chain: "baseSepolia" });
console.log(`Withdrew to ${result.destinationChain}`);
console.log(`Tx: ${result.mintTxHash}`);
```

Same-chain withdrawals are instant. Cross-chain withdrawals use Gateway's minting infrastructure and are near-instant.

## Supported Chains

| Chain | SDK Name |
|-------|----------|
| Arc Testnet | `arcTestnet` |
| Ethereum Sepolia | `sepolia` |
| Avalanche Fuji | `avalancheFuji` |
| Base Sepolia | `baseSepolia` |

## Universal Payments

The seller doesn't need to care which chain the buyer deposited on. The middleware accepts payments from **all** supported chains by default. To restrict:

```typescript
const gateway = createGatewayMiddleware({
  sellerAddress: "0x...",
  networks: ["eip155:5042002"],
});
```

## Next Step

Review production considerations before deploying.
