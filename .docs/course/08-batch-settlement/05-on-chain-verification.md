# On-Chain Verification

The Gateway Wallet smart contract is the final line of defense. Even if every other component were compromised, the contract enforces correctness on-chain.

## How the Contract Works

When a batch is submitted to the Gateway Wallet contract:

1. The contract receives the batch data (net balance changes for all participants)
2. The contract receives the TEE's cryptographic signature over that batch
3. The contract verifies the signature against the registered TEE signer address
4. If valid, the contract executes the balance changes atomically
5. If invalid, the entire transaction reverts — no funds move

## Why This Matters

The on-chain verification creates a **trust boundary**:

| Layer | Trust assumption |
|-------|-----------------|
| **Buyer** | Only needs to trust their own private key |
| **Seller** | Only needs to trust the SDK and Gateway API |
| **Gateway (off-chain)** | Could be compromised without affecting on-chain safety |
| **Smart contract** | Enforces that only TEE-signed batches execute |

Even if an attacker gained access to Gateway's off-chain infrastructure, they cannot forge the TEE's signature. The contract would reject any batch not signed by the enclave.

## Attestation Verification

Anyone can verify that the TEE is running the expected code by checking the attestation document:

- The attestation contains a hash of the enclave image (the code running inside)
- This hash can be compared against the published, audited source code
- AWS KMS ensures the signing key is only accessible to the attested enclave

This provides **transparency** — you don't have to trust Circle's word that the TEE is running the right code. You can verify it cryptographically.

## Implications for Your Application

As a developer building on nanopayments:

- You don't need to implement any verification logic yourself — the SDK and contract handle it
- Your seller middleware can trust `req.payment` — if the middleware calls `next()`, the payment is verified
- Your buyer can trust that their funds are only used for payments they explicitly signed
- Settlement is guaranteed once Gateway returns a success response from `settle()`

## Next Step

Learn about dispute resolution and non-repudiation.
