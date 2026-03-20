# Key Management

Private key security is the most critical aspect of any production nanopayment deployment. A compromised key means an attacker can authorize payments from the buyer's Gateway balance or receive funds intended for the seller.

## Development vs. Production

| Environment | Approach |
|-------------|----------|
| **Development** | `.env` file with `CONSUMER_PRIVATE_KEY` / `MERCHANT_PRIVATE_KEY` |
| **Staging** | Environment variables injected by CI/CD (never committed to source) |
| **Production** | Hardware Security Module (HSM) or Key Management Service (KMS) |

## Production Key Management Options

### Cloud KMS

Use your cloud provider's key management service to sign transactions without exposing the private key:

- **AWS KMS** — Create an asymmetric signing key, use the AWS SDK to sign EIP-3009 messages
- **Google Cloud KMS** — Similar approach with GCP's key management API
- **Azure Key Vault** — Managed HSM-backed keys with audit logging

### Hardware Security Modules (HSMs)

For the highest security, use a dedicated HSM that holds the private key in tamper-resistant hardware. The key never leaves the device.

### MPC Wallets

Multi-party computation (MPC) wallets split the key across multiple parties. No single party holds the complete key, providing both security and redundancy.

## Key Rotation

Plan for key rotation from the start:

1. **Generate new keys** using your KMS/HSM
2. **Update Gateway** — withdraw from the old key's balance, deposit with the new key
3. **Update seller configuration** — change `sellerAddress` in your middleware
4. **Decommission old keys** — after confirming all pending settlements have completed

## Separation of Concerns

Use different keys for different roles:

| Role | Key purpose |
|------|------------|
| **Buyer signing key** | Signs EIP-3009 payment authorizations |
| **Seller receiving address** | Receives payment credits in Gateway |
| **Operations key** | Manages deposits and withdrawals |

This limits blast radius — compromising the seller address doesn't give access to buyer funds, and vice versa.

## Next Step

Learn about monitoring and alerting for production systems.
