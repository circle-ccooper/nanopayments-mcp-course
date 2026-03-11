# Contract Addresses & Supported Networks

Reference information for Arc Testnet contract addresses and all supported nanopayment networks.

## Arc Testnet Addresses

| Contract | Address |
|----------|---------|
| Gateway Wallet | `0x0077777d7EBA4688BDeF3E311b846F25870A19B9` |
| Gateway Minter | `0x0022222ABE238Cc2C7Bb1f21003F0a260052475B` |
| USDC | `0x3600000000000000000000000000000000000000` |

## Supported Testnet Networks

Nanopayments supports deposits, gas-free payments, and withdrawals on these networks:

| Network | `SupportedChainName` | Domain |
|---------|---------------------|--------|
| Arc Testnet | `arcTestnet` | 26 |
| Arbitrum Sepolia | `arbitrumSepolia` | 3 |
| Avalanche Fuji | `avalancheFuji` | 1 |
| Base Sepolia | `baseSepolia` | 6 |
| Ethereum Sepolia | `sepolia` | 0 |
| HyperEVM Testnet | `hyperEvmTestnet` | 19 |
| OP Sepolia | `optimismSepolia` | 2 |
| Polygon Amoy | `polygonAmoy` | 7 |
| Sei Atlantic | `seiAtlantic` | 16 |
| Sonic Testnet | `sonicTestnet` | 13 |
| Unichain Sepolia | `unichainSepolia` | 10 |
| World Chain Sepolia | `worldChainSepolia` | 14 |

See the full list at [Gateway Supported Blockchains](https://developers.circle.com/gateway/references/supported-blockchains).

## Cross-Chain Capability

A buyer can deposit USDC on **any** supported chain and pay sellers on **any** supported chain. Gateway handles the cross-chain routing. Same-chain withdrawals are instant; cross-chain withdrawals use Gateway's minting infrastructure.

## Next Step

Now let's dive into the x402 Batching SDK that you'll use to build sellers and buyers.
