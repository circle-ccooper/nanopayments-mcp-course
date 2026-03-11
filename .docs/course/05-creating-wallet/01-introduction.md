# Creating Your Wallet

To interact with Circle Gateway — both as a seller receiving payments and as a buyer making payments — you need a wallet with a private key.

## What You'll Learn

- What blockchain wallets are and how they work
- How to generate wallets using viem
- How to verify your wallet configuration

## Why a Private Key?

The `GatewayClient` needs a private key to sign **EIP-3009 payment authorizations** off-chain. These signed messages prove that a buyer authorized a payment without requiring an on-chain transaction for each payment.

In production, the signer could be an AI agent, a backend service, or a user's browser wallet.

## Next Step

Learn how blockchain wallets work before generating yours.
