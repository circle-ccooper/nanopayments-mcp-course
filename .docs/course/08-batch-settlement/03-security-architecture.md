# Security Architecture

Gateway's batching system is non-custodial. Gateway never has arbitrary control over user funds. The security model relies on three components.

## 1. Trusted Execution Environment (TEE)

Gateway uses an **AWS Nitro Enclave** — an isolated hardware enclave that runs code in a secure, tamper-proof environment. The TEE:

- Verifies every EIP-3009 signature before including it in a batch
- Computes net balance changes across all payments in the batch
- Signs the batch result with the enclave's private key

The enclave's signing key is protected by AWS KMS with attestation-based access policies. Only the audited enclave image can access the key. Even Circle operators cannot extract it outside the enclave.

## 2. On-Chain Verification

The Gateway Wallet smart contract verifies the TEE's signature before executing any batch. If the signature is invalid or comes from an unauthorized signer, the contract reverts. This ensures only correctly computed batches are applied on-chain.

## 3. Cryptographic Attestations

AWS Nitro Enclaves produce cryptographic attestation documents that prove the enclave is running a specific, audited code image. These attestations can be independently verified, providing transparency into the batching process.

## What This Means for Developers

- **Buyers** can only authorize payments they explicitly sign
- **Sellers** receive payments backed by verified, locked funds
- **Gateway** cannot move funds without valid buyer signatures and TEE verification
- **Settlement** is guaranteed once Gateway accepts an authorization

## Next Step

Learn about dispute resolution and non-repudiation.
