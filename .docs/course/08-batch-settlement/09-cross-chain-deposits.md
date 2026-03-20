# Cross-Chain Deposits

One of Gateway's key features is that deposits and payments can happen on different blockchains. A buyer who deposits on Base Sepolia can pay a seller who operates on Arc Testnet.

## How Cross-Chain Deposits Work

The buyer deposits USDC on their preferred chain. The `GatewayClient` is initialized with a `chain` parameter that determines the deposit chain:

```typescript
const client = new GatewayClient({
  chain: "baseSepolia",
  privateKey: process.env.CONSUMER_PRIVATE_KEY as `0x${string}`,
});
await client.deposit("10");
```

Once deposited, the Gateway balance can be used to pay sellers on **any** supported chain. Gateway maintains a unified balance that is chain-agnostic.

## Supported Chains

| Chain | SDK Name |
|-------|----------|
| Arc Testnet | `arcTestnet` |
| Ethereum Sepolia | `sepolia` |
| Avalanche Fuji | `avalancheFuji` |
| Base Sepolia | `baseSepolia` |
| Arbitrum Sepolia | `arbitrumSepolia` |
| OP Sepolia | `optimismSepolia` |
| Polygon Amoy | `polygonAmoy` |
| World Chain Sepolia | `worldChainSepolia` |
| Unichain Sepolia | `unichainSepolia` |
| Sonic Testnet | `sonicTestnet` |
| Sei Atlantic | `seiAtlantic` |
| HyperEVM Testnet | `hyperEvmTestnet` |

## Universal Payments

The seller doesn't need to care which chain the buyer deposited on. The middleware accepts payments from **all** supported chains by default. To restrict which chains your seller accepts:

```typescript
const gateway = createGatewayMiddleware({
  sellerAddress: "0x...",
  networks: ["eip155:5042002"],
});
```

## Next Step

Learn about cross-chain withdrawals.
