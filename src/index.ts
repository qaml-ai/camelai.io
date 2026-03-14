const MARKDOWN = `# camelai.io — x402 API Network

Pay-per-request APIs for AI agents. No API keys, no subscriptions — just USDC micropayments on Base via the [x402 protocol](https://x402.org).

## Services

| Service | Domain | Method | Price | Description |
|---------|--------|--------|-------|-------------|
| QR Code | [qr.camelai.io](https://qr.camelai.io) | GET /generate | $0.001 | Generate QR codes from text (SVG) |
| Screenshot | [screenshot.camelai.io](https://screenshot.camelai.io) | GET /screenshot | $0.005 | Capture website screenshots (PNG) |
| Email Verify | [verify.camelai.io](https://verify.camelai.io) | GET /verify | $0.001 | Validate email addresses |
| DNS Lookup | [dns.camelai.io](https://dns.camelai.io) | GET /dns, /whois | $0.001 | DNS records and WHOIS data |
| Web Scraper | [scraper.camelai.io](https://scraper.camelai.io) | GET /scrape | $0.005 | Extract content from web pages |
| Geocoding | [geo.camelai.io](https://geo.camelai.io) | GET /geocode, /reverse | $0.001 | Address to coordinates and reverse |
| Image Resize | [resize.camelai.io](https://resize.camelai.io) | GET /resize | $0.001 | Resize images by URL |
| URL Shortener | [link.camelai.io](https://link.camelai.io) | POST /shorten | $0.001 | Shorten URLs |
| Image Gen | [imagegen.camelai.io](https://imagegen.camelai.io) | POST /generate | $0.01 | Generate images from text prompts |
| Disposable Email | [inbox.camelai.io](https://inbox.camelai.io) | POST /inbox | $0.001 | Create temporary email inboxes |
| SMS Send | [sms.camelai.io](https://sms.camelai.io) | POST /send | $0.01 | Send SMS messages |
| PDF to Text | [pdf.camelai.io](https://pdf.camelai.io) | POST /extract | $0.005 | Extract text from PDFs |
| GPU | [gpu.camelai.io](https://gpu.camelai.io) | POST /create | $0.50 | Provision GPU instances |
| VPS | [vps.camelai.io](https://vps.camelai.io) | POST /create | $0.10 | Provision virtual servers |
| Browser Session | [browser.camelai.io](https://browser.camelai.io) | POST /session | $0.01 | Remote browser sessions |
| Deploy Worker | [deploy.camelai.io](https://deploy.camelai.io) | POST /deploy | $0.01 | Deploy Cloudflare Workers |

## How It Works

1. Make a request to any endpoint above
2. Receive a \`402 Payment Required\` response with payment details
3. Sign a USDC payment on Base using your wallet
4. Resend the request with the \`payment-signature\` header
5. Get your response

## Quick Start (Node.js)

\`\`\`js
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(YOUR_PRIVATE_KEY);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const pay = wrapFetchWithPayment(fetch, client);

const res = await pay("https://qr.camelai.io/generate?text=hello");
\`\`\`

## Quick Start (purl CLI)

\`\`\`bash
purl "https://qr.camelai.io/generate?text=hello"
\`\`\`

## Details

- **Network:** Base (Chain ID 8453)
- **Currency:** USDC
- **Facilitator:** Coinbase CDP (fee-free, KYT/OFAC compliant)
- **OpenAPI:** Each service exposes \`/.well-known/openapi.json\`
- **Bazaar:** All services are discoverable via the [CDP Bazaar](https://docs.cdp.coinbase.com/x402/bazaar)

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

export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    if (url.searchParams.get("format") === "markdown" || prefersMarkdown(request)) {
      return new Response(MARKDOWN, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
    return new Response(HTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
