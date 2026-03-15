const MARKDOWN = `# camelai.io — x402 API Network

Pay-per-request APIs for AI agents. No API keys, no subscriptions — just USDC micropayments on Base via the [x402 protocol](https://x402.org).

Every service accepts natural language. Just POST \`{"input": "what you want"}\` and an LLM extracts the right parameters for you.

## Services

| Service | Domain | Price | Example Input |
|---------|--------|-------|---------------|
| QR Code | [qr.camelai.io](https://qr.camelai.io) | $0.001 | "make a QR code for https://example.com" |
| Screenshot | [screenshot.camelai.io](https://screenshot.camelai.io) | $0.005 | "screenshot https://example.com as pdf" |
| Email Verify | [verify.camelai.io](https://verify.camelai.io) | $0.001 | "is test@example.com a real address?" |
| DNS Lookup | [dns.camelai.io](https://dns.camelai.io) | $0.001 | "DNS records for example.com" |
| Web Scraper | [scraper.camelai.io](https://scraper.camelai.io) | $0.005 | "scrape the main content from https://example.com" |
| Geocoding | [geo.camelai.io](https://geo.camelai.io) | $0.001 | "coordinates for 1600 Amphitheatre Parkway" |
| Image Resize | [resize.camelai.io](https://resize.camelai.io) | $0.001 | "resize https://example.com/photo.jpg to 200x200" |
| URL Shortener | [link.camelai.io](https://link.camelai.io) | $0.001 | "shorten https://example.com/very/long/path" |
| Image Gen | [imagegen.camelai.io](https://imagegen.camelai.io) | $0.01 | "a sunset over mountains in watercolor style" |
| Disposable Email | [inbox.camelai.io](https://inbox.camelai.io) | $0.001 | "create a temporary inbox" |
| SMS Send | [sms.camelai.io](https://sms.camelai.io) | $0.01 | "send hello to +15551234567" |
| PDF to Text | [pdf.camelai.io](https://pdf.camelai.io) | $0.005 | "extract text from https://example.com/doc.pdf" |
| GPU | [gpu.camelai.io](https://gpu.camelai.io) | $0.50 | "spin up an A100 with pytorch image" |
| VPS | [vps.camelai.io](https://vps.camelai.io) | $0.10 | "create a small server in us-east for 60 minutes" |
| Browser Session | [browser.camelai.io](https://browser.camelai.io) | $0.02 | POST /session (no input) returns CDP websocket for Puppeteer/Playwright. POST / for natural language actions. |
| Deploy Worker | [deploy.camelai.io](https://deploy.camelai.io) | $0.01 | "deploy this worker that returns hello world" |
| File Upload | [files.camelai.io](https://files.camelai.io) | $0.001 | Upload raw file body, get a temporary signed URL (1hr) |

## How It Works

1. \`POST\` to any service with \`{"input": "your request in plain English"}\`
2. Receive a \`402 Payment Required\` response with payment details
3. Sign a USDC payment on Base using your wallet
4. Resend the request with the payment header
5. An LLM interprets your input, extracts the parameters, and returns the result

## Quick Start (Node.js)

\`\`\`js
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(YOUR_PRIVATE_KEY);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const pay = wrapFetchWithPayment(fetch, client);

const res = await pay("https://qr.camelai.io", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: "QR code for https://example.com" }),
});
\`\`\`

## Quick Start (purl CLI)

\`\`\`bash
purl -X POST -d '{"input": "QR code for https://example.com"}' https://qr.camelai.io
\`\`\`

## Details

- **Input:** All services accept \`POST /\` with \`{"input": "natural language"}\`
- **Network:** Base (Chain ID 8453)
- **Currency:** USDC
- **Facilitator:** Coinbase CDP (fee-free, KYT/OFAC compliant)
- **OpenAPI:** Each service exposes \`/.well-known/openapi.json\`
- **Bazaar:** All services are discoverable via the [CDP Bazaar](https://docs.cdp.coinbase.com/x402/bazaar)
- **File Uploads:** Need to pass a local file to a service? Upload it to [files.camelai.io](https://files.camelai.io) first to get a temporary URL, then pass that URL in your input.

## Payment Methods

camelai.io supports two ways to pay for API requests:

### x402 (Crypto — USDC on Base)

The native payment method. Your agent signs a USDC micropayment on Base for each request — no API keys, no accounts, no subscriptions. This is the default and recommended method for AI agents.

- **Currency:** USDC on Base (Chain ID 8453)
- **Cost:** Fractions of a cent per request
- **Libraries:** [\`@x402/fetch\`](https://www.npmjs.com/package/@x402/fetch) + [\`@x402/evm\`](https://www.npmjs.com/package/@x402/evm) (Node.js) or [\`purl\`](https://github.com/nichochar/purl) (CLI)

### Stripe (Credit Card)

Prefer traditional payments? Purchase API credits with a credit card via Stripe. You'll get an API key that works on all services — no wallet needed.

- **Tiers:** $5 / $20 / $100 (one-time credit purchase)
- **Usage:** Add \`Authorization: Bearer <your-api-key>\` to requests
- **Checkout:** [Buy $5 credits](https://camelai.io/checkout?amount=5) · [Buy $20 credits](https://camelai.io/checkout?amount=20) · [Buy $100 credits](https://camelai.io/checkout?amount=100)

## Setting Up an x402 Wallet for Your Agent

Agents need their own wallet to sign x402 payments. You fund the agent's wallet from your personal wallet — never give the agent your own private key.

### For Agents: Create a Wallet

\`\`\`js
// npm install viem
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log("Address:", account.address);  // Send USDC here
console.log("Private Key:", privateKey);    // Store securely (env var, secret manager)
\`\`\`

You can also use [\`purl\`](https://github.com/stripe/purl) to create and manage wallets from the CLI: \`purl wallet add --type evm\`

### Fund the Agent's Wallet with USDC

The easiest way to buy and send USDC is the **Base** app (formerly Coinbase Wallet):

1. **Download** the Base app — [iOS](https://apps.apple.com/app/coinbase-wallet-nfts-crypto/id1278383455) · [Android](https://play.google.com/store/apps/details?id=org.toshi)
2. **Create a wallet** and back up your recovery phrase
3. **Buy USDC** — tap Buy → select USDC → make sure the network is **Base** → pay with Apple Pay, Google Pay, or a debit card
4. **Send USDC to your agent** — tap Send → paste your agent's wallet address → choose an amount ($5–$10 is plenty to start)

USDC arrives in the agent's wallet within seconds.

> **Tip:** Only send what the agent needs. You can always top up later.

### Start Making Requests

\`\`\`js
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(process.env.AGENT_WALLET_PRIVATE_KEY);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const pay = wrapFetchWithPayment(fetch, client);

const res = await pay("https://qr.camelai.io", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: "QR code for https://example.com" }),
});
\`\`\`

Built by [qaml-ai](https://github.com/qaml-ai)
`;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>camelai.io — x402 API Network</title>
  <style>
    body { max-width: 900px; margin: 40px auto; padding: 0 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #1a1a2e; background: #fafafa; line-height: 1.6; }
    h1 { border-bottom: 2px solid #e0e0e0; padding-bottom: 12px; }
    h2 { margin-top: 2em; color: #16213e; }
    a { color: #0f3460; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 14px; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #16213e; color: white; }
    tr:nth-child(even) { background: #f2f2f2; }
    code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
    pre { background: #1a1a2e; color: #e0e0e0; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; color: inherit; padding: 0; }
    .toolbar { display: flex; gap: 8px; margin-bottom: 16px; }
    .toolbar a, .toolbar button { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid #ccc; border-radius: 6px; background: white; color: #1a1a2e; font-size: 13px; text-decoration: none; cursor: pointer; font-family: inherit; }
    .toolbar a:hover, .toolbar button:hover { background: #f0f0f0; }
    .toolbar button.copied { background: #16213e; color: white; border-color: #16213e; }
  </style>
</head>
<body>
  <div class="toolbar">
    <button id="copy-md" onclick="navigator.clipboard.writeText(MD).then(()=>{this.textContent='Copied!';this.classList.add('copied');setTimeout(()=>{this.textContent='Copy as Markdown';this.classList.remove('copied')},2000)})">Copy as Markdown</button>
    <a href="/?format=markdown">View as Markdown</a>
  </div>
  <div id="content"></div>
</body>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script>
  const MD = ${JSON.stringify(MARKDOWN)};
  document.getElementById('content').innerHTML = marked.parse(MD);
</script>
</html>`;

const SERVICES = [
  { name: "QR Code", domain: "qr.camelai.io", price: "$0.001", description: "Generate QR codes from text (SVG)", example: "make a QR code for https://example.com" },
  { name: "Screenshot", domain: "screenshot.camelai.io", price: "$0.005", description: "Capture website screenshots (PNG/PDF)", example: "screenshot https://example.com as pdf" },
  { name: "Email Verify", domain: "verify.camelai.io", price: "$0.001", description: "Validate email addresses", example: "is test@example.com a real address?" },
  { name: "DNS Lookup", domain: "dns.camelai.io", price: "$0.001", description: "DNS records and WHOIS data", example: "DNS records for example.com" },
  { name: "Web Scraper", domain: "scraper.camelai.io", price: "$0.005", description: "Extract content from web pages", example: "scrape the main content from https://example.com" },
  { name: "Geocoding", domain: "geo.camelai.io", price: "$0.001", description: "Address to coordinates and reverse", example: "coordinates for 1600 Amphitheatre Parkway" },
  { name: "Image Resize", domain: "resize.camelai.io", price: "$0.001", description: "Resize images by URL", example: "resize https://example.com/photo.jpg to 200x200" },
  { name: "URL Shortener", domain: "link.camelai.io", price: "$0.001", description: "Shorten URLs", example: "shorten https://example.com/very/long/path" },
  { name: "Image Gen", domain: "imagegen.camelai.io", price: "$0.01", description: "Generate images from text prompts", example: "a sunset over mountains in watercolor style" },
  { name: "Disposable Email", domain: "inbox.camelai.io", price: "$0.001", description: "Create temporary email inboxes", example: "create a temporary inbox" },
  { name: "SMS Send", domain: "sms.camelai.io", price: "$0.01", description: "Send SMS messages", example: "send hello to +15551234567" },
  { name: "PDF to Text", domain: "pdf.camelai.io", price: "$0.005", description: "Extract text from PDFs", example: "extract text from https://example.com/doc.pdf" },
  { name: "GPU", domain: "gpu.camelai.io", price: "$0.50", description: "Provision GPU instances", example: "spin up an A100 with pytorch image" },
  { name: "VPS", domain: "vps.camelai.io", price: "$0.10", description: "Provision virtual servers", example: "create a small server in us-east for 60 minutes" },
  { name: "Browser Session", domain: "browser.camelai.io", price: "$0.02", description: "Headless browser automation. POST /session (no input) returns a CDP websocket endpoint for Puppeteer/Playwright. POST / accepts natural language for actions (navigate, click, type, screenshot, close).", example: "POST /session to get ws_endpoint, or POST / with {\"input\": \"navigate to https://example.com\"}" },
  { name: "Deploy Worker", domain: "deploy.camelai.io", price: "$0.01", description: "Deploy Cloudflare Workers", example: "deploy this worker that returns hello world" },
  { name: "File Upload", domain: "files.camelai.io", price: "$0.001", description: "Upload files and get temporary signed URLs (1hr). Use this to get a URL for services that accept file URLs (e.g. image-resize, pdf-to-text).", example: "POST raw file body with Content-Type header" },
];

const SERVICES_JSON = JSON.stringify({
  name: "camelai.io",
  description: "Pay-per-request APIs for AI agents via x402 micropayments on Base",
  protocol: "x402",
  network: "eip155:8453",
  currency: "USDC",
  input: { method: "POST", path: "/", contentType: "application/json", body: { input: { type: "string", description: "Natural language request interpreted by an LLM", required: true } } },
  services: SERVICES.map(s => ({ ...s, url: `https://${s.domain}`, openapi: `https://${s.domain}/.well-known/openapi.json` })),
}, null, 2);

function prefersMarkdown(request: Request): boolean {
  const accept = request.headers.get("Accept") || "";
  let mdQ = 0;
  let htmlQ = 0;
  for (const part of accept.split(",")) {
    const trimmed = part.trim();
    const q = parseFloat(trimmed.match(/;\s*q=(\d+\.?\d*)/)?.[1] ?? "1");
    if (trimmed.startsWith("text/markdown")) mdQ = q;
    else if (trimmed.startsWith("text/html")) htmlQ = q;
  }
  return mdQ > 0 && mdQ >= htmlQ;
}

interface StripeConfig {
  creditPrices: Record<string, { priceId: string; amountCents: number }>;
  meteredPriceIds: string[];
  successPath: string;
  isTest: boolean;
}

const LIVE_CONFIG: StripeConfig = {
  creditPrices: {
    "5":   { priceId: "price_1TB2vTGvliMKf4vHQD3bTr2v", amountCents: 500 },
    "20":  { priceId: "price_1TB2vTGvliMKf4vHEESUbsLA", amountCents: 2000 },
    "100": { priceId: "price_1TB2vUGvliMKf4vH15ydccjm", amountCents: 10000 },
  },
  meteredPriceIds: [
    "price_1TB2GUGvliMKf4vHkwpys9JT", "price_1TB2GUGvliMKf4vHRo4QmTBB",
    "price_1TB2GTGvliMKf4vHqmokIolG", "price_1TB2GTGvliMKf4vH8xRX7ZTn",
    "price_1TB2GTGvliMKf4vHX573fEmF", "price_1TB2GSGvliMKf4vHv0TvJ0Pj",
    "price_1TB2GSGvliMKf4vHk5bsYv32", "price_1TB2GSGvliMKf4vHmL2jmiLT",
    "price_1TB2GRGvliMKf4vHEjp83bFX", "price_1TB2GRGvliMKf4vHnxQFyZsK",
    "price_1TB2GRGvliMKf4vHxHlZkGYq", "price_1TB2GQGvliMKf4vHdZks6lZJ",
    "price_1TB2GQGvliMKf4vHAVchR1Cm", "price_1TB2GQGvliMKf4vH7tygBn7i",
    "price_1TB2GPGvliMKf4vH2RCEtdTt", "price_1TB2GPGvliMKf4vHdzi3hkjz",
    "price_1TB2GPGvliMKf4vH6giuTnP1",
  ],
  successPath: "/checkout/success",
  isTest: false,
};

const TEST_CONFIG: StripeConfig = {
  creditPrices: {
    "5":   { priceId: "price_1TB5mcGrWtXaPVP2yprNf1Dc", amountCents: 500 },
    "20":  { priceId: "price_1TB5mdGrWtXaPVP27CpU4GmL", amountCents: 2000 },
    "100": { priceId: "price_1TB5mdGrWtXaPVP2meaoJHoB", amountCents: 10000 },
  },
  meteredPriceIds: [
    "price_1TB5mXGrWtXaPVP2NPPOjcTg", "price_1TB5mXGrWtXaPVP2RTB7hea2",
    "price_1TB5mXGrWtXaPVP2LEjzrAfa", "price_1TB5mXGrWtXaPVP2kaZ22OYR",
    "price_1TB5mYGrWtXaPVP2N3PXmsgw", "price_1TB5mYGrWtXaPVP2zuvasZl3",
    "price_1TB5mYGrWtXaPVP25gAEfJMO", "price_1TB5mZGrWtXaPVP2n1zmjJ3D",
    "price_1TB5mZGrWtXaPVP20LRVKb9T", "price_1TB5mZGrWtXaPVP2nMAiR97D",
    "price_1TB5maGrWtXaPVP2VDG9PISl", "price_1TB5maGrWtXaPVP2fnmKho3a",
    "price_1TB5maGrWtXaPVP2LV2bNoXr", "price_1TB5mbGrWtXaPVP2WDgHi0Mx",
    "price_1TB5mbGrWtXaPVP2hGAxYn7O", "price_1TB5mbGrWtXaPVP23tIhL7qZ",
    "price_1TB5mcGrWtXaPVP2c418Tlf2",
  ],
  successPath: "/checkout/test/success",
  isTest: true,
};

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_TEST_KEY: string;
  API_KEYS: KVNamespace;
}

async function stripeApi(key: string, path: string, params?: Record<string, string>) {
  const opts: RequestInit = {
    headers: { Authorization: `Basic ${btoa(key + ":")}` },
  };
  if (params) {
    opts.method = "POST";
    opts.body = new URLSearchParams(params);
  }
  const res = await fetch(`https://api.stripe.com${path}`, opts);
  return res.json() as Promise<any>;
}

function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return "sk_camel_" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function handleCheckout(request: Request, stripeKey: string, config: StripeConfig): Promise<Response> {
  const url = new URL(request.url);
  const amount = url.searchParams.get("amount") || "5";
  const tier = config.creditPrices[amount];
  if (!tier) {
    return Response.json({ error: "Invalid amount. Choose 5, 20, or 100." }, { status: 400 });
  }

  const params: Record<string, string> = {
    "mode": "payment",
    "success_url": `https://camelai.io${config.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    "cancel_url": "https://camelai.io",
    "line_items[0][price]": tier.priceId,
    "line_items[0][quantity]": "1",
    "payment_intent_data[metadata][credit_amount]": String(tier.amountCents),
  };

  const email = url.searchParams.get("email");
  if (email) params["customer_email"] = email;

  const session = await stripeApi(stripeKey, "/v1/checkout/sessions", params);
  if (session.error) {
    return Response.json({ error: session.error.message }, { status: 400 });
  }

  return Response.redirect(session.url, 303);
}

async function handleCheckoutSuccess(request: Request, env: Env, stripeKey: string, config: StripeConfig): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await stripeApi(stripeKey, `/v1/checkout/sessions/${sessionId}`);
  if (session.error || session.payment_status !== "paid") {
    return Response.json({ error: "Payment not completed" }, { status: 400 });
  }

  const customerId = session.customer as string;
  let amount = parseInt(session.metadata?.credit_amount || "0", 10);
  if (!amount && session.payment_intent) {
    const pi = await stripeApi(stripeKey, `/v1/payment_intents/${session.payment_intent}`);
    amount = parseInt(pi.metadata?.credit_amount || "0", 10) || pi.amount || 0;
  }

  // Idempotency
  const provisionedKey = `provisioned:${sessionId}`;
  const existing = await env.API_KEYS.get(provisionedKey);
  if (existing) {
    const prev = JSON.parse(existing);
    return renderSuccessPage(prev.apiKey, prev.credits, config.isTest);
  }

  // Create subscription if customer doesn't have one
  const subs = await stripeApi(stripeKey, `/v1/subscriptions?customer=${customerId}&limit=1`);
  if (!subs.data || subs.data.length === 0) {
    const subParams: Record<string, string> = { customer: customerId };
    config.meteredPriceIds.forEach((priceId, i) => {
      subParams[`items[${i}][price]`] = priceId;
    });
    await stripeApi(stripeKey, "/v1/subscriptions", subParams);
  }

  // Create credit grant
  await stripeApi(stripeKey, "/v1/billing/credit_grants", {
    name: `$${amount / 100} API Credits${config.isTest ? " (TEST)" : ""}`,
    customer: customerId,
    "amount[type]": "monetary",
    "amount[monetary][value]": String(amount),
    "amount[monetary][currency]": "usd",
    category: "paid",
    "applicability_config[scope][price_type]": "metered",
  });

  // Generate API key and store in KV
  const apiKey = generateApiKey();
  await env.API_KEYS.put(apiKey, JSON.stringify({
    userId: customerId,
    stripeCustomerId: customerId,
    email: session.customer_details?.email || "",
    name: session.customer_details?.name || "",
    active: true,
    createdAt: new Date().toISOString(),
  }));

  const credits = `$${(amount / 100).toFixed(2)}`;
  await env.API_KEYS.put(provisionedKey, JSON.stringify({ apiKey, credits }), { expirationTtl: 86400 });

  return renderSuccessPage(apiKey, credits, config.isTest);
}

function renderSuccessPage(apiKey: string, credits: string, isTest: boolean): Response {
  const banner = isTest
    ? `<div style="background:#f59e0b;color:#1a1a2e;padding:8px;text-align:center;font-weight:bold;border-radius:8px;margin-bottom:16px;">TEST MODE — no real charges. Use card 4242 4242 4242 4242, any future expiry, any CVC.</div>`
    : "";
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>camelai.io — API Key Ready</title>
<style>
  body { max-width: 600px; margin: 80px auto; padding: 0 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #1a1a2e; background: #fafafa; line-height: 1.6; text-align: center; }
  h1 { color: #16213e; }
  .key-box { background: #1a1a2e; color: #4ade80; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 14px; word-break: break-all; margin: 20px 0; cursor: pointer; }
  .key-box:hover { background: #16213e; }
  .info { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: left; }
  code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
  a { color: #0f3460; }
</style></head>
<body>
  ${banner}
  <h1>Your API Key is Ready</h1>
  <p>Credits: <strong>${credits}</strong></p>
  <div class="key-box" onclick="navigator.clipboard.writeText('${apiKey}').then(()=>this.textContent='Copied!')">${apiKey}</div>
  <p style="font-size: 13px; color: #666;">Click the key to copy</p>
  <div class="info">
    <p><strong>Usage:</strong></p>
    <p><code>curl -X POST -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"input": "..."}' https://qr.camelai.io</code></p>
    <p>Works on all <a href="/">camelai.io services</a>. No crypto wallet needed.</p>
  </div>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // Test checkout (Stripe test mode)
    if (url.pathname === "/checkout/test") {
      return handleCheckout(request, env.STRIPE_TEST_KEY, TEST_CONFIG);
    }
    if (url.pathname === "/checkout/test/success") {
      return handleCheckoutSuccess(request, env, env.STRIPE_TEST_KEY, TEST_CONFIG);
    }

    // Live checkout
    if (url.pathname === "/checkout") {
      return handleCheckout(request, env.STRIPE_SECRET_KEY, LIVE_CONFIG);
    }
    if (url.pathname === "/checkout/success") {
      return handleCheckoutSuccess(request, env, env.STRIPE_SECRET_KEY, LIVE_CONFIG);
    }

    // Top up existing API key
    if (url.pathname === "/checkout/topup") {
      const apiKey = url.searchParams.get("key");
      if (!apiKey) return Response.json({ error: "Missing key param" }, { status: 400 });
      const raw = await env.API_KEYS.get(apiKey);
      if (!raw) return Response.json({ error: "Invalid API key" }, { status: 401 });
      const keyData = JSON.parse(raw);
      const isTest = url.searchParams.get("test") === "1";
      const config = isTest ? TEST_CONFIG : LIVE_CONFIG;
      const stripeKey = isTest ? env.STRIPE_TEST_KEY : env.STRIPE_SECRET_KEY;
      const amount = url.searchParams.get("amount") || "5";
      const tier = config.creditPrices[amount];
      if (!tier) return Response.json({ error: "Invalid amount" }, { status: 400 });
      const params: Record<string, string> = {
        "mode": "payment",
        "customer": keyData.stripeCustomerId,
        "success_url": `https://camelai.io/checkout/topup/success?session_id={CHECKOUT_SESSION_ID}&key=${apiKey}${isTest ? "&test=1" : ""}`,
        "cancel_url": "https://camelai.io",
        "line_items[0][price]": tier.priceId,
        "line_items[0][quantity]": "1",
        "payment_intent_data[metadata][credit_amount]": String(tier.amountCents),
      };
      const session = await stripeApi(stripeKey, "/v1/checkout/sessions", params);
      if (session.error) return Response.json({ error: session.error.message }, { status: 400 });
      return Response.redirect(session.url, 303);
    }
    if (url.pathname === "/checkout/topup/success") {
      const sessionId = url.searchParams.get("session_id");
      const apiKey = url.searchParams.get("key");
      const isTest = url.searchParams.get("test") === "1";
      if (!sessionId || !apiKey) return Response.json({ error: "Missing params" }, { status: 400 });
      const stripeKey = isTest ? env.STRIPE_TEST_KEY : env.STRIPE_SECRET_KEY;
      const config = isTest ? TEST_CONFIG : LIVE_CONFIG;
      const session = await stripeApi(stripeKey, `/v1/checkout/sessions/${sessionId}`);
      if (session.error || session.payment_status !== "paid") {
        return Response.json({ error: "Payment not completed" }, { status: 400 });
      }
      // Idempotency
      const provKey = `provisioned:${sessionId}`;
      const prev = await env.API_KEYS.get(provKey);
      if (prev) {
        const p = JSON.parse(prev);
        return renderSuccessPage(apiKey, p.credits, isTest);
      }
      let amount = 0;
      if (session.payment_intent) {
        const pi = await stripeApi(stripeKey, `/v1/payment_intents/${session.payment_intent}`);
        amount = parseInt(pi.metadata?.credit_amount || "0", 10) || pi.amount || 0;
      }
      // Create credit grant for existing customer
      await stripeApi(stripeKey, "/v1/billing/credit_grants", {
        name: `$${amount / 100} Top-Up${isTest ? " (TEST)" : ""}`,
        customer: session.customer,
        "amount[type]": "monetary",
        "amount[monetary][value]": String(amount),
        "amount[monetary][currency]": "usd",
        category: "paid",
        "applicability_config[scope][price_type]": "metered",
      });
      // Invalidate balance cache
      await env.API_KEYS.delete(`balance:${session.customer}`);
      const credits = `$${(amount / 100).toFixed(2)}`;
      await env.API_KEYS.put(provKey, JSON.stringify({ apiKey, credits }), { expirationTtl: 86400 });
      return renderSuccessPage(apiKey, `${credits} added`, isTest);
    }

    // Services JSON
    if (url.pathname === "/.well-known/services.json") {
      return new Response(SERVICES_JSON, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Markdown
    if (url.searchParams.get("format") === "markdown" || prefersMarkdown(request)) {
      return new Response(MARKDOWN, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // HTML
    return new Response(HTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
