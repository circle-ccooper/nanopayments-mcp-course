# Troubleshooting

If you're confused about Gateway concepts covered in this module, this page addresses the most common questions and misconceptions.

1. Make sure you've read through all four lessons in this module before troubleshooting
2. Review the Gateway flow diagram in lesson 02 if the payment lifecycle is unclear
3. Check the supported networks list in lesson 04 for chain-specific questions

Common questions and clarifications:

- **"Is Gateway custodial?"**: No. Gateway uses a Trusted Execution Environment (TEE) with on-chain verification. The TEE can only execute batches that contain valid buyer signatures. Neither Circle nor Gateway operators can move funds without your signed authorization.
- **"Do I need to run Gateway myself?"**: No. Gateway is managed infrastructure provided by Circle. You interact with it through the SDK — you don't deploy or operate any Gateway components.
- **"What happens if Gateway goes down?"**: Payments require Gateway to be available for verification. If Gateway is temporarily unreachable, the seller middleware returns a 503 error. Funds in the Gateway Wallet contract remain safe regardless of Gateway uptime.
- **"Can I deposit on one chain and withdraw on another?"**: Yes. Gateway maintains a unified balance across all supported chains. You can deposit on Arc Testnet and withdraw on Base Sepolia.
- **"How long does batch settlement take?"**: Batch frequency varies, but payments are credited to the seller's Gateway balance immediately upon successful `settle()`. The on-chain batch settlement happens asynchronously.
- **"What's the difference between the Gateway Wallet and my wallet?"**: Your wallet is a standard Ethereum account (EOA) controlled by your private key. The Gateway Wallet is a smart contract where you deposit USDC. Your Gateway balance is tracked by this contract.

In the next module, you'll learn about the x402 protocol and SDK that you'll use to build the payment flow.
