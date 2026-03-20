# Protecting Routes with Payments

Use `gateway.require()` to protect any route with a price. When an unpaid request arrives, the middleware returns `402 Payment Required`. When a valid payment signature is attached, it verifies, settles, and calls `next()`.

## Add Protected Routes

```typescript
app.get("/weather", gateway.require("$0.001"), (req, res) => {
  const { payer, amount, network } = req.payment;
  console.log(`Paid ${amount} USDC by ${payer} on ${network}`);

  res.json({
    location: "San Francisco, CA",
    temperature: "68°F",
    conditions: "Partly cloudy",
    paid_by: payer,
  });
});

app.get("/premium-data", gateway.require("$0.01"), (req, res) => {
  const { payer, amount, network } = req.payment;
  console.log(`Paid ${amount} USDC by ${payer} on ${network}`);

  res.json({
    secret: "The treasure is hidden under the doormat.",
    paid_by: payer,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Seller server listening at http://localhost:${PORT}`);
});
```

## How `gateway.require()` Works

1. **Unpaid request** → Middleware returns `402 Payment Required` with an `accepts` array describing payment options (scheme, network, price, destination)
2. **Paid request** → Middleware reads the `PAYMENT-SIGNATURE` header, verifies it with Gateway, settles the payment, and attaches `req.payment` with:

| Field | Description |
|-------|-------------|
| `payer` | Buyer's wallet address |
| `amount` | Amount paid in USDC |
| `network` | Blockchain network the payment came from |
| `transaction` | Settlement transaction ID |
| `verified` | Boolean confirming payment was verified |

## Pricing

Pass a USD amount as a string: `"$0.001"`, `"$0.01"`, `"$1.00"`, etc. The SDK converts this to USDC atomic units (6 decimals) automatically.

## Next Step

Test the paywall by starting the server and sending requests.
