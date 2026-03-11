# Requesting Testnet Tokens

Before your wallet can deposit into Gateway, it needs USDC. On Arc Testnet, you can request free testnet USDC through the **Circle Faucet**.

Since USDC is the **native gas token** on Arc, it covers both payments and transaction fees — there is no separate token to acquire.

## Step 1: Open the Faucet

Go to the [Circle Faucet](https://faucet.circle.com).

No account is required for the public faucet. It distributes **20 USDC per request**.

## Step 2: Fund the Consumer Wallet

1. Copy your `CONSUMER_WALLET_ADDRESS` from your `.env` file
2. Select **Arc Testnet** as the network
3. Paste the address and request USDC

The consumer wallet needs USDC to deposit into Gateway and cover the gas fee for the deposit transaction.

## What About the Merchant Wallet?

The merchant wallet does **not** need to be funded. The seller server only uses the merchant **address** for `createGatewayMiddleware` — Gateway credits payments to the seller's Gateway balance automatically. The merchant can withdraw later if needed.

## Why Only USDC?

On most EVM chains you need two tokens: a native token for gas (e.g., ETH) and a stablecoin for payments. Arc simplifies this — USDC is the native gas token, so a single token handles everything.

## Faucet Limits

The public faucet allows one request per token/network pairing every **2 hours**. Each request sends 20 USDC, which is more than enough for this course.

## Timing

Tokens may take a few seconds to arrive. If your balances don't appear right away, wait briefly and check again in the next lesson.

## Next Step

Verify your wallet balance on-chain using viem.
