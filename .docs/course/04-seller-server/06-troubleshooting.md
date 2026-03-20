# Troubleshooting

If your seller server doesn't start or doesn't return the expected 402 responses, check the following.

1. That your `.env` file has `MERCHANT_WALLET_ADDRESS` set to a valid Ethereum address
2. That you started the server with `npx tsx --env-file=.env seller/server.ts`
3. That port 3000 is not already in use by another process
4. That `express` and `@circle-fin/x402-batching` are installed

Common issues include:

- **`Error: listen EADDRINUSE: address already in use :::3000`**: Another process is using port 3000. Kill it with `lsof -ti:3000 | xargs kill` (macOS/Linux) or change the port in your server code.
- **`Cannot find module 'express'`**: Express isn't installed. Run `npm install express @types/express`.
- **`TypeError: gateway.require is not a function`**: You may have imported incorrectly. Make sure you call `createGatewayMiddleware()` first and use its return value: `const gateway = createGatewayMiddleware({ sellerAddress: "0x..." })`.
- **Server starts but `curl` gets no response**: Make sure you're hitting the right URL. Check `http://localhost:3000/weather` (not just `http://localhost:3000/`).
- **402 response missing `accepts` array**: Check that `MERCHANT_WALLET_ADDRESS` is set in `.env`. The middleware needs a valid seller address to generate payment requirements.
- **`sellerAddress` is `undefined`**: You forgot the `--env-file=.env` flag when starting the server. Environment variables aren't loaded automatically — `tsx` needs the flag.

If you're having trouble, try running `curl -v http://localhost:3000/weather` (with `-v` for verbose output) to see the full HTTP response including headers and status code.

In the next module, you'll create wallets for the buyer and seller.
