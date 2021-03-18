// Setup Pact
const provider = new Pact({
  port: 1234,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "OrderWeb",
  provider: "OrderApi"
});

// Start the mock service!
await provider.setup()