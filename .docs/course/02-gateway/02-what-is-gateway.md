# How Circle Gateway Works

Circle Gateway is the infrastructure layer that enables cross-chain USDC and gasless nanopayments.

## Gateway Overview

When you deposit USDC into **Gateway Wallet** smart contracts, you create a unified balance that Circle tracks. This balance:

- Is accessible across multiple chains (Arc Testnet, Ethereum Sepolia, Avalanche Fuji, Base Sepolia, etc.)
- Powers gasless nanopayments via the x402 protocol
- Can be withdrawn back to your wallet on any supported chain

## How It Works

1. **Deposit** — Call `deposit()` on the Gateway Wallet contract (one-time on-chain transaction)
2. **Balance** — Circle credits your Gateway balance (tied to your depositor address)
3. **Pay** — Sign off-chain payment authorizations at zero gas cost
4. **Settle** — Gateway batches thousands of authorizations into a single on-chain transaction
5. **Withdraw** — Withdraw to your wallet on any supported blockchain

## Non-Custodial Security

Gateway uses a **Trusted Execution Environment (TEE)** — an AWS Nitro Enclave that:

- Verifies every payment signature before batching
- Computes net balance changes
- Signs the batch result with a protected enclave key

The Gateway Wallet smart contract verifies the TEE's signature before executing any batch. If the signature is invalid, the contract reverts. Even Circle operators cannot access the enclave's signing key.

## Gateway API

Circle provides a Gateway API for querying balances and managing operations:

- **Testnet URL:** `https://gateway-api-testnet.circle.com/v1`

## Next Step

Learn how batched settlement makes sub-cent payments economically viable.
