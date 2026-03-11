# @circle-developer/nanopayments-mcp-course

An interactive MCP (Model Context Protocol) server that teaches developers how to build nanopayment systems using Circle's infrastructure — USDC stablecoins, the x402 protocol, and Circle Gateway.

## What You'll Learn

This course walks you through building a complete nanopayment system:

1. **Introduction** — What nanopayments are, how USDC enables sub-cent payments
2. **Gateway** — How Circle Gateway pools deposits and settles in batches
3. **x402 SDK** — The server and client SDKs that power the payment flow
4. **Seller Server** — Build an Express API with an x402 payment paywall
5. **Wallet** — Generate wallets with private keys using viem
6. **Funding** — Fund wallets with testnet USDC and deposit into Gateway
7. **Paying** — Pay for x402-protected resources with gasless nanopayments
8. **Settlement** — Batch settlement, verification, security, and production concerns

## Usage

### With Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "circle-nanopayments": {
      "command": "npx",
      "args": ["-y", "github:circle-ccooper/nanopayments-mcp-course"]
    }
  }
}
```

Then tell the AI assistant: **"start the Circle course"**

### With Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "circle-nanopayments": {
      "command": "npx",
      "args": ["-y", "github:circle-ccooper/nanopayments-mcp-course"]
    }
  }
}
```

### From source

```bash
git clone https://github.com/circle-ccooper/nanopayments-mcp-course.git
cd nanopayments-mcp-course
npm install
node dist/stdio.js
```

## Available Tools

### Interactive Course

| Tool | Description |
|------|-------------|
| `startCircleCourse` | Start or resume the course |
| `getCircleCourseStatus` | View progress |
| `startCircleCourseLesson` | Jump to a specific lesson |
| `nextCircleCourseStep` | Advance to the next step |
| `clearCircleCourseHistory` | Reset all progress |

### Documentation

| Tool | Description |
|------|-------------|
| `circleDocs` | Browse course documentation by path |
| `searchCircleDocs` | Search across all documentation |

## Project Structure

The course guides you to build a project with this structure:

```
project/
├── buyer/           # Buyer/consumer scripts
│   ├── deposit.ts   # Deposit USDC into Gateway
│   ├── pay.ts       # Pay for x402 resources
│   └── balance.ts   # Check Gateway balances
├── seller/          # Seller/merchant scripts
│   ├── server.ts    # Express server with x402 paywall
│   └── withdraw.ts  # Withdraw earnings from Gateway
├── scripts/         # Utility scripts
│   ├── create-wallets.ts
│   ├── verify-wallets.ts
│   └── check-balance.ts
├── .env
├── package.json
└── tsconfig.json
```

## Testing

```bash
cd package
npm install
npm test
```

## Publishing

To publish to npm:

```bash
cd package
npm login
npm publish --access public
```

## Prerequisites

- Node.js 18+
- An MCP-compatible client (Cursor, Claude Desktop, VS Code, etc.)

## Resources

- [Circle Nanopayments Docs](https://developers.circle.com/gateway/nanopayments)
- [x402 Protocol](https://www.x402.org)
- [SDK Reference](https://developers.circle.com/gateway/nanopayments/references/sdk)
- [USDC Faucet](https://faucet.circle.com)
- [Circle Developer Discord](https://discord.com/invite/buildoncircle)

## License

MIT
