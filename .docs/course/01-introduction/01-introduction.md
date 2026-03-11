# Getting Started with Circle Nanopayments

Welcome to the Circle Nanopayments developer course! In this course, you'll learn how to build a nanopayments system using USDC on-chain via Circle's infrastructure.

## What You'll Build

By the end of this course, you'll have a working **nanopayment system** where:

- A **seller API** charges tiny USDC amounts (e.g., $0.001) for each API request
- A **buyer/agent** pays for those resources gaslessly via signed authorizations
- **Settlement** happens in batches to minimize on-chain costs

## Course Flow

| Module | Topic | What You'll Learn |
|--------|-------|-------------------|
| 1 | Introduction | What nanopayments are, USDC basics, project setup |
| 2 | Circle Gateway | How Gateway enables gasless payments and batched settlement |
| 3 | x402 Batching SDK | The server and client SDKs that power the payment flow |
| 4 | Seller Server | Build an Express API with an x402 payment paywall |
| 5 | Creating Your Wallet | Generate wallets with private keys using viem |
| 6 | Funding Gateway | Fund your wallet and deposit USDC into Gateway |
| 7 | Paying the Paywall | Use the buyer client to pay for protected resources |
| 8 | Batch Settlement | How settlement works, verification, security, and next steps |

## How This Course Works

You'll start with the **concepts** (Modules 1–3) to understand how nanopayments, Gateway, and x402 fit together. Then you'll build the **seller** side first (Module 4), create and fund a **buyer wallet** (Modules 5–6), **pay for resources** (Module 7), and finally understand **settlement and security** (Module 8).

All examples use **Arc Testnet** with `viem` for wallet management and `@circle-fin/x402-batching` for Gateway interactions.

Let's get started!
