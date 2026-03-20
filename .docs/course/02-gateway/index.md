# Module 2: Circle Gateway

Understand the infrastructure layer that enables gasless nanopayments and batched settlement.

## Lessons

1. **Understanding Circle Gateway** — Overview of Gateway, Gateway Wallet, and TEE components
2. **How Circle Gateway Works** — Deposit, balance, pay, settle, and withdraw flow
3. **How Batched Settlement Works** — Economics of batching and the payment lifecycle
4. **Contract Addresses & Supported Networks** — Arc Testnet contracts and all supported chains
5. **Troubleshooting** — Common Gateway concept questions and clarifications

## Key Concepts

- Gateway pools USDC deposits and settles payments in batches to minimize gas costs
- A Trusted Execution Environment (TEE) verifies signatures and signs batches
- Gateway is non-custodial — funds can only move with valid buyer signatures
- Deposits and withdrawals can happen on different blockchains
