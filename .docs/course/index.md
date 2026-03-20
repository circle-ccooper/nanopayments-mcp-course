# Circle Nanopayments Developer Course

Learn how to build a nanopayment system using USDC, Circle Gateway, and the x402 protocol. By the end of this course, you'll have a working system where a seller API charges sub-cent USDC amounts per request and a buyer pays gaslessly via signed authorizations.

## Modules

### Module 1: Introduction
Set up your development environment and understand the foundations — nanopayments, USDC, and the technology stack.

- What nanopayments are and why they matter
- How USDC works on Arc Testnet
- Project setup and dependency installation

### Module 2: Circle Gateway
Understand the infrastructure layer that makes gasless nanopayments possible through batched settlement.

- How Gateway creates unified USDC balances
- Batched settlement economics
- Supported networks and contract addresses

### Module 3: x402 SDK
Explore the server and client SDKs that power the payment flow.

- The x402 HTTP payment protocol
- Server SDK for building paywalled APIs
- Client SDK for making payments

### Module 4: Seller Server
Build an Express API that accepts gasless USDC payments using x402 middleware.

- Why the middleware architecture works
- Creating the server and protecting routes
- Testing the paywall

### Module 5: Creating Your Wallet
Generate wallets with private keys for the buyer and seller roles.

- How Ethereum wallets work
- Generating and verifying wallet key pairs
- Storing keys safely in `.env`

### Module 6: Funding Gateway
Fund your wallet with testnet USDC and deposit into Circle Gateway.

- Requesting tokens from the Circle faucet
- Checking on-chain balances
- Depositing into the Gateway Wallet contract

### Module 7: Paying the Paywall
Use the buyer client to pay for x402-protected resources with gasless nanopayments.

- Understanding the payment flow
- Making payments and checking balances
- Error handling and withdrawals

### Module 8: Batch Settlement & Advanced Topics
Deep dive into settlement mechanics, security, cross-chain capabilities, and production best practices.

- Payment verification and settlement lifecycle
- Security architecture (TEE + on-chain verification)
- Cross-chain deposits and withdrawals
- Key management, monitoring, and pricing strategies
- Error handling and troubleshooting

## Prerequisites

- Node.js 18+
- Basic TypeScript/JavaScript knowledge
- Basic understanding of blockchain concepts (wallets, transactions)

## Resources

- [Circle Nanopayments Docs](https://developers.circle.com/gateway/nanopayments)
- [x402 Protocol](https://www.x402.org)
- [SDK Reference](https://developers.circle.com/gateway/nanopayments/references/sdk)
- [Circle Developer Discord](https://discord.com/invite/buildoncircle)
