# Module 5: Creating Your Wallet

Generate wallets with private keys for the buyer and seller using viem.

## Lessons

1. **Creating Your Wallet** — Why wallets and private keys matter for EIP-3009 authorizations
2. **Understanding Blockchain Wallets** — Key pairs, EOAs, and viem basics
3. **Creating Consumer and Merchant Wallets** — Generate two wallets and save to `.env`
4. **Verifying Your Wallets** — Confirm private keys derive the expected addresses
5. **Troubleshooting** — Wallet creation and verification issues

## Key Concepts

- A wallet is a key pair: private key (secret) + address (public)
- The `GatewayClient` needs a private key to sign EIP-3009 payment authorizations
- Consumer wallet = buyer/payer; Merchant wallet = seller/receiver
- Never share or commit private keys
