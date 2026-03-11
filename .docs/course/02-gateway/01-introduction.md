# Understanding Circle Gateway

Before building anything, let's understand the infrastructure that makes gasless nanopayments possible.

## What You'll Learn

- How Circle Gateway creates unified USDC balances
- How batched settlement makes sub-cent payments economically viable
- Which networks and contracts are supported

## Key Concepts

| Component | Role |
|-----------|------|
| **Circle Gateway** | Infrastructure layer that pools USDC deposits and settles payments in batches |
| **Gateway Wallet** | Smart contract where users deposit USDC |
| **Trusted Execution Environment (TEE)** | Secure hardware enclave that verifies signatures and computes batch settlements |

## Next Step

Learn how Circle Gateway works under the hood.
