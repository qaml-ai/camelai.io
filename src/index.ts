const MARKDOWN = `# camelai.io — x402 API Network

Pay-per-request APIs for AI agents. USDC micropayments on Base, Polygon, or Solana via [x402](https://x402.org) — or buy credits with a credit card via Stripe.

## Services

Each service has its own docs at its domain. Visit any service URL for full API details.

| Service | Domain | Price |
|---------|--------|-------|
| QR Code | [qr.camelai.io](https://qr.camelai.io) | $0.001 |
| Screenshot | [screenshot.camelai.io](https://screenshot.camelai.io) | $0.01 |
| Email Verify | [verify.camelai.io](https://verify.camelai.io) | $0.005 |
| DNS Lookup | [dns.camelai.io](https://dns.camelai.io) | $0.001 |
| Web Scraper | [scraper.camelai.io](https://scraper.camelai.io) | $0.005 |
| Geocoding | [geo.camelai.io](https://geo.camelai.io) | $0.001 |
| Image Resize | [resize.camelai.io](https://resize.camelai.io) | $0.001 |
| URL Shortener | [link.camelai.io](https://link.camelai.io) | $0.001 |
| Image Gen | [imagegen.camelai.io](https://imagegen.camelai.io) | $0.01 |
| Disposable Email | [inbox.camelai.io](https://inbox.camelai.io) | $0.005 |
| SMS Send | [sms.camelai.io](https://sms.camelai.io) | $0.01 |
| PDF to Text | [pdf.camelai.io](https://pdf.camelai.io) | $0.01 |
| GPU | [gpu.camelai.io](https://gpu.camelai.io) | $0.50 |
| VPS / Sandbox | [vps.camelai.io](https://vps.camelai.io) | $0.005–$0.129 |
| Browser Session | [browser.camelai.io](https://browser.camelai.io) | $0.02 |
| Deploy Worker | [deploy.camelai.io](https://deploy.camelai.io) | $0.01 |
| File Upload | [files.camelai.io](https://files.camelai.io) | $0.001 |

## How It Works

1. \`POST\` to any service with the required JSON fields
2. Receive a \`402 Payment Required\` response with payment details
3. Sign a USDC payment using your wallet
4. Resend the request with the payment header
5. Get your result

## Quick Start (Node.js — recommended)

### 1. Create a wallet

\`\`\`js
// npm install viem
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);
console.log("Address:", account.address);   // Fund this with USDC on Base
console.log("Private Key:", privateKey);     // Save this securely
\`\`\`

Fund the address with USDC on Base using the [Base app](https://apps.apple.com/app/base-web3-wallet/id1278383455) or any wallet. $5–$10 is plenty.

### 2. Make requests

\`\`\`js
// npm install @x402/fetch @x402/evm viem
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const pay = wrapFetchWithPayment(fetch, client);

const res = await pay("https://qr.camelai.io", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "https://example.com" }),
});
\`\`\`

### Shell alternative: purl

[purl](https://github.com/stripe/purl) is a curl-like CLI with built-in x402 support. Import the wallet you created above:

\`\`\`bash
# Install (pick one)
brew install stripe/purl/purl   # macOS
cargo install purl               # or via Rust

# Import the wallet you created above
purl wallet add --type evm --name my-agent --private-key $WALLET_PRIVATE_KEY --password mypass --set-active=true

# Make requests
purl --password mypass -X POST -d '{"text": "https://example.com"}' https://qr.camelai.io
\`\`\`

## Payment Options

**x402 (USDC)** — sign a micropayment per request. Works on Base, Polygon, or Solana. No account needed.

**Stripe (Credit Card)** — [buy credits](https://camelai.io/checkout?amount=5) ($5 / $20 / $100), get an API key, add \`Authorization: Bearer <key>\` to requests.

## Details

- **Networks:** Base, Polygon, Solana — all USDC
- **Facilitator:** Coinbase CDP (fee-free)
- **OpenAPI:** Each service exposes \`/.well-known/openapi.json\`
- **Service Index:** [/.well-known/services.json](https://camelai.io/.well-known/services.json)

Built by [camelAI](https://github.com/qaml-ai)
`;

