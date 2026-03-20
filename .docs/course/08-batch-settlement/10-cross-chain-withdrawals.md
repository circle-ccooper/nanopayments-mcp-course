# Cross-Chain Withdrawals

Just as deposits can come from any supported chain, withdrawals can go to any supported chain. A seller who received payments from Arc Testnet buyers can withdraw to Base Sepolia.

## Same-Chain Withdrawals

By default, `client.withdraw()` sends funds to your wallet on the same chain you initialized the client with:

```typescript
const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.MERCHANT_PRIVATE_KEY as `0x${string}`,
});

const result = await client.withdraw("5");
console.log(`Tx: ${result.mintTxHash}`);
```

Same-chain withdrawals are instant. The `mintTxHash` points to an on-chain transaction on Arc Testnet.

## Cross-Chain Withdrawals

To withdraw to a different chain, pass a `chain` option:

```typescript
const result = await client.withdraw("5", { chain: "baseSepolia" });
console.log(`Withdrew to ${result.destinationChain}`);
console.log(`Tx: ${result.mintTxHash}`);
```

Cross-chain withdrawals use Gateway's minting infrastructure. They are near-instant — typically completing within seconds.

## When to Use Cross-Chain Withdrawals

| Scenario | Recommendation |
|----------|---------------|
| Seller wants funds on a specific chain | Withdraw to that chain directly |
| Buyer wants to move funds between chains | Withdraw cross-chain instead of bridging manually |
| DeFi integration | Withdraw to the chain where you'll use the funds |

## Gas Considerations

Withdrawals are on-chain transactions that require gas. On Arc, USDC is the native gas token, so the withdrawing wallet needs a small USDC balance to cover gas fees. On other chains, you'll need the native gas token (ETH for Ethereum/Base/Arbitrum/OP, AVAX for Avalanche, etc.).

## Next Step

Learn about key management best practices for production deployments.