// No HTML version — always serve markdown

const SERVICES = [
  { name: "QR Code", domain: "qr.camelai.io", price: "$0.001", description: "Generate QR codes from text (SVG)", example: '{"text": "https://example.com"}' },
  { name: "Screenshot", domain: "screenshot.camelai.io", price: "$0.01", description: "Capture website screenshots (PNG/PDF)", example: '{"url": "https://example.com", "format": "png"}' },
  { name: "Email Verify", domain: "verify.camelai.io", price: "$0.005", description: "Validate email addresses", example: '{"email": "user@example.com"}' },
  { name: "DNS Lookup", domain: "dns.camelai.io", price: "$0.001", description: "DNS records and WHOIS data", example: '{"input": "DNS records for example.com"}' },
  { name: "Web Scraper", domain: "scraper.camelai.io", price: "$0.005", description: "Extract content from web pages", example: '{"input": "scrape https://example.com"}' },
  { name: "Geocoding", domain: "geo.camelai.io", price: "$0.001", description: "Address to coordinates and reverse", example: '{"input": "coordinates for 1600 Amphitheatre Parkway"}' },
  { name: "Image Resize", domain: "resize.camelai.io", price: "$0.001", description: "Resize images by URL", example: '{"input": "resize https://example.com/photo.jpg to 200x200"}' },
  { name: "URL Shortener", domain: "link.camelai.io", price: "$0.001", description: "Shorten URLs", example: '{"url": "https://example.com/very/long/path"}' },
  { name: "Image Gen", domain: "imagegen.camelai.io", price: "$0.01", description: "Generate images from text prompts", example: '{"input": "a sunset over mountains in watercolor style"}' },
  { name: "Disposable Email", domain: "inbox.camelai.io", price: "$0.005", description: "Create temporary email inboxes. POST / to create, POST /check with inbox_id to read.", example: "POST / (no body) to create, POST /check with {\"inbox_id\": \"...\"}" },
  { name: "SMS Send", domain: "sms.camelai.io", price: "$0.01", description: "Send SMS messages", example: '{"to": "+15551234567", "message": "Hello"}' },
  { name: "PDF to Text", domain: "pdf.camelai.io", price: "$0.01", description: "Extract text from PDFs", example: '{"url": "https://example.com/doc.pdf"}' },
  { name: "GPU", domain: "gpu.camelai.io", price: "$0.50", description: "Provision GPU instances", example: '{"input": "spin up an A100 with pytorch image"}' },
  { name: "VPS", domain: "vps.camelai.io", price: "$0.005–$0.129", description: "Time-boxed Ubuntu sandboxes with exec, file ops, git, code execution, and port exposure. Priced at Cloudflare cost.", example: "POST /basic-30 to create, then POST /exec/:id, /file/:id, /git/:id, /expose/:id" },
  { name: "Browser Session", domain: "browser.camelai.io", price: "$0.02", description: "Headless browser automation. POST /session for CDP websocket. POST / for natural language actions.", example: "POST /session for ws_endpoint, POST / with {\"input\": \"navigate to https://example.com\"}" },
  { name: "Deploy Worker", domain: "deploy.camelai.io", price: "$0.01", description: "Deploy Cloudflare Workers", example: '{"input": "deploy this worker that returns hello world"}' },
  { name: "File Upload", domain: "files.camelai.io", price: "$0.001", description: "Upload files and get temporary signed URLs (1hr).", example: "POST raw file body with Content-Type header" },
];

const SERVICES_JSON = JSON.stringify({
  name: "camelai.io",
  description: "Pay-per-request APIs for AI agents via x402 micropayments on Base",
  protocol: "x402",
  networks: ["eip155:8453", "eip155:137", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"],
  currency: "USDC",
  services: SERVICES.map(s => ({ ...s, url: `https://${s.domain}`, openapi: `https://${s.domain}/.well-known/openapi.json` })),
}, null, 2);

// Markdown is always served

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
    <p>Works on all <a href="/">camelai.io services</a>. No wallet needed.</p>
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

    // Always serve markdown
    return new Response(MARKDOWN, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
